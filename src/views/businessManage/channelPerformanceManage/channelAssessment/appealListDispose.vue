<template>
  <div class="vlt-card">
    <!-- 申诉列表详情 -->
    <panel title="申诉信息" :show="true">
      <base-info :infoList="baseData"></base-info>
    </panel>
    <panel title="申诉指标" :show="true" style="margin-top:30px">
    <div class="vlt-edit-single">
      <div class="vlt-edit-wrap">
    <el-table border ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange" >
      <el-table-column label="序号" fixed type="index"></el-table-column>
      <el-table-column prop="targetName" label="指标名称"></el-table-column>
      <el-table-column prop="targetCategory" label="考核类别">
          <template slot-scope="scope">{{translateTargetCategory(scope.row.targetCategory)}}</template>
      </el-table-column>
      <el-table-column prop="conditionValue" label="考核条件">
      </el-table-column>
      <el-table-column prop="examineScore" label="考核得分">
        <template slot-scope="scope">
          <!-- :disabled="scope.row.isNewAppeal?false :true"  -->
          <el-input class="edit-cell" v-model.number="scope.row.examineScore" :disabled="scope.row.disabled"   maxlength="3"></el-input>
          <!-- <span v-if="!showEdit">{{scope.row.score}}</span> -->
        </template>
      </el-table-column>
    </el-table>
    <el-form label-position="right" label-width="100px" ref="form" :rules="rules" :model="form" class="baseInfo">
      <el-form-item label="申诉内容">
        <el-input type="textarea" :disabled="true" v-model="form.reason" maxlength="150"></el-input>
      </el-form-item>
      <el-form-item label="申诉处理" prop="changeScore"  v-if="this.status" >
        <el-radio-group v-model="form.changeScore" @change="handlEdit" :disabled="changeSwitch">
            <el-radio v-model="form.changeScore" :label="0">不修改</el-radio>
            <el-radio v-model="form.changeScore" :label="1">修改分数</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="处理意见">
        <el-input type="textarea" v-model="form.handleRemark" maxlength="150"></el-input>
      </el-form-item>
    </el-form>
    </div>
    </div>
    </panel>
    <div class="submit-wrap">
        <el-row class="vlt-edit-btn">
          <el-button
            type="primary"
            v-prevent="1000"
            size="medium"
            @click="submit"
            v-if="this.status==1"
             :id="$route.name+'-'+'submit'"
          >保存</el-button>
          <el-button size="medium" @click="close" v-if="this.status==1"  :id="$route.name+'-'+'cancel'">取 消</el-button>
        </el-row>
      </div>
  </div>
</template>

