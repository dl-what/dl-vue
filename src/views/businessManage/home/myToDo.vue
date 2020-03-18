<!-- 首页 - 我的待办 -->

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
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column label="序号" fixed width="55">
        <template slot-scope="scope">{{params.pageSize*(params.page - 1) + (scope.$index+1)}}</template>
      </el-table-column>
      <el-table-column prop="title" label="业务标题" min-width="180px"></el-table-column>
      <el-table-column prop="name" label="审批节点" min-width="160px"></el-table-column>
      <el-table-column prop="category" label="业务类型" min-width="120px"></el-table-column>
      <el-table-column prop="applyer" label="流程发起人" min-width="110px"></el-table-column>
      <!-- <el-table-column label="状态" min-width="100px">
        <template slot-scope="scope">
          <span class="icon-circle" :class="[scope.row.isSuspended ?'red':'green']">{{scope.row.isSuspended ? '未激活' : '已激活'}}</span>
        </template>
      </el-table-column>-->
      <el-table-column prop="createTime" label="创建时间" min-width="160px"></el-table-column>
      <el-table-column fixed="right" label="操作" min-width="350px">
        <template slot-scope="scope">
          <div style="text-align:center;">
            <el-button
              v-has="'myToDo-approval'"
              type="warning"
              size="mini"
              @click="toApplyDetail(scope.row.procInstId)"
              :id="$route.name + '-' + 'detail'+ scope.$index"
            >审批详情</el-button>
            <el-button
              v-has="'myToDo-data'"
              type="primary"
              size="mini"
              @click="toDetail(scope.row)"
              :id="$route.name + '-' + 'title'+ scope.$index"
            >表单数据</el-button>

            <el-button
              v-has="'myToDo-pass'"
              type="success"
              size="mini"
              :disabled="scope.row.isApplyNode"
              @click="tapPass(scope.row, 1)"
              :id="$route.name + '-' + 'pass'+ scope.$index"
            >通过</el-button>
            <el-button
              v-has="'myToDo-transfer'"
              size="mini"
              :disabled="scope.row.isApplyNode"
              @click="tapPass(scope.row, 4)"
              :id="$route.name + '-' + 'turnto'+ scope.$index"
            >转办</el-button>
            <!-- <el-button type="info" plain size="mini" @click="tapPass(scope.row, 3)">委派</el-button> -->
            <el-button
              v-has="'myToDo-reject'"
              type="danger"
              size="mini"
              :disabled="scope.row.isApplyNode"
              @click="tapPass(scope.row, 2)"
              :id="$route.name + '-' + 'reject'+ scope.$index"
            >驳回</el-button>
            <!-- <el-button
              v-has="'myToDo-edit'"
              :disabled="scope.row.result===0&&scope.row.result!=3&&(scope.row.result!=4&&!scope.row.isApplyNode)"
              type
              size="mini"
              @click="tapEdit(scope.row)"
              :id="$route.name + '-' + 'edit'+ scope.$index"
            >编辑</el-button> -->
          </div>
        </template>
      </el-table-column>
    </el-table>
    <table-paging
      position="right"
      :total="total"
      :currentPage="params.page"
      :pageSize="params.pageSize"
      @handleSizeChange="changeSize"
      @handleCurrentChange="changeCurrent"
    ></table-paging>
    <el-dialog :title="title" :visible.sync="isShowPass" @close="closeDialog" width="500px">
      <div>
        <el-form :model="passForm" :rules="rules" ref="passForm" label-width="100px">
          <el-form-item v-if="type==2" label="驳回至" prop="targetNodeId">
            <el-select v-model="passForm.targetNodeId" placeholder="请选择" class="pass-select">
              <el-option
                v-for="(item,index) in backData"
                :key="index"
                :label="item.name"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="type==3||type==4" label="转他人办理" prop="userId">
            <el-select
              v-model="passForm.userId"
              placeholder="请选择"
              @focus="isCheckUser=true"
              class="pass-select"
            >
              <el-option
                v-for="(item,index) in userData"
                :key="index"
                :label="item.userName"
                :value="item.userId"
              ></el-option>
            </el-select>
            <div @click.stop="isCheckUser=true" class="mark"></div>
          </el-form-item>
          <el-form-item label="审批意见" v-if="type!=5">
            <el-input
              v-model="passForm.comment"
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 4}"
              maxlength="150"
              placeholder="请输入审批意见"
            ></el-input>
          </el-form-item>
          <el-form-item label="撤回原因" v-if="type==5">
            <el-input
              v-model="passForm.comment"
              type="textarea"
              maxlength="150"
              :autosize="{ minRows: 4, maxRows: 4}"
              placeholder="请输入撤回原因"
            ></el-input>
          </el-form-item>
          <el-form-item label="知会人" v-if="type!=5" prop="userIds">
            <el-select
              v-model="passForm.userIds"
              multiple
              placeholder="请选择"
              @focus="isCheckUsers=true"
              class="pass-select"
            >
              <el-option
                v-for="(item,index) in userDatas"
                :key="index"
                :label="item.userName"
                :value="item.userId"
              ></el-option>
            </el-select>
            <div @click.stop="isCheckUsers=true" class="mark"></div>
          </el-form-item>
          <el-form-item label="消息通知">
            <el-checkbox-group v-model="checkedList">
              <el-checkbox
                v-for="(item,index) in checkboxData"
                :label="item.value"
                :key="index"
              >{{item.label}}</el-checkbox>
            </el-checkbox-group>
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
      <el-dialog
        width="600px"
        title="选择转办人"
        custom-class="message-list"
        :visible.sync="isCheckUser"
        :close-on-click-modal="false"
        append-to-body
      >
        <div class="mess-dislog">
        <choose-user @change="changeUserData" v-if="isCheckUser" @close="isCheckUser=false"></choose-user>
        </div>
      </el-dialog>
      <el-dialog
        custom-class="message-list"
        width="600px"
        title="选择知会人"
        :visible.sync="isCheckUsers"
        append-to-body
      >
        <div class="mess-dislog">
          <choose-users @change="changeUsersData" v-if="isCheckUsers" @close="isCheckUsers=false"></choose-users>
        </div>
      </el-dialog>
    </el-dialog>
    <el-dialog title="打印预览" :visible.sync="isPrint" class="print-fullscreen" :fullscreen="true">
      <print :data="printData" @cancel="isPrint=false"></print>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import ChooseUser from "./components/user";
