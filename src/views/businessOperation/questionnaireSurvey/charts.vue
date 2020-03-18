<template>
  <div ref="charts"></div>
</template>

<script type="text/javascript">
export default {
  props: ["options", "index"],
  data() {
    return {
      charts: null,
      list: []
    };
  },
  mounted() {
    this.initChart();
  },
  beforeDestroy() {
    if (!this.charts) {
      return;
    }
    this.charts.dispose();
    this.charts = null;
  },
  created() {
    // console.log(this.options);
    let crr = [];
    let arr = this.options[0].map(item => {
      //console.log(item);
      return {
        value: item
      };
    });
    this.list.push(arr);
    let brr = this.options[1].map(item => {
      // console.log(item);
      return {
        name: item
      };
    });
    this.list = arr.map((item, index) => {
      return { ...item, ...brr[index] };
    });
    console.log(this.list);
  },
  methods: {
    setOption() {
      this.charts.setOption({
        // title: {
        //   text: "某站点用户访问来源",
        //   subtext: "纯属虚构",
        //   x: "center"
        // },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        // legend: {
        //   bottom: 10,
        //   left: "center",
        //   data: this.options[0]
        // },
        series: [
          {
            name: "题目选项",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: this.list,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
    },
    initChart() {
      let self = this;
      self.charts = self.$echarts.init(self.$el);
      window.addEventListener("resize", () => {
        window.onresize = self.charts.resize();
      });
      self.setOption();
    }
  }
};
</script>

<style lang="less" scoped>
</style>
