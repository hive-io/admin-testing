'use strict';
const common = require('../common'),
      expect = require('chai').expect;

describe('Create New Template and Pool', () => {
	before(() => common.login(browser, 'admin', 'admin', 'local' ));
	after(() => common.logout());

	it('should create a new template', () => {
		return common.waitAndClick('//*[@id="new_tmpl"]')
			.then(() => browser.waitForExist('//*[@id="editTemplate"]'))
			.then(() => browser.setValue('//*[@id="name"]','forest'))
			.then(() => browser.setValue('//*[@id="path"]','192.168.11.4/NFS/Iso/testing'))
			.then(() => browser.selectByVisibleText('//*[@id="os"]', 'Linux'))
			.then(() => browser.('//*[@id="dsize"]','10'))
			.then(() => )

	})
})