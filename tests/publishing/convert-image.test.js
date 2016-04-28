const common = require('../common'),
      expect = require('chai').expect;

describe('Convert Image', () => {
  beforeEach(() => common.login(browser, 'admin', 'admin', 'local')
    .then(() => common.clickSidebarTab(browser, 'Convert Image'))
  );

  // it('should navigate to Convert Image', () =>
  //   common.clickSidebarTab(browser, 'Convert Image'));

  it('should complain about empty source input', () => {
  	return browser.getValue('//input[@id="source"]')
  	  .then((text) => expect(text).to.equal(''))
  	  .then(() => browser.click('//button[@id="btn_convert"]'))
  	  .then(() => browser.isVisible('//div[@class="has-error"]'))
  });
  it('should complain about invalid source input', () => {
    return browser.setValue('//input[@id="source"]', 'invalid input')
      .then(() => browser.click('//button[@id="btn_convert"]'))
      .then(() => browser.isVisible('//div[@class="has-error"]'))
  });  
});
