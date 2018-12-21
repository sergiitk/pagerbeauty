/* eslint-disable */

import React from 'react';
import ReactDOM from 'react-dom';

import { SchedulesListView } from './ScheduleViews';
import { OnCallLoaderView } from './OnCallViews';

// Render schedules list
const schedulesListRoot = document.getElementById('schedules_list');
if (schedulesListRoot) {
  ReactDOM.render(<SchedulesListView></SchedulesListView>, schedulesListRoot);
}

// Render individual schedules
document.querySelectorAll('.on_call_root').forEach((schedule) => {
  ReactDOM.render(
    <OnCallLoaderView scheduleId={schedule.dataset.id}></OnCallLoaderView>,
    schedule
  );
})

// Old-school refresh. To be replaced with React component states.
window.onload = function() {
  window.setTimeout(function() {
    location.reload();
  }, 60000); // 1 minute
}
