


## 输入url到网页呈现的过程

1. 缓存查找，找到对应的本地缓存字段信息，查看是否命中缓存
2. dns查询对应域名的ip
3. 向ip地址对应的服务器发起tcp连接
4. 向服务器发起正式请求
5. 服务器收到请求并返回对应的html
6. 浏览器接收html并解析html
7. 解析dom，生成dom树，并且下载css、js、图片等对应的资源文件，css会解析生成样式信息（cssom）
8. dom树和样式信息合并生成渲染树（render tree）,布局（layout）、绘制界面

### web缓存字段和规则
- 分为强缓存和协商缓存 强缓存优先于协商缓存，强缓存不需要根服务器通信，协商缓存需要根服务器通信比对
- 强缓存控制字段有cache-control，expire，cache-control优先于expire，强缓存命中的话不会跟服务器通   信
- Expires是一个服务器绝对时间，cache-control中的max-age保存一个相对时间
- cache-control常用值的意义
  1. public 响应可以被任何对象（包括：发送请求的客户端，代理服务器，等等）缓存
  2. private 应只能被单个用户缓存，不能作为共享缓存（即代理服务器不能缓存它）
  3. no-cache 在发布缓存副本之前，强制要求缓存把请求提交给原始服务器进行验证(协商缓存验证)。
  4. no-store 缓存不应存储有关客户端请求或服务器响应的任何内容，即不使用任何缓存。
  5. max-age=seconds 设置缓存存储的最大周期，超过这个时间缓存被认为过期(单位秒)。

