<!-- 首页 - 我的已办 -->
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
      <el-table-column prop="category" label="业务类型" min-width="120px"></el-table-column>
      <el-table-column prop="currTaskName" label="当前审批环节" min-width="120px"></el-table-column>
      <el-table-column prop="applyer" label="流程发起人" min-width="120px"></el-table-column>
      <el-table-column prop="deleteReason" label="审批操作" min-width="150px"></el-table-column>
      <el-table-column prop="comment" label="审批意见" min-width="150px"></el-table-column>
      <el-table-column label="耗时" min-width="100">
        <template slot-scope="scope">{{countTime(scope.row)}}</template>
      </el-table-column>
      <el-table-column prop="endTime" label="处理时间" min-width="180px"></el-table-column>
      <el-table-column fixed="right" label="操作" min-width="320px">
        <template slot-scope="scope">
          <div style="text-align:center;">
            <el-button
              type="warning"
              v-has="'myDone-detail'"
              size="mini"
              @click="toApplyDetail(scope.row.procInstId)"
              :id="$route.name + '-' + 'detail'+ scope.$index"
            >审批详情</el-button>
            <el-button
              type="primary"
              v-has="'myDone-formData'"
              size="mini"
              @click="toDetail(scope.row)"
              :id="$route.name + '-' + 'title'+ scope.$index"
            >表单数据</el-button>
            <el-button
              size="mini"
              type
              v-has="'myDone-stop'"
              plain
              :disabled="scope.row.result!=1"
              @click="tapPass(scope.row, 1)"
              :id="$route.name + '-' + 'end'+ scope.$index"
            >强制结束</el-button>
            <el-button
              size="mini"
              type="danger"
              v-has="'myDone-urgent'"
              plain
              :disabled="scope.row.result!=1"
              @click="urgent(scope.row)"
              :id="$route.name + '-' + 'todo'+ scope.$index"
            >催办</el-button>
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
    <el-dialog
      :title="title"
      :visible.sync="isShowPass"
      width="500px"
      :close-on-click-modal="false"
    >
      <div>
        <el-form :model="passForm" :rules="rules" ref="passForm" label-width="100px">
          <el-form-item label="结束原因" v-if="type==1">
            <el-input
              v-model="passForm.comment"
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 4}"
              maxlength="150"
              placeholder="请输入强制结束原因"
            ></el-input>
          </el-form-item>
          <el-form-item label="知会人" v-if="type==1" prop="userIds">
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
      <el-dialog  custom-class="message-list" width="600px" title="选择知会人" :visible.sync="isCheckUsers" append-to-body>
        <div  class="mess-dislog">
         <choose-users @change="changeUsersData" v-if="isCheckUsers" @close="isCheckUsers=false"></choose-users>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script>
import ChooseUsers from "./components/users";

