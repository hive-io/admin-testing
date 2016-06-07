// Race condition

// 'use strict';
// const common = require('../common'),
//       expect = require('chai').expect;

// describe('Create Many Guests', () => {

//   let totalGuests = 8,
//       checkList = [Math.ceil(totalGuests/3), Math.ceil(totalGuests*(2/3)), totalGuests]
//   checkList = checkList.map(function(num){
//     if (num < 10) { return `000${num}`}
//     else if (num < 100) { return `00${num}`}
//     else if (num < 1000) { return `0${num}`}
//     else { return `${num}`}
//   });
//   console.log(checkList)

//   before(() => {
//     return common.isLoggedIn()
//       .then((loggedIn) => {
//         if(!loggedIn) {
//           return common.login(browser, 'admin', 'admin', 'local')
//         }
//       })
//       .then(() => common.clickSidebarTab(browser, 'Templates'))
//   });

//   it('should add a template', () => {
//     return browser.waitForVisible('//tbody')
//       .then(() => browser.isExisting('//td[1 and text()="bruller"]'))
//       .then((ex) => {
//         if (!!ex) {
//           return common.waitAndClick('//td[1 and text()="bruller"]/..//button[@type="delete"]')
//             .then(() => browser.waitForExist('//*[@id="popup" and @style="display: block;"]'))
//             .then(() => browser.waitForEnabled('//*[@id="popup"]//button[text()="Confirm"]'))
//             .then(() => common.waitAndClick('//*[@id="popup"]//button[text()="Confirm"]'))
//             .then(() => browser.waitForExist('//*[contains(@class,"modal-backdrop")]', 2000, true));
//         }
//       })
//       .then(() => common.waitAndClick('//button[@id="add_tmpl"]'))
//       .then(() => browser.waitForExist('//*[@id="add_tmpl_form"]'))
//       .then(() => browser.setValue('//*[@id="add_tmpl_form"]//*[@id="name"]','bruller'))
//       .then(() => browser.setValue('//*[@id="add_tmpl_form"]//*[@id="path"]','192.168.11.4:/NFS/Guests/hio-tester-c'))
//       .then(() => browser.selectByVisibleText('//*[@id="os"]', 'Linux'))
//       .then(() => common.waitAndClick('//*[@id="add_tmpl_form"]//*[@id="subBtn"]'))
//       .then(() => browser.pause(1111))
//       .then(() => browser.isVisible('//*[@id="add_tmpl_form"]//*[@id="subBtn"]'))
//       .then(ex => ex ? common.waitAndClick('//*[@id="add_tmpl_form"]//*[@id="subBtn"]') : null)
//       .then(() => browser.waitForExist('//td[1 and text()="bruller"]'))
//       .then(() => browser.isExisting('//td[1 and text()="bruller"]'))
//       .then(ex => expect(ex).to.be.true);
//   });

//   it('should set max clone density', () => {
//     return common.clickSidebarTab(browser, 'Appliance', 'Appliance Settings')
//       .then(() => common.waitAndSet('//*[@id="maxCloneDensity"]', '100'))
//       .then(() => common.waitAndClick('//button[text()="Submit"]'))
//   })

//   it('should create a new guest pool with many guests', () => {
//    return common.clickSidebarTab(browser, 'Guest Pools')
//      .then(() => common.waitAndClick('//*[@id="add_pool"]'))
//      .then(() => browser.setValue('//*[@id="name"]', 'amulet'))
//      .then(() => browser.selectByVisibleText('//*[@id="goldImage"]','bruller'))
//      .then(() => browser.setValue('//*[@id="minCloneDensity"]', `${totalGuests}`))
//      .then(() => browser.setValue('//*[@id="maxCloneDensity"]', '50'))
//      .then(() => browser.setValue('//*[@id="seed"]', 'CHAPELS'))
//      // .then(() => browser.getText('//*[@id="seed"]', 'CHAPELS'))
//      .then(() => browser.setValue('//*[@id="mem"]', '256'))
//      .then(() => common.waitAndClick('//*[@id="subBtn"]'))
//      .then(() => browser.waitForExist('//td[1 and text()="amulet"]'))
//   });

//   it('should check that the guests are created and are ready', () => {
//     return common.clickSidebarTab(browser, 'Guest Management')
//       .then(() => browser.waitForExist(`//td[text()="CHAPELS${checkList[0]}"]`,90000))
//       .then(() => browser.refresh())
//       .then(() => browser.waitForExist(`//td[text()="CHAPELS${checkList[1]}"]`,90000))
//       .then(() => browser.refresh())
//       .then(() => browser.waitForExist(`//td[text()="CHAPELS${checkList[2]}"]`,90000))
//       .then(() => browser.refresh())
//       .then(() => console.log('all created'))
//       .then(() => browser.waitForExist(`//td[text()="CHAPELS${checkList[0]}"]/..//td[text()="Ready"]`,90000))
//       .then(() => browser.refresh())
//       .then(() => browser.waitForExist(`//td[text()="CHAPELS${checkList[1]}"]/..//td[text()="Ready"]`,90000))
//       .then(() => browser.refresh())
//       .then(() => browser.waitForExist(`//td[text()="CHAPELS${checkList[2]}"]/..//td[text()="Ready"]`,90000))
//       .then(() => console.log('got through ready'))
//       .then(() => browser.getText('//div[@id="tg"]'))
//       .then(text => expect(text).to.equal(`${totalGuests}`))
//   });

//   it('should delete the pool', () => {
//     return common.clickSidebarTab(browser, 'Guest Pools')
//       .then(() => common.waitAndClick('//td[1 and text()="amulet"]/..//button[text()="Delete"]'))
//       .then(() => browser.waitForExist('//*[@id="popup" and @style="display: block;"]'))
//       .then(() => browser.waitForEnabled('//*[@id="popup"]//button[text()="Confirm"]'))
//       .then(() => common.waitAndClick('//*[@id="popup"]//button[text()="Confirm"]'))
//       .then(() => browser.waitForExist('//*[contains(@class,"modal-backdrop")]', 2000, true));
//   });

//   it('should undefine and delete the template', () => {
//     return common.clickSidebarTab(browser, 'Templates')
//       .then(() => common.waitAndClick('//td[1 and text()="bruller"]/..//td//button[text()="Unload"]'))
//       .then(() => common.waitAndClick('//td[1 and text()="bruller"]/..//td//button[text()="Remove"]'))
//       .then(() => browser.waitForEnabled('//*[@id="popup"]//button[text()="Confirm"]'))
//       .then(() => browser.waitForExist('//*[@id="popup" and @style="display: block;"]'))
//       .then(() => common.waitAndClick('//*[@id="popup"]//button[text()="Confirm"]'))
//       .then(() => browser.waitForExist('//*[contains(@class,"modal-backdrop")]', 2000, true))
//       .then(() => browser.waitForExist('//td[1 and text()="bruller"]', 10000, true))
//       .then(() => browser.isExisting('//td[1 and text()="bruller"]'))
//       .then(ex => expect(ex).to.be.false)
//   });

// });
