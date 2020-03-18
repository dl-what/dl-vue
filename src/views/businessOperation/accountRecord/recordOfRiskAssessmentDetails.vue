<template>
  <div class="vlt-card">
    <panel :show="true" title="风险记录详情" style="margin-bottom: 15px;">
      <base-info :infoList="infoList"></base-info>
    </panel>
    <panel :show="true" title="评估记录" style="margin-bottom: 15px;">
      <base-info :infoList="recordsList"></base-info>
    </panel>
    <panel :show="true" title="评估记录" style="margin-bottom: 15px;">
      <el-table ref="tabel" :data="tableData" tooltip-effect="dark" border>
        <!-- <el-table-column prop="equitiesId" type="selection" width="55"></el-table-column> -->
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="questionType" label="题目类型" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>{{scope.row.questionType == 0 ? "单选题" : '多选题'}}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="topicCode" label="题目编号" show-overflow-tooltip></el-table-column> -->
        <el-table-column prop="questionName" label="题目名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="optionNameList" label="题目选项" show-overflow-tooltip>
          <template slot-scope="scope">
            <div class="topicOption">
              <p
                v-for="(item,i) in scope.row.optionNameList"
                :key="i"
              >{{generateBig_1(Number(i+65))+'.'+item}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="scoreList" label="选项分值" min-width="100">
          <template slot-scope="scope">
            <div class="topicOption">
              <p
                v-for="(item,i) in scope.row.scoreList"
                :key="i"
              >{{generateBig_1(Number(i+65))+'.'+item}}分</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="sumScore" label="题目总分" min-width="100">
          <template slot-scope="scope">
            <div>{{scope.row.sumScore || ''}}分</div>
          </template>
        </el-table-column>
        <el-table-column prop="answerOptionIdList" label="答题选项" min-width="100">
          <template slot-scope="scope">
            <div>{{getNowSelect(scope.row,'points')}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="topicPoints" label="答题得分" min-width="100">
          <template slot-scope="scope">
            <div>{{getNowSelect(scope.row,'now')}}分</div>
          </template>
        </el-table-column>
      </el-table>
    </panel>
    <!-- <div style="display:flex; justify-content:flex-end">
      <el-button type="primary" style="margin:10px;" @click="()=>$router.go(-1)">返回</el-button>
    </div>-->
  </div>
</template>

<script type="text/javascript">
export default {
  name: "",
  data() {
    return {
      infoList: [
        { title: "会员账户", value: "", prop: "bankCardNumber" },
        { title: "会员卡号", value: "", prop: "memberOnlineCard" },
        { title: "会员等级", value: "", prop: "memberLevelName" },
        { title: "风险等级", value: "", prop: "levelName" },
        { title: "手机号码", value: "", prop: "mobile" },
        { title: "邮箱地址", value: "", prop: "email" },
        { title: "真实姓名", value: "", prop: "memberName" },
        { title: "性别", value: "", prop: "sex" },
        { title: "民族", value: "", prop: "nation" },
        // { title: "地区", value: "", prop: "provinceName" },
        { title: "证件类型", value: "", prop: "documentType" },
        { title: "证件号码", value: "", prop: "documentNumber" },
        { title: "年龄", value: "", prop: "age" },
        { title: "地区", value: "", prop: "provinceName" },
        { title: "联系地址", value: "", prop: "address" },
        { title: "学历", value: "", prop: "educationBackground" },
        { title: "投注预算", value: "", prop: "monthlyBetBudget" },
        { title: "月可支配收入", value: "", prop: "monthlyDisposableIncome" },
        { title: "偏好", value: "", prop: "preference" },
        // { title: "标签", value: "", prop: "memberSign" },
        { title: "是否实名认证", value: "", prop: "certificationStatus" },
        { title: "账户类型", value: "", prop: "userType" },
        { title: "账户状态", value: "", prop: "memberStatus" },
        { title: "会员权益", value: "", prop: "rightsName" },
        { title: "注册渠道编号", value: "", prop: "channelNo" },
        { title: "客服经理", value: "", prop: "accountName" },
        { title: "注册时间", value: "", prop: "createdTime" },
        { title: "更新时间", value: "", prop: "updatedTime" }
      ],
      recordsList: [
        { title: "评估方案", value: "", prop: "programName" },
        { title: "风险等级", value: "", prop: "levelName" },
        { title: "总得分", value: "", prop: "totalScore" },
        { title: "单选题得分", value: "", prop: "singleScore" },
        { title: "多选题得分", value: "", prop: "multipleScore" },
        { title: "评估时间", value: "", prop: "createdTime" },
      ],
      tableData: []
    };
  },
  created() {
    let data = {
      calculateId: Number(this.$route.query.calculateId),
      memberId: Number(this.$route.query.memberId),
      userId: Number(this.$route.query.userId)
    };
    this.getDetaisls(data);
  },
  components: {},
  methods: {
    getDetaisls(val) {
      const self = this;
      (async val => {
        let res = await this.$api.queryRiskAssessmentDetail({ data: val });
        console.log(res, "详情");
        if (res && res.code === 0) {
          let date = res.data.riskAssessmentUserInfoVo;
          this.infoList.forEach(item => {
            item.value = date[item.prop] || "";
            if (item.prop === "documentType") {
              item.value =
                this.changeType(date[item.prop], "documentType") || "";
            }
            if (item.prop === "certificationStatus") {
              item.value =
                this.changeType(date[item.prop], "certificationStatus") || "";
            }
            if (item.prop === "memberStatus") {
              item.value =
                this.changeType(date[item.prop], "memberStatus") || "";
            }
            if (item.prop === "userType") {
              item.value = this.changeType(date[item.prop], "userType") || "";
            }
            if (item.prop === "sex") {
              item.value = this.changeType(date[item.prop], "sex") || "";
            }
            if (item.prop === "memberSign") {
              item.value = this.changeType(date[item.prop], "memberSign") || "";
            }
            if (item.prop == "monthlyBetBudget") {
              item.value = `${this.$common.thousandMark(date[item.prop])} 元/月`
            }
            if (item.prop == "monthlyDisposableIncome") {
              item.value = `${this.$common.thousandMark(date[item.prop])} 元`
            }
            if (item.prop == "createdTime" && date.createdTime) {
              item.value = this.$moment(date[item.prop]).format("YYYY-MM-DD HH:mm:ss")
            }
            if (item.prop =="updatedTime" && date.updatedTime) {
              item.value = this.$moment(date[item.prop]).format("YYYY-MM-DD HH:mm:ss")
            }
          });
          this.recordsList.forEach(item => {
            item.value = res.data.recordVo[item.prop];
            this.infoList[3].value = res.data.recordVo["levelName"];
            if (item.prop == "createdTime" && date.createdTime) {
              item.value = this.$moment(date[item.prop]).format("YYYY-MM-DD HH:mm:ss")
            }
          });
          this.tableData = res.data.memberQuestionOptionVoList || [];
        }
      })(val);
    },
    generateBig_1(val) {
      let a = String.fromCharCode(val);
      return a;
    },
    getNowSelect(val, name) {
      let arr = [],
        str = "",
        num = 0;
      if (
        val.answerOptionIdList &&
        val.optionIdList &&
        val.answerOptionIdList.length &&
        val.optionIdList.length
      ) {
        val.answerOptionIdList.forEach(item => {
          // console.log(item);
          arr = val.optionIdList.map((i, index) => item == i && index);
        });
        arr.forEach((item, index) => {
          if (item !== false) {
            str +=
              this.generateBig_1(item + 65) +
              "." +
              val.optionNameList[index] +
              " ";
          }
        });
        arr.forEach((item, index) => {
          if (item !== false) {
            num += Number(val.scoreList[index]);
          }
        });
      }
      if (name === "points") {
        return str;
      } else {
        return num;
      }
    },
    changeType(val, name) {
      switch (name) {
        case "documentType":
          var option = {
            2: "身份证",
            6: "护照",
            7: "军官证",
            8: "士官证"
          };
          return option[val];
        case "certificationStatus":
          var option = {
            1: "已认证",
            0: "未认证"
          };
          return option[val];
        case "memberStatus":
          var option = {
            1: "正常",
            0: "挂失",
            0: "注销"
          };
          return option[val];
        case "userType":
          var option = {
            1: "普通购彩者",
            2: "已识别用户",
            3: "会员"
          };
          return option[val];
        case "userStatus":
          var option = {
            1: "正常",
            0: "挂失",
            0: "注销"
          };
          return option[val];
        case "memberSign":
          var option = {
            1: "客户",
            0: "会员"
          };
          return option[val];
        case "sex":
          var option = {
            1: "男",
            2: "女"
          };
          return option[val];
        default:
          break;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.topicOption {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
</style>
