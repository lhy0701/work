<template>
  <div style="width: 100%">
    <div class="pub-block"></div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>角色列表</span>
      </div>
      <el-table :loading="loading" :data="role_list" stripe style="width: 100%">
        <el-table-column prop="Role" label="姓名"></el-table-column>
        <el-table-column prop="UserCount" label="用户数量">
          <!-- bug 7933 -->
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.UserCount > 0"
              size="mini"
              type="text"
              @click="goUserManage(scope.row)"
            >{{scope.row.UserCount}}</el-button>
            <span v-else>{{scope.row.UserCount}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="setPermission(scope.row)">权限设置</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { Card, Table, TableColumn, Button } from 'element-ui'
import { backEndService, errorHandler } from '@/core/js/services.js'
export default {
  name: 'AuthRole',
  components: {
    'el-button': Button,
    'el-card': Card,
    'el-table': Table,
    'el-table-column': TableColumn
  },
  data() {
    return {
      loading: true,
      role_list: []
    }
  },
  mounted() {
    backEndService
      .getData({
        Code: 31535
      })
      .then(res => {
        this.loading = false
        this.role_list = res.Message.BackstageRoleListGroup
      })
      .catch(errorHandler())
      .finally(() => {
        this.loading = false
      })
  },
  methods: {
    setPermission(row) {
      this.$router.push({
        path: '/authority-manage/role-manage/role-permission',
        query: {
          role: row.Id,
          roleRights: row.Rights,
          roleName: row.Role
        }
      })
    },
    goUserManage(row) {
      this.$router.push({
        path: '/authority-manage/user-manage',
        query: {
          roleName: row.Role
        }
      })
    }
  }
}
</script>

<style>
</style>
