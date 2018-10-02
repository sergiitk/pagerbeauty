// ------- Imports -------------------------------------------------------------

import http from 'http';
import path from 'path';

import Koa from 'koa';
import mount from 'koa-mount';
import nunjucks from 'nunjucks';
import route from 'koa-route';
import serve from 'koa-static';
import views from 'koa-views';

// ------- Internal imports ----------------------------------------------------

import { SchedulesController } from '../controllers/SchedulesController';

// ------- Class ---------------------------------------------------------------

export class PagerBeautyWebApp {
  constructor() {
    // Attach Public API functions to object context.
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);

    // Nothing running yet.
    this.server = false;

    // Init controllers mapping.
    this.controllers = this.loadControllers();

    // Configure web sever.
    this.app = this.loadWebApp();
  }

  // ------- Public API  -------------------------------------------------------

  async start() {
    await Promise.all(Object.values(this.controllers).map(c => c.init()));

    let server;
    try {
      server = await PagerBeautyWebApp.startWebServerAsync(this.app.callback());
    } catch (error) {
      // log error
      return false;
    }

    this.server = server;
    return true;
  }

  async stop() {
    await PagerBeautyWebApp.startWebStopAsync(this.server);
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
    // @todo: Basic auth

    // Static assets
    app.use(mount('/assets', serve('assets')));

    // Templates
    const viewsPath = path.resolve('src', 'views');
    const nunjucksEnv = new nunjucks.Environment(
      new nunjucks.FileSystemLoader(viewsPath),
    );
    app.use(views(viewsPath, {
      options: {
        nunjucksEnv,
      },
      map: { j2: 'nunjucks' },
      extension: 'j2',
    }));

    // Custom Routes
    const { schedulesController } = this.controllers;
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

  loadControllers() {
    const controllers = {};
    controllers.schedulesController = new SchedulesController(this);
    return controllers;
  }

  static startWebServerAsync(connectionListener) {
    // Wrap HTTP server callbacks into a promise
    return new Promise((resolve, reject) => {
      // Start HTTP server
      const server = http.createServer(connectionListener);
      server.on('listening', () => {
        // @todo logging
        resolve(server);
      });
      server.on('error', (error) => {
        // @todo logging
        reject(error);
      });
      server.listen({
        host: 'localhost',
        port: 8080,
      });
    });
  }

  static startWebStopAsync(server) {
    // Wrap HTTP server callbacks into a promise
    return new Promise((resolve) => {
      server.close((error) => {
        if (error) {
          // Already stopped
          // @todo logging
        }
        resolve();
      });
    });
  }

  // ------- Class end  --------------------------------------------------------
}

// ------- End -----------------------------------------------------------------
