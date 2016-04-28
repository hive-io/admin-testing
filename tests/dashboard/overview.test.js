const common = require('../common'),
      expect = require('chai').expect;

describe('Overview', () => {
  before(() => common.login(browser, 'admin', 'admin', 'local'));
  it('should navigate to Overview', () =>
    common.clickSidebarTab(browser, 'Overview'));
});
