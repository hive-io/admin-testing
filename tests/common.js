'use strict';
const chai = require('chai'),
      expect = chai.expect,
      Promise = require('bluebird'),
      fs = Promise.promisifyAll(require('fs')),
      exec = Promise.promisify(require('child_process').exec),
      config = require('../testconfig'),
      crypto = require('crypto');
chai.use(require('chai-string'));

let templatePath = config.nfsPath + config.tmplPath,
    vmPath = config.nfsPath + config.isoPath,
    nfs = config.nfsIP;

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
            .then(() => browser.selectByVisibleText('//select[@name="realm"]', domain))
            .then(() => module.exports.waitAndClick('//button[@type="submit"]'));
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
      .then(() => browser.pause(500))
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
      .then((ex) => ex );
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
      .then(() => browser.waitForEnabled(xpath, 20000))
      .then(() => browser.setValue(xpath, value));
  },

  mkTmpDir: function(tmp, subfolder, file) {
    let tpath = `${config.nfsIP}:${config.nfsPath}/${subfolder}`;
    return fs.mkdirAsync(`${tmp}`)
      .then(() => exec(`mount ${tpath} ${tmp}`))
      .then(() => fs.statAsync(file))
      .then(stat => {
        if (stat.isFile()) {
          return fs.unlinkAsync(file);
        }
        return null;
      })
      .catch(e => console.log('Didn`t delete the template. Either it does not exist or you do not have permission.'));
  },

  rmTmpDir: function(tmp, file) {
    return browser.pause(3000)
      .then(() => fs.statAsync(file))
        .then(stat => {
          if (stat.isFile()) {
            return fs.unlinkAsync(file);
          }
          return null;
        })
      .catch(e => console.log('Couldn`t delete file.'))
      .then(() => exec(`umount ${tmp}`))
      .then(() => fs.rmdirAsync(tmp))
      .catch(e => console.log('Can`t remove directory.'));
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
      .catch(e => console.log(`Failed to delete file at: ${path}` + e));
  },

  confirmPopup: function() {
    return browser.waitForExist('//*[@id="popup" and @style="display: block;"]')
      .then(() => browser.waitForEnabled('//*[@id="popup"]//button[text()="Confirm"]'))
      .then(() => module.exports.waitAndClick('//*[@id="popup"]//button[text()="Confirm"]'))
      .then(() => browser.waitForExist('//*[contains(@class,"modal-backdrop")]', 20000, true));
  },

  createStoragePool: function(name, type, server, path) {
    return module.exports.clickSidebarTab(browser, 'Storage Pools')
      .then(() => module.exports.waitAndClick('//button[@id="add_sp"]'))
      .then(() => module.exports.waitAndSet('//*[@id="name"]', name))
      .then(() => browser.selectByVisibleText('//*[@id="type"]', type))
      .then(() => module.exports.waitAndSet('//*[@id="server"]', server))
      .then(() => module.exports.waitAndSet('//*[@id="path"]', path))
      .then(() => module.exports.waitAndClick('//*[@id="subBtn"]'))
      .then(() => browser.waitForExist('//td[text()="templates"]'));
  },

  removeStoragePools: function() {
    return module.exports.clickSidebarTab(browser, 'Storage Pools')
      .then(() => browser.waitForExist('//tbody'))
      .then(() => browser.elements('//button[text()="Remove"]'))
      .then(elements => Promise.mapSeries(elements.value, () => {
        return browser.waitForExist('//*[contains(@class,"modal-backdrop")]', 3000, true)
          .then(() => module.exports.waitAndClick('(//button[text()="Remove"])[1]'))
          .then(() => module.exports.confirmPopup())
          .then(() => browser.refresh());
      }))
      .then(() => browser.waitForExist('//button[text()="add_sp"]', 1000, true));
  },

  addStoragePools: function() {
    return module.exports.removeStoragePools()
      .then(() => module.exports.createStoragePool('templates', 'NFS', nfs, templatePath))
      .then(() => Promise.delay(1000))
      .then(() => module.exports.createStoragePool('vms', 'NFS', nfs, vmPath))
      .then(() => Promise.delay(1000));
  },

  removeTemplates: function() {
    return module.exports.clickSidebarTab(browser, 'Templates')
      .then(() => browser.waitForExist('//tbody'))
      .then(() => browser.elements('//button[text()="Unload"]'))
      .then(elements => Promise.mapSeries(elements.value, () => {
        return browser.waitForExist('//*[contains(@class,"modal-backdrop")]', 3000, true)
          .then(() => module.exports.waitAndClick('(//button[text()="Unload"])[1]'))
          .then(() => browser.waitForExist('//button[text()="Remove"]'));
      }))
      .then(() => browser.elements('//button[text()="Remove"]'))
      .then(elements => Promise.mapSeries(elements.value, () => {
        return browser.waitForExist('//*[contains(@class,"modal-backdrop")]', 3000, true)
          .then(() => module.exports.waitAndClick('(//button[text()="Remove"])[1]'))
          .then(() => module.exports.confirmPopup())
          .then(() => browser.refresh());
      }))
      .then(() => browser.waitForExist('//button[text()="add_tmpl"]', 1000, true));
  },

  removeGuestPools: function() {
    return module.exports.clickSidebarTab(browser, 'Guest Pools')
      .then(() => browser.waitForExist('//tbody'))
      .then(() => browser.elements('//button[text()="Delete"]'))
      .then(elements => Promise.mapSeries(elements.value, () => {
        return browser.waitForExist('//*[contains(@class,"modal-backdrop")]', 3000, true)
          .then(() => module.exports.waitAndClick('(//button[text()="Delete"])[1]'))
          .then(() => module.exports.confirmPopup())
          .then(() => browser.refresh());
      }))
      .then(() => browser.waitForExist('//button[text()="add_pool"]', 1000, true));
      //TODO: remove orphaned guests if necessary
  },

  addTemplate: function(name, storage, file, os, persistence) {
    return module.exports.clickSidebarTab(browser, 'Templates')
      .then(() => module.exports.waitAndClick('//button[@id="add_tmpl"]'))
      .then(() => browser.waitForExist('//*[@id="add_tmpl_form"]'))
      .then(() => browser.setValue('//*[@id="add_tmpl_form"]//*[@id="name"]', name))
      .then(() => browser.selectByVisibleText('//*[@id="add_tmpl_form"]//*[@id="storage"]', storage))
      .then(() => browser.waitForExist('//*[@id="add_tmpl_form"]//select[@id="filename"]//option', 20000))
      .then(() => browser.pause(2000))
      .then(() => browser.selectByVisibleText('//*[@id="add_tmpl_form"]//select[@id="filename"]', file))
      .then(() => browser.selectByVisibleText('//*[@id="add_tmpl_form"]//*[@id="os"]', os))
      //.then(() => !persistence ? browser.click('//*[@id ="hash"]') : null )
      .then(() => module.exports.waitAndClick('//*[@id="add_tmpl_form"]//*[@id="subBtn"]'))
      .then(() => browser.pause(2000))
      .then(() => browser.refresh());
  },

  addGuestPool: function(name, template, storage, min, max, seed, cpu, mem, persistence, profile, agentConnectivity, profileManagement) {
    profile = profile || 'Default';
    agentConnectivity = agentConnectivity || 'external';
    profileManagement = profileManagement || false;
    return  module.exports.clickSidebarTab(browser, 'Guest Pools')
     .then(() =>  module.exports.waitAndClick('//*[@id="add_pool"]'))
     .then(() => browser.setValue('//*[@id="name"]', name))
     .then(() => browser.selectByVisibleText('//*[@id="template"]', template))
     .then(() => browser.selectByVisibleText('//*[@id="networkProfile"]', profile))
     .then(() => browser.selectByVisibleText('//*[@id="storageType"]', storage))
     .then(() => browser.isSelected('//*[@id="persistent"]'))
     .then(sel => {
       if ( !!sel !== !!persistence ) {
         browser.click('//*[@id="persistent"]');
       }
       return Promise.resolve();
     })
     .then(() => browser.setValue('//*[@id="minCloneDensity"]', min))
     .then(() => {
       if (!persistence) {
         return browser.setValue('//*[@id="maxCloneDensity"]', max);
       }
       return Promise.resolve();
     })
     .then(() => browser.setValue('//*[@id="seed"]', seed))
     .then(() => browser.selectByValue('//*[@id="cpu"]', cpu))
     .then(() => browser.selectByValue('//*[@id="mem"]', mem))
     .then(() => browser.selectByValue('//*[@id="agentConnectivity"]', agentConnectivity))
     .then(() => browser.isSelected('//*[@id="profileManagement"]'))
     .then(sel => {
       if ( !!sel !== !!profileManagement ) browser.click('//*[@id="profileManagement"]');
     })
     .then(() =>  module.exports.waitAndClick('//*[@id="subBtn"]'));
  },

  setCloneDensity: function(number) {
    return module.exports.clickSidebarTab(browser, 'Appliance', 'Appliance Settings')
      .then(() => browser.getValue('//*[@id="thisIsNotACreditCardNumber"]'))
      .then(val => {
        if (val !== number) {
          return module.exports.waitAndSet('//*[@id="thisIsNotACreditCardNumber"]', number)
            .then(() => module.exports.waitAndClick('//button[text()="Submit"]'))
            .then(() => browser.waitForExist('//div[@id="reconfigure"]', 15000, true))
            .then(() => browser.pause(8000));
        }
        return null;
      });
  }
};
