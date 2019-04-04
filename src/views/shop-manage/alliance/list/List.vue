<template>
  <div>
    <!-- 数据筛选 -->
    <div class="fl-wrap">
      <div class="fl-header">数据筛选</div>
      <div class="fl-body">
        <div>
          <div class="fl-item">
            <label for="">联盟名称:</label>
            <el-input size="medium" class="fl-item-18" v-model.trim="search.UnionName"/>
          </div>
          <div class="fl-item">
            <label for="">联盟ID</label>
            <el-input class="fl-item-18" size="medium" v-model.trim="search.UnionId"/>
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
          <el-button size="medium" :disabled="isClick" @click="dialogShow">查看</el-button>
          <el-button size="medium" :disabled="isClick" @click="redact">编辑</el-button>
          <el-button size="medium" type="primary" @click="increased">新增</el-button>
        </div>
      </div>
      <el-table
        v-loading="loading"
        :data="UnionData"
        @cell-click="getRow"
        border=""
        highlight-current-row
        size="mini"
        ref="singleTable"
        max-height="450"
        style="width: 100%"
      >
        <el-table-column prop="UnionId" label="联盟ID" width="85"/>
        <el-table-column prop="Union" label="联盟名称" width="200" show-overflow-tooltip/>
        <el-table-column prop="Master" label="盟主门店名称" show-overflow-tooltip/>
        <el-table-column prop="Brand" label="主营品牌" show-overflow-tooltip/>
        <el-table-column label="所属地区" width="130">
          <template slot-scope="scope">
            <span>{{ scope.row.Province }} {{ scope.row.City }} {{ scope.row.County }}</span>
          </template>
        </el-table-column>
        <el-table-column width="85" prop="AdminCreateUser" label="创建人" show-overflow-tooltip/>
        <el-table-column prop="CreateDate" label="创建时间" width="140">
          <template slot-scope="scope">
            <span class="price">{{ scope.row.CreateDate | transitionTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="AdminUpdateUser" width="85" label="最后修改人" show-overflow-tooltip/>
        <el-table-column prop="UpdateTime" label="最后修改时间" width="140">
          <template slot-scope="scope">
            <span class="price">{{ scope.row.UpdateTime | transitionTime }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="ep-table-page">
        <el-pagination
          background=""
          :total="totalCount"
          :page-size="condition.CountPerPage"
          layout="prev, pager, next, sizes"
          :page-sizes="[10, 20, 30, 40]"
          @size-change="handleSizeChange"
          @current-change="handlePageCurrentChange"
        />
      </div>
    </div>
    <el-dialog :title="currentUnionContent.Union" :visible.sync="dialogVisible" width="450px">
      <el-card shadow="never">
        <div>
          <span class="detail-title">联盟名称：</span>
          <span>{{currentUnionContent.Union}}</span>
        </div>
        <div>
          <span class="detail-title">盟主门店：</span>
          <span>{{currentUnionContent.Master}}</span>
        </div>
        <div>
          <span class="detail-title">所属地区：</span>
          <span>{{currentUnionContent.Province}} {{currentUnionContent.City}} {{currentUnionContent.County}}</span>
        </div>
        <div>
          <span class="detail-title">主营品牌：</span>
          <span>{{currentUnionContent.Brand}}</span>
        </div>
        <div>
          <span class="detail-title">&nbsp;&nbsp;&nbsp;操作人：</span>
          <span>{{currentUnionContent.AdminUpdateUser}}</span>
        </div>
        <div>
          <span class="detail-title">操作时间：</span>
          <span>{{currentUnionContent.UpdateTime | transitionTime}}</span>
        </div>
        <div>
          <span class="detail-title">备注内容：</span>
          <!-- <span>{{currentUnionContent.Description}}</span> -->
          <el-input type="textarea" :rows="2" readonly v-model="currentUnionContent.Description"/>
        </div>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import { Input, Table, Button, TableColumn, Pagination,  Dialog, Card } from 'element-ui'
import { backEndService, errorHandler } from '@/core/js/services'
import { updateCondition } from '@/views/shop-manage/controlCondition.js'
export default {
  name: 'AllianceList',
  components: {
    'el-input': Input,
    'el-button': Button,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-pagination': Pagination,
    'el-dialog': Dialog,
    'el-card': Card,
  },
  data() {
    return {
      dialogVisible: false,
      showDialog: false,
      companyAll: [],
      search: {
        UnionName: '',
        UnionId: '',
      },
      loading: false,
      isClick: true,
      UnionData: [],
      currentUnion: {
        authcode: '',
        currentid: ''
      },
      currentUnionContent: {},
      totalCount: 10,
      condition: {
        Code: 31567,
        Page: 0,
        CountPerPage: 10,
        OrderField: '',
        OrderByDescending: true,
        AuthCode: '',
        currentId: '',
        Store: ''
      }
    }
  },
  activated() {
    this.findData()
    // this.findCompany()
  },
  methods: {
    findData() {
      this.loading = true
      const shortCondition = {
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
          if (result.Message.UnionListGroup && result.Message.UnionListGroup.length > 0) {
            this.UnionData = [...result.Message.UnionListGroup.map(item => item.UnionInfos)]
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
    // findCompany() {
    //   backEndService
    //     .getData({
    //       Code: 31519
    //     })
    //     .then(res => {
    //       if (!!res.Message.CompanyListGroup > 0) {
    //         this.companyAll = Object.assign([], this.companyAll, res.Message.CompanyListGroup)
    //       }
    //     })
    //     .catch(errorHandler())
    // },
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
    dialogShow(){
      this.dialogVisible = true
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
          UnionName: this.search.UnionName,
          UnionId: this.search.UnionId,
          Page: 0
        })
      )
      this.$message.success(tip ? tip : '已查询')
    },
    // 获取当前行
    getRow(row) {
      this.currentUnionContent = row
      this.currentUnion = Object.assign({}, this.currentUnion)
    },
    // 查看
    checkDetail() {
      this.$router.push({
        path: '/shop-manage/alliance/detail',
        query: {
          authcode: this.currentUnion.authcode,
          currentid: this.currentUnion.currentid
        }
      })
    },
    // 新增
    increased() {
      this.$router.push({
        path: '/shop-manage/alliance/add'
      })
    },
    // 编辑
    redact() {
      this.$router.push({
        path: '/shop-manage/alliance/redact',
        query: this.currentUnionContent
      })
    }
  },
  watch: {
    // 监听选中的公司
    currentUnion(val) {
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
.detail-title{
  display: inline-block;
  width: 100px;
  line-height: 30px;
}
</style>
