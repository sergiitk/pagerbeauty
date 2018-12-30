// ------- Imports -------------------------------------------------------------

import test from 'ava';
import chai from 'chai';

// ------- Internal imports ----------------------------------------------------

import { AcceptanceHooks } from '../helpers/AcceptanceHelpers';

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
  const { pageTest } = t.context;

  await pageTest.expectTitleContains('Schedule not found');
});

test('No one On-Call: block has class not_found', async (t) => {
  const { page, pageTest } = t.context;
  await page.waitForSelector('.schedule');

  await pageTest.expectClass('.schedule', 'not_found');
});

test('No one On-Call: block does not shows schedule name', async (t) => {
  const { page, pageTest } = t.context;
  // Wait for React to render.
  await page.waitForSelector('.schedule');

  await pageTest.expectNoElements('a.schedule_name');
});

test('No one On-Call: block shows "No One on call"', async (t) => {
  const { page, pageTest } = t.context;
  await page.waitForSelector('.schedule');

  await pageTest.expectText('.user_name', 'No one is on call');
});

test('No one On-Call: block shows no dates', async (t) => {
  const { page, pageTest } = t.context;
  await page.waitForSelector('.schedule');

  await pageTest.expectNoElements('.date_start');
  await pageTest.expectNoElements('.date_end');
});

test('No one On-Call: block shows generic user avatar', async (t) => {
  const { page, pageTest } = t.context;
  await page.waitForSelector('.schedule');

  await pageTest.expectAttr(
    '.user_avatar img',
    'src',
    'https://www.gravatar.com/avatar/0?s=2048&d=mp',
  );
});

test('No one On-Call: indicator shows error', async (t) => {
  const { page, pageTest } = t.context;
  await page.waitForSelector('.schedule');

  await pageTest.expectClass('.status_indicator', 'error');
  await pageTest.expectNoClass('.status_indicator', 'success');
  await pageTest.expectAttrContains(
    '.status_indicator',
    'title',
    '404 Not Found',
  );
});

// ------- End -----------------------------------------------------------------
