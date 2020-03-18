<template>
  <div class="vlt-card">
    <div class="questionBank">
      <search-bar @search="search" :options="options" :total="num" labelWidth="6em">
        <div style="margin:10px  0;display:flex;" slot="extend-bar">
          <el-button
            type="primary"
            size="small"
            style="margin-right:10px;"
            @click="selectBtn"
            v-has="'questionnaireBank-add'"
            :id="$route.name + '-' + 'add'"
          >
            <i class="icon-font el-icon-plus"></i> 新建题目
          </el-button>
          <el-button
            size="small"
            @click="download"
            :id="$route.name + '-' + 'downLoad'"
          >
            <i class="icon-font el-icon-s-promotion"></i> &nbsp;下载模板
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
              :auto-upload="true"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :http-request="uploadFileImg"
              accept=".xls, .xlsx"
            >
              <el-button
                size="small"
                type
                icon="el-icon-upload2"
                v-has="'questionnaireBank-import'"
                :id="$route.name + '-' + 'import'"
              >导入题目</el-button>
            </el-upload>
          </el-tooltip>
        </div> 
      </search-bar>
      <el-table :data="tableData" border style="width: 100%;">
        <el-table-column type="index" label="序号" width="60">
          <template slot-scope="scope">{{pageSize*(page-1)+(scope.$index+1)}}</template>
        </el-table-column>
        <el-table-column prop="subjectType" label="题目类型">
          <template slot-scope="scope">{{scope.row.subjectType===1?"单选题":"多选题"}}</template>
        </el-table-column>
        <el-table-column prop="subjectNo" label="题号"></el-table-column>
        <el-table-column prop="subject" label="题目" width="250"></el-table-column>

        <el-table-column prop="optionsContent" label="选项" width="250">
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
        <el-table-column label="操作" align="center" fixed="right" min-width="120px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="Detail(scope.row)"
              v-has="'questionnaireBank-detail'"
              :id="$route.name + '-' + 'detail' + scope.$index"
            >查看</el-button>
            <el-button
              type
              size="mini"
              @click="edit(scope.row)"
              v-has="'questionnaireBank-edit'"
              :id="$route.name + '-' + 'edit' + scope.$index"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <table-paging
        :current-page="page"
        :page-size="pageSize"
        :total="num"
        @handleSizeChange="pageSizeChange"
        @handleCurrentChange="pageCurrentChange"
      ></table-paging>
      <el-dialog
        :title="titleType(nowStatus)"
        :visible.sync="dialogFormVisible"
        width="600px"
        :close-on-click-modal="false"
        @close="closeDialog"
      >
        <div class="vlt-edit-single">
          <el-form
            :model="form"
            ref="formName"
            label-width="100px"
            class="demo-ruleForm"
            :rules="rule"
            :disabled="nowStatus == 2 ? true :false"
          >
            <el-form-item label="题目类型" prop="subjectType">
              <el-select v-model="form.subjectType" placeholder="请选择题目类型">
                <el-option
                  v-for="item in type"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="题目分类" prop="categoryId">
              <el-select v-model="form.categoryId" placeholder="请选择题目分类">
                <el-option
                  v-for="item in classify"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="题目名称" prop="subject">
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model.trim="form.subject" placeholder="请输入题目名称" maxlength="150"></el-input>
            </el-form-item>
            <el-form-item
              :label="'选项'+changeNumber(Number(index))"
              v-for="(item,index) in form.optionsList"
              :key="index"
              :prop="`optionsList.${index}.description`"
              :rules="rules.description"
            >
              <div class="flex-wrap">
                <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model.trim="item.description" placeholder="请输入选项内容" maxlength="100"></el-input>
                <el-button
                  v-if="index!=0&&index!==1"
                  @click="delectoption(index)"
                  size="small"
                  class="remove vlt-delete-more"
                  :id="$route.name + '-' + 'delete'"
                  type=""
                >删除</el-button>
              </div>
            </el-form-item>
            <el-form-item label prop="optionB" class="add">
              <el-button
                type="text"
                size="medium"
                class="text- vlt-add-more"
                @click="addOption"
                :id="$route.name + '-' + 'addOption'"
              >+ 添加选项</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel" v-if="nowStatus!=2" :id="$route.name + '-' + 'cancel'">取 消</el-button>
          <el-button
            type="primary"
            @click="send"
            v-if="nowStatus!=2"
            :id="$route.name + '-' + 'submit'"
          >提 交</el-button>
          <el-button
            type="primary"
            @click="close"
            v-if="nowStatus==2"
            :id="$route.name + '-' + 'close'"
          >关 闭</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "",
  data() {
    return {
      form: {
        subjectType: null,
        optionsList: [{ description: "" }, { description: "" }],
        categoryId: null,
        subject: null
      },
      rule: {
        subjectType: [
          {
            required: true,
            message: "请选择题目类型",
            trigger: ["change", "blur"]
          }
        ],
        categoryId: [
          {
            required: true,
            message: "请选择题目分类",
            trigger: ["change", "blur"]
          }
        ],
        subject: [
          { required: true, validator: this.$rules.checkName, title:  "题目名称", trigger: ["change", "blur"] }
        ],
        optionsList: [
          {
            required: true,
            message: "请输入活动名称",
            trigger: ["change", "blur"]
          }
        ]
      },
      rules: {
        description: [
          {
            required: true,
            message: "选项内容不能为空",
            trigger: ["change", "blur"]
          }
        ]
      },

      nowStatus: 0,
      value: "",
      page: 0,
      searchForm: {},
      list: [],
      selsctId: "",
      subjectNo: "",
      option: "",
      pageSize: 20,
      current: 0,
      num: 0,
      dialogFormVisible: false,
      // rules: [],
      //表格数据
      tableData: [],
      type: [{ label: "单选题", value: 1 }, { label: "多选题", value: 2 }],
      classify: [],
      //新增数据
      // questionBankOptions: [
      //   { name: "新建题目", type: "primary", icon: "plus", id: 1 ,permission:"questionnaireBank-add"},
      //   { name: "下载模板", type: "primary", icon: "plus", id: 1 ,permission:"questionnaireBank-add"},
      //   { name: "导入题目", type: "primary", icon: "plus", id: 2 ,permission:"questionnaireBank-add"}
      // ],
      //搜索数据
      options: [
        {
          title: "题目类型",
          type: "select",
          prop: "subjectType",
          value: "",
          placeholder: "请输入",
          options: [
            { label: "单选题", value: 1 },
            { label: "多选题", value: 2 }
          ]
        },
        {
          title: "题目分类",
          type: "select",
          prop: "categoryId",
          value: "",
          placeholder: "请输入",
          options: []
        },
        {
          title: "题号",
          type: "input",
          prop: "subjectNo",
          value: ""
        },
        {
          title: "题目",
          type: "input",
          prop: "subject",
          value: ""
        },
      ]
    };
  },
  created() {
    this.objectClassify();
    this.init();
    // this.$set(this.rules, `optionsList.0.projec`, [
    //   { required: true, message: "请输入活动名称", trigger: "blur" }
    // ]);
  },
  methods: {
    async init(val) {
      let data = {
        page: val || 1,
        pageSize: this.pageSize,
        param: {
          ...this.searchForm
        }
      };
      let result = await this.$api.questionnaireQuestionBankList({ data });
      console.log(result);
      if (result && result.code === 0) {
        this.num = result.data.total;
        this.tableData = result.data.records;
        this.page = result.data.current;
      }

      let res = await this.$api.questionnaireQuestionBankClassify();
      if (res && res.code === 0) {
        this.options[1].options = res.data.map(item => {
          return {
            label: item.subjectCategory,
            value: item.id
          };
        });
      }
    },
    //题目分类数据
    async objectClassify() {
      let result = await this.$api.questionnaireQuestionBankClassify();
      if (result && result.code === 0) {
        this.classify = result.data.map(item => {
          return {
            label: item.subjectCategory,
            value: item.id
          };
        });
      }

      console.log(this.classify);
    },
    addOption() {
      let obj = { description: "" };
      console.log(this.form, "ruleForm");
      if (this.form.optionsList.length >= 10) {
        this.$message.warning("不能超过10条选项！");
      } else {
        this.form.optionsList.push(obj);
      }
    },
    search(val) {
      this.searchForm = {
        ...val
      };
      this.init();
      console.log(val);
    },
    closeDialog() {
      this.$refs.formName.resetFields();
    },
    //下载模板
    async download() {
      let result = await this.$api.questiondownload({ responseType: "blob" });
      console.log(result);
      var blob = new Blob([result.blob], {
        type: "application/vnd.ms-excel;charset=utf-8"
      });
      var url = window.URL.createObjectURL(blob);
      var aLink = document.createElement("a");
      aLink.style.display = "none";
      aLink.href = url;
      aLink.setAttribute("download", "题库模板.xls");
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
    },
    selectBtn() {
      //新增
      this.nowStatus = 0;
      this.dialogFormVisible = true;
      this.form.subjectType = null;
      this.form.optionsList = [{ description: "" }, {description: ""}];
      this.form.categoryId = null;
      this.form.subject = null;
    },
    handleAvatarSuccess() {},
    //导入
    async uploadFileImg(files) {
      let formData = new FormData();
      formData.append("file", files.file);
      console.log(formData, files.file);
      let res = await this.$api.importQuestionnaireQuestionBank({
        message: "导入成功",
        timeout: 99999999999999,
        data: formData,
        onUploadProgress(evt) {
          console.log("上传进度事件:", evt);
        }
      });
      if (res && res.code === 0) {
        this.init();
      }
    },
    //删除选项
    delectoption(val) {
      let arr = this.form.optionsList.filter((item, i) => val != i);
      this.form.optionsList = arr;
    },
    changeNumber(val) {
      let option = {
        0: "一",
        1: "二",
        2: "三",
        3: "四",
        4: "五",
        5: "六",
        6: "七",
        7: "八",
        8: "九",
        9: "十"
      };
      return option[val];
    },
    changeNumbers(val) {
      let option = {
        0: "A",
        1: "B",
        2: "C",
        3: "D",
        4: "E",
        5: "F",
        6: "G",
        7: "H",
        8: "I",
        9: "J"
      };
      return option[val];
    },
    //表单取消
    cancel() {
      console.log(this);
      this.$refs.formName.resetFields();
      this.dialogFormVisible = false;
    },

    // 表单提交
    send() {
      let arr = [];
      for (let item of this.form.optionsList) {
        if (arr.find(i => i.description == item.description)) {
          this.$message.warning("题目选项不能相同");
          return;
        }
        arr.push(item);
      }
      this.$refs.formName.validate(async valid => {
        if (valid) {
          if (this.nowStatus === 1) {
            let list = this.form.optionsList.map(item => {
              return {
                optionsContent: item.optionsContent,
                description: item.description,
                optionsId: item.optionsId
              };
            });
            console.log(list);
            list.forEach((item, index) => {
              item.optionsContent = this.changeNumbers(Number(index));
            });
            // console.log(list);
            this.form.optionsList = list;
            // console.log( this.form, this.tableData);
            // this.tableData.forEach(item => {
            //   if (item.categoryId) {
            //     console.log(item.categoryId);
            //     this.form.categoryId = item.categoryId;
            //   }
            // });

            this.form = {
              ...this.form,
              id: this.selsctId,
              subjectNo: this.subjectNo
            };
            console.log(this.form);

            let data = {
              ...this.form
            };
            let res = await this.$api.questionnaireQuestionBankUpdate({
              message: "修改成功",
              data
            });
            if (res && res.code === 0) {
              this.dialogFormVisible = false;
              this.init();
              console.log(res);
            }
          } else if (this.nowStatus === 0) {
            this.form.optionsList.forEach((item, index) => {
              item.optionsContent = this.changeNumbers(Number(index));
            });
            console.log(this.form);

            let data = {
              ...this.form
            };
            console.log(data);
            let result = await this.$api.questionnaireQuestionBankAdd({
              message: "新增成功",
              data
            });
            console.log(result);
            if (result && result.code === 0) {
              this.dialogFormVisible = false;
              this.init();
            }
          }
        }
      });
    },
    pageSizeChange(size) {
      this.page = 1;
      this.pageSize = size;
      this.init();
    },
    pageCurrentChange(val) {
      this.page = val;
      this.init(val);
    },
    WritedialogchangeForm(val) {
      console.log(val);
    },
    //弹窗关闭
    close() {
      this.dialogFormVisible = false;
      this.init();
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
    //表单回填
    backfillForm(val) {
      for (let key in this.form) {
        this.form[key] = val[key];
      }
      console.log(val);
      // if (val.subjectCategory) {
      //   console.log(val.subjectCategory);
      //   this.form.categoryId = val.subjectCategory;
      // }
      this.form.optionsList = val.optionsList;
      val.optionsList &&
        val.optionsList.forEach((item, index) => {
          this.form.optionsList &&
            this.form.optionsList.forEach((i, j) => {
              if (index == j) {
                i.description = item.description;
              }
            });
        });
    },
    //编辑
    edit(val) {
      let str = JSON.parse(JSON.stringify(val));
      this.selsctId = str.id;
      this.subjectNo = str.subjectNo;
      this.nowStatus = 1;
      this.backfillForm(str);
      this.dialogFormVisible = true;
    },
    //查看
    async Detail(val) {
      this.nowStatus = 2;
      this.backfillForm(val);
      this.dialogFormVisible = true;
    }
  }
};
</script>

<style lang="less" scoped>
.questionBank {
  .el-form-item__content {
    display: flex;
  }
  .text-btn {
    width: 80px;
    height: 30px;
    line-height: 1px;
    border: 1px dashed #ccc;
  }
  .el-upload-list--text {
    display: flex !important;
  }
  .el-upload-list__item {
    margin-top: 0;
  }
}
.flex-wrap{
  display: flex;
  .remove{
    position: absolute;
    top: 0;
    right: -70px;
    z-index: 1;
    padding: 12px 15px;
  }
}
</style>
