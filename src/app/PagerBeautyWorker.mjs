// ------- Imports -------------------------------------------------------------

import logger from 'winston';

// ------- Internal imports ----------------------------------------------------

import { PagerBeautyInitError } from '../errors';
import { PagerDutyClient } from '../services/PagerDutyClient';
import { SchedulesService } from '../services/SchedulesService';

// ------- Class ---------------------------------------------------------------

class Timer {
  constructor(task, intervalMs) {
    this.task = task;
    this.taskName = task.constructor.name;
    this.intervalMs = intervalMs;
    this.intervalId = false;
    this.semaphore = true;
    this.runNumber = 0;
  }

  async start() {
    const { intervalMs, task, taskName } = this;
    logger.debug(`Scheduling ${taskName} every ${intervalMs}ms`);
    if (task.onStart) {
      task.onStart(intervalMs);
    }
    // Todo: first load immidiatelly.
    this.intervalId = setInterval(() => this.runTask(), intervalMs);
  }

  async stop() {
    const { task, taskName } = this;
    logger.debug(`Stopping ${taskName}`);
    clearInterval(this.intervalId);
    if (task.onStop) {
      task.onStop();
    }
  }

  async runTask() {
    const { task, taskName, intervalMs } = this;
    if (!this.semaphore) {
      if (task.onRunSkip) {
        task.onRunSkip();
      }
      return false;
    }

    this.semaphore = false;
    this.runNumber = this.runNumber + 1;
    let result = false;
    try {
      await task.run(this.runNumber, intervalMs);
      result = true;
      if (task.onRunSuccess) {
        task.onRunSuccess();
      }
    } catch (error) {
      if (task.onRunError) {
        task.onRunError();
      } else {
        logger.error(`Timer ${taskName} run #${this.runNumber} error: ${error}`);
      }
    }
    this.semaphore = true;
    return result;
  }
}

/* eslint-disable class-methods-use-this */
// Don't requre hooks to be static for consitency.
// TimerTask implementations decide whether they need to use this in them.
class SchedulesTimerTask {
  constructor({ db, schedulesService, schedulesList }) {
    this.db = db;
    this.schedulesService = schedulesService;
    this.schedulesList = schedulesList;
  }

  async run(runNumber, intervalMs) {
    logger.verbose(`Schedules refresh run #${runNumber}, every ${intervalMs}ms`);
    const result = await this.schedulesService.load(this.schedulesList);
    if (result) {
      // Todo: refresh without full override.
      this.db.set('schedules', this.schedulesService);
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
    this.schedulesService = new SchedulesService(this.pagerDutyClient);
    this.schedulesTimer = false;
  }

  // ------- Public API  -------------------------------------------------------

  async start() {
    const { db } = this;
    logger.debug('Initializing database.');
    db.set('schedules', new Map());

    await this.startSchedulesWorker();
    return true;
  }

  async stop() {
    if (this.schedulesTimer) {
      await this.schedulesTimer.stop();
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

    const schedulesTimerTask = new SchedulesTimerTask({
      db: this.db,
      schedulesService: this.schedulesService,
      schedulesList,
    });
    this.schedulesTimer = new Timer(schedulesTimerTask, refreshRateMS);
    await this.schedulesTimer.start();
  }

  // ------- Class end  --------------------------------------------------------
}

// ------- End -----------------------------------------------------------------
