<template>
  <!-- 修改 -->
  <el-dialog :visible.sync="show" class="editCustomer" width="50%" title="编辑客户标签" :close-on-click-modal="false" :before-close="close">
    <div class="vlt-edit-single">
      <base-form
        :formData="formDatas"
        labelWidth="100px"
        ref="baseForm"
        :rules="rule"
        direction="right"
        @change="changeForm"
      ></base-form>
      <div class="dialog-footer">
        <el-button
          type="primary"
          v-prevent="1000"
          size="medium"
          @click="submit('baseForm')"
          :id="$route.name + '-' + 'submit'"
        >提 交</el-button>
        <el-button size="medium" @click="close" :id="$route.name + '-' + 'cancel'">取 消</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script type="text/javascript">
import rules from "@/utils/rules.js";

export default {
  name: "editCustomerTag",
  props: {
    oData: {
      type: Object,
      default: 0
    },
    insDatas: {
      type: Array
    },
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      params: {},
      formDatas: [
        {
          type: "input",
          prop: "id",
          value: "",
          title: "标签编号",
          disabled: true
        },
        {
          type: "select",
          title: "标签类型",
          prop: "type",
          value: 0,
          options: [
            { label: "标签", value: "0" },
            { label: "偏好", value: "1" }
          ]
        },
        {
          type: "input",
          title: "标签名称",
          prop: "name",
          value: "",
          maxlength: 20,
        },
        { type: "textarea", title: "内容描述", prop: "remark",maxlength: 150 }
      ],
      rule: {
        type: [
          { required: true, message: "请选择标签类型", trigger: ['change','blur'] }
        ],
        name: [{ required: true, message: "请选择标签名称", trigger: ['change','blur'] }]
      },
      show: this.isShow
    };
  },
  watch: {
    isShow(value) {
      this.show = value;
      // this.backfill(this.oData);
    },
    oData: {
      handler(newValue, oldValue) {
        console.log("这是改变的数据", newValue);
        this.backfill(newValue);
      }
    }
    // formDatas: {
    //   handler(newVal, oldVal) {
    //     Object.assign(this.params, newVal);
    //   },
    //   deep: true
    // }
  },
  methods: {
    changeForm(val) {
      // console.log("change",val);
      Object.assign(this.params, val);
    },
    backfill(newValue) {
      let arr = Object.keys(newValue);
      let aForm = this.formDatas;
      for (let i = 0; i < aForm.length; i++) {
        for (let j = 0; j < arr.length; j++) {
          if (aForm[i].prop == arr[j]) {
            this.$set(aForm[i], "value", newValue[arr[j]]);
          }
        }
      }

      Object.assign(this.params, newValue);
      // console.log(this.params);
    },
    submit(baseForm) {
      const _this = this;
      _this.params.type = Number(_this.params.type);
      let data = _this.params;
      delete data.createBy;
      delete data.createTime;
      delete data.updateBy;
      delete data.updateTime;
      this.$refs[baseForm].validate(valid => {
        if (valid === "true") {
          (async data => {
            let result = await _this.$api.cusEditTag({
              message: "编辑成功！",
              data
            });
            console.log("result", result);
            if (result.code == 0) {
              setTimeout(() => {
                _this.close("true");
              }, 1000);
            }
          })(data);
        } else {
          console.log("false");
        }
      });
    },
    close(bool) {
      this.$refs.baseForm.resetForm();
      // setTimeout(() => {
      if (bool) {
        this.$emit("closeDia", bool);
      } else {
        this.$emit("closeDia");
      }
      // }, 3000);
    },
    onSubmit(baseform) {
      this.submit(baseform);
    }
  }
};
</script>

<style lang="less" scoped>
  .dialog-footer{
    text-align: left;
    padding-left: 100px;
  }
  .editCustomer{
    /deep/.el-dialog{
      min-width: 550px;
      max-width: 600px;
    }
  }
</style>
