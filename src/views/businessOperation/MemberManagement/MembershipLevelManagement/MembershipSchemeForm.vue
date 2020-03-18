<template>
  <div class="vlt-card">
    <base-form
      :formData="baseData"
      ref="baseForm"
      :rules="rules"
      direction="right"
      @change="changeForm"
    ></base-form>
    <el-row class="vlt-edit-btn">
      <el-button size="medium" @click="back" class="cancel" :id="$route.name+'-create'+'-back'">返 回</el-button>
      <el-button
        type="primary"
        v-prevent="1000"
        size="medium"
        @click="next"
        :id="$route.name+'-create'+'-next'"
      >下一步</el-button>
    </el-row>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "MembershipSchemeForm",

  data() {
    return {
      rules: {
        programName: [
          {
            required: true,
            message: "方案名称不能为空",
            trigger: ["change", "blur"]
          },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
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
            message: "方案编号不能为空",
            trigger: ["change", "blur"]
          },
          {
            required: true,
            pattern: /^[a-zA-Z0-9.·-]+$/,
            message: "方案编号不支持汉字及特殊字符",
            trigger: ["change", "blur"]
          }
        ]
      },
      baseData: [
        {
          title: "方案名称",
          type: "input",
          prop: "programName",
          value: "",
          placeholder: "请输入变更计划名称",
          disabled: false
        },
        {
          title: "方案编号",
          type: "input",
          prop: "programCode",
          value: "",
          disabled: false,
          maxlength: "20"
        },
        {
          title: "方案简介",
          type: "textarea",
          prop: "briefIntr",
          value: "",
          maxlength: "300",
          placeholder: "请输入变更计划简介",
          disabled: false
        }
      ],
      param: {}
    };
  },
  components: {},
  props: ["idstatus", "baseFromData"],
  created() {
    if (this.idstatus == 1) {
      this.baseData.forEach(item => {
        this.$set(item, "disabled", true);
      });
    }
    if (this.idstatus == 2) {
      this.$set(this.baseData[1], "disabled", true);
    }
  },
  methods: {
    changeForm(val) {
      this.param = { ...val };
    },
    back() {
      this.$router.go(-1);
    },

    next(val) {
      this.$refs["baseForm"].validate(valid => {
        if (valid == "true") {
          let data = {
            memberLevelProgramVo: this.param
          };
          this.$emit("next", data);
        } else {
          this.$message.error("表单填写有误，请重新填写");
          return false;
        }
      });
    }
  },
  watch: {
    baseFromData: {
      handler: function(n, o) {
        if (Object.keys(n).length > 0) {
          this.baseData.forEach(item => {
            this.$set(item, "value", n[item.prop]);
          });
        }
      },
      deep: true
    }
  }
};
</script>

<style lang="less" scoped>
</style>
