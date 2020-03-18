
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
      <el-table-column label="序号" width="80" fixed>
        <template slot-scope="scope">
          <p>{{params.pageSize * (params.page - 1) + scope.$index + 1}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="工单编号" min-width="120px"></el-table-column>
      <el-table-column prop="customerType" label="客户类型" min-width="160px"></el-table-column>
      <el-table-column prop="customerName" label="客户姓名/会员账户" min-width="140px"></el-table-column>
      <el-table-column prop="insName" label="所属机构" min-width="160px"></el-table-column>
      <el-table-column prop="strSourceDevice" label="来源终端" min-width="160px"></el-table-column>
      <el-table-column prop="sourcePage" label="来源页面" min-width="120px"></el-table-column>
      <el-table-column prop="strQuestionType" label="问题类型" min-width="120px"></el-table-column>
      <el-table-column prop="title" label="问题标题" min-width="300px"></el-table-column>
      <el-table-column prop="strStatus" label="问题状态" min-width="120px"></el-table-column>
      <el-table-column prop="teamName" label="所属客服小组" min-width="160px"></el-table-column>
      <el-table-column prop="userName" label="处理人" min-width="120px"></el-table-column>
      <el-table-column prop="commitTime" label="提交时间" min-width="160px"></el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button :id="$route.name + '-' + 'detail' + scope.$index" type="primary" size="mini" v-has="'workOrderList-detail'" @click.native="detail(scope.row)">查看</el-button>
          <el-button :disabled="scope.row.status == 3" :id="$route.name + '-' + 'deal' + scope.$index" type="danger" size="mini" v-has="'workOrderList-deal'" @click.native="deal(scope.row)">处理</el-button>
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
  name: 'workOrderList',
  data() {
    return {
      tableData: [],
      searchOptions:[
        {type: 'input', prop: 'id', value: '', title: '工单编号', placeholder: '请输入'},
        {type: 'input', prop: 'title', value: '', title: '问题标题', placeholder: '请输入'},
        {
          type: 'select', prop: 'status', value: '', title: '问题状态', placeholder: '请选择',
          options: [
            {
              label: '未处理',
              value: 1
            },
            {
              label: '处理中',
              value: 2
            },
            {
              label: '已处理',
              value: 3
            }
          ]
        },
        {type: 'datepicker-range', prop: 'date', value: '', title: '提交时间'},

      ],
      params: {
        page: 1,
        pageSize: 20,
        param: {}
      },
      total: 0,
    }
  },
  created() {
    this.getList(this.params)
  },
  computed: {
    ...mapGetters(['insData'])
  },
  methods: {
    getList(data) {
      const self = this;
      (async (data)=>{
        let res = await self.$api.getServiceTicketList({data})
        console.log(res);
				if(res && res.code == 0) {
          self.total = res.data.total;
          self.tableData = res.data.records;
				}
      })(data)
      
    },
    detail(val) {
      this.$router.push({
        path: './workOrderDetail',
        query: {
          questionType: val.questionType,
          id: val.id,
          teamId: val.teamId
        }
      })
    },
    async deal(val) {
      const id = val.id;
      const res = await this.$api.toTicketProcessing({
        data: {
          id
        }
      });
      if (res && res.code === 0) {
        this.$router.push({
          path: './workOrderDetail',
          query: {
            questionType: val.questionType,
            id: val.id,
            isDeal: 1,
            teamId: val.teamId
          }
        })
        return;
      }
    },
    search(val) {
      this.params.page = 1;
      this.params.param = val;
      if(val.date&&val.date.length>0) {
        this.params.param.beginTime = this.$moment(val.date[0]).format('YYYY-MM-DD')
        this.params.param.endTime = this.$moment(val.date[1]).format('YYYY-MM-DD')
        delete this.params.param.date;
      }
      this.getList(this.params)
    },
    changeSize(val) {
      this.params.page = 1;
      this.params.pageSize = val
      this.getList(this.params)
    },
    changeCurrent(val) {
      this.params.page = val
      this.getList(this.params)
    },
  },
}
</script>


<style lang="less" scoped>
  /deep/.el-table{
    .cell{
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: keep-all;
    }
  }
</style>
