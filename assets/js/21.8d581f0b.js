(window.webpackJsonp=window.webpackJsonp||[]).push([[21],{386:function(t,e,s){"use strict";s.r(e);var o=s(18),a=Object(o.a)({},(function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h1",{attrs:{id:"浏览器相关基础知识"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#浏览器相关基础知识"}},[t._v("#")]),t._v(" 浏览器相关基础知识")]),t._v(" "),s("h2",{attrs:{id:"浏览器从输入url到加载完成-都发生了什么"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#浏览器从输入url到加载完成-都发生了什么"}},[t._v("#")]),t._v(" 浏览器从输入url到加载完成 都发生了什么")]),t._v(" "),s("ul",[s("li",[t._v("1、浏览器地址栏输入url")]),t._v(" "),s("li",[t._v("2、浏览器会先查看浏览器缓存--系统缓存--路由缓存，如有存在缓存，就直接显示。如果没有，接着第三步")]),t._v(" "),s("li",[t._v("3、域名解析（DNS）获取相应的ip")]),t._v(" "),s("li",[t._v("4、浏览器向服务器发起tcp连接，与浏览器建立tcp三次握手")]),t._v(" "),s("li",[t._v("5、握手成功，浏览器向服务器发送http请求，请求数据包")]),t._v(" "),s("li",[t._v("6、服务器请求数据，将数据返回到浏览器")]),t._v(" "),s("li",[t._v("7、浏览器接收响应，读取页面内容，解析html源码，生成DOM树")]),t._v(" "),s("li",[t._v("8、解析css样式、浏览器渲染，js交互")])]),t._v(" "),s("h2",{attrs:{id:"缓存策略"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#缓存策略"}},[t._v("#")]),t._v(" 缓存策略")]),t._v(" "),s("p",[t._v("当我们的资源内容不可复用时，直接为 Cache-Control 设置 no-store，拒绝一切形式的缓存；否则考虑是否每次都需要向服务器进行缓存有效确认，如果需要，那么设 Cache-Control 的值为 no-cache；否则考虑该资源是否可以被代理服务器缓存，根据其结果决定是设置为 private 还是 public；然后考虑该资源的过期时间，设置对应的 max-age 和 s-maxage 值；最后，配置协商缓存需要用到的 Etag、Last-Modified 等参数。")]),t._v(" "),s("h2",{attrs:{id:"http和https的区别"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#http和https的区别"}},[t._v("#")]),t._v(" http和https的区别？")]),t._v(" "),s("p",[t._v("http传输的数据都是未加密的，也就是明文的，网景公司设置了SSL协议来对http协议传输的数据进行加密处理，简单来说https协议是由http和ssl协议构建的可进行加密传输和身份认证的网络协议，比http协议的安全性更高。\n主要的区别如下：\nHttps协议需要ca证书，费用较高。\nhttp是超文本传输协议，信息是明文传输，https则是具有安全性的ssl加密传输协议。\n使用不同的链接方式，端口也不同，一般而言，http协议的端口为80，https的端口为443\nhttp的连接很简单，是无状态的；HTTPS协议是由SSL+HTTP协议构建的可进行加密传输、身份认证的网络协议，比http协议安全")]),t._v(" "),s("ul",[s("li",[s("p",[t._v("https协议的优点\n使用HTTPS协议可认证用户和服务器，确保数据发送到正确的客户机和服务器；\nHTTPS协议是由SSL+HTTP协议构建的可进行加密传输、身份认证的网络协议，要比http协议安全，可防止数据在传输过程中不被窃取、改变，确保数据的完整性。\nHTTPS是现行架构下最安全的解决方案，虽然不是绝对安全，但它大幅增加了中间人攻击的成本。\n谷歌曾在2014年8月份调整搜索引擎算法，并称“比起同等HTTP网站，采用HTTPS加密的网站在搜索结果中的排名将会更高”。")])]),t._v(" "),s("li",[s("p",[t._v("https协议的缺点\nhttps握手阶段比较费时，会使页面加载时间延长50%，增加10%~20%的耗电。\nhttps缓存不如http高效，会增加数据开销。\nSSL证书也需要钱，功能越强大的证书费用越高。\nSSL证书需要绑定IP，不能再同一个ip上绑定多个域名，ipv4资源支持不了这种消耗。")])])]),t._v(" "),s("h2",{attrs:{id:"tcp和udp的区别"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#tcp和udp的区别"}},[t._v("#")]),t._v(" TCP和UDP的区别")]),t._v(" "),s("p",[t._v("（1）TCP是面向连接的，udp是无连接的即发送数据前不需要先建立链接。\n（2）TCP提供可靠的服务。也就是说，通过TCP连接传送的数据，无差错，不丢失，不重复，且按序到达;UDP尽最大努力交付，即不保证可靠交付。 并且因为tcp可靠，面向连接，不会丢失数据因此适合大数据量的交换。\n（3）TCP是面向字节流，UDP面向报文，并且网络出现拥塞不会使得发送速率降低（因此会出现丢包，对实时的应用比如IP电话和视频会议等）。\n（4）TCP只能是1对1的，UDP支持1对1,1对多。\n（5）TCP的首部较大为20字节，而UDP只有8字节。\n（6）TCP是面向连接的可靠性传输，而UDP是不可靠的。")]),t._v(" "),s("p",[t._v("2)WebSocket是什么样的协议，具体有什么优点？\nHTTP的生命周期通过Request来界定，也就是Request一个Response，那么在Http1.0协议中，这次Http请求就结束了。在Http1.1中进行了改进，是的有一个connection：Keep-alive，也就是说，在一个Http连接中，可以发送多个Request，接收多个Response。但是必须记住，在Http中一个Request只能对应有一个Response，而且这个Response是被动的，不能主动发起。\nWebSocket是基于Http协议的，或者说借用了Http协议来完成一部分握手，在握手阶段与Http是相同的。我们来看一个websocket握手协议的实现，基本是2个属性，upgrade，connection。")]),t._v(" "),s("h2",{attrs:{id:"cookie、sessionstorage、localstorage的区别"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#cookie、sessionstorage、localstorage的区别"}},[t._v("#")]),t._v(" Cookie、sessionStorage、localStorage的区别")]),t._v(" "),s("ul",[s("li",[s("p",[t._v("共同点：都是保存在浏览器端，并且是同源的")])]),t._v(" "),s("li",[s("p",[t._v("Cookie：cookie数据始终在同源的http请求中携带（即使不需要），即cookie在浏览器和服务器间来回传递。而sessionStorage和localStorage不会自动把数据发给服务器，仅在本地保存。cookie数据还有路径（path）的概念，可以限制cookie只属于某个路径下,存储的大小很小只有4K左右。 （key：可以在浏览器和服务器端来回传递，存储容量小，只有大约4K左右）")])]),t._v(" "),s("li",[s("p",[t._v("sessionStorage：仅在当前浏览器窗口关闭前有效，自然也就不可能持久保持，localStorage：始终有效，窗口或浏览器关闭也一直保存，因此用作持久数据；cookie只在设置的cookie过期时间之前一直有效，即使窗口或浏览器关闭。（key：本身就是一个回话过程，关闭浏览器后消失，session为一个回话，当页面不同即使是同一页面打开两次，也被视为同一次回话）")])]),t._v(" "),s("li",[s("p",[t._v("localStorage：localStorage 在所有同源窗口中都是共享的；cookie也是在所有同源窗口中都是共享的。（key：同源窗口都会共享，并且不会失效，不管窗口或者浏览器关闭与否都会始终生效）")])]),t._v(" "),s("li",[s("p",[t._v("补充说明一下cookie的作用：\n保存用户登录状态。例如将用户id存储于一个cookie内，这样当用户下次访问该页面时就不需要重新登录了，现在很多论坛和社区都提供这样的功能。 cookie还可以设置过期时间，当超过时间期限后，cookie就会自动消失。因此，系统往往可以提示用户保持登录状态的时间：常见选项有一个月、三个 月、一年等。\n跟踪用户行为。例如一个天气预报网站，能够根据用户选择的地区显示当地的天气情况。如果每次都需要选择所在地是烦琐的，当利用了 cookie后就会显得很人性化了，系统能够记住上一次访问的地区，当下次再打开该页面时，它就会自动显示上次用户所在地区的天气情况。因为一切都是在后 台完成，所以这样的页面就像为某个用户所定制的一样，使用起来非常方便\n定制页面。如果网站提供了换肤或更换布局的功能，那么可以使用cookie来记录用户的选项，例如：背景色、分辨率等。当用户下次访问时，仍然可以保存上一次访问的界面风格。")])]),t._v(" "),s("li",[s("p",[t._v("Cookie如何防范XSS攻击\nXSS（跨站脚本攻击）是指攻击者在返回的HTML中嵌入javascript脚本，为了减轻这些攻击，需要在HTTP头部配上，set-cookie：\nhttponly-这个属性可以防止XSS,它会禁止javascript脚本来访问cookie。\nsecure - 这个属性告诉浏览器仅在请求为https的时候发送cookie。\n结果应该是这样的：Set-Cookie=.....")])]),t._v(" "),s("li",[s("p",[t._v("Cookie和session的区别\nHTTP是一个无状态协议，因此Cookie的最大的作用就是存储sessionId用来唯一标识用户")])])]),t._v(" "),s("h2",{attrs:{id:"xss和csrf安全防御"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#xss和csrf安全防御"}},[t._v("#")]),t._v(" XSS和CSRF安全防御")]),t._v(" "),s("ul",[s("li",[t._v("XSS： 跨站脚本攻击 主要方式是嵌入一段远程或者第三方域上的JS代码，实际上是在目标网站的作用域下执行了这段第三方域上的js代码\n存储型XSS（持久型XSS）\n特点：黑客将XSS代码发送给服务器，然后通过服务器散播")])]),t._v(" "),s("p",[t._v("黑客将XSS代码发送到服务器（不管是数据库、内存还是文件系统等。）\n其他人请求页面的时候就会带上XSS代码了。")]),t._v(" "),s("p",[t._v("案例：最典型的就是留言板XSS。\n黑客提交了一条包含XSS代码的留言到数据库。\n当目标用户查询留言时，那些留言的内容会从服务器解析之后加载出来。\n浏览器发现有XSS代码，就当做正常的HTML和JS解析执行。XSS攻击就发生了。")]),t._v(" "),s("ul",[s("li",[t._v("XSS危害\n通过document.cookie盗取cookie\n使用js或css破坏页面正常的结构与样式\n流量劫持（通过访问某段具有window.location.href定位到其他页面）\nDos攻击：利用合理的客户端请求来占用过多的服务器资源，从而使合法用户无法得到服务器响应。\n利用iframe、frame、XMLHttpRequest或上述Flash等方式，以（被攻击）用户的身份执行一些管理动作，或执行一些一般的如发微博、加好友、发私信等操作。")])]),t._v(" "),s("p",[t._v("XSS攻击可以看出，不能原样的将用户输入的数据直接存到服务器，需要对数据进行一些处理：")]),t._v(" "),s("p",[t._v("过滤危险的DOM节点。如具有执行脚本能力的script, 具有显示广告和色情图片的img,  具有改变样式的link, style, 具有内嵌页面的iframe, frame等元素节点。\n过滤危险的属性节点。如on-, style, src, href等\n对cookie设置httpOnly,但是也会导致前台无法操作cookie，不太推荐。")]),t._v(" "),s("ul",[s("li",[s("p",[t._v("CSRF（Cross-site request forgery），中文名称：跨站请求伪造，攻击者盗用了你的身份，以你的名义发送恶意请求。\n特点：\n登录受信任网站A，并在本地生成Cookie。\n在不登出受信任网站A的情况下，访问危险网站B。\n危险网站会向受信任A的网站发送请求，同时会携带受信任网站A本地生成Cookie(用同一个浏览器访问同一个域的接口)")])]),t._v(" "),s("li",[s("p",[t._v("CSRF的危害")])])]),t._v(" "),s("p",[t._v("篡改目标网站上的用户数据；\n盗取用户隐私数据；\n作为其他攻击向量的辅助攻击手法；\n传播CSRF蠕虫。")]),t._v(" "),s("ul",[s("li",[t._v("CSRF的防御")])]),t._v(" "),s("p",[t._v("验证码，因为验证码必须在受信任的网站上发送给浏览器的，并且伪造的网站和受信任的网站非同源，所以没有办法获取受信任网站发送的session，所以验证码是没有办法伪造的。\nrefer，标识了当前请求的页面的源，伪造网站可以篡改成受信任的网站源，并不保险\ntoken，由于它是通过服务的发送给客户端的令牌，并且存储在浏览器的localstorage中，由于同源策略，并且token还有校验规则，所以token并不能轻易篡改。")]),t._v(" "),s("h2",{attrs:{id:"dom事件"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#dom事件"}},[t._v("#")]),t._v(" DOM事件")]),t._v(" "),s("ul",[s("li",[s("p",[t._v("什么是事件流：事件流描述的是从页面中接收事件的顺序,DOM2级事件流包括下面几个阶段。\n事件捕获阶段\n处于目标阶段\n事件冒泡阶段")])]),t._v(" "),s("li",[s("p",[t._v("dom事件先后顺序：\n根据上述事件的三个阶段， 父子元素分别注册同一事件(如click事件) 事件回调的触发顺序为： 1.父元素事件触发（捕获事件回调） 2.子元素事件触发(根据先后顺序决定触发的先后) 3.父元素事件触发（冒泡事件回调触发）")])])]),t._v(" "),s("h2",{attrs:{id:"事件委托"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#事件委托"}},[t._v("#")]),t._v(" 事件委托")]),t._v(" "),s("p",[t._v("不在事件的发生地（直接dom）上设置监听函数，而是在其父元素上设置监听函数，通过事件冒泡，父元素可以监听到子元素上事件的触发，通过判断事件发生元素DOM的类型，来做出不同的响应。\n事件触发顺序：当点击一个具体的元素，目标元素和其外层元素都绑定了冒泡事件和捕获事件时，执行顺序是外层元素的捕获事件先被触发，并且越外层，捕获越早触发，到了目标元素后，目标元素的捕获事件和冒泡事件顺序根据代码的注册顺序决定，紧接着开始事件冒泡阶段，越外层，其绑定的冒泡事件越后发生。")]),t._v(" "),s("p",[t._v("线程详解参考： https://juejin.im/post/5b67108e5188251aa30c8811")])])}),[],!1,null,null,null);e.default=a.exports}}]);