<template>
<!-- 活动执行管理 -->
  <div class="vlt-card execu-manage">
    <search-bar class="search-bar-demo" :options="options" :total="total" @search="search" labelWidth="6em">
      <el-button type="primary" 
        size="small" 
        @click="allotTask" 
        slot="extend-bar"
        icon="el-icon-plus"
        :id="'executionManage-allotTask'" 
        v-has="'executionManage-allotTask'">
        分配任务</el-button>
    </search-bar>
    <el-table :data="executionData" border>
      <el-table-column type="index" label="序号" width="60px" fixed="left">
        <template slot-scope="scope">
          {{params.pageSize*(params.page-1)+(scope.$index+1)}}
        </template>
      </el-table-column>
      <el-table-column prop="activityName" label="活动名称" min-width="200" show-overflow-tooltip></el-table-column>
      <el-table-column prop="planTitle" label="计划标题" min-width="180" show-overflow-tooltip></el-table-column>
      <el-table-column prop="taskName" label="任务名称" min-width="180" show-overflow-tooltip></el-table-column>
      <el-table-column prop="status" label="任务状态" min-width="120">
        <template slot-scope="scope">
          <span
            class="icon-circle"
            :class="{
              blue:scope.row.status=='3',
              green:scope.row.status=='1',
              grey:scope.row.status=='4',
              yellow:scope.row.status=='5',
              red:scope.row.status=='2',
            }"
          >{{scope.row.strStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="taskNameProgress" label="任务进度" min-width="100"></el-table-column>
      <el-table-column prop="executeUser" label="执行人" min-width="200" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createTime" label="发布时间" min-width="180"></el-table-column>
      <el-table-column prop="completeTime" label="完成时间" min-width="180"></el-table-column>
      <el-table-column label="操作" fixed="right" width="100px">
        <template slot-scope="scope">
          <el-button :id="'executionManage-detail' + scope.$index" type="primary" size="mini" @click="detail(scope.row.id)" v-has="'executionManage-detail'">查看</el-button>
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
import { async } from 'q';
export default {
  name: "executionManage",
  data() {
    return {
      options: [
        {
          type: "input",
          prop: "activityName",
          value: "",
          title: "活动名称"
        },
        {
          type: "input",
          prop: "executeUser",
          value: "",
          title: "执行人"
        },
      ],
      executionData: [],
      rules1: { rule: "" },
      params: {
        page:1,
        pageSize: 20,
        param:{insId: this.$storage.get("userInfo").insId}
      },
      total:0
    };
  },
  created() {
    this.getList(this.params)
  },
  methods: {
    getList(data) {
      const self = this;
      (async data =>{
        let res = await self.$api.executionPlanList({ data })
        console.log(res)
        if (res && res.code == 0) {
          self.total = res.data.total
          
          let options = {
            1: "进行中",
            2: "已完成"
          };
          res.data.records.forEach(item =>{
            item.strStatus = options[item.status]
            if (item.taskNameProgress) {
              let num = parseFloat(item.taskNameProgress)
              item.taskNameProgress = num.toFixed(2) + '%'
            }
          })
          self.executionData = res.data.records;
        }
      })(data)
    },
    getState(val){
      let obj = {
        1: "进行中",
        2: "已完成"
      }
      return obj[val]
    },
    search(val) {
      this.params.param = {...val}
      this.params.param.insId = this.$storage.get("userInfo").insId
      console.log(this.params)
      this.getList(this.params)
    },
    allotTask() {
      this.$router.push({ path: "allotTask" ,query:{isShowChild: 0}});
    },
    detail(id) {
      this.$router.push({ path: "executionDetail", query: { id } });
    },
    handleSizeChange(val) {
      this.params.pageSize = val;
      this.getList(this.params)
    },
    handleCurrentChange(val) {
      this.params.page = val;
      this.getList(this.params)
    }
  },
};
</script>


<style lang="less" scoped>
@import "./less/index";
</style>