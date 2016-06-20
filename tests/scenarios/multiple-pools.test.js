'use strict';
const common = require('../common'),
      config = require('../../testconfig'),
      Promise = require('bluebird');

let guestNumber = 5,
    guestTotal = guestNumber * 2,
    checkList = [
      Math.ceil(guestNumber / 3),
      Math.ceil(guestNumber * (2 / 3)),
      guestNumber
    ].map( function(num) {
      if (num < 10) { return `000${num}`; }
      else if (num < 100) { return `00${num}`; }
      else if (num < 1000) { return `0${num}`; }
      return `${num}`;
    });

describe('Multiple Pools with Linux Guests', () => {
  before(() => {
    return common.isLoggedIn()
      .then((loggedIn) => !loggedIn ? common.login(browser, 'admin', 'admin', 'local') : null )
      .then(() => common.clickSidebarTab(browser, 'Templates'))
      .then(() => browser.waitForVisible('//tbody'))
      .then(() => browser.isExisting('//td[1 and text()="coral"]'))
      .then((ex) => {
        if (!!ex) {
          return common.waitAndClick('//td[1 and text()="coral"]/..//button[@type="delete"]')
            .then(() => common.confirmPopup());
        }
        return null;
      })
      //add template
      .then(() => common.waitAndClick('//button[@id="add_tmpl"]'))
      .then(() => browser.waitForExist('//*[@id="add_tmpl_form"]'))
      .then(() => browser.setValue('//*[@id="add_tmpl_form"]//*[@id="name"]', 'coral'))
      .then(() => browser.setValue('//*[@id="add_tmpl_form"]//*[@id="path"]',
        `${config.nfsIP}:${config.nfsPath}${config.tmplPath}/hio-tester.qcow2`))
      .then(() => browser.selectByVisibleText('//*[@id="os"]', 'Linux'))
      .then(() => common.waitAndClick('//*[@id="add_tmpl_form"]//*[@id="subBtn"]'))
      .then(() => browser.pause(500))
      .then(() => browser.isVisible('//*[@id="add_tmpl_form"]//*[@id="subBtn"]'))
      .then(ex => ex ? common.waitAndClick('//*[@id="add_tmpl_form"]//*[@id="subBtn"]') : null)
      //set max density
      .then(() => common.clickSidebarTab(browser, 'Appliance', 'Appliance Settings'))
      .then(() => common.waitAndSet('//*[@id="maxCloneDensity"]', '100'))
      .then(() => common.waitAndClick('//button[text()="Submit"]'))
      .then(() => browser.waitForExist('//*[@id="reconfigure"]', 10000, true))
      .then(() => browser.pause(2500))
      .then(() => browser.refresh());
  });

  after(() => {
    return browser.refresh()
      //delete pools
      .then(() => common.clickSidebarTab(browser, 'Guest Pools'))
      .then(() => common.waitAndClick('//td[1 and text()="donuts"]/..//button[text()="Delete"]'))
      .then(() => common.confirmPopup())
      .then(() => common.waitAndClick('//td[1 and text()="churros"]/..//button[text()="Delete"]'))
      .then(() => common.confirmPopup())
      //remove template
      .then(() => common.clickSidebarTab(browser, 'Templates'))
      .then(() => common.waitAndClick(
        '//td[1 and text()="coral"]/..//td//button[text()="Unload"]'))
      .then(() => common.waitAndClick(
        '//td[1 and text()="coral"]/..//td//button[text()="Remove"]'))
      .then(() => common.confirmPopup())
      .then(() => browser.waitForExist('//td[1 and text()="coral"]', 10000, true))
      //turn off orphaned guests
      .then(() => common.clickSidebarTab(browser, 'Guest Management'))
      .then(() => browser.pause(5000))
      .then(() => browser.waitForExist(`//td[text()="APPLES${checkList[0]}"]`, 60000, true))
      .then(() => browser.waitForExist(`//td[text()="APPLES${checkList[1]}"]`, 60000, true))
      .then(() => browser.waitForExist(`//td[text()="APPLES${checkList[2]}"]`, 60000, true))
      .then(() => browser.waitForExist(`//td[text()="PEARS${checkList[0]}"]`, 60000, true))
      .then(() => browser.waitForExist(`//td[text()="PEARS${checkList[1]}"]`, 60000, true))
      .then(() => browser.waitForExist(`//td[text()="PEARS${checkList[2]}"]`, 60000, true))
      .catch(err => console.log('Guests were not dropped.'))
      .then(() => browser.refresh())
      .then(() => browser.elements('//button[contains(text(), "Action")]'))
      .then(elements => {
        return Promise.mapSeries(elements.value, el => {
          return common.waitAndClick('//button[contains(text(), "Action")][1]')
            .then(() => common.waitAndClick('//*[contains(text(), "Power Off")][1]'));
        });
      });
  });

  it('should create the first pool', () => {
    return common.clickSidebarTab(browser, 'Guest Pools')
      .then(() => common.waitAndClick('//*[@id="add_pool"]'))
      .then(() => browser.setValue('//*[@id="name"]', 'donuts'))
      .then(() => browser.selectByVisibleText('//*[@id="goldImage"]', 'coral'))
      .then(() => browser.setValue('//*[@id="minCloneDensity"]', `${guestNumber}`))
      .then(() => browser.setValue('//*[@id="maxCloneDensity"]', '100'))
      .then(() => browser.setValue('//*[@id="seed"]', 'apples'))
      .then(() => browser.setValue('//*[@id="mem"]', '128'))
      .then(() => common.waitAndClick('//*[@id="subBtn"]'))
      .then(() => browser.waitForExist('//td[1 and text()="donuts"]', 20000));
  });

  it('should create the second pool', () => {
    return common.waitAndClick('//*[@id="add_pool"]')
      .then(() => browser.setValue('//*[@id="name"]', 'churros'))
      .then(() => browser.selectByVisibleText('//*[@id="goldImage"]', 'coral'))
      .then(() => browser.setValue('//*[@id="minCloneDensity"]', `${guestNumber}`))
      .then(() => browser.setValue('//*[@id="maxCloneDensity"]', '100'))
      .then(() => browser.setValue('//*[@id="seed"]', 'pears'))
      .then(() => browser.setValue('//*[@id="mem"]', '128'))
      .then(() => common.waitAndClick('//*[@id="subBtn"]'))
      .then(() => browser.waitForExist('//td[1 and text()="donuts"]', 20000));
  });

  it('should check all requested guests exist', () => {
    return common.clickSidebarTab(browser, 'Guest Management')
      .then(() => browser.waitForExist(`//td[text()="APPLES${checkList[0]}"]`, 60000))
      .then(() => browser.waitForExist(
        `//td[text()="APPLES${checkList[0]}"]/..//td[text()="Ready"]`, 120000))
      .then(() => browser.waitForExist(`//td[text()="APPLES${checkList[1]}"]`, 60000))
      .then(() => browser.waitForExist(
        `//td[text()="APPLES${checkList[1]}"]/..//td[text()="Ready"]`, 120000))
      .then(() => browser.waitForExist(`//td[text()="APPLES${checkList[2]}"]`, 60000))
      .then(() => browser.waitForExist(
        `//td[text()="APPLES${checkList[2]}"]/..//td[text()="Ready"]`, 120000))
      .then(() => browser.waitForExist(`//td[text()="PEARS${checkList[0]}"]`, 60000))
      .then(() => browser.waitForExist(
        `//td[text()="PEARS${checkList[0]}"]/..//td[text()="Ready"]`, 120000))
      .then(() => browser.waitForExist(`//td[text()="PEARS${checkList[1]}"]`, 60000))
      .then(() => browser.waitForExist(
        `//td[text()="PEARS${checkList[1]}"]/..//td[text()="Ready"]`, 120000))
      .then(() => browser.waitForExist(`//td[text()="PEARS${checkList[2]}"]`, 60000))
      .then(() => browser.waitForExist(
        `//td[text()="PEARS${checkList[2]}"]/..//td[text()="Ready"]`, 120000))
      .then(() => browser.refresh())
      .then(() => browser.waitForExist(`//div[@id="tg" and text()="${guestTotal}"]`));
  });
});
