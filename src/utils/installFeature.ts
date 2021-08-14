/**
 * 安装报的方法
 */
import * as shell from 'shelljs'
import { writeFileSync } from 'fs'
import { red } from 'chalk'

import { PackageJSON, printMsg, readJsonFile, writeJsonFile } from './common'

/**
 * 安装ESLint
 */
function installESLint(): void {
  shell.exec(
    'npm i eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-prettier -D'
  )
  // 添加 eslintrc.json
  const eslintrc = `{
    "env": {
      "es2021": true,
      "node": true,
      "browser": true,
    },
    "extends": [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:prettier/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
      "ecmaVersion": 12,
      "sourceType": "module"
    },
    "plugins": [
      "@typescript-eslint"
      "prettier" //  eslint 会使用pretter的规则对代码格式化
    ],
    "rules": {
      "prettier/prettier": 2, // 对于不符合prettier规范的写法，eslint会提示报错
      "spaced-comment": [2, "always"] // 注释后面必须写两个空格
    }
  }`
  try {
    writeFileSync('./.eslintrc.json', eslintrc, { encoding: 'utf-8' })
  } catch (err) {
    printMsg(`${red('Failed to write .eslintrc.json file content')}`)
    printMsg(`${red('Please add the following content in .eslintrc.json')}`)
    printMsg(`${red(eslintrc)}`)
  }

  // 修改package.json
  const packageJson = readJsonFile<PackageJSON>('./package.json')
  packageJson.scripts['eslint:comment'] =
    '使用 ESLint 检查并自动修复 src 目录下所有扩展名为 .ts 的文件'
  packageJson.scripts['eslint'] = 'eslint --fix src --ext .ts --max-warnings=0'
  writeJsonFile<PackageJSON>('./package.json', packageJson)
}

/**
 * 安装 Prettier
 */
function installPrettier(): void {
  // 安装 prettier 和 prettier与ESlint的插件
  shell.exec('npm i prettier -D')
  // 添加 prettier.json
  const prettierrc = `{
    // 一行最多 80 字符
    "printWidth": 80,
    // 使用 2 个空格缩进
    "tabWidth": 2,
    // 不使用 tab 缩进，而使用空格
    "useTabs": false,
    // 行尾需要有分号
    "semi": false,
    // 使用单引号代替双引号
    "singleQuote": true,
    // 对象的 key 仅在必要时用引号
    "quoteProps": "as-needed",
    // jsx 不使用单引号，而使用双引号
    "jsxSingleQuote": false,
    // 末尾不实用逗号
    "trailingComma": "none",
    // 大括号内的首尾需要空格 { foo: bar }
    "bracketSpacing": true,
    // jsx 标签的反尖括号需要换行
    "jsxBracketSameLine": true,
    // 箭头函数，只有一个参数的时候，也需要括号
    "arrowParens": "always",
    // 不需要写文件开头的 @prettier
    "requirePragma": false,
    // 不需要自动在文件开头插入 @prettier
    "insertPragma": false,
    // 使用默认的折行标准
    proseWrap: 'preserve',
    // 根据显示样式决定 html 要不要折行
    htmlWhitespaceSensitivity: 'css',
    // 换行符使用 lf
    endOfLine: 'lf'
  }`
  try {
    writeFileSync('./.prettierrc.json', prettierrc, { encoding: 'utf-8' })
  } catch (err) {
    printMsg(`${red('Failed to write .prettierrc.json file content')}`)
    printMsg(`${red('Please add the following content in .prettierrc.json')}`)
    printMsg(`${red(prettierrc)}`)
  }

  // 修改package.json
  const packageJson = readJsonFile<PackageJSON>('./package.json')
  packageJson.scripts['prettier:comment'] =
    '自动格式化 src 目录下的所有 .ts 文件'
  packageJson.scripts['prettier'] = 'prettier --write "src/**/*.ts"'
  writeJsonFile<PackageJSON>('./package.json', packageJson)
}

/**
 * 安装 CZ，规范 git 提交信息
 */
function installCZ(): void {
  shell.exec(
    'npx commitizen init cz-conventional-changelog --save --save-exact'
  )
  shell.exec('npm i @commitlint/cli @commitlint/config-conventional -D')
  // 添加 commitlint.config.js
  const commitlint = `module.exports = {
    extends: ['@commitlint/config-conventional']
  }`
  try {
    writeFileSync('./commitlint.config.js', commitlint, { encoding: 'utf-8' })
  } catch (err) {
    printMsg(`${red('Failed to write .commitlint.config.js file content')}`)
    printMsg(
      `${red('Please add the following content in .commitlint.config.js')}`
    )
    printMsg(`${red(commitlint)}`)
  }

  // 改写 package.json
  const packageJson = readJsonFile<PackageJSON>('./package.json')
  packageJson.scripts['commit:comment'] = '引导设置规范化的提交信息'
  packageJson.scripts['commit'] = 'cz'
  writeJsonFile<PackageJSON>('./package.json', packageJson)
}

/**
 * 安装 husky 和 lint-staged，以实现 git commit 时自动化校验
 * @param hooks，需要自动执行的钩子
 * @param lintStaged，需要钩子运行的命令
 */
function installHusky(
  hooks: { [key: string]: string },
  lintStaged: Array<string>
): void {
  // 初始化 git 仓库
  shell.exec('git init')
  // 在安装 husky 和 lint-staged
  shell.exec('npm i husky lint-staged -D')
  // 设置 package.json
  const packageJson = readJsonFile<PackageJSON>('./package.json')
  packageJson['lint-staged'] = {
    '*.ts': lintStaged.map((item) => `npm run ${item}`)
  }
  writeJsonFile<PackageJSON>('./package.json', packageJson)
  shell.exec(
    'npx husky install && npx husky add .husky/pre-commit "npx lint-staged"'
  )
}

/**
 * 安装构建工具，目前主要用于小项目，所以使用 typescript 原生的构建功能即可
 * @param feature 已安装的包
 */
function installBuild(feature: Array<string>): void {
  // 设置 package.json
  const packageJson = readJsonFile<PackageJSON>('./package.json')
  packageJson.scripts['build:comment'] = '构建'
  let order = ''
  if (feature.includes('ESLint')) {
    order += 'npm run eslint'
  }
  if (feature.includes('Prettier')) {
    order += ' && npm run prettier'
  }
  order += ' && rm -rf lib && tsc --build'
  packageJson.scripts['build'] = order
  writeJsonFile<PackageJSON>('./package.json', packageJson)
}

export default {
  installESLint,
  installPrettier,
  installCZ,
  installHusky,
  installBuild
}
