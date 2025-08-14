/**
 * @module sane
 */
import { Request, Response, NextFunction, Application } from 'express';

import { statSync, promises } from 'fs';
const { readdir, readFile, access } = promises;
import { parse } from 'node-html-parser-hyperscript';
import { marked } from 'marked';
import { join, normalize, dirname } from 'path';

/**
 * Assumes pages are located in the `routes` folder under the current working directory.
 * It is reset when `loadRoutes` is called.
 */
let routesDir: string;

/**
 * HTML string representing the page.
 * It does not contain server scripts.
 * FrontMatter variables are parsed.
 * Markup is parsed into HTML.
 * It contains template tags to be resolved on request.
 * @typedef Template
 * @type object
 * @property {string} html - html string of the page with template tags
 * @property {string} path - fully resolved path to this page
 * @property {object} [fm] - parsed FrontMatter variables, if any.
 */
type Template = { html: string; path: string; fm?: Record<string, any> };

declare global {
  namespace Express {
    interface Request {
      headers: any;
      isHtmx: boolean;
    }
    interface Response {
      trigger(eventName: string, vals?: any): Response;
      partial(route: string, vars: unknown): void;
      showError<E extends object>(vals: E): void;
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
      invalidateCache(...urls: string[]): Response;
    }
  }
}

/**
 * Express middleware to extend the native `Request` and `Response` arguments
 * of an Express route handler with sanejs methods and properties
 * @param req {Request} Standard Express Request object
 * @param res {Response} Standard Express Response object
 * @param next {NextFunction} Standard Express next() function.
 */
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
  /**
   * Returns `true` of the request was originated from an HTMX method or attribute.
   */
  req.isHtmx = Boolean(req.headers['hx-request']);

  /**
   * Allows access to the original Express `res.render` method
   */
  res.expressRender = res.render;

  /**
   * Override of `res.render` that allows to access both the original and
   * the redefined `render` method.
   * If either the 2nd or 3rd param is a function, it calls the original one,
   * otherwise it calls the new one, with the following arguments.
   * It may render a full page or, if `swapIds` is provided and the request is an HTMX request
   * it will only send out-of-band updates.
   * @param {string} route - Route of the template relative to the `routes` directory
   * @param {object} [vars] - Object containing the values to be interpolated into the template
   * @param {string | string[]} [swapIds] - `id` attribute of elements to be swapped out-of-band
   */
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
    let template = await getTemplate(route, false);
    if (!template) return next();

    let html = processVars(template.html, { route, ...template.fm, ...vars })
      // Strip \ char for escaped blocks and vals.
      .replaceAll('\\{', '{')
      .replaceAll(/ \\server/gm, ' server');

    // Convert template response to HTMX out-of-band swaps?
    if (swapIds && req.isHtmx) {
      html = processSwapIds(html, swapIds, req.get('hx-trigger'));
    }

    // Render template.
    return res.send(html);
  };

  /**
   * Renders a *partial* ignoring layouts or sublayouts
   * @param {string} route - Route of the template relative to the `routes` directory
   * @param {object} [vars] - Object containing the values to be interpolated into the template
   */
  res.partial = async (route: string, vars?: object) => {
    let template = await getTemplate(route, true);
    if (!template) return next();

    // Populate template vars
    let html = (vars ? processVars(template.html, vars) : template.html)
      // Strip \ char for escaped blocks and vals.
      .replaceAll('\\{', '{')
      .replaceAll(/ \\server/gm, ' server');

    // Render template.
    return res.send(html);
  };

  /**
   * Sends an `HX-Trigger` header to the client, efectively triggering a client event.
   * @param {string} eventName - Name of the event to trigger
   * @param {any} [details] - Extra info available in the `evt.detail` property of `CustomEvent`
   * @returns {Response} Reference to the Response object to allow for chaining
   */
  res.trigger = (eventName: string, details?: any): Response =>
    // Set an HTMX trigger header to trigger event on client.
    res.set(
      'HX-Trigger',
      typeof details === undefined
        ? eventName
        : JSON.stringify({ [eventName]: details })
    );

  // Render a view into a specified element. Defaults to <body> tag (similar to hx-boosted)
  res.retarget = (path, opts = {}, target = 'body') => {
    return res
      .set({ 'HX-Retarget': target, 'HX-Push': normalizeRoute(path) })
      .render(path, opts);
  };

  /**
   * Sends a set of values to be displayed in a `<div id="error" style="display:none">` expected to be
   * present in the default layout, using the partial template at `_/error.html`.
   * The structure of the values sent is determined by the error template.
   */
  res.showError = <E extends object>(vals: E) =>
    res.retarget('_/error', vals, '#error');

  /**
   * Allows access to the original Expresss `res.redirect`
   */
  res.expressRedirect = res.redirect;

  /**
   * Override for the original Expresss `res.redirect`.
   * If the request comes from HTMX, it will send back an `HX-Redirect`
   * header with the corresponding route.
   * Otherwise, it simply calls the original res.redirect.
   * @param {string} url - URL or route to redirect to.
   * @param {string | number} status - Status for the benefit of the original redirect.
   * @returns {Response} Returns the same response, for chaining.
   */
  res.redirect = (url: string | number, status?: string | number) => {
    if (typeof url === 'string') {
      const route = normalizeRoute(url);
      if (req.isHtmx) {
        res.set('HX-Redirect', route).end();
      } else {
        res.expressRedirect(route, status as number);
      }
    } else {
      res.expressRedirect(url as number, status as string);
    }
    return res;
  };

  /**
   * Triggers a client-side CustomEvent telling HTMX to invalidate the
   * client-side cache entries for the given routes,
   * so that the client requests a refreshed version of them.
   * @param {string} routes - any number of routes to be invalidated.
   * @returns {Response} Returns the same response, for chaining.
   */
  res.invalidateCache = (...routes: string[]) =>
    res.trigger('invalidateCache', routes);

  next();
};

