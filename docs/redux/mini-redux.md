
从vue切换到到react有一段时间了，对redux这个前端的状态管库在使用react之前就听说了，但是一直没有机会使用，一开始小组内都是用reflux，虽然这些库的原理都大同小异，但是因为reflux用的人实在太少，网上能借鉴的经验实在太少，在这上面踩了不少坑。最近状态管理换到主流的redux了，一上网发现跟redux相关的库挺多的，当时用之前一下子蒙了不知道该如何下手了，趁着后台还在写接口赶紧恶补了一下redux相关的基础知识，终于理清楚redux、react-redux、redux-saga（redux-saga）的区别和关系。并且抽时间看了下redux的源码，同时自己也尝试着去实现redux功能。

<br/>

redux暴露了一下三个重要的API（不常用的略过）

- createStore
- combineReducer
- applyMiddleware

<br/>

其中createStore是用来生成store的函数, 可以接受三个参数，以这样的方式createStore(reducer, initialState, enhencer)
调用，生成的store有dispacth、getState、subscribe等三个方法，在redux中，状态的更新必须是通过store.dispatch方法派发的，经过reducer函数计算后返回一个新的状态。

<br/>

combineReducer是一个高阶函数，他接受一个对象，这个对象的属性对应state的键，对象的值是一个计算state对应属性的值得纯函数，combineReducer返回一个计算新state的函数，也就是我们能说的reducer函数。reducer是一个计算状态的纯函数，接受当前状态和一个action对象，返回新的状态。

<br/>

applyMiddleware是让redux中间件模式得以实现的一个高阶函数，这一块也是redux对大部分新手难以理解的地方，除开redux的中间件的实现部分，其实redux是非常简单的，简单到一个前端新手完全可以自己实现一个基础的redux。

<br/>

下面就是自己实现的一个基础redux，只考虑基础功能createStore，combineReducer两个api的实现，先不考虑中间件模式的问题。当然这中间有些条件判断，比如派发的action必须是一个含有type属性的对象，combineReducer函数的参数是一个对象，这个对象也要检验判断，这些细节先不处理，下面的代码只考虑基础实现

```js
const createStore = function(reducers, initialState) {

  const store = {};   
  let state = initialState; 
  let subscribeCallbacks = [];  // 订阅的任务
  let isDispatch = false;       // 是否在派发更新的标识
  const initialAction = { type: "INIT" }; // 用于初始化的action
  
  const getState = function() {
    return state;
  };
  
  let dispatch = function(action) {
    if (isDispatch) {
      console.error("could not dispatch a action when reducer");
      return;
    }
    try {
      isDispatch = true;
      state = reducers(state, action);
    } catch (error) {
      console.error(error);
    } finally {
      isDispatch = false
    }
    for (let f of subscribeCallbacks) {
      f()
    }
  };
  
  const subscribe = function(fn) {
    let isSubscribe = true;
    subscribeCallbacks.push(fn);
    return function unsubscribe(fn) {
      if (!isSubscribe) return;
      let index = subscribeCallbacks.findIndex(f => f === fn);
      subscribeCallbacks.splice(index, 1);
      isSubscribe = false;
    };
  };
  
  store.dispatch = dispatch;
  store.getState = getState;
  store.subscribe = subscribe;
  <!--调用dispatch初始化状态-->
  store.dispatch(initialAction);
  return store;
};

const combineReducer = reducers => (state, action) => {
  let hasChanged = false
  let keys = Object.keys(reducers)
  let nextState = {}
  keys.forEach(key => {
    let prevValue = state[key]  // 属性的旧值
    let reducer = reducers[key] // 对应属性的处理函数
    let nextValue = reducer(prevValue, action)  // 属性的新值
    nextState[key] = nextValue
    hasChanged = hasChanged || nextValue !== prevValue
  })
  return hasChanged ? nextState : state
}
```

好了，一个基础版的redux实现了，下一步考虑如何去实现redux的中间件模式，返回一个增强的store，先写好基本的代码结构。

```js
const createStore = function(reducer, initialState, enhencer) {
  //  <!--存在enhencer那就用enhencer函数去处理，createStore, reducer, initialState作为enhencer的参数-->
  if（typeof enhencer === 'function') {
    return enhencer(createStore, reducer, initialState)
  }
  // ... 这里省略基础版本的代码....
}
```

接下来该applyMiddleware出场了，这个函数的作用就是生成上面的enhencer，它以不定数量的中间件函数作为参数，返回一个enhencer, applyMiddleware的结构应该是这个样子

```js
const applyMiddleware = function(...middlewares) {
  return function enhencer(createStore, reducer, initialState) {
    // 先生成store 后续再用外层传入的middlewares处理store
    let store = createStore(reducer, initialState)
    // ....
  }
}
```

