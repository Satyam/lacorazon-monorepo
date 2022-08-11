import express, {
  Request,
  Response,
  NextFunction,
  Handler,
  Application,
} from 'express';

import { statSync, promises } from 'fs';
const { readdir, readFile, access } = promises;
import { parse } from 'node-html-parser-hyperscript';
import { marked } from 'marked';
import { join, normalize, dirname } from 'path';

const routesDir = join(process.cwd(), 'routes');

type Template = { html: string; path: string; fm?: Record<string, any> };

const cache: {
  page: Record<string, Template>;
  partial: Record<string, Template>;
} = { page: {}, partial: {} };

const reNoLayout = /(?<!\\){[ \t]*nolayout[ \t]*}/;
const reExtendsTag = /(?<!\\){[ \t]*\^[ \t]*([\w\-\/]+)[ \t]*}/;
const reSlotTag = /(?<!\\){[ \t]*slot[ \t]*}/;
const rePartialTag = /(?<!\\){[ \t]*>[ \t]*([\w\-\/\.]+)[ \t]*}/g;
const reFrontMatterBlock = /^[\n]*---[ \t]*\n([\s\S]*?)\n---[ \t]*\n/;
const reFrontMatterLines = /^\$?[a-zA-Z_][\w]*[ \t]*:(?:[\S]| |\t|\n  )+/gm;
const reFrontMatterKeyVal = /^\$?([a-zA-Z_][\w]*)[ \t]*:[ \t]*([\s\S]+)/;
const reTjsBlock =
  /(?<!\\)\{[ \t]*(([@!?]?)[ \t]*(.+?))[ \t]*\}(([\s\S]+?)(\{[ \t]*:[ \t]*\3[ \t]*\}([\s\S]+?))?)\{[ \t]*\/\1[ \t]*\}/g;
const reTjsVal = /(?<!\\)\{[ \t]*([=%])[ \t]*(.+?)[ \t]*\}/g;
const reValidPages = /([\w\-\/. ]+)\.(html|md)/;
const reServerScript = /<script\s+server\s*>([\s\S]+?)<\/script\s*>/m;

declare global {
  namespace Express {
    interface Request {
      headers: any;
      isHtmx: boolean;
    }
    interface Response {
      trigger: (eventName: string) => Response;
      partial(route: string, vars: unknown): void;
      showError(
        header: string,
        message: string,
        color?: 'info' | 'warning' | 'danger',
        title?: string
      ): void;
      expressRedirect(url: string): void;
      expressRedirect(status: number, url: string): void;
      expressRedirect(url: string, status: number): void;
      expressRender(
        view: string,
        vars?: object,
        callback?: (err: Error, html: string) => void
      ): void;
      expressRender(
        view: string,
        callback?: (err: Error, html: string) => void
      ): void;
      render(view: string, vars?: object, swapIds?: string[]): void;
      retarget(path: string, opts: object, target: string): void;
      invalidateCache(...urls: string[]): void;
    }
  }
}

