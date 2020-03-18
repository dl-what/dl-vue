<template>
  <div class="vlt-card">
    <div class="vlt-edit-single">
      <el-form
        :model="form"
        :rules="rules"
        ref="ruleForm"
        label-width="90px"
        class="demo-ruleForm"
        :disabled="form.nowStatus == 2 ? true :false"
      >
        <el-form-item label="题目类型" prop="questionType">
          <el-select v-model="form.questionType" placeholder="请选择题目类型">
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="item in optionsType"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="题目名称" prop="questionName">
          <el-input
            v-model="form.questionName"
            placeholder="请输入题目名称"
            maxlength="150"
          ></el-input>
        </el-form-item>

        <el-form-item
          :label="'选项'+changeNuber(Number(j)+1)"
          prop="questionOptionVoList"
          v-for="(item,j) in form.questionOptionVoList"
          :key="j"
        >
          <!-- <el-col :span="22"> -->
          <div style="margin-bottom:20px;">
            <el-form-item
              :prop="`questionOptionVoList.${j}.optionName`"
              :rules="questionOptionVoList.optionName"
            >
              <el-input
                v-model="item.optionName"
                placeholder="请输入选项内容"
                maxlength="100"
              >
                <template slot="prepend">
                  {{
                  generateBig_1(Number(j+65))}}
                </template>
              </el-input>
            </el-form-item>
          </div>
          <!-- </el-col> -->
          <el-form-item
            :prop="`questionOptionVoList.${j}.score`"
            :rules="questionOptionVoList.score"
          >
            <div class="flex-box">
              <el-input
                v-model="item.score"
                maxlength="2"
                placeholder="请输入分值"
                oninput="value=value.replace(/[^\d]/g,'')"
              >
                <template slot="append">分</template>
              </el-input>
              <el-button type="" @click="delectoption(j)" style="margin-left:10px;">删除</el-button>
            </div>
          </el-form-item>
        </el-form-item>
        <el-form-item label prop="topicOption">
          <span style="color:#F56C6C">提示：题目所有选项总分值只能为10分！</span>
          <el-button
            type="text"
            class="text-btn"
            @click="addOption"
            :id="$route.name+'-qutions-add-select'"
          >+ 添加选项</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "settingDialog",
  model: {
    prop: "form",
    event: "returnEvent"
  },
  props: {
    form: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      rules: {
        questionType: [
          { required: true, message: "请选择题目类型", trigger: ["blur"] }
        ],
        questionName: [
          { required: true, validator: this.$rules.checkName, title:  "题目名称", trigger: ["blur"] }
        ],
        questionOptionVoList: [
          { required: true, message: "请输入选项内容", trigger: ["blur"] }
        ]
      },
      questionOptionVoList: {
        optionName: [
          { required: true, message: "请输入选项内容", trigger: ["blur"] }
        ],
        score: [
          { required: true, message: "请输入分值", trigger: ["blur"] },
          {
            required: true,
            pattern: /^[0-9.·-]+$/,
            message: "选项分值只支持数字类型！",
            trigger: ["blur"]
          }
        ]
      },
      optionsType: [
        { label: "单选题", value: 0 },
        { label: "多选题", value: 1 }
      ]
    };
  },
  created() {},
  methods: {
    generateBig_1(val) {
      let a = String.fromCharCode(val);
      return a;
    },
    changeNuber(val) {
      let option = {
        1: "一",
        2: "二",
        3: "三",
        4: "四",
        5: "五"
        //  6:'六',
        //  7:'七',
        //  8:'八',
        //  9:'九',
        //  0:'零'
      };
      return option[val];
    },
    addOption() {
      const self = this;
      let obj = { optionName: "", score: "" };
      if (self.form.questionOptionVoList.length >= 5) {
        self.open("对不起，最多能添加5条选项！");
      } else {
        self.form.questionOptionVoList.push(obj);
      }
    },
    delectoption(val) {
      let arr = this.form.questionOptionVoList.filter((item, i) => val != i);
      console.log(arr);
      this.form.questionOptionVoList = arr;
    },
    open(val) {
      this.$alert(val, "标题名称", {
        confirmButtonText: "确定",
        callback: action => {}
      });
    }
  }
};
</script>

<style lang="less" scoped>
.text-btn {
  width: 100%;
  border: 1px dashed #ccc;
}
.flex-box{
  display: flex;
  align-items: center;
}
</style>
