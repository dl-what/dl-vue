<template>
  <div ref="chart"></div>
</template>

<script type="text/javascript">
export default {
  props: ["options", "index"],

  data() {
    return {
      chart: null
    };
  },
  mounted() {
    this.initChart();
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    setOptions() {
      this.chart.setOption({
        xAxis: {
          type: "category",
          data: this.options[1]
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },

        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "数量",
            data: this.options[0],
            type: "bar"
          }
        ]
      });
    },
    initChart() {
      let self = this;
      self.chart = self.$echarts.init(self.$el);
      window.addEventListener("resize", () => {
        window.onresize = self.charts.resize();
      });
      self.setOptions();
    }
  }
};
</script>

<style lang="less" scoped>
</style>
