<template>
  <div>
    <el-table
      :data="form.tabelList"
      border
      ref="multipleTable"
      @selection-change="selectionChange"
      :row-key="getRowKeys"
    >
      <el-table-column type="selection" width="55px" :reserve-selection="true"></el-table-column>
      <el-table-column label="序号" fixed type="index" width="55px"></el-table-column>
      <el-table-column label="课程名称" prop="name" min-width="120px"></el-table-column>
      <el-table-column label="课程类型" prop="courseTypeName" min-width="80px"></el-table-column>
      <el-table-column label="课件类型" prop="courseMode" min-width="80px">
        <template slot-scope="scope">{{changeType(scope.row.courseMode)}}</template>
      </el-table-column>
      <el-table-column label="单选题" prop="questionScoreVo.singleChoice" min-width="80px"></el-table-column>
      <el-table-column label="多选题" prop="questionScoreVo.multiChoice" min-width="80px"></el-table-column>
      <el-table-column label="创建人" prop="uploadPersonName" min-width="100px"></el-table-column>
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
    selectionChange(data) {
      console.log(data);
      this.$emit("selectionChange", data);
    },
    pageSizeChange(size) {
      this.form.pageSize = size;
      this.$parent.$parent.trainItemListAll();
    },
    pageCurrentChange(page) {
      // this.form.current = page;
      this.$parent.$parent.trainItemListAll(page);
    },
    getRowKeys(row) {
      return row.id;
    },
    changeType(key) {
      let option = {
        1: "视频",
        2: "音频",
        3: "图片",
        4: "pdf"
      };
      return option[key];
    },
  }
};
</script>

<style lang="less" scoped>
</style>
