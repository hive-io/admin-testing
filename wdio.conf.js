'use strict';
let server = process.env.SERVER ?
  'http://' + process.env.SERVER : 'http://192.168.11.100';

let specs = process.env.TEST ?
[process.env.TEST] :
[
  //'./tests/*.test.js',
  './tests/**/*.test.js',
  './tests/**/**/*.test.js'
];

exports.config = {
  specs: specs,
  exclude: [
    // './tests/scenarios/*',
    './tests/administration/users/*'
    //'./tests/administration/realms/*'
    // 'path/to/excluded/files'
  ],
  capabilities: [{
    browserName: 'chrome'
  }],
  logLevel: 'silent',
  coloredLogs: true,
  screenshotPath: './errorShots/',
  baseUrl: server,
  waitforTimeout: 10000,
  framework: 'mocha',
  reporter: 'spec',
  mochaOpts: {
    ui: 'bdd',
    timeout: 240000
  }
};
