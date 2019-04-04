<template>
  <div class="pay-manage">
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
  name: 'PayManage',
  components: {
    'el-container': Container,
    'el-main': Main
  }
}
</script>

<style lang="scss" scope>
.pay-manage {
  height: 100%;
  .el-main-item {
    padding: 10px;
  }
}

</style>
