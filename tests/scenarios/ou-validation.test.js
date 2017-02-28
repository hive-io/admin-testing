'use strict';
const Promise = require('bluebird'),
      common = require('../common'),
      expect = require('chai').expect,
      config = require('../../testconfig');

const addRealmButton = '//*[@id="add_realm"]',
      realmName = '//*[@id="name"]',
      fqdn = '//*[@id="fqdn"]',
      submit = '//*[@id="realm_form"]/button[1]';

describe('OU Validation', () => {
  before(() => {
    return common.login(browser, 'admin', 'admin', 'local')
      .then(() => common.clickSidebarTab(browser, 'Realms'))
      .then(() => browser.waitForExist('//tbody'))
      .then(() => browser.isExisting('//td[text()="HIVEIO"]'))
      .then(ex => {
        if (!ex) {
          return common.waitAndClick(addRealmButton)
            .then(() => common.waitAndSet(realmName, 'hiveio'))
            .then(() => common.waitAndSet(fqdn, 'hiveio.local'))
            .then(() => common.waitAndClick(submit))
            .then(() => browser.waitForExist(
              '//*[@id="fqdn-message" and contains(text()," Realm verified.")]', 15000))
            .then(() => common.waitAndClick(submit))
            .then(() => browser.waitForExist('//td[text()="HIVEIO"]'));
        }
        return null;
      });
  });

  afterEach(() => {
    return browser.refresh();
  });

  it('should validate the OU format (UBS Test)', () => {
    return common.clickSidebarTab(browser, 'Profiles')
      .then(() => common.waitAndClick('//*[@id="add_np"]'))
      .then(() => browser.selectByVisibleText('//*[@id="realm"]', 'HIVEIO'))
      .then(() => common.waitAndSet('//*[@id="OU"]',
        'ou=rds vdi, ou=LoginVSI,OU=Testing,dc=eng,dc=wintel,dc=ubseng,dc=net'))
      .then(() => common.waitAndSet('//*[@id="userGroup"]', 'anyText'))
      .then(() => browser.isExisting('//*[@id="ou-message"]'))
      .then(ex => {
        return expect(ex).to.be.false;
      });
  });

  it('should fail invalid OU', () => {
    return common.clickSidebarTab(browser, 'Profiles')
      .then(() => common.waitAndClick('//*[@id="add_np"]'))
      .then(() => browser.selectByVisibleText('//*[@id="realm"]', 'HIVEIO'))
      .then(() => common.waitAndSet('//*[@id="OU"]',
        'ou=rds vdi, ou=LoginVSI,OU=Testing,dc=eng,dc=wintel,dc=ubseng,dc='))
      .then(() => common.waitAndSet('//*[@id="userGroup"]', 'anyText'))
      .then(() => browser.isExisting('//*[@id="ou-message"]'))
      .then(ex => {
        return expect(ex).to.be.true;
      });
  });
});
