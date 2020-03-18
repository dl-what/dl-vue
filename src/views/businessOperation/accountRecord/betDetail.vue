<template>
  <div class="vlt-card">
    <panel :show="true" title="投注记录详情" style="margin-top: 10px;">
      <base-info :infoList="infoList"></base-info>
    </panel>

    <panel :show="true" title="订单状态变更记录" style="margin-top: 10px;">
      <el-table :data="tableData" border style="width: 100%; margin-top: 10px">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="winGrade" label="订单状态">
          <template slot-scope="scope">{{getBettingStatus(scope.row.winGrade,'winGrade')}}</template>
        </el-table-column>
        <el-table-column prop="winAmount" label="中奖金额">
          <template slot-scope ="scope">
            {{$common.thousandMark(scope.row.winAmount)}}
          </template>
        </el-table-column>
        <el-table-column prop="timeWin" label="中奖时间">
          <template
            slot-scope="scope"
          >{{scope.row.timeWin ? $moment(scope.row.timeWin).format("YYYY-MM-DD HH:mm:ss"):''}}</template>
        </el-table-column>
        <!-- <el-table-column prop="id" label="操作人ID"></el-table-column>
        <el-table-column prop="name" label="操作人姓名"></el-table-column>-->
        <!-- <el-table-column prop="type" label="操作人类型">彩民</el-table-column> -->
        <!-- <el-table-column prop="winGrade" label="备注">
          <template slot-scope="scope">{{getBettingStatus(scope.row.winGrade,'winGrade')}}</template>
        </el-table-column> -->
      </el-table>
    </panel>
    <!-- <div style="display:flex; justify-content:flex-end">
      <el-button type="primary" style="margin:10px;" @click="()=>$router.go(-1)">返回</el-button>
    </div>-->
  </div>
</template>

<script type="text/javascript">
export default {
  name: "betDetail",
  data() {
    return {
      infoList: [
        { title: "订单编号", value: "", prop: "transactionId" },
        { title: "投注卡号", value: "", prop: "userCode" },
        { title: "账户类型", value: "", prop: "userType" },
        { title: "账户ID", value: "", prop: "purseId" },
        { title: "账户名称", value: "", prop: "memberName" },
        { title: "手机号码", value: "", prop: "mobile" },
        { title: "投注金额", value: "", prop: "betAmount" },
        { title: "投注点数", value: "", prop: "betsPoints" },
        { title: "投注时间", value: "", prop: "timeBet" },
        { title: "设备编号", value: "", prop: "deviceCode" },
        { title: "所属机构", value: "", prop: "insName" },
        { title: "游戏名称", value: "", prop: "gameName" },
        { title: "订单状态", value: "", prop: "winStatus" },
        { title: "变更时间", value: "", prop: "timeBet" }
      ],
      tableData: []
    };
  },
  components: {},
  methods: {
    getBettingStatus(key, type) {
      switch (type) {
        case "userType":
          let options = {
            0: "投注卡",
            1: "会员卡",
            2: "试玩卡",
            3: "电子投注卡"
          };
          return options[key];
        case "winStatus":
          let option = {
            0: "未中奖",
            1: "已中奖"
          };
          return option[key];
        case "winGrade":
          let list = {
            1: "小奖",
            2: "中奖",
            3: "大奖"
          };
          return list[key];
        default:
          break;
      }
    },
    getGameName(game, device) {
      (async () => {
        let data = {
          gameId: game || 0,
          deviceId: device
        };
        let res = await this.$api.queryCashWinInfo({ data });
        console.log(res, "游戏名称");
        if (
          res &&
          res.code === 0 &&
          res.data.equipment &&
          res.data.getGameName
        ) {
          this.infoList[9].value = res.data.equipment.serial;
          this.infoList[11].value = res.data.gameInfoVo.gameName;
        }
      })();
    },
    getTableData(val) {
      (async () => {
        let data = {
          transactionId: val
        };
        let res = await this.$api.queryWinRecordList({ data });
        console.log("用户状态变更记录",res);
        if (res && res.code === 0) {
          this.tableData = res.data;
        }
      })();
    }
  },
  created() {
    let id = this.$route.query.id;
    (async id => {
      let data = {
        page: 1,
        pageSize: 1,
        param: {
          transactionId: id
        }
      };
      let res = await this.$api.queryGameRecord({ data });
      console.log(res, "投注详情");
      if (res && res.code === 0 && res.data) {
        let param = res.data.records[0] || "";
        let betAmount = res.data.records[0].betAmount;
        let exchangeRate = res.data.records[0].exchangeRate;
        this.infoList.forEach(item => {
          item.value = param[item.prop];
          if (item.prop === "userType") {
            item.value = this.getBettingStatus(param[item.prop], "userType");
          } else if (item.prop === "winStatus") {
            item.value = this.getBettingStatus(param[item.prop], "winStatus");
          } else if (item.prop === "betAmount") {
            item.value = `${this.$common.thousandMark(param[item.prop])} 元`;
          } else if (item.prop === "timeBet") {
            item.value = this.$moment(param[item.prop]).format("YYYY-MM-DD HH:mm:ss");
          } else if(item.prop === "memberName"){
            item.value = param[item.prop] ? param[item.prop] : "匿名用户"
          } else if (item.prop == "betsPoints") {
            item.value = (Number(betAmount)/100) * Number(exchangeRate)
          }
        });
      }
    })(id);
    this.getTableData(id)
  }
};
</script>

<style lang="less" scoped>
</style>
