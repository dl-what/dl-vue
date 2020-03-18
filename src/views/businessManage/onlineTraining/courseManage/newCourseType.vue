<template>
  <div class="vlt-card addSubject" >
    <div class="vlt-edit-single">
      <panel title="新建课程类型" :show="true">
      <div class="vlt-edit-wrap">
        <el-form ref="ruleForm" :model="form" label-position="right" label-width="90px" :rules="rules">
          <el-form-item label="课程类型" prop="courseType">
            <el-input v-model.trim="form.courseType" size="small" placeholder="请输课程类型, 不超过10字"  maxlength="10" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="类型说明" prop="courseDesc">
            <el-input type="textarea" :rows="3" placeholder="请输入类型说明" v-model="form.courseDesc"  maxlength="120"> </el-input>
          </el-form-item>
        </el-form>
        <div class="submit-wrap">
          <el-row class="vlt-edit-btn">
            <el-button id="newCourseType-submit" type="primary" size="medium" @click="submit">提交</el-button>
            <el-button id="newCourseType-cancel" size="medium" @click="cancel">取消</el-button>
          </el-row>
        </div>
      </div>
      </panel>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "newCourseType",
  data() {
    return {
      form: {
        courseType: '',
        courseDesc: ''
      },
      channelList: [],
      fileList: [],
      files: [],
      isDisUpload: false,
      rules: {
        courseType: [{ required: true, validator: this.$rules.checkName, title: '课程类型', trigger: ['change','blur'] }],
        courseDesc: [{ required: true, message: '类型说明不能为空', trigger: ['change','blur'] }]
      }
    };
  },
  components: {},
  methods: {
    submit(){
      // addTrainTypeInfo
      const _this = this;
      _this.$refs.ruleForm.validate(valid => {
        console.log(valid);
        if (valid) {
          let data = _this.form;
          data.insId = _this.$storage.get('userInfo').insId;
          (async (data) => {
            let res = await _this.$api.addTrainTypeInfo({ message: '提交成功', data });
            if (res && res.code == 0) {
              console.log(res);
              _this.cancel();
            }
          })(data)
        }
      })
    },
    cancel(){
      this.$router.back();
    },
  }
};
</script>

<style lang="less" scoped>
.btn-import {
  position: absolute;
  top: 5px;
  right: -100px;
}
</style>
<style lang="less">
  .addSubject {
    .subject-select {
      .el-form-item__content {
        width: 300px;
        .el-select {}
      }
    }
  }
</style>
