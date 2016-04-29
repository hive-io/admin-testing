const common = require('../common'),
      expect = require('chai').expect;

describe('Administration', () => {
  before(() => common.login(browser, 'admin', 'admin', 'local'));
  after(() => common.logout());
  it('should navigate to Administration', () =>
    common.clickSidebarTab(browser, 'Administration', 'Appliance Administration'));
});
