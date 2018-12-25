// ------- Imports -------------------------------------------------------------

import puppeteer from 'puppeteer';

export async function withPage(t, run) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  try {
    await run(t, page);
  } finally {
    await page.close();
    await browser.close();
  }
}

export async function openBrowser(t) {
  t.context.browser = await puppeteer.launch();
  t.context.page = await t.context.browser.newPage();
}

export async function closeBrowser(t) {
  const { page, browser } = t.context;
  await page.close();
  await browser.close();
}
