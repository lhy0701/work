<template>
  <div style="width: 100%">
    <el-card class="pub-block">
      <div slot="header" class="clearfix">
        <span style="color:#666;font-size: 20px;">
          <i class="el-icon-news"></i>
          {{ $route.query.roleName }}
        </span>
        <el-button size="small" @click="getCheckedNodes" style="float: right; " type="primary">保存</el-button>
        <el-button size="small" @click="$router.go(-1)" style="float: right; margin-right: 15px;">取消</el-button>
      </div>
      <el-tree
        :v-loading="loading"
        :data="permissionTree"
        show-checkbox
        default-expand-all
        node-key="RightCode"
        :default-checked-keys="existingPermissions"
        ref="tree"
        highlight-current
        :props="defaultProps"
      ></el-tree>
      <div class="pub-block"></div>
    </el-card>
  </div>
</template>
<script>
import { Button, Card, Tree } from 'element-ui'
import { backEndService, errorHandler } from '@/core/js/services.js'
export default {
  name: 'Permission',
  components: {
    'el-button': Button,
    'el-card': Card,
    'el-tree': Tree
  },
  data() {
    return {
      loading: true,
      defaultProps: {
        children: 'children',
        label: 'RightName'
      },
      FatherCode: [],
      existingPermissions: [],
      permissionTree: []
    }
  },
  mounted() {
    this.getRoleData()
    this.existingPermissions =
      this.$route.query.roleRights !== '' && this.$route.query.roleRights !== undefined
        ? this.$route.query.roleRights.split(',')
        : []
  },

  methods: {
    getRoleData() {
      backEndService
        .getData({
          Code: 31537
        })
        .then(res => {
          this.permissionTree = [
            // bug 7934
            {
              FatherCode: '',
              Level: '',
              RightCode: '',
              RightName: '全选',
              children: [...this.modelTree(res.Message.BackstageRigthListGroup)]
            }
          ]
        })
        .catch(errorHandler())
        .finally(() => {
          this.loading = false
        })
    },
    modelTree(roleTree) {
      let updateArr = []
      roleTree.forEach((outItem, index, arr) => {
        // 最外层
        if (outItem.FatherCode === '') updateArr.push(outItem)
        arr.forEach(inItem => {
          if (outItem.RightCode === inItem.FatherCode) {
            outItem.children = outItem.children || []
            outItem.children.push(inItem)
          }
        })
      })
      return updateArr
    },
    // 获取选中的数据
    getCheckedNodes() {
      this.existingPermissions = [
        ...this.$refs.tree.getCheckedNodes().map(item => {
          return item.RightCode
        })
      ]
      this.updatePermissions()
    },
    // 更新权限
    updatePermissions() {
      backEndService
        .getData({
          Code: 31539,
          Id: this.$route.query.role * 1,
          Rights: this.existingPermissions.join(',')
        })
        .then(res => {
          if (res.Message.Success === 'True') {
            this.$message.success('设置成功.')
            this.$store.commit('delete_tabs', this.$router.history.current.fullPath)
            this.$router.go(-1)
          }
        })
        .catch(errorHandler())
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
<style lang="scss">
</style>

