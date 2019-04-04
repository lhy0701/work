<template>
  <div>
    <el-container style="height: 100%">
      <router-view></router-view>
    </el-container>
  </div>
</template>

<script>
import { Container } from 'element-ui'

export default {
  name: 'RoleManage',
  components: {
    'el-container': Container
  }
}
</script>

<style lang="scss" scope>
</style>
