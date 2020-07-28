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
 computed的一个使用场景举例，看如下代码， 我们要获取fullName，通过一个简单的表达式拼接字符串得到。这里fullName依赖了this.firstName和this.lastName两个属性值，那fullName要如何实现类似的响应式机制呢，我们可以简单推导一下。对this.fullName的访问，要触发表达式 this.firstName + ' ' + this.lastName 的计算， 紧接着就会分别触发firstName和lastName两个属性的getter，如果我们创建一个跟fullName的watcher,  这个时候firstName和lastName对应的Dep实例这个时候去收集fullName对应的watcher，这样firstName和lastName任意一个修改，都会通知fullName对应的watcher，watcher可以立即重新计算表达式this.firstName + ' ' + this.lastName，当然也可以选择暂不计算，只标识一个状态，让下一次访问时再去重新求值。

 ```js
  computed: {
    fullName() {
      return this.firstName + ' ' + this.lastName
    }
  },
 ```

按照上面的思路，下面是computed的初始化代码，初始化我们就为computed的每个属性建立对应的watcher，让每个属性的计算代码保存在一个watcher实例中，同时跟data中的属性类似，还要使用defineProperty定义一下每个computed属性的访问器，这里只改getter函数，在getter中去调用当前的computed属性对应的watcher去运行相应的计算代码，setter因为会使用到场景极少，这里不考虑进去。

```js
function initComputed(vm) {
  let computed = vm.options.computed || {}
  // 将computed属性对应watcher在vm的_computedWachers属性中，方便后面通过key值获取
  let watchers = vm._computedWachers = Object.create(null)
  let keys = Object.keys(computed)
  let i = keys.length
  while(i--) {
    let key = keys[i]
    let computeFn = computed[key]
    computeFn = typeof computedItemFn === 'function' ? computeFn : computeFn.get
    // 这里加一个lazy: true的标识，标识这是computed属性
    watchers[key] = new Watcher(vm, computeFn, {lazy: true})
    if (!(key in vm)) {
      defineComputed(vm, key)
    }
  }
}
/**
 * 重写computed属性访问方式
*/
function defineComputed(vm, key) {
  Object.defineProperty(vm, key, {
      enumerable: true,
      configurable: true,
      get: function() {
        // 找到computed属性对应watcher 通过watcher计算出属性的当前值
        // 为了方便 将计算结果也保存在watcher的中
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

## Watcher代码
```js
function Watcher(vm, fn, options) {
  this.options = options = options || {}
  // lazy属性用于标识当前的watcher是computed属性的watcher
  // dirty属性是一个用于实现computed属性惰性更新的标识 为true表示是新鲜的，下次访问要重新计算 相反则不用计算，直接取watcher的value
  /**
   * lazy属性用于标识当前的watcher是computed属性的watcher
   * dirty属性是一个用于实现computed属性惰性更新的标识
   * dirty为true表示是新鲜的, 下次访问要重新计算，更新的值保存在watcher的value属性中
   * dirty为false表示值没有变化,不用计算，直接取出watcher的value属性值即可
  */
  if (options.lazy) {
    this.lazy = !!options.lazy
  } else {
    this.lazy = false
  }
  this.dirty = this.lazy

  this.id = wid++  
  this.vm = vm
  this.fn = fn
  this.deps = []
  this.depIds = new Set()

  this.value = this.lazy ? undefined : this.getValue()
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
```

Dep类以及data响应式的代码不用修改，这里就不单独在拎出来了。下面直接放一个完整的实例代码

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

function Watcher(vm, fn, options) {
  this.options = options = options || {}

  if (options.lazy) {
    this.lazy = !!options.lazy
  } else {
    this.lazy = false
  }
  this.dirty = this.lazy

  this.vm = vm
  this.fn = fn
  this.id = wid++
  this.deps = []
  this.depIds = new Set()

  this.value = this.lazy ? undefined : this.getValue()
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
      return source[key]
    },
    set(newVal) {
      source[key] = newVal
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
    let computedItemFn = computed[key]
    computedItemFn = typeof computedItemFn === 'function' ? computedItemFn : computedItemFn.get
    watchers[key] = new Watcher(vm, computedItemFn, {lazy: true})
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
    new Watcher(vm, vm.options.render)
  }
}

```