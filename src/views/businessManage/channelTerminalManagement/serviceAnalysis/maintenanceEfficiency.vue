<!-- 渠道终端管理 - 服务分析 - 维修率分析 -->
<template>
  <div class="vlt-card chart-box">
    <search-bar
      ref="searchForm"
      class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      labelWidth="6em"
      :total="total"
      @change="changeSearch"
      @searchReset="reset"
    ></search-bar>
    <div class="chart"> 
      <div class="statistics">
        <h3>工单处理时长</h3>
        <div class="statistics-box">
          <dl v-for="(item, index) in statisticsList" :key="index">
            <dt>{{item.name}}</dt>
            <dd><span>{{item.param}}</span> 分钟</dd>
          </dl>
        </div>
      </div>
      <div class="chart-main" ref="chartMain" v-show="showChart"></div>
      <p v-if="!showChart"  class="no-mess"> 暂无数据 </p>
    </div>
  </div>
</template>

<script type="text/javascript">
import echarts from "echarts";
export default {
  name: "maintenanceEfficiency",
  data() {
    return {
      showChart: true,
      // 搜索组件配置
      searchOptions: [
        { type: "select", prop: "goodsId", value: "", title: "设备名称", placeholder: "请选择", options: [] },
        { type: "select", prop: "modelId", value: "", title: "设备型号", placeholder: "请选择", options: [] },
        { type: "datepicker-range", prop: "date", value: "", title: "维修日期", placeholder: ["开始日期", "结束日期"] },
        {
          type: "cascader",
          prop: "insId",
          value: "",
          title: "选择机构",
          placeholder: "请选择",
          options: [],
          setProps: {
            label: "text",
            value: "id",
            children: "children",
            // multiple: true, // 多选
            checkStrictly: true //设置父子节点取消选中关联，从而达到选择任意一级选项的目的
          }
        }
      ],
      requestData: {},
      chartList: {
        insNameArr: []
      },
      maxOrderWOrk: '',
      statisticsList: [],
      modelTreesList: [],
      total: 0
    };
  },
  components: {},
  mounted() {
    const insId = this.$storage.get('userInfo').insId;
    if (insId) {
      this.requestData.insId = insId;
      let now = new Date();
      this.requestData.endDate = this.$moment(now).format('YYYY-MM-DD');
      this.requestData.startDate = this.$moment(now.setMonth(now.getMonth())).format('YYYY-MM')+ '-01';
      this.getChat(this.requestData);
    }
    this.getInsData()
    // 获取设备下拉 和设备型号下拉
    this.getModelTrees (1);
  },
  methods: {
    // 获取机构数据
    getInsData() {
      const self = this;
      const data = {};
      (async data => {
        let res = await self.$api.QueryUserAndInsTree({ data });
        console.log('res---',res);
        if (res && res.code == 0) {
          if (res.data) {
            let newData = res.data;
            self.$set(self.searchOptions[3], "options", newData);
          }
        } else {
          // self.$message.warning(res.msg)
        }
      })(data);
    },
    // 获取数据
    getChat (data) {
      const _this = this;
      (async (data) => {
        let res = await _this.$api.getQueryServiceEfficiencyAnalyzeList({data});
        if (res&&res.code == 0) {
          if (res.data && res.data.length) {
            _this.total = res.data.length;
            _this.statisticsList = [];
            console.log(res);
            let insNameArr = [],
                avgOrderWorkArr = [],
                serviceEfficiencyArr = [];
            res.data&&res.data.forEach(element => {
                avgOrderWorkArr.push(Number(element.avgOrderWork).toFixed(2));
                insNameArr.push(element.insName);
                serviceEfficiencyArr.push((element.serviceEfficiency * 100).toFixed(2))
            });
            _this.statisticsList.push({
              name: '平均维修时间',
              param: res.data[0].avgServiceDate
            },{
              name: '最快维修时间',
              param: res.data[0].minServiceDate
            },{
              name: '最慢维修时间',
              param: res.data[0].maxServiceDate,
            })

            _this.maxOrderWOrk =  Math.max.apply(null, avgOrderWorkArr);
            _this.chartList = {
              insNameArr,
              avgOrderWorkArr,
              serviceEfficiencyArr,
              maxOrderWOrk: _this.maxOrderWOrk
            }
            console.log(_this.chartList);
            _this.showChart = true;
            _this.lineChart(_this.chartList);
          } else {
            _this.statisticsList = [];
            _this.chartList = {};
            _this.showChart = false
          }
        }
      })(data)
        
    },

    // 1 获取设备列表
    getModelTrees (goodsType) {
      const _this= this;
      (async (id) => {
        const data = {
          goodsType: id
        }
        let res = await _this.$api.getModelTrees({data});
        if (res&&res.code == 0) {
          if (res.data != null && res.data.length) {
            _this.modelTreesList = res.data;
            let options = [];
            _this.modelTreesList.forEach(item => {
              options.push({
                label: item.goodsName,
                value: item.id
              })
            })
            _this.$set(_this.searchOptions[0], 'options', options)
          }
        }
      })(goodsType)
    },
    lineChart(chart) {
      let myChart = echarts.init(this.$refs.chartMain);
       let option = {
        title : {
          text: '维修效率分析'
        },
        tooltip : {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                animation: false,
                label: {
                    backgroundColor: '#505765'
                }
            }
        },
        legend: {
          data: ["维修效率（%）", '人均处理工单（单）']
        },
        grid: {
          top: 100,
          bottom: 40
        },
        toolbox: {
          right: 40,
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: chart.insNameArr
        },
        yAxis: [{
            name: '维修效率（%）',
            type: 'value',
            max: 100,
            min: 0,
            // offset: 20,
            axisLine:{
              show: false
            }
          },
          {
            name: '人均处理工单（单）',
            // nameLocation: 'start',
            max: 100,
            min: 0,
            type: 'value',
            // offset: 20,
            axisLine:{
              show: false
            }
        }],
        series: [
          {
            name: "维修效率（%）",
            type: "line",
            data: chart.serviceEfficiencyArr
          },
          {
            name: "人均处理工单（单）",
            type: "line",
		        yAxisIndex: 1,
            data: chart.avgOrderWorkArr
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
      window.addEventListener("resize", function() {
        myChart.resize();
      });
    },
    changeSearch (form, oldForm) {
      // console.log(form, oldForm);

      if (form.goodsId != this.newGoodsId) {
        // console.log(form.goodsId);
        let changeSelect = [];
        this.modelTreesList.forEach( item => {
          if (item.id == form.goodsId) {
            changeSelect = item.modelInfoVoList;
          }
        })
        if (changeSelect.length) {
          let options = [];
          changeSelect.forEach(item => {
            options.push({
              label: item.deviceModel,
              value: item.modelId
            })
          })
          this.$set(this.searchOptions[1], 'options', options)
        } else {
          this.$set(this.searchOptions[1], 'options', [])
        }
        this.$set(this.$refs.searchForm.form, this.searchOptions[1].prop, '');
        this.newGoodsId = form.goodsId;
      }
    },
    // 查询下拉物品名称详情
    queryGoodsInfo () {
      const _this = this;
      (async () => {
        let res = _this.$api.queryGoodsInfo({})
        if (res&&res.code == 0) {
          console.log(res);
        }
      })()
    },
    // 维修效率分析
    // getQueryServiceEfficiencyAnalyzeList
    search(form) {
      // startDate
      // this.requestData = {
      //   ...form
      // }
      console.log(form);
      if(form.date) {
        this.requestData.startDate = this.$moment(form.date[0]).format('YYYY-MM-DD');
        this.requestData.endDate = this.$moment(form.date[1]).format('YYYY-MM-DD');
        delete  this.requestData.date;
      } else {
        let now = new Date();
        this.requestData.endDate = this.$moment(now).format('YYYY-MM-DD');
        this.requestData.startDate = this.$moment(now.setMonth(now.getMonth())).format('YYYY-MM')+ '-01';
        delete  this.requestData.date;
      }
      if (form.insId) this.requestData.insId = form.insId[form.insId.length - 1];
      if (form.goodsId) this.requestData.goodsId = form.goodsId;
      if (form.modelId) this.requestData.modelId = form.modelId;
      // goodsId
      // modelId
      // 处理筛选时需要带上ins的type值  获取type的api在 年度发展计划 中有用过
      console.log("search", this.requestData);
      this.getChat(this.requestData);
    },
    reset() {
      this.requestData = {};
      this.requestData.insId = this.$storage.get('userInfo').insId;
    }
  }
};
</script>


<style lang="less" scoped>
.statistics {
    width: 100%;
    padding: 20px;
    margin-bottom: 20px;
    h3{
      display: block;
      width: 100%;
      padding-bottom: 10px;
      font-size: 18px;
      color: #333;
      border-bottom: 1px solid #e9e9e9;
    }
    .statistics-box {
      width: 100%;
      display: flex;
      justify-content: space-around;
      align-items: flex-start;
      margin-top: 20px;
      dl {
        width: 33.33%;
        text-align: left;
        dt {
          color: #666;
          line-height: 2;
        }
        dd {
          font-size: 14px;
          color: #666;
          span {
            color: #333;
            font-size: 22px;
          }
        }
      }
    }
}
.chart-box {
  min-height: 950px;
  .no-mess {
    width: 100%;
    text-align: center;
    font-size: 16px;
    color: #909399;
  }
}
.chart {
  width: 100%;
  height: 600px;
  .chart-main {
    width: 95%;
    height: 100%;
    padding: 20px 20px;
    canvas {
      min-width: 500px;
      min-height: 300px;
    }
  }
}
</style>