/* ============================================= */

/**
 * Cache of Templates of both pages and partials indexed by relative route
 * @property {object} cache
 * @property {object} cache.page - Templates of pages indexed by relative route
 * @property {object} cache.partial - Templates of partials indexed by relative route
 */
const cache: {
  page: Record<string, Template>;
  partial: Record<string, Template>;
} = { page: {}, partial: {} };

/**
 * Returns the Template corresponding to the given route or
 * `undefined` if not found.
 * It will first check if the template is cached,
 * otherwise it will build it on request and cache it for further requests.
 * If the template is not a partial,
 * it will have its layout, extensions and partials resolved
 * @param {string} route - The route of the template to be loaded
 * @param {boolean} isPartial - True if the route is a partial.
 * @returns {Promise<Template | undefined>} The template found or undefined
 */
async function getTemplate(
  route: string,
  isPartial: boolean
): Promise<Template | undefined> {
  route = normalizeRoute(route);
  const whichCache = isPartial ? cache.partial : cache.page;
  let template: Template | undefined = whichCache[route];
  if (!template) {
    template = await buildTemplate(route, isPartial);
    if (template) whichCache[route] = template;
  }
  if (!template) {
    console.error(`Template for ${route} [isPartial=${isPartial}] not found`);
  }
  return template;
}

/**
 * Loads and pre-processes as much as possible of the template at
 * the given route.
 * If the template is not a partial,
 * it will have its layout, extensions and partials resolved.
 * @param {string} route - Route of the template to be build
 * @param {boolean} isPartial - True if the route is a partial
 * @returns {Promise<Template | undefined>} The template found or undefined
 */
async function buildTemplate(
  route: string,
  isPartial: boolean
): Promise<Template | undefined> {
  const template = await loadTemplate(route); // Sets { html, path }
  if (!template) return undefined;

  // Process front-matter.
  processFrontMatter(template); // Sets { fm }

  // Process Markdown.
  await processMarkdown(template); // If template is markdown, parse to html

  if (!isPartial) {
    // Process extends tags.
    await processExtends(template);

    // Process layout.
    await processLayout(template);

    // Process partials.
    await processPartials(template);
  }
  return template;
}
/**
 * Keeps track of the actual absolute path to templates
 * and also ensures no duplicate routes
 */
