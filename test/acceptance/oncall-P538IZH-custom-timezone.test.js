// ------- Imports -------------------------------------------------------------

import test from 'ava';
import chai from 'chai';

// ------- Internal imports ----------------------------------------------------

import { AcceptanceHelpers } from '../helpers/AcceptanceHelpers';

// ------- Init ----------------------------------------------------------------

const { expect } = chai;
const { waitFor } = AcceptanceHelpers;

test.before(AcceptanceHelpers.openBrowser);
test.serial.before(AcceptanceHelpers.openPage('/v1/schedules/P538IZH.html?timezone=UTC+2'));
test.after.always(AcceptanceHelpers.closeBrowser);

// ------- Tests ---------------------------------------------------------------

test('On-Call P538IZH: Check page response', (t) => {
  expect(t.context.pageResponse.ok()).to.be.true;
});

test('On-Call P538IZH: status row shows dates in custom timezone', waitFor('.schedule'), async (t) => {
  const { pageTest } = t.context;
  await pageTest.expectText('.date_start', 'From: Tuesday, Dec 25 7:00 AM');
  await pageTest.expectText('.date_end', 'To: Tuesday, Dec 25 7:00 PM');
});

// ------- End -----------------------------------------------------------------
