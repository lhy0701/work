<template>
  <div>
    <!-- 查询: -->
    <div class="fl-wrap">
      <div class="fl-header">查询</div>
      <div class="fl-body">
        <div>
          <div class="fl-item">
            <label for>用户名</label>
            <el-input size="medium" v-model.trim="queryCondition.LoginID" class="fl-item-18"/>
          </div>
          <div class="fl-item">
            <label for>姓名</label>
            <el-input class="fl-item-18" v-model.trim="queryCondition.UserName" size="medium"/>
          </div>
          <div class="fl-item">
            <label for>所属角色</label>
            <el-select size="small" v-model.trim="queryCondition.Role" placeholder="请选择">
              <el-option v-for="item in roleSelect" :key="item.value" :value="item.value"></el-option>
            </el-select>
          </div>
          <div class="fl-btn">
            <el-button size="medium" type="primary" @click="usersQuery" :loading="loading">查询</el-button>
            <el-button size="medium" @click="resetQuery" :loading="loading">重置</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 用户列表 -->
    <div class="ep-table-wrap">
      <div class="ep-table-thead">
        <div class="ep-table-th-title">用户列表</div>
        <div class="ep-table-th-handle">
          <el-button size="medium" type="primary" :loading="loading" @click="addUser">新增用户</el-button>
          <!--  bug 7925 -->
        </div>
      </div>
      <el-table
        v-loading="loading"
        :data="usersList"
        height="450px"
        border
        highlight-current-row
        size="mini"
        ref="singleTable"
        max-height="450"
        style="width: 100%"
      >
        <el-table-column prop="LoginID" label="用户名"/>
        <el-table-column prop="UserName" label="姓名" show-overflow-tooltip/>
        <el-table-column prop="Role" label="所属角色"/>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <span>{{scope.row.CreateDate | transitionTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="Memo" label="备注" show-overflow-tooltip/>
        <el-table-column prop="AdminCreateUser" label="操作">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="text"
              :disabled="scope.row.Department === '超级管理员'"
              @click="editUser(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              size="small"
              type="text"
              :disabled="scope.row.Department === '超级管理员'"
              @click="deleteUser(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 弹窗 新增用户/编辑用户 -->
    <AuthDialog
      v-if="dialogStatus.show"
      :options="dialogStatus"
      @closeModel="closeDialog"
      @putData="putDialog"
    />
  </div>
</template>

<script>
import { Input, Button, Table, TableColumn, Option, Select } from 'element-ui'
import AuthDialog from './AuthDialog.vue' // 弹窗组件
import { backEndService, errorHandler } from '@/core/js/services.js'
export default {
  name: 'UserManage',
  components: {
    'el-input': Input,
    'el-button': Button,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-option': Option,
    'el-select': Select,
    AuthDialog
  },
  data() {
    return {
      // loading
      loading: true,
      // 查询条件
      queryCondition: {
        LoginID: '',
        UserName: '',
        Role: '全部'
      },
      // 用户列表
      usersList: [],
      // 当前选中下标，用于修改后，修改当前row数据
      currentIndex: 0,
      // 弹窗标题
      titleOption: ['新增用户', '编辑用户', '删除用户'],
      // dialog 状态
      dialogStatus: {
        titleOption: '',
        show: false,
        type: 0,
        currentData: {}
      },
      // 部门下拉
      roleSelect: [
        {
          value: '全部'
        },
        {
          value: '管理员'
        },
        {
          value: '运维'
        },
        {
          value: '市场'
        },
        {
          value: '研发' // bug 7932
        },
        {
          value: '财务'
        },
        {
          value: '产品'
        },
        {
          value: '总经办'
        },
        {
          value: '测试'
        },
        {
          value: '代理'
        }
      ]
    }
  },
  /**
   * 装载过程中，请求数据
   */
  mounted() {
    this.init()
  },
  methods: {
    /**
     * 初始列表
     * @desc bug 7938
     */
    init() {
      // 存在参数，默认为角色管理跳转过来行为
      if (this.$route.query.roleName) {
        this.queryCondition = {
          ...this.queryCondition,
          ...{ Role: this.$route.query.roleName }
        }
      }
      this.getUserList()
    },
    /**
     * 请求用户列表
     * @description 获取用户列表信息
     */
    getUserList() {
      for (let key in this.queryCondition) {
        if (this.queryCondition[key] === '') {
          delete this.queryCondition[key]
        }
      }
      backEndService
        .getData({
          Code: 31541,
          ...this.queryCondition
        })
        .then(res => {
          if (res.Message.AdminUserListGroup && res.Message.AdminUserListGroup.length > 0) {
            this.usersList = [...res.Message.AdminUserListGroup]
          } else {
            this.usersList = []
            this.$message.error('暂无符合数据.')
          }
        })
        .catch(errorHandler())
        .finally(() => {
          this.loading = false
        })
    },
    /**
     * 删除用户
     */
    delSelectedUser() {
      let delId = this.dialogStatus.currentData.Id
      backEndService
        .getData({
          Code: 31545,
          UserId: this.dialogStatus.currentData.Id
        })
        .then(() => {
          this.usersList = [
            ...this.usersList.filter(item => {
              return item.Id !== delId
            })
          ]
        })
        .catch(errorHandler())
        .finally(() => {
          this.loading = false
        })
    },
    /**
     * 查询列表
     */
    usersQuery() {
      this.loading = true
      this.getUserList()
    },
    /**
     * 重置列表
     */
    resetQuery() {
      this.loading = true
      this.queryCondition = {
        ...{
          LoginID: '',
          UserName: '',
          Role: '全部'
        }
      }
      this.getUserList()
    },
    /**
     * 设置弹窗状态及数据
     * @param { Object } params = { titleOption: 弹窗标题, type: 表单节点, currentData: 当前行数据 }
     * @description
     *  1. 设置弹窗
     *  2. 设置标题
     *  3. 设置表单类型
     *  4. 设置表单值
     */
    setDialogStatus(params) {
      this.dialogStatus = Object.assign({}, this.dialogStatus, { show: true }, params)
    },
    /**
     * 新增用户
     * @desc 调用 setDialogStatus 设置弹窗状态
     */
    addUser() {
      this.setDialogStatus({
        titleOption: this.titleOption[0],
        type: 0,
        updateFlag: 0
      })
    },
    /**
     * 编辑用户
     * @param { Number } index 当前行下标
     * @param { Object } row 当前行数据
     * @desc 调用 setDialogStatus 设置弹窗状态，默认赋值
     */
    editUser(index, row) {
      if(row.Fee >1) {
        row.Fee = row.Fee/1000
      }
      this.setDialogStatus({
        titleOption: this.titleOption[1],
        type: 1,
        currentData: Object.assign({}, this.dialogStatus.currentData, row, {
          Password: '',
          submitPassword: ''
        }),
        updateFlag: 1
      })
      // 修改的数据flag
      this.currentIndex = index
    },
    /**
     * 删除用户
     * @param { Number } index 当前行下标
     * @param { Object } row 当前行数据
     * @desc 调用 setDialogStatus 设置弹窗状态，默认赋值
     */
    deleteUser(index, row) {
      // console.log('我是删除的', index, row)
      this.setDialogStatus({
        titleOption: this.titleOption[2],
        type: 2,
        currentData: Object.assign({}, this.dialogStatus.currentData, row)
      })
      // console.log('我是删除是的状态', this.dialogStatus)
    },
    /**
     * 关闭 dialog 监听子组件返回的事件，修改对应值
     */
    closeDialog() {
      this.setDialogStatus({
        titleOption: '',
        show: false,
        currentData: {}
      })
    },
    /**
     * 提交弹窗
     * @param { Object } modified 修改后的用户信息
     * @description 从子组件传回修改后的数据，请求服务器，如果成功，修改对应表格数据
     *
     */
    putDialog(modified) {
      this.$message.success(
        modified.LoginID ? (modified.UpdateFlag === 0 ? '新增用户成功' : '修改用户成功') : '删除用户成功'
      )
      if (modified.LoginID) {
        if (modified.UpdateFlag === 0) {
          this.getUserList()
        } else {
          this.usersList = [
            ...this.usersList.map(item => {
              if (item.Id === modified.Id) {
                return modified
              }
              return item
            })
          ]
        }
        this.setDialogStatus({
          titleOption: '',
          show: false,
          currentData: {}
        })
      } else {
        this.delSelectedUser()
      }
    }
  }
}
</script>

<style>
</style>
