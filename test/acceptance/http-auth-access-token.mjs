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
const { ensureUnauthroziedError, withNewPage } = AcceptanceHelpers;
const ACCESS_TOKEN = process.env.PAGERBEAUTY_HTTP_ACCESS_TOKEN;

test.before(AcceptanceHelpers.openBrowser);
test.after.always(AcceptanceHelpers.closeBrowser);

// ------- Tests ---------------------------------------------------------------

test('HTTP Auth: Can\'t see schedule P538IZH without token', withNewPage(), async (t, page) => {
  await ensureUnauthroziedError(page, '/v1/schedules/P538IZH.html');
});

test('HTTP Auth: Can\'t see schedule P538IZH json without token', withNewPage(), async (t, page) => {
  await ensureUnauthroziedError(page, '/v1/schedules/P538IZH.json');
});

test('HTTP Auth: Can open schedule P538IZH with token', withNewPage(), async (t, page) => {
  const url = `${BASE_URL_WITH_AUTH}/v1/schedules/P538IZH.html?access_token=${ACCESS_TOKEN}`;
  const response = await page.goto(url);

  expect(response.ok()).to.be.true;
  expect(response.status()).to.equal(200);

  // Ensure React rendered page.
  const pageTest = new PageTest(page);
  await page.waitForSelector('.schedule');
  await pageTest.expectClass('.schedule', 'state_normal');
  await pageTest.expectText('.user_name', 'Rosanna Runolfsdottir');
});

test('HTTP Auth: Can\'t see schedules list without token', withNewPage(), async (t, page) => {
  await ensureUnauthroziedError(page, '/v1/schedules.html');
});

test('HTTP Auth: Can\'t see schedules list json ithout token', withNewPage(), async (t, page) => {
  await ensureUnauthroziedError(page, '/v1/schedules.json');
});

test('HTTP Auth: Can open schedule list with token', withNewPage(), async (t, page) => {
  const url = `${BASE_URL_WITH_AUTH}/v1/schedules.html?access_token=${ACCESS_TOKEN}`;
  const response = await page.goto(url);

  expect(response.ok()).to.be.true;
  expect(response.status()).to.equal(200);

  // Ensure React rendered page.
  await page.waitForSelector('.schedules_list');
});

// ------- End -----------------------------------------------------------------
