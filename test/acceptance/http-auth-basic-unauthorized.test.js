// ------- Imports -------------------------------------------------------------

import test from 'ava';
import chai from 'chai';

// ------- Internal imports ----------------------------------------------------

import { AcceptanceHelpers, BASE_URL_WITH_AUTH } from '../helpers/AcceptanceHelpers';

// ------- Init ----------------------------------------------------------------

const { expect } = chai;
const { withNewPage, ensureUnauthroziedError } = AcceptanceHelpers;

test.before(AcceptanceHelpers.openBrowser);
test.after.always(AcceptanceHelpers.closeBrowser);

// ------- Tests ---------------------------------------------------------------

test('HTTP Auth: Unauthorized / redirects to v1', withNewPage(), async (t, page) => {
  const response = await page.goto(`${BASE_URL_WITH_AUTH}/`);
  // Unauthorized / should recirect to /v1
  expect(response.url()).to.equal(`${BASE_URL_WITH_AUTH}/v1`);
});

test('HTTP Auth: Can\'t see schedules list without credentials', withNewPage(), async (t, page) => {
  await ensureUnauthroziedError(page, '/v1/schedules.html');
});

test('HTTP Auth: Can\'t see schedules list json without credentials', withNewPage(), async (t, page) => {
  await ensureUnauthroziedError(page, '/v1/schedules.json');
});

test('HTTP Auth: Can\'t see schedule P538IZH without credentials', withNewPage(), async (t, page) => {
  await ensureUnauthroziedError(page, '/v1/schedules/P538IZH.html');
});

test('HTTP Auth: Can\'t see schedule P538IZH json without credentials', withNewPage(), async (t, page) => {
  await ensureUnauthroziedError(page, '/v1/schedules/P538IZH.json');
});

test('HTTP Auth: Assets are not protected', withNewPage(), async (t, page) => {
  const response = await page.goto(`${BASE_URL_WITH_AUTH}/assets`);
  expect(response.ok()).to.be.true;
  expect(response.status()).to.equal(200);

  // Ensure authorized body
  const body = await response.text();
  expect(body.trim()).to.equal('hi there');
});

// ------- End -----------------------------------------------------------------
