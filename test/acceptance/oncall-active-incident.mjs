// ------- Imports -------------------------------------------------------------

import test from 'ava';
import chai from 'chai';

// ------- Internal imports ----------------------------------------------------

import { AcceptanceHooks } from '../helpers/AcceptanceHelpers';

// ------- Init ----------------------------------------------------------------

const { expect } = chai;
const { waitFor } = AcceptanceHooks;

test.before(AcceptanceHooks.openBrowser);
test.serial.before(AcceptanceHooks.openPage('/v1/schedules/P2RFGIP.html'));
test.after.always(AcceptanceHooks.closeBrowser);

// ------- Tests ---------------------------------------------------------------

test('On-Call Incident: Check page response', (t) => {
  expect(t.context.pageResponse.ok()).to.be.true;
});

test('On-Call Incident: Schedule name in page title', async (t) => {
  const { pageTest } = t.context;
  await pageTest.expectTitleContains('PagerBeauty Level 1');
});

test('On-Call Incident: ensure classes', waitFor('.schedule'), async (t) => {
  const { pageTest } = t.context;
  await pageTest.expectClass('.schedule', 'state_active_incident');
  await pageTest.expectNoClass('.schedule', 'state_normal');
  await pageTest.expectNoClass('.schedule', 'state_not_found');
});

test('On-Call Incident: displays an accident', waitFor('.schedule'), async (t) => {
  const { pageTest } = t.context;
  await pageTest.expectText('.incident_summary', 'Incident triggered: [#10279] Just a drill');
  await pageTest.expectText('.incident_service', 'Service: PagerBeauty');
});

test('On-Call Incident: indicator is OK', waitFor('.schedule'), async (t) => {
  const { pageTest } = t.context;
  await pageTest.expectNoClass('.status_indicator', 'error');
  await pageTest.expectClass('.status_indicator', 'success');
  await pageTest.expectAttr('.status_indicator', 'title', 'OK');
});

// ------- End -----------------------------------------------------------------
