'use strict';
const common = require('../common');

describe('Pool Validations', () => {
  before(() => {
    return common.login(browser, 'admin', 'admin', 'local')
      .then(() => common.removeGuestPools())
      .then(() => common.removeTemplates())
      .then(() => common.addStoragePools())
      .then(() => common.addTemplate('carnival', 'templates', 'hio-tester.qcow2', 'Linux', false));
  });

  after(() => {
    return common.removeGuestPools()
      .then(() => common.removeTemplates())
      .then(() => common.removeStoragePools())
      .then(() => browser.refresh());
  });

  it('should create a new guest pool', () => {
    return common.addGuestPool(
      'dernuts', 'carnival', 'Disk', '1', '10', 'devils', '1', '128', false);
  });

  it('should fail to create a second guest pool with the same name', () => {
    return common.addGuestPool(
      'dernuts', 'carnival', 'Disk', '1', '10', 'congas', '1', '128', false)
      .then(() => browser.pause(1500))
      .then(() => browser.isExisting('//*[@id="popup"]//button[text()="Close"]'))
      .then(ex => !!ex ? common.waitAndClick('//*[@id="popup"]//button[text()="Close"]') : null)
      .then(() => browser.waitForExist('(//td[1 and text()="dernuts"])[2]', 1500, true));
  });

  it('should fail to create a second guest pool with the same seed name', () => {
    return common.addGuestPool(
      'bronuts', 'carnival', 'Disk', '1', '10', 'devils', '1', '128', false)
      .then(() => browser.pause(1500))
      .then(() => browser.isExisting('//*[@id="popup"]//button[text()="Close"]'))
      .then(ex => !!ex ? common.waitAndClick('//*[@id="popup"]//button[text()="Close"]') : null)
      .then(() => browser.waitForExist('//td[1 and text()="bronuts"]', 1500, true));
  });

  it('should check the guest was created', () => {
    return common.clickSidebarTab(browser, 'Guest Management')
      .then(() => browser.waitForExist('//td[text()="DEVILS0001"]/..//td[text()="Ready"]', 240000));
  });
});
