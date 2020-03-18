<template>
  <!-- 设备管理 - 配件列表 -->
  <div class="vlt-card">
    <search-bar
      class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      :total="total"
      labelWidth="7em"
    ></search-bar>

    <el-row class="card-table">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
        class="table-box"
      >
        <el-table-column label="序号" width="55" fixed>
          <template slot-scope="scope">
          {{options.pageSize*(options.page-1)+(scope.$index+1)}}
          </template>
        </el-table-column>
        <!-- <el-table-column
          v-for="(item,key) in tableKey"
          :key="key"
          :prop="item.value"
          :label="item.label"
          :width="item.width"
          :type="item.type"
        ></el-table-column> -->
        <el-table-column prop="deviceName" label="配件名称" min-width="140px"></el-table-column>
        <el-table-column prop="deviceModel" label="配件型号" min-width="140px"></el-table-column>
        <el-table-column prop="serial" label="配件序列号" min-width="160px"></el-table-column>
        <el-table-column prop="statusName" label="配件状态" min-width="120px">
          <template slot-scope="scope">
            <span
              class="icon-circle"
              :class="{
              blue:scope.row.status=='2',
              green:scope.row.status=='0',
              grey:scope.row.status=='3',
              yellow:scope.row.status=='4',
              red:scope.row.status=='1',
              }"
            >{{scope.row.statusName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="typeName" label="仓库类型" min-width="120px"></el-table-column>
        <el-table-column prop="warName" label="所属仓库" min-width="200px"></el-table-column>
        <el-table-column prop="useStatusName" label="使用状态" min-width="120px">
          <template slot-scope="scope">
            <span
              class="icon-tag"
              :class="{
              blue:scope.row.useStatus=='0',
              green:scope.row.useStatus=='1',
              grey:scope.row.useStatus=='2',
              yellow:scope.row.useStatus=='3',
              red:scope.row.useStatus=='4',
              }"
            >{{scope.row.useStatusName}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="130">
          <template slot-scope="scope">
            <el-button :id="'accessoriesList-detail'+scope.$index" type="primary" v-has="'accessoriesList-detail'" size="mini" @click="handleClick(scope.row)">查看</el-button>
            <el-button :id="'accessoriesList-record'+scope.$index" type="" v-has="'accessoriesList-record'" size="mini" @click="resume(scope.row)">履历</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <table-paging
      position="right"
      :total="total"
      :currentPage="options.page"
      :pageSize="options.pageSize"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></table-paging>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "accessoriesList",
  data() {
    return {
      // 搜索组件配置
      searchOptions: [
        {
          type: "input",
          prop: "deviceName",
          value: "",
          title: "配件名称",
          placeholder: "请输入配件名称"
        },
        {type: "input",prop: "serial",value: "",title: "配件序列号",placeholder: "请输入"},
        {type: "input",prop: "deviceModel",value: "",title: "配件型号",placeholder: "请输入配件型号"},
        // {type: "input",prop: "deviceCode",value: "",title: "配件编码",placeholder: "请输入"},
        {type: "input",prop: "warName",value: "",title: "所属仓库",placeholder: "请输入"},
        {type: "select",prop: "status",value: "",title: "配件状态",placeholder: "请选择",
          options: [
            {label: "正常",value: 0},
            {label: "已损坏",value: 1},
            {label: "故障",value: 2}
          ]
        }
      ],
      tableKey: [
        // {label: "序号",value: "id",type:'index', width: "80"},
        {label: "配件名称",value: "deviceName",width: ""},
        {label: "配件型号",value: "deviceModel",width: "150"},
        // {label: "配件编码",value: "deviceCode",width: ""},
        { label: "配件序列号", value: "serial", width: "180" },
        {label: "仓库类型",value: "typeName",width: "120"},
        {label: "所属仓库",value: "warName",width: "200"},
        {label: "使用状态",value: "useStatusName",width: ""},
        {label: "配件状态",value: "statusName",width: ""}
      ],

      tableData: [],
      total: 0,
      options: {
        page: 1,
        pageSize: 20,
        param: {
          deviceType: 2
        }
      },
      params: {}
    };
  },
  components: {},
  created() {
    this.initList(this.options);
  },
  methods: {
    async initList(options) {
      // console.log("this.options", options);
      let data = JSON.parse(JSON.stringify(options));
      let res = await this.$api.equipmentListPage({ data });
      console.log("data", res);
      if (res.code === 0) {
        this.tableData = res.data.records;
        this.total = res.data.total;
      }
    },

    search(form) {
      // console.log("search", form);
      this.options = {
        page: 1,
        pageSize: 20,
        param: {
          deviceType: 2,
          ...form
        }
      }
      // Object.assign(this.params,this.options, form)
      this.initList(this.options);
    },
    handleClick(row) {
      this.$router.push({
        name: "accessoriesDesc",
        query: {
          id: row.id
        }
      });
    },
    resume(row) {
      console.log(row);
      this.$router.push({
        name: "accessoriesResume",
        query: {
          serial: row.serial
        }
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(pageSize) {
      this.tableData.size = pageSize;
      this.options.pageSize = pageSize
      this.options.page = 1;
      this.initList(this.options);
    },
    handleCurrentChange(currentPage) {
      this.options.page = currentPage;
      this.initList(this.options);
    },
    formatUseStatus(status) {
      switch (status) {
        case 1:
          return (status = "闲置中");
        case 2:
          return (status = "运行中");
      }
    },
    forMatStatus(status) {
      switch (status) {
        case 0:
          return (status = "正常");
        case 1:
          return (status = "已损坏");
        case 2:
          return (status = "故障");
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>
