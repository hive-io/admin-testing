const common = require('../common'),
      expect = require('chai').expect;

describe('Convert Image', () => {
  beforeEach(() => common.login(browser, 'admin', 'admin', 'local')
    .then(() => common.clickSidebarTab(browser, 'Convert Image'))
  );
  afterEach(() => common.logout());

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

  it('should clear old source error messages', () => {
    return browser.setValue('//input[@id="source"]', 'invalid input')
      .then(() => browser.click('//button[@id="btn_convert"]'))
      .then(() => browser.setValue('//input[@id="source"]', ''))
      .then(() => browser.click('//button[@id="btn_convert"]'))
      .then(() => browser.waitForExist('//input[@id="source"]/..//i[position()=2])',500,true))
  });

  it('should clear old output error messages', () => {
    return browser.setValue('//input[@id="output"]', 'invalid input')
      .then(() => browser.click('//button[@id="btn_convert"]'))
      .then(() => browser.setValue('//input[@id="output"]', ''))
      .then(() => browser.click('//button[@id="btn_convert"]'))
      .then(() => browser.waitForExist('//input[@id="output"]/..//i[position()=2])',500,true))
  });      
});
