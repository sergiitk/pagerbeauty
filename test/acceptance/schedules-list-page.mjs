// ------- Imports -------------------------------------------------------------

import test from 'ava';

// ------- Internal imports ----------------------------------------------------

import { openBrowser, closeBrowser } from '../helpers/AcceptanceHelpers';

// ------- Init ----------------------------------------------------------------

test.before(openBrowser);
test.after.always(closeBrowser);

const BASE_URL = process.env.PAGERBEAUTY_URL || 'http://127.0.0.1:8080';

// ------- Tests ---------------------------------------------------------------

test.serial('Navigate to Schedules List page', async (t) => {
  const { page } = t.context;
  const response = await page.goto(`${BASE_URL}/v1/schedules.html`);
  t.true(response.ok());
});

test('Schedules list page title includes "Schedules"', async (t) => {
  const { page } = t.context;

  t.true((await page.title()).includes('Schedules'));
});

test('Schedules is loaded', async (t) => {
  const { page } = t.context;
  // Wait for React to render.
  await page.waitForSelector('#schedules_list > ul');

  const links = await page.$$eval(
    '#schedules_list li',
    nodes => nodes.map(n => n.textContent),
  );
  const expectedLinks = [
    'Schedule a quasi illum',
    'Schedule aliquid eum qui',
  ];
  t.deepEqual(links, expectedLinks);
});

// ------- End -----------------------------------------------------------------
