# 正则题例（一）

1. 将大数字转化为逗号分割
<br/>

```js
// 123456789
var num = 123456789
var reg = /\B(?=(\d{3})+\b)/g
String(num).replace(reg, ',')
// "123,456,789"
```

2. 匹配文件路径
<br/>

```js
// 123456789
var pathReg = /^[a-zA-Z]:\\([^\/\\\r\n?\*<>:|]+\\)*([^\/\\\r\n?\*<>:|]+)?/
pathReg.test("F:\\study\\javascript\\regex\\regular expression.pdf")
pathReg.test("F:\\study\\javascript\\regex\\")
pathReg.test("F:\\study\javascript\test")
pathReg.test("F:\\")
```

3. 匹配时间
<br/>

```js
var regex = /^(0?[0-9]|1[0-9]|[2][0-3]):(0?[0-9]|[1-5][0-9])$/;
console.log( regex.test("23:59") ); 
console.log( regex.test("02:07") ); 
console.log( regex.test("7:9") ); 
```

4. 查找出html结构的id
<br/>

```js
var idRegex = /(?<=id=").*?(?=")/
var htmlstring = '<div id="container" class="main"></div>';
console.log(htmlstring.match(idRegex)[0]); 
// container
```


5. 日期格式转化

```js
var date = '2020-06-10'
var reReg = /(\d{4})-(\d{2})-(\d{2})/
date.replace(reReg, '$2/$3/$1')
// 2020/06/10
// var year = '2020-06-10'.replace(reReg, (match, $1, $2, $3) => `${$2}/${$3}/${$1}`)
```

6. 反向引用的使用

```js
// \1 标识的是第一个捕获组 [.\-\/]
dateReg = /\d{4}([.\-\/])\d{2}\1\d{2}/
console.log(dateReg.test('2018-02-09'))
console.log(dateReg.test('2018/02/09'))
console.log(dateReg.test('2018.02.09'))

var trimReg = /^\s*(.*?)\s*$/g
console.log(' aa ddd  '.replace(trimReg, '$1'))
console.log('aa ddd '.replace(trimReg, '$1'))
console.log(' aa ddd'.replace(trimReg, '$1'))
console.log(''.replace(trimReg, ''))
```


7. 字符所有单词首字母大写

```js
var upcaseReg = /\b[a-zA-Z](?=[a-zA-Z]*\b)/g
console.log('My name is Epeli'.replace(upcaseReg, (match) => match.toUpperCase()))
```

8. 驼峰化

```js
var camelize = /([_-]+)(\w)(\w)?/g
console.log('-moz-transform'.replace(camelize, (match, $1, $2, $3) => $2.toUpperCase() + $3))
// MozTransform
```

9. 中划线化

```js
var dasherize = /([A-Z])/g
console.log('MozTransform'.replace(dasherize, (match) => '-' + match.toLowerCase()))
```


10. html转义

```js
var escapeChars = {
  '¢': 'cent',
  '£': 'pound',
  '¥': 'yen',
  '€': 'euro',
  '©': 'copy',
  '®': 'reg',
  '<': 'lt',
  '>': 'gt',
  '"': 'quot',
  '&': 'amp',
  '\'': '#39'
};

function escapeHTML(str) {
  const regStr = '[' + Object.keys(escapeChars).join('') + ']'
  const reg = new RegExp(regStr, 'g')
  return str.replace(reg, match => '&' + escapeChars[match] + ';')
}
console.log(escapeHTML('<div>Blah blah blah</div>'))

```


11. html反转义

```js
var htmlEntities = {
  nbsp: ' ',
  cent: '¢',
  pound: '£',
  yen: '¥',
  euro: '€',
  copy: '©',
  reg: '®',
  lt: '<',
  gt: '>',
  quot: '"',
  amp: '&',
  apos: '\''
}

function unescapeHTML(str) {
  const reg = /\&(.+?);/g
  return str.replace(reg, (match, a) => {
    console.log(match)
    if (htmlEntities.hasOwnProperty(a)) {
      return htmlEntities[a]
    }
    return a
  })
}
console.log(unescapeHTML('&lt;div&gt;Blah blah blah&lt;/div&gt;'))

```


12. 匹配闭合html标签

```js
var tagReg = /<([a-zA-Z]+)>(.*?)<\/\1>/
console.log(tagReg.test('<title>regular expression</title><p>laoyao bye bye</p>'))
```


13. 敏感词过滤

```js
var str = '我草你妈哈哈背景天胡景涛哪肉涯剪短发欲望';
var wordFilter = /[景|草|肉|欲|胡|涛]+/g
console.log(str.replace(wordFilter, '*'))
```

14. 判断是否符合 USD 格式

```js
$1,023,032.03
var usdReg = /^\$\d{1,3}(,\d{3})*\.\d{2}$/
console.log(usdReg.test('$1,023,032.03'))
console.log(usdReg.test('$1023,032.03'))
console.log(usdReg.test('$1,0,032.03'))
console.log(usdReg.test('$1032.03'))
console.log(usdReg.test('$132.034'))
console.log(usdReg.test('$1,324,344.03'))
```


15. 截取url的所有的参数 返回一个对象集合

```js
var url1 = 'https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&rsv_t=980cJrz9k35Si18%2FygE9oWTTEcsQ2%2BAXPLDkhWADNtSOwnErnT4VDcgCgwc&rqlang=cn&rsv_dl=tb&rsv_enter=1&rsv_sug3=17'

console.log(getUrlParam(url1).rsv_bp)
function getUrlParam(url) {
  var urlParamReg = /(?<=[\?|\&])(\w+?)=([^&]*)&?/g
  var obj = {}
  url.replace(urlParamReg, (match, $1, $2) => {
    obj[$1] = decodeURIComponent($2)
    console.log(match, $1, obj[$1])
    return match
  })
  return obj
}

```

16. 截取url的单个参数的值

```js
function getUrlSingleParam(url, key) {
  var str = '(?<=[\?\&])' + key + '=' + '([^&]*)&?'
  console.log(str)
  var reg = new RegExp(str)
  var match = url.match(reg)
  return match[1]
}

console.log(getUrlSingleParam(url1, 'tn'))

```


17. 邮箱验证

```js
// 邮箱验证
// 规则：
// 以数字字母开头，中间可以是多个（数字，字母，下划线 ,或中横线）
// 然后是 @ 符号，后面可以是数字字母 1到多个
// 然后是 . 在加 2-4个字母结尾
var emailReg = /^[\d\w][\d\w-.]*[\w\d]+@[\d\w]+\.\w{2,4}$/
```

