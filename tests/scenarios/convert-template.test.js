'use strict';
const Promise = require('bluebird'),
      common = require('../common'),
      expect = require('chai').expect,
      config = require('../../testconfig'),
      fs = Promise.promisifyAll(require('fs')),
      p = require('path');

const source = '//input[@id="source"]',
      convertBtn = '//button[@id="btn_convert"]',
      output = '//input[@id="output"]';

let tmp = p.join('/tmp', common.randomStr(10));
let hioTmpl = '/hio-converted';
let w7Tmpl = '/w7-converted';
let hioPath = p.join(tmp, config.tmplPath, hioTmpl);
let w7Path = p.join(tmp, config.tmplPath, w7Tmpl);

describe('Convert Template And Run Pool', () => {
  before(() => {
    return common.isLoggedIn()
      .then((loggedIn) => !loggedIn ? common.login(browser, 'admin', 'admin', 'local') : null )
      .then(() => common.mountTempDir(tmp))
      .then(() => common.deleteFile(hioPath))
      .then(() => common.deleteFile(w7Path))
      //clone density
      .then(() => common.clickSidebarTab(browser, 'Appliance', 'Appliance Settings'))
      .then(() => common.waitAndSet('//*[@id="maxCloneDensity"]', '100'))
      .then(() => common.waitAndClick('//button[text()="Submit"]'))
      .then(() => browser.waitForExist('//*[@id="reconfigure"]', 15000, true))
      .then(() => browser.pause(5000))
      .then(() => browser.refresh())
      .then(() => common.clickSidebarTab(browser, 'Convert Image'));
  });

  after(() => {
    return common.deleteFile(hioPath)
      .then(() => common.deleteFile(w7Path))
      .then(() => common.unmountTempDir(tmp));
  });

  describe('convert ubuntu template', () => {
    it('should try to convert hio-tester', () => {
      return browser.setValue(source,
        `${config.nfsIP}:${config.nfsPath}${config.tmplPath}/hio-tester.qcow2`)
        .then(() => browser.setValue(output,
          `${config.nfsIP}:${config.nfsPath}${config.tmplPath}${hioTmpl}`))
        .then(() => common.waitAndClick(convertBtn))
        .then(() => browser.pause(750))
        .then(() => browser.click(convertBtn))
        .then(() => browser.waitForExist('//*[text()="Conversion Completed"]'));
    });

    // it('should check the file was created', () => {
    //   return browser.waitUntil(() => {
    //     return fs.statAsync(w7Path)
    //       .then(stat => stat.isFile());
    //   }, 240000);
    // });

    it('should add the converted template and create a pool', () => {
      return common.clickSidebarTab(browser, 'Templates')
        .then(() => common.waitAndClick('//button[@id="add_tmpl"]'))
        .then(() => browser.waitForExist('//*[@id="add_tmpl_form"]'))
        .then(() => browser.setValue('//*[@id="add_tmpl_form"]//*[@id="name"]', 'able'))
        .then(() => browser.setValue('//*[@id="add_tmpl_form"]//*[@id="path"]',
          `${config.nfsIP}:${config.nfsPath}${config.tmplPath}${hioTmpl}`))
        .then(() => browser.selectByVisibleText('//*[@id="os"]', 'Linux'))
        .then(() => common.waitAndClick('//*[@id="add_tmpl_form"]//*[@id="subBtn"]'))
        .then(() => browser.waitForExist('//td[1 and text()="able"]'))
        .then(() => browser.pause(2000))
        //add pool
        .then(() => common.clickSidebarTab(browser, 'Guest Pools'))
        .then(() => common.waitAndClick('//*[@id="add_pool"]'))
        .then(() => browser.setValue('//*[@id="name"]', 'individual'))
        .then(() => browser.selectByVisibleText('//*[@id="goldImage"]', 'able'))
        .then(() => browser.setValue('//*[@id="minCloneDensity"]', '1'))
        .then(() => browser.setValue('//*[@id="maxCloneDensity"]', '2'))
        .then(() => browser.setValue('//*[@id="seed"]', 'sinus'))
        .then(() => browser.setValue('//*[@id="mem"]', '128'))
        .then(() => common.waitAndClick('//*[@id="subBtn"]'))
        .then(() => browser.waitForExist('//td[1 and text()="individual"]', 20000))
        .then(() => common.clickSidebarTab(browser, 'Templates'))
        .then(() => browser.waitForExist('//td[text()="Live (individual)"]', 240000));
    });

    it('should check that the guests are created and are ready', () => {
      return common.clickSidebarTab(browser, 'Guest Management')
        .then(() => browser.waitForExist('//td[text()="SINUS0001"]', 24000))
        .then(() => browser.waitForExist('//td[text()="SINUS0001"]/..//td[text()="Ready"]', 24000))
        .then(() => browser.refresh())
        .then(() => browser.pause(750))
        .then(() => browser.getText('//div[@id="tg"]'))
        .then(text => expect(text).to.equal('1'));
    });

    it('should delete the pool', () => {
      return common.clickSidebarTab(browser, 'Guest Pools')
        .then(() => common.waitAndClick(
          '//td[1 and text()="individual"]/..//button[text()="Delete"]'))
        .then(() => common.confirmPopup());
    });

    it('should undefine and delete the template', () => {
      return common.clickSidebarTab(browser, 'Templates')
        .then(() => common.waitAndClick(
          '//td[1 and text()="able"]/..//td//button[text()="Unload"]'))
        .then(() => common.waitAndClick(
          '//td[1 and text()="able"]/..//td//button[text()="Remove"]'))
        .then(() => common.confirmPopup())
        .then(() => browser.waitForExist('//td[1 and text()="able"]', 15000, true))
        .then(() => browser.isExisting('//td[1 and text()="able"]'))
        .then(ex => expect(ex).to.be.false);
    });
  });

  describe('Convert Windows 7 Template', () => {
    it('should try to convert Windows 7', () => {
      return common.clickSidebarTab(browser, 'Convert Image')
        .then(() => browser.setValue(source,
        `${config.nfsIP}:${config.nfsPath}${config.tmplPath}/w7-vsi`))
        .then(() => browser.setValue(output,
          `${config.nfsIP}:${config.nfsPath}${config.tmplPath}${w7Tmpl}`))
        .then(() => common.waitAndClick(convertBtn))
        .then(() => browser.pause(750))
        .then(() => browser.click(convertBtn))
        .then(() => browser.waitForExist('//*[text()="Conversion Completed"]'));
    });

    // it('should check the file was created', () => {
    //   return browser.waitUntil(() => {
    //     return fs.statAsync(hioPath)
    //       .then(stat => stat.isFile());
    //   }, 240000);
    // });

    it('should add the converted template and create a pool', () => {
      return common.clickSidebarTab(browser, 'Templates')
        .then(() => common.waitAndClick('//button[@id="add_tmpl"]'))
        .then(() => browser.waitForExist('//*[@id="add_tmpl_form"]'))
        .then(() => browser.setValue('//*[@id="add_tmpl_form"]//*[@id="name"]', 'dionysus'))
        .then(() => browser.setValue('//*[@id="add_tmpl_form"]//*[@id="path"]',
          `${config.nfsIP}:${config.nfsPath}${config.tmplPath}${w7Tmpl}`))
        .then(() => browser.selectByVisibleText('//*[@id="os"]', 'Windows 7'))
        .then(() => common.waitAndClick('//*[@id="add_tmpl_form"]//*[@id="subBtn"]'))
        .then(() => browser.waitForExist('//td[1 and text()="dionysus"]'))
        //clone density
        .then(() => common.clickSidebarTab(browser, 'Appliance', 'Appliance Settings'))
        .then(() => common.waitAndSet('//*[@id="maxCloneDensity"]', '100'))
        .then(() => common.waitAndClick('//button[text()="Submit"]'))
        .then(() => browser.waitForExist('//*[@id="reconfigure"]', 15000, true))
        .then(() => browser.pause(2500))
        .then(() => browser.refresh())
        //add pool
        .then(() => common.clickSidebarTab(browser, 'Guest Pools'))
        .then(() => common.waitAndClick('//*[@id="add_pool"]'))
        .then(() => browser.setValue('//*[@id="name"]', 'tango'))
        .then(() => browser.selectByVisibleText('//*[@id="goldImage"]', 'dionysus'))
        .then(() => browser.setValue('//*[@id="minCloneDensity"]', '1'))
        .then(() => browser.setValue('//*[@id="maxCloneDensity"]', '2'))
        .then(() => browser.setValue('//*[@id="seed"]', 'CLYDE'))
        .then(() => browser.setValue('//*[@id="mem"]', '1024'))
        .then(() => browser.selectByVisibleText('//*[@id="Domain"]', 'None'))
        .then(() => common.waitAndClick('//*[@id="subBtn"]'))
        .then(() => browser.waitForExist('//td[1 and text()="tango"]', 20000))
        .then(() => common.clickSidebarTab(browser, 'Templates'))
        .then(() => browser.waitForExist('//td[text()="Live (tango)"]', 480000));
    });

    it('should check that the guests are created and are ready', () => {
      return common.clickSidebarTab(browser, 'Guest Management')
        .then(() => browser.waitForExist('//td[text()="CLYDE0001"]', 240000))
        .then(() => browser.waitForExist('//td[text()="CLYDE0001"]/..//td[text()="Ready"]', 240000))
        .then(() => browser.refresh())
        .then(() => browser.pause(750))
        .then(() => browser.getText('//div[@id="tg"]'))
        .then(text => expect(text).to.equal('1'));
    });

    it('should delete the pool', () => {
      return common.clickSidebarTab(browser, 'Guest Pools')
        .then(() => common.waitAndClick('//td[1 and text()="tango"]/..//button[text()="Delete"]'))
        .then(() => common.confirmPopup());
    });

    it('should undefine and delete the template', () => {
      return common.clickSidebarTab(browser, 'Templates')
        .then(() => common.waitAndClick(
          '//td[1 and text()="dionysus"]/..//td//button[text()="Unload"]'))
        .then(() => common.waitAndClick(
          '//td[1 and text()="dionysus"]/..//td//button[text()="Remove"]'))
        .then(() => common.confirmPopup())
        .then(() => browser.waitForExist('//td[1 and text()="dionysus"]', 15000, true))
        .then(() => browser.isExisting('//td[1 and text()="dionysus"]'))
        .then(ex => expect(ex).to.be.false);
    });
  });
  describe('Cleanup', () => {
    it('should confirm no orphaned guests are left behind', () => {
      let orphanedGuests;
      return common.clickSidebarTab(browser, 'Guest Management')
        .then(() => browser.pause(3000))
        .then(() => browser.elements('//button[contains(text(), "Action")]'))
        .then(elements => {
          orphanedGuests = elements.value;
          return Promise.mapSeries(elements.value, el => {
            return common.waitAndClick('//button[contains(text(), "Action")][1]')
              .then(() => common.waitAndClick('//*[contains(text(), "Power Off")][1]'));
          });
        })
        .then(() => expect(orphanedGuests).to.be.empty);
    });
  });
});

