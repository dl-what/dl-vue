<template>
  <div class="vlt-card">
    <search-bar
      class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      labelWidth="6em"
      :total="total"
    >
      <div style="margin:10px  0;display:flex;" slot="extend-bar">
        <el-button
          type="primary"
          size="small"
          style="margin-right:10px;"
          @click="selectBtn"
          v-has="'RiskAssessmentQuestion-create'"
        >
          <i class="icon-font el-icon-plus"></i> &nbsp;新建题目
        </el-button>
        <el-button
          size="small"
          style="margin-right:10px;"
          @click="exportTemplate"
          v-has="'RiskAssessmentQuestion-panle'"
        >
          <i class="icon-font el-icon-download"></i> &nbsp;下载模板
        </el-button>
        <el-tooltip
          class="item"
          effect="light"
          content="提示：只能导入以.xls/.xlsx为后缀的文件格式！"
          placement="right"
        >
          <el-upload
            class="upload-demo"
            style="display:flex;align-items:flex-end;"
            action
            :show-file-list="false"
            :auto-upload="true"
            :on-success="handleAvatarSuccess"
            :http-request="uploadFileImg"
            accept=".xls, .xlsx"
          >
            <el-button size="small" v-has="'RiskAssessmentQuestion-import'">
              <i class="icon-font el-icon-s-promotion"></i> &nbsp;题库导入
            </el-button>
            <!-- <div
            slot="tip"
            class="el-upload__tip"
            style="margin-left:10px;margin-bottom:2px;"
            >提示：只能导入以.xls/.xlsx为后缀的文件格式！</div>-->
          </el-upload>
        </el-tooltip>
      </div>
    </search-bar>
    <el-table :data="tableData" border tooltip-effect="light" ref="table">
      <el-table-column type="index" label="序号" width="55" fixed>
        <template slot-scope="scope">{{pageSize*(page-1)+(scope.$index+1)}}</template>
      </el-table-column>
      <el-table-column prop="questionNumber" label="题目编号" min-width="90px"></el-table-column>
      <el-table-column prop="questionType" label="题目类型" min-width="90px">
        <template slot-scope="scope">
          <div>{{scope.row.questionType == 0 ? "单选题" : '多选题'}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="questionName" label="题目名称" min-width="350px"></el-table-column>
      <el-table-column prop="questionOptionVoList" label="题目选项" min-width="450px">
        <template slot-scope="scope">
          <div class="topicOption">
            <p
              v-for="(item,i) in scope.row.questionOptionVoList"
              :key="i"
            >{{generateBig_1(Number(i+65))+'.'+item.optionName}}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="questionOptionVoList" label="选项分值" min-width="160">
        <template slot-scope="scope">
          <div class="topicOption">
            <p
              v-for="(item,i) in scope.row.questionOptionVoList"
              :key="i"
            >{{generateBig_1(Number(i+65))+'.'+item.score}}分</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="topicPoints" label="题目总分" min-width="80">10分</el-table-column>
      <el-table-column label="操作" min-width="120" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="lookDetails(scope.row)"
            v-has="'RiskAssessmentQuestion-details'"
            :id="$route.name+'-details-'+scope.$index"
          >查看</el-button>
          <el-button
            type
            size="mini"
            @click="handlerChange(scope.row)"
            v-if="scope.row.status!=0"
            :id="$route.name+'-edit-'+scope.$index"
            v-has="'RiskAssessmentQuestion-edit'"
          >编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <section class="comp-item">
      <table-paging
        :total="total"
        :currentPage="page"
        :pageSize="pageSize"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      ></table-paging>
    </section>
    <!--弹框-->
    <el-dialog
      :title="titleType(formBank.nowStatus)"
      :visible.sync="dialogVisible"
      width="40%"
      custom-class="setting_dialog"
      :close-on-click-modal="false"
    >
      <bankForm v-model="formBank" ref="bankForm"></bankForm>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="medium"
          @click="dialogVisible = false"
          :id="$route.name+'-bankForm-cencel'"
        >{{formBank.nowStatus == 2?'关闭':'取 消'}}</el-button>
        <el-button
          type="primary"
          size="medium"
          @click="bankFormSubmit"
          :id="$route.name+'-bankForm-enter'"
          v-if="formBank.nowStatus != 2"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import bankForm from "./settingDialog";
import { mapMutations } from "vuex";
export default {
  name: "RiskAssessmentQuestionBank",
  data() {
    return {
      searchOptions: [
        { title: "题目名称", type: "input", prop: "questionName", value: "" },
        {
          title: "题目类型",
          type: "select",
          prop: "questionType",
          value: "",
          options: [
            { label: "单选题", value: 0 },
            { label: "多选题", value: 1 }
          ]
        }
      ],

      tableData: [],
      formBank: {
        questionType: null,
        questionName: null,
        questionOptionVoList: [],
        nowStatus: 0
      },
      title: "新建题目",
      dialogVisible: false,
      page: 1,
      pageSize: 20,
      total: 0,
      searchForm: {}
    };
  },
  components: {
    bankForm
  },
  created() {
    this.init();
  },
  methods: {
    init(val) {
      const self = this;
      (async val => {
        let data = {
          page: val || 1,
          pageSize: self.pageSize,
          param: {
            ...this.searchForm
          }
        };
        let result = await self.$api.memberRiskLevelQuestionPage({ data });
        console.log(result, "题目分页");
        if (result && result.code === 0) {
          self.page = result.data.current;
          self.total = result.data.total;
          self.tableData = result.data.records;
        }
      })(val);
    },
    exportTemplate() {
      this.exportExcel();
    },
    exportExcel() {
      (async () => {
        let res = await this.$api.downloadingExcelTemplate({
          responseType: "blob"
        });
        console.log(res, "模版导出");
        var blob = new Blob([res.blob], {
          type: "application/vnd.ms-excel;charset=utf-8"
        });
        var url = window.URL.createObjectURL(blob);
        var aLink = document.createElement("a");
        aLink.style.display = "none";
        aLink.href = url;
        aLink.setAttribute("download", "题库模版.xls");
        document.body.appendChild(aLink);
        aLink.click();
        document.body.removeChild(aLink); //下载完成移除元素
        window.URL.revokeObjectURL(url); //释放掉blob对象
        console.log(res);
      })();
    },
    validate(name) {
      let res = false;
      this.$refs[name].$refs.ruleForm.validate(valid => {
        res = valid;
      });
      return res;
    },
    handleClose(done) {
      // this.$confirm("确认关闭？")
      //   .then(_ => {
      //     done();
      //   })
      //   .catch(_ => {});
    },
    generateBig_1(val) {
      let a = String.fromCharCode(val);
      return a;
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.init();
    },
    handleCurrentChange(page) {
      this.init(page);
    },
    search(val) {
      this.searchForm = { ...val };
      this.init();
    },
    handleAvatarSuccess(res, file) {
      console.log(res, file, "上传成功的勾子");
    },
    async uploadFileImg(files) {
      console.log(files, "自定义上传勾子");
      let formData = new FormData();
      formData.append("file", files.file);
      console.log(formData, files.file);
      const res = await this.$api.memberRiskLevelQuestionImportExcel({
        timeout: 99999999999999,
        data: formData,
        onUploadProgress(evt) {
          console.log("上传进度事件:", evt);
        }
      });
      console.log(res, "上传成啊 ");
      if (res && res.code == 0) {
        console.log("uploadFile", res);
        this.init();
        this.$message.success("题库上传成功");
      }
    },
    selectBtn() {
      // this.formBank.nowStatus = 0;
      this.clearBankForm();
      this.dialogVisible = true;
    },
    handlerChange(val) {
      //编缉
      this.backfillForm(val);
      this.formBank.nowStatus = 1;
      this.dialogVisible = true;
    },
    titleType(key) {
      //弹框表头
      let option = {
        0: "新建题目",
        1: "编缉题目",
        2: "查看题目详情"
      };
      return option[key];
    },
    backfillForm(val) {
      //表单回填
      let str = JSON.parse(JSON.stringify(val));
      for (let key in str) {
        this.formBank[key] = str[key];
      }
    },
    clearBankForm() {
      //表单清空
      for (let key in this.formBank) {
        if (key != "nowStatus") {
          this.formBank[key] = null;
        }
        if (key === "nowStatus") {
          this.formBank[key] = 0;
        }
        if (key === "questionOptionVoList") {
          this.formBank[key] = [];
        }
      }
    },
    lookDetails(val) {
      //查看
      this.formBank.nowStatus = 2;
      this.backfillForm(val);
      this.dialogVisible = true;
    },
    bankFormSubmit() {
      //表单提交
      if (this.formBank.nowStatus != 2) {
        let buer = this.validate("bankForm");
        if (buer) {
          if (this.formBank.nowStatus == 0) {
            (async () => {
              let data = JSON.parse(JSON.stringify(this.formBank));
              delete data.nowStatus;
              if (data.questionOptionVoList.length < 2) {
                this.$alert("对不起，题目选项不能少于两条！", "提示", {
                  confirmButtonText: "确定",
                  callback: action => {}
                });
              } else {
                let res = await this.$api.memberRiskLevelQuestionCreate({
                  message: "新建题目成功！",
                  data
                });
                console.log(res, "新建题目");
                if (res && res.code === 0) {
                  this.init();
                  this.dialogVisible = false;
                }
              }
            })();
          } else if (this.formBank.nowStatus == 1) {
            (async () => {
              let data = JSON.parse(JSON.stringify(this.formBank));
              delete data.nowStatus;
              if (data.questionOptionVoList.length < 2) {
                this.$alert("对不起，题目选项不能少于两条！", "提示", {
                  confirmButtonText: "确定",
                  callback: action => {}
                });
              } else {
                let res = await this.$api.memberRiskLevelQuestionUpdate({
                  message: "编辑题目成功！",
                  data
                });
                console.log(res, "编缉题目");
                if (res && res.code === 0) {
                  this.init();
                  this.dialogVisible = false;
                }
              }
            })();
          }
        } else {
          this.$alert("对不起，表单验证不通过", "提示", {
            confirmButtonText: "确定",
            callback: action => {}
          });
        }
      } else {
        this.dialogVisible = false;
      }
    }
  }
};
</script>

<style lang="less" >
.topicOption {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.setting_dialog {
  min-width: 600px;
}
</style>
