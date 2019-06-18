/**
 * 检测目录结构, 文件命名, 文件大小, 文件行数
 * @author Chenxiaoping
 */

const chalk = require('chalk');
const lc = require('letter-count');
const fs = require('fs');
const path = require('path');
const slash = require('slash');
const checkConfig = require('./config');
const util = require('./util');
const argv = require('yargs').argv;

let errMsg;

let checkConfig4Normal = {
  dist: {
    type: 'folder',
    require: false,
    children: {
      regular: {
        type: 'reg',
        require: false,
        array: [/\.js\.map$/i, /\.js$/i, /\.css$/i, /\.css\.map$/i],
      },
    },
  },
  asset: {
    type: 'folder',
    require: true,
    children: {
      font: {
        type: 'folder',
        require: false,
        children: {
          regular: {
            type: 'reg',
            require: false,
            array: [/\.ttf$/i, /\.otf$/i, /\.woff2$/i],
          },
        },
      },
      img: {
        type: 'folder',
        require: false,
        children: {
          allowSubFolder: {
            type: 'folder',
            require: false,
          },
          regular: {
            type: 'reg',
            require: false,
            array: [/\.png$/i, /\.gif$/i, /\.jpg$/i, /\.svg$/i],
          },
        },
      },
      music: {
        type: 'folder',
        require: false,
        children: {
          regular: {
            type: 'reg',
            require: false,
            array: [/\.mp3$/i],
          },
        },
      },
    },
  },
  src: {
    type: 'folder',
    require: true,
    children: {
      js: {
        type: 'folder',
        require: true,
        children: {
          'app.js': {
            type: 'file',
            require: true,
          },
          'vendor.js': {
            type: 'file',
            require: false,
          },
          common: {
            type: 'folder',
            require: true,
            children: {
              regular: {
                type: 'reg',
                require: false,
                array: [/\.js$/i, /\.json$/i],
              },
            },
          },
          component: {
            type: 'folder',
            require: false,
            children: {
              regular: {
                type: 'reg',
                require: false,
                array: [/\.js$/i],
              },
            },
          },
          page: {
            type: 'folder',
            require: false,
            children: {
              regular: {
                type: 'reg',
                require: false,
                array: [/\.js$/i],
              },
            },
          },
        },
      },
      scss: {
        type: 'folder',
        require: true,
        children: {
          'app.scss': {
            type: 'file',
            require: true,
          },
          'vendor.scss': {
            type: 'file',
            require: false,
          },
          base: {
            type: 'folder',
            require: false,
            children: {
              'function.scss': {
                type: 'file',
                require: true,
              },
              'iconfont.scss': {
                type: 'file',
                require: false,
              },
              'mixin.scss': {
                type: 'file',
                require: true,
              },
              'variable.scss': {
                type: 'file',
                require: true,
              },
              regular: {
                type: 'reg',
                require: false,
                array: [/\.scss$/i],
              },
            },
          },
          common: {
            type: 'folder',
            require: false,
            children: {
              regular: {
                type: 'reg',
                require: false,
                array: [/\.scss$/i],
              },
            },
          },
          vendor: {
            type: 'folder',
            require: false,
            children: {
              regular: {
                type: 'reg',
                require: false,
                array: [/\.scss$/i],
              },
            },
          },
          component: {
            type: 'folder',
            require: false,
            children: {
              regular: {
                type: 'reg',
                require: false,
                array: [/\.scss$/i],
              },
            },
          },
          patch: {
            type: 'folder',
            require: false,
            children: {
              regular: {
                type: 'reg',
                require: false,
                array: [/\.scss$/i],
              },
            },
          },
          page: {
            type: 'folder',
            require: false,
            children: {
              regular: {
                type: 'reg',
                require: false,
                array: [/\.scss$/i],
              },
            },
          },
        },
      },
      vendor: {
        type: 'folder',
        require: false,
      },
      tpl: {
        type: 'folder',
        require: false,
      },
    },
  },
  'index.html': {
    type: 'file',
    require: false,
  },
  'package.json': {
    type: 'file',
    require: true,
  },
  'package-lock.json': {
    type: 'file',
    require: false,
  },
  'README.md': {
    type: 'file',
    require: false,
  },
  'favicon.ico': {
    type: 'file',
    require: false,
  },
  'build.config.js': {
    type: 'file',
    require: true,
  },
  'scripts.tpl': {
    type: 'file',
    require: false,
  },
  'styles.tpl': {
    type: 'file',
    require: false,
  },
  'index.tpl': {
    type: 'file',
    require: false,
  },
  'check.config.js': {
    type: 'file',
    require: false,
  },
};

