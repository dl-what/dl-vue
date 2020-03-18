<!-- 首页 - 概况 - 消息列表 -->

<template>
  <div class="vlt-card message-content">
    <search-bar
      class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      :total="total"
      labelWidth="6em"
    >
      <control-bar slot="extend-bar" @select="selectBtn" :options="controlOptions" position="left"></control-bar>
    </search-bar>
    <el-tabs v-model="activeName" @tab-click="tabClick" class="tabs">
      <el-tab-pane label="已发消息" name="1">
        <el-table v-if="activeName=='1'" :data="sendTableData" style="width: 100%" border>
          <el-table-column label="序号" fixed width="55">
            <template slot-scope="scope">{{params.pageSize*(params.page - 1) + (scope.$index+1)}}</template>
          </el-table-column>
          <el-table-column prop="title" label="标题" min-width="180px"></el-table-column>
          <el-table-column prop="content" label="消息内容" min-width="200px"></el-table-column>
          <el-table-column prop="receive" label="收件人" min-width="160px"></el-table-column>
          <el-table-column prop="createTime" label="发送时间" min-width="160px"></el-table-column>
          <el-table-column fixed="right" label="操作" min-width="100px">
            <template slot-scope="scope">
              <el-button
                type="primary"
                v-has="'messageList-detail'"
                size="mini"
                @click="detail(scope.row)"
                :id="$route.name + '-' + 'detail'+ scope.$index"
              >查看</el-button>
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
      </el-tab-pane>
      <el-tab-pane label="接收消息" name="2">
        <el-table :data="receiveTableData" v-if="activeName=='2'" style="width: 100%" border>
          <el-table-column label="序号" fixed width="55">
            <template slot-scope="scope">{{params.pageSize*(params.page - 1) + (scope.$index+1)}}</template>
          </el-table-column>
          <el-table-column prop="title" label="标题" min-width="180px"></el-table-column>
          <el-table-column prop="content" label="消息内容" min-width="200px"></el-table-column>
          <el-table-column prop="sendUserName" label="发件人" min-width="160px"></el-table-column>
          <el-table-column prop="createTime" label="发送时间" min-width="160px"></el-table-column>
          <el-table-column fixed="right" label="操作" min-width="100px">
            <template slot-scope="scope">
              <el-button
                type="primary"
                v-has="'messageList-detail'"
                size="mini"
                @click="detail(scope.row)"
                :id="$route.name + '-' + 'detail'+ scope.$index"
              >查看</el-button>
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
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="发布消息" :visible.sync="isShow" width="500px" :close-on-click-modal="false">
      <div>
        <el-form :model="form" :rules="rules" ref="form" label-width="80px">
          <el-form-item label="标题" prop="title">
            <el-input
              v-model="form.title"
              :disabled="type==1"
              placeholder="请输入标题"
              maxlength="20"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="收件人" v-if="type==0" prop="receiveUserIdList">
            <el-select
              v-model="form.receiveUserIdList"
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
          <el-form-item label="收件人" v-if="type==1" prop="title">
            <el-input
              type="textarea"
              autosize
              disabled
              placeholder="请输入内容"
              maxlength="200"
              v-model="form.receiveUserIdList"
            ></el-input>
          </el-form-item>
          <el-form-item label="消息内容" prop="content">
            <el-input
              v-model="form.content"
              :disabled="type==1"
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 4}"
              maxlength="200"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="medium" @click="isShow = false" :id="$route.name + '-' + 'cancel'">取 消</el-button>
          <el-button
            type="primary"
            size="medium"
            @click="sure"
            :id="$route.name + '-' + 'enter'"
          >确 定</el-button>
        </div>
      </div>
      <el-dialog
        custom-class="message-list"
        width="600px"
        title="选择收件人"
        class="dialog-user"
        :visible.sync="isCheckUsers"
        append-to-body
      >
        <div class="mess-dislog">
          <choose-users @change="changeUsersData" v-if="isCheckUsers" @close="isCheckUsers=false"></choose-users>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import ChooseUsers from "./components/users";

