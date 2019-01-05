// ------- Imports -------------------------------------------------------------

import http from 'http';
import path from 'path';

import auth from 'koa-basic-auth';
import Koa from 'koa';
import logger from 'winston';
import mount from 'koa-mount';
import nunjucks from 'nunjucks';
import route from 'koa-route';
import serve from 'koa-static';
import views from 'koa-views';

// ------- Internal imports ----------------------------------------------------

import { SchedulesController } from '../controllers/SchedulesController';
import { redirect } from '../middleware/redirect';
import { PagerBeautyHttpServerStartError } from '../errors';

// ------- Class ---------------------------------------------------------------

export class PagerBeautyWeb {
  constructor(app) {
    // Attach Public API functions to object context.
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);

    // App
    this.app = app;

    // Config
    this.config = app.config;

    // Nothing running yet.
    this.httpServer = false;

    // Init controllers mapping.
    this.controllers = PagerBeautyWeb.initControllersRegistry();

    // Configure web app.
    this.webApp = this.initWebApp();
  }

  // ------- Public API  -------------------------------------------------------

  async start() {
    // Controllers
    await this.startControllers();

    // HTTP Server
    let server;
    try {
      server = await PagerBeautyWeb.startHttpServerAsync(this.webApp.callback());
    } catch (error) {
      if (error instanceof PagerBeautyHttpServerStartError) {
        this.stop(error.server);
      }
      return false;
    }
    this.httpServer = server;
    return true;
  }

  async stop(httpServer) {
    await this.stopControllers();

    await PagerBeautyWeb.stopHttpServerAsync(httpServer || this.httpServer);
    return true;
  }

  // ------- Internal machinery  -----------------------------------------------


  initWebApp() {
    const app = new Koa();

    // @todo: Set app env?
    // @todo: Web proxy?

    // -------- Setup web middleware --------

    // @todo: Enforce https?
    // @todo: Generate unique request id?
    if (this.config.auth && this.config.auth.name && this.config.auth.pass) {
      app.use(auth(this.config.auth));
    }

    // Static assets
    app.use(mount('/assets', serve('assets')));

    // Templates
    const viewsPath = path.resolve('src', 'views');
    const nunjucksEnv = new nunjucks.Environment(
      new nunjucks.FileSystemLoader(viewsPath),
    );
    // Global template variables.
    const assetsPath = this.config.env === 'production'
      ? '/assets/dist-prod'
      : '/assets/dist';
    nunjucksEnv.addGlobal('assetsPath', assetsPath);
    // Apply nunjucks to all *.j2
    app.use(views(viewsPath, {
      options: {
        nunjucksEnv,
      },
      map: { j2: 'nunjucks' },
      extension: 'j2',
    }));

    // Custom Routes

    const schedulesController = this.controllers.get('SchedulesController');
    // Redirects
    app.use(route.get('/', redirect('/v1')));
    app.use(route.get('/v1', redirect('/v1/schedules.html')));
    app.use(route.get('/v1/schedules', redirect('/v1/schedules.html')));
    // Controllers
    app.use(route.get(
      '/v1/schedules.(json|html)',
      schedulesController.index,
    ));
    app.use(route.get(
      '/v1/schedules/:scheduleId.(json|html)',
      schedulesController.show,
    ));
    return app;
  }

  async startControllers() {
    const controllerEntries = Array.from(this.controllers.entries());
    return Promise.all(controllerEntries.map(([name, controller]) => {
      logger.debug(`Starting web controller ${name}`);
      return controller.start(this);
    }));
  }

  async stopControllers() {
    const controllerEntries = Array.from(this.controllers.entries());
    return Promise.all(controllerEntries.map(([name, controller]) => {
      logger.debug(`Stopping web controller ${name}`);
      return controller.stop(this);
    }));
  }

  static initControllersRegistry() {
    const controllers = new Map();
    controllers.set('SchedulesController', new SchedulesController());
    return controllers;
  }

  static startHttpServerAsync(connectionListener) {
    // Wrap HTTP server callbacks into a promise
    return new Promise((resolve, reject) => {
      // Start HTTP server
      const server = http.createServer(connectionListener);
      server.on('listening', () => {
        const address = server.address();
        const readableUrl = `http://${address.address}:${address.port}`;
        logger.info(`HTTP server is listening on ${readableUrl}`);
        resolve(server);
      });
      server.on('error', (error) => {
        logger.error(error.toString());
        reject(new PagerBeautyHttpServerStartError(error.message, server));
      });
      server.listen({
        host: '0.0.0.0',
        // @todo: make configurable.
        port: 8080,
      });
    });
  }

  static stopHttpServerAsync(server) {
    // Wrap HTTP server callbacks into a promise
    return new Promise((resolve) => {
      server.close((error) => {
        if (error) {
          // Already stopped.
          logger.verbose(`HTTP server: graceful shut down error: ${error.message}`);
        }
        resolve();
      });
    });
  }

  // ------- Class end  --------------------------------------------------------
}

// ------- End -----------------------------------------------------------------
