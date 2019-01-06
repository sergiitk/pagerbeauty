// ------- Imports -------------------------------------------------------------

import logger from 'winston';

// ------- Internal imports ----------------------------------------------------

// import { OnCall } from '../models/OnCall';

// ------- SchedulesService ------------------------------------------------------

export class SchedulesService {
  constructor(pagerDutyClient) {
    this.client = pagerDutyClient;
    this.schedulesRepo = new Map();
  }

  async load(scheduleIds) {
    logger.verbose(`Loading schedules ${scheduleIds}`);

    for (const scheduleId of scheduleIds) {
      try {
        // Limit the number of requests by sending them in sync.
        // eslint-disable-next-line no-await-in-loop
        const schedule = await this.client.getSchedule(scheduleId);
        // @todo: model.
        this.schedulesRepo.set(schedule.id, schedule);
      } catch (e) {
        logger.warn(`Error loading schedule ${scheduleId}: ${e}`);
        this.schedulesRepo.set(scheduleId, null);
      }
    }
    return true;
  }

  serialize() {
    return Array.from(this.schedulesRepo.values(), r => r.serialize());
  }
  // ------- Class end  --------------------------------------------------------
}

// ------- End -----------------------------------------------------------------
