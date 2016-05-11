'use strict';
const Promise = require('bluebird'),
      common = require('../common'),
      expect = require('chai').expect;

describe('Guest Pools', () => {
  beforeEach(() => { return common.login(browser, 'admin', 'admin', 'local')
    .then(() => common.clickSidebarTab(browser, 'Guest Pools'));
  });
  after(() => common.logout());

  // it('should navigate to Guest Pools', () =>
  //   common.clickSidebarTab(browser, 'Guest Pools'));

  it('should not allow adding a pool if there are no templates', () => {
    return browser.waitForExist('//*[@id="add_pool"]')
      .then(() => browser.isExisting('//*[@id="add_pool" and contains(@class,"disabled")]'))
      .then((ex) => {
        if(ex){
          return common.waitAndClick('//*[@id="add_pool"]')
            .then(() => browser.waitForExist('//*[@id="pool_form" and @class="hidden"]'))
        }
        else {
          return console.log('Templates are available.')
        }
    });
  });

  it('should allow cancellation of creating a new pool', ()=> {
    return browser.waitForExist('//*[@id="add_pool"]')
      .then(() => browser.isExisting('//*[@id="add_pool" and contains(@class,"disabled")]'))
      .then((ex) => {if(!ex){ 
        return common.waitAndClick('//*[@id="add_pool"]')
          .then(() => common.waitAndClick('//*[@id="add_pool_form"]/div[8]/button[2 and text()="Cancel"]'))
          .then(() => browser.waitForExist('//*[@id="add_pool" and not(contains(@class,"hidden"))]')); 		
      }});
  });

  // it('should allow creating a new pool when a template exists', () => {
  //   return browser.waitForExist('//*[@id="add_pool"]')
  //     .then(() => browser.isExisting('//*[@id="add_pool" and contains(@class,"disabled")]'))
  //     .then((ex) => {if(!ex){
  //       return common.waitAndClick('//*[@id="add_pool"]')
  //         .then(() => browser.waitForExist('//*[@id="pool_form"]'))
  //         .then(() => browser.setValue('//*[@id="name"]', 'test'))
  //         .then(() => browser.setValue('//*[@id="minCloneDensity"]', '1'))
  //         .then(() => browser.setValue('//*[@id="maxCloneDensity"]', '2'))
  //         .then(() => browser.setValue('//*[@id="seed"]', 'TESTSEED'))
  //         .then(() => browser.setValue('//*[@id="mem"]', '2048'))
  //         .then(() => browser.selectByVisibleText('//*[@id="Domain"]','None'))
  //         .then(() => browser.waitForExist('//*[@id="seed-message"]'))
  //         .then(() => common.waitAndClick('//*[@id="subBtn"]'))
  //         .then(() => browser.waitForExist('//tbody//td[1 and text()="test"]'));
  //     } 
  //     else { return console.log('No templates are available')}
  //   });
  // });

  // it('should not allow creating a new pool with the same name and seed name as an existing pool', () => {
  //   return browser.waitForExist('//*[@id="add_pool"]')
  //     .then(() => browser.isExisting('//*[@id="add_pool" and contains(@class,"disabled")]'))
  //     .then((ex) => {if(!ex){ 
  //       return browser.waitForExist('//tbody')
  //         .then(() => browser.elements('//tbody//td[1 and text()="test"]'))
  //         .then((els) => expect(els.value.length).to.be.above(0))
  //         .then(() => common.waitAndClick('//*[@id="add_pool"]'))
  //         .then(() => browser.waitForExist('//*[@id="pool_form"]'))
  //         .then(() => browser.setValue('//*[@id="name"]', 'test'))
  //         .then(() => browser.setValue('//*[@id="minCloneDensity"]', '1'))
  //         .then(() => browser.setValue('//*[@id="maxCloneDensity"]', '2'))
  //         .then(() => browser.setValue('//*[@id="seed"]', 'TESTSEED'))
  //         .then(() => browser.setValue('//*[@id="mem"]', '2048'))
  //         .then(() => browser.selectByVisibleText('//*[@id="Domain"]','None'))
  //         .then(() => browser.waitForExist('//*[@id="seed-message"]'))
  //         .then(() => common.waitAndClick('//*[@id="subBtn"]'))
  //         .then(() => browser.waitForExist('//*[@id="add_pool" and not(contains(@class,"hidden"))]'))
  //         .then(() => browser.elements('//tbody//td[1 and text()="test"]'))
  //         .then((els) => expect(els.value.length).to.equal(1));
  //       }
  //       else { return console.log('No templates are available') };
  //   });
  // });

  // it('should delete all test pools', () => {
  //   let poolTest = function(element) {
  //     return browser.waitForExist('//*[@class="modal-backdrop fade in"]', 10000, true)
  //       .then(() => common.waitAndClick('(//tbody//td[1 and text()="test"]/..//button[text()="Delete"])[1]'))
  //       .then(() => browser.waitForVisible('//*[@id="popup"]//button[2 and text()="Confirm"]'))
  //       .then(() => browser.click('//*[@id="popup"]//button[2 and text()="Confirm"]'))
  //   }
  //   return browser.waitForExist('//tbody')
  //     .then(() => browser.elements('//tbody//td[1 and text()="test"]'))
  //     .then(els => Promise.mapSeries(els.value, poolTest));
  // });

});
