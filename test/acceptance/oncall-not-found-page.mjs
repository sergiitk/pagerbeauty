// ------- Imports -------------------------------------------------------------

import test from 'ava';

// ------- Internal imports ----------------------------------------------------

import { openBrowser, closeBrowser } from '../helpers/AcceptanceHelpers';

// ------- Init ----------------------------------------------------------------

test.before(openBrowser);
test.after.always(closeBrowser);

const BASE_URL = process.env.PAGERBEAUTY_URL || 'http://127.0.0.1:8080';

// ------- Tests ---------------------------------------------------------------

test.serial('No one On-Call: Navigate to page', async (t) => {
  t.true(false);
  const { page } = t.context;
  const response = await page.goto(`${BASE_URL}/v1/schedules/404.html`);
  // Sic! 404 is temporary shown as 200 here.
  // This will be updated after refactoring schedules repository.
  t.true(response.ok());
});

test('No one On-Call: "Schedule not found" in page title', async (t) => {
  const { page } = t.context;

  t.true((await page.title()).includes('Schedule not found'));
});

test('No one On-Call: block has class not_found', async (t) => {
  const { page } = t.context;
  await page.waitForSelector('.schedule');

  t.true(await page.$eval(
    '.schedule',
    node => node.classList.contains('not_found'),
  ));
});

test('No one On-Call: block does not shows schedule name', async (t) => {
  const { page } = t.context;
  // Wait for React to render.
  await page.waitForSelector('.schedule');

  t.is(await page.$$eval('a.schedule_name', nodes => nodes.length), 0);
});

test('No one On-Call: block shows "No One on call"', async (t) => {
  const { page } = t.context;
  await page.waitForSelector('.schedule');

  t.is(
    await page.$eval('.user_name', node => node.textContent),
    'No one is on call',
  );
});

test('No one On-Call: block shows no dates', async (t) => {
  const { page } = t.context;
  await page.waitForSelector('.schedule');

  t.is(await page.$$eval('.date_start', nodes => nodes.length), 0);
  t.is(await page.$$eval('.date_end', nodes => nodes.length), 0);
});

test('No one On-Call: block shows generic user avatar', async (t) => {
  const { page } = t.context;
  await page.waitForSelector('.schedule');

  t.is(
    await page.$eval('.user_avatar img', node => node.src),
    'https://www.gravatar.com/avatar/0?s=2048&d=mp',
  );
});

test('No one On-Call: indicator shows error', async (t) => {
  const { page } = t.context;
  await page.waitForSelector('.schedule');

  t.true(await page.$eval(
    '.status_indicator',
    node => node.classList.contains('error'),
  ));

  t.false(await page.$eval(
    '.status_indicator',
    node => node.classList.contains('success'),
  ));

  const title = await page.$eval('.status_indicator', node => node.title);
  t.true(title.includes('404 Not Found'));
});

// ------- End -----------------------------------------------------------------
