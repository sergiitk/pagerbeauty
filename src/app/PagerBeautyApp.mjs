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
import { PagerBeautyWebServerStartError } from '../errors';

// ------- Class ---------------------------------------------------------------

export class PagerBeautyApp {
  constructor(config) {
    // Attach Public API functions to object context.
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);

    // Config
    this.config = config;

    // Nothing running yet.
    this.server = false;

    // Init controllers mapping.
    this.controllers = PagerBeautyApp.buildControllersRegistry();

    // Configure web sever.
    this.app = this.loadWebApp();
  }

  // ------- Public API  -------------------------------------------------------

  async start() {
    const { config } = this;
    logger.info(`Starting PagerBeauty v${config.version} in ${config.env} mode`);

    // Controllers
    await this.startControllers();

    // Web Server
    let server;
    try {
      server = await PagerBeautyApp.startWebServerAsync(this.app.callback());
    } catch (error) {
      if (error instanceof PagerBeautyWebServerStartError) {
        this.stop(error.server);
      }
      return false;
    }
    this.server = server;
    return true;
  }

  async stop(server) {
    logger.info('Graceful shut down');
    const serverToStop = server || this.server;
    await this.stopControllers();
    await PagerBeautyApp.stopWebServerAsync(serverToStop);
    return true;
  }

  // ------- Internal machinery  -----------------------------------------------


  loadWebApp() {
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

  static buildControllersRegistry() {
    const controllers = new Map();
    controllers.set('SchedulesController', new SchedulesController());
    return controllers;
  }

  static startWebServerAsync(connectionListener) {
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
        reject(new PagerBeautyWebServerStartError(error.message, server));
      });
      server.listen({
        host: '0.0.0.0',
        // @todo: make configurable.
        port: 8080,
      });
    });
  }

  static stopWebServerAsync(server) {
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
