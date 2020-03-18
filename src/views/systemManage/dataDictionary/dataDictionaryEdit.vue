<template>
  <div class="vlt-card">
    <div class="vlt-edit-single">
      <h2 class="title">基本信息</h2>
      <div class="vlt-edit-wrap">
        <base-form :formData="formData" ref="baseForm" :rules="rules" direction="right" @change="changeForm"></base-form>
        <el-row class="vlt-edit-btn">
          <el-button type="primary" v-prevent="1000" size="medium" @click="submit">提 交</el-button>
          <el-button size="medium" @click="cencal">取 消</el-button>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import rules from "../../../utils/rules";
export default {
  name: "",
  data() {
    return {
      formData: [
        {title: '所属类型',type:'input',prop:'belongsType',value:'' },
        {title: '字典名称',type:'input',prop:'dictionaryname',value:'' },
        {title: '字典数据值',type:'input',prop:'dictionarydata',value:'' },
        {title: '排序字段',type:'input',prop:'sortfields',value:'' },
        {title: '状态',type:'switch',prop:'status',value:'' },
        {title: '详情描述',type:'textarea',prop:'all',value:'' },
      ],
      params: {
      },
      rules: {
        belongsType: [
          { required: true, message: "请输入" },   
        ],
        dictionaryname: [
          { required: true, message: "请输入内容" },
        ],
        dictionarydata: [
          {required: true, message: "请输入内容",}
        ],
        sortfields: [  
           { required: true,  message: "请输入内容" }
        ],  
        sortfields: [
           { required: true,  message: "请输入内容" }
        ],
      }
    };
  },
  components: {},
  methods: {
    submit() {
      this.$refs.baseForm.validate((val)=>{
        console.log(val)
      });
    },
    changeForm(val) {
      Object.assign(this.params, val)
      console.log('派发出来的参数', this.params)
    },
     cencal(){
      this.$router.go(-1)
    }
  }
};
</script>

<style lang="less" scoped>
</style>
