<template>
  <div class="vlt-card preview-form-container">
    <el-form :model="form" ref="form" :rules="rules" label-width="80px" label-position="top" class="preview-container">
      <div class="form-box" v-for="index in config.col * config.row" :key="index" :data-index="index" :style="boxStyle">
        <form-component v-if="config.list[index - 1].type" :config="config.list[index - 1]" :draggable="false" :form="form" :isRule="config.list[index - 1].regType">
        </form-component>
      </div>
      <el-form-item class="form-btns">
        <el-button type="primary" size="small" @click="submit">确定</el-button>
        <el-button size="small" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import formComponent from './components/dragForm/formComponent'
import validator from './components/dragForm/config/validator'

export default {
  name: 'preview',
  data() {
    return {
      form: {},
      rules: {},
      config: JSON.parse(localStorage.getItem('previewConfig')) || {},
      boxStyle: {}
    }
  },
  created() {
    this.init(this.config)
  },
  mounted() {
    const self = this;

  },
  methods: {
    // 初始化
    init(config) {
      let len = config.row * config.col;
      this.boxList = [];
      for (let i = 0; i < len; i++) {
        this.boxList.push({
          index: i
        })
      }
      Object.assign(this.boxStyle, {
        margin: '10px 1%',
        width: (100 - 1 * config.col * 2) / config.col + '%'
      });
      // 初始化表单数据与验证
      config.list.forEach(item => {
        if (item.field) {
          this.$set(this.form, item.field, '');
          this.$set(this.rules, item.field, [
            {required: true, validator: validator.empty, message: `${item.label}不能为空`, trigger: ['change','blur']},
            {required: true, validator: validator.match, message: `${item.label}输入有误`, trigger: ['change','blur'], regType: item.regType}
          ]);
        }
      })
      console.log('this.form', this.form)
      console.log('this.rules', this.rules)
    },
    // 提交
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$message.closeAll();
          this.$message({
            message: '提交成功',
            type: 'success'
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 重置
    resetForm() {
      for (let key in this.form) {
        this.form[key] = '';
      }
      this.$refs['form'].resetFields();
    }
  },
  components: {
    formComponent,
  }
}
</script>


<style lang="less">
@import './less/index.less';
</style>
