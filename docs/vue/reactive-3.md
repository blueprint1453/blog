## 实现一个简单vue响应式系统(三)
这篇我们来实现watch属性（侦听器）的功能，可以监测data或者computed属性的变更，当变更发生后，触发注册的事件
基本的思路如下：
- vue实例的创建开始 初始化data选项实现了属性的getter的setter的重写
- 初始化computed选项为每个computed属性创建了对应的watcher
- 初始化watch选项为每个watch属性创建了对应的watcher 创建watcher时访问属性会触发getter，属性对应的Dep实例实现对当前watcher的收集
- 调用$amount方法， 创建渲染watcher，watcher创建时，读取data和computed的属性，触发属性的getter，属性对应的Dep实例实现对当前watcher的收集
- vue实例的创建结束
- 某些属性的值发生了变更，触发setter，对应的Dep实例通知收集的watcher重新计算

###  watch选项初始化
```js
function initWatch(vm) {
  let watch = vm.options.watch || {}
  let wachers = vm._userWatchers = Object.create(null)

  for (let key in watch) {
    let options = watch[key]
    let handler
    if (typeof options === 'function') {
      handler = options
    } else if (typeof options === 'object' && options !== null) {
      handler= options.handler
    }
    let watcher = wachers[key] = new Watcher(vm, key, handler, {user: true})
  }
}
```
### 改造后的Watcher代码
```js
/**
  * 
  * @param {Vue} vm vue实例
  * @param {Function} fn 渲染函数或求值方法 在user watcher中这是那个watch选项中属性名
  * @param {Function} cb 回调方法 在user watcher中会使用到
  * @param {Object} options 选项
  */
function Watcher(vm, fn, cb, options) {
  options = this.options = options || {}
  // 标识是否为computed watcher
  if (options.lazy) {
    this.lazy = !!options.lazy
  } else {
    this.lazy = false
  }
  this.dirty = this.lazy

  // 标识是否为user watcher 即为watch选项创建的watcher
  if (options.user) {
    this.user = !!options.user
  } else {
    this.user = false
  }

  this.vm = vm
  this.fn = fn
  this.id = wid++
  this.cb = cb
  this.deps = []
  this.depIds = new Set()

  this.value = this.lazy ? undefined : this.getValue()
}

Watcher.prototype = {
  getValue() {
    Dep.target = this
    let value
    if (this.user) {
      let key = this.fn
      value = this.vm[key]
    } else {
      value = this.fn.call(this.vm)
    }
    Dep.target = null
    return value
  },
  
  triggerCb() {
    // 在触发user watcher的回调前 要先保存watcher的value属性值，然后在更新watcher的value属性值
    let oldVal = this.value
    let key = this.fn
    let vm = this.vm
    let value = this.value = vm[key]
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
    } else if (this.user) {
      this.triggerCb()
    } else {
      this.value = this.getValue()
    }
  },
  compute() {
    if (this.dirty) {
      this.getValue()
      this.dirty = false
    }
  }
}
```

### 完整的代码示例
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  <div><button id="btn">点击</button></div>
  <div>---------------------------</div>
  <div id="app"></div>
  <script src="./vue.js"></script>
  <script>

    const app = document.querySelector('#app')
    const btn = document.querySelector('#btn')

    let vm = new Vue({
      data() {
        return {
          firstName: 'wale',
          lastName: 'Smith',
          age: 18,
          count: 0
        }
      },
      computed: {
        fullName() {
          return this.firstName + ' ' + this.lastName
        }
      },
      watch: {
        firstName(val, newVal) {
           console.log('watch firstName update ', val, newVal)
           this.count++
        }
      },
      render(h) {
        app.innerHTML = `<div class="user"><span>${this.firstName}: </span><span>${this.age}</span></div>
                         <div> <span>全名: </span><span>${this.fullName}</span></div>
                         <div>数据被修改次数： ${this.count}</div>`
      },
    })

    btn.addEventListener('click', () => {
      for(let i = 0; i < 20; i++) {
        vm.firstName = 'jack' + Math.ceil(Math.random() * 10)
      }
    })

  </script>
</body>
</html>
```

```js

let wid = 0
let did = 0

