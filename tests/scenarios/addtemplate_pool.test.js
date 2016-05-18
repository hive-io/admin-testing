'use strict';
const common = require('../common'),
      expect = require('chai').expect,
      Promise = require("bluebird"),
      fs = Promise.promisifyAll(require("fs"));

describe('Add Existing Template and Create Pool', () => {
  before(() => {
    return common.isLoggedIn()
      .then((loggedIn) => { 
        if(!loggedIn) {
          return common.login(browser, 'admin', 'admin', 'local')
        }
      })
      .then(() => common.clickSidebarTab(browser, 'Templates'))
  });

  it('should add a template', () => {
    return browser.waitForVisible('//tbody')
      .then(() => browser.isExisting('//td[1 and text()="cruller"]'))
      .then((ex) => { 
        if (!!ex) {
          return common.waitAndClick('//td[1 and text()="cruller"]/..//button[@type="delete"]')
            .then(() => browser.waitForExist('//*[@id="popup" and @style="display: block;"]'))
            .then(() => browser.waitForEnabled('//*[@id="popup"]//button[text()="Confirm"]'))
            .then(() => common.waitAndClick('//*[@id="popup"]//button[text()="Confirm"]'))
            .then(() => browser.waitForExist('//*[contains(@class,"modal-backdrop")]', 2000, true));
        }
      })
      .then(() => common.waitAndClick('//button[@id="add_tmpl"]'))
      .then(() => browser.waitForExist('//*[@id="add_tmpl_form"]'))
      .then(() => browser.setValue('//*[@id="add_tmpl_form"]//*[@id="name"]','cruller'))
      .then(() => browser.setValue('//*[@id="add_tmpl_form"]//*[@id="path"]','192.168.11.4:/NFS/Guests/hio-tester.qcow2'))
      .then(() => browser.selectByVisibleText('//*[@id="os"]', 'Linux'))
      .then(() => common.waitAndClick('//*[@id="add_tmpl_form"]//*[@id="subBtn"]'))
      .then(() => browser.pause(500))
      .then(() => browser.isVisible('//*[@id="add_tmpl_form"]//*[@id="subBtn"]'))
      .then(ex => ex ? common.waitAndClick('//*[@id="add_tmpl_form"]//*[@id="subBtn"]') : null)
      .then(() => browser.waitForExist('//td[1 and text()="cruller"]'))
      .then(() => browser.isExisting('//td[1 and text()="cruller"]'))
      .then(ex => expect(ex).to.be.true);
  });

  it('should author the image', () => {
    return common.waitAndClick('//td[1 and text()="cruller"]/..//td//button[text()="Author"]')
      .then(() => browser.waitForVisible('//*[@id="mem"]'))
      .then(() => browser.setValue('//*[@id="mem"]','128'))
      .then(() => common.waitAndClick('//*[@id="subBtn"]'));
  });

  it('should check if new template console works', () => {
    let oldIds,
        newIds;
    return browser.getTabIds()
      .then((ids) => oldIds = ids)
      .then(() => common.waitAndClick('//td[text()="cruller"]/..//td//button[text()="Console"]'))
      .then(() => browser.waitUntil(() => { 
        return browser.getTabIds()
          .then((ids) => { newIds = ids; return oldIds !== ids })
      }))
      .then(() => browser.switchTab(newIds[1]))
      .then(() => browser.close())
      .then(() => browser.waitForVisible('//td[text()="cruller"]/..//td//button[text()="Console"]'));
  });

  it('should power off and undefine the image', () => {
    return browser.waitForExist('//tbody')
      .then(() => common.waitAndClick('//td[1 and text()="cruller"]/..//td//button[text()="Power Off"]'))
      .then(() => browser.waitForExist('//tbody'))
      .then(() => common.waitAndClick('//td[1 and text()="cruller"]/..//td//button[text()="Undefine"]'))
      .then(() => browser.waitForExist('//tbody'))
      .then(() => browser.waitForExist('//td[1 and text()="cruller"]/..//td//button[text()="Author"]'))
  })

  it('should set max clone density', () => {
    return common.clickSidebarTab(browser, 'Appliance', 'Appliance Settings')
      .then(() => common.waitAndSet('//*[@id="maxCloneDensity"]', '100'))
      .then(() => common.waitAndClick('//button[text()="Submit"]'))
      .then(() => browser.waitForExist('//*[@id="reconfigure"]', 10000, true))
      .then(() => browser.refresh())
  })

  it('should create a new guest pool', () => {
   return common.clickSidebarTab(browser, 'Guest Pools')
     .then(() => common.waitAndClick('//*[@id="add_pool"]'))
     .then(() => browser.setValue('//*[@id="name"]', 'donuts'))
     .then(() => browser.selectByVisibleText('//*[@id="goldImage"]','cruller'))
     .then(() => browser.setValue('//*[@id="minCloneDensity"]', '1'))
     .then(() => browser.setValue('//*[@id="maxCloneDensity"]', '2'))
     .then(() => browser.setValue('//*[@id="seed"]', 'apples'))
     // .then(() => browser.getText('//*[@id="seed"]', 'APPLES'))
     .then(() => browser.setValue('//*[@id="mem"]', '128'))
     .then(() => common.waitAndClick('//*[@id="subBtn"]'))
     .then(() => browser.waitForExist('//td[1 and text()="donuts"]',20000))
  });

  it('should check that the guests are created and are ready', () => {
    return common.clickSidebarTab(browser, 'Guest Management')
      .then(() => browser.waitUntil(() => {
        return browser.refresh()
          .then(() => browser.isExisting('//td[text()="APPLES0001"]'))
          .then(ex => ex === true)
      }))
      .then(() => browser.waitForExist('//td[text()="APPLES0001"]/..//td[text()="Ready"]'))
      .then(() => browser.refresh())
      .then(() => browser.getText('//div[@id="tg"]'))
      .then(text => expect(text).to.equal('1'))
  });

  it('should delete the pool', () => {
    return common.clickSidebarTab(browser, 'Guest Pools')
      .then(() => common.waitAndClick('//td[1 and text()="donuts"]/..//button[text()="Delete"]'))
      .then(() => browser.waitForExist('//*[@id="popup" and @style="display: block;"]'))
      .then(() => browser.waitForEnabled('//*[@id="popup"]//button[text()="Confirm"]'))
      .then(() => common.waitAndClick('//*[@id="popup"]//button[text()="Confirm"]'))
      .then(() => browser.waitForExist('//*[contains(@class,"modal-backdrop")]', 2000, true));            
  });

  it('should undefine and delete the template', () => {
    return common.clickSidebarTab(browser, 'Templates')
      .then(() => common.waitAndClick('//td[1 and text()="cruller"]/..//td//button[text()="Unload"]'))
      .then(() => common.waitAndClick('//td[1 and text()="cruller"]/..//td//button[text()="Remove"]'))
      .then(() => browser.waitForEnabled('//*[@id="popup"]//button[text()="Confirm"]'))
      .then(() => browser.waitForExist('//*[@id="popup" and @style="display: block;"]'))
      .then(() => common.waitAndClick('//*[@id="popup"]//button[text()="Confirm"]'))
      .then(() => browser.waitForExist('//*[contains(@class,"modal-backdrop")]', 2000, true))
      .then(() => browser.waitForExist('//td[1 and text()="cruller"]', 10000, true))
      .then(() => browser.isExisting('//td[1 and text()="cruller"]'))
      .then(ex => expect(ex).to.be.false)
  });

});