export const saneMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Require >= Node 16
  const nodeVersion = Number(process.versions.node.split('.')[0]);
  if (nodeVersion < 16) {
    console.error(
      `Node 16 or higher is required. (Detected: Node v${process.versions.node})`
    );
    process.exit();
  }

  res.expressRender = res.render;

  res.render = async (
    route: string,
    vars?: object | ((err: Error, html: string) => void),
    swapIds?: string[] | ((err: Error, html: string) => void)
  ) => {
    if (typeof vars === 'function') {
      return res.expressRender(route, vars);
    }
    if (typeof swapIds === 'function') {
      return res.expressRender(route, vars, swapIds);
    }
    // Build cache if not already set (null means we've cached this route as a 404)
    let template: Template | undefined = cache.page[route];
    if (!template) {
      template = await buildTemplate(route, false);
      if (template) cache.page[route] = template;
    }
    if (!template) return next();

    // Populate template vars
    const fmAndVars = { route, ...template.fm, ...vars };
    let html = processVars(template.html, fmAndVars);

    // Strip \ char for escaped blocks and vals.
    html = html.replaceAll('\\{', '{');
    html = html.replaceAll(/ \\server/gm, ' server');

    // Convert template response to HTMX out-of-band swaps?
    if (swapIds && req.isHtmx) {
      const triggerId = req.headers['hx-trigger'] as string;
      html = processSwapIds(html, swapIds, triggerId);
    }

    // Render template.
    res.send(html);
  };

  res.partial = async (route: string, vars: object) => {
    // Build cache if not already set (null means we've cached this route as a 404)
    let template: Template | undefined = cache.partial[route];
    if (!template) {
      template = await buildTemplate(route, true);
      if (template) cache.partial[route] = template;
    }
    if (!template) return next();

    // Populate template vars
    let html = vars ? processVars(template.html, vars) : template.html;

    // Strip \ char for escaped blocks and vals.
    html = html.replaceAll('\\{', '{');
    html = html.replaceAll(/ \\server/gm, ' server');

    // Render template.
    res.send(html);
  };

  res.trigger = (eventName: string) => {
    // Set an HTMX trigger header to trigger event on client.
    res.set('HX-Trigger', eventName);
    return res;
  };

  res.showError = (
    header: string,
    message: string,
    color: 'info' | 'warning' | 'danger' = 'info',
    title?: string
  ) => {
    res.set('HX-Retarget', 'error');
    res.render('_/error', {
      color,
      textColor: color === 'danger' ? 'text-white' : 'text-dark',
      header,
      title,
      message,
    });
  };

  // Render a view into a specified element. Defaults to <body> tag (similar to hx-boosted)
  res.retarget = (path, opts = {}, target = 'body') => {
    // The URI to push into history stack must be absolute: /foo/bar
    const normalized = normalize(path);
    const uri = normalized.startsWith('/') ? path : '/' + path;
    res.set('HX-Retarget', target);
    res.set('HX-Push', uri);
    res.render(path, opts);
  };

  res.expressRedirect = res.redirect;

  res.redirect = (url: string | number, status?: string | number) => {
    if (typeof url === 'string') {
      const route = formatSlashes(url);
      if (req.headers['hx-request']) {
        res.set('HX-Redirect', route);
        res.end();
      } else {
        res.expressRedirect(route, status as number);
      }
    } else {
      res.expressRedirect(url as number, status as string);
    }
  };

  res.invalidateCache = (...urls: string[]) => {
    res.header('HX-Trigger', JSON.stringify({ invalidateCache: urls }));
  };

  req.isHtmx = Boolean(req.headers['hx-request']);

  next();
};

/* ============================================= */

async function buildTemplate(route: string, isPartial: boolean) {
  let template = await loadTemplate(route); // Sets { html, path }
  if (!template) return undefined;

  // Process front-matter.
  template = await processFrontMatter(template); // Sets { fm }

  // Process Markdown.
  template = processMarkdown(template); // If template is markdown, parse to html

  if (!isPartial) {
    // Process extends tags.
    template = await processExtends(template);

    // Process layout.
    template = await processLayout(template);

    // Process partials.
    template = await processPartials(template);
  }
  return template;
}

async function loadTemplate(route: string): Promise<void | Template> {
  const reServerBlock = /<script[\s]server>([\s\S]+?)<\/script>/m;
  const routePath = join(routesDir, route);
  for (let possiblePathSuffix of ['.html', '.md', 'index.html', 'index.md']) {
    try {
      const path = routePath + possiblePathSuffix;
      const htmlWithServerBlock = await readFile(path, 'utf-8');
      const html = htmlWithServerBlock.replace(reServerBlock, '');
      return { html, path };
    } catch (err) {} // Eat the error and try next possiblePathSuffix.
  }
  return undefined;
}

function processFrontMatter(template: Template): Template {
  const fmBlockMatch = template.html.match(reFrontMatterBlock);
  if (!fmBlockMatch) return template;
  const fmBlock = fmBlockMatch[0];
  const fmLines = fmBlockMatch[1].match(reFrontMatterLines) ?? [];
  const newFm: Record<string, any> = {};
  for (const line of fmLines) {
    const [_, key, val] = line.match(reFrontMatterKeyVal) ?? [];
    if (key) {
      const joinedVal = val.replace(/\n  [ \t]*/g, ' '); // Remove line breaks in val
      const normalizedVal = normalizeVal(joinedVal);
      newFm[key] = normalizedVal;
    }
  }
  function normalizeVal(val: string) {
    if (val === 'false') return false;
    if (val === 'true') return true;
    if (val === 'null') return null;
    if (val === 'undefined') return undefined;
    if (!isNaN(Number(val))) return Number(val);
    return val;
  }
  const currentFm = template.fm || {};
  template.fm = { ...currentFm, ...newFm };
  template.html = template.html.replace(fmBlock, '').trim();
  return template;
}

