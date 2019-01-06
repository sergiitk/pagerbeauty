// ------- Imports -------------------------------------------------------------

import logger from 'winston';

// ------- Internal imports ----------------------------------------------------

import { PagerBeautyInitError } from '../errors';
import { PagerDutyClient } from '../services/PagerDutyClient';
import { OnCallsService } from '../services/OnCallsService';

// ------- Class ---------------------------------------------------------------

class Timer {
  constructor(task, intervalMs) {
    this.task = task;
    this.taskName = task.name || task.constructor.name;
    this.intervalMs = intervalMs;
    this.intervalId = false;
    this.semaphore = true;
    this.runNumber = 0;
  }

  async start() {
    const { intervalMs, task, taskName } = this;
    logger.debug(`Scheduling ${taskName} every ${intervalMs}ms`);
    if (task.onStart) {
      this.runHookSafely('onStart', intervalMs);
    }
    // @todo: Unit test the hell out of it.
    // Run the task first time immediately.
    await this.runTask();
    // Schedule timer after the task is done.
    this.intervalId = setInterval(() => this.runTask(), intervalMs);
  }

  async stop() {
    const { task, taskName } = this;
    logger.debug(`Stopping ${taskName}`);
    clearInterval(this.intervalId);
    if (task.onStop) {
      this.runHookSafely('onStop');
    }
  }

  // MUST not throw errors.
  async runTask() {
    const { task, taskName, intervalMs } = this;
    if (!this.semaphore) {
      if (task.onRunSkip) {
        this.runHookSafely('onRunSkip');
      }
      return false;
    }

    // Red the semaphore.
    this.semaphore = false;
    this.runNumber = this.runNumber + 1;
    let result = false;
    try {
      await task.run(this.runNumber, intervalMs);
      result = true;
    } catch (error) {
      if (task.onRunError) {
        this.runHookSafely('onRunError');
      } else {
        logger.error(`Timer ${taskName} run #${this.runNumber} error: ${error}`);
      }
    } finally {
      // Always green the semaphore: on errors timer continues to run tasks.
      this.semaphore = true;
    }
    if (result) {
      this.runHookSafely('onRunSuccess');
    }
    return result;
  }

  runHookSafely(hookName, ...args) {
    const { task, taskName } = this;
    try {
      if (typeof task[hookName] === 'function') {
        task[hookName](...args);
      }
    } catch (error) {
      logger.error(`Unexpected ${taskName} error in hook ${hookName}: ${error}`);
    }
  }
}

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
