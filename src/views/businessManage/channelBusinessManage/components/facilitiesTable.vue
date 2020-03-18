<template>
  <div>
    <!-- 设施列表 -->
    <el-table :data="tableData" border>
      <el-table-column label="序号" type="index" width="55px"></el-table-column>
      <el-table-column label="设施名称" prop="deviceName"></el-table-column>
      <el-table-column label="设施单位" prop="deviceUnit"></el-table-column>    
      <el-table-column label="库存数量" prop="inventory"></el-table-column>   
    </el-table>
    <table-paging
      position="right"
      :total="total"
      :currentPage="params.page "
      :pageSize="params.pageSize"
      @handleSizeChange="changeSize"
      @handleCurrentChange="changeCurrent">
    </table-paging>
  </div>
</template>

<script type="text/javascript">

export default {
  name: "",
  data() {
    return {
      params: {
        page: 1,
        pageSize: 20,
        param: {
          channelId: this.$route.query.channelId,
          goodsType: 4
        }
      },
      total: 0,
      tableData: [],
    }
  },
  created() {
    this.getChannelResource(this.params)
  },
  methods: {
    // 设施列表
    getChannelResource(data) {
      const self = this;
      (async (data)=>{
				let res = await self.$api.getChannelResource({data})
				if(res && res.code == 0) {
          console.log(res.data)
          self.total = res.data.total;
          self.params.pageSize = res.data.size;
          self.params.page = res.data.current;
          self.tableData = res.data.records;
				}
      })(data)
    },
    changeSize(val) {
      this.params.page = 1;
      this.params.pageSize = val;
      this.getChannelResource(this.params)
    },
    changeCurrent(val) {
      this.params.page = val;
      this.getChannelResource(this.params)
    },
  },
}
</script>

<style lang="less" scoped>

</style>
