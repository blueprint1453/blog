# 实现一个简单vue响应式系统(二)
<p>在上一篇文章中，我们只考虑了data中属性，并成功实现了一个极简的响应式的系统，这篇我们考虑引入computed属性，让实现computed属性也实现类似的响应式功能</p>

## Vue类的代码   
<br />

```js
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
  },
  $mount(){
    let vm = this
    new Watcher(vm, vm.options.render, function() {})
  }
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

function observe(data) {
  if (typeof data === 'object' && data !== null) {
    new Observe(data)
  }
}

```
<p>上面的Vue类中的代码中，主要是增加了computed选项的初始化部分，其他部分跟之前一样</p>

## computed的初始化代码
<br />
 computed的一个使用场景举例，看如下代码， 我们通过要获取fullName，通过一个简单的表达式拼接字符串得到，这里fullName依赖了this.firstName和this.lastName两个属性值，这两个属性值在上一步的initState已经实现了getter和setter的改写

 ```js
  computed: {
    fullName() {
      return this.firstName + ' ' + this.lastName
    }
  },
 ```

```js
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
```

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
        }
      },
      computed: {
        fullName() {
          return this.firstName + ' ' + this.lastName
        }
      },
     
      render(h) {
        app.innerHTML = `<div class="user"><span>${this.firstName}: </span><span>${this.age}</span></div>
                        <div> <span>全名: </span><span>${this.fullName}</span></div>`
      },
    })

    
    btn.addEventListener('click', () => {
      vm.firstName = 'jack' + Math.ceil(Math.random() * 10)
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
    this.subs.forEach(watcher => {
      watcher.update()
    });
  }
}

function Watcher(vm, fn, cb, options) {
  this.options = options = options || {}

  if (options.lazy) {
    this.lazy = !!options.lazy
  } else {
    this.lazy = false
  }
  this.dirty = this.lazy

  this.vm = vm
  this.fn = fn
  this.cb = cb
  this.options = options || {}
  this.id = wid++
  this.deps = []
  this.depIds = new Set()

  // this.value = this.lazy ? undefined : this.getValue()
  this.value = undefined
  this.getValue()
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
      let result = this.fn.call(this.vm)
      Dep.target = null
      this.value = result
    })
  },
  addDep(dep) {
    if (!this.depIds.has(dep.id)) {
      this.depIds.add(dep.id)
      this.deps.push(dep)
      dep.addSub(this)
    }
  },
  update() {
    console.log(this.lazy)
    if (this.lazy) {
      this.dirty = true
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

function Observe(data) {
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
        value = newVal
        observe(value)
        console.log(dep)
        dep.notify()
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
    new Observe(data)
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
  },
  $mount(){
    let vm = this
    new Watcher(vm, vm.options.render, function() {})
  }
}

```