在使用axios时，一般我们会对axios进行一些封装，做一些全局配置，包括配置项参数的配置，拦截器的配置等。
一般我们首先会进行参数的配置，方式有以下几种

<br/>

*  给axios参数的defaults属性手动赋值
```js
axios.defaults.baseURL = 'https://api.example.com';
axios.defaults.timeout = 5000;
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

```


* 自定义实例进行参数配置

```js
var instance = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 3000
});
```


* 还有就是在具体的请求中可以传入参数进行配置

```js
// 发送 POST 请求
axios({
  method: 'post',
  url: '/user/12345',
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone'
  }
});
```

以上配置方式可以同时存在，所以必然存在配置优先顺序的问题，axios实例是默认存在一个defaults配置，存放在 lib/defaults.js，显然这个配置优先级最低，其次是我们上面通过手动修改defaults的方式，这种等于对那个默认的配置对象进行了修改，然后再是传入了自定义实例的方式，自定义实例时我们会传入一个自定义配置项，所以创建实例过程中会对自定义的配置项和默认配置项进行（默认的配置项有可能已经被修改过了）合并处理，遇到相同属性，自定义的配置项的属性会覆盖默认配置项的同名属性，最后就是具体的请求方法传入了配置项后，也会进行合并处理，请求中的配置项的属性会覆盖当前实例的配置项的同名属性

<br/>

如果我们需要配置多个参数时，一般我们可以创建一个自定义实例，在创建自定义实例的中传入配置项，以下是完整的配置项

```js
{
    // `url` 是用于请求的服务器 URL
  url: '/user',

  // `method` 是创建请求时使用的方法
  method: 'get', // default

  // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
  // 它可以通过设置一个 `baseURL` 便于为 axios 实例的方法传递相对 URL
  baseURL: 'https://some-domain.com/api/',

  // `transformRequest` 允许在向服务器发送前，修改请求数据
  // 只能用在 'PUT', 'POST' 和 'PATCH' 这几个请求方法
  // 后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream
  transformRequest: [function (data, headers) {
    // 对 data 进行任意转换处理
    return data;
  }],

  // `transformResponse` 在传递给 then/catch 前，允许修改响应数据 比较少用可忽略
  transformResponse: [function (data) {
    // 对 data 进行任意转换处理
    return data;
  }],

  // `headers` 是即将被发送的自定义请求头
  headers: {'X-Requested-With': 'XMLHttpRequest'},

  // `params` 是即将与请求一起发送的 URL 参数
  // 必须是一个无格式对象(plain object)或 URLSearchParams 对象
  params: {
    ID: 12345
  },

    // `paramsSerializer` 是一个负责 `params` 序列化的函数
  // (e.g. https://www.npmjs.com/package/qs, http://api.jquery.com/jquery.param/)
  paramsSerializer: function(params) {
    return Qs.stringify(params, {arrayFormat: 'brackets'})
  },

  // `data` 是作为请求主体被发送的数据
  // 只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'
  // 在没有设置 `transformRequest` 时，必须是以下类型之一：
  // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
  // - 浏览器专属：FormData, File, Blob
  // - Node 专属： Stream
  data: {
    firstName: 'Fred'
  },

  // `timeout` 指定请求超时的毫秒数(0 表示无超时时间)
  // 如果请求话费了超过 `timeout` 的时间，请求将被中断
  timeout: 1000,

    // `withCredentials` 表示跨域请求时是否需要使用凭证
  withCredentials: false, // default

  // `adapter` 允许自定义处理请求，以使测试更轻松
  // 返回一个 promise 并应用一个有效的响应 (查阅 [response docs](#response-api)).
  adapter: function (config) {
    /* ... */
  },

  // `auth` 表示应该使用 HTTP 基础验证，并提供凭据
  // 这将设置一个 `Authorization` 头，覆写掉现有的任意使用 `headers` 设置的自定义 `Authorization`头
  auth: {
    username: 'janedoe',
    password: 's00pers3cret'
  },

    // `responseType` 表示服务器响应的数据类型，可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
  responseType: 'json', // default

  // `responseEncoding` indicates encoding to use for decoding responses
  // Note: Ignored for `responseType` of 'stream' or client-side requests
  responseEncoding: 'utf8', // default

    // `xsrfCookieName` 是用作 xsrf token 的值的cookie的名称
  xsrfCookieName: 'XSRF-TOKEN', // default

  // `xsrfHeaderName` is the name of the http header that carries the xsrf token value
  xsrfHeaderName: 'X-XSRF-TOKEN', // default

    // `onUploadProgress` 允许为上传处理进度事件
  onUploadProgress: function (progressEvent) {
    // Do whatever you want with the native progress event
  },

  // `onDownloadProgress` 允许为下载处理进度事件
  onDownloadProgress: function (progressEvent) {
    // 对原生进度事件的处理
  },

    // `maxContentLength` 定义允许的响应内容的最大尺寸
  maxContentLength: 2000,

  // `validateStatus` 定义对于给定的HTTP 响应状态码是 resolve 或 reject  promise 。如果 `validateStatus` 返回 `true` (或者设置为 `null` 或 `undefined`)，promise 将被 resolve; 否则，promise 将被 rejecte
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  },

  // `maxRedirects` 定义在 node.js 中 follow 的最大重定向数目
  // 如果设置为0，将不会 follow 任何重定向
  maxRedirects: 5, // default

  // `socketPath` defines a UNIX Socket to be used in node.js.
  // e.g. '/var/run/docker.sock' to send requests to the docker daemon.
  // Only either `socketPath` or `proxy` can be specified.
  // If both are specified, `socketPath` is used.
  socketPath: null, // default

  // `httpAgent` 和 `httpsAgent` 分别在 node.js 中用于定义在执行 http 和 https 时使用的自定义代理。允许像这样配置选项：
  // `keepAlive` 默认没有启用
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),

  // 'proxy' 定义代理服务器的主机名称和端口
  // `auth` 表示 HTTP 基础验证应当用于连接代理，并提供凭据
  // 这将会设置一个 `Proxy-Authorization` 头，覆写掉已有的通过使用 `header` 设置的自定义 `Proxy-Authorization` 头。
  proxy: {
    host: '127.0.0.1',
    port: 9000,
    auth: {
      username: 'mikeymike',
      password: 'rapunz3l'
    }
  },

  // `cancelToken` 指定用于取消请求的 cancel token
  // （查看后面的 Cancellation 这节了解更多）
  cancelToken: new CancelToken(function (cancel) {
  })
}
```


