<template>
  <div class="vlt-card">
    <panel title="兑奖记录详情" style="margin-top: 10px;" :show="true">
      <base-info :infoList="infoList"></base-info>
      <!-- <div style="display:flex; justify-content:flex-end">
        <el-button type="primary" style="margin:10px;" @click="()=>$router.go(-1)">返回</el-button>
      </div>-->
    </panel>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "cashDetail",
  data() {
    return {
      infoList: [
        { title: "订单编号", value: "", prop: "transactionId" },
        { title: "投注卡号", value: "", prop: "userCode" },
        { title: "账户类型", value: "", prop: "userType" },
        { title: "账户ID", value: "", prop: "purseId" },
        { title: "账户名称", value: "", prop: "memberName" },
        { title: "手机号码", value: "", prop: "mobile" },
        { title: "兑奖金额", value: "", prop: "winAmount" },
        { title: "游戏名称", value: "", prop: "gameName" },
        { title: "兑奖方式", value: "", prop: "type" },
        {title: "兑奖状态", value: "", prop: "cashStatus"},
        { title: "兑奖时间", value: "", prop: "timeCash" },
        {title: "弃奖时间", value: "", prop: "abandonTime"},
        {title: "税额", value: "", prop: "taxAmount"},
        {title: "实兑金额", value: "", prop: "money"},
        {title: "中奖渠道厅编码", value:"", prop: "channelNo"},
        { title: "设备编号", value: "", prop: "deviceCode" },
        { title: "所属机构", value: "", prop: "insName" }
      ],
      taxAmount: null
    };
  },
  components: {},
  methods: {
    getDetail(id,val) {
      (async id => {
        let data = {
          transactionId: id,
          betSn: val
        };
        let res = await this.$api.queryCashWinDetail({ data });
        console.log(res, "投注详情");
        if (res && res.code === 0 && res.data) {
          let param = res.data;
          this.infoList.forEach(item => {
            item.value = param[item.prop];
            if (item.prop === "userType") {
              item.value = this.typeChange(param[item.prop], "userType")
            } else if (item.prop === "type") {
              item.value = this.typeChange(param["winGrade"], "type");
            } else if (item.prop === "betAmount") {
              item.value = param[item.prop] / 100;
            } else if (item.prop === "timeCash") {
              if (param.cashStatus&&param.cashStatus == 2) {
                item.value = null
              } else {
                item.value = param[item.prop]&&this.$moment(param[item.prop]).format("YYYY-MM-DD HH:mm:ss");
              }
            } else if (item.prop === "memberName") {
              item.value = param[item.prop] ? param[item.prop] : "匿名用户";
            } else if (item.prop == "cashStatus") {
              item.value = this.typeChange(param[item.prop],"cashStatus")
            } else if (item.prop == "abandonTime") {
              if (param.cashStatus&&param.cashStatus == 2) {
                item.value = param.timeCash&&this.$moment(param.timeCash).format("YYYY-MM-DD HH:mm:ss");
              }else {
                item.value = null
              }
            } else if (item.prop == "taxAmount") {
              if (param.winGrade == 3) {
                this.taxAmount = param.winAmount*0.2;  
                item.value = `${this.$common.thousandMark(param.winAmount*0.2)} 元`
              } else {
                item.value = 0 + "元";
              }
            } else if (item.prop == "winAmount") {  
              item.value = `${this.$common.thousandMark(param[item.prop])} 元`
            } else if (item.prop == "money") {
              if (param.winGrade == 3) {
                item.value = `${this.$common.thousandMark((Number(param.winAmount) - this.taxAmount))} 元`
              } else {
                item.value = `${this.$common.thousandMark(param.winAmount)} 元`
              }
            }
          }); 
        }
      })(id);
    },
    typeChange(val, type) {
      switch (type) {
        case "userType":
          let options = {
            0: "投注卡",
            1: "会员卡",
            2: "试玩卡",
            3: "电子投注卡"
          };
          return options[val];
        case "winGrade":
          let optio = {
            1: "小奖",
            2: "中奖",
            3: "大奖"
          };
          return optio[val];

        case "type":
          let option = {
            1: "自动兑奖",
            2: "柜员机兑奖",
            3: "指定地点兑奖"
          };
          return option[val];

        case "cashStatus":
          let obj = {
            0: "未兑奖",
            1: "已兑奖",
            2: "弃奖"
          };
          return obj[val];
        default:
          break;
      }
    }
  },
  created() {
    let id = this.$route.query.id;
    let val = String(this.$route.query.betSn);
    this.getDetail(id,val)
  }
};
</script>

<style lang="less" scoped>
</style>
