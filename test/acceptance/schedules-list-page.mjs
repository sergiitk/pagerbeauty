// ------- Imports -------------------------------------------------------------

import test from 'ava';
import chai from 'chai';

// ------- Internal imports ----------------------------------------------------

import { AcceptanceHooks } from '../helpers/AcceptanceHelpers';

// ------- Init ----------------------------------------------------------------

const { expect } = chai;
const { waitFor } = AcceptanceHooks;

test.before(AcceptanceHooks.openBrowser);
test.serial.before(AcceptanceHooks.openPage('/v1/schedules.html'));
test.after.always(AcceptanceHooks.closeBrowser);

// ------- Tests ---------------------------------------------------------------

test('Schedules List: Check page response', (t) => {
  expect(t.context.pageResponse.ok()).to.be.true;
});

test('Schedules List: "Schedules" on page title', async (t) => {
  const { pageTest } = t.context;
  await pageTest.expectTitleContains('Schedules');
});

test('Schedules List: Loaded', waitFor('#schedules_list > ul'), async (t) => {
  const { page } = t.context;

  const links = await page.$$eval(
    '#schedules_list li',
    nodes => nodes.map(n => n.textContent),
  );
  expect(links).to.contain('Schedule a quasi illum');
  expect(links).to.contain('Schedule aliquid eum qui');
  expect(links).to.contain('PagerBeauty Level 1');
});

// ------- End -----------------------------------------------------------------
