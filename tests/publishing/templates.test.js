'use strict';
const common = require('../common'),
      expect = require('chai').expect;

describe('Templates', () => {
  before(() => common.login(browser, 'admin', 'admin', 'local'));
  after(() => common.logout());
  it('should navigate to Templates', () => common.clickSidebarTab(browser, 'Templates'));

  it('should allow user to create a new template', () => {
    let realHeader = '//div[@id="editTemplate"]//h1[@class="page-header"]';
    return browser.click('//button[@id="new_tmpl"]')
      .then(() => browser.waitForExist(realHeader))
      .then(() => browser.getText(realHeader))
      .then(title => expect(title).to.equal('Create New Template'));
  });

  it('should fill in the new template data', () => {
    let name = '//form[@id="newTmplForm"]//input[@name="name"]';
    return browser.waitForEnabled(name)
      .then(() => browser.setValue(name, 'Windows 10.1 x64 RE'))
      .then(() => browser.getValue(name))
      .then((text) => expect(text).to.equal('Windows 10.1 x64 RE'));
  });



});


