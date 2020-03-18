<template>
  <div class="vlt-card">
    <div class="questionStatistical">
      <search-bar
      class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      :total="total"
      labelWidth="6em">
        <control-bar
          slot="extend-bar"
          :options="questionOptions"
          @select="questionBankSelectBtn"
          position="left"
        ></control-bar>
      </search-bar>
      <el-table :data="tableData" border style="width: 100%;">
        <el-table-column type="index" label="序号" width="55">
          <template slot-scope="scope">{{params.pageSize*(params.page-1)+(scope.$index+1)}}</template>
        </el-table-column>
        <el-table-column prop="subjectCategory" label="分类名称" min-width="140"></el-table-column>
        <el-table-column prop="categoryDesc" label="分类说明" min-width="140" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createUser" label="创建人" min-width="120"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="160"></el-table-column>
        <el-table-column label="操作" align="center" fixed="right" min-width="140">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="Detail(scope.row)"
              v-has="'SubjectClassification-detail'"
              :id="$route.name + '-' + 'detail' + scope.$index"
            >查看</el-button>
            <el-button
              type=""
              size="mini"
              @click="edit(scope.row)"
              v-has="'SubjectClassification-edit'"
              :id="$route.name + '-' + 'edit' + scope.$index"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <table-paging
        :current-page="params.page"
        :page-size="params.pageSize"
        :total="total"
        @handleSizeChange="pageSizeChange"
        @handleCurrentChange="pageCurrentChange"
      ></table-paging>
    </div>
    <el-dialog
      :title="titleType(status)"
      :visible.sync="dialogFormVisible"
      width="600px"
      :close-on-click-modal="false"
    >
      <div class="vlt-edit-single">
        <el-form
          :model="ruleForm"
          ref="formName"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
          :disabled="status ==2?true:false"
        >
          <el-form-item label="分类名称" prop="subjectCategory">
            <el-input
              v-model="ruleForm.subjectCategory"
              placeholder="请输入分类名称"
              show-word-limit
              maxlength="15"
            ></el-input>
          </el-form-item>
          <el-form-item label="分类说明" prop="categoryDesc">
            <el-input
              type="textarea"
              v-model="ruleForm.categoryDesc"
              maxlength="100"
              placeholder="请输入分类说明"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel" v-if="status !=2" :id="$route.name + '-' + 'cancel'">取 消</el-button>
        <el-button
          type="primary"
          @click="HandelSave"
          v-if="status !=2"
          :id="$route.name + '-' + 'save'"
        >保 存</el-button>
        <el-button
          type="primary"
          @click="close"
          v-if="status ==2"
          :id="$route.name + '-' + 'close'"
        >关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "",
  data() {
    return {
      dialogFormVisible: false,
      saveId: "",
      total: 0,
      // currentPage: 1
      params: {
        page: 1,
        pageSize: 20,
        param: {}
      },
      // 搜索组件配置
      searchOptions: [
        {
          type: "input",
          prop: "subjectCategory",
          value: "",
          title: "分类名称",
          placeholder: "请输入"
        },
        {
          type: "datepicker-range",
          prop: "date",
          value: "",
          title: "创建时间",
          placeholder: ["开始日期", "结束日期"]
        }
      ],
      questionOptions: [
        {
          name: "新建分类",
          type: "primary",
          icon: "plus",
          permission: "SubjectClassification-add"
        }
      ],
      rules: {
        subjectCategory: [
          {
            required: true,
            validator: this.$rules.checkName, 
            title:'题目分类',
            trigger: ["change", "blur"]
          }
        ],
        categoryDesc: [
          {
            required: true,
            message: "请输入分类说明",
            trigger: ["change", "blur"]
          }
        ]
      },
      status: 0,
      tableData: [],
      ruleForm: {
        subjectCategory: "",
        categoryDesc: ""
      }
    };
  },
  created() {
    this.init(this.params);
  },
  methods: {
    async init(data) {
      let res = await this.$api.SubjectClassifiyList({ data });
      if (res && res.code == 0) {
        res.data.records.forEach(item => {
          item.createTime = item.createTime&&this.$moment(item.createTime).format("YYYY-MM-DD HH:mm:ss");
        });
        this.tableData = res.data.records;
        this.total = res.data.total;
      }
    },

    //弹框表头
    titleType(key) {
      let option = {
        0: "新建分类",
        1: "编缉分类",
        2: "查看分类详情"
      };
      return option[key];
    },
    pageSizeChange(size) {
      this.params.pageSize = size;
      this.init(this.params);
    },
    pageCurrentChange(val) {
      this.params.page = val;
      this.init(this.params);
    },
    search(val) {
      this.params.page = 1;
      this.params.param = val;
      if(val.date&&val.date.length>0) {
        this.params.param.startTime = this.$moment(val.date[0]).format('YYYY-MM-DD')
        this.params.param.endTime = this.$moment(val.date[1]).format('YYYY-MM-DD')
        delete this.params.param.date;
      }
      this.init(this.params)
    },
    questionBankSelectBtn(val) {
      this.status = 0;
      this.dialogFormVisible = true;
      this.$refs.formName && this.$refs.formName.resetFields();
      // this.ruleForm.subjectCategory = null;
      // this.ruleForm.categoryDesc = null;
    },
    // 清空表单

    //表单回填
    backForm(val) {
      for (let key in this.ruleForm) {
        this.ruleForm[key] = val[key];
      }
    },
    //编辑
    async edit(val) {
      console.log(this.ruleForm);
      this.saveId = val.id;
      console.log(val);
      this.status = 1;
      this.backForm(val);
      this.dialogFormVisible = true;
    },
    //关闭详情
    close() {
      this.dialogFormVisible = false;
    },
    // 弹框取消
    cancel() {
      this.$refs.formName.resetFields();
      this.dialogFormVisible = false;
    },
    //详情
    Detail(val) {
      this.status = 2;
      this.backForm(val);
      this.dialogFormVisible = true;
    },
    //编辑表单提交
    HandelSave() {
      console.log(this.ruleForm);
      if (this.status != 2) {
        this.$refs.formName.validate(async valid => {
          if (valid) {
            if (this.status === 1) {
              let data = {
                ...this.ruleForm,
                id: this.saveId
              };
              let result = await this.$api.SubjectClassifiyUpdate({
                message: "修改成功",
                data
              });
              if (result && result.code === 0) {
                this.init(this.params);
                this.dialogFormVisible = false;
              }
            } else if (this.status === 0) {
              let data = {
                ...this.ruleForm
              };
              let resul = await this.$api.SubjectClassifiyAdd({
                message: "新增成功",
                data
              });
              if (resul && resul.code === 0) {
                this.init(this.params);
                this.dialogFormVisible = false;
                //this.$refs.formName.resetFields();
              }
            }
          }
        });
      } else {
        this.dialogFormVisible = false;
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>