<script type="text/javascript">
import moment from "moment";
export default {
  name: "",
  data() {
    return {
      isDisabled: true,
      showEdit: false,
      form: {
        changeScore: 0,
        reason: "",
        handleRemark: ""
      },
      tableData: [],
      baseData: [
        { title: "渠道编号", value: "", prop: "channelNo" },
        { title: "渠道类型", value: "", prop: "channelType" }, //
        { title: "所属机构", value: "", prop: "insName" }, //
        { title: "定性得分", value: "", prop: "quality" }, //
        { title: "定量得分", value: "", prop: "quantity" },
        { title: "综合得分", value: "", prop: "totalScore" },
        { title: "考核年月", value: "", prop: "examineDate" },
        { title: "申诉时间", value: "", prop: "appealDate" }
      ],
      rules: {},
      params: {
        appealHandleList: []
      },
      param: "",
      status: null,
      isNewAppeal: null,
      examineId: "",
      initData: null,
      changeSwitch: false,
      ownScroe: [],
      clicked: 0,
    };
  },
  components: {},
  async created() {
    const routerQuery = this.$route.query;
    this.examineId = routerQuery.examineId;
    this.status = Number(this.$route.query.status);
    if (routerQuery) {
      console.log("routerQuery是", routerQuery);
      let data = routerQuery;
      this.channelAppealDetailList(data);

      // let data = routerQuery.appealId
      let res = await this.$api.channelAppeallistDetail({ data: routerQuery.appealId });
      if (res && res.code == 0) {
        console.log("baseData查看结果", res);
        this.param = res.data;
        this.baseData.forEach(item => {
          //基础信息回显
          item.value = res.data[item.prop];
          if (item.prop == "appealDate") {
            item.value = this.translateTime(res.data[item.prop]);
          }
          if (item.prop == "channelType") {
            item.value = this.translateChannelType(res.data[item.prop]);
          }
          if (item.prop == "examineDate") {
            let year = res.data.examineYear ? res.data.examineYear : '';
            let month = res.data.examineMonth ? res.data.examineMonth : '';
            item.value = year&&month ?  year + "-" + month : '';
          }
        });
        for (let i in this.form) {
          //申诉内容回显
          this.form[i] = res.data[i];
        }
        this.form.changeScore = 0;
      }
    }
  },
  methods: {
    translateTargetCategory(val) {
      let options = {
        0: "大厅管理",
        1: "大厅维护",
        2: "业务培训",
        3: "彩民服务"
      };
      return options[val];
    },
    translateChannelType(val) {
      let options = { 0: "自营厅", 1: "合作厅" };
      return options[val];
    },
    translateTime(val) {
      console.log(val, moment(val).format("YYYY-MM-DD HH:mm:ss"));
      return  val ? moment(val).format("YYYY-MM-DD HH:mm:ss") : null;
    },
    async channelAppealDetailList(data) {
      let res = await this.$api.channelAppealDetailList({ data });
      if (res && res.code == 0) {
        // if (res.data != null && res.data.length > 0) {
        console.log( "table数据",res.data)
        this.initData = res.data;
        let array = JSON.parse(JSON.stringify(res.data));
        array.forEach(item => {
          item.disabled = true;
          this.ownScroe.push(item.examineScore)
        });
        this.tableData = array;
        console.log(this.ownScroe);
      } else {
        // this.$message.warning(res.msg);
      }
    },
    handleSelectionChange() {},
    handlEdit(val) {
      // console.log(val);
      if (val == 0) {
        this.tableData.forEach((item, index) => {
          item.disabled = true;
          this.$set(item, 'examineScore', this.ownScroe[index]);
          // item.examineScore = this.ownScroe[index];
        });
      } else if (val == 1) {
        this.tableData.forEach((item)=>{
          if(item.isNewAppeal) {
            this.$set(item, 'disabled', false);
            // console.log(item.isNewAppeal, item.disabled);
            // item.disabled = false;
          }
        })
      }
    },
    async submit() {
      const self = this;
      let tableData = JSON.parse(JSON.stringify(this.tableData));
      tableData.forEach((item, index) => {
        // item.score=Number(item.score);
        if (item.examineScore != self.initData[index].examineScore) {
          item.newScore = item.examineScore;
          this.params.appealHandleList.push(item)
        }
      });

      if (this.params.appealHandleList) {
        this.params.appealHandleList.forEach(item => {
          item.id = item.appealHandleId;
          item.newScore = item.examineScore;
          delete item.targetName;
          delete item.targetCategoryName;
          delete item.targetCategory;
          delete item.isNewAppeal;
          delete item.conditionValue;
          delete item.channelType;
        });
      }
      let data = {
        ...this.param,
        ...this.form,
        ...this.params,
        examineId: this.examineId
      };
      console.log("data是", data);

      let res = await this.$api.channelAppealUpdate({
        message: "提交成功",
        data
      });
      console.log(res, "处理结果");
      if (res && res.code === 0) {
        this.$router.push("appealList");
      }
    },
    close() {
      this.$router.back();
    }
  }
};
</script>

<style lang="less" scoped>
.baseInfo {
  margin-top: 50px;
}
.edit-cell {
  width: 30%;
  text-align: center;
}
.submit-wrap {
  margin: 50px 0 0 120px;
}
</style>
