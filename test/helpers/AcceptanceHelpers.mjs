// ------- Imports -------------------------------------------------------------

import puppeteer from 'puppeteer';
import chai from 'chai';

// ------- Init ----------------------------------------------------------------

export const BASE_URL = process.env.PAGERBEAUTY_URL || 'http://127.0.0.1:8080';
export const BASE_URL_WITH_AUTH = process.env.PAGERBEAUTY_URL_WITH_AUTH || 'http://127.0.0.1:8081';
const { expect } = chai;

// ------- Helpers -------------------------------------------------------------

export class PageTest {
  constructor(page) {
    this.page = page;
  }

  async expectTitleContains(text) {
    expect(await this.page.title()).to.contain(text);
  }

  async expectClass(selector, className) {
    expect(
      await this.hasClass(selector, className),
    ).to.be.true;
  }

  async expectNoClass(selector, className) {
    expect(
      await this.hasClass(selector, className),
    ).to.be.false;
  }

  async expectText(selector, text) {
    expect(
      await this.getTextContent(selector),
    ).to.equal(text);
  }

  async expectAttr(selector, attr, value) {
    expect(
      await this.getAttr(selector, attr),
    ).to.equal(value);
  }

  async expectAttrMatch(selector, attr, re) {
    expect(
      await this.getAttr(selector, attr),
    ).to.match(re);
  }

  async expectAttrContains(selector, attr, substring) {
    expect(
      await this.getAttr(selector, attr),
    ).to.contain(substring);
  }

  async expectNoElements(selector) {
    expect(
      await this.page.$$eval(selector, nodes => nodes.length),
    ).to.equal(0);
  }

  async hasClass(selector, className) {
    return this.page.$eval(
      selector,
      (node, classInBrowser) => node.classList.contains(classInBrowser),
      className,
    );
  }

  async getTextContent(selector) {
    return this.page.$eval(selector, node => node.textContent);
  }

  async getAttr(selector, attr) {
    return this.page.$eval(
      selector,
      (node, attrInBrowser) => node.getAttribute(attrInBrowser),
      attr,
    );
  }
}

export class AcceptanceHelpers {
  static async openBrowser(t) {
    t.context.browser = await puppeteer.launch({
      executablePath: process.env.CHROME_PATH,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
    });
  }

  static async closeBrowser(t) {
    const { page, browser } = t.context;
    if (page) {
      await page.close();
    }
    await browser.close();
  }

  static openPage(url) {
    return async (t) => {
      const page = await t.context.browser.newPage();
      t.context.page = page;
      t.context.pageResponse = await page.goto(`${BASE_URL}${url}`);
      t.context.pageTest = new PageTest(page);
    };
  }

  static openPageWithAuth(url) {
    return async (t) => {
      const page = await t.context.browser.newPage();
      t.context.page = page;
      // Authenticate
      await page.authenticate({
        username: process.env.PAGERBEAUTY_HTTP_USER,
        password: process.env.PAGERBEAUTY_HTTP_PASSWORD,
      });
      t.context.pageResponse = await page.goto(`${BASE_URL_WITH_AUTH}${url}`);
      t.context.pageTest = new PageTest(page);
    };
  }

  static waitFor(selector) {
    return async (t, run) => {
      const { page } = t.context;
      await page.waitForSelector(selector);
      await run(t);
    };
  }

  static withNewPage() {
    return async (t, run) => {
      const { browser } = t.context;
      const page = await browser.newPage();
      await run(t, page);
      await page.close();
    };
  }
}

// ------- End -----------------------------------------------------------------
