<template>
<div class="vlt-card">
  <panel title="基本信息" :show="true">
    <base-info :infoList="infoList"></base-info>
  </panel>
</div>
</template>

<script type="text/javascript">
export default {
name: "weatherParamDetail",
data() {
return {
  infoList: [
    {title:'日期',value:'',prop:'day'},
    {title:'星期几',value:'',prop:'dayOfWeek'},
    {title:'省级名称',value:'',prop:'provinceName'},
    // {title:'省级编码',value:'',prop:'provinceCode'},
    {title:'市级名称',value:'',prop:'cityName'},
    // {title:'市级编码',value:'',prop:'cityCode'},
    {title:'天气',value:'',prop:'weather'},
    {title:'气温',value:'',prop:'airTemperature'},
    {title:'风向',value:'',prop:'wind'},
    {title:'是否节假日',value:'',prop:'isHoliday'},
    {title:'节假日名称',value:'',prop:'holiday'},
    {title:'事件名称',value:'',prop:'eventName'},
    {title:'事件地址',value:'',prop:'eventAddress'},
    {title:'事件内容',value:'',prop:'eventContent'}
  ]
}
},
created() {
  let data = this.$route.query.id;
  this.getDetail(data);
},
methods: {
  getDetail(data) {
    const self = this;
    (async data =>{
      let res = await self.$api.getWeatherDetail({ data });
      console.log(res)
      if (res && res.code == 0) {
        // 天气
        let option = {
          0: "晴",
          1: "雨",
          2: "雪",
          3: "阴",
          4: "雾",
          5: "雷雨"
        };
        let dayList = {
          1: "星期一",
          2: "星期二",
          3: "星期三",
          4: "星期四",
          5: "星期五",
          6: "星期六",
          7: "星期天"
        }
        this.infoList.forEach(item =>{
          item.value = res.data[item.prop];
          if (item.prop == "day") {
            item.value = self.$moment(res.data.day).format("YYYY-MM-DD")
          };
          if (item.prop == "weather") {
            item.value = option[res.data.weather]
          };
          if (item.prop == "dayOfWeek") {
            item.value = dayList[res.data.dayOfWeek]
          };
          if (item.prop == "isHoliday") {
            item.value = res.data.isHoliday&&res.data.isHoliday == 1 ? "是" : "否";
          };
        })
      }
    })(data)
  }
},
}
</script>

<style lang="less" scoped>
</style>
