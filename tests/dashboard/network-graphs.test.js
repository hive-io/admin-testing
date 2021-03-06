// TO DO

// Are all network interfaces present in the drop down?
// Do they all have a graph
// Change of interface in dropdown generates a new graph
// Validate that data streams in (e.g. should wait a for the graph to update)
// Validate empty graphs - need to think how this is possible

const common = require('../common'),
      expect = require('chai').expect;

describe('Network Graphs', () => {
  before(() => {
    return common.isLoggedIn()
      .then((loggedIn) => !loggedIn ? common.login(browser, 'admin', 'admin', 'local') : null );
  });
  after(() => common.logout());
  it('should navigate to Network Graphs', () =>
    common.clickSidebarTab(browser, 'Network Graph', 'Network Graphs'));

  [
    { name: 'Eth0 Past Hour', metric: 'Eth0', duration: '1 Hour', expected: 'Eth0 Past Hour' },
    { name: 'Eth0 Past 2 Hours', metric: 'Eth0', duration: '2 Hours', expected: 'Eth0 Past 2 Hours' },
    { name: 'Eth0 Past 6 Hours', metric: 'Eth0', duration: '6 Hours', expected: 'Eth0 Past 6 Hours' },
    { name: 'Eth0 Past 12 Hours', metric: 'Eth0', duration: '12 Hours', expected: 'Eth0 Past 12 Hours' },
    { name: 'Eth0 Past Day', metric: 'Eth0', duration: '1 Day', expected: 'Eth0 Past Day' },
    { name: 'Eth0 Past Week', metric: 'Eth0', duration: '1 Week', expected: 'Eth0 Past Week' },
    { name: 'Eth0 Past Month', metric: 'Eth0', duration: '1 Month', expected: 'Eth0 Past Month' }
  ].forEach(test => {
    it('should show ' + test.name, () => {
      return Promise.all([
        browser.selectByVisibleText('//select[@name="metric"]', test.metric),
        browser.selectByVisibleText('//select[@name="duration"]', test.duration)
      ])
      .then(() => browser.waitForExist('#gtitle'))
      .then(() => browser.getText('#gtitle'))
      .then(title => expect(title).to.equal(test.expected));
    });
  });
});
