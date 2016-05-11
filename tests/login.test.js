//This test is in common and part of every other test.

// const common = require('./common'),
//       expect = require('chai').expect;

// describe('log in to the admin page', () => {
//   it('should load the login page', () => {
//     return browser.url('/').getTitle()
//       .then(title => expect(title).to.startWith('hiveIO Appliance |'));
//   });

//   it('should login', () => {
//     return browser.setValue('//input[@name="username"]', 'admin')
//       .then(() => browser.setValue('//input[@name="password"]', 'admin'))
//       .then(() => browser.selectByVisibleText('//select[@name="domain"]', 'local'))
//       .then(() => browser.click('//button[@type="submit"]'));
//   });

//   it('should then be on the main dashboard page', () => {
//     return browser.waitForExist('h1.page-header')
//       .then(() => browser.getText('h1.page-header'))
//       .then(header => expect(header).to.equal('Overview'));
//   });
// });
