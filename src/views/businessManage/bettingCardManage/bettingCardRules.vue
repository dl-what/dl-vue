<template>
  <!-- 投注卡规则 -->
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
        <el-table-column
          v-for="(item,key) in tableDatas.tableKey"
          :key="key"
          :prop="item.value"
          :label="item.label"
          :width="item.width"
          :type="item.type"
        ></el-table-column>
        <el-table-column fixed="right" label="操作" min-width="120">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="toDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <table-paging
      position="right"
      :total="tableData.total"
      :currentPage="tableData.current"
      :pageSize="tableData.size"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></table-paging>
    <edit-betting-rule :isShow="showformDia" :insDatas="insDatas" :oData="rowData" @closeDia="closeDia"></edit-betting-rule>
  </div>
</template>

<script type="text/javascript">
import editBettingRule from "@/views/businessManage/bettingCardManage/editBettingRule";
import { isArray } from 'util';
export default {
  name: "",
  data() {
    return {
      showformDia: false,
      // 搜索组件配置
      searchOptions: [
        {
          type: "cascader",
          title: "所属机构",
          prop: "insId",
          setProps: {
            label: "text",
            value: "id",
            children: "children",
            // multiple: true, // 多选
            checkStrictly: true //设置父子节点取消选中关联，从而达到选择任意一级选项的目的
          },
          options: []
        }
      ],
      controlOptions: [{ name: "新建", type: "primary", icon: "plus" }],
      tableDatas: {
        tableKey: [
          { label: "序号", value: "id", type:"index", width: "80" },
          { label: "所属机构", value: "insName", width: "" },
          { label: "选择渠道", value: "channelAddress", width: "200" },
          { label: "周期", value: "circle", width: "" },
          { label: "笔数", value: "limitPenNum", width: "80" },
          { label: "限额", value: "limitAmount", width: "" },
          { label: "限制次数", value: "limitNum", width: "" }
        ]
      },
      tableData: {
        records: [],
        total: 4,
        size: 20,
        current: 1,
        searchCount: true,
        pages: 1
      },
      options: {
        page: 1,
        pageSize: 20,
        param: {
          insId: 0
        }
      },
      rowData: {},
      insDatas:[]
    };
  },
  components: {
    "edit-betting-rule": editBettingRule
  },
  created() {
    this.getList(this.options);
    this.getInsData();
  },
  methods: {
    // 获取机构列表
    getInsData() {
      const self = this;
      const data = {};
      (async data => {
        let res = await self.$api.QueryUserAndInsTree({ data });
        if (res && res.code == 0) {
          let insList = res.data;
          insList&&insList.forEach(el => {
            el.children&&el.children.forEach(item => {
              item.children && item.children.forEach(i => {
                delete i.children
              }) 
            })
          });
          self.$set(self.searchOptions[0], "options", insList);
          this.insDatas = res.data
        } else {
          // self.$message.warning(res.msg)
        }
      })(data);
    },
    selectBtn(val) {
      this.$router.push({
        name: "newbettingRule"
      });
    },
    search(form) {
      this.options.param.insId = form.insId && Array.isArray(form.insId) ?  Number(form.insId[form.insId.length - 1]) : '';
      this.getList(this.options);
    },

    async getList(options) {
      let data = JSON.parse(JSON.stringify(options));
      let result = await this.$api.getBettingRulesList({ data });
      if (result.code == 0) {
        this.tableData = result.data;
      }
    },
    async deleteBettingRule(id) {
      const _this = this;
      let result = await _this.$api.deleteBettingCard(id);
      return result;
    },
    edit(row) {
      this.rowData = row;
      this.showformDia = true;
    },
    toDelete(row) {
      this.$confirm("将删除这条规则, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let result = this.deleteBettingRule({data:row.id});
          result.then(resp => {
            if (resp.code == 0) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            }
            // 删除之后再次刷新一下数据
            this.getList(this.options);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(pageSize) {
      this.options.pageSize = pageSize;
      this.getList(this.options);
    },
    handleCurrentChange(currentPage) {
      this.options.page = currentPage;
      this.getList(this.options);
    },
    closeDia() {
      this.showformDia = false;
      this.getList(this.options);
    }
  }
};
</script>

<style lang="less" scoped>
.vlt-card {
  padding: 20px;
}
</style>
