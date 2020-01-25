// ------- Imports -------------------------------------------------------------

import logger from 'winston';

// ------- Internal imports ----------------------------------------------------

import { OnCall } from '../models/OnCall';
import { ContactMethod } from '../models/ContactMethod';
import { INCLUDE_USERS } from './PagerDutyClient';

// ------- OnCallsService ------------------------------------------------------

export class OnCallsService {
  constructor(pagerDutyClient, params = {}) {
    this.client = pagerDutyClient;
    this.onCallRepo = new Map();

    this.userContactsFetchEnabled = params.userContactsFetchEnabled;
  }

  async load(schedulesService, incidentsService) {
    const schedules = schedulesService.schedulesRepo;
    const incidents = incidentsService.incidentsRepo;
    if (!schedules.size) {
      logger.verbose('Skipping on-calls load: Schedules not loaded yet');
      return false;
    }

    const missingSchedules = new Set();
    const includeFlags = new Set([INCLUDE_USERS]);

    for (const [scheduleId, schedule] of schedules.entries()) {
      if (!schedule || !schedule.id) {
        logger.verbose(
          `On-call for schedule ${scheduleId} skipped, schedule isn't loaded`,
        );
        this.onCallRepo.set(scheduleId, null);
        continue;
      }
      try {
        // Limit the number of requests by sending them in sync.
        // eslint-disable-next-line no-await-in-loop
        const record = await this.client.getOnCallForSchedule(
          schedule.id,
          includeFlags,
        );

        const contactMethods = [];
        if (this.userContactsFetchEnabled) {
          const { user } = record;
          try {
            // eslint-disable-next-line no-await-in-loop
            const contactMethodsResponse = await this.client.getUserContactMethods(user.id);
            for (const contactMetodRecord of contactMethodsResponse) {
              contactMethods.push(ContactMethod.fromApiRecord(contactMetodRecord));
            }
            logger.verbose(`Contact methods for user ${user.id} is loaded`);
          } catch (e) {
            logger.warn(`Error loading user contact methods for user ${user.id}: ${e}`);
          }
        }

        const onCall = OnCall.fromApiRecord(record, schedule, contactMethods);

        // Needed because of full override.
        if (incidents.has(schedule.id)) {
          onCall.setIncident(incidents.get(schedule.id));
        }

        logger.verbose(`On-call for schedule ${schedule.id} is loaded`);
        logger.silly(`On-call loaded ${onCall.toString()}`);

        this.onCallRepo.set(schedule.id, onCall);
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
    const result = [];
    for (const onCall of this.onCallRepo.values()) {
      if (!onCall) {
        continue;
      }
      result.push(onCall.serialize());
    }
    return result;
  }
  // ------- Class end  --------------------------------------------------------
}

// ------- End -----------------------------------------------------------------
