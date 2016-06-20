//WARNING USING ADD USER INSTEAD OF ADD REALM FOR MAIN BUTTON!

'use strict';
const common = require('../../common'),
      Promise = require('bluebird');

const addRealmButton = '//*[@id="add_realm"]',
      realmName = '//*[@id="name"]',
      fqdn = '//*[@id="fqdn"]',
      submit = '//*[@id="realm_form"]/button[1]',
      fqdnMessage = '//*[@id="fqdn-message"]',
      modalBackdrop = '//*[contains(@class,"modal-backdrop")]';

describe('Realms Basic', () => {
  beforeEach(() => {
    return common.isLoggedIn()
      .then((loggedIn) => !loggedIn ? common.login(browser, 'admin', 'admin', 'local') : null );
  });

  afterEach(() => browser.refresh());

  it('should navigate to Realms', () => common.clickSidebarTab(browser, 'Realms'));

  it('should delete all realms', () => {
    return browser.elements('//button[text()="Delete"]')
      .then(els => Promise.mapSeries(els.value, () => {
        return browser.waitForExist(modalBackdrop, 3000, true)
          .then(() => common.waitAndClick('//button[text()="Delete"][1]'))
          .then(() => common.confirmPopup())
          .then(() => browser.refresh());
      }));
  });

  it('should return to page once add realm is cancelled', () => {
    return common.waitAndClick(addRealmButton)
      .then(() => common.waitAndClick('//*[@id="realm_form"]//button[text()="Cancel"]'))
      .then(() => browser.waitForExist(addRealmButton));
  });

  it('should not allow an empty NetBIOS Name', () => {
    return common.waitAndClick(addRealmButton)
      .then(() => common.waitAndSet(realmName, ''))
      .then(() => browser.setValue(fqdn, 'hiveio.local'))
      .then(() => common.waitAndClick(submit))
      .then(() => browser.waitForExist(fqdnMessage))
      .then(() => common.waitAndClick(submit))
      .then(() => browser.waitForExist(
        '//td[position() = 1 and not(string())]', 1000, true));
  });

  it('should not allow a realm with no name or fqdn', () => {
    return common.waitAndClick(addRealmButton)
      .then(() => common.waitAndSet(realmName, ''))
      .then(() => browser.setValue(fqdn, ''))
      .then(() => common.waitAndClick(submit))
      .then(() => common.waitAndClick(submit))
      .then(() => browser.waitForExist('//*[@id="form-error"]'))
      .then(() => browser.waitForExist(
        '//td[position()=1 and not(string())]/..//td[position()=2 and not(string())]',
        1000, true));
  });

  it('should delete all realms', () => {
    return browser.elements('//button[text()="Delete"]')
      .then(els => Promise.mapSeries(els.value, () => {
        return browser.waitForExist(modalBackdrop, 3000, true)
          .then(() => common.waitAndClick('(//button[text()="Delete"])[1]'))
          .then(() => common.confirmPopup())
          .then(() => browser.refresh());
      }));
  });
});
