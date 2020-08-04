## 实现一个简单vue响应式系统-完善（四）

### vue 的更新机制以及 nextTick

<br/>
<p>Vue 在更新 DOM 时是异步执行的，当我们更改一个响应式属性后，其实并不会立刻渲染。更改dom对应的响应式属性后，是无法立即获得对应的dom的新的状态的，必须延迟执行才可以获取。之所以要异步更新dom，因为我们在执行一个任务的时候，会连续更改多个数据，甚至同一个数据都有可能被更改多次，如果这时候还采取同步更新的方式，很可能会出现性能问题。所以更好的方式，就是将当前的同步的任务的更新都缓存起来，在当前的同步任务结束后统一批量更新</p>
<br/>
<p>在vue中实行延迟执行是通过nextTick函数实现，nextTick接受一个回调和一个可选的绑定上下文的对象vue源码中关于nextTick的实现并不复杂，单位了更简单理解，我这里写了一个更简单的nextTick。Promise和setTimeout都可以实现异步的效果，nextTick本质上就是根据具体的环境（浏览器）采用不同的异步api,如果支持Promise那就采用Promise,将要延迟执行的代码放在一个Promise实例的then回调里执行；如果不支持Promsie,那就采用setTimeout方案（vue源码中是Promise=>MutationObserver=>setTimeout这种优先级），将要延迟的回调放在setTimeout里面。</p>

```js
const nextTick = (function() {
  let callbacks = []; // 回调队列
  let pending = false; // 队列开启的标识
  let timeFn = null;   // 异步函数
  let timeFnHandler = null; //回调队列遍历执行的函数

  timeFnHandler = () => {
    for (let i = 0; i < callbacks.length; i++) {
      let fn = callbacks[i];
      fn();
    }
    pending = false;
    callbacks = [];
  };

  if (Promise !== undefined) {
    let p = Promise.resolve();
    timeFn = () => {
      p.then(timeFnHandler).catch(error => console.log(error));
    };
  } else {
    timeFn = () => setTimeout(timeFnHandler, 0);
  }

  return function(cb, context) {
    callbacks.push(() => {
      cb(context);
    });
    if (!pending) {
      pending = true;
      timeFn();
    }
  };
})();
```

### 缓存并刷新watcher队列
<br/>
<p>vue中数据更新后dep会通知相应的watcher去执行更新操作，因为异步更新的原因，实际上不会立刻更新，会将同一时间段的watcher都缓冲在一个队列中，当前同步任务结束后再去刷新缓冲的watcher队列，执行渲染更新的任务。这个异步就是采用nextTick来延迟执行。</p>
<br/>
<p>以下是缓存并刷新watcher队列的简单实现，仅供学习理解，实际的vue源码中要比这复杂的多。</p>

```js
const quenWatchers = (function(){
  let watchers = []; // watcher缓存队列
  let waiting = false; // 是否开启了队列的标识
  // 刷新watcher队列 遍历执行任务
  let flushWatchers = () => {
    console.log("flushWatchers ", watchers);
    for (let i = 0; i < watchers.length; i++) {
      let watcher = watchers[i];
      if (watcher.user) {
        watcher.triggerCb();
      } else {
        watcher.value = watcher.getValue();
      }
    }
    waiting = false;
    watchers = [];
  };
  // 缓存watcher的函数
  return function (watcher) {
    // 队列中已存在的watcher不再重复加入
    if (!watchers.find(wq => wq.id === watcher.id)) {
      watchers.push(watcher);
    }
    if (!waiting) {
      waiting = true;
      nextTick(flushWatchers);
    }
  }
})()
```

### 更新后的watcher 代码
<br/>
<p>watcher代码需要进行部分修改，一个是update方法，当数据更新时，update方法不会立刻执行任务了，而是将开启队列并缓存起来，同步任务结束后才会执行，缓存的对象针对的是render watcher和user watcher, computed watcher因为本身就是惰性求值，不需再做缓冲处理；另外watch选项，有时候我们会只需要监听某个对象的某一个属性，这时候属性的书写会写成'a.b'的形式，这就要去先进行解析读取的操作</p>

```js
// 解析watch选项的访问路径 
function getValueFromKeyPath(vm, keyPath) {
  let keyArr = keyPath.split('.')
  let value = vm
  for (let i = 0; i < keyArr.length; i++) {
    let key = keyArr[i]
    if (typeof value === 'object' && value !== null && key in value) {
      value = value[key]
    }
  }
  return value
}

/**
 *
 * @param {Vue} vm vue实例
 * @param {Function} fn 渲染函数或求值方法 在user watcher中这是那个watch选项中属性名
 * @param {Function} cb 回调方法 在user watcher中会使用到
 * @param {Object} options 选项
 */
function Watcher(vm, fn, cb, options) {
  options = this.options = options || {};
  // 标识是否为computed watcher
  if (options.lazy) {
    this.lazy = !!options.lazy;
  } else {
    this.lazy = false;
  }
  this.dirty = this.lazy;

  // 标识是否为user watcher 即为watch选项创建的watcher
  if (options.user) {
    this.user = !!options.user;
  } else {
    this.user = false;
  }

  this.vm = vm;
  this.fn = fn;
  this.id = wid++;
  this.cb = cb;
  this.deps = [];
  this.depIds = new Set();

  this.value = this.lazy ? undefined : this.getValue();
}

Watcher.prototype = {
  getValue() {
    Dep.target = this
    let value
    if (this.user) {
      let keyPath = this.fn
      value = getValueFromKeyPath(this.vm, keyPath)
    } else {
      value = this.fn.call(this.vm)
    }
    Dep.target = null
    return value
  },
  
  triggerCb() {
    // 在触发user watcher的回调前 要先保存watcher的value属性值，然后在更新watcher的value属性值
    let oldVal = this.value
    let keyPath = this.fn
    let value = this.value = getValueFromKeyPath(this.vm, keyPath)
    try {
      typeof this.cb === 'function' && this.cb.call(vm, value, oldVal)      
    } catch (error) {
      console.log(error)
    }
  },
  addDep(dep) {
    if (!this.depIds.has(dep.id)) {
      this.depIds.add(dep.id)
      this.deps.push(dep)
      dep.addSub(this)
    }
  },
  update() {
    if (this.lazy) {
      this.dirty = true
    } else {
      let that = this
      quenWatchers(that)
    }
  },
  compute() {
    if (this.dirty) {
      this.value = this.getValue()
      this.dirty = false
    }
  }
}
```
