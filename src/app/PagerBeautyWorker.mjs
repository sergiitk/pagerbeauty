// ------- Imports -------------------------------------------------------------

import logger from 'winston';

// ------- Internal imports ----------------------------------------------------

import { OnCallsService } from '../services/OnCallsService';
import { PagerBeautyInitError } from '../errors';
import { PagerDutyClient } from '../services/PagerDutyClient';
import { OnCallsTimerTask } from '../tasks/OnCallsTimerTask';
import { Timer } from './Timer';

// ------- PagerBeautyWorker ---------------------------------------------------

export class PagerBeautyWorker {
  constructor(app) {
    // Attach Public API functions to object context.
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);

    // App
    this.app = app;

    // Config
    this.config = app.config;

    // DB
    this.db = app.db;

    // PD Client
    const pagerDutyConfig = this.config.pagerDuty;
    this.pagerDutyClient = new PagerDutyClient(
      pagerDutyConfig.apiKey,
      pagerDutyConfig.apiURL,
    );
    this.onCallsService = new OnCallsService(this.pagerDutyClient);
    this.onCallsTimer = false;

    // Parse refresh interval
    const refreshRateMinutes = Number(pagerDutyConfig.schedules.refreshRate);
    if (Number.isNaN(refreshRateMinutes)) {
      throw new PagerBeautyInitError('Refresh rate is not a number');
    }
    this.refreshRateMS = refreshRateMinutes * 60 * 1000;

    // Requested schedules list.
    this.schedulesList = pagerDutyConfig.schedules.list;
  }

  // ------- Public API  -------------------------------------------------------

  async start() {
    const { db } = this;
    logger.debug('Initializing database.');
    db.set('oncalls', new Map());

    await this.startOnCallsWorker();
    return true;
  }

  async stop() {
    if (this.onCallsTimer) {
      await this.onCallsTimer.stop();
    }

    const { db } = this;
    db.clear();
    return true;
  }

  // ------- Internal machinery  -----------------------------------------------

  async startOnCallsWorker() {
    const { refreshRateMS, schedulesList } = this;
    const onCallsTimerTask = new OnCallsTimerTask({
      db: this.db,
      onCallsService: this.onCallsService,
      schedulesList,
    });
    this.onCallsTimer = new Timer(onCallsTimerTask, refreshRateMS);
    await this.onCallsTimer.start();
  }

  // ------- Class end  --------------------------------------------------------
}

// ------- End -----------------------------------------------------------------
