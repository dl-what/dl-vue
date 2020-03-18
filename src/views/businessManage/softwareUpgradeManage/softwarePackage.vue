<template>
  <!-- 回滚设置列表 -->
  <div class="vlt-card ">
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
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column label="序号" fixed type="index" width="55"></el-table-column> -->
      <el-table-column  label="序号" type="index" fixed width="55">
          <template slot-scope="scope">{{params.pageSize*(params.page-1)+(scope.$index+1)}}</template>
        </el-table-column>
      <el-table-column prop="name" label="软件名称" min-width="300px"></el-table-column>
      <!-- <el-table-column prop="versionName" label="版本名称"></el-table-column> -->
      <el-table-column prop="versionCode" label="版本号" min-width="120px"></el-table-column>
      <!-- <el-table-column prop="softType" label="软件类型">
        <template slot-scope="scope">{{translateSoftType(scope.row.softType)}}</template>
      </el-table-column> -->
      <el-table-column prop="softwareSize" label="软件大小" min-width="100px"></el-table-column>
      <el-table-column prop="remark" label="软件描述" min-width="180px"></el-table-column>
      <el-table-column prop="characteristic" label="新版特性" min-width="180px"></el-table-column>
      <el-table-column prop="updateField" label="更新字段" min-width="180px"></el-table-column>
      <el-table-column prop="updateTime" label="上传时间" width="170">
        <template slot-scope="scope">{{translateTime(scope.row.updateTime)}}</template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="140">
        <template slot-scope="scope">
          <el-button  type="primary" size="mini"
            @click="detail(scope.row, 'softwarePackageDetail')"
            v-has="'softwarePackage-detail'"
            :id="$route.name+'-'+'detail'+scope.$index"
          >查看</el-button>
          <el-button type="" size="mini"  @click.native="edit(scope.row)" v-has="'softwarePackage-edit'" :id="$route.name+'-'+'edit'+scope.$index">编辑</el-button>
          <!-- <el-button type="primary" size="mini" v-prevent="2000" @click="toDelete(scope.row)" >
            删除</el-button> -->
          
        </template>
      </el-table-column>
    </el-table>
    <table-paging
      position="right"
      :total="total"
      :currentPage="params.page"
      :pageSize="params.pageSize"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></table-paging>
    <!--  -->
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "",
  data() {
    return {
      dialogVisible: false,
      controlOptions: [
        { name: "上传升级软件包", type: "primary", icon: "plus",permission:"softwarePackage-add" } // type为按钮的五种颜色， icon为具体的图标
      ],
      tableData: [],
      multipleSelection: [],
      searchOptions: [
        { title: "软件名称", type: "input", prop: "name", value: "" },
        { title: "版本号", type: "input", prop: "versionCode", value: "" },
        {
          title: "上传时间",
          type: "datepicker-range",
          prop: "changePlanTime",
          value: "",
          options: ["start", "end"]
        }
      ],
      total: 0,
      searchParams: {},
      params: {
        page: 1,
        pageSize: 20
      }
    };
  },
  created() {
    this.querySoftPackagePage();
  },
  mounted() {},
  methods: {
    translateTime(val) {
      return moment(val).format("YYYY-MM-DD HH:mm:ss");
    },
    // translateSoftType(val) {
    //   let options = { 1: "投注终端", 2: "柜员机软件", 3: "渠道APP" };
    //   return options[val];
    // },
    async querySoftPackagePage() {
      //分页列表
      const res = await this.$api.querySoftPackagePage({
        data: {
          ...this.params,
          param: this.searchParams
        }
      });
      console.log("分页列表数据", res);
      if (res && res.code === 0) {
        this.tableData = res.data.records || [];
        this.total = res.data.total;
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //查看页面跳转
    detail(row, name) {
      this.$router.push({
        name: name,
        query: {
          id: row.id
        }
      });
    },
    selectBtn() {
      this.$router.push({
        path: "./softwarePackageUpload",
        query: { type: 0 }
      });
    },
    edit(val) {
      // console.log("obj是", obj);
      this.$router.push({
        path: "./softwarePackageUpload",
        query: { type: 1, id:val.id }
      });
    },
    search(val) {
      //搜索
      let list = {};
      if (val.changePlanTime && val.changePlanTime.length > 0) {
        let startTime = moment(Date.parse(val.changePlanTime[0])).format(
          "YYYY-MM-DD"
        );
        let endTime = moment(Date.parse(val.changePlanTime[1])).format(
          "YYYY-MM-DD"
        );
        list = {
          ...val,
          startTime,
          endTime
        };
      } else {
        list = {
          ...val
        };
      }
      delete list.changePlanTime;
      this.searchParams = { ...list };
      this.params.page = 1;
      this.querySoftPackagePage();
    },
    handleSizeChange(size) {
      // console.log(`每页 ${val} 条`);
      this.params.pageSize = size;
      this.querySoftPackagePage();
    },
    handleCurrentChange(val) {
      this.params.page = val;
      this.querySoftPackagePage();
    }
  },
  computed: {},
  components: {}
};
</script>


<style lang="less" scoped>
</style>
