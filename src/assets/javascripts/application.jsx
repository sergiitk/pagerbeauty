/* eslint-disable */

import React from 'react';
import ReactDOM from 'react-dom';

import { SchedulesList } from './schedules';

// Render schedules list
const schedulesListRoot = document.getElementById('schedules_list');
if (schedulesListRoot) {
  ReactDOM.render(<SchedulesList></SchedulesList>, schedulesListRoot);
}

