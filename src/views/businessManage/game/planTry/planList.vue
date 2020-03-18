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
      <el-table-column prop="gamePlayCode" label="计划编号" min-width="120px"></el-table-column>
      <el-table-column prop="gamePlayName" label="计划名称" min-width="160px"></el-table-column>
      <el-table-column prop="versionNumber" label="版本号" min-width="120px"></el-table-column>
      <el-table-column prop="gameName" label="试玩游戏" min-width="120px"></el-table-column>
      <el-table-column label="计划状态" min-width="120px">
        <template slot-scope="scope">
          <span class="icon-circle" 
            :class="{
              blue:scope.row.gamePlayStatus=='1',
              green:scope.row.gamePlayStatus=='2',
              red:scope.row.gamePlayStatus=='3',}">
              {{scope.row.strStatus}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="startPlayTime" label="开始时间" min-width="160px"></el-table-column>
      <el-table-column prop="endPlayTime" label="结束时间" min-width="160px"></el-table-column>
      <el-table-column prop="userName" label="创建人" min-width="120px"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="160px"></el-table-column>
      <el-table-column fixed="right" label="操作" min-width="240px">
        <template slot-scope="scope">
          <div style="text-align:center;">
            <el-button type="primary" size="mini" v-has="'trialPlanList-detail'" @click.native="detail(scope.row)">查看</el-button>
            <el-button  size="mini" :disabled="scope.row.gamePlayStatus!='1'" v-has="'trialPlanList-edit'" @click.native="edit(scope.row)">编辑</el-button>
            <el-button type="danger" :disabled="scope.row.gamePlayStatus!='2'" size="mini" v-has="'trialPlanList-stop'" @click.native="stopGame(scope.row)">终止试玩</el-button>
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
import moment from 'moment'
import {mapGetters} from 'vuex'

export default {
  name: 'gameMarketPlanList',
  data() {
    return {
      controlOptions: [
        { name: "新建试玩计划", type: "primary", icon: "plus", permission: 'trialPlanList-add' }, // type为按钮的五种颜色， icon为具体的图标
      ],
      tableData: [],
      searchOptions:[
        {type: 'input', prop: 'gamePlayCode', value: '', title: '计划编号', maxlength: 20},
        {type: 'input', prop: 'gamePlayName', value: '', title: '计划名称', maxlength: 20},
        {type: 'input', prop: 'gameName', value: '', title: '试玩游戏', maxlength: 20},
        {
          type: 'select', prop: 'gamePlayStatus', value: '', title: '计划状态', placeholder: '请选择',
          options: [
            {
              label: '未开始',
              value: 1
            },
            {
              label: '试玩中',
              value: 2
            },
            {
              label: '已结束',
              value: 3
            }
          ]
        },
        {type: 'datepicker-range', prop: 'date', value: '', title: '开始时间', placeholder: ['开始日期', '结束日期']},
        {type: 'datepicker-range', prop: 'datend', value: '', title: '结束时间', placeholder: ['开始日期', '结束日期']},
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
    this.getTryPlanList(this.params)
  },
  computed: {
    ...mapGetters(['insData'])
  },
  methods: {
    // 终止试玩
    stopGame(val) {
      const self = this;
      self.$confirm('此操作将终止试玩该游戏, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          self.getTryGameStop(val)
      }).catch(() => {
        self.$message({
          type: 'warning',
          message: '已取消'
        });          
      });
    },
    // 终止试玩
    getTryGameStop(val) {
      const self = this;
      const data = {
        gameId: val.gameId,
        playPlanId: val.id
      };
      (async (data)=>{
				let res = await self.$api.getTryGameStop({data})
				if(res && res.code == 0) {
          console.log('res', res.data)
          self.$message.success('操作成功')
          self.getTryPlanList(self.param)
				}
      })(data)
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
          self.getTryPlanList(self.param)
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
    getTryPlanList(data) {
      const self = this;
      (async (data)=>{
        let res = await self.$api.getTryPlanList({data})
        console.log(res);
				if(res && res.code == 0) {
          self.total = res.data.total;
          let options = {
            1: '未开始',
            2: '试玩中',
            3: '已结束',
          };
          res.data.records.forEach(item => {
            item.strStatus = options[item.gamePlayStatus];
            item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
            item.startPlayTime = item.startPlayTime&&moment(item.startPlayTime).format('YYYY-MM-DD HH:mm:ss');
            item.endPlayTime = item.endPlayTime&&moment(item.endPlayTime).format('YYYY-MM-DD HH:mm:ss');
          })
          self.tableData = res.data.records;
				}
      })(data)
    },
    //查看页面跳转
    detail(val) {
      this.$router.push({
        path: './planDetail',
        query: {gameId:val.gameId,id:val.id,deployCode:val.deployCode,type: 1, gameStatus: 2}
      })
    },
    selectBtn() {
      this.$router.push({path: './createPlan',query:{type: 1,gameStatus: 2,}})
    },
    edit(val) {
      this.$router.push({
        path: './editPlan',
        query: {gameId:val.gameId,id:val.id,deployCode:val.deployCode,type:1,gameStatus: 2}
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
      if(val.datend&&val.datend.length>0) {
        this.params.param.startDate = this.$moment(val.datend[0]).format('YYYY-MM-DD')
        this.params.param.endDate = this.$moment(val.datend[1]).format('YYYY-MM-DD')
        delete this.params.param.datend;
      }
      this.getTryPlanList(this.params)
    },
    changeSize(val) {
      this.params.page = 1;
      this.params.pageSize = val
      this.getTryPlanList(this.params)
    },
    changeCurrent(val) {
      this.params.page = val
      this.getTryPlanList(this.params)
    },
  },
}
</script>


<style lang="less" scoped>
</style>