// 'use strict';
// const Promise = require('bluebird'),
//       common = require('../common'),
//       expect = require('chai').expect,
//       config = require('../../testconfig'),
//       fs = Promise.promisifyAll(require('fs')),
//       p = require('path');

// const source = '//input[@id="source"]',
//       convertBtn = '//button[@id="btn_convert"]',
//       output = '//input[@id="output"]';

// let tmp = p.join('/tmp', common.randomStr(10));
// let hioTmpl = '/hio-converted';
// let w7Tmpl = '/w7-converted';
// let hioPath = p.join(tmp, config.tmplPath, hioTmpl);
// let w7Path = p.join(tmp, config.tmplPath, w7Tmpl);

// describe('Convert Template And Run Pool', () => {
//   before(() => {
//     return common.isLoggedIn()
//       .then((loggedIn) => !loggedIn ? common.login(browser, 'admin', 'admin', 'local') : null )
//       .then(() => common.clickSidebarTab(browser, 'Convert Image'))
//       .then(() => common.mountTempDir(tmp))
//       .then(() => common.deleteFile(hioPath))
//       .then(() => common.deleteFile(w7Path));
//   });

//   after(() => {
//     return common.deleteFile(hioPath)
//       .then(() => common.deleteFile(w7Path))
//       .then(() => common.unmountTempDir(tmp))
//       .then(() => browser.refresh());
//   });