export default {
  name: "messages",
  components: {
    ChooseUsers
  },
  data() {
    return {
      isShow: false,
      total: 0,
      sendTableData: [],
      receiveTableData: [],
      activeName: "1",
      // 搜索组件配置
      searchOptions: [
        {
          type: "datepicker-range",
          prop: "date",
          value: "",
          title: "发送时间"
        },
        {
          type: "input",
          prop: "title",
          value: "",
          title: "标题",
        },
      ],
      controlOptions: [
        {
          name: "发布消息",
          type: "primary",
          icon: "plus",
          permission: "messageList-add"
        } // type为按钮的五种颜色， icon为具体的图标
      ],
      params: {
        page: 1,
        pageSize: 20,
        param: {}
      },
      form: {
        title: "",
        content: "",
        receiveUserIdList: [] // 收件人的用户id
      },
      userDatas: "",
      rules: {
        title: [
          {
            required: true,
            message: "标题不能为空",
            trigger: ["change", "blur"]
          }
        ],
        content: [
          {
            required: true,
            message: "消息内容不能为空",
            trigger: ["change", "blur"]
          }
        ],
        receiveUserIdList: [
          {
            required: true,
            message: "收件人不能为空",
            trigger: ["change", "blur"]
          }
        ]
      },
      isCheckUsers: false,
      type: 0 //  0为发送 1为接收
    };
  },
  created() {
    this.getMessageList(this.params);
  },
  watch: {
    userDatas: {
      // 监听收件人
      handler(value) {
        this.form.receiveUserIdList = [];
        value.forEach(item => {
          this.form.receiveUserIdList.push(item.userId);
        });
      },
      deep: true
    }
  },
  methods: {
    sure() {
      const self = this;
      self.$refs.form.validate(valid => {
        if (valid) {
          self.addMessage(self.form);
        }
      });
    },
    changeUsersData(val) {
      // 选择知会人
      this.userDatas = val;
    },
    selectBtn() {
      this.isShow = true;
      this.type = 0;
      this.form.title = "";
      this.form.content = "";
      this.form.receiveUserIdList = [];
      this.$nextTick(()=> {
        console.log(this.$refs.form);
        this.$refs.form.resetFields()
      })
    },
    tabClick(tab) {
      const index = tab.index;
      const self = this;
      this.params.page = 1;
      this.type = index * 1;
      this.params.param.type = this.type;
      self.getMessageList(this.params);
    },
    detail(val) {
      if (this.$route.name === "messageList") {
        this.$router.push({ name: "messageDetail", query: { id: val.id } });
      } else {
        this.$router.push({ name: "messageDetails", query: { id: val.id } });
      }
    },
    // 查看站内信详情
    getMessageDetail(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getMessageDetail({ data });
        if (res && res.code == 0) {
          self.form.title = res.data.title;
          self.form.content = res.data.content;
          self.form.receiveUserIdList = res.data.receive;
        }
      })(data);
    },
    // 新增站内信
    addMessage(data) {
      const self = this;
      (async data => {
        let res = await self.$api.addMessage({ data });
        if (res && res.code == 0) {
          self.isShow = false;
          self.$message.success("发布成功");
          self.getMessageList(this.params);
        }
      })(data);
    },
    // 站内信列表
    getMessageList(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getMessageList({ data });
        if (res && res.code == 0) {
          self.total = res.data.total;
          res.data.records.forEach(item => {
            item.createTime = this.$moment(item.createTime).format(
              "YYYY-MM-DD HH:mm:ss"
            );
          });
          if (self.activeName == "1") {
            self.sendTableData = res.data.records;
          } else {
            self.receiveTableData = res.data.records;
          }
        }
      })(data);
    },
    search(val) {
      this.params.page = 1;
      this.params.param = val;
      this.params.param.type = this.type;

      if (val.date && val.date.length > 0) {
        this.params.param.beginDate = this.$moment(val.date[0]).format(
          "YYYY-MM-DD"
        );
        this.params.param.endDate = this.$moment(val.date[1]).format(
          "YYYY-MM-DD"
        );
        delete this.params.param.date;
      }
      this.getMessageList(this.params);
    },
    changeSize(val) {
      this.params.page = 1;
      this.params.pageSize = val;
      this.getMessageList(this.params);
    },
    changeCurrent(val) {
      this.params.page = val;
      this.getMessageList(this.params);
    }
  }
};
</script>

<style lang="less" scoped>
.dialog-footer {
  padding-top: 20px;
  text-align: right;
}
.pass-select {
  width: 100%;
}
</style>
<style lang="less">
@import './less/index.less';
// .dialog-user {
//   z-index: 2020 !important;
// }
</style>