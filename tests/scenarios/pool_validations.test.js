'use strict';
const Promise = require('bluebird'),
      common = require('../common'),
      expect = require('chai').expect;

describe('Pool Validations', () => {
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
      .then(() => browser.isExisting('//td[1 and text()="carnival"]'))
      .then((ex) => { 
        if (!!ex) {
          return common.waitAndClick('//td[1 and text()="carnival"]/..//button[@type="delete"]')
            .then(() => browser.waitForExist('//*[@id="popup" and @style="display: block;"]'))
            .then(() => browser.waitForEnabled('//*[@id="popup"]//button[text()="Confirm"]'))
            .then(() => common.waitAndClick('//*[@id="popup"]//button[text()="Confirm"]'))
            .then(() => browser.waitForExist('//*[contains(@class,"modal-backdrop")]', 2000, true));
        }
      })
      .then(() => common.waitAndClick('//button[@id="add_tmpl"]'))
      .then(() => browser.waitForExist('//*[@id="add_tmpl_form"]'))
      .then(() => browser.setValue('//*[@id="add_tmpl_form"]//*[@id="name"]','carnival'))
      .then(() => browser.setValue('//*[@id="add_tmpl_form"]//*[@id="path"]','192.168.11.4:/NFS/Guests/hio-tester.qcow2'))
      .then(() => browser.selectByVisibleText('//*[@id="os"]', 'Linux'))
      .then(() => common.waitAndClick('//*[@id="add_tmpl_form"]//*[@id="subBtn"]'))
      .then(() => browser.waitForExist('//td[1 and text()="carnival"]'))
      .then(() => browser.isExisting('//td[1 and text()="carnival"]'))
      .then(ex => expect(ex).to.be.true);
  });

  it('should create a new guest pool', () => {
   return common.clickSidebarTab(browser, 'Guest Pools')
     .then(() => common.waitAndClick('//*[@id="add_pool"]'))
     .then(() => browser.setValue('//*[@id="name"]', 'donuts'))
     .then(() => browser.selectByVisibleText('//*[@id="goldImage"]','carnival'))
     .then(() => browser.setValue('//*[@id="minCloneDensity"]', '1'))
     .then(() => browser.setValue('//*[@id="maxCloneDensity"]', '2'))
     .then(() => browser.setValue('//*[@id="seed"]', 'devils'))
     .then(() => browser.setValue('//*[@id="mem"]', '128'))
     .then(() => common.waitAndClick('//*[@id="subBtn"]'))
     .then(() => browser.waitForExist('//td[1 and text()="donuts"]'))
  });

  it('should fail to create a second guest pool with the same name', () => {
   return common.clickSidebarTab(browser, 'Guest Pools')
     .then(() => common.waitAndClick('//*[@id="add_pool"]'))
     .then(() => browser.setValue('//*[@id="name"]', 'donuts'))
     .then(() => browser.selectByVisibleText('//*[@id="goldImage"]','carnival'))
     .then(() => browser.setValue('//*[@id="minCloneDensity"]', '1'))
     .then(() => browser.setValue('//*[@id="maxCloneDensity"]', '2'))
     .then(() => browser.setValue('//*[@id="seed"]', 'chortles'))
     .then(() => browser.setValue('//*[@id="mem"]', '128'))
     .then(() => common.waitAndClick('//*[@id="subBtn"]'))
     .then(() => browser.pause(1500))
     .then(() => browser.waitForExist('(//td[1 and text()="donuts"])[2]', 1500, true))
  });

  it('should delete the pools', () => {
    return browser.elements('//td[1 and text()="donuts"]/..//button[text()="Delete"]')
      // .then(els => console.log(els.value))
      .then(els => Promise.mapSeries(els.value, () => {
        return browser.waitForExist('//*[contains(@class,"modal-backdrop")]', 3000, true)
          .then(() => common.waitAndClick('(//td[1 and text()="donuts"]/..//button[text()="Delete"])[1]'))
          .then(() => browser.waitForExist('//*[@id="popup" and @style="display: block;"]'))
          .then(() => browser.waitForEnabled('//*[@id="popup"]//button[text()="Confirm"]'))
          .then(() => common.waitAndClick('//*[@id="popup"]//button[text()="Confirm"]'))
          .then(() => browser.waitForExist('//*[contains(@class,"modal-backdrop")]', 3000, true))
          .then(() => browser.refresh())  
      }))          
  });

  it('should unload and delete the template', () => {
    return common.clickSidebarTab(browser, 'Templates')
      .then(() => common.waitAndClick('//td[1 and text()="carnival"]/..//td//button[text()="Unload"]'))
      .then(() => common.waitAndClick('//td[1 and text()="carnival"]/..//td//button[text()="Remove"]'))
      .then(() => browser.waitForEnabled('//*[@id="popup"]//button[text()="Confirm"]'))
      .then(() => browser.waitForExist('//*[@id="popup" and @style="display: block;"]'))
      .then(() => common.waitAndClick('//*[@id="popup"]//button[text()="Confirm"]'))
      .then(() => browser.waitForExist('//*[contains(@class,"modal-backdrop")]', 2000, true))
      .then(() => browser.waitForExist('//td[1 and text()="carnival"]', 10000, true))
      .then(() => browser.isExisting('//td[1 and text()="carnival"]'))
      .then(ex => expect(ex).to.be.false)
  });

});
