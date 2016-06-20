'use strict';
const common = require('../common'),
      config = require('../../testconfig'),
      p = require('path');

let tmp = p.join('/tmp', common.randomStr(10));
let testTmpl = '/testing';
let path = p.join(tmp, config.tmplPath, testTmpl);

describe('Create New Template and Pool', () => {
  before(() => {
    return common.isLoggedIn()
      .then((loggedIn) => !loggedIn ? common.login(browser, 'admin', 'admin', 'local') : null )
      .then(() => common.clickSidebarTab(browser, 'Templates'))
      .then(() => common.mkTmpDir(tmp, path));
  });

  after(() => {
    return common.rmTmpDir(tmp, path)
    .then(() => browser.refresh());
  });


  it('should create a new template', () => {
    return browser.waitForVisible('//tbody')
      .then(() => common.waitAndClick('//button[@id="new_tmpl"]'))
      .then(() => browser.waitForExist('//*[@id="editTemplate"]'))
      .then(() => browser.waitForExist('//*[@id="editTemplate"]//*[@id="name"]'))
      .then(() => browser.waitForExist('//*[@id="page-wrapper" and @class="hidden"]'))
      .then(() => browser.waitUntil(() => browser.getAttribute('//*[@id="name"]', 'onchange')
        .then((att) => att !== null)))
      .then(() => browser.setValue('//*[@id="editTemplate"]//*[@id="name"]', 'forest'))
      .then(() => browser.setValue('//*[@id="editTemplate"]//*[@id="path"]',
        `${config.nfsIP}:${config.nfsPath}${config.tmplPath}${testTmpl}`))
      .then(() => browser.selectByVisibleText('//*[@id="editTemplate"]//*[@id="os"]', 'Linux'))
      .then(() => browser.setValue('//*[@id="editTemplate"]//*[@id="dsize"]', '2'))
      .then(() => browser.click('//*[@id="editTemplate"]//*[@id="cdromChk"]'))
      .then(() => browser.waitForVisible('//*[@id="editTemplate"]//*[@id="cdrom"]'))
      .then(() => browser.setValue('//*[@id="editTemplate"]//*[@id="cdrom"]',
        `${config.nfsIP}:${config.nfsPath}${config.isoPath}/mini.iso`))
      .then(() => common.waitAndClick('//*[@id="editTemplate"]//*[@id="subBtn"]'))
      .then(() => browser.isExisting('//*[@id="editTemplate"]//*[@id="subBtn"]'))
      .then((ex) => ex ? common.waitAndClick('//*[@id="subBtn"]') : null )
      .then(() => browser.waitForVisible('//td[1 and text()="forest"]', 5000))
      .then(() => browser.waitForVisible('(//td[1 and text()="forest"])[2]', 1000, true));
  });

  it('should check if new template console works', () => {
    let oldIds, newIds;
    return browser.getTabIds()
      .then((ids) => { oldIds = ids; })
      .then(() => common.waitAndClick(
        '//td[1 and text()="forest"]/..//button[text()="Console"]'))
      .then(() => browser.waitUntil(() => {
        return browser.getTabIds()
          .then((ids) => {
            newIds = ids;
            return oldIds !== ids;
          });
      }))
      .then(() => browser.switchTab(newIds[1]))
      .then(() => browser.close())
      .then(() => browser.waitForVisible(
        '//td[1 and text()="forest"]/..//td//button[text()="Console"]'));
  });

  it('should power off and undefine the image', () => {
    return browser.waitForExist('//tbody')
      .then(() => common.waitAndClick(
        '//td[1 and text()="forest"]/..//td//button[text()="Power Off"]'))
      .then(() => browser.waitForExist('//tbody'))
      .then(() => common.waitAndClick(
        '//td[1 and text()="forest"]/..//td//button[text()="Undefine"]'))
      .then(() => browser.waitForExist('//tbody'))
      .then(() => browser.waitForExist(
        '//td[1 and text()="forest"]/..//td//button[text()="Author"]'));
  });

  it('should remove the image', () => {
    return common.waitAndClick('//td[1 and text()="forest"]/..//td//button[text()="Remove"]')
      .then(() => common.confirmPopup())
      .then(() => browser.waitForExist('//td[1 and text()="forest"]', 10000, true));
  });
});
