<template>
  <div class="increased-wrap">
    <div class="pub-block"></div>
    <div class="pub-block"></div>
    <div class="pub-block"></div>
    <el-form
      :model="requestForm"
      :rules="rules"
      size="mini"
      ref="requestForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item/>
      <el-row>
        <el-col :span="7" :offset="2">
          <el-form-item label="企业名称" prop="Name">
            <el-input v-model.trim="requestForm.Name" :disabled="!!UpdateFlag"/>
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="2">
          <el-form-item label="主营品牌">
            <el-input v-model.trim="requestForm.BrandList"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7" :offset="2">
          <el-form-item label="所属地区" prop="County">
            <el-cascader
              :disabled="!!UpdateFlag"
              clearable
              placeholder="请选择省 / 市 / (区、县)"
              :options="options"
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
          <el-form-item label="联系人">
            <el-input v-model.trim="requestForm.Contract"/>
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="2">
          <el-form-item label="手机" prop="Mobile">
            <el-input v-model.trim="requestForm.Mobile"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7" :offset="2">
          <el-form-item label="联系电话" prop="Telephone">
            <el-input v-model.trim="requestForm.Telephone"/>
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
      <el-form-item>
        <el-col :span="17">
          <strong>试用管理</strong>
          <hr class="line">
        </el-col>
      </el-form-item>
      <el-row>
        <el-col :span="7" :offset="2">
          <el-form-item label="试用期天数" prop="TryDuration">
            <el-input type="Input" v-model.trim="requestForm.TryDuration" :disabled="!!UpdateFlag"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-col :span="7" :offset="13">
          <el-button type="primary" @click="submitForm('requestForm')">提交</el-button>
          <el-button @click="resetForm('requestForm')" v-if="!!!UpdateFlag">重置</el-button>
        </el-col>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { backEndService, errorHandler } from '@/core/js/services'
import { env } from '@/core/js/env'
import areaJson from '../../area.json'
import { checkNumber } from './addRules'
import { Row, Col, Form, Input, FormItem, Cascader } from 'element-ui'
export default {
  name: 'Increased',
  components: {
    'el-row': Row,
    'el-col': Col,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-input': Input,
    'el-cascader': Cascader
  },
  data() {
    return {
      options: areaJson,
      UpdateFlag: 0,
      area: [],
      requestForm: {
        Name: '',
        BrandList: '',
        Province: '',
        City: '',
        County: '',
        Address: '',
        Contract: '',
        Mobile: '',
        Telephone: '',
        Memo: '',
        TryDuration: 0
      },
      rules: {
        // 校验规则
        Name: [
          {
            required: true,
            message: '请输入企业名称',
            trigger: 'blur'
          }
        ],
        County: [
          {
            required: true,
            message: '请选择所属地区',
            trigger: 'blur'
          }
        ],
        Contract: [
          {
            required: false,
            message: '请输入企业名称',
            trigger: 'blur'
          }
        ],
        Mobile: [
          {
            required: false,
            message: '请输入正确手机号码',
            trigger: 'blur',
            pattern: /^1[34578]\d{9}$/
          }
        ],
        Telephone: [
          {
            required: false,
            message: '请输入正确电话号码',
            trigger: 'blur',
            pattern: /[0-9-()（）]{7,18}/g
          }
        ],
        TryDuration: [
          {
            required: true,
            validator: checkNumber,
            trigger: 'blur'
          }
        ]
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
  methods: {
    /**
     * 初始列表
     */
    init() {
      this.findData()
    },
    /**
     * 编辑时，查找数据
     */
    findData() {
      if (this.$route.query.authcode) {
        backEndService
          .getData({
            AuthCode: this.$route.query.authcode,
            Code: 31503
          })
          .then(res => {
            this.UpdateFlag = 1
            this.requestForm = Object.assign({}, this.requestForm, { ...res.Message.AuthInfo })
            this.area = [res.Message.AuthInfo.Province, res.Message.AuthInfo.City, res.Message.AuthInfo.County]
          })
          .catch(errorHandler())
      }
    },
    // 修改所属地区
    selectAddress(value) {
      this.requestForm.Province = value[0]
      this.requestForm.City = value[1]
      this.requestForm.County = value[2]
    },
    // 提交表单
    submitForm(formname) {
      if (this.UpdateFlag === 0) {
        this.requestForm.AdminCreateUser = env.getUser().name
      }
      this.requestForm.AdminUpdateUser = env.getUser().name
      if (env.getUser().isAgent) {
        this.requestForm.AgentUserId = env.getUser().userId
      }

      this.$refs[formname].validate(valid => {
        if (valid) {
          backEndService
            .getData({
              Code: 31501,
              UpdateFlag: this.UpdateFlag,
              AuthInfo: this.requestForm
            })
            .then(result => {
              if (result.Message.Success && result.Message.Success === 'True') {
                this.$message.success(this.UpdateFlag * 1 === 1 ? '编辑成功' : '新增成功')
                this.$store.commit('delete_tabs', this.$router.history.current.fullPath)
                this.$router.push({ path: '/shop-manage/enterprise/list' })
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
      this.$refs[formname].resetFields()
    }
  }
}
</script>

<style scoped>
.increased-wrap {
  width: 930px;
  margin: 0 auto;
}
.line {
  border: none;
  border-top: 1px solid #f2f2f2;
}
.total {
  margin-top: 10px;
}
</style>
