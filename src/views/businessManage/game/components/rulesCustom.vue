<template>
  <div>
    <!-- 自定义规则 -->
    <el-form label-position="right" 
      label-width="110px" 
      :model="form"
      :rules="rules"
      :disabled="disabled"
      ref="form"
      class="baseInfo">
      <el-form-item
      v-for="(item,index) in formData"
      :key="index"
      :label="item.label"
      :prop="item.disabled ? '' : item.prop">
        <!-- 输入框 -->
        <el-input
          v-if="item.type=='input'"
          :disabled="item.disabled?item.disabled:false"
          v-model.trim="item.value"
          :placeholder="item.placeholder?`${item.placeholder}`:`请输入${item.label}`">
        </el-input>
        <!-- 下拉框 -->
        <el-select v-if="item.type=='select'" v-model="item.value" :placeholder="`请选择${item.label || ''}`" :disabled="item.disabled">
          <el-option :label="item.label" :value="item.value" :key="i" v-for="(item, i) in item.options"></el-option>
        </el-select>
        <!-- 复选框 -->
        <el-checkbox-group v-if="item.type=='checkbox'" v-model="item.value" :disabled="item.disabled">
          <el-checkbox :label="item.value" :key="i" v-for="(item, i) in item.options">{{item.label}}</el-checkbox>
        </el-checkbox-group>
        <!-- 日期选择 -->
        <el-date-picker v-if="item.type=='date'" type="date" placeholder="选择日期" v-model="item.value" style="width: 100%;" :disabled="item.disabled"></el-date-picker>
        <!-- 日期时间选择 -->
        <el-date-picker v-if="item.type=='datetime'" type="datetime" placeholder="选择日期时间" v-model="item.value" style="width: 100%;" :disabled="item.disabled"></el-date-picker>
        <!-- 单选radio -->
        <el-radio-group v-if="item.type=='radio'" v-model="item.value" :disabled="item.disabled">
          <el-radio :label="item.value" :key="i" v-for="(item, i) in item.options">{{item.label}}</el-radio>
        </el-radio-group>
        <!-- 开关 -->
        <el-switch v-if="item.type=='switch'" v-model="item.value"
          :active-value="1"
          :inactive-value="0"
          :disabled="item.disabled">
        </el-switch>
        <!-- 文本框 -->
        <el-input v-if="item.type=='textarea'" type="textarea" v-model="item.value" :disabled="item.disabled" :placeholder="`请输入${item.label || ''}`" maxlength="150"></el-input>
      </el-form-item>
      <el-form-item prop="">
        <el-button icon="el-icon-plus" @click="isShow=true" class="add-btn vlt-add-more"> 自定义配置</el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      title="自定义配置"
      :visible.sync="isShow"
      class="fullscreen"
      :fullscreen="true">
        <formCustomSet @change="changeCustom" v-model="form.customSettings" @close="isShow=false"></formCustomSet>
        <!-- <div class="footer-btn">
          <el-button @click="isShow = false">取 消</el-button>
          <el-button type="primary" @click="isShow = false">确 定</el-button>
        </div> -->
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import rules from "@/utils/rules.js";
import formCustomSet from './formCustomSet'

export default {
  name: "",
  components: {
    formCustomSet
  },
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
      config: {},
      formData: [],
      isShow: false,
      rules: {
        name: [
          { required: true, validator: rules.checkEmpty, trigger: ['change','blur'] }
        ],
        insId: [
          { required: true, validator: rules.checkEmpty, trigger: ['change','blur'] }
        ],
      },
      disabled: false,
    }
  },
  watch: {
    formData: {
      handler(val) {
        console.log('formData的参数', this.formData)
        this.config.list = val;
        console.log('config的参数', this.config)
        localStorage.setItem('previewConfig', JSON.stringify(this.config));
        this.form.customSettings = JSON.stringify(this.config);
      },
      deep: true,
    }
  },
  created() {
    // 控制表单是否禁用
    this.disabled = this.$route.query.type == '1' ? true : false;
    
    // 回填数据
    if(this.form.customSettings) {
      this.formData = JSON.parse(this.form.customSettings).list;
    }
  },
  methods: {
    changeCustom(val) {
      this.isShow = false;
      this.config = JSON.parse(val);
      this.formData = [];
      let data = JSON.parse(val).list;
      data.forEach((item, index) => {
        if(item.field) {
          item.value = '';
          if(item.type=='checkbox') {
            item.value = [];
          }
          this.$set(this.formData, index, item)
        }
      });
      
    },
    addCustomSet() {

    },
    // 校验
    validate(callback) {
      // this.$emit('change', this.form)
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log('校验通过')
          // this.$emit('asset')
          callback('true')
        }else{
          console.log('校验不通过')
          callback('false');
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
  .vlt-edit-wrap{
    width: 100%;
    margin: 0 30px;
  }
  .add-btn{
    width: 100%;
    max-width: 350px;
    // margin: 20px 0;
  }
  .footer-btn{
    padding-right: 20px;
    text-align: right;
  }
</style>
