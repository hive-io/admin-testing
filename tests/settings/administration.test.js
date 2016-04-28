const common = require('../common'),
      expect = require('chai').expect;

describe('Administration', () => {
  before(() => common.login(browser, 'admin', 'admin', 'local'));
  it('should navigate to Administration', () =>
    common.clickSidebarTab(browser, 'Administration', 'Appliance Administration'));
});
