<template>
  <div class="vlt-card plan-check">
    <panel title="奖池风险指标详情" :show="true">
      <base-info :infoList="planList"></base-info>
      <p>
        <el-button type="primary" @click.native="goEdit" size="mini">修改</el-button>
        <el-button type="primary" @click.native="gotoList" size="mini">返回</el-button>
      </p>
    </panel>
  </div>
</template>

<script type="text/javascript">
import informs from "@/utils/inform.js";
export default {
  name: "pondRiskDetail",
  data() {
    return {
      planList: [
        { title: "游戏", value: "", prop: "gameName" },
        { title: "奖池", value: "", prop: "jackpotPoolId" },
        { title: "监控频率(分钟/次)", value: "", prop: "collectFrequency" },
        
        {
          title: "最高奖池金额-Ⅲ级",
          value: "",
          prop: "maxJackpotMoneyOrdinary",
        },
        {
          title: "最高奖池金额-Ⅱ级",
          value: "",
          prop: "maxJackpotMoneySerious"
        },
        {
          title: "最高奖池金额-Ⅰ级",
          value: "",
          prop: "maxJackpotMoneyMajor"
        },
        {
          title: "最低奖池金额-Ⅲ级",
          value: "",
          prop: "minJackpotMoneyOrdinary"
        },
        {
          title: "最低奖池金额-Ⅱ级",
          value: "",
          prop: "minJackpotMoneySerious"
        },
        {
          title: "最低奖池金额-Ⅰ级",
          value: "",
          prop: "minJackpotMoneyMajor"
        },
         { title: "Ⅲ级通知方式", value: "", prop: "informWayOrdinary" },
        {
          title: "Ⅲ级通知对象",
          value: "",
          prop: "userNameOrdinary"
        },
        {
          title: "Ⅲ级通知对象",
          value: "",
          prop: "userNameSeOrdinary"
        },
        {
          title: "Ⅲ级通知对象",
          value: "",
          prop: "userNameThOrdinary"
        },
       

        { title: "Ⅱ级通知方式", value: "", prop: "informWaySerious" },
        {
          title: "Ⅱ级通知对象",
          value: "",
          prop: "userNameSerious"
        },
       {
          title: "Ⅱ级通知对象",
          value: "",
          prop: "userNameSeSerious"
        },
        {
          title: "Ⅱ级通知对象",
          value: "",
          prop: "userNameThSerious"
        },

        { title: "Ⅰ级通知方式", value: "", prop: "informWayMajor" },
        {
          title: "Ⅰ级通知对象",
          value: "",
          prop: "userNameMajor"
        },
        {
          title: "Ⅰ级通知对象",
          value: "",
          prop: "userNameSeMajor"
        },
        {
          title: "Ⅰ级通知对象",
          value: "",
          prop: "userNameThMajor"
        },
        { title: "状态", value: "", prop: "collectStatus" },
      ],
      gameInfoList: [{ title: "游戏ID", value: "", prop: "gameID" }],
      detaillist: []
    };
  },
  components: {},
  methods: {
    //返回奖池风险列表页
    gotoList(){
      this.$router.push({
        name: "pondRisk",
      });
    },

    //获取游戏风险指标详情.
    async getPondRiskDetail() {
      const id = this.$route.query.id;
      const self = this;
      const res = await self.$api.getPondRiskDetail({
        data: {
          businessKey: id
        },
      });
      if (res && res.code == 0) {
        if(!res.data.informWayMajor){        
          res.data.informTotalCountMajor=null
        } 
        if(!res.data.informWaySerious){
          res.data.informTotalCountSerious=null
        }
        if(!res.data.informWayOrdinary){
          res.data.informTotalCountOrdinary=null
        }
         let data = res;
          // 需要把百分制金额 除于 100 的字段
          let moneyArray = ['maxJackpotMoneyOrdinary', 'minJackpotMoneyOrdinary', 'maxJackpotMoneySerious','minJackpotMoneySerious','maxJackpotMoneyMajor','minJackpotMoneyMajor']
          moneyArray.forEach((item)=>{
            data = this.toMoneyReal(data, item)
          })
        for (var item in data.data) {
          for (var i = 0; i < this.planList.length; i++) {
            if (item === this.planList[i].prop) {
              this.planList[i].value = data.data[item]?data.data[item]:'-';
              if (
                item === "informWayOrdinary" ||
                item === "informWaySerious" ||
                item === "informWayMajor" ||
                item === "collectStatus"
              ) {
                var informWay=informs.showTextByType(
                  item,
                  data.data[item])
                this.planList[i].value = informWay?informWay:'-'
              }
              if(this.planList[i].value=='-'){
                this.planList[i].show=false
              }
              break;
            }
          }
        }
      }
    },
    //返回奖池风险编辑页
    goEdit() {
      this.$router.push({
        name: "pondRiskEdit",
        query: {
          id: this.$route.query.id
        }
      });
    },
    // 转换金额 除以100
    toMoneyReal(data, val) {
      for(let key in data) {
        if(typeof(data[key])=='object') {
          if(data[key]&&data[key][val]) {
            data[key][val] = data[key][val]/100;
          }
        }
        if(Array.isArray(data[key])) {
          data[key]&&data[key].forEach((item)=>{
            if(item[val]) {
              item[val] = item[val]/100;
            }
          })
        }
      }
      return data;
    },
  },
  mounted() {
    this.getPondRiskDetail();
  }
};
</script>

<style lang="less" scoped>
/deep/ .base-info .info-list .title {
  min-width: unset;
}
p {
  margin-right: 150px;
  margin-bottom: 10px;
  text-align: right;
}
</style>
