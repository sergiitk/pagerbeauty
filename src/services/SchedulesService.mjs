// ------- Imports -------------------------------------------------------------

import logger from 'winston';

// ------- Internal imports ----------------------------------------------------

import { Schedule } from '../models/Schedule';

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
        const record = await this.client.getSchedule(scheduleId);
        const schedule = Schedule.fromApiRecord(record);
        if (schedule.id) {
          logger.verbose(`Schedule ${schedule.id} is loaded`);
          logger.silly(`Schedule loaded ${schedule.toString()}`);
          this.schedulesRepo.set(schedule.id, schedule);
        }
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
