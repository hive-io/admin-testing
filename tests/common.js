'use strict';
const chai = require('chai'),
      expect = chai.expect,
      Promise = require('bluebird'),
      fs = Promise.promisifyAll(require('fs')),
      exec = Promise.promisify(require('child_process').exec),
      config = require('../testconfig'),
      crypto = require('crypto');
chai.use(require('chai-string'));

module.exports = {

  randomStr: function(n) {
    const chars = 'abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789';
    let len = chars.length;
    let rnd = crypto.randomBytes(n);
    let out = '';
    for (let i = 0; i < n; i++) {
      out += chars[rnd[i] % len];
    }
    return out;
  },

  login: function(browser, username, password, domain) {
    return module.exports.isLoggedIn()
      .then((logged) => {
        if (!logged) {
          return browser.url('/')
            .then(() => browser.waitForExist(
              '//div[@class="input-group margin-bottom-sm"]//input[@name="username"]', 10000))
            .then(() => browser.setValue(
              '//div[@class="input-group margin-bottom-sm"]//input[@name="username"]', username))
            .then(() => browser.waitForExist(
              '//div[@class="input-group"]//input[@name="password"]', 10000))
            .then(() => browser.setValue(
              '//div[@class="input-group"]//input[@name="password"]', password))
            .then(() => browser.waitForExist(
              '//div[@class="input-group"]//select[@name="domain"]'), 10000)
            .then(() => browser.selectByVisibleText(
              '//div[@class="input-group"]//select[@name="domain"]', domain))
            .then(() => browser.waitForExist('//button[@type="submit"]'), 10000)
            .then(() => browser.click('//button[@type="submit"]'));
        }
        return module.exports.clickSidebarTab(browser, 'Overview');
      });
  },

  clickSidebarTab: function(browser, tabText, expectedTitle) {
    let firstUrl;
    let existingTitle;
    let correctTitle = !!expectedTitle ? expectedTitle : tabText;
    return browser.waitForExist('//h1[@class="page-header"]', 10000)
    .then(() => browser.waitForVisible('//h1[@class="page-header"]', 10000))
      .then(() => browser.getText('//h1[@class="page-header"]'))
      .then((text) => { existingTitle = text; })
      .then(() => {
        if (existingTitle !== correctTitle) {
          return browser.getUrl()
            .then((url) => { firstUrl = url; })
            .then(() => browser.waitUntil(() =>
              browser.getAttribute(`//a[contains(text(), "${tabText}")]`, 'onclick')
                .then((cl) => {
                  if (!!cl) {
                    return expect(cl).to.not.be.null;
                  }
                  console.log('onclick: ', cl);
                  return expect(cl).to.not.be.null;
                }), 10000, 250))
            .then(() => module.exports.waitAndClick(`//a[contains(text(), "${tabText}")]`))
            .then(() => browser.waitUntil(() =>
              browser.getUrl().then((newurl) => firstUrl !== newurl ), 10000, 250) )
            .then(() => browser.waitForExist('//h1[@class="page-header"]'), 10000)
            .then(() => browser.waitUntil(() =>
              browser.getText('//h1[@class="page-header"]')
              .then((text) => text === correctTitle), 10000, 250));
        }
        return null;
      });
  },

  isLoggedIn: function() {
    return browser.isExisting('//*[@id="wrapper"]/nav/div[2]/ul[2]/li[3]/a')
      .then((ex) => ex ? true : false );
  },

  logout: function() {
    return module.exports.isLoggedIn()
      .then((log) => {
        if (!!log) {
          return browser.waitForExist('//li[contains(@class,"user-dropdown")]')
            .then(() => browser.click('//li[contains(@class,"user-dropdown")]'))
            .then(() => browser.waitForExist('//a[text()=" Log Out"]'))
            .then(() => browser.click('//a[text()=" Log Out"]'))
            .then(() => browser.waitForExist(
              '//div[@class="container"]//h2[contains(text(),"Hello")]'));
        }
        return null;
      });
  },

  createNewUser: function(name, realm, role, password) {
    return browser.waitForExist('//button[@id="add_user"]', 5000)
      .then(() => browser.waitForVisible('//button[@id="add_user"]'))
      .then(() => browser.click('//button[@id="add_user"]'))
      .then(() => browser.setValue('//*[@id="user_form"]//input[@id="username"]', name))
      .then(() => browser.selectByVisibleText('//*[@id="user_form"]//select[@id="realm"]', realm))
      .then(() => browser.selectByVisibleText('//*[@id="user_form"]//*[@id="role"]', role))
      .then(() => browser.setValue('//*[@id="user_form"]//input[@id="password"]', password))
      .then(() => browser.click('//*[@id="user_form"]//button[@type="submit"]'));
  },

  waitForOnClick: function(xpath) {
    return browser.waitUntil(() => {
      return browser.getAttribute(xpath, 'onclick')
        .then((cl) => {
          if (!cl) { console.log(cl); }
          return cl !== null;
        });
    }, 10000);
  },

  waitAndClick: function(xpath) {
    return browser.waitForExist(xpath, 30000)
      .then(() => browser.waitForVisible(xpath, 30000))
      .then(() => browser.waitForEnabled(xpath, 30000))
      .then(() => browser.getAttribute(xpath, 'type'))
      .then((type) => {
        if (type !== null) {
          return browser.click(xpath);
        }
        return module.exports.waitForOnClick(xpath).then(() => browser.click(xpath));
      });
  },

  waitAndSet: function(xpath, value) {
    return browser.waitForExist(xpath, 20000)
      .then(() => browser.setValue(xpath, value));
  },

  mkTmpDir: function(tmp, path) {
    let tpath = `${config.nfsIP}:${config.nfsPath}`;
    return fs.mkdirAsync(`${tmp}`)
      .then(() => exec(`mount ${tpath} ${tmp}`))
      .then(() => fs.statAsync(path))
      .then(stat => {
        if (stat.isFile()) {
          return fs.unlinkAsync(path);
        }
        return null;
      })
      .catch(e => console.log('Didn`t delete the template.'));
  },

  rmTmpDir: function(tmp, path) {
    return browser.pause(3000)
      .then(() => fs.statAsync(path))
        .then(stat => {
          if (stat.isFile()) {
            return fs.unlinkAsync(path);
          }
          return null;
        })
      .catch(e => console.log('Tried to delete file before it exists.'))
      .then(() => exec(`umount ${tmp}`))
      .then(() => fs.rmdirAsync(tmp))
      .catch(e => console.log('Can`t remove dir.'));
  },

  mountTempDir: function(tmp) {
    let tpath = `${config.nfsIP}:${config.nfsPath}`;
    return fs.mkdirAsync(`${tmp}`)
      .then(() => exec(`mount ${tpath} ${tmp}`));
  },

  unmountTempDir: function(tmp) {
    return exec(`umount ${tmp}`)
      .then(() => fs.rmdirAsync(tmp))
      .catch(e => console.log('Can`t remove dir.'));
  },

  deleteFile: function(path) {
    return fs.statAsync(path)
      .then(stat => {
        if (stat.isFile()) {
          return fs.unlinkAsync(path);
        }
        return null;
      })
      .catch(e => console.log(`Failed to delete file at: ${path}`));
  },

  confirmPopup: function() {
    return browser.waitForExist('//*[@id="popup" and @style="display: block;"]')
      .then(() => browser.waitForEnabled('//*[@id="popup"]//button[text()="Confirm"]'))
      .then(() => module.exports.waitAndClick('//*[@id="popup"]//button[text()="Confirm"]'))
      .then(() => browser.waitForExist('//*[contains(@class,"modal-backdrop")]', 20000, true));
  }
};
