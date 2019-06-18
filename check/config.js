const path = require('path');
const extend = require('node.extend');
const util = require('./util');

const checkDefaultConfig = require('./../check.default.config');

try {
  require.resolve(path.join(process.cwd(), './check.config.js'));
} catch (e) {
  util.error(
    '需在项目根目录下添加 check.config.js 文件，具体参考：http://wiki.corp.mama.cn/pages/viewpage.action?pageId=78204660'
  );
}

let checkConfig = require(path.join(process.cwd(), './check.config.js'));

module.exports = extend(checkDefaultConfig, checkConfig);
