// TO DO

// Are all gauges displayed
// Do they update?
// Validate data in the overview table (as much as possible, or that at least it is displayed and passes a validation)

const common = require('../common'),
      expect = require('chai').expect;

describe('Overview', () => {
  before(() => common.login(browser, 'admin', 'admin', 'local'));
  after(() => common.logout());
  it('should navigate to Overview', () =>
    common.clickSidebarTab(browser, 'Overview'));
});