//   describe('convert ubuntu template', () => {
//     it('should try to convert hio-tester', () => {
//       return browser.setValue(source,
//         `${config.nfsIP}:${config.nfsPath}${config.tmplPath}/hio-tester.qcow2`)
//         .then(() => browser.setValue(output,
//           `${config.nfsIP}:${config.nfsPath}${config.tmplPath}${hioTmpl}`))
//         .then(() => common.waitAndClick(convertBtn))
//         .then(() => browser.pause(750))
//         .then(() => browser.click(convertBtn))
//         .then(() => browser.waitForExist('//*[text()="Conversion Completed"]'));
//     });

//     // it('should check the file was created', () => {
//     //   return browser.waitUntil(() => {
//     //     return fs.statAsync(w7Path)
//     //       .then(stat => stat.isFile());
//     //   }, 240000);
//     // });

//     it('should add the converted template and create a pool', () => {
//       return common.clickSidebarTab(browser, 'Templates')
//         .then(() => common.waitAndClick('//button[@id="add_tmpl"]'))
//         .then(() => browser.waitForExist('//*[@id="add_tmpl_form"]'))
//         .then(() => browser.setValue('//*[@id="add_tmpl_form"]//*[@id="name"]', 'able'))
//         .then(() => browser.setValue('//*[@id="add_tmpl_form"]//*[@id="path"]',
//           `${config.nfsIP}:${config.nfsPath}${config.tmplPath}${hioTmpl}`))
//         .then(() => browser.selectByVisibleText('//*[@id="os"]', 'Linux'))
//         .then(() => common.waitAndClick('//*[@id="add_tmpl_form"]//*[@id="subBtn"]'))
//         .then(() => browser.waitForExist('//td[1 and text()="able"]'))
//         //clone density
//         .then(() => common.clickSidebarTab(browser, 'Appliance', 'Appliance Settings'))
//         .then(() => common.waitAndSet('//*[@id="maxCloneDensity"]', '100'))
//         .then(() => common.waitAndClick('//button[text()="Submit"]'))
//         .then(() => browser.waitForExist('//*[@id="reconfigure"]', 15000, true))
//         .then(() => browser.pause(2500))
//         .then(() => browser.refresh())
//         //add pool
//         .then(() => common.clickSidebarTab(browser, 'Guest Pools'))
//         .then(() => common.waitAndClick('//*[@id="add_pool"]'))
//         .then(() => browser.setValue('//*[@id="name"]', 'individual'))
//         .then(() => browser.selectByVisibleText('//*[@id="goldImage"]', 'able'))
//         .then(() => browser.setValue('//*[@id="minCloneDensity"]', '1'))
//         .then(() => browser.setValue('//*[@id="maxCloneDensity"]', '2'))
//         .then(() => browser.setValue('//*[@id="seed"]', 'sinus'))
//         .then(() => browser.setValue('//*[@id="mem"]', '128'))
//         .then(() => common.waitAndClick('//*[@id="subBtn"]'))
//         .then(() => browser.waitForExist('//td[1 and text()="individual"]', 20000))
//         .then(() => common.clickSidebarTab(browser, 'Templates'))
//         .then(() => browser.waitForExist('//td[text()="Live (individual)"]', 240000));
//     });

