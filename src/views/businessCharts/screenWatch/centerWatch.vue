<template>
  <div class="centerWatch" ref="centerWatch">
    <div class="chart-hd">
      <span class="date">{{timeNow}}</span>
      <h6 class="title">{{areaName || '中福彩'}}视频彩票日销量监控</h6>
      <span class="full-handler">
        <!-- {{!isFull ? '全屏浏览' : '关闭全屏'}} -->
        <i class="el-icon-back" v-show="showGoBack" @click="goback"></i>
        <span class="iconfont icon-fullscreen" @click="openFullScreen" v-if="!isFull"></span>
        <span class="iconfont icon-exitfullscreen" @click="closeFullScreen" v-else></span>
      </span>
    </div>
    <main>
      <section class="left">
        <div>
          <div class="topSaleSummarize">
            <div class="title">
              <span>销量概况&nbsp;&nbsp;(单位：万元)</span>
            </div>
            <span class="salesTitle xs">本年任务完成率(%)</span>
            <div class="topSales" id="topSales"></div>
            <div class="salesNumber">
              <div>
                <section>
                  <p>今年任务</p>
                  <p>{{saleSummarize.yearTask}}</p>
                </section>
              </div>
              <div>
                <section>
                  <p>今年销量</p>
                  <p>{{saleSummarize.yearSaleAmount}}</p>
                </section>
                <section>
                  <p>本月销量</p>
                  <p>{{saleSummarize.monthSaleAmount}}</p>
                </section>
              </div>
            </div>
          </div>

          <div class="bottomGameMachine">
            <div class="title">
              <span>终端机情况</span>
            </div>
            <div class="bottomMachine" id="bottomMachine"></div>
          </div>
        </div>
      </section>
      <section class="center">
        <div class="maps">
          <div class="center_map" id="center_map1"></div>
          <div class="echartsmap" id="center_map"></div>
          <p class="text">今日销量(元)</p>
          <count-to
            :start-val="startVal"
            :end-val="saleYear"
            :autoplay="true"
            :duration="1000"
            class="text-style"
          ></count-to>
          <div class="top5">
            <span>
              <span class="xl">销售Top5</span>
            </span>
            <p v-for="(item,index) in topFiveNewList" :key="index">
              <span class="address xl">{{item.addressName}}:</span>
              <span class="xl">{{item.saleAmount}}</span>
            </p>
          </div>
          <div class="salesNum">
            <div class="title">
              <span>销售厅</span>
            </div>
            <div class="xls">销售厅&nbsp;{{HallCounts.allChannelCount}}</div>
            <div class="xls">自营厅&nbsp;{{HallCounts.selfChannelCount}}</div>
            <div class="xls">合作厅&nbsp;{{HallCounts.joinChannelCount}}</div>
          </div>
        </div>
      </section>
      <section class="right">
        <div>
          <div class="salesRanking">
            <div class="title">
              <span>销售厅销量排名&nbsp;&nbsp;(单位：万元)</span>
            </div>
            <div class="tableData" id="tableData">
              <el-table
                :data="saleRankList"
                :cell-style="tableRowStyle"
                :header-cell-style="tableHeaderColor"
              >
                >
                <el-table-column align="center" prop="hallName" label="销售厅编号" min-width="25%"></el-table-column>
                <el-table-column
                  align="center"
                  prop="addressName"
                  :label="cityOrProvice"
                  min-width="20%"
                ></el-table-column>
                <el-table-column
                  align="center"
                  label="销售金额"
                  min-width="15%"
                  sortable
                  :sort-method="sortBySaleAmount"
                >
                  <template slot-scope="scope">
                    <span>{{scope.row.saleAmount}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="winAmount"
                  label="中奖金额"
                  min-width="15%"
                  sortable
                  :sort-method="sortByWinAmount"
                >
                  <template slot-scope="scope">
                    <span>{{scope.row.winAmount}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  label="兑奖金额"
                  min-width="15%"
                  sortable
                  :sort-method="sortByCashAmount"
                >
                  <template slot-scope="scope">
                    <span>{{scope.row.cashAmount}}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div class="marketShares" v-show="ss">
            <div class="title">
              <span>游戏市场份额</span>
            </div>
            <div class="sharesMap" id="sharesMap"></div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import echarts from "echarts";
import china from "@/libs/map/cnMapJson/china.json";
import storage from "@/utils/storage";
import windowScreen from "@/utils/windowScreen";
import moment from "moment";
import countTo from "vue-count-to";

export default {
  name: "centerWatch",
  components: {
    countTo
  },
  data() {
    return {
      showGoBack: false,//显示返回箭头(默认false)
      startVal: 0,//销售额跳动初始数字
      exesitClick: false,//是否存在点击
      cityOrProvice: "所属省份",//大厅销量排名所属区域变量(默认是所属省份)
      size: 0,//屏幕尺寸变化比例
      saleYear: null,//年销量
      //省份经纬度
      chinaGeoCoordMap: {
        深圳市: [114.031, 22.3243],
        黑龙江省: [127.9688, 48.368],
        内蒙古: [110.3467, 41.4899],
        吉林省: [125.8154, 44.2584],
        北京市: [116.4551, 40.2539],
        辽宁省: [123.1238, 42.1216],
        河北省: [114.4995, 38.1006],
        天津市: [117.4219, 39.4189],
        山西省: [112.3352, 37.9413],
        陕西省: [109.1162, 34.2004],
        甘肃省: [103.5901, 36.3043],
        宁夏: [106.3586, 38.1775],
        青海省: [95.4038, 36.8207],
        新疆: [87.9236, 43.5883],
        西藏: [91.11, 29.97],
        四川省: [103.9526, 30.7617],
        重庆市: [108.384366, 30.439702],
        山东省: [117.1582, 36.8701],
        河南省: [113.4668, 34.6234],
        江苏省: [118.8062, 31.9208],
        安徽省: [117.29, 32.0581],
        湖北省: [114.3896, 30.6628],
        浙江省: [119.5313, 29.8773],
        福建省: [119.4543, 25.9222],
        江西省: [116.0046, 28.6633],
        湖南省: [113.0823, 28.2568],
        贵州省: [106.6992, 26.7682],
        云南省: [102.9199, 25.4663],
        广东省: [113.12244, 23.009505],
        广西: [108.479, 23.1152],
        海南省: [110.3893, 19.8516],
        上海市: [121.4648, 31.2891],
        哈尔滨市: [125.42, 46.04]
      },      
      chinaMap: {},//地图对象     
      areaName: "",//区域名称
      datas: [],//日销量
      map: {},
      index: 0,
      cityData: [],//市级地图销量数据
      topFiveList: [],//销量top5
      topFiveNewList: [],//防止出现多余数据的销量top5
      saleRankList: [],//销售厅销量排名
      saleSummarize: {},//销量概况
      HallCounts: {},//销售厅数量
      gameCase: [],//游戏机情况数据
      gameMarketList: [],//游戏市场份额数据
      ss: true,
      timeInfoData: null,
      indexLevel: 1,//机构等级(默认1:中央)
      insGrade: "",//机构等级
      mapSaleList: [],//日销量
      timeNow: null,//当前时间
      timerNow: null,//定时器
      insId: null,//机构id
      addressId: null //地图下钻机构Id
    };
  },

  computed: {},
  created() {},
  watch: {},
  mounted() {
    this.timeNow = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    echarts.registerMap("china", china);
    this.getInsLevel();
    this.watchScreen(
      () => {
        this.isFull = true;
      },
      () => {
        this.isFull = false;
      }
    );
    this.getDateTime();
  },
  methods: {
    //获取当前时间
    getDateTime() {
      this.timerNow = setInterval(item => {
        this.timeNow = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      }, 1000);
    },
    //打开全屏
    openFullScreen() {
      this.fullScreen(this.$refs.centerWatch);
    },
    //变比全屏
    closeFullScreen() {
      this.exitFullScreen();
    },
    //清除定时器
    clearTimer() {
      if (this.timeInfoData) {
        clearInterval(this.timeInfoData);
        this.timeInfoData = null;
      }
    },
    //开启定时器
    timer() {
      this.clearTimer();
      this.timeInfoData = setInterval(item => {
        var cityId = storage.session.get("currentCityMap").areaId
          ? storage.session.get("currentCityMap").areaId
          : "";
        if (!cityId) {
          var proId = storage.session.get("currentMap").areaId
            ? storage.session.get("currentMap").areaId
            : "";
        }
        var addressId = cityId ? cityId : proId;
        this.getAllDataInfo(addressId); 
        var type = "";
        if (this.indexLevel == 1) {
          type = "";
        } else {
          type = 1;
        }
        this.startVal = this.saleYear;
        console.log(this.indexLevel, type);

        if(this.insGrade == "中央") {
           this.getMapDataInfo(addressId, type);
        } else {
          switch(this.indexLevel) {
            // 刷新省地图销量
            case 2:
              this.initMapPro(this.areaName, addressId)
              break;
            case 3:
            // 刷新市地图销量
              this.initMapCity(this.areaName, addressId)
              break;
          }
        }

        this.getDataInfo(addressId);
      }, 30000);
    },
    // 修改table tr行的背景色
    tableRowStyle({ row, column, rowIndex, columnIndex }) {
      return "color:red;align:center;background-color: #02142c;";
    },
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return "background-color: #02142c;color:#c5d6ea;font-weight: 500;align:center;";
      }
    },
    formatter(row, column) {
      return row.address;
    },
    //销量概况仪表盘
    salesMap() {
      this.size = document.body.clientWidth / 3840;
      let this_ = this;
      let myChart = echarts.init(document.getElementById("topSales"));
      let option = {
        tooltip: {
          formatter: "{b} : {c}%"
        },
        // toolbox: {
        //   feature: {
        //     restore: {},
        //     saveAsImage: {}
        //   }
        // },
        series: [
          {
            // name: "总量指标",
            type: "gauge",
            // radius: "20%",
            detail: { formatter: "{value}%" },
            data: [{ value: 50, name: "完成率" }],
            axisLine: {
              show: true,
              lineStyle: {
                width: 10,
                color: [
                  [
                    1,
                    new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                      {
                        offset: 0,
                        color: "#4978EC"
                      },
                      {
                        offset: 0.5,
                        color: "#1E2B57"
                      },
                      {
                        offset: 1,
                        color: "#141F3D"
                      }
                    ])
                  ]
                ]
              }
            },
            splitLine: {
              length: 15
            },
            title: {
              // 仪表盘标题。
              show: true, // 是否显示标题,默认 true。
              offsetCenter: [0, "30%"], //相对于仪表盘中心的偏移位置，数组第一项是水平方向的偏移，第二项是垂直方向的偏移。可以是绝对的数值，也可以是相对于仪表盘半径的百分比。
              color: "#33d27a", // 文字的颜色,默认 #333。
              fontSize: 23 * this.size // 文字的字体大小,默认 15。
            },
            axisTick: {
              length: 8
            },
            detail: {
              // 仪表盘详情，用于显示数据。
              show: true // 是否显示详情,默认 true。 // 相对于仪表盘中心的偏移位置，数组第一项是水平方向的偏移，第二项是垂直方向的偏移。可以是绝对的数值，也可以是相对于仪表盘半径的百分比。
              // color: "#fff", // 文字的颜色,默认 auto。
              // fontSize: 50 * this.size, // 文字的字体大小,默认 15。
              // formatter: "{value}%" // 格式化函数或者字符串
            },
            axisLabel: {
              // 刻度标签。
              show: false, // 是否显示标签,默认 true。
              distance: 5, // 标签与刻度线的距离,默认 5。
              color: "#fff", // 文字的颜色,默认 #fff。
              fontSize: 34 * this.size, // 文字的字体大小,默认 5。
              formatter: "{value}" // 刻度标签的内容格式器，支持字符串模板和回调函数两种形式。 示例:// 使用字符串模板，模板变量为刻度默认标签 {value},如:formatter: '{value} kg'; // 使用函数模板，函数参数分别为刻度数值,如formatter: function (value) {return value + 'km/h';}
            }
          }
        ],
        legend: {
          top: "0"
        }
      };
      myChart.setOption(option, true);

      window.addEventListener("resize", () => {
        myChart.resize();
      });
      var percent =
        this.saleSummarize.yearSaleAmount / this.saleSummarize.yearTask;
      option.series[0].data[0].value = (percent * 100).toFixed(2) - 0;
      myChart.setOption(option, true);
    },
    salesMap1() {
      let myChart = echarts.init(document.getElementById("topSales"));
      var percent =
        this.saleSummarize.yearSaleAmount / this.saleSummarize.yearTask;
      var dataArr = [
        {
          value: (percent * 100).toFixed(2) - 0,
          name: "完成率"
        }
      ];
      var color = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
        {
          offset: 0,
          color: "#5CF9FE" // 0% 处的颜色
        },
        {
          offset: 0.17,
          color: "#468EFD" // 100% 处的颜色
        },
        {
          offset: 0.9,
          color: "#468EFD" // 100% 处的颜色
        },
        {
          offset: 1,
          color: "#5CF9FE" // 100% 处的颜色
        }
      ]);
      var colorSet = [
        [1, color]
        // [0.91, color],
        // [1, '#FFF']
      ];
      var rich = {
        white: {
          fontSize: 50,
          color: "#fff",
          fontWeight: "500",
          padding: [-150, 0, 0, 0]
        },
        bule: {
          fontSize: 70,
          fontFamily: "DINBold",
          color: "#fff",
          fontWeight: "700",
          padding: [-100, 0, 0, 0]
        },
        radius: {
          width: 350,
          height: 80,
          // lineHeight:80,
          borderWidth: 1,
          borderColor: "#f5dc65",
          fontSize: 50,
          color: "#fff",
          backgroundColor: "#1B215B",
          borderRadius: 20,
          textAlign: "center"
        },
        size: {
          height: 400,
          padding: [100, 0, 0, 0]
        }
      };
      var option = {
        backgroundColor: "#02142c",
        tooltip: {
          formatter: "{b} : {c}%"
        },

        series: [
          {
            type: "gauge",
            name: "外层辅助",
            radius: "74%",
            startAngle: "225",
            endAngle: "-45",
            splitNumber: "100",
            pointer: {
              show: false
            },
            detail: {
              show: false
            },
            data: [
              {
                value: 12
              }
            ],
            // data: [{value: 1, name: 90}],
            title: {
              show: false,
              offsetCenter: [0, 30],
              textStyle: {
                color: "#fff",
                fontStyle: "normal",
                fontWeight: "normal",
                fontFamily: "微软雅黑",
                fontSize: 20
              }
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: [[1, "#00FFFF"]],
                width: 2,
                opacity: 1
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false,
              length: 20,
              lineStyle: {
                color: "#051932",
                width: 0,
                type: "solid"
              }
            },
            axisLabel: {
              show: false
            }
          },
          {
            type: "gauge",
            radius: "70%",
            startAngle: "225",
            endAngle: "-45",
            pointer: {
              show: true
            },
            detail: {
              // 仪表盘详情，用于显示数据。
              show: true, // 是否显示详情,默认 true。
              offsetCenter: ["5%", "90%"], // 相对于仪表盘中心的偏移位置，数组第一项是水平方向的偏移，第二项是垂直方向的偏移。可以是绝对的数值，也可以是相对于仪表盘半径的百分比。
              color: "#fff", // 文字的颜色,默认 auto。
              fontSize: 24, // 文字的字体大小,默认 15。
              formatter: "{value}%" // 格式化函数或者字符串
            },
            data: dataArr,
            title: {
              show: false
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: colorSet,
                width: 10,
                // shadowBlur: 15,
                // shadowColor: '#B0C4DE',
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                opacity: 1
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false,
              length: 10,
              lineStyle: {
                color: "#00377a",
                width: 2,
                type: "solid"
              }
            },
            axisLabel: {
              show: false
            },
            animationDuration: 4000
          },
          {
            name: "灰色内圈", //刻度背景
            type: "gauge",
            z: 2,
            radius: "60%",
            startAngle: "225",
            endAngle: "-45",
            //center: ["50%", "75%"], //整体的位置设置
            axisLine: {
              // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: [[1, "#018DFF"]],
                fontSize: 20,
                width: 2,
                opacity: 1 //刻度背景宽度
              }
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              show: false
            },
            pointer: {
              show: false
            },
            axisTick: {
              show: false
            },
            detail: {
              show: 0
            }
          },
          {
            name: "白色圈刻度",
            type: "gauge",
            radius: "60%",
            startAngle: 225, //刻度起始
            endAngle: -45, //刻度结束
            min: 0,
            max: 100,
            splitNumber: 6,
            z: 4,
            axisTick: {
              show: false
            },
            splitLine: {
              length: 8, //刻度节点线长度
              lineStyle: {
                width: 2,
                color: "#018DFF"
              } //刻度节点线
            },
            axisLabel: {
              show: false,
              color: "rgba(255,255,255,8)",
              fontSize: 15
            }, //刻度节点文字颜色
            pointer: {
              show: false
            },
            axisLine: {
              lineStyle: {
                opacity: 0
              }
            },
            detail: {
              show: false
            }
          },
          {
            //内圆
            type: "pie",
            radius: "40%",
            center: ["50%", "50%"],
            z: 1,
            itemStyle: {
              normal: {
                color: new echarts.graphic.RadialGradient(
                  0.5,
                  0.5,
                  0.8,
                  [
                    {
                      offset: 0,
                      color: "#4978EC"
                    },
                    {
                      offset: 0.5,
                      color: "#1E2B57"
                    },
                    {
                      offset: 1,
                      color: "#141F3D"
                    }
                  ],
                  false
                ),
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              }
            },
            hoverAnimation: false,
            label: {
              show: false
            },
            tooltip: {
              show: false
            },
            data: [100],
            animationType: "scale"
          },
          {
            //外圆
            type: "pie",
            radius: "85%",
            center: ["50%", "50%"],
            z: 0,
            itemStyle: {
              color: "#141C33"
            },
            hoverAnimation: false,
            label: {
              show: false
            },
            tooltip: {
              show: false
            },
            data: [100],
            animationType: "scale"
          }
        ]
      };
      myChart.setOption(option, true);

      window.addEventListener("resize", () => {
        myChart.resize();
      });

      // option.series[0].data[0].value = (percent * 100).toFixed(2) - 0;
      // myChart.setOption(option, true);
    },
    //游戏机情况折线图
    machineMap() {
      let this_ = this;
      let myChart = echarts.init(document.getElementById("bottomMachine"));
      var fontColor = "#30eee9";

      var monthList = this.gameCase.map(item => {
        return item.month;
      });
      var allTerminalList = this.gameCase.map(item => {
        return item.allTerminalCount;
      });
      var maxY = Math.round(Math.max.apply(null, allTerminalList) * 1.1);
      var onlineList = this.gameCase.map(item => {
        return item.onlineTerminalCount;
      });

      var addList = this.gameCase.map(item => {
        return item.addTerminalCount;
      });
      let option = {
        grid: {
          left: "5%",
          right: "5%",
          top: "15%",
          bottom: "3%",
          containLabel: true
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          show: true,

          top: "5%",
          y: "15",
          right: "0",

          icon: "stack",
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {
            color: "#1bb4f6"
          },
          data:
            monthList.length !== 0 ? ["终端机数量", "在线数量", "本月新增"] : []
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            axisLabel: {
              color: fontColor
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#397cbc"
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: "#195384"
              }
            },
            data: monthList
          }
        ],
        yAxis: [
          {
            type: "value",
            name: monthList.length !== 0 ? "数量(台)" : "",
            min: 0,
            max: maxY,
            axisLabel: {
              formatter: "{value}",
              textStyle: {
                color: "#2ad1d2"
              }
            },
            axisLine: {
              lineStyle: {
                color: "#27b4c2"
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "#11366e"
              }
            }
          }
        ],
        series: [
          {
            name: "终端机数量",
            type: "line",
            symbol: "circle",
            symbolSize: 8,

            itemStyle: {
              normal: {
                color: "#00d4c7",
                lineStyle: {
                  color: "#00d4c7",
                  width: 1
                },
                areaStyle: {
                  //color: '#94C9EC'
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    {
                      offset: 0,
                      color: "rgba(7,44,90,0.3)"
                    },
                    {
                      offset: 1,
                      color: "rgba(0,212,199,0.9)"
                    }
                  ])
                }
              }
            },
            data: allTerminalList
          },
          {
            name: "在线数量",
            type: "line",
            symbol: "circle",
            symbolSize: 8,
            itemStyle: {
              normal: {
                color: "#aecb56",
                lineStyle: {
                  color: "#aecb56",
                  width: 1
                },
                areaStyle: {
                  //color: '#94C9EC'
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    {
                      offset: 0,
                      color: "rgba(7,44,90,0.3)"
                    },
                    {
                      offset: 1,
                      color: "rgba(114,144,89,0.9)"
                    }
                  ])
                }
              }
            },
            data: onlineList
          },

          {
            name: "本月新增",
            type: "line",
            symbol: "circle",
            symbolSize: 8,
            itemStyle: {
              normal: {
                color: "#6FE81A",
                lineStyle: {
                  color: "#6FE81A",
                  width: 1
                },
                areaStyle: {
                  //color: '#94C9EC'
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    {
                      offset: 0,
                      color: "rgba(7,44,90,0.3)"
                    },
                    {
                      offset: 1,
                      color: "rgba(0,212,199,0.9)"
                    }
                  ])
                }
              }
            },
            data: addList
          }
        ]
      };

      myChart.setOption(option, true);
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
    //游戏市场份额
    sharesMap() {
      let this_ = this;
      let myChart = echarts.init(document.getElementById("sharesMap"));
      let areaList = this.gameMarketList.map(item => {
        return item.addressName;
      });
      try {
        var indexList = [];
        this.gameMarketList.forEach(item => {
          indexList =
            item.gameList.length > indexList.length ? item.gameList : indexList;
        });
        var gameList = indexList.map(item => {
          return item.gameName;
        });
      } catch {
        var gameList = [];
      }

      let gameOne = this.gameMarketList.map(item => {
        return item.gameList.length > 0 ? item.gameList[0].gameSaleAmount : [];
      });
      let gameTwo = this.gameMarketList.map(item => {
        return item.gameList.length > 1 ? item.gameList[1].gameSaleAmount : [];
      });
      let gameThree = this.gameMarketList.map(item => {
        return item.gameList.length > 2 ? item.gameList[2].gameSaleAmount : [];
      });
      let gameFour = this.gameMarketList.map(item => {
        return item.gameList.length > 3 ? item.gameList[3].gameSaleAmount : [];
      });
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function(params) {         
            var html = "";
            params.forEach(item => {
              if(typeof item.data==='string'){
                 let data = item.data;
                 html += item.marker + item.seriesName + ":" + data + "万元</br>";
              }
             
            });
            var res = params[0].axisValue + "</br>" + html;
            return res;
          }
        },
        legend: {
          data: gameList,
          textStyle: {
            fontSize: 12, //字体大小
            color: "#ffffff" //字体颜色
          },
          right: "0",
          top: "5%",
          show: true
          // selector:true
        },
        grid: {
          left: "3%",
          right: "10%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "value",
          axisLabel: {
            textStyle: {
              color: "#25b098"
            }
          },
          /*改变x轴颜色*/
          axisLine: {
            lineStyle: {
              color: "#333"
              // width: 1 //这里是为了突出显示加上的
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#11366e"
            }
          }
        },
        yAxis: {
          type: "category",
          data: areaList,
          axisLine: {
            lineStyle: {
              color: "#0e4866",
              width: 1 //这里是为了突出显示加上的
            }
          },
          axisLabel: {
            textStyle: {
              color: "#fff"
            }
          }
        },
        series: [
          {
            name: gameList[0],
            type: "bar",
            stack: "总量",
            barWidth: 15,
            itemStyle: {
              normal: {
                color: "rgba(6,211,205,1)",
                shadowBlur: [20, 20, 20, 20],
                // shadowColor: "#06d3cd",
                barBorderRadius: 0,
                shadowOffsetX: 0,
                shadowColor: "#092f8f",
                shadowBlur: 10
              }
            },
            label: {
              normal: {
                show: false,
                position: "insideRight"
              }
            },
            z: 10,
            data: gameOne
          },
          {
            name: gameList[1],
            type: "bar",
            barWidth: 15,
            stack: "总量",
            itemStyle: {
              normal: {
                barBorderRadius: 0,
                color: "rgba(255,86,36,1)",
                shadowBlur: [0, 0, 0, 10],
                shadowColor: "#092f8f",
                shadowOffsetX: 0,
                shadowBlur: 10
              }
            },
            label: {
              normal: {
                show: false,
                position: "insideRight"
              }
            },
            z: 6,
            data: gameTwo
          },
          {
            name: gameList[2],
            type: "bar",
            stack: "总量",
            barWidth: 15,
            itemStyle: {
              normal: {
                color: "rgba(235,232,6,1)",
                shadowBlur: [0, 0, 0, 10],
                shadowColor: "#092f8f",
                barBorderRadius: 0,
                shadowOffsetX: 0,
                shadowBlur: 10
              }
            },
            label: {
              normal: {
                show: false,
                position: "insideRight"
              }
            },
            z: 5,
            data: gameThree
          },
          {
            name: gameList[3],
            type: "bar",
            barWidth: 15,
            stack: "总量",
            itemStyle: {
              normal: {
                color: "rgba(52,218,98,1)",
                shadowBlur: [0, 0, 0, 10],
                shadowColor: "#092f8f",
                barBorderRadius: 0,
                shadowOffsetX: 0,
                shadowBlur: 10
              }
            },
            label: {
              normal: {
                show: false,
                position: "insideRight"
              }
            },
            data: gameFour
          }
        ]
      };
      myChart.setOption(option, true);

      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },

    //获取日销量
    async getGameDaySale(id) {
      let res = await this.$api.getGameDaySale({
        data: {
          insId: id
        },
        closeLoading: true
      });
      if (res.data && res.code == 0) {
        let data = res;
        // 需要把百分制金额 除于 100 的字段
        let moneyArray = ["value"];
        moneyArray.forEach(item => {
          data = this.toMoneyReal(data, item);
        });
        this.datas = data.data;
        this.mapSaleList = this.datas.map(item => {
          return Number(item.value) + 1;
        });
        this.mapSaleList.push(0);
        this.timer();
      }
    },
    //获取top前5销量排名
    async getTopFive(id) {
      let res = await this.$api.getTopFive({
        data: {
          insId: id
        },
        closeLoading: true
      });
      if (res.data && res.code == 0) {
        if (res.data.length > 0) {
          res.data.forEach(item => {
            if (item.addressName == "广西壮族自治区") {
              item.addressName = "广西";
            }
            if (item.addressName == "西藏自治区") {
              item.addressName = "西藏";
            }
            if (item.addressName == "内蒙古自治区") {
              item.addressName = "内蒙古";
            }
            if (item.addressName == "宁夏回族自治区") {
              item.addressName = "宁夏";
            }
            if (item.addressName == "新疆维吾尔自治区") {
              item.addressName = "新疆";
            }
          });
        }
        var data = res;
        let moneyArray = ["saleAmount"];
        moneyArray.forEach(item => {
          data = this.toMoneyReal(data, item);
        });
        this.topFiveList = data.data;
        this.topFiveNewList = [];
        this.topFiveList.forEach((item, index) => {
          if (item.provinceId == item.cityId && this.indexLevel != 1) {
            item.addressName = "省直属";
          }
          if (index <= 4) {
            this.topFiveNewList.push(item);
          }
        });
      }
    },
    //大厅销量排名
    async getSaleRank(id) {
      let res = await this.$api.getSaleRank({
        data: {
          insId: id
        },
        closeLoading: true
      });
      if (res.data && res.code == 0) {
        if (res.data.length > 0) {
          res.data.forEach(item => {
            if (item.addressName == "广西壮族自治区") {
              item.addressName = "广西";
            }
            if (item.addressName == "西藏自治区") {
              item.addressName = "西藏";
            }
            if (item.addressName == "内蒙古自治区") {
              item.addressName = "内蒙古";
            }
            if (item.addressName == "宁夏回族自治区") {
              item.addressName = "宁夏";
            }
            if (item.addressName == "新疆维吾尔自治区") {
              item.addressName = "新疆";
            }
          });
        }
        var data = res;
        let moneyArray = ["saleAmount", "winAmount", "cashAmount"];
        moneyArray.forEach(item => {
          data = this.toMoneyReal(data, item);
        });
        this.saleRankList = data.data;
        this.saleRankList.forEach(item => {
          if (item.cityId == item.provinceId && this.indexLevel != 1) {
            item.addressName = "省直属";
          }
        });
      }
    },

    // 转换金额 百分
    toMoneyReal(data, val, type) {
      for (let key in data) {
        if (!type) {
          if (typeof data[key] == "object") {
            if (data[key][val]) {
              data[key][val] = (data[key][val] / 1000000).toFixed(1);
            }
          }
          if (Array.isArray(data[key])) {
            data[key].forEach(item => {
              if (item[val]) {
                item[val] = (item[val] / 1000000).toFixed(1); // item[val] =new Decimal(item[val]).div(new Decimal(10000)).toNumber()
              }
            });
          }
        } else {
          if (Array.isArray(data[key])) {
            data[key].forEach(item => {
              item.gameList.forEach(item => {
                if (item[val]) {
                  item[val] = (item[val] / 1000000).toFixed(1);
                }
              });
            });
          }
        }
      }
      return data;
    },
    //今日销量
    async totalSaleDay(id) {
      const self = this;
      let res = await self.$api.totalSaleDay({
        data: {
          insId: id
        },
        closeLoading: true
      });
      if (res.data && res.code == 0) {
        this.saleYear = Number(res.data.saleAmount) / 100;
      }
    },
    //销量概况
    async getSaleSummarize(id) {
      const self = this;
      let res = await self.$api.getSaleSummarize({
        data: {
          insId: id
        },
        closeLoading: true
      });
      if (res.data && res.code == 0) {
        var data = res;
        let moneyArray = ["yearTask", "yearSaleAmount", "monthSaleAmount"];
        moneyArray.forEach(item => {
          data = self.toMoneyReal(data, item);
        });
        this.saleSummarize = data.data;
        if (this.saleSummarize) {
          if (!this.saleSummarize.yearTask) {
            this.saleSummarize.yearTask = (2000).toFixed(1);
          }
          this.salesMap1();
        }
      }
    },
    //获取机构等级
    async getInsLevel(options) {
      const insId = this.$storage.get("userInfo").insId;
      const self = this;
      const res = await self.$api.getInsLevel({
        data: {
          insId
        },
        closeLoading: true
      });
      if (res && res.code == 0) {
        this.insGrade = res.data.insGrade;
        this.areaName = res.data.insName;
        if (this.insGrade == "中央") {
          this.areaName = "中福彩";
          this.getMapDataInfo();
          this.getDataInfo();
        } else if (this.insGrade == "省级") {
          this.initMapPro(res.data.insName, insId);
        } else {
          this.initMapCity(res.data.insName, insId);
        }
      }
    },

    //大厅数量
    async getHallCount(id) {
      let res = await this.$api.getHallCount({
        data: {
          insId: id
        },
        closeLoading: true
      });
      if (res.data && res.code == 0) {
        this.HallCounts = res.data;
      }
    },
    //游戏机情况
    async getHallGameCase(id) {
      let res = await this.$api.getHallGameCase({
        data: {
          insId: id
        },
        closeLoading: true
      });
      if (res.data && res.code == 0) {
        this.gameCase = res.data;
        this.machineMap();
      }
    },
    //游戏市场份额
    async getGameMarket(id) {
      let res = await this.$api.getGameMarket({
        data: {
          insId: id
        },
        closeLoading: true
      });
      if (res.data && res.code == 0) {
        if (res.data.length > 0) {
          res.data.forEach(item => {
            if (item.addressName == "广西壮族自治区") {
              item.addressName = "广西";
            }
            if (item.addressName == "西藏自治区") {
              item.addressName = "西藏";
            }
            if (item.addressName == "内蒙古自治区") {
              item.addressName = "内蒙古";
            }
            if (item.addressName == "宁夏回族自治区") {
              item.addressName = "宁夏";
            }
            if (item.addressName == "新疆维吾尔自治区") {
              item.addressName = "新疆";
            }
          });
        }
        let data = res;
        // 需要把百分制金额 除于 100 的字段
        let moneyArray = ["gameSaleAmount"];
        moneyArray.forEach(item => {
          data = this.toMoneyReal(data, item, 1);
        });
        this.gameMarketList = res.data;
        this.sharesMap();
      }
    },
    //按照销售额排序
    sortBySaleAmount(obj1, obj2) {
      let val1 = obj1.saleAmount;
      let val2 = obj2.saleAmount;
      return val1 - val2;
    },
    //按照中奖金额排序
    sortByWinAmount(obj1, obj2) {
      let val1 = obj1.winAmount;
      let val2 = obj2.winAmount;
      return val1 - val2;
    },
    //兑奖金额排序
    sortByCashAmount(obj1, obj2) {
      let val1 = obj1.cashAmount;
      let val2 = obj2.cashAmount;
      return val1 - val2;
    },

    //根据名称获取json文件显示各地图
    async getProvinceMapOpt(name, myChat, addressId) {
      const result = await import("@/libs/map/cnMapJson/" + name + ".json");
      // let geoJson = result.default
      // axios.get("/statis/" + provinceAlphabet + ".json").then(s => {
      if (this.indexLevel == 2) {
        this.chinaMap = {};
        result.default.features.forEach(item => {
          this.chinaMap[item.properties.name] = item.properties.cp
            ? item.properties.cp
            : item.properties.center;
        });
        storage.session.set("titu", this.chinaMap);
      }
      var series = this.getSeries();
      echarts.registerMap(name, result.default);
      let option = this.getMapOpt(series, name);
      myChat.setOption(option, true);
    },
    //Series对象设置
    getSeries() {
      this.size = document.body.clientWidth / 3840;
      var series = [];
      var newList = [];
      var sepecalList = [];
      if (this.datas.length > 0) {
        this.datas.forEach(item => {
          if (item.name == "广西壮族自治区") {
            item.name = "广西";
          }
          if (item.name == "西藏自治区") {
            item.name = "西藏";
          }
          if (item.name == "内蒙古自治区") {
            item.name = "内蒙古";
          }
          if (item.name == "宁夏回族自治区") {
            item.name = "宁夏";
          }
          if (item.name == "新疆维吾尔自治区") {
            item.name = "新疆";
          }
        });
      }
      if (this.indexLevel != 1) {
        this.datas.map((dataItem, index) => {
          if (this.chinaMap[dataItem.name]) {
            newList.push(dataItem);
          } else {
            sepecalList.push(dataItem);
          }
        });
        var titu;
        sepecalList.forEach(item => {
          if (item.provinceName.indexOf(item.name) != -1) {
            titu = this.chinaGeoCoordMap[item.name];
            item.name = "省直属";
            this.chinaMap[item.name] = titu;
            newList.push(item);
          }
        });
        this.datas = newList;
      }
      if (this.indexLevel == 3) {
        series.push(
           {
            name: "mapSer",
            type: "map",
            geoIndex: 0,
            label: {
              show: false
            },
            data: this.datas
          },
          {
            type: "effectScatter",
            coordinateSystem: "geo",
            zlevel: 2,
            rippleEffect: {
              period: 4,
              brushType: "stroke",
              scale: 4
            },
            label: {
              normal: {
                show: true,
                position: "bottom", //显示位置
                offset: [0, 2], //偏移设置
                formatter: function(params) {
                  //圆环显示文字
                  return params.name;
                },
                fontSize: 28 * this.size,
                color: "#0056e2"
              },
              emphasis: {
                show: true
              }
            },
            symbol: "circle",
            symbolSize: 5, 
            itemStyle: {          
                color: "#1398c9"             
            },
            data: this.cityData
          },
        
        );
      } else {        
        series.push(
          {
            name: "mapSer",
            type: "map",
            geoIndex: 0,
            label: {
              show: false
            },
            data: this.datas
          },
          {
            type: "effectScatter",
            coordinateSystem: "geo",
            zlevel: 2,
            rippleEffect: {
              period: 4,
              brushType: "stroke",
              scale: 4
            },
            label: {
              normal: {
                show: true,
                position: "bottom", //显示位置
                offset: [0, 2], //偏移设置
                formatter: function(params) {
                  //圆环显示文字
                  return params.name;
                },
                fontSize: 24 * this.size,
                color: "#0056e2"
              },
              emphasis: {
                show: true
              }
            },
            symbol: "circle",
            symbolSize: 14*this.size,

            itemStyle: {
              normal: {
                show: true,
                color: "#1398c9"
              }
            },
            data: this.datas && this.datas.map((dataItem, index) => {       
                return {
                  name: dataItem.name,
                  value:
                    this.indexLevel == 1
                      ? this.chinaGeoCoordMap[dataItem.name].concat([
                          dataItem.value
                        ])
                      : this.chinaMap[dataItem.name].concat([dataItem.value]),
                  addressId: dataItem.addressId
                };
              
            })
          },
          
          );
      }
      return series;
    },
    //option参数设置
    getMapOpt(series, place) {
      this.size = document.body.clientWidth / 3840;
      var max = Math.round(Math.max.apply(null, this.mapSaleList));
      var min = Math.round(Math.min.apply(null, this.mapSaleList));
      var option = {
        visualMap: {
          type: "continuous",
          orient: "horizontal",
          itemWidth: 10,
          itemHeight: 80,
          text: ["高", "低"],
          showLabel: true,
          seriesIndex: [0],
          min: min,
          max: max,
          show: true,
          hoverLink: true,
          inRange: {
            color: ["#CBED89", "rgba(8,150,69,1)", "rgba(255,80,0,1)"]
          },
          textStyle: {
            color: "#7B93A7"
          },
          bottom: 30,
          left: "left"
        },
        title: {
          text: place ? place + "日销量监控" : "中福彩各省日销量监控",
          // subtext: "data from map",
          left: "center",
          show: false,
          // top: "20%",
          textStyle: {
            //主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
            fontSize: 40 * this.size,
            fontStyle: "normal",
            fontWeight: "normal",
            color: "#fff"
          }
        },
        tooltip: {
          trigger: "item",
          formatter: function(params) {
            if (params.value || params.value === 0) {
              if (typeof params.value == "number") {
                return params.name + " : " + params.value.toFixed(1) + "万元";
              } else {
                return (
                  params.name +
                  " : " +
                  Number(params.value[2]).toFixed(1) +
                  "万元"
                );
              }
            }
          }
        },
        geo: {
          map: place ? place : "china",
          label: {
            emphasis: {
              show: false
            }
          },
          roam: false, //是否允许缩放
          zoom: this.indexLevel > 1 ? 1 : 1.2,
          itemStyle: {
            normal: {
              // color: "#02142c", //地图背景色
              // borderColor: "#32b1d4", //边界线00fcff 516a89
              // borderWidth: 1,
              shadowColor: "#092f8f",
              shadowBlur: 10,
              areaColor: "rgba(209,237,137,1)",
              borderColor: "#d1ed89" //线
            },
            emphasis: {
              // color: "#02142c" //悬浮背景
            }
          }
          // top: "10%",
          // bottom: place ? "20%" : '10%'
          //  left:place ?"10%":'10%',
          //  right:place ?"20%":'10%'
        },
        series: series
      };
      return option;
    },
    //省级地图
    initMapPro(name, addressId) {
      var currentMap = {};
      currentMap.areaId = addressId;
      currentMap.areaName = name;
      storage.session.set("currentMap", currentMap);
      if (name == "广西壮族自治区") {
        name = "广西";
      }
      if (name == "西藏自治区") {
        name = "西藏";
      }
      if (name == "内蒙古自治区") {
        name = "内蒙古";
      }
      if (name == "宁夏回族自治区") {
        name = "宁夏";
      }
      if (name == "新疆维吾尔自治区") {
        name = "新疆";
      }
      this.map = {};
      this.indexLevel = 2;

      var dom = document.getElementById("center_map");
      this.map = echarts.init(dom);
      this.titleName = "中福彩各省";
        window.addEventListener("resize", () => {
        this.map.resize();
      });
      this.getGameDaySale(addressId).then(item => {
        this.getProvinceMapOpt(name, this.map, addressId);
        this.getDataInfo(addressId);
      });
      if (!this.exesitClick) {
        this.map.off('click');
        this.map.on("click", param => {
          event.stopPropagation(); // 阻止冒泡
          try {
            var addressId = param.data.addressId;
          } catch {
            var addressId = "";
          }
          if (!addressId||param.name=='省直属') return;
          // 重新渲染各份地图
          this.exesitClick = true;
          this.showGoBack = true;

          this.cityOrProvice = "所属城市";
          this.areaName = param.name;
          if (this.indexLevel < 3) {
            this.indexLevel += 1;
            this.showGoBack = true;
          }
          if (this.indexLevel == 3) {
            var currentCityMap = {};
            currentCityMap.areaId = addressId;
            currentCityMap.areaName = param.name;
            storage.session.set("currentCityMap", currentCityMap);
            this.queryHallInfo(addressId).then(item => {
              this.getProvinceMapOpt(param.name, this.map, addressId);
              this.getDataInfo(addressId);
            });
          }
        });
      }
    },
    //市级地图
    initMapCity(name, addressId) {
      var currentCityMap = {};
      currentCityMap.areaId = addressId;
      currentCityMap.areaName = name;
      storage.session.set("currentCityMap", currentCityMap);
      this.map = {};
      this.indexLevel = 3;
      var dom = document.getElementById("center_map");
      this.map = echarts.init(dom);
      this.titleName = "中福彩各省";
      this.getGameDaySale(addressId).then(item => {
        this.getProvinceMapOpt(name, this.map, addressId);
        this.getDataInfo(addressId);
      });
    },
    //全国地图
    initMap() {
      this.map = {};
      var dom = document.getElementById("center_map");
      this.map = echarts.init(dom);
      // this.map = myChart;
      this.titleName = "中福彩各省";
      var series = this.getSeries();
      let option = this.getMapOpt(series);
      if (option && typeof option === "object") {
        this.map.setOption(option, true);
        window.addEventListener("resize", () => {
          this.map.resize();
        });
      }
      if (!this.exesitClick) {
        this.map.off('click');
        this.map.on("click", param => {
          event.stopPropagation(); // 阻止冒泡
          try {
            var addressId = param.data.addressId;
          } catch {
            var addressId = "";
          }
           if (!addressId||param.name=='省直属') return;
          // 重新渲染各份地图
          this.exesitClick = true;
          this.showGoBack = true;

          this.cityOrProvice = "所属城市";
          this.areaName = param.name;
          if (this.indexLevel < 3) {
            this.indexLevel += 1;
          }
          if (this.indexLevel == 2) {
            var currentMap = {};
            currentMap.areaId = param.data.addressId;
            currentMap.areaName = param.name;
            storage.session.set("currentMap", currentMap);
            this.getGameDaySale(addressId).then(item => {
              this.getProvinceMapOpt(param.name, this.map, addressId);
              this.getDataInfo(addressId);
            });
          }
          if (this.indexLevel == 3) {
            var currentCityMap = {};
            currentCityMap.areaId = addressId;
            currentCityMap.areaName = param.name;
            storage.session.set("currentCityMap", currentCityMap);
            this.queryHallInfo(addressId).then(item => {
              this.getProvinceMapOpt(param.name, this.map, addressId);
              this.getDataInfo(addressId);
            });
          }
        });
      }
    },
    //模拟点击地图
    clickMap(addressId, name, type) {
      if (type == 2) {
        this.map = {};
        var dom = document.getElementById("center_map");
        this.map = echarts.init(dom);
        this.indexLevel = 2;
        this.getGameDaySale(addressId).then(item => {
          this.getProvinceMapOpt(name, this.map, addressId);
          this.getDataInfo(addressId);
        });
      } else if (type == 1) {
        var addressId = addressId ? addressId : "";
        this.cityOrProvice = "所属城市";
        this.areaName = name;
        if (this.indexLevel == 2) {
          var currentMap = {};
          currentMap.areaId = addressId;
          currentMap.areaName = name;
          storage.session.set("currentMap", currentMap);
          this.getGameDaySale(addressId).then(item => {
            this.getProvinceMapOpt(name, this.map, addressId);
            this.getDataInfo(addressId);
          });
        }
        if (this.indexLevel == 3) {
          var currentCityMap = {};
          currentCityMap.areaId = addressId;
          currentCityMap.areaName = name;
          storage.session.set("currentCityMap", currentCityMap);
          this.queryHallInfo(addressId).then(item => {
            this.getProvinceMapOpt(name, this.map, addressId);
            this.getDataInfo(addressId);
          });
        }
      }
    },


    //获取地图数据
    getMapDataInfo(id, type) {
      this.getGameDaySale(id).then(item => {
        //type为1是从链接进入省份地图 不为1是地图下钻
        if (type != 1 && type != 2) {
          this.initMap();
        } else {
          this.clickMap(id, this.areaName, type);
        }
      });
    },

    //市级地图接口数据
    async queryHallInfo(id) {
      let res = await this.$api.queryHallInfo({
        data: {
          insId: id
        },
        closeLoading: true
      });
      if (res && res.code == 0) {
        if (res.data.length > 0) {
          res.data.forEach(item => {
            item.value[2] = (item.value[2] / 1000000).toFixed(1);
          });
        }
        this.cityData = res.data;
      }
    },
    //返回上级地图
    goback() {
      if (this.insGrade == "中央") {
        if (this.indexLevel != 1) {
          if (this.indexLevel == 2) {
            this.showGoBack = false;
            this.goCenterMap();
            storage.session.remove("currentCityMap");
            storage.session.remove("currentMap");
          } else {
            this.goProviceMap();
            storage.session.remove("currentCityMap");
          }
        }
      } else if (this.insGrade == "省级") {
        if (this.indexLevel == 3) {
          this.showGoBack = false;
          this.initMapPro(
            storage.session.get("currentMap").areaName,
            storage.session.get("currentMap").areaId
          );
          storage.session.remove("currentCityMap");
        }
      }
    },
    //点全国链接
    goCenterMap() {
      this.indexLevel = 1;
      this.areaName = "中福彩";
      this.cityOrProvice = "所属省份";
      this.getDataInfo();
      this.getMapDataInfo();
      storage.session.remove("currentMap"),
        storage.session.remove("currentCityMap"),
        storage.session.remove("titu");
    },
    //点省份链接
    goProviceMap() {
      this.indexLevel = 2;
      var currentMap = storage.session.get("currentMap");
      this.areaName = currentMap.areaName;
      this.chinaMap = storage.session.get("titu");
      this.getDataInfo(currentMap.areaId);
      this.getMapDataInfo(currentMap.areaId, 1);
    },
    //获取除地图接口外的数据
    getDataInfo(addressId) {
      this.totalSaleDay(addressId);
      this.getSaleSummarize(addressId);
      this.getHallGameCase(addressId);
      this.getTopFive(addressId);
      this.getSaleRank(addressId);
      this.getHallCount(addressId);
      this.getGameMarket(addressId);
    },
    //获取所有数据
    getAllDataInfo(addressId) {
      this.getGameDaySale(addressId);
      this.totalSaleDay(addressId);
      this.getSaleSummarize(addressId);
      this.getHallGameCase(addressId);
      this.getTopFive(addressId);
      this.getSaleRank(addressId);
      this.getHallCount(addressId);
      this.getGameMarket(addressId);
    },

    fullScreen: windowScreen.fullScreen,
    exitFullScreen: windowScreen.exitFullScreen,
    watchScreen: windowScreen.watchScreen
  },

  beforeDestroy() {
    //释放资源、内存 清空图例数据
    // this.map.clear();
    this.clearTimer();
    clearInterval(this.timerNow);
    this.timerNow = null;
    storage.session.remove("currentMap");
    storage.session.remove("currentCityMap");
    storage.session.remove("titu");
  }
};
</script> 


<style lang="less" scoped>
@import "./less/index.less";
.el-icon-back {
  font-size: 20px;
  margin-right: 10px;
  display: inline-block;
  cursor: pointer;
}
</style>
