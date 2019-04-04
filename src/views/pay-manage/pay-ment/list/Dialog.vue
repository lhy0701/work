<template>
  <el-dialog
    :title="title"
    width="500px"
    :visible="isShow"
    :close-on-click-modal="false"
    @close="closeModel"
  >
    <!-- 0 开通 1 续费 2 新增 -->
    <div v-if="dialogType < 3">
      <div v-if="dialogType === 0 || dialogType === 1">
        <div
          class="title"
          v-if="dialogType === 0 && info.ProbationTime"
        >试用到期日期： {{info.ProbationTime | formatDate}}</div>
        <div class="title" v-if="dialogType === 1 ">未续费站点数： {{info.NoQuantity}}</div>
        <el-form :model="form">
          <el-form-item label="开始时间:" :label-width="formLabelWidth">
            <div v-if="dialogType === 0">
              <div class="end-time">{{BeginTime | formatDate()}}</div>
              <!-- 暂时锁死日期 -->
              <!-- <el-date-picker
              v-model="BeginTime"
              type="date"
              placeholder="选择开始日期"
              @change="dateChange"
              :clearable="false"
              :picker-options="pickerOptions"
              ></el-date-picker>-->
            </div>
            <div v-if="dialogType === 1">
              <div class="end-time">{{beginTime | formatDate()}}</div>
            </div>
          </el-form-item>
          <el-form-item label="结束时间:" :label-width="formLabelWidth">
            <div v-if="dialogType === 0">
              <!--  v-if="EndTime" -->
              <div class="end-time">{{EndTime | formatDate()}}</div>
              <!-- <div class="end-time" v-else>选择开始时间</div> -->
            </div>
            <div v-else>
              <div class="end-time" v-if="endTime">{{endTime | formatDate()}}</div>
            </div>
          </el-form-item>
          <el-form-item label="站点数:" :label-width="formLabelWidth">
            <el-input v-model="form.Quantity"></el-input>
          </el-form-item>
          <el-form-item v-if="isAgent" label="扣除授权点数:" :label-width="formLabelWidth">
            <el-input disabled :value="form.Quantity"></el-input>
          </el-form-item>
          <el-form-item v-if="!isAgent" label="缴费金额:" :label-width="formLabelWidth">
            <el-input disabled :value="price | number(2)"></el-input>
          </el-form-item>
          <el-form-item label="备注:" :label-width="formLabelWidth">
            <el-input
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 3}"
              placeholder="请输入备注"
              v-model="form.Memo"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="dialogType === 2">
        <div class="title">有效站点数： {{info.Quantity}}</div>
        <el-form :model="form">
          <el-form-item label="站点数:" :label-width="formLabelWidth">
            <el-input v-model="form.Quantity"></el-input>
          </el-form-item>
          <el-form-item v-if="isAgent" label="扣除授权点数:" :label-width="formLabelWidth">
            <el-input disabled :value="form.Quantity"></el-input>
          </el-form-item>
          <el-form-item v-if="!isAgent" label="缴费金额:" :label-width="formLabelWidth">
            <el-input disabled :value="price | number(2)"></el-input>
          </el-form-item>
          <el-form-item label="备注:" :label-width="formLabelWidth">
            <el-input
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 3}"
              placeholder="请输入备注"
              v-model="form.Memo"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div v-if="dialogType === 3">
      <el-table
        :data="record"
        size="mini"
        :height="'220'"
        max-height="220"
        border
        v-loading="loading"
      >
        <el-table-column label="授权日期" align="center">
          <template slot-scope="scope">
            <span
              v-if="scope.row.BeginTime && scope.row.EndTime"
            >{{scope.row.BeginTime | formatDate}} ~ {{scope.row.EndTime | formatDate}}</span>
            <span v-else>'' ~ ''</span>
          </template>
        </el-table-column>
        <el-table-column property="Quantity" label="站点数" align="center"></el-table-column>
      </el-table>
    </div>
    <div slot="footer" class="dialog-footer">
      <div v-if="dialogType < 3">
        <el-button size="small" @click="closeModel" :loading="loading">取 消</el-button>
        <el-button size="small" @click="submit" type="primary" :loading="loading">确 定</el-button>
      </div>
      <div v-else>
        <el-button size="small" @click="closeModel">关 闭</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { Dialog, Form, FormItem, Input, Table, TableColumn } from 'element-ui'
