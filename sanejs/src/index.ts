import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';

import compression from 'compression';
import session from 'express-session';
import { saneMiddleware, loadRoutes } from './sane.js';
import { join } from 'path';
import livereload from 'livereload';
import connectLivereload from 'connect-livereload';
import dotenv from 'dotenv';

dotenv.config();

// The template uses Bootstrap Card component:
// https://getbootstrap.com/docs/5.1/components/card/#header-and-footer
// `header` and `title` correspond to elements styled
// with `card-header` and `card-title` class names.
// `color` refers to the standard background colors.

type ErrorTemplateVals = {
  header: string;
  message: string;
  color?: 'info' | 'warning' | 'danger';
  title?: string;
};

// Check for required .env values.
const requiredEnvs = ['PORT', 'NAME', 'NODE_ENV', 'SESSION_SECRET'];
const missingEnvs = requiredEnvs.filter((e) => !process.env[e]);
if (missingEnvs.length) {
  console.log(
    '\nBefore running saneJS, please set the following values in your .env:\n'
  );
  for (const v of missingEnvs) console.error('-', v);
  console.log('');
  process.exit();
}

// Create Express app.
const app = express();

// Setup the template engine, template location and default extension.
app.set('views', join(process.cwd(), 'routes'));

// Use gzip compression.
app.use(compression());

// Modify response headers for better security.
app.use(
  helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false })
);

// Set path to static dir.
const staticDirectory = join(process.cwd(), 'static');

// Connect to LiveReload for development: Watch static dir and nodemon refresh.
if (app.get('env') === 'development') {
  const liveReloadServer = livereload.createServer();
  // Only directly watch the static directory.
  liveReloadServer.watch(staticDirectory);
  // When Nodemon restarts, refresh the browser.
  liveReloadServer.server.once('connection', () => {
    setTimeout(() => {
      liveReloadServer.refresh('/');
    }, 100);
  });
  // Inject the JS snippet into page <head>.
  app.use(connectLivereload());
}

app.get('/node_modules/*', (req: Request, res: Response) => {
  res.sendFile(require.resolve(req.path.replace('/node_modules/', '')));
});
// Serve static resources like images and css.
app.use(express.static(staticDirectory));

// Allow use of modern browser form data and JSON responses.
app.use(
  express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 })
);
app.use(express.json());

// Use sane templating middleware.
app.use(saneMiddleware);

// Use Express Session
if (process.env.SESSION_SECRET) {
  app.set('trustproxy', true);
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      saveUninitialized: true,
      resave: true,
      cookie: { maxAge: 1000 * 60 * 60 * 2 }, // 2 hours
      rolling: true,
    })
  );
}
// Use auth middleware for protected routes.
// app.use(protectAdminRoutes);

// Need to use self-executing function for the rest so we can await dynamic routes.
(async function () {
  // Dynamically add all routes found in routes/ dir excluding those prefixed with underscore.
  await loadRoutes(app);

  /**
   * If route hasn't been handled yet, the page does not exist.
   * Send a 404 error.
   * This is not an error handler, it doesn't take the error argument,
   * it is simply at the bottom of the chain.
   */

  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.url == '/service-worker.js') return next();
    console.error(`404 NOT FOUND: ${req.method} ${req.url}`);
    res.showError<ErrorTemplateVals>({
      header: '404 – Not Found',
      message: `Operación: ${req.method} sobre ${req.url}`,
      color: 'warning',
      title: 'Esta dirección no se encuentra',
    });
  });

  /**
   * Customized Express error handler (has 4 arguments)
   * Detects SQLite errors or just sends a 500 Internal Server error
   */
  app.use(
    (
      error: any,
      _req: Request,
      res: Response,
      _next: NextFunction // Express recognizes error middleware by accepting 4 arguments
    ) => {
      console.log('app use error', JSON.stringify(error, null, 2));
      console.log(
        `|${process.env.NODE_ENV}|`,
        process.env.NODE_ENV !== 'production'
      );

      if (error?.errno) {
        res.showError<ErrorTemplateVals>({
          header: `Sqlite database error ${error.errno}`,
          color: 'info',
          message: error,
        });
        return;
      }

      // Show debug info for dev?
      if (process.env.NODE_ENV !== 'production') {
        console.error(error, error.stack);
      }
      res.showError<ErrorTemplateVals>({
        header: '500 – Internal Server Error',
        message: error.stack,
        color: 'danger',
        title: error.toString(),
      });
    }
  );

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
  });
})();
