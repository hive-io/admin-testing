'use strict';
const common = require('../../common'),
      expect = require('chai').expect;

describe('New User Validations', () => {
  before(() => {
    return common.isLoggedIn()
      .then((loggedIn) => { 
        if(!loggedIn) {
          return common.login(browser, 'admin', 'admin', 'local')
        }
      })
      .then(() => common.clickSidebarTab(browser, 'Users', 'System Users'))
  });

  it('should not allow user creation with empty name', () => {
    return common.createNewUser('', 'local', 'readonly', 'admin')
      .then(() => browser.waitForExist('//tbody'))
      .then(() => browser.isExisting('//td[not(string()) and position()=1]'))
      .then((ex) => expect(ex).to.be.false)
  });

  it('should not allow user creation with an empty password', () => {
    return common.createNewUser('test_user', 'local', 'readonly', '')
      .then(() => browser.waitForExist('//tbody'))
      .then(() => browser.isExisting('//td[text()="test_user" and position()=1]'))
      .then((ex) => expect(ex).to.be.false)
  });

  it('should not overwrite existing users', () => {
    let login = {name:'test', pass:'test123', wrongpass:'456exam', 
      realm:'local', role:'readonly'};
    let wrongLogged;
    return common.createNewUser(login.name, login.realm, login.role, login.pass)
      .then(() => common.createNewUser(login.name, login.realm, login.role, login.wrongpass))
      .then(() => common.logout())
      .then(() => common.login(browser, login.name, login.wrongpass, 'local' ))
      .then(() => common.isLoggedIn())
      .then((ex) => wrongLogged = ex)
      .then(() => common.logout())
      .then(() => common.login(browser, 'admin', 'admin', 'local'))
      .then(() => common.clickSidebarTab(browser, 'Users', 'System Users'))
      .then(() => expect(wrongLogged).to.be.false);
  });

  it('should delete all test related users', () => {});
});
