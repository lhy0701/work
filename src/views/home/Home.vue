<template>
  <div class="home">
    <div class="content">
      <img src="../../assets/home.png" alt>
      <p class="name">车企典ERP后台管理系统</p>
      <p class="tip">汽配生意，从车企典开始</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home'
}
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  height: 800px;
  position: relative;
  .content {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    .name {
      font-weight: 400;
      font-style: normal;
      font-size: 36px;
      color: #3590f9;
    }
    .tip {
      color: #999999;
      font-style: normal;
    }
  }
}
</style>

