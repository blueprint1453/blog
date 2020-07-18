# js 及浏览器相关的 api 的实现

## apply 和 call 的实现

```javascript
Function.prototype._apply = function(context) {
  context = context || window;
  context.fn = this;
  var args = arguments[1];
  var result = Array.isArray(args) ? context.fn(...args) : context.fn();
  delete context.fn;
  return result;
};

Function.prototype._call = function(context, ...rest) {
  context = context || window;
  context.fn = this;
  var result = context.fn(...rest);
  delete context.fn;
  return result;
};
```

## bind 的实现

```javascript
// 1. 基础版 不考虑new调用
Function.prototype._bind = function() {
  var args = Array.prototype.slice.call(arguments);
  var context = args.shift();
  var fn = this;
  return function() {
    args = Array.prototype.concat.apply(arguments, args);
    fn.apply(context, args);
  };
};

function test() {
  console.log(this.age);
}
var obj = {
  age: 48
};
var bound = test._bind(obj);
bound(); // 48
// 2. 考虑new调用
var newBound = new bound(); // 48
Function.prototype._bind = function() {
  var args = Array.prototype.slice.call(arguments);
  var context = args.shift();
  var fn = this;
  var bound = function() {
    args = Array.prototype.concat.apply(arguments, args);
    // 如果被new调用，this应该bound的实例
    if (this instanceof bound) {
      fn.apply(this, args);
    } else {
      fn.apply(context, args);
    }
  };
  var empty = function() {};
  empty.prototype = this.prototype;
  bound.prototype = new empty();
  /**
   * 这样当new调用fBound后，实例依然能访问fToBind的原型方法
   * 为什么不直接fBound.prototype = this.prototype呢
   * 考虑下将fBound返回后，给fBound添加实例方法的情况
   * 即fBound.prototype.anotherMethod = function() {}
   * 如果将fToBind的原型直接赋值给fBound的原型，添加原型方法就会
   * 污染源方法即fToBind的原型
   */
  return bound;
};
var bound2 = test._bind(obj);
bound2();
var newBound2 = new bound2(); // undefined
// 3.不通过call和apply实现bind

Function.prototype._bind = function() {
  var args = Array.prototype.slice.call(arguments);
  var context = args.shift();
  var fn = this;
  var bound = function() {
    context.fn = fn;
    args = Array.prototype.concat.call(arguments, args);
    if (this instanceof bound) {
      var instance = Object.create(fn);
      instance.fn = fn;
      instance.fn(...args);
      delete instance.fn;
    } else {
      var result = context.fn(...args);
      delete context.fn;
    }
  };
  var empty = function() {};
  empty.prototype = fn.prototype;
  bound.prototype = new empty();
  return bound;
};
var bound3 = test._bind(obj);
bound3();
new bound3();
```

## 模拟实现 new 功能

```javascript
function __new(constructor) {
  var obj = {};
  var args = [].slice.call(arguments, 1);
  obj.__proto__ = constructor.prototype;
  var result = constructor.call(obj, ...args);
  return typeof result === "object" ? result : obj;
}

// test
function Fn(name, age, gender) {
  console.log(name, age, gender);
  this.name = name;
  this.age = age;
  this.gender = gender;
}

Fn.prototype = {
  getName() {
    return this.name;
  }
};

var obj1 = __new(Fn, "jack", 18, "male");
console.log(obj1);
console.log(obj1.getName());
console.log(obj1 instanceof Fn);

// new的其他版本实现
function newFn(Fn, ...rest) {
  let obj = {};
  let symbol = Symbol();
  obj[symbol] = Fn;
  Object.setPrototypeOf(obj, Fn.prototype);
  var result = obj[symbol](...rest);
  delete obj[symbol];
  return result instanceof Object ? result : obj;
}

function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype = {
  getName() {
    return this.name;
  }
};

var person = newFn(Person, "jack", 18);
console.log(person, person.getName());
```

## 模拟实现 instanceof 功能
```javascript
function __instanceof(left, right) {
  let leftObj = left.__proto__;
  let rightPrototype = right.prototype;
  while (true) {
    if (leftobj === null) return false;
    if (leftObj === rightPrototype) {
      return true;
    }
    leftObj = leftobj.__proto__;
  }
}
```

## Object.create的兼容实现
```javascript
Object.__create__1 = function(proto, properties) {
      function Noop () {}
      Noop.prototype = proto
      var obj = new Noop()
      if (properties !== undefined ) {
        if (Object(properties) === properties) {
          Object.defineProperties(obj, properties)
        }
      }
      return obj
    }
    Object.__create__2 = function(proto, properties) {
      var obj = {}
      console.log(obj)
      Object.setPrototypeOf(obj, proto) // o.__proto__ = proto
      if (properties !== undefined ) {
        if (Object(properties) === properties) {
          Object.defineProperties(obj, properties)
        }
      }
      return obj
    }
    var parent = {
      name: 'jack',
      getName: function() {
        return 'name: ' + this.name
      }
    }
    var oo = Object.__create__2(parent)
    console.log(oo)
    console.log(Object.getPrototypeOf(oo) === parent)
```

