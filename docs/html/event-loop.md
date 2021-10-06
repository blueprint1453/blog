# js的执行机制-事件循环

1. 为什么会有事件循环?
   js引擎是单线程的，为了协调用户交互、渲染、网络事件以及后台脚本任务，必须使用事件循环

2. 事件循环的流程
   1. 从任务队列取出一个宏任务，先执行其中的同步代码
   2. 执行完同步代码后，检查微任务队列，执行微任务，如果微任务当中有另外的微任务，新任务也将执行，
      微任务

3. 进入更新渲染阶段，浏览器并不一定会渲染，需要判断是否需要渲染
   下述情况不会执行渲染操作
   1. 没有任何Dom的操作，或者浏览器判断更新渲染并不会有视觉的改变，
   2. 帧动画回调为空，即requestAnimationFrame回调为空

4. 如果浏览器判断不需要渲染，那么下面的步骤5/6/7/8也不会发生

5. 窗口的大小发生了变化resize事件触发，页面发生了滚动，执行 scroll 事件
6. 执行帧动画回调，也就是 requestAnimationFrame 的回调
7. 执行 IntersectionObserver、MutationObserver 的回调

8. 重新渲染绘制用户界面

9. 检查是否有宏任务和微任务，如果美哦与，则执行空闲周期的算法，执行 requestIdleCallback 的回调函数

几个重要结论：
1. 并不是每个宏任务之间都会有渲染操作，同理每个事件循环之间也是这样
2. requestAnimationFrame的回调事件是在浏览器渲染之前发生
3. requestIdleCallback的回调事件是在浏览器渲染之后发生
4. resize和scroll事件其实自带节流，它只在 Event Loop 的渲染阶段去执行事件