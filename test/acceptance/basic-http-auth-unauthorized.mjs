// ------- Imports -------------------------------------------------------------

import test from 'ava';
import chai from 'chai';

// ------- Internal imports ----------------------------------------------------

import { AcceptanceHooks, BASE_URL_WITH_AUTH } from '../helpers/AcceptanceHelpers';

// ------- Init ----------------------------------------------------------------

const { expect } = chai;

test.beforeEach(AcceptanceHooks.openBrowser);
test.afterEach.always(AcceptanceHooks.closeBrowser);

// ------- Helpers -------------------------------------------------------------

async function ensureUnauthrozied(page, url) {
  // No authentication
  const response = await page.goto(`${BASE_URL_WITH_AUTH}${url}`);

  // Ensure 401 status
  expect(response.ok()).to.be.false;
  expect(response.status()).to.equal(401);
  expect(response.statusText()).to.be.equal('Unauthorized');

  // Ensure authentiation header
  const headers = response.headers();
  expect(headers).to.include({ 'www-authenticate': 'Basic realm="Secure Area"' });

  // Ensure Unauthorized body
  const body = await response.text();
  expect(body).to.equal('Unauthorized');
  return response;
}

// ------- Tests ---------------------------------------------------------------

test.serial('Basic HTTP Unauthorized: Check /', async (t) => {
  const { page } = t.context;
  const response = await ensureUnauthrozied(page, '/');
  // Make sure we don't redirect on 401
  expect(response.url()).to.equal(`${BASE_URL_WITH_AUTH}/`);
});

test.serial('Basic HTTP Unauthorized: Check Schedules List', async (t) => {
  const { page } = t.context;
  await ensureUnauthrozied(page, '/v1/schedules.html');
  return true;
});

// ------- End -----------------------------------------------------------------
