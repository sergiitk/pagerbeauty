// ------- Imports -------------------------------------------------------------

// ------- Internal imports ----------------------------------------------------

import { INCLUDE_USERS } from './PagerDutyClient';

// ------- SchedulesService -----------------------------------------------------

export class SchedulesService {
  constructor(pagerDutyClient) {
    this.client = pagerDutyClient;
  }

  async load(scheduleIds) {
    let oncalls;
    try {
      oncalls = await this.client.oncalls(scheduleIds, new Set([INCLUDE_USERS]));
    } catch (e) {
      console.log(e);
    }

    for (const oncall of oncalls) {
      console.log(`${oncall.schedule.summary} ${oncall.user.summary}`);
    }
  }

  // ------- Class end  --------------------------------------------------------
}

// ------- End -----------------------------------------------------------------
