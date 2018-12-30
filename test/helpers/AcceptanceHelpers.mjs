// ------- Imports -------------------------------------------------------------

import puppeteer from 'puppeteer';
import chai from 'chai';

// ------- Init ----------------------------------------------------------------

const { expect } = chai;

// ------- Helpers -------------------------------------------------------------

export class AcceptanceHooks {
  static async openBrowser(t) {
    t.context.browser = await puppeteer.launch({
      executablePath: process.env.CHROME_PATH,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
    });
    t.context.page = await t.context.browser.newPage();
  }

  static async closeBrowser(t) {
    const { page, browser } = t.context;
    await page.close();
    await browser.close();
  }
}

export class AcceptanceAssert {
  static async expectTitletoContain(page, text) {
    expect(await page.title()).to.contain(text);
  }

  static async expectClass(page, selector, className) {
    expect(
      await AcceptanceAssert.hasClass(page, selector, className),
    ).to.be.true;
  }

  static async expectNoClass(page, selector, className) {
    expect(
      await AcceptanceAssert.hasClass(page, selector, className),
    ).to.be.false;
  }

  static async expectText(page, selector, text) {
    expect(
      await AcceptanceAssert.getTextContent(page, selector),
    ).to.equal(text);
  }

  static async expectAttr(page, selector, attr, value) {
    expect(
      await AcceptanceAssert.getAttr(page, selector, attr),
    ).to.equal(value);
  }

  static async expectAttrMatch(page, selector, attr, re) {
    expect(
      await AcceptanceAssert.getAttr(page, selector, attr),
    ).to.match(re);
  }

  static async expectAttrContains(page, selector, attr, substring) {
    expect(
      await AcceptanceAssert.getAttr(page, selector, attr),
    ).to.contain(substring);
  }

  static async expectNoElements(page, selector) {
    expect(
      await page.$$eval(selector, nodes => nodes.length),
    ).to.equal(0);
  }

  static async hasClass(page, selector, className) {
    return page.$eval(
      selector,
      (node, classInBrowser) => node.classList.contains(classInBrowser),
      className,
    );
  }

  static async getTextContent(page, selector) {
    return page.$eval(selector, node => node.textContent);
  }

  static async getAttr(page, selector, attr) {
    return page.$eval(
      selector,
      (node, attrInBrowser) => node.getAttribute(attrInBrowser),
      attr,
    );
  }
}

// ------- End -----------------------------------------------------------------
