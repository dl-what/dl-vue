<template>
  <div class="vlt-card">
    <search-bar :total="total" class="search-bar-demo" @search="search" :options="searchOptions" labelWidth="6em"></search-bar>
    <el-table :data="tableData" border style="width: 100%; margin-top: 10px;">
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="responsibleCode" label="责任编号"></el-table-column>
      <el-table-column prop="responsibleType" min-width="120" label="责任类型"></el-table-column>
      <!-- <el-table-column label="状态" min-width="120" prop="status">
        <template slot-scope="scope">
          <tableRowStatus
            :scope="scope"
            :tableData="tableData"
            idField="responsibleCode"
            statusField="status"
            :rowName="'责任类型为: ' + scope.row.responsibleType"
            :option="{
                enable:{
                  apiName:'dutyUpdateStatus',
                  label:'启用',
                  value:0,
                  permission:'dutyLotteryList-enable'
                },
               disable:{
                  apiName:'dutyUpdateStatus',
                  label:'冻结',
                  value:1,
                  permission:'dutyLotteryList-disable'
               },
              }"
          ></tableRowStatus>
        </template>
      </el-table-column> -->
      <el-table-column label="状态" min-width="120px">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            v-has="'dutyLotteryList-switch'"
            @change="changeStatus(scope.row)"
            :active-text="scope.row.status==0?'启用':'冻结'"
            :inactive-value="1"
            :active-value="0"
          ></el-switch>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="createUser" label="创建人"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>-->
      <el-table-column label="操作" align="center" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="detail(scope.row)"
            v-has="'dutyLotteryList-detail'"
            :id="$route.name + '-' + 'detail' + scope.$index"
          >查看</el-button>
          <el-button
            type
            size="mini"
            @click="edit(scope.row)"
            :disabled="scope.row.status !=1"
            v-has="'dutyLotteryList-edit'"
            :id="$route.name + '-' + 'edit' + scope.$index"
          >编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <table-paging
      :current-page="params.page"
      :page-size="params.pageSize"
      :total="total"
      @handleSizeChange="pageSizeChange"
      @handleCurrentChange="pageCurrentChange"
    ></table-paging>-->
  </div>
</template>

<script type="text/javascript">
export default {
  name: "",
  data() {
    return {
      searchOptions: [
        {
          title: "责任类型",
          type: "select",
          prop: "responsibileCode",
          value: "",
          options: [
            { label: "全局充值限额", value: 200001 },
            { label: "全局投注限额", value: 200002 },
            { label: "全局登录时长", value: 200003 }
          ]
        },
        {
          title: "责任状态",
          type: "select",
          prop: "status",
          value: "",
          options: [{ label: "启用", value: 0 }, { label: "冻结", value: 1 }]
        }
      ],
      tableData: [],
      total: 0,
      params: {
        page: 1,
        pageSize: 20,
        param: {}
      }
    };
  },
  created() {
    this.init(this.params);
  },
  methods: {
    // 修改状态
    dutyUpdateStatus(data) {
      const self = this;
      (async data => {
        let res = await self.$api.dutyUpdateStatus({ data });
        if (res && res.code == 0) {
          // self.tableData = res.data.records;
          self.$message.success("修改成功");
          // self.getGameTypeList(self.params)
        }
      })(data);
    },
    changeStatus(val) {
      const self = this;
      let text = val.status==0?'启用': '冻结';
      self.$confirm(`此操作将状态变更为${text}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.item = val;
        let data = {
          responsibleCode: val.responsibleCode,
          status: val.status,
        };
        self.dutyUpdateStatus(data);
      }).catch(() => {
        self.$message({
          type: 'warning',
          message: '已取消'
        }); 
        val.status = val.status==1?0:1;         
      });
    },
    async init(data) {
      let self = this;
      let res = await self.$api.getdutyList({ data });
      if (res && res.code === 0) {
        self.total = res.data.length;
        self.tableData = res.data.reverse();
      }
    },

    detail(type) {
      console.log(type);
      this.$router.push({
        name: "dutyDetail",
        query: { id: type.responsibleCode }
      });
    },
    edit(row) {
      this.$router.push({
        name: "dutyUpdate",
        query: { responsibleCode: row.responsibleCode, id: row.id }
      });
    },
    search(val) {
      this.params = val;
      this.init(val);
    },
    pageSizeChange(size) {
      this.params.pageSize = size;
      this.init(this.params);
    },
    pageCurrentChange(page) {
      this.params.page = page;
      this.init(this.params);
    }
  }
};
</script>

<style lang="less" scoped>
</style>
