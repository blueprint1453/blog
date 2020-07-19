<template>
  <div class="com-test">
    <span class="title"> vue 测试组件</span>
    <div class="content">
      <span class="btn">+</span>
      <span class="count">{{count}}</span>
    </div>
  </div>
</template>

<script >
export default {
  name: 'ComTest',
  props: {
    count: {
      type: Number,
      default: 0
    }
  },
  methods: {
    onPlus() {
      this.$emit('plus')
    }
  }
}
</script>


<style scoped>
.com-test {
  width: 300px;
  margin: auto;
  text-align: center;
  padding: 20px;
}
.com-test .title {
  font-size: 18px;
  font-weight: bold;
  display: inline-block;
  margin-bottom: 14px;
}
.com-test .content .btn {
  border: 1px solid #ccc;
  border-radius: 2px;
  display: inline-block;
  padding: 6px 10px;
  font-size: 16px;
  margin-right: 20px;
}
.com-test .content .count {
  font-size: 18px;
}
</style>

