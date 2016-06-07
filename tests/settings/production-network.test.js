const common = require('../common');

describe('Production Network', () => {
  before(() => {
    return common.isLoggedIn()
      .then((loggedIn) => !loggedIn ? common.login(browser, 'admin', 'admin', 'local') : null );
  });
  after(() => common.logout());

  it('should navigate to Production Network', () =>
    common.clickSidebarTab(browser, 'Production Network'));
});
