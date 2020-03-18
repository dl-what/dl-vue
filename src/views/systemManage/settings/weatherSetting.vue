<template>
<div class="vlt-card">
  <search-bar
    ref="searchForm"
    class="search-bar-demo"
    @search="search"
    :options="searchOptions"
    :total="total"
    labelWidth="6em"
    @change="changeSearch"
    @searchReset="reset"
  >
    <control-bar slot="extend-bar"  @select="selectBtn" :options="controlOptions"></control-bar>
  </search-bar>
  <el-table border :data="tableData">
    <el-table-column label="序号" type="index" width="60px" fixed="left">
      <template slot-scope="scope">
        {{params.pageSize*(params.page-1)+(scope.$index+1)}}
      </template>
    </el-table-column>
    <el-table-column prop="day" label="日期" min-width="120"></el-table-column>
    <el-table-column prop="dayOfWeek" label="星期几" min-width="120">
      <template slot-scope="scope">{{getDay(scope.row.dayOfWeek)}}</template>
    </el-table-column>
    <!-- <el-table-column prop="provinceCode" label="省级编码" min-width="120"></el-table-column> -->
    <el-table-column prop="provinceName" label="省级名称" min-width="120"></el-table-column>
    <!-- <el-table-column prop="cityCode" label="城市编码" min-width="120"></el-table-column> -->
    <el-table-column prop="cityName" label="城市名称" min-width="120"></el-table-column>
    <el-table-column prop="weather" label="天气" min-width="120">
      <template slot-scope="scope">{{getWeatherType(scope.row.weather)}}</template>
    </el-table-column>
    <el-table-column prop="airTemperature" label="气温" min-width="120"></el-table-column>
    <el-table-column prop="wind" label="风向" min-width="120"></el-table-column>
    <el-table-column prop="isHoliday" label="是否是节假日" min-width="120"></el-table-column>
    <el-table-column prop="holiday" label="节假日名称" min-width="140"></el-table-column>
    <el-table-column prop="eventName" label="事件名称" min-width="140"></el-table-column>
    <el-table-column prop="eventAddress" label="事件地址" min-width="120"></el-table-column>
    <el-table-column prop="eventContent" label="事件内容" min-width="200"></el-table-column>
    <el-table-column fixed="right" label="操作" min-width="190">
      <template slot-scope="scope">
        <el-button
          v-has="'weatherSetting-detail'"
          size="mini"
          type="primary"
          :id="$route.name+'-'+'detail'+scope.$index"
          @click="detail(scope.row)"
        >查看</el-button>
        <el-button
          v-has="'weatherSetting-edit'"
          type
          size="mini"
          :id="$route.name+'-'+'edit'+scope.$index"
          @click.native="edit(scope.row)"
        >编辑</el-button>
        <el-button
          type="danger"
          size="mini"
          v-has="'weatherSetting-delete'"
          @click="toDelete(scope.row)"
          :id="$route.name+'-'+'delete'+scope.$index"
        >删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <table-paging
    position="right"
    :total="total"
    :currentPage="params.page "
    :pageSize="params.pageSize"
    @handleSizeChange="changeSize"
    @handleCurrentChange="changeCurrent"
  ></table-paging>
</div>
</template>

