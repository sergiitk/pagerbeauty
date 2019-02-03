// ------- Imports -------------------------------------------------------------

import PropTypes from 'prop-types';
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
      const item = <SchedulesListItemView key={schedule.id} schedule={schedule} />;
      return item;
    });

    return <ul className="schedules_list">{schedulesListItems}</ul>;
  }
}

SchedulesListView.propTypes = {
  isLoaded: PropTypes.bool,
  isFetching: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
  data: PropTypes.arrayOf(PropTypes.object),
  error: PropTypes.instanceOf(Error),
};

SchedulesListView.defaultProps = {
  isLoaded: false,
  isFetching: false,
  data: [],
  error: null,
};

// ------- SchedulesListItemView -----------------------------------------------

export class SchedulesListItemView extends React.Component {
  render() {
    const { schedule } = this.props;
    return (
      <li>
        <a href={`/v1/schedules/${schedule.id}.html`}>
          {schedule.name}
        </a>
      </li>
    );
  }
}

SchedulesListItemView.propTypes = {
  schedule: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

// ------- End -----------------------------------------------------------------
