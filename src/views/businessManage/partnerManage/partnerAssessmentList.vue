<template>
  <div class="partner-container">
    <search-bar
      @search="search"
      :options="searchOptions"
      :total="total"
      labelWidth="7.5em">
    </search-bar>
    <el-table :data="tableData" border>
      <el-table-column label="序号" width="80" fixed>
        <template slot-scope="scope">
          <p>{{params.pageSize * (params.page - 1) + scope.$index + 1}}</p>
        </template>
      </el-table-column>
      <el-table-column label="合作伙伴名称" prop="corporateName" min-width="140px"></el-table-column>
      <el-table-column label="所属机构" prop="insName" min-width="140px"></el-table-column>
      <el-table-column label="渠道规模" prop="channelNumber" min-width="100px"></el-table-column>
      <el-table-column label="考核平均分" prop="examineAvgScore" min-width="120px"></el-table-column>
      <el-table-column label="计算系数" prop="coefficient" min-width="140px"></el-table-column>
      <el-table-column label="绩效分数" prop="examineScore" min-width="100px"></el-table-column>
      <el-table-column label="合作伙伴等级" prop="levelName" min-width="110px"></el-table-column>
      <!-- 
      <el-table-column label="操作" min-width="100px" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="$router.push({name: 'partnerAssessmentDetail', query: {id: scope.row.id}})">查看详情</el-button>
        </template>
      </el-table-column> 
      -->
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
  name: 'partnerAssessmentList',
  data() {
    return {
      insId: '',
      total: 0,
      currentPage: 1,
      params: {
        page: 1,
        pageSize: 20
      },
      searchParams: {},
      searchOptions: [
        {title: '合作伙伴名称', type: 'input', prop: 'corporateName', value: ''},
        {title: '所属机构', type: 'cascader', prop: 'insId', value: '', 
          setProps: {
            label: 'text',
            value: 'id',
            children: 'children',
            checkStrictly: true
          },
          options: []
        },
        {title: '考核年月', type: 'month', prop: 'yearMonth', value: new Date()},
        {title: '合作伙伴等级', type: 'select', prop: 'partnerLevelId', value: '', 
          setProps: {
            key: 'id',
            label: 'gradeName'
          },
          options: []
        },
      ],
      tableData: []
    }
  },
  created() {
    this.getInsDataList();
    this.getLevelList();
    this.getList();
  },
  methods: {
    // 获取表单配置项
    getFormOption(formOptions, propName) {
      return formOptions.find(item => item.prop === propName);
    },
    // 获取列表
    async getList() {
      const searchParams = this.searchParams;
      // 拆分年月参数
      if (searchParams.yearMonth) {
        searchParams.examineYear = searchParams.yearMonth.getFullYear();
        searchParams.examineMonth = searchParams.yearMonth.getMonth() + 1;
      }
      if (Array.isArray(searchParams.insName)) {
        searchParams.insName = searchParams.insName.reverse()[0];
      }
      if(searchParams.insId) {
        searchParams.insId = [...searchParams.insId].pop();
      }
      delete searchParams.yearMonth;
      let data = {
        ...this.params,
        param: {
          // 初始当前年月
          examineYear: new Date().getFullYear(),
          examineMonth: new Date().getMonth() + 1,
          ...searchParams,
        }
      }
      const res = await this.$api.getAssessmentList({data})
      if (res && res.code === 0) {
        this.tableData = res.data.records || [];
        this.total = res.data.total;
      }
    },
    // 获取机构列表
    async getInsDataList() {
      const res = await this.$api.getInsDataList();
      if (res && res.code === 0) {
        const formOption = this.getFormOption(this.searchOptions, 'insId');
        this.$set(formOption, 'options', res.data[0].children || []);
      }
    },
    // 获取合作伙伴等级列表
    async getLevelList() {
      const res = await this.$api.getPartnerLevelList({
        data: {
          page: 1,
          pageSize: 100,
          param: {
            insId: this.insId
          }
        }
      })
      if (res && res.code === 0) {
        const formOption = this.getFormOption(this.searchOptions, 'partnerLevelId');
        this.$set(formOption, 'options', res.data.records || []);
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
  },
  components: {

  },
}
</script>


<style lang="less" scoped>
@import "./less/index.less";
</style>
