<template>
  <div class="active-statistical">
    <div class="pub-block"></div>
    <div class="content">
      <div class="statistical-top">日期区间
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :unlink-panels="true"
          :editable="false"
          :picker-options="pickerOptions"
        ></el-date-picker>
        <el-button class="find" @click="findData">查询</el-button>
        <el-button
          class="export"
          :disabled="!tableData.length || switchType === 2"
          @click="exportExcel"
        >导出</el-button>
        <el-button class="export" @click="displaySwitch">{{switchType === 1 ? '切换图表' : '切换表格'}}</el-button>
      </div>
      <el-table
        v-if="switchType === 1"
        :data="tableData"
        size="medium"
        id="table-data"
        :border="true"
        v-loading="loading"
      >
        <el-table-column prop="TimeSection" label="日期" align="center" header-align="center"></el-table-column>
        <el-table-column prop="EffectiveCount" label="日活跃商户" align="center" header-align="center"></el-table-column>
        <el-table-column prop="UserCount" label="日活跃用户数" align="center" header-align="center"></el-table-column>
        <el-table-column prop="Quantity" label="日开单数" align="center" header-align="center"></el-table-column>
        <el-table-column prop="Amount" label="开单金额" align="center" header-align="center"></el-table-column>
        <el-table-column prop="TotalCount" label="注册商户" align="center" header-align="center"></el-table-column>
        <el-table-column prop="SumUserCount" label="注册用户数" align="center" header-align="center"></el-table-column>
      </el-table>
      <template v-if="switchType === 2">
        <div id="activeCharts" :style="{width: '100%', height: '600px'}"></div>
      </template>
    </div>
  </div>
</template>

<script>
import { DatePicker, Table, TableColumn } from 'element-ui'
import { backEndService, errorHandler } from '@/core/js/services'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import { formatDate } from '@/core/js/filter'
import { option } from './chart'

// 引入 ECharts 主模块
let echarts = require('echarts/lib/echarts')
// 引入柱状图
require('echarts/lib/chart/line')
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/grid')
require('echarts/lib/component/legendScroll')
require('echarts/lib/component/dataZoom')

export default {
  name: 'ActiveStatistical',
  components: {
    'el-date-picker': DatePicker,
    'el-table': Table,
    'el-table-column': TableColumn
  },
  data() {
    return {
      date: [],
      tableData: [],
      loading: false,
      switchType: 1, // 1 表格 2 图表
      chartsOptions: {
        xData: [],
        effectiveCount: [],
        userCount: [],
        quantity: [],
        amount: [],
        totalCount: [],
        sumUserCount: []
      },
      activeCharts: null,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e7
        }
      }
    }
  },

  created() {
    let curDate = new Date()
    let end = new Date(curDate.getTime() - 24 * 60 * 60 * 1000)
    let start = new Date(curDate.getTime() - 24 * 60 * 60 * 1000)
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
    this.date.push(start, end)
    this.findData()
  },

  methods: {
    // 切换图表和表格
    displaySwitch() {
      this.switchType = this.switchType === 1 ? 2 : 1
      this.$nextTick(function() {
        if (this.switchType === 2) {
          this.initCharts()
        } else {
          this.activeCharts = null
        }
      })
    },

    initCharts() {
      this.activeCharts = echarts.init(document.getElementById('activeCharts'))
      this.activeCharts.showLoading()
      option.xAxis.data = this.chartsOptions.xData
      option.series[0].data = this.chartsOptions.effectiveCount
      option.series[1].data = this.chartsOptions.userCount
      option.series[2].data = this.chartsOptions.quantity
      option.series[3].data = this.chartsOptions.amount
      option.series[4].data = this.chartsOptions.totalCount
      option.series[5].data = this.chartsOptions.sumUserCount

      let size = this.chartsOptions.xData.length
      let max = ((15 / size) * 100).toFixed(2)
      max = max < 0 ? 100 : max
      option.dataZoom[0].end = max
      option.dataZoom[1].end = max
      setTimeout(() => {
        this.activeCharts.hideLoading()
        this.activeCharts.setOption(option)
      }, 1000)
    },

    findData() {
      if (!this.date || this.loading) return
      let beginTime = formatDate(this.date[0], 'yyyymmdd')
      let endTime = formatDate(this.date[1], 'yyyymmdd')

      if (this.activeCharts) {
        this.activeCharts.showLoading()
      }

      this.loading = true
      backEndService
        .getData({
          Code: '31115',
          BeginTime: beginTime,
          EndTime: endTime
        })
        .then(data => {
          let serverData = data.Message
          let result = serverData.ActiveInfoListGroup || []
          if (result.length) {
            for (let item in this.chartsOptions) {
              this.chartsOptions[item] = []
            }
            result.map(item => this.buildChartsData(item))
            this.switchType === 1 ? '' : this.initCharts()
          }
          this.tableData = result
          this.loading = false
        })
        .catch(errorHandler())
        .finally(() => {
          this.loading = false
        })
    },

    // 构建图表数据
    buildChartsData(item) {
      this.chartsOptions.xData.unshift(item.TimeSection)
      this.chartsOptions.effectiveCount.unshift(item.EffectiveCount)
      this.chartsOptions.userCount.unshift(item.UserCount)
      this.chartsOptions.quantity.unshift(item.Quantity)
      this.chartsOptions.amount.unshift(item.Amount)
      this.chartsOptions.totalCount.unshift(item.TotalCount)
      this.chartsOptions.sumUserCount.unshift(item.SumUserCount)
    },

    exportExcel() {
      /* generate workbook object from table */
      var wb = XLSX.utils.table_to_book(document.querySelector('#table-data'))
      /* get binary string as output */
      var wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'array'
      })
      try {
        FileSaver.saveAs(
          new Blob([wbout], {
            type: 'application/octet-stream'
          }),
          'sheetjs.xlsx'
        )
      } catch (e) {
        this.$message(e, wbout)
      }
      return wbout
    }
  }
}
</script>

<style scoped lang="scss">
.content {
  padding: 10px;
  .statistical-top {
    overflow: hidden;

    margin-bottom: 20px;
    .find {
      margin-top: -1px;
      margin-left: 20px;
    }
    .export {
      float: right;
    }
  }
}
</style>
