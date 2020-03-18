<template>
  <div class="vlt-card">
    <el-tabs v-model="activeName">
      <el-tab-pane label="资金权限" name="1">
        <panel title="资金权限" :show="true" style="margin-bottom:15px">
          <div class="vlt-edit-single">
            <div class="vlt-edit-wrap">
              <base-form
                :formData="formData"
                :rules="rules"
                ref="baseForm"
                direction="right"
                labelWidth="120px"
                @change="changeForm"
              ></base-form>
            </div>
          </div>
        </panel>
        <panel title="其他附件" :show="true" style="margin-bottom:15px">
          <el-form label-position="right" label-width="90px" ref="form" class="soft-form">
            <el-form-item label="上传附件">
              <el-upload
                class="upload-demo"
                drag
                multiple
                action
                :limit="5"
                :show-file-list="true"
                :on-remove="otherRemove"
                :before-upload="beforeUploadFile"
                :http-request="uploadFileOther"
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  将文件拖到此处，或
                  <em>点击上传</em>
                </div>
                <div class="el-upload__tip" slot="tip">最多只能上传5个文件，且每个不超过50M</div>
              </el-upload>
            </el-form-item>
          </el-form>
        </panel>
        <div class="submit-wrap">
          <el-row class="vlt-edit-btn">
            <el-button type="primary" size="medium" @click="submit">提 交</el-button>
            <el-button size="medium" @click="cancel">取 消</el-button>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="资金权限流程图" name="2"></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "",
  data() {
    return {
      form: {},
      rules: {
        channelNo: [
          { required: true, message: "请输入渠道编号", trigger: ['change','blur'] },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: ['change','blur'] }
        ],
        originalCashQuota: [
          { required: true, message: "请输入原兑奖额度", trigger: ['change','blur'] }
        ],
        currentCashQuota: [
          { required: true, message: "请输入现兑奖额度", trigger: ['change','blur'] }
        ],
        originalRechargeQuota: [
          { required: true, message: "请输入原充值额度", trigger: ['change','blur'] }
        ],
        currentRechargeQuota: [
          { required: true, message: "请输入现充值额度", trigger: ['change','blur'] }
        ]
      },
      activeName: "1",
      formData: [
        { title: "渠道编号", type: "input", prop: "channelNo" },
        { title: "原兑奖额度", type: "input", prop: "originalCashQuota" },
        { title: "现兑奖额度", type: "input", prop: "currentCashQuota" },
        { title: "原充值额度", type: "input", prop: "originalRechargeQuota" },
        { title: "现充值额度", type: "input", prop: "currentRechargeQuota" }
      ],
      gameOtherPath: []
    };
  },
  methods: {
    async submit() {
      let time = this.$moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      let data = {
        ...this.form
      };
      let res = await this.$api.addFundRight({ message: "提交成功", data });
      if (res.code === 0) {
        this.$router.push({ path: "channelDeal" });
      }
    },
    cancel() {
      this.$router.push({ path: "channelDeal" });
    },
    changeForm(val) {
      this.form = val;
    },
    beforeUploadFile(file) {
      const isLt20M = file.size / 1024 / 1024 < 50;
      if (!isLt20M) {
        this.$message.error('上传附件大小不能超过 50MB!');
      }
      return isLt20M;
    },
    // 附件上传
    async uploadFileOther(files) {
      let formData = new FormData();
      console.log("files", files.file.size / 1024);
      // this.softData[3].value = `${(files.file.size/1024).toFixed()}`
      formData.append("file", files.file);
      const res = await this.$api.uploadChannelFiles({
        timeout: 99999999999999,
        data: formData,
        onUploadProgress(evt) {
          let percent = ((evt.loaded / evt.total) * 100) | 0; //调用onProgress方法来显示进度条，需要传递个对象 percent为进度值
          files.onProgress({ percent: percent });
          console.log("上传进度事件:", evt);
        }
      });
      if (res && res.code == 0) {
        this.$message.success("上传成功");
        this.gameOtherPath.push(res.data.filePath);
      }
      console.log("uploadFile", res);
    },
    handlePreview() {},
    handleRemove() {},
    beforeRemove() {},
    handleExceed() {},
    otherRemove() {}
  }
};
</script>

<style lang="less" scoped>
@import "../less/index.less";
.submit-wrap {
  text-align: right;
  padding: 10px 0;
}
.soft-form{
  margin-top: 15px;
}
</style>
