<template>
  <div class="vlt-card">
    <el-table
      :data="form.tabelList"
      border
      @selection-change="selectionChange"
      :row-key="getRowKeys"
    >
      <el-table-column type="selection" width="60px"></el-table-column>
      <el-table-column label="序号" fixed type="index" width="55"></el-table-column>
      <el-table-column prop="targetName" label="指标名称"></el-table-column>
      <el-table-column prop="targetType" label="指标类别">
        <template slot-scope="scope">{{translateTargetType(scope.row.targetType)}}</template>
      </el-table-column>
      <el-table-column prop="channelType" label="渠道类型">
        <template slot-scope="scope">{{translateChannelType(scope.row.channelType)}}</template>
      </el-table-column>
      <el-table-column prop="targetCategory" label="考核类别">
        <template slot-scope="scope">{{translateTargetCategory(scope.row.targetCategory)}}</template>
      </el-table-column>
      <el-table-column prop="conditionScores" label="考核分值"></el-table-column>
    </el-table>
    <table-paging
      :current-page="form.current"
      :page-size="form.pageSize"
      :total="form.total"
      @handleSizeChange="pageSizeChange"
      @handleCurrentChange="pageCurrentChange"
    ></table-paging>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "",
  model: {
    prop: "form"
  },
  props: {
    form: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {};
  },
  components: {},
  methods: {
    translateTargetType(val) {
      let options = { 0: "定性考核", 1: "定量考核" };
      return options[val];
    },
    translateTargetCategory(val) {
      let options = {
        0: "大厅管理",
        1: "大厅维护",
        2: "业务培训",
        3: "彩民服务"
      };
      return options[val];
    },
    translateChannelType(val) {
      let options = { 0: "自营厅", 1: "合作厅" };
      return options[val];
    },
    selectionChange(data) {
      this.$emit("selectionChange", data);
    },
    pageSizeChange(size) {
      this.form.pageSize = size;
      this.$parent.$parent.trainItemListAll();
    },
    pageCurrentChange(page) {
      this.form.current = page;
      this.$parent.$parent.trainItemListAll(page);
    },
    getRowKeys(row) {
      return row.id;
    }
  }
};
</script>

<style lang="less" scoped>
</style>
