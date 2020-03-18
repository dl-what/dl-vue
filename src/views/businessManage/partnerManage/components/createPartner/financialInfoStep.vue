<template>
  <div class="step-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="12em">
      <el-form-item label="开户银行" prop="depositBank">
        <el-input v-model="form.depositBank" placeholder="请输入开户银行" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="银行账户"  prop="bankAccount">
        <el-input v-model="form.bankAccount" maxlength="20" placeholder="请输入银行账户" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="发票抬头">
        <el-input v-model="form.invoice" placeholder="请输入发票抬头" maxlength="50" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="税号">
        <el-input v-model="form.taxNumber" placeholder="请输入税号" maxlength="30" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="单位地址">
        <el-input v-model="form.financialAddress" placeholder="请输入单位地址" maxlength="50" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="座机号码" prop="financialCellphone">
        <el-input v-model="form.financialCellphone" placeholder="请输入座机号码，示例XXXX-XXXXXXXX" maxlength="13" show-word-limit></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
  import rules from '@/utils/rules'
  export default {
    name: 'step',
    props: {
      editData: {
        default: null
      }
    },
    data() {
      return {
        form: {
          depositBank: '',
          bankAccount: '',
          invoice: '',
          taxNumber: '',
          financialAddress: '',
          financialCellphone: ''
        },
        rules: {
          depositBank: [
            { required: true, validator: rules.checkEmpty, trigger: ['blur', 'change'], message: '请输入开户银行'}
          ],
          bankAccount: [
            { required: true, validator: rules.checkBankNo, trigger: ['blur', 'change']}
          ],
          invoice: [
            { required: true, validator: rules.checkEmpty, trigger: ['blur', 'change'], message: '请输入发票抬头'}
          ],
          taxNumber: [
            { required: true, validator: rules.checkEmpty, trigger: ['blur', 'change'], message: '请输入税号'}
          ],
          financialAddress: [
            { required: true, validator: rules.checkEmpty, trigger: ['blur', 'change'], message: '输入单位地址'}
          ],
          financialCellphone: [
            { required: true, validator: rules.checkMobile, trigger: ['blur', 'change'], title: '座机号码'}
          ],
        }
      };
    },
    watch: {
      editData(data) {
        if (data) {
          Object.keys(this.form).forEach(prop => {
            this.form[prop] = data[prop];
          })
        }
      },
    },
    methods: {

    }
  };
</script>

<style lang="less" scoped>
  .el-upload__tip{
    margin-top: 10px;
  }
</style>
