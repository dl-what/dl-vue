<template>
  <div class="vlt-card">
    <div class="role-search">
      <search-bar
        class="search-bar-demo"
        @search="search"
        :options="option"
        :total="total"
        labelWidth="6em"
      >
        <control-bar slot="extend-bar" @select="selectBtn" :options="controlOptions"></control-bar>
      </search-bar>
    </div>
    <div class="role-table">
      <el-table :data="tableData" border style="width: 100%; margin-top: 10px;">
        <el-table-column type="index" prop="date" fixed label="序号" width="60">
          <template slot-scope="scope">{{pageSize*(page-1)+(scope.$index+1)}}</template>
        </el-table-column>
        <el-table-column prop="roleCode" label="角色编码" min-width="120px"></el-table-column>
        <el-table-column prop="roleName" label="用户角色" min-width="140px"></el-table-column>

        <el-table-column prop="roleDesc" label="角色描述" min-width="160px" show-overflow-tooltip></el-table-column>
        <el-table-column label="角色状态" prop="status" min-width="140">
          <template slot-scope="scope">
            <el-switch
              :active-value="1"
              :inactive-value="0"
              v-has="'role-Switch'"
              v-model="scope.row.status"
              @change="switchChange(scope.row)"
              :active-text="scope.row.status?'启用':'冻结'"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="createByName" label="创建人" min-width="120px"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="160">
          <template
            slot-scope="scope"
          >{{tableData[scope.$index].createTime ? timeCycle(tableData[scope.$index].createTime):''}}</template>
        </el-table-column>

        <el-table-column prop="updateByName" label="更新人" min-width="120px"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间" min-width="160">
          <template
            slot-scope="scope"
          >{{tableData[scope.$index].updateTime ? timeCycle(tableData[scope.$index].updateTime):''}}</template>
        </el-table-column>

        <el-table-column prop="zip" label="操作" fixed="right" min-width="150">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="handelifo(scope.row)"
              v-has="'role-detail'"
              :id="$route.name+'-details-'+scope.$index"
            >查看</el-button>
            <el-button
              type
              size="mini"
              @click="handelskip(scope.row)"
              v-has="'role-edit'"
              :id="$route.name+'-edit-'+scope.$index"
              :disabled="tableData[scope.$index].status?true:false"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagintion">
        <table-paging
          :current-page="page"
          :page-size="pageSize"
          :total="total"
          @handleSizeChange="pageSizeChange"
          @handleCurrentChange="pageCurrentChange"
        ></table-paging>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "roleList",
  data() {
    return {
      controlOptions: [
        {
          name: "新建角色",
          type: "primary",
          icon: "plus",
          permission: "role-create"
        }
      ],
      option: [
        {
          title: "用户角色",
          prop: "roleName",
          type: "input",
          value: "",
          placeholder: "请输入" || ["请输入1", "请输入2"]
        },
        {
          title: "创建人",
          prop: "createName",
          type: "select",
          value: "",
          options: [],
          placeholder: "请输入" || ["请输入1", "请输入2"]
        },
        {
          title: "角色状态",
          value: "",
          prop: "status",
          type: "select",
          options: [{ value: 0, label: "冻结" }, { value: 1, label: "启用" }],
          placeholder: "请输入" || ["请输入1", "请输入2"]
        },
        {
          type: "datepicker-range",
          prop: "createTime",
          value: "",
          title: "创建时间",
          placeholder: ["开始时间", "结束时间"]
        }
      ],
      currentPage4: 0,
      tableData: [],
      total: 0,
      val: {},
      page: 1,
      pageSize: 20,
      searchStatus: "",
      searchFrom: {},
      falg: -1
    };
  },
  computed: {},
  created() {
    this.init();
    this.queryRoleUser();
  },
  methods: {
    async init(val) {
      this.pagingControl(val);
    },
    //查创建人
    async queryRoleUser() {
      let res = await this.$api.queryRoleUser();
      if (res && res.code === 0) {
        this.option[1].options = res.data.map(item => {
          return { value: item.createByName };
        });
      }
    },
    async pagingControl(val) {
      const self = this;
      let data = {
        param: { ...this.searchFrom },
        page: val || 1,
        pageSize: this.pageSize
      };
      let reslt = await this.$api.QueryRoleInfoPage({ data });
      if (reslt && reslt.code === 0) {
        let arr = reslt.data.records;
        self.total = reslt.data.total;
        self.page = reslt.data.current;
        let Arr = JSON.parse(JSON.stringify(arr));
        self.tableData = Arr;
      }
    },
    handelifo(val) {
      this.$router.push({
        name: "roleDetail",
        query: { id: val.roleId, status: 1 }
      });
    },
    async switchChange(val) {
      const self = this;
      let ifo;
      if (val.status) {
        ifo = "此操作会解除冻结状态，请确认是否解除此角色冻结状态？";
      } else {
        ifo = "此操作会冻结此角色，请确认是否要冻结此角色？";
      }
      this.$confirm(ifo, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let data = {
            status: Number(val.status),
            roleId: val.roleId
          };
          let reslt = await this.$api.UpdateRoleStatusInfo({ data });
          if (reslt && reslt.code === 0) {
            val.status = data.status;
            this.$message({
              type: "success",
              message: val.status ? "角色启用成功!" : "角色冻结成功"
            });
          } else {
            val.status = Number(!val.status);
            this.$message({
              type: "success",
              message: "状态更改失败!"
            });
          }
        })
        .catch(() => {
          val.status = Number(!val.status);
          this.$message({
            type: "info",
            message: "取消更改状态"
          });
        });
    },
    async pageSizeChange(val) {
      this.pageSize = val;
      this.pagingControl();
    },
    pageCurrentChange(val) {
      this.currentPage4 = val;
      this.pagingControl(val);
    },
    timeCycle(val) {
      return moment(val).format("YYYY-MM-DD HH:mm:ss");
    },
    async handelskip(val) {
      this.$router.push({
        name: "roleOfEditorialEdit",
        query: { id: val.roleId, status: 2 }
      });
    },
    selectBtn(val) {
      if (val.name === "新建角色") {
        this.$router.push({ name: "roleOfEditorial" });
      }
    },
    search(val) {
      const self = this;
      let list = {};
      if (val.createTime && val.createTime.length > 0) {
        let startTime = moment(Date.parse(val.createTime[0])).format(
          "YYYY-MM-DD "
        );
        let endTime = moment(Date.parse(val.createTime[1])).format(
          "YYYY-MM-DD "
        );
        list = {
          ...val,
          startTime,
          endTime
        };
      } else {
        list = {
          ...val
        };
      }
      delete list.createTime;
      self.searchFrom = {
        ...list
      };
      self.searchStatus = "搜索";
      self.pagingControl();
    }
  }
};
</script>


<style lang="less">
@import "./less/index.less";


</style>

<style lang="less" scoped>
  .roleDialog {
    border-radius: 10px;
    /deep/.el-dialog__header {
      padding: 0;
    }
  }
</style>
