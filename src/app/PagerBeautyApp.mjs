// ------- Imports -------------------------------------------------------------

import logger from 'winston';

// ------- Internal imports ----------------------------------------------------

import { PagerBeautyWeb } from './PagerBeautyWeb';
import { PagerBeautyWorker } from './PagerBeautyWorker';

// ------- Class ---------------------------------------------------------------

export class PagerBeautyApp {
  constructor(config) {
    // Attach Public API functions to object context.
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);

    // Config.
    this.config = config;

    // Database.
    this.db = new Map();

    // Web functionality.
    this.web = new PagerBeautyWeb(this);

    // Loading and managing data.
    this.worker = new PagerBeautyWorker(this);
  }

  // ------- Public API  -------------------------------------------------------

  async start() {
    const { config } = this;
    logger.info(`Starting PagerBeauty v${config.version} in ${config.env} mode`);

    // Concurrent start.
    const webStart = this.web.start();
    const workerStart = this.worker.start();

    // Waits for slowest to finish.
    await webStart;
    await workerStart;
    return true;
  }

  async stop() {
    logger.info('Graceful shut down');
    // Concurrent stop.
    const webStop = this.web.stop();
    const workerStop = this.worker.stop();

    // Waits for slowest to finish.
    await webStop;
    await workerStop;
    return true;
  }

  // ------- Class end  --------------------------------------------------------
}

// ------- End -----------------------------------------------------------------
