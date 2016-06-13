'use strict';
const common = require('../../common'),
      expect = require('chai').expect,
      Promise = require('bluebird');

const newTmpl = '//button[@id="new_tmpl"]',
      submitBtn = '//*[@id="subBtn"]',
      name = '//*[@id="name"]',
      path = '//*[@id="path"]',
      addTmplBtn = '//*[@id="add_tmpl"]',
      pathMsg = '//span[@id="path-message"]';

describe('Template Validations', () => {
  before(() => {
    return common.isLoggedIn()
      .then((loggedIn) => !loggedIn ? common.login(browser, 'admin', 'admin', 'local') : null )
      .then(() => common.clickSidebarTab(browser, 'Templates'));
  });

  afterEach(() => {
    return browser.refresh();
  });

  it('should refuse a blank new template form', () => {
    return common.waitAndClick(newTmpl)
      .then(() => common.waitAndClick(submitBtn))
      .then(() => browser.waitForExist('//*[@id="admin-alert"]', 10000));
  });

  it('should refuse an invalid template path in new template', () => {
    return common.waitAndClick(newTmpl)
      .then(() => browser.setValue('//form[@id="newTmplForm"]//input[@id="path"]', 'invalid input'))
      .then(() => browser.click('//form[@id="newTmplForm"]//input[@id="name"]'))
      .then(() => browser.pause(750))
      .then(() => browser.getText(pathMsg))
      .then((text) => expect(text).to.equal("Path verification failed - can't mount destination."));
  });

  it('should refuse a new template form without a path', () => {
    return common.waitAndClick(newTmpl)
      .then(() => browser.waitForExist('//*[@id="editTemplate"]'))
      .then(() => browser.waitForExist('//*[@id="editTemplate"]//*[@id="name"]'))
      .then(() => browser.setValue('//*[@id="editTemplate"]//*[@id="name"]',
      'test name for test purposes only'))
      .then(() => common.waitAndClick(submitBtn))
      .then(() => browser.waitForExist('//*[@id="admin-alert"]', 10000));
  });


  it('should refuse a new template with a name and invalid path', () => {
    return common.waitAndClick(newTmpl)
      .then(() => browser.waitForExist('//*[@id="editTemplate"]'))
      .then(() => browser.waitForExist('//*[@id="editTemplate"]//*[@id="name"]'))
      .then(() => browser.setValue('//*[@id="editTemplate"]//*[@id="name"]',
      'test name for test purposes only'))
      .then(() => browser.setValue('//form[@id="newTmplForm"]//input[@id="path"]', 'invalid input'))
      .then(() => common.waitAndClick(submitBtn))
      .then(() => browser.waitForExist('//*[@id="admin-alert"]', 10000))
      .then(() => common.waitAndClick('//*[@id="newTmplForm"]//button[2 and text()="Cancel"]'));
  });


  it('should refuse a blank add template form', () => {
    return common.waitAndClick(addTmplBtn)
      .then(() => common.waitAndClick(submitBtn))
      .then(() => browser.waitForExist('//*[@id="name-message"]', 10000));
  });

  it('should refuse an add template form without a path', () => {
    return common.waitAndClick(addTmplBtn)
      .then(() => browser.setValue(name, 'All Hail Slithis!'))
      .then(() => common.waitAndClick(submitBtn))
      .then(() => browser.waitForExist('//*[@id="path-message><i class="]', 10000))
      .then(() => common.waitAndClick(
        '//form[@id="add_tmpl_form"]//button[2 and text()="Cancel"]'));
  });

  it('should refuse an add template form without a name and an invalid path', () => {
    return common.waitAndClick(addTmplBtn)
      .then(() => browser.setValue(path, 'All Hail Slithis!'))
      .then(() => common.waitAndClick(submitBtn))
      .then(() => browser.waitForExist(pathMsg, 10000))
      .then(() => common.waitAndClick('//form[@id="add_tmpl_form"]//button[2 and text()="Cancel"]'));
  });

  it('should refuse an add template form with a name and an invalid path', () => {
    return common.waitAndClick(addTmplBtn)
      .then(() => browser.setValue(path, 'All Hail Slithis!'))
      .then(() => browser.setValue(name, 'All Hail Slithis!'))
      .then(() => common.waitAndClick(submitBtn))
      .then(() => browser.waitForExist(pathMsg, 10000));
  });

  it('should clean up failed tests', () => {
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
});
