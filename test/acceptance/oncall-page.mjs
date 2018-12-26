// ------- Imports -------------------------------------------------------------

import test from 'ava';

// ------- Internal imports ----------------------------------------------------

import { openBrowser, closeBrowser } from '../helpers/AcceptanceHelpers';

// ------- Init ----------------------------------------------------------------

test.before(openBrowser);
test.after.always(closeBrowser);

const BASE_URL = process.env.PAGERBEAUTY_URL || 'http://127.0.0.1:8080';

// ------- Tests ---------------------------------------------------------------

test.serial('On-Call: Navigate to page', async (t) => {
  const { page } = t.context;
  const response = await page.goto(`${BASE_URL}/v1/schedules/P538IZH.html`);
  t.true(response.ok());
});

test('On-Call has schedule name in page title', async (t) => {
  const { page } = t.context;

  t.true((await page.title()).includes('Schedule a quasi illum'));
});

test('No one On-Call: block has no class not_found', async (t) => {
  const { page } = t.context;
  await page.waitForSelector('.schedule');

  t.false(await page.$eval(
    '.schedule',
    node => node.classList.contains('not_found'),
  ));
});


test('On-Call block shows schedule name', async (t) => {
  const { page } = t.context;
  // Wait for React to render.
  await page.waitForSelector('.schedule');

  t.is(
    await page.$eval('a.schedule_name', node => node.textContent),
    'Schedule a quasi illum',
  );
});

test('On-Call block shows user name', async (t) => {
  const { page } = t.context;
  await page.waitForSelector('.schedule');

  t.is(
    await page.$eval('.user_name', node => node.textContent),
    'Rosanna Runolfsdottir',
  );
});

test('On-Call block shows correct dates', async (t) => {
  const { page } = t.context;
  await page.waitForSelector('.schedule');

  t.is(
    await page.$eval('.date_start', node => node.textContent),
    'From: Tuesday, Dec 25 12:00 AM',
  );

  t.is(
    await page.$eval('.date_end', node => node.textContent),
    'To: Tuesday, Dec 25 12:00 PM',
  );
});

test('On-Call block shows user avatar', async (t) => {
  const { page } = t.context;
  await page.waitForSelector('.schedule');

  t.regex(
    await page.$eval('.user_avatar img', node => node.src),
    /^https:\/\/secure\.gravatar\.com\/avatar(.*)&s=2048/,
  );
});

test('No one On-Call: indicator is OK', async (t) => {
  const { page } = t.context;
  await page.waitForSelector('.schedule');

  t.false(await page.$eval(
    '.status_indicator',
    node => node.classList.contains('error'),
  ));

  t.true(await page.$eval(
    '.status_indicator',
    node => node.classList.contains('success'),
  ));

  const title = await page.$eval('.status_indicator', node => node.title);
  t.true(title.includes('OK'));
});

// ------- End -----------------------------------------------------------------
