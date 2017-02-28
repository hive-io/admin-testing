'use strict';

const testconfig = require('./testconfig');

exports.config = {
  specs: testconfig.specs,
  exclude: testconfig.exclude,
  // [
    // './tests/scenarios/convert_temp.test.js'
    // './tests/scenarios/*'
    // './tests/administration/users/*'
    // './tests/administration/realms/*'
    // 'path/to/excluded/files'
  // ],
  capabilities: [{
    browserName: testconfig.browser
  }],
  debug: true,
  //logLevel: 'silent',
  coloredLogs: true,
  screenshotPath: './errorShots/',
  baseUrl: testconfig.server,
  waitforTimeout: 10000,
  framework: 'mocha',
  reporter: 'spec',
  mochaOpts: {
    ui: 'bdd',
    timeout: 480000
  }
};
