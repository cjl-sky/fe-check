const shelljs = require('shelljs');
const path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

let feDBPath = path.join(process.cwd(), 'node_modules/.fe-temp/');
shelljs.mkdir('-p', feDBPath);
let adapter = new FileSync(path.join(feDBPath, 'fe-db.json'));
let db = low(adapter);

module.exports = {
  error: function(errMsg) {
    if (!errMsg) {
      db && db.set('feCheckCode', 0).write();
    } else {
      db && db.set('feCheckCode', 1).write();
      throw new Error(`fe-check 检测结果：${errMsg}`);
    }
  },
};
