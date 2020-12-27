## react组件的生命周期

react组件的生命周期分为初始化渲染、更新、卸载三个大阶段，具体的执行过程如下

1. 调用构造函数，初始化state

2. 调用componentWillMount, 准备进入渲染阶段

3. 执行render方法，将jsx转化为虚拟DOM

4. 将虚拟DOM映射生成真实DOM，并触发componentDidMount方法


5. 某一时刻，调用setState方法，进入更新渲染流程阶段

6. 调用shouldComponentUpdate，可以在这里指示组件要不要进行更新渲染的操作

6. 调用componentWillUpdate方法

7. 执行render方法，生成新的虚拟DOM

8. 新旧虚拟DOM比对，更新变化的节点 触发componentDidupdate方法

注意5-6讲的是state变化的更新，如果是props变化导致的更新，那么会增加componentWillRecieveProps这个个生命周期方法

9. 组件卸载,触发componentWillUnmount方法

## react 16 之后生命周期的变化

- 挂载阶段
1. constructor
2. static getDerivedStateFromProps (UNSAFE_componentWillMount 不推荐使用)
3. render
4. componentDidMount

- 更新阶段
1. static getDrivedStateFromProps (UNSAFE_componentWillReceiveProps不推荐使用)
2. shouldComponentUpdate
3. render
4. getSnapshotBeforeUpdate  (UNSAFE_componentWillUpdate不推荐使用)
5. componentDidUpdate

- 卸载
componentWillUnmount

- 补充 错误处理
1. static getDrivedStateFromError
2. componentDidCatch

- 新版react生命周期已经不推荐一些生命周期继续使用，原因fiber机制的出现后，componentWillUpdate和componentWillMount可能被调用多次
- fiber机制
1. react在开启更新流程后整个过程是同步的，无法被中断，如果组件树非常庞大，那么会导致整个过程耗时较长，无法及时响应用户的输入。
2. 破解同步更新耗时较长的方式就是把任务进行分片
3. 通过把一个耗死较长的更新任务分片，每执行完一段更新过程，就会把控制权交给负责任务调度的模块，看看有没有优先级更高的任务要做，没有就继续执行，有就去做紧急任务。
4. 维护每一个分片任务的数据结构，就叫fiber
5. React Fiber一个更新过程被分为两个阶段(Phase)：第一个阶段Reconciliation Phase和第二阶段Commit Phase。
6. 在第一阶段Reconciliation Phase，React Fiber会找出需要更新哪些DOM，这个阶段是可以被打断的；
- componentWillMount
- componentWillReceiveProps
- shouldComponentUpdate
- componentWillUpdate

7. 第二阶段Commit Phase，那就一鼓作气把DOM更新完，绝不会被打断。
- componentDidMount
- componentDidUpdate
- componentWillUnmount

8. 在现有的React中，每个生命周期函数在一个加载或者更新过程中绝对只会被调用一次；在React Fiber中，不再是这样了，第一阶段中的生命周期函数在一次加载和更新过程中可能会被多次调用！

