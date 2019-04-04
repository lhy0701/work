<template>
  <el-container class="login">
    <el-main class="el-main">
      <!-- transition没有用到 -->
      <transition name="fade-in-down">
        <el-card class="box-card login-card" v-show="falg">
          <div class="logo">
            <img alt="logo" src="../../assets/logo.png">
          </div>
          <h2 class="name">车企典ERP后台管理系统</h2>
          <el-form
            :model="loginForm"
            class="demo-ruleForm"
            status-icon
            :rules="loginRules"
            ref="loginForm"
            @keyup.enter.native="submitForm('loginForm')"
          >
            <el-form-item prop="loginName">
              <el-input
                type="text"
                v-model="loginForm.loginName"
                auto-complete="off"
                placeholder="请输入用户名"
              >
                <i slot="prefix" class="el-icon-news"></i>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                type="password"
                v-model="loginForm.password"
                auto-complete="off"
                placeholder="请输入密码"
              >
                <i slot="prefix" class="el-icon-tickets"></i>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="submitForm('loginForm')"
                :disabled="submitBtns.disabled"
              >{{submitBtns.text}}</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </transition>
    </el-main>
  </el-container>
</template>

<script>
import { Card, Container, Main, Form, FormItem, Input } from 'element-ui'
import md5 from 'md5'
import { backEndService, errorHandler } from '@/core/js/services'
import { env } from '@/core/js/env'

const SUBMIT_DEFAULT = '登录'
const SUBMIT_WAITING = '登录中 ...'

export default {
  name: 'Login',
  components: {
    'el-container': Container,
    'el-main': Main,
    'el-card': Card,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-input': Input
  },
  beforeRouteEnter(to, form, next) {
    console.log('to',to)
    console.log('form', form)
    console.log(env.getUser().name)
    if (!env.getUser().name) {
      next()
    } else {
      next('/')
    }
  },
  data() {
    return {
      falg: true,
      loginForm: {
        loginName: '',
        password: ''
      },
      submitBtns: {
        disabled: false,
        text: SUBMIT_DEFAULT
      },
      loginRules: {
        loginName: [
          {
            validator: this.validateName,
            trigger: 'blur'
          }
        ],
        password: [
          {
            validator: this.validatePass,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    validateName(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入账号'))
      } else {
        callback()
      }
    },
    validatePass(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    },
    // 提交表单
    submitForm(formName) {
      // 禁用提交
      let disableSubmit = () => {
        this.submitBtns = {
          disabled: true,
          text: SUBMIT_WAITING
        }
      }
      // 允许提交
      let enableSubmit = () => {
        this.submitBtns = {
          disabled: false,
          text: SUBMIT_DEFAULT
        }
      }

      let form = this.$refs[formName]
      form.validate(valid => {
        disableSubmit()
        if (valid) {
          let pwd = md5(this.loginForm.password)
          console.log()
          backEndService
            .getData({
              Code: '21047',
              LoginID: this.loginForm.loginName,
              LoginPwd: pwd
            })
            .then(data => {
              let user = {
                name: this.loginForm.loginName,
                userName: data.Message.UserName,
                userId: data.Message.UserId || '',
                isAgent: data.Message.IsAgent === 'True' ? true : false || false
              }
              let roles = data.Message.FunctionListGroup || []
              // 设置权限和用户
              env.setRoles(roles)
              env.setUser(user)
              this.$router.push('/')
            })
            .catch(errorHandler())
            .finally(() => {
              enableSubmit()
            })
        } else {
          enableSubmit()
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.login {
  position: relative;

  height: 100%;

  background-color: #3593c6;
  background-image: url(images/bg.jpg);
  background-repeat: no-repeat;
  background-size: cover;
}
.logo {
  width: 115px;
  height: 115px;
  margin: 20px auto 0;

  text-align: center;
}
.name {
  margin-top: 40px;

  text-align: center;
}
.demo-ruleForm {
  margin-top: 50px;
}
.box-card {
  position: absolute;
  top: 50%;
  left: 50%;
  // transform: translate(-50%, -50%);

  overflow: hidden;

  width: 380px;
  margin-top: -250px;
  margin-left: -210px;
  padding: 0 20px;

  box-shadow: 0 2px 12px rgba($color: #000, $alpha: 0.5);
  .el-input {
    display: block;

    margin: 0 auto;
    i {
      font-size: 18px;
      line-height: 38px;
    }
  }
  .el-button {
    width: 100%;
    margin-top: 20px;
  }
}
</style>
