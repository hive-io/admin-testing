'use strict';
const common = require('../common');

describe('Guest Pools', () => {
  before(() => {
    return common.isLoggedIn()
      .then((loggedIn) => !loggedIn ? common.login(browser, 'admin', 'admin', 'local') : null );
  });
  after(() => browser.refresh());

  it('should navigate to Guest Pools', () =>
    common.clickSidebarTab(browser, 'Guest Pools'));
});
