'use strict';
const common = require('../../common'),
      expect = require('chai').expect;

function loginAndClickTemplates() {
  return common.login(browser, 'admin', 'admin', 'local')
      .then(() => common.clickSidebarTab(browser, 'Templates'))
}

describe('Template Validations', () => {
  before(() => loginAndClickTemplates());
  after(() => common.logout());
  it('should refuse invalid template paths', () => {
    let form = '//form[@id="newTmplForm"]';
    return browser.click('//button[@id="new_tmpl"]')
      .then(() => browser.setValue(`${form}//input[@id="path"]`, 'invalid input'))
      .then(() => browser.click(`${form}//input[@name="name"]`))
      .then(() => browser.getText('//span[@id="path-message"]'))
      .then((text) => expect(text).to.equal("Path verification failed - can't mount destination."))
  });
});
