<template>
  <el-dialog :is>
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
        <el-col :span="7" :offset="2">
          <el-form-item label="盟主门店名称" prop="Master">
            <el-input v-model.trim="requestForm.Master" :disabled="!!UpdateFlag"/>
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
  </el-dialog>
</template>
<script>
import {Table,TableColumn ,Pagination ,Button, Row, Col, Form, Input, FormItem, Cascader, Autocomplete, Dialog } from 'element-ui'

export default {
  name: 'AllianceAddEditor',
  components: {
    'el-input': Input,
    'el-button': Button,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-pagination': Pagination,
    'el-autocomplete': Autocomplete,
    'el-dialog': Dialog,
  },
}
</script>
<style lang="scss">

</style>
