module.exports = {
  projectPath: __dirname,
  repo: '',
  isACT: false,
  feCheckVersion: false,
  feLintVersion: false,
  feBuildVersion: false,
  feCoreVersion: false,
  fileLineLimit: {
    maxLineNumber: 1000,
    rangeReg: /\.(js|vue|css|scss)$/,
  },
  fileSizeLimit: {
    // 设置不同扩展名文件的大小限制, 单位为 kb
    default: 200,
    jpg: 400,
    png: 400,
    mp3: 400,
    gif: 400,
    svg: 400,
  },
};
