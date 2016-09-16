'use strict';
const common = require('../common'),
      expect = require('chai').expect;

describe.only('Add Windows Template and Test Pool', () => {
  before(() => {
    return common.login(browser, 'admin', 'admin', 'local')
      .then(() => common.removeGuestPools())
      .then(() => common.removeTemplates())
      .then(() => common.addStoragePools())
      .then(() => common.setCloneDensity('10'));
  });

  after(() => {
    return common.removeGuestPools()
      .then(() => common.removeTemplates())
      .then(() => common.removeStoragePools())
      .then(() => browser.refresh());
  });

  it('should add a Windows 7 template', () => {
    return common.addTemplate('fish', 'templates', 'w7-vsi', 'Windows 7', false)
      .then(() => browser.waitForExist('//td[1 and text()="fish"]'));
  });

  it('should create a new guest pool with no realm', () => {
    return common.addGuestPool(
      'dagggyo', 'fish', 'Disk', '1', '2', 'soy', '2', '4096', false)
      .then(() => browser.waitForExist('//td[1 and text()="dagggyo"]', 10000))
      .then(() => common.clickSidebarTab(browser, 'Templates'))
      .then(() => browser.waitForExist(
        '//td[contains(text(), "Live (dagggyo)") and contains(text(), "Loaded")]', 500000));
  });

  it('should check that the guest is created and ready', () => {
    return common.clickSidebarTab(browser, 'Guest Management')
      .then(() => browser.waitForExist('//td[text()="SOY0001"]', 480000))
      .then(() => browser.waitForExist('//td[text()="SOY0001"]/..//td[text()="Ready"]', 480000))
      .then(() => browser.refresh())
      .then(() => browser.pause(1000))
      .then(() => browser.getText('//div[@id="tg"]'))
      .then(text => expect(text).to.equal('1'));
  });
});
