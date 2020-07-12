// ------- Imports -------------------------------------------------------------
import { URL, URLSearchParams } from 'url';

import fetch from 'node-fetch';

// ------- Internal imports ----------------------------------------------------

import { PagerBeautyError } from '../errors';

export class PagerDutyClientError extends PagerBeautyError {}
export class PagerDutyClientRequestError extends PagerDutyClientError {}
export class PagerDutyClientResponseParseError extends PagerDutyClientError {}
export class PagerDutyClientResponseHttpError extends PagerDutyClientError {
  constructor(statusCode, statusText) {
    super(`${statusCode} ${statusText}`);
  }
}
export class PagerDutyClientResponseKnownError extends PagerDutyClientError {
  constructor(message, errorCode, errors = false) {
    super(message);
    this.errorCode = errorCode;
    if (errors) {
      this.errors = errors;
    }
  }
}

// ------- Internal imports ----------------------------------------------------

export const INCLUDE_USERS = 'users';
export const INCLUDE_SCHEDULES = 'schedules';
export const INCLUDE_ESCALATION_POLICIES = 'escalation_policies';

export const INCIDENT_STATUS_TRIGGERED = 'triggered';
export const INCIDENT_STATUS_ACKNOWLEDGED = 'acknowledged';
export const INCIDENT_STATUS_RESOLVED = 'resolved';

// ------- PagerDutyClient -----------------------------------------------------

export class PagerDutyClient {
  constructor(apiKey, apiUrl) {
    this.apiUrl = apiUrl || 'https://api.pagerduty.com';
    this.apiKey = apiKey;
  }

  async abilities() {
    return this.get('abilities');
  }

  async oncalls(scheduleIds, include = false) {
    const searchParams = new URLSearchParams(
      scheduleIds.map((id) => ['schedule_ids[]', id]),
    );
    // Set limit to maximum possible value. Note that the number of results is
    // the aggregate of all escalation policies of all schedule has.
    // https://v2.developer.pagerduty.com/v2/docs/pagination
    searchParams.append('limit', 100);

    const allowedIncludes = new Set([
      INCLUDE_USERS,
      INCLUDE_SCHEDULES,
      INCLUDE_ESCALATION_POLICIES,
    ]);
    if (include) {
      PagerDutyClient.attachIncludeFields(searchParams, include, allowedIncludes);
    }

    const response = await this.get('oncalls', searchParams);
    if (response.oncalls === undefined) {
      throw new PagerDutyClientResponseParseError('Unexpected parsing errors');
    }

    return response.oncalls;
  }

  async getOnCallForSchedule(scheduleId, include = false) {
    const searchParams = new URLSearchParams([
      ['schedule_ids[]', scheduleId],
    ]);
    // Just load one oncall.
    searchParams.append('limit', 1);

    const allowedIncludes = new Set([
      INCLUDE_USERS,
      INCLUDE_SCHEDULES,
      INCLUDE_ESCALATION_POLICIES,
    ]);
    if (include) {
      PagerDutyClient.attachIncludeFields(searchParams, include, allowedIncludes);
    }

    const response = await this.get('oncalls', searchParams);
    if (response.oncalls === undefined) {
      throw new PagerDutyClientResponseParseError('Unexpected parsing errors');
    }

    const record = response.oncalls[0];

    // Ensure correct record.
    if (!record || !record.schedule || !record.schedule.id) {
      throw new PagerDutyClientResponseParseError(
        `On-Call unexpected response: ${JSON.stringify(record)}`,
      );
    }

    // Returned record for incorrect schedule. Shouldn't happen.
    if (record.schedule.id !== scheduleId) {
      throw new PagerDutyClientResponseParseError(
        `On-Call is returned for unexpected schedule: ${record.schedule.id}, `
        + `expected: ${scheduleId}`,
      );
    }

    return record;
  }

  async getActiveIncidentForUserOnSchedule(userId, scheduleEscalationPolicies) {
    const searchParams = new URLSearchParams([
      ['user_ids[]', userId],
      // Active = triggered + acknowledged
      ['statuses[]', INCIDENT_STATUS_TRIGGERED],
      ['statuses[]', INCIDENT_STATUS_ACKNOWLEDGED],
    ]);

    // Set limit to maximum possible value.
    // https://v2.developer.pagerduty.com/v2/docs/pagination
    searchParams.append('limit', 100);

    // Order: most recent on top.
    searchParams.append('sort_by', 'created_at:desc');

    const response = await this.get('incidents', searchParams);
    if (response.incidents === undefined) {
      throw new PagerDutyClientResponseParseError('Unexpected parsing errors');
    }

    // No incidents.
    if (!response.incidents.length) {
      return null;
    }

    // Active incident for this schedule.
    // Match incidents with the schedule through escalation policies.
    for (const incident of response.incidents) {
      // Find the one with the right schedule
      const escalationPolicy = incident.escalation_policy.id;
      if (!escalationPolicy) {
        continue;
      }
      if (scheduleEscalationPolicies.has(escalationPolicy)) {
        return incident;
      }
    }
    // Not found.
    return null;
  }

  async getSchedule(scheduleId) {
    const response = await this.get(`schedules/${scheduleId}`);
    if (response.schedule === undefined || !response.schedule.id) {
      throw new PagerDutyClientResponseParseError('Unexpected parsing errors');
    }
    return response.schedule;
  }

  async getUserContactMethods(userId) {
    const response = await this.get(`users/${userId}/contact_methods`);
    if (response.contact_methods === undefined
        || !response.contact_methods || !response.contact_methods.length) {
      throw new PagerDutyClientResponseParseError('Unexpected parsing errors');
    }
    return response.contact_methods;
  }

  async get(endpoint, searchParams) {
    const url = new URL(endpoint, this.apiUrl);
    if (searchParams) {
      url.search = searchParams;
    }

    const params = {
      headers: this.headers(),
    };
    return PagerDutyClient.request(fetch(url, params));
  }

  headers() {
    return {
      Accept: 'application/vnd.pagerduty+json;version=2',
      Authorization: `Token token=${this.apiKey}`,
    };
  }

  static async request(fetchPromise) {
    let response;
    try {
      response = await fetchPromise;
    } catch (e) {
      throw new PagerDutyClientRequestError(e.message || e);
    }

    let json;
    try {
      json = await response.json();
    } catch (e) {
      // Can't parse json, report HTTP error if present
      if (!response.ok) {
        throw new PagerDutyClientResponseHttpError(
          response.status,
          response.statusText,
        );
      }
      throw new PagerDutyClientResponseParseError(e.message || e);
    }

    if (json.error && json.error.code) {
      throw new PagerDutyClientResponseKnownError(
        json.error.message,
        json.error.code,
        json.error.errors,
      );
    }

    return json;
  }

  static attachIncludeFields(searchParams, input, allowed) {
    for (const field of input) {
      if (allowed.has(field)) {
        searchParams.append('include[]', field);
      } else {
        throw new PagerDutyClientRequestError(`Include ${field} is not allowed`);
      }
    }
  }

  // ------- Class end  --------------------------------------------------------
}

// ------- End -----------------------------------------------------------------
