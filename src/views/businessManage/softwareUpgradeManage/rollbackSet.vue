<template>
  <!-- 回滚设置列表 -->
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
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column label="序号" fixed type="index" width="55"></el-table-column> -->
      <el-table-column label="序号" type="index" fixed width="55">
        <template slot-scope="scope">{{params.pageSize*(params.page-1)+(scope.$index+1)}}</template>
      </el-table-column>
      <el-table-column prop="name" label="回滚名称" min-width="200px"></el-table-column>
      <el-table-column prop="upgradeName" label="被回滚计划" min-width="200px"></el-table-column>
      <el-table-column prop="targetType" label="回滚目标" min-width="140px">
        <template slot-scope="scope">{{translateTargetType(scope.row.targetType)}}</template>
      </el-table-column>
      <!-- <el-table-column prop="target" label="回滚目标名称">
        <template slot-scope="scope">{{getInsArray(scope.row.target)}}</template>
      </el-table-column>-->
      <el-table-column prop="status" label="状态" min-width="120px">
        <template slot-scope="scope">
          <span
            class="icon-circle"
            :class="{
          blue:scope.row.status=='1',
          green:scope.row.status=='2',
          grey:scope.row.status=='4',
          yellow:scope.row.status=='0',
          red:scope.row.status=='3',
          }"
          >{{scope.row.strStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="回滚原因" min-width="160px"></el-table-column>
      <el-table-column prop="beginTime" label="回滚开始时间" min-width="170">
        <template slot-scope="scope">{{translateTime(scope.row.beginTime)}}</template>
      </el-table-column>
      <el-table-column prop="createByName" label="发布人" min-width="140px"></el-table-column>
      <el-table-column prop="createTime" label="发布时间" min-width="170">
        <template slot-scope="scope">{{translateTime(scope.row.createTime)}}</template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="120">
        <template slot-scope="scope">
          <!-- <el-button type="primary" size="mini" v-prevent="2000" @click.native="edit(scope.$index,scope.row)">修改</el-button> -->
          <el-button
            type="primary"
            size="mini"
            :id="$route.name+'-'+'detail'+scope.$index"
            @click="detail(scope.row, 'rollbackSetDetail')"
            v-has="'rollbackSet-detail'"
          >查看</el-button>
          <el-button
            type
            size="mini"
            :id="$route.name+'-'+'delete'+scope.$index"
            @click="toDelete(scope.row)"
            v-has="'rollbackSet-delete'"
          >删除</el-button>
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
        {
          name: "新建回滚",
          type: "primary",
          icon: "plus",
          permission: "rollbackSet-add"
        } // type为按钮的五种颜色， icon为具体的图标
      ],
      tableData: [],
      multipleSelection: [],
      searchOptions: [
        { title: "回滚名称", type: "input", prop: "name", value: "" },
        { title: "发布人", type: "select", prop: "createByName", options: [], value: "" },
        { title: "创建时间", type: "datepicker-range", prop: "changePlanTime", value: "", options: ["start", "end"] }
      ],
      total: 0,
      searchParams: {},
      params: { page: 1, pageSize: 20 },
      insData: []
    };
  },
  created() {
    this.queryRollbackList();
    this.getInsData();
    this.queryRollbackUser();
  },
  mounted() {},
  methods: {
    // 获取机构数据
    getInsData() {
      const self = this;
      const data = {};
      (async data => {
        let res = await self.$api.upgradeIns({ data });
        if (res && res.code == 0) {
          // console.log("res", res.data);
          self.insData = res.data;
        } else {
          // self.$message.warning(res.msg)
        }
      })(data);
    },
    getInsArray(val) {
      let arr = val.split(",");
      // console.log("arr是",arr)
      let textArray = [];
      arr.forEach(item => {
        let array = this.$formMethods.getInsArray(
          item,
          "id",
          this.insData,
          "text"
        );
        // let str = array&&array.reverse().join('/')
        let str = array && array[0];
        // console.log( "str",str)
        textArray.push(str);
      });
      return textArray;
    },
    //查询发布人
    async queryRollbackUser() {
      let res = await this.$api.queryRollbackUser();
      if (res && res.code === 0) {
        this.searchOptions[1].options = res.data.map(item => {
          return { value: item.createByName };
        });
        console.log(res);
      }
    },
    translateTime(val) {
      return moment(val).format("YYYY-MM-DD HH:mm:ss");
    },
    translateTargetType(val) {
      let options = { 0: "机构", 1: "渠道", 2: "设备" };
      return options[val];
    },
    translateStatus(val) {
      let options = {
        0: "未开始",
        1: "进行中",
        2: "成功",
        3: "失败",
        4: "审核中"
      };
      return options[val];
    },
    async queryRollbackList() {
      //分页列表
      const res = await this.$api.queryRollbackList({
        data: {
          ...this.params,
          param: this.searchParams
        }
      });
      console.log("分页列表数据", res);
      if (res && res.code === 0) {
        let options = {
          0: "未开始",
          1: "进行中",
          2: "成功",
          3: "失败",
          4: "无需回滚"
        };
        res.data.records.forEach(item => {
          item.strStatus = options[item.status];
        });
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
        path: "./rollbackSetAdd",
        query: { title: "新建回滚", type: 0 }
      });
    },
    // edit(val, obj) {
    //   console.log("obj是", obj);
    //   this.$router.push({
    //     path: "./rollbackSetAdd",
    //     query: { title: "编辑回滚信息", ifo: obj }
    //   });
    // },
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
      this.queryRollbackList();
    },
    handleSizeChange(size) {
      // console.log(`每页 ${val} 条`);
      this.params.pageSize = size;
      this.queryRollbackList();
    },
    handleCurrentChange(val) {
      this.params.page = val;
      this.queryRollbackList();
    },
    toDelete(val) {
      //删除
      let id = val.id;
      console.log("id是", id);
      let ifo;
      if (val) {
        ifo = "此操作会删除该项信息，请确认是否要删除？";
      }
      this.$confirm(ifo, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          console.log("id是", id);
          let reslt = await this.$api.rollbackDelete({ data: id });
          console.log("删除", reslt);
          if (reslt.code === 0) {
            // let data1 = this.data;
            // this.dictDataPage(data1);
            this.queryRollbackList();
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "删除失败"
          });
        });
    }
  },
  computed: {},
  components: {}
};
</script>


<style lang="less" scoped>
</style>
