<template>
  <div class="vlt-cards">
    <h3 class="headling">参数设置</h3>
    <div class="select-box">
      <p class="treename">
        <span>所属机构:</span>
        <span class="trss">{{treeNames}}</span>
      </p>

      <h2>参数设置</h2>
      <el-form :model="form" ref="form" label-width="100px" :rules="rules">
        <el-form-item prop="yearTask" label="今年任务">
          <el-input  show-word-limit maxlength=9  v-model="form.yearTask"></el-input>&nbsp<span>元</span>
        </el-form-item>
        
      </el-form>
    </div>
    <!-- v-has='setting-edit' -->
    <div class="btn">
      <el-button type="primary" v-prevent="1000"  @click="onSubmit">提交</el-button>
    </div>
  </div>
</template>
<script>
import rules from "@/utils/rules.js";
export default {
  name: "parameterSetting",
  data() {
    return {
      treeName: [],
      treeNames: "",
      form: {
        yearTask: 20000000,//默认两千万
        id: ""
      },
      type: 0,
      rules: {
        yearTask: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "true",
            title:'年任务设置'
          }
        ]
      }
    };
  },
  methods: {
    //提交
    onSubmit() {
      this.$refs.form.validate(valid => {
        console.log(valid);
        if (valid) {
          if (this.type == 0) {
            this.saleTaskAdd();
          } else {
            this.saleTaskUpdate(this.form.id);
          }
        }
      });
    },
    //修改年任务销售
    async saleTaskUpdate(id) {
      const res = await this.$api.saleTaskUpdate({
        data: {
          saleTask: this.form.yearTask*100,
          id: id
        },
        message: "修改成功"
      });
    },
    //设置年任务
    async saleTaskAdd() {
      var dateNow= new Date();
      const res = await this.$api.saleTaskAdd({
        data: {
          year: dateNow.getFullYear(),
          saleTask: this.form.yearTask*100
        },
        message: "设置成功"
      });
      if (res && res.code == 0) {
      }
    },
    //获取年任务参数设置详情
    async saleTaskDetail() {
      var dateNow= new Date();
      const res = await this.$api.saleTaskDetail({
        data: {
          year: dateNow.getFullYear()
        }
      });
      if (res.data && res.code == 0) {
        if (res.data.id) {
          this.form.yearTask = res.data.saleTask/100;
          this.form.id = res.data.id;
          this.type = 1;
        }
      }
    },
    //获取当前区域等级
    async getInsLevel(options) {
      const insId = this.$storage.get("userInfo").insId;
      const self = this;
      const res = await self.$api.getInsLevel({
        data: {
          insId
        }
      });
      if (res && res.code == 0) {
        this.treeNames = res.data.insName;
      }
    },
  },
  created() {
    
  },
  mounted() {
    this.saleTaskDetail();
    this.getInsLevel()
  }
};
</script>

<style lang='less' scoped>
@import "../warningRule/less/index.less";
.el-form {
  width: 300px;
}
.treename {
  padding-left: 15px;
}
.vlt-cards {
  padding: 10px;
}
h2 {
  //  border-top:  1px solid #ccc;
  padding-top: 20px;
}
.btn {
  margin-left: 600px;
  text-align: left;
}
 /deep/.el-form-item__content{
  display: flex
}
</style>
