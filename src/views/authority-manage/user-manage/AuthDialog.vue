<template>
  <!-- bug 7926 7927-->
  <el-dialog
    :title="options.titleOption"
    width="600px"
    :visible="options.show"
    @close="closeModel"
    :close-on-click-modal="false"
  >
    <!-- 0 新增 1 编辑 2 删除 -->
    <!-- 删除窗口 -->
    <p v-if="options.type === 2">是否删除选择的用户
      <!-- bug 7930 -->
    </p>
    <!-- 新增/编辑 窗口 -->
    <el-form v-else :model="usersForm" :rules="rules" ref="usersForm" label-width="100px">
      <el-form-item label="用户名" lable-width="80px" prop="LoginID">
        <el-col>
          <el-input v-model.trim="usersForm.LoginID"/>
        </el-col>
      </el-form-item>
      <el-form-item label="姓名" prop="UserName">
        <el-col>
          <el-input v-model.trim="usersForm.UserName"/>
        </el-col>
      </el-form-item>
      <!-- 编辑状态手机号码不可更改 -->
      <div v-if='options.type === 0'>
        <el-form-item label="手机号" prop="Mobile">
          <el-col>
            <el-input v-model.trim="usersForm.Mobile"/>
          </el-col>
        </el-form-item>
      </div>
      <div v-else>
        <el-form-item label="手机号">
          <el-col>
            <el-input v-model.trim="usersForm.Mobile" disabled/>
          </el-col>
        </el-form-item>
      </div>
      <el-form-item label="所属角色" prop="Role">
        <el-col>
          <el-select v-model.trim="usersForm.Role" placeholder="请选择" style="width:280px" @change="selectGet">
            <el-option v-for="item in roleSelect" :key="item.value" :value="item.value"></el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <!-- 新增 - 密码 -->
      <div v-if="options.type === 0">
        <el-form-item label="登陆密码" prop="Password">
          <el-col>
            <el-input type="password" v-model.trim="usersForm.Password"/>
          </el-col>
        </el-form-item>
        <el-form-item label="确认密码" prop="submitPassword">
          <el-col>
            <el-input type="password" v-model.trim="usersForm.submitPassword" placeholder="请输入新密码"></el-input>
          </el-col>
        </el-form-item>
      </div>
      <!-- 编辑 - 密码 -->
      <div v-else>
        <el-form-item label="登陆密码">
          <el-col>
            <el-input type="password" disabled placeholder="******"/>
          </el-col>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input type="password" disabled placeholder="******"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="备注">
        <el-col>
          <el-input type="textarea" v-model.trim="usersForm.Memo" maxlength="50"/>
          <!-- bug 7929-->
        </el-col>
      </el-form-item>
      <div v-if='options.type === 0'>
        <el-form-item label="代理扫码付费率（%）" prop="Fee" v-show='RateShow' id='Rate'>
          <el-col>
            <el-input v-model.trim="usersForm.Fee" placeholder="设置费率须在3.5~5范围内" :maxlength="3"/>
          </el-col>
        </el-form-item>
      </div>
      <div v-if='options.type === 1 && usersForm.Fee != 0'>
        <el-form-item label="代理扫码付费率（%）" id='Rate'>
          <el-col>
            <el-input v-model.trim="usersForm.Fee" disabled/>
          </el-col>
        </el-form-item>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <div>
        <el-button size="small" @click="closeModel" :loading="loading">取 消</el-button>
        <el-button
          size="small"
          type="primary"
          @click="submitForm('usersForm')"
          :loading="loading"
        >确 定</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { Dialog, Form, FormItem, Input, Col, Select, Option } from 'element-ui'