let checkConfig4Vue = {
  dist: {
    type: 'folder',
    require: false,
    children: {
      regular: {
        type: 'reg',
        require: false,
        array: [/\.js\.map$/i, /\.js$/i, /\.css$/i, /\.css\.map$/i],
      },
    },
  },
  asset: {
    type: 'folder',
    require: true,
    children: {
      font: {
        type: 'folder',
        require: false,
        children: {
          regular: {
            type: 'reg',
            require: false,
            array: [/\.ttf$/i, /\.otf$/i],
          },
        },
      },
      img: {
        type: 'folder',
        require: false,
        children: {
          allowSubFolder: {
            type: 'folder',
            require: false,
          },
          regular: {
            type: 'reg',
            require: false,
            array: [/\.png$/i, /\.gif$/i, /\.jpg$/i, /\.svg$/i],
          },
        },
      },
      music: {
        type: 'folder',
        require: false,
        children: {
          regular: {
            type: 'reg',
            require: false,
            array: [/\.mp3$/i],
          },
        },
      },
    },
  },
  src: {
    type: 'folder',
    require: true,
    children: {
      js: {
        type: 'folder',
        require: true,
        children: {
          'app.js': {
            type: 'file',
            require: true,
          },
          'vendor.js': {
            type: 'file',
            require: false,
          },
          common: {
            type: 'folder',
            require: true,
            children: {
              regular: {
                type: 'reg',
                require: false,
                array: [/\.js$/i, /\.json$/i],
              },
            },
          },
          'v-component': {
            type: 'folder',
            require: true,
            children: {
              dumb: {
                type: 'folder',
                require: false,
                children: {
                  regular: {
                    type: 'reg',
                    require: false,
                    array: [/\.js$/i, /\.vue$/i],
                  },
                },
              },
              mixin: {
                type: 'folder',
                require: false,
                children: {
                  regular: {
                    type: 'reg',
                    require: false,
                    array: [/\.js$/i, /\.vue$/i],
                  },
                },
              },
              page: {
                type: 'folder',
                require: true,
                children: {
                  regular: {
                    type: 'reg',
                    require: false,
                    array: [/\.js$/i, /\.vue$/i],
                  },
                },
              },
              smart: {
                type: 'folder',
                require: false,
                children: {
                  regular: {
                    type: 'reg',
                    require: false,
                    array: [/\.js$/i, /\.vue$/i],
                  },
                },
              },
            },
          },
          'v-directive': {
            type: 'folder',
            require: false,
            children: {
              regular: {
                type: 'reg',
                require: false,
                array: [/\.js$/i, /\.vue$/i],
              },
            },
          },
          'v-filter': {
            type: 'folder',
            require: false,
            children: {
              regular: {
                type: 'reg',
                require: false,
                array: [/\.js$/i, /\.vue$/i],
              },
            },
          },
          'v-plugin': {
            type: 'folder',
            require: false,
            children: {
              regular: {
                type: 'reg',
                require: false,
                array: [/\.js$/i, /\.vue$/i],
              },
            },
          },
          'v-mixin': {
            type: 'folder',
            require: false,
            children: {
              regular: {
                type: 'reg',
                require: false,
                array: [/\.js$/i, /\.vue$/i],
              },
            },
          },
          'v-store': {
            type: 'folder',
            require: false,
            children: {
              module: {
                type: 'folder',
                require: true,
                children: {
                  regular: {
                    type: 'reg',
                    require: false,
                    array: [/\.js$/i],
                  },
                  'global.js': {
                    type: 'file',
                    require: true,
                  },
                },
              },
              plugin: {
                type: 'folder',
                require: true,
                children: {
                  regular: {
                    type: 'reg',
                    require: false,
                    array: [/\.js$/i],
                  },
                  'global.js': {
                    type: 'file',
                    require: true,
                  },
                },
              },
              'index.js': {
                type: 'file',
                require: true,
              },
              'mutation-type.js': {
                type: 'file',
                require: true,
              },
            },
          },
        },
      },
      scss: {
        type: 'folder',
        require: true,
        children: {
          'app.scss': {
            type: 'file',
            require: true,
          },
          'vendor.scss': {
            type: 'file',
            require: false,
          },
          'vue.scss': {
            type: 'file',
            require: false,
          },
          base: {
            type: 'folder',
            require: false,
            children: {
              'function.scss': {
                type: 'file',
                require: true,
              },
              'iconfont.scss': {
                type: 'file',
                require: false,
              },
              'mixin.scss': {
                type: 'file',
                require: true,
              },
              'variable.scss': {
                type: 'file',
                require: true,
              },
              regular: {
                type: 'reg',
                require: false,
                array: [/\.scss$/i],
              },
            },
          },
          common: {
            type: 'folder',
            require: false,
            children: {
              regular: {
                type: 'reg',
                require: false,
                array: [/\.scss$/i],
              },
            },
          },
          vendor: {
            type: 'folder',
            require: false,
            children: {
              regular: {
                type: 'reg',
                require: false,
                array: [/\.scss$/i],
              },
            },
          },
        },
      },
      vendor: {
        type: 'folder',
        require: false,
      },
    },
  },
  'index.html': {
    type: 'file',
    require: false,
  },
  'index.tpl': {
    type: 'file',
    require: false,
  },
  'package.json': {
    type: 'file',
    require: true,
  },
  'package-lock.json': {
    type: 'file',
    require: false,
  },
  'README.md': {
    type: 'file',
    require: false,
  },
  'favicon.ico': {
    type: 'file',
    require: false,
  },
  'build.config.js': {
    type: 'file',
    require: true,
  },
  'scripts.tpl': {
    type: 'file',
    require: false,
  },
  'styles.tpl': {
    type: 'file',
    require: false,
  },
  'check.config.js': {
    type: 'file',
    require: false,
  },
};

