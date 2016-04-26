'use strict';
const common = require('../../common'),
      expect = require('chai').expect;

describe('New User Validations', () => {
  before(() => { 
	common.login(browser, 'admin', 'admin', 'local' )
	.then(() => common.clickSidebarTab(browser, 'Users', 'System Users'));
  });

  it('should not allow empty name', () => {
  	return browser.waitForExist('//button[@id="add_user"]')
      .then(() => browser.click('//button[@id="add_user"]'))
  	  .then(() => browser.setValue('//form[@id="add_user_form"]//input[@id="username"]', ''))
  	  .then(() => browser.selectByVisibleText('//form[@id="add_user_form"]//select[@id="arealm"]', 'local'))
  	  .then(() => browser.selectByVisibleText('//form[@id="add_user_form"]//select[@id="role"]', 'readonly'))
  	  .then(() => browser.setValue('//form[@id="add_user_form"]//input[@id="password"]', 'admin'))
  	  .then(() => browser.click('//form[@id="add_user_form"]//button[@type="submit"]'))
      .then(() => browser.waitForExist('//button[@id="rm_"]', 500, true))
  });

  it('should not allow an empty password', () => {
  	return browser.waitForExist('//button[@id="add_user"]')
      .then(() => browser.click('//button[@id="add_user"]'))
  	  .then(() => browser.setValue('//form[@id="add_user_form"]//input[@id="username"]', 'test_user'))
  	  .then(() => browser.selectByVisibleText('//form[@id="add_user_form"]//select[@id="arealm"]', 'local'))
  	  .then(() => browser.selectByVisibleText('//form[@id="add_user_form"]//select[@id="role"]', 'readonly'))
  	  .then(() => browser.setValue('//form[@id="add_user_form"]//input[@id="password"]', ''))
  	  .then(() => browser.click('//form[@id="add_user_form"]//button[@type="submit"]'))
      .then(() => browser.waitForExist('//button[@id="rm_test_user"]', 500, true))
  });

  it('should clean up', () => {
    return browser.isExisting('//button[@id="rm_"]')
	  .then((ex) => ex ? browser.click('//button[@id="rm_"]') : null)
	  .then(() => browser.isExisting('//button[@id="rm_test_user"]'))
	  .then((ex) => ex ? browser.click('//button[@id="rm_test_user"]') : null)
  });
});