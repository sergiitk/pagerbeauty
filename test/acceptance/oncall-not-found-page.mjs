// ------- Imports -------------------------------------------------------------

import test from 'ava';
import chai from 'chai';

// ------- Internal imports ----------------------------------------------------

import { AcceptanceHooks, AcceptanceAssert } from '../helpers/AcceptanceHelpers';

// ------- Init ----------------------------------------------------------------

const { expect } = chai;

test.before(AcceptanceHooks.openBrowser);
test.serial.before(AcceptanceHooks.openPage('/v1/schedules/404.html'));
test.after.always(AcceptanceHooks.closeBrowser);

// ------- Tests ---------------------------------------------------------------

test('No one On-Call: Check page response', (t) => {
  // Sic! 404 is temporary shown as 200 here.
  // This will be updated after refactoring schedules repository.
  expect(t.context.pageResponse.ok()).to.be.true;
});

test('No one On-Call: "Schedule not found" in page title', async (t) => {
  const { page } = t.context;

  await AcceptanceAssert.expectTitleContains(page, 'Schedule not found');
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