function formatConfig4CMS(projectPath, config) {
  projectPath = slash(projectPath);
  let pathArray = projectPath.split('/cms/')[1].split('/'),
    year = pathArray[0],
    isPC = pathArray[2].toLowerCase() === 'pc';

  if (year === '2017') {
    let srcFolderConfig = config['src'];
    delete config['src'];
    config['src-n'] = srcFolderConfig;
  }
  if (!isPC) {
    let indexFileConfig = config['index.html'];
    delete config['index.html'];
    config['wapindex.html'] = indexFileConfig;
  }

  delete config['package.json'];
  delete config['build.config.js'];

  config['_scripts.html'] = {
    type: 'file',
    require: false,
  };
  config['_styles.html'] = {
    type: 'file',
    require: false,
  };
  config['regular'] = {
    type: 'reg',
    require: false,
    array: [/\.html$/],
  };
}

function doCheck(projectPath) {
  if (!fs.existsSync(checkConfig.projectPath)) {
    util.error('项目目录不存在!');
  }
  if (checkConfig.isACT) {
    formatConfig4CMS(projectPath, checkConfig4Normal);
    formatConfig4CMS(projectPath, checkConfig4Vue);
  }

  let normalMsgHeader =
      '\n\n====== Normal 类型项目的目录检测错误信息, 如果当前项目不属于 Normal 请忽略以下信息 ======\n\n',
    vueMsgHeader = '\n\n====== Vue 类型项目的目录检测错误信息, 如果当前项目不属于 Vue 请忽略以下信息 ======\n\n';

  let errMsgs4Normal = checkByConfig(projectPath, checkConfig4Normal),
    errMsgs4Vue = checkByConfig(projectPath, checkConfig4Vue);

  errMsgs4Normal.unshift(normalMsgHeader);
  errMsgs4Vue.unshift(vueMsgHeader);

  if (errMsgs4Normal.length > 1 && errMsgs4Vue.length > 1) {
    errMsg = 'Check directory failed!';
    console.log(chalk.red(errMsgs4Normal.concat(errMsgs4Vue).join('\n')));
  }
}

