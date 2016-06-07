const common = require('../common');
const editBtn = '//button[@type="edit" and position()=1]',
      addBondBtn = '//*[@id="addBond"]';

describe('Network Interfaces', () => {
  before(() => {
    return common.isLoggedIn()
      .then((loggedIn) => !loggedIn ? common.login(browser, 'admin', 'admin', 'local') : null );
  });
  after(() => common.logout());

  it('should navigate to Network Interfaces', () =>
    common.clickSidebarTab(browser, 'Network Interfaces'));

  it('should display message when user hardcodes same settings', () => {
    return common.waitAndClick(editBtn)
      .then(() => common.waitAndClick('//button[@id="subBtn"]'))
      .then(() => browser.waitForExist('//div[@id="admin-alert"]'), 10000);
  });

  it('should allow user to cancel hardcoding settings', () => {
    return common.waitForOnClick(editBtn)
      .then(() => browser.click(editBtn))
      .then(() => common.waitAndClick('//form[@id="hardcode_form"]/button[2]'))
      .then(() => browser.waitForExist('//form[@id="hardcode_form" and @style="display: none;"]'));
  });

  it('should display message when user submits same input to configure bonding', () => {
    return common.waitAndClick(addBondBtn)
      .then(() => common.waitAndClick('//*[@id="submitBond"]'))
      .then(() => browser.waitForExist('//div[@id="admin-alert"]'), 10000);
  });

  it('should allow user to cancel configure bonding', () => {
    return common.waitAndClick(addBondBtn)
      .then(() => common.waitAndClick('//*[@id="bonding_form"]/button[contains(text(),"Cancel")]'))
      .then(() => browser.waitForExist('//form[@id="bonding_form" and @style="display: none;"]'));
  });
});
