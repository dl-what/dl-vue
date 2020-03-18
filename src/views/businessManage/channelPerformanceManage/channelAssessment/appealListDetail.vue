<template>
  <div class="vlt-card">
    <!-- 申述列表详情 -->
    <panel title="基础信息" :show="true">
      <base-info :infoList="baseData"></base-info>
    </panel>
    <panel title="申诉指标" :show="true" style="margin-top:50px">
    <div class="vlt-edit-single">
      <div class="vlt-edit-wrap">
    <el-table
      border
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%; margin-top:50px"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="序号" fixed type="index"></el-table-column>
      <el-table-column prop="targetName" label="指标名称"></el-table-column>
      <el-table-column prop="targetCategory" label="考核类别">
          <template slot-scope="scope">{{translateTargetCategory(scope.row.targetCategory)}}</template>
      </el-table-column>
      <el-table-column prop="conditionValue" label="考核条件">
      </el-table-column>
      <el-table-column prop="score" label="考核得分">
        <template slot-scope="scope">
            <input class="edit-cell" v-if="showEdit"    v-model="scope.row.score">
            <span v-if="!showEdit">{{scope.row.score}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-form label-position="right" label-width="100px" ref="form" :rules="rules" :model="form" class="baseInfo">
      <el-form-item label="申诉内容">
        <el-input type="textarea" v-model="form.reason" maxlength="150"></el-input>
      </el-form-item>
      <el-form-item label="申诉处理" prop="a">
              <el-radio v-model="form.a" label=0>不修改</el-radio>
              <el-radio v-model="form.a" label=1>修改分数</el-radio>
            </el-form-item>
      <el-form-item label="处理意见">
        <el-input type="textarea" v-model="form.handleRemark" maxlength="150"></el-input>
      </el-form-item>
    </el-form>
    </div>
    </div>
    </panel>
  </div>
</template>

<script type="text/javascript">
import moment from "moment";
export default {
  name: "",
  data() {
    return {
      showEdit:false,
      form:{
        a:"",
        reason:"",
        handleRemark:""
      },
      tableData:[],
      baseData: [
        { title: "渠道编号", value: "", prop: "channelNo" },
        { title: "渠道类型", value: "", prop: "channelType" }, //
        { title: "所属机构", value: "", prop: "versionCode" },  //
        { title: "定性得分", value: "", prop: "softwareSize" }, //
        { title: "定量得分", value: "", prop: "softType" },    
        { title: "综合得分", value: "", prop: "score" },   
        { title: "考核年月", value: "", prop: "targetName" },        
        { title: "申诉时间", value: "", prop: "handleDate" },
      ],
      rules:{},
    };
  },
  components: {},
  created() {
     const routerQuery = this.$route.query.ifo;
    if (routerQuery) {
      console.log("routerQuery是", routerQuery);
      let obj = {}
      obj.appealId=routerQuery.id
      obj.examineId=routerQuery.examineId
      let data=obj
      this.channelAppealDetail(data);
      this.baseData.forEach(item=>{     //基础信息回显
        item.value=routerQuery[item.prop]
        if (item.prop == "handleDate") {
            item.value = this.translateTime(routerQuery[item.prop]);
          }
          if (item.prop == "channelType") {
            item.value = this.translateChannelType(routerQuery[item.prop]);
          }
      })
      for(let i in this.form){     //申述内容回显
        this.form[i]=routerQuery[i]
      }
    }
  },
  methods: {
    translateTargetCategory(val) { 
      let options = { 1: "绩效考核", 2: "等级考核",};
      return options[val];
    },
    translateChannelType(val) { 
      let options = { 0: "自营厅", 1: "合作厅",};
      return options[val];
    },
    translateTime(val){
      return moment(val).format("YYYY-MM-DD HH:mm:ss");
    },
   async channelAppealDetail(data) {
      let res = await this.$api.channelAppealDetail({data});
      if (res && res.code == 0) {
        // if (res.data != null && res.data.length > 0) {
        console.log("查看结果", res);
        this.tableData=res.data
      } else {
        this.$message.warning(res.msg);
      }
    },
   handleSelectionChange(){

   },

  }
};
</script>

<style lang="less" scoped>
.baseInfo{
  margin-top:100px;
}
</style>
