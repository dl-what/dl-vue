<template>
<!-- 配件查看 -->
<div class="vlt-card">
  <div class="mountings-detail">
    <search-bar class="search-bar-demo" @search="search" :options="searchOptions" :total="total" labelWidth="6em"></search-bar>
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column prop="id" fixed label="序号" type="index" width="60px">
      <template slot-scope="scope">
        {{params.pageSize*(params.page-1)+(scope.$index+1)}}
      </template>
    </el-table-column>
    <el-table-column prop="goodsName" label="配件名称" min-width="140px"></el-table-column>
    <el-table-column prop="deviceModel" label="配件型号" min-width="120px"></el-table-column>
    <el-table-column prop="sequenceCode" label="序列号" min-width="140px"></el-table-column>
    <el-table-column prop="inOutType" label="出入库类型" min-width="120px">
      <template slot-scope="scope">
        <span
          class="icon-tag"
          :class="{
          blue:scope.row.inOutType=='0',
          green:scope.row.inOutType=='1',
          grey:scope.row.inOutType=='2',
          yellow:scope.row.inOutType=='3',
          red:scope.row.inOutType=='4',
          }"
        >{{scope.row.strInOutType}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="operateAmount" label="数量" min-width="100px"></el-table-column>
    <el-table-column prop="operateTime" label="出入库时间" min-width="160px"></el-table-column>
    <el-table-column prop="reserve" label="剩余库存" min-width="100px"></el-table-column>
    <el-table-column prop="deviceUnit" label="单位" min-width="90px"></el-table-column>
    <el-table-column prop="warName" fixed="right" label="仓库名称" min-width="200px"></el-table-column>
  </el-table>
  <table-paging position="right" :total="total" :currentPage="params.page" :pageSize="params.pageSize"
    @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
  </table-paging>
  </div>
</div>
</template>

<script type="text/javascript">
export default {
name: "mountingsDetail",
data() {
return {
  tableData:[],
  searchOptions:[
    { title: "序列号", type: "input", prop: "sequenceCode", value: "",},
    { title: "出入库时间", type: "datepicker-range", prop: "date", value: "" },
    { title: "仓库名称", type: "input", prop: "warName", value: "",}
  ],
  params: {
    page: 1,
    pageSize: 20,
    param: {}
  },
  total:0
}
},
created() {
  this.params.param = {
    deviceModelId: this.$route.query.deviceModelId,
    goodsName: this.$route.query.goodsName,
    goodsType: 2
  }
  this.getDetail(this.params)
},
methods: {
  getDetail(data) {
    const self = this;
    (async data =>{
    let res = await self.$api.inventoryDetail({ data })
    if (res && res.code == 0) {
      console.log(res)
      self.total = res.data.total
      res.data.records.forEach((item)=>{
        item.strInOutType = item.inOutType==0?'出库':'入库'
      })
      self.tableData = res.data.records
    }
    })(data)
  },
  search(val) {
    let time = val.date;
    if (time && time.length > 0) {
      val.startTime = this.$moment(time[0]).format("YYYY-MM-DD");
      val.endTime = this.$moment(time[1]).format("YYYY-MM-DD");
      delete val.date
    };
    this.params.page = 1;
    this.params.param = {
      ...val,
      deviceModelId: this.$route.query.deviceModelId,
      goodsName: this.$route.query.goodsName,
      goodsType: 2
    };
    console.log(this.params)
    this.getDetail(this.params)
  },
  handleSizeChange(pageSize) {
    this.params.page = 1;
    this.params.pageSize = pageSize;
    this.getDetail(this.params)
  },
  handleCurrentChange(currentPage) {
    this.params.page = currentPage;
    this.getDetail(this.params)
  },
  getOutInType(val) {
    let options = {
      1: '入库',
      0: '出库'
    }
    return options[val]
  },
},
}
</script>

<style lang="less" scoped>
</style>
