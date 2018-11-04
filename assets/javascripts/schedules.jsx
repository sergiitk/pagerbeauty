'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

const e = React.createElement;

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
    fetch("http://localhost:8080/v1/schedules.json")
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
