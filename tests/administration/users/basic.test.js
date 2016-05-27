//TO DO:

//ADD REALM USER CREATION AFTER GETTING TO REALMS

'use strict';
const common = require('../../common'),
      expect = require('chai').expect;

describe('Users', () => {
  
  beforeEach(() => {
    return common.isLoggedIn()
      .then((loggedIn) => { 
        if(!loggedIn) {
          return common.login(browser, 'admin', 'admin', 'local')
        }
      })
  })
  
  it('should navigate to Users', () => common.clickSidebarTab(browser, 'Users', 'System Users'));

  it('should allow password changes for admin', () => {
    return common.waitAndClick('//td[text()="admin" and position()=1]/..//button[contains(@id,"cp")]')
      .then(() => browser.waitForExist('//td[text()="admin" and position()=1]/..//form//input[@id="password"]'))
      .then(() => browser.setValue('//td[text()="admin" and position()=1]/..//form//input[@id="password"]', 'password'))
      .then(() => browser.waitUntil(() =>
        browser.getAttribute('//td[text()="admin" and position()=1]/..//form//button[@type="submit"]', 'type')
          .then((cl) => { return cl !== null })
      ,10000))
      .then(() => browser.click('//td[text()="admin" and position()=1]/..//form//button[@type="submit"]'))
      .then(() => browser.waitForExist('//h1[@class="page-header"]'))
      .then(() => browser.getText('//h1[@class="page-header"]'))
      .then((text) => expect(text).to.equal('System Users'))
      .then(() => common.logout())
      .then(() => common.login(browser, 'admin', 'password', 'local'))
      .then(() => common.clickSidebarTab(browser, 'Users', 'System Users'))
      //login with new password then change admin password back
      .then(() => common.waitAndClick('//td[text()="admin" and position()=1]/..//button[contains(@id,"cp")]'))
      .then(() => browser.waitForExist('//td[text()="admin" and position()=1]/..//form//input[@id="password"]'))
      .then(() => browser.setValue('//td[text()="admin" and position()=1]/..//form//input[@id="password"]', 'admin'))
      .then(() => browser.waitUntil(() =>
        browser.getAttribute('//td[text()="admin" and position()=1]/..//form//button[@type="submit"]', 'type')
          .then((cl) => { return cl !== null })
      ,10000))
      .then(() => browser.click('//td[text()="admin" and position()=1]/..//form//button[@type="submit"]'))
      .then(() => browser.waitForExist('//h1[@class="page-header"]'))
      .then(() => browser.getText('//h1[@class="page-header"]'))
      .then((text) => expect(text).to.equal('System Users'))
      .then(() => common.logout())
      .then(() => common.login(browser, 'admin', 'admin', 'local'))
      .then(() => common.clickSidebarTab(browser, 'Users', 'System Users'))
  });

  it('should not allow password to be changed to empty string', () => {
    let emptyLogged;
    return browser.waitForExist('//tbody')
      .then(() => browser.isExisting('//td[text()="readonly" and position()=1]/..//button[contains(@id,"cp")]'))
      .then((exists) => !exists ? common.createNewUser('readonly', 'local', 'readonly', 'admin') : null )
      .then(() => browser.waitForExist('//td[text()="readonly" and position()=1]/..//button[contains(@id,"cp")]', 5000))
      .then(() => common.waitAndClick('//td[text()="readonly" and position()=1]/..//button[contains(@id,"cp")]'))
      .then(() => browser.waitForExist('//td[text()="readonly" and position()=1]/..//input[@id="password"]'))
      .then(() => browser.setValue('//td[text()="readonly" and position()=1]/..//input[@id="password"]', ''))
      .then(() => browser.click('//td[text()="readonly" and position()=1]/..//button[@type="submit"]'))
      .then(() => common.logout())
      .then(() => common.login(browser, 'readonly', '', 'local'))
      .then(() => common.isLoggedIn())
      .then((logged) => emptyLogged = logged)
      .then(() => common.logout())
      .then(() => common.login(browser, 'admin', 'admin', 'local'))
      .then(() => common.clickSidebarTab(browser, 'Users', 'System Users'))      
      .then(() => expect(emptyLogged).to.be.false)
  });    

  it('should allow password changes for readonly user', () => {
    return browser.waitForExist('//tbody')
      .then(() => browser.isExisting('//td[text()="readonly" and position()=1]/..//button[contains(@id,"cp")]'))
      .then((exists) => !exists ? common.createNewUser('readonly', 'local', 'readonly', 'admin') : null )
      .then(() => common.waitAndClick('//td[text()="readonly" and position()=1]/..//button[contains(@id,"cp")]'))
      .then(() => browser.setValue('//td[text()="readonly" and position()=1]/..//input[@id="password"]', 'password'))
      .then(() => common.waitAndClick('//td[text()="readonly" and position()=1]/..//button[@type="submit"]'))
      .then(() => browser.waitForExist('//h1[@class="page-header"]')) 
      .then(() => browser.getText('//h1[@class="page-header"]'))
      .then((text) => expect(text).to.equal('System Users'))
      .then(() => common.logout())
      .then(() => common.login(browser, 'readonly', 'password', 'local'))
      .then(() => common.clickSidebarTab(browser, 'Users', 'System Users'))
      //login with new password on readonly, check that you cannot change the password
      //then log back in as admin and change it back
      .then(() => browser.waitForExist('//tbody'))
      .then(() => browser.waitForEnabled('//td[text()="readonly" and position()=1]/..//button[contains(@id,"cp")]', 1000, true))
      .then(() => common.logout())
      .then(() => common.login(browser, 'admin', 'admin', 'local'))
      .then(() => common.clickSidebarTab(browser, 'Users', 'System Users'))
      .then(() => common.waitAndClick('//td[text()="readonly" and position()=1]/..//button[contains(@id,"cp")]'))
      .then(() => browser.waitForExist('//td[text()="readonly" and position()=1]/..//input[@id="password"]'))
      .then(() => browser.setValue('//td[text()="readonly" and position()=1]/..//input[@id="password"]', 'admin'))
      .then(() => common.waitAndClick('//td[text()="readonly" and position()=1]/..//button[@type="submit"]'))
      .then(() => browser.waitForExist('//h1[@class="page-header"]')) 
      .then(() => browser.getText('//h1[@class="page-header"]'))
      .then((text) => expect(text).to.equal('System Users'))
  });

  it('should allow deletion of readonly user', () => {
    return common.waitAndClick('//td[text()="readonly" and position()=1]/..//button[contains(@id,"rm")]')
      .then(() => browser.waitForExist('//td[text()="readonly" and position()=1]/..//button[contains(@id,"rm")]', 5000, true))
  });

  it('should allow creation of a new readonly user', () => {
    return common.createNewUser('readonly','local','readonly','admin')
      .then(() => browser.waitForExist('//td[text()="readonly" and position()=1]'))
      .then(() => common.logout())
      .then(() => common.login(browser, 'readonly', 'admin', 'local'))
      .then(() => common.logout())
      .then(() => common.login(browser, 'admin', 'admin', 'local'))
      .then(() => common.clickSidebarTab(browser, 'Users', 'System Users'))      
  });

  it('should allow for creation and deletion of new admin user', () => {
    return common.createNewUser('test','local','admin','admin')
      .then(() => browser.waitForExist('//td[text()="test" and position()=1]/..//button[contains(@id,"rm")]'))
      .then(() => common.logout())
      .then(() => common.login(browser, 'test', 'admin', 'local'))
      .then(() => common.logout())
      .then(() => common.login(browser, 'admin', 'admin', 'local'))
      .then(() => common.clickSidebarTab(browser, 'Users', 'System Users'))
      .then(() => common.waitAndClick('//td[text()="test" and position()=1]/..//button[contains(@id,"rm")]'))
      .then(() => browser.waitForExist('//td[text()="test" and position()=1]/..//button[contains(@id,"rm")]', 5000, true))
  });
  
  it('should not allow deletion of current admin user', () => {
    return browser.waitForExist(`//td[text()="admin" and position()=1]/..//button[contains(@id,"rm")]`, 5000, true)
  });

});

// describe('Test User Cleanup');

//DELETE ALL NEW USERS CREATED DURING TESTING
