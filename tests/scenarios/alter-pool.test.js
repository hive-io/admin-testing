'use strict';
const common = require('../common'),
      Promise = require('bluebird'),
      expect = require('chai').expect;

describe('Alter Running Pool', () => {
  before(() => {
    return common.login(browser, 'admin', 'admin', 'local')
      .then(() => common.removeGuestPools())
      .then(() => common.removeTemplates())
      .then(() => common.addStoragePools())
      .then(() => common.clickSidebarTab(browser, 'Templates'));
  });

  after(() => {
    return browser.refresh()
      .then(() => common.removeGuestPools())
      .then(() => common.removeTemplates())
      .then(() => common.removeStoragePools())
      //clear orphaned guests
      .then(() => common.clickSidebarTab(browser, 'Guest Management'))
      .then(() => browser.pause(3000))
      .then(() => browser.elements('//button[contains(text(), "Action")]'))
      .then(elements => {
        return Promise.mapSeries(elements.value, () => {
          return common.waitAndClick('//button[contains(text(), "Action")][1]')
            .then(() => common.waitAndClick('//*[contains(text(), "Power Off")][1]'));
        });
      });
  });

  it('should add a Linux template', () => {
    return common.addTemplate('dynamism', 'templates', 'hio-tester.qcow2', 'Linux', true)
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
    return common.addGuestPool('donuts', 'dynamism', 'Disk', '1', '2', 'drops', '1', '128', false)
     .then(() => browser.waitForExist('//td[1 and text()="donuts"]', 10000));
  });

  it('should check that the guests are created and are ready', () => {
    return common.clickSidebarTab(browser, 'Guest Management')
      .then(() => browser.waitForExist('//td[text()="DROPS0001"]', 200000))
      .then(() => browser.waitForExist('//td[text()="DROPS0001"]/..//td[text()="Ready"]', 200000))
      .then(() => browser.refresh())
      .then(() => browser.pause(750))
      .then(() => browser.getText('//div[@id="tg"]'))
      .then(text => expect(text).to.equal('1'));
  });

  it('should change the number of guests', () => {
    return common.clickSidebarTab(browser, 'Guest Pools')
      .then(() => common.waitAndClick('//*[text()="DROPS"]/..//button[text()="Edit"]'))
      .then(() => browser.scroll(-200, 0))
      .then(() => browser.pause(1000))
      .then(() => common.waitAndSet('//*[@id="minCloneDensity"]', '2'))
      .then(() => common.waitAndClick('//*[@id="subBtn"]'))
      .then(() => browser.isEnabled('//*[@id="subBtn"]'))
      .then(enabled => { if (enabled) common.waitAndClick('//*[@id="subBtn"]'); });
  });

  it('should check that another guest is created', () => {
    return common.clickSidebarTab(browser, 'Guest Management')
      .then(() => browser.waitUntil(() => {
        return browser.isExisting('//td[text()="DROPS0002"]')
          .then(ex => ex === true);
      }, 60000))
      .then(() => browser.waitForExist('//td[text()="DROPS0002"]/..//td[text()="Ready"]', 200000))
      .then(() => browser.refresh())
      .then(() => browser.pause(750))
      .then(() => browser.getText('//div[@id="tg"]'))
      .then(text => expect(text).to.equal('2'));
  });
});
