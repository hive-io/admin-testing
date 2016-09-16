'use strict';
const common = require('../common');

describe('Storage Pools', () => {
  before(() => {
    return common.isLoggedIn()
      .then((loggedIn) => !loggedIn ? common.login(browser, 'admin', 'admin', 'local') : null );
  });
  after(() => browser.refresh());

  it('should navigate to Storage Pools', () =>
    common.clickSidebarTab(browser, 'Storage Pools'));
});

//validations?
