'use strict';
const common = require('../common');

describe('Test the Functionality of Guest Actions', () => {
  before(() => {
    return common.login(browser, 'admin', 'admin', 'local')
      .then(() => common.setCloneDensity('10'))
      .then(() => common.removeGuestPools())
      .then(() => common.removeTemplates())
      .then(() => common.removeStoragePools())
      .then(() => common.addStoragePools())
      .then(() => common.addTemplate('cruller', 'templates', 'hio-tester.qcow2', 'Linux', true))
      .then(() => common.addGuestPool('coral', 'cruller', 'Disk', '1', '2', 'apples', '1', '512', false))
      .then(() => common.clickSidebarTab(browser, 'Guest Management'))
      .then(() => browser.waitForExist('//td[text()="APPLES0001"]', 60000))
      .then(() => browser.waitForExist('//td[text()="APPLES0001"]/..//td[text()="Ready"]', 120000))
      .then(() => browser.refresh())
      .then(() => browser.waitForExist('//div[@id="tg" and text()="1"]'));
  });

  after(() => {
    return common.removeGuestPools()
      .then(() => common.removeTemplates())
      .then(() => common.removeStoragePools())
      .then(() => browser.refresh());
  });

  it('shutdown should remove the current guest and a new one should appear', () => {
    return common.waitAndClick('//button[contains(text(), "Action")]')
      .then(() => common.waitAndClick('//*[contains(text(), "Shutdown")]'))
      .then(() => browser.pause(500))
      .then(() => browser.waitForExist('//td[text()="APPLES0001"]/..//td[text()="Ready"]'));
  });

  it('reboot should restart the current guest', () => {
    return common.waitAndClick('//button[contains(text(), "Action")]')
      .then(() => common.waitAndClick('//*[contains(text(), "Reboot")]'))
      .then(() => browser.pause(500))
      .then(() => browser.waitForExist('//td[text()="APPLES0001"]/..//td[text()="Ready"]'));
  });

  it('power off should turn off the current guest and start a new one', () => {
    return common.waitAndClick('//button[contains(text(), "Action")]')
      .then(() => common.waitAndClick('//*[contains(text(), "Power Off")]'))
      .then(() => browser.pause(500))
      .then(() => browser.waitForExist('//td[text()="APPLES0001"]/..//td[text()="Ready"]'));
  });

  it('reset should restart the current guest', () => {
    return common.waitAndClick('//button[contains(text(), "Action")]')
      .then(() => common.waitAndClick('//*[contains(text(), "Reset")]'))
      .then(() => browser.pause(500))
      .then(() => browser.waitForExist('//td[text()="APPLES0001"]/..//td[text()="Ready"]'));
  });

  it('suspend should pause the guest', () => {
    return common.waitAndClick('//button[contains(text(), "Action")]')
      .then(() => common.waitAndClick('//*[contains(text(), "Reset")]'))
      .then(() => browser.pause(500))
      .then(() => browser.waitForExist('//td[text()="APPLES0001"]/..//td[text()="Ready"]'));
  });

  it('should open a new window when you click on console', () => {
    let oldIds, newIds;
    return browser.getTabIds()
      .then((ids) => { oldIds = ids; })
      .then(() =>  common.waitAndClick('//button[contains(text(), "Action")]'))
      .then(() => common.waitAndClick('//*[contains(text(), "Console")]'))
      .then(() => browser.waitUntil(() => {
        return browser.getTabIds()
          .then((ids) => {
            newIds = ids;
            return oldIds !== ids;
          });
      }))
      .then(() => browser.switchTab(newIds[1]))
      .then(() => browser.close())
      .then(() => browser.waitForVisible('//td[text()="APPLES0001"]/..//td[text()="Ready"]'));
  });
});
