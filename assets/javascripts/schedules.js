'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

const e = React.createElement;

export class SchedulesList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <ul></ul>;
  }
}

export class SchedulesListItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <li>{this.props.scheduleName}</li>;
  }
}