function processMarkdown(template: Template): Template {
  if (!template.path.endsWith('.md')) return template;
  template.html = marked.parse(template.html);
  return template;
}

async function processExtends(template: Template): Promise<Template> {
  // Look for tags like {^ some-template }
  const reExtendsTagMatch = template.html.match(reExtendsTag);
  if (!reExtendsTagMatch) return template;

  const extendsTag = reExtendsTagMatch[0];
  const wrapperRoute = reExtendsTagMatch[1];

  // Remove this extends tag from  template.html)
  template.html = template.html.replace(extendsTag, '');

  // Wrap template with extends template (and merge front-matter).
  template = await wrapIntoSlot(template, wrapperRoute);

  // Recurse until no more extends tags are found.
  return processExtends(template);
}

async function wrapIntoSlot(
  template: Template,
  wrapperRoute: string
): Promise<Template> {
  let wrapper = await loadTemplate(wrapperRoute);
  if (!wrapper) return template;
  wrapper = processFrontMatter(wrapper);
  wrapper = processMarkdown(wrapper);
  const wrapperHtmlParts = wrapper.html.split(reSlotTag);
  if (wrapperHtmlParts?.length < 2)
    throw Error(`No slot tag found in ${wrapper.path}`);
  template.fm = { ...wrapper.fm, ...template.fm };
  template.html = [
    wrapperHtmlParts[0],
    template.html,
    wrapperHtmlParts[1],
  ].join('');
  return template;
}

async function processLayout(template: Template): Promise<Template> {
  // Template has a nolayout tag?
  const hasNoLayoutTag = reNoLayout.test(template.html);
  if (hasNoLayoutTag) {
    template.html = template.html.replace(reNoLayout, '');
    return template;
  }
  const layoutRoute = await findLayoutRoute(template.path);
  if (layoutRoute) template = await wrapIntoSlot(template, layoutRoute);
  return template;
}

async function findLayoutRoute(path: string): Promise<false | string> {
  const parentDir = dirname(path);
  const pathToLayout = join(parentDir, '_layout.html');
  try {
    await access(pathToLayout);
    // Return only the route without the abs path to routesDir or extension.
    return pathToLayout.replace(routesDir, '').replace(/\.[^/.]+$/, '');
  } catch (error) {}
  const reachedTop =
    normalize(parentDir) === normalize(routesDir) ||
    normalize(parentDir) === '/';
  return reachedTop ? false : await findLayoutRoute(join(pathToLayout, '..'));
}

async function processPartials(template: Template): Promise<Template> {
  const partialTags = [...template.html.matchAll(rePartialTag)];
  for (const tag of partialTags) {
    const partialTag = tag[0];
    const partialRoute = tag[1];
    let partialTemplate = await loadTemplate(partialRoute);
    if (!partialTemplate)
      throw new Error(`Failed to process partial tag: ${partialTag}`);
    partialTemplate = processFrontMatter(partialTemplate);
    partialTemplate = processMarkdown(partialTemplate);
    const currentFm = template.fm || {};
    template.fm = { ...currentFm, ...partialTemplate.fm };
    template.html = template.html.replace(partialTag, partialTemplate.html);
  }
  return template;
}

