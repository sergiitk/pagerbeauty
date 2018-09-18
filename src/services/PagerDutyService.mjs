// ------- Imports -------------------------------------------------------------

import fetch from 'node-fetch';

// ------- Internal imports ----------------------------------------------------

import { PagerBeautyError } from '../errors'

export class PagerDutyServiceError extends PagerBeautyError {}
export class PagerDutyServiceRequestError extends PagerDutyServiceError {}
export class PagerDutyServiceParseError extends PagerDutyServiceError {}
export class PagerDutyServiceResponseError extends PagerDutyServiceError {
  constructor(messaage, errorCode) {
    super(messaage);
    this.errorCode = errorCode;
  }
}

// ------- PagerDutyService ----------------------------------------------------

export class PagerDutyService {
  constructor(apiKey) {
    this.apiUrl = 'https://api.pagerduty.com';
    this.apiKey = apiKey;
  }

  async abilities() {
    const response = await this.get('abilities');
    return response;
  }

  async get(endpoint) {
    const headers = this.headers()
    let result;
    try {
      result = await fetch(`${this.apiUrl}/${endpoint}`, {
        headers,
      });
    } catch (e) {
      throw new PagerDutyServiceRequestError();
    }

    let json;
    try {
      json = await result.json();
    } catch (e) {
      throw new PagerDutyServiceParseError();
    }

    if (json.error && json.error.code) {
      throw new PagerDutyServiceResponseError(json.error.message, json.error.code);
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