- 协商缓存通过HTTP的last-modified，Etag字段进行判断。
   1. last-modified是服务器返回的资源文件的最近更新时间，之后同一个资源文件的请求会带上
      if-modified-since字段，服务器用本地的last-modified和if-modified-since的值比较
   2. Etag是资源的哈希标识，当资源更新时，Etag会改变。服务器会判断Etag是否发生变化，如果变化则返回    新资源，否则返回304

   [浏览器缓存知识小结及应用](https://www.cnblogs.com/lyzg/p/5125934.html)

### TCP连接
1. 第一次握手： 建立连接时，客户端发送syn包（syn=j）到服务器，并进入SYN_SENT状态，等待服务器确认；
2. 第二次握手： 服务器收到syn包，必须确认客户的SYN（ack=j+1），同时自己也发送一个SYN包（syn=k），即SYN+ACK包，此时服务器进入SYN_RECV状态；
3. 第三次握手： 客户端收到服务器的SYN+ACK包，向服务器发送确认包ACK(ack=k+1），此包发送完毕，客户端和服务器进入ESTABLISHED（TCP连接成功）状态，完成三次握手。


### html解析到渲染的过程
[浏览器渲染流程](https://juejin.im/post/6844904017907154951)
[浏览器渲染引擎](https://juejin.im/post/6844903587525427214)
[浏览器层合成与页面渲染优化](https://juejin.im/post/6844903959425974280)

## ------------------分割线------------------------------------------------
## http1.0 1.1 2.0之间的区别
### http1.0/1.1的特点
1. http 1.0在发送请求结束后会断开tcp连接，下一个请求又要重新重建tcp连接
2. http 1.1连接默认是长连接，connection:keep-alive
3. http 1.1中一个TCP连接虽然支持多个请求，但是同一时刻只能处理一个请求，两个请求的生命周期不同重叠
4. 添加的变更如下：缓存相关首部的扩展、OPTIONS 方法、host、Upgrade 首部、Range（范围）请求、压缩和传输编码（transfer-encoding）、管道化（pipelining）
- 添加的变更如下：
1. 缓存处理，在HTTP1.0中主要使用header里的If-Modified-Since,Expires来做为缓存判断的标准，HTTP1.1则引入了更多的缓存控制策略例如Entity tag，If-Unmodified-Since, If-Match, If-None-Match等更多可供选择的缓存头来控制缓存策略。
2. 带宽优化及网络连接的使用，HTTP1.0中，存在一些浪费带宽的现象，例如客户端只是需要某个对象的一部分，而服务器却将整个对象送过来了，并且不支持断点续传功能，HTTP1.1则在请求头引入了range头域，它允许只请求资源的某个部分，即返回码是206（Partial Content），这样就方便了开发者自由的选择以便于充分利用带宽和连接。
3. Host头处理，在HTTP1.0中认为每台服务器都绑定一个唯一的IP地址，因此，请求消息中的URL并没有传递主机名（hostname）。但随着虚拟主机技术的发展，在一台物理服务器上可以存在多个虚拟主机（Multi-homed Web Servers），并且它们共享一个IP地址。HTTP1.1的请求消息和响应消息都应支持Host头域，且请求消息中如果没有Host头域会报告一个错误（400 Bad Request）。
4. 长连接，HTTP 1.1支持长连接（PersistentConnection）和请求的流水线（Pipelining）处理，在一个TCP连接上可以传送多个HTTP请求和响应，减少了建立和关闭连接的消耗和延迟，在HTTP1.1中默认开启Connection： keep-alive，一定程度上弥补了HTTP1.0每次请求都要创建连接的缺点。



#### 支持多路复用
 1. 多个http请求可以在同一个TCP连接并行的进行
 2. HTTP2虽然只有一条TCP连接，但是在逻辑上分成了很多stream

 3. HTTP2把要传输的信息分割成一个个二进制帧，首部信息会被封装到HEADER Frame，相应的request body就放到DATA Frame,一个帧你可以看成路上的一辆车,只要给这些车编号，让1号车都走1号门出，2号车都走2号门出，就把不同的http请求或者响应区分开来了。但是，这里要求同一个请求或者响应的帧必须是有有序的，要保证FIFO的，但是不同的请求或者响应帧可以互相穿插。这就是HTTP2的多路复用，是不是充分利用了网络带宽，是不是提高了并发度？

####  单一长连接 
1. 统一域名下单个，在HTTP/2中，客户端向某个域名的服务器请求页面的过程中，只会创建一条TCP连接，即使这页面可能包含上百个资源
2. 原因 单一的连接能减少TCP握手带来的时延,另外TCP协议有个滑动窗口，有慢启动这回事，就是说每次建立新连接后，数据先是慢慢地传，然后滑动窗口慢慢变大
3. HTTP2中用一条单一的长连接，避免了创建多个TCP连接带来的网络开销，提高了吞吐量。

#### 头部压缩
随着 Web 功能越来越复杂，每个页面产生的请求数也越来越多，根据 HTTP Archive 的统计，当前平均每个页面都会产生上百个请求。越来越多的请求导致消耗在头部的流量越来越多，尤其是每次都要传输 UserAgent、Cookie 这类不会频繁变动的内容，完全是一种浪费。

#### 二进制格式
- 与Http1.x（文本协议）不同，Http2是一个二进制协议，所有的消息被http2拆分封装成更小的消息单元帧，并进行二进制编码。其中http1.x的首部信息被封装成HEADER帧和CONTINUATION帧，请求体被封装到DATA帧
- 二进制优势
1. 性能。二进制协议的解析效率超高，几乎没有解析代价；
2. 带宽。二进制协议没有冗余字段，占用带宽少；

#### 服务端推送Server Push
这个功能通常被称作“缓存推送”。主要的思想是：当一个客户端请求资源X，而服务器知道它很可能也需要资源Z的情况下，服务器可以在客户端发送请求前，主动将资源Z推送给客户端。





## ------------------分割线---------------------------------------------------------
## https为什么比http更加安全
[为什么HTTPS比HTTP更安全?](https://blog.csdn.net/howgod/article/details/89596638)
[HTTPS原理和通信流程](https://zhuanlan.zhihu.com/p/56663184)
- http的缺陷
1. 数据采用明文传输，相当于数据在传输过程中裸奔
2. 无法验证报文的完整性，也就是无法确认请求和响应内容中间是否被篡改
3. 不会对通信的双方进行身份验证，任何请求，只要请求的ip没被限制的话，服务器都会进行相应
   同样任何人都可以伪造服务器欺骗用户

- https的优势
1. 通信进过程中对数据进行了加密处理，即使被拦截了也很难破解
2. 内容传输经过了完整性校验
3. 对身份进行了验证

- HTTPS 协议的主要功能基本都依赖于 TLS/SSL 协议，TLS/SSL 的功能实现主要依赖于三类基本算法：散列函数 、对称加密和非对称加密，其利用非对称加密实现身份认证和密钥协商，对称加密算法采用协商的密钥对数据加密，基于散列函数验证信息的完整性。




## 首屏性能优化 

- 首屏时间--浏览器从响应网址输入到首屏内容渲染完成的时间，这个时候页面不一定完全渲染完成，只是当前视图渲染完成
- 白屏时间--浏览器从响应网址输入到开始显示内容的时间
- 白屏时间计算：performance.timing.responseStart - performance.timing.navigationStart
- 首屏时间计算： performance.getEntriesByName("first-contentful-paint")[0].startTime

1. 采用cdn分发，多台服务器部署相同的副本，让离用户近或者压力小的的服务节点响应用户的请求
2. 资源压缩，gzip压缩可以将js和css等资源压缩到原来的一半以上
3. 利用缓存，设置合理的缓存字段，刷新或下次打开就可以快速从缓存中获取
4. 静态资源动态加载，比如现在的spa应用，非首页的页面可以按需加载，非当前的视图组件可以动态加载，非当前的视图的图片可以懒加载
5. 有长列表的可以延迟加载
6. ssr-服务端渲染，让服务器返回的吧首页的内容直接返回
7. 利用script标签的defer和async属性，功能独立且不要求马上执行的js文件，可以加入async属性，如果是优先级低的js，可以加入defer属性
8. 前端利用localStorage或者内存做一些缓存处理
9. 骨架屏-一般用于移动端，首屏加载完成前，通过的简单的元素占位，缓解等待焦虑
10. 利用http2.0，http2比http1.1有更好的传输性能，在接口小数量多的情况小尤其明显





## ------------------分割线----------------------------
## 什么事xss以及如何防范
- xss-跨站脚本攻击 向目标网站植入恶意的脚本，用户打开这些网站后会恶意的代码会自动执行或者通过一些点击交互事件触发
- xss攻击分为反射型、存储型、和dom型三种
- 反射型- 恶意代码被当做正常的数据提交给后台，后台处理后返回给前端
- 存储型 恶意代码被提交到数据库中，用户打开网页后从数据库取出返回给浏览器执行
- dom型，利用script，img,iframe， a 等标签的植入恶意的代码

- 危害-可以窃取网站用户的重要数据，操控当前页面的样式，重定向到其它网站。。。


### xss防范

1. 设置HttpOnly以避免cookie劫持的危险。
2. 对诸如script、img、a等标签进行过滤
3. 编码，像一些常见的符号，如<>在输入的时候要对其进行转换编码，这样做浏览器是不会对该标签进行解释执行的，同时也不影响显示效果
4. 别被点击劫持了， 服务器设置X-Frame-Options：DENY禁止自己的网站被iframe套用
5. CSP-内容安全策略 方案较新
  - 禁止加载外域代码，防止复杂的攻击逻辑。
  - 禁止外域提交，网站被攻击后，用户的数据不会泄露到外域。
  - 禁止内联脚本执行（规则较严格，目前发现 GitHub 使用）。
  - 禁止未授权的脚本执行（新特性，Google Map 移动版在使用）

6. 对特殊符号进行转码 可以写一个公共的escapeHTML()函数 按照如下规则进行转义

| 字符 | 转义后的字符 |
| ------ | ------ | 
| & | \&amp; |
| < | \&lt; |
| > | \&gt; |
| " | \&quot; |
| ' | \&#x27; |
| > | \&gt; |
| / | \&#x2F; |


7. 禁止 URL 以 "javascript:" 开头

```js
xss = getParameter("redirect_to").startsWith('javascript:');
if (!xss) {
  <a href="<%= escapeHTML(getParameter("redirect_to"))%>">
    跳转...
  </a>
} else {
  <a href="/404">
    跳转...
  </a>
}

```

- 实现一个 escapeEmbedJSON() 函数，对内联 JSON 进行转义

| 字符 | 转义后的字符 |
| ------ | ------ | 
| U+2028 | \u2028 |
| U+2029 | \u2029 |
| < | \u003c |



[如何防止XSS攻击？](https://juejin.cn/post/6844903685122703367)


## ------------------分割线----------------------------
## 什么事xsrf以及如何防范
- 跨站请求伪造 用户登录了网站A，网站B诱导用户进入网站B，网站B偷偷自动提交了向网站B的请求（比如构造了一个表单），请求携带A网站的cookie到了网站A的后台服务器。

-  csrfs防范
1. 对于所有请求采用token验证或其他请求头验证手段
2. [充分利用好cookie的SameSite属性](http://www.ruanyifeng.com/blog/2019/09/cookie-samesite.html)
3. origin属性和referer属性



## ------------------分割线----------------------------
## 跨域的方案

- cors 跨域资源共享 后端设置
  1. Access-Control-Allow-Origin 指示请求的资源能共享给哪些域
  2. Access-Control-Allow-Credentials ： 指示当请求的凭证标记为 true 时，是否响应该请求。
  3. Access-Control-Allow-Headers 用在对预请求的响应中，指示实际的请求中可以使用哪些 HTTP 头。
  4. Access-Control-Allow-Methods： 指定对预请求的响应中，哪些 HTTP 方法允许访问请求的资源。
  5. Access-Control-Expose-Headers 指示哪些 HTTP 头的名称能在响应中列出。

- 代理  nginx和服务端接口转发

```js
  // nginx解决跨域配置实例 http://192.168.1.100:8080/api为前缀的请求都会被转发到
  // http://ni.hao.sao/api下
  server{
      listen 8888;
      server_name  192.168.1.100;

      location /{
          proxy_pass http://192.168.1.100:8080;
      }

      location /api{
          proxy_pass http://ni.hao.sao/api;
      }
  }
```
- postmessage和onmessage 跨文档通信api window和ifranme、Web Worker 和 Service Work 进行通信都是用的 postmessage

- jsonp 利用script标签不受同源策略的限制，原理是在客户端定义好回调方法，并添加到请求的
参数中，服务端接受请求后将数据和回调名返回给客户端，客户端拿到响应结果后就可以执行了。

- Websocket WebSocket根本不附属于同源策略，而且它本身就有意被设计成可以跨域的一个手段，对于WebSocket的跨域检测工作就交给了服务端




## ------------------分割线----------------------------
## 简单请求和复杂请求
- 不会触发 CORS 预检的，就是简单请求。如果一个请求满足是get、post和header之一，并且content-type类型是application/x-www-form-urlencoded、text/plain、multipart/form-data三者之一，请求头的字段类型是 Accept、Accept-Language、Content-Language、Content-Type， 就是一个简单请求，反之就是复杂请求，
- 复杂请求会触发预检 必须在正式发送请求前先发送一个OPTIONS方法的请求已得到服务器的同意，若没有得到服务器的同意，浏览器不会发送正式请求；



## ------------------分割线----------------------------
## http的状态码的含义
[HTTP状态码](https://www.runoob.com/http/http-status-codes.html)
- 100	客户端应当继续发送请求。这个临时响应是用来通知客户端它的部分请求已经被服务器接收，且仍未被拒绝。客户端应当继续发送请求的剩余部分，或者如果请求已经完成，忽略这个响应。服务器必须在请求完成后向客户端发送一个最终响应。

- 101	服务器已经理解了客户端的请求，并将通过Upgrade 消息头通知客户端采用不同的协议来完成这个请求。在发送完这个响应最后的空行后，服务器将会切换到在Upgrade 消息头中定义的那些协议。 　　只有在切换新的协议更有好处的时候才应该采取类似措施。例如，切换到新的HTTP 版本比旧版本更有优势，或者切换到一个实时且同步的协议以传送利用此类特性的资源。

- 102	由WebDAV（RFC 2518）扩展的状态码，代表处理将被继续执行。

- 200	请求已成功，请求所希望的响应头或数据体将随此响应返回。

- 201	请求已经被实现，而且有一个新的资源已经依据请求的需要而建立，且其 URI 已经随Location 头信息返回。假如需要的资源无法及时建立的话，应当返回 '202 Accepted'。

- 202	服务器已接受请求，但尚未处理。正如它可能被拒绝一样，最终该请求可能会也可能不会被执行。在异步操作的场合下，没有比发送这个状态码更方便的做法了。 　　返回202状态码的响应的目的是允许服务器接受其他过程的请求（例如某个每天只执行一次的基于批处理的操作），而不必让客户端一直保持与服务器的连接直到批处理操作全部完成。在接受请求处理并返回202状态码的响应应当在返回的实体中包含一些指示处理当前状态的信息，以及指向处理状态监视器或状态预测的指针，以便用户能够估计操作是否已经完成。
- 203	服务器已成功处理了请求，但返回的实体头部元信息不是在原始服务器上有效的确定集合，而是来自本地或者第三方的拷贝。当前的信息可能是原始版本的子集或者超集。例如，包含资源的元数据可能导致原始服务器知道元信息的超级。使用此状态码不是必须的，而且只有在响应不使用此状态码便会返回200 OK的情况下才是合适的。 

- 204	服务器成功处理了请求，但不需要返回任何实体内容，并且希望返回更新了的元信息。响应可能通过实体头部的形式，返回新的或更新后的元信息。如果存在这些头部信息，则应当与所请求的变量相呼应。 　　如果客户端是浏览器的话，那么用户浏览器应保留发送了该请求的页面，而不产生任何文档视图上的变化，即使按照规范新的或更新后的元信息应当被应用到用户浏览器活动视图中的文档。 　　由于204响应被禁止包含任何消息体，因此它始终以消息头后的第一个空行结尾。

- 205	服务器成功处理了请求，且没有返回任何内容。但是与204响应不同，返回此状态码的响应要求请求者重置文档视图。该响应主要是被用于接受用户输入后，立即重置表单，以便用户能够轻松地开始另一次输入。 　　与204响应一样，该响应也被禁止包含任何消息体，且以消息头后的第一个空行结束。

- 206	服务器已经成功处理了部分 GET 请求。类似于 FlashGet 或者迅雷这类的 HTTP 下载工具都是使用此类响应实现断点续传或者将一个大文档分解为多个下载段同时下载。 　　该请求必须包含 Range 头信息来指示客户端希望得到的内容范围，并且可能包含 If-Range 来作为请求条件。 　　响应必须包含如下的头部域： 　　Content-Range 用以指示本次响应中返回的内容的范围；如果是 Content-Type 为 multipart/byteranges 的多段下载，则每一 multipart 段中都应包含 Content-Range 域用以指示本段的内容范围。假如响应中包含 Content-Length，那么它的数值必须匹配它返回的内容范围的真实字节数。 　　Date 　　ETag 和/或 Content-Location，假如同样的请求本应该返回200响应。 　　Expires, Cache-Control，和/或 Vary，假如其值可能与之前相同变量的其他响应对应的值不同的话。 　　假如本响应请求使用了 If-Range 强缓存验证，那么本次响应不应该包含其他实体头；假如本响应的请求使用了 If-Range 弱缓存验证，那么本次响应禁止包含其他实体头；这避免了缓存的实体内容和更新了的实体头信息之间的不一致。否则，本响应就应当包含所有本应该返回200响应中应当返回的所有实体头部域。 　　假如 ETag 或 Last-Modified 头部不能精确匹配的话，则客户端缓存应禁止将206响应返回的内容与之前任何缓存过的内容组合在一起。 　　任何不支持 Range 以及 Content-Range 头的缓存都禁止缓存206响应返回的内容。

- 207	由WebDAV(RFC 2518)扩展的状态码，代表之后的消息体将是一个XML消息，并且可能依照之前子请求数量的不同，包含一系列独立的响应代码。

- 300	被请求的资源有一系列可供选择的回馈信息，每个都有自己特定的地址和浏览器驱动的商议信息。用户或浏览器能够自行选择一个首选的地址进行重定向。 　　除非这是一个 HEAD 请求，否则该响应应当包括一个资源特性及地址的列表的实体，以便用户或浏览器从中选择最合适的重定向地址。这个实体的格式由 Content-Type 定义的格式所决定。浏览器可能根据响应的格式以及浏览器自身能力，自动作出最合适的选择。当然，RFC 2616规范并没有规定这样的自动选择该如何进行。 　　如果服务器本身已经有了首选的回馈选择，那么在 Location 中应当指明这个回馈的 URI；浏览器可能会将这个 Location 值作为自动重定向的地址。此外，除非额外指定，否则这个响应也是可缓存的。

- 301	被请求的资源已永久移动到新位置，并且将来任何对此资源的引用都应该使用本响应返回的若干个 URI 之一。如果可能，拥有链接编辑功能的客户端应当自动把请求的地址修改为从服务器反馈回来的地址。除非额外指定，否则这个响应也是可缓存的。 　　新的永久性的 URI 应当在响应的 Location 域中返回。除非这是一个 HEAD 请求，否则响应的实体中应当包含指向新的 URI 的超链接及简短说明。 　　如果这不是一个 GET 或者 HEAD 请求，因此浏览器禁止自动进行重定向，除非得到用户的确认，因为请求的条件可能因此发生变化。 　　注意：对于某些使用 HTTP/1.0 协议的浏览器，当它们发送的 POST 请求得到了一个301响应的话，接下来的重定向请求将会变成 GET 方式。

- 302	请求的资源现在临时从不同的 URI 响应请求。由于这样的重定向是临时的，客户端应当继续向原有地址发送以后的请求。只有在Cache-Control或Expires中进行了指定的情况下，这个响应才是可缓存的。 　　新的临时性的 URI 应当在响应的 Location 域中返回。除非这是一个 HEAD 请求，否则响应的实体中应当包含指向新的 URI 的超链接及简短说明。 　　如果这不是一个 GET 或者 HEAD 请求，那么浏览器禁止自动进行重定向，除非得到用户的确认，因为请求的条件可能因此发生变化。 　　注意：虽然RFC 1945和RFC 2068规范不允许客户端在重定向时改变请求的方法，但是很多现存的浏览器将302响应视作为303响应，并且使用 GET 方式访问在 Location 中规定的 URI，而无视原先请求的方法。状态码303和307被添加了进来，用以明确服务器期待客户端进行何种反应。

- 303	对应当前请求的响应可以在另一个 URI 上被找到，而且客户端应当采用 GET 的方式访问那个资源。这个方法的存在主要是为了允许由脚本激活的POST请求输出重定向到一个新的资源。这个新的 URI 不是原始资源的替代引用。同时，303响应禁止被缓存。当然，第二个请求（重定向）可能被缓存。 　　新的 URI 应当在响应的 Location 域中返回。除非这是一个 HEAD 请求，否则响应的实体中应当包含指向新的 URI 的超链接及简短说明。 　　注意：许多 HTTP/1.1 版以前的 浏览器不能正确理解303状态。如果需要考虑与这些浏览器之间的互动，302状态码应该可以胜任，因为大多数的浏览器处理302响应时的方式恰恰就是上述规范要求客户端处理303响应时应当做的。

- 304	如果客户端发送了一个带条件的 GET 请求且该请求已被允许，而文档的内容（自上次访问以来或者根据请求的条件）并没有改变，则服务器应当返回这个状态码。304响应禁止包含消息体，因此始终以消息头后的第一个空行结尾。 　　该响应必须包含以下的头信息： 　　Date，除非这个服务器没有时钟。假如没有时钟的服务器也遵守这些规则，那么代理服务器以及客户端可以自行将 Date 字段添加到接收到的响应头中去（正如RFC 2068中规定的一样），缓存机制将会正常工作。 　　ETag 和/或 Content-Location，假如同样的请求本应返回200响应。 　　Expires, Cache-Control，和/或Vary，假如其值可能与之前相同变量的其他响应对应的值不同的话。 　　假如本响应请求使用了强缓存验证，那么本次响应不应该包含其他实体头；否则（例如，某个带条件的 GET 请求使用了弱缓存验证），本次响应禁止包含其他实体头；这避免了缓存了的实体内容和更新了的实体头信息之间的不一致。 　　假如某个304响应指明了当前某个实体没有缓存，那么缓存系统必须忽视这个响应，并且重复发送不包含限制条件的请求。 　　假如接收到一个要求更新某个缓存条目的304响应，那么缓存系统必须更新整个条目以反映所有在响应中被更新的字段的值。

- 305	被请求的资源必须通过指定的代理才能被访问。Location 域中将给出指定的代理所在的 URI 信息，接收者需要重复发送一个单独的请求，通过这个代理才能访问相应资源。只有原始服务器才能建立305响应。 　　注意：RFC 2068中没有明确305响应是为了重定向一个单独的请求，而且只能被原始服务器建立。忽视这些限制可能导致严重的安全后果。

- 306	在最新版的规范中，306状态码已经不再被使用。

- 307	请求的资源现在临时从不同的URI 响应请求。由于这样的重定向是临时的，客户端应当继续向原有地址发送以后的请求。只有在Cache-Control或Expires中进行了指定的情况下，这个响应才是可缓存的。 　　新的临时性的URI 应当在响应的 Location 域中返回。除非这是一个HEAD 请求，否则响应的实体中应当包含指向新的URI 的超链接及简短说明。因为部分浏览器不能识别307响应，因此需要添加上述必要信息以便用户能够理解并向新的 URI 发出访问请求。 　　如果这不是一个GET 或者 HEAD 请求，那么浏览器禁止自动进行重定向，除非得到用户的确认，因为请求的条件可能因此发生变化。

- 400	1、语义有误，当前请求无法被服务器理解。除非进行修改，否则客户端不应该重复提交这个请求。 　　2、请求参数有误。

- 401	当前请求需要用户验证。该响应必须包含一个适用于被请求资源的 WWW-Authenticate 信息头用以询问用户信息。客户端可以重复提交一个包含恰当的 Authorization 头信息的请求。如果当前请求已经包含了 Authorization 证书，那么401响应代表着服务器验证已经拒绝了那些证书。如果401响应包含了与前一个响应相同的身份验证询问，且浏览器已经至少尝试了一次验证，那么浏览器应当向用户展示响应中包含的实体信息，因为这个实体信息中可能包含了相关诊断信息。参见RFC 2617。

- 402	该状态码是为了将来可能的需求而预留的。

- 403	服务器已经理解请求，但是拒绝执行它。与401响应不同的是，身份验证并不能提供任何帮助，而且这个请求也不应该被重复提交。如果这不是一个 HEAD 请求，而且服务器希望能够讲清楚为何请求不能被执行，那么就应该在实体内描述拒绝的原因。当然服务器也可以返回一个404响应，假如它不希望让客户端获得任何信息。

- 404	请求失败，请求所希望得到的资源未被在服务器上发现。没有信息能够告诉用户这个状况到底是暂时的还是永久的。假如服务器知道情况的话，应当使用410状态码来告知旧资源因为某些内部的配置机制问题，已经永久的不可用，而且没有任何可以跳转的地址。404这个状态码被广泛应用于当服务器不想揭示到底为何请求被拒绝或者没有其他适合的响应可用的情况下。

- 405	请求行中指定的请求方法不能被用于请求相应的资源。该响应必须返回一个Allow 头信息用以表示出当前资源能够接受的请求方法的列表。 　　鉴于 PUT，DELETE 方法会对服务器上的资源进行写操作，因而绝大部分的网页服务器都不支持或者在默认配置下不允许上述请求方法，对于此类请求均会返回405错误。

- 406	请求的资源的内容特性无法满足请求头中的条件，因而无法生成响应实体。 　　除非这是一个 HEAD 请求，否则该响应就应当返回一个包含可以让用户或者浏览器从中选择最合适的实体特性以及地址列表的实体。实体的格式由 Content-Type 头中定义的媒体类型决定。浏览器可以根据格式及自身能力自行作出最佳选择。但是，规范中并没有定义任何作出此类自动选择的标准。

- 407	　与401响应类似，只不过客户端必须在代理服务器上进行身份验证。代理服务器必须返回一个 Proxy-Authenticate 用以进行身份询问。客户端可以返回一个 Proxy-Authorization 信息头用以验证。参见RFC 2617。

- 408	请求超时。客户端没有在服务器预备等待的时间内完成一个请求的发送。客户端可以随时再次提交这一请求而无需进行任何更改。

- 409	由于和被请求的资源的当前状态之间存在冲突，请求无法完成。这个代码只允许用在这样的情况下才能被使用：用户被认为能够解决冲突，并且会重新提交新的请求。该响应应当包含足够的信息以便用户发现冲突的源头。 　　冲突通常发生于对 PUT 请求的处理中。例如，在采用版本检查的环境下，某次 PUT 提交的对特定资源的修改请求所附带的版本信息与之前的某个（第三方）请求向冲突，那么此时服务器就应该返回一个409错误，告知用户请求无法完成。此时，响应实体中很可能会包含两个冲突版本之间的差异比较，以便用户重新提交归并以后的新版本。

- 410	被请求的资源在服务器上已经不再可用，而且没有任何已知的转发地址。这样的状况应当被认为是永久性的。如果可能，拥有链接编辑功能的客户端应当在获得用户许可后删除所有指向这个地址的引用。如果服务器不知道或者无法确定这个状况是否是永久的，那么就应该使用404状态码。除非额外说明，否则这个响应是可缓存的。 　　410响应的目的主要是帮助网站管理员维护网站，通知用户该资源已经不再可用，并且服务器拥有者希望所有指向这个资源的远端连接也被删除。这类事件在限时、增值服务中很普遍。同样，410响应也被用于通知客户端在当前服务器站点上，原本属于某个个人的资源已经不再可用。当然，是否需要把所有永久不可用的资源标记为'410 Gone'，以及是否需要保持此标记多长时间，完全取决于服务器拥有者。

- 411	服务器拒绝在没有定义 Content-Length 头的情况下接受请求。在添加了表明请求消息体长度的有效 Content-Length 头之后，客户端可以再次提交该请求。

- 412	服务器在验证在请求的头字段中给出先决条件时，没能满足其中的一个或多个。这个状态码允许客户端在获取资源时在请求的元信息（请求头字段数据）中设置先决条件，以此避免该请求方法被应用到其希望的内容以外的资源上。

- 413	服务器拒绝处理当前请求，因为该请求提交的实体数据大小超过了服务器愿意或者能够处理的范围。此种情况下，服务器可以关闭连接以免客户端继续发送此请求。 　　如果这个状况是临时的，服务器应当返回一个 Retry-After 的响应头，以告知客户端可以在多少时间以后重新尝试。

- 414	请求的URI 长度超过了服务器能够解释的长度，因此服务器拒绝对该请求提供服务。这比较少见，通常的情况包括： 　　本应使用POST方法的表单提交变成了GET方法，导致查询字符串（Query String）过长。 　　重定向URI “黑洞”，例如每次重定向把旧的 URI 作为新的 URI 的一部分，导致在若干次重定向后 URI 超长。 　　客户端正在尝试利用某些服务器中存在的安全漏洞攻击服务器。这类服务器使用固定长度的缓冲读取或操作请求的 URI，当 GET 后的参数超过某个数值后，可能会产生缓冲区溢出，导致任意代码被执行[1]。没有此类漏洞的服务器，应当返回414状态码。

- 415	对于当前请求的方法和所请求的资源，请求中提交的实体并不是服务器中所支持的格式，因此请求被拒绝。

- 416	如果请求中包含了 Range 请求头，并且 Range 中指定的任何数据范围都与当前资源的可用范围不重合，同时请求中又没有定义 If-Range 请求头，那么服务器就应当返回416状态码。 　　假如 Range 使用的是字节范围，那么这种情况就是指请求指定的所有数据范围的首字节位置都超过了当前资源的长度。服务器也应当在返回416状态码的同时，包含一个 Content-Range 实体头，用以指明当前资源的长度。这个响应也被禁止使用 multipart/byteranges 作为其 Content-Type。

- 417	在请求头 Expect 中指定的预期内容无法被服务器满足，或者这个服务器是一个代理服务器，它有明显的证据证明在当前路由的下一个节点上，Expect 的内容无法被满足。

- 421	从当前客户端所在的IP地址到服务器的连接数超过了服务器许可的最大范围。通常，这里的IP地址指的是从服务器上看到的客户端地址（比如用户的网关或者代理服务器地址）。在这种情况下，连接数的计算可能涉及到不止一个终端用户。

- 422	从当前客户端所在的IP地址到服务器的连接数超过了服务器许可的最大范围。通常，这里的IP地址指的是从服务器上看到的客户端地址（比如用户的网关或者代理服务器地址）。在这种情况下，连接数的计算可能涉及到不止一个终端用户。

- 423	请求格式正确，但是由于含有语义错误，无法响应。（RFC 4918 WebDAV）423 Locked 　　当前资源被锁定。（RFC 4918 WebDAV）

- 424	由于之前的某个请求发生的错误，导致当前请求失败，例如 PROPPATCH。（RFC 4918 WebDAV）

- 425	在WebDav Advanced Collections 草案中定义，但是未出现在《WebDAV 顺序集协议》（RFC 3658）中。

- 426	客户端应当切换到TLS/1.0。（RFC 2817）

- 449	由微软扩展，代表请求应当在执行完适当的操作后进行重试。

- 500	服务器遇到了一个未曾预料的状况，导致了它无法完成对请求的处理。一般来说，这个问题都会在服务器的程序码出错时出现。

- 501	服务器不支持当前请求所需要的某个功能。当服务器无法识别请求的方法，并且无法支持其对任何资源的请求。

- 502	作为网关或者代理工作的服务器尝试执行请求时，从上游服务器接收到无效的响应。

- 503	由于临时的服务器维护或者过载，服务器当前无法处理请求。这个状况是临时的，并且将在一段时间以后恢复。如果能够预计延迟时间，那么响应中可以包含一个 Retry-After 头用以标明这个延迟时间。如果没有给出这个 Retry-After 信息，那么客户端应当以处理500响应的方式处理它。 　　注意：503状态码的存在并不意味着服务器在过载的时候必须使用它。某些服务器只不过是希望拒绝客户端的连接。

- 504	作为网关或者代理工作的服务器尝试执行请求时，未能及时从上游服务器（URI标识出的服务器，例如HTTP、FTP、LDAP）或者辅助服务器（例如DNS）收到响应。 　　注意：某些代理服务器在DNS查询超时时会返回400或者500错误

- 505	服务器不支持，或者拒绝支持在请求中使用的 HTTP 版本。这暗示着服务器不能或不愿使用与客户端相同的版本。响应中应当包含一个描述了为何版本不被支持以及服务器支持哪些协议的实体。

- 506	由《透明内容协商协议》（RFC 2295）扩展，代表服务器存在内部配置错误：被请求的协商变元资源被配置为在透明内容协商中使用自己，因此在一个协商处理中不是一个合适的重点。

- 507	服务器无法存储完成请求所必须的内容。这个状况被认为是临时的。WebDAV (RFC 4918)

- 509	服务器达到带宽限制。这不是一个官方的状态码，但是仍被广泛使用。

- 510	获取资源所需要的策略并没有没满足。（RFC 2774）
