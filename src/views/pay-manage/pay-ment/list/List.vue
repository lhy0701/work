<template>
  <div class="pay-ment-list">
    <div class="filter-box">
      <div class="title">数据筛选</div>
      <div class="filter-content">
        <el-form
          :model="filterOptions"
          ref="form"
          label-width="60px"
          class="filter-form"
          :inline="true"
        >
          <el-form-item label="名称:" prop="CompanyName">
            <el-input v-model.trim="filterOptions.CompanyName"></el-input>
          </el-form-item>
          <el-form-item v-if="!isAgent" label="ID:" prop="AuthCode">
            <el-input-number v-model="filterOptions.AuthCode" :controls="false" :min="''"></el-input-number>
          </el-form-item>
        </el-form>
        <div class="filter-right">
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="reset('form')">重置</el-button>
        </div>
      </div>
    </div>
    <div class="table-box">
      <div class="title">
        <span>数据列表</span>
      </div>
      <div class="table">
        <el-table
          ref="singleTable"
          :data="dataList"
          style="width: 100%"
          size="mini"
          border
          max-height="500"
          v-loading="loading"
          tooltip-effect="dark"
        >
          <el-table-column v-if="!isAgent" property="AuthCode" width="70" label="ID"></el-table-column>
          <el-table-column property="CompanyName" label="企业名称" show-overflow-tooltip></el-table-column>
          <el-table-column property="Quantity" width="70" label="站点数"></el-table-column>
          <el-table-column property="ActiveQuantity" width="70" label="已续费"></el-table-column>
          <el-table-column property="NoQuantity" width="70" label="未续费"></el-table-column>
          <el-table-column label="截止日期" width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.LastTime">{{scope.row.LastTime | formatDate('yyyy-mm-dd')}}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="当期截止日期" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.EndTime">{{scope.row.EndTime | formatDate('yyyy-mm-dd')}}</span>
            </template>
          </el-table-column>-->
          <el-table-column label="操作" width="300" fixed="right">
            <template slot-scope="scope">
              <el-button
                size="small"
                :disabled="scope.row.AllowPurchase !== 'True'"
                type="text"
                @click="showDialog(scope.row,0)"
              >开通授权</el-button>
              <!-- <el-button size="small" type="text" @click="showDialog(scope.row,4)">在线站点</el-button> -->
              <el-button size="small" type="text" @click="goDetail(scope.row.AuthCode)">缴费记录</el-button>
              <el-button
                size="small"
                :disabled="scope.row.AllowAdd !== 'True'"
                type="text"
                @click="showDialog(scope.row,2)"
              >新增站点</el-button>
              <el-button size="small" type="text" @click="showDialog(scope.row,3)">站点记录</el-button>
              <el-button
                size="small"
                :disabled="scope.row.AllowRenew !== 'True'"
                type="text"
                @click="showDialog(scope.row,1)"
              >续费</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="my-pagination"
          background
          layout="prev, pager, next, sizes"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          :total="totalNum"
          :current-page="pageNum"
          @size-change="handleSizeChange"
          @current-change="handlePageCurrentChange"
        ></el-pagination>
      </div>
    </div>
    <Dialog
      v-if="dialogShow"
      :isShow="dialogShow"
      :row="currentData"
      :dialogType="dialogType"
      @closeModel="dialogClose"
      @refresh="refresh"
    ></Dialog>
  </div>
</template>

<script>
import { Input, Table, TableColumn, Pagination, Form, FormItem, InputNumber } from 'element-ui'
import { backEndService, errorHandler } from '@/core/js/services'
import Dialog from './Dialog.vue'
import { env } from '@/core/js/env'

export default {
  name: 'PayMentList',
  components: {
    'el-input': Input,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-pagination': Pagination,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-input-number': InputNumber,
    Dialog
  },
  data() {
    return {
      pageSize: 10,
      totalNum: 23,
      pageNum: 1,

      isAgent: env.getUser().isAgent,

      // 查询接口信息
      searchOptions: {
        CompanyName: '',
        AuthCode: ''
      },

      // 过滤信息详情
      filterOptions: {
        CompanyName: '',
        AuthCode: ''
      },
      // 数据列表
      dataList: [],
      // 表格loading状态
      loading: false,
      dialogShow: false,
      dialogType: 1,
      currentData: {}
    }
  },
  /**
   * 页面缓存，用户数据保持最新， 需要重新执行获取数据
   */
  activated() {
    this.findData()
  },
  methods: {
    // 分页
    handlePageCurrentChange(pageNum) {
      if (this.loading) return
      this.pageNum = pageNum
      this.findData()
    },

    // 分页条目数
    handleSizeChange(pageSize) {
      if (this.loading) return
      this.pageSize = pageSize
      this.findData()
    },

    // 查询
    search() {
      if (this.loading) return
      this.pageNum = 1
      this.searchOptions = this.filterOptions
      this.findData()
    },

    // 重置过滤信息
    reset(formName) {
      this.$refs[formName].resetFields()
    },

    // 获取数据
    findData() {
      this.loading = true
      let message = {
        ...Object.assign(
          {
            Code: '31511',
            Page: this.pageNum - 1,
            CountPerPage: this.pageSize,
            AgentUserId: this.isAgent ? env.getUser().userId : ''
          },
          this.searchOptions
        )
      }
      for (let key in message) {
        if (!message[key]) {
          delete message[key]
        }
      }
      backEndService
        .getData(message)
        .then(data => {
          let serverData = data.Message
          let result = serverData.AuthStatusListGroup || []
          if (result.length) {
            for (let index = 0; index < result.length; index++) {
              result[index].ProbationTime = Number(result[index].ProbationTime)
              result[index].BeginTime = Number(result[index].BeginTime)
              result[index].UnionPrice = Number(result[index].UnionPrice)
              // result[index].EndTime = Number(result[index].EndTime)
              result[index].LastTime = Number(result[index].LastTime)

              let num =
                Number(result[index].Quantity) - Number(result[index].ActiveQuantity) < 0
                  ? 0
                  : Number(result[index].Quantity) - Number(result[index].ActiveQuantity)
              result[index] = Object.assign({}, result[index], {
                NoQuantity: num
              })
            }
          }
          this.dataList = result
          this.totalNum = parseInt(serverData.TotalCount)
        })
        .catch(errorHandler())
        .finally(() => {
          this.loading = false
        })
    },

    showDialog(row, type) {
      this.dialogType = type
      this.currentData = row
      this.dialogShow = true
    },

    dialogClose() {
      this.currentData = null
      this.dialogShow = false
    },

    refresh() {
      this.findData()
      this.dialogClose()
    },

    goDetail(id) {
      this.$router.push({
        name: 'pay-ment-detail',
        params: {
          enterpriseId: id
        }
      })
    }
  }
}
</script>

<style lang="scss">
.filter-form {
  padding-top: 30px;
  .el-input-number {
    .el-input {
      .el-input__inner {
        text-align: left !important;
      }
    }
  }
}
</style>

