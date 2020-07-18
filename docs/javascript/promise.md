# promise 的实现

## 01-构造函数和简单版的 then 方法

```javascript
const PENDING = "pending";
const FULLFILLED = "fulfilled";
const REJECTED = "rejected";

function MyPromise(executor) {
  this.status = PENDING;
  this.value = undefined;
  this.reason = undefined;
  that.onFulfilledCallbacks = [];
  that.onRejectedCallbacks = [];

  const that = this;
  const resolve = function(value) {
    that.status = FULLFILLED;
    that.value = value;
    that.onFulfilledCallbacks.forEach(fn => {
      fn(value);
    });
  };

  const reject = function(reason) {
    that.status = REJECTED;
    that.reason = reason;
    that.onRejectedCallbacks.forEach(fn => {
      fn(reason);
    });
  };
  try {
    executor(resolve, reject);
  } catch (error) {
    reject(error);
  }
}

MyPromise.prototype = {
  then(onFulfilled, onRejected) {
    const that = this;
    if (typeof onFulfilled !== "function") {
      onFulfilled = function() {
        return that.value;
      };
    }
    if (typeof onRejected !== "function") {
      onRejected = function() {
        throw that.value;
      };
    }

    if (that.status === PENDING) {
      that.onFulfilledCallbacks.push(onFulfilled);
      that.onRejectedCallbacks.push(onRejected);
    }

    if (that.status === FULLFILLED) {
      onFulfilled(that.value);
    }

    if (that.status === REJECTED) {
      onRejected(that.reason);
    }
  }
};

// 测试then初步
let p1 = new Promise((resolve, reject) => {
  reject(1);
});
p1.then(
  res => {
    console.log(res);
  },
  error => console.log(error)
);

let p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(1);
  }, 1000);
});
p2.then(
  res => {
    console.log(res);
  },
  error => console.log(error)
);
```

## 03-继续完善 then 方法以及增加 resolvePromise 方法

```javascript
const PENDING = "pending";
const FULLFILLED = "fulfilled";
const REJECTED = "rejected";

function MyPromise(executor) {
  this.status = PENDING;
  this.value = undefined;
  this.reason = undefined;
  that.onFulfilledCallbacks = [];
  that.onRejectedCallbacks = [];

  const that = this;
  const resolve = function(value) {
    that.status = FULLFILLED;
    that.value = value;
    that.onFulfilledCallbacks.forEach(fn => {
      fn(value);
    });
  };

  const reject = function(reason) {
    that.status = REJECTED;
    that.reason = reason;
    that.onRejectedCallbacks.forEach(fn => {
      fn(reason);
    });
  };
  try {
    executor(resolve, reject);
  } catch (error) {
    reject(error);
  }
}

MyPromise.prototype = {
  then(onFulfilled, onRejected) {
    const that = this;
    if (typeof onFulfilled !== "function") {
      onFulfilled = function() {
        return that.value;
      };
    }
    if (typeof onRejected !== "function") {
      onRejected = function() {
        throw that.value;
      };
    }

    if (that.status === PENDING) {
      that.onFulfilledCallbacks.push(function() {
        setTimeout(function() {
          onFulfilled(that.value);
        }, 0);
      });

      that.onRejectedCallbacks.push(function() {
        setTimeout(function() {
          onRejected(that.reason);
        }, 0);
      });
    }

    if (that.status === FULLFILLED) {
      setTimeout(function() {
        onFulfilled(that.value);
      }, 0);
    }

    if (that.status === REJECTED) {
      setTimeout(function() {
        onRejected(that.reason);
      }, 0);
    }
  }
};

// 测试then初步
let p1 = new Promise((resolve, reject) => {
  reject(1);
});
p1.then(
  res => {
    console.log(res);
  },
  error => console.log(error)
);

let p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(1);
    console.log("11");
  }, 1000);
});
p2.then(
  res => {
    console.log(res);
  },
  error => console.log(error)
);
```

