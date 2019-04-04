<template>
  <el-dialog
    :title="title"
    width="700px"
    :visible="isShow"
    :close-on-click-modal="false"
    @close="closeModel"
  >
    <div v-if="dialogType === 1">
      <el-table
        :data="siteOnline"
        size="mini"
        :height="'220'"
        max-height="220"
        border=""
        width="100%"
        v-loading="loading"
        tooltip-effect="dark"
      >
        <el-table-column label="登录时间" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.LoginTime | formatDate}}</span>
          </template>
        </el-table-column>
        <el-table-column property="UserName" label="登录用户名" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column property="MacAddress" label="MAC地址" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column property="MachineName" label="机器名" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="操 作" align="center">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="text"
              :loading="scope.row.loading"
              @click="remove(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="dialogType === 2">
      <el-table
        :data="unionList"
        size="mini"
        :height="'220'"
        max-height="220"
        border=""
        width="100%"
        v-loading="loading"
        tooltip-effect="dark"
      >
        <el-table-column property="UnionId" label="联盟ID" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column property="Union" label="联盟名称" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column property="MasterStore" label="盟主ID" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column property="Brand" label="主营品牌" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="地区" align="center" show-overflow-tooltip>
          <template
            slot-scope="scope"
          >{{scope.row.Province}} {{scope.row.City}} {{scope.row.County}}</template>
        </el-table-column>
      </el-table>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="closeModel">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Dialog, Table, TableColumn } from 'element-ui'
import { backEndService, errorHandler } from '@/core/js/services'

export default {
  name: 'SiteManage',
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    authCode: String,
    dialogType: Number
  },
  components: {
    'el-dialog': Dialog,
    'el-table': Table,
    'el-table-column': TableColumn
  },
  data() {
    return {
      formLabelWidth: '80px',
      loading: false,
      siteOnline: [], // 在线站点
      unionList: [],
      title: ''
    }
  },
  created() {
    if (this.dialogType === 1) {
      this.findSiteOnline()
      this.title = '在线站点'
    } else {
      this.findUnion()
      this.title = '所属联盟'
    }
  },
  methods: {
    closeModel() {
      if (this.loading) return
      this.$emit('closeModel', false)
    },

    // 获取在线站点数
    findSiteOnline() {
      this.loading = true
      backEndService
        .getData({
          Code: '31523',
          AuthCode: this.authCode
        })
        .then(data => {
          let serverData = data.Message
          let result = serverData.LoginSiteListGroup || []

          this.siteOnline = result
        })
        .catch(errorHandler())
        .finally(() => {
          this.loading = false
        })
    },

    // 获取所属联盟
    findUnion() {
      this.loading = true
      backEndService
        .getData({
          Code: '31011',
          AuthCode: this.authCode
        })
        .then(data => {
          let serverData = data.Message
          let result = serverData.UnioninfoListGroup || []
          for (const iterator of result) {
            this.unionList.push(iterator.UnionInfos)
          }
        })
        .catch(errorHandler())
        .finally(() => {
          this.loading = false
        })
    },

    // 删除登陆站点
    remove(row) {
      row.loading = true
      backEndService
        .getData({
          Code: '31529',
          AuthCode: this.authCode,
          SessionKey: row.SessionKey
        })
        .then(() => {
          for (const item in this.siteOnline) {
            if (this.siteOnline.hasOwnProperty(item)) {
              const element = this.siteOnline[item]
              if (row.SessionKey == element.SessionKey) this.siteOnline.splice(item, 1)
            }
          }
        })
        .catch(errorHandler())
        .finally(() => {
          row.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.end-time {
  padding: 0 15px;
  // height:

  color: #c0c4cc;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  background-color: #f5f7fa;
}
.title {
  margin-bottom: 20px;
  padding-left: 4px;

  color: red;
}
</style>

