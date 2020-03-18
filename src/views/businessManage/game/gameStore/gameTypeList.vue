<template>
  <div class="vlt-card">
    <search-bar
      class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      :total="total"
      labelWidth="6em"
    >
      <control-bar slot="extend-bar" @select="selectBtn" :options="controlOptions"></control-bar>
    </search-bar>
    <el-table
      border
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <!-- <el-table-column type="selection" width="55" fixed="left"></el-table-column> -->
      <el-table-column label="序号" fixed width="55">
        <template slot-scope="scope">{{params.pageSize*(params.page - 1) + (scope.$index+1)}}</template>
      </el-table-column>
      <el-table-column prop="gameTypeCode" label="类型编码" min-width="120px"></el-table-column>
      <el-table-column prop="gameTypeName" label="类型名称" min-width="140px"></el-table-column>
      <el-table-column label="状态" min-width="120px">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.gameTypeStatus"
            v-has="'gameTypeList-switch'"
            @change="changeStatus(scope.row)"
            :active-text="scope.row.gameTypeStatus==0?'启用':'冻结'"
            :inactive-value="1"
            :active-value="0"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="gameTypeDesc" label="说明" min-width="160px"></el-table-column>
      <el-table-column prop="userName" label="创建人" min-width="120px"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="160px"></el-table-column>
      <el-table-column label="操作" min-width="150">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            v-has="'gameTypeList-edit'"
            @click.native="edit(scope.row)"
            :id="$route.name+'-edit-'+scope.$index"
          >编辑</el-button>
          <!-- <el-button  size="mini" v-prevent="2000" @click.native="edit(scope.row.id)">编辑</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <table-paging
      position="right"
      :total="total"
      :currentPage="params.page "
      :pageSize="params.pageSize"
      @handleSizeChange="changeSize"
      @handleCurrentChange="changeCurrent"
    ></table-paging>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="isShow"
      @close="close"
      width="50%"
      :close-on-click-modal="false"
      class="gameTypeList-dialog"
    >
      <div class="vlt-edit-single">
        <el-form
          label-position="right"
          label-width="80px"
          ref="form"
          :model="form"
          :rules="rules"
          class="base-form"
        >
          <el-form-item label="类型名称" prop="gameTypeName">
            <el-input
              v-model.trim="form.gameTypeName"
              placeholder="请输入类型名称"
              maxlength="15"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="类型编码" prop="gameTypeCode">
            <el-input
              v-model.trim="form.gameTypeCode"
              placeholder="请输入类型编码"
              maxlength="10"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="gameTypeStatus">
            <el-switch
              v-model="form.gameTypeStatus"
              :active-text="form.gameTypeStatus==0?'启用':'冻结'"
              :inactive-value="1"
              :active-value="0"
            ></el-switch>
          </el-form-item>
          <el-form-item label="类型说明" prop="gameTypeDesc">
            <el-input
              v-model="form.gameTypeDesc"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 5}"
              maxlength="100"
              placeholder="请输入类型说明"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShow = false" size="medium" :id="$route.name+'-form-cencel'">取 消</el-button>
        <el-button type="primary" size="medium" @click="sure" :id="$route.name+'-form-enter'">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import { mapGetters } from "vuex";