现介绍几个有可能会用到的配置项

<br/>

* transformRequest

这个属性允许我们在请求前对数据进行处理，只用在post、put和patch方法中，比如在post请求中，当content-type为application/x-www-form-urlencoded时，数据是要先进行序列化处理在经过xhr发送到服务器的

```js
transformRequest: [function (data, headers) {
  // 用axios的qs模块对数据进行序列化处理
  data = qs.stringify(data)
  return data;
}],
```

<br/>

* xsrfCookieName 和 xsrfHeaderName

这两个参数是配合使用的，顾名思义是用来防止CSRF/XSRF的，加入用户后端在设置一个跟xsrfCookieName同名的cookie后，前端之在之后的请求都会自动在请求头中加上xsrfHeaderName对应的字段进行认证，设置好后不需要再进行处理，axios会我们自动添加。

<br/>

请求配置项配好后，我们还会经常用到拦截器，比如在请求拦截器中，拦截器允许我们对请求发送之前或响应发送回来后对数据行处理。比如，我们可以从cookie或localstorage中取出token，添加到header中做一个认证。在响应回来时，可以对状态码不同的状态码进行全局处理

<br/>

* validateStatus

这个属性的作用是决定响应的状态码是被resolve还是reject，axios默认是返回200-300之间的状态才被resolve，也就是说常见的404和504等状态码的结果都会被reject，但其实我们不一定都是想这样，所以我们可以统一返回true，在响应拦截器再针对不同的状态码作相应处理，这样，只有极少的比如timeout请求超时等情况会进入到响应拦截器的reject中，绝大多数情况都在响应拦截器中座处理即可


```js
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做点什么 比如给header添加token
  let token =localStorage.getItem('token')
  config.headers.common['token'] = token
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么 
  // 比如对未登录或没有权限的code做跳转登录页处理
  // 比如404请求重定向到404页面
  return response;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});
```
<br/>

关于拦截器的机制，我们会在另外一篇 [axios源码基本解读](./code-analysis.html) 中提到。这样经过统一的配置和拦截器处理后，我们就可以方便的在项目中使用了