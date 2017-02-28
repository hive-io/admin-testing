'use strict';
const common = require('../common'),
      expect = require('chai').expect;

describe('Add Templates', () => {
  before(() => {
    return common.isLoggedIn()
      .then((loggedIn) => !loggedIn ? common.login(browser, 'admin', 'admin', 'local') : null )
      .then(() => common.removeGuestPools())
      .then(() => common.removeTemplates())
      .then(() => common.removeStoragePools())
      .then(() => common.addStoragePools())
      .then(() => common.clickSidebarTab(browser, 'Templates'));
  });

  after(() => {
    return browser.refresh()
      .then(() => common.removeGuestPools())
      .then(() => common.removeTemplates())
      .then(() => common.removeStoragePools());
  });


  it('should add a Linux template', () => {
    return common.addTemplate('cruller', 'templates', 'hio-tester.qcow2', 'Linux', true)
      .then(() => browser.waitForExist('//td[1 and text()="cruller"]'))
      .then(() => browser.isExisting('//td[1 and text()="cruller"]'))
      .then(ex => expect(ex).to.be.true);
  });

  it('should fail to add the same Linux template', () => {
    return common.addTemplate('cruller', 'templates', 'hio-tester.qcow2', 'Linux', true)
      .then(() => browser.waitForExist('//td[1 and text()="cruller"]'))
      .then(() => browser.isExisting('//td[1 and text()="cruller"][2]'))
      .then(ex => expect(ex).to.be.false)
      .then(() => browser.refresh());
  });

  it('should add a Windows template', () => {
    return common.addTemplate('bearclaw', 'templates', 'w7-vsi', 'Windows 7', true)
      .then(() => browser.waitForExist('//td[1 and text()="bearclaw"]'))
      .then(() => browser.isExisting('//td[1 and text()="bearclaw"]'))
      .then(ex => expect(ex).to.be.true);
  });

  it('should fail to add the same Windows template', () => {
    return common.addTemplate('bearclaw', 'templates', 'w7-vsi', 'Windows 7', true)
      .then(() => browser.waitForExist('//td[1 and text()="bearclaw"]'))
      .then(() => browser.isExisting('//td[1 and text()="bearclaw"][2]'))
      .then(ex => expect(ex).to.be.false);
  });
});
