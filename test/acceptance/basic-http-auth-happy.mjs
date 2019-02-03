// ------- Imports -------------------------------------------------------------

import test from 'ava';
import chai from 'chai';

// ------- Internal imports ----------------------------------------------------

import { AcceptanceHelpers } from '../helpers/AcceptanceHelpers';

// ------- Init ----------------------------------------------------------------

const { expect } = chai;
const { waitFor } = AcceptanceHelpers;

test.before(AcceptanceHelpers.openBrowser);
test.serial.before(AcceptanceHelpers.openPageWithAuth('/v1/schedules.html'));
test.after.always(AcceptanceHelpers.closeBrowser);

// ------- Tests ---------------------------------------------------------------

test('Basic HTTP Auth: Can open schedules list', (t) => {
  expect(t.context.pageResponse.ok()).to.be.true;
  expect(t.context.pageResponse.status()).to.equal(200);
});

test('Basic HTTP Auth: Schedules List Loaded', waitFor('#schedules_list > ul'), async (t) => {
  const { page } = t.context;

  const links = await page.$$eval(
    '#schedules_list li',
    nodes => nodes.map(n => n.textContent),
  );
  expect(links).to.contain('Schedule a quasi illum');
  expect(links).to.contain('Schedule aliquid eum qui');
});

// ------- End -----------------------------------------------------------------