import { mapActions } from 'vuex'
import { backEndService, errorHandler } from '@/core/js/services'
import { formatDate } from '@/core/js/filter'
import { env } from '@/core/js/env'

export default {
  name: 'SiteManage',
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    row: Object,
    dialogType: Number
  },
  components: {
    'el-dialog': Dialog,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-input': Input,
    'el-table': Table,
    'el-table-column': TableColumn
  },
  data() {
    return {
      info: this.row,
      isAgent: env.getUser().isAgent,
      title: '', // 页面展示title 信息
      BeginTime: '', // 开通使用日期
      EndTime: '', // 开通试用日期
      form: {
        BeginTime: '',
        EndTime: '',
        Quantity: 0,
        Amount: 0,
        Memo: '',
        Operate: this.dialogType,
        AuthCode: this.row.AuthCode
      },
      formLabelWidth: '80px',
      loading: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6
        }
      },
      record: [] // 站点记录
      // siteOnline: [] // 在线站点
    }
  },
  created() {
    switch (this.dialogType) {
      case 0:
        this.title = '开通授权'
        break
      case 1:
        this.title = '续费'
        break
      case 2:
        this.title = '站点管理'
        break
      case 3:
        this.title = '站点记录'
        break
      // case 4:
      //   this.title = '在线站点'
      //   break

      default:
        break
    }
    if (this.dialogType === 0) {
      this.BeginTime = new Date()
      let date = new Date()
      this.EndTime = date.setFullYear(date.getFullYear() + 1)
    } else if (this.dialogType === 3) {
      this.findRecord()
    }
    // else if (this.dialogType === 4) {
    //   this.findSiteOnline()
    // }
  },
  computed: {
    price() {
      let amount
      if (this.info.UnionPrice) {
        amount = this.form.Quantity * this.info.UnionPrice
      } else {
        if (this.dialogType == 0 || this.dialogType == 2) {
          amount = this.form.Quantity * 1000
        } else {
          amount =
            this.form.Quantity <= 6
              ? this.form.Quantity * 600
              : this.form.Quantity > 20
              ? 4000 + (this.form.Quantity - 20) * 300
              : 4000
        }
      }
      return this.isAgent ? 0 : amount
    },
    // 续费使用
    beginTime() {
      let date = this.info.EndTime ? new Date(Number(this.info.EndTime)) : new Date()
      return this.dialogType === 1 ? date.setDate(date.getDate() + 1) : ''
    },
    endTime() {
      let date = new Date(this.beginTime)
      return this.dialogType === 1 ? date.setFullYear(date.getFullYear() + 1) : ''
    }
  },
  methods: {
    ...mapActions({
      findSiteNum: 'findSite'
    }),
    dateChange(e) {
      let date = new Date(e)
      this.EndTime = date.setFullYear(date.getFullYear() + 1)
    },

    closeModel() {
      if (this.loading) return
      this.$emit('closeModel', false)
    },

    submit() {
      // if (this.dialogType == 0 && !this.BeginTime) {
      //   this.$message.error('请填写正确的时间')
      //   return
      // }
      if (!this.form.Quantity || isNaN(Number(this.form.Quantity)) || this.form.Quantity < 0) {
        this.$message.error('请输入大于0的站点数')
        return
      } else {
        if (
          this.dialogType == 1 &&
          this.form.Quantity > Number(this.info.Quantity) - Number(this.info.ActiveQuantity)
        ) {
          this.$message.error('续费不能超过已有站点数')
          return
        }
      }
      if (this.form.Memo.length > 50) {
        this.$message.error('备注请输入50字以内')
        return
      }
      if (!env.getUser().name) {
        this.$router.push({
          name: 'login'
        })
        return
      }
      this.form.Amount = this.price
      this.loading = true
      let message = {
        Code: 31513,
        Operator: env.getUser().name,
        AgentUserId: env.getUser().userId
      }
      console.log('我是AgentUserId', message.AgentUserId)
      if (this.dialogType === 0) {
        this.form.BeginTime = formatDate(this.BeginTime, 'yyyymmdd')
        this.form.EndTime = formatDate(this.EndTime, 'yyyymmdd')
        message = Object.assign(message, this.form)
        console.log('我是message',message)
      } else if (this.dialogType === 1) {
        // 续费需传父级begintime
        this.form.BeginTime = formatDate(this.beginTime, 'yyyymmdd')
        this.form.EndTime = formatDate(this.endTime, 'yyyymmdd')
        message['OccurTime'] = formatDate(this.info.BeginTime, 'yyyymmdd')
        message = Object.assign(message, this.form)
        console.log('我是续费用户ID',message)
      } else {
        this.form.BeginTime = formatDate(this.info.BeginTime, 'yyyymmdd')
        this.form.EndTime = formatDate(this.info.EndTime, 'yyyymmdd')
        message = Object.assign(message, this.form)
      }
      backEndService
        .getData(message)
        .then(() => {
          if (this.dialogType == 0) {
            this.$message({
              message: '开通成功',
              type: 'success'
            })
          } else if (this.dialogType == 1) {
            this.$message({
              message: '续费成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: '新增站点成功',
              type: 'success'
            })
          }
          this.$emit('refresh')
        })
        .catch(errorHandler())
        .finally(() => {
          if (this.isAgent) {
            this.findSiteNum()
          }
          this.loading = false
        })
    },

    // 站点记录
    findRecord() {
      this.loading = true
      backEndService
        .getData({
          Code: '31521',
          AuthCode: this.row.AuthCode
        })
        .then(data => {
          let serverData = data.Message
          let result = serverData.AuthorizeSiteListGroup || []
          this.record = result
        })
        .catch(errorHandler())
        .finally(() => {
          this.loading = false
        })
    }

    // // 获取在线站点数
    // findSiteOnline() {
    //   this.loading = true
    //   backEndService
    //     .getData({
    //       Code: '31523',
    //       AuthCode: this.row.AuthCode
    //     })
    //     .then(data => {
    //       let serverData = data.Message
    //       let result = serverData.LoginSiteListGroup || []
    //       if (result.length) {
    //         result = result.map(item => (item['loading'] = false))
    //       }
    //       this.siteOnline = result
    //       this.loading = false
    //     })
    //     .catch(e => {
    //       this.$message.error(e.message)
    //       this.loading = false
    //     })
    // },

    // // 删除登陆站点
    // remove(row) {
    //   row.loading = true
    //   backEndService
    //     .getData({
    //       Code: '31529',
    //       AuthCode: this.row.AuthCode,
    //       SessionKey: row.SessionKey
    //     })
    //     .then(data => {
    //       let serverData = data.Message
    //       console.log(serverData)
    //       for (const item in this.siteOnline) {
    //         if (this.siteOnline.hasOwnProperty(item)) {
    //           const element = this.siteOnline[item]
    //           if (row.SessionKey == element.SessionKey) this.siteOnline.splice(item, 1)
    //         }
    //       }
    //       row.loading = false
    //     })
    //     .catch(e => {
    //       this.$message.error(e.message)
    //       row.loading = false
    //     })
    // }
  }
}
</script>

<style lang="scss" scoped>
.end-time {
  padding: 0 15px;
  // height:

  color: #c0c4cc;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  background-color: #f5f7fa;
}
.title {
  margin-bottom: 20px;
  padding-left: 4px;

  color: red;
}
</style>

