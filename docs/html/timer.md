# 浏览器的定时器

## setTimeout 和 setInterval 的区别

setTimeout 和 setInterval 作为前端初学者最熟悉的定时器，基本区别都很明显，一个只发生一次，另一个是按间隔时间定时触发。在很多场合我们都被告知，尽量不要用他们，大致原因是他们计时并不准确，注册的事件或者动画有可能不会按照我们设想那样进行。在 js 的事件循环机制中，定时器属于宏任务，在当前的同步代码和微任务（比如 Promise 的 then 里面的回调发生之前）结束之前，他们就算到了时间，注册的回调也不会进行的。如果一个同步任务耗时较长，那么 setTimeout 和 setInterval 里面注册的动画事件很可能无法按时发生，动画也就无法顺畅进行。

::: demo [vanilla]

```html
<html>
  <div class="timer-demo1">
    <div class="content"></div>
    <button class="btn">点击运行</button>
  </div>
</html>
<script>
  let timerDom1 = document.querySelector(".timer-demo1");
  let btn = timerDom1.querySelector(".btn");
  btn.onclick = run;
  function run() {
    let i = 0;
    while (i < 5000000000) {
      i++;
    }
    setTimeout(() => {
      var content = timerDom1.querySelector(".content");
      content.innerHTML = "Hello World";
    }, 0);
  }
</script>
<style>
  button {
    cursor: pointer;
  }
  .timer-demo1 {
    width: 200px;
    margin: 0 auto;
    text-align: center;
  }
  .timer-demo1 .content {
    height: 30px;
    font-size: 16px;
    line-height: 30px;
    /* pointer: cusor; */
  }
</style>
```

:::

点击上面的按钮，虽然定时器的时间参数是 0(按照标准，不可能真的为 0，只是接近)，但在 while 循环结束前，里面的回调是不会发生。

用setTimeout和setInterval都可以循环的定时任务，但同样的循环任务，发生的时机并不一样， 可以通过下面的两个按钮体验两者差别

::: demo [vanilla]

```html
<html>
  <div class="timer-demo2">
    <div>按f12打开控制台查看打印时间间隔</div>
    <button class="btn1">点击运行setTimeout定时任务</button>
    <button class="btn2">点击运行setInterval定时任务</button>
  </div>
</html>
<script>
  let timerDom1 = document.querySelector(".timer-demo2");
  let btn1 = timerDom1.querySelector(".btn1");
  let btn2 = timerDom1.querySelector(".btn2");
  btn1.onclick = run1;
  btn2.onclick = run2;
  function run1() {
    let n = 4;
    console.time(`${n}`);
    setTimeout(function foo() {
      console.timeEnd(`${n}`);
      for (let i = 0; i < 500000000; i++) {}
      if (--n) {
        console.time(`${n}`);
        setTimeout(foo, 1000);
      }
    }, 1000);
  }
  function run2() {
    let m = 4;
    console.time(`${m}`);
    const id = setInterval(() => {
      console.timeEnd(`${m}`);
      for (let i = 0; i < 500000000; i++) {}
      if (--m === 0) clearInterval(id);
      console.time(`${m}`);
    }, 1000);
  }
</script>
<style>
  .timer-demo2 {
    /* margin: 0 auto; */
    text-align: center;
  }
  .timer-demo1 .btn {
    height: 30px;
    font-size: 16px;
    line-height: 30px;
  }
</style>
```

:::
分别点击上面两个按钮，可以发现，setTimeout实现的定时任务，一个周期的时间间隔大于1000ms，而setInterval实现的定时任务，一个周期的时间间隔除了第一次大于1000ms，后面都小于1000ms

总结：
- 简单来讲setTimeout的延迟时间不包括自身回调所占用的时间 也就是说setTimeout是在上一次回调任务执行之后   才开启的定时
- setInterval的延迟执行时间包含自身回调执行所占用的时间 也就是说setInterval是在上一次回调执行时就   已经开启了定时