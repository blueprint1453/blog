# 排序算法

## 冒泡排序
<br/>
<p>冒泡排序算法的思路：</p>

1. 比较相邻的元素。如果第一个比第二个大，就交换他们两个。
2. 第一轮，对每一对相邻元素做同样的工作，从开始第一对到结尾的最后一对。在这一轮结束，最后的元素应该会是最大的数。
3. 第二轮，针对所有的元素重复以上的步骤，除了最后一个。
4. 第三轮，针对所有的元素重复以上的步骤，除了最后两个个。
5. 按照上述规律重复上面的步骤，直到没有任何一对数字需要比较。 

<p>根据上面的思路，冒泡排序有两层循环，第一层循环为所需要的轮数，第二层为每轮的比较次数</p>
<p>冒泡排序的最坏时间复杂度为O(n^2)</p>

```js
function sort(arr) {
  let len = arr.length
  for (let i = 0; i < len - 1; i++) { /*外循环为排序轮数*/ 
    for (let j = 0; j < len - i - 1; j++) { /*内循环为每次循环的次数*/
      if (arr[j] > arr[j+1]) {
        [arr[j], arr[j+1]] = [arr[j+1], arr[j]]
      }
    }
  }
  return arr
}
```

## 选择排序
<br/>
<p>选择排序算法的思路：</p>

1. 第一轮 数组中的第一项元素跟他后面元素依次比较，若后面的元素比第一项大就交换他们俩个，这一轮结束后第一个元素就是最小的元素
2. 第二轮 数组中的第二项元素跟他后面元素依次比较，若后面的元素比第二项大就交换他们俩个，这一轮结束后第二项元素就是除第一项外最小的
4. 第三轮及以后，按照上述规律重复以上的步骤。

<p>简单来说，选择排序就是按顺序分别选出剩余元素中最小的元素，选择排序有两层循环，第一层循环为所需要的轮数，第二层为每轮的比较次数</p>
<p>选择排序的最坏时间复杂度为O(n^2)</p>

```js
function selectSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {  /*外循环为排序轮数 i表示当前这一轮最小的元素的位置*/ 
    for (let j = i + 1; j < arr.length; j++) { /*内循环为每次循环的次数*/
      if (arr[i] > arr[j]) {
        [arr[i], arr[j]] = [arr[j], arr[i]]
      }
    }
  }
  return arr
}
```

## 插入排序
<br/>
<p>基本思想是将一个记录插入到已经排好序的有序表中，从而一个新的、记录数增1的有序表</p>
<p>插入排序算法的思路：</p>

1. 第一轮 取数组第二个元素位置作为起点，按照逆序的顺序比较相邻的两个元素，索引大元素值比相邻的小就交换他们的位置
2. 第二轮 取数组第三个元素位置作为起点，按照逆序的顺序比较相邻的两个元素，索引大元素值比相邻的小就交换他们的位置
4. 第三轮及以后，按照上述规律重复以上的步骤。

<p>插入排序的最坏时间复杂度为O(n^2)</p>

```js
function insertSort(arr) {
  for (let i = 1; i < arr.length ; i++) { /*外循环为排序轮数 i表示当前这一轮进行比较起始位置*/ 
    for (let j = i; j >= 0; j--) { 
      /**
      ** 内循环为每次循环的次数 按照逆序方式比较相邻元素
      ** 因为j - 1之前其实已经排好序了，只需要比较一次即可
      **/
      if (arr[j] < arr[j - 1]) {
        [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]]
      } else {
        break
      }
    }
  }
  return arr
}
```

## 快速排序
<br/>
<p>快速排序的原理是：选择一个基准值，一般选择数组的一个值，遍历数组，大的放右边（用一个数组保存），小的放左边（用一个数组保存），一样大的放中间（用一个数组保存），利用递归重复对大的数组和小的数组继续进行拆分，最后得出排序后的数组</p>

<p>插入排序的最坏时间复杂度为O(n*logn))</p>

```js
function quickSort(arr) {
  if (arr.length <= 1) return arr
  let left = []
  let right = []
  let middle = []
  let curr = arr.splice(0, 1)
  for (let i = 0; i < arr.length; i++) {
    if (curr > arr[i]) {
      left.push(arr[i])
    }
    if (curr < arr[i]) {
      right.push(arr[i])
    }
    if (curr === arr[i]) {
      middle.push(arr[i])
    }
  }
  return quickSort(left).concat(middle, quickSort(right))
  // or es6
  // return [...quickSort(left), ...middle, ...quickSort(right)]
}
```


## 桶排序

<br/>

<p>桶排序就是先分类，即把数据放进相应的桶里，然后对每个桶进行局部排序，最后再把桶合并一下就行了。</p>
<p>桶排序的流程分为三步，分类，排序和合并。</p>
<p>假如有一个数组【3,8,6,1,5,7,9,2,4】，图中元素最小值是1，最大值是9，因此所有元素位于属于区间【1,9】。假设桶（区间）的范围大小是3，那么就有3个桶，具体是：【1,3】、【4,6】、【7,9】</p>

```js
function bucketSort(arr) {
  // 1.先准备好桶
  let min = Math.min(...arr)
  let max = Math.max(...arr)
  let size = 3
  let buckets = []
  let count = Math.ceil((max - min + 1) / size)
  for (let i = 0; i < count; i++) {
    buckets.push([])
  }
  // 2. 遍历数组 将元素放入相应桶
  for (let item  of arr) {
    let index = Math.floor((item - min) / size)
    buckets[index].push(item)
  }
  // 3. 每个桶内元素排序，排好序后放入一个数组中
  let result = []
  for(let bucket of buckets) {
    // 每个桶的元素排序算法可以采用上面的排序方式
    result.push(...insertSort(bucket))
  }
}
```

- 关于算法复杂度问题，可参考[通过 JavaScript 学习算法复杂度](https://juejin.im/post/6844904057321029646)