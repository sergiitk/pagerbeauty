// ------- Imports -------------------------------------------------------------

import React from 'react';
import ReactDOM from 'react-dom';

// ------- Internal imports ----------------------------------------------------

import { SchedulesListView } from './views/ScheduleViews';
import { OnCallView } from './views/OnCallViews';
import { withAjaxBackend } from './ui-backend-drivers';

// ------- Program -------------------------------------------------------------

// Pass authentication
const url = new URL(document.URL);
const accessToken = url.searchParams.get('access_token');
function authenticateBearerOrBasic(requestInit) {
  const options = requestInit;
  if (accessToken) {
    options.headers.set('Authorization', `Bearer ${accessToken}`);
    options.credentials = 'omit';
  } else {
    options.credentials = 'same-origin';
  }
}

// Render schedules list
const schedulesListRoot = document.getElementById('schedules_list_root');
if (schedulesListRoot) {
  const SchedulesListWithBackend = withAjaxBackend({
    WrappedComponent: SchedulesListView,
    endpoint: '/v1/schedules.json',
    authenticationStrategy: authenticateBearerOrBasic,
  });

  ReactDOM.render(<SchedulesListWithBackend />, schedulesListRoot);
}

// Render individual schedules
document.querySelectorAll('.on_call_root').forEach((schedule) => {
  const OnCallWithBackend = withAjaxBackend({
    WrappedComponent: OnCallView,
    endpoint: `/v1/schedules/${schedule.dataset.id}.json`,
    authenticationStrategy: authenticateBearerOrBasic,
  });
  ReactDOM.render(<OnCallWithBackend />, schedule);
});

// Hard page refresh every day to prevent memory leaks.
window.setTimeout(() => {
  window.location.reload();
}, 3600 * 24 * 1000); // 1 day

// ------- End -----------------------------------------------------------------
