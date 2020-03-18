<template>
  <!-- 设备故障报表 -->
  <div class="vlt-card">
    <search-bar
      class="search-bar-demo"
      ref="searchForm"
      @search="search"
      :options="searchOptions"
      :total="total"
      labelWidth="6em"
      @change="changeSearch"
    >
      <control-bar slot="extend-bar" @select="selectBtn" :options="controlOptions" position="left"></control-bar>
    </search-bar>
    <div class="el_table" >
      <el-table :data="tableData" ref="print" border>
        <!-- <el-table-column type="index" label="序号"></el-table-column> -->
        <el-table-column  label="序号" type="index" fixed width="55">
          <template slot-scope="scope">{{params.pageSize*(params.page-1)+(scope.$index+1)}}</template>
        </el-table-column>
        <el-table-column prop="goodsName" label="设备名称"></el-table-column>
        <el-table-column prop="deviceModel" label="设备型号"></el-table-column>
        <el-table-column prop="deviceCode" label="设备序列号" min-width="120"></el-table-column>
        <el-table-column prop="hallId" label="大厅编号"></el-table-column>
        <el-table-column prop="insName" label="所属机构"></el-table-column>
        <el-table-column prop="faultLevel" label="故障级别"></el-table-column>
        <el-table-column label="报障时间" width="160">
          <template slot-scope="scope">{{translateTime(scope.row.repairDate)}}</template>
        </el-table-column>
        <el-table-column prop="serviceStaffName" label="维修员" show-overflow-tooltip min-width="200"></el-table-column>
      </el-table>
      <table-paging
        :total="total"
        :currentPage="params.page"
        :pageSize="params.pageSize"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      ></table-paging>
      <el-dialog
      title="打印预览"
      :visible.sync="isPrint"
      class="print-fullscreen"
      :fullscreen="true">
      <print :data="printData" @cancel="isPrint=false"></print>
    </el-dialog>
    </div>
  </div>
</template>

