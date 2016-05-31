'use strict';
const common = require('../../common'),
      expect = require('chai').expect,
      Promise = require('bluebird');

describe('Template Validations', () => {
  before(() => {
    return common.isLoggedIn()
      .then((loggedIn) => {
        if(!loggedIn) {
          return common.login(browser, 'admin', 'admin', 'local')
        }
      })
      .then(() => common.clickSidebarTab(browser, 'Templates'))
  });

  it('should refuse a blank new template form', () => {
    return common.waitAndClick('//button[@id="new_tmpl"]')
      .then(() => common.waitAndClick('//*[@id="subBtn"]'))
      .then(() => browser.waitForExist('//*[@id="admin-alert"]', 10000));
  });

  it('should refuse an invalid template path in new template', () => {
    return common.waitForOnClick('//button[@id="new_tmpl"]')
      .then(() => browser.click('//button[@id="new_tmpl"]'))
      .then(() => browser.setValue('//form[@id="newTmplForm"]//input[@id="path"]', 'invalid input'))
      .then(() => browser.click('//form[@id="newTmplForm"]//input[@name="name"]'))
      .then(() => browser.getText('//span[@id="path-message"]'))
      .then((text) => expect(text).to.equal("Path verification failed - can't mount destination."));
  });

  it('should refuse a new template form without a path', () => {
    return common.waitAndClick('//*[@id="newTmplForm"]/div[11]/button[2 and text()="Cancel"]')
      .then(() => common.waitAndClick('//button[@id="new_tmpl"]'))
      .then(() => browser.waitForExist('//*[@id="editTemplate"]'))
      .then(() => browser.waitForExist('//*[@id="editTemplate"]//*[@id="name"]'))
      .then(() => browser.setValue('//*[@id="editTemplate"]//*[@id="name"]', 'test name for test purposes only'))
      .then(() => common.waitAndClick('//*[@id="subBtn"]'))
      .then(() => browser.waitForExist('//*[@id="admin-alert"]', 10000));
  });


  it('should refuse a new template with a name and invalid path', () => {
    return common.waitAndClick('//button[@id="new_tmpl"]')
      .then(() => browser.waitForExist('//*[@id="editTemplate"]'))
      .then(() => browser.waitForExist('//*[@id="editTemplate"]//*[@id="name"]'))
      .then(() => browser.setValue('//*[@id="editTemplate"]//*[@id="name"]', 'test name for test purposes only'))
      .then(() => browser.setValue('//form[@id="newTmplForm"]//input[@id="path"]', 'invalid input'))
      .then(() => common.waitAndClick('//*[@id="subBtn"]'))
      .then(() => browser.waitForExist('//*[@id="admin-alert"]', 10000))    
      .then(() => common.waitAndClick('//*[@id="newTmplForm"]//button[2 and text()="Cancel"]'));
  });


  it('should refuse a blank add template form', () => {
    return common.waitAndClick('//*[@id="add_tmpl"]')
      .then(() => common.waitAndClick('//*[@id="subBtn"]'))
      .then(() => browser.waitForExist('//*[@id="name-message"]', 10000));
  });

  it('should refuse an add template form without a path', () => {
    return common.waitAndClick('//*[@id="add_tmpl_form"]/div[3]/button[2 and text()="Cancel"]')
      .then(() => common.waitAndClick('//*[@id="add_tmpl"]'))
      .then(() => browser.setValue('//*[@id="name"]', 'All Hail Slithis!'))
      .then(() => common.waitAndClick('//*[@id="subBtn"]'))
      .then(() => browser.waitForExist('//*[@id="path-message><i class="]', 10000))
      .then(() => common.waitAndClick('//*[@id="add_tmpl_form"]//button[2 and text()="Cancel"]'));
  });

  it('should refuse an add template form without a name and an invalid path', () => {
    return common.waitAndClick('//*[@id="add_tmpl"]')
      .then(() => browser.setValue('//*[@id="path"]', 'All Hail Slithis!'))
      .then(() => common.waitAndClick('//*[@id="subBtn"]'))
      .then(() => browser.waitForExist('//*[@id="path-message"]', 10000))      
      .then(() => common.waitAndClick('//*[@id="add_tmpl_form"]//button[2 and text()="Cancel"]'));
  });

  it('should refuse an add template form with a name and an invalid path', () => {
    return common.waitAndClick('//*[@id="add_tmpl"]')
      .then(() => browser.setValue('//*[@id="name"]', 'All Hail Slithis!'))
      .then(() => browser.setValue('//*[@id="path"]', 'All Hail Slithis!'))
      .then(() => common.waitAndClick('//*[@id="subBtn"]'))
      .then(() => browser.waitForExist('//*[@id="path-message"]', 10000));
  });

  it('should clean up failed tests', () => {
    return browser.waitForExist('//tbody')
      .then(() => browser.elements('//button[text()="Remove"]'))
      .then(elements => Promise.mapSeries(elements.value, () => {
        return browser.waitForExist('//*[contains(@class,"modal-backdrop")]', 3000, true)
          .then(() => common.waitAndClick('(//button[text()="Remove"])[1]'))
          .then(() => browser.waitForExist('//*[@id="popup" and @style="display: block;"]'))
          .then(() => browser.waitForEnabled('//*[@id="popup"]//button[text()="Confirm"]'))
          .then(() => common.waitAndClick('//*[@id="popup"]//button[text()="Confirm"]'))
          .then(() => browser.waitForExist('//*[contains(@class,"modal-backdrop")]', 3000, true))
          .then(() => browser.refresh());  
      }))
      .then(() => browser.waitForExist('//button[text()="Remove"]', 1000, true));    
  });

});
