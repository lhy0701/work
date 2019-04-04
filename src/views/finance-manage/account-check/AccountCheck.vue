<template>
  <div class="pay-ment-list">
    <div class="filter-box">
      <div class="title">数据筛选</div>
      <div class="filter-content">
        <el-form
          :model="filterOptions"
          label-width="100px"
          class="filter-form"
          :inline="true"
          ref="form"
        >
          <el-form-item label="企业ID:" prop="AuthCode">
            <el-input v-model.trim="filterOptions.AuthCode"></el-input>
          </el-form-item>
          <el-form-item label="企业名称:" prop="CompanyName">
            <el-input v-model.trim="filterOptions.CompanyName"></el-input>
          </el-form-item>
          <el-form-item label="交易流水号:" prop="VoucherCode">
            <el-input v-model.trim="filterOptions.VoucherCode"></el-input>
          </el-form-item>
          <el-form-item label="支付状态:" prop="Status">
            <el-select v-model="filterOptions.Status" placeholder="请选择">
              <el-option
                v-for="item in payStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
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
          <el-table-column property="AuthCode" width="70" label="企业ID"></el-table-column>
          <el-table-column property="CompanyName" label="企业名称" show-overflow-tooltip></el-table-column>
          <el-table-column label="支付金额(元)" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.Amount | number(2)}}</template>
          </el-table-column>
          <el-table-column property="Code" label="交易流水号" show-overflow-tooltip></el-table-column>
          <el-table-column property="OccurTime" label="交易时间" show-overflow-tooltip>
            <template slot-scope="scope">
              <span
                v-if="scope.row.OccurTime"
              >{{scope.row.OccurTime | formatDate('yyyy-mm-dd hh:MM:ss')}}</span>
            </template>
          </el-table-column>
          <el-table-column property="OrderStatus" label="支付状态" width="70" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <!-- scope.row.AllowRepair === 'True'-->
              <el-button size="small" type="text" :disabled="true" @click="replacementOrder">补单</el-button>
              <el-button
                size="small"
                type="text"
                :disabled="scope.row.AllowRefund !== 'True'"
                @click="replacementOrder"
              >退款</el-button>
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
  </div>
</template>

<script>
import { Input, Table, TableColumn, Pagination, Form, FormItem, DatePicker, Select, Option } from 'element-ui'
import { formatDate } from '@/core/js/filter'
import { backEndService, errorHandler } from '@/core/js/services'

export default {
  name: 'AccountCheck',
  components: {
    'el-input': Input,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-pagination': Pagination,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-date-picker': DatePicker,
    'el-select': Select,
    'el-option': Option
  },
  data() {
    return {
      pageSize: 10,
      totalNum: 0,
      pageNum: 1,

      dealDate: [],

      // 查询接口信息
      searchOptions: {
        CompanyName: '',
        AuthCode: '',
        BeginTime: '',
        EndTime: ''
      },

      // 过滤信息详情
      filterOptions: {
        CompanyName: '',
        AuthCode: '',
        Status: '1',
        VoucherCode: '',
        BeginTime: '',
        EndTime: ''
      },
      // 数据列表
      dataList: [],
      // 表格loading状态
      loading: false,

      // 日期限制今天之前
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6
        }
      },

      payStatusOptions: [
        {
          value: '0',
          label: '全部'
        },
        {
          value: '1',
          label: '已支付'
        },
        {
          value: '2',
          label: '未支付'
        }
      ]
    }
  },

  created() {
    let time = new Date()
    this.dealDate.push(time, time)
    this.dateChange(this.dealDate)
    this.searchOptions.BeginTime = this.filterOptions.BeginTime
    this.searchOptions.EndTime = this.filterOptions.EndTime
    // this.findData()
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
      this.searchOptions = this.filterOptions
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
            Code: '31531',
            Page: this.pageNum - 1,
            CountPerPage: this.pageSize
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
          let result = serverData.PurchaseOrderListGroup || []
          if (result.length) {
            for (let index = 0; index < result.length; index++) {
              result[index].OccurTime = Number(result[index].OccurTime)
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

    replacementOrder() {
      console.log('补单')
    }
  }
}
</script>

<style lang="scss">
</style>

