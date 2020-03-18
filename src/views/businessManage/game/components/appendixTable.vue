<template>
  <div>
    <el-table
      border
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%">
      <el-table-column label="序号" type="index" width="55"></el-table-column>
      <el-table-column prop="name" label="附件资料" min-width="280px"></el-table-column>
      <el-table-column prop="createByName" label="创建人" min-width="80px"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="160px"></el-table-column>
      <el-table-column label="操作" min-width="100px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" v-prevent="2000"  @click="toLink(scope.row.url)" :id="$route.name+'-'+'download'+scope.$index">下载</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script type="text/javascript">

export default {
  name: "",
  components: {
  },
  props: {
    tableData: {
      type: Array,
      default: []
    },
    downUrl: {
      type: String,
      default: 'downGameLoad'
    }
  },
  data() {
    return {

    }
  },
  methods: {
    toLink(url) {
      this.$download(1, url)
    },
    // 下载
    async downLoad(val) {
      let formData = new FormData();
      formData.append('filePath', val);
      const res = await this.$api[this.downUrl]({
        data: formData,
        responseType: "blob"
      });
      var blob = new Blob([res], {
        type: "application/msword;application/vnd.openxmlformats-officedocument.wordprocessingml.document;image/jpeg;image/png;application/x-rar-compressed;application/vnd.ms-excel;application/zip;charset=utf-8"
      });
      var url = window.URL.createObjectURL(blob);
      var aLink = document.createElement("a");
      aLink.style.display = "none";
      aLink.href = url;
      aLink.setAttribute("download", val.split('/')[val.split('/').length-1]);
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
      console.log(res);
    },
  },
}
</script>

<style lang="less" scoped>

</style>
