'use strict';

// ------- Imports -------------------------------------------------------------

import React from 'react';

// ------- Internal imports ----------------------------------------------------

import { PagerBeautyHttpNotFoundUiError } from '../ui-errors';
import { OnCall } from '../../../models/OnCall.mjs';

// ------- OnCallLoaderView ----------------------------------------------------

export class OnCallLoaderView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      onCall: {}
    };
  }

  componentDidMount() {
    // Todo: verify/sanitize scheduleId
    fetch(`/v1/schedules/${this.props.scheduleId}.json`)
      .then((response) => {
        if (!response.ok) {
            throw new PagerBeautyHttpNotFoundUiError(response.statusText);
        }

        return response.json();
      })
      .then((data) => {
        const onCall = new OnCall(data);
        this.setState({ isLoaded: true, onCall });
      })
      .catch((error) => {
        this.setState({ isLoaded: true, error });
      })
  }

  render() {
    const { error, isLoaded, onCall } = this.state;
    if (!isLoaded) {
      return <span>Loading...</span>;
    }
    if (error) {
      if (error instanceof PagerBeautyHttpNotFoundUiError) {
        return <OnCallNotFoundView />;
      }
      return <span>Loading error: {error.message}</span>;
    }

    return <OnCallView onCall={onCall} />
  }
}

// ------- OnCallView ----------------------------------------------------------

export class OnCallView extends React.Component {
  render() {
    const { onCall } = this.props;
    return <div className="schedule">
      <div className="schedule_row filled_row">ON CALL</div>
      <div className="schedule_row">
        <a href={onCall.scheduleURL} className="schedule_name">{onCall.scheduleName}</a>
      </div>
      <div className="schedule_row">
        <div className="user_avatar">
        <a href={onCall.userURL}><img src={onCall.userAvatarSized()}></img></a>
        </div>
        <div className="user_name"><a href={onCall.userURL}>{onCall.userName}</a></div>
      </div>
      <div className="schedule_row filled_row">
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
