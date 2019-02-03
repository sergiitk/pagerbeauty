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

test('HTTP Unauthorized: Check /', withNewPage(), async (t, page) => {
  const response = await page.goto(`${BASE_URL_WITH_AUTH}/`);
  // Unauthorized / should recirect to /v1
  expect(response.url()).to.equal(`${BASE_URL_WITH_AUTH}/v1`);
});

test('HTTP Unauthorized: Check Schedules List', withNewPage(), async (t, page) => {
  await ensureUnauthroziedError(page, '/v1/schedules.html');
});

// ------- End -----------------------------------------------------------------
