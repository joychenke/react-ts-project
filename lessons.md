# 学习笔记

## 2021 年 3 月 7 日

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
