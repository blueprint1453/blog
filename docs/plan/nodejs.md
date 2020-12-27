
## nodejs 的事件循环

1. 宏任务优先级
- 主代码块 => setImmedaite => messageChannel => setTimeout
- setImmediate指定的回调函数，总是排在setTimeout前面

2. 微任务优先级
- processNextTick => promise => MutationObserver