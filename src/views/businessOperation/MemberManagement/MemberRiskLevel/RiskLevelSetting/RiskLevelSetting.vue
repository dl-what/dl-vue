<template>
  <div class="vlt-card">
    <section class="comp-item">
      <search-bar
        class="search-bar-demo"
        @search="search"
        :options="searchOptions"
        :total="total"
        labelWidth="7em"
      >
        <control-bar
          slot="extend-bar"
          @select="selectBtn"
          :options="controlOptions"
          position="left"
        ></control-bar>
      </search-bar>
    </section>
    <el-table
      ref="tabel"
      :data="tableData"
      tooltip-effect="dark"
      @selection-change="selectionChange"
      border
    >
      <el-table-column type="index" label="序号" width="60" fixed>
        <template slot-scope="scope">{{pageSize*(page-1)+(scope.$index+1)}}</template>
      </el-table-column>
      <el-table-column prop="riskLevelStr" label="风险等级" min-width="140" show-overflow-tooltip></el-table-column>
      <el-table-column prop="levelName" label="风险等级名称" min-width="140"></el-table-column>
      <el-table-column prop="thresholdValue" label="风险等级阈值" min-width="140"></el-table-column>
      <el-table-column prop="featuresDescribe" label="特征描述" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column prop="handles" label="操作" fixed="right" min-width="130">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handlerChange(scope.row)"
            :id="$route.name+'-edit'+scope.$index"
            v-has="'RiskLevelSetting-edit'"
          >编辑</el-button>
          <el-button
            type
            size="mini"
            :id="$route.name+'-delect'+scope.$index"
            :disabled="scope.row.riskLevelId != nowLevel"
            @click="LevelDelect(scope.row,scope.$index)"
            v-has="'RiskLevelSetting-delect'"
          >删除</el-button>
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
      :title="handlerStatus?'新建等级':'编辑等级'"
      :visible.sync="dialogVisible"
      width="50%"
      custom-class="setting_dialog"
      :close-on-click-modal="false"
    >
      <div class="vlt-edit-wrap">
        <div class="vlt-edit-single">
          <base-form
            :formData="data2"
            labelWidth="110px"
            ref="baseForm"
            :rules="rules2"
            direction="right"
            @change="changeForm"
          ></base-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cencel" size="medium" :id="$route.name+'-create-Level-cencel'">取 消</el-button>
            <el-button
              type="primary"
              size="medium"
              @click="settingSubmit"
              :id="$route.name+'-create-Level-enter'"
            >确 定</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import rules from "@/utils/rules";
