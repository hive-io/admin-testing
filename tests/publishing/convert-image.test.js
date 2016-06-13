// TO DO

// If the conversion is done on a large file the current
// implementation will eventually stop the spinner and
// alert the user that the conversion is still running
// (this is due to Nginx session timeout)

const common = require('../common'),
      expect = require('chai').expect;

const source = '//input[@id="source"]',
      convertBtn = '//button[@id="btn_convert"]',
      output = '//input[@id="output"]';

describe('Convert Image Basic', () => {
  before(() => {
    return common.isLoggedIn()
      .then((loggedIn) => !loggedIn ? common.login(browser, 'admin', 'admin', 'local') : null )
      .then(() => common.clickSidebarTab(browser, 'Convert Image'));
  });
  after(() => browser.refresh());

  it('should complain about empty source input', () => {
    return browser.getValue(source)
      .then((text) => expect(text).to.equal(''))
      .then(() => browser.click(convertBtn))
      .then(() => browser.isVisible('//div[@class="has-error"]'));
  });

  it('should complain about invalid source input', () => {
    return browser.setValue(source, 'invalid input')
      .then(() => browser.click(convertBtn))
      .then(() => browser.isVisible('//div[@class="has-error"]'));
  });

  it('should clear old source error messages', () => {
    return browser.setValue(source, 'invalid input')
      .then(() => browser.click(convertBtn))
      .then(() => browser.setValue(source, 'invalid input'))
      .then(() => browser.click(convertBtn))
      .then(() => browser.waitForExist('//input[@id="source"]/..//i[position()=2]',
      500, true));
  });

  it('should clear old output error messages', () => {
    return browser.setValue(output, 'invalid input')
      .then(() => browser.click(convertBtn))
      .then(() => browser.setValue(output, 'invalid input'))
      .then(() => browser.click(convertBtn))
      .then(() => browser.waitForExist('//input[@id="output"]/..//i[position()=2]', 500, true));
  });
});
