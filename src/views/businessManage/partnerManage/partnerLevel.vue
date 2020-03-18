<template>
  <div class="partner-container">
    <search-bar
      @search="search"
      :options="searchOptions"
      :total="total"
      labelWidth="6em">
      <control-bar slot="extend-bar" @select="select" :options="controlOptions"></control-bar>
    </search-bar>
    <el-table :data="tableData" border>
      <el-table-column label="序号" width="80" fixed>
        <template slot-scope="scope">
          <p>{{params.pageSize * (params.page - 1) + scope.$index + 1}}</p>
        </template>
      </el-table-column>
      <el-table-column label="等级名称" prop="gradeName" min-width="140px"></el-table-column>
      <el-table-column label="等级最低分值" prop="minScore" min-width="140px"></el-table-column>
      <el-table-column label="等级最高分值" prop="maxScore" min-width="140px"></el-table-column>
      <el-table-column label="生效日期" prop="effectiveTime" min-width="140px"></el-table-column>
      <el-table-column label="等级描述" prop="gradeDesc" min-width="140px"></el-table-column>
      <el-table-column label="创建时间" prop="createTime" min-width="160px"></el-table-column>
      <el-table-column label="更新时间" prop="updateTime" min-width="160px"></el-table-column>
      <el-table-column label="状态" min-width="140px" fixed="right">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-text="scope.row.status === 1 ? '启用' : '冻结'"
            :active-value="1"
            :inactive-value="0"
            @change="updateStatus(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="180px" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" v-has="'partnerLevelDetail'" @click="$router.push({name: 'partnerLevelDetail', query: {id: scope.row.id}})">查看</el-button>
          <el-button :disabled="scope.row.status == 1" size="mini" v-has="'parterLevelEdit'" @click="$router.push({name: 'editLevel', query: {id: scope.row.id}})">编辑</el-button>
          <el-button :disabled="scope.row.status == 1" type="danger" v-has="'parterLevelDel'" size="mini" @click="remove(scope.row, scope.$index)">删除</el-button>
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
import storage from '@/utils/storage'
import moment from 'moment'
export default {
  name: 'partnerLevel',
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
      searchOptions: [
        {title: '等级名称', type: 'input', prop: 'gradeName', value: ''},
        {
          title: "等级分值",
          type: "minMax",
          prop: "minMax",
          value: "",
          options: ["minScore", "maxScore"]
        },
        {title: '生效日期', type: 'datepicker-range', prop: 'effectiveTime', value: ''},
        {title: '等级状态', type: 'select', prop: 'status', value: '', options: [
          {label: '冻结',value: 0},
          {label: '启用',value: 1}
        ]},
      ],
      controlOptions: [
        {name: '新增等级', type: 'primary', icon: 'plus', permission: 'add-partnerLevel'},  // type为按钮的五种颜色， icon为具体的图标
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
      const res = await this.$api.getPartnerLevelList({
        data: {
          ...this.params,
          param: {
            ...this.searchParams,
            insId: this.insId
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
      this.$router.push({path:'./createLevel'})
    },
    async updateStatus(item) {
      const res = await this.$api.editPartnerLevel({
        message: '操作成功',
        data: {
          id: item.id,
          status: item.status
        }
      })
      if (res && res.code === 0) {
        console.log(item.status)
      }
    },
    remove(item, index) {
      this.$confirm(`确定删除${item.gradeName}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(async () => {
        const res = await this.$api.delPartnerLevel({
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
