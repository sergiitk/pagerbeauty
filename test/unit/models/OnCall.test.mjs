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
  });

  // Verify public API.
  expect(onCall).to.respondTo('serialize');
  expect(onCall).to.respondTo('toString');
  expect(onCall).to.respondTo('userAvatarSized');

  // Static.
  expect(OnCall).itself.to.respondTo('fromApiRecord');
});

// ------- End -----------------------------------------------------------------
