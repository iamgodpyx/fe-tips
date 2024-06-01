#!/bin/bash

# 定义文件路径和内容
FILE_PATH=".eslintrc.js"
CONTENT=$(cat <<EOF
module.exports = {
  root: true,
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020
  },
  env: {
    browser: true,
    node: true
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript/recommended',
    '@unocss',
    'plugin:prettier/recommended'
  ],
  rules: {
    // 命名规范
    '@typescript-eslint/naming-convention': [
      1,
      {
        selector: 'interface',
        format: ['PascalCase']
      },
      {
        selector: 'enum',
        format: ['PascalCase']
      },
      {
        selector: 'typeAlias',
        format: ['PascalCase']
      },
      {
        selector: 'enumMember',
        format: ['PascalCase']
      }
    ],
    'arrow-parens': 0,
    'space-before-function-paren': 0,
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: {
          max: 5
        },
        multiline: {
          max: 1
        }
      }
    ],
    'vue/html-indent': ['error', 2, {}],
    '@typescript-eslint/no-var-requires': 'off',
    camelcase: 'off',
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'vue/multi-word-component-names': 'warn'
  },
  // js相关
  overrides: [
    {
      files: ['*.js', '*.jsx'],
      extends: ['eslint:recommended', 'plugin:prettier/recommended']
    }
  ]
}
EOF
)

# 检查文件是否存在
if [ ! -f "$FILE_PATH" ]; then
    # 文件不存在，创建并写入内容
    echo "$CONTENT" > "$FILE_PATH"
    echo "文件 $FILE_PATH 已创建并写入内容。"
else
    # 文件存在，替换内容
    echo "$CONTENT" > "$FILE_PATH"
    echo "文件 $FILE_PATH 的内容已替换。"
fi


# 定义文件路径
EXTENSIONS_FILE=".vscode/extensions.json"
SETTINGS_FILE=".vscode/settings.json"

# 定义文件内容
EXTENSIONS_CONTENT=$(cat <<EOF
{
  "recommendations": [
    "antfu.unocss",
    "shardulm94.trailing-spaces",
    "sysoev.language-stylus",
    "pagnkelly.mpx",
    "oderwat.indent-rainbow",
    "kisstkondoros.vscode-gutter-preview",
    "naumovs.color-highlight",
    "formulahendry.auto-close-tag",
    "steoates.autoimport",
    "formulahendry.auto-rename-tag",
    "ms-ceintl.vscode-language-pack-zh-hans",
    "streetsidesoftware.code-spell-checker",
    "oouo-diogo-perdigao.docthis",
    "dbaeumer.vscode-eslint",
    "maggie.eslint-rules-zh-plugin",
    "donjayamanne.githistory",
    "felipecaputo.git-project-manager",
    "eamodio.gitlens",
    "wix.vscode-import-cost",
    "esbenp.prettier-vscode",
    "burkeholland.simple-react-snippets",
    "stylelint.vscode-stylelint",
    "gruntfuggly.todo-tree",
    "pflannery.vscode-versionlens",
    "vscode-icons-team.vscode-icons"
  ]
}
EOF
)

SETTINGS_CONTENT=$(cat <<EOF
{
  // ⽂件相关
  "files.eol": "\n",
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "files.associations": {
    // json + comment
    ".code-workspace": "jsonc",
    ".babelrc": "jsonc",
    ".eslintrc": "jsonc",
    ".eslintrc*.json": "jsonc",
    ".stylelintrc": "jsonc",
    "stylelintrc": "jsonc",
    ".htmlhintrc": "jsonc",
    "htmlhintrc": "jsonc",
    "Procfile*": "shellscript",
    "README": "markdown",
    "*.css": "postcss"
  },
  "files.exclude": {
    "**/*/adapters/**/index.ts": true,
    "**/*/adapters/**/index.js": true
  },
  // 搜索相关
  "search.useIgnoreFiles": true,
  "search.exclude": {
    "**/build": true,
    "**/output": true,
    "**/dist": true,
    "**/yarn.lock": true,
    "**/package-lock.json": true,
    "**/*.log": true,
    "**/*.pid": true,
    "**/.git": true,
    "**/node_modules": true
  },
  // editor
  "editor.tabSize": 2, // 缩进宽度，配合prettier缩进
  "editor.defaultFormatter": "esbenp.prettier-vscode", // 默认prettier格式化
  "editor.formatOnSave": true,
  // ⽂件格式化/lint配置
  // 保存后的⾏为分两步：第⼀步通过editor.codeActionsOnSave调⽤source.fixAll进⾏修复，第⼆步通过editor.defaultFormatter进⾏格式化
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit"
    }
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit"
    }
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit"
    }
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit"
    }
  },
  "[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit",
      "source.fixAll.stylelint": "explicit"
    }
  },
  "[css]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    // 单独开启formatOnSave⽆效
    // "editor.formatOnSave": true
    "editor.codeActionsOnSave": {
      "source.fixAll.stylelint": "explicit"
    }
  },
  "[postcss]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": {
      "source.fixAll.stylelint": "explicit"
    }
  },
  "[less]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": {
      "source.fixAll.stylelint": "explicit"
    }
  },
  // eslint相关
  // eslint失效主要原因：所添加的eslint规则⽆效/错误，可查看eslint⽇志
  "eslint.format.enable": true,
  "eslint.alwaysShowStatus": true,
  "eslint.probe": ["javascript", "javascriptreact", "typescript", "typescriptreact", "vue"],
  "typescript.tsdk": "node_modules/typescript/lib",
  // 插件stlylint配置
  "stylelint.enable": true,
  "stylelint.snippet": ["css", "less", "postcss"],
  "stylelint.validate": ["css", "less", "postcss", "vue", "stylus"],
}
EOF
)

