# 面试准备

## 非技术性问题
- 为何从上家公司离职 从要出差、岗位定位偏差（要去硬件帮忙）
- 为何转行
- 为何做前端
- 期待薪资
- 对前端怎么看
- 对加班怎么看 能适度加班挺好，前提是不要让工作和生活过于失衡
- 怎么进行团队协作
- 未来职业规划/想法

## js
- 原型链和js的继承
- 事件循环
- http请求具体过程
- 性能优化
- commonjs和amd区别
- commonjs和es6 module的区别
- es6新特性

## css
- css的居中布局
- css几种整体布局
- css3动画及优势

## 浏览器
- 设备平台的兼容性问题
- 浏览器厂商的兼容性问题
- Web安全问题

## vue
- 响应式原理
- 生命周期
- 编译渲染的基本过程
- 虚拟Dom及diff算法
- vuex原理
- vue-router原理
- 组件的封装举例
- 项目遇到的问题及解决
- 

## axios
- 整体设计

## react
- react渲染原理
- react与vue的区别
- react 的生命周期
- setState何时同步和何时异步
- react组件封装举例
- hooks
- 怎么做性能优化
- 项目遇到的问题及解决
- 

## redux + react-redux
- redux的设计理念
- redux的中间件的实现
- react-redux的原理



## webpack
### 了解webpack基本配置、工作流程和基本原理
- webpack是一个模块打包器，旨在解决前端工程化中构建，打包和编译问题。在webpack中，一切皆模块，每一个文件都是一个模块，通过webpack的打包编译最后输出一个或多个chunk，chunk是代码块，代码块有一个或多个模块经过webpack处理后输出得到。
- webpack中的重要配置项有entry、output、resolve、module、plugin、devtools以及开发环境的使用的devServer等。
- 因为webpack默认可以处理的js/json模块，其他格式的模块的处理需要专门的loader处理，loader就是一个转化器，接受源文件，返回转化的结果，同一个模块可以用多个loader串行处理，最后输出的应该是一个js模块。
- webpack的插件是一个js模块，插件的原型有一个apply方法，webpack在安装插件时会注入compilier对象，这个对象拥有整个webpack的环境的所有信息，插件可以通过complier对象订阅相关的webpack事件钩子，在相应的事件钩子触发后的回调里拿到当前编译的compliation对象，步钩子还能拿到相应的 callback。
- complier对象 可以理解为webpack的总控制台，在运行 webpack 时，会自动初始化 compiler 对象，开发插件时，我们可以从 compiler 对象中拿到所有和 webpack 主环境相关的内容。
- compilation对象 对应每一次的编译任务的一个对象，含有本次编译的所有资源的相关信息，一个编译对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息。
- 事件钩子 框架的生命周期函数，在特定阶段能做特殊的逻辑处理

### webpack中babel的配置

