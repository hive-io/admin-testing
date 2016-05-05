'use strict';
const common = require('../common'),
      expect = require('chai').expect;

describe('Users', () => {
  
  beforeEach(() => {
    return common.login(browser, 'admin', 'admin', 'local' )
      .then(() => common.clickSidebarTab(browser, 'Users', 'System Users'))
  });

  afterEach(() => common.logout());
  
  it('should allow password changes for admin', () => {
  	return browser.waitUntil(
        browser.getAttribute('//td[text()="admin" and position()=1]/..//button[contains(@id,"cp")]', 'onclick')
          .then((cl) => { return cl !== null; })
      ,10000)
      .then(() => browser.click('//td[text()="admin" and position()=1]/..//button[contains(@id,"cp")]'))
  	  .then(() => browser.waitForExist('//td[text()="admin" and position()=1]/..//form//input[@id="password"]'))
      .then(() => browser.setValue('//td[text()="admin" and position()=1]/..//form//input[@id="password"]', 'admin'))
      .then(() => browser.waitUntil(
        browser.getAttribute('//td[text()="admin" and position()=1]/..//form//button[@type="submit"]', 'type')
          .then((cl) => { return cl !== null; })
      ,10000))
  	  .then(() => browser.click('//td[text()="admin" and position()=1]/..//form//button[@type="submit"]'))
      .then(() => browser.waitForExist('//h1[@class="page-header"]'))
      .then(() => browser.getText('//h1[@class="page-header"]'))
  	  .then((text) => expect(text).to.equal('System Users'));
  });

  it('should allow password changes for readonly user', () => {
  	return browser.waitForExist('//tbody')
      .then(() => browser.isExisting('//td[text()="readonly" and position()=1]/..//button[contains(@id,"cp")]'))
      .then((exists) => !exists ? common.createNewUser('readonly', 'local', 'readonly', 'admin') : null )
  	  .then(() => browser.waitForExist('//td[text()="readonly" and position()=1]/..//button[contains(@id,"cp")]', 5000))
      .then(() => common.waitAndClick('//td[text()="readonly" and position()=1]/..//button[contains(@id,"cp")]'))
  	  .then(() => browser.setValue('//td[text()="readonly" and position()=1]/..//input[@id="password"]', 'admin'))
  	  .then(() => browser.click('//td[text()="readonly" and position()=1]/..//button[@type="submit"]'))
  	  .then(() => browser.waitForExist('//h1[@class="page-header"]')) 
      .then(() => browser.getText('//h1[@class="page-header"]'))
  	  .then((text) => expect(text).to.equal('System Users'));
  });

  it('should allow deletion of readonly user', () => {
  	return common.waitAndClick('//td[text()="readonly" and position()=1]/..//button[contains(@id,"rm")]')
  	  .then(() => browser.waitForExist('//td[text()="readonly" and position()=1]/..//button[contains(@id,"rm")]', 5000, true))
  });

  it('should allow creation of a new readonly user', () => {
  	return common.createNewUser('readonly','local','readonly','admin')
      .then(() => browser.waitForExist('//td[text()="readonly" and position()=1]'));
  });

  it('should allow for creation and deletion of new admin user', () => {
    return common.createNewUser('test','local','admin','admin')
      .then(() => browser.waitForExist('//td[text()="test" and position()=1]/..//button[contains(@id,"rm")]'))
      .then(() => browser.waitUntil(
        browser.getAttribute('//td[text()="test" and position()=1]/..//button[contains(@id,"rm")]', 'onclick')
          .then((cl) => { return cl !== null; })
        ,10000))
      .then(() => browser.click('//td[text()="test" and position()=1]/..//button[contains(@id,"rm")]'))
      .then(() => browser.waitForExist('//td[text()="test" and position()=1]/..//button[contains(@id,"rm")]', 5000, true))
  });

  it('should not overwrite existing users', () => {
    let login = {name:'test', pass:'test123', wrongpass:'456exam', 
      realm:'local', role:'readonly'}
    return common.createNewUser(login.name, login.realm, login.role, login.pass)
      .then(() => common.createNewUser(login.name, login.realm, login.role, login.wrongpass))
      .then(() => common.logout())
      .then(() => common.login(browser, login.name, login.wrongpass, 'local' ))
      .then(() => browser.waitForExist('//div[contains(@class,"errormessage")]',5000))
      .then(() => common.login(browser, login.name, login.pass, 'local'))
      .then(() => common.clickSidebarTab(browser, 'Users', 'System Users'));
  });
  
  it('should not allow deletion of current admin user', () => {
    return browser.waitForExist(`//td[text()="admin" and position()=1]/..//button[contains(@id,"rm")]`, 5000, true)
  });
});
