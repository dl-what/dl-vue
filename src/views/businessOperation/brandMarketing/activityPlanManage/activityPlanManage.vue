<template>
  <div class="vlt-card activityPlanManage-page">
    <search-bar :options="options" :total="total" @search="search" labelWidth="6em">
      <control-bar slot="extend-bar" @select="select" :options="controlOptions" position="left"></control-bar>
    </search-bar>
    <el-table :data="activeList" border @selection-change="handleSelectionChange" :row-key="getRowKeys">
      <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
      <el-table-column type="index" label="序号" width="55px" fixed="left">
        <template slot-scope="scope">
          {{params.pageSize*(params.page-1)+(scope.$index+1)}}
        </template>
      </el-table-column>
      <el-table-column prop="activityCode" label="活动编号" min-width="260"></el-table-column>
      <el-table-column prop="activityName" label="活动名称" min-width="200"></el-table-column>
      <el-table-column prop="status" label="状态" min-width="120">
        <template slot-scope="scope">
          <span
            class="icon-circle"
            :class="{
            blue:scope.row.status=='1',
            green:scope.row.status=='2',
            grey:scope.row.status=='4',
            yellow:scope.row.status=='5',
            red:scope.row.status=='3',
            }"
          >{{scope.row.strStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="活动开始时间" min-width="160"></el-table-column>
      <el-table-column prop="endTime" label="活动结束时间" min-width="160"></el-table-column>
      <el-table-column prop="createName" label="创建人" min-width="120"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="160"></el-table-column>
      <el-table-column label="操作" fixed="right" width="160">
        <template slot-scope="scope">
          <el-button :id="'activityPlanManage-detail' + scope.$index" type="primary" size="mini" @click="planDetail(scope.row.id)" v-has="'activityPlanManage-detail'">查看</el-button>
          <el-button :id="'activityPlanManage-reuse' + scope.$index" size="mini" @click="reuse(scope.row.id)" v-if="scope.row.status == 2 || scope.row.status == 3" v-has="'activityPlanManage-reuse'">复用</el-button>
          <el-button :id="'activityPlanManage-backout' + scope.$index" type="danger" size="mini" @click="backout(scope.row.id)" v-if="scope.row.status == 1" v-has="'activityPlanManage-backout'">撤销</el-button>
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

<script>
export default {
  name: "activityPlanManage",
  data() {
    return {
      tableChecked: [],  //被选中的数据
      delArr:[],    //批量注销的id
      activeList: [],
      controlOptions: [
        {name: '新建活动', type: 'primary', icon: 'plus', permission: 'activityPlanManage-add'},
        {name: '批量撤销', icon: 'delete', permission: 'activityPlanManage-add'},
      ],
      options: [
        {
          type: "input",
          prop: "activityCode",
          value: "",
          title: "活动编号"
        },
        {
          type: "input",
          prop: "activityName",
          value: "",
          title: "活动名称"
        },
        {
          type: "datepicker-range",
          prop: "rangeTime",
          value: "",
          title: "起止时间"
        }
      ],
      params: {
        page: 1,
        pageSize: 20,
        param:{insId: this.$storage.get("userInfo").insId}
      },
      total:0
    };
  },
  created(){  
    this.getActivityPlanTep()
  },
  methods: {
    getActivityPlanTep() {
      const self = this;
      let data = self.params;
      (async data=>{
        let res = await self.$api.getActivityPlan({ data })
        console.log(res)
        if (res && res.code == 0) {
          self.total = res.data.total
          let options = {
            1: '未开始',
            2: '进行中',
            3: '已结束'
          };
          res.data.records.forEach((item)=>{
            item.strStatus = options[item.status]
          })
          self.activeList = res.data.records
        }
      })(data)
    },
    getStatus(val) {
      let options = {
        1: '未开始',
        2: '进行中',
        3: '已结束'
      }
      return options[val]
    },
    search(val) {
      let data = {}
      let rangeTime = val.rangeTime
      if (rangeTime && rangeTime.length > 0) {
        data.startTime = this.$moment(rangeTime[0]).format("YYYY-MM-DD")
        data.endTime = this.$moment(rangeTime[1]).format("YYYY-MM-DD")
      }
      data.activityCode = val.activityCode
      data.activityName = val.activityName
      data.insId = this.$storage.get("userInfo").insId;
      this.params.page = 1;
      this.params.param = {...data}
      console.log("搜索",this.params)
      this.getActivityPlanTep(this.params)
    },
    createActive() {
      this.$router.push({ path: "activityCreate" });
    },
    planDetail(id) {
      this.$router.push({ path: "planDetail", query:{id}});
    },
    // 复用
    reuse(id) {
      this.$router.push({ path: "reuse", query: {id}});
    },
    // 撤销
    backout(val) {
      const self = this;
      this.$confirm('是否确认撤销?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(async () => {
        let data = val;
        let res = await self.$api.activityBackOut( {message: "撤销成功", data} )
        if (res && res.code == 0 ) {
          this.getActivityPlanTep()
        }
      }).catch(() => {
        this.$message({
          type: 'warning',
          message: '已取消撤销'
        });          
      });
    },
    handleSelectionChange(val){
      this.tableChecked = val;
    },
    getRowKeys(row){
      return row.id
    },
    // 批量撤销
    batchBackout(arr){
      if (arr.length == 0) {
        this.$message.warning("请选择要撤销的活动")
        return;
      }
      this.$confirm('是否确认撤销?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(async () => {
        for (let i = 0; i <= arr.length - 1; i++) {
          if (arr[i].status == 2 || arr[i].status == 3) {
            this.$message.warning("状态为进行中和已结束的活动不能被撤销")
            return;
          }
          this.delArr.push(arr[i].id)
        }
        console.log(this.delArr)
        let data = {};
        data.idList = this.delArr
        let res = await this.$api.batchBackout({ message:"撤销成功", data })
        if (res && res.code == 0) {
          this.getActivityPlanTep()
        }
      }).catch(() => {
        this.$message({
          type: 'warning',
          message: '已取消撤销'
        });          
      });
    },
    handleSizeChange(val) {
      this.params.pageSize = val;
      this.getActivityPlanTep(this.params)
    },
    handleCurrentChange(val) {
      this.params.page = val;
      this.getActivityPlanTep(this.params);
    },
    select(val) {
      if (val.name == "新建活动") {
        this.createActive()
      };
      if (val.name == "批量撤销") {
        let arr = this.tableChecked
        this.batchBackout(arr)
      }
    }
  },

};
</script>
<style lang="less" scoped>
.activityPlanManage-page{
  .el-icon-plus:before{
    margin-right: 5px;
  }
}
</style>