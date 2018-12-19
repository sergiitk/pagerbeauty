// ------- Imports -------------------------------------------------------------

// ------- Internal imports ----------------------------------------------------

import { OnCall } from '../models/OnCall';
import { INCLUDE_USERS, INCLUDE_SCHEDULES } from './PagerDutyClient';

// ------- SchedulesService -----------------------------------------------------

export class SchedulesService {
  constructor(pagerDutyClient) {
    this.client = pagerDutyClient;
    this.onCallRepo = new Map();
  }

  async load(scheduleIds) {
    let records;
    try {
      const includeFlags = new Set([INCLUDE_USERS, INCLUDE_SCHEDULES]);
      records = await this.client.oncalls(scheduleIds, includeFlags);
    } catch (e) {
      // console.log(e);
      throw e;
    }

    for (const record of records) {
      const oncall = OnCall.fromApiRecord(record);
      if (oncall.scheduleId) {
        this.onCallRepo.set(oncall.scheduleId, oncall);
      }
    }
  }

  serialize() {
    return Array.from(this.onCallRepo.values(), r => r.serialize());
  }
  // ------- Class end  --------------------------------------------------------
}

// ------- End -----------------------------------------------------------------
