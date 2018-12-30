// ------- Imports -------------------------------------------------------------

import test from 'ava';
import chai from 'chai';

// ------- Internal imports ----------------------------------------------------

import { AcceptanceHooks, AcceptanceAssert } from '../helpers/AcceptanceHelpers';

// ------- Init ----------------------------------------------------------------

const { expect } = chai;

test.before(AcceptanceHooks.openBrowser);
test.after.always(AcceptanceHooks.closeBrowser);

const BASE_URL = process.env.PAGERBEAUTY_URL || 'http://127.0.0.1:8080';

// ------- Tests ---------------------------------------------------------------

test.serial('Navigate to Schedules List page', async (t) => {
  const { page } = t.context;
  const response = await page.goto(`${BASE_URL}/v1/schedules.html`);
  expect(response.ok()).to.be.true;
});

test('Schedules list page title includes "Schedules"', async (t) => {
  const { page } = t.context;

  await AcceptanceAssert.expectTitletoContain(page, 'Schedules');
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
