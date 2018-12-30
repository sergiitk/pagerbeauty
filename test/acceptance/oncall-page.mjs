// ------- Imports -------------------------------------------------------------

import test from 'ava';
import chai from 'chai';

// ------- Internal imports ----------------------------------------------------

import { AcceptanceHooks } from '../helpers/AcceptanceHelpers';

// ------- Init ----------------------------------------------------------------

const { expect } = chai;

test.before(AcceptanceHooks.openBrowser);
test.serial.before(AcceptanceHooks.openPage('/v1/schedules/P538IZH.html'));
test.after.always(AcceptanceHooks.closeBrowser);

// ------- Tests ---------------------------------------------------------------

test('On-Call: Check page response', (t) => {
  expect(t.context.pageResponse.ok()).to.be.true;
});

test('On-Call has schedule name in page title', async (t) => {
  const { pageTest } = t.context;

  await pageTest.expectTitleContains('Schedule a quasi illum');
});

test('No one On-Call: block has no class not_found', async (t) => {
  const { page, pageTest } = t.context;
  await page.waitForSelector('.schedule');

  // Block has no not_found class
  await pageTest.expectNoClass('.schedule', 'not_found');
});


test('On-Call block shows schedule name', async (t) => {
  const { page, pageTest } = t.context;
  // Wait for React to render.
  await page.waitForSelector('.schedule');

  await pageTest.expectText('a.schedule_name', 'Schedule a quasi illum');
});

test('On-Call block shows user name', async (t) => {
  const { page, pageTest } = t.context;
  await page.waitForSelector('.schedule');

  await pageTest.expectText('.user_name', 'Rosanna Runolfsdottir');
});

test('On-Call block shows correct dates', async (t) => {
  const { page, pageTest } = t.context;
  await page.waitForSelector('.schedule');

  await pageTest.expectText('.date_start', 'From: Tuesday, Dec 25 12:00 AM');
  await pageTest.expectText('.date_end', 'To: Tuesday, Dec 25 12:00 PM');
});

test('On-Call block shows user avatar', async (t) => {
  const { page, pageTest } = t.context;
  await page.waitForSelector('.schedule');

  pageTest.expectAttrMatch(
    '.user_avatar img',
    'src',
    /^https:\/\/secure\.gravatar\.com\/avatar(.*)&s=2048/,
  );
});

test('No one On-Call: indicator is OK', async (t) => {
  const { page, pageTest } = t.context;
  await page.waitForSelector('.schedule');

  await pageTest.expectNoClass('.status_indicator', 'error');
  await pageTest.expectClass('.status_indicator', 'success');
  await pageTest.expectAttr('.status_indicator', 'title', 'OK');
});

// ------- End -----------------------------------------------------------------
