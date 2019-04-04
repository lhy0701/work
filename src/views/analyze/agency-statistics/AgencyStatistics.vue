<template>
  <div>
    <div class="fl-wrap">
      <div class="fl-header">数据筛选</div>
      <div class="fl-body">
        <div>
          <div class="fl-item">
            <label for class="agent-name">代理人用户名</label>
            <el-input size="medium" class="fl-item-18" v-model.trim="search.AgentUserName"/>
          </div>
          <div class="fl-item">
            <label for>代理人姓名</label>
            <el-input class="fl-item-18" size="medium" v-model.trim="search.AgentName"/>
          </div>
          <div class="fl-btn">
            <el-button size="medium" @click="reset(1)" type="primary">查询</el-button>
            <el-button size="medium" @click="reset(0)">重置</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="ep-table-wrap">
      <div class="ep-table-thead">
        <div class="ep-table-th-title">数据列表</div>
      </div>
      <el-table
        v-loading="loading"
        :data="StoreData"
        border
        highlight-current-row
        size="mini"
        max-height="450"
        style="width: 100%"
      >
        <el-table-column prop="AuthCode" label="ID" width="138"/>
        <el-table-column prop="CompanyName" label="企业名称" width="364" show-overflow-tooltip/>
        <el-table-column prop="LoginID" label="代理人用户名" show-overflow-tooltip/>
        <el-table-column prop="UserName" label="代理人姓名" show-overflow-tooltip/>
        <el-table-column prop="Quantity" label="开通与续费台数" show-overflow-tooltip/>
      </el-table>
      <div class="ep-table-container">
        <div class="number-count">
          <span>
            合计:&nbsp;&nbsp;数目条数:
            <b>{{Numbers}}</b>&nbsp;&nbsp;
            <span>
              开通与续费台数:
              <b>{{AllQuantitys}}</b>
            </span>
          </span>
        </div>
        <div class="ep-table-page">
          <el-pagination
            background
            :total="totalCount"
            :page-size="10"
            layout="prev, pager, next, sizes"
            :page-sizes="[10, 20, 30, 40]"
            :current-page= 'condition.Page'
            @size-change="handleSizeChange"
            @current-change="handlePageCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Input, Button, Table, TableColumn, Pagination, Select, Option, Autocomplete } from 'element-ui'
import { backEndService, errorHandler } from '@/core/js/services'
import { updateCondition } from '@/views/shop-manage/controlCondition.js'
import { env } from '@/core/js/env'
export default {
  name: 'AgencyStatistics',
  components: {
    'el-input': Input,
    'el-button': Button,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-pagination': Pagination,
    'el-select': Select,
    'el-option': Option,
    'el-autocomplete': Autocomplete
  },
  data() {
    return {
      restaurants: [],
      loading: false,
      StoreData: [],
      Numbers: 0,
      Quantitys: 0,
      AllQuantitys: 0,
      search: {
         AgentUserName: '',
         AgentName: ''
      },
      totalCount: 10,
      condition: {
        Code: 31025,
        Page: 0,
        CountPerPage: 10,
        UserName: '',
        LoginID: '',
      }
    }
  },
  created() {
    this.findData()
  },
  mounted() {},
  methods: {
    findData() {
        this.loading = true
        const shortCondition = {
          AgentUserId: this.isAgent ? env.getUser().userId : '',
          ...Object.assign({},this.condition,{Page:this.condition.Page-1})
        }
        for (let key in shortCondition) {
          if (!shortCondition[key]) {
            delete shortCondition[key]
          }
        }
        backEndService
          .getData(shortCondition)
          .then(result => {
            if (result.Message.AgentCompanyListGroup && result.Message.AgentCompanyListGroup.length > 0) {
              this.StoreData = [...result.Message.AgentCompanyListGroup]
              this.totalCount = result.Message.TotalCount * 1
              this.Numbers = result.Message.TotalCount
              this.AllQuantitys= result.Message.SumQuantity
            } else {
              this.StoreData = []
              this.totalCount = 0
              this.Numbers = 0
              this.Quantitys = 0
              this.AllQuantitys = 0
              this.$message.success('未找到符合数据')
            }
          })
          .catch(errorHandler())
          .finally(() => {
            this.loading = false
          })
      },
    // 查询
    reset(type) {
      let tip
      this.condition.Page = 0
      if (!type) {
        
        this.search = Object.assign({}, this.search, updateCondition(0, this.search)) // 为了清除搜索框内数据
        tip = '已重置.'
      }
      this.condition = Object.assign(
        {},
        this.condition,
        updateCondition(type, {
          LoginID: this.search.AgentUserName,
          UserName: this.search.AgentName
        })
      )
      this.findData()
      this.$message.success(tip ? tip : '已查询')
    },
    // 修改显示数目
    handleSizeChange(pageNum) {
      this.condition.CountPerPage = pageNum
      this.findData()
    },
    // 当前页
    handlePageCurrentChange(pageSize) {
      this.condition.Page = pageSize
      this.findData()
    }
  }
}
</script>
<style scoped lang='scss'>
.agent-name {
  margin-right: 10px;
}
.fl-btn {
  float: none !important;
  margin-left: 20px;
}
.ep-table-container {
  .number-count {
    float: left;
    margin-top: 10px;
    b {
      font-weight: normal;
    }
  }
}
</style>
