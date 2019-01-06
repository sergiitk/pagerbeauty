// ------- Imports -------------------------------------------------------------

import logger from 'winston';

// ------- Internal imports ----------------------------------------------------

// import { OnCall } from '../models/OnCall';

// ------- IncidentsService ----------------------------------------------------

export class IncidentsService {
  constructor(pagerDutyClient) {
    this.client = pagerDutyClient;
    this.incidentsRepo = new Map();
  }

  async load(onCallsService) {
    const onCalls = onCallsService.onCallRepo;
    if (!onCalls.size) {
      logger.verbose('Skipping incidents load: OnCalls not loaded yet');
      return false;
    }

    const missingSchedules = new Set();

    for (const [scheduleId, onCall] of onCalls.entries()) {
      try {
        // Limit the number of requests by sending them in sync.
        // eslint-disable-next-line no-await-in-loop
        const record = await this.client.getActiveIncidentForUserOnSchedule(
          onCall.userId,
          scheduleId,
        );
        // console.dir(record, { colors: true, showHidden: true });

        // const oncall = OnCall.fromApiRecord(record, schedule);
        // logger.verbose(`On-call for schedule ${schedule.id} is loaded`);
        // logger.silly(`On-call loaded ${oncall.toString()}`);
        this.incidentsRepo.set(scheduleId, record);
      } catch (e) {
        logger.warn(
          `Error loading incident for user ${onCall.userId} `
          + `on schedule ${scheduleId}: ${e}`,
        );
      }
    }

    if (missingSchedules.size) {
      logger.warn(
        `Missing incidents data for schedules: ${Array.from(missingSchedules).join()}`,
      );
    }
    return true;
  }

  serialize() {
    return Array.from(this.incidentsRepo.values(), r => r.serialize());
  }
  // ------- Class end  --------------------------------------------------------
}

// ------- End -----------------------------------------------------------------
