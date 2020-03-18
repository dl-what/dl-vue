<template>
  <div class="vlt-card">
    <el-steps :active="active" align-center class="step-wrap">
      <el-step title="基础信息" icon="el-icon-edit"></el-step>
      <el-step title="题库设置" icon="el-icon-setting"></el-step>
    </el-steps>
    <div class="vlt-edit-single" v-show="active==1">
      <div>
        <base-form
          :formData="data1"
          ref="baseForm"
          labelWidth="80px"
          :rules="rules"
          direction="right"
          @change="changeForm"
        ></base-form>
        <el-row class="vlt-edit-btn">
          <el-button
            size="medium"
            class="cancel"
            @click="goBack"
            :id="$route.name+'-evalutaion-back'"
          >返 回</el-button>
          <el-button
            type="primary"
            v-prevent="1000"
            size="medium"
            @click="next"
            :id="$route.name+'-evalutaion-next'"
          >下一步</el-button>
        </el-row>
      </div>
    </div>
    <div v-show="active==2">
      <sheQuestion @prev="prev" v-model="sheForm"></sheQuestion>
      <el-row class="vlt-edit-btn" style="padding-left:10px;">
        <el-button
          size="medium"
          @click="prev"
          class="cancel"
          :id="$route.name+'-evalutaion-goback'"
        >返 回</el-button>
        <el-button
          type="primary"
          v-prevent="1000"
          size="medium"
          :id="$route.name+'-evalutaion-exit'"
          @click="submit"
        >{{sheForm.status==0 ? '退出':'完成'}}</el-button>
      </el-row>
    </div>

    <!--弹框-->
  </div>
</template>

<script type="text/javascript">
import rules from "@/utils/rules";
import sheQuestion from "./sheQuestionBankSet";
export default {
  name: "",
  data() {
    return {
      active: 1,
      rules: {
        programName: [
          {
            required: true,
            message: "方案名称不能为空",
            trigger: ["change", "blur"]
          },
          {
            required: true,
            pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9.·-]+$/,
            message: "方案名称不支持特殊字符",
            trigger: ["change", "blur"]
          }
        ],
        programCode: [
          {
            required: true,
            validator: rules.checkInstStr,
            trigger: ["change", "blur"]
          },
          {
            required: true,
            pattern: /^[a-zA-Z0-9.·-]+$/,
            message: "方案名称不支持汉字及特殊字符",
            trigger: ["change", "blur"]
          }
        ],
        briefIntr: [
          {
            required: true,
            message: "方案简介不能为空",
            trigger: ["change", "blur"]
          },
        ]
      },
      data1: [
        {
          type: "input",
          title: "方案名称",
          prop: "programName",
          disabled: false,
          value: "",
          maxlength: "15"
        },
        {
          type: "input",
          title: "方案编号",
          prop: "programCode",
          disabled: false,
          value: "",
          maxlength: "10"
        },
        {
          type: "textarea",
          title: "方案简介",
          prop: "briefIntr",
          disabled: false,
          value: "",
          maxlength: "150"
        }
      ],
      sheForm: {
        tableData: [],
        sum: 0,
        dialogVisible: false,
        status: 0,
        arr: []
      },
      questionForm: {
        tableData: [],
        list: []
      },
      param: {},
      programId: null,
      id: null
    };
  },
  created() {
    this.sheForm.status = this.$route.query.status;
    this.id = this.$route.query.id;
    if (this.sheForm.status == 0) {
      this.getDetails(this.id);
      this.data1.forEach(item => {
        this.$set(item, "disabled", true);
      });
    }
    if (this.sheForm.status == 2) {
      this.getDetails(this.id);
      this.$set(this.data1[1], "disabled", true);
    }
  },
  components: {
    sheQuestion
  },
  methods: {
    prev() {
      if (this.active-- < 1) this.active = 0;
    },
    next() {
      this.$refs["baseForm"].validate(valid =>{
        if (valid == "true") {
          if (this.active++ > 2) this.active = 0;
        } else {return false;}
      })
      
    },
    changeForm(form) {
      this.param = { ...form };
      console.log(this.param);
    },
    goBack() {
      this.$router.go(-1);
    },
    getDetails(id) {
      const self = this;
      (async id => {
        let res = await this.$api.memberRiskLevelProgramDetails({ data: id });
        console.log(res, "评估等级详情");
        if (res && res.code === 0) {
          self.data1.forEach(item => {
            console.log(item);
            item.value = res.data[item.prop];
            self.sheForm.tableData = res.data.questionBankList;
            this.programId = res.data.programId;
          });
        }
      })(id);
    },
    submit() {
      this.$refs["baseForm"].validate(async valid => {
        if (valid) {
          if (this.sheForm.status == 0) {
            this.$router.push({ name: "RiskAssessmentProgram" });
          } else {
            if (this.sheForm.sum > 100) {
              this.open("所选题目总分不能大于一百分！");
            } else if (this.sheForm.sum < 100) {
              this.open("所选题目总分不能小于一百分！");
            } else {
              let arr = this.sheForm.arr.map(item => {
                return item.questionId;
              });
              let data = {
                ...this.param,
                questionIdList: arr
              };
              if (this.sheForm.status == 1) {
                let res = await this.$api.memberRiskLevelProgramCreate({
                  message: "新建成功！",
                  data
                });
                console.log(res, "风险评估新建");
                if (res && res.code === 0) {
                  this.$router.push({ name: "RiskAssessmentProgram" });
                }
              }
              if (this.sheForm.status == 2) {
                data.programId = this.programId;
                let res = await this.$api.memberRiskLevelProgramUpdate({
                  message: "编辑成功！",
                  data
                });
                console.log(res, "风险评估编缉");
                if (res && res.code === 0) {
                  this.$router.push({ name: "RiskAssessmentProgram" });
                }
              }
            }
          }
        } else {
          this.$message.error("表单验证有误，请重新输入！");
          return false;
        }
      });
      return;
    },
    open(val) {
      this.$alert(val, "标题名称", {
        confirmButtonText: "确定",
        callback: action => {}
      });
    }
  }
};
</script>

<style lang="less" scoped>
.step-wrap {
  padding: 30px 0 40px;
}
.vlt-edit-single {
  display: flex;
  justify-content: center;
}
// .vlt-edit-btn{
//   margin-top:100px;
// }
.el-dialog__body {
  padding-top: 0;
}
</style>
