<template>
  <div class="vlt-card">
    <control-bar slot="extend-bar" @select="selectBtn" :options="controlOptions" position="left"></control-bar>
    <tips-line>
      风险评估方案需要总分为100分,当前方案总分：
      <span class="text-tipline">{{form.status == 0 ? '100' : form.sum}}分</span>
    </tips-line>
    <el-table
      ref="tabel"
      :data="form.tableData"
      tooltip-effect="dark"
      @selection-change="selectionChange"
      border
    >
      <!-- <el-table-column
        prop="equitiesId"
        type="selection"
        width="55"
        v-if="form.status == 0 ? false: true"
      ></el-table-column>-->
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="questionNumber" label="题目编号"></el-table-column>
      <el-table-column prop="questionType" label="题目类型" show-overflow-tooltip>
        <template slot-scope="scope">
          <div>{{scope.row.questionType == 0 ? "单选题" : '多选题'}}</div>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="topicCode" label="题目编号" show-overflow-tooltip></el-table-column> -->
      <el-table-column prop="questionName" label="题目名称"></el-table-column>
      <el-table-column prop="questionOptionVoList" label="题目选项">
        <template slot-scope="scope">
          <div class="topicOption">
            <p
              v-for="(item,i) in scope.row.questionOptionVoList"
              :key="i"
            >{{generateBig_1(Number(i+65))+'.'+item.optionName}}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="questionOptionVoList" label="选项分值" min-width="100">
        <template slot-scope="scope">
          <div class="topicOption">
            <p
              v-for="(item,i) in scope.row.questionOptionVoList"
              :key="i"
            >{{generateBig_1(Number(i+65))+'.'+item.score}}分</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="topicPoints" label="题目总分" min-width="100">10分</el-table-column>
      <el-table-column prop="handles" label="操作">
        <template slot-scope="scope">
          <!-- <el-button type="text" size="mini" @click="lookDetails(scope.row)" :disabled='form.status == 0 && true'>查看</el-button> -->
          <el-button
            type="text"
            size="mini"
            :id="$route.name+'-delect-'+scope.$index"
            @click="handlerChange(scope.row)"
            v-if="scope.row.status!=0"
            :disabled="form.status == 0 && true"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--弹框-->
    <!-- <el-dialog
      title="题目详情"
      :visible.sync="dialogVisible"
      width="34%"
      custom-class="setting_dialog">
      <bankForm v-model="questionForm"></bankForm>
    </el-dialog>-->
    <el-dialog
      title="题目列表"
      :visible.sync="dialogVisible2"
      width="55%"
      custom-class="setting_dialog"
    >
      <questionForm v-model="questionLists" ref="list"></questionForm>
      <el-row class="vlt-edit-btn vlt-ss">
        <el-button size="medium" class="cancel" @click="cancle">取消</el-button>
        <el-button type="primary" v-prevent="1000" size="medium" @click="addQuestionSubmit">添加到题库</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import questionForm from "./questionList";
// import bankForm from '../RiskAssessmentQuestionBank/settingDialog'
export default {
  name: "",
  model: {
    prop: "form",
    event: "selectBtn"
  },
  props: {
    form: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      controlOptions: [
        {
          name: "选择题目",
          type: "primary",
          icon: "plus",
          disabled: false,
          permission: "RiskAssessmentProgram-select"
        }
        // { name: "批量删除", type: "", icon: "delete" ,disabled:false},
      ],
      questionLists: {
        tableData: [],
        total: 0,
        pageSize: 20,
        searchForm: {},
        list: [],
        sheList: []
      },
      questionForm: {
        questionType: null,
        questionName: null,
        questionOptionVoList: [],
        nowStatus: 0
      },
      dialogVisible: false,
      dialogVisible2: false
    };
  },
  components: {
    questionForm
  },
  created() {
    if (this.form.status == 0) {
      this.$set(this.controlOptions[0], "disabled", true);
    }
  },
  methods: {
    selectBtn(val) {
      if (val.name === "选择题目") {
        this.questionLists.sheList = this.form.tableData.map(
          item => item.questionId
        );
        this.dialogVisible2 = true;
      }
    },
    selectionChange(val) {
      const self = this;
      this.form.arr = val;
      let sum = 0;
      val.forEach(item => {
        sum += 10;
      });
      this.form.sum = sum;
      console.log(val);
    },
    generateBig_1(val) {
      let a = String.fromCharCode(val);
      return a;
    },
    lookDetails(val) {
      this.backfillForm(val);
      this.form.nowStatus = 2;
      this.dialogVisible = true;
    },
    backfillForm(val) {
      //表单回填
      let str = JSON.parse(JSON.stringify(val));
      for (let key in str) {
        this.forms[key] = str[key];
      }
    },
    cancle() {
      this.dialogVisible2 = false;
    },
    addQuestionSubmit() {
      let falg = true;
      let arr = [];
      console.log(this.questionLists.list);
      let li = JSON.parse(JSON.stringify(this.questionLists.list));
      if (this.form.tableData.length) {
        li.forEach(item => {
          this.form.tableData.forEach(i => {
            if (item.questionId === i.questionId) {
              arr.push(item);
              falg = false;
            }
          });
        });
      }
      if (falg) {
        this.form.tableData = [...this.form.tableData, ...li];
      } else {
        console.log(arr);
        let str = arr.map(item => item.questionNumber);
        let str2 = Array.from(new Set(str));
        str2 = str2.join(",");
        this.$message.warning(
          "编号为" + str2 + "的题目已存在，题目添加不能重复，请重新选择！"
        );
        return;
      }
      this.$refs.list.$refs.tabel.clearSelection();
      this.dialogVisible2 = false;
    },
    handlerChange(val) {
      console.log(val);
      let arr = [];
      arr = this.form.tableData.filter(
        item => val.questionId != item.questionId
      );
      this.form.tableData = arr;
    }
  },
  watch: {
    "form.tableData": {
      handler(n, o) {
        console.log("form.tableData", n);
        this.$refs.tabel.toggleAllSelection();
      },
      deep: true
    }
  }
};
</script>

<style lang="less" >
.text-tipline {
  color: red;
}
.topicOption {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.setting_dialog {
  border-radius: 10px;
}
.vlt-ss {
  padding: 0 0 10px 15px;
}
</style>
