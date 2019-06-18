/**
 * Git 分支命名规范检测
 * @author chenjialin
 */

const shelljs = require('shelljs');
const checkConfig = require('./config');
const util = require('./util');

let errMsg;

let branches = shelljs.exec('git branch -r', { silent: true }).stdout.split('\n');

branches.forEach(function(element, index) {
  // 因为 split('\n')，所最后一个 element 是空字符串，为了方便，此处做判空处理即可
  if (element && ['  origin/HEAD -> origin/master', '  origin/master', '  origin/develop'].indexOf(element) === -1) {
    let featureOrHotfixOrRealaseReg = /^  origin\/((feature)|(hotfix)|(realase))\/[A-Z]+-[1-9][0-9]*(_.*)?$/;
    if (!featureOrHotfixOrRealaseReg.test(element)) {
      errMsg = `${element} 不符合分支命名规范，请联系： jialin.chen@buycoor.com`;
    }
  }
});

util.error(errMsg);

console.log('fe-check: Git 分支命名规范检测通过！');
