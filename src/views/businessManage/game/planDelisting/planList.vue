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
      <el-table-column label="序号" fixed width="55">
        <template slot-scope="scope">
          {{params.pageSize*(params.page - 1) + (scope.$index+1)}}
        </template>
      </el-table-column>
      <el-table-column prop="leaveCode" label="计划编号" min-width="120px"></el-table-column>
      <el-table-column prop="leaveName" label="计划名称" min-width="160px"></el-table-column>
      <el-table-column prop="versionNumber" label="当前版本" width="160px"></el-table-column>
      <el-table-column prop="gameName" label="退市游戏" min-width="120px"></el-table-column>
      <el-table-column prop="leaveTime" label="退市时间" width="160px"></el-table-column>
      <el-table-column prop="leaveStatus" label="计划状态" min-width="100px">
        <template slot-scope="scope">
          <span class="icon-circle" 
            :class="{
              blue:scope.row.leaveStatus=='1',
              green:scope.row.leaveStatus=='3',
              red:scope.row.leaveStatus=='2',}">
              {{scope.row.strStatus}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="创建人" min-width="100px"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="160"></el-table-column>
      <el-table-column fixed="right" label="操作" min-width="120">
        <template slot-scope="scope">
          <div style="text-align:left;">
            <el-button type="primary" size="mini" v-has="'gameDelistingPlanList-detail'" @click.native="detail(scope.row)"
            :id="$route.name+'-'+'detail'+scope.$index">查看</el-button>
            <el-button  size="mini" v-has="'gameDelistingPlanList-edit'" :disabled="scope.row.leaveStatus!='1'" @click.native="edit(scope.row)" :id="$route.name+'-'+'edit'+scope.$index">编辑</el-button>
          </div>
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
import { mapGetters } from 'vuex'

export default {
  name: 'gameDelistingPlanList',
  data() {
    return {
      controlOptions: [
        { name: "新建退市计划", type: "primary", icon: "plus", permission: 'gameDelistingPlanList-add' }, // type为按钮的五种颜色， icon为具体的图标
      ],
      tableData: [],
      searchOptions:[
        {title: '计划编号',type: 'input', prop: 'leaveCode', value: '', maxlength: 20},
        {title: '计划名称', type: 'input', prop: 'leaveName', value: '', maxlength: 20},
        {title: '退市游戏', type: 'input', prop: 'gameName', value: '', maxlength: 20},
        {title: '计划状态', type: 'select', prop: 'leaveStatus', value: '', options: [{label: '未开始',value: 1},{label: '已退市',value: 2},{label: '退市兑奖',value: 3}]},
        {title: '退市时间', type: 'datepicker-range', prop: 'date', value: '', placeholder: ['开始日期', '结束日期']},

      ],
      total: 1,
      params: {
        page: 1,
        pageSize: 20,
        param: {},
      },
      // insData: [],
    }
  },
  created() {
    // this.getInsData();
    this.getDelistingPlanList(this.params)
  },
  computed: {
    ...mapGetters(['insData'])
  },
  methods: {
    translateStatus(val) {
      let options = {
        1: '审批中',
        2: '审批通过',
        3: '审批拒绝',
      }
      return options[val]
    },
    // 获取机构数据
    getInsData() {
      const self = this;
      const data = {};
      (async (data)=>{
				let res = await self.$api.QueryUserAndInsTree({data})
				if(res && res.code == 0) {
          console.log('res', res.data)
          self.insData = res.data;
          self.getDelistingPlanList(self.params)
				}
      })(data)
    },
    getInsArray(val) {
      let arr = val.split(',');
      let textArray = [];
      arr.forEach((item)=>{
        let array = this.$formMethods.getInsArray(item, 'id', this.insData, 'text')
        // let str = array&&array.reverse().join('/')
        let str;
        if(array&&array.length>2) {
          str = `${array[1]}${array[0]}`
        }else{
          str = array&&array[0];
        }
        console.log(str)
        textArray.push(str)
      })
      return textArray.join('；')
    },
    getDelistingPlanList(data) {
      const self = this;
      (async (data)=>{
				let res = await self.$api.getDelistingPlanList({data})
				if(res && res.code == 0) {
          console.log(res.data)
          self.total = res.data.total;
          self.tableData = res.data.records;
          let options = {
            1: '未开始',
            2: '已退市',
            3: '退市兑奖',
          };
          if (self.tableData.length > 0) {
            self.tableData.forEach(item => {
              item.strStatus = options[item.leaveStatus]
              item.leaveTime = self.$moment(item.leaveTime).format('YYYY-MM-DD HH:mm:ss')
              item.createTime = self.$moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
            })
          }
				} else {
          // self.$message.warning(res.msg)
        }
      })(data)
    },
    //查看页面跳转
    detail (val) {
      this.$router.push({
        path: './planDetail',
        query: {id: val.id, gameId: val.gameId, type: 1}
      })
    },
    selectBtn() {
      this.$router.push({path: './createPlan'})
    },
    edit(val) {
      this.$router.push({
        path: './editPlan',
        query: {id:val.id,gameId:val.gameId}
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
      this.getDelistingPlanList(this.params)
    },
    changeSize(val) {
      this.params.page = 1;
      this.params.pageSize = val
      this.getDelistingPlanList(this.params)
    },
    changeCurrent(val) {
      this.params.page = val
      this.getDelistingPlanList(this.params)
    },
  },
}
</script>


<style lang="less" scoped>
</style>
