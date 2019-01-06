// ------- Imports -------------------------------------------------------------

import logger from 'winston';

// ------- Internal imports ----------------------------------------------------

import { Timer } from './Timer';
import { PagerBeautyInitError } from '../errors';
import { OnCallsTimerTask } from '../tasks/OnCallsTimerTask';
import { SchedulesTimerTask } from '../tasks/SchedulesTimerTask';
import { OnCallsService } from '../services/OnCallsService';
import { SchedulesService } from '../services/SchedulesService';
import { PagerDutyClient } from '../services/PagerDutyClient';

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

    // PD Client and services.
    const pagerDutyConfig = this.config.pagerDuty;
    this.pagerDutyClient = new PagerDutyClient(
      pagerDutyConfig.apiKey,
      pagerDutyConfig.apiURL,
    );
    this.onCallsService = new OnCallsService(this.pagerDutyClient);
    this.schedulesService = new SchedulesService(this.pagerDutyClient);

    // Timers
    this.onCallsTimer = false;
    this.schedulesTimer = false;

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
    db.set('schedules', new Map());

    // Load schedules first.
    await this.startSchedulesWorker();

    // Then load on-calls.
    await this.startOnCallsWorker();
    return true;
  }

  async stop() {
    if (this.onCallsTimer) {
      await this.onCallsTimer.stop();
    }
    if (this.schedulesTimer) {
      await this.schedulesTimer.stop();
    }

    const { db } = this;
    db.clear();
    return true;
  }

  // ------- Internal machinery  -----------------------------------------------

  async startSchedulesWorker() {
    const { refreshRateMS, schedulesList } = this;
    const schedulesTimerTask = new SchedulesTimerTask({
      db: this.db,
      schedulesService: this.schedulesService,
      schedulesList,
    });
    this.schedulesTimer = new Timer(schedulesTimerTask, refreshRateMS);
    await this.schedulesTimer.start();
  }

  async startOnCallsWorker() {
    const { refreshRateMS } = this;
    const onCallsTimerTask = new OnCallsTimerTask({
      db: this.db,
      onCallsService: this.onCallsService,
    });
    this.onCallsTimer = new Timer(onCallsTimerTask, refreshRateMS);
    await this.onCallsTimer.start();
  }

  // ------- Class end  --------------------------------------------------------
}

// ------- End -----------------------------------------------------------------
