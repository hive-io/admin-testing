//WARNING USING ADD USER INSTEAD OF ADD REALM FOR MAIN BUTTON!
//NOT ACTUALLY REJECTING

'use strict';
const common = require('../../common'),
      Promise = require('bluebird');

const addRealmButton = '//*[@id="add_realm"]',
      realmName = '//*[@id="name"]',
      fqdn = '//*[@id="fqdn"]',
      submit = '//*[@id="realm_form"]/button[1]',
      realmVerified = '//*[@id="fqdn-message" and contains(text()," Realm verified.")]',
      modalBackdrop = '//*[contains(@class,"modal-backdrop")]',
      realmFailed = '//*[@id="fqdn-message" and contains(text(),"Verification failed.")]';

describe('FQDN Validation', () => {
  beforeEach(() => {
    return common.isLoggedIn()
      .then((loggedIn) => !loggedIn ? common.login(browser, 'admin', 'admin', 'local') : null )
      .then(() => browser.refresh());
  });

  after(() => common.logout());

  it('should navigate to Realms', () => common.clickSidebarTab(browser, 'Realms'));

  it('should delete all realms', () => {
    return browser.elements('//button[text()="Delete"]')
      .then(els => Promise.mapSeries(els.value, () => {
        return browser.waitForExist(modalBackdrop, 3000, true)
          .then(() => common.waitAndClick('(//button[text()="Delete"])[1]'))
          .then(() => common.confirmPopup())
          .then(() => browser.refresh());
      }));
  });

  it('should not allow an illegal fqdn', () => {
    return common.waitAndClick(addRealmButton)
      .then(() => common.waitAndSet(realmName, 'hiveio'))
      .then(() => common.waitAndSet(fqdn, '_hiveio.local'))
      .then(() => common.waitAndClick(submit))
      .then(() => browser.pause(2000))
      .then(() => browser.waitForExist(realmVerified, 5000, true))
      .then(() => browser.refresh())
      .then(() => common.waitAndClick(addRealmButton))
      .then(() => common.waitAndSet(realmName, 'hiveio'))
      .then(() => common.waitAndSet(fqdn, 'strawberries'))
      .then(() => common.waitAndClick(submit))
      .then(() => browser.pause(2000))
      .then(() => browser.waitForExist(realmVerified, 5000, true))
      .then(() => browser.waitForExist(realmFailed));
  });

  it('should not allow bogus fqdns', () => {
    return common.waitAndClick(addRealmButton)
      .then(() => common.waitAndSet(realmName, 'hiveio'))
      .then(() => common.waitAndSet(fqdn, 'www.google.com'))
      .then(() => common.waitAndClick(submit))
      .then(() => browser.pause(2000))
      .then(() => browser.waitForExist(realmVerified, 5000, true))
      .then(() => browser.waitForExist(realmFailed))
      .then(() => browser.refresh())
      .then(() => common.waitAndClick(addRealmButton))
      .then(() => common.waitAndSet(realmName, 'hiveio'))
      .then(() => common.waitAndSet(fqdn, 'localhost'))
      .then(() => common.waitAndClick(submit))
      .then(() => browser.pause(2000))
      .then(() => browser.waitForExist(realmVerified, 5000, true))
      .then(() => browser.waitForExist(realmFailed))
      .then(() => browser.refresh())
      .then(() => common.waitAndClick(addRealmButton))
      .then(() => common.waitAndSet(realmName, 'hiveio'))
      .then(() => common.waitAndSet(fqdn, '127.0.0.1'))
      .then(() => browser.waitForExist(submit))
      .then(() => common.waitAndClick(submit))
      .then(() => browser.waitForExist(realmVerified, 5000, true))
      .then(() => browser.waitForExist(realmFailed));
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
