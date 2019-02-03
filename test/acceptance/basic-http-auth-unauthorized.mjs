// ------- Imports -------------------------------------------------------------

import test from 'ava';
import chai from 'chai';

// ------- Internal imports ----------------------------------------------------

import { AcceptanceHelpers, BASE_URL_WITH_AUTH } from '../helpers/AcceptanceHelpers';

// ------- Init ----------------------------------------------------------------

const { expect } = chai;
const { withNewPage } = AcceptanceHelpers;

test.before(AcceptanceHelpers.openBrowser);
test.after.always(AcceptanceHelpers.closeBrowser);

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

test('Basic HTTP Unauthorized: Check /', withNewPage(), async (t, page) => {
  const response = await ensureUnauthrozied(page, '/');
  // Make sure we don't redirect on 401
  expect(response.url()).to.equal(`${BASE_URL_WITH_AUTH}/`);
});

test('Basic HTTP Unauthorized: Check Schedules List', withNewPage(), async (t, page) => {
  await ensureUnauthrozied(page, '/v1/schedules.html');
});

// ------- End -----------------------------------------------------------------
