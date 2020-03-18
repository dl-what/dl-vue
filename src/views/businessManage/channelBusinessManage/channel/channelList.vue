<template>
  <div class="vlt-card">
    <search-bar class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      :total="total"
      labelWidth="6em"
    >
      <control-bar slot="extend-bar" @select="select" :options="controlOptions"></control-bar>
    </search-bar>
    <el-table :data="tableData" border>
      <el-table-column label="序号" fixed width="55">
        <template slot-scope="scope">
          {{params.pageSize*(params.page - 1) + (scope.$index+1)}}
        </template>
      </el-table-column>
      <el-table-column label="渠道编号" prop="channelNo" min-width="120px"></el-table-column>
      <!-- <el-table-column label="渠道名称" prop="channelName"></el-table-column> -->
      <el-table-column label="渠道类型" prop="channelType" min-width="120px">
        <template slot-scope="scope">
          {{scope.row.channelType==0?'自营厅':'合作厅'}}
        </template>
      </el-table-column>
      <el-table-column label="所属机构" prop="insName" min-width="120px"></el-table-column>
      <el-table-column label="渠道等级" prop="channelLevelName" min-width="120px"></el-table-column>
      <el-table-column label="负责人" prop="accountName" min-width="120px"></el-table-column>
      <el-table-column label="联系电话" prop="phone" min-width="120px"></el-table-column>
      <el-table-column label="创建时间" prop="createTime" min-width="160px"></el-table-column>
      <el-table-column label="操作" fixed="right" min-width="100px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" v-has="'channelList-detail'" @click="detail(scope.row.channelId, 'game-permission')">查看</el-button>
        </template>
      </el-table-column>
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

<script>
export default {
  name: 'channelList',
  data() {
    return {
      searchOptions: [
        {title: '渠道编号', type: 'input', prop: 'channelNo', value: '', maxlength: 10},
        {title: '渠道类型', type: 'select', prop: 'channelType', value: '', options: [{label: '自营厅',value: 0},{label: '合作厅',value: 1}]},
        {title: '渠道等级', type: 'select', prop: 'channelLevelId', value: '', options: []},
        {title: '负责人', type: 'input', prop: 'accountName', value: '', },
        {title: '联系电话', type: 'input', prop: 'phone', value: '', },
        {title: '创建时间', type: 'datepicker-range', prop: 'date', value: ''},
      ],
      controlOptions: [
        {name: '导出当前', type: 'primary', icon: 's-promotion', permission: 'channelList-export'},
        {name: '导出全部', type: '', icon: 's-promotion', permission: 'channelList-export-all'},   
      ],
      tableData: [],
      total: 0,
      params: {
        page: 1,
        pageSize: 20,
        param: {}
      }
    }
  },
  created() {
    this.getChannelList(this.params)
    this.getChannelGradeList()
  },
  methods: {
    // 渠道等级列表-下拉框
    getChannelGradeList(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getChannelGradeList({ data });
        if (res && res.code == 0) {
          let array = [];
          res.data.forEach((item)=>{
            let obj = {};
            obj.label = item.chLevelName;
            obj.value = item.chGradeId;
            array.push(obj)
          })
          self.searchOptions[2].options = array;
        }
      })(data);
    },
    // 导出列表
    async exportExcel(all) {
      const res = await this.$api.exportChannelExcel({
        data: {
          page: this.params.page,
          pageSize: this.params.pageSize,
          param: { 
            all,
            ...this.params.param,
          }
        },
        responseType: "blob"
      });
      var blob = new Blob([res.blob], {
        type: "application/vnd.ms-excel;charset=utf-8"
      });
      var url = window.URL.createObjectURL(blob);
      var aLink = document.createElement("a");
      aLink.style.display = "none";
      aLink.href = url;
      aLink.setAttribute("download", "渠道列表.xls");
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
    },
    getChannelList(data) {
      const self = this;
      (async (data)=>{
				let res = await self.$api.getChannelList({data})
				if(res && res.code == 0) {
          self.total = res.data.total;
          res.data.records.forEach(item => {
            item.createTime = item.createTime&&this.$moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
          });
          self.tableData = res.data.records;
				}
      })(data)
    },
    detail(channelId) {
      this.$router.push({path:'./channelDetail',query:{channelId}})
    },
    search(val) {
      this.params.page = 1;
      this.params.param = val;
      if(val.date&&val.date.length>0) {
        // this.params.param.startTime = new Date(val.date[0]).getTime();
        // this.params.param.endTime = new Date(val.date[1]).getTime();
        this.params.param.startTime = this.$moment(val.date[0]).format('YYYY-MM-DD')
        this.params.param.endTime = this.$moment(val.date[1]).format('YYYY-MM-DD')
        delete this.params.param.date;
      }
      this.getChannelList(this.params)
    },
    select(val) {
      if(val.name=='导出当前') {
        this.exportExcel(false);
      }else{
        this.exportExcel(true);
      }
    },
    changeSize(val) {
      console.log(`每页 ${val} 条`);
      this.params.page = 1;
      this.params.pageSize = val;
      this.getChannelList(this.params)
    },
    changeCurrent(val) {
      console.log(`当前页: ${val}`);
      this.params.page = val;
      this.getChannelList(this.params)
    },
    add() {
      console.log('a')
    }
  },
}
</script>


<style lang="less" scoped>
@import '../less/index.less';
</style>
