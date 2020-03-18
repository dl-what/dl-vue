<!--table子组件封装-->
<template>
  <el-table :data="tableData" border>
    <el-table-column
      v-for="(item,key) in value.tableKey"
      :key="key"
      :prop="item.value"
      :label="item.name"
    ></el-table-column>
  </el-table>
</template>
<script>
export default {
  name: "table",
  props: {
    tableData: {
      type: Array,
      default: []
    }
  }, //子传父
  data() {
    return {};
  }
};
</script>
<style>
</style>