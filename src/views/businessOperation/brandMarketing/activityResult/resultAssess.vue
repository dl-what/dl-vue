<template>
  <div class="vlt-card result-assess">
    <el-steps :active="activeStep" finish-status="success" simple style="margin-top: 20px">
      <el-step title="开始评估"></el-step>
      <el-step title="定性报告">2</el-step>
      <el-step title="指标配置">3</el-step>
    </el-steps>

    <div class="vlt-edit-single start-assess" v-show="activeStep===0">
      <el-form label-width="90px" :model="form" ref="form">
        <el-form-item label="活动编号">
          <el-input v-model="form.activeNum"></el-input>
        </el-form-item>
        <el-form-item label="报告名称">
          <el-input v-model="form.reportName"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" size="small" @click="assessStart" class="start-btn">开始评估</el-button>
    </div>

    <div class="report-type" v-show="activeStep===1">
      <span>上传定性总结报告：</span>
      <div class="upload-file">
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          multiple
          :limit="3"
          :on-exceed="handleExceed"
        >
          <el-button size="small" type="primary">
            <i class="el-icon-upload2"></i>上传文件
          </el-button>
          <div slot="tip" class="upload-tip">支持扩展名：.rar .zip .doc .docx .pdf .jpg...</div>
        </el-upload>
      </div>
      <div class="report-btn">
        <el-button size="small" @click="prevStep">上一步</el-button>
        <el-button type="primary" size="small" @click="nextStep">下一步</el-button>
      </div>
    </div>

    <div class="index-config" v-show="activeStep===2">
      <div class="control-index">
        <span>维度选择：</span>
        <el-checkbox-group v-model="targetCheck">
          <el-checkbox v-for="item in checkList" :key="item.index" :label="item">{{item}}</el-checkbox>
        </el-checkbox-group>

        <div class="index-check">
          <p>指标选择：</p>
          <el-checkbox-group v-model="targetCheck">
            <el-checkbox v-for="item in checkList2" :key="item.index" :label="item">{{item}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>

      <div class="enter-btn">
        <el-button size="small" @click="prevStep">上一步</el-button>
        <el-button type="primary" size="small" @click="createReport">生成报告</el-button>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "",
  data() {
    return {
      form: {
        activeNum: "",
        reportName: ""
      },
      activeStep: 0,
      targetCheck: [],
      checkList: ["中心", "省级", "市级", "厅级", "渠道", "大厅", "游戏终端"],
      checkList2: [
        "充值总额",
        "充值总订单数",
        "投注总额",
        "投注总订单数",
        "提现总额",
        "活动预算使用分类汇总",
        "用户数",
        "充值用户数",
        "投注用户数",
        "提现用户数",
        "每用户充值额",
        "每户投注额",
        "每户提现额"
      ]
    };
  },
  components: {},
  methods: {
    assessStart() {
      console.info(this.form);
      this.activeStep = 1;
    },
    prevStep() {
      if (this.activeStep === 2) {
        this.activeStep = 1;
      } else {
        this.activeStep = 0;
      }
    },
    nextStep() {
      this.activeStep = 2;
    },

    createReport() {
      // console.info("tag", this.targetCheck);
      this.activeStep = 3;
    },
    beforeRemove() {},
    handleExceed() {},
    handlePreview() {},
    handleRemove(file, fileList) {}
  }
};
</script>

<style lang="less" scoped>
@import "./less/index";
</style>
