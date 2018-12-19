// ------- Imports -------------------------------------------------------------

// This model to be compatible both with backend and frontend.

import 'url';

import 'url-search-params-polyfill';
import moment from 'moment';

// ------- OnCall --------------------------------------------------------------

export class OnCall {
  constructor({
    scheduleId,
    scheduleName,
    scheduleURL,
    scheduleTimezone,
    userId,
    userName,
    userAvatarURL,
    userURL,
    dateStart,
    dateEnd,
  }) {
    this.scheduleId = scheduleId;
    this.scheduleName = scheduleName;
    this.scheduleURL = scheduleURL;
    this.scheduleTimezone = scheduleTimezone;
    this.userId = userId;
    this.userName = userName;
    this.userAvatarURL = userAvatarURL;
    this.userURL = userURL;
    this.dateStart = moment(dateStart);
    this.dateEnd = moment(dateEnd);
  }

  serialize() {
    return {
      scheduleId: this.scheduleId,
      scheduleName: this.scheduleName,
      scheduleURL: this.scheduleURL,
      scheduleTimezone: this.scheduleTimezone,
      userId: this.userId,
      userName: this.userName,
      userAvatarURL: this.userAvatarURL,
      userURL: this.userURL,
      dateStart: this.dateStart.utc(),
      dateEnd: this.dateEnd.utc(),
    };
  }

  userAvatarSized(size = 2048) {
    const url = new URL(this.userAvatarURL);
    const searchParams = new URLSearchParams(url.searchParams);
    searchParams.append('s', size);
    url.search = searchParams;
    return url.href;
  }

  static fromApiRecord(record) {
    const attributes = {
      scheduleId: record.schedule.id,
      scheduleName: record.schedule.summary,
      scheduleURL: record.schedule.html_url,
      scheduleTimezone: record.schedule.time_zone,
      userId: record.user.id,
      userName: record.user.name,
      userAvatarURL: record.user.avatar_url,
      userURL: record.user.html_url,
      dateStart: record.start,
      dateEnd: record.end,
    };
    return new OnCall(attributes);
  }
  // ------- Class end  --------------------------------------------------------
}

// ------- End -----------------------------------------------------------------
