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

# webpack
- 了解webpack基本配置、工作流程和基本原理

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
