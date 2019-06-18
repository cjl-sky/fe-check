# fe-check

## 介绍

fe-check 为前端团队的自动化检测工具

## 安装

全局安装即可

```bash
npm install -g git+ssh://git@github.com:cjl-sky/fe-check.git
```

## 使用

1、在需要使用代码构建的项目的 package.json 里添加以下 scripts 配置，fe-check 的命令行参数参考下文的 wiki 链接。

```json
"scripts": {
    "check": "fe-check --git-branch --git-tag"
}
```

2、添加检测配置文件

在项目静态目录下（与 package.json 同级）添加配置文件 `check.config.js`，最基本的 `check.config.js` 配置为：

```js
module.exports = {
  projectPath: __dirname,
};
```

## 注意事项

- 迭代时要维护好 unit test
- 提交代码后要注意 CI 平台、邮件是否有单测失败反馈
