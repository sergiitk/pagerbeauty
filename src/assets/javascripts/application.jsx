/* eslint-disable */

import React from 'react';
import ReactDOM from 'react-dom';

import { SchedulesList, Schedule } from './schedules';

// Render schedules list
const schedulesListRoot = document.getElementById('schedules_list');
if (schedulesListRoot) {
  ReactDOM.render(<SchedulesList></SchedulesList>, schedulesListRoot);
}

// Render individual schedules
document.querySelectorAll('.schedule_root').forEach((schedule) => {
  ReactDOM.render(<Schedule scheduleId={schedule.dataset.id}></Schedule>, schedule);
})

// Old-school refresh. To be replaced with React component states.
window.onload = function() {
  window.setTimeout(function() {
    location.reload();
  }, 60000); // 1 minute
}
