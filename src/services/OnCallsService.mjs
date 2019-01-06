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

  async load(schedules) {
    const scheduleIds = [];
    const missingSchedules = new Set();
    for (const [scheduleId, schedule] of schedules.schedulesRepo.entries()) {
      if (schedule.id) {
        scheduleIds.push(scheduleId);
      } else {
        missingSchedules.add(scheduleId);
      }
    }

    logger.verbose(`Loading on-calls for schedules ${scheduleIds}`);
    if (missingSchedules.size) {
      logger.warn(`Missing data for schedules: ${Array.from(missingSchedules).join()}`);
    }

    let records;
    try {
      const includeFlags = new Set([INCLUDE_USERS]);
      records = await this.client.oncalls(scheduleIds, includeFlags);
    } catch (e) {
      logger.warn(`Error loading schedules ${scheduleIds}: ${e}`);
      throw e;
    }

    // Set of processed schedules. Needed because schedules are returned
    // once per each per each evaluation policy.
    const processed = new Set();
    for (const record of records) {
      if (!record.schedule || !record.schedule.id) {
        logger.warn(`Wrong on-call record: ${record}`);
        continue;
      }
      const schedule = schedules.schedulesRepo.get(record.schedule.id);
      if (!schedule) {
        logger.warn(`Can't find schedule ${record.schedule.id} for on-call ${record}`);
        continue;
      }
      const oncall = OnCall.fromApiRecord(record, schedule);

      if (!processed.has(schedule.id)) {
        logger.verbose(`On-call for schedule ${schedule.id} is loaded`);
        logger.silly(`On-call loaded ${oncall.toString()}`);
        this.onCallRepo.set(schedule.id, oncall);
        processed.add(schedule.id);
      }
    }
    return true;
  }

  serialize() {
    return Array.from(this.onCallRepo.values(), r => r.serialize());
  }
  // ------- Class end  --------------------------------------------------------
}

// ------- End -----------------------------------------------------------------
