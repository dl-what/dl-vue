<template>
  <el-dialog class="mixin-form" :append-to-body="true" title="表单配置" :visible.sync="show" width="600px" @closed="$emit('update:showDialog', false);">
    <el-form :model="form" ref="form" :rules="rules" label-width="100px" label-position="right" size="small">
      <el-form-item label="表单名称" prop="label">
        <el-input v-model="form.label" placeholder="请输入表单名称"></el-input>
      </el-form-item>
      <el-form-item label="表单字段" prop="field">
        <el-input v-model="form.field" placeholder="请输入表单字段"></el-input>
      </el-form-item>
      <el-form-item label="开启验证">
        <el-switch
          v-model="isRule"
          :active-value="true"
          :inactive-value="false"
          @change="changeRule"
        >
        </el-switch>
      </el-form-item>
      <el-form-item label="验证规则" v-if="isRule">
        <el-select v-model="form.regType" placeholder="请选择验证规则">
          <el-option :label="item.label" :value="item.value" v-for="item in reqularOptions" :key="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选项名称与值" v-if="config.type === 'select' || config.type === 'checkbox' || config.type === 'radio'">
        <div v-for="(item, i) in form.options" :key="i" class="mb10">
          <el-input v-model="item.label" style="width: 45%;" placeholder="请输入选项名称"></el-input>
          <el-input v-model="item.value" style="width: 45%; margin-left: 2%;" placeholder="请输入选项值"></el-input>
          <el-button type="text" size="small" icon="el-icon-delete" @click="removeOption(i)" class="del-btn" :disabled="form.options.length == 1"></el-button>
        </div>
        <div>
          <el-button type="text" size="small" @click="addOption">新增选项</el-button>
        </div>
      </el-form-item>
      <el-form-item label="是否禁用">
        <el-switch
          v-model="isDisable"
          :active-value="true"
          :inactive-value="false"
          @change="changeDisable"
        >
        </el-switch>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="show = false">取 消</el-button>
      <el-button type="primary" size="small" @click="confirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import regularList from './config/regularList'
import validator from './config/validator'

export default {
  name: 'formConfig',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    config: {
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      show: this.showDialog,
      isRule: false,
      isDisable: false,
      reqularOptions: [],
      form: {
        label: '',
        field: '',
        regType: '',
        disabled: false,
        options: [
          {
            value: '',
            label: ''
          }
        ]
      },
      rules: {
        label: [
          {required: true, validator: validator.empty, message: '表单名称不能为空', trigger: ['change','blur']},
          {required: true, validator: validator.match, message: '表单名称必须为字母/数字/中文或组成', trigger: ['change','blur'], regType: 'lnc'}
        ],
        field: [
          {required: true, validator: validator.empty, message: '表单字段不能为空', trigger: ['change','blur']},
          {required: true, validator: validator.match, message: '表单字段必须为字母/数字/下划线或组成', trigger: ['change','blur'], regType: 'lnu'}
        ],

      }
    }
  },
  watch: {
    'showDialog'(value) {
      this.show = value;
      if (value) {
        this.resetConfig();
        Object.assign(this.form, this.config);
        this.isRule = this.form.regType ? true : false;
        this.isDisable = this.form.disabled;
        return;
      }
      this.$refs.form.resetFields();
    }
  },
  created () {
    regularList.forEach(item => {
      this.reqularOptions.push({
        label: Object.values(item)[1],
        value: Object.keys(item)[0]
      })
    })
  },
  mounted() {

  },
  methods: {
    // 确认
    confirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.show = false;
          this.$emit('confirm', this.form);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 添加选项
    addOption() {
      this.form.options.push({
        value: '',
        label: '',
      });
    },
    // 移除选项
    removeOption(index) {
      this.form.options.splice(index, 1);
    },
    // 开启验证规则
    changeRule(value) {
      if (!value) this.form.regType = '';
    },
    // 重置配置
    resetConfig() {
      for (let key in this.form) {
        this.form[key] = '';
      }
      this.isRule = false;
      this.isDisable = false;
      this.$set(this.form, 'disabled', false);
      if(this.config.type === 'select' || this.config.type === 'checkbox' || this.config.type === 'radio') {
        this.$set(this.form, 'options', [{
          value: '',
          label: ''
        }])
        return;
      }
      this.$delete(this.form, 'options');
    },
    changeDisable(value) {
      this.form.disabled = value;
    }
  },
  components: {
    
  }
}

</script>

<style lang="less" scoped>
  .mb10{
    margin-bottom: 10px !important;
  }
  /deep/.el-form-item{
    margin-bottom: 20px !important;
    .del-btn{
      margin-left: 10px;
    }
  }
</style>
