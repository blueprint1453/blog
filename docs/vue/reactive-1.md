# 实现一个简单vue响应式系统(一)

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
          age: 18
        }
      },
      render(h) {
        app.innerHTML = `<div class="user"><span>${this.firstName}</span>: <span>${this.age}</span></div>`
      },
    })

    
    btn.addEventListener('click', () => {
      console.log(vm.age)
      vm.age = vm.age + Math.ceil(Math.random()*10)
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
  this.vm = vm
  this.fn = fn
  this.cb = cb
  this.options = options || {}
  this.id = wid++
  this.deps = []
  this.depIds = new Set()
  this.value = this.getValue()
}
Watcher.prototype = {
  getValue() {
    Dep.target = this
    this.fn.call(this.vm)     
    Dep.target = null
  },
  addDep(dep) {
    if (!this.depIds.has(dep.id)) {
      this.depIds.add(dep.id)
      this.deps.push(dep)
      dep.addSub(this)
    }
  },
  update() {
    this.getValue()
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

function Vue(options) {
  this.init(options)
  this.$mount()
}
Vue.prototype = {
  init(options) {
    this.options = options
    let vm = this
    initState(vm)
  },
  $mount(){
    let vm = this
    new Watcher(vm, vm.options.render, function() {})
  }
}

```