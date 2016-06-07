'use strict';
const Promise = require('bluebird'),
      common = require('../common'),
      expect = require('chai').expect;

const addRealmButton = '//*[@id="add_realm"]',
      realmName = '//*[@id="name"]',
      fqdn = '//*[@id="fqdn"]',
      submit = '//*[@id="realm_form"]/button[1]';

let NFSlocation = !!process.env.NFS ? process.env.NFS : '192.168.11.4';

describe.only('OU Validation', () => {
  before(() => {
    return common.isLoggedIn()
      .then((loggedIn) => !loggedIn ? common.login(browser, 'admin', 'admin', 'local') : null )
      .then(() => common.clickSidebarTab(browser, 'Templates'));
  });

  after(() => browser.refresh());

  it('should delete all existing templates', () => {
    return browser.waitForExist('//tbody')
      .then(() => browser.elements('//button[text()="Remove"]'))
      .then(elements => Promise.mapSeries(elements.value, () => {
        return browser.waitForExist('//*[contains(@class,"modal-backdrop")]', 3000, true)
          .then(() => common.waitAndClick('(//button[text()="Remove"])[1]'))
          .then(() => browser.waitForExist('//*[@id="popup" and @style="display: block;"]'))
          .then(() => browser.waitForEnabled('//*[@id="popup"]//button[text()="Confirm"]'))
          .then(() => common.waitAndClick('//*[@id="popup"]//button[text()="Confirm"]'))
          .then(() => browser.waitForExist('//*[contains(@class,"modal-backdrop")]', 3000, true))
          .then(() => browser.refresh());
      }))
      .then(() => browser.waitForExist('//button[text()="Remove"]', 1000, true));
  });

  it('should add a Windows template', () => {
    return common.waitAndClick('//button[@id="add_tmpl"]')
      .then(() => browser.waitForExist('//*[@id="add_tmpl_form"]'))
      .then(() => browser.setValue('//*[@id="add_tmpl_form"]//*[@id="name"]', 'folicle'))
      .then(() => browser.setValue('//*[@id="add_tmpl_form"]//*[@id="path"]',
        `${NFSlocation}:/NFS/Guests/w7-vsi`))
      .then(() => browser.selectByVisibleText('//*[@id="os"]', 'Windows 7'))
      .then(() => common.waitAndClick('//*[@id="add_tmpl_form"]//*[@id="subBtn"]'))
      .then(() => browser.waitForExist('//td[1 and text()="folicle"]'))
      .then(() => browser.isExisting('//td[1 and text()="folicle"]'))
      .then(ex => expect(ex).to.be.true);
  });

  it('should check hiveio.local exists', () => {
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
              '//*[@id="fqdn-message" and contains(text()," Realm verified.")]', 5000))
            .then(() => common.waitAndClick(submit))
            .then(() => browser.waitForExist('//td[text()="HIVEIO"]'));
        }
        return null;
      });
  });

  it('should set max clone density', () => {
    return common.clickSidebarTab(browser, 'Appliance', 'Appliance Settings')
      .then(() => common.waitAndSet('//*[@id="maxCloneDensity"]', '20'))
      .then(() => common.waitAndClick('//button[text()="Submit"]'))
      .then(() => browser.waitForExist('//*[@id="reconfigure"]', 15000, true))
      .then(() => browser.pause(2500))
      .then(() => browser.refresh());
  });

  it('should create a pool and validate the OU', () => {
    return common.clickSidebarTab(browser, 'Guest Pools')
      .then(() => common.waitAndClick('//*[@id="add_pool"]'))
      .then(() => browser.setValue('//*[@id="name"]', 'tolerance'))
      .then(() => browser.selectByVisibleText('//*[@id="goldImage"]', 'folicle'))
      .then(() => browser.setValue('//*[@id="minCloneDensity"]', '1'))
      .then(() => browser.setValue('//*[@id="maxCloneDensity"]', '2'))
      .then(() => browser.setValue('//*[@id="seed"]', 'drops'))
      .then(() => browser.setValue('//*[@id="mem"]', '128'))
      .then(() => browser.selectByVisibleText('//*[@id="Domain"]', 'HIVEIO'))
      .then(() => common.waitAndSet('//*[@id="OU"]',
        'ou=rds vdi, ou=LoginVSI,OU=Testing,dc=eng,ec=wintel,dc=ubseng,dc=net'))
      .then(() => common.waitAndSet('//*[@id="userGroup"]', 'hiveusers'))
      .then(() => common.waitAndSet('//*[@id="user"]', 'administrator'))
      .then(() => common.waitAndSet('//*[@id="Password"]', 'Ric0chet'))
      .then(() => browser.isExisting('//*[@id="OU"]'))
      .then(ex => {
        if (!ex) {
          return common.waitAndClick('//*[@id="subBtn"]')
            .then(() => browser.waitForExist('//td[1 and text()="tolerance"]', 10000));
        }
        return expect(ex).to.be.false;
      });
  });
});
