//TO DO:

//ADD REALM USER CREATION AFTER GETTING TO REALMS

'use strict';
const common = require('../../common'),
      Promise = require('bluebird'),
      expect = require('chai').expect;

const changePass = '//td[text()="admin" and position()=1]/..//button[text()="change password"]',
      header = '//h1[@class="page-header"]';

describe.only('Users Basic', () => {
  before(() => {
    return common.isLoggedIn()
      .then((loggedIn) => !loggedIn ? common.login(browser, 'admin', 'admin', 'local') : null )
      .then(() => common.clickSidebarTab(browser, 'Users', 'System Users'));
  });

  it('should delete all existing users', () => {
    return browser.elements('//button[text()="Delete User"]')
      .then(els => Promise.mapSeries(els.value, () => {
        return common.waitAndClick('(//button[text()="Delete User"])[1]')
          .then(() => browser.refresh());
      }));
  });

  it('should allow password changes for admin', () => {
    return common.waitAndClick(
        changePass)
      .then(() => browser.waitForExist(
        '//td[text()="admin" and position()=1]/..//form//input[@id="password"]'))
      .then(() => browser.setValue(
        '//td[text()="admin" and position()=1]/..//form//input[@id="password"]', 'password'))
      .then(() => browser.waitUntil(() =>
        browser.getAttribute(
          '//td[text()="admin" and position()=1]/..//form//button[@type="submit"]', 'type')
          .then((cl) => { return cl !== null; }), 10000))
      .then(() => browser.click(
        '//td[text()="admin" and position()=1]/..//form//button[@type="submit"]'))
      .then(() => browser.waitForExist(header))
      .then(() => browser.getText(header))
      .then((text) => expect(text).to.equal('System Users'))
      .then(() => common.logout())
      .then(() => common.login(browser, 'admin', 'password', 'local'))
      .then(() => common.clickSidebarTab(browser, 'Users', 'System Users'))
      //login with new password then change admin password back
      .then(() => common.waitAndClick(
        changePass))
      .then(() => browser.waitForExist(
        '//td[text()="admin" and position()=1]/..//form//input[@id="password"]'))
      .then(() => browser.setValue(
        '//td[text()="admin" and position()=1]/..//form//input[@id="password"]', 'admin'))
      .then(() => browser.waitUntil(() =>
        browser.getAttribute(
          '//td[text()="admin" and position()=1]/..//form//button[@type="submit"]', 'type')
          .then((cl) => { return cl !== null; }), 10000))
      .then(() => browser.click(
        '//td[text()="admin" and position()=1]/..//form//button[@type="submit"]'))
      .then(() => browser.waitForExist(header))
      .then(() => browser.getText(header))
      .then((text) => expect(text).to.equal('System Users'))
      .then(() => common.logout())
      .then(() => common.login(browser, 'admin', 'admin', 'local'))
      .then(() => common.clickSidebarTab(browser, 'Users', 'System Users'));
  });

  it('should not allow password to be changed to empty string', () => {
    let emptyLogged;
    return browser.waitForExist('//tbody')
      .then(() => browser.isExisting('//td[text()="readonly" and position()=1]'))
      .then((exists) => !exists ? common.createNewUser(
        'readonly', 'local', 'readonly', 'admin') : null )
      .then(() => common.waitAndClick(
        '//td[text()="readonly" and position()=1]/..//button[text()="change password"]'))
      .then(() => browser.waitForExist(
        '//td[text()="readonly" and position()=1]/..//input[@id="password"]'))
      .then(() => browser.setValue(
        '//td[text()="readonly" and position()=1]/..//input[@id="password"]', ''))
      .then(() => browser.click(
        '//td[text()="readonly" and position()=1]/..//button[@type="submit"]'))
      .then(() => common.logout())
      .then(() => common.login(browser, 'readonly', '', 'local'))
      .then(() => common.isLoggedIn())
      .then(logged => { emptyLogged = logged; })
      .then(() => !!emptyLogged ? common.logout() : null )
      .then(() => common.login(browser, 'admin', 'admin', 'local'))
      .then(() => common.clickSidebarTab(browser, 'Users', 'System Users'))
      .then(() => expect(emptyLogged).to.be.false);
  });

  it('should allow password changes for readonly user', () => {
    return browser.waitForExist('//tbody')
      .then(() => browser.isExisting(
        '//td[text()="readonly" and position()=1]/..//button[text()="change password"]'))
      .then((exists) => !exists ? common.createNewUser(
        'readonly', 'local', 'readonly', 'admin') : null )
      .then(() => common.waitAndClick(
        '//td[text()="readonly" and position()=1]/..//button[text()="change password"]'))
      .then(() => browser.setValue(
        '//td[text()="readonly" and position()=1]/..//input[@id="password"]', 'password'))
      .then(() => common.waitAndClick(
        '//td[text()="readonly" and position()=1]/..//button[@type="submit"]'))
      .then(() => browser.waitForExist(header))
      .then(() => browser.getText(header))
      .then((text) => expect(text).to.equal('System Users'))
      .then(() => common.logout())
      .then(() => common.login(browser, 'readonly', 'password', 'local'))
      .then(() => common.clickSidebarTab(browser, 'Users', 'System Users'))
      //login with new password on readonly, check that you cannot change the password
      //then log back in as admin and change it back
      .then(() => browser.waitForExist('//tbody'))
      .then(() => browser.waitForEnabled(
        '//td[text()="readonly" and position()=1]/..//button[text()="change password"]',
        1000, true))
      .then(() => common.logout())
      .then(() => common.login(browser, 'admin', 'admin', 'local'))
      .then(() => common.clickSidebarTab(browser, 'Users', 'System Users'))
      .then(() => common.waitAndClick(
        '//td[text()="readonly" and position()=1]/..//button[text()="change password"]'))
      .then(() => browser.waitForExist(
        '//td[text()="readonly" and position()=1]/..//input[@id="password"]'))
      .then(() => browser.setValue(
        '//td[text()="readonly" and position()=1]/..//input[@id="password"]', 'admin'))
      .then(() => common.waitAndClick(
        '//td[text()="readonly" and position()=1]/..//button[@type="submit"]'))
      .then(() => browser.waitForExist(header))
      .then(() => browser.getText(header))
      .then((text) => expect(text).to.equal('System Users'));
  });

  it('should allow deletion of readonly user', () => {
    return common.logout()
      .then(() => common.login(browser, 'admin', 'admin', 'local'))
      .then(() => common.clickSidebarTab(browser, 'Users', 'System Users'))
      .then(() => browser.waitForExist('//tbody'))
      .then(() => browser.isExisting(
        '//td[text()="readonly" and position()=1]/..//button[text()="change password"]'))
      .then((exists) => !exists ? common.createNewUser(
        'readonly', 'local', 'readonly', 'admin') : null )
      .then(() => common.waitAndClick(
        '//td[text()="readonly" and position()=1]/..//button[text()="Delete User"]'))
      .then(() => browser.waitForExist(
        '//td[text()="readonly" and position()=1]/..//button[text()="Delete User"]',
        5000, true));
  });

  it('should allow creation of a new readonly user', () => {
    return common.createNewUser('readonly', 'local', 'readonly', 'admin')
      .then(() => browser.waitForExist('//td[text()="readonly" and position()=1]'))
      .then(() => common.logout())
      .then(() => common.login(browser, 'readonly', 'admin', 'local'))
      .then(() => common.logout())
      .then(() => common.login(browser, 'admin', 'admin', 'local'))
      .then(() => common.clickSidebarTab(browser, 'Users', 'System Users'));
  });

  it('should allow for creation and deletion of new admin user', () => {
    return common.createNewUser('test', 'local', 'admin', 'admin')
      .then(() => browser.waitForExist(
        '//td[text()="test" and position()=1]/..//button[text()="Delete User"]'))
      .then(() => common.logout())
      .then(() => common.login(browser, 'test', 'admin', 'local'))
      .then(() => common.logout())
      .then(() => common.login(browser, 'admin', 'admin', 'local'))
      .then(() => common.clickSidebarTab(browser, 'Users', 'System Users'))
      .then(() => common.waitAndClick(
        '//td[text()="test" and position()=1]/..//button[text()="Delete User"]'))
      .then(() => browser.waitForExist(
        '//td[text()="test" and position()=1]/..//button[text()="Delete User"]', 5000, true));
  });

  it('should not allow deletion of current admin user', () => {
    return browser.waitForExist(
      '//td[text()="admin" and position()=1]/..//button[text()="Delete User"]', 5000, true);
  });

  it('should delete all existing users', () => {
    return browser.elements('//button[text()="Delete User"]')
      // .then(els => console.log(els.value))
      .then(els => Promise.mapSeries(els.value, () => {
        return common.waitAndClick('(//button[text()="Delete User"])[1]')
          .then(() => browser.refresh());
      }));
  });
});
