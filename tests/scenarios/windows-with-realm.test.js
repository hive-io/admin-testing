'use strict';
const common = require('../common'),
      Promise = require('bluebird'),
      expect = require('chai').expect,
      config = require('../../testconfig');

const addRealmButton = '//*[@id="add_realm"]',
      realmName = '//*[@id="name"]',
      fqdn = '//*[@id="fqdn"]',
      submit = '//*[@id="realm_form"]/button[1]';

describe('Add Windows Template and Test Pool with Realm', () => {
  before(() => {
    return common.isLoggedIn()
      .then((loggedIn) => !loggedIn ? common.login(browser, 'admin', 'admin', 'local') : null )
      .then(() => common.clickSidebarTab(browser, 'Templates'));
  });

  after(() => browser.refresh());

  it('should add a Windows 7 template', () => {
    return browser.waitForVisible('//tbody')
      .then(() => browser.isExisting('//td[1 and text()="aries"]'))
      .then((ex) => {
        if (!!ex) {
          return common.waitAndClick('//td[1 and text()="aries"]/..//button[@type="delete"]')
            .then(() => common.confirmPopup());
        }
        return null;
      })
      .then(() => common.waitAndClick('//button[@id="add_tmpl"]'))
      .then(() => browser.waitForExist('//*[@id="add_tmpl_form"]'))
      .then(() => browser.setValue('//*[@id="add_tmpl_form"]//*[@id="name"]', 'aries'))
      .then(() => browser.setValue('//*[@id="add_tmpl_form"]//*[@id="path"]',
        `${config.nfsIP}:${config.nfsPath}${config.tmplPath}/w7-vsi`))
      .then(() => browser.selectByVisibleText('//*[@id="os"]', 'Windows 7'))
      .then(() => common.waitAndClick('//*[@id="add_tmpl_form"]//*[@id="subBtn"]'))
      .then(() => browser.pause(500))
      .then(() => browser.isVisible('//*[@id="add_tmpl_form"]//*[@id="subBtn"]'))
      .then(ex => ex ? common.waitAndClick('//*[@id="add_tmpl_form"]//*[@id="subBtn"]') : null)
      .then(() => browser.waitForExist('//td[1 and text()="aries"]'))
      .then(() => browser.isExisting('//td[1 and text()="aries"]'))
      .then(ex => expect(ex).to.be.true);
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

  it('should create a new guest pool using HIVEIO realm', () => {
    return common.clickSidebarTab(browser, 'Guest Pools')
     .then(() => common.waitAndClick('//*[@id="add_pool"]'))
     .then(() => browser.setValue('//*[@id="name"]', 'cancer'))
     .then(() => browser.selectByVisibleText('//*[@id="goldImage"]', 'aries'))
     .then(() => browser.setValue('//*[@id="minCloneDensity"]', '1'))
     .then(() => browser.setValue('//*[@id="maxCloneDensity"]', '2'))
     .then(() => browser.setValue('//*[@id="seed"]', 'VIRGO'))
     .then(() => browser.setValue('//*[@id="mem"]', '4096'))
     .then(() => browser.selectByVisibleText('//*[@id="Domain"]', 'HIVEIO'))
     //realm stuff!
     .then(() => common.waitAndSet('//*[@id="userGroup"]', 'hiveusers'))
     .then(() => common.waitAndSet('//*[@id="user"]', 'administrator'))
     .then(() => common.waitAndSet('//*[@id="Password"]', 'Ric0chet'))
     .then(() => common.waitAndClick('//*[@id="subBtn"]'))
     .then(() => browser.waitForExist('//td[1 and text()="cancer"]', 10000))
     .then(() => common.clickSidebarTab(browser, 'Templates'))
     .then(() => browser.waitForExist('//td[text()="Live (cancer)"]', 480000));
  });

  it('should check that the guest is created and ready', () => {
    return common.clickSidebarTab(browser, 'Guest Management')
      .then(() => browser.waitForExist('//td[text()="VIRGO0001"]', 480000))
      .then(() => browser.waitForExist('//td[text()="VIRGO0001"]/..//td[text()="Ready"]', 480000))
      .then(() => browser.refresh())
      .then(() => browser.pause(750))
      .then(() => browser.getText('//div[@id="tg"]'))
      .then(text => expect(text).to.equal('1'));
  });

  it('should delete the pool', () => {
    return common.clickSidebarTab(browser, 'Guest Pools')
      .then(() => common.waitAndClick('//td[1 and text()="cancer"]/..//button[text()="Delete"]'))
      .then(() => common.confirmPopup());
  });

  it('should undefine and delete the template', () => {
    return common.clickSidebarTab(browser, 'Templates')
      .then(() => common.waitAndClick(
        '//td[1 and text()="aries"]/..//td//button[text()="Unload"]'))
      .then(() => common.waitAndClick(
        '//td[1 and text()="aries"]/..//td//button[text()="Remove"]'))
      .then(() => common.confirmPopup())
      .then(() => browser.waitForExist('//td[1 and text()="aries"]', 10000, true))
      .then(() => browser.isExisting('//td[1 and text()="aries"]'))
      .then(ex => expect(ex).to.be.false);
  });

  it('should confirm no orphaned guests are left behind', () => {
    let orphanedGuests;
    return common.clickSidebarTab(browser, 'Guest Management')
      .then(() => browser.pause(3000))
      .then(() => browser.elements('//button[contains(text(), "Action")]'))
      .then(elements => {
        orphanedGuests = elements.value;
        return Promise.mapSeries(elements.value, el => {
          return common.waitAndClick('//button[contains(text(), "Action")][1]')
            .then(() => common.waitAndClick('//*[contains(text(), "Power Off")][1]'));
        });
      })
      .then(() => expect(orphanedGuests).to.be.empty);
  });
});
