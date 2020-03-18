<template>
  <div class="vlt-card">
    <section class="comp-item">
      <search-bar
        :showHandler="true"
        ref="searchForm"
        class="search-bar-demo"
        @search="search"
        :options="searchOptions"
        :total="totalCount"
        labelWidth="80px"
      >
        <control-bar
          @select="selectBtn"
          slot="extend-bar"
          :options="controlOptions"
          position="left"
        ></control-bar>
      </search-bar>
    </section>
    <div class="tab-container">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        :header-cell-style="{background:'rgba(240,240,240,.5)'}"
        :cell-style="{align:'center'}"
        @cell-click="clicks"
      >
        <el-table-column align="center" fixed label="序号" width="65">
          <template slot-scope="scope">
            <div style="text-align:center;">{{scope.$index+1}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="insName" width="180" label="区域名称"></el-table-column>
        <el-table-column align="center" prop="source" label="告警源" width="80"></el-table-column>
        <el-table-column
          align="center"
          prop="describe"
          min-width="180px"
          label="告警描述"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column align="center" prop="alarmLevel" width="80" label="告警等级">
          <template slot-scope="scope">
            <span v-if="scope.row.alarmLevel==0">Ⅲ级</span>
            <span v-if="scope.row.alarmLevel==1">Ⅱ级</span>
            <span v-if="scope.row.alarmLevel==2">Ⅰ级</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="alarmCount" width="80" label="告警次数"></el-table-column>
        <el-table-column align="center" prop="lastAlarmTime" width="160" label="最新告警时间"></el-table-column>
        <el-table-column align="center" prop="alarmDuration" width="180" label="告警历时"></el-table-column>
        <el-table-column align="center" prop="notificationStatus" width="80" label="通知状态">
          <template slot-scope="scope">
            <span v-if="scope.row.notificationStatus==0">未通知</span>
            <span v-if="scope.row.notificationStatus==1">已通知</span>
            <span v-if="scope.row.notificationStatus==2">通知失败</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="processingStatus" width="80" label="处理状态">
          <template slot-scope="scope">
            <span v-if="scope.row.processingStatus==0">未处理</span>
            <span v-if="scope.row.processingStatus==1">处理中</span>
            <span v-if="scope.row.processingStatus==2">已处理</span>
          </template>
        </el-table-column>
        <el-table-column
          class-name="peripheralStatus"
          label="操作"
          fixed="right"
          width="80px"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.processingStatus==2">详情</span>
            <span v-else>办理</span>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="告警处理" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
        <el-form :model="form" ref="form" :rules="rules">
          <el-form-item label="告警源" :label-width="formLabelWidth">
            <el-input v-model="form.source" disabled autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="告警描述" :label-width="formLabelWidth">
            <el-input v-model="form.describe" disabled autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="警报等级" :label-width="formLabelWidth">
            <el-input v-model="form.alarm" disabled autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="工作流" :label-width="formLabelWidth">
            <span
              :class="(form.processingStatus!==2&&form.workflowStatus===0)?'peripheralStatus':''"
              @click="touchWorkflow"
            >发起</span>
          </el-form-item>
          <el-form-item label="处理意见" prop="suggestContent" :label-width="formLabelWidth">
            <el-input
              show-word-limit
              maxlength="50"
              v-model="form.suggestContent"
              :disabled="form.processingStatus==2?true:false"
              type="textarea"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" v-show="form.processingStatus!=2" @click="warnInfoDispose(1)">保存</el-button>
          <el-button type="primary" v-show="form.processingStatus!=2" @click="warnInfoDispose(2)">处理</el-button>
        </div>
      </el-dialog>
      <table-paging
        :current-page="listQuery.pageNum"
        :page-size="20"
        :total="totalCount"
        @handleSizeChange="pageSizeChange"
        @handleCurrentChange="pageCurrentChange"
      ></table-paging>
    </div>
  </div>
</template>

<script>
import storage from "@/utils/storage";
import moment from "moment";
export default {
  name: "warningWatch",
  data() {
    const self = this;
    return {
      timeName: null,
      totalCount: 0,
      dialogFormVisible: false,
      form: {},
      formLabelWidth: "80px",
      searchOptions: [
        {
          type: "cascader",
          prop: "insId",
          value: "",
          title: "所在区域",
          options: [],
          setProps: { value: "id", label: "text", checkStrictly: true }
        },
        {
          type: "datetime-range",
          prop: "timeList",
          value: [new Date() - 3600 * 1000 * 24, new Date()],
          title: "时间选择",
          placeholder: ["开始时间", "结束时间"],
          pickerOptions: {
            disabledDate(time) {
              const minTime = 31 * 24 * 3600 * 1000;
              let endTime = Date.now();
              return (
                time.getTime() > endTime || time.getTime() < endTime - minTime
              );
            }
          },
          change(val) {
            self.chooseTimeList(val);
          }
        },
        {
          type: "select",
          prop: "source",
          value: "",
          title: "告警源",
          placeholder: "请选择",
          options: [
            {
              label: "奖池风险",
              value: "奖池风险"
            },
            {
              label: "游戏风险",
              value: "游戏风险"
            },
            {
              label: "金额风险",
              value: "金额风险"
            },
            {
              label: "账户风险",
              value: "账户风险"
            },
            {
              label: "数量风险",
              value: "数量风险"
            },
            {
              label: "用户风险",
              value: "用户风险"
            }
          ]
        },
        {
          type: "select",
          prop: "alarmLevel",
          value: "",
          title: "告警等级",
          placeholder: "请选择",
          options: [
            {
              label: "Ⅲ级",
              value: 0
            },
            {
              label: "Ⅱ级",
              value: 1
            },
            {
              label: "Ⅰ级 ",
              value: 2
            }
          ]
        },
        {
          type: "select",
          prop: "processingStatus",
          value: "",
          title: "处理状态",
          placeholder: "请选择",
          options: [
            {
              label: "未处理",
              value: 0
            },
            {
              label: "处理中",
              value: 1
            },
            {
              label: "已处理",
              value: 2
            }
          ]
        },
        {
          type: "select",
          prop: "timeRange",
          value: "",
          title: "时间范围",
          placeholder: "请选择",
          change(val) {
            self.chooseTimeRange(val);
          },
          options: [
            {
              label: "15分钟",
              value: 1
            },
            {
              label: "30分钟",
              value: 2
            },
            {
              label: "1小时",
              value: 3
            },
            {
              label: "6小时",
              value: 6
            },
            {
              label: "12小时",
              value: 7
            },
            {
              label: "1天",
              value: 8
            },
            {
              label: "1周",
              value: 10
            }
          ]
        }
      ],
      controlOptions: [
        {
          name: "导出",
          type: "primary",
          icon: "download",
          permission: "warningWatch-export"
        }
      ],
      cityList: [],
      datacityList: [],
      timeMinite: null,
      countryList: [],
      datacountryList: [],
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        param: {}
      },
      tableData: [],
      rules: {
        suggestContent: [
          {
            required: true,
            message: "请输入处理意见",
            trigger: ["blur", "change"]
          }
        ]
      }
    };
  },
  methods: {
    //30s定时刷新表格数据
    timer() {
      this.timeName = setInterval(v => {
        this.getWarniingList();
      }, 30000);
    },
    //导出
    async exportExcel() {
      const res = await this.$api.alarmExport({
        data: {
          param: {
            exportStatus: 1
          }
        },
        responseType: "blob"
      });
      var blob = new Blob([res.blob], {
        type: "application/vnd.ms-excel;charset=utf-8"
      });
      var url = window.URL.createObjectURL(blob);
      var aLink = document.createElement("a");
      aLink.style.display = "none";
      aLink.href = url;
      aLink.setAttribute("download", "告警监控信息.xls");
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
      console.log(res);
    },
    //导出按钮
    selectBtn(val) {
      if (val.name === "导出") {
        this.exportExcel();
      }
    },
    //清空时间范围
    chooseTimeList(val) {
      if (val) {
        this.$refs.searchForm.form["timeRange"] = "";
      }
    },
    //清空时间段
    chooseTimeRange(val) {
      if (val) {
        this.$refs.searchForm.form["timeList"] = "";
      }
    },
    //告警监控列表
    async getWarniingList(type) {
      let res = await this.$api.getWarniingList({
        data: this.listQuery,
        closeLoading: type !== 1
      });
      if (res && res.code == 0) {
        this.tableData = res.data.records;
        this.totalCount = res.data.total;
      }
    },
    //机构树
    async queryInsTree() {
      let res = await this.$api.queryInsTree();
      if (res && res.code == 0) {
        this.setLabelAndValue(res.data);
      }
    },
    setLabelAndValue(area) {
      area.forEach(v => {
        if (v.children) {
          this.setLabelAndValue(v.children);
        }
      });
      this.searchOptions.forEach(v => {
        if (v.type === "cascader") {
          v.options = area;
        }
      });
    },
    //页数改变事件
    pageSizeChange(pageSize) {
      this.listQuery.pageSize = pageSize;
      this.listQuery.pageNum = 1;
      this.getWarniingList(1);
    },
    //页码改变事件
    pageCurrentChange(currentPage) {
      this.listQuery.pageNum = currentPage;
      this.getWarniingList(1);
    },
    //计算多少分钟
    getMinite(timeRange) {
      this.timeMinite = "";
      if (timeRange) {
        this.searchOptions.forEach(v => {
          if (v.prop == "timeRange") {
            v.options.forEach(s => {
              if (s.value == timeRange) {
                this.timeMinite = s.label;
              }
            });
          }
        });
        if (this.timeMinite.indexOf("天") != -1) {
          this.timeMinite = parseInt(this.timeMinite) * 24 * 60;
        } else if (this.timeMinite.indexOf("小时") != -1) {
          this.timeMinite = parseInt(this.timeMinite) * 60;
        } else if (this.timeMinite.indexOf("周") != -1) {
          this.timeMinite = parseInt(this.timeMinite) * 24 * 60 * 7;
        } else {
          this.timeMinite = parseInt(this.timeMinite);
        }
      }
    },
    //查询
    search(form) {
      this.listQuery.pageNum = 1;
      this.getMinite(form.timeRange);
      this.listQuery.param = {
        source: form.source,
        processingStatus: form.processingStatus,
        alarmLevel: form.alarmLevel,
        timeRange: this.timeMinite,
        timeStart: form.timeList
          ? moment(form.timeList[0]).format("YYYY-MM-DD HH:mm:ss")
          : "",
        timeEnd: form.timeList
          ? moment(form.timeList[1]).format("YYYY-MM-DD HH:mm:ss")
          : "",
        insId: form.insId ? form.insId[form.insId.length - 1] : ""
      };
      this.getWarniingList(this.listQuery);
    },
    //表格操作一列点击
    clicks(row, column, cell, event) {
      this.gridData = [];
      if (column.label == "操作") {
        this.dialogFormVisible = true;
        console.log(row);
        this.form = row;
        if (this.form.alarmLevel == 0) {
          this.form.alarm = "Ⅲ级";
        } else if (this.form.alarmLevel == 1) {
          this.form.alarm = "Ⅱ级";
        } else {
          this.form.alarm = "Ⅰ级";
        }
      }
    },
    //type:1 保存 2:处理
    warnInfoDispose(type) {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let res = await this.$api.warnInfoDispose({
            data: {
              id: this.form.id,
              suggestContent: this.form.suggestContent,
              processingStatus: type
            }
          });
          if (res && res.code == 0) {
            if (type == 1) {
              this.$message({
                message: "保存成功",
                type: "success"
              });
            } else {
              this.$message({
                message: "处理成功",
                type: "success"
              });
            }
            this.dialogFormVisible = false;
            this.getWarniingList(1);
          }
        }
      });
    },
    //发起工作流
    async touchWorkflow(type) {
      if (this.form.processingStatus == 2 || this.form.workflowStatus !== 0)
        return;
      let res = await this.$api.touchWorkflow({
        data: {
          id: this.form.id
        }
      });
      if (res && res.code == 0) {
        console.log(res);
        this.$message({
          message: "发起成功",
          type: "success"
        });
        this.form.workflowStatus = 2;
      }
    },
    //处理从告警报表带来的参数
    fromWarningReportParameters() {
      try {
        var row = storage.session.get("waringInfo");
        var timeList = storage.session.get("timeObj");
      } catch {
        var row = null;
        var timeList = null;
      }
      if (row) {
        this.listQuery.param.insId = row.insId;
        this.listQuery.param.source = row.source;
        this.listQuery.param.alarmLevel = row.alarmLevel;
        this.$refs.searchForm.form["insId"] = [Number(row.insId)];
        this.$refs.searchForm.form["source"] = row.source;
        this.$refs.searchForm.form["alarmLevel"] = row.alarmLevel;
        if (row.deal) {
          this.$refs.searchForm.form["processingStatus"] = 2;
          this.listQuery.param.processingStatus = 2;
        }
        if (timeList) {
          this.$refs.searchForm.form["timeList"] = [
            timeList.timeStart,
            timeList.timeEnd
          ];
          this.listQuery.param.timeStart = timeList.timeStart;
          this.listQuery.param.timeEnd = timeList.timeEnd;
        }
      } else {
        this.listQuery.param.timeStart = moment(
          new Date() - 3600 * 1000 * 24
        ).format("YYYY-MM-DD HH:mm:ss");
        this.listQuery.param.timeEnd = moment(new Date()).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      }
    }
  },
  mounted() {
    this.timer();
    this.queryInsTree();
    this.getWarniingList(1);
  },
  beforeDestroy() {
    //清除定时器
    clearInterval(this.timeName);
    this.timeName = null;
    //移除浏览器存储的告警对象参数和时间
    storage.session.remove("waringInfo");
    storage.session.remove("timeObj");
  }
};
</script>

<style  lang="less" scoped>
.main-body .el-table {
  /deep/ td.peripheralStatus > .cell {
    color: blue;
    cursor: pointer;
  }
}
.peripheralStatus {
  color: blue;
  cursor: pointer;
}
/deep/ .search-bar-comp {
  .el-date-editor--datetimerange {
    width: 325px;
  }
}

/deep/ .el-dialog {
  // display: flex;
  // flex-direction: column;
  // margin: 0 !important;
  // position: absolute;
  // top: 50%;
  // left: 50%;
  // transform: translate(-50%, -50%);
  /*height:600px;*/
  // max-height: calc(100% - 30px);
  // max-width: calc(100% - 30px);
  width: 30%;
  .el-input,
  .el-textarea {
    width: 90%;
  }
  .el-textarea .el-textarea__inner {
    min-height: 90px !important;
  }
}
/deep/.el-table td,
.el-table th {
  padding: 8px 0;
}
// /deep/ .el-dialog .el-dialog__body {
//   flex: 1;
//   overflow: auto;
// }
</style>
