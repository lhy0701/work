<template>
  <div class="analyze">
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
  name: 'Analyze',
  components: {
    'el-container': Container,
    'el-main': Main
  }
}
</script>

<style lang="scss" scope>
.analyze {
  height: 100%;
  .el-main-item {
    padding: 10px;
  }
}

</style>
