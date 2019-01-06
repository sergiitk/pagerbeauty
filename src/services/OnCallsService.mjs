// ------- Imports -------------------------------------------------------------

import logger from 'winston';

// ------- Internal imports ----------------------------------------------------

import { OnCall } from '../models/OnCall';
import { INCLUDE_USERS, INCLUDE_SCHEDULES } from './PagerDutyClient';

// ------- OnCallsService ------------------------------------------------------

export class OnCallsService {
  constructor(pagerDutyClient) {
    this.client = pagerDutyClient;
    this.onCallRepo = new Map();
  }

  async load(schedules) {
    const scheduleIds = [];
    const missingSchedules = [];
    for (const [scheduleId, schedule] of schedules.schedulesRepo.entries()) {
      if (schedule.id) {
        scheduleIds.push(scheduleId);
      } else {
        missingSchedules.push(scheduleId);
      }
    }

    logger.verbose(`Loading on-calls for schedules ${scheduleIds}`);
    if (missingSchedules) {
      logger.warn(`Missing data for schedules ${missingSchedules}`);
    }

    let records;
    try {
      const includeFlags = new Set([INCLUDE_USERS, INCLUDE_SCHEDULES]);
      records = await this.client.oncalls(scheduleIds, includeFlags);
    } catch (e) {
      logger.warn(`Error loading schedules ${scheduleIds}: ${e}`);
      throw e;
    }

    // Set of processed schedules. Needed because schedules are returned
    // once per each per each evaluation policy.
    const processed = new Set();
    for (const record of records) {
      const oncall = OnCall.fromApiRecord(record);
      if (oncall.scheduleId && !processed.has(oncall.scheduleId)) {
        logger.verbose(`On-call for schedule ${oncall.scheduleId} is loaded`);
        logger.silly(`On-call loaded ${oncall.toString()}`);
        this.onCallRepo.set(oncall.scheduleId, oncall);
        processed.add(oncall.scheduleId);
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
