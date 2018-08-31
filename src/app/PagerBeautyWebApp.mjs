// ------- Imports -------------------------------------------------------------

import http from 'http';

import Koa from 'koa';
import Router from 'koa-router';

// ------- Internal imports ----------------------------------------------------

// import { HealthchecksController, SchedulesController } from '../controllers';

// ------- Class ---------------------------------------------------------------

export class PagerBeautyWebApp {
  constructor() {
    // Attach Public API functions to object context.
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);

    // Dynamically create and assign controllers.
    this.controllers = this.initControllers([
      // HealthchecksController,
      // SchedulesController,
    ]);

    // Nothing running yet.
    this.server = false;

    // Define routing.
    this.router = this.initRouter();

    // Configure web sever.
    this.app = this.initWebApp();
  }

  // ------- Public API  -------------------------------------------------------

  async start() {
    let server;
    try {
      server = await this.startWebServerAsync(this.app.callback());
    } catch (error) {
      // log error
      return false;
    }

    this.server = server;
    return true;
  }

  async stop() {
    await this.startWebStopAsync(this.server);
    return true;
  }

  // ------- Internal machinery  -----------------------------------------------

  static initRouter() {
    const router = new Router();
    return router;
  }

  static initWebApp() {
    const app = new Koa();

    // @todo: Set app env?
    // @todo: Web proxy?

    // -------- Setup web middleware --------

    // @todo: Enforce https?
    // @todo: Generate unique request id?
    // @todo: Basic auth

    // Inject Koa Router routes and allowed methods.
    app.use(this.router.routes());
    app.use(this.router.allowedMethods());
    return app;
  }

  static initControllers() {

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
