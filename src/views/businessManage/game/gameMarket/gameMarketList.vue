<template>
  <div class="vlt-card game-launch-list">
    <search-bar
      class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      :total="total"
      labelWidth="6em"
    ></search-bar>
    <el-table
      border
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%">
      <el-table-column label="序号" fixed width="55">
        <template slot-scope="scope">
          {{params.pageSize*(params.page - 1) + (scope.$index+1)}}
        </template>
      </el-table-column>
      <el-table-column prop="gameCode" label="游戏编码"  min-width="140px"></el-table-column>
      <el-table-column prop="gameName" label="游戏名称"  min-width="160px"></el-table-column>
      <el-table-column prop="gameTypeName" label="游戏类型" min-width="120px"></el-table-column>
      <el-table-column prop="versionNumber" label="版本号" min-width="120px"></el-table-column>
      <el-table-column prop="developerName" label="游戏开发商" min-width="160px"></el-table-column>
      <el-table-column prop="gameListTime" label="上市时间" min-width="160px"></el-table-column>
      <el-table-column fixed="right" label="操作" min-width="100">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            v-has="'gameMarketList-detail'"
            @click.native="detail(scope.row)"
            :id="$route.name+'-'+'detail'+scope.$index"
          >查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <table-paging
      position="right"
      :total="total"
      :currentPage="params.page"
      :pageSize="params.pageSize"
      @handleSizeChange="changeSize"
      @handleCurrentChange="changeCurrent"
    ></table-paging>
  </div>
</template>

<script>

export default {
  name: "gameMarketPlanList",
  data() {
    return {
      tableData: [],
      searchOptions: [
        {
          type: "input",
          prop: "gameCode",
          value: "",
          title: "游戏编码",
          maxlength: "50"
        },
        {
          type: "input",
          prop: "gameName",
          value: "",
          title: "游戏名称",
          maxlength: "20"
        },
        {
          type: "select",
          prop: "gameType",
          value: "",
          title: "游戏类型",
          placeholder: "请选择",
          options: []
        },
        // {
        //   type: "select",
        //   prop: "gameStatus",
        //   value: "",
        //   title: "游戏状态",
        //   placeholder: "请选择",
        //   options: [
        //     {label:'储备',value: 1},
        //     {label:'试玩',value: 2},
        //     {label:'上市',value: 3},
        //     {label:'退市',value: 4},
        //   ]
        // },
        // {
        //   type: "select",
        //   prop: "gameSaleStatus",
        //   value: "",
        //   title: "销售状态",
        //   placeholder: "请选择",
        //   options: [
        //     {label:'开售',value: 1},
        //     {label:'停售',value: 2},
        //   ]
        // },
        {
          type: "datepicker-range",
          prop: "date",
          value: "",
          title: "上市时间",
          placeholder: ["开始日期", "结束日期"]
        }
      ],
      formatObj: {
        formatGameStatus:['存储', '试玩', '上市', '变更', '退市'],
        formatGameType: ['概率型','奖组型'],
        formatPoolRate:['无奖池','单奖池', '多奖池'],
        formatPlanStatus: ['审批中', '审批拒绝','待生效','已生效'],
        formatConPattern: ['测试账户', '试玩积分'],
        formatIndulgeSwitch: ['启用','禁用']
      },
      total: 0,
      params: {
        page: 1,
        pageSize: 20,
        param: {}
      }
    };
  },
  created() {
    this.getAllGameType()
    this.queryGameListPlanPage(this.params);
  },
  methods: {
    // 获取下拉框数据
    getAllGameType(data) {
      const self = this;
      (async (data)=>{
				let res = await self.$api.getAllGameType({data})
				if(res && res.code == 0) {
          let array = [];
          res.data.forEach(item => {
            let obj = {};
            obj.label = item.gameTypeName;
            obj.value = item.gameTypeCode;
            array.push(obj)
          });
          this.searchOptions[2].options = array;
				}
      })(data)
    },
    // 修改状态
    changeSwitch(val) {
      const self = this;
      const data = {
        gameId: val.gameId,
        gameSaleStatus: val.gameSaleStatus
      };
      let text = val.gameSaleStatus==1?'开售': '停售'
      self.$confirm(`此操作将${text}该款游戏, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
         (async (data)=>{
            let res = await self.$api.changeSaleStatus({data})
            if(res && res.code == 0) {
              self.$message.success('修改成功')
            }else{
              val.gameSaleStatus = val.gameSaleStatus==1?2:1;
            }
          })(data)
        }).catch(() => {
          val.gameSaleStatus = val.gameSaleStatus==1?2:1;
          self.$message.warning('已取消');
          // self.queryGameListPlanPage(self.param)       
        });
      
      
    },
    queryGameListPlanPage(data) {
      const self = this;
      (async data => {
        let res = await self.$api.queryGameListPlanPage({ data });
        console.log(res);
        if (res && res.code == 0) {
          self.total = res.data.total;
          let options = {1: "储备",2: "试玩",3: "上市",4: "退市"};
          res.data.records.forEach((item)=>{
            // item.strStatus = options[item.gameStatus]
            item.gameListTime = this.$moment(item.gameListTime).format('YYYY-MM-DD HH:mm:ss')
            // item.gameTypeName = this.gameTypeOptions[item.gameType]
          })
          self.tableData = res.data.records;
        }
      })(data);
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //查看页面跳转
    detail(row) {
      console.log(row);
      this.$router.push({
        path: "./gameMarketDetail",
        query: {
          id: row.developerId,
          gameId: row.gameId,
          type: 1
        }
      });
    },
    edit(id) {
      this.$router.push({
        path: "./gameMarketPlanEdit",
        query: { id }
      });
    },
    search(val) {
      this.params.page = 1;
      this.params.param = val;
      if(val.date&&val.date.length>0) {
        this.params.param.startTime = this.$moment(val.date[0]).format('YYYY-MM-DD')
        this.params.param.endTime = this.$moment(val.date[1]).format('YYYY-MM-DD')
        delete this.params.param.date;
      }
      this.queryGameListPlanPage(this.params);
    },
    changeSize(val) {
      this.params.page = 1;
      this.params.pageSize = val;
      this.queryGameListPlanPage(this.params);
    },
    changeCurrent(val) {
      this.params.page = val;
      this.queryGameListPlanPage(this.params);
    }
  },
};
</script>


<style lang="less" scoped>
</style>
