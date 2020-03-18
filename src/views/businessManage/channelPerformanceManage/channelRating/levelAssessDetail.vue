<template>
  <div class="vlt-card assess-detail">
    <panel :show="true" title="基本信息">
      <base-info :infoList="infoList"></base-info>
      <control-bar style="margin-left:20px" @select="selectBtn" :options="controlOptions"></control-bar>

      <el-tabs v-model="activeName" @tab-click="handleClick" style="margin-left:20px">
        <el-tab-pane label="定量考核" name="1">
          <el-table border :data="tableData" ref="printOne">
            <el-table-column label="序号" type="index" width="60px">
              <template slot-scope="scope">{{pageSize*(page-1)+(scope.$index+1)}}</template>
            </el-table-column>
            <el-table-column prop="targetName" label="指标名称"></el-table-column>
            <el-table-column prop="targetCategoryName" label="考核类别"></el-table-column>
            <el-table-column prop="examineCondition" label="考核条件"></el-table-column>
            <el-table-column prop="examineScore" label="考核得分"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="定性考核" name="0">
          <el-table border :data="tableData" ref="printTwo">
            <el-table-column label="序号" type="index" width="60px">
              <template slot-scope="scope">{{pageSize*(page-1)+(scope.$index+1)}}</template>
            </el-table-column>
            <el-table-column prop="targetName" label="指标名称"></el-table-column>
            <el-table-column prop="targetCategoryName" label="考核类别"></el-table-column>
            <el-table-column prop="examineCondition" label="考核条件"></el-table-column>
            <el-table-column prop="examineScore" label="考核得分">
              <template slot-scope="scope">
                <el-input
                  maxlength="4"
                  oninput="value=value.replace(/[^0-9]/g,'')"
                  v-model.number="scope.row.examineScore"
                  :disabled="isableScore||scope.row.status===1"
                ></el-input>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <table-paging
        position="right"
        :total="total"
        :currentPage="page "
        :pageSize="pageSize"
        @handleSizeChange="pageSizeChange"
        @handleCurrentChange="pageCurrentChange"
      ></table-paging>
      <el-dialog
        title="打印预览"
        :visible.sync="isPrint"
        class="print-fullscreen"
        :fullscreen="true">
        <print :data="printData" @cancel="isPrint=false"></print>
      </el-dialog>
    </panel>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "levelAssessDetail",
  data() {
    return {
      total: null,
      page: 1,
      pageSize: 20,
      activeName: "1",
      infoList: [
        { title: "渠道编号", value: "", prop: "channelNo" },
        { title: "渠道类型", value: "", prop: "channelType" },
        { title: "所属机构", value: "", prop: "insName" },
        { title: "定性得分", value: "", prop: "quality" },
        { title: "定量得分", value: "", prop: "quantity" },
        { title: "综合得分", value: "", prop: "totalScore" },
        { title: "考核年月", value: "", prop: "examineDate" },
        { title: "渠道等级", value: "", prop: "chLevelName" }
      ],
      controlOptions: [
        {
          name: "导出当前",
          type: "primary",
          icon: "s-promotion",
          permission: "channelLevelConfig-detail"
        },
        {
          name: "导出全部",
          type: "",
          icon: "s-promotion",
          permission: "channelLevelConfig-detail"
        },
        { name: "打印", type: "", permission: "channelLevelConfig-detail",icon: "printer", }
      ],
      isPrint: false,
      printData: {
        title: '',
        params: {
          page: 1,
          pageSize: 20
        },
        props: [
          {prop: 'index', label:'序号',width: '5%'},
          {prop: 'targetName', label:'指标名称',width:'25%'},
          {prop:'targetCategoryName', label:'考核类别',width:'25%'},
          {prop:'examineCondition', label:'考核条件',width:'25%'},
          {prop:'examineScore', label:'考核得分',width:'20%'}
        ],
        tableData: [],
      },
      isableScore: true,
      tableData: [],
      examine: {}
    };
  },
  watch: {
    activeName: {
      handler(newValue, oldValue) {
        if (newValue) {
          this.isableScore = true;
          this.getExamineDetailList();
        }
      },

      deep: true
    }
  },
  created() {
    this.init();
    this.getExamineDetailList();
  },
  methods: {
    async init() {
      console.log("详11情");
      let res = await this.$api.channelExamineDetail({
        data: this.$route.query.id
      });
      if (res && res.code === 0) {
        this.examine = {
          examineYear: res.data.examineYear,
          examineMonth: res.data.examineMonth
        };
        this.infoList.forEach(item => {
          item.value = res.data[item.prop];
          if (item.prop == "examineDate") {
            item.value = res.data.examineYear + "-" + res.data.examineMonth;
          }
          if (item.prop == "channelType") {
            item.value = res.data.channelType === 0 ? "自营厅" : "合作厅";
          }
        });
      }
      console.log("详情", res.data);
    },
    //考核指标列表
    async getExamineDetailList(val) {
      let res = await this.$api.channelExamineDetailList({
        data: {
          page: val || 1,
          pageSize: this.pageSize,
          param: {
            examineType: 1,
            examineId: this.$route.query.id,
            targetType: Number(this.activeName),
            ...this.param
          }
        }
      });
      if (res && res.code === 0) {
        this.page = res.data.current;
        this.total = res.data.total;
        this.tableData = res.data.records;
        this.printData.tableData =  this.tableData;
      }
      console.log(res.data);
    },
    //导出、打印、打分控制按钮
    selectBtn(val) {
      console.log(val);
      switch (val.name) {
        case "导出当前":
          this.exportExcel(0);
          break;
        case "导出全部":
          this.exportExcel(1);
          break;
        case "打印":
          this.print();
          break;
        case "打分":
          this.controlOptions[3].name = "保存";
          this.grade();
          break;
        case "保存":
          this.save();
          this.controlOptions[3].name = "打分";
          break;
      }
    },

    //打分
    grade() {
      let isStatus = this.tableData.every(item => {
        return item.status === 1;
      });
      if (this.tableData.length == 0 || isStatus) {
        this.$message.warning("当前无可打分指标");
        this.controlOptions[3].name = "打分";
      } else {
        this.isableScore = false;
      }
    },
    //保存
    async save() {
      let arr = [];
      let flag;
      this.tableData.forEach(item => {
        console.log(item);
        if (item.status === 0) {
          if (item.examineScore === "") {
            this.$message.error("分值不能为空");
          } else {
            arr.push(item);
            flag = 1;
          }
        }
      });
      // console.log(arr);
      if (flag === 1) {
        let data = {
          ...this.examine,
          examineId: this.$route.query.id,
          examineType: 1,
          examineDescList: arr
        };
        console.log(data);
        let res = await this.$api.channelExamineUpdate({
          message: "保存成功",
          data
        });
        if (res && res.code === 0) {
          this.init();
          this.getExamineDetailList();
          console.log(res);
        }
      }
    },
    // 导出列表
    async exportExcel(all) {
      const res = await this.$api.channelExamineExport({
        data: {
          page: this.page,
          pageSize: this.pageSize,
          param: {
            examineId: this.$route.query.id,
            examineType: 1,
            targetType: Number(this.activeName),
            all: all === 1 ? true : false
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
      aLink.setAttribute("download", "渠道等级考核列表.xls");
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
      console.log(res);
    },
    //打印
    print() {
      if (this.activeName === "1") {
        // this.$print(this.$refs.printOne);
        this.isPrint = true;
        this.printData.title = '定量考核列表'
        this.printData.params.page = this.page;
        this.printData.params.pageSize = this.pageSize;
      } else {
        // this.$print(this.$refs.printTwo);
        this.isPrint = true;
        this.printData.title = '定性考核列表'
        this.printData.params.page = this.page;
        this.printData.params.pageSize = this.pageSize;
      }
    },
    //Tab切换
    handleClick(tab, event) {
      if (tab.name === "0") {
        this.controlOptions.push({
          name: "打分",
          type: "",
          permission: "channelLevelConfig-detail"
        });
      } else {
        this.controlOptions = this.controlOptions.slice(0, 3);
      }
    },

    pageSizeChange(size) {
      this.pageSize = size;
      this.getExamineDetailList();
    },
    pageCurrentChange(current) {
      this.page = current;
      this.getExamineDetailList(current);
    }
  }
};
</script>

<style lang="less" scoped>
</style>
