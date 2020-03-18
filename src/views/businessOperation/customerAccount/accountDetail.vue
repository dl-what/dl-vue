<template>
  <div class="vlt-card account-detail">
    <panel title="账户资料" style="margin-bottom: 15px;" v-if="status ==='会员账户'" :show="true">
      <base-info :infoList="infoList"></base-info>
    </panel>
    <panel title="资金账户" style="margin-bottom:15px" :show="true">
      <base-info :infoList="fundsList">
        <!-- <li class="info-item">
          <span class="title">资金账户ID：</span>
          <p class="content">{{purseId}}</p>
        </li> -->
        <li class="info-item">
          <span class="title">账户总余额：</span>
          <p class="content">{{totalAmount}}</p>
        </li>
        <li class="info-item">
          <span class="title">积分：</span>
          <p class="content">{{integralRate}}</p>
        </li>
        <!-- <li class="info-item">
          <span class="title">银行名称：</span>
          <p class="content">{{bankName}}</p>
        </li>
        <li class="info-item">
          <span class="title">银行账户：</span>
          <p class="content">{{bankCardNumber}}</p>
        </li>
        <li class="info-item">
          <span class="title">支行名称：</span>
          <p class="content">{{bankAccountName}}</p>
        </li> -->
      </base-info>
    </panel>
    <panel title="投注卡列表" style="margin-bottom:15px"  :show="true">
      <div class="wrapper">
        <el-table :data="tableData" :span-method="arraySpanMethod" border style="width: 100%;">
          <el-table-column prop="num" fixed label="序号" type="index" width="55px"></el-table-column>
          <el-table-column prop="cardCode" label="投注卡号" min-width="160px"></el-table-column>
          <el-table-column prop="cardType" label="投注卡类型" min-width="120px">
            <template slot-scope="scope">
              <span
                class="icon-tag"
                :class="{
                blue:scope.row.cardType=='0',
                green:scope.row.cardType=='1',
                grey:scope.row.cardType=='4',
                yellow:scope.row.cardType=='3',
                red:scope.row.cardType=='2',
                }"
              >{{scope.row.strCardType}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="cardStatus" label="状态" min-width="120px">
            <template slot-scope="scope">
              <span
                class="icon-circle"
                :class="{
                blue:scope.row.cardStatus!='1'&&scope.row.cardStatus!='2',
                green:scope.row.cardStatus=='2',
                grey:scope.row.cardStatus=='20',
                yellow:scope.row.cardStatus=='50',
                red:scope.row.cardStatus=='1',
                }"
              >{{scope.row.strCardStatus}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="amountBalance" label="总额(元)" min-width="120px"></el-table-column>
          <el-table-column prop="cashAmount" label="现金余额(元)" min-width="120px"></el-table-column>
          <el-table-column prop="rewardAmount" label="奖金余额(元)" min-width="120px"></el-table-column>
          <el-table-column prop="trialAmount" label="赠送金额(元)" min-width="120px"></el-table-column>
          <el-table-column prop="cardDeposit" label="押金(元)" min-width="120px"></el-table-column>
          <el-table-column prop="channelCode" label="开卡渠道编号" min-width="120px"></el-table-column>
          <el-table-column prop="createTime" label="开卡时间" min-width="160px"></el-table-column>
          <el-table-column prop="userScope" label="使用范围" min-width="160px"></el-table-column>
        </el-table>
      </div>
    </panel>
  </div>
</template>


<script type="text/javascript">
export default {
  data() {
    return {
      tableData: [],
      infoList: [
        { title: "会员账户", value: "", prop: "memberCode" },
        { title: "会员卡号", value: "", prop: "cardCode" },
        { title: "会员等级", value: "", prop: "memberLevelName" },
        { title: "风险等级", value: "", prop: "memberRiskName" },
        { title: "手机号码", value: "", prop: "mobile" },
        { title: "邮箱地址", value: "", prop: "email" },
        { title: "真实姓名", value: "", prop: "memberName" },
        { title: "性别", value: "", prop: "sex" },
        { title: "民族", value: "", prop: "nation" },
        { title: "证件类型", value: "", prop: "documentType" },
        { title: "证件号码", value: "", prop: "documentNumber" },
        { title: "年龄", value: "", prop: "age" },
        { title: "地区", value: "", prop: "districtName" },
        { title: "联系地址", value: "", prop: "address" },
        { title: "学历", value: "", prop: "educationBackground" },
        { title: "投注预算", value: "", prop: "monthlyBetBudget" },
        { title: "月可支配收入", value: "", prop: "monthlyDisposableIncome" },
        { title: "偏好", value: "", prop: "preference" },
        { title: "标签", value: "", prop: "createdTime" },
        { title: "是否实名认证", value: "", prop: "certificationStatus" },
        { title: "账户类型", value: "", prop: "userType" },
        { title: "账户状态", value: "", prop: "userStatus" },
        { title: "会员权益", value: "", prop: "memberRights" },
        { title: "注册渠道编号", value: "", prop: "channelCode" },
        { title: "客服经理", value: "", prop: "serviceManagerName" },
        { title: "注册时间", value: "", prop: "memberCreateTime" },
        { title: "更新时间", value: "", prop: "memberUpdateTime" }
      ],
      //资金账户ID
      purseId: "",
      //账户总余额
      totalAmount: "",
      //积分值
      integralRate: "",
      //银行名称
      bankName: "",
      //银行卡号
      bankCardNumber: "",
      //支行名称
      bankAccountName: "",
      status: "",
      fundsList: [],
      newDataArr: [],
      isSort: false
    };
  },
  created() {
    this.status = this.$route.query.status;

    this.init();
  },
  methods: {
    async init() {
      const self = this;
      let id = this.$route.query.id;
      let result = await this.$api.getcusDetai({ data: id });
      console.log(result);
      if (result && result.code === 0) {
        if (result.data.memberVoByUserId) {
          this.purseId = result.data.memberVoByUserId.purseId || "";
          this.accountBalance =
            result.data.memberVoByUserId.accountBalance || "";
          this.integral = result.data.memberVoByUserId.integral || "";
          this.bankName = result.data.memberVoByUserId.bankName || "";
          this.bankCardNumber =
            result.data.memberVoByUserId.bankCardNumber || "";
          this.bankAccountName =
            result.data.memberVoByUserId.bankAccountName || "";
        }
        if (result.data.memberInfoVo) {
          if (result.data.memberInfoVo.documentType == 2) {
            result.data.memberInfoVo.documentType = "身份证";
          } else if (result.data.memberInfoVo.documentType == 6) {
            result.data.memberInfoVo.documentType = "护照";
          } else if (result.data.memberInfoVo.documentType == 7) {
            result.data.memberInfoVo.documentType = "军官证";
          } else if (result.data.memberInfoVo.documentType == 8){
            result.data.memberInfoVo.documentType = "士官证";
          } else {
            result.data.memberInfoVo.documentType = null;
          }

          if (result.data.memberInfoVo.userType === 1) {
            result.data.memberInfoVo.userType = "普通购彩者";
          } else if (result.data.memberInfoVo.userType === 2) {
            result.data.memberInfoVo.userType = "已识别用户";
          } else {
            result.data.memberInfoVo.userType = "会员";
          }
        }
        if (result.data.memberInfoVo) {
          this.infoList.forEach(item => {
            item.value = result.data.memberInfoVo[item.prop] || "";
            if (item.prop === "sex") {
              item.value = item.value === 1 ? "男" : "女";
            }
            if (item.prop === "certificationStatus") {
              if (result.data.memberInfoVo.certificationStatus == 0) {
                item.value = '未认证';
              } else if (result.data.memberInfoVo.certificationStatus == 1) {
                item.value = '已认证';
              } else {
                item.value = null;
              }
            }
            if (item.prop === "userStatus") {
              item.value = item.value === 0 ? "冻结" : "启用";
            }
            if (item.prop === "memberCreateTime") {
              item.value = result.data.memberInfoVo.memberCreateTime ? this.$moment(item.value).format("YYYY-MM-DD") : null;
            }
            if (item.prop === "memberUpdateTime") {
              item.value = result.data.memberInfoVo.memberUpdateTime ? this.$moment(item.value).format("YYYY-MM-DD") : null;
            }
            if(item.prop=='monthlyBetBudget'||item.prop=='monthlyDisposableIncome') {
              item.value = item.value?`${this.$common.thousandMark(item.value)} 元/月`:'0.00 元/月';
            }
            if(item.prop=='age') {
              item.value = item.value ? `${item.value} 岁` : null
            }
          });
        }
        let fundAccount = result.data.fundAccount
        if (fundAccount) {
          self.totalAmount = fundAccount.totalAmount?`${this.$common.thousandMark(fundAccount.totalAmount)} 元`:'0.00 元';
          self.integralRate = fundAccount.integralRate ? fundAccount.integralRate : '0';
        }
        console.log(result);
        if (result.data.betCards&&result.data.betCards.length>0) {
          
          let options = {
            1: "待激活",
            2: "已激活",
            3: "退卡",
            4: "挂失",
            5: "补卡",
            6: "换卡",
            7: "报废",
            8: "逾期",
            9: "注销"
          };
          result.data.betCards.forEach(item => {
            if (item.cardDeposit == null) {
              item.cardDeposit = 0;
            }
            if (item.cardType === 0) {
              item.strCardType = "投注卡";
            } else if (item.cardType === 1) {
              item.strCardType = "会员卡";
            } else if (item.cardType === 2) {
              item.strCardType = "试玩卡";
            } else {
              item.strCardType = "电子投注卡";
            }
            if (item.userScope === 0) {
              item.userScope = "全国通用";
            } else {
              item.userScope = "本销售厅使用";
            }
            if (item.cardStatus) {
              item.strCardStatus = options[item.cardStatus];
            }
            if (item.createTime) {
              item.createTime = this.$moment(item.createTime).format("YYYY-MM-DD");
            }
            item.cashAmount = item.cashAmount?this.$common.thousandMark(item.cashAmount):'0.00';
            item.rewardAmount = item.rewardAmount?this.$common.thousandMark(item.rewardAmount):'0.00';
            item.trialAmount = item.trialAmount?this.$common.thousandMark(item.trialAmount):'0.00';
            item.amountBalance = item.amountBalance?this.$common.thousandMark(item.amountBalance):'0.00';
            item.cardDeposit = item.cardDeposit?this.$common.thousandMark(item.cardDeposit):'0.00';
          });
          result.data.betCards.forEach(item => {
            // console.log(item.cardType);
            if (item.cardType == 3 ) {
              this.newDataArr[0] = item;
            }
            if (item.cardType == 1) {
              this.newDataArr[1] = item;
            }
          })
          if (this.newDataArr.length == 2) {
            this.isSort = true;
          }
          // console.log(this.newDataArr);
          this.tableData = [... this.newDataArr];
          result.data.betCards.forEach (item => {
            // console.log(item.cardType);
            if (item.cardType != 3 && item.cardType != 1) {
              this.tableData.push(item);
            } 
          })
        }
      }
    },
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (this.isSort ) {
        // console.log(this.tableData,row);
        if (columnIndex=== 4 || columnIndex=== 5|| columnIndex=== 6 || columnIndex=== 7 || columnIndex=== 8 ) {
          // 合并第二行
          if (rowIndex === 0) {
            return [2, 1];
          }
          else if (rowIndex === 1) {
            return [0, 0]
          }
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "./less/index";
.wrapper {
  padding: 10px;
}
</style>

