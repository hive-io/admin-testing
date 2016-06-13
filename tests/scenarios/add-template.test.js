'use strict';
const Promise = require('bluebird'),
      common = require('../common'),
      expect = require('chai').expect,
      config = require('../../testconfig');

describe('Add Templates', () => {
  before(() => {
    return common.isLoggedIn()
      .then((loggedIn) => !loggedIn ? common.login(browser, 'admin', 'admin', 'local') : null )
      .then(() => common.clickSidebarTab(browser, 'Templates'));
  });

  after(() => browser.refresh());

  it('should delete all existing templates', () => {
    return browser.waitForExist('//tbody')
      .then(() => browser.elements('//button[text()="Remove"]'))
      .then(elements => Promise.mapSeries(elements.value, () => {
        return browser.waitForExist('//*[contains(@class,"modal-backdrop")]', 3000, true)
          .then(() => common.waitAndClick('(//button[text()="Remove"])[1]'))
          .then(() => common.confirmPopup())
          .then(() => browser.refresh());
      }))
      .then(() => browser.waitForExist('//button[text()="Remove"]', 1000, true));
  });

  it('should add a Linux template', () => {
    return browser.refresh()
      .then(() => common.waitAndClick('//button[@id="add_tmpl"]'))
      .then(() => browser.waitForExist('//*[@id="add_tmpl_form"]'))
      .then(() => browser.setValue('//*[@id="add_tmpl_form"]//*[@id="name"]', 'cruller'))
      .then(() => browser.setValue('//*[@id="add_tmpl_form"]//*[@id="path"]',
        `${config.nfsIP}:${config.nfsPath}${config.tmplPath}/hio-tester.qcow2`))
      .then(() => browser.selectByVisibleText('//*[@id="os"]', 'Linux'))
      .then(() => common.waitAndClick('//*[@id="add_tmpl_form"]//*[@id="subBtn"]'))
      .then(() => browser.waitForExist('//td[1 and text()="cruller"]'))
      .then(() => browser.isExisting('//td[1 and text()="cruller"]'))
      .then(ex => expect(ex).to.be.true);
  });

  it('should fail to add the same Linux template', () => {
    return common.waitAndClick('//button[@id="add_tmpl"]')
      .then(() => browser.waitForExist('//*[@id="add_tmpl_form"]'))
      .then(() => browser.setValue('//*[@id="add_tmpl_form"]//*[@id="name"]', 'cruller'))
      .then(() => browser.setValue('//*[@id="add_tmpl_form"]//*[@id="path"]',
        `${config.nfsIP}:${config.nfsPath}${config.tmplPath}/hio-tester.qcow2`))
      .then(() => browser.selectByVisibleText('//*[@id="os"]', 'Linux'))
      .then(() => common.waitAndClick('//*[@id="add_tmpl_form"]//*[@id="subBtn"]'))
      .then(ex => ex ? common.waitAndClick('//*[@id="add_tmpl_form"]//*[@id="subBtn"]') : null )
      .then(() => browser.waitForExist('//td[1 and text()="cruller"]'))
      .then(() => browser.isExisting('(//td[1 and text()="cruller"])[2]'))
      .then(ex => expect(ex).to.be.false)
      .then(() => browser.refresh());
  });

  it('should add a Windows template', () => {
    return common.waitAndClick('//button[@id="add_tmpl"]')
      .then(() => browser.waitForExist('//*[@id="add_tmpl_form"]'))
      .then(() => browser.setValue('//*[@id="add_tmpl_form"]//*[@id="name"]', 'bearclaw'))
      .then(() => browser.setValue('//*[@id="add_tmpl_form"]//*[@id="path"]',
        `${config.nfsIP}:${config.nfsPath}${config.tmplPath}/w7-vsi`))
      .then(() => browser.selectByVisibleText('//*[@id="os"]', 'Windows 7'))
      .then(() => common.waitAndClick('//*[@id="add_tmpl_form"]//*[@id="subBtn"]'))
      .then(() => browser.waitForExist('//td[1 and text()="bearclaw"]'))
      .then(() => browser.isExisting('//td[1 and text()="bearclaw"]'))
      .then(ex => expect(ex).to.be.true);
  });

  it('should delete all existing templates', () => {
    return browser.waitForExist('//tbody')
      .then(() => browser.elements('//button[text()="Remove"]'))
      .then(elements => Promise.mapSeries(elements.value, () => {
        return browser.waitForExist('//*[contains(@class,"modal-backdrop")]', 30000, true)
          .then(() => common.waitAndClick('(//button[text()="Remove"])[1]'))
          .then(() => common.confirmPopup())
          .then(() => browser.refresh());
      }))
      .then(() => browser.waitForExist('//button[text()="Remove"]', 1000, true));
  });
});