<script type="text/javascript">
import moment from "moment";
import { mapGetters } from "vuex";
export default {
  name: "accessoriesList",
  data() {
    return {
      // 搜索组件配置
      searchOptions: [
        { type: "select", prop: "goodsId", value: "", title: "设备名称", placeholder: "请选择", options: [] },
        { type: "select", prop: "modelId", value: "", title: "设备型号", placeholder: "请选择", options: [] },
        { title: "报障日期", type: "datepicker-range", prop: "createTime", value: "", option: ["开始时间", "结束时间"] },
        { type: "cascader", prop: "insId", value: "", title: "所属机构", options: [], setProps: { label: "text", value: "id", children: "children", checkStrictly: true } }
      ],
      controlOptions: [
        { name: "打印", type: "primary", icon: "printer", permission: 'reportEquipmentFailure-print' },
        { name: "导出", type: "", icon: "s-promotion", permission: 'reportEquipmentFailure-export' }
      ],
      tableData: [],
      total: 0,
      // pageSize: 10,
      // currentPage1:0,
      searchParams: {
        insId:"",
      },
      params: {
        page: 1,
        pageSize: 20
      },
      modelTreesList: [],
      newGoodsId: "",
      insId: "",
      isPrint: false,
      printData: {
        title: '设备故障报表',
        params: {
          page: 1,
          pageSize: 20
        },
        props: [
          {prop: 'index', label:'序号',width:'100px'},
          {prop: 'goodsName', label:'设备名称',width:'100px'},
          {prop:'deviceModel', label:'设备型号',width:''},
          {prop:'deviceCode', label:'设备编码',width:''},
          {prop:'hallId', label:'大厅编号',width:''},
          {prop:'insName', label:'所属机构',width:''},
          {prop:'faultLevel', label:'故障级别',width:''},
          {prop:'repairDate', label:'报障时间',width:''},
          {prop:'serviceStaff', label:'维修员',width:''}
        ],
        tableData: [],
      }
    };
  },
  mounted() {
    this.getInsId();
  },
  // computed: {
  //   ...mapGetters(["insData"])
  // },
  // watch: {
  //   insData: {
  //     handler(val, old) {
  //       console.log(val);
  //     }
  //   }
  // },
  components: {},
  created() {
    this.insId = this.$storage.get("userInfo").insId;
    if (this.insId) {
      this.searchParams.insId = this.insId;
      this.getList();
    }
    // 获取设备下拉 和设备型号下拉
    this.getModelTrees(1);
  },
  methods: {
    translateTime(val) {
      return moment(val).format("YYYY-MM-DD HH:mm:ss");
    },
    async getList() {
      // const that = this;

      let res = await this.$api.getQueryDeviceFaultReportList({
        data: {
          ...this.params,
          param: this.searchParams
        }
      });
      // console.log("设备故障报表", res);
      if (res && res.code == 0) {
        this.tableData = res.data.records;
        this.total = res.data.total;
        this.pageSize = res.data.pageSize;
        this.tableData.forEach( item => {
          item.repairDate = item.repairDate ? this.translateTime(item.repairDate ) : '';
        })
        this.printData.tableData =  this.tableData;
      } else {
        // this.$message.warning(res.msg);
      }
    },
    // 1 获取设备列表
    getModelTrees(goodsType) {
      const _this = this;
      (async id => {
        const data = {
          goodsType: id
        };
        let res = await _this.$api.getModelTrees({ data });
        if (res && res.code == 0) {
          if (res.data != null && res.data.length) {
            _this.modelTreesList = res.data;
            let options = [];
            _this.modelTreesList.forEach(item => {
              options.push({
                label: item.goodsName,
                value: item.id
              });
            });
            _this.$set(_this.searchOptions[0], "options", options);
          }
        }
      })(goodsType);
    },
    changeSearch(form, oldForm) {
      // console.log(form, oldForm);
      if (form.goodsId != this.newGoodsId) {
        // console.log(form.goodsId);
        let changeSelect = [];
        this.modelTreesList.forEach(item => {
          if (item.id == form.goodsId) {
            changeSelect = item.modelInfoVoList;
          }
        });
        if (changeSelect.length) {
          let options = [];
          changeSelect.forEach(item => {
            options.push({
              label: item.deviceModel,
              value: item.modelId
            });
          });
          this.$set(this.searchOptions[1], "options", options);
        } else {
          this.$set(this.searchOptions[1], "options", []);
        }
        this.$set(this.$refs.searchForm.form, this.searchOptions[1].prop, "");
        this.newGoodsId = form.goodsId;
      }
    },
    // async getInsId() {
    //   let reslt = await this.$api.QueryUserAndInsTree(); // 机构
    //   console.log("机构查询", reslt);
    //   if (reslt && reslt.code === 0) {
    //     this.searchOptions[3].options = reslt.data;
    //   }
    // },
    async getInsId() {    //机构
      const self = this;
      const data = {};
      (async data => {
        let res = await self.$api.QueryUserAndInsTree({ data });
        if (res && res.code == 0) {
          let newData = res.data;
          this.userInsId = res.data[0].id;
          console.log(newData);
          newData &&
            newData.forEach(ele => {
              ele.children &&
                ele.children.forEach(el => {
                  delete el.children;
                });
            });
          self.$set(self.searchOptions[3], "options", newData);
        } else {
          // self.$message.warning(res.msg)
        }
      })(data);
    },
    search(val) {
      // this.searchParams = {
      //   insId: this.insId,
      //   ...val
      // };
      let list = {};
      if(Array.isArray(val.insId)){
        val.insId=val.insId[val.insId.length-1]
      }else{
        val.insId=this.insId
      }
      if (val.createTime && val.createTime.length > 0) {
        let startDate = moment(Date.parse(val.createTime[0])).format(
          "YYYY-MM-DD"
        );
        let endDate = moment(Date.parse(val.createTime[1])).format(
          "YYYY-MM-DD"
        );
        list = {
          ...val,
          startDate,
          endDate
        };
      } else {
        list = {
          ...val
        };
      }
      delete list.createTime;
      this.searchParams = { ...list };
      // this.searchParams.insId = this.insId;
      console.log(val);
      this.params.page = 1;
      this.getList();
    },
    handleClick(row) {
      this.$router.push({
        name: "equipmentDesc",
        query: {
          id: row.id
        }
      });
    },
    selectBtn(btn) {
      console.log(1, btn);
      if (btn.name === "打印") {
        // this.$print(this.$refs.print);
        this.isPrint = true;
        this.printData.params.page = this.params.page;
        this.printData.params.pageSize = this.params.pageSize;
      } else if (btn.name === "导出") {
        this.exportExcel();
      }
    },
    async exportExcel() {
      //导出
      // this.requestData = {};
      // const data = JSON.parse(JSON.stringify(this.requestData));
      let result = await this.$api.exportDeviceFaultReportList({
        data: {
          page: this.params.page,
          pageSize: this.params.pageSize,
          param: this.searchParams
        },
        responseType: "blob"
      });
      var blob = new Blob([result.blob], {
        type: "application/vnd.ms-excel;charset=utf-8"
      });
      var url = window.URL.createObjectURL(blob);
      var aLink = document.createElement("a");
      aLink.style.display = "none";
      aLink.href = url;
      aLink.setAttribute("download", "设备故障报表.xls");
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
      console.log("res", result);
    },
    // resume (row) {
    //   console.log(row);
    //   this.$router.push({
    //     name: 'equipmentResume'
    //   })
    // },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(size) {
      console.log(999, size);
      this.params.pageSize = size;
      this.params.page = 1;
      this.getList();
      // this.data.pageSize = val;
    },
    handleCurrentChange(val) {
      console.log(6666, val);
      this.params.page = val;
      this.getList();
      // this.currentPage1 = val;
    }
  }
};
</script>

<style lang="less" scoped>
</style>
