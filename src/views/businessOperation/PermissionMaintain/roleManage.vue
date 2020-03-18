
<template>
  <div class="vlt-card">
    <div class="roleManage">
      <searchBar :options="roleManageoptions" @search="search" :total="num" labelWidth="6em">
        <controlBar
          slot="extend-bar"
          @select="roleManageAddclick"
          :options="roleManageAddbtn"
          position="left"
        ></controlBar>
      </searchBar>

      <el-table :data="roleManagetableData" border style="width: 100%;">
        <el-table-column prop="roleManageId" label="序号" type="index" width="55">
          <template slot-scope="scope">{{pageSize*(page-1)+(scope.$index+1)}}</template>
        </el-table-column>
        <el-table-column prop="roleName" label="用户角色" min-width="140px" show-overflow-tooltip></el-table-column>
        <el-table-column label="角色权限" show-overflow-tooltip min-width="200px">
          <template slot-scope="scope">{{scope.row.roleTypes.join('，')}}</template>
        </el-table-column>
        <el-table-column label="角色状态" min-width="180" prop="accountStatus">
          <template slot-scope="scope">
            <tableRowStatus
              :scope="scope"
              :tableData="roleManagetableData"
              idField="id"
              statusField="status"
              @change="statusChange"
              :rowName="scope.row.name"
              :option="{
                enable:{
                  apiName:'roleAmend',
                  label:'启用',
                  value:1,
                  permission:'roleManage-enable'
                },
               disable:{
                  apiName:'roleAmend',
                  label:'冻结',
                  value:2,
                  permission:'roleManage-disable'
               },
               logout:{
                  apiName:'roleAmend',
                  label:'注销',
                  value:3,
                  permission:'roleManage-logout'
               }
              }"
            ></tableRowStatus>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="描述" min-width="160px" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createName" label="创建人" min-width="100px"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="160"></el-table-column>
        <el-table-column label="操作" min-width="140" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="roleManageLook(scope.row)"
              v-has="'roleManage-detail'"
              :id="$route.name + '-' + 'detail' + scope.$index"
            >查看</el-button>
            <el-button
              type
              size="mini"
              @click="roleManageEdit(scope.row)"
              v-has="'roleManage-edit'"
              :id="$route.name + '-' + 'edit' + scope.$index"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <tablePaging
        :total="num"
        :currentPage="page"
        :pageSize="pageSize"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      ></tablePaging>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "roleManage",
  data() {
    return {
      num: 0,
      page: 0,
      pageSize: 20,
      searchForm: {},
      // 表格数据
      roleManagetableData: [],
      // 搜索表单类型
      roleManageoptions: [
        {
          type: "select",
          prop: "id",
          value: "",
          title: "用户角色",
          placeholder: "请输入",
          options: []
        },
        {
          type: "input",
          prop: "createName",
          value: "",
          title: "创建人",
          placeholder: "请输入"
        },
        {
          type: "select",
          prop: "status",
          value: "",
          title: "角色状态",
          placeholder: "请输入",
          options: [{ label: "启用", value: 1 }, { label: "冻结", value: 2 }]
        },
        {
          type: "datepicker-range",
          prop: "roleManageCreateDate",
          value: "",
          title: "创建时间",
          placeholder: ["开始时间", "结束时间"]
        }
      ],
      // 新增按钮类型
      roleManageAddbtn: [
        {
          name: "新增角色",
          type: "primary",
          icon: "plus",
          permission: "roleManage-add"
        }
      ]
    };
  },

  created() {
    //初始表格数据
    this.init();
  },
  methods: {
    //初始数据
    async init(val) {
      let data = {
        page: val || 1,
        pageSize: this.pageSize,
        param: {
          ...this.searchForm
        }
      };
      let result = await this.$api.getRole({ data });
      let info = result.data.records;
      info.forEach(item => {
        if (item.roleTypes && item.roleTypes) {
          let resul = [];
          for (let i of item.roleTypes) {
            if (!resul.includes(i)) {
              resul.push(i);
            }
          }
          item.roleTypes = [...resul];
        }
      });
      if (result.code === 0 && result) {
        let arr = result.data.records;
        this.num = result.data.total;
        this.page = result.data.current;
        this.roleManagetableData = arr;
      }
      //初始搜索用户角色数据
      let searchResult = await this.$api.accountRole();
      if (searchResult.code === 0 && searchResult) {
        this.roleManageoptions[0].options = searchResult.data;
      }
    },
    //搜索
    search(param) {
      if (param.roleManageCreateDate && param.roleManageCreateDate.length) {
        param.startTime = this.$moment(param.roleManageCreateDate[0]).format(
          "YYYY-MM-DD"
        );
        param.endTime = this.$moment(param.roleManageCreateDate[1]).format(
          "YYYY-MM-DD"
        );
        delete param.roleManageCreateDate;
      }

      this.searchForm = {
        ...param
      };
      this.init();
    },
    //状态change
    statusChange() {
      this.init();
    },
    // 新增
    roleManageAddclick() {
      this.$router.push("roleManageAdd");
    },
    // 查看
    roleManageLook(row) {
      this.$router.push({ path: "roleManageExamine", query: { id: row.id } });
    },
    // 编辑
    roleManageEdit(row) {
      this.$router.push({ name: "roleManageEdit", query: { id: row.id } });
    },

    handleSizeChange(size) {
      this.pageSize = size;
      this.init();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.init(val);
    }
  }
};
</script>

<style lang="less" scoped>
</style>

     
   
