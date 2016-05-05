'use strict';
const common = require('../common'),
      expect = require('chai').expect;

describe('Firmware', () => {
  before(() => common.login(browser, 'admin', 'admin', 'local'));
  after(() => common.logout());
  it('should navigate to Firmware', () =>
    common.clickSidebarTab(browser, 'Firmware', 'Firmware Management'));
});
