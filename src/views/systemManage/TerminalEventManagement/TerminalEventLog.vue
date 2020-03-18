<template>
  <div class="vlt-card">
    <div class="TerminSearch">
      <search-bar
        class="search-bar-demo"
        @search="search"
        :options="searchOptions"
        :total="999"
        labelWidth="6.5em"
      >
        <control-bar slot="extend-bar" @select="selectBtn" :options="controlOptions"></control-bar>
      </search-bar>
    </div>
    <div class="TerminTabel">
      <el-table :data="tableData" border style="width: 100%; margin-top: 10px;">
        <el-table-column type="index" prop="date" label="序号"></el-table-column>
        <el-table-column prop="province" label="省名"></el-table-column>
        <el-table-column prop="salesNumbers" label="销售厅编号"></el-table-column>
        <el-table-column prop="salesName" label="销售厅名称"></el-table-column>
        <el-table-column prop="terminalType" label="终端类型"></el-table-column>
        <el-table-column prop="terminalNumbers" label="设备序列号"></el-table-column>
        <el-table-column prop="occurTime" label="发生时间"></el-table-column>
        <el-table-column prop="incidentType" label="事件内容"></el-table-column>
      </el-table>
      <div class="pagintion">
        <table-paging
          :current-page="1"
          :page-size="10"
          :total="100"
          @handleSizeChange="pageSizeChange"
          @handleCurrentChange="pageCurrentChange"
        ></table-paging>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "",
  data() {
    return {
      searchOptions: [
        {
          title: "终端类型",
          type: "select",
          prop: "terminalType",
          value: "",
          options: [
            {
              label: "选项1",
              value: 1
            },
            {
              label: "选项2",
              value: 2
            }
          ]
        },
        {
          title: "事件时间",
          type: "datetime-range",
          prop: "incidentTime",
          value: "",
          options: ["start", "end"]
        },
        {
          title: "所属省份",
          type: "select",
          prop: "subtoProvince",
          value: "",
          options: [
            {
              label: "选项1",
              value: 1
            },
            {
              label: "选项2",
              value: 2
            }
          ]
        },
        {
          title: "销售厅编号",
          type: "input",
          prop: "salesNumbers",
          value: ""
        },
        {
          title: "终端编号",
          type: "input",
          prop: "terminalNumbers",
          value: ""
        }
      ],
      tableData: [
        {
          province: "河北",
          salesNumbers: 114110,
          salesName: "西四胡同",
          terminalType: "游戏机",
          terminalNumbers: "1151330",
          occurTime: "2012-03-05 14:21:00",
          incidentType: "注销账户",
          executeResult: "成功"
        },
        {
          province: "河北",
          salesNumbers: 114110,
          salesName: "西四胡同",
          terminalType: "游戏机",
          terminalNumbers: "1151330",
          occurTime: "2012-03-05 14:21:00",
          incidentType: "注销账户",
          executeResult: "成功"
        },
        {
          province: "河北",
          salesNumbers: 114110,
          salesName: "西四胡同",
          terminalType: "游戏机",
          terminalNumbers: "1151330",
          occurTime: "2012-03-05 14:21:00",
          incidentType: "注销账户",
          executeResult: "成功"
        },
        {
          province: "河北",
          salesNumbers: 114110,
          salesName: "西四胡同",
          terminalType: "游戏机",
          terminalNumbers: "1151330",
          occurTime: "2012-03-05 14:21:00",
          incidentType: "注销账户",
          executeResult: "成功"
        },
        {
          province: "河北",
          salesNumbers: 114110,
          salesName: "西四胡同",
          terminalType: "游戏机",
          terminalNumbers: "1151330",
          occurTime: "2012-03-05 14:21:00",
          incidentType: "注销账户",
          executeResult: "成功"
        },
        {
          province: "河北",
          salesNumbers: 114110,
          salesName: "西四胡同",
          terminalType: "游戏机",
          terminalNumbers: "1151330",
          occurTime: "2012-03-05 14:21:00",
          incidentType: "注销账户",
          executeResult: "成功"
        },
        {
          province: "河北",
          salesNumbers: 114110,
          salesName: "西四胡同",
          terminalType: "游戏机",
          terminalNumbers: "1151330",
          occurTime: "2012-03-05 14:21:00",
          incidentType: "注销账户",
          executeResult: "成功"
        },
        {
          province: "河北",
          salesNumbers: 114110,
          salesName: "西四胡同",
          terminalType: "游戏机",
          terminalNumbers: "1151330",
          occurTime: "2012-03-05 14:21:00",
          incidentType: "注销账户",
          executeResult: "成功"
        },
        {
          province: "河北",
          salesNumbers: 114110,
          salesName: "西四胡同",
          terminalType: "游戏机",
          terminalNumbers: "1151330",
          occurTime: "2012-03-05 14:21:00",
          incidentType: "注销账户",
          executeResult: "成功"
        },
        {
          province: "河北",
          salesNumbers: 114110,
          salesName: "西四胡同",
          terminalType: "游戏机",
          terminalNumbers: "1151330",
          occurTime: "2012-03-05 14:21:00",
          incidentType: "注销账户",
          executeResult: "成功"
        }
      ],
      controlOptions: [
        { name: "导出", type: "primary", icon: "s-promotion" },
        { name: "打印", type: "", icon: "printer" }
      ],
      requestData: {
        page: 1,
        pageSize: 20,
        param: {}
      },
      responseData: {}
    };
  },
  components: {},
  created() {
    this.getList(this.requestData);
  },
  methods: {
    getList(data) {
      const _this = this;
      (async data => {
        let res = await _this.$api.queryTerminalExecuteByPage({ data });
        // console.log(res);
        if (res.code == 0) {
          if (res.data != null) {
            _this.responseData = res.data;
            _this.responseData.records &&
              _this.responseData.records.forEach(item => {
                if (item.sendTime) {
                  item.sendTime = moment(item.sendTime).format(
                    "YYYY-MM-DD HH:mm:SS"
                  );
                }
              });
          } else {
            _this.responseData = {};
          }
        }
      })(data);
    },
    search() {}, //搜索按钮
    pageSizeChange(val) {
      //每页显示条数
      console.log(val);
    },
    selectBtn(val) {
      //点击按钮类型
      if (val.name === "发送") {
        this.dialogFormVisible = true;
      }

      console.log(val);
    },
    pageCurrentChange(val) {
      //当前显示页数
      console.log(val);
    }
  }
};
</script>

<style lang="less" scoped>
</style>

