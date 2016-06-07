'use strict';
const common = require('../common'),
      expect = require('chai').expect;

describe('Firmware', () => {
  before(() => {
    return common.isLoggedIn()
      .then((loggedIn) => !loggedIn ? common.login(browser, 'admin', 'admin', 'local') : null );
  });
  after(() => browser.refresh());
  it('should navigate to Firmware', () =>
    common.clickSidebarTab(browser, 'Firmware', 'Firmware Management'));

  it('should stay on page after invalid selection', () => {
    let myURL;
    return browser.getUrl()
      .then((url) => { myURL = url; })
      .then(() => browser.waitForEnabled('//button[@type="submit"]', 10000))
      .then(() => browser.click('//button[@type="submit"]'))
      .then(() => browser.getUrl())
      .then((url) => expect(url).to.equal(myURL));
  });
});
