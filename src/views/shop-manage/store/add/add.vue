<template>
  <div>
    <div class="pub-block"></div>
    <el-form
      :model="requestForm"
      :rules="rules"
      size="mini"
      ref="storeForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item/>
      <el-row>
        <el-col :span="7" :offset="2">
          <el-form-item label="所属企业" prop="AuthCode">
            <el-autocomplete
              :disabled="!!UpdateFlag"
              popper-class="my-autocomplete"
              v-model.trim="companyContainer.CompanyName"
              :fetch-suggestions="querySearch"
              placeholder="请输入内容"
              @select="SelectFirm"
            >
              <template slot-scope="{ item }">
                <div :title="item.CompanyName">
                  <div class="name">{{ item.CompanyName }}</div>
                  <div class="addr" v-if="!isAgent">{{item.AuthCode}}</div>
                </div>
              </template>
            </el-autocomplete>
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="2">
          <el-form-item label="门店名称" prop="Store">
            <el-input v-model.trim="requestForm.Store" :disabled="!!UpdateFlag"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7" :offset="2">
          <el-form-item label="主营品牌" prop="Brand">
            <el-input v-model.trim="requestForm.Brand"/>
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="2">
          <el-form-item label="门店性质" prop="StoreType">
            <el-input :value="requestForm.StoreType * 1 === 0 ? '总店': '分店'" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7" :offset="2">
          <el-form-item label="所属地区" prop="county">
            <el-cascader
              :options="options"
              :disabled="!!UpdateFlag"
              clearable
              placeholder="请选择省 / 市 / (区、县)"
              v-model.trim="area"
              @change="selectAddress"
            />
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="2">
          <el-form-item label="详细地址">
            <el-input v-model.trim="requestForm.Address"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row></el-row>
      <el-row>
        <el-col :span="7" :offset="2">
          <el-form-item label="汽配城">
            <el-input v-model.trim="requestForm.AutoPartsCity"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16" :offset="2">
          <el-form-item label="备注">
            <el-input type="textarea" v-model.trim="requestForm.Memo"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item/>
      <!-- StoreType : 0 -> 总店，显示账号密码 -->
      <div v-if="requestForm.StoreType * 1 === 0">
        <el-form-item>
          <el-col :span="17">
            <strong v-if="!(UpdateFlag*1)">初始管理员账号</strong>
            <strong v-else>管理员账号</strong>
            <el-button class="fr" v-if="!!(UpdateFlag*1)" size="mini" @click="resetDialog">重置密码</el-button>
            <hr class="line">
          </el-col>
        </el-form-item>
        <el-row>
          <el-col :span="6" :offset="1">&nbsp;
            <el-form-item label="手机号" v-if="!(UpdateFlag*1)">
              <el-input
                v-if="!!(UpdateFlag*1)"
                :disabled="!!(UpdateFlag*1)"
                :value="requestForm.Administrator"
              />
              <el-input v-else v-model.trim="information.UserName" :disabled="!!(UpdateFlag*1)"/>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="2">&nbsp;
            <el-form-item label="密码" v-if="!(UpdateFlag*1)">
              <el-input v-if="!!(UpdateFlag*1)" value="******" disabled/>
              <el-input v-else v-model.trim="information.Password" :disabled="!!(UpdateFlag*1)"/>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <el-form-item>
        <el-col :span="7" :offset="13">
          <el-button type="primary" @click="submitForm('storeForm')">保存</el-button>
          <el-button v-if="!!!(UpdateFlag*1)" @click="resetForm('storeForm')">重置</el-button>
        </el-col>
      </el-form-item>
    </el-form>
    <el-dialog title="提示" :visible.sync="isReset" width="30%" :before-close="handleClose">
      <span>是否要重置超级管理员密码</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isReset = false">取 消</el-button>
        <el-button type="primary" @click="resetPassword">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { backEndService, errorHandler } from '@/core/js/services'
import { env, constants } from '@/core/js/env'
import { Row, Col, Form, Input, FormItem, Cascader, Autocomplete, Dialog } from 'element-ui'

import areaJson from '../../area.json'

