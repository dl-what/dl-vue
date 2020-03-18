<template>
  <div class="vlt-card addlevel-config">
    <panel :show="true" title="新增等级配置">
      <div class="vlt-edit-single">
        <el-form
          class="vlt-edit-wrap"
          :model="baseForm"
          labelWidth="8em"
          ref="baseForm"
          :rules="rules"
          direction="right"
          style="margin-top: 10px;"
        >
          <el-form-item label="等级名称" prop="chLevelName">
            <el-input
              maxlength="20"
              show-word-limit
              v-model="baseForm.chLevelName"
              placeholder="请输入等级名称"
            ></el-input>
          </el-form-item>

          <el-form-item label="等级分值" prop="chGradeScoreS" class="level-score">
            <el-input
              maxlength="8"
              v-model.number="baseForm.chGradeScoreS"
              oninput="value=value.replace(/[^0-9]/g,'')"
              placeholder="请输入分值"
            >
              <template slot="prepend">&ge;</template>
            </el-input>
          </el-form-item>

          <span class="score-icon">——</span>
          
          <el-form-item prop="chGradeScoreE" class="level-score max-score">
            <el-tooltip v-model="isShow" manual content="不填代表无上限" effect="light" placement="right">
            <el-input
              maxlength="8"
              v-model.number="baseForm.chGradeScoreE"
              oninput="value=value.replace(/[^0-9]/g,'')"
              placeholder="请输入分值"
            >
              <template slot="prepend">&lt;</template>
            </el-input>
            </el-tooltip>
          </el-form-item>
          
          <!-- <span class="remark">不填代表无上限</span> -->
          <!-- <div class="explain">* 等级分段包含起始分值，不包含结束分值</div> -->

          <el-form-item label="生效日期" prop="workTime">
            <el-date-picker
              v-model="baseForm.workTime"
              type="date"
              :picker-options="pickOptions"
              placeholder="请选择生效日期"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="等级描述" prop="chGradeDesc">
            <el-input
              v-model="baseForm.chGradeDesc"
              type="textarea"
              :autosize="{minRows: 3}"
              maxlength="150"
              placeholder="请输入等级描述"
            ></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button
            :id="$route.name + '-' + 'submit'"
            type="primary"
            size="medium"
            @click="submit"
            >提 交</el-button>
            <el-button :id="$route.name + '-'+'cancel'" size="medium" @click="cancel">取 消</el-button>
          </el-form-item>
        </el-form>
        <!-- <div class="btn-box">
          <el-button
            :id="$route.name + '-' + 'submit'"
            type="primary"
            size="medium"
            @click="submit"
          >提交</el-button>
          <el-button :id="$route.name + '-'+'cancel'" size="medium" @click="cancel">取消</el-button>
        </div> -->
      </div>
    </panel>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "addLevelConfig",
  data() {
    let chGradeScoreE = (rule, value, callback) => {
      if (value && Number(value) <= Number(this.baseForm.chGradeScoreS)) {
        callback(new Error("需大于起始分值"));
      } else {
        callback();
      }
    };
    let isRepeatedName = (rule, value, callback) => {
      if (value) {
        let data = { chLevelName: value };
        (async data => {
          let res = await this.$api.levelConfigCheckName({ data });
          if (res && res.code === 0) {
            if (res.data) {
              // console.log(res.data);
              callback(new Error("该等级名称已存在,请重新输入"));
            } else {
              callback();
            }
          }
        })(data);
      }
    };
    return {
      isShow: true,
      rules: {
        chLevelName: [
          { required: true, validator: this.$rules.checkName, title: "等级名称", trigger: ['change','blur'] },
          { validator: isRepeatedName, trigger: ['change','blur'] }
        ],
        chGradeScoreS: [
          { required: true, message: "请输入等级分值", trigger: ['change','blur'] }
        ],
        chGradeScoreE: [{ validator: chGradeScoreE, trigger: ['change','blur'] }],
        workTime: [
          { required: true, message: "请选择生效日期", trigger: ['change','blur'] }
        ],
        chGradeDesc: [
          { required: true, message: "请输入等级描述", trigger: ['change','blur'] }
        ]
      },

      baseForm: {
        chLevelName: null,
        chGradeScoreS: null,
        chGradeScoreE: null,
        workTime: null,
        chGradeDesc: null
      },
      pickOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      isRepeated: null
    };
  },
  created() {},
  methods: {
    //提交
    submit() {
      this.$refs.baseForm.validate(valide => {
        if (valide) {
          let data = {
            chLevelName: this.baseForm.chLevelName,
            chGradeScoreS: this.baseForm.chGradeScoreS,
            chGradeScoreE: this.baseForm.chGradeScoreE,
            workTime: this.$moment(this.baseForm.workTime).format("YYYY-MM-DD"),
            chGradeDesc: this.baseForm.chGradeDesc
          };
          if (data.chGradeScoreE === null) {
            delete data.chGradeScoreE;
          }

          (async data => {
            let res = await this.$api.addChannelGradeInfo({
              message: "提交成功",
              data
            });
            if (res && res.code == 0) {
              // console.log("res", res.data);
              this.$router.back();
            }
          })(data);
        } else {
          return false;
        }
      });
    },

    cancel() {
      this.$router.back();
    }
  }
};
</script>

<style lang="less" scoped>
@import "../less/index";
.btn-box{
  margin-bottom: 20px;
}
</style>
