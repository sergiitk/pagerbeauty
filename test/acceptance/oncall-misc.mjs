// ------- Imports -------------------------------------------------------------

import test from 'ava';

// ------- Internal imports ----------------------------------------------------

import {
  AcceptanceHelpers,
  PageTest,
  BASE_URL,
} from '../helpers/AcceptanceHelpers';

// ------- Init ----------------------------------------------------------------

const { withNewPage } = AcceptanceHelpers;

test.before(AcceptanceHelpers.openBrowser);
test.after.always(AcceptanceHelpers.closeBrowser);

// ------- Tests ---------------------------------------------------------------

test('Misc: Grafana theme is applied', withNewPage(), async (t, page) => {
  await page.goto(`${BASE_URL}/v1/schedules/PJ1P5JQ.html?theme=grafana`);

  await page.waitForSelector('.on_call_root');
  const pageTest = new PageTest(page);
  await pageTest.expectClass('.on_call_root', 'theme-grafana');
});

test('Misc: Other themes is not', withNewPage(), async (t, page) => {
  await page.goto(`${BASE_URL}/v1/schedules/PJ1P5JQ.html?theme=foo`);

  await page.waitForSelector('.on_call_root');
  const pageTest = new PageTest(page);
  await pageTest.expectNoClass('.on_call_root', 'theme-foo');
});

// ------- End -----------------------------------------------------------------
