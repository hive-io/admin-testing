const common = require('../common'),
      expect = require('chai').expect;

describe('Guest Management', () => {
  before(() => common.login(browser, 'admin', 'admin', 'local'));
  after(() => common.logout());
  it('should navigate to Guest Management', () =>
    common.clickSidebarTab(browser, 'Guest Management'));
});