const routes: Record<string, string> = {}; // Keep track so we can check for duplicates.

/**
 * RegExp to detect server-side scripts and extract its content.
 */
const reServerScript = /<script\s+server\s*>([\s\S]+?)<\/script\s*>/m;

/**
 * It will try to load the template at the specified route,
 * expanding the path with the usual extensions (`.html` or `.md`)
 * or looking for an `index` file.
 * It will strip out the server-side script block from the HTML.
 * @param {string} route - The route of the template to be loaded.
 * @returns {Promise<Template | undefined>} The template found or undefined
 */
async function loadTemplate(route: string): Promise<void | Template> {
  // First try with well-known routes:
  try {
    const path = routes[route];
    const htmlWithServerBlock = await readFile(path, 'utf-8');
    const html = htmlWithServerBlock.replace(reServerScript, '');
    return { html, path };
  } catch (err) {} // Eat the error and try to figure the route out
  const routePath = join(routesDir, route);
  for (let possiblePathSuffix of ['.html', '.md', 'index.html', 'index.md']) {
    try {
      const path = routePath + possiblePathSuffix;
      const htmlWithServerBlock = await readFile(path, 'utf-8');
      const html = htmlWithServerBlock.replace(reServerScript, '');
      return { html, path };
    } catch (err) {} // Eat the error and try next possiblePathSuffix.
  }
  return undefined;
}

/**
 * Regexp to extract the FrontMatter block out of the header
 */
const reFrontMatterBlock = /^[\n]*---[ \t]*\n([\s\S]*?)\n---[ \t]*\n/;

/**
 * RegExp to extract all lines from the FrontMatter block
 */
const reFrontMatterLines = /^\$?[a-zA-Z_][\w]*[ \t]*:(?:[\S]| |\t|\n  )+/gm;

/**
 * RegExp to parse name and value from individual FrontMatter lines
 */
const reFrontMatterKeyVal = /^\$?([a-zA-Z_][\w]*)[ \t]*:[ \t]*([\s\S]+)/;

/**
 * Reads the FrontMatter information at the top of the template
 * parses its values and stores it in `template.fm`.
 * It deletes it from `template.html`.
 * @param {Template} template - Template to be processed.
 */
function processFrontMatter(template: Template): void {
  function normalizeVal(val: string) {
    switch (val) {
      case 'false':
        return false;
      case 'true':
        return true;
      case 'null':
        return null;
      case 'undefined':
        return undefined;
      default:
        return !isNaN(Number(val)) ? Number(val) : val;
    }
  }
  const fmBlockMatch = template.html.match(reFrontMatterBlock);
  if (!fmBlockMatch) return;
  const fmBlock = fmBlockMatch[0];
  const fmLines = fmBlockMatch[1].match(reFrontMatterLines) ?? [];
  const newFm: Record<string, any> = {};
  for (const line of fmLines) {
    const [_, key, val] = line.match(reFrontMatterKeyVal) ?? [];
    if (key) {
      const joinedVal = val.replace(/\n  [ \t]*/g, ' '); // Remove line breaks in val
      newFm[key] = normalizeVal(joinedVal);
    }
  }
  template.fm = { ...template.fm, ...newFm };
  template.html = template.html.replace(fmBlock, '').trim();
}

/**
 * If the template contains Markdown, it converts it to HTML.
 * @param {Template} template - Template to be processed.
 */
async function processMarkdown(template: Template): Promise<void> {
  if (template.path.endsWith('.md')) {
    template.html = await marked.parse(template.html);
  }
}

/**
 * RegExp to parse the path out of a  `{^ path/from/routes }` template tag to extend a page with
 * a layout besides the implicit `__layout`
 */
