<template>
<div class="vlt-card">
  <search-bar
    class="search-bar-demo"
    @search="search"
    :options="searchOptions"
    :total="total"
    labelWidth="5em"
  >
    <control-bar slot="extend-bar"  @select="selectBtn" :options="controlOptions"></control-bar>
  </search-bar>
  <el-table border :data="tableData">
    <el-table-column label="序号" type="index" width="60px" fixed="left">
      <template slot-scope="scope">
        {{params.pageSize*(params.page-1)+(scope.$index+1)}}
      </template>
    </el-table-column>
    <el-table-column prop="year" label="年份" min-width="120px"></el-table-column>
    <el-table-column prop="week" label="周序号" min-width="120px"></el-table-column>
    <el-table-column prop="startTime" label="开始时间" min-width="200px"></el-table-column>
    <el-table-column prop="endTime" label="结束时间" min-width="200px"></el-table-column>
    <el-table-column fixed="right" label="操作" min-width="160">
        <template slot-scope="scope">
          <el-button
            v-has="'assessItemSet-edit'"
            type="primary"
            size="mini"
            :id="$route.name+'-'+'edit'+scope.$index"
            @click.native="edit(scope.row)"
          >编辑</el-button>
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
name: "weekParamSetting",
data() {
return {
  searchOptions: [
    {title: "周序号", type: "input", prop: "week", value: ""},
    {title: "年份", type: "input", prop: "year", value: ""}
  ],
  controlOptions: [
    {name: "新增周参数",type: "primary", icon: "plus", permission: "weekParamSetting-add"}
  ],
  tableData: [],
  params: {
    page: 1,
    pageSize: 20,
    param:{}
  },
  total: 0
}
},
created() {
  this.getWeekParamList(this.params)
},
methods: {
  getWeekParamList (data) {
    const self = this;
    (async data =>{
      let res = await self.$api.weekQueryPage({ data });
      console.log(res);
      if (res && res.code == 0) {
        self.total = res.data.total;
        self.tableData = res.data.records;
      }
    })(data)
  },
  selectBtn(val) {
    if (val.name == "新增周参数") {
      this.$router.push({name: "weekParamCreate"})
    }
  },
  search (val) {
    this.params.page = 1;
    this.params.param = val;
    this.getWeekParamList(this.params);
  },
  edit(val) {
    this.$router.push({path: "weekParamEdit", query: {id: val.id}})
  },
  changeSize(val) {
    this.params.page = 1;
    this.params.pageSize = val;
    this.getWeekParamList(this.params);
  },
  changeCurrent(val) {
    this.params.page = val;
    this.getWeekParamList(this.params);
  }
},
}
</script>

<style lang="less" scoped>
</style>
