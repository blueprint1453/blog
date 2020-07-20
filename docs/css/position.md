# 定位元素

## 相对定位
- 它的参照物为自身默认的位置, 始终占据空间，即初始位置所在的空间还存在，自身根据left,top,bottom ,right的值移动到相应的位置。相对不会破坏正常的文档流，
::: demo [vanilla]
```html
<html>
  <div id="position-demo1">
    <div class="pos-1" >relative元素</div>
    <div class="pos-2" >普通元素</div>
  </div>
</html>
<style>
#position-demo1 {
  background: lightblue;
  width: 480px;
  margin: 20px auto;
  color: red;
}
#position-demo1 .pos-1 {
  position: relative;
  left: 100px;
  top: 100px;
  width: 100px;
  height: 100px;
  background: lightgreen;
}
#position-demo1 .pos-2 {
  position: reletive;
  width: 150px;
   height: 100px;
  background: lightcoral;
}
</style>
` ` `
:::

## 绝对定位
- 绝对定位的元素，定位参照的是已经设置了定位(position为relative, absolute, fixed)的层级离得最近的父元素, 会破坏标准文档流，表现为脱离标准文档流, 不占据空间，就是不在原来的位置上，也不占据空间, 就像游离在文档外
::: demo [vanilla]
```html
<html>
  <div id="position-demo2">
    <div class="pos-1" >absolute元素</div>
    <div class="pos-2" >普通元素</div>
  </div>
</html>
<style>
#position-demo2 {
  background: lightblue;
  width: 480px;
  margin: 20px auto;
  color: red;
}
#position-demo2 .pos-1 {
  position: absolute;
  left: 100px;
  top: 100px;
  width: 100px;
  height: 100px;
  background: lightgreen;
}
#position-demo2 .pos-2 {
  position: reletive;
  width: 120px;
   height: 100px;
  background: lightcoral;
}
</style>
` ` `
:::


## 固定定位
以整个浏览器窗口为参照物，和绝对定位类似脱离文本流并且不占据空间

## 粘性定位（sticky)
