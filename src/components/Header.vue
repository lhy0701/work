<template>
  <div class="my-header w">
    <div class="links fl">
      <div class="logo">
        <h2>车企典ERP后台管理系统</h2>
      </div>
    </div>
    <div class="user fr">
      <div class="proxy fl" v-if="isAgent">剩余可授权站点数: {{siteNum}}</div>
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="el-dropdown-link">
          {{name}}
          <i class="el-icon-caret-bottom el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="modify">修改密码</el-dropdown-item>
          <el-dropdown-item command="exit">退出系统</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog
      title="修改密码"
      :visible.sync="modifyDialog"
      :close-on-click-modal="false"
      width="500px"
      @close="closeDialog('form')"
    >
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="原密码：" label-width="100px" prop="oldPass">
          <el-input type="password" v-model="form.oldPass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码：" label-width="100px" prop="pass">
          <el-input type="password" v-model="form.pass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" label-width="100px" prop="confirmPass">
          <el-input type="password" v-model="form.confirmPass" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="loading" @click="modifyDialog = false">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="submit('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Dropdown, DropdownMenu, DropdownItem, Dialog, Form, FormItem, Input } from 'element-ui'
import { backEndService, errorHandler } from '@/core/js/services'
import { env } from '@/core/js/env'
import md5 from 'md5'
import { mapActions } from 'vuex'

export default {
  name: 'MyHeader',
  components: {
    'el-dropdown': Dropdown,
    'el-dropdown-menu': DropdownMenu,
    'el-dropdown-item': DropdownItem,
    'el-dialog': Dialog,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-input': Input
  },
  data() {
    return {
      name: env.getUser().userName,
      isAgent: env.getUser().isAgent,
      modifyDialog: false,
      form: {
        oldPass: '',
        pass: '',
        confirmPass: ''
      },
      loading: false,
      rules: {
        oldPass: [
          {
            validator: this.validateName,
            trigger: 'blur'
          }
        ],
        pass: [
          {
            validator: this.validatePass,
            trigger: 'blur'
          }
        ],
        confirmPass: [
          {
            validator: this.validateConfirmPass,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted() {
    if (this.isAgent) {
      this.findSiteNum()
    }
  },
  methods: {
    ...mapActions({
      findSiteNum: 'findSite' // 将 `this.add()` 映射为 `this.$store.dispatch('increment')`
    }),
    validateName(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入原密码'))
      } else {
        callback()
      }
    },
    validatePass(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else if (value.length < 6) {
        callback(new Error('密码至少为6位数'))
      } else if (/[\u4E00-\u9FA5]/g.test(value)) {
        callback(new Error('不能输入汉字'))
      } else {
        callback()
      }
    },
    validateConfirmPass(rule, value, callback) {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.pass) {
        callback(new Error('密码不一致'))
      } else {
        callback()
      }
    },

    handleCommand(command) {
      if (command === 'exit') {
        this.doExit()
      } else if (command === 'modify') {
        this.modifyPassWord()
      }
    },

    doExit() {
      env.setUser({})
      env.setRoles([])
      window.location.href = __DEV__ ? '/' : '/backend'
    },

    modifyPassWord() {
      this.modifyDialog = true
    },

    closeDialog(formName) {
      if (this.loading) {
        this.modifyDialog = true
        return
      } else {
        this.$refs[formName].resetFields()
        this.modifyDialog = false
      }
    },

    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          let message = {
            Code: '21049',
            LoginID: env.getUser().name,
            OriLoginPwd: '',
            LoginPwd: ''
          }
          let { oldPass, pass } = this.form
          message.OriLoginPwd = md5(oldPass)
          message.LoginPwd = md5(pass)
          backEndService
            .getData(message)
            .then(() => {
              this.$message.success('修改成功,请重新登录')
              setTimeout(() => {
                this.closeDialog('form')
                this.doExit()
              }, 1000)
            })
            .catch(errorHandler())
            .finally(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    }
  },
  computed: {
    siteNum() {
      return this.$store.state.site
    }
  }
}
</script>

<style scoped lang="scss">
.my-header {
  height: 60px;

  background: linear-gradient(to right, #4a54ff, #09f);
  .logo {
    float: left;

    margin-left: 30px;
    > h2 {
      font-size: 16px;
      line-height: 58px;

      color: #fff;
    }
  }
  .el-menu {
    &.el-menu--horizontal {
      border: none !important;
    }
  }
  .el-menu-header {
    float: left;

    margin-left: 20px;

    .el-menu-item {
      transition: all 0.8s;

      border-bottom-color: rgba($color: #fff, $alpha: 0) !important;
      &.is-active {
        color: #fff;
        border-bottom-color: #fff !important;
      }
    }
    .el-menu-item:not(.is-disabled):hover {
      opacity: 0.6;
      background: rgba($color: #fff, $alpha: 0) !important;
    }
  }
  .user {
    line-height: 60px;

    margin-right: 30px;

    color: #fff;
    .proxy {
      margin-right: 30px;
    }
  }
  .el-input {
    width: 80%;
  }
}
</style>
