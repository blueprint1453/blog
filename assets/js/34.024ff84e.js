(window.webpackJsonp=window.webpackJsonp||[]).push([[34],{391:function(t,e,s){"use strict";s.r(e);var a=s(19),r=Object(a.a)({},(function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h1",{attrs:{id:"一面"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#一面"}},[t._v("#")]),t._v(" 一面")]),t._v(" "),s("ol",[s("li",[s("p",[t._v("讲项目遇到的问题和难点")])]),t._v(" "),s("li",[s("p",[t._v("cdn有了解过吗，它的架构是怎么样的")])]),t._v(" "),s("li",[s("p",[t._v("跨域问题如何解决")])])]),t._v(" "),s("ul",[s("li",[s("p",[t._v("cors 跨域资源共享 后端设置")])]),t._v(" "),s("li",[s("p",[t._v("代理  nginx和服务端接口转发")])])]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[t._v("  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// nginx解决跨域配置实例 http://192.168.1.100:8080/api为前缀的请求都会被转发到")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// http://ni.hao.sao/api下")]),t._v("\n  server"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      listen "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("8888")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n      server_name  "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("192.168")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v(".1")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v(".100")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n      location "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n          proxy_pass http"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("192.168")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v(".1")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v(".100")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("8080")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n      location "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("api"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n          proxy_pass http"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("ni"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("hao"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("sao"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("api"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("ul",[s("li",[s("p",[t._v("postmessage和onmessage 跨文档通信api window和ifranme、Web Worker 和 Service Work 进行通信都是用的 postmessage")])]),t._v(" "),s("li",[s("p",[t._v("jsonp 利用script标签不受同源策略的限制，原理是在客户端定义好回调方法，并添加到请求的\n参数中，服务端接受请求后将数据和回调名返回给客户端，客户端拿到响应结果后就可以执行了。")])]),t._v(" "),s("li",[s("p",[t._v("Websocket WebSocket根本不附属于同源策略，而且它本身就有意被设计成可以跨域的一个手段，对于WebSocket的跨域检测工作就交给了服务端")])])]),t._v(" "),s("h2",{attrs:{id:"cors的设置"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#cors的设置"}},[t._v("#")]),t._v(" cors的设置")]),t._v(" "),s("ol",[s("li",[s("p",[t._v("Access-Control-Allow-Origin 指示请求的资源能共享给哪些域")])]),t._v(" "),s("li",[s("p",[t._v("Access-Control-Allow-Credentials ： 指示当请求的凭证标记为 true 时，是否响应该请求。")])]),t._v(" "),s("li",[s("p",[t._v("Access-Control-Allow-Headers 用在对预请求的响应中，指示实际的请求中可以使用哪些 HTTP 头。")])]),t._v(" "),s("li",[s("p",[t._v("Access-Control-Allow-Methods： 指定对预请求的响应中，哪些 HTTP 方法允许访问请求的资源。")])]),t._v(" "),s("li",[s("p",[t._v("Access-Control-Expose-Headers 指示哪些 HTTP 头的名称能在响应中列出。")])]),t._v(" "),s("li",[s("p",[t._v("什么是简单请求和复杂请求")]),t._v(" "),s("ul",[s("li",[t._v("不会触发 CORS 预检的，就是简单请求。如果一个请求满足是get、post和header之一，并且content-type类型是application/x-www-form-urlencoded、text/plain、multipart/form-data三者之一，请求头的字段类型是 Accept、Accept-Language、Content-Language、Content-Type， 就是一个简单请求，反之就是复杂请求，")]),t._v(" "),s("li",[t._v("复杂请求会触发预检 必须在正式发送请求前先发送一个OPTIONS方法的请求已得到服务器的同意，若没有得到服务器的同意，浏览器不会发送正式请求；")])])]),t._v(" "),s("li",[s("p",[t._v("不同域名下两个网站进行服务请求法人cookie携带的问题，问蒙了不清楚这个")])]),t._v(" "),s("li",[s("p",[t._v("https的进行的流程\n参考文章"),s("a",{attrs:{href:"https://zhuanlan.zhihu.com/p/56663184",target:"_blank",rel:"noopener noreferrer"}},[t._v("HTTPS原理和通信流程"),s("OutboundLink")],1)]),t._v(" "),s("ul",[s("li",[t._v("https相当于http+ssl/tsl，所以https请求也是会经历tcp三次握手，然后才是https协议的加密协议过程")]),t._v(" "),s("li",[t._v("http的缺陷 http是明文传输，容易被窃取。 不会校验数据完整性和可靠性，如果数据在传输中被篡改，接收方是无法验证数据跟发送方的是否一致")]),t._v(" "),s("li",[t._v("对称加密 加密和解密的秘钥是同一个秘钥，对称加密的优点是速度快，破解的难度跟秘钥的大小成正比。对称加密双方必须约定好加密规则，对于不同合作者要使用不同的秘钥。")]),t._v(" "),s("li",[t._v("分对称加密 加密的秘钥是成对的，私钥自己保存，公钥发给通信的另一方。加密时用其中一个加密，解密时需要使用另外一个秘钥解密。")]),t._v(" "),s("li",[t._v("对称加密需要把秘钥发送给对方，中间会有泄露风险。非对称加密因为密钥是成对的，加密和解密用的是不同的秘钥，相对更加安全。非对称加密的公钥可以公布在网络中，任何人拿着公钥是都可以和你进行通信。")]),t._v(" "),s("li",[t._v("非对称加密的缺点在于速度慢，所以实际上https使用混合加密方式。混合加密是用非对称加密的方式交换双方的对称加密秘钥，交换对称加密秘钥之后双方再用 对称加密的方式进行通信。")]),t._v(" "),s("li",[t._v("数字证书 结局身份伪装问题 数字证书是由第三方颁发 服务端会向第三方申请认证证书，客服端在跟服务器进行通信的时候，会向服务器请求该证书，服务器发送给客户端后，客户端可以去第三方机构验证该证书的合法性。")]),t._v(" "),s("li",[t._v("数字签名 解决数据篡改问题 对需要发送的数据使用hash算法生成摘要 主要目的是确认数据的完整性 对摘要进行签名的目的主要是对确认数据发送人的身份，签名技术是使用非对称加密的原理")])])])]),t._v(" "),s("ul",[s("li",[s("p",[t._v("具体过程如下")]),t._v(" "),s("ol",[s("li",[t._v("服务端有一对自己的公钥和私钥 服务端把自己的公钥(key1)发送给第三方机构，申请证书。")]),t._v(" "),s("li",[t._v("证书颁发机构自己也有一对公钥私钥。机构利用自己的私钥来加密Key1，生成一个证书签名,\n证书签名同样经过机构的私钥加密,证书制作完成后，机构把证书发送给了服务端。")]),t._v(" "),s("li",[t._v("当客户端向服务端请求通信的时候，服务端不再直接返回自己的公钥（Key1），而是把自己申请的证书返回给客户端。")]),t._v(" "),s("li",[t._v("客户端收到证书以后,会向浏览器和系统内置的第三方证书机构验证证书的真伪")]),t._v(" "),s("li",[t._v("客户端对证书验证成功后，就可以放心地再次利用机构公钥，解密出服务端的公钥Key1")]),t._v(" "),s("li",[t._v("客户端生成自己的对称加密密钥Key2，并且用服务端公钥Key1加密Key2，发送给服务端。")]),t._v(" "),s("li",[t._v("服务端用自己的私钥解开加密，得到对称加密密钥Key2。于是客户端与服务端开始用Key2进行对称加密的通信。")])])]),t._v(" "),s("li",[s("p",[t._v("证书颁发以及验证的具体过程")]),t._v(" "),s("ol",[s("li",[s("p",[t._v("服务端人员使用RSA算法生成两个密钥，一个用来加密一个用来解密。将负责加密的那个密钥公布出去，所以我们称之为公钥(Public Key)，而用来解密的那个密钥，不能对外公布，只有服务端持有，所以我们称之为私钥(Private Key)。服务端在将Public Key进行分发证书之前需要向CA机构申请给将要分发的公钥进行数字签名。(服务器公钥负责加密，服务器私钥负责解密)")])]),t._v(" "),s("li",[s("p",[t._v("生成数字签名公钥证书：对于CA机构来说，其也有两个密钥，我们暂且称之为CA私钥和CA公钥。CA机构将服务端的Public Key作为输入参数将其转换为一个特有的Hash值。然后使用CA私钥将这个Hash值进行加密处理，并与服务端的Public Key绑定在一起，生成数字签名证书。其实数字签名证书的本质就是服务端的公钥+CA私钥加密的Hash值。(CA私钥负责签名，CA公钥负责验证)")])]),t._v(" "),s("li",[s("p",[t._v("服务器获取到这个已经含有数字签名并带有公钥的证书，将该证书发送给客户端。当客户端收到该公钥数字证书后，会验证其有效性。大部分客户端都会预装CA机构的公钥，也就是CA公钥。客户端使用CA公钥对数字证书上的签名进行验证，这个验证的过程就是使用CA公钥对CA私钥加密的内容进行解密，将解密后的内容与服务端的Public Key所生成的Hash值进行匹配，如果匹配成功，则说明该证书就是相应的服务端发过来的。否则就是非法证书。")])])])])]),t._v(" "),s("ol",{attrs:{start:"7"}},[s("li",[t._v("浏览器缓存问题\n"),s("ul",[s("li",[t._v("根据浏览器有没有跟服务器通信， 分为强缓存和协商缓存， 强缓存优先于协商缓存。")]),t._v(" "),s("li",[t._v("强缓存控制字段有cache-control，expire，cache-control优先于expire，强缓存命中的话不会跟服务器通信")]),t._v(" "),s("li",[t._v("协商缓存控制字段有etag/if-modified-since和last-modified/if-modified-since,前者优先级更高。协商缓存需要跟服务器进行通信")]),t._v(" "),s("li",[t._v("chome浏览器的控制台中，我们可以看到缓存具体获取的位置。有from-memory和from-disk两种。from-memory一般是按f5刷新时可以看到，而from-disk一般是页面关闭后又从新打开时可以看到，在火狐浏览器中，并没有具体显示缓存获取位置，只提示来自于缓存")])])])]),t._v(" "),s("h2",{attrs:{id:"cache-control具体值的含义"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#cache-control具体值的含义"}},[t._v("#")]),t._v(" cache-control具体值的含义")]),t._v(" "),s("ul",[s("li",[t._v("max-age: 诉浏览器端或者中间者，响应资源能够在它被请求之后的多长时间以内被复用")]),t._v(" "),s("li",[t._v("s-maxage s-maxage 与上文提到的max-age类似，这里的“s”代表共享，并且，这个指令一般仅用于CDNs或者其他中间者（intermediary caches）。这个指令会覆盖max-age和expires响应头。")]),t._v(" "),s("li",[t._v("public 允许被任何中间者（可能是代理服务器、类似于 cdn 网络）缓存,令通常不需要在响应头中用到，因为其他指令已经表明了响应资源是否可以被缓存（例如：max-age）")]),t._v(" "),s("li",[t._v("private 指令表示响应资源仅仅只能被获取它的浏览器端缓存")]),t._v(" "),s("li",[t._v("no-cache 走协商缓存，向服务器进行通信，检查有没有失效")]),t._v(" "),s("li",[t._v("no-store 禁止缓存 处理隐私信息（private information）的时候，这是一个重要的特性")])]),t._v(" "),s("ol",{attrs:{start:"8"}},[s("li",[s("p",[t._v("问了一些vue的细节问题")])]),t._v(" "),s("li",[s("p",[t._v("react-redux中conenct的实现原理")])]),t._v(" "),s("li",[s("p",[t._v("http1.0、 http1.1 和http2的区别")])])]),t._v(" "),s("ul",[s("li",[t._v("HTTP1.0默认是短连接，每次与服务器交互，都需要新开一个连接！")]),t._v(" "),s("li",[t._v("HTTP1.1默认是持久化连接！建立一次连接，多次请求均由这个连接完成")]),t._v(" "),s("li",[t._v("在HTTP1.0中，发送一次请求时，需要等待服务端响应了才可以继续发送请求。")]),t._v(" "),s("li",[t._v("在HTTP1.1中，发送一次请求时，不需要等待服务端响应了就可以发送请求了，但是回送数据给客户端的时候，客户端还是需要按照响应的顺序来一一接收")]),t._v(" "),s("li",[t._v("http2.0 实现了多路复用，同时在一个连接上并行执行。某个请求任务耗时严重，不会影响到其它连接的正常执行")]),t._v(" "),s("li",[t._v("HTTP1.1新改动 持久连接、请求管道化、增加缓存处理、增加Host字段、支持断点传输等")]),t._v(" "),s("li",[t._v("http2.0新增了二进制分帧、多路复用、头部压缩、服务器推送等")])]),t._v(" "),s("ol",{attrs:{start:"11"}},[s("li",[t._v("http的长连接概念")])]),t._v(" "),s("ul",[s("li",[t._v("HTTP协议的长连接和短连接，实质上是TCP协议的长连接和短连接")]),t._v(" "),s("li",[t._v("在使用长连接的情况下，当一个网页打开完成后，客户端和服务器之间用于传输HTTP数据的TCP连接不会关闭，如果客户端再次访问这个服务器上的网页，会继续使用这一条已经建立的连接。Keep-Alive不会永久保持连接，它有一个保持时间")]),t._v(" "),s("li",[t._v("TcP属于应用层协议，在传输层使用TCP协议，在网络层使用IP协议。IP协议主要解决网络路由和寻址问题，TCP协议主要解决如何在IP层之上可靠的传递数据包，使在网络上的另一端收到发端发出的所有包，并且顺序与发出顺序一致。TCP有可靠，面向连接的特点。")])]),t._v(" "),s("ol",{attrs:{start:"12"}},[s("li",[t._v("websocket连接的过程")])]),t._v(" "),s("ul",[s("li",[s("p",[t._v("websocket实现了一个双向通道，客户端和服务器都可以主动向对方发送消息。在任何一方断开前会一直保持连接状态")])]),t._v(" "),s("li",[s("p",[t._v("WebSocket协议一旦建议后，互相沟通所消耗的请求头是很小的")])]),t._v(" "),s("li",[s("p",[t._v("通过http协议建立通道，然后在此基础上用真正的WebSocket协议进行通信，所以WebSocket协议和http协议是有一定的交叉关系的")])]),t._v(" "),s("li",[s("p",[t._v("websocket连接的请求头中有几个http请求没有的字段")])])]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[t._v("Connection"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v("Upgrade\nUpgrade"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v("websocket\nSec"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("WebSocket"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("Extensions"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v("permessage"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("deflate"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" client_max_window_bits\nSec"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("WebSocket"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("Key"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v("mg8LvEqrB2vLpyCNnCJV3Q"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("==")]),t._v("\nSec"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("WebSocket"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("Version"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("13")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 1. Connection和Upgrade字段告诉服务器，客户端发起的是WebSocket协议请求")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 2. Sec-WebSocket-Extensions表示客户端想要表达的协议级的扩展")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 3. Sec-WebSocket-Key是一个Base64编码值，由浏览器随机生成")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 4. Sec-WebSocket-Version表明客户端所使用的协议版本")]),t._v("\n")])])]),s("ul",[s("li",[t._v("而得到的响应头中重要的字段")])]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[t._v("Status Code"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("101")]),t._v(" Switching Protocols\nConnection"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v("Upgrade\nUpgrade"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v("websocket\nSec"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("WebSocket"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("Accept"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v("AYtwtwampsFjE0lu3kFQrmOCzLQ"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 101 Switching Protocols 并且http请求完成后响应的状态码为101，表示切换了协议，说明WebSocket协议通过http协议来建立运输层的TCP连接，之后便与http协议无关了。")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Connection和Upgrade字段与请求头中的作用相同")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Sec-WebSocket-Accept表明服务器接受了客户端的请求")]),t._v("\n\n")])])])])}),[],!1,null,null,null);e.default=r.exports}}]);