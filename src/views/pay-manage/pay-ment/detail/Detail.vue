<template>
  <div class="pay-ment-detail">
    <div class="enterprise-info">
      <div class="title">
        <i class="el-icon-document"></i>
        <span>企业信息</span>
      </div>
      <ul class="info">
        <li v-if="!isAgent">
          <div class="key">企业ID</div>
          <div class="value">{{enterpriseId}}</div>
        </li>
        <li>
          <div class="key">企业名称</div>
          <div class="value">{{CompanyName}}</div>
        </li>
        <li v-if="isAgent"></li>
      </ul>
    </div>
    <div class="table-box">
      <div class="title">
        <span>数据列表</span>
        <div class="btn fr">
          <el-button
            type="primary"
            :disabled="!dataList.length"
            size="small"
            @click="exportExcel"
          >导出</el-button>
        </div>
      </div>
      <div class="table">
        <el-table
          ref="singleTable"
          :data="dataList"
          style="width: 100%"
          size="mini"
          max-height="450"
          id="table-data"
          border
          tooltip-effect="dark"
        >
          <el-table-column label="缴费项目">
            <template slot-scope="scope">
              <div v-if="scope.row.Operate == 1">新增站点</div>
              <div v-if="scope.row.Operate == 2">软件续费</div>
              <div v-if="scope.row.Operate == 3">开通</div>
            </template>
          </el-table-column>
          <el-table-column label="缴费时间" width="200">
            <template slot-scope="scope">{{scope.row.OccurTime | formatDate('yyyy-mm-dd hh:MM:ss')}}</template>
          </el-table-column>
          <el-table-column property="Quantity" label="缴费站点数" width="200"></el-table-column>
          <el-table-column label="缴费金额（元）" v-if="!isAgent">
            <template slot-scope="scope">{{scope.row.Amount | number(2)}}</template>
          </el-table-column>
          <el-table-column property="Quantity" v-else label="扣除点数" width="200"></el-table-column>
          <el-table-column property="PayType" label="支付方式"></el-table-column>
          <el-table-column property="Operator" label="操作人"></el-table-column>
          <el-table-column property="Memo" label="备注" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { Table, TableColumn } from 'element-ui'
import { env } from '@/core/js/env'
import { backEndService } from '@/core/js/services'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'

export default {
  name: 'PayMentDetail',
  components: {
    'el-table': Table,
    'el-table-column': TableColumn
    // 'el-date-picker': DatePicker
  },
  data() {
    return {
      isAgent: env.getUser().isAgent,
      enterpriseId: 0,
      // filterOptions: {
      //   date: ''
      // },
      dataList: [],
      CompanyName: '', //公司名称
      loading: false
    }
  },
  mounted() {
    this.init()
  },
  beforeRouteUpdate(to, from, next) {
    next(() => {
      this.init()
    })
  },
  methods: {
    init() {
      this.enterpriseId = this.$route.params.enterpriseId
      this.findData()
    },
    findData() {
      this.loading = true
      backEndService
        .getData({
          Code: 31517,
          AuthCode: this.enterpriseId
        })
        .then(data => {
          this.loading = false
          let serverData = data.Message
          this.dataList = serverData.PurRecordListGroup || []
          this.CompanyName = serverData.CompanyName || ''
        })
        .catch(err => {
          this.loading = false
          this.$message.error(err.message)
        })
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

<style lang="scss" scoped>
.pay-ment-detail {
  .enterprise-info {
    .title {
      padding: 20px 0 20px 10px;
      > span {
        padding-left: 10px;
      }
    }
    .info {
      display: flex;

      border: 1px solid #e9e9e9;
      border-right: none;
      > li {
        line-height: 40px;

        display: flex;

        flex: 1;
        .key {
          padding-right: 40px;

          text-align: right;

          color: #333;
          border-right: 1px solid #e9e9e9;
          background: #f9f9f9;

          flex: 2;
        }
        .value {
          padding-left: 20px;

          color: #666;
          border-right: 1px solid #e9e9e9;

          flex: 3;
        }
      }
    }
  }
  .top-filter {
    display: flex;

    padding: 25px;

    justify-content: space-between;
  }
  .table {
    margin-bottom: 20px;
  }
}
</style>
