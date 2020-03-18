<template>
  <el-dialog :title="diaTitle" :visible.sync="show" width="50%" :before-close="close" class="dialog-form-list">
    <div class="vlt-edit-single">
      <div class="vlt-edit-wrap">
        <base-form
          :formData="formDatas"
          labelWidth="140px"
          ref="baseForm"
          :rules="rules"
          direction="right"
          @change="changeForm"
        ></base-form>
        <el-row class="vlt-edit-btn">
          <el-button id="knowledgeBase-submit"  type="primary" v-prevent="1000" size="medium" @click="onSubmit">提交</el-button>
          <el-button  id="knowledgeBase-cancel" size="medium" @click="close">取 消</el-button>
        </el-row>
      </div>
    </div>
  </el-dialog>
</template>

<script type="text/javascript">
import rules from "@/utils/rules.js";
export default {
  name: "dialogForm",
  props: {
    showForm: {
      type: Boolean,
      default: false
    },
    diaTitle: {
      type: String,
      default: "基础信息"
    },
    dataInfo: {
      type: Object
    },
  },
  data() {
    return {
      show: this.showForm,
      params: {},
      formDatas: [
        {
          type: "select",
          title: "审核结果",
          prop: "approvalResult",
          options: [
            { label: "通过", value: "0" },
            { label: "未通过", value: "1" }
          ]
        },
        {type: 'input', prop:'approvalOpinion', title: '审核意见',value: ''},
      ],
      rules: {
        // address: [{required: true,trigger: ['change','blur'] }],
        approvalResult: [
          { required: true, validator: rules.checkEmpty, trigger: ['change','blur'], message:"审核结果不能为空" }
        ],
        approvalOpinion: [
          { required: true, validator: rules.checkEmpty, trigger: ['change','blur'], message:"审核意见不能为空" }
        ]
      },
    };
  },
  watch: {
    showForm(value) {
      this.show = value;
    },
    dataInfo (val) {
      console.log(val);
      if (val) {
        this.params = {
          id: val.id,
          goodsName: val.goodsName,
          faultType: val.faultType
        }
      }
    }
  },
  mounted() {},
  components: {},
  methods: {
    updateInfo (data) {
      const _this = this;
      (async (data) => {
        let res = await _this.$api.baseApproval({message: '审核完成', data})
        console.log(res);
        if (res && res.code === 0) {
          _this.close('true');
        }
      })(data)
    },
    changeForm(val) {
      Object.assign(this.params, val);
      // console.log("change", this.params);
    },
    handleClose() {
      console.log("close");
    },
    close(val) {
      this.$emit("closeDia", val);
      this.$refs.baseForm.resetForm();
    },
    onSubmit() {
      console.log("formData", this.params);
      this.$refs.baseForm.validate(valid => {
        if (valid === 'true') {
          this.params.approvalResult = Number(this.params.approvalResult)
          this.updateInfo (this.params);
        }
      })
    }
  }
};
</script>

<style lang="less">
.dialog-form-list {
  // .el-dialog__header {
  //   padding-top: 0;
  // }
  .el-switch__core {
    width: 60px !important;
    height: 26px;
    border-radius: 13px;
    &:after {
      width: 22px;
      height: 22px;
    }
  }
  .el-switch.is-checked .el-switch__core::after {
    left: 100%;
    margin-left: -23px;
  }
  .el-switch__label {
    position: absolute;
    right: 6px;
    left: auto;
    height: 26px;
    line-height: 26px;
    color: #fff;
    span {
      font-size: 12px;
    }
    &.is-active {
      left: 0;
      right: auto;
      color: #fff;
    }
  }
}
</style>
