'use strict';
const common = require('../common'),
      expect = require('chai').expect;

describe('Realms', () => {
  before(() => common.login(browser, 'admin', 'admin', 'local'));
  after(() => common.logout());
  it('should navigate to Realms', () => common.clickSidebarTab(browser, 'Realms'));

  it('should create a valid realm', () => {
  	return common.waitForOnClick('//*[@id="add_realm"]')
  		.then(() => browser.click('//*[@id="add_realm"]'))
  		.then(() => browser.waitUntil( browser.getAttribute('//*[@id="realm"]','onchange')
  			.then((onc) => onc !== null )
  		))
  		.then(() => browser.setValue('//*[@id="realm"]', 'test'))
  		.then(() => browser.waitUntil( browser.getAttribute('//*[@id="fqdn"]','onchange')
  			.then((onc) => onc !== null )
  		))
  		.then(() => browser.setValue('//*[@id="fqdn"]','hiveio.local'))
  		.then(() => browser.waitForExist('//*[@id="add_realm_form"]/button[1]'))
  		.then(() => browser.click('//*[@id="add_realm_form"]/button[1]'))
  		.then(() => browser.waitForExist('//*[@id="realm-message"]'))
  		.then(() => browser.click('//*[@id="add_realm_form"]/button[1]'))
  		.then(() => browser.waitForExist('//*[@id="page-wrapper"]//td[1 and text()="TEST"]'));
  });

  it('should return to page once add realm is cancelled', () => {
  	return common.waitForOnClick('//*[@id="add_realm"]')
  		.then(() => browser.click('//*[@id="add_realm"]'))
  		.then(() => common.waitForOnClick('//*[@id="add_realm_form"]/button[2 and text()="Cancel"]'))
  		.then(() => browser.click('//*[@id="add_realm_form"]/button[2 and text()="Cancel"]'))
  		.then(() => browser.waitForExist('//*[@id="realm_form" and @class="hidden"]'))
  });

  it('should not allow an empty realm name', () => {
  	return common.waitForOnClick('//*[@id="add_realm"]')
  		.then(() => browser.click('//*[@id="add_realm"]'))
  		.then(() => browser.waitUntil( browser.getAttribute('//*[@id="realm"]','onchange')
  			.then((onc) => onc !== null )
  		))
  		.then(() => browser.setValue('//*[@id="realm"]', ''))
  		.then(() => browser.waitUntil( browser.getAttribute('//*[@id="fqdn"]','onchange')
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