# 函数来创建或替换文件内容
create_or_replace_file() {
    local file_path=$1
    local content=$2

    # 检查文件目录是否存在，如果不存在则创建
    dir=$(dirname "$file_path")
    [ ! -d "$dir" ] && mkdir -p "$dir"

    # 创建或替换文件内容
    echo "$content" > "$file_path"
    echo "文件 $file_path 已被创建或内容已被替换。"
}

# 执行创建或替换操作
create_or_replace_file "$EXTENSIONS_FILE" "$EXTENSIONS_CONTENT"
create_or_replace_file "$SETTINGS_FILE" "$SETTINGS_CONTENT"


# 定义目标文件路径
PRETTIERRC_FILE=".prettierrc.js"

# 定义要写入文件的内容
CONTENT=$(cat <<EOF
module.exports = {
  arrowParens: 'avoid',
  bracketSpacing: true,
  printWidth: 120,
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'none',
  useTabs: false
}
EOF
)

# 检查文件是否存在
if [ ! -f "$PRETTIERRC_FILE" ]; then
    # 文件不存在，创建并写入内容
    echo "$CONTENT" > "$PRETTIERRC_FILE"
    echo "文件 $PRETTIERRC_FILE 已创建并写入内容。"
else
    # 文件存在，替换内容
    echo "$CONTENT" > "$PRETTIERRC_FILE"
    echo "文件 $PRETTIERRC_FILE 的内容已被替换。"
fi

# 定义目标文件路径
STYLELINT_CONFIG_FILE="stylelint.config.js"

# 定义要写入文件的内容
CONTENT=$(cat <<EOF
module.exports = {
  extends: ['stylelint-stylus/standard', 'stylelint-config-rational-order'],
  overrides: [
    // 扫描.vue/html文件中的<style>标签内的样式
    {
      files: ['**/*.{vue,html}'],
      customSyntax: 'postcss-html'
    }
  ],
  rules: {}
}
EOF
)

# 检查文件是否存在
if [ ! -f "$STYLELINT_CONFIG_FILE" ]; then
    # 文件不存在，创建并写入内容
    echo "$CONTENT" > "$STYLELINT_CONFIG_FILE"
    echo "文件 $STYLELINT_CONFIG_FILE 已创建并写入内容。"
else
    # 文件存在，替换内容
    echo "$CONTENT" > "$STYLELINT_CONFIG_FILE"
    echo "文件 $STYLELINT_CONFIG_FILE 的内容已被替换。"
fi

# 检查.editorconfig文件是否存在
if [ -f ".editorconfig" ]; then
    # 如果存在，则删除它
    rm -f ".editorconfig"
    echo ".editorconfig文件已删除."
else
    # 如果不存在，则打印消息
    echo ".editorconfig文件不存在."
fi

npm install @typescript-eslint/eslint-plugin@7.0.0 @typescript-eslint/parser@7.0.0 @unocss/eslint-config@0.60.3  @vue/cli-plugin-eslint@5.0.0  @vue/eslint-config-typescript@13.0.0  eslint@8.56.0  eslint-config-prettier@9.1.0  eslint-plugin-prettier@5.1.3  postcss-html@1.7.0  prettier@3.2.5  stylelint@16.0.0  stylelint-order@6.0.0  stylelint-stylus@1.0.0  -D --legacy-peer-deps


node create_lint.js