function processVars(html: string, vars: object): string {
  // This is a customized version of t.js -> https://github.com/jasonmoo/t.js
  return (
    html
      .replace(
        reTjsBlock,
        (_, __, meta, key, inner, ifTrue, hasElse, ifFalse) => {
          let val = getValue(vars, key);
          if (!val) {
            // Handle if not.
            if (meta === '!') {
              return processVars(inner, vars);
            }

            // check for else
            if (hasElse) {
              return processVars(ifFalse, vars);
            }
            return '';
          }
          // Handle regular if.
          if (meta === '?') {
            return processVars(ifTrue, vars);
          }

          // Process array/obj iteration/
          if (meta === '@') {
            return (val as any[])
              .map((item, index: number) =>
                processVars(inner, { ...vars, item, index })
              )
              .join('');
          }
          return '';
        }
      )
      // Swap out variables.
      .replace(reTjsVal, (_: string, meta: string, key: string) => {
        var val = getValue(vars, key);
        if (val || val === 0) {
          return meta === '=' ? scrub(val) : val;
        }
        return '';
      })
  );

  function scrub(val: string | object): string {
    val = typeof val === 'string' ? val : JSON.stringify(val);
    return val
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getValue(vars: object, key: string) {
    return key.split('.').reduce<any>((acc, part) => {
      if (typeof acc === 'object' && part in acc) return acc[part];
      return undefined;
    }, vars);
  }
}

function processSwapIds(html: string, swapIds: string[], triggerId: string) {
  const swapIdsArray = [swapIds].flat(); // Convert single string to array.
  const oobSwapElements: string[] = []; // oob is HTMX "out of band" https://htmx.org/docs
  const dom = parse(html);

  // Is the element that triggered this event also being swapped?
  const triggerIndex = swapIdsArray.indexOf(triggerId);
  const includePrimaryResponse = triggerIndex !== -1;
  if (includePrimaryResponse) swapIdsArray.splice(triggerIndex, 1);

  // Append elements specified by id to oobSwapElements.
  swapIdsArray.forEach((id) => {
    const el = dom.getElementById(id);
    if (!el) {
      console.error(
        `res.render failed: No DOM element with id="${id}" found in template.`
      );
      return;
    }
    el.setAttribute('hx-swap-oob', 'true');
    oobSwapElements.push(el.toString());
  });

  // Set the primary response for the swap that matches the trigger id instead of using OOB (this is how HTMX works).
  const primaryResponse = includePrimaryResponse
    ? dom.getElementById(triggerId)
    : null;
  const oobResponse = oobSwapElements.join('\n\n');
  return primaryResponse ? primaryResponse + '\n\n' + oobResponse : oobResponse;
}

function formatSlashes(route: string): string {
  // Always use leading slash, never use trailing slash.
  if (route === '/') return route;
  route = route.startsWith('/') ? route : '/' + route;
  route = route.endsWith('/') ? route.slice(0, -1) : route;
  return route;
}

function relativeRequire(path: string) {
  return require(path.startsWith('~/')
    ? path.replace('~', process.cwd())
    : path);
}

export async function loadRoutes(app: Application): Promise<void> {
  await continueLoadingRoutes(routesDir);
  async function continueLoadingRoutes(thisDir: string) {
    const files = await readdir(thisDir);

    for (const fileName of files) {
      // Ignore files starting with a double underscore.
      if (fileName.startsWith('__')) continue;
      // Set the full abs path to file.
      const absPath = join(thisDir, fileName);
      // Recurse into directories for nested routes.
      if (statSync(absPath).isDirectory()) {
        await continueLoadingRoutes(absPath);
        continue;
      }
      // Set the route endpoint for .html or .md files only.
      const matchRoute = absPath.match(reValidPages);
      if (!matchRoute || matchRoute.length < 2) continue;
      const route = matchRoute[1].replace(routesDir, '');
      // Read the file and look for <script server>
      const template = await readFile(absPath, 'utf-8');
      const matchScript = template.match(reServerScript);
      let serverBlock = matchScript && matchScript[1] + '\nreturn server';
      if (serverBlock) {
        // Parse the serverBlock, passing in refs to
        // * Express router `server`,
        // * Node `require`, and `self` route reference.
        try {
          const routeHandler = new Function(
            'server',
            'require',
            'self',
            serverBlock
          );
          useRoute(
            route,
            routeHandler(express.Router(), relativeRequire, route),
            absPath,
            app
          );
        } catch (err) {
          console.error(
            `Unable to parse server block in: ${absPath}\n\n${
              (err as Error).stack
            }`
          );
        }
      }
    }
  }
}

const routes: Record<string, string> = {}; // Keep track so we can check for duplicates.

function useRoute(
  route: string,
  handler: Handler,
  absPath: string,
  app: Application
) {
  // Avoid adding duplicate route.
  if (routes[route]) {
    console.error(`Duplicate routes defined for ${route} in:
     - ${routes[route]} 
     - ${absPath}`);
    return;
  }
  app.use(route, handler);
  routes[route] = absPath;
  // Also add special route for index file?
  if (route.endsWith('/index')) {
    const indexRoute = route.slice(0, -5);
    app.use(indexRoute, handler);
    routes[route] = absPath;
  }
}