[React v16.3之后的组件生命周期函数](https://zhuanlan.zhihu.com/p/38030418)
[React Fiber是什么](https://zhuanlan.zhihu.com/p/26027085)

## -----------------------------------------------------------------------

## setState方法
- setState并不能保证会立即更新，通常情况下会延迟调用。setState会将更新缓冲到一个队列中，将当前的react事件处理程序结束后批量进行更新渲染。

- 之所以要延迟更新，是因为当前的执行环境可能会同时有多次的setState的调用，如果调用setState后立即更新，连续的多次的更新会影响性能。

- 什么情况下同步，什么情况延迟更新呢？
当setState在react的事件处理程序中被调用时，如dom合成事件，生命周期方法中，setState的更新时延迟的
当setState在定时器，网络请求，或promise回调中，setState的更新时同步的，可以立即获取新的state

- setState延迟更新的原理
在setState的内部实现中，会根据一个叫做isBatchingUpdates标识判断是将更新放入队列中还是直接更新，默认情况下isBatchingUpdate是false，但是有一个batchedUpdates方法，他会将isBatchingUpdate设置为true，而react的事件处理程序每次被调用时，都会调用batchedUpdates方法

## 调用 setState 之后发生了什么？
[揭密React setState](https://zhuanlan.zhihu.com/p/43522965)



## -----------------------------------------------------------------------

## react的diff算法原理
- 参考文章 [深入理解React：diff 算法](https://www.cnblogs.com/forcheng/p/13246874.html)

- react diff策略一 Web UI中DOM节点跨层级的移动操作特别少，可以忽略不计，所以react只对虚拟dom树的同一层级进行比对。如果是跨层级的话，只有创建节点和删除节点的操作。

- 相同类型的组件具有类似的dom结构 对于不同类型的组件，默认不需要进行比较操作，直接重新创建。
  对于同类型组件， 通过让开发人员自定义shouldComponentUpdate()方法来进行比较优化，减少组件不必要的比较

- 对于同一层级的一组子节点，通过唯一id区分
当节点处于同一层级时，diff提供三种节点操作：删除、插入、移动。
1. 新的虚拟DOM出现新的节点时，执行插入操作
2. 新的虚拟dom中，某个节点已经改变，执行删除操作
3. 新的dom中，兄弟节点本身没有发生变化，只是兄弟间顺序发生变化，执行移动操作




## -----------------------------------------------------------------------

## 高阶组件
[React 中的高阶组件及其应用场景](https://zhuanlan.zhihu.com/p/61711492?utm_source=wechat_session)
定义 接受组件作为参数，返回新的组件的函数
- 高阶组件是一个纯函数，不应该对输入组件做更改
- 高阶组件应该避免在render方法中使用，因为这样做会导致每次render都重新执行一遍组件的创建操作
- 不能在函数式（无状态）组件上使用 ref 属性，因为它没有实例

 ##高级组件主要有两种形式，属性代理和反向继承##
 1. 属性代理 返回一个继承了react，Component的新组件的高阶组件
 - 操作 props 比如新增props
 - 抽离state 将子件共同的状态的方法抽取到state，然后在高阶组件中合并到props中
 - 通过 ref 访问到组件实例
 - 用其他元素包裹传入的组件 WrappedComponent

 2. 反向继承 返回了一个继承了传入的组件的新组建
 - 操作 state 可以操作传入组件的state，一般不建议做
 - 渲染劫持 对传入组件的渲染进行改写

 ##高阶组件的问题##
 1. 静态方法丢失
 2. ref属性无法透传
 3. 



## -----------------------------------------------------------------------

## 合成事件
- react的事件处理采用合成事件，合成事件是对浏览器原生事件的跨浏览器封装，拥有和浏览器原生事件相同的接口。
- react合成事件采用对象池进行管理，事件处理程序在调用结束后会被回收，其属性会被重置为null，所以异步访问的合成事件某个属性的话会出现无效的情况

- 解决合成事件属性异步访问无效的情况？
  1. 可以使用变量保存方式
  2. 调用e.pesist(),该方法会将合成事件从对象池移除，就不会被回收重置了。但是react 17已经废除了该方法




## react hooks
为复用react组件代码提供的一种方案，在之前主要通过高阶组件和render props来实现,hooks让函数式组建拥有了自己的状态
- react内置了useState,useEffect,useContext等hooks
- useState接受一个初始值，返回一个state和更新state的函数
- useEffect接受一个函数作为参数，会在每次组件渲染后触发
  1. useEffect会在每次渲染前把之前订阅清理掉
  2. useEffect在渲染后延迟更新，不会阻塞ui
  3. useEffect每次渲染都会触发，为了避免每次触发，可以在第二个参数数组中放入其依赖的变量
- useContext接受一个react context对象并返回context的当前值，其值是有上层组件中距离当前组件最近的context的Provider决定

- useReducer useState 的替代方案。它接收一个形如 (state, action) => newState 的 reducer，并返回当前的 state 以及与其配套的 dispatch 方法

- hooks使用规则
1. 只在react函数的顶层使用hooks，不要在循环中、条件语句中和内部函数中使用hooks
2. 只在react函数中调用hooks，不要在普通js函数中使用他们
3. 



## -----------------------------分割线------------------------------------------
## react的性能优化
[浅谈React性能优化的方向](https://zhuanlan.zhihu.com/p/74229420?utm_source=wechat_session)



## -----------------------------分割线------------------------------------------
## 说说对redux




## -----------------------------分割线------------------------------------------
## 说说对react-redux、connect的实现原理
- react-redux将组件分为容器组件和ui组件
  ui组件就是只显示视图的组件，不会涉及到redux api的操作
  容器组件就是包含状态逻辑的组件，会使用redux的api

- react-redux提供了一个Provider组件，其内部通过react context将store往组件树中向下传递
- react-redux 提供了一个connect函数，这是一个高阶函数，其返回值是一个高阶组件，connect
- 可以接受两个参数，分别负责被包裹组件的组件的输入和输出
1. mapStateToProps 第一个参数是一个函数，返回了一个对象，将state映射成props
2. mapDispatchToProps 第二个参数是一个函数，返回一个对象，将用户的输入映射成redux的action
3. connect函数返回的高阶组件内部代码中，订阅了redux store的变化，并且在变化后刷新组件，在render函数返回的组件中注入了mapStateToProp和mapDispatchToProps，这样组件就可以通过props使用他们了




## -----------------------------分割线------------------------------------------
## react context
- context有关的文章
[避免React Context导致的重复渲染](https://zhuanlan.zhihu.com/p/50336226)
[浅谈React性能优化的方向](https://zhuanlan.zhihu.com/p/74229420?utm_source=wechat_session)

- context api
context api 为react应用提供了不需要层层传递props就能在组件数传递数据的方案

- 合理使用context api
context可以穿透React.memo和shouldupdate的比对，一旦context的值发生，会引起context包裹的所有的子组件的重新渲染。所以context api的使用需要遵循一些原则
1. context中只放置必要的、关键的、被大多数组件共享的数据，比如鉴权组价
2. 粗粒度的订阅context，在父组件订阅context，通过props传递给子组件
3. 将context的provider组件封装成独立的组件在使用可以避免不必要的渲染。



## -----------------------------分割线------------------------------------------

## React 中的元素和组件有什么不同
- 元素是不可变的普通对象，用来描述你想要渲染的组件或 DOM 节点。  元素一旦被创建，你就无法更改它的子元素或者属性。一个元素就像电影的单帧：它代表了某个特定时刻的 UI。  
- 组件可以是类或者函数，他将 props 作为输入然后返回一个元素的树形结构作为输出。



