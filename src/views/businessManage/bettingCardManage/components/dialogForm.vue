<template>
  <el-dialog :title="diaTitle" :visible.sync="show" width="50%" :before-close="close" class="dialog-form-list">
    <div class="vlt-edit-single">
      <h2 class="title" v-if="diaTitle">{{diaTitle}}</h2>
      <div class="vlt-edit-wrap">
        <base-form
          :formData="formDatas"
          labelWidth="140px"
          ref="baseForm"
          :rules="rule"
          direction="right"
          @change="changeForm"
        ></base-form>
        <el-row class="vlt-edit-btn">
          <el-button type="primary" v-prevent="1000" size="medium" @click="onSubmit">生成并导出</el-button>
          <el-button size="medium" @click="close">取 消</el-button>
        </el-row>
      </div>
    </div>
  </el-dialog>
</template>

<script type="text/javascript">
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
    formDatas: {
      type: Array
    },
    rule: {
      type: Object
    }
  },
  data() {
    return {
      show: this.showForm,
      params: {}
    };
  },
  watch: {
    showForm(value) {
      this.show = value;
    }
  },
  mounted() {},
  components: {},
  methods: {
    changeForm(val) {
      Object.assign(this.params, val);
      // console.log("change", this.params);
    },
    handleClose() {
      console.log("close");
    },
    close() {
      this.$emit("closeDia");
    },
    onSubmit() {
      console.log("formData", this.params);
      this.close();
    }
  }
};
</script>

<style lang="less">
.dialog-form-list {
  .el-dialog__header {
    padding-top: 0;
  }
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
