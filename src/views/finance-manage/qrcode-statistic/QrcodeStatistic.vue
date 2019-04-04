<template>
  <div>
    <div class="filter-box">
      <div class="title">数据筛选</div>
      <div class="filter-content">
        <el-form
          :model="filterOptions"
          label-width="110px"
          class="filter-form"
          :inline="true"
          ref="form"
        >
          <el-form-item label="企业名称:" prop="CompanyName">
            <el-input v-model.trim="filterOptions.CompanyName"></el-input>
          </el-form-item>
          <el-form-item label="交易日期:">
            <el-date-picker
              v-model="dealDate"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="dateChange"
              :unlink-panels="true"
              :editable="false"
              :clearable="false"
              :picker-options="pickerOptions"
            ></el-date-picker>
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
          <el-table-column property="CompanyName" label="企业名称" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="收款金额(元)" show-overflow-tooltip align="center">
            <template slot-scope="scope">{{scope.row.Amount | number(2)}}</template>
          </el-table-column>
        </el-table>
        <div class="fl total">合计统计： 企业数量：{{totalNum}}&nbsp;&nbsp;收款总金额：{{totalAmount| number(2)}}</div>
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
  </div>
</template>

<script>
import { Input, Table, TableColumn, Pagination, Form, FormItem, DatePicker } from 'element-ui'
import { formatDate } from '@/core/js/filter'
import { env } from '@/core/js/env'
import { backEndService, errorHandler } from '@/core/js/services'

export default {
  name: 'QrcodeStatistic',
  components: {
    'el-input': Input,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-pagination': Pagination,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-date-picker': DatePicker
  },
  data() {
    return {
      pageSize: 10,
      totalNum: 0,
      pageNum: 1,
      totalAmount: 0,

      dealDate: [],
      // 查询接口信息
      searchOptions: {
        Code: '31575',
        CompanyName: '',
        BeginTime: '',
        EndTime: ''
      },

      filterOptions: {
        CompanyName: '',
        BeginTime: '',
        EndTime: ''
      },

      // 数据列表 { CompanyName: '北京车兄弟', PayAmount: '20.00' }
      dataList: [],
      loading: false,

      // 日期限制今天之前
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6
        }
      }
    }
  },
  created() {
    let time = new Date()
    this.dealDate.push(time, time)
    this.dateChange(this.dealDate)
    this.searchOptions.BeginTime = this.filterOptions.BeginTime
    this.searchOptions.EndTime = this.filterOptions.EndTime
  },
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

    // 选择时间
    dateChange(date) {
      this.filterOptions.BeginTime = formatDate(date[0], 'yyyymmdd')
      this.filterOptions.EndTime = formatDate(date[1], 'yyyymmdd')
    },

    // 查询
    search() {
      if (this.loading) return
      this.pageNum = 1
      this.searchOptions = Object.assign({}, this.searchOptions, this.filterOptions)
      this.findData()
    },

    // 重置过滤信息
    reset(formName) {
      this.$refs[formName].resetFields()
      let time = new Date()
      this.dealDate = []
      this.dealDate.push(time, time)
      this.dateChange(this.dealDate)
    },

    // 获取数据
    findData() {
      this.loading = true
      let message = {
        ...Object.assign(
          {
            Page: this.pageNum - 1,
            CountPerPage: this.pageSize,
            AgentUserId: env.getUser().isAgent ? env.getUser().userId : ''
          },
          this.searchOptions
        )
      }
      message.BeginTime = message.BeginTime + '000000'
      message.EndTime = message.EndTime + '235960'
      for (let key in message) {
        if (!message[key]) {
          delete message[key]
        }
      }
      backEndService
        .getData(message)
        .then(data => {
          let serverData = data.Message
          this.dataList = serverData.StatisticListGroup || []
          this.totalNum = parseInt(serverData.TotalCount || 0)
          this.totalAmount = parseFloat(serverData.TotalAmount || 0)
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
.total {
  margin: 20px 0;
  line-height: 32px;
}
</style>
