// ------- Imports -------------------------------------------------------------

import test from 'ava';
import chai from 'chai';

// ------- Internal imports ----------------------------------------------------

import {
  AcceptanceHelpers,
  PageTest,
  BASE_URL_WITH_AUTH,
} from '../helpers/AcceptanceHelpers';

// ------- Init ----------------------------------------------------------------

const { expect } = chai;
const { withNewPageBasicAuth } = AcceptanceHelpers;

test.before(AcceptanceHelpers.openBrowser);
test.after.always(AcceptanceHelpers.closeBrowser);

// ------- Tests ---------------------------------------------------------------

test('HTTP Auth: Can see schedules list with credentials', withNewPageBasicAuth(), async (t, page) => {
  const response = await page.goto(`${BASE_URL_WITH_AUTH}/v1/schedules.html`);
  expect(response.ok()).to.be.true;
  expect(response.status()).to.equal(200);

  // Ensure React rendered page.
  await page.waitForSelector('.schedules_list');
});

test('HTTP Auth: Can see Schedule P538IZH with credentials', withNewPageBasicAuth(), async (t, page) => {
  const response = await page.goto(`${BASE_URL_WITH_AUTH}/v1/schedules/P538IZH.html`);
  expect(response.ok()).to.be.true;
  expect(response.status()).to.equal(200);

  // Ensure React rendered page.
  const pageTest = new PageTest(page);
  await page.waitForSelector('.schedule');
  await pageTest.expectClass('.schedule', 'state_normal');
  await pageTest.expectText('.user_name', 'Rosanna Runolfsdottir');
});


// ------- End -----------------------------------------------------------------