## 构造函数和简单版的 then 方法

```javascript
const PENDING = "pending";
const FULLFILLED = "fulfilled";
const REJECTED = "rejected";

function MyPromise(executor) {
  this.status = PENDING;
  this.value = undefined;
  this.reason = undefined;
  this.onFulfilledCallbacks = [];
  this.onRejectedCallbacks = [];

  const that = this;
  const resolve = function(value) {
    that.status = FULLFILLED;
    that.value = value;
    that.onFulfilledCallbacks.forEach(fn => {
      fn(value);
    });
  };

  const reject = function(reason) {
    that.status = REJECTED;
    that.reason = reason;
    that.onRejectedCallbacks.forEach(fn => {
      fn(reason);
    });
  };
  try {
    executor(resolve, reject);
  } catch (error) {
    reject(error);
  }
}

MyPromise.prototype = {
  then(onFulfilled, onRejected) {
    const that = this;
    // if (typeof onFulfilled !== 'function') {
    //   onFulfilled = function () {
    //     return that.value
    //   }
    // }
    // if (typeof onRejected !== 'function') {
    //   onRejected = function () {
    //     throw that.value
    //   }
    // }

    if (that.status === PENDING) {
      let p2 = new MyPromise(function(resolve, reject) {
        that.onFulfilledCallbacks.push(function() {
          setTimeout(function() {
            try {
              if (typeof onFulfilled !== "function") {
                resolve(that.value);
              } else {
                let result = onFulfilled(that.value);
                resolvePromise(p2, result, resolve, reject);
              }
            } catch (error) {
              reject(error);
            }
          }, 0);
        });

        that.onRejectedCallbacks.push(function() {
          setTimeout(function() {
            try {
              if (typeof onRejected !== "function") {
                reject(that.reason);
              } else {
                let result = onRejected(that.reason);
                resolvePromise(p2, result, resolve, reject);
              }
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
      });
      return p2;
    }

    if (that.status === FULLFILLED) {
      let p2 = new MyPromise(function(resolve, reject) {
        setTimeout(function() {
          try {
            if (typeof onFulfilled !== "function") {
              resolve(that.value);
            } else {
              let result = onFulfilled(that.value);
              resolvePromise(p2, result, resolve, reject);
            }
          } catch (error) {
            reject(error);
          }
        }, 0);
      });
      return p2;
    }

    if (that.status === REJECTED) {
      let p2 = new MyPromise(function(resolve, reject) {
        setTimeout(function() {
          try {
            if (typeof onRejected !== "function") {
              reject(that.reason);
            } else {
              let result = onRejected(that.reason);
              resolvePromise(p2, result, resolve, reject);
            }
          } catch (error) {
            reject(error);
          }
        }, 0);
      });
      return p2;
    }
  }
};

function resolvePromise(p, prevResult, resolve, reject) {
  if (p === prevResult) {
    return reject(" can not return same promise ");
  }
  if (
    (typeof prevResult !== "object" && typeof prevResult !== "function") ||
    prevResult === null
  ) {
    return resolve(prevResult);
  }
  if (prevResult instanceof MyPromise) {
    try {
      prevResult.then(function(value) {
        resolvePromise(p, value, resolve, reject);
      }, reject);
    } catch (error) {
      reject(error);
    }
  } else if (typeof prevResult == "object" || typeof prevResult == "function") {
    if (typeof prevResult.then === "function") {
      try {
        prevResult.then(function(value) {
          resolvePromise(p, value, resolve, reject);
        }, reject);
      } catch (error) {
        reject(error);
      }
    }
  }
}

// 基本测试
// let p1 = new MyPromise((resolve, reject) => {
//   resolve(1)
// })

// p1.then(res => {
//   console.log('p1 then 1 ', res)
// })
// p1.then(res => {
//   console.log('p1 then 2 ', res)
// })

// let p2 = new MyPromise((resolve, reject) => {
//   reject(2)
// })

// p2.then(res => {
//   // 并不会执行
//   console.log('p2 then 1 ', res)
// }, error => {
//   console.log('p2 error 1 ', error)
// })

// let p3 = new MyPromise((resolve, reject) => {
//   reject(3)
// })

// let p4 = p3.then(res => {
//   // 并不会执行
//   console.log('p3 then')
// })

// p4.then(res => {
//   // 并不会执行
//   console.log('p4 then')
// }, error => {
//   console.log('p4  error', error)
//   return error + 1
// }).then(res => {
//   console.log('p4 then then', res)
// })
// 结果
// p1 then 1  1
//  p1 then 2  1
//  p2 error 1  2
//  p4  error 3
//  p4 then then 4

// 进一步测试
let p5 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(5);
  }, 1000);
})
  .then(res => {
    console.log("p5 then ", res);
    return new MyPromise((resolve, reject) => {
      setTimeout(() => resolve(6));
    }, 1000);
  })
  .then(res => {
    console.log("p5 then then ", res);
    return new MyPromise((resolve, reject) => {
      setTimeout(() => reject(7), 1000);
    });
  })
  .then(
    res => {
      // 不会执行 仅测试
      console.log("p5 then then then", res);
    },
    error => {
      console.log("p5 then then error", error);
    }
  );
```

