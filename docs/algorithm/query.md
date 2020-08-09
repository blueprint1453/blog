# 算法题（一）

## 查找某个数的位置
<br/>
<p>可使用二分法从数组中找出</p>

1. 递归方法

```js
function bindaryFind(arr, target, start = 0, end = arr.length - 1) {
  let n = Math.floor((end + start) / 2)
  if (arr[n] === target) {
    return n
  }
  else if (arr[n] < target) {
    return bindaryFind(arr, target, n + 1, end)
  }
  else if (arr[n] > target) {
    return bindaryFind(arr, target, start, n - 1)
  }
  return -1
}
```

2. while循环

```js
function bindaryFind2(arr, target) {
  let start = 0
  let end = arr.length - 1
  let n
  while(start <= end) {
    n = Math.floor((end + start) / 2)
    if (arr[n] === target) {
      return n
    }
    if (arr[n] < target) {
      start = n + 1
    }
    if (arr[n] > target) {
      end = n - 1
    }
  }
  return -1
}
```


## 二维数组找数字
<br/>
<p>前提：二维数组满足从左到右递增，从上倒下递增，从这样一个二维数组中找到对应的数字</p>
<br/>
<p>思路，定义两个指针x,y，x指向二维数组第一元素（也是数组）的最后一个索引， y指向第一个二维数组第一元素的位置（0）。通过比较目标数字和x,y组合对应的元素的大小决定x,y下一步指向的位置</p>

```js
var arr = [
  [1, 2, 3],
  [2, 3, 4],
  [4, 5, 6],
];

function findIndex(arr, num) {
  let lenX = arr[0].length
  let lenY = arr.length
  let start = arr[0][lenX]
  let x = lenX - 1
  let y = 0
  while(y < lenY && x >= 0) {
    if (arr[y][x] < num) {
      y = y + 1
    } else if (arr[y][x] === num){
      return [y, x]
    } else {
      x = x - 1
    }
  }
}
```

## 斐波那契数列的第n个元素的计算
<br/>
<p>简单的递归方式效率很慢，在数字比较大时会导致浏览器卡死，所以不要简单直接使用递归，必须进行优化</p>

1. 采用缓存优化

```js
function fiboFn(n) {
  let cache = {};
  return function fn(n) {
    let result;
    if (n === 1 || n === 2) {
      result = 1;
    } else {
      result = fn(n - 1) + fn(n - 2);
    }
    cache[n] = result;
    return result;
  };
}

```

2. 采用动态路径规划法

```js
function fiboFn(n) {
  if (n === 1 || n === 2) return 1;
  let a = 1;
  let b = 1;
  let c = 1;
  for (let i = 2; i <= n; i++) {
    a = b;
    b = c;
    c = a + b;
  }
  return c
}
```

## 英文段落中出现频率最高的单词
<br/>
<p>假设有一段如下一段英文，请统计出出现频率最高的单词以及出现次数</p>

```js
var article = `A while back a came across a really nice menu on Madeleine Dalla’s
              incredible website that was infinitely scrollable. I wondered how that was achieved
              and after searching for existing solutions, I found this great demo by Vincent 
              Orback on Codepen.It shows how to pull off that effect with sections on a page.
              I wanted to use his script to make it work for a menu.

              hello world, hello world, hello world, hello world, hello world, hello
              `;
```

<p>思路：</p>

1. 用正则将英文段落切成一个由单词组成的数组
2. 定义表示出现频次最高的单词以及其最大次数的变量-maxWord、maxNum，设置好初始值
3. 遍历数组，使用由单词创建的动态的正则去匹配英文段落，找出当前单词的匹配次数
4. 比较maxNum和当前单词的匹配次数，根据条件决定是否修正maxWord、maxNum的值

```js
function findMostWord(article) {
  let str = article.trim().toLowerCase();
  let wordlist = str.match(/[a-z]+/g);
  let maxNum = 0;
  let maxWord = null;
  let visited = [];
  wordlist.forEach(word => {
    if (visited.indexOf(word) === -1) {
      visited.push(word);
      let reg = new RegExp("\\b" + word + "\\b", "g");
      let count = str.match(reg).length;
      if (count > maxNum) {
        maxNum = count;
        maxWord = word;
      }
    }
  });
  return [maxWord, maxNum];  
};
```

