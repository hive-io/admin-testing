'use strict';
const common = require('../common'),
      config = require('../../testconfig');

let templatePath = config.nfsPath + config.tmplPath,
    vmPath = config.nfsPath + config.isoPath,
    nfs = config.nfsIP;

describe('Add Storage Pool', () => {
  before(() => {
    return common.login(browser, 'admin', 'admin', 'local')
      .then(() => common.removeGuestPools())
      .then(() => common.removeTemplates())
      .then(() => common.removeStoragePools())
      .then(() => common.clickSidebarTab(browser, 'Storage Pools'));
  });

  after(() => {
    return browser.refresh()
      .then(() => common.removeStoragePools());
  });

  it('should add a template storage pool', () => {
    return common.createStoragePool('templates', 'NFS', nfs, templatePath);
  });

  it('should add a vm storage pool', () => {
    return common.createStoragePool('vms', 'NFS', nfs, vmPath);
  });
});
