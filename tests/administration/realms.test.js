//TO DO:

// Missing a few tests:

// Test for both NetBIOS and FQDN being empty
// Test for validity of the FQDN, including:
// Empty value
// Format error (illegal FQDN) - starting with an underscore
// A bogus FQDN - IP, www.google.com
// A value that isn't a domain controller - one word


//Should delete realms created for testing purposes.

'use strict';
const common = require('../common'),
      expect = require('chai').expect;

describe('Realms', () => {
  before(() => common.isLoggedIn()
    .then((loggedIn) => { 
      if(!loggedIn) {
        return common.login(browser, 'admin', 'admin', 'local')
      }
    })
  )

  after(() => common.logout());
  it('should navigate to Realms', () => common.clickSidebarTab(browser, 'Realms'));

  it('should create a valid realm', () => {
    return common.waitForOnClick('//*[@id="add_realm"]')
      .then(() => browser.click('//*[@id="add_realm"]'))
      .then(() => browser.waitUntil(() =>
        browser.getAttribute('//*[@id="realm"]','onchange')
          .then((onc) => onc !== null )
      ))
      .then(() => browser.setValue('//*[@id="realm"]', 'hiveio'))
      .then(() => browser.waitUntil(() => 
        browser.getAttribute('//*[@id="fqdn"]','onchange')
          .then((onc) => onc !== null )
      ))
      .then(() => browser.setValue('//*[@id="fqdn"]','hiveio.local'))
      .then(() => browser.waitForExist('//*[@id="add_realm_form"]/button[1]'))
      .then(() => browser.click('//*[@id="add_realm_form"]/button[1]'))
      .then(() => browser.waitForExist('//*[@id="realm-message"]'))
      .then(() => browser.click('//*[@id="add_realm_form"]/button[1]'))
      .then(() => browser.waitForExist('//*[@id="page-wrapper"]//tbody'))
      //if NetBIOS Name is not capitalized, check for a lowercase version
      .then(() => browser.isExisting('//*[@id="page-wrapper"]//td[1 and text()="HIVEIO"]'))
      .then((ex) => {
        if (!ex) {
          return browser.isExisting('//*[@id="page-wrapper"]//td[1 and text()="hiveio"]')
            .then((ex2) => {
              if(ex2) { console.log('AUTOMATIC CAPITALIZATION FAILED, REALM STILL CREATED.') }
            })
            .then(() => expect(ex).to.be.true)
        }
        else {
          return expect(ex).to.be.true
        }
      })
  });
  

  it('should return to page once add realm is cancelled', () => {
    return browser.refresh()
      .then(() => common.waitForOnClick('//*[@id="add_realm"]'))
      .then(() => browser.click('//*[@id="add_realm"]'))
      .then(() => common.waitForOnClick('//*[@id="add_realm_form"]/button[2 and text()="Cancel"]'))
      .then(() => browser.click('//*[@id="add_realm_form"]/button[2 and text()="Cancel"]'))
      .then(() => browser.waitForExist('//*[@id="realm_form" and @class="hidden"]'))
  });

  it('should not allow an empty NetBIOS Name', () => {
    return common.waitForOnClick('//*[@id="add_realm"]')
      .then(() => browser.click('//*[@id="add_realm"]'))
      .then(() => browser.waitUntil(() =>
        browser.getAttribute('//*[@id="realm"]','onchange')
          .then((onc) => onc !== null )
      ))
      .then(() => browser.setValue('//*[@id="realm"]', ''))
      .then(() => browser.waitUntil(() => 
        browser.getAttribute('//*[@id="fqdn"]','onchange')
          .then((onc) => onc !== null )  
      ))
      .then(() => browser.setValue('//*[@id="fqdn"]','hiveio.local'))
      .then(() => browser.waitForExist('//*[@id="add_realm_form"]/button[1]'))
      .then(() => browser.click('//*[@id="add_realm_form"]/button[1]'))
      .then(() => browser.waitForExist('//*[@id="realm-message"]'))
      .then(() => browser.click('//*[@id="add_realm_form"]/button[1]'))
      .then(() => browser.waitForExist('//*[@id="page-wrapper"]//td[1 and not(string())]', 1000, true));
  });

});