export default {
  name: "",
  data() {
    return {
      searchOptions: [
        { title: "风险等级名称", type: "input", prop: "levelName", value: "" },
        {
          title: "风险等级",
          type: "select",
          prop: "riskLevel",
          value: "",
          options: []
        },
        
      ],
      controlOptions: [
        {
          name: "新建等级",
          type: "primary",
          icon: "plus",
          permission: "RiskLevelSetting-create"
        }
      ],
      tableData: [],
      data2: [
        {
          type: "input",
          title: "风险级别",
          prop: "riskLevelStr",
          value: "",
          disabled: true
        },
        { type: "input", title: "风险等级名称", prop: "levelName", value: "",maxlength:15 },
        {
          type: "input",
          title: "风险等级阈值",
          prop: "thresholdValue",
          value: "",
          maxlength: "3"
        },
        {
          type: "textarea",
          title: "特征描述",
          prop: "featuresDescribe",
          value: "",
          maxlength: "150"
        }
      ],
      rules2: {
        levelName: [
          {
            required: true,
            message: "风险等级名称不能为空",
            trigger: ["blur"]
          },
          {
            min: 2,
            max: 15,
            message: "长度在 2 到 15 个字符",
            trigger: ["blur"]
          },
          {
            required: true,
            pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9.·-]+$/,
            message: "方案名称不支持特殊字符",
            trigger: ["blur"]
          }
        ],
        thresholdValue: [
          {
            required: true,
            message: "风险等级阈值不能为空",
            trigger: ["blur"]
          },
          {
            required: true,
            pattern: /^[0-9.·-]+$/,
            message: "方案名称不支持汉字、字母及其它特殊字符",
            trigger: ["blur"]
          }
        ],
        featuresDescribe: [
          {
            required: true,
            message: "特征描述不能为空",
            trigger: ["blur"]
          }
        ]
      },
      dialogVisible: false,
      page: 1,
      pageSize: 10,
      total: 0,
      searchForm: {},
      param: {},
      handlerStatus: 1,
      scopeRow: {},
      riskLevels: null,
      current: 1,
      nowLevel: null
    };
  },
  components: {},
  created() {
    this.init();
    this.searchOption();
  },
  methods: {
    init(val) {
      const self = this;
      (async val => {
        let data = {
          page: val || 1,
          pageSize: this.pageSize,
          param: {
            ...this.searchForm
          }
        };
        let res = await this.$api.returnMaxLevel();
        if (res && res.code === 0) {
          this.nowLevel = res.data.riskLevelId;
        }
        let reslut = await self.$api.memberRiskLevelPage({ data });
        if (reslut && reslut.code === 0) {
          this.tableData = reslut.data.records;
          this.page = reslut.data.current;
          this.total = reslut.data.total;
          // this.riskLevel()
        }
      })(val);
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    cencel() {
      this.dialogVisible = false;
    },
    searchOption() {
      (async () => {
        let res = await this.$api.riskLevelTree();
        if (res && res.code === 0) {
          let option = res.data.map(item => {
            return { label: item.riskLevelStr, value: item.riskLevel };
          });
          this.$set(this.searchOptions[1], 'options', option);
          // this.searchOptions[1].options = option;
        }
      })();
    },
    riskLevel() {
      const self = this;
      (async () => {
        let res = await self.$api.returnLevel();
        if (res && res.code === 0) {
          console.log('风险等级',res.data);
          this.riskLevels = res.data.riskLevel;
          this.data2[0].value = res.data.riskLevelStr;
        }
      })();
    },
    LevelDelect(row, index) {
      this.$confirm("请确认是否删除此等级信息！", "确认信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          (async () => {
            let data = {
              riskLevelId: row.riskLevelId
            };
            let res = await this.$api.memberRiskLevelDeleteLevel({
              message: "删除等级成功",
              data
            });
            if (res && res.code === 0) {
              this.init();
            }
          })();
        })
        .catch(action => {
          this.$message({
            type: "info",
            message: action === "cancel" ? "取消删除" : ""
          });
        });
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.init();
    },
    handleCurrentChange(page) {
      this.current = page;
      this.init(page);
    },
    selectBtn(val) {
      switch (val.name) {
        case "新建等级":
          this.clearForm();
          this.riskLevel();
          this.handlerStatus = 1;
          this.dialogVisible = true;
          break;

        default:
          break;
      }
    },
    search(val) {
      this.searchForm = { ...val };
      this.init();
    },
    handlerChange(val) {
      this.scopeRow = val;
      this.handlerStatus = 0;
      this.dialogVisible = true;
      this.backfillForm(val);
    },
    clearForm() {
      this.data2.forEach(item => {
        item.value = "";
      });
    },
    backfillForm(val) {
      this.data2.forEach(item => {
        item.value = val[item.prop];
      });
    },
    selectionChange() {},
    changeForm(val) {
      this.param = { ...val };
    },
    settingSubmit() {
      this.$refs["baseForm"].validate(valid => {
        if (valid) {
          if (this.handlerStatus) {
            (async () => {
              let data = {
                ...this.param
              };
              data.riskLevel = this.riskLevels;
              let res = await this.$api.memberRiskLevelCreate({
                message: "新建成功",
                data
              });
              if (res && res.code === 0) {
                this.init();
                this.dialogVisible = false;
              }
            })();
          } else {
            (async () => {
              let data = {
                ...this.param,
                riskLevelId: this.scopeRow.riskLevelId
              };
              data.riskLevel = this.scopeRow.riskLevel;
              let res = await this.$api.memberRiskLevelUpdate({
                message: "编辑成功",
                data
              });
              if (res && res.code === 0) {
                this.init(this.current);
                this.dialogVisible = false;
              }
            })();
          }
        } else {
          this.$message.error("表单验证有误，请重新输入！");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.setting_dialog {
  min-width: 600px;
  max-width: 800px;
  border-radius: 10px;
  padding-right: 20px;
}
.vlt-edit-single {
  width: 510px;
  margin: auto;
}
.dialog-footer {
  padding-top: 20px;
  text-align: right;
}
</style>
