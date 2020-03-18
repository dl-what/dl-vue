<template>
  <div class="vlt-card">
    <div class="PrintMonthSettle">
      <panelStatic title="打印月结算报表" class="containner">
        <div class="print-content" ref="print" style="width:100%">
          <h2 class="print-title" style="text-align:center">中福在线资金月结算报表（中央级）</h2>
          <div>
            <span>日期：2018/12/25</span>
            <span class="address" style="margin-left: 40px;">区域：全国</span>
          </div>
          <table
            class="tableClass"
            style=" width: 100%; text-align: center; border-collapse: collapse; margin-top: 20px; border: 1px solid #ccc;"
          >
            <tr style="border: 1px solid #ccc;">
              <th
                class="head"
                v-for="(item,index) in tableHead"
                :key="index"
                style="width:9%; border: 1px solid #ccc;"
              >{{item.name}}</th>
            </tr>
            <tr>
              <td
                v-for="(info,index) in tableMain"
                :key="index"
                style="border: 1px solid #ccc;"
              >{{info.data}}</td>
            </tr>
          </table>
          <div
            class="print-date"
            style=" margin-top: 20px; text-align: right;"
          >打印时间：2019/06/20 15:00:00</div>
        </div>
        <div>
          <p class="btn-print" style="text-align: center;">
            <el-button type="primary" size="mini" @click="print">打印</el-button>
          </p>
        </div>
      </panelStatic>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "",
  data() {
    return {
      tableHead: [
        { name: "区域" },
        { name: "充值金额" },
        { name: "退卡金额" },
        { name: "中奖金额" },
        { name: "奖金充值" },
        { name: "销售额" },
        { name: "省级发行经费" },
        { name: "地级发行经费" },
        { name: "公益金" },
        { name: "应收(缴)金额" }
      ],
      tableMain: [
        { data: "哈哈" },
        { data: "哈哈" },
        { data: "哈哈" },
        { data: "哈哈" },
        { data: "哈哈" },
        { data: "哈哈" },
        { data: "哈哈" },
        { data: "哈哈" },
        { data: "哈哈" },
        { data: "哈哈" }
      ]
    };
  },
  components: {},
  methods: {
    print() {
      this.$print(this.$refs.print);
    }
  }
};
</script>

<style lang="less" scoped>
</style>
