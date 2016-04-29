const common = require('../common'),
      expect = require('chai').expect;

describe('Guest Pools', () => {
  before(() => common.login(browser, 'admin', 'admin', 'local'));
  after(() => common.logout());
  it('should navigate to Guest Pools', () =>
    common.clickSidebarTab(browser, 'Guest Pools'));
});
