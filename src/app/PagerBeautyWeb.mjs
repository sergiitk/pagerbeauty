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
import {
  PagerBeautyConfigError,
  PagerBeautyHttpServerStartError,
} from '../errors';

// ------- Class ---------------------------------------------------------------

export class PagerBeautyWeb {
  constructor(app) {
    // Attach Public API functions to object context.
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);

    // App
    this.app = app;

    // Parse web config
    try {
      this.auth = app.config.web.auth;
      this.hostRequested = app.config.web.host || '0.0.0.0';
      this.httpPortRequested = PagerBeautyWeb.parseHttpPortFromConfig(app.config);
    } catch (error) {
      throw new PagerBeautyConfigError(error.toString());
    }

    // Nothing running yet.
    this.httpServer = false;
    this.httpPort = false;
    this.host = false;

    // Init controllers mapping.
    this.controllers = new Map();
    this.controllers.set('SchedulesController', new SchedulesController(app));

    // Configure web app.
    this.webApp = this.initWebApp();
  }

  // ------- Public API  -------------------------------------------------------

  async start() {
    // HTTP Server
    let server;
    try {
      server = await PagerBeautyWeb.startHttpServerAsync(
        this.webApp.callback(),
        this.hostRequested,
        this.httpPortRequested,
      );

      // Note: actual address and port might be different from requested:
      // - httpPortRequested=0 means result in random port
      // - hostRequested='' will result in `::`` host when IPv6 is available
      // See https://nodejs.org/api/net.html#net_server_listen_port_host_backlog_callback
      const address = server.address();
      this.host = address.address;
      this.httpPort = address.port;
      const readableUrl = `http://${this.host}:${this.httpPort}`;
      logger.info(`HTTP server is listening on ${readableUrl}`);
    } catch (error) {
      logger.error(error.toString());
      if (error instanceof PagerBeautyHttpServerStartError) {
        this.stop(error.server);
      }
      return false;
    }
    this.httpServer = server;
    return true;
  }

  async stop(httpServer) {
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
    if (this.auth && this.auth.name && this.auth.pass) {
      app.use(auth(this.auth));
    }

    // Static assets
    app.use(mount('/assets', serve('assets')));

    // Templates
    const viewsPath = path.resolve('src', 'views');
    const nunjucksEnv = new nunjucks.Environment(
      new nunjucks.FileSystemLoader(viewsPath),
    );
    // Global template variables.
    const assetsPath = this.app.config.env === 'production'
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

    // Redirects
    app.use(route.get('/', redirect('/v1')));
    app.use(route.get('/v1', redirect('/v1/schedules.html')));
    app.use(route.get('/v1/schedules', redirect('/v1/schedules.html')));

    // Controller routes
    const schedulesController = this.controllers.get('SchedulesController');
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

  static startHttpServerAsync(connectionListener, host, port) {
    // Wrap HTTP server callbacks into a promise
    return new Promise((resolve, reject) => {
      // Start HTTP server
      const server = http.createServer(connectionListener);
      server.on('listening', () => {
        resolve(server);
      });
      server.on('error', (error) => {
        reject(new PagerBeautyHttpServerStartError(error.message, server));
      });
      server.listen({ host, port });
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

  // ------- Helpers -----------------------------------------------------------

  static parseHttpPortFromConfig(config) {
    // Default port.
    const defaultPort = 8080;

    // Default when no config provided
    if (!config || !config.web) {
      return defaultPort;
    }

    const { httpPort } = config.web;
    // Default when config.web.httpPort is omitted or empty string.
    if (httpPort === undefined || httpPort === '' || httpPort === null) {
      return defaultPort;
    }

    // Custom port is configured.
    const result = Number(httpPort);

    // Check incorrect cases.
    if (Number.isNaN(result) || result < 0 || result > 65535) {
      throw new RangeError(
        `result should be a number >= 0 and < 65536: -1, provided: ${httpPort}`,
      );
    }

    return result;
  }

  // ------- Class end  --------------------------------------------------------
}

// ------- End -----------------------------------------------------------------
