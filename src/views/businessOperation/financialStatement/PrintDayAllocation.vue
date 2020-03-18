<template>
  <div class="vlt-card">
    <div class="PrintDayAllocation">
      <panelStatic title="打印日分配报表" class="containner">
        <div class="print-content" ref="print">
          <h2 class="print-title" style=" text-align: center;">中福在线资金日分配报表（中央级）</h2>
          <div>
            <span>日期：2018/12/25</span>
            <span class="address" style="margin-left: 40px;">区域：全国</span>
          </div>
          <table
            class="tableClass"
            style=" width: 100%; text-align: center; border-collapse: collapse; margin-top: 20px;  border: 1px solid #ccc;"
          >
            <tr class="headerd" style="border: 1px solid #ccc;">
              <th rowspan="2" style="border: 1px solid #ccc; width: 10%;">省份名称</th>
              <th rowspan="2" style="border: 1px solid #ccc; width: 10%;">销售额</th>
              <th colspan="3" style="border: 1px solid #ccc; width: 10%;">奖金</th>
              <th colspan="4" style="border: 1px solid #ccc; width: 10%;">业务费</th>
              <th rowspan="2" style="border: 1px solid #ccc; width: 10%;">公益金</th>
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
        { name: "返奖奖金" },
        { name: "调节奖金" },
        { name: "合计" },
        { name: "中彩中心" },
        { name: "省级" },
        { name: "地级" },
        { name: "合计" }
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
