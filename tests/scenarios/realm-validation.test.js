'use strict';
const common = require('../common'),
      Promise = require('bluebird');

const addRealmButton = '//*[@id="add_realm"]',
      realmName = '//*[@id="name"]',
      fqdn = '//*[@id="fqdn"]',
      submit = '//*[@id="realm_form"]/button[1]',
      modalBackdrop = '//*[contains(@class,"modal-backdrop")]';

describe('Realms Basic', () => {
  before(() => {
    return common.isLoggedIn()
      .then((loggedIn) => !loggedIn ? common.login(browser, 'admin', 'admin', 'local') : null )
      .then(() => common.clickSidebarTab(browser, 'Realms'))
      .then(() => browser.elements('//button[text()="Delete"]'))
      .then(els => Promise.mapSeries(els.value, () => {
        return browser.waitForExist(modalBackdrop, 3000, true)
          .then(() => common.waitAndClick('//button[text()="Delete"][1]'))
          .then(() => common.confirmPopup())
          .then(() => browser.refresh());
      }));
  });

  after(() => browser.refresh());

  it('should create a valid realm', () => {
    return common.waitAndClick(addRealmButton)
      .then(() => common.waitAndSet(realmName, 'hiveio'))
      .then(() => common.waitAndSet(fqdn, 'hiveio.local'))
      .then(() => common.waitAndClick(submit))
      .then(() => browser.waitForExist(
        '//*[@id="fqdn-message" and contains(text()," Realm verified.")]', 5000))
      .then(() => common.waitAndClick(submit))
      .then(() => browser.waitForExist('//*[@id="page-wrapper"]//tbody'))
      .then(() => browser.isExisting('//td[1 and text()="hiveio"]'))
      .then(ex2 => {
        if (ex2) { console.log('AUTOMATIC CAPITALIZATION FAILED, REALM STILL CREATED.'); }
      })
      .then(() => browser.waitForExist('//td[text()="HIVEIO"]'));
  });
});
