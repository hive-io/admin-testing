'use strict';
const Promise = require('bluebird'),
      common = require('../common'),
      expect = require('chai').expect,
      config = require('../../testconfig');

describe('Pool Validations', () => {
  before(() => {
    return common.isLoggedIn()
      .then((loggedIn) => !loggedIn ? common.login(browser, 'admin', 'admin', 'local') : null )
      .then(() => common.clickSidebarTab(browser, 'Templates'));
  });

  after(() => browser.refresh());

  it('should add a template', () => {
    return browser.waitForVisible('//tbody')
      .then(() => browser.isExisting('//td[1 and text()="carnival"]'))
      .then((ex) => {
        if (!!ex) {
          return common.waitAndClick('//td[1 and text()="carnival"]/..//button[@type="delete"]')
            .then(() => common.confirmPopup());
        }
        return null;
      })
      .then(() => common.waitAndClick('//button[@id="add_tmpl"]'))
      .then(() => browser.waitForExist('//*[@id="add_tmpl_form"]'))
      .then(() => browser.setValue('//*[@id="add_tmpl_form"]//*[@id="name"]', 'carnival'))
      .then(() => browser.setValue('//*[@id="add_tmpl_form"]//*[@id="path"]',
        `${config.nfsIP}:${config.nfsPath}${config.tmplPath}/hio-tester.qcow2`))
      .then(() => browser.selectByVisibleText('//*[@id="os"]', 'Linux'))
      .then(() => common.waitAndClick('//*[@id="add_tmpl_form"]//*[@id="subBtn"]'))
      .then(() => browser.waitForExist('//td[1 and text()="carnival"]'))
      .then(() => browser.isExisting('//td[1 and text()="carnival"]'))
      .then(ex => expect(ex).to.be.true);
  });

  it('should create a new guest pool', () => {
    return common.clickSidebarTab(browser, 'Guest Pools')
      .then(() => common.waitAndClick('//*[@id="add_pool"]'))
      .then(() => browser.setValue('//*[@id="name"]', 'donuts'))
      .then(() => browser.selectByVisibleText('//*[@id="goldImage"]', 'carnival'))
      .then(() => browser.setValue('//*[@id="minCloneDensity"]', '1'))
      .then(() => browser.setValue('//*[@id="maxCloneDensity"]', '2'))
      .then(() => browser.setValue('//*[@id="seed"]', 'devils'))
      .then(() => browser.setValue('//*[@id="mem"]', '128'))
      .then(() => common.waitAndClick('//*[@id="subBtn"]'))
      .then(() => browser.waitForExist('//td[1 and text()="donuts"]'));
  });

  it('should fail to create a second guest pool with the same name', () => {
    return common.clickSidebarTab(browser, 'Guest Pools')
      .then(() => common.waitAndClick('//*[@id="add_pool"]'))
      .then(() => browser.setValue('//*[@id="name"]', 'donuts'))
      .then(() => browser.selectByVisibleText('//*[@id="goldImage"]', 'carnival'))
      .then(() => browser.setValue('//*[@id="minCloneDensity"]', '1'))
      .then(() => browser.setValue('//*[@id="maxCloneDensity"]', '2'))
      .then(() => browser.setValue('//*[@id="seed"]', 'chortles'))
      .then(() => browser.setValue('//*[@id="mem"]', '128'))
      .then(() => common.waitAndClick('//*[@id="subBtn"]'))
      .then(() => browser.pause(1500))
      .then(() => browser.isExisting('//*[@id="popup"]//button[text()="Close"]'))
      .then(ex => !!ex ? common.waitAndClick('//*[@id="popup"]//button[text()="Close"]') : null)
      .then(() => browser.waitForExist('(//td[1 and text()="donuts"])[2]', 1500, true));
  });

  it('should fail to create a second guest pool with the same seed name', () => {
    return common.clickSidebarTab(browser, 'Guest Pools')
      .then(() => common.waitAndClick('//*[@id="add_pool"]'))
      .then(() => browser.setValue('//*[@id="name"]', 'bronuts'))
      .then(() => browser.selectByVisibleText('//*[@id="goldImage"]', 'carnival'))
      .then(() => browser.setValue('//*[@id="minCloneDensity"]', '1'))
      .then(() => browser.setValue('//*[@id="maxCloneDensity"]', '2'))
      .then(() => browser.setValue('//*[@id="seed"]', 'devils'))
      .then(() => browser.setValue('//*[@id="mem"]', '128'))
      .then(() => common.waitAndClick('//*[@id="subBtn"]'))
      .then(() => browser.pause(1500))
      .then(() => browser.isExisting('//*[@id="popup"]//button[text()="Close"]'))
      .then(ex => !!ex ? common.waitAndClick('//*[@id="popup"]//button[text()="Close"]') : null)
      .then(() => browser.waitForExist('(//td[1 and text()="donuts"])[2]', 1500, true));
  });

  it('should delete the pools', () => {
    return browser.elements('//td[1 and text()="donuts"]/..//button[text()="Delete"]')
      .then(els => Promise.mapSeries(els.value, () => {
        return browser.waitForExist('//*[contains(@class,"modal-backdrop")]', 3000, true)
          .then(() => common.waitAndClick(
            '(//td[1 and text()="donuts"]/..//button[text()="Delete"])[1]'))
          .then(() => common.confirmPopup())
          .then(() => browser.refresh());
      }));
  });

  it('should unload and delete the template', () => {
    return common.clickSidebarTab(browser, 'Templates')
      .then(() => common.waitAndClick('//td[1 and text()="carnival"]/..//td//button[text()="Unload"]'))
      .then(() => common.waitAndClick('//td[1 and text()="carnival"]/..//td//button[text()="Remove"]'))
      .then(() => common.confirmPopup())
      .then(() => browser.waitForExist('//td[1 and text()="carnival"]', 10000, true))
      .then(() => browser.isExisting('//td[1 and text()="carnival"]'))
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
