'use strict';
const common = require('../common');

let guestNumber = 1,
    guestTotal = guestNumber * 2,
    checkList = [
      Math.ceil(guestNumber / 3),
      Math.ceil(guestNumber * (2 / 3)),
      guestNumber
    ].map( function(num) {
      if (num < 10) {
        return `000${num}`;
      } else if (num < 100) {
        return `00${num}`;
      } else if (num < 1000) {
        return `0${num}`;
      }
      return `${num}`;
    });

describe('Multiple Pools with Linux Guests', () => {
  before(() => {
    return common.login(browser, 'admin', 'admin', 'local')
      .then(() => common.setCloneDensity(guestTotal))
      .then(() => common.removeGuestPools())
      .then(() => common.removeTemplates())
      .then(() => common.addStoragePools())
      .then(() => common.addTemplate('universal!', 'templates', 'hio-tester.qcow2', 'Linux', true));
  });

  after(() => {
    return common.removeGuestPools()
      .then(() => common.removeTemplates())
      .then(() => common.removeStoragePools())
      .then(() => browser.refresh());
  });

  it('should create the first pool', () => {
    return common.addGuestPool(
      'serial!', 'universal!', 'Disk', `${guestNumber}`, '100', 'dangos', '1', '128', false);
  });

  it('should create the second pool', () => {
    return common.addGuestPool(
      'bus!', 'universal!', 'Disk', `${guestNumber}`, '100', 'roadtrip', '1', '128', false);
  });

  it('should check all requested guests exist', () => {
    return common.clickSidebarTab(browser, 'Guest Management')
      .then(() => browser.waitForExist(`//td[text()="DANGOS${checkList[0]}"]`, 60000))
      .then(() => browser.waitForExist(
        `//td[text()="DANGOS${checkList[0]}"]/..//td[text()="Ready"]`, 120000))
      .then(() => browser.waitForExist(`//td[text()="DANGOS${checkList[1]}"]`, 60000))
      .then(() => browser.waitForExist(
        `//td[text()="DANGOS${checkList[1]}"]/..//td[text()="Ready"]`, 120000))
      .then(() => browser.waitForExist(`//td[text()="DANGOS${checkList[2]}"]`, 60000))
      .then(() => browser.waitForExist(
        `//td[text()="DANGOS${checkList[2]}"]/..//td[text()="Ready"]`, 120000))
      .then(() => browser.waitForExist(`//td[text()="ROADTRIP${checkList[0]}"]`, 60000))
      .then(() => browser.waitForExist(
        `//td[text()="ROADTRIP${checkList[0]}"]/..//td[text()="Ready"]`, 120000))
      .then(() => browser.waitForExist(`//td[text()="ROADTRIP${checkList[1]}"]`, 60000))
      .then(() => browser.waitForExist(
        `//td[text()="ROADTRIP${checkList[1]}"]/..//td[text()="Ready"]`, 120000))
      .then(() => browser.waitForExist(`//td[text()="ROADTRIP${checkList[2]}"]`, 60000))
      .then(() => browser.waitForExist(
        `//td[text()="ROADTRIP${checkList[2]}"]/..//td[text()="Ready"]`, 120000))
      .then(() => browser.refresh())
      .then(() => browser.waitForExist(`//div[@id="tg" and text()="${guestTotal}"]`));
  });
});
