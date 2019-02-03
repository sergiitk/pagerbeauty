// ------- Imports -------------------------------------------------------------

import test from 'ava';
import chai from 'chai';

// ------- Internal imports ----------------------------------------------------

import { AcceptanceHelpers, BASE_URL } from '../helpers/AcceptanceHelpers';

// ------- Init ----------------------------------------------------------------

const { expect } = chai;
const { withNewPage } = AcceptanceHelpers;

test.before(AcceptanceHelpers.openBrowser);
test.after.always(AcceptanceHelpers.closeBrowser);

// ------- Helpers -------------------------------------------------------------

async function ensureSchedulesPage(page, url) {
  const response = await page.goto(`${BASE_URL}${url}`);

  // Eventually we end up at schedules
  expect(response.ok()).to.be.true;
  expect(response.status()).to.equal(200);
  expect(response.url()).to.equal(`${BASE_URL}/v1/schedules.html`);
  return response;
}

// ------- Tests ---------------------------------------------------------------

test('Redirect: / redirects to schedules.html', withNewPage(), async (t, page) => {
  await ensureSchedulesPage(page, '/');
});

test('Redirect: /v1 redirects to schedules.html', withNewPage(), async (t, page) => {
  await ensureSchedulesPage(page, '/v1');
});

test('Redirect: /v1/ redirects to schedules.html', withNewPage(), async (t, page) => {
  await ensureSchedulesPage(page, '/v1/');
});

test('Redirect: /v1/schedules redirects to schedules.html', withNewPage(), async (t, page) => {
  await ensureSchedulesPage(page, '/v1/schedules');
});

test('Redirect: /v1/schedules/ redirects to schedules.html', withNewPage(), async (t, page) => {
  await ensureSchedulesPage(page, '/v1/schedules/');
});

// ------- End -----------------------------------------------------------------
