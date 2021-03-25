
## 了解webpack基本配置、工作流程和基本原理
- webpack是一个模块打包器，旨在解决前端工程化中构建，打包和编译问题。在webpack中，一切皆模块，每一个文件都是一个模块，通过webpack的打包编译最后输出一个或多个chunk，chunk是代码块，代码块有一个或多个模块经过webpack处理后输出得到。
- webpack中的重要配置项有entry、output、resolve、module、plugin、devtools以及开发环境的使用的devServer等。
- 因为webpack默认可以处理的js/json模块，其他格式的模块的处理需要专门的loader处理，loader就是一个转化器，接受源文件，返回转化的结果，同一个模块可以用多个loader串行处理，最后输出的应该是一个js模块。
- webpack的插件是一个js模块，插件的原型有一个apply方法，webpack在安装插件时会注入compilier对象，这个对象拥有整个webpack的环境的所有信息，插件可以通过complier对象订阅相关的webpack事件钩子，在相应的事件钩子触发后的回调里拿到当前编译的compliation对象，步钩子还能拿到相应的 callback。
- complier对象 可以理解为webpack的总控制台，在运行 webpack 时，会自动初始化 compiler 对象，开发插件时，我们可以从 compiler 对象中拿到所有和 webpack 主环境相关的内容。
- compilation对象 对应每一次的编译任务的一个对象，含有本次编译的所有资源的相关信息，一个编译对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息。
- 事件钩子 框架的生命周期函数，在特定阶段能做特殊的逻辑处理


## webpack 为何可以同时支持commonjs和es6 module的写法
- 打包后的代码是一个自执行函数
- 自执行函数内部定义了一个缓存所有的模块的对象
- 定义了__webpack_require__ 加载模块方法，该方法会执行模块内容，返回模块的结果
- 定义了一系列的辅助函数，在这些辅助函数中包括标记是否为es6模块的函数
- 自执行函数在最后会调用__webpack_require__加载入口模块
- commonjs模块


## webpack的按需加载的实现原理（import（）调用）

- 定义了全局的installChunks缓存动态导入的模块

- 定义了加载动态模块的方法和以及加载后的立即执行的函数

- 将import函数转化为__webpack_require__.e(moduleId).then(__webpack_require__.bind(null, moduleId))

- __webpack_require__是加载模块的方法，__webpack_require__.e中为动态加载模块绑定了一个promise数组，并添加script标签去加载动态模块的代码，__webpack_require__.e返回一个promise

- 动态模块的代码下载好后会执行一个方法，这个方法主要是resolve该模块对应的promise，这样前面提到的__webpack_require__.e(moduleId).then(__webpack_require__.bind(null, moduleId))，里面的then回调就会执行，then回调里面加载的才是真正的模块代码，返回模块内容后再下一个then回调就可以接受这个结果。

## webpack构建流程
1. 合并配置参数，用参数初始化complier对象，加载配置中的插件，执行run方法开始编译
2. 找到入口文件，并使用相应的loader处理，在找出依赖的模块，使用相应的loader处理，依赖的模块的还会依赖其他模块，这是一个递归分析的过程，直至所有的模块都被处理
3. 所有的模块都被loader处理完毕后，得到每个模块的处理后的结果以及他们依赖关系
4. 根据入口文件以及模块之间的依赖关系，组装成一个个包含一个或多个模块的chunk，将每个chunk文件转化为单独的文件加入到输出列表
7. 输出文件，得到编译后的结果

- webpack会在以上的过程中发出的特定的事件，订阅了这些事件的插件可以在相应的时机去执行相应的任务
     

## webpack构建打包优化 
[Webpack4中的Tree-Shaking](https://zhuanlan.zhihu.com/p/193663299)
[Webpack 4 Tree Shaking 终极优化指南](https://www.cnblogs.com/lzkwin/p/11878509.html)

- 使用webpack-uglify-parallel来提升uglifyPlugin的压缩速度
- 使用Happypack 实现多线程加速编译

## webpack打包优化前端性能
1. 压缩代码
2. 构建时将静态资源路径替换成对应cdn
3. 使用tree-shaking手段删除死代码


### webpack中babel的配置
- 相关文章 
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



### wwebpack4中hash、chunkhash和contenthash三者的区别

1. hash是跟整个项目的构建相关，构建生成的文件hash值都是一样的，所以hash计算是跟整个项目的构建相关，同一次构建过程中生成的hash都是一样的，只要项目里有文件更改，整个项目构建的hash值都会更改。

**如果出口是hash，那么一旦针对项目中任何一个文件的修改，都会构建整个项目，重新获取hash值，缓存的目的将失效。**

2. chunkhash根据不同的入口文件(Entry)进行依赖文件解析、构建对应的chunk，生成对应的哈希值。在生产环境里把一些公共库和程序入口文件区分开，单独打包构建，接着我们采用chunkhash的方式生成哈希值，那么只要我们不改动公共库的代码，就可以保证其哈希值不会受影响。并且webpack4中支持了异步import功能，固，chunkhash也作用于此

**但是这样又有一个问题，因为我们是将样式作为模块import到JavaScript文件中的，所以它们的chunkhash是一致的**

3. 但是这样又有一个问题，因为我们是将样式作为模块import到JavaScript文件中的，所以它们的chunkhash是一致的




### tree-shaking

1. Webpack 只有在压缩代码的时候会 tree-shaking, 通常就指是生产环境,在开发环境会对未被使用的代码进行注释标记
2. 代码的 module 引入必须是 import 的引入方式，也就是要是用es6 module方式书写代码

3. 在 package.json 文件中将 sideEffects 设为 false

4. 将css相关 loader中 sideEffects 设为 true

5. 让@babel/preset-env 不要将 ES6 模块转化为其他模块规范 modules值设置为 false

6. 使用TerserPlugin，js代码压缩插件(webpack 自带)

参考[Webpack的Tree Shaking实战](https://blog.csdn.net/weixin_30428981/article/details/112160362)