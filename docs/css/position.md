# 定位元素

## 相对定位
- 它的参照物为自身默认的位置, 始终占据空间，即初始位置所在的空间还存在，自身根据left,top,bottom ,right的值移动到相应的位置。相对不会破坏正常的文档流，相对定位元素的原始位置空间还占据着，其他元素的布局并不受影响，只是可能会被相对定位的元素遮罩
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
  top: 50px;
  width: 100px;
  height: 50px;
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
  position: relative;
  background: lightblue;
  width: 480px;
  margin: 20px auto;
  color: red;
}
#position-demo2 .pos-1 {
  position: absolute;
  left: 50px;
  top: 50px;
  width: 100px;
  height: 50px;
  background: lightgreen;
  /* z-index: 10; */
}
#position-demo2 .pos-2 {
  width: 200px;
   height: 100px;
  background: lightcoral;
}
</style>
` ` `
:::

- 绝对定位元素的宽高百分比是相对于临近的position不为static的祖先元素的paddingbox(content+padding, 不包括border)来计算的，非绝对定位元素的宽高百分比则是相对于父元素的contentbox(不包括padding和border)来计算的


## 固定定位
以整个浏览器窗口为参照物，和绝对定位类似脱离文本流并且不占据空间

## 粘性定位（sticky)
实验性功能，ie系列浏览器均不支持, 在谷歌浏览器中需要开启，地址栏输入 chrome://flags/ ，找到 enable-experimental-web-platform-features ，选择启用。粘性定位的表现为当条件不满足时跟relative定位类似，当条件满足时，将表现为fixed定位

```css
 .test {
        position: -webkit-sticky;
        position: sticky;
        top: 20px;
        width: 50px;
        height: 50px;
        background: lightgreen;
      }
```
上面这样一个元素，如果插在内容较长有滚动的页面中，当向下滚动到粘性定位元素距离body顶部值为20px时，粘性定位元素表现得跟fixed元素一样，固定在top：20px处。