const reExtendsTag = /(?<!\\){[ \t]*\^[ \t]*([\w\-\/]+)[ \t]*}/;
/**
 * Recursively looks for tags like {^ some-template }
 * and inserts the given template into the `{slot}`
 * in the extension.
 * @param {Template} template - Template to be processed.
 */
async function processExtends(template: Template): Promise<void> {
  const reExtendsTagMatch = template.html.match(reExtendsTag);
  if (!reExtendsTagMatch) return;

  const [tag, route] = reExtendsTagMatch;

  // Remove this extends tag from  template.html)
  template.html = template.html.replace(tag, '');

  // Wrap template with extends template (and merge front-matter).
  await wrapIntoSlot(template, route);

  // Recurse until no more extends tags are found.
  return processExtends(template);
}

/**
 * RegExp to detect the `{slot}` template tag in layouts
 */
const reSlotTag = /(?<!\\){[ \t]*slot[ \t]*}/;
/**
 * Wrapes the current template into the `{slot}` of the
 * template located at `wrapperRoute`.
 * It merges the FrontMatter variables of the wrapper
 * into the current template.
 * If the wrapper is in MarkDown it converts it to HTML.
 * @param {Template} template - Template to be wrapped.
 * @param {string} wrapperRoute - sub-layout with the wrapper for this template.
 */
async function wrapIntoSlot(
  template: Template,
  wrapperRoute: string
): Promise<void> {
  let wrapper = await getTemplate(wrapperRoute, true);
  if (!wrapper) return;
  const wrapperHtmlParts = wrapper.html.split(reSlotTag);
  if (wrapperHtmlParts?.length < 2)
    throw Error(`No slot tag found in ${wrapper.path}`);
  template.fm = { ...wrapper.fm, ...template.fm };
  template.html = `${wrapperHtmlParts[0]}${template.html}${wrapperHtmlParts[1]}`;
}

/**
 * RegExp to detect the `{ nolayout }` template tag
 */
const reNoLayout = /(?<!\\){[ \t]*nolayout[ \t]*}/;
/**
 * Unless the template has a `{nolayout}` tag,
 * it will try to locate the closest `_layout.html` file
 * and insert the template into the ´{slot}´ tag in it.
 * @param {Template} template - Template to be wrapped.
 */
async function processLayout(template: Template): Promise<void> {
  // Template has a nolayout tag?
  const hasNoLayoutTag = reNoLayout.test(template.html);
  if (hasNoLayoutTag) {
    template.html = template.html.replace(reNoLayout, '');
    return;
  }
  const layoutRoute = await findLayoutRoute(template.path);
  if (layoutRoute) await wrapIntoSlot(template, layoutRoute);
}

/**
 * Tries to locate the closest `_layout.html` file going up
 * until the root or the `routes` folder.
 * It returns the path to that layout or false if not found.
 * @param {string} path - Actual path to the template whose layout is being sought.
 * @returns {string|false} Route to the closes layout found
 */
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

/**
 * RegExp to parse the path out of a `{> path/from/routes }` include partial tag.
 */
const rePartialTag = /(?<!\\){[ \t]*>[ \t]*([\w\-\/\.]+)[ \t]*}/g;
/**
 * Processes the partials included on a template.
 * It will merge the FrontMatter values in the partial
 * and will converted to HTML if it is in Markdown.
 * @param {Template} template - Template to be processed.
 * @throws Throws and error if the partial is  not found.
 */
async function processPartials(template: Template): Promise<void> {
  const partialTags = [...template.html.matchAll(rePartialTag)];
  for (const [tag, route] of partialTags) {
    let partialTemplate = await getTemplate(route, true);
    if (!partialTemplate)
      throw new Error(`Failed to process partial tag: ${tag}`);
    template.fm = { ...template.fm, ...partialTemplate.fm };
    template.html = template.html.replace(tag, partialTemplate.html);
  }
}

/**
 * RegExp to parse block template tags `{@ }`, `{! }` and `{? }` and their content and alternate content, if any
 */
