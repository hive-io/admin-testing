const chai = require('chai'), expect = chai.expect;
chai.use(require('chai-string'));

module.exports = {
  login: function(browser, username, password, domain) {
    return browser.url('/').getTitle()
      .then(title => expect(title).to.startWith('hiveIO Appliance |'))
      .then(() => browser.setValue('//input[@name="username"]', username))
      .then(() => browser.setValue('//input[@name="password"]', password))
      .then(() => browser.selectByVisibleText('//select[@name="domain"]', domain))
      .then(() => browser.click('//button[@type="submit"]'))

      // wait for the page to show up, default page is the "Overview"
      .then(() => browser.waitForExist('h1.page-header'))
      .then(() => browser.getText('h1.page-header'))
      .then(header => expect(header).to.equal('Overview'));
  },

  clickSidebarTab: function(browser, tabText, expectedTitle) {
    return browser.click(`//a[contains(text(), "${tabText}")]`)
      .then(() => browser.waitForExist('h1.page-header'))
      .then(() => browser.getText('h1.page-header'))
      .then(title => expect(title).to.startWith(!!expectedTitle ? expectedTitle : tabText));
  }
};
