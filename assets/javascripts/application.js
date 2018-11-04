/* eslint-disable */

import React from 'react';
import ReactDOM from 'react-dom';

import { SchedulesList } from './schedules.js';

const e = React.createElement;

const domContainer = document.querySelector('#schedules_list');
ReactDOM.render(e(SchedulesList), domContainer);
