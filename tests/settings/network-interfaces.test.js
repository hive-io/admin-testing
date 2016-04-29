const common = require('../common'),
      expect = require('chai').expect;

describe('Network Interfaces', () => {
  before(() => common.login(browser, 'admin', 'admin', 'local'));
  after(() => common.logout());
  it('should navigate to Network Interfaces', () =>
    common.clickSidebarTab(browser, 'Network Interfaces'));
});
