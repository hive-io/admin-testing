'use strict';
const common = require('../common'),
      Promise = require('bluebird'),
      expect = require('chai').expect,
      config = require('../../testconfig');

describe('Add Windows Template and Test Pool', () => {
  before(() => {
    return common.isLoggedIn()
      .then((loggedIn) => !loggedIn ? common.login(browser, 'admin', 'admin', 'local') : null )
      .then(() => common.clickSidebarTab(browser, 'Templates'));
  });

  after(() => browser.refresh());

  it('should add a Windows 7 template', () => {
    return browser.waitForVisible('//tbody')
      .then(() => browser.isExisting('//td[1 and text()="fish"]'))
      .then((ex) => {
        if (!!ex) {
          return common.waitAndClick('//td[1 and text()="fish"]/..//button[@type="delete"]')
            .then(() => common.confirmPopup());
        }
        return null;
      })
      .then(() => common.waitAndClick('//button[@id="add_tmpl"]'))
      .then(() => browser.waitForExist('//*[@id="add_tmpl_form"]'))
      .then(() => browser.setValue('//*[@id="add_tmpl_form"]//*[@id="name"]', 'fish'))
      .then(() => browser.setValue('//*[@id="add_tmpl_form"]//*[@id="path"]',
        `${config.nfsIP}:${config.nfsPath}${config.tmplPath}/w7-vsi`))
      .then(() => browser.selectByVisibleText('//*[@id="os"]', 'Windows 7'))
      .then(() => common.waitAndClick('//*[@id="add_tmpl_form"]//*[@id="subBtn"]'))
      .then(() => browser.pause(500))
      .then(() => browser.isVisible('//*[@id="add_tmpl_form"]//*[@id="subBtn"]'))
      .then(ex => ex ? common.waitAndClick('//*[@id="add_tmpl_form"]//*[@id="subBtn"]') : null)
      .then(() => browser.waitForExist('//td[1 and text()="fish"]'))
      .then(() => browser.isExisting('//td[1 and text()="fish"]'))
      .then(ex => expect(ex).to.be.true);
  });

  it('should set max clone density', () => {
    return common.clickSidebarTab(browser, 'Appliance', 'Appliance Settings')
      .then(() => common.waitAndSet('//*[@id="maxCloneDensity"]', '20'))
      .then(() => common.waitAndClick('//button[text()="Submit"]'))
      .then(() => browser.waitForExist('//*[@id="reconfigure"]', 15000, true))
      .then(() => browser.pause(2500))
      .then(() => browser.refresh());
  });

  it('should create a new guest pool with no realm', () => {
    return common.clickSidebarTab(browser, 'Guest Pools')
     .then(() => common.waitAndClick('//*[@id="add_pool"]'))
     .then(() => browser.setValue('//*[@id="name"]', 'mola'))
     .then(() => browser.selectByVisibleText('//*[@id="goldImage"]', 'fish'))
     .then(() => browser.setValue('//*[@id="minCloneDensity"]', '1'))
     .then(() => browser.setValue('//*[@id="maxCloneDensity"]', '2'))
     .then(() => browser.setValue('//*[@id="seed"]', 'EELS'))
     .then(() => browser.setValue('//*[@id="mem"]', '2048'))
     .then(() => common.waitAndClick('//*[@id="subBtn"]'))
     .then(() => browser.waitForExist('//td[1 and text()="mola"]', 10000))
     .then(() => common.clickSidebarTab(browser, 'Templates'))
     .then(() => browser.waitForExist('//td[text()="Live (mola)"]', 240000));
  });

  it('should check that the guest is created and ready', () => {
    return common.clickSidebarTab(browser, 'Guest Management')
      .then(() => browser.waitForExist('//td[text()="EELS0001"]', 240000))
      .then(() => browser.waitForExist('//td[text()="EELS0001"]/..//td[text()="Ready"]', 240000))
      .then(() => browser.refresh())
      .then(() => browser.pause(750))
      .then(() => browser.getText('//div[@id="tg"]'))
      .then(text => expect(text).to.equal('1'));
  });

  it('should delete the pool', () => {
    return common.clickSidebarTab(browser, 'Guest Pools')
      .then(() => common.waitAndClick('//td[1 and text()="mola"]/..//button[text()="Delete"]'))
      .then(() => common.confirmPopup());
  });

  it('should undefine and delete the template', () => {
    return common.clickSidebarTab(browser, 'Templates')
      .then(() => common.waitAndClick(
        '//td[1 and text()="fish"]/..//td//button[text()="Unload"]'))
      .then(() => common.waitAndClick(
        '//td[1 and text()="fish"]/..//td//button[text()="Remove"]'))
      .then(() => common.confirmPopup())
      .then(() => browser.waitForExist('//td[1 and text()="fish"]', 10000, true))
      .then(() => browser.isExisting('//td[1 and text()="fish"]'))
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
