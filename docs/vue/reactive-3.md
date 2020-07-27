# 实现一个简单vue响应式系统(三)

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

const watchTypeMap = {
  render: 'render',
  user: 'user',
  computed: 'computed'
}

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
  notify(val, oldVal) {
    this.subs.forEach(watcher => {
      watcher.update(val, oldVal)
    });
  }
}
 /**
  * 
  * @param {Vue} vm vue实例
  * @param {Function} fn 渲染函数或求值方法
  * @param {Function} cb 回调方法 这里其实用不上
  * @param {Object} options 选项
  */
function Watcher(vm, fn, cb, options) {
  options = this.options = options || {}
  if (options.lazy) {
    this.lazy = !!options.lazy
  } else {
    this.lazy = false
  }
  this.dirty = this.lazy

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

  this.value = undefined
  if (!this.lazy && !this.user) {
    this.getValue()
  }
 
  if (this.user) {
    let key = this.fn
    Dep.target = this
    this.value = this.vm[key]
    Dep.target = null
  }
}

Watcher.prototype = {
  getValue() {
    Dep.target = this
    let result = this.fn.call(this.vm)
    Dep.target = null
    this.value = result
  },
  renderTemplate() {
    Promise.resolve().then(() => {
      Dep.target = this
      this.fn.call(this.vm)
      Dep.target = null
    })
  },
  triggerCb() {
    let oldVal = this.value
    let key = this.fn
    let vm = this.vm
    this.value = vm[key]
    try {
      typeof this.cb === 'function' && this.cb.call(vm, this.value, oldVal)      
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
      this.renderTemplate()
    }
  },
  compute() {
    if (this.dirty) {
      this.getValue()
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
      return vm[source][key]
    },
    set(newVal) {
      vm[source][key] = newVal
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
    proxy(vm, '_data', keys[i])
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
    let computedItemFn = computed[key]
    computedItemFn = typeof computedItemFn === 'function' ? computedItemFn : computedItemFn.get
    watchers[key] = new Watcher(vm, computedItemFn, function() {}, {lazy: true})
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
      handler.deep = false
      handler.immediate = false
    } else if (typeof options === 'object' && options !== null) {
      handler= options.handler
      handler.deep = !!options.deep || false
      handler.immediate = !!options.immediate || false
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