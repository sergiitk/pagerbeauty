// ------- Imports -------------------------------------------------------------

import test from 'ava';
import chai from 'chai';

// ------- Internal imports ----------------------------------------------------

import { AcceptanceHooks, AcceptanceAssert } from '../helpers/AcceptanceHelpers';

// ------- Init ----------------------------------------------------------------

const { expect } = chai;

test.before(AcceptanceHooks.openBrowser);
test.serial.before(AcceptanceHooks.openPage('/v1/schedules.html'));
test.after.always(AcceptanceHooks.closeBrowser);

// ------- Tests ---------------------------------------------------------------

test.serial('Schedules List: Check page response', (t) => {
  expect(t.context.pageResponse.ok()).to.be.true;
});

test('Schedules list page title includes "Schedules"', async (t) => {
  const { page } = t.context;

  await AcceptanceAssert.expectTitleContains(page, 'Schedules');
});

test('Schedules is loaded', async (t) => {
  const { page } = t.context;
  // Wait for React to render.
  await page.waitForSelector('#schedules_list > ul');

  const links = await page.$$eval(
    '#schedules_list li',
    nodes => nodes.map(n => n.textContent),
  );

  expect(links).to.contain('Schedule a quasi illum');
  expect(links).to.contain('Schedule aliquid eum qui');
});

// ------- End -----------------------------------------------------------------
