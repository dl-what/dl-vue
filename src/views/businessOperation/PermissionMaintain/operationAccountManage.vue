<template>
  <div class="vlt-card">
    <div class="operationManage">
      <searchBar :options="operationManageoptions" @search="search" :total="num" labelWidth="6em"></searchBar>
      <el-table :data="operationManageTableData" border style="width: 100%;">
        <el-table-column prop="operationManageNum" label="序号" type="index" width="60">
          <template slot-scope="scope">{{pageSize*(page-1)+(scope.$index+1)}}</template>
        </el-table-column>
        <el-table-column prop="channelNo" label="渠道编号" min-width="120"></el-table-column>
        <el-table-column prop="accountCode" label="账户编号" min-width="120"></el-table-column>
        <el-table-column label="账户状态" prop="accountStatus">
          <template slot-scope="scope">
            <span
              class="icon-circle"
              :class="{
              blue:scope.row.accountStatus=='2',
              green:scope.row.accountStatus=='1',
              grey:scope.row.accountStatus=='4',
              yellow:scope.row.accountStatus=='5',
              red:scope.row.accountStatus=='3',
              }"
            >{{scope.row.strAccountStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="accountName" label="姓名" min-width="120"></el-table-column>
        <el-table-column prop="phone" label="手机号" min-width="120"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" min-width="120"></el-table-column>
        <el-table-column prop="channelIdentity" label="身份证号" min-width="160"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="160"></el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="operationManageLook(scope.row)"
              v-has="'operationAccountManage-detail'"
              :id="$route.name + '-' + 'detail' + scope.$index"
            >查看</el-button>
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
import rules from "@/utils/rules.js";
export default {
  name: "",
  data() {
    return {
      num: 0,
      dialogVisible: false,
      // 表格数据
      operationManageTableData: [],
      //搜索框类型
      operationManageoptions: [
        {
          type: "select",
          prop: "channelNo",
          value: "",
          title: "渠道编号",
          placeholder: "请输入",
          maxlength: "20",
          setProps: {
            label: 'channelNo',
            key: 'channelNo'
          },
          options: []
        },
        {
          type: "select",
          prop: "accountCode",
          value: "",
          title: "账户编号",
          placeholder: "请输入",
          setProps: {
            label: 'accountCode',
            key: 'accountCode'
          },
          options: []
        },
        {
          type: "select",
          prop: "accountName",
          value: "",
          title: "姓名",
          placeholder: "请输入",
          setProps: {
            label: 'accountName',
            key: 'accountName'
          },
          options: []
        },
        {
          type: "select",
          prop: "accountStatus",
          value: "",
          title: "账户状态",
          placeholder: "请输入",
          options: [
            { label: "启用中", value: 1 },
            { label: "已冻结", value: 2 },
            { label: "已注销", value: 3 }
          ]
        },
        {
          type: "select",
          prop: "roleId",
          value: "",
          title: "角色名称",
          placeholder: "请输入",
          options: []
        },

        {
          type: "datepicker-range",
          prop: "createTime",
          value: "",
          title: "创建时间",
          options: ["start", "end"]
        }
      ],

      page: 0,
      pageSize: 20,
      searchFrom: {},
      row: "",
      current: 0,
      form: {}
    };
  },
  created() {
    this.init();
    

  },
  // watch: {
  //   "form.channelNo"(val) {
  //     if (val.length == 20) {
  //       this.dialogVisible = true;

  //       //this.$message.warning("长度不能超过20条");
  //     }
  //   }
  // },
  methods: {
    // 查询渠道编号列表
    async queryChannelNo () {
      const res = await this.$api.queryChannelNo();
      if (res && res.code === 0) {
        this.operationManageoptions[0].options = res.data || [];
      }
    },
    // 查询账户编号列表
    async queryAccountNo() {
      const res = await this.$api.queryAccountNo();
      if (res && res.code === 0) {
        this.operationManageoptions[1].options = res.data || [];
      }
    },
    // 查询账户姓名列表
    async queryAccountName() {
      const res = await this.$api.queryAccountName();
      if (res && res.code === 0) {
        this.operationManageoptions[2].options = res.data || [];
      }
    },

    async init(val) {
      this.queryChannelNo();
      this.queryAccountNo();
      this.queryAccountName();
      //初始查询列表的参数
      let data = {
        page: val || 1,
        pageSize: this.pageSize,
        param: {
          ...this.searchFrom
        }
      };
      let result = await this.$api.getAccount({ data: data });
      console.log(result);
      if (result.code === 0 && result) {
        let arr = result.data.records;
        arr.forEach(ele => {
          if (ele.accountStatus === 1) {
            ele.strAccountStatus = "启用中";
          } else if (ele.accountStatus === 2) {
            ele.strAccountStatus = "已冻结";
          } else {
            ele.strAccountStatus = "已注销";
          }
        });

        this.operationManageTableData = result.data.records;
        this.num = result.data.total;
        this.page = result.data.current;
        // this.pageSize = result.data.size;
      }
      //   // console.log(result);
      // }
      // 获取用户角色列表
      let resul = await this.$api.accountRole();
      //console.log(resul);
      if (resul.code === 0 && resul) {
        this.operationManageoptions[4].options = resul.data;
      }
    },

    formChange(form) {
      this.form = form;
    },
    //
    handleCurrentChange(val) {
      this.current = val;
      console.log(this.current);
      this.init(val);
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.init();
    },

    //点击搜索
    search(param) {
      if (param.createTime && param.createTime.length > 0) {
        param.startTime = this.$moment(param.createTime[0]).format(
          "YYYY-MM-DD"
        );
        param.endTime = this.$moment(param.createTime[1]).format("YYYY-MM-DD");
        delete param.createTime;
      }
      this.searchFrom = { ...param };

      this.init();
    },

    //点击查看
    operationManageLook(row) {
      this.$router.push({
        name: "operationAccountExamine",
        query: { id: row.id }
      });
    }
  }
};
</script>

<style lang="less" scoped>
</style>
