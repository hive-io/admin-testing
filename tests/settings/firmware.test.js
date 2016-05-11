'use strict';
const common = require('../common'),
      expect = require('chai').expect;

describe('Firmware', () => {
  before(() => common.login(browser, 'admin', 'admin', 'local'));
  after(() => common.logout());
  it('should navigate to Firmware', () =>
    common.clickSidebarTab(browser, 'Firmware', 'Firmware Management'));

  it('should stay on page after invalid selection', () => {
    let myURL;
    return browser.getUrl()
      .then((url) => myURL = url )
      .then(() => browser.waitForEnabled('//button[@type="submit"]', 10000))
      .then(() => browser.click('//button[@type="submit"]'))
      .then(() => browser.getUrl())
      .then((url) => expect(url).to.equal(myURL));
  });
  
});