## 防抖和节流
```javascript
function debounce(fn, delay, immediate) {
  var timer = null
  var isFirst = immediate || false // 标识是否第一次立即执行
  return function(...args) {
    if (isFirst) {
      fn(...args)
      isFirst = false
    }

    if (timer) clearTimeout(timer)

    timer = setTimeout(function() {
      fn(...args)
    }, delay || 200)
  }
}

// content.onmousemove = debounce(count, 500);
// content.onmousemove = debounce(count, 500, true);

function throttle(fn, delay) {
  var timer
  var flag = true
  return function(...args){
    if (!flag) return
    flag = false
    timer = timer = setTimeout(function() {
      fn(...args)
      flag = true
    }, delay || 200)
  }
}

let num = 1;
let content = document.getElementById('content');

function count() {
  content.innerHTML = num++;
};

// content.onmousemove = debounce(count, 500);
// content.onmousemove = debounce(count, 500, true);
content.onmousemove = throttle(count, 400)
```

## ajax封装
```javascript
function ajax(options) {
  let type = (options.type || 'GET').toUpperCase()
  let url = options.url
  let data = options.data
  let params = options.params
  let headers = options.headers || {}

  const xhr = new XMLHttpRequest()
  Object.keys(headers).forEach(key => {
    xhr.setRequestHeader(key, headers[key])
  })
  if (!headers['Content-Type'] && type === 'POST') {
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
  }

  xhr.onreadystatechange = function() {
    if (xhr.readyState !== 4) return
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
      options.success && options.success(xhr.responseText)
    } else {
      typeof options.fail === 'function' && options.fail(xhr.responseText)
    } 
  }

  xhr.error

  if (type === 'GET') {
    url += `?${serializeData(params)}`
    xhr.open(type, options.url)
    xhr.send(null)
  }

  if (type === 'POST') {
    xhr.open(type, url)
    data = serializeData(data)
    xhr.send(data)
  }
}

['get', 'post'].forEach(function(type) {
  ajax[type] = function(options) {
    ajax(options)
  }
});

function serializeData (data) {
  let str = ''
  let arr = []
  for (key in data) {
    arr.push(`${key}=${encodeURIComponent(data[key])}`)
  }
  return `${arr.join('&')}`
}

ajax({
  url: 'http://localhost:5001/get/test',
  type: 'get',
  data: {name: 'jack', password: '123456'},
  success: function(res){
    console.log(res)
  }
})

```

## jsonp请求的封装
```javascript
function jsonp(options) {
  let {url, params, callback, succsess, fail} = options
  let searchStr = ''
  let arr = []
  params = {...params, callback}
  for(key in params) {
    arr.push(`${key}=${params[key]}`)
  }
  url += `?${arr.join('&')}`
  let script = document.createElement('script')
  script.src = url
  document.body.appendChild(script)
  window[callback] = function(data){
    success(data)
    document.body.removeChild(script)
  }
  script.onerror = function(error) {
    typeof fail === 'function' && fail(error)
  }
}

// test 
jsonp({
  url: 'http://localhost:5001/test',
  params: {
    name: 'jack',
    age: 18
  },
  callback: 'callback',
  succsess: function a(data) {
    console.log(data)
  }
})

```

## 测试请求的后台代码
```javascript
const express = require('express')
const app = express()

let whitList = 'http://localhost:5500'
app.use(function(req, res, next) {
  let origin = req.headers.origin
  if (whitList.includes(origin)) {
    // 设置哪个源可以访问我
    res.setHeader('Access-Control-Allow-Origin', origin)
    // 允许携带哪个头访问我
    // res.setHeader('Access-Control-Allow-Headers', 'name')
    // 允许哪个方法访问我
    res.setHeader('Access-Control-Allow-Methods', 'GET')
    res.setHeader('Access-Control-Allow-Methods', 'POST')
    // 允许携带cookie
    res.setHeader('Access-Control-Allow-Credentials', true)
    // 预检的存活时间
    res.setHeader('Access-Control-Max-Age', 6)
    // 允许返回的头
    res.setHeader('Access-Control-Expose-Headers', 'name')
    // if (req.method === 'GET') {
    //   res.end() // OPTIONS请求不做任何处理
    // }
  }
  next()
})

app.get('/test', function(req,res){
  let {callback, name, age} = req.query
  console.log(callback, name, age)
  let result = {msg: 'i love you'}
  res.end(`${callback}('i love you')`)
})

app.get('/get/test', function(req,res){
  let {callback, name, age} = req.query
  console.log(callback, name, age)
  let result = {msg: 'i love you'}
  res.end(result)
})

app.get('/post/test', function(req,res){
  let {callback, name, age} = req.query
  console.log(callback, name, age)
  let result = {msg: 'i love you post'}
  res.end(result)
})

app.listen(5001, () => {
  console.log('app run on port 5001')
})
```
