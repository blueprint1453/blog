项目中一直在用axios,在使用过程中发现axios的使用方式真多,配置项可以很简单，也可以很复杂，所以一直在懵懵懂懂使用，换家公司或换个部门却发现以前的使用方式有问题了，最近正好相对清闲，特意去补了一下http和axios源码一些知识，总算大致知道axios的基本原理了。
<br/>
在项目中引入axios后，我们可以直接以下面多种方式使用

1. 直接传递一个配置项然后调用

```js
axios(config)
```


2. 传入url和配置项然后调用

```js
axios(url[, config])
```


3. 以请求方法别名的方式使用

```js
axios.request(config)
axios.get(url[, config])
axios.delete(url[, config])
axios.head(url[, config])
axios.options(url[, config])
axios.post(url[, data[, config]])
axios.put(url[, data[, config]])
axios.patch(url[, data[, config]])
```


4. 可以自定义配置项创建一个实例，然后使用实例方法

```js
  axios.create([config])
```

然后使用实例方法

```js
axios#request(config)
axios#get(url[, config])
axios#delete(url[, config])
axios#head(url[, config])
axios#options(url[, config])
axios#post(url[, data[, config]])
axios#put(url[, data[, config]])
axios#patch(url[, data[, config]])
```

axios为我们提供了非常灵活的使用方式来满足不同的实际需求，但是使用方式太多，对很多初学者或初次使用的开发者来说是一种负担,为此困惑了很长一段时间了，所以就花了半天时间去翻阅了一下源码，大概理解了一下[axios](https://github.com/axios/axios)的设计思路。

<br/>

axios的源码在lib文件夹下，先来看axios.js为入口文件，先来看一段源码

```js
var utils = require('./utils');
var bind = require('./helpers/bind');
var Axios = require('./core/Axios');
var mergeConfig = require('./core/mergeConfig');
var defaults = require('./defaults');

/**
 * axios实例的创建方法
 *
 * @param {Object} defaultConfig 默认配置
 * @return {Axios} 返回一个Axios实例
 */
function createInstance(defaultConfig) {
  // 调用Axios构造函数生成一个实例
  var context = new Axios(defaultConfig);
  // bind方法返回一个函数，这个函数内部会调用Axios类的核心方法request,并且将this指向了上一行创建的axios实例
  var instance = bind(Axios.prototype.request, context);
  
  // 将Axios类的原型方法拷贝至instance中
  utils.extend(instance, Axios.prototype, context);

  // 将Axios类的实例context的方法拷贝至instance中
  utils.extend(instance, context);

  return instance;
}

// 创建了一个默认实例 这个实例就是我们引入的那个默认实例
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// 给默认实例添加一个方法 允许用户创建自定义的axios实例
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};
// 后面给axios是扩展的其他方法...

```

引入的axios本身是一个传入默认配置调用createInstance方法生成一个默认实例instance,但这个实例并不是通过常规方式生成的实例，这个实例本身是一个通过bind方法生成的函数，这也就是为什么axios可以直接以函数方式调用的原因，通过bind方法，instance还绑定了一个Axios的实例作为它的上下文环境（也就是this的指向）,再通过两次调用utils对象的extend方法，instance继承了Axios.prototype原型链的方法以及Axios实例的属性。

<br/>

在生成默认实例后还对默认实例进行了扩展，这其中就包括生成新实例工厂函数create方法，这样我们项目中引入的axios实例，既可以作为函数进行直接调用，也可以传入自定义配置项再生成一个实例去使用。但是注意通过create方法生成实例跟axios库默认导出的实例有一些区别，两者的区别可以从下图看出来，create创建的实例明显少了几个方法，这几个方法是在导出前给默认实例添加的，所以使用时要注意其中的区别。

<br/>

![](https://user-gold-cdn.xitu.io/2019/10/23/16df8b5f78cb669a?w=619&h=646&f=jpeg&s=189608)

axios依赖的核心类是Axios，其原型有一个核心方法request（稍后重点介绍），顾名思义所有的请求其实都是通过调用它来实现http请求的，在上面我们也讲了axios实例可以调用自身使用，其实就是调用了这个方法，实例之所以能够通过get/post/put/delete/patch/head/options等方法也是调用了此方法。

```js
function Axios(instanceConfig) {
  // 默认配置项
  this.defaults = instanceConfig;
  // 拦截器
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

// 不需要data的http请求方法别名
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});
// 需要data的http请求方法别名
utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;
```

下面来看axios的核心方法request,这个方法合并了传入的配置项和默认的配置项，定义了两个关键变量

```js
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);
```

config用Promise进行了包装处理，这样就可以通过链式调用的方式对config进行处理然后往后传递，直到发送请求，请求结束后拿到响应结果，对响应结果进行处理不断往后传递，这就是请求拦截器和响应拦截器可以实现的基础。后面的代码可以看到，chain数组将请求拦截器中传入的fulfilled方法和rejected方法插到数组的前面，将响应拦截器的fulfilled和rejected插入到了后面，这正是一种巧妙的设计，这样在while循环中，每次弹出chain数组中最前面两个元素，实现了 请求拦截器=》请求等待响应=》 响应拦截器 流水线式的操作。

<br/>

```js
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  // 允许('example/url'[, config]) 这样的传参操作
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  //设置请求方法
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // 两个关键变量 
  // chain将会将请求和响应的拦截器函数加进去 之所以有一个undefined是因为promise的then方法需要两个成对参数
  // promise可以在链式操作中调用这些中间件函数
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);
  
  // chain数组将请求拦截器中传入的fulfilled方法和rejected方法插到数组的前面
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });
  
  // chain数组将响应拦截器中fulfilled方法和rejected方法插到数组的后面
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });
  
  
  // 每次弹出chain数组中最前面两个元素,正好作为promise的then方法的resolve和reject
  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};
```

[本文掘金地址](https://juejin.im/post/6844903976702312461)

