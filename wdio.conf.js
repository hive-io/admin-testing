'use strict';

const testconfig = require('./testconfig');

exports.config = {
  specs: testconfig.specs,
  exclude: [
    // './tests/scenarios/convert_temp.test.js'
    // './tests/scenarios/*'
    // './tests/administration/users/*'
    //'./tests/administration/realms/*'
    // 'path/to/excluded/files'
  ],
  capabilities: [{
    browserName: 'chrome'
  }],
  logLevel: 'silent',
  coloredLogs: true,
  screenshotPath: './errorShots/',
  baseUrl: testconfig.server,
  waitforTimeout: 10000,
  framework: 'mocha',
  reporter: 'spec',
  mochaOpts: {
    ui: 'bdd',
    timeout: 240000
  }
};
