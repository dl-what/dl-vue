<template>
<!-- 电子支付对账 -->
 <div class="vlt-card">
      <section class="comp-item">
      <search-bar
        class="search-bar-demo"
        @search="search"
        :options="searchOptions"
        :total="999"
        labelWidth="6em"
      >
        <control-bar
          slot="extend-bar"
          @select="selectBtn"
          :options="controlOptions"
          position="left"
        ></control-bar>
      </search-bar>
    </section>
    <!-- table -->
    <el-table :data="tableData" border style="width: 100%; margin-top: 10px">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="date" label="支付机构"></el-table-column>
        <el-table-column prop="name" label="对账日期"></el-table-column>
        <el-table-column prop="province" label="总交易数"></el-table-column>
        <el-table-column prop="city" label="总交易金额"></el-table-column>
        <el-table-column prop="address" label="多记录数"></el-table-column>
        <el-table-column prop="zip" label="多交易金额"></el-table-column>
        <el-table-column prop="zip" label="少记录数"></el-table-column>
        <el-table-column prop="zip" label="少交易金额"></el-table-column>
        <el-table-column prop="zip" label="对账状态"></el-table-column>
        <el-table-column prop="zip" label="对帐结果">
          <template slot-scope="scope">
           
          </template>
        </el-table-column>
        <el-table-column prop="zip" label="对账时间"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type='text' v-if="false">
              重新对账
            </el-button>
            <el-button type='text'>
              立即对账
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="zip" label="详情">
          <template slot-scope="scope">
          <el-button type='text' @click="lookDetails(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
         <table-paging
        position="left"
        :total="999"
        :currentPage="1"
        :pageSize="10"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      ></table-paging>
      <div v-if="true">
        <el-table :data="tableDataDetails" border style="width: 100%; margin-top: 10px">
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="date" label="支付机构"></el-table-column>
          <el-table-column prop="name" label="账户编号"></el-table-column>
          <el-table-column prop="province" label="支付订单编号"></el-table-column>
          <el-table-column prop="city" label="交易类型"></el-table-column>
          <el-table-column prop="address" label="支付金额"></el-table-column>
          <el-table-column prop="zip" label="交易时间"></el-table-column>   
        </el-table>
        <table-paging
          position="left"
          :total="999"
          :currentPage="1"
          :pageSize="10"
          @handleSizeChange="handleSizeChangeDetails"
          @handleCurrentChange="handleCurrentChangeDetails"
        ></table-paging>
      </div>
 </div>
</template>

<script type="text/javascript">
export default {
 name: "",
 data() {
 return {
   searchOptions:[
       {
          title: "设备状态",
          type: "select",
          prop: "selectName",
          value: "",
          options: [
            { label: "选项1",value: 1},
            { label: "选项2",value: 2}
          ]
        },
        { title: "开售日期", type: "datepicker-range", prop: "date1", value: "" },
   ],
   controlOptions:[
      { name: "打印", type: "primary", icon: "printer" },
      { name: "导出", type: "danger", icon: "download" },
   ],
  tableData:[
    {

    },
  ],
  tableDataDetails:[

  ]
 }
 },
 components: {
 },
 methods: {
   handleSizeChange(){

   },
   handleCurrentChange(){

   },
   handleSizeChangeDetails(){

   },
   handleCurrentChangeDetails(){

   },
   lookDetails(row){

   }
 },
}
</script>

<style lang="less" scoped>
</style>
