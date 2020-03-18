<template>
  <div class="vlt-card">
    <el-row type="flex" :gutter="20">
      <el-col :span="8" v-for="(item,index) in  list" :key="index">
        <div class="title">
          <span>{{item.title}}</span>
        </div>
        <div class="text">
          <p>
            {{item.label}}
            <!-- 最后一次消费指上一次投注消费的时候，通过客户的投注记录，判断客户最近一次消费时间与当前时间间隔，以天为单位划分到不同层级中。 -->
          </p>
        </div>
        <div class="rec-main" v-for="(i,n) in item.options" :key="n">
          <el-col :span='14'>
            <span>{{i.prev}}</span>
          </el-col>
          <el-col :span="22">
            <el-input size="mini" v-model="i.date" 
            :disabled="id==0?false:true"
            oninput="this.value=this.value.replace(/[^\d]/g,'')"
            onafterpaste="this.value=this.value.replace(/[^\d]/g,'') "
             ></el-input>
          </el-col>
          <el-col :span="16" class="text-lebel"> 
            <div>
              <span>{{i.label}}</span>
            </div>
          </el-col>
          <el-col :span="22">
            <el-input size="mini" v-model="i.integral" 
            :disabled="id==0?false:true"
            oninput="this.value=this.value.replace(/[^\d]/g,'')"
            onafterpaste="this.value=this.value.replace(/[^\d]/g,'') "
             ></el-input>
          </el-col>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script type="text/javascript">
var validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'));
  } else {
    if (this.ruleForm.checkPass !== '') {
      this.$refs.ruleForm.validateField('checkPass');
    }
    callback();
  }
};
export default {
  name: "",
  model:{
    prop: 'form',
    event: 'returnBack'
  },
  props:{
    form:{
      type: Object,
      default: {}
    },
    id:{
      type:[String,Number],
      default:'0'
    }
  },
  data() {
    return {
      rules: {
        pass: [
          { validator: validatePass, trigger: ['change','blur'] }
        ],
      },
      text: [
        { title: "最近一次消费（Recency）------ 对应成长值" },
        { title: "消费频率（Frequency）------ 对应成长值" },
        { title: "消费金额（Monetary）------ 对应成长值" }
      ],
      list: [
        {
          label:"最后一次消费指上一次投注消费的时候，通过客户的投注记录，判断客户最近一次消费时间与当前时间间隔，以天为单位划分到不同层级中。",
          title: "最近一次消费（Recency）------ 对应成长值",
          options: this.form.one,
        },
        {
          label:"消费频率是客户在限定的期间内所进行游戏消费的次数。以天为单位计算两次投注消费时间间距。",
          title: "消费频率（Frequency）------ 对应成长值",
          options:this.form.two,
        },
        {
          label:"消费金额是客户在一个会员等级周期内所支付的金额，以元为单位进行汇总。",
          title: "消费金额（Monetary）------ 对应成长值",
          options:this.form.three,
        }
      ],
      param:[

      ],
    };
  },
  watch: {
    form: {
      handler(newValue, oldValue) {
        
      },
      deep: true,
    }
  },
  methods: {
  
  }
};
</script>

<style lang="less" scoped>
.vlt-card {
  .rec-main {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin:10px;
  }
  .title{
    text-align: center;
  }
  .text{
    min-height: 130px;
  }
  .text-lebel{
    padding:0 !important;
  }
}
</style>
