// ------- Imports -------------------------------------------------------------

import logger from 'winston';

// ------- Internal imports ----------------------------------------------------

import { Incident } from '../models/Incident';

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
      if (!onCall || !onCall.userId) {
        logger.verbose(
          `Skip loading incidents for schedule ${scheduleId}: `
          + 'on-call not loaded',
        );
        continue;
      }

      try {
        // Limit the number of requests by sending them in sync.
        // eslint-disable-next-line no-await-in-loop
        const record = await this.client.getActiveIncidentForUserOnSchedule(
          onCall.userId,
          onCall.schedule.escalationPolicies,
        );

        if (record) {
          const incident = Incident.fromApiRecord(record, scheduleId);
          this.incidentsRepo.set(scheduleId, incident);
          // @todo: log when oncall already has an incident and it's different
          onCall.setIncident(incident);
          logger.verbose(
            `Incident ${incident.id} is active for schedule ${scheduleId}`,
          );
          logger.silly(`Incident ${incident.toString()}`);
        } else {
          // No incidents, clear.
          const existed = this.incidentsRepo.delete(scheduleId);
          onCall.clearIncident();
          if (existed) {
            logger.verbose(`Incident resolved for schedule ${scheduleId}`);
          }
        }
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
    const result = [];
    for (const incident of this.incidentsRepo.values()) {
      if (!incident || !incident.id) {
        continue;
      }
      result.push(incident.serialize());
    }
    return result;
  }
  // ------- Class end  --------------------------------------------------------
}

// ------- End -----------------------------------------------------------------
