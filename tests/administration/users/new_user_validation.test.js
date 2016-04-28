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
      .then(() => browser.waitForExist('//td[not(string())]/..//button[contains(@id,"rm")]', 500, true))
  });

  it('should not allow an empty password', () => {
  	return browser.waitForExist('//button[@id="add_user"]')
      .then(() => browser.click('//button[@id="add_user"]'))
  	  .then(() => browser.setValue('//form[@id="add_user_form"]//input[@id="username"]', 'test_user'))
  	  .then(() => browser.selectByVisibleText('//form[@id="add_user_form"]//select[@id="arealm"]', 'local'))
  	  .then(() => browser.selectByVisibleText('//form[@id="add_user_form"]//select[@id="role"]', 'readonly'))
  	  .then(() => browser.setValue('//form[@id="add_user_form"]//input[@id="password"]', ''))
  	  .then(() => browser.click('//form[@id="add_user_form"]//button[@type="submit"]'))
      .then(() => browser.waitForExist('//td[text()="test_user"]/..//button[contains(@id,"rm")]', 500, true))
  });

  it('should clean up', () => {
    return browser.isExisting('//td[not(string())]/..//button[contains(@id,"rm")]')
	  .then((ex) => ex ? browser.click('//td[not(string())]/..//button[contains(@id,"rm")]') : null)
	  .then(() => browser.isExisting('//td[text()="test_user"]/..//button[contains(@id,"rm")]'))
	  .then((ex) => ex ? browser.click('//td[text()="test_user"]/..//button[contains(@id,"rm")]') : null)
  });
});