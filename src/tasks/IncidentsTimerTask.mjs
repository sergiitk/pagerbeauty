// ------- Imports -------------------------------------------------------------

import logger from 'winston';

// ------- IncidentsTimerTask --------------------------------------------------

export class IncidentsTimerTask {
  constructor({ db, incidentsService }) {
    this.db = db;
    this.incidentsService = incidentsService;
  }

  async run(runNumber, intervalMs) {
    logger.verbose(`Incidents refresh run #${runNumber}, every ${intervalMs}ms`);
    const oncalls = this.db.get('oncalls');
    const result = await this.incidentsService.load(oncalls);
    if (result) {
      // @todo: refresh without full override.
      this.db.set('incidents', this.incidentsService);
    }
    return result;
  }

  onRunSkip() {
    logger.warn(
      'Attempting incidents refresh while the previous request is '
      + 'still running. This should not normally happen. Try decreasing '
      + 'refresh rate',
    );
  }
}

// ------- End -----------------------------------------------------------------
