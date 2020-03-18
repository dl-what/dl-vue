<template>
  <div class="vlt-card betting-new-card">
   
      <panel title="新增客户标签" :show="true">
         <div class="vlt-edit-single">
        <div class="vlt-edit-wrap">
          <base-form
            :formData="formDatas"
            labelWidth="8em"
            ref="baseForm"
            :rules="rule"
            direction="right"
            @change="changeForm"
          ></base-form>
          <el-row class="vlt-edit-btn">
            <el-button
              type="primary"
              v-prevent="1000"
              size="medium"
              @click="submit('baseForm')"
              :loading="showLoading"
              :id="$route.name + '-' + 'add'"
            >提 交</el-button>
            <el-button size="medium" @click="close" :id="$route.name + '-' + 'cancel'">取 消</el-button>
          </el-row>
        </div>
         </div>
      </panel>
   
  </div>
</template>

<script type="text/javascript">
import rules from "@/utils/rules.js";
export default {
  name: "CreateCard",
  data() {
    return {
      showLoading: false,
      show: this.showForm,
      params: {
        remark: "",
        type: 0,
        name: ""
      },
      formDatas: [
        // {
        //   type: "input",
        //   prop: "tagNumber",
        //   value: "",
        //   title: "标签编号",
        //    disabled : true
        // },
        {
          type: "select",
          title: "标签类型",
          prop: "type",
          options: [{ label: "标签", value: 0 }, { label: "偏好", value: 1 }]
        },
        {
          type: "input-limit",
          title: "标签名称",
          value: "",
          prop: "name",
          maxlength: 20,
        },
        { type: "textarea", title: "内容描述", prop: "remark", maxlength:150 }
      ],
      rule: {
        type: [
          { required: true, message: "请选择标签类型", trigger: ['change','blur'] }
        ],
        name: [{ required: true, validator: this.$rules.checkName, title: "标签名称", trigger: ['change','blur'] }]
      },
      cascaderOptions: []
    };
  },
  created() {},
  methods: {
    changeForm(val) {
      Object.assign(this.params, val);
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid === "true") {
          (async () => {
            const _this = this;
            _this.showLoading = true;
            let data = {
              ..._this.params
            };
            console.log("提交的数据", data);

            let result = await _this.$api.cusAddTag({
              message: "创建成功！",
              data
            });
            console.log("ressss", result);
            if (result.code == 0) {
              setTimeout(() => {
                _this.$router.push({
                  name: "customerTags"
                });
              }, 1000);
            }
            _this.showLoading = false;
          })();
        }
      });
    },
    close() {
      this.$router.back();
    }
  }
};
</script>

<style lang="less" scoped>
.vlt-edit-wrap{
  padding-top: 30px;
}
.vlt-edit-btn{
  margin-left: 8em;
  padding-bottom: 10px;
}
</style>

