<template>
  <div class="partner-container">
    <search-bar
      @search="search"
      :options="searchOptions"
      :total="total"
      labelWidth="86px">
      <control-bar slot="extend-bar" @select="select" :options="controlOptions"></control-bar>
    </search-bar>
    <el-table :data="tableData" border>
      <el-table-column label="序号" width="80" fixed>
        <template slot-scope="scope">
          <p>{{params.pageSize * (params.page - 1) + scope.$index + 1}}</p>
        </template>
      </el-table-column>
      <el-table-column label="规则名称" prop="ruleName" min-width="140px"></el-table-column>
      <el-table-column label="生效日期" prop="startTime" min-width="240px">
        <template slot-scope="scope">
          {{`${scope.row.startTime} ~ ${scope.row.endTime}`}}
        </template>
      </el-table-column>
      <!-- <el-table-column label="生效结束日期" prop="endTime" min-width="120px"></el-table-column> -->
      <el-table-column label="规则描述" prop="ruleDesc" min-width="140px"></el-table-column>
      <el-table-column label="创建时间" prop="createTime" min-width="150px"></el-table-column>
      <el-table-column label="更新时间" prop="updateTime" min-width="150px"></el-table-column>
      <el-table-column label="操作" min-width="180px" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" v-has="'partnerRuleDetail'" @click="$router.push({name: 'partnerRuleDetail', query: {id: scope.row.id}})">查看</el-button>
          <el-button type="" size="mini" v-has="'partnerRuleEdit'" @click="$router.push({name: 'editRule', query: {id: scope.row.id}})">编辑</el-button>
          <el-button type="danger" size="mini" v-has="'partnerRuleDel'" @click="remove(scope.row, scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <table-paging
      :total="total"
      :currentPage="currentPage"
      :pageSize="params.pageSize"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></table-paging>
  </div>
</template>

<script>
import moment from 'moment'
import storage from '@/utils/storage'
export default {
  name: 'assessmentRules',
  data() {
    return {
      insId: storage.get('userInfo').insId,
      total: 0,
      currentPage: 1,
      params: {
        page: 1,
        pageSize: 20
      },
      searchParams: {},
      currentRowItem: null,
      searchOptions: [
        {title: '规则名称', type: 'input', prop: 'ruleName', value: ''},
        {title: '生效日期', type: 'datepicker-range', prop: 'effectiveTime', value: ''},
      ],
      controlOptions: [
        {name: '新增规则', type: 'primary', icon: 'plus', permission: 'add-assessmentRules'},  // type为按钮的五种颜色， icon为具体的图标
      ],
      tableData: []
    }
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取列表
    async getList() {
      if (this.searchParams.effectiveTime) {
        this.searchParams.startTime = moment(this.searchParams.effectiveTime[0]).format("YYYY-MM-DD")
        this.searchParams.endTime = moment(this.searchParams.effectiveTime[1]).format("YYYY-MM-DD")
        delete this.searchParams.effectiveTime
      }
      const res = await this.$api.getPartnerRuleList({
        data: {
          ...this.params,
          param: {
            ...this.searchParams,
            insId: this.insId,
          }
        }
      })
      if (res && res.code === 0) {
        this.tableData = res.data.records || [];
        this.tableData.forEach(item => {
          if (item.createTime) {
            item.createTime = moment(item.createTime).format("YYYY-MM-DD HH:mm:ss")
          }
          if (item.updateTime) {
            item.updateTime = moment(item.updateTime).format("YYYY-MM-DD HH:mm:ss")
          }
        })
        this.total = res.data.total;
      }
    },
    // 搜索
    search(form) {
      this.searchParams = {...form};
      this.params.page = 1;
      this.getList();
    },
    // 分页
    handleSizeChange(size) {
      this.params.pageSize = size;
      this.getList();
    },
    handleCurrentChange(currentPage) {
      this.params.page = currentPage;
      this.getList();
    },
    select(val) {
      this.$router.push({path:'./createRule'})
    },
    remove(item, index) {
      this.$confirm(`确定删除${item.ruleName}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(async () => {
        const res = await this.$api.delPartnerRule({
          message: '删除成功',
          data: {
            insId: this.insId,
            id: item.id,
          }
        })
        if (res && res.code === 0) {
          this.tableData.splice(index, 1);
          this.total -= 1;
        }
      }).catch(() => {
        console.log('已取消删除')
      })
    }
  },
  components: {

  },
}
</script>


<style lang="less" scoped>
@import "./less/index.less";
</style>
