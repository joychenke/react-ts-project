# 学习笔记

### 项目几个文件的作用

```
manifest.json 配置 pwa
robots.txt  想让搜索引擎如何对待我们
tsconfig.json 配置ts
```

### 用 premitter，commitlint 规范化工程

#### 安装 premitter 使用

1. 安装 prettier， `yarn add --dev --exact prettier`
2. 代码每次提交之前，自动格式化。项目安装 `npx mrm lint-staged` ，本地 package.json 中生成 husky 和 lint-staged，pre-commit 的时候，运行 lint-staged，即 prettier --write 命令
3. 由于是 ts 项目，在 lint-staged 中添加 ts 和 tsx 两种类型
4. 由于项目自动配置了 eslint，eslint 和 prettier 会冲突，安装`eslint-config-prettier`，命令 `yarn add eslint-config-prettier -D`,在 eslintConfig 属性中添加 prettier。完成前面 4 个步骤，以后每次提交代码，prettier 都会自动运行.

#### 安装 commitlint

1. 官网地址：https://github.com/conventional-changelog/commitlint，本地安装: `npm install --save-dev @commitlint/config-conventional @commitlint/cli`
2. 在项目终端里贴上 `echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js`
3. 在 package.json 的 hooks 属性加上 `"commit-msg": "commitlint -E HUSKY_GIT_PARAMS"`
4. 提交的格式类似`ci: add commitlint` ，注意空格，冒号前面支持的类型，去官网看 https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional

### 对比常见的 mock 方案，配置 json-server

#### 在项目中安装 json-server

1. `npm i json-server -D` 安装 `json-server`
2. 新建 `__json_server_mock__` 文件，里面新增`db.json`文件
3. 在 package.json 的 scripts 中添加 json-server 命令, `"json-server": "json-server __json_server_mock__/db.json --watch"`
4. 项目里，如果只有函数组件，不需要再手动引入 React 了，`plugin-transform-react-jsx`z 做了升级，并且 create-react-app 4.0 后，对升级的功能做了默认的支持

#### Mock 相关的知识点

1. rest api 的意思：uri 代表资源/对象，method 代表行为

```javascript
GET / tickets; // 列表 (获取ticket列表)
GET / tickets / 12; // 详情 (获取id为12的ticket详情)
POST / tickets; // 增加 (增加ticket列表)
PUT / tickets / 12; // 替换(将id为12的ticket替换为新的)
PATCH / tickets / 12; // 修改(局部修改id为12的ticket部分内容)
DELETE / tickets / 12; // 删除(删除id为12的ticket)
```

2. put 和 patch 的区别：

- put 是全局更新， 在更新的时候，需要提供完整的资源对象，否则，不提供的字段会被清空
- patch 是局部更新，后端接收到后，仅仅更新接收到的字段

3. ajax 和 fetch 的区别：

- 参考的文档 (ajax,jquery,fetch 分析)https://zhuanlan.zhihu.com/p/24594294
- ajax 写一个 post 请求,需要用到的方法,XMLHttpRequest, ActiveXObject(兼容 IE 用), onreadystatechange, open, setRequestHeader, send, readyState, status,responseText
- fetch 的兼容性不好，应用 polyfill 可以解决兼容性问题。用 fetch 做接口请求的一个例子：

```javascript
fetch("/api")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.log("Oops, error: ", error));
```
