// ------- Imports -------------------------------------------------------------

import test from 'ava';
import chai from 'chai';

// ------- Internal imports ----------------------------------------------------

import { OnCall } from '../../../src/models/OnCall';

// ------- Init ----------------------------------------------------------------

const { expect } = chai;

// ------- Tests ---------------------------------------------------------------

test('OnCall', () => {
  // TODO: fake properly.
  const onCall = new OnCall({
    userId: 'userId',
    userName: 'userName',
    userAvatarURL: 'userAvatarURL',
    userURL: 'userURL',
    dateStart: '2018-12-25T05:00:00.000Z',
    dateEnd: '2018-12-25T17:00:00.000Z',
    schedule: {
      id: 'scheduleId',
      name: 'scheduleName',
      url: 'scheduleURL',
      timezone: 'scheduleTimezone',
    },
    incident: {
      id: 'PTM70NY',
      scheduleId: 'P2RFGIP',
      status: 'triggered',
      title: 'Just a drill',
      summary: '[#10279] Just a drill',
      serviceName: 'PagerBeauty',
      url: 'https://apidocs.pagerduty.com/incidents/PTM70NY',
    },
    contactMethods: [
      {
        id: 'pmID',
        summary: 'Default',
        address: '2432423',
      },
    ],
  });

  // Verify public API.
  expect(onCall).to.respondTo('serialize');
  expect(onCall).to.respondTo('toString');
  expect(onCall).to.respondTo('userAvatarSized');
  expect(onCall).to.respondTo('setIncident');
  expect(onCall).to.respondTo('clearIncident');

  // Static.
  expect(OnCall).itself.to.respondTo('fromApiRecord');
});

// ------- End -----------------------------------------------------------------
