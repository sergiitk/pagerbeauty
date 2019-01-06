// ------- Imports -------------------------------------------------------------

import logger from 'winston';

// ------- OnCallsTimerTask ----------------------------------------------------

export class OnCallsTimerTask {
  constructor({ db, onCallsService }) {
    this.db = db;
    this.onCallsService = onCallsService;
  }

  async run(runNumber, intervalMs) {
    logger.verbose(`On-calls refresh run #${runNumber}, every ${intervalMs}ms`);
    const schedules = this.db.get('schedules');
    const result = await this.onCallsService.load(schedules);
    if (result) {
      // @todo: refresh without full override.
      this.db.set('oncalls', this.onCallsService);
    }
    return result;
  }

  onRunSkip() {
    logger.warn(
      'Attempting On-calls refresh while the previous request is '
      + 'still running. This should not normally happen. Try decreasing '
      + 'refresh rate',
    );
  }
}

// ------- End -----------------------------------------------------------------
