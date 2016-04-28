const common = require('../common'),
      expect = require('chai').expect;

describe('Production Network', () => {
  before(() => common.login(browser, 'admin', 'admin', 'local'));
  it('should navigate to Production Network', () =>
    common.clickSidebarTab(browser, 'Production Network'));
});
