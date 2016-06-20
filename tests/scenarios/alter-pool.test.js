'use strict';
const common = require('../common'),
      Promise = require('bluebird'),
      expect = require('chai').expect,
      config = require('../../testconfig');

let addBtn = '//button[@id="add_tmpl"]',
    addTmpForm = '//*[@id="add_tmpl_form"]',
    addName = '//*[@id="add_tmpl_form"]//*[@id="name"]',
    addPath = '//*[@id="add_tmpl_form"]//*[@id="path"]',
    submit = '//*[@id="add_tmpl_form"]//*[@id="subBtn"]',
    os = '//*[@id="os"]',
    genSubmit = '//*[@id="subBtn"]';

describe('Alter Running Pool', () => {
  before(() => {
    return common.isLoggedIn()
      .then((loggedIn) => !loggedIn ? common.login(browser, 'admin', 'admin', 'local') : null )
      .then(() => common.clickSidebarTab(browser, 'Templates'));
  });

  after(() => browser.refresh());

  it('should add a template', () => {
    return browser.waitForVisible('//tbody')
      .then(() => browser.isExisting('//td[1 and text()="dynamism"]'))
      .then((ex) => {
        if (!!ex) {
          return common.waitAndClick('//td[1 and text()="dynamism"]/..//button[@type="delete"]')
            .then(() => common.confirmPopup());
        }
        return null;
      })
      .then(() => common.waitAndClick(addBtn))
      .then(() => browser.waitForExist(addTmpForm))
      .then(() => browser.setValue(addName, 'dynamism'))
      .then(() => browser.setValue(addPath,
        `${config.nfsIP}:${config.nfsPath}${config.tmplPath}/hio-tester.qcow2`))
      .then(() => browser.selectByVisibleText(os, 'Linux'))
      .then(() => common.waitAndClick(submit))
      .then(() => browser.pause(500))
      .then(() => browser.isVisible(submit))
      .then(ex => ex ? common.waitAndClick(submit) : null)
      .then(() => browser.waitForExist('//td[1 and text()="dynamism"]'))
      .then(() => browser.isExisting('//td[1 and text()="dynamism"]'))
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

  it('should create a new guest pool', () => {
    return common.clickSidebarTab(browser, 'Guest Pools')
     .then(() => common.waitAndClick('//*[@id="add_pool"]'))
     .then(() => browser.setValue('//*[@id="name"]', 'donuts'))
     .then(() => browser.selectByVisibleText('//*[@id="goldImage"]', 'dynamism'))
     .then(() => browser.setValue('//*[@id="minCloneDensity"]', '1'))
     .then(() => browser.setValue('//*[@id="maxCloneDensity"]', '2'))
     .then(() => browser.setValue('//*[@id="seed"]', 'drops'))
     .then(() => browser.setValue('//*[@id="mem"]', '128'))
     .then(() => common.waitAndClick(genSubmit))
     .then(() => browser.waitForExist('//td[1 and text()="donuts"]', 10000));
  });

  it('should check that the guests are created and are ready', () => {
    return common.clickSidebarTab(browser, 'Guest Management')
      .then(() => browser.waitForExist('//td[text()="DROPS0001"]', 24000))
      .then(() => browser.waitForExist('//td[text()="DROPS0001"]/..//td[text()="Ready"]', 20000))
      .then(() => browser.refresh())
      .then(() => browser.pause(750))
      .then(() => browser.getText('//div[@id="tg"]'))
      .then(text => expect(text).to.equal('1'));
  });

  it('should change the number of guests', () => {
    return common.clickSidebarTab(browser, 'Guest Pools')
      .then(() => common.waitAndClick('//*[text()="DROPS"]/..//button[text()="Edit"]'))
      .then(() => common.waitAndSet('//*[@id="minCloneDensity"]', '2'))
      .then(() => browser.scroll(-200, 0))
      .then(() => common.waitAndClick(genSubmit))
      .then(() => browser.isExisting(genSubmit))
      .then(ex =>  ex ? common.waitAndClick(genSubmit) : null);
  });

  it('should check that another guest is created', () => {
    return common.clickSidebarTab(browser, 'Guest Management')
      .then(() => browser.waitUntil(() => {
        return browser.isExisting('//td[text()="DROPS0002"]')
          .then(ex => ex === true);
      }, 60000))
      .then(() => browser.waitForExist('//td[text()="DROPS0002"]/..//td[text()="Ready"]', 20000))
      .then(() => browser.refresh())
      .then(() => browser.pause(750))
      .then(() => browser.getText('//div[@id="tg"]'))
      .then(text => expect(text).to.equal('2'))
      .then(() => browser.pause(10000));
  });

  it('should delete the pool', () => {
    return common.clickSidebarTab(browser, 'Guest Pools')
      .then(() => common.waitAndClick('//td[1 and text()="donuts"]/..//button[text()="Delete"]'))
      .then(() => common.confirmPopup());
  });

  it('should undefine and delete the template', () => {
    return common.clickSidebarTab(browser, 'Templates')
      .then(() => common.waitAndClick(
        '//td[1 and text()="dynamism"]/..//td//button[text()="Unload"]'))
      .then(() => common.waitAndClick(
        '//td[1 and text()="dynamism"]/..//td//button[text()="Remove"]'))
      .then(() => common.confirmPopup())
      .then(() => browser.waitForExist('//td[1 and text()="dynamism"]', 10000, true))
      .then(() => browser.isExisting('//td[1 and text()="dynamism"]'))
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
