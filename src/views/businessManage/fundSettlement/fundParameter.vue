<template>
<!-- 全局参数管理 -->
  <div class="vlt-card">
    <search-bar
      class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      :total="total"
      labelWidth="6em"
    >
      <!-- <control-bar slot="extend-bar" @select="selectBtn" :options="controlOptions" position="left"></control-bar> -->
    </search-bar>
    <el-row class="card-table">
      <el-table :data="tableData" border style="width: 100%" class="table-box">
        <el-table-column type="index" fi-xed label="序号" width="60px">
          <template slot-scope="scope">
            {{params.pageSize*(params.page-1)+(scope.$index+1)}}
          </template>
        </el-table-column>
        <el-table-column prop="parameterCode" label="参数编号" min-width="100"></el-table-column>
        <el-table-column prop="parameterName" label="参数名称" min-width="140"></el-table-column>
        <el-table-column prop="remark" label="参数描述" min-width="260" show-overflow-tooltip></el-table-column>
        <el-table-column prop="status" label="参数状态" align="center" min-width="100">
          <template slot-scope="scope">
            <el-switch
              :id="'fundParameter-switch' + scope.$index"
              v-has="'fundParameter-switch'"
              v-model="scope.row.status"
              @change="changeStatus(scope.row)"
              :active-text="scope.row.status==1?'启用':'冻结'"
              :inactive-value="2"
              :active-value="1">
            </el-switch>
          </template>
        </el-table-column>
        
        <el-table-column prop="updateName" label="更新人" min-width="100"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间" min-width="160"></el-table-column>
        
        <el-table-column fixed="right" label="操作" width="140">
          <template slot-scope="scope">
            <el-button :id="'fundParameter-detail' + scope.$index" type="primary" size="mini" @click="getDetail(scope.row.id)" v-has="'fundParameter-detail'">查看</el-button>
            <el-button :id="'fundParameter-edit' + scope.$index" type="primary" size="mini" @click="edit(scope.row.id)" v-has="'fundParameter-edit'">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
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
      // 搜索组件配置
      searchOptions: [
        {type: 'input',prop: 'parameterName',value: '', title: '参数名称'},
        {
          type: "select",
          prop: "status",
          value: "",
          title: "参数状态",
          options: [
            {
              label: "启用",
              value: 1
            },
            {
              label: "冻结",
              value: 2
            }
          ]
        }
      ],
      controlOptions: [
        // { name: "全局参数", type: "primary", icon: "" } // type为按钮的五种颜色， icon为具体的图标
      ],
      tableData: [],
      params: {
        page: 1,
        pageSize: 20,
        param: {}
      },
      total:0,
    };
  },
  created() {
    this.init();
  },

  methods: {
    init() {
      const self = this;
      let data = self.params;
      (async data =>{
        let res = await self.$api.globalParameterList({ data })
        if (res && res.code == 0) {
          console.log(res)
          self.total = res.data.total;
          self.tableData = res.data.records;
        }
      })(data)
    },
    // 状态修改
    changeSwitch(data) {
      const self = this;
      (async data =>{
        let res = await self.$api.globalParameterUpdate({ data })
        if (res && res.code == 0) {
          self.$message.success('修改成功')
        }
      })(data)
    },
    changeStatus(val) {
      const self = this;
      self.$confirm('此操作将修改该参数的状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {
          id: val.id,
          parameterCode: val.parameterCode,
          parameterName: val.parameterName,
          remark: val.remark,
          specialFundTime: val.specialFundTime,
          status: val.status
        };
        self.changeSwitch(data);
      }).catch(() => {
        self.$message({
          type: 'warning',
          message: '已取消'
        }); 
        val.status = val.status==1 ? 2 : 1;    
      });
    },
    search(val) {
      this.params.param = val;
      console.log(this.params)
      this.init(this.params)
    },
    handleSizeChange(val) {
      this.params.pageSize = val;
      this.init(this.params)
    },
    handleCurrentChange(val) {
      this.params.page = val;
      this.init(this.params)
    },
    getDetail(id) {
      this.$router.push({
        name: "parameterDetail",
        query: {id}
      });
    },
    edit(id) {
      this.$router.push({ name: "parameterEdit", query: {id}});
    }
  },
};
</script>
<style lang="less" scoped>
</style>



