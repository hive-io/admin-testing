//Delete and

// 'use strict';
// const common = require('../common'),
//       expect = require('chai').expect;

// describe('Unload Pool and Template', () => {
//   before(() => {
//     return common.isLoggedIn()
//       .then((loggedIn) => {
//         if(!loggedIn) {
//           return common.login(browser, 'admin', 'admin', 'local')
//         }
//       })
//   });

//   it('should delete the pool', () => {
//     return common.clickSidebarTab(browser, 'Guest Pools')
//       .then(() => common.waitAndClick('//td[1 and text()="donuts"]/..//button[text()="Delete"]'))
//       .then(() => browser.waitForExist('//*[@id="popup" and @style="display: block;"]'))
//       .then(() => browser.waitForEnabled('//*[@id="popup"]//button[text()="Confirm"]'))
//       .then(() => common.waitAndClick('//*[@id="popup"]//button[text()="Confirm"]'))
//       .then(() => browser.waitForExist('//*[contains(@class,"modal-backdrop")]', 2000, true));
//   });

//   it('should undefine and delete the template', () => {
//     return common.clickSidebarTab(browser, 'Templates')
//       .then(() => common.waitAndClick('//td[1 and text()="cruller"]/..//td//button[text()="Unload"]'))
//   });

// });
