<template>
  <!-- 考核项设置查看 -->
  <div class="vlt-card new-indicator">
    <panel title="考核项详情" :show="true" style="margin-bottom:15px">
      <div class="vlt-edit-single">
        <div class="vlt-edit-wrap">
          <el-form :rules="rules" ref="form" labelWidth="130px" :model="form">
            <el-form-item label="考核名称" prop="name">
              <el-input v-model="form.name" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="考核类型" prop="appraisalType">
              <el-select placeholder="请选择" v-model="form.appraisalType"  :disabled="true">
                <el-option
                  v-for="item in assessType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="渠道类型" prop="channelType">
              <el-select placeholder="请选择" v-model="form.channelType"  :disabled="true">
                <el-option
                  v-for="item in channelOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="生效时间" prop="date">
              <el-date-picker
                type="monthrange"
                v-model="form.date"
                range-separator="至"
                start-placeholder="开始月份"
                end-placeholder="结束月份"
                :disabled="true"
              ></el-date-picker>
          </el-form-item>
          <el-form-item label="考核最高分" prop="highestScore">
              <el-input v-model="form.highestScore"  :disabled="true"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </panel>
    <panel title="考核指标" :show="true" style="margin-bottom:15px">
      <div class="table-wrap">
        <el-table
          border
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column label="序号" fixed type="index" width="55"></el-table-column>
          <el-table-column prop="targetName" label="指标名称"></el-table-column>
          <el-table-column prop="targetType" label="指标类别">
            <template slot-scope="scope">{{translateTargetType(scope.row.targetType)}}</template>
          </el-table-column>
          <el-table-column prop="channelType" label="渠道类型">
            <template slot-scope="scope">{{translateChannelType(scope.row.channelType)}}</template>
          </el-table-column>
          <el-table-column prop="targetCategory" label="考核类别">
            <template slot-scope="scope">{{translateTargetCategory(scope.row.targetCategory)}}</template>
          </el-table-column>
          <el-table-column prop="conditionScores" label="考核分值"></el-table-column>
        </el-table>
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
      form: {
        name: null,
        highestScore: null,
        appraisalType:null,
        insId: 1,
        channelType: null,
        date: [],
      },
      showLoading: false,
      tableData:[],
      assessType:[
        { label: "绩效考核", value: 0},
        { label: "等级考核", value: 1}
      ],
      channelOptions: [
        { label: "自营厅", value: 0 },
        { label: "合作厅", value: 1 }
      ],
      rules: {
        name: [{ required: true, message: "不能为空", trigger: ['change','blur'] }],
        type: [{ required: true, message: "不能为空", trigger: ['change','blur'] }],
        type2: [{ required: true, message: "不能为空", trigger: ['change','blur'] }],
        type3: [{ required: true, message: "不能为空", trigger: ['change','blur'] }],
        type4: [{ required: true, message: "不能为空", trigger: ['change','blur'] }]
      }
    };
  },
  components: {},
  created() {
    const routerQuery = this.$route.query;
    if (routerQuery && routerQuery.id) {
      let channelAppraisalId = routerQuery.id;
      console.log("data是", channelAppraisalId);
      let data = channelAppraisalId;
      this.channelAppraisalDetail(data);
    }
  },
  methods: {
    translateTargetType(val){
      let options = { 0: "定性考核", 1: "定量考核" };
      return options[val];
    },
    translateTargetCategory(val) {
      let options = { 0: "大厅管理", 1: "大厅维护",2:"业务培训",3:"彩民服务" };
      return options[val];
    },
    translateChannelType(val) {
      let options = { 0: "自营厅", 1: "合作厅" };
      return options[val];
    },
    async channelAppraisalDetail(data) {
      let res = await this.$api.channelAppraisalDetail({ data });
      if (res && res.code == 0) {
        // if (res.data != null && res.data.length > 0) {
        console.log("查看结果", res);
      //  this.form.date=this.form.date.push(res.data.effectiveTime,res.data.failureTime)
      //  console.log(this.form.date)
       
        this.tableData=res.data.channelExamineTargetList
        for(let i in this.form){
          this.form[i]=res.data[i]
          if(i=="date"){
            this.form[i]=[res.data.effectiveTime,res.data.failureTime]
          }
        }
      } else {
        this.$message.warning(res.msg);
      }
    },
    changeForm() {},
    handleSelectionChange(){

    },
    close() {
      this.$router.back();
    }
  }
};
</script>


<style lang="less" scoped>
.table-wrap{
  padding: 10px;
}
.vlt-edit-wrap{
  padding-top: 30px;
}
</style>