import ChooseUsers from "./components/users";

export default {
  name: "myToDo",
  components: {
    ChooseUser,
    ChooseUsers
  },
  data() {
    return {
      checkedList: [1],
      checkboxData: [{ label: "站内消息通知", value: 1 }],
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
          title: "审批节点",
          type: "input",
          prop: "name",
          value: ""
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
          title: "创建时间",
          placeholder: ["开始时间", "结束时间"]
        }
      ],
      controlOptions: [
        {
          name: "打印",
          type: "primary",
          icon: "printer",
          permission: "myToDo-print"
        },
        {
          name: "导出",
          type: "",
          icon: "s-promotion",
          permission: "myToDo-export"
        }
      ],
      rules: {
        comment: [
          {
            required: false,
            message: "审批意见不能为空",
            trigger: ["change", "blur"]
          }
        ],
        insId: [
          {
            required: true,
            message: "所属机构不能为空",
            trigger: ["change", "blur"]
          }
        ],
        deparmentId: [
          {
            required: true,
            message: "所属部门不能为空",
            trigger: ["change", "blur"]
          }
        ],
        userId: [
          {
            required: true,
            message: "委托人不能为空",
            trigger: ["change", "blur"]
          }
        ],
        targetNodeId: [
          {
            required: true,
            message: "驳回人不能为空",
            trigger: ["change", "blur"]
          }
        ]
      },
      tableData: [],
      backData: [],
      total: 0,
      params: {
        // 搜索的参数
        page: 1,
        pageSize: 20,
        param: {}
      },
      passForm: {
        // 审批通过的参数
        taskId: "",
        procInstId: "",
        comment: "", // 意见
        targetNodeId: "", // 驳回至 发起人
        userId: "", // 转办的用户id
        userIds: [] // 知会的用户id
      },
      isShowPass: false,
      isCheckUser: false, // 转办的用户 弹框
      isCheckUsers: false, // 知会的用户 弹框
      type: "", // 切换弹框的类型
      title: "审批通过",
      setProps: {
        label: "text",
        value: "id",
        children: "children",
        multiple: false, // 多选
        checkStrictly: true //设置父子节点取消选中关联，从而达到选择任意一级选项的目的
      },
      deparmentData: [],
      userDatas: [], // 知会的用户数据
      userData: [], // 转办的用户数据
      isPrint: false,
      printData: {
        title: '我的待办列表',
        props: [
          { prop: "index", label: "序号", width: "10%" },
          { prop: "title", label: "业务标题", width: "20%" },
          { prop: "name", label: "审批节点", width: "15%" },
          { prop: "category", label: "业务类型", width: "15%" },
          { prop: "applyer", label: "流程发起人", width: "15%" },
          { prop: "createTime", label: "创建时间", width: "20%" }
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
      this.getTaskTodo(this.params);
    } else {
      this.getTaskTodo(this.params);
    }
    this.getTreeData();
    // this.getBackList()
  },
  watch: {
    userDatas: {
      // 监听知会人
      handler(value) {
        this.passForm.userIds = [];
        value.forEach(item => {
          this.passForm.userIds.push(item.userId);
        });
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters(["insData"])
  },
  methods: {
    selectBtn(val) {
      console.log("selectBtn");
      if (val.name == "打印") {
        this.isPrint = true;
        // this.$router.push({name: "gameCreate",});
      } else {
        // 导出列表
        this.exportTodoExcel();
      }
    },
    // 导出列表
    async exportTodoExcel() {
      const res = await this.$api.exportTodoExcel({
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
      aLink.setAttribute("download", "我的待办.xls");
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
      console.log(res);
    },
    tapEdit(val) {
      this.$router.push({
        name: val.router,
        query: { type: 0, id: val.businessId }
      });
    },
    changeUserData(val) {
      // 选择转办人
      this.userData = val;
      this.passForm.userId = val[0].userId;
    },
    changeUsersData(val) {
      // 选择知会人
      this.userDatas = val;
    },
    // 选择部门
    changeDeparment(val) {
      console.log(val.children);
      this.passForm.userId = "";
      this.userData = val.children;
    },
    // 选择机构
    changeSelect(val) {
      this.passForm.deparmentId = "";
      this.passForm.userId = "";
      let data = val[val.length - 1];
      this.getAssigneeUserList(data);
    },
    // 通过部门获取用户
    getAssigneeUserList(data) {
      const self = this;
      (async data => {
        let res = await this.$api.getAssigneeUserList({ data });
        if (res && res.code == 0) {
          console.log(res);
          self.deparmentData = res.data;
        }
      })(data);
    },
    // 表单数据
    toDetail(val) {
      this.$router.push({
        name: val.router,
        query: { type: 1, id: val.businessId }
      });
    },
    // 详情
    toApplyDetail(id) {
      const self = this;
      if (self.$route.name === "myToDo") {
        self.$router.push({ name: "myToDoDetail", query: { id } });
      } else {
        self.$router.push({ name: "myToDoDetails", query: { id } });
      }
    },
    //关闭弹框重置表单
    closeDialog() {
      this.$refs.passForm.resetFields();
    },
    // 通过
    tapPass(val, type) {
      this.isShowPass = true;
      this.passForm.taskId = val.id;
      this.passForm.procInstId = val.procInstId;
      this.passForm.comment = "";
      this.passForm.targetNodeId = ""; // 驳回人 id
      this.passForm.userId = ""; // 转办人id
      this.passForm.userIds = []; // 知会人id
      this.checkedList = [1];
      this.type = type;
      let option = {
        1: "审批通过",
        2: "审批驳回",
        3: "委派他人代办",
        4: "转他人处理",
        5: "撤回"
      };
      this.title = option[type];
      if (type == 2) {
        let data = {
          procInstId: val.procInstId
        };
        this.backData = [];
        this.getBackList(data);
      }
    },
    surePass() {
      const self = this;
      let data = Object.assign({}, self.passForm);
      data.isStationMsgNotify = this.checkedList.length > 0 ? true : false;
      self.$refs.passForm.validate(valid => {
        if (valid) {
          if (self.type == 1) {
            // 通过
            delete data.targetNodeId;
            delete data.userId;
            self.getTaskPass(data);
          } else if (self.type == 2) {
            // 驳回
            delete data.userId;
            self.getTaskBack(data);
          } else if (self.type == 3) {
            // 委派
            delete data.userIds;
            self.getTaskDelegate(data);
          } else if (self.type == 4) {
            // 转办
            delete data.targetNodeId;
            self.getTurnTodo(data);
          } else if (self.type == 5) {
            // 撤回（未被审批的流程）
            (data.reason = data.comment), // 撤回原因
              delete data.targetNodeId;
            delete data.userId;
            delete data.userIds;
            delete data.comment;
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
          self.backData = res.data;
          // self.backData.unshift({name:'发起人',key:''})
        } else {
        }
      })(data);
    },
    // 驳回发起人下拉框
    getBackList(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getBackList({ data });
        if (res && res.code == 0) {
          console.log("res", res.data);
          self.backData = res.data;
          // self.backData.unshift({name:'发起人',key:''})
        } else {
        }
      })(data);
    },
    // 转办
    getTurnTodo(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getTurnTodo({ data });
        if (res && res.code == 0) {
          console.log("res", res.data);
          self.$message.success("提交成功");
          self.isShowPass = false;
          self.getTaskTodo(self.params);
        }
      })(data);
    },
    // 委派他人
    getTaskDelegate(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getTaskDelegate({ data });
        if (res && res.code == 0) {
          console.log("res", res.data);
          self.$message.success("提交成功");
          self.isShowPass = false;
          self.getTaskTodo(self.params);
        }
      })(data);
    },
    // 驳回
    getTaskBack(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getTaskBack({ data });
        if (res && res.code == 0) {
          console.log("res", res.data);
          self.$message.success("提交成功");
          self.isShowPass = false;
          self.getTaskTodo(self.params);
        }
      })(data);
    },
    // 通过
    getTaskPass(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getTaskPass({ data });
        if (res && res.code == 0) {
          console.log("res", res.data);
          self.$message.success("提交成功");
          self.isShowPass = false;
          self.getTaskTodo(self.params);
        }
      })(data);
    },
    // 获取业务类型
    async getTreeData() {
      const res = await this.$api.getProcessTree();
      if (res && res.data) {
        this.searchOptions[2].options = res.data;
      }
    },
    // 我的待办
    getTaskTodo(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getTaskTodo({ data });
        if (res && res.code == 0) {
          console.log("res", res.data);
          self.tableData = res.data.records;
          self.printData.tableData = res.data.records;
          // self.tableData = [{}]
          self.total = res.data.total;
        }
      })(data);
    },
    search(val) {
      console.log("search", val);
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
      this.getTaskTodo(this.params);
    },
    edit(row) {
      const self = this;
      console.log(row);
      this.$router.push({
        name: "pendingReviewEdit",
        query: { id: row.id }
      });
    },
    moveRow(row) {
      const self = this;
      this.$router.push({
        name: "pendingReviewTransfer"
      });
    },
    changeSize(val) {
      this.params.page = 1;
      this.params.pageSize = val;
      this.getTaskTodo(this.params);
      console.log(`每页 ${val} 条`);
    },
    changeCurrent(val) {
      this.params.page = val;
      this.getTaskTodo(this.params);
      console.log(`当前页: ${val}`);
    }
  }
};
</script>

<style lang="less">
@import "./less/index.less";

.pending-review {
  .el-table--border,
  .el-table--group {
    border-color: #e0e0e0;
  }
  .table-box {
    margin-top: 20px;
  }
}
.dialog-footer {
  padding-top: 20px;
  text-align: right;
}
.pass-select {
  width: 100%;
}
.mark {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: 100%;
  height: 100%;
  z-index: 1;
  cursor: pointer;
}
</style>
