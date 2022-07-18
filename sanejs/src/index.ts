import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';

import compression from 'compression';
import session from 'express-session';
import { saneMiddleware, dynamicallyLoadRoutes } from './sane';
// import { protectAdminRoutes } from './lib/auth';
import { join } from 'path';
import livereload from 'livereload';
import connectLivereload from 'connect-livereload';
// import { requestLogger, logger } from './lib/logger';
import dotenv from 'dotenv';
dotenv.config();

// Check for required .env values.
const requiredEnvs = ['PORT', 'NAME', 'NODE_ENV'];
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

// Use gzip compression.
app.use(compression());

// Modify response headers for better security.
app.use(
  helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false })
);

// Set path to static dir.
const staticDirectory = join(__dirname, 'static');

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
if (process.env.SESSION_SECRET && process.env.MONGO_URI) {
  app.set('trustproxy', true);
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      saveUninitialized: true,
      resave: true,
      store: new MongoDBStore({
        uri: process.env.MONGO_URI,
        collection: '_express_sessions',
      }),
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
  await dynamicallyLoadRoutes(join(__dirname, 'routes'), app);

  // If route hasn't been handled yet, serve a plain .html template if present.
  app.use((req, res, next) => {
    if (req.method != 'GET') return next();
    if (req.path.indexOf('.') !== -1) return next(); // Don't waste cpu on .css and favicons
    res.render(req.path, {});
  });

  // Handle simple 404.
  app.use((req, res, next) => {
    if (req.url == '/service-worker.js') return next();
    console.error(`404 NOT FOUND: ${req.method} ${req.url}`);
    res.error404();
  });

  // Handle all other errors.
  app.use(
    (
      error: any,
      req: Request,
      res: Response,
      // @ts-ignore
      next: NextFunction // Express recognizes error middleware by accepting 4 arguments
    ) => {
      // Is this a regular 404 raised by `res.error(404)`?
      if (error?.status == 404) {
        console.error(`404 NOT FOUND: ${req.method} ${req.url}`);

        res.error404();
        return;
      }
      // Is this a MongoDB castError?
      // Ex: /usersById/not-a-real-id causes Mongo to throw this error.
      if (error?.name == 'CastError') {
        // Handle as a regular 404.
        console.error('MongoDB CastError (invalid ObjectID)');
        console.error(`404 NOT FOUND: ${req.method} ${req.url}`);

        res.error404();
        return;
      }

      // Show debug info for dev?
      if (process.env.NODE_ENV == 'development') {
        console.error(error, error.stack);
      }
      res.error500(error);
    }
  );

  // Connect to Mongo
  if (process.env.MONGO_URI) connectToMongo();

  // Start the server.
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log('\x1b[33m', `\n👍 Listening at localhost:${port}\n`, '\x1b[0m');
  });
})();

// ============================================= //
