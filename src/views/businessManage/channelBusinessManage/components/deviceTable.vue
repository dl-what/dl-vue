<template>
  <div>
    <!-- 设备列表 -->
    <el-table :data="tableData" border>
      <el-table-column label="序号" type="index" width="55px"></el-table-column>
      <el-table-column label="设备名称" prop="deviceName"></el-table-column>
      <el-table-column label="设备型号" prop="deviceModel"></el-table-column> 
      <el-table-column label="设备状态">
        <template slot-scope="scope">
          <span class="icon-circle" 
            :class="{
              blue:scope.row.status=='1',
              green:scope.row.status=='0',
              red:scope.row.status=='2',}">
              {{scope.row.strStatus}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="设备序列号" prop="serial"></el-table-column>
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
          goodsType: 1
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
    // 设备列表
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
          let options = {
            0: '正常',
            1: '已损坏',
            2: '故障'
          }
          self.tableData.forEach((item)=>{
            item.strStatus = options[item.status];
          })
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
