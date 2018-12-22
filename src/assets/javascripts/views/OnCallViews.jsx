'use strict';

// ------- Imports -------------------------------------------------------------

import React from 'react';

// ------- Internal imports ----------------------------------------------------

import { OnCall } from '../../../models/OnCall.mjs';
import { PagerBeautyFetchNotFoundUiError } from '../ui-errors';
import { StatusIndicatorView } from './StatusIndicatorView';

// ------- OnCallView ----------------------------------------------------------

export class OnCallView extends React.Component {
  render() {
    const { isLoaded, data, error, isFetching } = this.props;

    const is404 = error instanceof PagerBeautyFetchNotFoundUiError;

    // Handle cases prior to first successful data load.
    if (!isLoaded && !is404) {
      if (error) {
        // Data hasn't been loaded even once, got an error.
        return <span>Loading error: {error.message}</span>;
      }
      // Still loading.
      return <span>Loading...</span>;
    }

    // Not first load:
    // Ignore errors and show stale content after first successful data load.
    // 404s should reset content
    // @todo: update report errors

    let onCall;
    let userInfo;
    if (!is404) {
      onCall = new OnCall(data);
      userInfo = {
        name: onCall.userName,
        url: onCall.userURL,
        avatar: onCall.userAvatarSized(),
      };
    }

    return (
      <div className={'schedule ' + (is404 ? 'not_found' : '')}>
        { /* Header */ }
        <OnCallScheduleRowView filled>
          <span>ON CALL</span>
          <OnCallStatusIndicatorView error={error} isFetching={isFetching} />
        </OnCallScheduleRowView>

        { /* Schedule name */ }
        {onCall &&
          <OnCallScheduleRowView>
            <a href={onCall.scheduleURL} className="schedule_name">{onCall.scheduleName}</a>
          </OnCallScheduleRowView>
        }

        { /* User info */ }
        <OnCallScheduleRowView equalSpacing>
          <OnCallUserInfoView userInfo={userInfo} />
        </OnCallScheduleRowView>

        { /* Dates */ }
        <OnCallScheduleRowView filled equalSpacing>
          {onCall &&
            <React.Fragment>
              <OnCallDateRowView
                className="date_start"
                label="From"
                date={onCall.dateStart}
                timezone={onCall.scheduleTimezone}
              />
              <OnCallDateRowView
                className="date_end"
                label="To"
                date={onCall.dateEnd}
                timezone={onCall.scheduleTimezone}
              />
            </React.Fragment>
          }
        </OnCallScheduleRowView>

        { /* End */ }
      </div>
    )
  }
}

// ------- OnCallScheduleRowView -----------------------------------------------

export class OnCallScheduleRowView extends React.Component {
  render() {
    const { equalSpacing, filled, children } = this.props;
    const classes = ['schedule_row'];
    if (equalSpacing) {
      classes.push('equal_spacing');
    }
    if (filled) {
      classes.push('filled_row');
    }
    return <div className={classes.join(' ')}>{children}</div>;
  }
}

// ------- OnCallStatusIndicatorView -------------------------------------------

export class OnCallStatusIndicatorView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isBlinking: false,
    };
    this.timeoutId = false;
  }

  componentWillUnmount() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  registerBlink() {
    // Blink for 3 seconds
    const { isBlinking } = this.state;
    if (isBlinking) {
      return;
    }
    this.setState({ isBlinking: true })
    this.timeoutId = setTimeout(() => {
      this.setState({ isBlinking: false })
    }, 2000);
  }

  componentDidUpdate(prevProps) {
    // Blink for next 3 seconds when swithcing state
    const { isFetching } = this.props;
    const { isBlinking } = this.state;

    if (!prevProps.isFetching && this.props.isFetching) {
      this.registerBlink();
    }
  }

  render() {
    const { error, isFetching } = this.props;
    const { isBlinking } = this.state;

    let type = 'success';
    let blink = false;
    if (error instanceof PagerBeautyFetchNotFoundUiError) {
      // No one on call.
      type = 'error';
      blink = 'slow';
    } else if (error) {
      // All errors
      type = 'warning';
      blink = 'fast';
    } else {
      // Success
      type = 'success';
      // Blink on success in post-render componentDidUpdate.
      if (isBlinking) {
        blink = 'fast';
      }
    }

    let title = 'OK';
    if (error) {
      title = error.toString();
    }

    return <StatusIndicatorView type={type} blink={blink} title={title} />
  }
}

// ------- OnCallUserInfoView --------------------------------------------------

export class OnCallUserInfoView extends React.Component {
  render() {
    const { userInfo } = this.props;
    return (
      <React.Fragment>
        <div className="user_avatar">
          {userInfo ? (
             <a href={userInfo.url}><img src={userInfo.avatar} /></a>
           ) : (
             <img src="https://www.gravatar.com/avatar/0?s=2048&amp;d=mp" />
           )}
        </div>
        <div className={'user_name ' + (!userInfo ? 'error' : '')}>
          {userInfo ? (
             <a href={userInfo.url}>{userInfo.name}</a>
           ) : (
             "No one is on call"
           )}
        </div>
      </React.Fragment>
    )
  }
}

// ------- OnCallDateTimeView --------------------------------------------------

export class OnCallDateRowView extends React.Component {
  render() {
    const { date, timezone, className, children, label } = this.props;

    return (
      <div className={`date ${className}`}>
        <span>{label}: </span>
        <OnCallDateTimeView date={date} timezone={timezone} />
      </div>
    );
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
