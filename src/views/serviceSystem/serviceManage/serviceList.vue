<template>
  <div class="vlt-card game-launch-list">
    <search-bar class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      :total="total"
      labelWidth="6em">
      <control-bar slot="extend-bar" @select="selectBtn" :options="controlOptions"></control-bar>
    </search-bar>
    <el-table
      border
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%">
      <el-table-column type="selection" fixed width="55"></el-table-column>
      <el-table-column label="序号" type="index" width="55"></el-table-column>
      <el-table-column prop="gameListCode" label="昵称" min-width="120px"></el-table-column>
      <el-table-column prop="gameListName" label="姓名" min-width="160px"></el-table-column>
      <el-table-column prop="versionNumber" label="账号" min-width="140px"></el-table-column>
      <el-table-column prop="gameName" label="手机号码" min-width="120px"></el-table-column>
      <el-table-column prop="gameName" label="客服分组" min-width="120px"></el-table-column>
      <el-table-column label="账户状态" min-width="120px">
        <template slot-scope="scope">
          <span class="icon-circle" 
            :class="{
              blue:scope.row.gameListStatus=='1',
              green:scope.row.gameListStatus=='2',
              red:scope.row.gameListStatus=='3',}">
              {{scope.row.strStatus}}
          </span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" v-prevent="2000" @click.native="detail(scope.row)">查看</el-button>
          <el-button  size="mini" v-prevent="2000" @click.native="edit(scope.row)">分组</el-button>
        </template>
      </el-table-column>
    </el-table>
    <table-paging
      position="right"
      :total="total"
      :currentPage="params.page"
      :pageSize="params.pageSize"
      @handleSizeChange="changeSize"
      @handleCurrentChange="changeCurrent">
    </table-paging>
  </div>
  
</template>

<script>
import moment from 'moment'
import {mapGetters} from 'vuex'

export default {
  name: 'gameMarketPlanList',
  data() {
    return {
      controlOptions: [
        { name: "批量分组", type: "primary", icon: "user" }, // type为按钮的五种颜色， icon为具体的图标
      ],
      tableData: [],
      searchOptions:[
        {type: 'input', prop: 'gameListCode', value: '', title: '昵称', placeholder: '请输入'},
        {type: 'input', prop: 'gameListName', value: '', title: '姓名', placeholder: '请输入'},
        {type: 'input', prop: 'gameListName', value: '', title: '手机号码', placeholder: '请输入'},
        {
          type: 'select', prop: 'gameListStatus', value: '', title: '账户状态', placeholder: '请选择',
          options: [
            {
              label: '启用',
              value: 1
            },
            {
              label: '停用',
              value: 2
            },
          ]
        },
        {
          type: 'select', prop: 'gameListStatus', value: '', title: '客服分组', placeholder: '请选择',
          options: [
            {
              label: '一组',
              value: 1
            },
            {
              label: '二组',
              value: 2
            },
          ]
        },
      ],
      params: {
        page: 1,
        pageSize: 20,
        param: {}
      },
      total: 0,
      // insData: [],
    }
  },
  created() {
    // this.getInsData();
    this.getMarketPlanList(this.params)
  },
  computed: {
    ...mapGetters(['insData'])
  },
  methods: {
    // 获取机构数据
    getInsData() {
      const self = this;
      const data = {};
      (async (data)=>{
				let res = await self.$api.QueryUserAndInsTree({data})
				if(res && res.code == 0) {
          console.log('res', res.data)
          self.insData = res.data;
          self.getMarketPlanList(self.param)
				} else {
          // self.$message.warning(res.msg)
        }
      })(data)
    },
    getInsArray(val) {
      let arr = val&&val.split(';');
      let textArray = [];
      arr&&arr.forEach((item)=>{
        if(item) {
          let array = this.$formMethods.getInsArray(item, 'id', this.insData, 'text')
          let str;
          if(array&&array.length>2) {
            str = `${array[1]}${array[0]}`
          }else{
            str = array&&array[0];
          }
          textArray.push(str)
        }
      })
      return textArray.join('；')
    },
    getMarketPlanList(data) {
      const self = this;
      (async (data)=>{
        let res = await self.$api.getMarketPlanList({data})
        console.log(res);
				if(res && res.code == 0) {
          self.total = res.data.total;
          self.tableData = res.data.records;
          let options = {
            1: '未开始',
            2: '已上市',
            3: '已结束',
          };
          if (self.tableData.length > 0) {
            self.tableData.forEach(item => {
              item.strStatus = options[item.gameListStatus]
              item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
              item.gameListTime = item.gameListTime&&moment(item.gameListTime).format('YYYY-MM-DD HH:mm:ss')
            })
          }
				}
      })(data)
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
    detail(val) {
      this.$router.push({
        path: './workOrderDetail',
        query: {gameId:val.gameId,id:val.id,deployCode:val.deployCode}
      })
    },
    selectBtn() {
      this.$router.push({path: './createPlan'})
    },
    edit(val) {
      this.$router.push({
        path: './editPlan',
        query: {gameId:val.gameId,id:val.id,deployCode:val.deployCode}
      })
    },
    search(val) {
      this.params.page = 1;
      this.params.param = val;
      if(val.date&&val.date.length>0) {
        this.params.param.startTime = this.$moment(val.date[0]).format('YYYY-MM-DD')
        this.params.param.endTime = this.$moment(val.date[1]).format('YYYY-MM-DD')
        delete this.params.param.date;
      }
      this.getMarketPlanList(this.params)
    },
    changeSize(val) {
      this.params.page = 1;
      this.params.pageSize = val
      this.getMarketPlanList(this.params)
    },
    changeCurrent(val) {
      this.params.page = val
      this.getMarketPlanList(this.params)
    },
  },
}
</script>


<style lang="less" scoped>
</style>