function checkByConfig(projectPath, config) {
  let files = fs.existsSync(projectPath) ? fs.readdirSync(projectPath) : [],
    errMsgs = [],
    config4Require = filterConfigByRequire(config, true),
    config4UnRequire = filterConfigByRequire(config, false);

  // don't deal with hidden files/folders
  files = files.filter(file => {
    return file.indexOf('.') !== 0 && file !== 'node_modules';
  });

  // check files for require
  for (let key in config4Require) {
    let params = {
      name: key,
      info: config4Require[key],
      path: projectPath,
      files: files,
    };

    if (!isInFiles(params)) {
      errMsgs.push(`Lost ${params.info.type} [${key}] in the path [${projectPath}]`);
    } else {
      files.splice(files.indexOf(key), 1);
      let filePath = path.join(projectPath, key);
      !isComplyFileSize(params) && errMsgs.push(`Exceeded file size limit for [${filePath}]`);
      !isComplyFileLineNum(params) && errMsgs.push(`Exceeded the maximum number of lines for [${filePath}]`);
    }

    if (params.info.children) {
      let currPath = path.join(projectPath, key),
        errMsgs4Child = checkByConfig(currPath, params.info.children);

      if (errMsgs4Child.length > 0) {
        errMsgs = errMsgs.concat(errMsgs4Child);
      }
    }
  }

  // check files for not require
  for (let index in files) {
    let file = files[index];
    let filePath = path.join(projectPath, file);
    let params = {
      path: projectPath,
      name: file,
      config: config4UnRequire,
    };
    if (!isInConfig(params)) {
      errMsgs.push(`The [${file}] cannot exist in [${projectPath}]`);
    } else if (!isComplyName(file)) {
      errMsgs.push(`Incorrect naming for [${filePath}]`);
    } else if (!isComplyFileSize(params)) {
      errMsgs.push(`Exceeded file size limit for [${filePath}]`);
    } else if (!isComplyFileLineNum(params)) {
      errMsgs.push(`Exceeded the maximum number of lines for [${filePath}]`);
    }

    if (params.config[file] && params.config[file].children) {
      let currPath = path.join(projectPath, file);
      let errMsgs4Child = checkByConfig(currPath, params.config[file].children);

      if (errMsgs4Child.length > 0) {
        errMsgs = errMsgs.concat(errMsgs4Child);
      }
    }
  }

  return errMsgs;
}

function filterConfigByRequire(config, isRequire) {
  let result = {};
  Object.keys(config).forEach(key => {
    if (config[key].require === isRequire) {
      result[key] = config[key];
    }
  });
  return result;
}

function isComplyName(name) {
  if (name === 'README.md') {
    return true;
  }
  let reg = /^[^A-Z](([^A-Z_]+-*)+(\.[a-zA-Z0-9]+)?)$/;
  return reg.test(name);
}

function isInFiles(params) {
  let result = false,
    name = params.name,
    info = params.info,
    currPath = params.path,
    files = params.files;
  if (files.indexOf(name) > -1) {
    let fileInfo = fs.statSync(path.join(currPath, name));
    if (info.type === 'folder') {
      result = fileInfo.isDirectory();
    } else {
      result = fileInfo.isFile();
    }
  }
  return result;
}

function isComplyFileLineNum(params) {
  let filePath = slash(path.join(params.path, params.name));
  let maxLineNumber = checkConfig.fileLineLimit.maxLineNumber;
  let rangeReg = checkConfig.fileLineLimit.rangeReg;

  // vendor 目录下的文件暂不纳入行数检测
  if (filePath.indexOf('/vendor/') > -1) {
    return true;
  }

  if (rangeReg.test(filePath)) {
    return lc.countFromFile(filePath, '--lines').lines < maxLineNumber;
  } else {
    return true;
  }
}

function isComplyFileSize(params) {
  let currPath = slash(path.join(params.path, params.name)),
    fileInfo = fs.statSync(currPath);
  if (currPath.indexOf('/dist/') > -1 || currPath.indexOf('package-lock.json') > -1) {
    return true;
  }
  let config4FileSizeLimit = checkConfig.fileSizeLimit || {};
  let fileExtName = path.extname(currPath).replace(/./, '');
  let fileSizeLimit = config4FileSizeLimit.default;
  if (fileExtName) {
    fileSizeLimit = config4FileSizeLimit[fileExtName] || config4FileSizeLimit.default;
  }
  // 对于 min.js 和 min.css 结尾的文件, 大小限制为 300kb
  if (/\.min\.(js|css)$/.test(currPath)) {
    fileSizeLimit = 300;
  }
  return fileInfo.size < fileSizeLimit * 1024;
}

function isInConfig(params) {
  let result = false,
    currPath = params.path,
    name = params.name,
    config = params.config,
    info = config[name];
  if (fs.existsSync(currPath)) {
    let fileInfo = fs.statSync(path.join(currPath, name));
    if (info) {
      if (info.type === 'folder') {
        result = fileInfo.isDirectory();
      } else {
        result = fileInfo.isFile();
      }
    }
    if (!result && fileInfo.isFile() && config.regular) {
      let regArray = config.regular.array;
      for (let index in regArray) {
        let matchReg = regArray[index];
        if (matchReg.test(name)) {
          result = true;
          break;
        }
      }
    }
    if (!result && fileInfo.isDirectory() && config.allowSubFolder) {
      result = true;
    }
  }
  return result;
}

doCheck(checkConfig.projectPath);

util.error(errMsg);

console.log('fe-check: 目录组织规范检测通过！');
