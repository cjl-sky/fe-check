/**
 * Git Tag 命名规范检测
 * @author chenjialin
 */

const shelljs = require('shelljs');
const checkConfig = require('./config');
const util = require('./util');

let errMsg;

let tags = shelljs.exec('git tag', { silent: true }).stdout.split('\n');

tags.forEach(function(element, index) {
  if (element) {
    if (!/^[A-Z]+[-\/]+/.test(element)) {
      errMsg = `${element} 不符合 tag 规范，请联系: jialin.chen@buycoor.com`;
    }
  }
});

util.error(errMsg);

console.log('fe-check: Git Tag 命名规范检测通过！');