import md5 from 'md5'
import { constants } from '@/core/js/env'
import { backEndService, errorHandler } from '@/core/js/services.js'
export default {
  props: {
    options: {
      type: Object,
      required: false
    }
  },
  name: 'AuthDialog',
  components: {
    'el-dialog': Dialog,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-input': Input,
    'el-col': Col,
    'el-select': Select,
    'el-option': Option
  },
  data() {
    return {
      loading: true,
      RateShow: false, // 显示费率
      usersForm: {
        UpdateFlag: 0, // 更新标志，0 新增，1 修改
        UserId: '',
        LoginID: '',
        UserName: '',
        Mobile: '',
        Role: '',
        Password: '',
        Memo: '',
        Fee: ''
      },
      //所属角色
      roleSelect: [
        {
          value: '管理员'
        },
        {
          value: '运维'
        },
        {
          value: '市场'
        },
        {
          value: '研发'
        },
        {
          value: '财务'
        },
        {
          value: '产品'
        },
        {
          value: '总经办'
        },
        {
          value: '测试'
        },
        {
          value: '代理'
        }
      ],
      // 校验规则
      rules: {
        // 用户名 必填，8 - 16位 数字，字母 _ -
        LoginID: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
        ],
        // 姓名 12个汉字，12个字母 (一二三四五六七八九十十一, qweqweqweqwe)
        UserName: [
          {
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
          },
          {
            pattern: /(^[\u4e00-\u9fa5]{1}[\u4e00-\u9fa5·。]{0,10}[\u4e00-\u9fa5]{1}$)|(^[a-zA-Z]{1}[a-zA-Z\s]{1,10}[a-zA-Z]{1}$)/, // 12个汉字，12个字母 (一二三四五六七八九十十一, qweqweqweqwe)
            message: '请输入正确姓名格式'
          }
        ],
        // 所属角色 下拉，必选
        Role: [
          {
            required: true,
            message: '请选择所属角色',
            trigger: 'change' // bug 7924
          }
        ],
        // 密码  不可以为纯数字， 6 - 12 位
        Password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 12,
            message: '最少长度为6位最多12位',
            trigger: 'blur'
          },
          {
            pattern: /^(?=.*\d)(?=.*[A-Za-z])[\x20-\x7e]{6,12}$/,
            message: '密码不可以为纯数字、字母',
            trigger: 'blur'
          }
        ],
        submitPassword: [
          {
            required: true,
            message: '请再次输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 12,
            pattern: /^(?=.*\d)(?=.*[A-Za-z])[\x20-\x7e]{6,12}$/,
            message: '最少长度为6位最多12位',
            trigger: 'blur'
          },
          {
            pattern: /^(?=.*\d)(?=.*[A-Za-z])[\x20-\x7e]{6,12}$/,
            message: '必须包含数字、字母',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              if (value !== this.usersForm.Password) {
                return callback(new Error('两次输入密码不一致!'))
              }
              callback()
            }
          }
        ],
        Mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          {
            pattern: constants.MOBILE_REG, // 12个汉字，12个字母 (一二三四五六七八九十十一, qweqweqweqwe)
            message: '请输入正确的手机号格式',
            trigger: 'blur'
          }
        ],
        Fee: [
          {
            required: true,
            message: '请输入代理扫码付费率(%)',
            trigger: 'blur'
          },
           {
            validator: (rule, value, callback) => {
              if (value < 3.5 ||   value > 5) {
                return callback(new Error('设置费率须在3.5~5范围内'))
              }
              callback()
            }
          } 
        ]
      },
      visible: true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    /**
     * 初始弹窗
     */
    init() {
      // 判断代理扫码付费率
      this.options.type == 1 && this.options.currentData.Fee < 5? 
      this.options.currentData.Fee = this.options.currentData.Fee*1000: this.options.currentData.Fee = this.options.currentData.Fee
      this.usersForm = Object.assign({}, this.usersForm, this.options.currentData, {
        UpdateFlag: this.options.updateFlag
      })
      this.loading = false
    },
    /**
     * 关闭弹窗
     */
    closeModel() {
      if (this.loading) return
      this.$emit('closeModel', false)
    },
    // 代理用户显示费率
    selectGet(GetValue) {
      GetValue == '代理'? this.RateShow = true: this.RateShow = false
      if(GetValue == '代理') {
        this.usersForm.Fee = 3.8
      } else {
        this.usersForm.Fee = 0
      }
    },
    /**
     * 新增/编辑 用户接口
     * @description 区别 编辑时 无 userForm.Password （ UserId 返回为ID需要设置为UserId )
     */
    addNewUsers() {
      this.loading = true // 开启动画
      backEndService
        .getData(
          Object.assign(
            {},
            {
              Code: 31543,
              ...this.usersForm
            },
            this.usersForm.Password && this.usersForm.Password !== ''
              ? {
                  Password: md5(this.usersForm.Password)
                }
              : {
                  UserId: this.usersForm.Id
                },
            {
              submitPassword: ''
            }
          )
        )
        .then(result => {
          this.loading = false
          if (result.Message.Success && result.Message.Success === 'True') {
            this.$emit('putData', this.usersForm)
            this.$emit('closeModel', false)
          } else {
            this.$message.success(result.Message.ErrorMessage.ErrMsg)
          }
        })
        .catch(errorHandler())
        .finally(() => {
          this.loading = false
        })
    },
    /**
     * 提交表单
     * @description 判断 删除/新增/编辑
     */
    submitForm(formName) {
      // 删除用户
      // console.log('我是forName',formName)
      if (this.options.type === 2) {
        this.$emit('putData', this.options.currentData.Id)
        this.$emit('closeModel', false)
        return
      }
      // 校验
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 再次处理数据，删除不必传的Key值
          for (let key in this.usersForm) {
            if (this.usersForm[key] === '') {
              delete this.usersForm[key]
            }
          }
          this.loading = true
          // 开始请求
          this.addNewUsers()
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss">
  #Rate .el-form-item__label{
    line-height: 20px!important;
  }
</style>
