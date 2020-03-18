<template>
  <div class="vlt-card customer-tags">
    <search-bar @search="search" :options="searchOptions" :total="accountList.total" labelWidth="6em">
      <control-bar slot="extend-bar" position="left" @select="selectBtn" :options="controlOptions"></control-bar>
    </search-bar>
    <el-table
      :data="accountList.records"
      @selection-change="handleSelectionChange"
      border
      style="width: 100%;"
      ref="table"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="序号" width="80" fixed>
        <template slot-scope="scope">{{accountList.size*(accountList.current-1)+(scope.$index+1)}}</template>
      </el-table-column>
      <!-- <el-table-column type="index" label="序号"  width="80"></el-table-column> -->
      <el-table-column prop="id" label="标签编号" min-width="120px"></el-table-column>
      <el-table-column prop="name" label="标签名称" min-width="180px" show-overflow-tooltip></el-table-column>
      <el-table-column prop="type" label="标签类型" min-width="140px"></el-table-column>
      <el-table-column prop="userName" label="创建人" min-width="120px"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="160px"></el-table-column>
      <!-- <el-tab-column prop="remark" label="内容描述"></el-tab-column> -->
      <el-table-column label="操作" align="center" fixed="right" min-width="200px">
        <template slot-scope="scope">
          <el-button
            type="primary"
            v-has="'customerTags-detail'"
            size="mini"
            @click="custDetail(scope.row)"
            :id="$route.name + '-' + 'detail' + scope.$index"
          >查看</el-button>
          <el-button
            type=""
            v-has="'customerTags-edit'"
            size="mini"
            @click="custEdit(scope.row)"
            :id="$route.name + '-' + 'edit' + scope.$index"
          >编辑</el-button>
          <el-button
            type="danger"
            v-has="'customerTags-delete'"
            size="mini"
            @click="suctDelete(scope.row)"
            :id="$route.name + '-' + 'delete' + scope.$index"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <table-paging
      :current-page="requestData.page"
      :page-size="requestData.pageSize"
      :total="accountList.total"
      @handleSizeChange="pageSizeChange"
      @handleCurrentChange="pageCurrentChange"
    ></table-paging>
    <edit-customer-tag :oData="editData" :isShow="showDia" @closeDia="closeDia"></edit-customer-tag>
  </div>
</template>

<script type="text/javascript">
import editCustomerTag from "@/views/businessOperation/customerAccount/editCustomerTag";
import moment from "moment";
export default {
  name: "customerTags",
  data() {
    return {
      showDia: false,
      searchOptions: [
        { title: "标签编号", type: "input", prop: "id", value: "" },
        { title: "标签名称", type: "input", prop: "name", value: "" },
        {
          title: "标签类型",
          type: "select",
          prop: "type",
          value: "",
          options: [
            {
              label: "标签",
              value: 0
            },
            {
              label: "偏好",
              value: 1
            }
          ]
        },
        {
          title: "创建时间",
          type: "datetime-range",
          prop: "createTime",
          value: ""
        }
      ],
      controlOptions: [
        {
          name: "新建标签",
          type: "primary",
          icon: "plus",
          permission: "customerTags-add"
        }, // type为按钮的五种颜色， icon为具体的图标
        {
          name: "批量删除",
          type: "",
          icon: "delete",
          disabled: true,
          permission: "customerTags-deleteAll"
        }
      ],
      accountList: [],
      multipleSelection: [],
      editData: {},
      requestData: { page: 1, pageSize: 20, param: {} },
      tagType: ["标签", "偏好"]
    };
  },
  components: {
    "edit-customer-tag": editCustomerTag
  },
  created() {
    this.getList(this.requestData);
  },
  updated() {
    this.$refs.table.doLayout()
  },
  methods: {
    getList(data) {
      const _this = this;
      (async data => {
        let res = await _this.$api.cusPageList({ data });
        console.log(res);
        if (res.code == 0) {
          if (res.data != null) {
            _this.accountList = res.data;
            _this.accountList.records &&
              _this.accountList.records.forEach(item => {
                item.createTime = _this
                  .$moment(item.createTime)
                  .format("YYYY-MM-DD HH:mm:SS");
                item.type = _this.tagType[item.type];
              });

            _this.accountList.records.length
              ? (_this.controlOptions[1].disabled = false)
              : (_this.controlOptions[1].disabled = true);
          }
        }
      })(data);
    },
    accountDetail(account) {
      this.$router.push({ name: "accountDetail", params: { id: account } });
    },
    search(params) {
      console.info("search", params);
      if (params.createTime && params.createTime.length == 2) {
        params.startTime = moment(params.createTime[0]).format(
          "YYYY-MM-DD HH:mm:SS"
        );
        params.endTime = moment(params.createTime[1]).format(
          "YYYY-MM-DD HH:mm:SS"
        );
        delete params.createTime;
      }
      this.requestData.param = {
        ...params
      };
      this.requestData.page = 1;
      this.getList(this.requestData);
    },
    selectBtn(btn) {
      if (btn.name == "新建标签") {
        this.$router.push({
          name: "createCustomerTag"
        });
      } else if (btn.name == "批量删除") {
        if (!this.multipleSelection.length) {
          this.$message({
            type: "warning",
            message: "请选择需要删除的客户标签!"
          });
        } else {
          this.batchDeletion(this.multipleSelection);
        }
      }
    },
    custDetail(row) {
      this.$router.push({
        name: "customerTagDetail",
        query: {
          id: row.id
        }
      });
    },
    custEdit(row) {
      console.log("edit", row);
      // tagType
      this.editData = {
        ...row
      };
      if (row.type) {
        for (let i = 0; i < this.tagType.length; i++) {
          if (row.type == this.tagType[i]) {
            this.editData.type = "" + i;
          }
        }
      }
      this.showDia = true;
    },
    suctDelete(row) {
      // console.log("delete", row);
      this.tagDelete(row.id);
    },
    // 删除标签
    tagDelete(id) {
      const _this = this;
      _this
        .$confirm("将删除此数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          (async id => {
            let res = await _this.$api.cusPageDelete({
              message: "删除成功！",
              data: id
            });
            console.log(res);
            if (res.code == 0) {
              _this.getList(_this.requestData);
            }
          })(id);
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 批量删除标签
    batchDeletion(data) {
      const _this = this;
      console.log("delete", data);
      let ids = [];
      data &&
        data.forEach(item => {
          ids.push(item.id);
        });
      console.log(ids);
      _this
        .$confirm("将删除此数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          (async ids => {
            let data = {};
            data.ids = ids;
            console.log(data);
            let res = await _this.$api.cusPageDeleteIds({
              message: "删除成功！",
              data
            });
            console.log(res);
            if (res.code == 0) {
              _this.getList(_this.requestData);
            }
          })(ids);
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    pageSizeChange(size) {
      this.requestData.pageSize = size;
      this.requestData.page = 1;
      this.getList(this.requestData);
    },
    pageCurrentChange(page) {
      this.requestData.page = page;
      this.getList(this.requestData);
    },
    closeDia(boo) {
      // console.log(boo);
      if (boo == "true") {
        this.getList(this.requestData);
      }
      this.showDia = false;
    }
  }
};
</script>

<style lang="less">
.customer-tags {
  .el-table .cell {
    padding: 2px 0;
  }
}
</style>

