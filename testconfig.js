'use strict';

let server = !!process.env.SERVER ?
  'https://' + process.env.SERVER : 'https://192.168.1.200';

let specs = !!process.env.TEST ?
[process.env.TEST] :
[
  //'./tests/*.test.js',
  './tests/scenarios/*.test.js'
  // './tests/**/**/*.test.js'
];

let nfsIP = !!process.env.NFS ? process.env.NFS : '192.168.1.5';

let tmplPath = !!process.env.TMPLPATH ? process.env.TMPLPATH : '/templates';

let isoPath = !!process.env.ISOPATH ? process.env.ISOPATH : '/vms';

let nfsPath = !!process.env.NFSPATH ? process.env.NFSPATH : '/storage';

let exclude = !!process.env.EXCLUDE ?
[process.env.EXCLUDE] :
[
  // './tests/scenarios/*'
  // './tests/administration/users/*',
  // './tests/scenarios/convert-template.test.js'
  // './tests/scenarios/windows-with-realm.test.js'
  // './tests/scenarios/ou.test.js',
  // './tests/scenarios/realm-validation.test.js'
  //tests that fail without zentyal
];

let browser = !!process.env.BROWSER ? process.env.BROWSER : 'chrome';

module.exports = {
  server: server,
  specs: specs,
  nfsIP: nfsIP,
  tmplPath: tmplPath,
  isoPath: isoPath,
  nfsPath: nfsPath,
  exclude: exclude,
  browser: browser
};


//OFER TEST CONFIG

/*
let server = !!process.env.SERVER ?
  'http://' + process.env.SERVER : 'http://192.168.1.200';

let nfsIP = !!process.env.NFS ? process.env.NFS : '192.168.1.5';

let tmplPath = !!process.env.TMPLPATH ? process.env.TMPLPATH : '/templates';

let isoPath = !!process.env.ISOPATH ? process.env.ISOPATH : '/vms';

let nfsPath = !!process.env.NFSPATH ? process.env.NFSPATH : '/storage';

*/
//