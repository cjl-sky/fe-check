/**
 * 检测环境
 * @author chenjialin
 */

const path = require('path');
const shelljs = require('shelljs');
const checkConfig = require('./config');
const util = require('./util');

const expectedNodeVersion = 'v8.11.0';
const expectedNPMVersion = '5.6.0';

let nodeVersion = shelljs.exec('node -v', { silent: true }).stdout.trim();

let npmVersion = shelljs.exec('npm -v', { silent: true }).stdout.trim();

let errMsg;

if (nodeVersion !== expectedNodeVersion) {
  errMsg = 'Node version must be ' + expectedNodeVersion;
}

if (npmVersion !== expectedNPMVersion) {
  errMsg = 'NPM version must be ' + expectedNPMVersion;
}

if (checkConfig.feCheckVersion) {
  let expectedfeCheckVersion = checkConfig.feCheckVersion.replace(/\./g, '');
  let pjsonVersion = shelljs.exec('fe-check -v', { silent: true }).replace(/\./g, '');
  if (pjsonVersion < expectedfeCheckVersion) {
    errMsg = 'fe-check version must be greater than ' + checkConfig.feCheckVersion;
  }
}

if (checkConfig.feLintVersion) {
  let expectedfeLintVersion = checkConfig.feLintVersion.replace(/\./g, '');
  let pjsonVersion = shelljs.exec('fe-lint -v', { silent: true }).replace(/\./g, '');
  if (pjsonVersion < expectedfeLintVersion) {
    errMsg = 'fe-lint version must be greater than ' + checkConfig.feLintVersion;
  }
}

if (checkConfig.feBuildVersion) {
  let expectedfeBuildVersion = checkConfig.feBuildVersion.replace(/\./g, '');
  let pjsonVersion = shelljs.exec('fe-build -v', { silent: true }).replace(/\./g, '');
  if (pjsonVersion < expectedfeBuildVersion) {
    errMsg = 'fe-build version must be greater than ' + checkConfig.feBuildVersion;
  }
}

if (checkConfig.feCoreVersion) {
  let expectedfeCoreVersion = checkConfig.feCoreVersion.replace(/\./g, '');
  let pjsonVersion = require(path.join(process.cwd(), 'node_modules/fe-core/package.json')).version.replace(/\./g, '');
  if (pjsonVersion < expectedfeCoreVersion) {
    errMsg = 'fe-core version must be greater than ' + checkConfig.feCoreVersion;
  }
}

util.error(errMsg);

console.log('fe-check: 环境依赖标准检测通过！');
