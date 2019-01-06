// ------- Imports -------------------------------------------------------------

import logger from 'winston';

// ------- Internal imports ----------------------------------------------------

// ------- Timer ---------------------------------------------------------------

export class Timer {
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
        logger.warn(`Timer ${taskName} run #${this.runNumber} error: ${error}`);
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

// ------- End -----------------------------------------------------------------
