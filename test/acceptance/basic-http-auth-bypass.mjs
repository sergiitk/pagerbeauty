// ------- Imports -------------------------------------------------------------

import test from 'ava';
import chai from 'chai';

// ------- Internal imports ----------------------------------------------------

import { AcceptanceHelpers, BASE_URL_WITH_AUTH } from '../helpers/AcceptanceHelpers';

// ------- Init ----------------------------------------------------------------

const { expect } = chai;
const { ensureUnauthrozied, withNewPage } = AcceptanceHelpers;
const AUTH_TOKEN = process.env.PAGERBEAUTY_HTTP_AUTH_TOKEN;

test.beforeEach(AcceptanceHelpers.openBrowser);
test.afterEach.always(AcceptanceHelpers.closeBrowser);

// ------- Tests ---------------------------------------------------------------

test.serial('HTTP Auth: Schedule P538IZH unauthorized without token', withNewPage(), async (t, page) => {
  const response = await ensureUnauthrozied(page, '/v1/schedules/P538IZH.html');
  // Ensure we're on expected page
  expect(response.url()).to.equal(`${BASE_URL_WITH_AUTH}/v1/schedules/P538IZH.html`);
});

test.serial.failing(
  'HTTP Auth: Schedule P538IZH is allowed with auth token',
  withNewPage(),
  async (t, page) => {
    const url = `${BASE_URL_WITH_AUTH}/v1/schedules/P538IZH.html?auth_token=${AUTH_TOKEN}`;
    const response = await page.goto(url);

    expect(response.ok()).to.be.true;
    expect(response.status()).to.equal(200);
  },
);

// ------- End -----------------------------------------------------------------
