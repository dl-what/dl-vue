<template>
  <div class="vlt-card">
    <div class="lotteryDetail">
      <panel :show="true" title="兑奖信息" style="margin-bottom:20px">
        <base-info :infoList="redeemTitle"></base-info>
        <div style="padding: 0 20px;">
          <el-table :data="tableData" border>
            <el-table-column label="中奖注序号" prop="betSn" min-width="120px"></el-table-column>
            <el-table-column label="中奖奖等" prop="gradeTypeName" min-width="120px">
              <!-- <template slot-scope="scope">
                {{scope.row.gradeType==1?'固定奖':'累计奖'}}({{scope.row.grade}})
              </template> -->
            </el-table-column>
            <el-table-column label="中奖金额(元)" prop="winAmount" min-width="120px">
               <template slot-scope="scope">
                {{changeNumber(scope.row.winAmount)}}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </panel>
      <panel :show="true" title="兑奖人信息">
        <base-info :infoList="redeemPeoleTitle"></base-info>
      </panel>
      <panel :show="true" title="中奖人图像">
        <el-image
          style="width: 100px; height: 100px"
          v-for="(url,index) in pictureUrl"
          :key="index"
          :src="url"
          :preview-src-list="pictureSrcList"
        ></el-image>
      </panel>
      <panel :show="true" title="身份证正反面">
        <el-image
          style="width: 100px; height: 100px"
          v-for="(item,index) in IDcardUrl"
          :key="index"
          :src="item"
          :preview-src-list="IDcardUrlSrcList"
        ></el-image>
      </panel>
      <panel :show="true" title="打印凭证">
        <el-image
          style="width: 100px; height: 100px"
          v-for="(i,index) in printUrl"
          :key="index"
          :src="i"
          :preview-src-list="printUrlSrcList"
        ></el-image>
      </panel>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "",
  data() {
    return {
      pictureUrl: "",
      pictureSrcList: [],
      IDcardUrl: "",
      IDcardUrlSrcList: [],
      printUrl: "",
      printUrlSrcList: [],
      redeemTitle: [
        { title: "投注卡ID", value: "", prop: "cardCode" },
        { title: "投注卡类型", value: "", prop: "userType" },
        { title: "所属机构", value: "", prop: "insName" },
        { title: "游戏名称", value: "", prop: "gameName" },
        { title: "订单编号", value: "", prop: "transactionId" },
        { title: "中奖总金额", value: "", prop: "winAmount" },
        { title: "中奖时间", value: "", prop: "timeWin" },
        { title: "兑奖状态", value: "", prop: "cashStatus" }
      ],
      redeemPeoleTitle: [
        { title: "姓名", value: "", prop: "name" },
        { title: "身份证", value: "", prop: "idCard" },
        { title: "手机号", value: "", prop: "mobile" },
        { title: "地址", value: "", prop: "address" },
        { title: "捐款金额", value: "", prop: "donateMoney" },
        { title: "实际缴税", value: "", prop: "taxRate" },
        { title: "实兑金额", value: "", prop: "actualMoney" }
      ],
      tableData: [],
      userType: ""
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      let data = {
        cardCode: this.$route.query.cardCode,
        transactionId: this.$route.query.transactionId
      };

      // console.log(data);
      let res = await this.$api.InquireDetail({ data });
      this.userType = res.data.userType;
      this.tableData = res.data.gameWinRecords;
      let count = 0;
      let options={
        0: '固定奖（直接返奖）',
        1: '固定奖',
        2: '累积奖'
      }
      this.tableData.forEach((item)=>{
        item.gradeTypeName = options[item.gradeType]
        count += item.winAmount;
      })
      
      // 兑奖信息
      this.redeemTitle.forEach(item => {
        item.value = res.data.gameWinRecords[0][item.prop] || '';
        if (item.prop == "timeWin") {
          item.value = this.$moment(item.value).format("YYYY-MM-DD HH:mm:ss");
        }
        if (item.prop == "winAmount") {
          
          item.value = `${this.changeNumber(count)} 元`;
          console.log(count)
        }
        if (item.prop == "cashStatus") {
          if (item.value == 0) {
            item.value = "未兑奖";
          } else if (item.value == 1) {
            item.value = "已兑奖";
          } else {
            item.value = "已弃奖";
          }
        }
        if (item.prop == "userType") {
          if (item.value == 0) {
            item.value = "投注卡";
          } else if (item.value == 1) {
            item.value = "会员卡";
          } else if (item.value == 2) {
            item.value = "试玩卡";
          } else {
            item.value = "电子投注卡";
          }
        }
      });

      // this.pictureUrl = res.data.prizePersonImg && res.data.prizePersonImg.split(",");
      this.pictureSrcList = res.data.cashPrizePerson.personImgList;
      this.pictureUrl = res.data.cashPrizePerson.personImgList;
      this.IDcardUrl = res.data.cashPrizePerson.idCardScansList;
      this.IDcardUrlSrcList = res.data.cashPrizePerson.idCardScansList;
      this.printUrl = res.data.cashPrizePerson.prizeEvidenceList;
      this.printUrlSrcList = res.data.cashPrizePerson.prizeEvidenceList;

      // let res = await this.$api.BigLotteryTaxrate();
      console.log("res", res);
      // 兑奖人信息
      this.redeemPeoleTitle.forEach(item => {
        item.value = res.data.cashPrizePerson[item.prop] || '';
        if (item.prop == "taxRate") {
          item.value = `${res.data.taxRate} %`;
        }
        if (item.prop == "actualMoney") {
          item.value = `${this.changeNumber(item.value)} 元`;
        }
        if (item.prop == "donateMoney") {
          item.value = `${this.changeNumber(item.value)} 元`;
        }
      });
    },
    //转化千分符
    changeNumber(val) {
      let reg = /\d{1,3}(?=(\d{3})+$)/g;
      var arr = (val / 100)
        .toFixed(2)
        .toString()
        .split(".");
      var x = arr[0];
      var y = arr[1];
      return `${x.replace(reg, "$&,")}.${y}`;
    }
  }
};
</script>

<style lang="less">
.lotteryDetail {
  .el-image {
    margin-left: 20px;
  }
  .panel-bd {
    padding: 10px 0;
  }
  .el-image-viewer__close{
    top: 60px;
    right: 50%;
    transform: translate(50%,0);
    background-color: #606266;
    color: #fff;
  }
}
</style>