export default {
  name: "",
  data() {
    return {
      controlOptions: [
        {
          name: "新增类型",
          type: "primary",
          icon: "plus",
          permission: "gameTypeList-add"
        } // type为按钮的五种颜色， icon为具体的图标
        // { name: "批量删除", type: "", icon: "delete" }
      ],
      searchOptions: [
        {
          title: "类型名称",
          type: "input",
          prop: "gameTypeName",
          value: "",
        },
        {
          title: "类型状态",
          type: "select",
          prop: "gameTypeStatus",
          value: "",
          options: [
            { label: "启用", value: "0" },
            { label: "冻结", value: "1" }
          ]
        }
      ],
      tableData: [],
      isShow: false,
      rules: {},
      dialogTitle: "新增类型",
      form: {
        gameTypeName: "",
        gameTypeStatus: "",
        gameTypeDesc: "",
        gameTypeCode: ""
      },
      item: "",
      params: {
        page: 1,
        pageSize: 20,
        param: {}
      },
      total: 0,
      rules: {
        gameTypeName: [
          {
            required: true,
            validator: this.$rules.checkName,
            title: "类型名称",
            trigger: ["change", "blur"]
          }
        ],
        gameTypeCode: [
          {
            required: true,
            validator: this.$rules.checkPositive,
            title: "类型编码",
            trigger: ["change", "blur"]
          }
        ]
      }
    };
  },
  created() {
    this.getAllGameType();
    this.getGameTypeList(this.params);
  },
  methods: {
    changeTime(val) {
      return this.$moment(val).format("YYYY-MM-DD HH:mm:ss");
    },
    // 获取下拉框数据
    getAllGameType(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getAllGameType({ data });
        if (res && res.code == 0) {
          let array = [];
          res.data.forEach(item => {
            let obj = {};
            obj.label = item.gameTypeName;
            obj.value = item.gameTypeCode;
            array.push(obj);
          });
          this.searchOptions[0].options = array;
        }
      })(data);
    },
    // 获取游戏类型列表
    getGameTypeList(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getGameTypeList({ data });
        if (res && res.code == 0) {
          self.total = res.data.total;
          res.data.records.forEach(item => {
            item.createTime = this.$moment(item.createTime).format(
              "YYYY-MM-DD HH:mm:ss"
            );
          });
          self.tableData = res.data.records;
        }
      })(data);
    },
    // 新增游戏类型
    createGameType(data) {
      const self = this;
      (async data => {
        let res = await self.$api.createGameType({ data });
        if (res && res.code == 0) {
          // self.tableData = res.data.records;
          self.isShow = false;
          self.$message.success("新增成功");
          self.getGameTypeList(self.params);
          self.getAllGameType();
        }
      })(data);
    },
    // 编辑游戏类型
    editGameType(data) {
      const self = this;
      (async data => {
        let res = await self.$api.editGameType({ data });
        if (res && res.code == 0) {
          // self.tableData = res.data.records;
          self.item = Object.assign(self.item, data);
          self.isShow = false;
          self.$message.success("保存成功");
          // self.getGameTypeList(self.params)
        }
      })(data);
    },
    // 修改游戏类型状态
    getGameTypeStatus(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getGameTypeStatus({ data });
        if (res && res.code == 0) {
          // self.tableData = res.data.records;
          self.$message.success("修改成功");
          // self.getGameTypeList(self.params)
        }
      })(data);
    },
    changeStatus(val) {
      const self = this;
      self.$confirm('此操作将修改该类型的状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.item = val;
        let data = {
          id: val.id,
          gameTypeStatus: val.gameTypeStatus
        };
        self.getGameTypeStatus(data);
      }).catch(() => {
        self.$message({
          type: 'warning',
          message: '已取消'
        }); 
        val.gameTypeStatus = val.gameTypeStatus==1?0:1;         
      });
    },
    edit(val) {
      this.item = val;
      this.isShow = true;
      this.dialogTitle = "编辑类型";
      this.form = {
        id: val.id,
        gameTypeName: val.gameTypeName,
        gameTypeStatus: val.gameTypeStatus,
        gameTypeDesc: val.gameTypeDesc,
        gameTypeCode: val.gameTypeCode
      };
    },
    search(form) {
      this.params.page = 1;
      if (form.gameTypeStatus) {
        form.gameTypeStatus = Number(form.gameTypeStatus);
      }
      this.params.param = form;
      this.getGameTypeList(this.params);
    },
    changeSize(val) {
      this.params.page = 1;
      this.params.pageSize = val;
      this.getGameTypeList(this.params);
    },
    changeCurrent(val) {
      this.params.page = val;
      this.getGameTypeList(this.params);
    },
    close() {
      // this.$refs.baseForm.resetForm()
    },
    sure() {
      // this.close();
      const self = this;
      self.$refs.form.validate(valid => {
        if (valid) {
          self.form.gameTypeCode = Number(self.form.gameTypeCode);
          if (self.dialogTitle == "新增类型") {
            self.createGameType(self.form);
          } else {
            self.editGameType(self.form);
          }
        }
      });
    },
    selectBtn(item) {
      if (item.name == "新增类型") {
        this.dialogTitle = "新增类型";
        this.isShow = true;
        this.form = {
          gameTypeName: "",
          gameTypeStatus: 0,
          gameTypeDesc: "",
          gameTypeCode: ""
        };
        this.$refs.form && this.$refs.form.resetFields();
      }
    }
  }
};
</script>

<style lang="less" scoped>
.base-form {
  width: 500px;
  margin: 0 auto;
}
</style>
<style lang="less">
.gameTypeList-dialog {
  .el-dialog {
    max-width: 700px;
  }
}
</style>
