<template>
  <div class="active-analyze">
    <div class="box">
      <div class="containal" id="dayData">
        <div class="title">
          <span>日开单量</span>
          <el-date-picker
            v-model="dayTime"
            type="date"
            placeholder="选择日期时间"
            :editable="false"
            align="center"
            :clearable="false"
            @change="dateChange(1)"
            :picker-options="pickerOptions"
          ></el-date-picker>
          <el-select
            style="margin-left:20px;"
            v-model="daySelect"
            placeholder="请选择"
            @change="selectChange(1)"
          >
            <el-option
              v-for="item in selectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="content">
          <div class="fl" id="dayCharts" :style="{width: '52%', height: '400px'}"></div>
          <div class="fl line"></div>
          <div class="fr day-table" :style="{width: '44%',height: '400px',overflow:'hidden'}">
            <div class="table-title">日开单商户排行</div>
            <el-table :data="dayResult.rank" max-height="300" size="medium" tooltip-effect="dark">
              <el-table-column label="#" width="50">
                <template slot-scope="scope">
                  <span class="index-tip">{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="Store" label="开单商户" show-overflow-tooltip></el-table-column>
              <el-table-column prop="Amount" label="开单金额(元)">
                <template slot-scope="scope">
                  <span class="price">{{ scope.row.Amount | number(2) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="Quantity" label="开单数量">
                <template slot-scope="scope">
                  <span class="price">{{ scope.row.Quantity }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="containal" id="monthData">
        <div class="title">
          <span>月开单量</span>
          <el-date-picker
            v-model="monthTime"
            type="month"
            placeholder="选择日期时间"
            :editable="false"
            align="center"
            :clearable="false"
            @change="dateChange(2)"
            :picker-options="pickerOptions"
          ></el-date-picker>
          <el-select
            style="margin-left:20px;"
            v-model="monthSelect"
            placeholder="请选择"
            @change="selectChange(2)"
          >
            <el-option
              v-for="item in selectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="month-content">
          <div id="monthCharts" :style="{width: '100%', height: '300px'}"></div>
          <div class="month">
            <div class="day-table" :style="{width: '100%',height: '400px',overflow:'hidden'}">
              <div class="table-title">月开单商户排行</div>
              <el-table :data="monthResult.rank" max-height="300" size="medium">
                <el-table-column label="#" width="50">
                  <template slot-scope="scope">
                    <span class="index-tip">{{ scope.$index + 1 }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="Store" label="开单商户"></el-table-column>
                <el-table-column prop="Amount" label="开单金额(元)">
                  <template slot-scope="scope">
                    <span class="price">{{ scope.row.Amount | number(2) }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="Quantity" label="开单数量">
                  <template slot-scope="scope">
                    <span class="price">{{ scope.row.Quantity }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
      <div class="containal" id="mapData">
        <div class="title">
          <span>地区统计信息</span>
        </div>
        <ul class="map-title">
          <li class="item">
            <div class="icon fl">
              <i class="el-icon-document"></i>
            </div>
            <div class="data fl">
              <div class="map-key">活跃商户数</div>
              <div class="num">{{mapResult.saleSumCount | number(0)}}</div>
            </div>
          </li>
          <li class="item">
            <div class="icon fl">
              <i class="el-icon-document"></i>
            </div>
            <div class="data fl">
              <div class="map-key">商户门店数量总计</div>
              <div class="num">{{mapResult.sumCount | number(0)}}</div>
            </div>
          </li>
          <li class="item">
            <div class="icon fl">
              <i class="el-icon-document"></i>
            </div>
            <div class="data fl">
              <div class="map-key">商户开单金额总计（元）</div>
              <div class="num">{{mapResult.totalAmount | number(2)}}</div>
            </div>
          </li>
          <li class="item">
            <div class="icon fl">
              <i class="el-icon-document"></i>
            </div>
            <div class="data fl">
              <div class="map-key">PC终端数量（台）</div>
              <div class="num">{{mapResult.sumUserCount | number(0)}}</div>
            </div>
          </li>
        </ul>
        <div id="mapCharts" :style="{width: '100%', height: '500px'}"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { DatePicker, Table, TableColumn, Select, Option } from 'element-ui'
import { backEndService, errorHandler } from '@/core/js/services'
import chinaMap from './china.json'
import { dayOption, monthOption, mapOption } from './chart'
import { formatDate } from '@/core/js/filter'

// 引入 ECharts 主模块
let echarts = require('echarts/lib/echarts')
// 引入柱状图
require('echarts/lib/chart/bar')
require('echarts/lib/chart/line')
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/grid')
require('echarts/lib/component/axisPointer')
require('echarts/lib/chart/map')
require('echarts/lib/component/legendScroll')
require('echarts/lib/component/visualMap')

echarts.registerMap('china', chinaMap)

// let mapOption = {}
export default {
  name: 'ActiveAnalyze',
  data() {
    return {
      dayTime: new Date(),
      monthTime: new Date(),
      dayCharts: null,
      monthCharts: null,
      mapCharts: null,
      dayResult: {
        rank: [],
        quantity: [], //数量
        amount: [], // 金额
        voucherCount: [] // 开单量
      },
      monthResult: {
        rank: [],
        xData: [],
        quantity: [],
        amount: [],
        voucherCount: []
      },
      mapResult: {
        saleSumCount: '',
        sumCount: '',
        sumUserCount: '',
        totalAmount: '',
        mapEffectiveCount: [],
        mapTotalCount: [],
        mapAmount: [],
        mapUserCount: []
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6
        }
      },
      daySelect: '1',
      monthSelect: '1',
      selectOptions: [
        {
          value: '1',
          label: '销售'
        },
        {
          value: '2',
          label: '采购'
        },
        {
          value: '3',
          label: '销售退货'
        },
        {
          value: '4',
          label: '采购退货'
        },
        {
          value: '5',
          label: '销售及退货'
        },
        {
          value: '6',
          label: '采购及退货'
        }
      ],
      dateYoo: 10
    }
  },
  components: {
    'el-date-picker': DatePicker,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-select': Select,
    'el-option': Option
  },
  mounted() {
    // find Data
    this.dayCharts = echarts.init(document.getElementById('dayCharts'))
    this.monthCharts = echarts.init(document.getElementById('monthCharts'))
    this.mapCharts = echarts.init(document.getElementById('mapCharts'))
    this.findDay()
    this.findMonth()
    this.findMap()
    window.onresize = () => {
      this.dayCharts.resize()
      this.monthCharts.resize()
      this.mapCharts.resize()
    }
  },
  methods: {
    findDay() {
      let time = formatDate(this.dayTime, 'yyyymmdd')
      const loading = this.$loading({
        lock: true,
        target: document.getElementById('dayData'),
        text: 'Loading',
        spinner: 'el-icon-loading'
      })
      for (const key in this.dayResult) {
        if (this.dayResult.hasOwnProperty(key)) {
          this.dayResult[key] = []
        }
      }
      backEndService
        .getData({
          Code: '31109',
          OccurTime: time,
          QueryType: this.daySelect
        })
        .then(data => {
          let serverData = data.Message
          let StoreSaleInfoGroup = serverData.StoreSaleInfoGroup || []
          this.dayResult.rank = serverData.StoreRankInfoGroup || []
          if (StoreSaleInfoGroup.length) {
            for (let i = 0; i < StoreSaleInfoGroup.length; i++) {
              this.dayResult.quantity.push(StoreSaleInfoGroup[i].Quantity)
              this.dayResult.amount.push(StoreSaleInfoGroup[i].Amount)
              this.dayResult.voucherCount.push(StoreSaleInfoGroup[i].VoucherCount)
            }
          }
        })
        .catch(errorHandler())
        .finally(() => {
          dayOption.series[0].data = this.dayResult.voucherCount
          dayOption.series[1].data = this.dayResult.quantity
          dayOption.series[2].data = this.dayResult.amount
          this.dayCharts.setOption(dayOption)
          this.$nextTick(() => {
            loading.close()
          })
        })
    },

    findMonth() {
      let time = formatDate(this.monthTime, 'yyyymm')
      const loading = this.$loading({
        lock: true,
        target: document.getElementById('monthData'),
        text: 'Loading',
        spinner: 'el-icon-loading'
      })
      for (const key in this.monthResult) {
        if (this.monthResult.hasOwnProperty(key)) {
          this.monthResult[key] = []
        }
      }
      backEndService
        .getData({
          Code: '31111',
          OccurTime: time,
          QueryType: this.monthSelect
        })
        .then(data => {
          let serverData = data.Message
          let StoreSaleListGroup = serverData.StoreSaleListGroup
          this.monthResult.rank = serverData.StoreRankListGroup || []
          if (StoreSaleListGroup.length) {
            for (let i = 0; i < StoreSaleListGroup.length; i++) {
              this.monthResult.quantity.push(StoreSaleListGroup[i].Quantity)
              this.monthResult.amount.push(StoreSaleListGroup[i].Amount)
              this.monthResult.voucherCount.push(StoreSaleListGroup[i].VoucherCount)
              this.monthResult.xData.push(StoreSaleListGroup[i].TimeSection)
            }
          }
        })
        .catch(errorHandler())
        .finally(() => {
          monthOption.xAxis[0].data = this.monthResult.xData
          monthOption.series[0].data = this.monthResult.voucherCount
          monthOption.series[1].data = this.monthResult.quantity
          monthOption.series[2].data = this.monthResult.amount
          this.monthCharts.setOption(monthOption)
          this.$nextTick(() => {
            loading.close()
          })
        })
    },

    findMap() {
      const loading = this.$loading({
        lock: true,
        target: document.getElementById('mapData'),
        text: 'Loading',
        spinner: 'el-icon-loading'
      })
      this.mapResult = {
        saleSumCount: '',
        sumCount: '',
        sumUserCount: '',
        totalAmount: '',
        mapEffectiveCount: [],
        mapTotalCount: [],
        mapAmount: [],
        mapUserCount: []
      }
      backEndService
        .getData({
          Code: '31113'
        })
        .then(data => {
          let serverData = data.Message
          let regionSaleListGroup = serverData.RegionSaleListGroup || []
          let len = regionSaleListGroup.length

          this.mapResult.saleSumCount = serverData.SaleSumCount
          this.mapResult.sumCount = serverData.SumCount
          this.mapResult.sumUserCount = serverData.SumUserCount
          this.mapResult.totalAmount = serverData.TotalAmount

          if (len) {
            for (let i = 0; i < len; i++) {
              this.mapResult.mapEffectiveCount.push({
                name: regionSaleListGroup[i].Province,
                value: regionSaleListGroup[i].EffectiveCount
              })
              this.mapResult.mapTotalCount.push({
                name: regionSaleListGroup[i].Province,
                value: regionSaleListGroup[i].TotalCount
              })
              this.mapResult.mapAmount.push({
                name: regionSaleListGroup[i].Province,
                value: regionSaleListGroup[i].Amount
              })
              this.mapResult.mapUserCount.push({
                name: regionSaleListGroup[i].Province,
                value: regionSaleListGroup[i].UserCount
              })
            }
          }
        })
        .catch(errorHandler())
        .finally(() => {
          mapOption.series[0].data = this.mapResult.mapEffectiveCount
          mapOption.series[1].data = this.mapResult.mapTotalCount
          mapOption.series[2].data = this.mapResult.mapAmount
          mapOption.series[3].data = this.mapResult.mapUserCount
          this.mapCharts.setOption(mapOption)
          this.$nextTick(() => {
            loading.close()
          })
        })
    },

    dateChange(type = 1) {
      if (type === 1) {
        this.findDay()
      } else {
        this.findMonth()
      }
    },

    selectChange(type) {
      if (type === 1) {
        this.findDay()
      } else {
        this.findMonth()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.active-analyze {
  .box {
    margin: 0 auto;
    padding: 20px 25px;
  }
}

.containal {
  margin-bottom: 20px;

  border-right: 1px solid #e1e6eb;
  border-bottom: 1px solid #e1e6eb;
  border-left: 1px solid #e1e6eb;
  .title {
    line-height: 55px;

    height: 55px;

    border: 1px solid #e1e6eb;
    border-left: 4px solid #6d7781;
    background: #f5f6fa;
    span {
      margin: 0 20px;
    }
  }
  .content {
    overflow: hidden;
    .line {
      width: 1px;
      height: 340px;
      margin: 30px 1%;

      background: #d7d7d7;
    }
  }
  .day-table {
    .price {
      color: #3aa1ff;
    }
    .el-table {
      table {
        tr:nth-child(1) {
          .index-tip {
            background: #f3625c;
          }
        }
        tr:nth-child(2) {
          .index-tip {
            background: #f7a83d;
          }
        }
        tr:nth-child(3) {
          .index-tip {
            background: #5aced1;
          }
        }
      }
    }
    .index-tip {
      font-size: 12px;
      line-height: 18px;

      display: inline-block;

      width: 18px;
      height: 18px;

      text-align: center;

      color: #fff;
      border-radius: 50%;
      background: #5cc2f8;
    }
    .table-title {
      font-size: 12px;
      line-height: 30px;

      height: 30px;
      padding-top: 40px;

      border-bottom: 1px solid #ebeef5;
    }
  }
  .month-content {
    .month {
      padding: 0 40px;
    }
    .day-table {
      .table-title {
        padding: 0;
      }
    }
  }
  .map-title {
    display: flex;

    padding: 40px 0;

    justify-content: space-around;
    .item {
      overflow: hidden;
      .icon {
        font-size: 24px;
        line-height: 50px;

        width: 50px;
        height: 50px;

        text-align: center;

        color: #fff;
        border-radius: 50%;
        background: #3a9cff;
      }
      .data {
        margin-left: 20px;
        .map-key {
          font-size: 12px;
          font-weight: 400;

          color: #999;
        }
        .num {
          font-size: 24px;
          font-weight: 700;

          color: #666;
        }
      }
    }
  }
}
</style>
