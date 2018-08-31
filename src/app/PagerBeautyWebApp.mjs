// ------- Imports -------------------------------------------------------------

import { Koa } from 'koa';
import { Router } from 'koa-router';

// ------- Internal imports ----------------------------------------------------

// import { HealthchecksController, SchedulesController } from '../controllers';

// ------- Class ---------------------------------------------------------------

export default class PagerBeautyWebApp {
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
      server = await startWebServerAsync(this.app.callback());
    } catch (error) {
      // log error
      return false;
    }

    this.server = server;
    return true;
  }

  async stop() {
    await startWebStopAsync(this.server);
    return true;
  }

  // ------- Internal machinery  -----------------------------------------------

  initRouter() {
    const router = new Router();
    return router;
  }

  initWebApp() {
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

  initControllers() {

  }

  startWebServerAsync(connectionListener) {
    // Wrap HTTP server callbacks into a promise
    return new Promise((resolve, reject) => {
      // Start HTTP server
      const server = http.createServer(connectionListener);
      server.on('listening', () => {
        // @todo logging
        resolve(server);
      })
      this.server.on('error', (error) => {
        // @todo logging
        reject(error);
      })
      this.server.listen({
        host: 'localhost',
        port: 80,
      });
    });
  }

  startWebStopAsync(server) {
    // Wrap HTTP server callbacks into a promise
    return new Promise((resolve, reject) => {
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
