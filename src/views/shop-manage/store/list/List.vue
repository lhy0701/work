<template>
  <div>
    <!-- 数据筛选 -->
    <div class="fl-wrap">
      <div class="fl-header">数据筛选</div>
      <div class="fl-body">
        <div>
          <div class="fl-item">
            <label for>所属企业:</label>
            <el-autocomplete
              popper-class="my-autocomplete"
              v-model.trim="search.CompanyName"
              :fetch-suggestions="querySearch"
              placeholder="请输入内容"
              @select="SelectFirm"
            >
              <template slot-scope="{ item }">
                <div class="name">
                  {{ item.CompanyName }}
                  <span v-if="!isAgent">({{item.AuthCode}})</span>
                </div>
              </template>
            </el-autocomplete>
            <!-- <el-input
                size="medium"
                class="fl-item-18"
                v-model.trim="search.CompanyName"
            />-->
          </div>
          <div class="fl-item" v-if="!isAgent">
            <label for>门店ID</label>
            <el-input class="fl-item-18" size="medium" v-model.trim="search.StoreId"/>
          </div>
          <div class="fl-item">
            <label for>门店名称</label>
            <el-input class="fl-item-18" size="medium" v-model.trim="search.Store"/>
          </div>
          <div class="fl-btn">
            <el-button size="medium" @click="reset(1)" type="primary">查询</el-button>
            <el-button size="medium" @click="reset(0)">重置</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 列表数据 -->
    <div class="ep-table-wrap">
      <div class="ep-table-thead">
        <div class="ep-table-th-title">数据列表</div>
        <div class="ep-table-th-handle">
          <el-button size="medium" :disabled="isClick" @click="checkDetail">查看</el-button>
          <el-button size="medium" :disabled="isClick" @click="redact">编辑</el-button>
          <el-button size="medium" type="primary" @click="increased">新增</el-button>
        </div>
      </div>
      <el-table
        v-loading="loading"
        :data="StoreData"
        @cell-click="getRow"
        border
        highlight-current-row
        size="mini"
        ref="singleTable"
        max-height="450"
        style="width: 100%"
      >
        <el-table-column v-if="!isAgent" prop="StoresInfo.StoreId" label="门店ID" width="65"/>
        <el-table-column prop="StoresInfo.Store" label="门店名称" width="200" show-overflow-tooltip/>
        <el-table-column prop="StoresInfo.CompanyName" label="所属企业" show-overflow-tooltip/>
        <!-- <el-table-column
          prop="StoresInfo.Union"
          label="所属联盟"
          width='100'
        />-->
        <el-table-column prop="StoresInfo.Brand" label="主营品牌" show-overflow-tooltip/>
        <el-table-column label="门店性质" width="80">
          <template slot-scope="scope">
            <span
              style="margin-left: 10px"
            >{{ !!(scope.row.StoresInfo.StoreType * 1)? '分店' : '总店' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="StoresInfo.AdminCreateUser" label="创建人" width="65"/>
        <el-table-column prop="StoresInfo.AdminCreateUser" label="创建时间" width="140">
          <template slot-scope="scope">
            <span class="price">{{ scope.row.StoresInfo.CreateDate | transitionTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="StoresInfo.AdminUpdateUser" label="最后修改人" width="140"/>
        <el-table-column prop="StoresInfo.UpdateTime" label="最后修改时间" width="140">
          <template slot-scope="scope">
            <span class="price">{{ scope.row.StoresInfo.UpdateTime | transitionTime }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="ep-table-page">
        <el-pagination
          background
          :total="totalCount"
          :page-size="condition.CountPerPage"
          layout="prev, pager, next, sizes"
          :page-sizes="[10, 20, 30, 40]"
          @size-change="handleSizeChange"
          @current-change="handlePageCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { Input, Table, Button, TableColumn, Pagination, Autocomplete } from 'element-ui'
import { backEndService, errorHandler } from '@/core/js/services'
import { updateCondition } from '@/views/shop-manage/controlCondition.js'
import { env } from '@/core/js/env'

export default {
  name: 'StoreList',
  components: {
    'el-input': Input,
    'el-button': Button,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-pagination': Pagination,
    'el-autocomplete': Autocomplete
  },
  data() {
    return {
      isAgent: env.getUser().isAgent,
      companyAll: [],
      search: {
        Store: '',
        StoreId: '',
        CompanyName: ''
      },

      loading: false,
      isClick: true,
      StoreData: [],
      currentStore: {
        authcode: '',
        storeid: ''
      },
      totalCount: 10,
      condition: {
        Code: 31509,
        Page: 0,
        CountPerPage: 10,
        OrderField: '',
        OrderByDescending: true,
        AuthCode: '',
        StoreId: '',
        Store: ''
      }
    }
  },
  activated() {
    this.findData()
    this.findCompany()
  },
  methods: {
    findData() {
      this.loading = true
      const shortCondition = {
        AgentUserId: this.isAgent ? env.getUser().userId : '',
        ...Object.assign(this.condition)
      }
      for (let key in shortCondition) {
        if (!shortCondition[key]) {
          delete shortCondition[key]
        }
      }
      backEndService
        .getData(shortCondition)
        .then(result => {
          console.log('数据', result)
          if (result.Message.BackstageStoreListGroup && result.Message.BackstageStoreListGroup.length > 0) {
            this.StoreData = [...result.Message.BackstageStoreListGroup]
            this.totalCount = result.Message.TotalCount * 1
          } else {
            this.$message.success('未找到符合数据')
          }
        })
        .catch(errorHandler())
        .finally(() => {
          this.loading = false
        })
    },
    findCompany() {
      let message = {
        Code: 31519
      }
      if (this.isAgent) {
        message.AgentUserId = env.getUser().userId
      }
      backEndService
        .getData(message)
        .then(res => {
          if (!!res.Message.CompanyListGroup > 0) {
            this.companyAll = Object.assign([], this.companyAll, res.Message.CompanyListGroup)
          }
        })
        .catch(errorHandler())
    },
    querySearch(queryString, cb) {
      var companyAll = this.companyAll
      var results = queryString ? companyAll.filter(this.createFilter(queryString)) : companyAll
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    // 过滤条件
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.AuthCode.toLowerCase().indexOf(queryString.toLowerCase()) === 0 ||
          restaurant.CompanyName.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
      }
    },
    SelectFirm(item) {
      // this.companyContainer = Object.assign({}, this.companyContainer, item)
      // this.requestForm = Object.assign({}, this.requestForm, {
      //   AuthCode: item.AuthCode,
      //   StoreType: item.Count * 1 > 0 ? 1 : 0
      // })
      this.search.CompanyName = item.CompanyName
    },
    // 修改显示数目
    handleSizeChange(pageNum) {
      this.condition.CountPerPage = pageNum
    },
    // 当前页
    handlePageCurrentChange(pageSize) {
      this.condition.Page = pageSize - 1
    },
    reset(type) {
      let tip
      if (!type) {
        this.search = Object.assign({}, this.search, updateCondition(0, this.search)) // 为了清除搜索框内数据
        tip = '已重置.'
      }
      this.condition = Object.assign(
        {},
        this.condition,
        updateCondition(type, {
          CompanyName: this.search.CompanyName,
          Store: this.search.Store,
          StoreId: this.search.StoreId,
          Page: 0
        })
      )
      this.$message.success(tip ? tip : '已查询')
    },
    // 获取当前行
    getRow(row) {
      this.currentStore = Object.assign({}, this.currentStore, {
        authcode: row.StoresInfo.AuthCode,
        storeid: row.StoresInfo.StoreId
      })
    },
    // 查看
    checkDetail() {
      this.$router.push({
        path: '/shop-manage/store/detail',
        query: {
          authcode: this.currentStore.authcode,
          storeid: this.currentStore.storeid
        }
      })
    },
    // 新增
    increased() {
      this.$router.push({
        path: '/shop-manage/store/add'
      })
    },
    // 编辑
    redact() {
      this.$router.push({
        path: '/shop-manage/store/redact',
        query: this.currentStore
      })
    }
  },
  watch: {
    // 监听选中的公司
    currentStore(val) {
      val.StoresInfo !== '' ? (this.isClick = false) : (this.isClick = true)
    },
    // 监听条件变化
    condition: {
      handler() {
        this.findData()
      },
      deep: true
    }
  }
}
</script>

<style>
</style>
