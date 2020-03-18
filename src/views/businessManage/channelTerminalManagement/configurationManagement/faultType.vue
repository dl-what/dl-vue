<template>
  <!-- 配置管理 - 故障类型 -->
  <div class="vlt-card">
    <search-bar
      class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      :total="tableData.total"
      labelWidth="6em"
    >
      <control-bar slot="extend-bar" @select="selectBtn" :options="controlOptions" position="left"></control-bar>
    </search-bar>
    <el-table
      border
      ref="multipleTable"
      :data="tableData.records"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="序号" width="80" fixed>
        <template slot-scope="scope">
        {{tableData.size*(tableData.current-1)+(scope.$index+1)}}
        </template>
      </el-table-column>
      <!-- <el-table-column label="序号" fixed type="index" width="50"></el-table-column> -->
      <el-table-column prop="goodsType" label="物品类别" min-width="120px"></el-table-column>
      <el-table-column prop="goodsName" label="物品名称" min-width="160px"></el-table-column>
      <el-table-column prop="faultTypeVOList" label="故障类型" show-overflow-tooltip  min-width="400">
        <template slot-scope="scope">
          <div style="text-align: center">
            <p v-for="(item,i) in scope.row.faultTypeVOList" :key="i" style="display: inline-block; margin-right: 10px;">{{i+1}}:{{item}}</p>
          </div>
          
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="100">
        <template slot-scope="scope">
          <el-button :id="'faultType-edit'+scope.$index" type="primary" size="mini" v-has="'faultType-edit'"  @click.native="edit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <table-paging
      position="right"
      :total="tableData.total"
      :currentPage="requestData.page"
      :pageSize="requestData.pageSize"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></table-paging>
    <edit-fault-type :showForm="showdialog" :goodsNames="goodsNames" :rowInfo="rowData" @closeDia="hideDia" ></edit-fault-type>
  </div>
</template>

<script type="text/javascript">
import editFaultType from "@/views/businessManage/channelTerminalManagement/configurationManagement/editFaultType";
export default {
  name: "accessoriesList",
  data() {
    return {
      showdialog: false,
      // 搜索组件配置
      searchOptions: [
        {
          type: "input",
          prop: "faultType",
          value: "",
          title: "故障类型",
          placeholder: "请输入"
        },
        {
          type: "input",
          prop: "goodsName",
          value: "",
          title: "物品名称",
          placeholder: "请输入"
        }
      ],
      controlOptions: [
        { name: "新增故障", type: "primary", icon: "plus", permission: 'faultType-add' } // type为按钮的五种颜色， icon为具体的图标
      ],
      // tableDatas: {
      tableData: {},
      searchParams: {},
      requestData: {
        page: 1,
        pageSize: 20,
        param: {}
      },
      goodsTypes: ["配件", "设备"],
      goodsType: 1,
      rowData: {},
      goodsNames: []
    };
  },

  components: {
    "edit-fault-type": editFaultType
  },
  created() {
    (async () => {
      await this.queryGoodsInfo(this.goodsType);
      this.queryFaultTypeInfoList(this.requestData);
    })()
  },
  methods: {
    queryGoodsInfo(goodsType) {
      const _this = this;
      const data = {goodsType};
      (async data => {
        let res = await _this.$api.queryGoodsInfo({data});
        if (res && res.code == 0) {
          if (res.data != null){
            _this.goodsNames = res.data;
          }
        }
      })(data)
    },
    async queryFaultTypeInfoList(data) {
      const _this = this;
      //分页列表
      const res = await _this.$api.queryFaultTypeInfoList({ data });
      console.log("分页列表数据", res);
      if (res && res.code === 0) {
        _this.tableData = res.data;
        _this.tableData.records.forEach(item => {
          item.goodsType = _this.goodsTypes[item.goodsType];
          // item.goodsName = _this.goodsNames[item.goodsName];
        });
      }
    },
    search(form) {
      console.log("form", form);
      this.requestData = {
        page: 1,
        pageSize: 20,
        param: {
          ...form
        }
      };
      this.queryFaultTypeInfoList(this.requestData);
    },
    selectBtn() {
      this.$router.push({
        name: "addFaultType"
      });
    },
    edit(row) {
      // console.log("row", row);
      this.rowData = row;
      this.showdialog = true;
    },
    hideDia(bool) {
      if (bool == 'true') {
        this.queryFaultTypeInfoList(this.requestData);
      }
      this.showdialog = false;
    },
    handleClick(row) {
      this.showdialog = true;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(pageSize) {
      console.log(pageSize);
      this.requestData.pageSize = pageSize;
      this.requestData.page = 1;
      this.queryFaultTypeInfoList(this.requestData);
    },
    handleCurrentChange(currentPage) {
      this.requestData.page = currentPage;
      console.log(currentPage);
      this.queryFaultTypeInfoList(this.requestData);
    },
    // reloading () {
    //   console.log(333);
    //   this.queryFaultTypeInfoList(this.requestData);
    // },
  }
};
</script>

<style lang="less">

</style>
