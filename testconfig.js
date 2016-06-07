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

let nfsIP = !!process.env.NFS ? process.env.NFS : '192.168.11.4';

let tmplPath = !!process.env.TMPLPATH ? process.env.TMPLPATH : '/Guests';

let isoPath = !!process.env.ISOPATH ? process.env.ISOPATH : '/Iso';

let nfsPath = !!process.env.NFSPATH ? process.env.NFSPATH : '/NFS';

module.exports = {
  server: server,
  specs: specs,
  nfsIP: nfsIP,
  tmplPath: tmplPath,
  isoPath: isoPath,
  nfsPath: nfsPath
};
