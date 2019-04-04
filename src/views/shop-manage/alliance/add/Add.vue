<template>
  <div>
    <div class="pub-block"></div>
    <el-form
      :model="requestForm"
      :rules="rules"
      size="mini"
      ref="storeForm"
      label-width="110px"
      class="demo-ruleForm"
    >
      <el-form-item/>
      <el-row>
        <el-col :span="7" :offset="2">
          <el-form-item label="联盟名称" prop="Union">
            <el-input v-model.trim="requestForm.Union" :disabled="!!UpdateFlag"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7" :offset="2">
          <el-form-item v-if="!UpdateFlag" label="盟主企业名称" prop="enterprise">
            <!-- allEnterprise 企业名称-->
            <el-select
              @change="changeEnterprise"
              v-model.trim="requestForm.enterprise"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in allEnterprise"
                :key="item.AuthCode"
                :label="item.CompanyName"
                :value="item.AuthCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-else label="盟主企业名称">
            <el-input disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="2">
          <el-form-item v-if="!UpdateFlag" label="盟主门店名称" prop="MasterStore">
            <!-- StoreList 门店名称-->
            <el-select
              @change="changeStoreList"
              v-model.trim="requestForm.MasterStore"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in StoreList"
                :key="item.StoreId"
                :label="item.Store"
                :value="item.StoreId"
              />
            </el-select>
            <!-- <el-input v-model.trim="requestForm.MasterStore" :disabled="!!UpdateFlag"/> -->
          </el-form-item>
          <el-form-item v-else label="盟主企业名称">
            <el-input v-model="requestForm.Master" disabled/>
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
          <el-form-item label="主营品牌" prop="Brand">
            <el-input type="input" v-model.trim="requestForm.Brand"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16" :offset="2">
          <el-form-item label="备注">
            <el-input type="textarea" v-model.trim="requestForm.Description"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item/>
      <el-form-item>
        <el-col :span="7" :offset="13">
          <el-button type="primary" @click="submitForm('storeForm')">保存</el-button>
          <!-- <el-button v-if="!!!(UpdateFlag*1)" @click="resetForm('storeForm')">重置</el-button> -->
        </el-col>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { backEndService, errorHandler } from '@/core/js/services'
import { env } from '@/core/js/env'
import { Row, Col, Form, Input, FormItem, Cascader,   Select,Option } from 'element-ui'

import areaJson from '../../area.json'

export default {
  name: 'AllianceIncreased',
  components: {
    'el-row': Row,
    'el-col': Col,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-input': Input,
    'el-cascader': Cascader,
    'el-select': Select,
    'el-option': Option
  },
  data() {
    // 当前组件状态
    return {
      // 所以企业下拉
      allEnterprise: [],
      // 当前企业
      currentEnterprise: '',
      // 当前企业下的门店
      StoreList: [],
      // 所属地区下拉
      options: areaJson,
      // [省,市,区]
      area: [],
      // Add or edit
      UpdateFlag: 0,

      // Selected companies
      companyContainer: {
        CompanyName: '',
        Union: ''
      },

      requestForm: {
        Union: '', // 联盟名称
        enterprise: '', // 盟主企业名称
        MasterStore: '', // 盟主门店名称
        Brand: '',  // 主营品牌
        Province: '', // 所属地区 省
        City: '', // 所属地区 市
        County: '', //所属地区 区县
        Address: '', //所属地区
        Description:'' // 备注
      },
      rules: {
        // checking rule
        Union: [
          {
            required: true,
            message: '请输入所属联盟',
            trigger: 'blur'
          }
        ],
        enterprise: [
          {
            required: true,
            message: '请选择盟主企业名称',
            trigger: 'blur'
          }
        ],
        MasterStore: [
          {
            required: true,
            message: '请选择盟主门店名称',
            trigger: 'blur'
          }
        ],
        Brand: [
          {
            required: true,
            message: '请输入主营品牌',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {
    companyContainer: {
      handler(val) {
        val.CompanyName === '' ? (this.requestForm.Union = '') : ''
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
      if (this.$route.query.UnionId) {
        //  编辑
        this.UpdateFlag = 1
        this.examine()
      } else {
        //  新增
        this.findData()

        this.requestForm = Object.assign({}, this.requestForm)
      }
    },
    // 改变企业名称
    changeEnterprise(value){
      this.currentEnterprise = value
      backEndService.getData({
        Code: 31503,
        AuthCode: value,
      })
      .then(res => {
        if (!res.Message.SingleAuthStoreListGroup) {
          this.$message.error('当前企业不存在门店')
        }
        const currentStoreList = res.Message.SingleAuthStoreListGroup && res.Message.SingleAuthStoreListGroup.map(item => {
          return {
            Store: item.StoresInfo.Store,
            StoreId:item.StoresInfo.StoreId
          }
        })
        this.StoreList = currentStoreList
        this.requestForm.MasterStore = currentStoreList[0].StoreId
      })

    },
    // 改变门店名称
    changeStoreList(value){
      this.requestForm.MasterStore = value
    },
    // 修改所属地区
    selectAddress(value) {
      this.requestForm.Province = value[0]
      this.requestForm.City = value[1]
      this.requestForm.County = value[2]
    },
    /**
     * 提交表单
     *
     * @description
     *
     * 判断updateFlag
     *
     * 0 为新增, 获取创建人
     */
    submitForm(formname) {
      if (this.UpdateFlag === 0) {
        this.requestForm.AdminCreateUser = env.getUser().name
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
                this.UpdateFlag === 0 ? {
                  Code: 31569,
                  UpdateFlag: this.UpdateFlag,
                  UnionInfos: this.requestForm
                } : {
                  Code: 31569,
                  UpdateFlag: this.UpdateFlag,
                  UnionInfos: {
                    UnionId: this.requestForm.UnionId,
                    Brand:this.requestForm.Brand,
                    AdminUpdateUser:this.requestForm.AdminUpdateUser,
                    Description:this.requestForm.Description
                  }
                }
              )
            )
            .then(result => {
              if (result.Message.Success && result.Message.Success === 'True') {
                this.$message.success(!this.UpdateFlag ? '新增成功' : '编辑成功')
                // 关闭当前tab
                this.$store.commit('delete_tabs', this.$router.history.current.fullPath)
                this.$router.push({ path: '/shop-manage/alliance/list' })
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
    // 查找企业
    findData() {
      backEndService
        .getData({ Code: 31519 })
        .then(res => {
          if (!!res.Message.CompanyListGroup > 0) {
            this.allEnterprise = Object.assign([], this.allEnterprise, res.Message.CompanyListGroup)
          }
        })
        .catch(errorHandler())
    },
    // 请求详情
    examine() {
      this.requestForm = Object.assign({}, this.$route.query)
      this.area = [this.$route.query.Province, this.$route.query.City, this.$route.query.County]

    },
    resetDialog() {
      this.isReset = true
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

<style  lang="scss">
.line {
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
