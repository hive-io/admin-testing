const common = require('../common');

describe('Appliance', () => {
  before(() => {
    return common.isLoggedIn()
      .then((loggedIn) => !loggedIn ? common.login(browser, 'admin', 'admin', 'local') : null );
  });
  after(() => browser.refresh());

  it('should navigate to Appliance', () =>
    common.clickSidebarTab(browser, 'Appliance', 'Appliance Settings'));
});
