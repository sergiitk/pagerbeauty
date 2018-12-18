// ------- Imports -------------------------------------------------------------

// ------- Internal imports ----------------------------------------------------

import { OnCall } from '../models/OnCall';
import { INCLUDE_USERS } from './PagerDutyClient';

// ------- SchedulesService -----------------------------------------------------

export class SchedulesService {
  constructor(pagerDutyClient) {
    this.client = pagerDutyClient;
    this.onCallRepo = new Map();
  }

  async load(scheduleIds) {
    let records;
    try {
      records = await this.client.oncalls(scheduleIds, new Set([INCLUDE_USERS]));
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
