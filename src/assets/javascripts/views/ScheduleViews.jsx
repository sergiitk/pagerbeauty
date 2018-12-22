// ------- Imports -------------------------------------------------------------

import React from 'react';

// ------- SchedulesListView ---------------------------------------------------

export class SchedulesListView extends React.Component {
  render() {
    const { isLoaded, data, error } = this.props;

    // Handle cases prior to first successful data load.
    if (!isLoaded) {
      if (error) {
        // Data hasn't been loaded even once, got an error.
        return <span>{`Loading error: ${error.message}`}</span>;
      }
      // Still loading.
      return <span>Loading...</span>;
    }

    // Ignore errors and show stale content after first successful data load.
    const schedulesListItems = data.map((schedule) => {
      const item = <SchedulesListItemView key={schedule.scheduleId} schedule={schedule} />;
      return item;
    });

    return <ul>{schedulesListItems}</ul>;
  }
}

// ------- SchedulesListItemView -----------------------------------------------

export class SchedulesListItemView extends React.Component {
  render() {
    const { schedule } = this.props;
    return (
      <li>
        <a href={`/v1/schedules/${schedule.scheduleId}.html`}>
          {schedule.scheduleName}
        </a>
      </li>);
  }
}

// ------- End -----------------------------------------------------------------
