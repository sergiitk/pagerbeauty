// ------- Imports -------------------------------------------------------------

import logger from 'winston';

// ------- Internal imports ----------------------------------------------------

import { PagerBeautyWeb } from './PagerBeautyWeb';

// ------- Class ---------------------------------------------------------------

export class PagerBeautyApp {
  constructor(config) {
    // Attach Public API functions to object context.
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);

    // Config
    this.config = config;

    // Web functionality.
    this.web = new PagerBeautyWeb(this);
  }

  // ------- Public API  -------------------------------------------------------

  async start() {
    const { config } = this;
    logger.info(`Starting PagerBeauty v${config.version} in ${config.env} mode`);

    await this.web.start();
    return true;
  }

  async stop() {
    logger.info('Graceful shut down');
    await this.web.stop();
    return true;
  }

  // ------- Class end  --------------------------------------------------------
}

// ------- End -----------------------------------------------------------------
