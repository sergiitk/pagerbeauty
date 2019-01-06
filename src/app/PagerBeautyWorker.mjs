// ------- Imports -------------------------------------------------------------

import logger from 'winston';

// ------- Internal imports ----------------------------------------------------

import { OnCallsService } from '../services/OnCallsService';
import { PagerBeautyInitError } from '../errors';
import { PagerDutyClient } from '../services/PagerDutyClient';
import { Timer } from './Timer';

// ------- OnCallsTimerTask ----------------------------------------------------


/* eslint-disable class-methods-use-this */
// Don't requre hooks to be static for consitency.
// TimerTask implementations decide whether they need to use this in them.
class OnCallsTimerTask {
  constructor({ db, onCallsService, schedulesList }) {
    this.db = db;
    this.onCallsService = onCallsService;
    this.schedulesList = schedulesList;
  }

  async run(runNumber, intervalMs) {
    logger.verbose(`Schedules refresh run #${runNumber}, every ${intervalMs}ms`);
    const result = await this.onCallsService.load(this.schedulesList);
    if (result) {
      // @todo: refresh without full override.
      this.db.set('oncalls', this.onCallsService);
    }
    return result;
  }

  onRunSkip() {
    logger.warn(
      'Attempting schedule refresh while the previous request is '
      + 'still running. This should not normally happen. Try decreasing '
      + 'schedule refresh rate',
    );
  }
}
/* eslint-enable class-methods-use-this */

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
  }

  // ------- Public API  -------------------------------------------------------

  async start() {
    const { db } = this;
    logger.debug('Initializing database.');
    db.set('oncalls', new Map());

    await this.startSchedulesWorker();
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

  async startSchedulesWorker() {
    // Set refresh.
    const pagerDutyConfig = this.config.pagerDuty;
    const refreshRateMinutes = Number(pagerDutyConfig.schedules.refreshRate);
    if (Number.isNaN(refreshRateMinutes)) {
      throw new PagerBeautyInitError('Refresh rate is not a number');
    }

    const refreshRateMS = refreshRateMinutes * 60 * 1000;
    const schedulesList = pagerDutyConfig.schedules.list;

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
