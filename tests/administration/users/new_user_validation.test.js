'use strict';
const common = require('../../common'),
      expect = require('chai').expect;

describe('New User Validations', () => {
  beforeEach(() => common.login(browser, 'admin', 'admin', 'local' )
  	.then(() => common.clickSidebarTab(browser, 'Users', 'System Users')));
  after(() => common.logout());

  it('should not allow empty name', () => {
  	return common.createNewUser('', 'local', 'readonly', 'admin')
      .then(() => console.log("GOT HERE"))
      .then(() => browser.waitForExist('//td[not(string()) and position()=1]', 500, true))
      .then(() => console.log("GOT HERE 2"));
  });

  it('should not allow an empty password', () => {
  	return common.createNewUser('test_user', 'local', 'readonly', '')
      .then(() => browser.waitForExist('//td[text()="test_user" and position()=1]', 500, true))

  });

  it('should clean up', () => {
    return browser.isExisting('//td[not(string()) and position()=1]')
  	  .then((ex) => ex ? browser.click('//td[not(string()) and position()=1]/..//button[contains(@id,"rm")]') : null)
  	  .then(() => browser.isExisting('//td[text()="test_user" and position()=1]'))
  	  .then((ex) => ex ? browser.click('//td[text()="test_user" and position()=1]/..//button[contains(@id,"rm")]') : null)
  });
});
