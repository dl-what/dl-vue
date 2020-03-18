<template>
  <div class="vlt-card">
    <search-bar
      class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      :total="total"
      labelWidth="6em"
    >
    </search-bar>
    <el-table
      border
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
    >
       <!-- <el-table-column label="序号" fixed type="index" width="100"></el-table-column> -->
       <el-table-column  label="序号" type="index" fixed width="100">
          <template slot-scope="scope">{{params.pageSize*(params.page-1)+(scope.$index+1)}}</template>
        </el-table-column>
        <el-table-column prop="switchName" label="开关名称 " width="300"></el-table-column>
        <el-table-column prop="explain" label="开关描述"></el-table-column>
        <el-table-column label="状态" width="300" fixed="right">
            <template slot-scope="scope">
            <el-switch
              v-has="'systemSwitch-enable'"
              class="switchStyle"
              v-model="scope.row.switchStatus"
              :active-text="scope.row.switchStatus?'冻结':'启用'"
              :active-value="0"
              :inactive-value="1"
              @change="switchChange(scope.row)"
               :id="$route.name+'-'+'switch'+scope.$index"
            ></el-switch>
          </template>
        </el-table-column>
      </el-table>
      <table-paging
      position="right"
      :total="total"
      :currentPage="params.page"
      :pageSize="params.pageSize"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></table-paging>
    
  </div>
</template>

<script type="text/javascript">
export default {
  name: "",
  data() {
    return {
      searchOptions: [
        {
          title: "开关名称",
          prop: "id",
          type: "select",
          options: [],
          value: "",
          placeholder: "请输入" || ["请输入1", "请输入2"]
        }
      ],
      tableData: [],
      total: 0,
      searchParams: {},
      params: {
        page: 1,
        pageSize: 20
      }
    };
  },
  components: {},
  created() {
    this.sysSwitchNameList();
    this.sysSwitchPageList();
  },
  methods: {
    async sysSwitchNameList() {
      let resl = await this.$api.sysSwitchNameList();
      console.log("下拉接口数据", resl);

      resl.data.forEach(item => {
        let obj = {};
        obj.value = item.id;
        obj.label = item.switchName;
        this.searchOptions[0].options.push(obj);
      });
    },
    async sysSwitchPageList() {
      //分页列表
      const res = await this.$api.sysSwitchPage({
        data: {
          ...this.params,
          param: this.searchParams
        }
      });
      console.log("分页列表数据", res);
      if (res && res.code === 0) {
        this.tableData = res.data.records || [];
        this.total = res.data.total;
      }
    },
    search(val) {
      //搜索
      this.searchParams = val;
      this.params.page = 1;
      this.sysSwitchPageList();
    },
    handleSizeChange(size) {
      this.params.pageSize = size;
      this.sysSwitchPageList();
    },
    handleCurrentChange(val) {
      this.params.page = val;
      this.sysSwitchPageList();
    },
    async switchChange(val) {
      //更改状态
      let ifo;
      
      if (val.switchStatus) {
        ifo = "确定要冻结本条数据?";
      }else {
        ifo = "确定要启用本条数据?";
      }
      this.$confirm(ifo, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let data = {
            switchStatus: val.switchStatus,
            id: val.id
          };
          console.log(222, data);
          let reslt = await this.$api.sysSwitchStatusUpdate({ data });
          console.log("更改角色状态", reslt);
          if (reslt && reslt.code === 0) {
            // this.channelAppraisalPage();
            val.switchStatus = data.switchStatus;
            this.$message({
              type: "success",
              message: "修改成功!"
            });
          }else{
             val.switchStatus = Number(!val.switchStatus);
          }
        })
        .catch(() => {
          // this.channelAppraisalPage();
          val.switchStatus = Number(!val.switchStatus);
          this.$message({
            type: "warning",
            message: "已取消"
          });
        });
    },
  }
};
</script>

<style lang="less" scoped>
</style>

