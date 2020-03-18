<template>
  <!-- 指标设置 -->
  <div class="vlt-card">
    <search-bar
      class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      :total="tableData.total"
      labelWidth="6em"
    >
      <control-bar slot="extend-bar" position="left" @select="selectBtn" :options="controlOptions"></control-bar>
    </search-bar>
    <el-row class="card-table">
      <el-table
        :data="tableData.records"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
        class="table-box"
      >
        <el-table-column label="序号" width="80" fixed="left">
          <template slot-scope="scope">{{tableData.size*(tableData.current-1)+(scope.$index+1)}}</template>
        </el-table-column>
        <el-table-column
          v-for="(item,key) in tableKey"
          :key="key"
          :prop="item.value"
          :label="item.label"
          :width="item.width"
          :type="item.type"
        ></el-table-column>
        <el-table-column fixed="right" label="操作" min-width="200">
          <template slot-scope="scope">
            <el-button
              :id="'indicatorSettings-detail'+ scope.$index"
              type="primary"
              v-has="'indicatorSettings-detail'"
              size="mini"
              @click="handleClick(scope.row)"
            >查看</el-button>
            <el-button
              :id="'indicatorSettings-edit'+ scope.$index"
              type
              v-has="'indicatorSettings-edit'"
              size="mini"
              @click="edit(scope.row)"
            >编辑</el-button>
            <el-button
              :id="'indicatorSettings-delete'+ scope.$index"
              type="danger"
              v-has="'indicatorSettings-delete'"
              size="mini"
              @click="toDelete (scope.row) "
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <table-paging
        position="right"
        :total="tableData.total"
        :currentPage="options.page"
        :pageSize="options.pageSize"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      ></table-paging>
    </el-row>
    <!-- <indicator-edit :editDialog.sync="editData"></indicator-edit> -->
  </div>
</template>

<script type="text/javascript">
// import indicatorEdit from "@/views/businessManage/channelPerformanceManage/channelAssessment/indicatorEdit";
import { isArray } from "util";
export default {
  name: "indicatorSettings",
  data() {
    return {
      // 搜索组件配置
      searchOptions: [
        { title: "指标名称", type: "input", prop: "targetName", value: "" },
        {
          title: "指标类别",
          type: "select",
          prop: "targetType",
          value: "",
          options: [
            { label: "定性考核", value: 0 },
            { label: "定量考核", value: 1 }
          ]
        },
        {
          title: "考核类型",
          type: "select",
          prop: "examineType",
          value: "",
          options: [
            { label: "绩效考核", value: 0 },
            { label: "等级考核", value: 1 }
          ]
        },
        {
          title: "渠道类型",
          type: "select",
          prop: "channelType",
          value: "",
          options: [
            { label: "自营厅", value: 0 },
            { label: "合作厅", value: 1 }
          ]
        }
      ],
      controlOptions: [
        {
          name: "新增指标",
          type: "primary",
          icon: "plus",
          permission: "indicatorSettings-add"
        }
      ],
      tableKey: [
        // { label: "序号", value: "bettingCardId", type: "index", width: "70" },
        { label: "指标名称", value: "targetName", width: "300" },
        { label: "指标类别", value: "targetType", width: "120" },
        { label: "考核类型", value: "examineType", width: "120" },
        { label: "渠道类型", value: "channelType", width: "120" },
        { label: "考核类别", value: "targetCategory", width: "100" },
        { label: "考核分值", value: "conditionScores", width: "" }
      ],
      tableData: {
        records: [],
        total: 0,
        size: 20,
        current: 1,
        orders: [],
        searchCount: true,
        pages: 1
      },
      options: {
        page: 1,
        pageSize: 20,
        param: {}
      },
      outData: {},
      editData: {
        showEdit: false,
        data: {}
      },
      targetTypeArr: ["定性考核", "定量考核"],
      targetCategoryArr: ["大厅管理", "大厅维护", "业务培训", "彩民服务"],
      examineTypeArr: ["绩效考核", "等级考核"],
      channelTypeArr: ["自营厅", "合作厅"]
    };
  },
  created() {
    // this.options.param.insId = this.$storage.get('userInfo').insId;
    // if (this.options.param.insId) {
    this.initList(this.options);
    // }
  },
  methods: {
    async initList(options) {
      const _this = this;
      let data = JSON.parse(JSON.stringify(options));
      console.log(data);
      let result = await this.$api.channelExamineTargetList({ data });
      console.log(result);
      if (result.code == 0) {
        _this.tableData = result.data;
        _this.tableData.records = result.data.records.map(item => {
          if (String(item.targetType))
            item.targetType = _this.targetTypeArr[item.targetType];
          if (String(item.targetCategory))
            item.targetCategory =
              _this.targetCategoryArr[item.targetCategory - 1];
          if (String(item.examineType))
            item.examineType = _this.examineTypeArr[item.examineType];
          if (String(item.channelType))
            item.channelType = _this.channelTypeArr[item.channelType];
          // console.log(item);
          return item;
        });
      } else {
        _this.$message({
          type: "error",
          message: result.msg
        });
      }
    },
    selectBtn(val) {
      this.$router.push({
        name: "newIndicator"
      });
    },

    search(form) {
      console.log(form);
      this.options.param = {
        ...form
      };

      this.options.page = 1;
      this.initList(this.options);
    },
    handleClick(row) {
      this.$router.push({
        name: "indicatorDetail",
        query: {
          id: row.id
        }
      });
    },
    edit(val) {
      // this.editData.showEdit = true;
      // this.editData.data = val;
      this.$router.push({
        name: "indicatorEdit",
        query: {
          id: val.id
        }
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(pageSize) {
      this.tableData.size = pageSize;
      this.options.pageSize = pageSize;
      this.options.page = 1;
      this.initList(this.options);
    },
    handleCurrentChange(currentPage) {
      console.log(currentPage);
      this.options.page = currentPage;
      this.initList(this.options);
    },
    changeForm(val) {
      Object.assign(this.params, val);
      // console.log("派发出来的参数", this.params);
    },
    async deleteBetting(id) {
      const _this = this;
      let result = await _this.$api.channelExamineTargetDelete(id);
      return result;
    },

    toDelete(row) {
      const _this = this;
      _this
        .$confirm("将删除此数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          let id = row.id;
          let result = _this.deleteBetting({ data: id });
          result.then(resp => {
            console.log(resp);
            if (resp.code == 0) {
              _this.$message({
                type: "success",
                message: "删除成功！"
              });
              // 删除之后再次刷新一下数据
              _this.initList(_this.options);
            }
          });
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消删除！"
          });
        });
    }
  }
  // components: {
  //   "indicator-edit": indicatorEdit
  // }
};
</script>

<style lang="less" scoped>
</style>
