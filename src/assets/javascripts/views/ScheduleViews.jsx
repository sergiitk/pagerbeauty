'use strict';

import React from 'react';

export class SchedulesListView extends React.Component {
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
      .then((response) => {
        if (!response.ok) {
            throw Error(response.statusText);
        }

        return response.json();
      })
      .then((schedules) => {
        this.setState({ isLoaded: true, schedules });
      })
      .catch((error) => {
        this.setState({ isLoaded: true, error });
      })
  }

  render() {
    const { error, isLoaded, schedules } = this.state;
    if (!isLoaded) {
      return <span>Loading...</span>;
    }
    if (error) {
      return <span>Loading error: {error.message}</span>;
    }

    const schedulesListItems = schedules.map((schedule) =>
      <SchedulesListItemView key={schedule.scheduleId} schedule={schedule} />
    );

    return <ul>{schedulesListItems}</ul>;
  }
}

export class SchedulesListItemView extends React.Component {
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
