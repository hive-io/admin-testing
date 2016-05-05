'use strict';
const chai = require('chai'), expect = chai.expect;
chai.use(require('chai-string'));

module.exports = {

  login: function(browser, username, password, domain) {
    return browser.url('/')
      .then(() => browser.waitForExist('//div[@class="input-group margin-bottom-sm"]//input[@name="username"]', 10000))
      .then(() => browser.setValue('//div[@class="input-group margin-bottom-sm"]//input[@name="username"]', username))
      .then(() => browser.waitForExist('//div[@class="input-group"]//input[@name="password"]', 10000))
      .then(() => browser.setValue('//div[@class="input-group"]//input[@name="password"]', password))
      .then(() => browser.waitForExist('//div[@class="input-group"]//select[@name="domain"]'), 10000)
      .then(() => browser.selectByVisibleText('//div[@class="input-group"]//select[@name="domain"]', domain))
      .then(() => browser.waitForExist('//button[@type="submit"]'), 10000)
      .then(() => browser.click('//button[@type="submit"]'))
      .then(() => browser.waitForExist('//h1[@class="page-header"]'))
      .then(() => browser.waitUntil(() => 
        browser.getText('//h1[@class="page-header"]')
        .then((text) => { return text === 'Overview'; })
      ,10000, 250) )
  },

  clickSidebarTab: function(browser, tabText, expectedTitle) {
    let firstUrl;
    let correct_title = !!expectedTitle ? expectedTitle : tabText
    return browser.waitForExist(`//a[contains(text(), "${tabText}")]`, 20000)
      .then(() => browser.getUrl())
      .then((url) => firstUrl = url )
      .then(() => browser.waitUntil(() => 
        browser.getAttribute(`//a[contains(text(), "${tabText}")]`, 'onclick')
          .then((cl) => { if (!!cl) { return expect(cl).to.not.be.null; } 
            else{ console.log(cl); return expect(cl).to.not.be.null }})
      ,10000, 250))
      .then(() => browser.click(`//a[contains(text(), "${tabText}")]`))
      .then(() => browser.waitUntil(() => 
        browser.getUrl().then((newurl) => firstUrl !== newurl ) 
      ,10000, 250) )
      .then(() => browser.waitForExist('//h1[@class="page-header"]'), 10000)
      .then(() => browser.waitUntil(() => 
        browser.getText('//h1[@class="page-header"]')
        .then((text) => text === correct_title)
      ,10000, 250) )
  },

  isLoggedIn: function(){
    return browser.isExisting('//li[@class="user-dropdown"]')
      .then((ex) => ex ? browser.getText('//li[@class="user-dropdown"]') : null )
  },

  logout: function(){
    return module.exports.isLoggedIn()
      .then((log) => {
        if(!!log){
          return browser.waitForExist('//li[contains(@class,"user-dropdown")]')
            .then(() => browser.click('//li[contains(@class,"user-dropdown")]'))
            .then(() => browser.waitForExist('//a[text()=" Log Out"]'))
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
      .then(() => browser.click('//form[@id="add_user_form"]//button[@type="submit"]'));
  },

  //doesn't work with form submit button
  waitForOnClick: function (xpath) {
    return browser.waitForVisible(xpath)
      .then(() => browser.waitUntil(() => {
        return browser.getAttribute(xpath, 'onclick')
        .then((cl) => { if (!cl) {console.log(cl)}; return cl !== null; })
      }, 10000));
  },

  waitAndClick: function (xpath) {
    return browser.waitForExist(xpath, 10000)
      .then(() => browser.getAttribute(xpath, 'type'))
      .then((type) => {
        if (type === 'submit'){
          return browser.click(xpath);
        }
        else {
          return module.exports.waitForOnClick(xpath).then(() => browser.click(xpath));
        }
      });
  },


};

/* USEFUL SNIPPITS:

print page source:
  // .then(() => browser.getSource().then(console.log))

*/
