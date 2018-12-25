// ------- Imports -------------------------------------------------------------

import test from 'ava';

// ------- Internal imports ----------------------------------------------------

import { openBrowser, closeBrowser } from '../helpers/AcceptanceHelpers';

// ------- Init ----------------------------------------------------------------

test.before(openBrowser);
test.after.always(closeBrowser);

const BASE_URL = 'http://127.0.0.1:8080';

// ------- Tests ---------------------------------------------------------------

test('Schedules list page title includes "Schedules"', async (t) => {
  const { page } = t.context;
  await page.goto(`${BASE_URL}/v1/schedules.html`);
  t.true((await page.title()).includes('Schedules'));
});

// ------- End -----------------------------------------------------------------
