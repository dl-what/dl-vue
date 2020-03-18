<template>
  <div class="partner-container">
    <search-bar
      @search="search"
      :options="searchOptions"
      :total="total"
      labelWidth="7.5em">
      <control-bar slot="extend-bar" @select="select" :options="controlOptions"></control-bar>
    </search-bar>
    <el-table :data="tableData" border>
      <el-table-column label="序号" width="80" fixed>
        <template slot-scope="scope">
          <p>{{params.pageSize * (params.page - 1) + scope.$index + 1}}</p>
        </template>
      </el-table-column>
      <el-table-column label="合作伙伴编号" prop="partnerNumber" min-width="140px"></el-table-column>
      <el-table-column label="公司名称" prop="corporateName" min-width="140px"></el-table-column>
      <el-table-column label="合作伙伴等级" prop="levelName" min-width="140px"></el-table-column>
      <el-table-column label="所属机构" prop="insName" min-width="120px"></el-table-column>
      <el-table-column label="公司地址" prop="address" min-width="160px"></el-table-column>
      <el-table-column label="联系人" prop="contacts" min-width="100px"></el-table-column>
      <el-table-column label="手机号码" prop="cellphone" min-width="120px"></el-table-column>
      <el-table-column label="签约时间" prop="signingTime" min-width="160px"></el-table-column>
      <el-table-column label="合作状态" prop="status" min-width="180px" fixed="right">
        <template slot-scope="scope">
          <table-row-status
            :scope="scope"
            idField="id"
            statusField="status"
            :rowName="scope.row.name"
            :option="{
              enable: {
                permission: 'partnerList-enable',
                label: '启用',
                apiName: 'editPartner',
                value: 1
              },
              disable: {
                permission: 'partnerList-disable',
                label: '冻结',
                apiName: 'editPartner',
                value: 2
              },
              logout: {
                permission: 'partnerList-logout',
                label: '注销',
                apiName: 'editPartner',
                value: 3
              }
            }"
          ></table-row-status>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="140px" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" v-has="'partnerDetail'" @click="$router.push({name: 'partnerDetail', query: {id: scope.row.id}})">查看</el-button>
          <el-button size="mini" v-has="'partnerEdit'" @click="$router.push({name: 'partnerEdit', query: {id: scope.row.id}})" :disabled="scope.row.status != 2">编辑</el-button>
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
  name: 'partnerList',
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
        {title: '合作伙伴编号', type: 'input', prop: 'partnerNumber', value: ''},
        {title: '联系人', type: 'input', prop: 'contacts', value: ''},
        {title: '合作状态', type: 'select', prop: 'status', value: '', options: [
          {label: '启用', value: 1},
          {label: '冻结', value: 2},
          {label: '注销', value: 3}
        ]},
        {title: '签约时间', type: 'datepicker-range', prop: 'signingTime', value: ''},
      ],
      controlOptions: [
        {name: '新增合作伙伴', type: 'primary', icon: 'plus', permission: 'add-partner'},  // type为按钮的五种颜色， icon为具体的图标
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
      const res = await this.$api.getPartnerList({
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
          if (item.signingTime) {
            item.createTime = moment(item.signingTime).format("YYYY-MM-DD HH:mm:ss")
          }
        })
        this.total = res.data.total;
      }
    },
    // 搜索
    search(form) {
      this.searchParams = {
        ...form,
      };
      if (form.signingTime) {
        this.searchParams.startTime = moment(form.signingTime[0]).format("YYYY-MM-DD");
        this.searchParams.endTime = moment(form.signingTime[1]).format("YYYY-MM-DD");
        delete this.searchParams.signingTime;
      }
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
      console.log(val)
      this.$router.push({path:'./partnerCreate'})
    },
  },
  components: {

  },
}
</script>


<style lang="less" scoped>
@import "./less/index.less";
</style>
