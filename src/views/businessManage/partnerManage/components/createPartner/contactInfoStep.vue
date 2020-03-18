<template>
  <div class="step-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="12em">
      <el-form-item label="联系人" prop="contacts">
        <el-input v-model="form.contacts" maxlength="10" placeholder="请输入联系人" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="form.sex">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="公司职位">
        <el-input v-model="form.position" maxlength="20" placeholder="请输入公司职位" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="cellphone">
        <el-input v-model="form.cellphone" maxlength="11" placeholder="请输入手机号码" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="电子邮箱" prop="email">
        <el-input v-model="form.email" maxlength="50" placeholder="请输入电子邮箱" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="身份证号" prop="idNumber">
        <el-input v-model="form.idNumber" maxlength="18" placeholder="请输入身份证号" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="上传证件" prop="certificateAddress">
        <picture-upload
          apiName="partnerUpload"
          @onSuccess="onSuccess"
          :multiple="true"
          :limit="2"
          :size="2"
          :fileList="fileList"
          :formData="{
            fileKey: 'uploadFile'
          }"
        >
        </picture-upload>
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
        fileList: [],
        form: {
          sex: 1,
          contacts: '',
          position: '',
          cellphone: '',
          email: '',
          idNumber: '',
          certificateAddress: '',
        },
        rules: {
          contacts: [
            { required: true, validator: rules.checkEmpty, trigger: ['blur', 'change'], message: '请输入联系人姓名'}
          ],
          cellphone: [
            { required: true, validator: rules.checkPhone, trigger: ['blur', 'change']}
          ],
          email: [
            { required: true, validator: rules.checkEmail, trigger: ['blur', 'change']}
          ],
          idNumber: [
            { required: true, validator: rules.checkIdCard, trigger: ['blur', 'change']}
          ],
          certificateAddress: [
            { required: true, validator: rules.checkEmpty, trigger: ['blur', 'change'], message: '请上传证件'}
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
          // 上传文件列表回填
          this.fileList = (this.form.certificateAddress.split(',')).map(item => {
            return {
              filePath: item
            }
          })
        }
      },
      fileList(list) {
        this.form.certificateAddress = list.map(item => item.filePath).join(',');
      }
    },
    methods: {
      onSuccess(file) {
        const index = this.fileList.findIndex(item => item.filePath === file.filePath);
        if (index < 0) {
          this.fileList.push(file);
        }
      }
    }
  };
</script>

<style lang="less" scoped>
  .el-upload__tip{
    margin-top: 10px;
  }
</style>
