// ------- Imports -------------------------------------------------------------

import test from 'ava';
import chai from 'chai';

// ------- Internal imports ----------------------------------------------------

import { AcceptanceHooks, BASE_URL } from '../helpers/AcceptanceHelpers';

// ------- Init ----------------------------------------------------------------

const { expect } = chai;

test.beforeEach(AcceptanceHooks.openBrowser);
test.afterEach.always(AcceptanceHooks.closeBrowser);

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

test.serial('Redirect: / redirects to schedules html', async (t) => {
  await ensureSchedulesPage(t.context.page, '/');
});

test.serial('Redirect: /v1 redirects to schedules html', async (t) => {
  await ensureSchedulesPage(t.context.page, '/v1');
});

test.serial('Redirect: /v1/ redirects to schedules html', async (t) => {
  await ensureSchedulesPage(t.context.page, '/v1/');
});

test.serial('Redirect: /v1/schedules redirects to schedules html', async (t) => {
  await ensureSchedulesPage(t.context.page, '/v1/schedules');
});

test.serial('Redirect: /v1/schedules/ redirects to schedules html', async (t) => {
  await ensureSchedulesPage(t.context.page, '/v1/schedules/');
});

// ------- End -----------------------------------------------------------------