//     it('should check that the guests are created and are ready', () => {
//       return common.clickSidebarTab(browser, 'Guest Management')
//         .then(() => browser.waitUntil(() => {
//           return browser.isExisting('//td[text()="SINUS0001"]')
//             .then(ex => ex === true);
//         }, 24000))
//         .then(() => browser.waitForExist('//td[text()="SINUS0001"]/..//td[text()="Ready"]', 24000))
//         .then(() => browser.refresh())
//         .then(() => browser.pause(750))
//         .then(() => browser.getText('//div[@id="tg"]'))
//         .then(text => expect(text).to.equal('1'));
//     });

//     it('should delete the pool', () => {
//       return common.clickSidebarTab(browser, 'Guest Pools')
//         .then(() => common.waitAndClick(
//           '//td[1 and text()="individual"]/..//button[text()="Delete"]'))
//         .then(() => common.confirmPopup());
//     });

//     it('should undefine and delete the template', () => {
//       return common.clickSidebarTab(browser, 'Templates')
//         .then(() => common.waitAndClick(
//           '//td[1 and text()="able"]/..//td//button[text()="Unload"]'))
//         .then(() => common.waitAndClick(
//           '//td[1 and text()="able"]/..//td//button[text()="Remove"]'))
//         .then(() => common.confirmPopup())
//         .then(() => browser.waitForExist('//td[1 and text()="able"]', 15000, true))
//         .then(() => browser.isExisting('//td[1 and text()="able"]'))
//         .then(ex => expect(ex).to.be.false);
//     });
//   });

//   describe('Convert Windows 7 Template', () => {
//     it('should try to convert Windows 7', () => {
//       return common.clickSidebarTab(browser, 'Convert Image')
//         .then(() => browser.setValue(source,
//         `${config.nfsIP}:${config.nfsPath}${config.tmplPath}/w7-vsi`))
//         .then(() => browser.setValue(output,
//           `${config.nfsIP}:${config.nfsPath}${config.tmplPath}${w7Tmpl}`))
//         .then(() => common.waitAndClick(convertBtn))
//         .then(() => browser.pause(750))
//         .then(() => browser.click(convertBtn))
//         .then(() => browser.waitForExist('//*[text()="Conversion Completed"]'));
//     });

//     // it('should check the file was created', () => {
//     //   return browser.waitUntil(() => {
//     //     return fs.statAsync(hioPath)
//     //       .then(stat => stat.isFile());
//     //   }, 240000);
//     // });

