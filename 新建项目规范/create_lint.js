const fs = require('fs')
const path = require('path')

// 路径到package.json文件
const packageJsonPath = path.resolve(__dirname, 'package.json')

// 要添加的husky和lint-staged配置
const huskyConfig = {
  hooks: {
    'pre-commit': 'lint-staged',
    'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS'
  }
}

const lintStagedConfig = {
  './**/*': ['ls-lint'],
  './**/*.json': ['prettier --write'],
  './**/*.{js,ts,tsx,jsx}': ['prettier --write', 'eslint --fix'],
  './**/*.{vue}': ['prettier --write', 'eslint --fix', 'stylelint --fix'],
  'src/**/*.{css,styl}': ['prettier --write', 'stylelint --fix']
}

// 读取package.json文件
fs.readFile(packageJsonPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading package.json:', err)
    return
  }

  // 解析JSON数据
  let packageJson
  try {
    packageJson = JSON.parse(data)
  } catch (e) {
    console.error('Error parsing package.json:', e)
    return
  }

  // 检查并替换或添加husky和lint-staged配置
  if (!packageJson.husky) {
    packageJson.husky = huskyConfig
  } else {
    packageJson.husky.hooks = huskyConfig.hooks
  }

  if (!packageJson['lint-staged']) {
    packageJson['lint-staged'] = lintStagedConfig
  } else {
    packageJson['lint-staged'] = lintStagedConfig
  }

  // 转换回JSON字符串并写入文件
  const updatedData = JSON.stringify(packageJson, null, 2)
  fs.writeFile(packageJsonPath, updatedData, 'utf8', err => {
    if (err) {
      console.error('Error writing package.json:', err)
    } else {
      console.log('Updated package.json successfully.')
    }
  })
})
