// ------- Imports -------------------------------------------------------------

import test from 'ava';
import chai from 'chai';

// ------- Internal imports ----------------------------------------------------

import { AcceptanceHooks } from '../helpers/AcceptanceHelpers';

// ------- Init ----------------------------------------------------------------

const { expect } = chai;
const { waitFor } = AcceptanceHooks;

test.before(AcceptanceHooks.openBrowser);
test.serial.before(AcceptanceHooks.openPage('/v1/schedules/PJ1P5JQ.html'));
test.after.always(AcceptanceHooks.closeBrowser);

// ------- Tests ---------------------------------------------------------------

test('On-Call PJ1P5JQ: Check page response', (t) => {
  expect(t.context.pageResponse.ok()).to.be.true;
});

test('On-Call PJ1P5JQ: Schedule name in page title', async (t) => {
  const { pageTest } = t.context;
  await pageTest.expectTitleContains('Schedule aliquid eum qui');
});

test('On-Call PJ1P5JQ: ensure classes', waitFor('.schedule'), async (t) => {
  const { pageTest } = t.context;
  await pageTest.expectClass('.schedule', 'state_normal');
  await pageTest.expectNoClass('.schedule', 'state_not_found');
  await pageTest.expectNoClass('.schedule', 'state_active_incident');
});

test('On-Call PJ1P5JQ: show schedule name', waitFor('.schedule'), async (t) => {
  const { pageTest } = t.context;
  await pageTest.expectText('a.schedule_name', 'Schedule aliquid eum qui');
});

test('On-Call PJ1P5JQ: show user name', waitFor('.schedule'), async (t) => {
  const { pageTest } = t.context;
  await pageTest.expectText('.user_name', 'Chesley Williamson');
});

test('On-Call PJ1P5JQ: show user avatar', waitFor('.schedule'), async (t) => {
  const { pageTest } = t.context;
  pageTest.expectAttrMatch(
    '.user_avatar img',
    'src',
    /^https:\/\/secure\.gravatar\.com\/avatar(.*)&s=2048/,
  );
});

test('On-Call PJ1P5JQ: status row shows dates', waitFor('.schedule'), async (t) => {
  const { pageTest } = t.context;
  await pageTest.expectText('.date_start', 'From: Tuesday, Dec 25 12:00 AM');
  await pageTest.expectText('.date_end', 'To: Tuesday, Dec 25 12:00 PM');
});

test('On-Call PJ1P5JQ: indicator is OK', waitFor('.schedule'), async (t) => {
  const { pageTest } = t.context;
  await pageTest.expectNoClass('.status_indicator', 'error');
  await pageTest.expectClass('.status_indicator', 'success');
  await pageTest.expectAttr('.status_indicator', 'title', 'OK');
});

// ------- End -----------------------------------------------------------------
