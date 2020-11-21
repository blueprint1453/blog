## Vue实例的生命周期

- vue组件的生命周期从大的阶段讲，分初始化、模板编译，挂载、更新和销毁几个阶段
- 具体一些来说
 1. 初始化事件和生命周期状态 调用beforeCreate
 2. 完成数据观测和事件绑定 调用created
 3. 判断是否有el属性，有的话在判断有没有template属性，没有的话会等待$mount方法被调用然后判断有没有tempplate属性。下一步就是编译模板，生成ast语法树，ast语法树最后被转化为渲染函数，生成虚拟dom，调用beforeMount
 4. 将虚拟dom转化为真实DOM，将$el属性替换掉el属性，调用mounted

 5. 数据更新，构建新的虚拟DOM，调用beforeupdate方法
 6. 进行新旧虚拟DOM的比对，将差异的部分更新到真实的dom上，调用updated

 7. 离开页面或者某个路由，调用beforedestroyed

 8. 解除数据观测,事件侦听、删除子组件等，调用destroyed


## vue组件通信

- props和$emit

- 公共vue事件总线，通过vue实例的$emit和$on方法

- vuex 全局状态管理

- $attrs和$listeners
  1. $attrs存放的是父组件的非props属性， (class 和 style 除外)，并且可以通过 v-bind="$attrs" 传   入内部组件。通常配合 interitAttrs 选项一起使用。
  2. $listeners存放的是父组件中的绑定的非原生事件， 它可以通过 v-on="$listeners" 传入内部组件


- provide和inject
1. 主要解决了跨级组件间的通信问题，不过它的使用场景，主要是子组件获取上级组件的状态，跨级组件间建立   了一种主动提供与依赖注入的关系
2. 注意是非响应式的

- $parent和$children和$refs




## -----------------------------------分割线---------------------------------

## vue的虚拟DOM的了解，虚拟DOM diff算法的了解
- [VirtualDOM与diff(Vue实现)](https://github.com/answershuto/learnVue/blob/master/docs/VirtualDOM%E4%B8%8Ediff(Vue%E5%AE%9E%E7%8E%B0).MarkDown)

- 虚拟dom是对真实Dom的一层抽象，用js对象去描述dom的树状结构，用属性去描述dom节点的特性。
- 虚拟的dom的好处有
1. 有了虚拟dom，更新渲染就可以先进行虚拟dom的比对，实现最小化差异的更新dom，而不是整个一大块dom的替换
2. 有了虚拟dom，框架和库本身就从浏览器平台相对的对立出来，通过适配层支持跨平台的开发

- vue 虚拟dom diff
1. 只比较同层级的节点，只有相同节点才会进行比对决定是否复用，否则就进行创建或删除节点的操作
   备注（相同节点的依据是 key、tag、isComment相同， 是否data都有定义、标签是<input>的时候，type必须相同）
2. 新旧节点的子节点比较基本原理，定义了两对头尾指针、通过比较不断向中间收缩，当头尾触碰后表示比较结束

## -----------------------------------分割线---------------------------------
## 说说对vuex的了解
[Vuex源码解析](https://github.com/answershuto/learnVue/blob/master/docs/Vuex%E6%BA%90%E7%A0%81%E8%A7%A3%E6%9E%90.MarkDown)
- vuex响应式的实现原理
1. vuex内部创建了一个vue实例，这个vue实例的data中有一个属性指向了将store的state对象，利用vue的响应式特性，state必然也实现了响应式，还有一个computed属性对象，这个对象存放了state中所有的属性，这些属性都使用了defineProperty进行了重写，所有对store.getter的属性访问都会从vue实例的属性中返回




## -----------------------------------分割线---------------------------------
## 说说对vue-router的原理
[前端路由简介以及vue-router实现原理](https://zhuanlan.zhihu.com/p/37730038)

- 前端路由分为hash模式和history模式两种

- hash模式
  1. 浏览器地址栏的#后面部分称为hash,hash部分的改变不会导致页面的刷新，浏览器也不会去向服务器发送请求，但是会触发hashChange事件，所以我们可以监听这个事件，根据对应的hash路径的改变去渲染对应的视图
  
  ```js
  function matchAndUpdate () {
    // todo 匹配 hash 做 dom 更新操作
  }
  window.addEventListener('hashchange', matchAndUpdate)
  ```

- history模式
[vue-router history模式的实现原理](https://www.jianshu.com/p/557f2ba86892)
  1. history模式原理跟hash模式类似，使用了pushState和replaceState两个api实现url的跳转，并且不会引起浏览器的刷新，也不会向服务器发起请求，修改浏览器地址的同时更新对应的视图。当浏览器前进或后退、或者刷新页面的时候，由popstate来做当前页，上一页等页面的记录和绘制。
  2. 调用pushState和replaceState两个api，不会触发popstate变化，页面本身也不会变化，只是浏览器地址栏会发生更新，且浏览器的回退按钮变成了可点击状态！


## -----------------------------------分割线---------------------------------
## keep-alive组件的原理
[前端路由简介以及vue-router实现原理](https://zhuanlan.zhihu.com/p/37730038)
[聊聊keep-alive组件的使用及其实现原理](https://github.com/answershuto/learnVue/blob/master/docs/%E8%81%8A%E8%81%8Akeep-alive%E7%BB%84%E4%BB%B6%E7%9A%84%E4%BD%BF%E7%94%A8%E5%8F%8A%E5%85%B6%E5%AE%9E%E7%8E%B0%E5%8E%9F%E7%90%86.MarkDown)


## -----------------------------------分割线---------------------------------
## 说说vue和react的区别
1. 数据的reactivity，vue在数据更新后会自动更新视图，react要手动调用setState更新
2. 代码组织方式 vue主要采用模板开发视图，更符合传统的html开发习惯，单文件组件中同时包含了视图、逻辑和样式的代码，而react采用jsx表示视图，react中一切皆组件
3. react推崇函数式编程理念，强调数据的不可变性