const reTjsBlock =
  /(?<!\\)\{[ \t]*(([@!?]?)[ \t]*(.+?))[ \t]*\}(([\s\S]+?)(\{[ \t]*:[ \t]*\3[ \t]*\}([\s\S]+?))?)\{[ \t]*\/\1[ \t]*\}/g;

/**
 * RegExp to parse variable include tags `{= }` and `{% }`
 */
const reTjsVal = /(?<!\\)\{[ \t]*([=%])[ \t]*(.+?)[ \t]*\}/g;

/**
 * Interpolates the variables into the html part of a template
 * @param {string} html - The html part of a template
 * @param {object} vars - An object with the variables to be interpolated into the html
 * @returns {string} The resulting html
 */
function processVars(html: string, vars: object): string {
  // This is a customized version of t.js -> https://github.com/jasonmoo/t.js
  /**
   * HTML-encodes values containing <, &, > and " characters.
   * @param val - Value to be HTML-encoded
   * @returns {string} HTML-encoded string
   */
  const scrub = (val: string | object): string =>
    (typeof val === 'string' ? val : JSON.stringify(val))
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  /**
   * Gets the value requested in various tags, resolving nested values.
   * @param {object} vars - Object containing the values
   * @param {string} key - Name of the property to be found
   * @returns {any} Value of the property, or undefined if not found.
   */
  const getValue = (vars: object, key: string) =>
    key.split('.').reduce<any>((acc, part) => {
      if (typeof acc === 'object' && part in acc) return acc[part];
      return undefined;
    }, vars);

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
}

/**
 *
 * @param {string} html - HTML to be processed
 * @param {string | string[]} swapIds - `id` or array of `id`s of elements to be extracted
 * @param {string} [triggerId] - The `id` of the element that triggered the request
 * @returns {string} HTML for the elements with the given `swapIds`
 */
function processSwapIds(
  html: string,
  swapIds: string | string[],
  triggerId?: string
): string {
  const swapIdsArray = [swapIds].flat(); // Convert single string to array.
  const dom = parse(html);

  // Is the element that triggered this event also being swapped?
  if (triggerId) {
    if (!swapIdsArray.includes(triggerId)) swapIdsArray.push(triggerId);
  }
  // Append elements specified by id to oobSwapElements.
  return swapIdsArray
    .map((id) => {
      const el = dom.getElementById(id);
      if (!el) {
        console.error(
          `res.render failed: No DOM element with id="${id}" found in template.`
        );
        return '';
      }
      if (id !== triggerId) el.setAttribute('hx-swap-oob', 'true');
      return el.toString();
    })
    .join('\n');
}

/**
 * Ensure route always starts with a slash and never ends with one,
 * except for the root. Cleans it up with `path.normalize`
 * @param {string} route - the route to normalize
 * @returns {string} The normalized route
 */
function normalizeRoute(route: string): string {
  route = normalize(route);
  if (route === '/') return route;
  route = route.startsWith('/') ? route : '/' + route;
  route = route.endsWith('/') ? route.slice(0, -1) : route;
  return route;
}

/**
 * Custom `require` that expands an initial `~` to the app working directory
 * @param {string} path - Path to the module to be required
 * @returns {any} Required module
 */
function relativeRequire(path: string) {
  return require(path.startsWith('~/')
    ? path.replace('~', process.cwd())
    : path);
}

/**
 * RegExp to filter valid pages (`.html and `.md`)
 */
const reValidPages = /\.(html|md)$/;

/**
 * Turns an absolute file path to a relative URL
 * @param {string} filePath Absolute file path to turn into an relative URL
 * @returns {string} relative URL
 */
const absPathToRoute = (filePath: string) =>
  normalizeRoute(
    filePath
      // Turns the path relative to `routesDir`
      .replace(routesDir, '')
      // strips off the valid extensions
      .replace(reValidPages, '')
      // strips off the default `index` page
      .replace(/\/index$/, '')
  );

/**
 * Regexp to parse the three possible file path patterns:
 * - Simple file/folder names, id: `/folder`
 * - Parts enclosed in square brakets representing parameters, ie: `/[param]`
 *   possibly optional if preceeded by an underscore: `/[_optionalParam]`
 * - Catch all parameters, to pick whatever is left: `/%`
 * All characters with special meaning are valid in all OSs.
 */