export default {
  name: "myDone",
  components: {
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
          title: "处理时间",
          placeholder: ["开始日期", "结束日期"]
        }
      ],
      controlOptions: [
        // { name: "打印", type: "primary", icon: "printer", permission: 'myDone-print' },
        {
          name: "导出",
          type: "primary",
          icon: "s-promotion",
          permission: "myDone-export"
        }
      ],
      tableData: [],
      // currentPage: 1
      total: 0,
      params: {
        page: 1,
        pageSize: 20,
        param: {}
      },
      isShowPass: false,
      isCheckUsers: false,
      passForm: {
        procInstId: "",
        comment: "",
        userIds: [] // 知会的用户id
      },
      userDatas: "",
      title: "",
      type: "",
      rules: {}
    };
  },
  created() {
    let date = this.$route.params.date;
    if (date) {
      this.params.param.beginDate = this.$route.params.beginDate||date;
      this.params.param.endDate = this.$route.params.endDate||date;
      this.getTaskDone(this.params);
    } else {
      this.getTaskDone(this.params);
    }
    this.getTreeData();
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
  methods: {
    selectBtn(val) {
      console.log("selectBtn");
      if (val.name == "打印") {
        // this.$router.push({name: "gameCreate",});
      } else {
        // 导出列表
        this.exportDoneExcel();
      }
    },
    // 导出列表
    async exportDoneExcel() {
      const res = await this.$api.exportDoneExcel({
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
      aLink.setAttribute("download", "我的已办.xls");
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
      console.log(res);
    },
    urgent(val) {
      const self = this;
      this.$confirm("此操作将推送站内信消息给当前审批人, 是否继续?", "催办", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let data = {
            procInstId: val.procInstId,
            isStationMsgNotify: true
          };
          self.getTaskUrgent(data);
        })
        .catch(() => {});
    },
    changeUsersData(val) {
      // 选择知会人
      this.userDatas = val;
    },
    // 通过
    tapPass(val, type) {
      this.isShowPass = true;
      this.passForm.procInstId = val.procInstId;
      this.passForm.comment = "";
      this.passForm.userIds = [];
      this.checkedList = [1];
      this.type = type;
      let option = {
        1: "强制结束",
        2: "催办"
      };
      this.title = option[type];
    },
    surePass() {
      const self = this;
      let data = Object.assign({}, self.passForm);
      self.$refs.passForm.validate(valid => {
        if (valid) {
          if (self.type == 1) {
            // 强制结束
            data.isStationMsgNotify =
              this.checkedList.length > 0 ? true : false;
            self.getTaskForcedEnd(data);
          } else if (self.type == 2) {
            //
          }
        }
      });
    },
    // 催办
    getTaskUrgent(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getTaskUrgent({ data });
        if (res && res.code == 0) {
          this.isShowPass = false;
          self.$message.success("发送成功");
          self.getTaskDone(self.params);
        }
      })(data);
    },
    // 强制结束
    getTaskForcedEnd(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getTaskForcedEnd({ data });
        if (res && res.code == 0) {
          this.isShowPass = false;
          self.$message.success("提交成功");
          self.getTaskDone(self.params);
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
      if (self.$route.name === "myDone") {
        self.$router.push({ name: "myDoneDetail", query: { id } });
      } else {
        self.$router.push({ name: "myDoneDetails", query: { id } });
      }
    },
    open(val) {
      const self = this;
      self
        .$confirm(`您确认要删除 ${val.row.title} ?, 是否继续?`, "确认删除", {
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
          self.tableData.splice(val.$index, 1);
          // self.getMyApplyList();
        } else {
        }
      })(data);
    },
    // 耗时
    countTime(val) {
      if (!val.endTime) {
        return "";
      }
      let usedTime =
        new Date(val.endTime).getTime() - new Date(val.createTime).getTime();
      let days = Math.floor(usedTime / (24 * 3600 * 1000)); // 计算出天数
      let leavel = usedTime % (24 * 3600 * 1000); // 计算天数后剩余的时间
      let hours = Math.floor(leavel / (3600 * 1000)); // 计算剩余的小时数
      let leavel2 = leavel % (3600 * 1000); // 计算剩余小时后剩余的毫秒数
      let minutes = Math.floor(leavel2 / (60 * 1000)); // 计算剩余的分钟数
      return days + "天" + hours + "时" + minutes + "分";
    },
    // 我的申请列表
    getTaskDone(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getTaskDone({ data });
        if (res && res.code == 0) {
          console.log("res", res.data);
          self.tableData = res.data.records;
          self.total = res.data.total;
        } else {
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
      this.getTaskDone(this.params);
    },
    changeSize(val) {
      this.params.page = 1;
      this.params.pageSize = val;
      this.getTaskDone(this.params);
    },
    changeCurrent(val) {
      this.params.page = val;
      this.getTaskDone(this.params);
    },
    checkboxChange() {},
    view(row) {
      const self = this;
      console.log("查看", row);
      this.$router.push({
        name: "pendingReviewEdit",
        query: { id: row.id }
      });
    }
  }
};
</script>

<style lang="less">
@import './less/index.less';
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
</style>