export default {
  name: 'StoreIncreased',
  components: {
    'el-autocomplete': Autocomplete,
    'el-row': Row,
    'el-col': Col,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-input': Input,
    'el-cascader': Cascader,
    'el-dialog': Dialog
  },
  data() {
    return {
      isReset: false,
      isAgent: env.getUser().isAgent,
      options: areaJson,
      area: [],
      // Add or edit
      UpdateFlag: 0,
      // All enterprise names
      companyAll: [],
      // Selected companies
      companyContainer: {
        CompanyName: '',
        AuthCode: ''
      },
      // Initial administrator account passwor
      information: {
        UserName: '',
        Password: ''
      },
      requestForm: {
        // solicited message
        AuthCode: '',
        Store: '',
        StoreType: 0,
        Brand: '',
        AutoPartsCity: '',
        Province: '',
        City: '',
        County: '',
        Address: ''
      },
      rules: {
        // checking rule
        AuthCode: [
          {
            // validator:(rule, value, callback) => {
            //   // console.log(this.$data.requestForm.AuthCode)
            //   if (value === '' && this.firstFlag !== 'first') {
            //     callback(new Error('请选择所属企业'))
            //   }
            //   callback()
            // },
            required: true,
            message: '请输入所属企业',
            trigger: 'change' // focus
          }
        ],
        Store: [
          {
            required: true,
            message: '请输入门店名称',
            trigger: 'blur'
          }
        ],
        Brand: [
          {
            required: true,
            message: '请输入主营品牌',
            trigger: 'blur'
          }
        ],
        StoreType: [
          {
            required: true,
            message: '请选择门店性质',
            trigger: 'blur'
          }
        ],
        County: [
          {
            required: true,
            message: '请选择所属地区',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {
    companyContainer: {
      handler(val) {
        if (val.AuthCode !== undefined) {
          val.CompanyName === '' ? (this.requestForm.AuthCode = '') : ''
        }
      },
      deep: true
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
      if (this.$route.query.storeid) {
        //  编辑
        this.UpdateFlag = 1
        this.examine()
      } else {
        //  新增
        this.findData()
        if (this.$route.query.authcode) {
          this.requestForm = Object.assign({}, this.requestForm, {
            // 重置表单值
            AuthCode: this.$route.query.authcode,
            StoreType: this.$route.query.count * 1 > 0 ? 1 : 0
          })
          this.companyContainer = Object.assign({}, this.companyContainer, {
            // 重置公司， id
            AuthCode: this.$route.query.authcode,
            CompanyName: this.$route.query.company
          })
        }
      }
    },
    // 公司自动赋值
    configName(value) {
      this.companyContainer = Object.assign({}, this.companyContainer, {
        AuthCode: value.code,
        CompanyName: value.name
      })
      this.requestForm.AuthCode = value.code
    },
    // 返回搜索建议
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
    // 下拉所属企业，控制门店性质、管理员账号密码框
    SelectFirm(item) {
      this.companyContainer = Object.assign({}, this.companyContainer, item)
      this.requestForm = Object.assign({}, this.requestForm, {
        AuthCode: item.AuthCode,
        StoreType: item.Count * 1 > 0 ? 1 : 0
      })
    },
    // 修改所属地区
    selectAddress(value) {
      this.requestForm.Province = value[0]
      this.requestForm.City = value[1]
      this.requestForm.County = value[2]
    },
    // 提交表单
    submitForm(formname) {
      if (this.firstFlag !== '') {
        this.firstFlag = ''
      }
      if (this.UpdateFlag === 0) {
        this.requestForm.AdminCreateUser = env.getUser().name
        // 是总店且手机号正确
        if (!this.information.UserName && this.requestForm.StoreType * 1 === 0) {
          this.$message.error('请输入管理员手机号')
          return
        } else if (!constants.MOBILE_REG.test(this.information.UserName) && this.requestForm.StoreType * 1 === 0) {
          this.$message.error('请输入正确的手机号')
          return
        }
      }
      this.requestForm.AdminUpdateUser = env.getUser().name
      const shortCondition = { ...Object.assign(this.requestForm) }
      for (let key in shortCondition) {
        if (shortCondition[key] === '') {
          delete shortCondition[key]
        }
      }
      this.$refs[formname].validate(valid => {
        if (valid) {
          backEndService
            .getData(
              Object.assign(
                {},
                {
                  Code: 31507,
                  UpdateFlag: this.UpdateFlag,
                  StoresInfo: shortCondition,
                  IsAgent: this.isAgent ? 'True' : 'False'
                },
                { ...this.information }
              )
            )
            .then(result => {
              if (result.Message.Successful && result.Message.Successful === 'True') {
                this.$message.success(!this.UpdateFlag ? '新增成功' : '编辑成功')
                this.$store.commit('delete_tabs', this.$router.history.current.fullPath)
                this.$router.push({ path: '/shop-manage/store/list' })
              }
            })
            .catch(errorHandler())
        } else {
          return false
        }
      })
    },
    resetForm(formname) {
      this.area = []
      this.companyContainer.CompanyName = ''
      this.$refs[formname].resetFields()
    },
    findData() {
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
    // 请求详情
    examine() {
      backEndService
        .getData({
          Code: 31503,
          AuthCode: this.$route.query.authcode
        })
        .then(res => {
          const editStore = res.Message.SingleAuthStoreListGroup.filter(item => {
            return item.StoresInfo.StoreId * 1 === this.$route.query.storeid * 1
          })[0].StoresInfo
          this.requestForm = Object.assign({}, this.requestForm, {
            ...editStore
          })
          this.area = [editStore.Province, editStore.City, editStore.County]
          this.companyContainer = Object.assign({}, this.companyContainer, {
            CompanyName: editStore.CompanyName,
            AuthCode: editStore.AuthCode
          })
        })
        .catch(errorHandler())
    },
    resetDialog() {
      this.isReset = true
    },
    resetPassword() {
      backEndService
        .getData({
          Code: 31547,
          AuthCode: this.$route.query.authcode
        })
        .then(res => {
          if (res) {
            this.isReset = false
            this.$message.success('密码重置为：666666')
          }
        })
        .catch(e => console.log(e))
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(() => {
          done()
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss">
.line {
  margin-top: 10px;

  border: none;
  border-top: 1px solid #f2f2f2;
}
.my-autocomplete {
  li {
    line-height: normal;

    padding: 7px;

    .name {
      font-size: 12px;

      overflow: hidden;

      text-overflow: ellipsis;
    }
    .addr {
      font-size: 12px;

      color: #b4b4b4;
    }

    .highlighted .addr {
      color: #ddd;
    }
  }
}
</style>
