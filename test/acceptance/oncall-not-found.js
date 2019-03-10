// ------- Imports -------------------------------------------------------------

import test from 'ava';
import chai from 'chai';

// ------- Internal imports ----------------------------------------------------

import { AcceptanceHelpers } from '../helpers/AcceptanceHelpers';

// ------- Init ----------------------------------------------------------------

const { expect } = chai;
const { waitFor } = AcceptanceHelpers;

test.before(AcceptanceHelpers.openBrowser);
test.serial.before(AcceptanceHelpers.openPage('/v1/schedules/404.html'));
test.after.always(AcceptanceHelpers.closeBrowser);

// ------- Tests ---------------------------------------------------------------

test('No one On-Call: Check page response', (t) => {
  // Sic! 404 is temporary shown as 200 here.
  // This will be updated after refactoring schedules repository.
  expect(t.context.pageResponse.ok()).to.be.true;
});

test('No one On-Call: "Schedule not found" in page title', async (t) => {
  const { pageTest } = t.context;
  await pageTest.expectTitleContains('Schedule not found');
});

test('No one On-Call: ensure classes', waitFor('.schedule'), async (t) => {
  const { pageTest } = t.context;
  await pageTest.expectClass('.schedule', 'state_not_found');
  await pageTest.expectNoClass('.schedule', 'state_active_incident');
  await pageTest.expectNoClass('.schedule', 'state_normal');
});

test('No one On-Call: no schedule name', waitFor('.schedule'), async (t) => {
  const { pageTest } = t.context;
  await pageTest.expectNoElements('a.schedule_name');
});

test('No one On-Call: no user name', waitFor('.schedule'), async (t) => {
  const { pageTest } = t.context;
  await pageTest.expectText('.user_name', 'No one is on call');
});

test('No one On-Call: status row has no dates', waitFor('.schedule'), async (t) => {
  const { pageTest } = t.context;
  await pageTest.expectNoElements('.date_start');
  await pageTest.expectNoElements('.date_end');
});

test('No one On-Call: generic user avatar', waitFor('.schedule'), async (t) => {
  const { pageTest } = t.context;
  await pageTest.expectAttr(
    '.user_avatar img',
    'src',
    'https://www.gravatar.com/avatar/0?s=2048&d=mp',
  );
});

test('No one On-Call: indicator errors', waitFor('.schedule'), async (t) => {
  const { pageTest } = t.context;
  await pageTest.expectClass('.status_indicator', 'error');
  await pageTest.expectNoClass('.status_indicator', 'success');
  await pageTest.expectAttrContains(
    '.status_indicator',
    'title',
    '404 Not Found',
  );
});

// ------- End -----------------------------------------------------------------
