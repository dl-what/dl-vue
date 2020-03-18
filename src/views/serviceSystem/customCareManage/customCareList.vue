<template>
  <div class="vlt-card game-launch-list">
    <search-bar class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      :total="total"
      labelWidth="6em">
    </search-bar>
    <el-table
      border
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%">
      <el-table-column label="序号" fixed width="55">
        <template slot-scope="scope">
          {{params.pageSize*(params.page - 1) + (scope.$index+1)}}
        </template>
      </el-table-column>
      <el-table-column prop="insName" label="所属机构" min-width="120px"></el-table-column>
      <el-table-column prop="channelNo" label="渠道编号" min-width="120px"></el-table-column>
      <el-table-column prop="accountName" label="发送人" min-width="120px"></el-table-column>
      <el-table-column prop="sendModeName" label="发送方式" min-width="120px"></el-table-column>
      <el-table-column prop="content" label="发送内容" min-width="260px" show-overflow-tooltip></el-table-column>
      <el-table-column label="状态" min-width="120px">
        <template slot-scope="scope">
          <span class="icon-circle" 
            :class="{
              blue:scope.row.status=='0',
              green:scope.row.status=='1',
              red:scope.row.status=='2',}">
              {{scope.row.strStatus}}
          </span>
        </template>
      </el-table-column>
      
      <el-table-column prop="createTime" label="发送时间" min-width="160px"></el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" v-has="'customCareList-detail'" @click.native="detail(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <table-paging
      position="right"
      :total="total"
      :currentPage="params.page"
      :pageSize="params.pageSize"
      @handleSizeChange="changeSize"
      @handleCurrentChange="changeCurrent">
    </table-paging>
  </div>
  
</template>

<script>
import moment from 'moment'
import {mapGetters} from 'vuex'

export default {
  name: 'gameMarketPlanList',
  data() {
    return {
      tableData: [],
      searchOptions:[
        {
          type: 'select', prop: 'sendMode', value: '', title: '发送方式', placeholder: '请选择',
          options: [
            {
              label: '短信',
              value: 1
            },
            {
              label: '应用推送',
              value: 2
            },
          ]
        },
        {type: 'datepicker-range', prop: 'date', value: '', title: '发送时间', placeholder: ['开始日期', '结束日期']},
        {type: 'input', prop: 'name', value: '', title: '发送人', placeholder: '请输入'},
        {
          type: 'select', prop: 'status', value: '', title: '状态', placeholder: '请选择',
          options: [
            {
              label: '未发送',
              value: 0
            },
            {
              label: '发送成功',
              value: 1
            },
            {
              label: '发送失败',
              value: 2
            },
          ]
        },
        

      ],
      params: {
        page: 1,
        pageSize: 20,
        param: {}
      },
      total: 0,
      // insData: [],
    }
  },
  created() {
    // this.getInsData();
    this.getCustomerCareList(this.params)
  },
  computed: {
    ...mapGetters(['insData'])
  },
  methods: {
    // 获取机构数据
    getInsData() {
      const self = this;
      const data = {};
      (async (data)=>{
				let res = await self.$api.QueryUserAndInsTree({data})
				if(res && res.code == 0) {
          console.log('res', res.data)
          self.insData = res.data;
          self.getCustomerCareList(self.params)
				} else {
          // self.$message.warning(res.msg)
        }
      })(data)
    },
    getInsArray(val) {
      let arr = val&&val.split(';');
      let textArray = [];
      arr&&arr.forEach((item)=>{
        if(item) {
          let array = this.$formMethods.getInsArray(item, 'id', this.insData, 'text')
          let str;
          if(array&&array.length>2) {
            str = `${array[1]}${array[0]}`
          }else{
            str = array&&array[0];
          }
          textArray.push(str)
        }
      })
      return textArray.join('；')
    },
    getCustomerCareList(data) {
      const self = this;
      (async (data)=>{
        let res = await self.$api.getCustomerCareList({data})
        console.log(res);
				if(res && res.code == 0) {
          self.total = res.data.total;
          self.tableData = res.data.records;
          let options = {
            0: '未发送',
            1: '发送成功',
            2: '发送失败',
          };
          if (self.tableData.length > 0) {
            self.tableData.forEach(item => {
              item.strStatus = options[item.status]
              item.sendModeName = item.sendMode==1?'短信':'应用推送'
            })
          }
				}
      })(data)
    },
    //查看页面跳转
    detail(param) {
      this.$router.push({
        path: './customCareDetail',
        query: {id: param.id}
      })
    },
    search(val) {
      this.params.page = 1;
      this.params.param = val;
      if(val.date&&val.date.length>0) {
        this.params.param.beginDate = this.$moment(val.date[0]).format('YYYY-MM-DD')
        this.params.param.endDate = this.$moment(val.date[1]).format('YYYY-MM-DD')
        delete this.params.param.date;
      }
      this.getCustomerCareList(this.params)
    },
    changeSize(val) {
      this.params.page = 1;
      this.params.pageSize = val
      this.getCustomerCareList(this.params)
    },
    changeCurrent(val) {
      this.params.page = val
      this.getCustomerCareList(this.params)
    },
  },
}
</script>


<style lang="less" scoped>
</style>
