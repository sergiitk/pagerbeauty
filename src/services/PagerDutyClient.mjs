// ------- Imports -------------------------------------------------------------

import { URL, URLSearchParams } from 'url';

import fetch from 'node-fetch';

// ------- Internal imports ----------------------------------------------------

import { PagerBeautyError } from '../errors'

export class PagerDutyClientError extends PagerBeautyError {}
export class PagerDutyClientRequestError extends PagerDutyClientError {}
export class PagerDutyClientParseError extends PagerDutyClientError {}
export class PagerDutyClientResponseError extends PagerDutyClientError {
  constructor(messaage, errorCode, errors = false) {
    super(messaage);
    this.errorCode = errorCode;
    if (errors) {
      this.errors = errors;
    }
  }
}

// ------- PagerDutyClient -----------------------------------------------------

export class PagerDutyClient {
  constructor(apiKey) {
    this.apiUrl = 'https://api.pagerduty.com';
    this.apiKey = apiKey;
  }

  async abilities() {
    return this.get('abilities');
  }

  async schedules(schedules) {
    const searchParams = new URLSearchParams(
      schedules.map(id => ['schedule_ids[]', id])
    );
    const response = await this.get('oncalls', searchParams);
    return response;
  }

  async get(endpoint, searchParams) {
    const url = new URL(endpoint, this.apiUrl);
    url.search = searchParams;

    const params = {
      headers: this.headers(),
    }
    return this.request(fetch(url, params));
  }

  async request(fetchPromise) {
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

  headers() {
    return {
      Accept: "application/vnd.pagerduty+json;version=2",
      Authorization: `Token token=${this.apiKey}`,
    }
  }

}

// ------- End -----------------------------------------------------------------
