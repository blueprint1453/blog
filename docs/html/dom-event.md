# DOM 事件

## mouseover 和 mouseenter 的区别

如果不是在开发中经常遇到，mouseenter和mouseover之间区别， 以及mouseleave和mouseout之间区别，还是挺容易被搞混的，具体区别可按f12打卡控制台，然后移动鼠标看两者区别
- 鼠标从外界移动到元素上时，mouseenter和mouseover会触发
- 鼠标从元素移动到外界时，mouseleave和mouseout会触发
- 当鼠标在当前元素上时，f5刷新界面，鼠标移动的瞬间mouseenter和mouseover会触发
- 鼠标从父元素进入子元素，或者从子元素移动到父元素，父元素的mouseover和mouseout事件都会触发，说明mouseover和mouseout都会冒泡，
  父元素的mouseenter和mouseleave事件都没发生，说明mouseenter和mouseleave不会冒泡
::: demo [vanilla]
```html
<html>
  <div class="parent">
    parent
    <div class="son">son</div>
  </div>
</html>
<script>
  var parent = document.querySelector(".parent");
  var son = document.querySelector(".son");
  parent.addEventListener("mouseenter", function(e) {
    console.log("parent mounseenter");
  });
  parent.addEventListener("mouseleave", function(e) {
    console.log("parent mouseleave");
  });

  parent.addEventListener("mouseover", function(e) {
    console.log("parent mouseover");
  });
  parent.addEventListener("mouseout", function(e) {
    console.log("parent mouseout");
  });
</script>
<style>
  * {
    margin: 0;
    padding: 0;
  }
  .parent {
    width: 400px;
    height: 200px;
    margin: 0 auto;
    border: 1px solid lightblue;
    text-align: center;
    line-height: 40px;
  }
  .parent div {
    width: 200px;
    height: 100px;
    border: 1px solid lightgreen;
    text-align: center;
    line-height: 40px;
  }
</style>
```
:::
- 鼠标从外界移动到元素上时，mouseenter和mouseover会触发
- 鼠标从元素移动到外界时，mouseleave和mouseout会触发
- 当鼠标在当前元素上时，f5刷新界面，鼠标移动的瞬间mouseenter和mouseover会触发
- 鼠标从父元素进入子元素，或者从子元素移动到父元素，父元素的mouseover和mouseout事件都会触发，说明mouseover和mouseout都会冒泡，
  父元素的mouseenter和mouseleave事件都没发生，说明mouseenter和mouseleave不会冒泡