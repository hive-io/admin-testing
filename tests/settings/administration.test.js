const common = require('../common'),
      expect = require('chai').expect;

describe('Administration', () => {
  before(() => { return common.login(browser, 'admin', 'admin', 'local')
    .then(() => common.clickSidebarTab(browser, 'Administration', 'Appliance Administration'))
  });
  after(() => browser.refresh());

  // it('should navigate to Administration', () =>
  //   common.clickSidebarTab(browser, 'Administration', 'Appliance Administration'));

  it('should display an error message for empty license', () => {
    return common.waitForOnClick('//button[@id="upLicense"]')
      .then(() => browser.click('//button[@id="upLicense"]'))
      .then(() => browser.waitForVisible('//button[@type="submit" and text()="Upload License"]'))
      .then(() => browser.click('//button[@type="submit" and text()="Upload License"]'))
      .then(() => browser.waitForVisible('//div[@id="lic-alert"]'), 10000)
  });

  it('should close upload window on cancel', () => {
    return common.waitForOnClick('//button[@id="upLicense"]')
      .then(() => browser.click('//button[@id="upLicense"]'))
      .then(() => common.waitForOnClick('//div[@id="licensingForm"]//button[text()="Cancel"]'))
      .then(() => browser.click('//div[@id="licensingForm"]//button[text()="Cancel"]'))
      .then(() => browser.waitUntil(() =>
        browser.getAttribute('//div[@id="licensingForm"]', 'class')
        .then((cl) => cl === 'hidden' ), 10000))
  });

  it('should provide a popup after clicking shutdown', () => {
    return common.waitForOnClick('//button[@id="shutdownBtn"]')  	
      .then(() => browser.click('//button[@id="shutdownBtn"]'))
      .then(() => browser.waitForExist('//div[@id="popup" and @style="display: block;"]'))
      .then(() => browser.waitForExist('//div[@class="modal-footer"]//button[@data-dismiss="modal"]'))
      .then(() => browser.click('//div[@class="modal-footer"]//button[@data-dismiss="modal"]'))
      .then(() => browser.waitForExist('//div[@id="popup" and @style="display: none;"]'))
  });

  it('should provide a popup after clicking restart', () => {
    return common.waitForOnClick('//button[@id="rebootBtn"]')  	
      .then(() => browser.click('//button[@id="rebootBtn"]'))
      .then(() => browser.waitForExist('//div[@id="popup" and @style="display: block;"]'))
      .then(() => browser.waitForExist('//div[@class="modal-footer"]//button[@data-dismiss="modal"]'))
      .then(() => browser.click('//div[@class="modal-footer"]//button[@data-dismiss="modal"]'))
      .then(() => browser.waitForExist('//div[@id="popup" and @style="display: none;"]'))
  });

  it('should provide a popup after clicking restart network', () => {
    return common.waitForOnClick('//button[@id="renetBtn"]')  	
      .then(() => browser.click('//button[@id="renetBtn"]'))
      .then(() => browser.waitForExist('//div[@id="popup" and @style="display: block;"]'))
      .then(() => browser.waitForExist('//div[@class="modal-footer"]//button[@data-dismiss="modal"]'))
      .then(() => browser.click('//div[@class="modal-footer"]//button[@data-dismiss="modal"]'))
      .then(() => browser.waitForExist('//div[@id="popup" and @style="display: none;"]'))
  });

  it('should provide a popup after clicking maintenance mode', () => {
    return common.waitForOnClick('//button[@id="maintenanceBtn"]')  	
      .then(() => browser.click('//button[@id="maintenanceBtn"]'))
      .then(() => browser.waitForExist('//div[@id="popup" and @style="display: block;"]'))
      .then(() => browser.waitForExist('//div[@class="modal-footer"]//button[@data-dismiss="modal"]'))
      .then(() => browser.click('//div[@class="modal-footer"]//button[@data-dismiss="modal"]'))
      .then(() => browser.waitForExist('//div[@id="popup" and @style="display: none;"]'))
  });

  it('should flash error on invalid certificate', () => {
    return common.waitForOnClick('//button[@id="uploadBtn"]')
      .then(() => browser.click('//button[@id="uploadBtn"]'))
      .then(() => browser.waitForExist('//input[@value="Upload"]'))
      .then(() => browser.click('//input[@value="Upload"]'))
      .then(() => browser.waitForExist('//div[@id="cert-alert"]'))
      .then(() => browser.getText('//div[@id="cert-alert"]'))
      .then((text) => expect(text).to.equal('Must provide certificate'))
      .then(() => browser.waitForExist('//div[@id="key-alert"]'))
      .then(() => browser.getText('//div[@id="key-alert"]'))
      .then((text) => expect(text).to.equal('Must provide key'))  		
  });

  it('should allow cancellation of certificate upload', () => {
    return browser.isVisible('//input[@value="Cancel"]')
      .then((vis) => { if (!!vis){ return common.waitForOnClick('//input[@value="Cancel"]')
        .then(() => browser.click('//input[@value="Cancel"]')) 
      } } )
      .then(() => common.waitForOnClick('//button[@id="uploadBtn"]'))
      .then(() => browser.click('//button[@id="uploadBtn"]'))
      .then(() => common.waitForOnClick('//input[@value="Cancel"]'))
      .then(() => browser.click('//input[@value="Cancel"]'))
      .then(() => browser.waitForExist('//form[@id="upform" and contains(@class,"hidden")]'), 10000)
  });
  
  it('should create a support file', () => {
    return common.waitForOnClick('//button[text()="Create Support File"]')
      .then(() => browser.click('//button[text()="Create Support File"]'))
      .then(() => browser.waitForExist('//table[@id="supportFiles"]//tbody//td[position()=1]'))
      .then(() => browser.getText('//table[@id="supportFiles"]//tbody//td[position()=1]'))
      .then((text) => expect(text).to.startWith('hio-converged'))
  });

  it('should allow deletion of support file', () => {
    return browser.waitForExist('//div[@id="adminOverlay"]', 10000, true)
      .then(() => common.waitForOnClick('//table[@id="supportFiles"]//tr[position()=1]//button[text()="Delete"]'))
      .then(() => browser.click('//table[@id="supportFiles"]//tr[position()=1]//button[text()="Delete"]'))
      .then(() => browser.waitForExist('//div[@id="adminOverlay"]', 10000, true))
      .then(() => browser.waitForExist('//table[@id="supportFiles"]//tbody', 10000, true))
  });

});
