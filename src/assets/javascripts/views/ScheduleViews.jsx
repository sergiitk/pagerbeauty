'use strict';

// ------- Imports -------------------------------------------------------------

import React from 'react';

// ------- SchedulesListView ---------------------------------------------------

export class SchedulesListView extends React.Component {
  render() {
    const { data, error, isLoading } = this.props;
    if (isLoading) {
      return <span>Loading...</span>;
    }
    if (error) {
      return <span>Loading error: {error.message}</span>;
    }

    const schedulesListItems = data.map((schedule) =>
      <SchedulesListItemView key={schedule.scheduleId} schedule={schedule} />
    );

    return <ul>{schedulesListItems}</ul>;
  }
}

// ------- SchedulesListItemView -----------------------------------------------

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

// ------- End -----------------------------------------------------------------
