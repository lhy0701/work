<template>
  <div>
    <!-- 数据筛选 -->
    <div class="fl-wrap">
      <div class="fl-header">数据筛选</div>
      <div class="fl-body">
        <div>
          <div class="fl-item">
            <label for>企业名称:</label>
            <el-input size="medium" class="fl-item-18" v-model.trim="searchFirm.name"/>
          </div>
          <div class="fl-item" v-if="!isAgent">
            <label for>企业ID:</label>
            <el-input class="fl-item-18" size="medium" v-model.trim="searchFirm.code"/>
          </div>
          <div class="fl-item">
            <label for>电话:</label>
            <el-input class="fl-item-18" size="medium" v-model.trim="searchFirm.mobile"/>
          </div>
          <div class="fl-item">
            <label for>地址:</label>
            <el-input class="fl-item-18" size="medium" v-model.trim="searchFirm.address"/>
          </div>
          <div class="fl-item" v-if="!isAgent">
            <label for>白名单:</label>
            <el-select v-model.trim="searchFirm.status" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
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
          <el-button v-if="!isAgent" size="medium" :disabled="isClick" @click="showDialog(2)">所属联盟</el-button>
          <el-button
            v-if="!isAgent"
            size="medium"
            :disabled="isClick || currentRow.IsVip !== 'False'"
            @click="addVip"
          >添加白名单</el-button>
          <el-button
            v-if="!isAgent"
            size="medium"
            :disabled="isClick || currentRow.IsVip !== 'True'"
            @click="removeVip"
          >移除白名单</el-button>
          <el-button size="medium" :disabled="isClick" @click="showDialog(1)">在线站点</el-button>
          <el-button size="medium" :disabled="isClick" @click="checkDetail">查看</el-button>
          <el-button size="medium" :disabled="isClick" @click="checkIncreased(1)">编辑</el-button>
          <el-button size="medium" type="primary" @click="checkIncreased(0)">新增</el-button>
        </div>
      </div>
      <el-table
        v-loading="loading"
        :data="firmData"
        @cell-click="getRow"
        border
        highlight-current-row
        size="mini"
        ref="singleTable"
        max-height="450"
        style="width: 100%"
      >
        <el-table-column v-if="!isAgent" prop="AuthInfo.AuthCode" label="ID" width="60"/>
        <el-table-column prop="AuthInfo.Name" label="企业名称" show-overflow-tooltip/>
        <el-table-column prop="AuthInfo.BrandList" label="主营品牌" show-overflow-tooltip/>
        <el-table-column prop="AuthInfo.Contract" label="联系人" width="80" show-overflow-tooltip/>
        <el-table-column property="AuthInfo.Mobile" width="110" label="联系方式" show-overflow-tooltip></el-table-column>
        <el-table-column property="AuthInfo.Address" label="联系地址" show-overflow-tooltip></el-table-column>
        <el-table-column label="白名单" width="80" v-if="!isAgent">
          <template slot-scope="scope">
            <span v-if="scope.row.AuthInfo.IsVip == 'True'">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="AuthInfo.AdminCreateUser"
          label="创建人"
          width="80"
          show-overflow-tooltip
        />
        <el-table-column prop="AuthInfo.CreateDate" label="创建时间" width="160">
          <template slot-scope="scope">
            <span class="price">{{ scope.row.AuthInfo.CreateDate | transitionTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="AuthInfo.AdminUpdateUser" label="最后修改人" width="90"/>
        <el-table-column prop="AuthInfo.UpdateTime" label="最后修改时间" width="160">
          <template slot-scope="scope">
            <span class="price">{{ scope.row.AuthInfo.UpdateTime | transitionTime }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="ep-table-page">
        <el-pagination
          background
          :page-size="condition.CountPerPage"
          layout="prev, pager, next, sizes"
          :page-sizes="[10, 20, 30, 40]"
          :total="totalCount"
          @size-change="handleSizeChange"
          @current-change="handlePageCurrentChange"
        />
      </div>
    </div>
    <Dialog
      v-if="dialogShow"
      :isShow="dialogShow"
      :authCode="currentCode"
      :dialogType="dialogType"
      @closeModel="dialogClose"
    ></Dialog>
  </div>
</template>

<script>
import { Input, Button, Table, TableColumn, Pagination, Select, Option } from 'element-ui'
import { backEndService, errorHandler } from '@/core/js/services'
import { updateCondition } from '@/views/shop-manage/controlCondition.js'
import { env } from '@/core/js/env'
import Dialog from './Dialog.vue'

export default {
  name: 'EnterPriseList',
  components: {
    'el-input': Input,
    'el-button': Button,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-pagination': Pagination,
    'el-select': Select,
    'el-option': Option,
    Dialog
  },
  activated() {
    this.findData()
  },
  data() {
    return {
      isAgent: env.getUser().isAgent,
      loading: true,
      isClick: true,
      firmData: [],
      currentCode: '',
      currentRow: '', // 选中行
      totalCount: 10,
      dialogShow: false,
      dialogType: 0,
      searchFirm: {
        name: '',
        code: '',
        mobile: '',
        address: '',
        status: '0'
      },
      condition: {
        Code: 31505,
        Page: 0,
        CountPerPage: 10,
        OrderField: '',
        OrderByDescending: true,
        AuthCode: '',
        Name: '',
        Mobile: '',
        Address: ''
      },
      options: [
        {
          value: '0',
          label: '全部'
        },
        {
          value: '1',
          label: '是'
        },
        {
          value: '2',
          label: '否'
        }
      ]
    }
  },
  watch: {
    // 监听选中的公司
    currentCode(val) {
      val !== '' ? (this.isClick = false) : (this.isClick = true)
    },
    // 监听条件变化
    condition: {
      handler() {
        this.findData()
      },
      deep: true
    }
  },
  methods: {
    findData() {
      this.currentCode = ''
      this.currentRow = '' // 选中行
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
          if (result.Message.AuthInfoListGroup && result.Message.AuthInfoListGroup.length > 0) {
            this.firmData = result.Message.AuthInfoListGroup
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

    // 重置条件 or 查询条件
    reset(type) {
      let tip
      if (!type) {
        this.searchFirm = Object.assign({}, this.searchFirm, updateCondition(0, this.searchFirm)) // 为了清除搜索框内数据
        tip = '已重置.'
      }
      this.condition = Object.assign(
        {},
        this.condition,
        updateCondition(type, {
          Name: this.searchFirm.name,
          AuthCode: this.searchFirm.code,
          Mobile: this.searchFirm.mobile,
          Address: this.searchFirm.address,
          IsVip: this.searchFirm.status == 0 ? '' : this.searchFirm.status == 1 ? 'True' : 'False',
          Page: 0
        })
      )
      this.$message.success(tip ? tip : '已查询')
    },
    // 查看 判断是否存在 code
    checkDetail() {
      this.currentCode
        ? this.$router.push({
            path: '/shop-manage/enterprise/detail',
            query: {
              authcode: this.currentCode
            }
          })
        : this.$message.success('请选中查看的企业')
    },
    // 新增
    checkIncreased(flag) {
      if (flag === 1) {
        this.$router.push({
          path: '/shop-manage/enterprise/redact',
          query: {
            authcode: this.currentCode
          }
        })
      } else {
        this.$router.push({
          path: '/shop-manage/enterprise/add'
        })
      }
    },
    // 修改显示数目
    handleSizeChange(pageNum) {
      this.condition.CountPerPage = pageNum
    },
    // 当前页
    handlePageCurrentChange(pageSize) {
      this.condition.Page = pageSize - 1
    },
    // 获取当前行
    getRow(row) {
      this.currentRow = row.AuthInfo
      this.currentCode = row.AuthInfo.AuthCode
    },
    // 显示在线站点
    showDialog(type) {
      this.dialogShow = true
      this.dialogType = type
    },
    // 关闭弹窗
    dialogClose() {
      this.currentData = null
      this.dialogShow = false
    },
    // 移除白名单
    removeVip() {
      this.$confirm('是否将所选择的企业移出白名单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      })
        .then(() => {
          backEndService
            .getData({
              Code: '31533',
              AuthCode: this.currentCode
            })
            .then(() => {
              this.currentRow.IsVip = 'False'
              this.$message({
                type: 'success',
                message: '移除成功!'
              })
            })
            .catch(errorHandler())
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消移除白名单'
          })
        })
    },
    // 移除白名单
    addVip() {
      this.$confirm('是否将所选择的企业加出白名单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      })
        .then(() => {
          backEndService
            .getData({
              Code: '31551',
              AuthCode: this.currentCode
            })
            .then(() => {
              this.currentRow.IsVip = 'True'
              this.$message({
                type: 'success',
                message: '添加成功!'
              })
            })
            .catch(errorHandler())
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消添加白名单'
          })
        })
    }
  }
}
</script>

<style lang="scss">
</style>
