# 正则相关的7个方法

## 构造函数-RegExp
<br/>
<p>接受两个参数：第一个参数是匹配模式，可以是字符串也可以是正则表达式；第二个参数是修饰符。</p>
<p>如果第一个参数的正则表达式定义了修饰符，第二个参数又有值，则以第二个参数定义的修饰符为准，这是ES2015的新特性</p>

```js
  new RegExp('abc');
  // /abc/
  new RegExp('abc', 'gi');
  // /abc/gi
  new RegExp(/abc/gi);
  // /abc/gi
  new RegExp(/abc/m, 'gi');
  ```
<p> 我们来看看它的实例属性</p>

1. lastIndex属性。它的作用是全局匹配时标记下一次匹配开始的位置，全局匹配的抓手就是它。
2. source属性。它的作用是存储正则模式的主体。比如/abc/gi中的abc。
3.  对应的修饰符属性。目前有global、ignoreCase、multiline、sticky、dotAll、unicode属性，返回布尔值表明是否开启对应修饰符。
4. flags属性。返回所有的修饰符。


## match
<br/>
<p>是String实例方法，它的作用是根据参数返回匹配结果，接受一个正则表达式或字符串作为唯一参数。</p>
<p>是match方法的返回值可以分为三种情况：</p>

1. 匹配失败 null

2. 非全局匹配 返回一个数组， 数组的第一项是匹配结果
```js
'abc'.match();
// ["", index: 0, input: "abc", groups: undefined]
```

如果正则参数中有捕获组，捕获的结果在数组中从第二项开始依次排列。有捕获组但是没有捕获内容则显示undefined

```js
'@abc2018'.match(/@([a-z]+)([A-Z]+)?/);
// ["@abc", "abc", undefined, index: 0, input: "@abc2018", groups: undefined]
```

3. 全局匹配 返回数组 捕获的若干结果在数组中依次排列
```js
'@abc2018'.match(/[a-z]/g);
// ["a", "b", "c"]
```


## replace
<br/>

<p>replace是String实例方法， 它的作用是将给定字符串替换匹配结果，并返回新的替换后的文本。源文本不会改变。</p>
<p>它接受两个参数。第一个参数可以是字符串或者正则表达式，它的作用是匹配。</p>
<p>参数是字符串和参数是正则表达式的区别在于：正则表达式的表达能力更强，而且可以全局匹配。因此参数是字符串的话只能进行一次替换。</p>

```js
'abc-xyz-abc'.replace('abc', 'biu');
// "biu-xyz-abc"
'abc-xyz-abc'.replace(/abc/, 'biu');
// "biu-xyz-abc"
'abc-xyz-abc'.replace(/abc/g, 'biu');
// "biu-xyz-biu"
```

<p>第二个参数可以是字符串或者函数，它的作用是替换</p>

1.  第二个参数是字符串
<p>replace方法为第二个参数是字符串的方式提供了一些特殊的变量，能满足一般需求
$数字代表相应顺序的捕获组  $&代表匹配结果 $`代表匹配结果左边的文本 $'代表匹配结果右边的文本</p>

```js
'@abc-xyz-$abc'.replace(/([^-]+)abc/g, '$1biu'); // "@biu-xyz-$biu"
'@abc-xyz-$abc'.replace(/([^-]+)abc/g, '{$&}'); // "{@abc}-xyz-{$abc}"
'@abc-xyz-$abc'.replace(/([^-]+)abc/g, '{$`}'); // "{}-xyz-{@abc-xyz-}"
'@abc-xyz-$abc'.replace(/([^-]+)abc/g, "{$'}"); // "{-xyz-$abc}-xyz-{}"
```
<p>有些时候我要的是变量的符号本身，而不是它的变量值，怎么办？加一个$转义一下</p>

2. 第二个参数是函数 

- 函数的第一个参数，是匹配结果
-  如果有捕获组，函数的后顺位参数与捕获组一一对应
-  倒数第二个参数是匹配结果在文本中的位置 倒数第一个参数是源文本

```js
'abc-xyz-abc'.replace(/abc/g, (match) => `{${match}}`);
// "{abc}-xyz-{abc}"
'abc-xyz-abc'.replace(/abc/g, (match) => {});
// "undefined-xyz-undefined"

'@abc3-xyz-$abc5'.replace(/([^-]+)abc(\d+)/g, (match, $1, $2) => `{${$1}${match}${$2}}`);
// "{@@abc33}-xyz-{$$abc55}"
```


##  search
<br/>
<p>search是String实例方法 它的作用是找出首次匹配项的索引 接受一个正则表达式或字符串作为唯一参数</p>

```js
abc-xyz-abc'.search(/xyz/);
// 4
'abc-xyz-abc'.search(/xyz/g);
// 4
'abc-xyz-abc'.search(/mno/);
// -1
'abc-xyz-abc'.search();
// 0
'abc-xyz-abc'.search(/abc/);
// 0
```

<p>因为只能返回首次匹配的位置，所以全局匹配对它无效 如果匹配失败，返回-1</p>


# split
<br/>
<p>split是String实例方法 它的作用是根据传入的分隔符切割源文本。它返回一个由被切割单元组成的数组。</p>
<p>它接受两个参数。第一个参数可以是字符串或者正则表达式，它是分隔符；第二个参数可选，限制返回数组的最大长度。</p>
<p>因为split方法中的正则是用来匹配分隔符，所以全局匹配没有意义。</p>

##  exec
<br/>
<p>exec是RegExp实例方法。它的作用是根据参数返回匹配结果，与字符串方法match相似。</p>
<p>小小的区别在于参数为空的情况：exec直接返回null；match返回一个空字符串数组。</p>
<p>它们俩最大的区别在于全局匹配的场景。全局匹配就意味着多次匹配，RegExp实例有一个lastIndex属性，每匹配一次，这个属性就会更新为下一次匹配开始的位置。exec就是根据这个属性来实现全局匹配的。</p>

```js
const reg = /abc/g;
reg.lastIndex
// 0
reg.exec('abc-xyz-abc');
// ["abc", index: 0, input: "abc-xyz-abc", groups: undefined]
reg.lastIndex
// 3
reg.exec('abc-xyz-abc');
// ["abc", index: 8, input: "abc-xyz-abc", groups: undefined]
reg.lastIndex
// 11
reg.exec('abc-xyz-abc');
// null
reg.lastIndex
// 0
reg.exec('abc-xyz-abc');
// ["abc", index: 0, input: "abc-xyz-abc", groups: undefined]
```

<p>如果有多个匹配结果，多次执行就能获得所有的匹配结果。所以exec一般用在循环语句中。</p>
<p>有两点需要特别注意：</p>

- 因为lastIndex会不断更新，最终又会归于0，所以这个匹配过程是可以无限重复的。
- lastIndex属性是属于正则实例的。只有同一个实例的lastIndex才会不断更新。


## test
<br/>
<p>test是RegExp实例方法 它的作用是找出源文本是否有匹配项 返回布尔值。</p>
<p>因为是正则实例方法，全局匹配时也会更新正则实例的lastIndex属性，所以也可以多次执行。</p>

