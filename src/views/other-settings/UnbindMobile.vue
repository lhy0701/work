<template>
  <div class="unbind">
    <div class="filter-box">
      <div class="title">数据筛选</div>
      <div class="filter-content">
        <el-form
          :model="mobileForm"
          status-icon
          :rules="mobileRule"
          ref="mobileForm"
          inline
          style="margin-top:20px;"
        >
          <el-form-item prop="mobile" label="手机号:" label-width="80px">
            <el-input placeholder="请输入手机号" v-model="mobileForm.mobile" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submit('mobileForm')" :loading="loading">解绑</el-button>
            <span class="tip">注：此操作用来解绑车企典移动端手机号与车企典ERP的关联</span>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { Form, FormItem, Input } from 'element-ui'
import { constants } from '@/core/js/env'
import { backEndService, errorHandler } from '@/core/js/services'

export default {
  name: 'UnbindMobile',
  components: {
    'el-form': Form,
    'el-form-item': FormItem,
    'el-input': Input
  },
  data() {
    var checkMobile = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空！'))
      } else if (!constants.MOBILE_REG.test(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      mobileForm: {
        mobile: ''
      },
      mobileRule: {
        mobile: [
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          let message = {
            Code: '31571',
            Mobile: this.mobileForm.mobile
          }
          backEndService
            .getData(message)
            .then(() => {
              this.$message.success('解绑成功')
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
  }
}
</script>

<style lang="scss" scope>
.unbind {
  .tip {
    margin-left: 20px;

    color: red;
  }
}
</style>
