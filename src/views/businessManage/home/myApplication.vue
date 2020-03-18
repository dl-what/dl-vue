<!-- 首页 - 我的申请 -->
<template>
  <div class="vlt-card pending-review">
    <search-bar
      class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      :total="total"
      labelWidth="6em"
    >
      <control-bar slot="extend-bar" @select="selectBtn" :options="controlOptions" position="left"></control-bar>
    </search-bar>
    <el-table :data="tableData" style="width: 100%" ref="print" border>
      <el-table-column label="序号" fixed width="55">
        <template slot-scope="scope">{{params.pageSize*(params.page - 1) + (scope.$index+1)}}</template>
      </el-table-column>
      <el-table-column prop="title" label="业务标题" min-width="180px"></el-table-column>
      <el-table-column prop="categoryName" label="业务类型" min-width="120px"></el-table-column>
      <el-table-column prop="processName" label="所属流程" min-width="160px"></el-table-column>
      <el-table-column prop="currTaskName" label="当前审批环节" min-width="120px"></el-table-column>
      <el-table-column label="状态" min-width="100px">
        <template slot-scope="scope">
          <span
            class="tag"
            :class="{
            grey:scope.row.status=='0',
            blue:scope.row.status=='1',
            green:scope.row.status=='2',
            yellow:scope.row.status=='3',
            red:scope.row.status=='4',
            }"
          >{{scope.row.strStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column label="结果" min-width="120px">
        <template slot-scope="scope">
          <span
            class="tag"
            :class="{
            grey:scope.row.result=='0',
            blue:scope.row.result=='1',
            green:scope.row.result=='2',
            yellow:scope.row.status=='3',
            red:scope.row.result=='4',
            }"
          >{{scope.row.strResult}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="160px"></el-table-column>
      <el-table-column prop="applyTime" label="提交申请时间" min-width="160px"></el-table-column>
      <div class="no-print">
        <el-table-column label="操作" fixed="right" min-width="280px" class="noprint">
          <template slot-scope="scope">
            <div class="tl">
              <el-button
                v-has="'myApplication-detail'"
                size="mini"
                v-if="scope.row.status!=0"
                type="warning"
                @click="toApplyDetail(scope.row.procInstId)"
                :id="$route.name + '-' + 'detail'+ scope.$index"
              >审批详情</el-button>
              <el-button
                v-has="'myApplication-formData'"
                type="primary"
                size="mini"
                @click="toDetail(scope.row)"
                :id="$route.name + '-' + 'title'+ scope.$index"
              >表单数据</el-button>
              <el-button
                v-has="'myApplication-revoke'"
                v-if="scope.row.isCanCancel"
                size="mini"
                type="success"
                @click="tapPass(scope.row, 1)"
                :id="$route.name + '-' + 'recall'+ scope.$index"
              >撤回</el-button>
              <el-button
                v-has="'myApplication-edit'"
                size="mini"
                v-if="scope.row.result==0"
                @click="toPage(scope.row)"
                :id="$route.name + '-' + 'edit'+ scope.$index"
              >编辑</el-button>
              <el-button
                v-has="'myApplication-delete'"
                size="mini"
                type="danger"
                v-if="scope.row.status==0&&scope.row.result==0"
                @click="open(scope)"
                :id="$route.name + '-' + 'delete'+ scope.$index"
              >删除</el-button>
            </div>
          </template>
        </el-table-column>
      </div>
    </el-table>
    <table-paging
      position="right"
      :total="total"
      :currentPage="params.page"
      :pageSize="params.pageSize"
      @handleSizeChange="changeSize"
      @handleCurrentChange="changeCurrent"
    ></table-paging>
    <el-dialog
      :title="title"
      :visible.sync="isShowPass"
      width="500px"
      :close-on-click-modal="false"
    >
      <div>
        <el-form :model="passForm" :rules="rules" ref="passForm" label-width="100px">
          <el-form-item label="撤回原因" v-if="type==1">
            <el-input
              v-model="passForm.comment"
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 4}"
              maxlength="150"
              placeholder="请输入撤回原因"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button
            size="medium"
            @click="isShowPass = false"
            :id="$route.name + '-' + 'cancel'"
          >取 消</el-button>
          <el-button
            type="primary"
            size="medium"
            @click="surePass"
            :id="$route.name + '-' + 'enter'"
          >确 定</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="打印预览" :visible.sync="isPrint" class="print-fullscreen" :fullscreen="true">
      <print :data="printData" @cancel="isPrint=false"></print>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "myApplication",
  data() {
    return {
      // 搜索组件配置
      searchOptions: [
        {
          type: "input",
          prop: "title",
          value: "",
          title: "业务标题",
          placeholder: "请输入"
        },
        {
          title: "业务类型",
          type: "cascader",
          prop: "categoryId",
          value: "",
          setProps: {
            children: "children",
            value: "id",
            label: "name",
            checkStrictly: true
          },
          options: []
        },
        {
          type: "datepicker-range",
          prop: "date",
          value: "",
          title: "申请时间",
          placeholder: ["开始日期", "结束日期"]
        }
      ],
      controlOptions: [
        {
          name: "打印",
          type: "primary",
          icon: "printer",
          permission: "myApplication-print"
        },
        {
          name: "导出",
          type: "",
          icon: "s-promotion",
          permission: "myApplication-export"
        }
      ],
      rules: {},
      tableData: [],
      total: 0,
      // currentPage: 1
      params: {
        page: 1,
        pageSize: 20,
        param: {}
      },
      passForm: {
        taskId: "",
        procInstId: "",
        comment: "" // 撤回
      },
      isShowPass: false,
      title: "撤回",
      type: "",
      isPrint: false,
      printData: {
        params: {
          page: 1,
          pageSize: 20
        },
        title: '我的申请列表',
        props: [
          {prop: 'index', label:'序号',width:''},
          {prop: 'title', label:'业务标题',width:''},
          {prop:'categoryName', label:'业务类型',width:''},
          {prop:'processName', label:'所属流程',width:''},
          {prop:'currTaskName', label:'当前审批环节',width:''},
          {prop:'strStatus', label:'状态',width:''},
          {prop:'strResult', label:'结果',width:''},
          {prop:'createTime', label:'创建时间',width:''},
          {prop:'applyTime', label:'提交申请时间',width:''}
        ],
        tableData: []
      }
    };
  },
  created() {
    let date = this.$route.params.date;
    if (date) {
      this.params.param.beginDate = this.$route.params.beginDate||date;
      this.params.param.endDate = this.$route.params.endDate||date;
      this.getMyApplyList(this.params);
    } else {
      this.getMyApplyList(this.params);
    }
    this.getTreeData();
  },
  methods: {
    selectBtn(val) {
      console.log("selectBtn");
      if (val.name == "打印") {
        this.isPrint = true;
        this.printData.params.page = this.params.page;
        this.printData.params.pageSize = this.params.pageSize;
        // this.$print(this.$refs.print); // 使用
      } else {
        // 导出列表
        this.exportApplyExcel();
      }
    },
    // 导出列表
    async exportApplyExcel() {
      const res = await this.$api.exportApplyExcel({
        data: this.params,
        responseType: "blob"
      });
      var blob = new Blob([res.blob], {
        type: "application/vnd.ms-excel;charset=utf-8"
      });
      var url = window.URL.createObjectURL(blob);
      var aLink = document.createElement("a");
      aLink.style.display = "none";
      aLink.href = url;
      aLink.setAttribute("download", "我的申请.xls");
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
      console.log(res);
    },
    // 通过
    tapPass(val, type) {
      this.isShowPass = true;
      this.passForm.taskId = val.id;
      this.passForm.procInstId = val.procInstId;
      this.passForm.reason = "";
      this.type = type;
      let option = {
        1: "撤回"
      };
      this.title = option[type];
    },
    surePass() {
      const self = this;
      let data = Object.assign({}, self.passForm);
      self.$refs.passForm.validate(valid => {
        if (valid) {
          if (self.type == 1) {
            // 撤回（未被审批的流程）
            self.getTaskRevoke(data);
          }
        }
      });
    },
    // 撤回
    getTaskRevoke(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getTaskRevoke({ data });
        if (res && res.code == 0) {
          console.log("res", res.data);
          self.$message.success("撤回成功");
          self.getMyApplyList(self.params);
          self.isShowPass = false;
        }
      })(data);
    },
    // 获取业务类型
    async getTreeData() {
      const res = await this.$api.getProcessTree();
      if (res && res.data) {
        this.searchOptions[1].options = res.data;
      }
    },
    open(val) {
      const self = this;
      self
        .$confirm(`您确认要删除 ${val.row.title} ? 是否继续?`, "确认删除", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          self.deleteMyApply(val);
        })
        .catch(() => {});
    },
    // 删除我的申请
    deleteMyApply(val) {
      const self = this;
      let data = { id: val.row.id };
      (async data => {
        let res = await self.$api.deleteMyApply({ data });
        if (res && res.code == 0) {
          console.log("res", res.data);
          self.$message.success("删除成功");
          self.tableData.splice(val.$index, 1);
          // self.getMyApplyList();
        }
      })(data);
    },
    // 我的申请列表
    getMyApplyList(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getMyApplyList({ data });
        if (res && res.code == 0) {
          self.total = res.data.total;
          res.data.records.forEach(item => {
            item.createTime = this.$moment(item.createTime).format(
              "YYYY-MM-DD HH:mm:ss"
            );
          });
          self.tableData = res.data.records;
          self.printData.tableData = self.tableData;
        }
      })(data);
    },
    search(val) {
      this.params.page = 1;
      this.params.param = val;
      let categoryId = val.categoryId;
      if (categoryId && categoryId.length > 0) {
        this.params.param.categoryId = categoryId[categoryId.length - 1];
      }
      if (val.date && val.date.length > 0) {
        this.params.param.beginDate = this.$moment(val.date[0]).format(
          "YYYY-MM-DD"
        );
        this.params.param.endDate = this.$moment(val.date[1]).format(
          "YYYY-MM-DD"
        );
        delete this.params.param.date;
      }
      this.getMyApplyList(this.params);
    },
    changeSize(val) {
      this.params.page = 1;
      this.params.pageSize = val;
      this.getMyApplyList(this.params);
    },
    changeCurrent(val) {
      this.params.page = val;
      this.getMyApplyList(this.params);
    },
    toApplyDetail(id) {
      const self = this;
      if (self.$route.name === "myApplication") {
        self.$router.push({ name: "myApplyDetail", query: { id } });
      } else {
        self.$router.push({ name: "myApplyDetails", query: { id } });
      }
    },
    // 编辑
    toPage(val) {
      this.$router.push({ name: val.router, query: { type: 0, id: val.id } });
    },
    // 表单数据 不可编辑
    toDetail(val) {
      console.log(val.router)
      this.$router.push({ name: val.router, query: { type: 1, id: val.id } });
    }
  }
};
</script>

<style lang="less">
.pending-review {
  .el-table--border,
  .el-table--group {
    border-color: #e0e0e0;
  }
}
.tag {
  display: inline-block;
  height: 22px;
  line-height: 20px;
  margin: 2px 4px 2px 0;
  padding: 0 8px;
  border: 1px solid #e8eaec;
  border-radius: 3px;
  background: #f7f7f7;
  font-size: 12px;
  vertical-align: middle;
  opacity: 1;
  overflow: hidden;
  color: #515a6e;
  &.green {
    background: #f6ffed;
    border-color: #b7eb8f;
    color: #52c41a;
  }
  &.red {
    background: #fff1f0;
    border-color: #ffa39e;
    color: #f5222d;
  }
  &.yellow {
    background: #f9deb5;
    border-color: #e6b263;
    color: #e6a23c;
  }
  &.blue {
    background: #e6f7ff;
    border-color: #91d5ff;
    color: #1890ff;
  }
}
.dialog-footer {
  padding-top: 20px;
  text-align: right;
}
.tl {
  text-align: left;
}
</style>
