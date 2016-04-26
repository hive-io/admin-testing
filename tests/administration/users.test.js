'use strict';
const common = require('../common'),
      expect = require('chai').expect;

describe('Users', () => {
  // beforeEach(() => {
  // 	return common.login(browser, 'admin', 'admin', 'local')
  // 	  .then(() => common.clickSidebarTab(browser, 'Users', 'System Users')) 
  // });
  before(() => common.login(browser, 'admin', 'admin', 'local' ));

  it('should navigate to Users', () => common.clickSidebarTab(browser, 'Users', 'System Users'));
  
  it('should allow password changes for admin', () => {
  	return browser.click('//button[@id="cp_admin"]')
  	  .then(() => browser.setValue('//form[@id="edit_admin_form"]//input[@id="password"]', 'admin'))
  	  .then(() => browser.click('//form[@id="edit_admin_form"]//button[@type="submit"]'))
      .then(() => browser.waitForExist('//h1[@class="page-header"]'))
      .then(() => browser.getText('//h1[@class="page-header"]'))
  	  .then((text) => expect(text).to.equal('System Users'));
  });

  it('should allow password changes for readonly user', () => {
  	return browser.isExisting('//button[@id="cp_readonly"]')
      .then((exists) => {
        if (!exists) {
          browser.click('//button[@id="add_user"]')
            .setValue('//form[@id="add_user_form"]//input[@id="username"]', 'readonly')
            .selectByVisibleText('//form[@id="add_user_form"]//select[@id="arealm"]', 'local')
            .selectByVisibleText('//form[@id="add_user_form"]//select[@id="role"]', 'readonly')
            .setValue('//form[@id="add_user_form"]//input[@id="password"]', 'admin')
            .click('//form[@id="add_user_form"]//button[@type="submit"]')
        }
      })
  	  .then(() => browser.waitForExist('//button[@id="cp_readonly"]'))
      .then(() => browser.click('//button[@id="cp_readonly"]'))
  	  .then(() => browser.setValue('//form[@id="edit_readonly_form"]//input[@id="password"]', 'admin'))
  	  .then(() => browser.click('//form[@id="edit_readonly_form"]//button[@type="submit"]'))
  	  .then(() => browser.waitForExist('//h1[@class="page-header"]')) 
      .then(() => browser.getText('//h1[@class="page-header"]'))
  	  .then((text) => expect(text).to.equal('System Users'));
  });

  it('should allow deletion of readonly user', () => {
  	return browser.click('//button[@id="rm_readonly"]')
  	  .then(() => browser.waitForExist('//button[@id="rm_readonly"]', 500, true))
      .then(() => browser.isExisting('//button[@id="rm_readonly"]'))
      .then((exist) => expect(exist).to.be.false);
  });

  it('should allow creation of a new readonly user', () => {
  	return browser.waitForExist('//button[@id="add_user"]', 1000)
      .then(() => browser.click('//button[@id="add_user"]'))
  	  .then(() => browser.setValue('//form[@id="add_user_form"]//input[@id="username"]', 'readonly'))
  	  .then(() => browser.selectByVisibleText('//form[@id="add_user_form"]//select[@id="arealm"]', 'local'))
  	  .then(() => browser.selectByVisibleText('//form[@id="add_user_form"]//select[@id="role"]', 'readonly'))
  	  .then(() => browser.setValue('//form[@id="add_user_form"]//input[@id="password"]', 'admin'))
  	  .then(() => browser.click('//form[@id="add_user_form"]//button[@type="submit"]'))
      .then(() => browser.waitForExist('//button[@id="rm_readonly"]'))
      .then(() => browser.isExisting('//button[@id="rm_readonly"]'))
      .then((exist) => expect(exist).to.be.true);
  });
});

