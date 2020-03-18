<template>
  <div class="vlt-card plan-check">
    <panel title="金额风险指标详情" :show="true">
      <base-info :infoList="planList"></base-info>
      <p>
        <el-button type="primary" @click.native="goEdit" size="mini">修改</el-button>
        <el-button type="primary" @click.native="gotoList" size="mini">返回</el-button>
      </p>
    </panel>
  </div>
</template>

<script >
import informs from "@/utils/inform.js";
export default {
  name: "cityRiskDetail",
  data() {
    return {
      planList: [
        { title: "区域名称", value: "", prop: "insName" },
        { title: "状态", value: "", prop: "collectStatus" },
        { title: "监控频率(分钟/次)", value: "", prop: "collectFrequency" },
        {
          title: "最高销量-Ⅲ级",
          value: "",
          prop: "highestSaleMoneyOrdinary"
        },
        {
          title: "最高销量-Ⅱ级",
          value: "",
          prop: "highestSaleMoneySerious"
        },
        {
          title: "最高销量-Ⅰ级",
          value: "",
          prop: "highestSaleMoneyMajor"
        },
        {
          title: "最低销量-Ⅲ级",
          value: "",
          prop: "minimumSaleMoneyOrdinary"
        },
        {
          title: "最低销量-Ⅱ级",
          value: "",
          prop: "minimumSaleMoneySerious"
        },
        {
          title: "最低销量-Ⅰ级",
          value: "",
          prop: "minimumSaleMoneyMajor"
        },
        {
          title: "最低单厅销量-Ⅲ级",
          value: "",
          prop: "minimumHallSaleMoneyOrdinary"
        },
        {
          title: "最低单厅销量-Ⅱ级",
          value: "",
          prop: "minimumHallSaleMoneySerious"
        },
        {
          title: "最低单厅销量-Ⅰ级",
          value: "",
          prop: "minimumHallSaleMoneyMajor"
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
       
        { title: "第一次监控时间", value: "", prop: "timingFirst" },
        { title: "第二次监控时间", value: "", prop: "timingSecond" },
        { title: "第三次监控时间", value: "", prop: "timingThird" },
        { title: "第四次监控时间", value: "", prop: "timingFourth" },
        { title: "第五次监控时间", value: "", prop: "timingFifth" },
        { title: "第六次监控时间", value: "", prop: "timingSixth" }
      ]
    };
  },
  components: {},
  methods: {
    //获取游戏风险指标详情.
    async cityMoneyRiskDetail() {
      const id = this.$route.query.id;
      const self = this;
      const res = await self.$api.cityMoneyRiskDetail({
        data: {
          businessKey: id
        }
      });
      if (res && res.code == 0) {
        
        if (!res.data.informWayMajor) {
          res.data.informTotalCountMajor = null;
        }
        if (!res.data.informWaySerious) {
          res.data.informTotalCountSerious = null;
        }
        if (!res.data.informWayOrdinary) {
          res.data.informTotalCountOrdinary = null;
        }
         let data = res;
          // 需要把百分制金额 除于 100 的字段
          let moneyArray = ['highestSaleMoneyOrdinary', 'highestSaleMoneySerious','highestSaleMoneyMajor','minimumSaleMoneyOrdinary','minimumSaleMoneySerious','minimumSaleMoneyMajor','minimumHallSaleMoneyOrdinary','minimumHallSaleMoneySerious','minimumHallSaleMoneyMajor']
          moneyArray.forEach((item)=>{
            data = self.toMoneyReal(data, item)
          })
          
        for (var item in data.data) {
          for (var i = 0; i < this.planList.length; i++) {
            if (item === this.planList[i].prop) {
              this.planList[i].value = data.data[item] ? data.data[item] : "-";
              if (
                item === "informWayOrdinary" ||
                item === "informWaySerious" ||
                item === "informWayMajor" ||
                item === "collectStatus"
              ) {
                var informWay = informs.showTextByType(item, data.data[item]);
                this.planList[i].value = informWay ? informWay : "-";
              }
              if (this.planList[i].value == "-") {
                this.planList[i].show = false;
              }
              break;
            }
          }
        }
      }
    },
    //跳转金额风险编辑页面
    goEdit() {
      this.$router.push({
        name: "cityMoneyRiskEdit",
        query: {
          id: this.$route.query.id
        }
      });
    },
    //返回金额风险列表
    gotoList() {
      this.$router.push({
        name: "cityMoneyRisk"
      });
    },
    // 转换金额 百分
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
    this.cityMoneyRiskDetail();
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
