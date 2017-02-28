'use strict';
const common = require('../common'),
      expect = require('chai').expect;
      // config = require('../../testconfig'),
      // fs = Promise.promisifyAll(require('fs')),
      // p = require('path');

// const source = '//input[@id="source"]',
//       convertBtn = '//button[@id="btn_convert"]',
//       output = '//input[@id="output"]';

// let tmp = p.join('/tmp', common.randomStr(10));
// let hioTmpl = '/hio-converted';
// let w7Tmpl = '/w7-converted';
// let hioPath = p.join(tmp, config.tmplPath, hioTmpl);
// let w7Path = p.join(tmp, config.tmplPath, w7Tmpl);

describe('Convert Template And Run Pool', () => {
  before(() => {
    return common.login(browser, 'admin', 'admin', 'local')
      .then(() => common.removeGuestPools())
      .then(() => common.removeTemplates())
      .then(() => common.removeStoragePools())
      .then(() => common.addStoragePools())
      //clone density
      .then(() => common.setCloneDensity('10'))
      .then(() => common.clickSidebarTab(browser, 'Convert Image'));
  });

  after(() => {
    return common.removeGuestPools()
      .then(() => common.removeTemplates())
      .then(() => common.removeStoragePools());
  });

  it('should try to convert hio-tester', () => {
    return browser.selectByVisibleText('//*[@id="srcStorage"]', 'templates')
      .then(() => browser.pause(1000))
      .then(() => browser.selectByVisibleText('//*[@id="srcFilename"]', 'hio-tester.qcow2'))
      .then(() => browser.selectByVisibleText('//*[@id="dstStorage"]', 'templates'))
      .then(() => common.waitAndSet('//*[@id="dstFilename"]', 'hio-converted'))
      .then(() => common.waitAndClick('//button[@id="btn_convert"]'))
      .then(() => browser.pause(1000))
      .then(() => common.waitAndClick('//button[@id="btn_convert"]'))
      .then(() => browser.waitForExist('//*[@id="progress"]', 240000, true));
  });

  it('should add the converted template', () => {
    return common.clickSidebarTab(browser, 'Templates')
      .then(() => common.addTemplate('hio-converted', 'templates', 'hio-converted', 'Linux', false))
      .then(() => browser.waitForExist('//td[1 and text()="hio-converted"]', 20000));
  });

  it('should create a pool with the converted template', () => {
    return common.addGuestPool('individual', 'hio-converted', 'Disk', '1', '2', 'sinus', '1', '512', false)
      .then(() => browser.waitForExist('//td[1 and text()="individual"]', 20000))
      .then(() => common.clickSidebarTab(browser, 'Templates'))
      .then(() => browser.waitForExist('//td[text()="Disk: Loaded"]', 240000));
  });

  it('should check that the guests are created and are ready', () => {
    return common.clickSidebarTab(browser, 'Guest Management')
      .then(() => browser.waitForExist('//td[text()="SINUS0001"]', 240000))
      .then(() => browser.waitForExist('//td[text()="SINUS0001"]/..//td[text()="Ready"]', 240000))
      .then(() => browser.refresh())
      .then(() => browser.pause(750))
      .then(() => browser.getText('//div[@id="tg"]'))
      .then(text => expect(text).to.equal('1'));
  });
});
