<template>
  <div>
    <!-- 开发商信息 -->
    <el-form label-position="right" 
      label-width="110px" 
      :model="form"
      :rules="rules"
      ref="form"
      class="baseInfo">
      <el-form-item label="开发商名称" prop="developerName">
        <el-input v-model="form.developerName" placeholder="请输入开发商名称" maxlength="15" show-word-limit></el-input> 
      </el-form-item>
      <el-form-item label="联系人" prop="person">
        <el-input v-model="form.person" placeholder="请输入联系人" maxlength="10" show-word-limit></el-input> 
      </el-form-item>
      <el-form-item label="手机号码" prop="cellPhone">
        <el-input v-model="form.cellPhone" placeholder="请输入手机号码" maxlength="11" show-word-limit></el-input> 
      </el-form-item>
      <el-form-item label="电子邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请输入电子邮箱" maxlength="50" show-word-limit></el-input> 
      </el-form-item>
      <el-form-item label="传真号码" prop="faxPhone">
        <el-input v-model="form.faxPhone" placeholder="请输入传真电话" maxlength="20" show-word-limit></el-input> 
      </el-form-item>
      <el-form-item label="联系地址" prop="address">
        <el-input v-model="form.address" placeholder="请输入联系地址" maxlength="50" show-word-limit></el-input> 
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/javascript">
import rules from "@/utils/rules.js";

export default {
  name: "",
  model: {
    prop: 'form',
    event: 'returnBack'
  },
  props: {
    form: {
      type: Object,
      default: {}
    },
  },
  data() {
    return {
      rules: {
        developerName: [
          { required: true, validator: this.$rules.checkPeopleName, title: '开发商名称', trigger: ['change','blur'] }
        ],
        person: [
          { required: true, validator: this.$rules.checkPeopleName, title: '联系人', trigger: ['change','blur'] }
        ],
        cellPhone: [
          { required: true, validator: this.$rules.checkPhone, title: '手机号码', trigger: ['change','blur'] }
        ],
        email: [
          { required: false, validator: this.$rules.checkUnEmail, title: '邮箱', trigger: ['change','blur'] }
        ],
        faxPhone: [
          { required: false, validator: this.$rules.checkNonMobile, title: '传真', trigger: ['change','blur'] }
        ]
      },
    }
  },
  created() {

  },
  methods: {

  },
}
</script>

<style lang="less" scoped>
  .vlt-edit-wrap{
    width: 100%;
  }
</style>
