'use strict';
const common = require('../../common'),
      expect = require('chai').expect;

describe('New User Validations', () => {
  beforeEach(() => common.login(browser, 'admin', 'admin', 'local' )
  	.then(() => common.clickSidebarTab(browser, 'Users', 'System Users')));
  after(() => common.logout());

  it('should not allow empty name', () => {
  	return common.createNewUser('', 'local', 'readonly', 'admin')
      .then(() => browser.waitForExist('//td[not(string()) and position()=1]', 5000, true))
  });

  it('should not allow an empty password', () => {
  	return common.createNewUser('test_user', 'local', 'readonly', '')
      .then(() => browser.waitForExist('//td[text()="test_user" and position()=1]', 5000, true))

  });

});
