// TO DO

// Are all gauges displayed
// Do they update?
// Validate data in the overview table (as much as possible, or that at least it is displayed and passes a validation)

const common = require('../common');

describe('Overview', () => {
  before(() => {
    return common.isLoggedIn()
      .then((loggedIn) => !loggedIn ? common.login(browser, 'admin', 'admin', 'local') : null );
  });
  after(() => common.logout());
  it('should navigate to Overview', () =>
    common.clickSidebarTab(browser, 'Overview'));
});
