const common = require('../common'),
      expect = require('chai').expect;

describe('Production Network', () => {
  before(() => common.login(browser, 'admin', 'admin', 'local'));
  after(() => common.logout());
  
  it('should navigate to Production Network', () =>
    common.clickSidebarTab(browser, 'Production Network'));
});
