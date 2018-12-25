import test from 'ava';
import withPage from '../helpers/AcceptanceHelpers';

const url = 'https://google.com';

test('page title should contain "Google"', withPage, async (t, page) => {
  await page.goto(url);
  t.true((await page.title()).includes('Google'));
});
