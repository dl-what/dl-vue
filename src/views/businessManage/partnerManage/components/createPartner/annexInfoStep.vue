<template>
  <div class="step-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="12em">
      <el-form-item label="签约时间" prop="signingTime">
        <el-date-picker
          v-model="form.signingTime"
          type="date"
          :picker-options="pickerOptions"
          placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="到期时间" prop="dueTime">
        <el-date-picker
          v-model="form.dueTime"
          type="date"
          :picker-options="pickerOptions"
          placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="合同协议及其它附件" prop="contractAddress">
        <file-upload
          apiName="partnerUpload"
          title="上传应用"
          uploadTip="支持扩展名：.rar .zip .doc .docx .pdf .jpg..."
          :drag="true"
          :multiple="true"
          :limit="5"
          :size="100"
          @onSuccess="onSuccess"
          :fileList="fileList"
          :formData="{
            fileKey: 'uploadFile'
          }"
        >
        </file-upload>
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
      const check_signingTime = (rule, value, callback) => {
        const getTime = typeof value === 'string' ? Date.parse(value) : value.getTime();
        if (getTime >= this.form.dueTime && this.form.dueTime) {
          return callback(new Error(rule.message));
        }
        return callback();
      };
      const check_dueTime = (rule, value, callback) => {
        const getTime = typeof value === 'string' ? Date.parse(value) : value.getTime();
        if (getTime < this.form.signingTime && this.form.signingTime) {
          return callback(new Error(rule.message));
        }
        return callback();
      };
      return {
        fileList: [],
        pickerOptions: {
        disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        form: {
          signingTime: '',
          dueTime: '',
          contractAddress: ''
        },
        rules: {
          signingTime: [
            { required: true, validator: rules.checkEmpty, trigger: ['blur', 'change'], message: '请选择签约时间'},
            { required: true, validator: check_signingTime, trigger: ['blur', 'change'], message: '签约时间必须小于到期时间'}
          ],
          dueTime: [
            { required: true, validator: rules.checkEmpty, trigger: ['blur', 'change'], message: '请选择到期时间'},
            { required: true, validator: check_dueTime, trigger: ['blur', 'change'], message: '到期时间必须大于签约时间'}
          ],
          contractAddress: [
            { required: true, validator: rules.checkEmpty, trigger: ['blur', 'change'], message: '请上传合同协议及其它附件'}
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
          this.fileList = (this.form.contractAddress.split(',')).map(item => {
            return {
              filePath: item
            }
          })
        }
      },
      fileList(list) {
        this.form.contractAddress = list.map(item => item.filePath).join(',');
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
  /deep/.el-date-editor.el-input, /deep/.el-date-editor.el-input__inner{
    width: auto;
    display: block;
  }
  /deep/.el-upload,/deep/.el-upload-dragger{
    width: auto;
    display: block;
  }
</style>
