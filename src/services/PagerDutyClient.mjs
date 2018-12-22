// ------- Imports -------------------------------------------------------------
test
import { URL, URLSearchParams } from 'url';

import fetch from 'node-fetch';

// ------- Internal imports ----------------------------------------------------

import { PagerBeautyError } from '../errors';

export class PagerDutyClientError extends PagerBeautyError {}
export class PagerDutyClientRequestError extends PagerDutyClientError {}
export class PagerDutyClientParseError extends PagerDutyClientError {}
export class PagerDutyClientResponseError extends PagerDutyClientError {
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
      scheduleIds.map(id => ['schedule_ids[]', id]),
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
      throw new PagerDutyClientResponseError('Unexpected parsing errors');
    }

    return response.oncalls;
  }

  async get(endpoint, searchParams) {
    const url = new URL(endpoint, this.apiUrl);
    url.search = searchParams;

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
    let result;
    try {
      result = await fetchPromise;
    } catch (e) {
      throw new PagerDutyClientRequestError(e.message || e);
    }

    let json;
    try {
      json = await result.json();
    } catch (e) {
      throw new PagerDutyClientParseError(e.message || e);
    }

    if (json.error && json.error.code) {
      throw new PagerDutyClientResponseError(
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
