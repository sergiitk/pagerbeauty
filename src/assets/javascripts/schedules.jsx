'use strict';

import React from 'react';

import { OnCall } from '../../models/OnCall.mjs';

export class SchedulesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      schedules: []
    };
  }

  componentDidMount() {
    fetch(`/v1/schedules.json`)
      .then(res => res.json())
      .then(
        (schedules) => {
          this.setState({ isLoaded: true, schedules });
        },
        (error) => {
          this.setState({ isLoaded: true, error });
        }
      )
  }

  render() {
    const { error, isLoaded, schedules } = this.state;
    if (!isLoaded) {
      return <span>Loading...</span>;
    }
    if (error) {
      return <span>Loading error: {error}</span>;
    }

    const schedulesListItems = schedules.map((schedule) =>
      <SchedulesListItem key={schedule.scheduleId} schedule={schedule} />
    );

    return <ul>{schedulesListItems}</ul>;
  }
}

export class SchedulesListItem extends React.Component {
  render() {
    const schedule = this.props.schedule;
    return (
      <li>
        <a href={`/v1/schedules/${schedule.scheduleId}.html`}>
          {schedule.scheduleName}
        </a>
      </li>);
  }
}


export class Schedule extends React.Component {
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
      .then(res => res.json())
      .then(
        (data) => {
          const onCall = new OnCall(data);
          this.setState({ isLoaded: true, onCall });
        },
        (error) => {
          this.setState({ isLoaded: true, error });
        }
      )
  }

  render() {
    const { error, isLoaded, onCall } = this.state;
    if (!isLoaded) {
      return <span>Loading...</span>;
    }
    if (error) {
      return <span>Loading error: {error}</span>;
    }

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
          <span className="date_weekday">{onCall.dateStart.format('dddd')}, </span>
          <span className="date_date">{onCall.dateStart.format('MMM DD')} </span>
          <span className="date_time">{onCall.dateStart.format('LT')}</span>
        </div>
        <div className="date date_end">
          <span>To: </span>
          <span className="date_weekday">{onCall.dateEnd.format('dddd')}, </span>
          <span className="date_date">{onCall.dateEnd.format('MMM DD')} </span>
          <span className="date_time">{onCall.dateEnd.format('LT')}</span>
        </div>
      </div>
    </div>;
  }
}
