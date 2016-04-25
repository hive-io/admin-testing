const common = require('../common'),
      expect = require('chai').expect;

describe('Users', () => {
  before(() => common.login(browser, 'admin', 'admin', 'local'));
  it('should navigate to Users', () => common.clickSidebarTab(browser, 'Users', 'System Users'));
});