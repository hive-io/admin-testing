const common = require('../common'),
      expect = require('chai').expect;

describe('Convert Image', () => {
  before(() => common.login(browser, 'admin', 'admin', 'local'));
  it('should navigate to Convert Image', () =>
    common.clickSidebarTab(browser, 'Convert Image'));

  it('should validate empty source input', () => {
  	return browser.getValue('//input[@id="source"]')
  	  .then((text) => expect(text).to.equal(''))
  	  .then(() => browser.click('//button[@id="btn_convert"]'))
  	  .then(() => browser.isVisible('//div[@class="has-error"]'))
  });
});
