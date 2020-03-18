<template>
  <div class="vlt-card check-echarts">
    <ul class="echart" v-show="echartShow">
      <li v-for="(item,index) in echartsList" :key="index">
        <h2>{{item.title}}</h2>
        <div class="charts" :style="{width: '500px', height: '500px'}" :ref="item.el"></div>
      </li>
      <!-- <li>
        <h2>XX仓库设施盘点</h2>
        <div class="charts" :style="{width: '500px', height: '500px'}" ref="facility"></div>
      </li>
      <li>
        <h2>XX仓库设施盘点</h2>
        <div class="charts" :style="{width: '500px', height: '500px'}" ref="consumable"></div>
      </li>
      <li>
        <h2>XX仓库配件盘点</h2>
        <div class="charts" :style="{width: '500px', height: '500px'}" ref="mountings"></div>
      </li> -->
    </ul>
    <div class="list" v-show="listShow">
        <h2>XX仓库设备盘点</h2>
        <el-table class="list-table" :data="tableData" border style="width: 100%">
          <el-table-column prop="date" label="序号"></el-table-column>
          <el-table-column prop="goodsName" label="物品名称"></el-table-column>
          <el-table-column prop="goodsModel" label="物品型号"></el-table-column>
          <el-table-column prop="unit" label="单位"></el-table-column>
          <el-table-column prop="inventoryNum" label="库存数量"></el-table-column>
          <el-table-column prop="iossNum" label="损耗数量"></el-table-column>
      </el-table>
    </div>
    <el-row class="checkBtn">
      <el-button type="primary" @click="changeBtn" v-text="echartShow?'查看列表':'查看图表'"></el-button>
    </el-row>
</div>
</template>

<script type="text/javascript">
import echarts from "echarts";
export default {
  name: "inventoryStatistics",
  data() {
    return {
      echartsList:[
        {title:'XX仓库设备盘点',el:'itemName'},
        {title:'XX仓库设施盘点',el:'itemName'},
        {title:'XX仓库耗材盘点',el:'itemName'},
        {title:'XX仓库配件盘点',el:'itemName'},
      ],
      echartShow:true,
      listShow:false,
      tableData:[
        {
          id:1,
          goodsName:'hsajf ',
          goodsModel:'1315',
          unit:'个',
          inventoryNum:1000,
          iossNum:5
        }
      ]
    };
  },
  mounted() {
    this.initCharts1();
    this.initCharts2();
    this.initCharts3();
    this.initCharts4();
      // this.$nextTick(() => {
      //   this.initCharts();
      // });
  },
  methods: {
    initCharts1() {
      let myChart = echarts.init(this.$refs.itemName[0]);
      // myChart.showLoading();
      // myChart.hideLoading();
      let options = {
        color: ['#3398DB',"#CC0000"],
        // title: { text: "XX仓库设备盘点" },
        tooltip: {},  
        grid:{bottom:'8%'},
        legend: {
          left: 'right',
          data: ['库存数量', '损耗数量'],
          // bottom:0
        },
        //  代表x轴的数据
        xAxis: {
          type : 'category', 
          data: ["类别1", "类别2", "类别3", "类别4"]   ////字段对应从json里面的字段
        },
        //  代表y轴的数据
        yAxis: [{
          min:0,
          max:5,
          interval:0.5,
        }],
        // 代表鼠标悬浮到图标上时提示的对应信息
        series: [
          {
            name: "库存数量",
            type: "bar",
            barWidth: '30%',
            data: [2,3,3,4]
          },
          {
            name: "损耗数量",
            type: "bar",
            barWidth: '30%',
            data: [1,1,2,2]
          },
        ]
      }
      myChart.setOption(options);
    },
    initCharts2() {
      let myChart = echarts.init(this.$refs.itemName[1]);
      myChart.setOption({
        color: ['#3398DB'],
        // title: { text: "XX仓库设备盘点" },
        tooltip: {},
        grid:{
          bottom:'8%'
        },
        xAxis: {
          // type : 'category', 
          data: ["类别1", "类别2", "类别3", "类别4"]
        },
        yAxis: [{
          min:0,
          max:5,
          interval:0.5,
        }],
        series: [
          {
            // name: "销量",
            type: "bar",
            barWidth: '40%',
            data: [2,1,3,4]
          }
        ]
      });
    },
    initCharts3() {
      let myChart = echarts.init(this.$refs.itemName[2]);
      myChart.setOption({
        color: ['#3398DB'],
        // title: { text: "XX仓库设备盘点" },
        tooltip: {},
        grid:{
          bottom:'8%'
        },
        xAxis: {
          // type : 'category', 
          data: ["类别1", "类别2", "类别3", "类别4"]
        },
        yAxis: [{
          min:0,
          max:5,
          interval:0.5,
        }],
        series: [
          {
            // name: "销量",
            type: "bar",
            barWidth: '40%',
            data: [2,1,3,4]
          }
        ]
      });
    },
    initCharts4() {
      let myChart = echarts.init(this.$refs.itemName[3]);
      myChart.setOption({
        color: ['#3398DB'],
        // title: { text: "XX仓库设备盘点" },
        tooltip: {},
        grid:{
          bottom:'8%'
        },
        //  代表x轴的数据
        xAxis: {
          // type : 'category', 
          data: ["类别1", "类别2", "类别3", "类别8888"]  //字段对应从json里面的字段
        },
          //  代表y轴的数据
        yAxis: [{
          min:0,
          max:5,
          interval:0.5,
        }],
        // 代表鼠标悬浮到图标上时提示的对应信息
        series: [
          {
            // name: "销量",
            type: "bar",
            barWidth: '40%',
            data: [2,1,3,4]
          }
        ]
      });
    },

    changeBtn() {
      this.echartShow = !this.echartShow;
      this.listShow = !this.listShow;
    },
  }
};
</script>

<style lang="less" sc-oped>
.check-echarts{
  position: relative;
  li{margin-top: 20px;margin-bottom: 36px}
  h2{
  margin-bottom: 20px;
}
.charts{
  border:1px solid rgb(218, 218, 218);
}
.checkBtn{
  position: absolute;
  top: 16px;left: 800px;
}
.list-table{
  margin-top: 38px;
}
}

</style>
