<template>
  <div class="test-qrcode">
    <div class="filter-box">
      <div class="title">测试扫码付</div>
      <div class="filter-content">
        <el-radio-group v-model="selectType" class="radio">
          <el-radio :label="'0'">ERP商户</el-radio>
          <el-radio :label="'2'">非ERP商户</el-radio>
        </el-radio-group>
        <el-form
          :model="mobileForm"
          status-icon
          :rules="mobileRule"
          ref="mobileForm"
          inline
          style="margin-top:20px;"
          @submit.native.prevent
        >
          <el-form-item prop="mobile" label=" " label-width="20px">
            <el-input
              :placeholder="[selectType == '0' ? '请输入企业ID' : '请输入手机号']"
              v-model.trim="mobileForm.mobile"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submit('mobileForm')" :loading="loading">测试扫码付</el-button>
            <span class="tip">提示：ERP商户请输入企业ID；非ERP用户请输入商户绑定的车企典移动端手机号进行扫码付测试</span>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-dialog
      title="测试扫码付"
      :visible.sync="dialogVisible"
      :width="'350px'"
      :before-close="handleClose"
    >
      <div id="container" v-if="result.Content" style="width: 300px;height: 300px;"></div>
      <div class="dialog-tip">
        <p>1.检查是否在此处生成了二维码</p>
        <p>2.扫描二维码，检查付款商户名称是否正确</p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Form, FormItem, Input, Radio, RadioGroup, Dialog } from 'element-ui'
import { constants } from '@/core/js/env'
import { backEndService, errorHandler } from '@/core/js/services'
const QRCode = require('qrcode')

export default {
  name: 'TestQrCode',
  components: {
    'el-form': Form,
    'el-form-item': FormItem,
    'el-input': Input,
    'el-radio': Radio,
    'el-radio-group': RadioGroup,
    'el-dialog': Dialog
  },
  data() {
    var checkMobile = (rule, value, callback) => {
      let reg = /(^[-0-9][0-9]*(.[0-9]+)?)$/
      if (!value) {
        return callback(new Error('请输入查询条件'))
      } else if (this.selectType == '0' && !reg.test(value)) {
        return callback(new Error('请输入正确的企业id'))
      } else if (this.selectType !== '0' && !constants.MOBILE_REG.test(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      dialogVisible: false,
      mobileForm: {
        mobile: ''
      },
      selectType: '0',
      mobileRule: {
        mobile: [
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ]
      },
      result: {}
    }
  },
  methods: {
    handleClose() {
      this.result = {}
      this.dialogVisible = false
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          let message = {
            Code: '31013',
            payApiTypeId: '2',
            payTypeId: '1003',
            Content: '0.5',
            SourceId: '3',
            ServiceId: '4',
            openIdCode: this.mobileForm.mobile + this.selectType
          }
          backEndService
            .getData(message)
            .then(data => {
              this.result = data.Message
              this.dialogVisible = true

              this.$nextTick(() => {
                QRCode.toCanvas(data.Message.Content, { errorCorrectionLevel: 'H' }, function(err, canvas) {
                  if (err) throw err

                  var container = document.getElementById('container')
                  canvas.style.width = '300px'
                  canvas.style.height = '300px'
                  container.appendChild(canvas)
                })
              })
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
.test-qrcode {
  .radio {
    margin-top: 20px;
    margin-left: 20px;
  }
  .tip {
    margin-left: 20px;

    color: red;
  }
  .dialog-tip {
    p {
      text-align: center;

      color: #4aabff;
    }
  }
}

</style>
