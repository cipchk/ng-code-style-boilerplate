# Angular代码风格

## 写在前面

自身的良好编码风格只能律己，而无法律人；我喜欢 Angular 其中主要一个因素是有一整套的[工具](https://cli.angular.io/)及[风格指南](https://angular.io/guide/styleguide)，它可以极大的简化团队开发沟通成本，但是有些小缺失例如在编码风格上官方只提供 TypeScript 的部分，对于其他文件并没有一套指南以及智能化。

VSCode 是我开发 Angular 应用的首选，本文也将以此 IDE 为基准；任何提到的扩展都可以通过[市场](https://marketplace.visualstudio.com/)来获取。

Angular 应用是由组件树组成，一个组件从文件来看包含：TypeScript、HTML、Less（或其他 CSS 预处理器），其中 HTML 可能被包含至 ts 文件里。

> 当然除此之外还包含一些 JSON 文件、Bash 文件等，当此部分不在本文讨论内。

## TSLint

Angular 创建后就已经包含 `tslint.json`（它是 TSLint 的配置文件），并且所有默认规则都按官方[风格指南](https://angular.io/guide/styleguide)具体践行。

而 TSLint 的[配置](https://palantir.github.io/tslint/usage/configuration/)文件，默认使用内置预设 [tslint:recommended](https://github.com/palantir/tslint/blob/master/src/configs/recommended.ts) 版本，并在此基础上加入 Angular 质量检查工具 [codelyzer](https://github.com/mgechev/codelyzer)，所有这些规则你可以通过 [tslint rules](https://palantir.github.io/tslint/rules/)、[codelyzer](https://github.com/mgechev/codelyzer#rules-status) 找到每项规则的说明。

> 规则的写法要么是 `boolean` 类型，或者使用数组对该规则指定额外参数。

运行 `ng lint` 命令时，当你某个字符串变量使用双引号，它会提示：

```
ERROR: /src/app/app.component.ts[9, 16]: " should be '
```

我们也可以安装 [TSLint](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-tslint-plugin) 扩展让这个触发机制放在正在编码过程中实时反馈：

1. 当有不符合风格指南会出现一个绿色的波浪线，按 `command+.` > `Fix: " Should be '`
2. 通过终端 `PROBLEMS` 面板查看所有已打开文件且不符合风格指南的明细

嗯，让你按五次 `command+.` 快捷键，我一定会疯掉；TSLint 扩展支持在保存文件时自动修复，只需要在项目根目录 `.vscode/settings.json` 配置：

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  }
}
```

### 配置

`tsline.json` 有许多规则是针对任何 TypeScript，而 codelyzer 是专门针对 Angular，以下几个可能你需要认识项：

**directive-selector**、**component-selector**

限定 Direcitve、Component 的 `selector` 选择器属性值的风格，默认必须是 `app` 开头，有时候对于一些共享型组件设置不同的风格，例如一个业务型富文本框 `xx-editor`，需要在 `tslint.json` 修改配置：

```json
"directive-selector": [
  true,
  "attribute",
  ["app", "xx"],
  "camelCase"
],
"component-selector": [
  true,
  "element",
  ["app", "xx"],
  "kebab-case"
]
```

**component-class-suffix**、**directive-class-suffix**

指令或组件类名必须是写驼峰命名法来命名，且必须使用 `Component`、`Directive` 后缀；若团队可能已经习惯类似 `View` 作为后缀，则：

```json
"component-class-suffix": [true, "Component", "View"],
"directive-class-suffix": [true, "Directive", "View"]
```

**use-life-cycle-interface**

强制实现生命周期钩子接口，例如 `ngOnInit`：

```ts
export class HeroButtonComponent implements OnInit {
  ngOnInit() {
    console.log('The component is initialized');
  }
}
```

**interface-name**

[TypeScript 指导原则](https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines#names)**不建议**使用 “I” 前缀；因此建议增加：

```json
"interface-name": [true, "never-prefix"]
```

```ts
// 错误写法
export interface IUser {
  id: number;
}
// 正确写法
export interface User {
  id: number;
}
```

## 美化

TSLint 并不支持美化（虽然有几个项看起来像是在“美化”），而美化的工作取决于你采用什么 IDE，例如 VSCode 默认是使用 `4` 个空格表示一个 Tab 键。

### EditorConfig

我不建议依赖 IDE 默认的代码格式配置，所以就有一个 [.editorconfig](https://editorconfig.org/) 组织来规范一些简单的统一规范配置。

Angular 项目时也会有 `.editorconfig` 的配置，虽然有这个配置文件，但在 VSCode 也有自己的一套规范并且优先级更高，所以要想让 EditorConfig 生效需要额外安装 [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) 插件。

Editorconfig 只包含一些最基础的项，要想让代码统一风格的美化还是需要更强大的 Prettier。

### Prettier

她支持市场上许多语言，其中包含 TypeScript、HTML、Less 这一些都符合 Angular 项目的必备；你需要引入 [prettier](https://prettier.io/) 以及 VSCode [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) 扩展。

**配置**

在根目录下创建 `.prettierrc` 配置文件以及 `.prettierignore` 忽略美化配置文件；Editorconfig 选项与 Prettier 选项高度重叠，并且后者会强制替换前者，例如：

```yaml
# .editorconfig
indent_size = 4
```

```json
# .prettierrc
{
  "tabWidth": 2
}
```

表示一个 Tab 宽度使用 `2` 个空格；我个人建议 Prettier **不应该覆盖** EditorConfig 的部分，它们包含：`tabWidth`、`useTabs`、`endOfLine`。

而一个简单的 Prettier 配置差不多这样：

```json
{
  // 单行最大长度
  "printWidth": 140,
  // 语句末尾添加分号
  "semi": true,
  // 使用单引号而非双引号
  "singleQuote": true,
  // 尾逗号
  "trailingComma": "all"
}
```

如果你想忽略一些不想美化的文件，例如 Markdown，则 `. prettierignore`：

```yaml
*.md
```

同样如果你期望每次保存文件时自动美化代码，只需要在项目根目录 `.vscode/settings.json` 配置：

```json
{
  "editor.formatOnSave": true
}
```

### Prettier 与 TSLint

[Prettier 配置](https://prettier.io/docs/en/configuration.html#basic-configuration) 项会有部分与 `tslint.json` 项重复，例如：Prettier 的 `printWidth` 与 `tsline.json` 的 `max-line-length`，对于 Prettier 以她为优先，反之使用 `ng lint` 会以 `tslint.json` 优先。

这对我们来说有些困惑，TSLint 包含了一些代码”美化性"（例如：`max-line-length`），事实上，这更应该是 Prettier 的专长（[所有配置](https://prettier.io/docs/en/options.html)都跟代码美化相关）。

**tslint-config-prettier**

好在 [tslint-config-prettier](https://github.com/prettier/tslint-config-prettier) 帮助清理这些可能会产生冲突规则的解决方案：

```json
"extends": [
  "tslint:recommended",
  "tslint-config-prettier"
]
```

将 `prettier` 提供一种检查机制：

```bash
tslint-config-prettier-check ./tslint.json
```

你会发现默认的 Angular 项目中会有 `max-line-length`、`object-literal-key-quotes`、`quotemark` 三项是冲突的，我们可以关掉 `tsline.json` 这三项的配置，让 Prettier 来代替。

```json
{
  "rules": {
    "max-line-length": [false, 140],
    "object-literal-key-quotes": [false, "as-needed"],
    "quotemark": [false, "single"]
  }
}
```

### HTML

Prettier 默认会自动识别 Angular 项目并使用其引擎，当然也包含对 `template` 或 `templateUrl` 两种写法。

**printWidth**

会决定一段 HTML 超出长度范围后属性会自动换行：

```html
<h1 style="color: #f50;" data-long="long" data-long-long="long" data-long-long-long="long" data-long-long-long-long="long">
  Share Component
</h1>
```

变成：

```html
<h1
  style="color: #f50;"
  data-long="long"
  data-long-long="long"
  data-long-long-long="long"
  data-long-long-long-long="long"
>
  Share Component
</h1>
```

**htmlWhitespaceSensitivity**

空白敏感这一点同 Angular 的 `preserveWhitespaces` 类似，如果你的 Angular 项目配置了 `preserveWhitespaces: false` 则无须理会；反之设定不同的参数会影响美化的效果，若项目对空白敏感有需求可以设定为 `strict` 会强制清除空白，例如：

```html
<h1
  style="color: #f50;"
  data-long="long"
  data-long-long="long"
  data-long-long-long="long"
  data-long-long-long-long="long"
  >Share Component</h1
>
```

### Less

不管哪种 CSS 预处理器都可以使用 [stylelint](https://stylelint.io/) 作为代码检查工具，安装 [stylelint](https://www.npmjs.com/package/stylelint)、[stylelint-config-standard](https://www.npmjs.com/package/stylelint-config-standard) 并在根目录 `.stylelintrc` 配置：

```json
{
  "extends": [ "stylelint-config-standard" ],
  "plugins": [ ],
  "rules": { },
  "ignoreFiles": [ "src/assets/**/*" ]
}
```

在 `package.json` 定义一条：

```json
{
  "scripts": {
    "lint:style": "stylelint 'src/**/*.less' --syntax less"
  }
}
```

若缺少 `;` 会被收到 `Missed semicolon` 错误：

```less
:host {
  width: 100px;
  height: 100px
  display: block;
}
```

```
src/app/app.component.less
 3:11  ✖  Missed semicolon   CssSyntaxError
```

> stylelint 有自己的一套[规则](https://github.com/stylelint/stylelint/blob/master/docs/user-guide/rules.md)，而 [stylelint-config-standard](https://www.npmjs.com/package/stylelint-config-standard) 只是官方提供一种[默认规则](https://github.com/stylelint/stylelint-config-standard/blob/master/index.js)。

#### Prettier

前面提到 Prettier 也支持 Less，需要额外安装依赖包 [prettier-stylelint](https://github.com/hugomrdias/prettier-stylelint) ，并修改 `.stylelintrc` 配置：

```json
{
  "extends": [
    "stylelint-config-standard",
    "stylelint-config-prettier"
  ],
  "plugins": [ ],
  "rules": {
    "selector-type-no-unknown": [
      true,
      {
        "ignoreTypes": [
          "/^app-/"
        ]
      }
    ],
    "selector-pseudo-element-no-unknown": [
      true,
      {
        "ignorePseudoElements": [
          "ng-deep"
        ]
      }
    ]
  },
  "ignoreFiles": [ "src/assets/**/*" ]
}
```

但是依然无法生效，由于在 VSCode 下面 [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) 扩展默认并没有开启它，在 `.vscode/settings.json` 增加：

```json
{
  "prettier.stylelintIntegration": true
}
```

加上之前已经开启保存时自动修复功能，同样也适用 Less 即保存时根据 `.stylelintrc` 配置修复及美化。

#### 一些有趣的插件

**stylelint-config-rational-order**

Css 语言同一类型的相关属性可能会很多，而将这些相关属性进行分组对于维护非常有帮助，安装 [stylelint-order](https://www.npmjs.com/package/stylelint-order)、[stylelint-config-rational-order](https://www.npmjs.com/package/stylelint-config-rational-order)，并修改 `.stylelintrc` 配置：

```json
{
  "extends": [
    "stylelint-config-standard",
    "stylelint-config-rational-order",
    "stylelint-config-prettier"
  ],
  "plugins": [
    "stylelint-order"
  ],
  "rules": { },
  "ignoreFiles": [ "src/assets/**/*" ]
}
```

**stylelint-declaration-block-no-ignored-properties**

当设置 `display: inline` 内联时，此时再写 `width: 100px` 是无意义的，而该组件可以自动移除这种无效属性。

```json
{
  "plugins": [
    "stylelint-declaration-block-no-ignored-properties"
  ],
  "rules": {
    "plugin/declaration-block-no-ignored-properties": true,
  }
}
```

## 智能点

至此，涉及 Angular 所需要的代码风格运用已全部完结，这些检查我们都大多数是依靠 VSCode 编辑器的扩展辅助完成。

事实上，我们只需要增加几个命令来对整个项目进行检查，确保整个项目的代码能按所配置的风格执行。

### 命令行

```json
{
  "scripts": {
    "lint": "npm run lint:ts && npm run lint:style",
    "lint:ts": "tslint -p tsconfig.app.json -c tslint.json 'src/**/*.ts' --fix",
    "lint:style": "stylelint 'src/**/*.less' --syntax less --fix"
  }
}
```

> `tslint`、`stylelint` 命令行对应的参数说明，都可以通过上述提供官网找得到。

运行 `npm run lint` 可以对整个项目进行检查及修复；若有包含 CI 可以直接使用它。

### Git

如果可以将这一过程在向源码仓库提交代码时进行检查的话，可以在向代码仓储提交前就发现问题，需要安装 [husky](https://www.npmjs.com/package/husky)、[lint-staged](https://www.npmjs.com/package/lint-staged)，并且修改 `package.json`：

```json
{
  "lint-staged": {
    "src/**/*.ts": [
      "npm run lint:ts",
      "git add"
    ],
    "src/**/*.less": [
      "npm run lint:style",
      "git add"
    ]
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  }
}
```

当向源码仓库 Commit 时会自动先执行命令行才会 `git add`。

## 总结

当我写完最后一节时，Angular8 发布了正式版；所以我把原本准备的样板项目 [ng-code-style-boilerplate](https://github.com/cipchk/ng-code-style-boilerplate)（[f526a0c](https://github.com/cipchk/ng-code-style-boilerplate/commit/f526a0c)） 切换成 Angular8，但完全适用 Angular7.x 版本。

[Angular 风格指南](https://angular.io/guide/styleguide)（[中文版](https://angular.cn/guide/styleguide)）对于喜爱 Angular 是必读、常读的文章，它指引团队更友好的编写代码，个人良好编码风格可能律己，但无法律人，而这种风格指南可以减少无差别的团队沟通。

> 本文虽然以 Angular 的角度出发，但大部分内容同样适用 React、Vue 等。

（完）
