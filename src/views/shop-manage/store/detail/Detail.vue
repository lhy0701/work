<!--
 * @Description: 修复新建门店时，门店性质赋值错误bug
 * @Author: 杨鑫
 * @LastEditors: Please set LastEditors
 * @Date: 2019-01-04 17:11:48
 * @LastEditTime: 2019-03-15 11:38:11
 -->
<template>
  <div>
    <div class="occupied"/>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i class="el-icon-document"></i>
        <span>门店信息</span>
      </div>
      <div class="pay-ment-detail">
        <div class="enterprise-info">
            <ul class='info'>
              <li v-if='!isAgent'>
                <div class='key'>门店ID</div>
                <div class='value one-line'>{{ storeInfo.StoreId}}</div>
              </li>
              <li>
                <div class='key'>门店名称</div>
                <div class='value one-line'>{{ storeInfo.Store}}</div>
              </li>
              <li>
                <div class='key'>所属企业</div>
                <div class='value one-line'>{{ storeInfo.CompanyName}}</div>
              </li>
              <li>
                <div class='key'>门店性质</div>
                <div class='value one-line'>{{ storeInfo.StoreType*1 === 1 ? "分店" : "总店"}}</div>
              </li>
              <li>
                <div class='key'>主营品牌</div>
                <div class='value one-line'>{{ storeInfo.Brand}}</div>
              </li>
              <li>
                <div v-if="!isAgent" class="key">所属联盟</div>
                <div v-if="!isAgent" class="value one-line">{{ storeInfo.Union}}</div>
              </li>
              <li>
                <div class="key">所属地区</div>
                <div class="value one-line">{{ storeInfo.Province}} {{ storeInfo.City}} {{ storeInfo.County}}</div>
              </li>
              <li>
                 <div class="key">地址</div>
                 <div class="value one-line">{{ storeInfo.Address}}</div>
              </li>
              <li>
                <div class="key">备注</div>
                <div class="value one-line">{{ storeInfo.Memo}}</div>
              </li>
              <li>
                <div class="key">操作人</div>
                <div class="value one-line">{{ storeInfo.AdminCreateUser}}</div>
              </li>
              <li>
                <div class="key">操作时间</div>
                <div class="value one-line">{{ storeInfo.CreateDate | transitionTime }}</div>
              </li>
              <li>
                <div class="key"></div>
                <div class="value one-line"></div>
              </li>
            </ul>
        </div>
      </div>
    </el-card>
    <div class="occupied"/>
    <!-- <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i class="el-icon-document"></i><span> 所属联盟</span>
      </div>
    </el-card>-->
    <div class="occupied"/>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i class="el-icon-document"></i>
        <span>所属企业其他门店</span>
        <el-button size="small" class="operate" @click="enterpriseEdit" :disabled="isClick">编辑</el-button>
        <el-button size="small" class="operate" @click="enterpriseIncr">新增</el-button>
      </div>
      <el-table :data="SingleAuthStoreListGroup" @cell-click="getRow" border style="width: 100%" highlight-current-row>
        <el-table-column v-if="!isAgent" prop="StoresInfo.StoreId" label="门店ID"></el-table-column>
        <el-table-column prop="StoresInfo.Store" label="门店名称"></el-table-column>
        <el-table-column prop="StoresInfo.StoreType" label="门店性质">
          <template slot-scope="scope">
            <span
              style="margin-left: 10px"
            >{{ !!(scope.row.StoresInfo.StoreType * 1)? '分店' : '总店' }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="!isAgent" prop="StoresInfo.Union" label="所属联盟" show-overflow-tooltip></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { Card, Table, TableColumn } from 'element-ui'
import { backEndService, errorHandler } from '@/core/js/services'
import { env } from '@/core/js/env'

export default {
  name: 'StoreDetail',
  components: {
    'el-card': Card,
    'el-table-column': TableColumn,
    'el-table': Table
  },
  data() {
    return {
      isAgent: env.getUser().isAgent,
      isClick: true,
      storeInfo: {},
      currentDetails: {},
      SingleAuthStoreListGroup: [],
      currentStore: {}
    }
  },
  mounted() {
    // this.storeInfo = Object.assign({}, this.storeInfo, this.$route.query.storeinfo.StoresInfo)
    this.findDetail()
  },
  beforeRouteUpdate(to, from, next) {
    next(() => {
      this.findDetail()
    })
  },
  methods: {
    findDetail() {
      backEndService
        .getData({
          Code: 31503,
          AuthCode: this.$route.query.authcode
        })
        .then(res => {
          this.SingleAuthStoreListGroup = res.Message.SingleAuthStoreListGroup.filter(item => {
            if (item.StoresInfo.StoreId !== this.$route.query.storeid) {
              return item
            } else {
              this.storeInfo = Object.assign({}, this.storeInfo, item.StoresInfo)
            }
            // console.log(this.storeInfo.StoreType)
          })
        })
        .catch(errorHandler())
    },
    getRow(val) {
      this.currentStore = Object.assign({}, this.currentStore, val.StoresInfo)
      this.isClick = false
    },
    enterpriseEdit() {
      this.$router.push({
        path: '/shop-manage/store/redact',
        query: {
          storeid: this.currentStore.StoreId,
          authcode: this.currentStore.AuthCode
        }
      })
    },
    enterpriseIncr() {
      let count = [...this.SingleAuthStoreListGroup, ...[this.storeInfo]] // 当前店铺 + 其他店铺
      this.$router.push({
        path: '/shop-manage/store/add',
        query: {
          authcode: this.storeInfo.AuthCode,
          company: this.storeInfo.CompanyName,
          // 修复存在总店，新建时门店性质为总店的bug
          count: count.length
        }
      })
    }
  }
}
</script>

<style lang="scss">
.occupied {
  margin-top: 30px;
}
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
    .info:last-child {
      border-bottom: 1px solid #e9e9e9;
    }
  }
  .top-filter {
    display: flex;

    padding: 25px;

    justify-content: space-between;
  }
}
.operate {
  float: right;

  margin-right: 10px;
}

</style>
