# vuepress搭建技术博客指南

## 首先安装vuepress
```sh
yarn add vuepress -g  或者： npm i vuepress -g

# 创建项目目录
mkdir vuepress-starter
cd vuepress-starter

# 新建一个 docs 文件夹
mkdir docs

# 新建一个 markdown 文件 README.md是项目的首页对应的markdown文件
echo '# Hello VuePress!' > docs/README.md

# 开始写作
npx vuepress dev docs

```

经过上述步骤后vuepress将启动一个本地的node服务，打开浏览器，根据提示输入http://localhost:8080， 端口号默认8080，可以看到README.md文件渲染出来的Hello VuePress!几个字。

<br/>

下一步，还没有package.json文件，使用npm init -y快速生成一个package.json文件

```sh
npm init -y
```

接着，在 package.json 里的scripts选项加以下脚本:

```json
"scripts": {
    "docs:dev": "vuepress dev docs",
    "docs:build": "vuepress build docs"
  }
```

运行以下命令，启动本地服务，然后就可以开始本地写作了

```sh
yarn docs:dev # 或者：npm run docs:dev
```

要生成静态的 HTML 文件用于部署的话，运行：

```sh
yarn docs:build # 或者：npm run docs:build
```

默认情况下，文件将会被生成在 .vuepress/dist，当然，你也可以通过 .vuepress/config.js 中的 dest 字段来修改，生成的文件可以部署到任意的静态文件服务器上， 部署的问题稍后再讲。

<br/>

目前为止我们只是搭建了最基本的环境，vuepress还提供了丰富的配置项，下面我们增加一些简单的配置

```sh
mkdir .vuepress

```

在.vuepress文件夹下创建一个config.js文件，vuepress在运行时会将它作为配置文件。现在项目结构是这样：

```
.
├─ docs
│  ├─ README.md
│  └─ .vuepress
│     └─ config.js
└─ package.json
```

config.js，它应该导出一个 JavaScript 对象：

```js
module.exports = {
  title: 'Hello VuePress',
  description: 'Just playing around'
}
```
config.js有几个重要配置项themeConfig，plugins， head，分别用于定义主体风格，插件，网页head，具体的配置项非常多，themeConfig中我们可以定义头部导航。侧边栏导航，仓库链接等信息，详情参考 [官方指南](https://www.vuepress.cn/guide/)


## 目录结构

推荐的目录结构如下

```
.
├── docs
│   ├── .vuepress (可选的)
│   │   ├── components (可选的)
│   │   ├── theme (可选的)
│   │   │   └── Layout.vue
│   │   ├── public (可选的)
│   │   ├── styles (可选的)
│   │   │   ├── index.styl
│   │   │   └── palette.styl
│   │   ├── templates (可选的, 谨慎配置)
│   │   │   ├── dev.html
│   │   │   └── ssr.html
│   │   ├── config.js (可选的)
│   │   └── enhanceApp.js (可选的) 客户端应用的增强
│   │ 
│   ├── README.md
│   ├── guide
│   │   └── README.md
│   └── config.md
│ 
└── package.json

```
正常情况下，.vuepress文件夹下的可选的一些配置大部分都不需要添加，对于上述的目录结构，默认页面路由地址如下：

| 文件的相对路径 | 页面路由地址 |
| ------ | ------ | ------ |
| /README.md | / |
| /guide/README.md | /guide/ |
| /config.md | /config.html |

## 部署

### 部署到github pages
<br/>
1. 在 docs/.vuepress/config.js 中设置正确的 base

<br/>

- 如果发布到`https://<USERNAME>.github.io/`, 则可以省略这一步，因为base默认即是`/`。

<br/>

- 如果发布到`https://<USERNAME>.github.io/<REPO>/`（也就是说你的仓库在`https://github.com/<USERNAME>/<REPO>`），则将base设置为`/<REPO>/`。

<br/>

比如本博客的仓库地址为:`https://github.com/blueprint1453/blog`, 那么base设置为`/blog/`。

<br/>

2. 项目中，创建根目录一个如下的 deploy.sh 文件（请自行判断去掉高亮行的注释）:

```sh
#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run docs:build

# 进入生成的文件夹
cd docs/.vuepress/dist

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# 如果发布到 https://<USERNAME>.github.io/<REPO> 以下两种中任意一种
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages
# git push -f https://github.com/<USERNAME>/<REPO>.git master:gh-pages
cd -
```

这样每次你就可以运行以上脚本发布到github pages上了

### github actions

<br/>

除了上述方式，还可以使用github actions去实现自动化部署，关于github actions, 可以查看阮一峰写的一篇文章 [GitHub Actions 入门教程](http://www.ruanyifeng.com/blog/2019/09/getting-started-with-github-actions.html), 假设我们的整个项目在github已经建好了仓库，在github仓库中，找到actions选项，进入后点击New workflow, 再点击set up this workflow

<br/>

在编辑器中加入以下内容
```
name:  Deploy Blog

on:
  push:
    branches:
      - master

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout 🛎️
        uses: actions/checkout@master # If you're using actions/checkout@v2 you must set persist-credentials to false in most cases for the deployment to work correctly.

      - name: Install and Build 🔧 # This example project is built using npm and outputs the result to the 'build' folder. Replace with the commands required to build your project, or remove this step entirely if your site is pre-built.
        run: 
          sudo yarn add vuepress -g &&  yarn && sudo yarn build
      - name: Deploy 🚀
        uses: JamesIves/github-pages-deploy-action@3.5.7
        with:
          GITHUB_TOKEN: ${{ secrets.ACCESS_TOKEN }}
          BRANCH: gh-pages # The branch the action should deploy to.
          FOLDER: docs/.vuepress/dist # The folder the action should deploy.
```

遇到的一些坑：
1. run字段中 开始是按照从上到下依次写的，

```
run: 
yarn add vuepress -g
yarn
yarn build
```
上述步骤意图是按顺序执行，并不是并行的，但是在后面的执行过程确老是并行执行了
<br/>
所以改成了以下方式

```
run: 
yarn add vuepress -g &&  yarn && yarn build
```
这样就真的可以按顺序执行了。
<br/>
但是另一个问题又来了，有时会出现权限问题
<br/>
只能继续做绝，有报错的加上sudo，这样就解决了权限问题

```
run: 
sudo yarn add vuepress -g &&  yarn && sudo yarn build
```