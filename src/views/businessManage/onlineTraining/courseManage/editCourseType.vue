<template>
  <el-dialog title="编辑课程类型" :visible.sync="visible" :before-close="handleClose">
  <div class="vlt-card addSubject" >
    <div class="vlt-edit-single">
      <div class="vlt-edit-wrap">
        <el-form ref="ruleForm" :model="forms" label-position="right" label-width="90px"  :rules="rules">
          <el-form-item label="课程类型" prop="courseType">
            <el-input v-model="forms.courseType" size="small" placeholder="请输课程类型, 不超过10字"  maxlength="10" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="类型说明" prop="courseDesc">
            <el-input type="textarea" :rows="3" placeholder="请输入类型说明" v-model="forms.courseDesc"  maxlength="150" show-word-limit> </el-input>
          </el-form-item>
        </el-form>
        <div class="submit-wrap">
          <el-row class="vlt-edit-btn">
            <el-button :id="'courseTypeManage-submit'" type="primary" size="medium" @click="submit">提交</el-button>
            <el-button :id="'courseTypeManage-cancel'" size="medium" @click="visible = false">取消</el-button>
          </el-row>
        </div>
      </div>
    </div>
  </div>
  </el-dialog>
</template>

<script type="text/javascript">
export default {
  name: "",
  props: {
    editData: {
      type: Object
    },
    dialogVisible: {
      type: Boolean
    }
  },
  data() {
    return {
      forms: {},
      rules: {
        courseType: [{ required: true,  validator: this.$rules.checkName, title: '课程类型', trigger: ['change','blur'] }],
        courseDesc: [{ required: true, message: '类型说明不能为空', trigger: ['change','blur'] }]
      },
      visible: false,
    };
  },
  watch: {
    editData: {
      handler(newVal, oldVal) {
        this.forms = newVal;
        // console.log('form',this.forms)
      },
      deep: true
    },
    dialogVisible: {
      handler(newVal, oldVal) {
        this.visible = newVal;
      },
      deep: true
    },
    visible: {
      handler(newVal, oldVal) {
        this.$emit("update:dialogVisible", newVal);
      },
      deep: true
    },
  },
  components: {},
  created () {
    let id = this.$route.query.id;
    // this.trainCourseDetail(id);
  },
  methods: {
    //拉取修改的数据
    trainCourseDetail(id){
      const  _this = this;
      (async data => {
        const res = await _this.$api.trainCourseDetail({data: id});
        if (res && res.code === 0) {
          console.log(res);
        }
      })(id)
    },
    handleClose () {
      this.visible = false;
    },
    submit(){
      const _this = this;
      _this.$refs.ruleForm.validate(valid => {
        // console.log(valid);
        if (valid) {
          let data = {
            id: _this.forms.id,
            courseType: _this.forms.courseType,
            courseDesc: _this.forms.courseDesc,
            insId: _this.forms.insId
          };
          // console.log(data);
          (async (data) => {
            let res = await _this.$api.updateTrainTypeInfo({ message: '提交成功', data });
            if (res && res.code == 0) {
              // console.log(res);
              _this.visible = false;
            }
          })(data)
        }
      })
    }
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
