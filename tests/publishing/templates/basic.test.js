'use strict';
const common = require('../../common'),
      expect = require('chai').expect;

describe('Templates', () => {
  before(() => common.login(browser, 'admin', 'admin', 'local'));
  after(() => common.logout());
  it('should navigate to Templates', () => common.clickSidebarTab(browser, 'Templates'));

  it('should allow user to create a new template', () => {
    return common.waitForOnClick('//button[@id="new_tmpl"]')
      .then(() => browser.click('//button[@id="new_tmpl"]'))
      .then(() => browser.waitForExist('//div[@id="editTemplate"]//h1[@class="page-header"]'))
      .then(() => browser.getText('//div[@id="editTemplate"]//h1[@class="page-header"]'))
      .then(title => expect(title).to.equal('Create New Template'));
  });

  it('should allow user to cancel creating a new template', () => {
    return common.waitForOnClick('//*[@id="newTmplForm"]/div[11]/button[2 and text()="Cancel"]')
      .then(() => browser.click('//*[@id="newTmplForm"]/div[11]/button[2 and text()="Cancel"]'))
      .then(() => browser.waitForExist('//*[@id="newTmplForm"]', 1000, true));
  });

  it('should allow user to add a template', () => {
    return browser.waitForExist('//*[@id="tmpl_form" and @class="hidden"]')
      .then(() => common.waitForOnClick('//*[@id="add_tmpl"]'))
      .then(() => browser.click('//*[@id="add_tmpl"]'))
      .then(() => browser.waitForExist('//*[@id="add_tmpl_form"]'))
  });

  it('should allow user to cancel adding a template', () => {
    return common.waitForOnClick('//*[@id="add_tmpl_form"]/div[3]/button[2 and text()="Cancel"]')
      .then(() => browser.click('//*[@id="add_tmpl_form"]/div[3]/button[2 and text()="Cancel"]'))
      .then(() => browser.waitForExist('//*[@id="tmpl_form" and @class="hidden"]'));
  });

});
