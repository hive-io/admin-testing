'use strict';
const common = require('../common'),
      Promise = require('bluebird'),
      expect = require('chai').expect,
      config = require('../../testconfig');

const addRealmButton = '//*[@id="add_realm"]',
      realmName = '//*[@id="name"]',
      fqdn = '//*[@id="fqdn"]',
      submit = '//*[@id="realm_form"]/button[1]';

describe('Realm Add Windows Template and Test Pool', () => {
  before(() => {
    return common.login(browser, 'admin', 'admin', 'local')
      .then(() => common.removeGuestPools())
      .then(() => common.removeTemplates())
      .then(() => common.removeStoragePools())
      .then(() => common.addStoragePools())
      .then(() => common.setCloneDensity('10'));
  });

  after(() => {
    return common.removeGuestPools()
      .then(() => common.removeTemplates())
      .then(() => common.removeStoragePools())
      .then(() => browser.refresh());
  });

  it('should add a Windows 7 template', () => {
    return common.addTemplate('aries', 'templates', 'w7-vsi', 'Windows 7', false)
      .then(() => browser.waitForExist('//td[1 and text()="aries"]'));
  });

  it('should create the HIVEIO realm', () => {
    return common.clickSidebarTab(browser, 'Realms')
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
      });
  });

  it('should create a new HIVEIO profile', () => {
    return common.clickSidebarTab(browser, 'Profiles')
      .then(() => browser.isExisting('//td[text()="HIVEIO"]'))
      .then(ex => {
        if (!ex) {
          return common.waitAndClick('//*[@id="add_np"]')
            .then(() => common.waitAndSet('//*[@id="name"]', 'HIVEIO'))
            .then(() => browser.selectByVisibleText('//*[@id="realm"]', 'HIVEIO'))
            .then(() => common.waitAndSet('//*[@id="userGroup"]', 'hiveusers'))
            .then(() => common.waitAndSet('//*[@id="user"]', 'administrator'))
            .then(() => common.waitAndSet('//*[@id="password"]', 'Ric0chet'))
            .then(() => common.waitAndClick('//*[@id="subBtn"]'))
            .then(() => browser.waitForExist('//td[text()="HIVEIO"]'));
        }
      });
  });

  it('should create a new guest pool using HIVEIO profile', () => {
    return common.addGuestPool('daisy', 'aries', 'Disk', 2, 2, 'VIRGO', 2, 2048, true, 'HIVEIO')
     .then(() => common.clickSidebarTab(browser, 'Templates'))
     .then(() => browser.waitForExist('//td[text()="daisy"]', 480000));
  });

  it('should check that the guest is created and ready', () => {
    return common.clickSidebarTab(browser, 'Guest Management')
      .then(() => browser.waitForExist('//td[text()="VIRGO0001"]', 480000))
      .then(() => browser.waitForExist('//td[text()="VIRGO0001"]/..//td[text()="Ready"]', 480000))
      .then(() => browser.waitForExist('//td[text()="VIRGO0002"]/..//td[text()="Ready"]', 480000))
      .then(() => browser.refresh())
      .then(() => browser.pause(750))
      .then(() => browser.getText('//div[@id="tg"]'))
      .then(text => expect(text).to.equal('2'));
  });
});
