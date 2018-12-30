// ------- Imports -------------------------------------------------------------

import test from 'ava';

// ------- Internal imports ----------------------------------------------------

import { AcceptanceHooks, AcceptanceAssert } from '../helpers/AcceptanceHelpers';

// ------- Init ----------------------------------------------------------------

test.before(AcceptanceHooks.openBrowser);
test.after.always(AcceptanceHooks.closeBrowser);

const BASE_URL = process.env.PAGERBEAUTY_URL || 'http://127.0.0.1:8080';

// ------- Tests ---------------------------------------------------------------

test.serial('No one On-Call: Navigate to page', async (t) => {
  const { page } = t.context;
  const response = await page.goto(`${BASE_URL}/v1/schedules/404.html`);
  // Sic! 404 is temporary shown as 200 here.
  // This will be updated after refactoring schedules repository.
  t.true(response.ok());
});

test('No one On-Call: "Schedule not found" in page title', async (t) => {
  const { page } = t.context;

  await AcceptanceAssert.expectTitletoContain(page, 'Schedule not found');
});

test('No one On-Call: block has class not_found', async (t) => {
  const { page } = t.context;
  await page.waitForSelector('.schedule');

  await AcceptanceAssert.expectClass(page, '.schedule', 'not_found');
});

test('No one On-Call: block does not shows schedule name', async (t) => {
  const { page } = t.context;
  // Wait for React to render.
  await page.waitForSelector('.schedule');

  await AcceptanceAssert.expectNoElements(page, 'a.schedule_name');
});

test('No one On-Call: block shows "No One on call"', async (t) => {
  const { page } = t.context;
  await page.waitForSelector('.schedule');

  await AcceptanceAssert.expectText(
    page,
    '.user_name',
    'No one is on call',
  );
});

test('No one On-Call: block shows no dates', async (t) => {
  const { page } = t.context;
  await page.waitForSelector('.schedule');

  await AcceptanceAssert.expectNoElements(page, '.date_start');
  await AcceptanceAssert.expectNoElements(page, '.date_end');
});

test('No one On-Call: block shows generic user avatar', async (t) => {
  const { page } = t.context;
  await page.waitForSelector('.schedule');

  await AcceptanceAssert.expectAttr(
    page,
    '.user_avatar img',
    'src',
    'https://www.gravatar.com/avatar/0?s=2048&d=mp',
  );
});

test('No one On-Call: indicator shows error', async (t) => {
  const { page } = t.context;
  await page.waitForSelector('.schedule');

  await AcceptanceAssert.expectClass(page, '.status_indicator', 'error');
  await AcceptanceAssert.expectNoClass(page, '.status_indicator', 'success');
  await AcceptanceAssert.expectAttrContains(
    page,
    '.status_indicator',
    'title',
    '404 Not Found',
  );
});

// ------- End -----------------------------------------------------------------
