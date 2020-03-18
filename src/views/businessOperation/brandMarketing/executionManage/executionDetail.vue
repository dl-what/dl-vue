<template>
  <div class="vlt-card execution-detail">
    <panel title="基础信息" :show = 'true' style="margin-bottom: 15px">
      <base-Info :infoList="baseData"></base-Info>
    </panel>
    <panel title="执行记录" class="execution-record" :show = 'true'>
      <div v-for="(item,index) in recordList" :key="index">
        <ul class="execution-info">
          <li>执行人： {{item.executeUser}}</li>
          <li>处理时间： {{item.dealTime}}</li>
          <li>处理说明： {{item.dealRemark}}</li>
        </ul>
        <!-- <div class="img-box">
          <p>图片上传:</p>
          <el-button type="text" class="detali" @click="detail">查看</el-button>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="item.src" alt="">
          </el-dialog>
        </div> -->
      </div>
      <div>
        
      </div>
    </panel>
  </div>
</template>

<script>
export default {
  data() {
    return {
      baseData: [
        { title: "活动名称", value: "", prop: "activityName" },
        { title: "计划标题", value: "", prop: "planTitle" },
        { title: "计划内容", value: "", prop: "planContent" },
        { title: "任务名称", value: "", prop: "taskName" },
        { title: "任务描述", value: "", prop: "taskRemark" },
        { title: "分配维度", value: "", prop: "distributionDimension" },
        { title: "执行人", value: "", prop: "executeUser" },
        { title: "截止时间", value: "", prop: "completeTime" },
        { title: "状态", value: "", prop: "status" },
        { title: "任务进度", value: "", prop: "taskNameProgress" }
      ],
      dialogVisible:false,
      recordList: []
    };
  },
  created() {
    this.getDetail()
  },
  methods: {
    async getDetail() {
      const self = this;
      let obj = {
        1: "进行中",
        2: "已完成"
      };
      let list = {
        1: "按机构分配",
        2: "按渠道角色分配"
      }
      const data = self.$route.query.id
      console.log(data)
      let res = await self.$api.executionDetail( {data} )
      if (res && res.code == 0) {
        console.log(res)
        self.baseData.forEach(item =>{
          for (let i in res.data) {
            item.value = res.data[item.prop]
            if (item.prop == "status") {
              item.value = obj[res.data.status]
            }
            if (item.prop == "distributionDimension") {
              item.value = list[res.data.distributionDimension]
            }
            if (item.prop == "taskNameProgress") {
              let num = parseFloat(res.data.taskNameProgress)
              item.value = num.toFixed(2) + '%'
            }
          }
        })
        let listData = res.data.executionRecordingList
        let arr = listData.map(item =>{return {executeUser: item.executeUser, dealTime: item.dealTime, dealRemark: item.dealRemark}})
        self.recordList = arr
      }
    },
    detail(){
      this.dialogVisible = true;
    }
  }
};
</script>

<style lang="less" scoped>
@import "./less/index";
</style>