// ------- Imports -------------------------------------------------------------

import logger from 'winston';

// ------- SchedulesTimerTask --------------------------------------------------

export class SchedulesTimerTask {
  constructor({ db, schedulesService, schedulesList }) {
    this.db = db;
    this.schedulesService = schedulesService;
    this.schedulesList = schedulesList;
  }

  async run(runNumber, intervalMs) {
    logger.verbose(`Schedules refresh run #${runNumber}, every ${intervalMs}ms`);
    const result = await this.schedulesService.load(this.schedulesList);
    if (result) {
      // @todo: refresh without full override.
      this.db.set('schedules', this.schedulesService);
    }
    return result;
  }

  onRunSkip() {
    logger.warn(
      'Attempting schedule refresh while the previous request is '
      + 'still running. This should not normally happen. Try decreasing '
      + 'refresh rate',
    );
  }
}

// ------- End -----------------------------------------------------------------
