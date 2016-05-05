const common = require('../common'),
      expect = require('chai').expect;

describe('Network Interfaces', () => {
  before(() => common.login(browser, 'admin', 'admin', 'local'));
  after(() => common.logout());

  it('should navigate to Network Interfaces', () =>
    common.clickSidebarTab(browser, 'Network Interfaces'));

  it('should display message when user hardcodes same settings', () => {
  	return common.waitForOnClick('//button[@type="edit" and position()=1]')
  		.then(() => browser.click('//button[@type="edit" and position()=1]'))
  		.then(() => common.waitForOnClick('//button[@id="subBtn"]'))
  		.then(() => browser.click('//button[@id="subBtn"]'))
  		.then(() => browser.waitForExist('//div[@id="admin-alert"]'), 10000)
  });

  it('should allow user to cancel hardcoding settings', () => {
  	return common.waitForOnClick('//button[@type="edit" and position()=1]')
  		.then(() => browser.click('//button[@type="edit" and position()=1]'))
  		.then(() => common.waitForOnClick('//form[@id="hardcode_form"]/button[2]'))
  		.then(() => browser.click('//form[@id="hardcode_form"]/button[2]'))
  		.then(() => browser.waitForExist('//form[@id="hardcode_form" and @style="display: none;"]'))
	});

  it('should display message when user submits same input to configure bonding', () => {
  	return common.waitForOnClick('//*[@id="addBond"]')
  		.then(() => browser.click('//*[@id="addBond"]'))
  		.then(() => common.waitForOnClick('//*[@id="submitBond"]'))
  		.then(() => browser.click('//*[@id="submitBond"]'))
  		.then(() => browser.waitForExist('//div[@id="admin-alert"]'), 10000);
  });

  it('should allow user to cancel configure bonding', () => {
  	return common.waitForOnClick('//*[@id="addBond"]')
  		.then(() => browser.click('//*[@id="addBond"]'))
  		.then(() => common.waitForOnClick('//*[@id="bonding_form"]/button[contains(text(),"Cancel")]'))
  		.then(() => browser.click('//*[@id="bonding_form"]/button[contains(text(),"Cancel")]'))
  		.then(() => browser.waitForExist('//form[@id="bonding_form" and @style="display: none;"]'))
  	})
});
