// ------- Imports -------------------------------------------------------------

// This model to be compatible both with backend and frontend.

import 'url';

import 'url-search-params-polyfill';
import moment from 'moment-timezone';

// ------- Internal imports ----------------------------------------------------

import { Schedule } from './Schedule';

// ------- OnCall --------------------------------------------------------------

export class OnCall {
  constructor({
    userId,
    userName,
    userAvatarURL,
    userURL,
    dateStart,
    dateEnd,
    schedule,
  }) {
    this.userId = userId;
    this.userName = userName;
    this.userAvatarURL = userAvatarURL;
    this.userURL = userURL;
    this.dateStart = moment(dateStart);
    this.dateEnd = moment(dateEnd);
    if (schedule instanceof Schedule) {
      this.schedule = schedule;
    } else {
      this.schedule = new Schedule(schedule);
    }
    this.incident = false;
  }

  serialize() {
    return {
      userId: this.userId,
      userName: this.userName,
      userAvatarURL: this.userAvatarURL,
      userURL: this.userURL,
      dateStart: this.dateStart.utc(),
      dateEnd: this.dateEnd.utc(),
      schedule: this.schedule.serialize(),
      incident: this.incident ? this.incident.serialize() : null,
    };
  }

  toString() {
    return JSON.stringify(this.serialize());
  }

  setIncident(incident) {
    this.incident = incident;
  }

  clearIncident() {
    this.incident = false;
  }

  userAvatarSized(size = 2048) {
    const url = new URL(this.userAvatarURL);
    const searchParams = new URLSearchParams(url.searchParams);
    searchParams.append('s', size);
    url.search = searchParams;
    return url.href;
  }

  static fromApiRecord(record, schedule) {
    const attributes = {
      userId: record.user.id,
      userName: record.user.name,
      userAvatarURL: record.user.avatar_url,
      userURL: record.user.html_url,
      dateStart: record.start,
      dateEnd: record.end,
      schedule,
    };
    return new OnCall(attributes);
  }
  // ------- Class end  --------------------------------------------------------
}

// ------- End -----------------------------------------------------------------