const rePathToRoute =
  /\/(?<part>[\w-]+)|\[(?<opt>_?)(?<param>\w+)]|(?<rest>%)/gm;

/**
 * Scans a folder recursively searching for valid
 * `.md` or `.html` files
 * converting the file paths into valid Express
 * routes and assembling them into the `routes` object.
 * @param {string} thisDir Absolute path to the folder to be scanned
 */
const loadRoutesFromFolder = async (thisDir: string) => {
  const files = await readdir(thisDir);

  for (const fileName of files) {
    // Ignore files starting with a double underscore.
    if (fileName.startsWith('__')) continue;
    // Set the full abs path to file.
    const absPath = join(thisDir, fileName);
    // Recurse into directories for nested routes.
    if (statSync(absPath).isDirectory()) {
      await loadRoutesFromFolder(absPath);
      continue;
    }
    // Set the route endpoint for .html or .md files only.

    if (!reValidPages.test(absPath)) continue;

    let r1 = [''];
    for (const match of absPathToRoute(absPath).matchAll(rePathToRoute)) {
      const g = match.groups as {
        part?: string;
        opt?: '_';
        param?: string;
        rest?: string;
      };
      if (g.part) {
        r1.push(g.part);
      } else if (g.param) {
        r1.push(`:${g.param}${g.opt ? '?' : ''}`);
      } else if (g.rest) {
        r1.push('*');
      } else {
        console.error(`
            Path to route failed:  
            ${absPath},
            ${g}
          `);
      }
    }
    const route = r1.join('/') || '/';

    if (routes[route]) {
      console.error(`Duplicate routes defined for ${route} in:
         - ${routes[route]} 
         - ${absPath}`);
      continue;
    }
    routes[route] = absPath;
  }
};

/**
 * Finds occurrences of slashes in a filename.
 */
const reSlashes = /\//g;

/**
 * Reads the `routes` object with all the paths scanned
 * by `loadRoutesFromFolder` and reads the content of the
 * `<script server>` section on each page
 * and adds it as an Express handler.
 * It sorts the routes to give priority to the most specific routes.
 * It assumes the routes with more slashes are more specific.
 * That being equal, the longest wins.
 * @param {Application} app Express application instance
 */
const addHandlersToPaths = async (app: Application) => {
  const rs = Object.keys(routes).sort((a, b) => {
    const aSlashes = (a.match(reSlashes) ?? []).length;
    const bSlashes = (b.match(reSlashes) ?? []).length;
    return bSlashes - aSlashes || b.length - a.length;
  });

  for (const route of rs) {
    const absPath = routes[route];

    // Read the file and look for <script server>
    const template = await readFile(absPath, 'utf-8');
    const matchScript = template.match(reServerScript);
    let serverBlock = matchScript && matchScript[1] + '\nreturn server';
    if (serverBlock) {
      /**
       * Route handler created from the server-block in the page.
       * @param {Router} server - Express router to attach more specific handlers to.
       * @param {funcion} require - Customized version of `require`, @see relativeRequire
       * @param {string} self - Route for this page
       */
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
        routeHandler(app.route(route), relativeRequire, route);
      } catch (err) {
        console.error(
          `Unable to parse server block in: ${absPath}\n\n${
            (err as Error).stack
          }`
        );
      }
    }
  }
};

/**
 * Scans the folder set in `app.get('views')` defaulting
 * to `./routes` folder for pages to render.
 * It reads the `<script server>` block of each and
 * adds a route to the express Application (`app.use()`)
 * for the scripts on that page to handle it.
 * @param {express.Application} app - Express Application object to add the handlers to.
 */
export async function loadRoutes(app: Application): Promise<void> {
  routesDir = app.get('views') ?? join(process.cwd(), 'routes');

  await loadRoutesFromFolder(routesDir);

  await addHandlersToPaths(app);
}
