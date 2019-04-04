<template>
  <div>
    <el-container style="height: 100%">
      <el-main class="el-main-item">
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { Container, Main } from 'element-ui'

export default {
  name: 'ShopManage',
  components: {
    'el-container': Container,
    'el-main': Main
  }
}
</script>

<style lang="scss" scope>
.fl-wrap {
  .fl-header {
    font-weight: bold;
    line-height: 50px;

    margin-top: 10px;
    padding-left: 20px;

    color: #333;
    border: 1px solid #e9e9e9;
    background: #f9f9f9;
  }
  .fl-body {
    padding: 20px;

    border: 1px solid #e9e9e9;
    border-top: none;
    .fl-btn {
      display: inline-block;
      float: right;
    }
    .fl-item {
      display: inline-block;

      margin-right: 10px;
      margin-bottom: 10px;

      text-align: left;
      label {
        display: inline-block;

        width: 85px;
      }
      .fl-item-18 {
        width: 180px;
      }
      .fl-item-15 {
        width: 150px;
      }
    }
  }
  .fl-body:after {
    display: block;
    visibility: hidden;
    clear: both;

    height: 0;

    content: '';
  }
}
</style>
