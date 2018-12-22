'use strict';

// ------- Imports -------------------------------------------------------------

import React from 'react';

// ------- Internal imports ----------------------------------------------------

import { OnCall } from '../../../models/OnCall.mjs';
import { PagerBeautyHttpNotFoundUiError } from '../ui-errors';
import { StatusIndicatorView } from './StatusIndicatorView';

// ------- OnCallView ----------------------------------------------------------

export class OnCallView extends React.Component {
  render() {
    const { isLoaded, data, error } = this.props;

    // Show "no one on call" when on errors
    if (error instanceof PagerBeautyHttpNotFoundUiError) {
      return <OnCallNotFoundView />;
    }

    // Handle cases prior to first successful data load.
    if (!isLoaded) {
      if (error) {
        // Data hasn't been loaded even once, got an error.
        return <span>Loading error: {error.message}</span>;
      }
      // Still loading.
      return <span>Loading...</span>;
    }

    // Not first load and not 404:
    // Ignore errors and show stale content after first successful data load.
    // @todo: update report errors

    const onCall = new OnCall(data);
    return <OnCallViewFound onCall={onCall} />
  }
}

// ------- OnCallViewFound -----------------------------------------------------

export class OnCallViewFound extends React.Component {
  render() {
    const { onCall } = this.props;
    return <div className="schedule">
      <div className="schedule_row filled_row">
        <span>ON CALL</span>
        <StatusIndicatorView />
      </div>
      <div className="schedule_row">
        <a href={onCall.scheduleURL} className="schedule_name">{onCall.scheduleName}</a>
      </div>
      <div className="schedule_row equal_spacing">
        <div className="user_avatar">
        <a href={onCall.userURL}><img src={onCall.userAvatarSized()}></img></a>
        </div>
        <div className="user_name"><a href={onCall.userURL}>{onCall.userName}</a></div>
      </div>
      <div className="schedule_row filled_row equal_spacing">
        <div className="date date_start">
          <span>From: </span>
          <OnCallDateTimeView date={onCall.dateStart} timezone={onCall.scheduleTimezone} />
        </div>
        <div className="date date_end">
          <span>To: </span>
          <OnCallDateTimeView date={onCall.dateEnd} timezone={onCall.scheduleTimezone} />
        </div>
      </div>
    </div>;
  }
}

// ------- OnCallNotFoundView --------------------------------------------------

export class OnCallNotFoundView extends React.Component {
  render() {
    return <div className="schedule not_found">
      <div className="schedule_row filled_row">ON CALL</div>
        <div className="schedule_row">
          <div className="user_avatar"><img src="https://www.gravatar.com/avatar/0?s=2048&amp;d=mp" /></div>
          <div className="user_name error">No one is on call</div>
        </div>
      <div className="schedule_row filled_row"></div>
    </div>;
  }
}

// ------- OnCallDateTimeView --------------------------------------------------

export class OnCallDateTimeView extends React.Component {
  render() {
    const { date, timezone } = this.props;
    if (timezone) {
      date.tz(timezone);
    }
    return (
      <React.Fragment>
        <span className="date_weekday">{date.format('dddd')}, </span>
        <span className="date_date">{date.format('MMM DD')} </span>
        <span className="date_time">{date.format('LT')}</span>
      </React.Fragment>
    );
  }
}

// ------- End -----------------------------------------------------------------