## 04-Promise类方法和实例方法的实现

```javascript
(MyPromise.prototype.catch = function(onRejected) {
  return this.then(null, onRejected);
}),
  (MyPromise.prototype.finally = function(fn) {
    return this.then(
      function(value) {
        fn();
        return MyPromise.resolve(value);
      },
      function(reason) {
        fn();
        return MyPromise.reject(reason);
      }
    );
  });
MyPromise.resolve = function(value) {
  if (value instanceof MyPromise) {
    return value;
  } else if (
    Object.prototype.toString.call(value) === "[object Object]" &&
    typeof value.then === "function"
  ) {
    return new MyPromise(function(resolve, reject) {
      value.then(resolve);
    });
  } else {
    return new Promise(function(resolve) {
      resolve(value);
    });
  }
};

MyPromise.reject = function(reason) {
  return new Promise(function(resolve, reject) {
    reject(reason);
  });
};

MyPromise.all = function(promises) {
  let results = [];
  let count = 0;
  let len = promises.length;

  return new MyPromise(function(resolve, reject) {
    for (let i = 0; i < len; i++) {
      MyPromise.resolve(promises[i]).then(
        function(value) {
          results.push(value);
          if (++count === len) {
            resolve(results);
          }
        },
        function(reason) {
          return reject(reason);
        }
      );
    }
  });
};

MyPromise.race = function(promises) {
  let len = promises.length;
  return new MyPromise(function(resolve, reject) {
    for (let i = 0; i < len; i++) {
      MyPromise.resolve(promises[i]).then(
        function(value) {
          return resolve(value);
        },
        function(reason) {
          return reject(reason);
        }
      );
    }
  });
};

MyPromise.allSettled = function(promises) {
  let results = [];
  let count = 0;
  let len = promises.length;

  return new MyPromise(function(resolve, reject) {
    for (let i = 0; i < len; i++) {
      MyPromise.resolve(promises[i]).then(
        function(value) {
          results.push({
            status: "fulfilled",
            value: value
          });
          if (++count === len) {
            resolve(results);
          }
        },
        function(reason) {
          results.push({
            status: "rejected",
            value: reason
          });
          if (++count === len) {
            reject(results);
          }
        }
      );
    }
  });
};

MyPromise.any = function(promises) {
  let count = 0;
  let value = undefined;
  let reasons = [];
  return new MyPromise(function(resolve, reject) {
    for (let i = 0; i < len; i++) {
      MyPromise.resolve(promises[i]).then(
        function(value) {
          return resolve(value);
        },
        function(reason) {
          reasons.push(reason);
          if (++count === len) {
            reject(reasons);
          }
        }
      );
    }
  });
};
```