function Dep() {
  this.subs = []
  this.id = did++
}
Dep.prototype = {
  depend() {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  },
  addSub(watcher) {
    this.subs.push(watcher)
  },
  notify() {
     /**
     * 因为数据更新会触发重新渲染，我们要在render watcher的重新渲染前先让computed watcher和user watcher先进行更新的操作
     * 拷贝一份subs 对拷贝的队列中的watcher进行排序，computed watcher和user watcher先创建，所以id值更小，render watcher的id最大
    */
    let copy = this.subs.slice().sort((a, b) => a.id - b.id)
    copy.forEach(watcher => {
      watcher.update()
    });
  }
}
 
 /**
  * 
  * @param {Vue} vm vue实例
  * @param {Function} fn 渲染函数或求值方法 在user watcher中这是那个watch选项中属性名
  * @param {Function} cb 回调方法 在user watcher中会使用到
  * @param {Object} options 选项
  */
function Watcher(vm, fn, cb, options) {
  options = this.options = options || {}
  // 标识是否为computed watcher
  if (options.lazy) {
    this.lazy = !!options.lazy
  } else {
    this.lazy = false
  }
  this.dirty = this.lazy

  // 标识是否为user watcher 即为watch选项创建的watcher
  if (options.user) {
    this.user = !!options.user
  } else {
    this.user = false
  }

  this.vm = vm
  this.fn = fn
  this.id = wid++
  this.cb = cb
  this.deps = []
  this.depIds = new Set()

  this.value = this.lazy ? undefined : this.getValue()
}

Watcher.prototype = {
  getValue() {
    Dep.target = this
    let value
    if (this.user) {
      let key = this.fn
      value = this.vm[key]
    } else {
      value = this.fn.call(this.vm)
    }
    Dep.target = null
    return value
  },
  
  triggerCb() {
    // 在触发user watcher的回调前 要先保存watcher的value属性值，然后在更新watcher的value属性值
    let oldVal = this.value
    let key = this.fn
    let vm = this.vm
    let value = this.value = vm[key]
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
    } else if (this.user) {
      this.triggerCb()
    } else {
      this.value = this.getValue()
    }
  },
  compute() {
    if (this.dirty) {
      this.value = this.getValue()
      this.dirty = false
    }
  }
}

function Observer(data) {
  let keys = Object.keys(data)
  let i = keys.length
  while(i--) {
    defineReactive(data, keys[i])
  }
}

function defineReactive(data, key) {
  let value = data[key]
  let dep = new Dep()
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get() {
      if (Dep.target) {
        dep.depend()
      }
      return value
    },
    set(newVal) {
      if (value !==  newVal) {
        let oldVal = value
        value = newVal
        observe(value)
        dep.notify(value, oldVal)
      }
    }
  })
  observe(value)
}

function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    enumerable: true,
    configurable:true,
    get() {
      return source[key]
    },
    set(newVal) {
      source[key] = newVal
    }
  })
}

function observe(data) {
  if (typeof data === 'object' && data !== null) {
    data.__ob__ = new Observer(data)
  }
}

function defineComputed(vm, key) {
  Object.defineProperty(vm, key, {
      enumerable: true,
      configurable: true,
      get: function() {
        let watcher = this._computedWachers[key]
        if (watcher) {
          watcher.compute()
        }
        return watcher.value
      },
      set: function() {}
  })
}

function initState(vm) {
  let data = vm.options.data
  data = vm._data = typeof data === 'function' ? data.call(vm) : data || {}
  let keys = Object.keys(data)
  let i = keys.length
  while(i--) {
    proxy(vm, vm._data, keys[i])
  }
  observe(data)
}

function initComputed(vm) {
  let computed = vm.options.computed || {}
  let watchers = vm._computedWachers = Object.create(null)
  let keys = Object.keys(computed)
  let i = keys.length
  while(i--) {
    let key = keys[i]
    let computeFn = computed[key]
    computeFn = typeof computeFn === 'function' ? computeFn : computeFn.get
    watchers[key] = new Watcher(vm, computeFn, function() {}, {lazy: true})
    if (!(key in vm)) {
      defineComputed(vm, key)
    }
  }
}

function initWatch(vm) {
  let watch = vm.options.watch || {}
  let wachers = vm._userWatchers = Object.create(null)

  for (let key in watch) {
    let options = watch[key]
    let handler
    if (typeof options === 'function') {
      handler = options
    } else if (typeof options === 'object' && options !== null) {
      handler= options.handler
    }
    let watcher = wachers[key] = new Watcher(vm, key, handler, {user: true})
  }
}

function Vue(options) {
  this.init(options)
  this.$mount()
}
Vue.prototype = {
  init(options) {
    this.options = options
    let vm = this
    initState(vm)
    if (options.computed) {
      initComputed(vm)
    }
    if (options.watch) {
      initWatch(vm)
    }
  },
  $mount(){
    let vm = this
    new Watcher(vm, vm.options.render, function() {})
  }
}

```