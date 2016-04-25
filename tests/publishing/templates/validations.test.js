'use strict';
const common = require('../../common'),
      expect = require('chai').expect;

function loginAndClickTemplates() {
  return common.login(browser, 'admin', 'admin', 'local')
      .then(() => common.clickSidebarTab(browser, 'Templates'))
}

//function somehowClearThePathField() { return Promise.resolve(); }

describe('Templates (Validations)', () => {
  before(() => loginAndClickTemplates());

  it('should refuse invalid template paths', () => {
    let form = '//form[@id="newTmplForm"]';
    return browser.click('//button[@id="new_tmpl"]')
      .then(() => browser.setValue(`${form}//input[@id="path"]`, 'invalid input'))
      .then(() => browser.click(`${form}//input[@name="name"]`))
      .then(() => browser.getText('//span[@id="path-message"]'))
      .then((text) => expect(text).to.equal("Path verification failed - can't mount destination."))
  });

  // it('puts', () => {
  //   expect(true).to.be.true;
  // });

  // it('the lotion', () => {
  //   expect(true).to.be.true;
  // });

  // it('on', () => {
  //   expect(true).to.be.true;
  // });


  // describe('Path', () => {
  //   afterEach(() => somehowClearThePathField());
  //   it('should not allow the word monkey', () => {
  //     expect(true).to.be.true;
  //   });

  //   it('should not allow the characters $%^^&**^%', () => {
  //     expect(true).to.be.false;
  //   });
  // })

});