;redux的中间件是一个函数，本质上是对store.dispatch方法的增强，redux的源码中中间件的实现代码其实并没有多少行代码，难在理解上，[关于它的演化推导过程可以参考这里。](http://cn.redux.js.org/docs/advanced/Middleware.html)。作为redux的扩展，中间件并不是随意写的一个函数，而是一个巧妙的设计。

<br/>

回顾一下上面写的dispatch，store.dispatch派发的每一次更新，主要做了两件事情，一是调用reducer计算出新的state，然后遍历订阅任务去执行

```js
let dispatch = function(action) {
  if (isDispatch) {
    console.error("could not dispatch a action when reducer");
    return;
  }
  try {
    isDispatch = true;
    state = reducers(state, action);
  } catch (error) {
    console.error(error);
  } finally {
    isDispatch = false
  }
  for (let f of subscribeCallbacks) {
    f()
  }
};
```


如果每次dispatch，想追踪记录前后状态变化，执行的代码会是这样的

```js
// <!--middleware1-->
function fn(action) {
  console.log(action, tore.getState())
  store.dispatch(action)
  console.log('next state',store.getState())
}
```

如果还满足不了需求，想再加一些其他任务呢，那就在上面的基础上再包一层，执行的代码会是这样的

```js
// <!--middleware2-->
function fn2(action) {
  console.log(action, tore.getState())
  fn1(action)
  console.log('next state',store.getState())
}
```
上述这种代码设计有一个更形象的术语-洋葱模型，接触过nodejs应该都听说过这种模型，经过上面的这种包装，一个dispatch发出后，那么执行的流程应该是fn2 => fn1 => dispatch => fn1 => fn2，

![](https://user-gold-cdn.xitu.io/2020/5/5/171e56f60c005bc2?w=1152&h=648&f=png&s=9060)
redux设计了这样一种中间件机制通过enhencer函数的处理后，返回的store带有一个新的dispatch，原始的dispatch其实并没有被改变，这个新的dispach，内部代码跟上面的fn2函数的很像，内部保存了第一个中间件要执行的代码以及第二个中间件的代码体的引用，之所以说代码体而不说中间件，那是因为代码体是是中间件执行后返回的函数，并不是中间件本身。最后生成的新dispatch，其实是把要把函数1，函数2, ..., 原来的dispatc串联起来了，只要dispach，就会沿着上面那个洋葱模型示意图的流程去执行代码。光说的太绕了不好理解直接看代码该怎么继续写下去吧。

```js
const applyMiddleware = function(...middlewares) {
  return function enhencer(createStore, reducer, initialState) {
    let store = createStore(reducer, initialState)
    let dispatch = store.dispatch
    /**
     * 调用middleware 让dispatch指向middleware执行后结果，推测middleware返回的应该是一个函数，里面保存了每一个middleware的结果，在最内层保存了原始的dispatch 本质上这就是闭包的应用
     * */
    middlewares.forEach(middleware => {
      dispatch = middleware(dispatch)
    )
    // ...
  }
}
```


考虑到middleware内部很可能会使用store，所以需要传入store，改写成下面这种形式，middleware会是一个更高阶函数

```js
const applyMiddleware = function(...middlewares) {
  return function enhencer(createStore, reducer, initialState) {
    let store = createStore(reducer, initialState)
    let dispatch = store.dispatch
    middlewares.forEach(middleware => {
      // <!--考虑到middleware内部很可能会使用store，所以传入store所以改写成下面这种形式，middleware会是一个更高阶函数-->
      dispatch = middleware(store)(dispatch)
    )
    // ...
  }
}
```


至此middleware的样子基本推导出来了它是一个高级函数，接受store为参数返回一个中间函数，这个函数接受一个函数作为入参，还将返回一个函数，最后返回的函数，其实就是调用dispatch后会执行的代码

```js
// redux中的中间件的基本格式
const middleware = store => next => action => {
  // do something
  let result = next(action)
  // do something
  return result
}
```


最终applyMiddleware函数的代码，在真正的redux的实现中，applyMiddleware是一个三阶高阶函数，比这里的还多包了一层，这里的实现少包了一层，但是结果是一样的

```js
const applyMiddleware = function(...middlewares) {
  return function enhencer(createStore, reducer, initialState) {
    let store = createStore(reducer, initialState)
    let dispatch = store.dispatch
    // ....新的dispatch
    middlewares.forEach(middleware => {
      dispatch = middlewares(store)(dispatch)
    )
    
    return {
        ...store,
        dispatch
    }
  }
}
```