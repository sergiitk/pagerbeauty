// ------- Imports -------------------------------------------------------------

import logger from 'winston';

// ------- Internal imports ----------------------------------------------------

import { OnCall } from '../models/OnCall';
import { INCLUDE_USERS } from './PagerDutyClient';

// ------- OnCallsService ------------------------------------------------------

export class OnCallsService {
  constructor(pagerDutyClient) {
    this.client = pagerDutyClient;
    this.onCallRepo = new Map();
  }

  async load(schedulesService) {
    const schedules = schedulesService.schedulesRepo;
    if (!schedules.size) {
      logger.verbose('Skipping on-calls load: Schedules not loaded yet');
      return false;
    }

    const missingSchedules = new Set();
    const includeFlags = new Set([INCLUDE_USERS]);

    for (const schedule of schedules.values()) {
      try {
        // Limit the number of requests by sending them in sync.
        // eslint-disable-next-line no-await-in-loop
        const record = await this.client.getOnCallForSchedule(
          schedule.id,
          includeFlags,
        );

        const oncall = OnCall.fromApiRecord(record, schedule);
        logger.verbose(`On-call for schedule ${schedule.id} is loaded`);
        logger.silly(`On-call loaded ${oncall.toString()}`);
        this.onCallRepo.set(schedule.id, oncall);
      } catch (e) {
        logger.warn(`Error loading on-call for ${schedule.id}: ${e}`);
      }
    }

    if (missingSchedules.size) {
      logger.warn(
        `Missing oncall data for schedules: ${Array.from(missingSchedules).join()}`,
      );
    }
    return true;
  }

  serialize() {
    return Array.from(this.onCallRepo.values(), r => r.serialize());
  }
  // ------- Class end  --------------------------------------------------------
}

// ------- End -----------------------------------------------------------------
