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

    return browser.getUrl()
      .then((url) => browser.click(`//a[contains(text(), "${tabText}")]`)
        .then(() => browser.waitUntil(() => {
          return browser.getUrl().then((newurl) => url != newurl )
        }))
      )
      .then(() => browser.waitForExist('h1.page-header'))
      .then(() => browser.getText('h1.page-header'))
      .then(title => expect(title).to.startWith(!!expectedTitle ? expectedTitle : tabText));
  },
  isLoggedIn: function(){
    return browser.isExisting('//li[@class="user-dropdown"]')
      .then((ex) => ex ? browser.getText('//li[@class="user-dropdown"]') : null )
  },
  logout: function(){
    return module.exports.isLoggedIn()
      .then((log) => {
        if(log){
          return browser.waitForExist('//li[contains(@class,"user-dropdown")]')
            .then(() => browser.click('//li[contains(@class,"user-dropdown")]'))
            .then(() => browser.click('//a[text()=" Log Out"]'))
            .then(() => broswer.waitForExist('//div[@class="container"]//h2[contains(text(),"Hello")]'))
      }
    })
  },
  createNewUser: function (name, realm, role, password) {
    return browser.waitForExist('//button[@id="add_user"]', 500)
      .then(() => browser.click('//button[@id="add_user"]'))
      .then(() => browser.setValue('//form[@id="add_user_form"]//input[@id="username"]', name))
      .then(() => browser.selectByVisibleText('//form[@id="add_user_form"]//select[@id="arealm"]', realm))
      .then(() => browser.selectByVisibleText('//form[@id="add_user_form"]//select[@id="role"]', role))
      .then(() => browser.setValue('//form[@id="add_user_form"]//input[@id="password"]', password))
      .then(() => browser.click('//form[@id="add_user_form"]//button[@type="submit"]'))
      .then(() => browser.waitForExist(`//td[text()="${name}" and position()=1]`))
      .then(() => browser.isExisting(`//td[text()="${name}" and position()=1]`))
  }
};


/* USEFUL SNIPPITS:

print page source:
  // .then(() => browser.getSource().then(console.log))

*/
