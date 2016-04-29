const common = require('../common'),
      expect = require('chai').expect;

describe('Realms', () => {
  before(() => common.login(browser, 'admin', 'admin', 'local'));
  after(() => common.logout());
  it('should navigate to Realms', () => common.clickSidebarTab(browser, 'Realms'));
});
