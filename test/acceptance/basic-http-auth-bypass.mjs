// ------- Imports -------------------------------------------------------------

import test from 'ava';
import chai from 'chai';

// ------- Internal imports ----------------------------------------------------

import { AcceptanceHelpers, BASE_URL_WITH_AUTH } from '../helpers/AcceptanceHelpers';

// ------- Init ----------------------------------------------------------------

const { expect } = chai;
const { ensureUnauthrozied, withNewPage } = AcceptanceHelpers;

test.beforeEach(AcceptanceHelpers.openBrowser);
test.afterEach.always(AcceptanceHelpers.closeBrowser);

// ------- Tests ---------------------------------------------------------------

test.serial('HTTP Auth Bypass: Schedule unauthorized without bypass', withNewPage(), async (t, page) => {
  const response = await ensureUnauthrozied(page, '/v1/schedules/P538IZH.html');
  // Ensure we're on expected page
  expect(response.url()).to.equal(`${BASE_URL_WITH_AUTH}/v1/schedules/P538IZH.html`);
});

// ------- End -----------------------------------------------------------------
