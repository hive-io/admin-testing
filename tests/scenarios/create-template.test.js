'use strict';
const common = require('../common');

describe('Create New Template and Pool', () => {
  before(() => {
    return common.login(browser, 'admin', 'admin', 'local')
      .then(() => common.setCloneDensity('10'))
      .then(() => common.removeGuestPools())
      .then(() => common.removeTemplates())
      .then(() => common.removeStoragePools())
      .then(() => common.addStoragePools())
      .then(() => common.clickSidebarTab(browser, 'Templates'));
  });

  after(() => {
    return common.removeGuestPools()
      .then(() => common.removeTemplates())
      .then(() => common.removeStoragePools())
      .then(() => browser.refresh());
  });

  it('should create a new template', () => {
    return browser.waitForVisible('//tbody')
      .then(() => common.waitAndClick('//button[@id="new_tmpl"]'))
      .then(() => browser.setValue('//*[@id="newTmplForm"]//*[@id="name"]', 'forest'))
      .then(() => browser.selectByVisibleText('//*[@id="storage"]', 'templates'))
      .then(() => browser.setValue('//*[@id="newTmplForm"]//*[@id="filename"]', 'testing'))
      .then(() => browser.selectByVisibleText('//*[@id="newTmplForm"]//*[@id="os"]', 'Linux'))
      .then(() => browser.setValue('//*[@id="newTmplForm"]//*[@id="dsize"]', '2'))
      .then(() => browser.selectByVisibleText('//*[@id="newTmplForm"]//*[@id="mem"]', '512MB'))
      .then(() => browser.click('//*[@id="newTmplForm"]//*[@id="cdromChk"]'))
      .then(() => browser.waitForVisible('//*[@id="newTmplForm"]//*[@id="cdromStorage"]'))
      .then(() => browser.waitForExist('//*[@id="newTmplForm"]//*[@id="cdromStorage"]//option[text()="vms"]'))
      .then(() => browser.selectByVisibleText('//*[@id="newTmplForm"]//*[@id="cdromStorage"]', 'vms'))
      .then(() => browser.waitForExist('//*[@id="newTmplForm"]//*[@id="cdromFilename"]//option[text()="mini.iso"]'))
      .then(() => browser.selectByVisibleText('//*[@id="newTmplForm"]//*[@id="cdromFilename"]', 'mini.iso'))
      .then(() => common.waitAndClick('//*[@id="newTmplForm"]//*[@id="subBtn"]'))
      .then(() => browser.waitForVisible('//td[1 and text()="forest"]', 5000));
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
        '//td[1 and text()="forest"]/..//td//button[text()="Author"]', 50000));
  });
});
