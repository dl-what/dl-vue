<template>
<div class="vlt-card examinationDetail">
  <panel title="基本信息" :show="true" style="margin-bottom: 20px">
    <base-info :infoList="infoList"></base-info>
  </panel>
  <panel title="考卷情况" :show="true" style="margin-bottom: 20px">
    <base-info :infoList="paperList"></base-info>
    <!-- <div class="topic-box">
      <p >考试题目：</p>
      <el-button :id="'examinationDetail-check'" type="text" class="btn" @click="check">查看</el-button>
    </div> -->
  </panel>
  <panel title="考试样单" :show="true">
    <div class="table-wrap">
      <el-table :data="tableData" border class="table">
        <el-table-column type="index" label="序号" fixed="left" width="60px">
          <template slot-scope="scope">
            {{params.pageSize*(params.page-1)+(scope.$index+1)}}
          </template>
        </el-table-column>
        <el-table-column label="考试人员名单" prop="userName" min-width="100px"></el-table-column>
        <el-table-column label="所属机构" prop="insName" min-width="120px"></el-table-column>
        <el-table-column label="所属渠道" prop="channelNo" min-width="120px"></el-table-column>
        <el-table-column label="单选题得分" prop="singleScore" min-width="100px"></el-table-column>
        <el-table-column label="多选题得分" prop="multiScore" min-width="100px"></el-table-column>
        <el-table-column label="总得分" prop="myScore" min-width="100px"></el-table-column>
        <el-table-column label="是否合格" prop="isPass" min-width="100px">
          <template slot-scope="scope">
            {{getIsPass(scope.row.isPass)}}
          </template>
        </el-table-column> 
        <el-table-column fixed="right" label="操作" min-width="160px">
          <template slot-scope="scope">
            <el-button :id="'examinationDetail-detail' + scope.$index" type="text" @click="detail(scope.row.userId,scope.row.examId)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <table-paging position="right" :total="total" :currentPage="params.page" :pageSize="params.pageSize" 
      @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></table-paging>
    </div>
  </panel>
</div>
</template>

<script type="text/javascript">
import { async } from 'q';
export default {
name: "examinationDetail",
data() {
return {
  infoList: [
    { title: "培训课程", value: "", prop: "courseName" },
    // { title: "培训类型", value: "", prop: "cycleType" },
    { title: "考试人员", value: "", prop: "examCount" },
    { title: "培训对象", value: "", prop: "trainObjectsName" },
  ],
  paperList: [
    { title: "考试总分", value: "", prop: "totalScore" },
    { title: "合格分", value: "", prop: "passScore" },
    { title: "单选题数", value: "", prop: "singleNum" },
    { title: "多选题数", value: "", prop: "multiNum" },
  ],
  tableData: [],
  params: {
    page: 1,
    pageSize: 20,
    param: {
      examId: this.$route.query.id,
      trainId: this.$route.query.trainId
    }
  },
  
  total: 0,
  detailData: null,
  accountRole: null,
  trainObjects: null,
  trainObjectsName: null
}
},
created() {
  this.getDetailData();
  this.getTableData();
  
},
methods: {
  getTableData() {
    const self = this;
    let data = self.params;
    (async data =>{
      let res = await self.$api.gettrainExamDetailList({ data })
      console.log(res)
      if (res && res.code == 0) {
        self.total = res.data.total;
        self.tableData = res.data.records
      }
    })(data)
  },
  getDetail() {
    let data = this.detailData;
    this.infoList.forEach(item =>{
      item.value = data[item.prop];
      if (item.prop == "examCount") {
        item.value = this.$route.query.examCount;
      };
      if (item.prop == "trainObjectsName") {
        item.value = this.trainObjectsName;
      }
    })
    this.paperList.forEach(el =>{
      if(el.prop == "totalScore" || el.prop == "passScore") {
        el.value = data[el.prop]?`${data[el.prop]} 分`: '0 分'
      }
      if(el.prop == "singleNum" || el.prop == "multiNum") {
        el.value = data[el.prop]?`${data[el.prop]}  题`: '0 题'
      }
    })
  },
  getDetailData() {
    const self = this;
    let data = {
      id: this.$route.query.id,
      trainId: this.$route.query.trainId
    };
    (async data =>{
      let res = await self.$api.examinationArchivesDetail({ data });
      console.log("Data",res)
      if (res && res.code == 0) {
        this.detailData = res.data;
        this.trainObjects = res.data.trainObjects.substr(1).split(',');
        this.getAccountRole();
      }
    })(data)
  },
  detail(userId,examId) {this.$router.push({name: "examDetail", query: { userId: userId, examId: examId, trainId: this.$route.query.trainId }})},
  check() {
    this.$router.push({name: "examQuestion", query: {examId: this.params.param.examId}})
  },
  handleSizeChange(val) {
    this.params.page = 1;
    this.params.pageSize = val;
    this.getTableData(this.params)
  },
  handleCurrentChange(val) {
    this.params.page = val;
    this.getTableData(this.params)
  },
  // 查询所有角色
  async getAccountRole () {
    let res = await this.$api.accountRole()
    if (res && res.code == 0) {
      console.log("角色",res.data)
      this.accountRole = res.data;
      let obj = {};
      this.accountRole.forEach((item)=>{
        obj[item.value] =  item.label;
      })
      console.log(obj);
      let array = []
      this.trainObjects.forEach(item =>{
        if (item != "") {
          array.push(obj[item])
        }
      });
      this.trainObjectsName = array.join(',');
      this.getDetail();
    }
  },
  getIsPass(val) {
    let obj = {
      0: "不合格",
      1: "合格"
    }
    return obj[val]
  }
},
}
</script>

<style lang="less" scoped>
.examinationDetail{
  .btn{
    margin-left: 20px;
    margin-top: -40px
  }
  p{display: inline-block}
  .topic-box{
    margin-left: 20px;
    display: inline-block;
  }
  .table-wrap{
    padding: 10px;
  }

  
}

</style>
