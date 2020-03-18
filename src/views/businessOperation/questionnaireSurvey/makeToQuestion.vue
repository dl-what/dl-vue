<template>
  <div class="vlt-card">
    <panel :show="true" title="新建问卷" style="margin-bottom: 15px;">
      <div class="vlt-edit-wrap">
        <div class="vlt-edit-single">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="130px"
            class="demo-ruleForm">
            <el-form-item label="问卷标题" prop="questionnaireName">
              <el-input v-model="ruleForm.questionnaireName" placeholder="请输入问卷标题" maxlength="20" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="题目分类" prop="categoryId">
              <el-select v-model="ruleForm.categoryId" placeholder="请选择题目分类">
                <el-option
                  v-for="item in SubjectClassifiy"
                  :key="item.id"
                  :value="item.id"
                  :label="item.subjectCategory"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="调查对象" prop="gameId">
              <el-select v-model="ruleForm.gameId" placeholder="请选择调查对象">
                <el-option
                  v-for="item in respondent"
                  :key="item.id"
                  :value="item.id"
                  :label="item.gameName"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="生效时间" prop="time">
              <el-date-picker
                v-model="ruleForm.time"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="dateFn"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="问卷说明" prop="questionnaireDesc">
              <el-input
                type="textarea"
                v-model="ruleForm.questionnaireDesc"
                maxlength="100"
                :autosize="{ minRows: 3, maxRows: 5}"
                placeholder="请输入问卷说明"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </panel>
    <panel :show="true" title="问卷题目" style="margin-bottom: 15px;">
      <div class="wrapper">
        <el-table :data="selectTableData" border style="width: 100%;">
          <el-table-column prop="index" label="序号" align="center" min-width="120" type="index">
            <template slot-scope="scope">{{scope.$index+1}}</template>
          </el-table-column>
          <el-table-column prop="subjectType" label="题目类型" align="center" min-width="120">
            <template slot-scope="scope">{{scope.row.subjectType===1?"单选题":"多选题"}}</template>
          </el-table-column>
          <el-table-column prop="subjectNo" label="题号" align="center" min-width="120"></el-table-column>
          <el-table-column prop="subject" label="题目" align="center" min-width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="optionsContent" label="选项" align="center" min-width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <div style="display:flex; flex-wrap:wrap">
                <p
                  v-for="item in scope.row.optionsList"
                  :key="item.optionsId"
                >{{item.optionsContent+':'+item.description}},</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="subjectCategory" label="题目分类" align="center" min-width="120"></el-table-column>
          <!-- <el-table-column label="操作" prop="introduce" min-width="80px">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="qustionDelect(scope)"
                :id="$route.name+'-delect-'+scope.$index"
              >删除</el-button>
            </template>
          </el-table-column> -->
        </el-table>
        <el-button
          size="medium"
          plain
          icon="el-icon-plus"
          class="text-btn add-question"
          @click="addOption"
          :id="$route.name + '-' + 'addQuestion'"
        >新增问卷题目</el-button>
      </div>
    </panel>
    <el-row class="vlt-edit-btn" style="margin-top:30px">
      <el-button
        type="primary"
        size="medium"
        @click="submit"
        v-has="'makeToQuestion-submit'"
        :id="$route.name + '-' + 'submitQuestion'"
      >提 交</el-button>
      <el-button
        size="medium"
        @click="cancel"
        v-has="'makeToQuestion-cancel'"
        :id="$route.name + '-' + 'cancelQuestion'"
      >返 回</el-button>
    </el-row>
    <el-dialog
      title="新增问卷题目"
      :visible.sync="dialogFormVisible"
      width="60%"
      :close-on-click-modal="false">
      <el-table
        :data="tableData"
        border
        :row-key="getRowKeys"
        :reserve-selection="true"
        ref="table"
        style="width: 100%; margin-top: 10px;"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
        <el-table-column type="index" label="序号" width="60">
          <template slot-scope="scope">{{pageSize*(page-1)+(scope.$index+1)}}</template>
        </el-table-column>
        <el-table-column prop="subjectType" label="题目类型">
          <template slot-scope="scope">{{scope.row.subjectType===1?"单选题":"多选题"}}</template>
        </el-table-column>
        <el-table-column prop="subjectNo" label="题号"></el-table-column>
        <el-table-column prop="subject" label="题目" width="250" show-overflow-tooltip></el-table-column>
        <el-table-column prop="optionsContent" label="选项" width="250" show-overflow-tooltip>
          <template slot-scope="scope">
            <div style="display:flex; flex-wrap:wrap">
              <p
                v-for="item in scope.row.optionsList"
                :key="item.optionsId"
              >{{item.optionsContent+':'+item.description}},</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="subjectCategory" label="题目分类" align="center" min-width="120"></el-table-column>
        
      </el-table>
      <table-paging
        :current-page="page"
        :page-size="pageSize"
        :total="num"
        @handleSizeChange="pageSizeChange"
        @handleCurrentChange="pageCurrentChange"
      ></table-paging>
      <el-row class="vlt-edit-btn" style="margin-top:30px">
        <el-button
          type="primary"
          size="medium"
          @click="confirm"
          :id="$route.name + '-' + 'submit'"
        >确定</el-button>
        <el-button size="medium" @click="goback" :id="$route.name + '-' + 'cancel'">取消</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "",
  data() {
    return {
      selectTableData: [],
      tableData: [],
      selectId: "",
      dialogFormVisible: false,
      page: 1,
      pageSize: 10,
      selectData: [],
      current: 0,
      num: 0,
      dateFn: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      ruleForm: {
        questionnaireName: "",
        categoryId: "",
        gameId: "",
        time: "",
        questionnaireDesc: ""
      },
      respondent: [],
      SubjectClassifiy: [],
      rules: {
        questionnaireName: [
          { required: true,  validator: this.$rules.checkName, title: "问卷标题", trigger: ['change','blur'] }
        ],
        categoryId: [
          { required: true, message: "题目分类不能为空", trigger: ['change','blur'] }
        ],
        gameId: [
          { required: true, message: "调查对象不能为空", trigger: ['change','blur'] }
        ],
        time: [
          { required: true, message: "生效时间不能为空", trigger: ['change','blur'] }
        ],
        questionnaireDesc: [
          { required: true, message: "问卷说明不能为空", trigger: ['change','blur'] }
        ],
      }
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      let result = await this.$api.queryRespondent();
      this.respondent = result.data;
      console.log(result);
      let resul = await this.$api.questionnaireQuestionBankClassify();
      console.log(resul);
      this.SubjectClassifiy = resul.data;
    },
    qustionDelect(scope) {
      this.$refs.table.toggleRowSelection(scope.row);
      this.selectTableData.splice(scope.$index, 1)
      this.selectData = this.selectTableData;
      console.log(this.selectData)
    },
    cancel() {
      // this.dialogFormVisible = false;
      this.$router.back()
    },
    changeForm(val) {
      console.log(val);
    },
    addOption() {
      if(this.ruleForm.categoryId) {
        this.addOptionRes();
      }else{
        this.$message.warning('请先选择题目分类')
      }
      
    },
    async addOptionRes(val) {
      const self = this;
      let data = {
        page: val || 1,
        pageSize: this.pageSize,
        param: {
          categoryId: this.ruleForm.categoryId
        }
      };
      let res = await this.$api.questionnaireQuestionBankList({ data });

      this.tableData = res.data.records;
      this.page = res.data.current;
      this.num = res.data.total;
      console.log(res);
      // console.log(this.ruleForm.subjectType);
      this.dialogFormVisible = true;
    },
    pageSizeChange(size) {
      this.pageSize = size;
      this.addOptionRes();
    },
    pageCurrentChange(val) {
      console.log(val);
      this.page = val;
      this.addOptionRes(val);
    },
    //确定
    confirm() {
      // this.selectTableData = [...this.selectTableData, ...this.selectData];
      this.selectTableData = this.selectData;
      console.log(this.selectTableData);
      //console.log(this.selectTableData);
      this.dialogFormVisible = false;
    },
    //取消
    goback() {
      this.dialogFormVisible = false;
    },
    submit() {
      let ruleForm = JSON.parse(JSON.stringify(this.ruleForm))
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          console.log(valid);
          if (ruleForm.time && ruleForm.time.length > 0) {
            ruleForm.startTime = this.$moment(
              ruleForm.time[0]
            ).format("YYYY-MM-DD HH:mm:ss");
            ruleForm.endTime = this.$moment(ruleForm.time[1]).format(
              "YYYY-MM-DD HH:mm:ss"
            );
            delete ruleForm.time;
          }
          let select = this.selectTableData.map(item => {
            return { subjectId: item.id };
          });

          ruleForm = {
            ...ruleForm,
            subjectList: select
          };
          console.log(ruleForm);
          let data = {
            ...ruleForm
          };
          let result = await this.$api.makeQuestionnaire({ data });
          console.log(result);
          if (result && result.code === 0) {
            this.$router.push(
              "questionnairStatistical",
              this.$message.success("制作成功")
            );
          }
        }
      });
    },
    handleSelectionChange(val) {
      this.selectData = val;
      console.log(this.selectData);
    },
    getRowKeys(row) {
      return row.id
    }
  }
};
</script>

<style lang="less" scoped>
.text-btn {
  width: 60%;
  max-width: 700px;
  margin: 20px 0 10px;
  &.add-question {
		border: 1px dashed #e8e8e8;
  }
}
.vlt-edit-btn {
  display: flex;
  justify-content: flex-end;
}
.vlt-edit-wrap{
  padding-top: 30px;
}
.wrapper{
  padding: 10px;
  text-align: center;
}
</style>
