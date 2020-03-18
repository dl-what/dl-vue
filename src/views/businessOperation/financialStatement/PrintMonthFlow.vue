<template>
  <div class="vlt-card">
    <div class="PrintMonthSettle">
      <panelStatic title="打印月流向报表" class="containner">
        <div class="print-content" ref="print">
          <h2 class="print-title" style="text-align:center">中福在线资金月流向报表（中央级）</h2>
          <div>
            <span>日期：2018/12/25</span>
            <span class="address" style="margin-left: 40px;">区域：全国</span>
          </div>
          <table
            class="tableClass"
            style=" width: 100%; text-align: center; border-collapse: collapse; margin-top: 20px;  border: 1px solid #ccc;"
          >
            <tr class="headerd" style="border: 1px solid #ccc;">
              <th rowspan="2" style="border: 1px solid #ccc; width: 10%;">城市名称</th>

              <th colspan="3" style="border: 1px solid #ccc; width: 10%;">收入项</th>
              <th colspan="3" style="border: 1px solid #ccc; width: 10%;">支出项</th>
              <th rowspan="2" style="border: 1px solid #ccc; width: 10%;">收支余额</th>
            </tr>
            <tr style="border: 1px solid #ccc;">
              <th
                style="border: 1px solid #ccc; width: 10%;"
                v-for="(info,index) in tableHead"
                :key="index"
              >{{info.name}}</th>
            </tr>
            <tr>
              <td
                style="border: 1px solid #ccc;"
                v-for="(info,index) in tableMain"
                :key="index"
              >{{info.data}}</td>
            </tr>
          </table>
          <div
            class="print-date"
            style="margin-top: 20px;text-align: right;"
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
        { name: "售卡金额" },
        { name: "奖金充值" },
        { name: "收入小计" },
        { name: "退卡金额" },
        { name: "销售额" },
        { name: "支出小计" }
      ],
      tableMain: [
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
