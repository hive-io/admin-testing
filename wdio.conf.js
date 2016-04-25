var server = process.env.SERVER ?
      'http://' + process.env.SERVER : 'http://tongster.synology.me';
var specs = process.env.TEST ?
      [process.env.TEST] : 
      [
        './tests/*.test.js',
        './tests/**/*.test.js'
      ];
      
exports.config = {
    specs: specs,
    exclude: [
      // 'path/to/excluded/files'
    ],
    capabilities: [{
        browserName: 'chrome'
    }],
    logLevel: 'silent',
    coloredLogs: true,
    screenshotPath: './errorShots/',
    baseUrl: server, 
    waitforTimeout: 1500000,
    framework: 'mocha',
    reporter: 'spec',
    mochaOpts: {
      ui: 'bdd'
    },
};
