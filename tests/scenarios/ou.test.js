'use strict';
const Promise = require('bluebird'),
      common = require('../common'),
      expect = require('chai').expect,
      config = require('../../testconfig');

const addRealmButton = '//*[@id="add_user"]',
      realmName = '//*[@id="name"]',
      fqdn = '//*[@id="fqdn"]',
      submit = '//*[@id="realm_form"]/button[1]';

describe('OU Validation', () => {
  before(() => {
    return common.isLoggedIn()
      .then((loggedIn) => !loggedIn ? common.login(browser, 'admin', 'admin', 'local') : null )
      .then(() => common.clickSidebarTab(browser, 'Templates'))
      .then(() => browser.waitForExist('//tbody'))
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
      .then(() => browser.waitForExist('//button[text()="Remove"]', 1000, true))
      // create template
      .then(() => common.waitAndClick('//button[@id="add_tmpl"]'))
      .then(() => browser.waitForExist('//*[@id="add_tmpl_form"]'))
      .then(() => browser.setValue('//*[@id="add_tmpl_form"]//*[@id="name"]', 'folicle'))
      .then(() => browser.setValue('//*[@id="add_tmpl_form"]//*[@id="path"]',
        `${config.nfsIP}:${config.nfsPath}${config.tmplPath}/w7-vsi`))
      .then(() => browser.selectByVisibleText('//*[@id="os"]', 'Windows 7'))
      .then(() => common.waitAndClick('//*[@id="add_tmpl_form"]//*[@id="subBtn"]'))
      .then(() => browser.waitForExist('//td[1 and text()="folicle"]'))
      .then(() => browser.isExisting('//td[1 and text()="folicle"]'))
      .then(ex => expect(ex).to.be.true)
      // create realm
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
              '//*[@id="fqdn-message" and contains(text()," Realm verified.")]', 5000))
            .then(() => common.waitAndClick(submit))
            .then(() => browser.waitForExist('//td[text()="HIVEIO"]'));
        }
        return null;
      })
      // set max clone density
      .then(() => common.clickSidebarTab(browser, 'Appliance', 'Appliance Settings'))
      .then(() => common.waitAndSet('//*[@id="maxCloneDensity"]', '20'))
      .then(() => common.waitAndClick('//button[text()="Submit"]'))
      .then(() => browser.waitForExist('//*[@id="reconfigure"]', 15000, true))
      .then(() => browser.pause(2500))
      .then(() => browser.refresh());
  });

  after(() => {
    return browser.refresh()
      //clear template
      .then(() => common.clickSidebarTab(browser, 'Templates'))
      .then(() => browser.waitForExist('//tbody'))
      .then(() => browser.elements('//button[text()="Remove"]'))
      .then(elements => Promise.mapSeries(elements.value, () => {
        return browser.waitForExist('//*[contains(@class,"modal-backdrop")]', 30000, true)
          .then(() => common.waitAndClick('(//button[text()="Remove"])[1]'))
          .then(() => browser.waitForExist('//*[@id="popup" and @style="display: block;"]', 30000))
          .then(() => browser.waitForEnabled('//*[@id="popup"]//button[text()="Confirm"]', 30000))
          .then(() => common.waitAndClick('//*[@id="popup"]//button[text()="Confirm"]'))
          .then(() => browser.waitForExist('//*[contains(@class,"modal-backdrop")]', 30000, true))
          .then(() => browser.refresh());
      }))
      .then(() => browser.waitForExist('//button[text()="Remove"]', 1000, true))
      //remove realm
      .then(() => common.clickSidebarTab(browser, 'Realms'))
      .then(() => browser.elements('//button[text()="Delete"]'))
      .then(els => Promise.mapSeries(els.value, () => {
        return browser.waitForExist('//*[contains(@class,"modal-backdrop")]', 3000, true)
          .then(() => common.waitAndClick('(//button[text()="Delete"])[1]'))
          .then(() => browser.waitForExist('//*[@id="popup" and @style="display: block;"]'))
          .then(() => common.waitAndClick('//*[@id="popup"]//button[text()="Confirm"]'))
          .then(() => browser.waitForExist('//*[contains(@class,"modal-backdrop")]', 3000, true))
          .then(() => browser.refresh());
      }));
  });

  it('should validate the OU format (UBS Test)', () => {
    return common.clickSidebarTab(browser, 'Guest Pools')
      .then(() => common.waitAndClick('//*[@id="add_pool"]'))
      .then(() => browser.setValue('//*[@id="name"]', 'tolerance'))
      .then(() => browser.selectByVisibleText('//*[@id="goldImage"]', 'folicle'))
      .then(() => browser.selectByVisibleText('//*[@id="Domain"]', 'HIVEIO'))
      .then(() => common.waitAndSet('//*[@id="OU"]',
        'ou=rds vdi, ou=LoginVSI,OU=Testing,dc=eng,dc=wintel,dc=ubseng,dc=net'))
      .then(() => common.waitAndSet('//*[@id="userGroup"]', 'anyText'))
      .then(() => browser.isExisting('//*[@id="ou-message"]'))
      .then(ex => {
        return expect(ex).to.be.false;
      });
  });
});