<script type="text/javascript">
export default {
name: "weatherSetting",
data() {
return {
  searchOptions: [
    {title: "日期", type: "datepicker",prop: "day", value: ""},
    { title: "省级名称", type: "select", prop: "provinceId", value: "", options: []},
    { title: "城市名称", type: "select", prop: "cityId", value: "", options: []},
    // {title: "省级名称", type: "select",prop: "proviceName", value: ""},
    // {title: "城市名称", type: "select",prop: "cityName", value: ""},
    {title: "节假日名称", type: "input",prop: "holiday", value: ""},
    {title: "事件名称", type: "input",prop: "eventName", value: ""},
    {title: "天气", type: "select",prop: "weather", value: "", options: [
      {label: "晴", value: 0},
      {label: "雨", value: 1},
      {label: "雪", value: 2},
      {label: "阴", value: 3},
      {label: "雾", value: 4},
      {label: "雷雨", value: 5}
    ]},
  ],
  controlOptions: [
    {name: "新增天气设置", type: "primary", icon: "plus", permission: "weatherSetting-add"}
  ],
  tableData: [],
  params: {
    page: 1,
    pageSize: 20,
    param: {}
  },
  total: 0,
  proviceList: [],
  startValue: null
}
},
created() {
  this.getInsData();
  this.getWeatherList(this.params)
},
methods: {
  // 获取所属机构列表
  // getInsData() {
  //   const data = {};
  //   const self = this;
  //   (async data => {
  //     let res = await self.$api.getSearchInsList({ data });
  //     if (res && res.code == 0) {
  //       self.insData = res.data;
  //       console.log('机构数据',res)
  //       self.$set(self.searchOptions[1], "options", res.data);
  //       self.$set(self.searchOptions[2], "options", res.data);
  //       // this.getTypeOption()
  //     }
  //   })(data);
  // },
  getInsData(){
    const self = this
    const data = {};
    (async data =>{
      let res = await self.$api.getInsDataList({ data });
      console.log("机构数据",res)
      if (res && res.code == 0){
        let list = res.data;
        let topItem = list[0];
        if (topItem && topItem.id == 1) {
          console.log(topItem.children)
          let arr = [];
          topItem.children.forEach(item =>{
            let obj = {};
            obj.label = item.text;
            obj.value = item.id;
            arr.push(obj);
          })
          self.$set(self.searchOptions[1], "options", arr)
          this.proviceList = topItem.children || [];
        } else {
          self.$set(self.searchOptions[1], "options", [])
          // this.proviceList = list || [];
        }
      }
    })(data)
  },
  getWeatherList(data) {
    const self = this;
    (async data =>{
      let res = await self.$api.queryWeatherList({ data })
      console.log(res)
      if (res && res.code == 0) {
        res.data.records.forEach(item =>{
          item.day = self.$moment(item.day).format("YYYY-MM-DD");
          if (String(item.isHoliday)) {
            item.isHoliday = item.isHoliday == 1 ? "是" : "否";
          }
        });
        self.total = res.data.total;
        self.tableData = res.data.records;
      }
    })(data)
  },
  search(val) {
    this.params.page = 1;
    if (val.day) {
      val.day = Date.parse(val.day);
    };
    console.log(val);
    this.params.param = val;
    this.getWeatherList(this.params)
  },
  changeSearch(val) {
    if (val.provinceId) {
      if (this.startValue != val.provinceId){
        let currentIns = this.getType(this.proviceList, val.provinceId);
        let cityArr = currentIns.children&&currentIns.children.map(item =>{return {label: item.text, value: item.id}});
        console.log(this.$refs.searchForm);
        this.$set(this.$refs.searchForm.form, "cityId", "");
        this.$set(this.searchOptions[2], "options", cityArr);
        this.startValue = val.provinceId;
      }
    }
  },
  reset() {
    this.startValue = null;
    this.$set(this.$refs.searchForm.options[2], "options", [])
  },
  detail(val) {
    this.$router.push({path: "weatherParamDetail", query: {id: val.dayId}})
  },
  edit(val) {
    console.log(val)
    this.$router.push({path: "weatherParamEdit", query: {id: val.dayId}})
  },
  toDelete(val) {
    const self = this;
    this.$confirm('是否确认删除?', '提示', {
      confimButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () =>{
      let data = val.dayId;
      let res = await self.$api.deleteWeather({message: "删除成功", data});
      if (res && res.code == 0) {
        this.getWeatherList(this.params);
      }
    }).catch(() =>{
      this.$message({
        type: 'warning',
        message: '已取消删除'
      })
    })
  },
  selectBtn(val) {
    if (val.name == "新增天气设置") {
      this.$router.push({name: "weatherSetCreate"})
    }
  },
  changeSize(val) {
    this.params.page = 1;
    this.params.pageSize = val;
    this.getWeatherList(this.params);
  },
  changeCurrent(val) {
    this.params.page = val;
    this.getWeatherList(this.params);
  },
  getWeatherType(val) {
    let option = {
      0: "晴",
      1: "雨",
      2: "雪",
      3: "阴",
      4: "雾",
      5: "雷雨"
    };
    return option[val]
  },
  getDay(val) {
    let option = {
      1: "星期一",
      2: "星期二",
      3: "星期三",
      4: "星期四",
      5: "星期五",
      6: "星期六",
      7: "星期天"
    };
    return option[val]
  },
  getType(insData, insId) {
    let res = null;
    if (!insData) {
      return;
    }
    for (let i in insData) {
      let item = insData[i]
      if (item.id == insId) {
        res = item;
        break;
      }else if(item.children && item.children.length > 0) {
        res = this.getType(item.children, insId)
      }
    }
    return res;
  }
},
}
</script>

<style lang="less" scoped>
</style>