相关文章 
1. [@babel/polyfill 与 @babel/plugin-transform-runtime 详解](https://github.com/SunshowerC/blog/issues/4)
2. [@babel/preset-env 与@babel/plugin-transform-runtime 使用及场景区别](https://www.jianshu.com/p/ed24b0ba8792)
3. [babel官网](https://babeljs.io/docs/en)

webpack构建的前端项目中js模块会经过babel及其相关插件的处理，最后输出能被浏览器正常运行的js文件。webpack中涉及到babel配置有
- 在webpack的module中配置babel-loader
- 以下几种方式都可以配置babel的具体选项
  1. 在package.json的babel选项中配置具体的选项
  2. 在项目根目录中新建.babelrc配置文件 默认是json格式 也可以写成js文件通过module.exports导出。
- .babelrc中的preset选项 @babel/preset-env + corejs3
  1. useBuiltIns = useage 会参考目标浏览器（browserslist） 和 代码中所使用到的特性来按需加入 polyfill
  2. useBuiltIns = entry  这是一种入口导入方式, 只要我们在打包配置入口 或者 文件入口写入 import "core-js" 这样一串代码， babel 就会替我们根据当前你所配置的目标浏览器(browserslist)来引入所需要的polyfill 。

- 利用 @babel/plugin-transform-runtime 插件还能以沙箱垫片的方式防止污染全局， 并抽离公共的 helper function , 以节省代码的冗余
- .babelrc中plugin选项 的@babel/plugin-tranform-runtime + @babel/runtime
- 在package.json中的browserlist或者根目录的browserlistrc文件的配置项， 决定了js兼容的浏览器范围 
- @babel/preset-env和@babel/plugin-transform-runtime配置其中一个就可以


### webpack构建的项目中css的兼容性配置
- 需要安装 post-loader和postcss-preset-env
- postcss-preset-env会将最新的CSS语法转换为目标环境的浏览器能够理解的CSS语法
- postcss-preset-env使用browserslist来配置目标环境
- postcss-preset-env集成了autoprefixer

```js
// postcss.config.js
module.exports = {
  plugins: {
    "postcss-preset-env": {
      stage: 0
    }
  }
};
// webpack.config.js  module.rules
{
  test: /\.css/,
  use: [
    { loader: 'style-loader', options: { ... } },
    { loader: 'css-loader', options: { ... } },
    { loader: 'postcss-loader', options: { ... } },
    { loader: 'sass-loader', options: { ... } }
  ]
}
```


## 算法
- -----

## nodejs + npm
- nodejs的常用api
- koa的洋葱模型实现的原理


[verdaccio + pm2 + nginx搭建私有的npm服务](https://www.jianshu.com/p/d32ce7e9d4d8)

## React 中的元素和组件有什么不同
- 元素是不可变的普通对象，用来描述你想要渲染的组件或 DOM 节点。  元素一旦被创建，你就无法更改它的子元素或者属性。一个元素就像电影的单帧：它代表了某个特定时刻的 UI。  
- 组件可以是类或者函数，他将 props 作为输入然后返回一个元素的树形结构作为输出。

## react的了解
  整体分为react react-dom, react-reconciler, scheduler, legacy-events
  - react 基础包, 提供操作 react 对象(ReactElement)的全局 api
  - react-dom 渲染器之一, 是 react 与 web 平台连接的桥梁(可以在浏览器和 nodejs 环境中使用)
  - react-reconciler 工作空间核心包(综合协调react-dom,react,scheduler各包之间的调用与配合). 管理 react 的输入和输出. 接受输入(schedulerUpdateOnFiber), 将输入信息进行处理(涉及调度机制, fiber树形结构, update队列, 调和算法等), 处理完成之后再次调用渲染器(如react-dom, react-native等)进行输出
  
  - scheduler 调度机制的核心实现, 控制react-reconciler中的render过程, 在concurrent模式下实现任务分片

  - legacy-events 原生事件的包装器, 封装合成事件, 提供一套可插拔的插件体系给渲染器(如react-dom)使用

###  createElement和jsx
Babel 会把 JSX 转译成一个名为 React.createElement() 函数调用。


## React.setState之state批处理的机制

1. 在同一个 event handler（事务）中
**无论你在多少个组件中调用多少个 setState，它们都会在最后一次 setState 后，全部放在同一个队列里，然后执行一个统一的更新，而不会说是 在父组件 re-render 一次，在子组件又 re-render 一次。**

2. 在 Ajax、setTimeout 等异步方法中
**每 setState 一次，就会 re-render 一次**


## React 16中的Fiber机制
React渲染页面分为两个阶段：
- 调度阶段（reconciliation）：在这个阶段 React 会更新数据生成新的 Virtual DOM，然后通过Diff算法，快速找出需要更新的元素，放到更新队列中去，得到新的更新队列。
- 渲染阶段（commit）：这个阶段 React 会遍历更新队列，将其所有的变更一次性更新到DOM上。

Fiber 的出现使大量的同步计算可以被拆解、异步化，使浏览器主线程得以调控。从而使我们得到了以下权限：

- 暂停运行任务。
- 恢复并继续执行任务。
- 给不同的任务分配不同的优先级。

Fiber 把更新过程碎片化，执行过程如下面的图所示，每执行完一段更新过程，就把控制权交还给 React 负责任务协调的模块，看看有没有其他紧急任务要做，如果没有就继续去更新，如果有优先级更高的任务，那就去做优先级高的任务。 


## web安全问题
- 老生常谈的XSS-跨站脚本攻击
  防御 对数据进行严格的输出编码 CSP HTTP Header 输入验证 开启浏览器XSS防御
- 警惕iframe带来的风险--使用iframe在页面上添加第三方提供的广告、天气预报、社交分享插件
  防御 sandbox的安全属性
- 别被点击劫持了
  X-Frame-Options：DENY
- csrf
  1. 增加 token 验证.因为 cookie 发送请求的时候会自动增加上，但是 token 却不会，这样就避免了攻击
  2. Referer 验证
- 错误的内容推断
- 防火防盗防猪队友：不安全的第三方依赖包
- 本地存储数据泄露
- 缺失静态资源完整性校验
- 用了HTTPS也可能掉坑里


## es6 module和commonjs的区别

1. es6 module输出的是值的引用， commonjs输出的是值的拷贝
- es6 module中通过inport语句输入的变量是一个符号连接，它是活的，它的值跟它的模块绑定，当模块内部的代码改写了这个变量，这个变量的值的变化会反馈到所有引用它的模块，所以es6模块也不会被缓存。因为es6输入的模块变量是一个符号连接，所以这个变量在其他模块是只读的，重新赋值会报错

- commonj模块输出的是一个值的拷贝，一旦输出，模块内部的变化并不会影响到外部，即使是基本数据类型的属性值的变化也不会。
commonjs模块的值会被缓存，只在第一次加载时会运行模块，之后就会从缓存中查找

2. es6 module 是编译时输出接口， commonjs是运行时加载
- commonjs模块输出的是一个对象， 只有运行完才会输出。 es6 module不是对象 它的对外接口只是一种静态定义，在解析阶段就会生成

3. es6 module this指向是undefined, 而commonjs的模块的this指向的是当前的module

4. es6 module可以输出多个值， 而commonjs 模块只能输出单个对象-module.exports