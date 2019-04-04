<template>
  <div>
    <div class="occupied"/>
    <!-- 企业详情 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i class="el-icon-document"></i>
        <span>企业信息</span>
      </div>
      <div class="pay-ment-detail">
        <div class="enterprise-info">
          <ul class='info'>
            <li v-if="!isAgent">
              <div class="key">企业ID</div>
              <div class="value one-line">{{ manageDetails.AuthInfo.AuthCode}}</div>
            </li>
            <li>
              <div class="key">企业名称</div>
              <div class="value one-line">{{ manageDetails.AuthInfo.Name}}</div>
            </li>
            <li>
              <div class="key">主营品牌</div>
              <div class="value one-line">{{ manageDetails.AuthInfo.BrandList}}</div>
            </li>
            <li>
              <div class="key">所属区县</div>
              <div
                class="value one-line"
              >{{ manageDetails.AuthInfo.Province}} {{ manageDetails.AuthInfo.City}} {{ manageDetails.AuthInfo.County}}</div>
            </li>
            <li>
              <div class="key">地址</div>
              <div class="value one-line" v-bind:title="manageDetails.AuthInfo.Address">{{ manageDetails.AuthInfo.Address}}</div>
            </li>
            <li>
              <div class="key">联系人</div>
              <div class="value one-line">{{ manageDetails.AuthInfo.Contract}}</div>
            </li>
            <li>
              <div class="key">手机号</div>
              <div class="value one-line">{{ manageDetails.AuthInfo.Mobile}}</div>
            </li>
            <li>
              <div class="key">联系电话</div>
              <div class="value one-line" v-bind:title="manageDetails.AuthInfo.Telephone">{{ manageDetails.AuthInfo.Telephone}}</div>
            </li>
            <li>
              <div class="key">操作人</div>
              <div class="value one-line">{{ manageDetails.AuthInfo.AdminUpdateUser}}</div>
            </li>
            <li>
              <div class="key">操作时间</div>
              <div class="value one-line">{{ manageDetails.AuthInfo.UpdateTime | transitionTime }}</div>
            </li>
            <li v-if='isAgent'>
              <div class="key"></div>
              <div class="value one-line"></div>
            </li>
          </ul>
        </div>
      </div>
    </el-card>
    <div class="occupied"/>
    <!-- 门店信息 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i class="el-icon-document"></i>
        <span>门店信息</span>
        <el-button size="small" class="operate" @click="enterpriseEdit" :disabled="isClick">编辑</el-button>
        <el-button size="small" class="operate" @click="enterpriseIncr">新增</el-button>
      </div>
      <el-table
        :data="manageDetails.SingleAuthStoreListGroup"
        @cell-click="getRow"
        border
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column v-if="!isAgent" prop="StoresInfo.StoreId" label="门店ID"></el-table-column>
        <el-table-column prop="StoresInfo.Store" label="门店名称"></el-table-column>
        <el-table-column prop="StoresInfo.StoreType" label="门店性质">
          <template slot-scope="scope">
            <span
              style="margin-left: 10px"
            >{{ !!(scope.row.StoresInfo.StoreType * 1)? '分店' : '总店' }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="!isAgent" prop="StoresInfo.Union" label="所属联盟"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { Card, Table, TableColumn } from 'element-ui'
import { backEndService, errorHandler } from '@/core/js/services'
import { env } from '@/core/js/env'

export default {
  name: 'EnterPriseDetail',
  components: {
    'el-card': Card,
    'el-table-column': TableColumn,
    'el-table': Table
  },
  data() {
    return {
      isAgent: env.getUser().isAgent,
      manageDetails: {
        AuthInfo: {},
        SingleAuthStoreListGroup: []
      },
      isClick: true,
      currentRow: {
        StoreId: '',
        AuthCode: ''
      }
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
  watch: {
    currentRow: {
      handler(val) {
        val.StoreId !== '' ? (this.isClick = false) : (this.isClick = true)
      },
      deep: true
    }
  },
  methods: {
    init() {
      this.findDetail()
    },
    // 查看详情请求
    findDetail() {
      backEndService
        .getData({
          Code: 31503,
          AuthCode: this.$route.query.authcode
        })
        .then(res => {
          this.manageDetails = Object.assign({}, this.manageDetails, res.Message)
          this.currentRow.AuthCode = this.$route.query.authcode
          console.log(this.manageDetails)
        })
        .catch(errorHandler())
    },
    // 编辑门店
    enterpriseEdit() {
      this.$router.push({
        path: '/shop-manage/store/redact',
        query: {
          authcode: this.currentRow.AuthCode,
          storeid: this.currentRow.StoreId
        }
      })
    },
    // 新增
    enterpriseIncr() {
      this.$router.push({
        path: '/shop-manage/store/add',
        query: {
          authcode: this.manageDetails.AuthInfo.AuthCode,
          company: this.manageDetails.AuthInfo.Name,
          count: this.manageDetails.SingleAuthStoreListGroup.length
        }
      })
    },
    getRow(val) {
      this.currentRow.StoreId = val.StoresInfo.StoreId
    }
  }
}
</script>

<style lang="scss">
.pay-ment-detail {
  .enterprise-info {
    .title {
      padding: 20px 0 20px 10px;
      > span {
        padding-left: 10px;
      }
    }
     .info {
      >li {
        border: 1px solid #e9e9e9;
        border-right: none;
        border-bottom: none;
        .key {
           border-right: 1px solid #e9e9e9;
        }
      }
    }
    .info:last-child {
      border-bottom: 1px solid #e9e9e9;
      border-right: 1px solid #e9e9e9;
    }
  }
  .top-filter {
    display: flex;

    padding: 25px;

    justify-content: space-between;
  }
}
.occupied {
  margin-top: 30px;
}
.operate {
  float: right;

  margin-right: 10px;
}
</style>

