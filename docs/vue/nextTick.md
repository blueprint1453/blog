## 实现一个简单vue响应式系统-完善（五）

### vue 的更新机制以及 nextTick
    <p>vue文档和很多讲解vue的文章都会提到vue的更新机制</p>
    <p>Vue 在更新 DOM 时是异步执行的。Vue 将开启一个队列，只要侦听到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更。如果同一个 watcher 被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作是非常重要的。然后，在下一个的事件循环“tick”中，Vue 刷新队列并执行实际 (已去重的) 工作。</p>
    
    
### 异步更新

```js
let watchersQuen = [];
let waiting = false;

const nextTick = (function() {
  let callbacks = [];
  let pending = false;
  let timeFn = null;
  let timeFnHandler = null;

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
  } else if (MutationObserver !== undefined) {
    let counter = 0;
    let textNode = document.createTextNode(String(counter));
    let observer = new MutationObserver(timeFnHandler);
    observer.observe(textNode, {
      characterData: true
    });
    timeFn = () => {
      textNode.data = String(++counter);
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

const flushWatchers = () => {
  console.log("flushWatchers ", watchersQuen);
  for (let i = 0; i < watchersQuen.length; i++) {
    let watcher = watchersQuen[i];
    if (watcher.user) {
      watcher.triggerCb();
    } else {
      watcher.value = watcher.getValue();
    }
  }
  waiting = false;
  watchersQuen = [];
};

function quenWatchers(watcher) {
  if (!watchersQuen.find(wq => wq.id === watcher.id)) {
    watchersQuen.push(watcher);
  }
  if (!waiting) {
    waiting = true;
    nextTick(flushWatchers);
  }
}
```

### watcher 代码

```js
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
    // if (this.lazy) {
    //   this.dirty = true
    // } else if (this.user) {
    //   this.triggerCb()
    // } else {
    //   this.value = this.getValue()
    // }

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