//     it('should add the converted template and create a pool', () => {
//       return common.clickSidebarTab(browser, 'Templates')
//         .then(() => common.waitAndClick('//button[@id="add_tmpl"]'))
//         .then(() => browser.waitForExist('//*[@id="add_tmpl_form"]'))
//         .then(() => browser.setValue('//*[@id="add_tmpl_form"]//*[@id="name"]', 'dionysus'))
//         .then(() => browser.setValue('//*[@id="add_tmpl_form"]//*[@id="path"]',
//           `${config.nfsIP}:${config.nfsPath}${config.tmplPath}${w7Tmpl}`))
//         .then(() => browser.selectByVisibleText('//*[@id="os"]', 'Windows 7'))
//         .then(() => common.waitAndClick('//*[@id="add_tmpl_form"]//*[@id="subBtn"]'))
//         .then(() => browser.waitForExist('//td[1 and text()="dionysus"]'))
//         //clone density
//         .then(() => common.clickSidebarTab(browser, 'Appliance', 'Appliance Settings'))
//         .then(() => common.waitAndSet('//*[@id="maxCloneDensity"]', '100'))
//         .then(() => common.waitAndClick('//button[text()="Submit"]'))
//         .then(() => browser.waitForExist('//*[@id="reconfigure"]', 15000, true))
//         .then(() => browser.pause(2500))
//         .then(() => browser.refresh())
//         //add pool
//         .then(() => common.clickSidebarTab(browser, 'Guest Pools'))
//         .then(() => common.waitAndClick('//*[@id="add_pool"]'))
//         .then(() => browser.setValue('//*[@id="name"]', 'tango'))
//         .then(() => browser.selectByVisibleText('//*[@id="goldImage"]', 'dionysus'))
//         .then(() => browser.setValue('//*[@id="minCloneDensity"]', '1'))
//         .then(() => browser.setValue('//*[@id="maxCloneDensity"]', '2'))
//         .then(() => browser.setValue('//*[@id="seed"]', 'CLYDE'))
//         .then(() => browser.setValue('//*[@id="mem"]', '1024'))
//         .then(() => common.waitAndClick('//*[@id="subBtn"]'))
//         .then(() => browser.waitForExist('//td[1 and text()="tango"]', 20000))
//         .then(() => common.clickSidebarTab(browser, 'Templates'))
//         .then(() => browser.waitForExist('//td[text()="Live (tango)"]', 240000));
//     });

//     it('should check that the guests are created and are ready', () => {
//       return common.clickSidebarTab(browser, 'Guest Management')
//         .then(() => browser.waitUntil(() => {
//           return browser.isExisting('//td[text()="CLYDE0001"]')
//             .then(ex => ex === true);
//         }, 240000))
//         .then(() => browser.waitForExist('//td[text()="CLYDE0001"]/..//td[text()="Ready"]', 240000))
//         .then(() => browser.refresh())
//         .then(() => browser.pause(750))
//         .then(() => browser.getText('//div[@id="tg"]'))
//         .then(text => expect(text).to.equal('1'));
//     });

//     it('should delete the pool', () => {
//       return common.clickSidebarTab(browser, 'Guest Pools')
//         .then(() => common.waitAndClick('//td[1 and text()="tango"]/..//button[text()="Delete"]'))
//         .then(() => common.confirmPopup());
//     });

//     it('should undefine and delete the template', () => {
//       return common.clickSidebarTab(browser, 'Templates')
//         .then(() => common.waitAndClick(
//           '//td[1 and text()="dionysus"]/..//td//button[text()="Unload"]'))
//         .then(() => common.waitAndClick(
//           '//td[1 and text()="dionysus"]/..//td//button[text()="Remove"]'))
//         .then(() => common.confirmPopup())
//         .then(() => browser.waitForExist('//td[1 and text()="dionysus"]', 15000, true))
//         .then(() => browser.isExisting('//td[1 and text()="dionysus"]'))
//         .then(ex => expect(ex).to.be.false);
//     });
//   });
//   describe('Cleanup', () => {
//     it('should confirm no orphaned guests are left behind', () => {
//       let orphanedGuests;
//       return common.clickSidebarTab(browser, 'Guest Management')
//         .then(() => browser.pause(3000))
//         .then(() => browser.elements('//button[contains(text(), "Action")]'))
//         .then(elements => {
//           orphanedGuests = elements.value;
//           return Promise.mapSeries(elements.value, el => {
//             return common.waitAndClick('//button[contains(text(), "Action")][1]')
//               .then(() => common.waitAndClick('//*[contains(text(), "Power Off")][1]'));
//           });
//         })
//         .then(() => expect(orphanedGuests).to.be.empty);
//     });
//   });
// });
