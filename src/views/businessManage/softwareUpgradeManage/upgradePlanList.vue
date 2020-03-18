<template>
  <!-- 升级计划列表 -->
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
      <el-table-column prop="name" label="计划名称" min-width="200px"></el-table-column>
      <!-- <el-table-column prop="upgradeSoftList.name" label="软件名称"></el-table-column>
      <el-table-column prop="upgradeSoftList.versionCode" label="版本号"></el-table-column>-->
      <el-table-column prop="targetType" label="升级目标" min-width="120px">
        <template slot-scope="scope">{{translateTargetType(scope.row.targetType)}}</template>
      </el-table-column>
      <el-table-column prop="status" label="状态" min-width="120px">
        <template slot-scope="scope">
          <span
            class="icon-circle"
            :class="{
          blue:scope.row.status=='1',
          green:scope.row.status=='2',
          grey:scope.row.status=='0',
          yellow:scope.row.status=='4',
          red:scope.row.status=='3',
          }"
          >{{scope.row.strStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="softType" label="软件类型" min-width="130px">
        <template slot-scope="scope">{{translateSoftType(scope.row.softType)}}</template>
      </el-table-column>
      <el-table-column prop="beginTime" label="升级开始时间" min-width="170">
        <template slot-scope="scope">{{translateTime(scope.row.beginTime)}}</template>
      </el-table-column>
      <el-table-column prop="createByName" label="发布人" min-width="140px"></el-table-column>
      <el-table-column prop="createTime" label="发布时间" min-width="170">
        <template slot-scope="scope">{{translateTime(scope.row.createTime)}}</template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" min-width="120">
        <template slot-scope="scope">
          <!-- <el-button
            type="primary"
            size="mini"
            v-prevent="2000"  
            v-if="scope.row.status==0"
            @click.native="edit(scope.$index,scope.row)"
          >修改</el-button>-->
          <el-button
            type="primary"
            size="mini"
            :id="$route.name+'-'+'detail'+scope.$index"
            @click="detail(scope.row, 'upgradePlanListDetail')"
            v-has="'upgradePlanList-detail'"
          >查看</el-button>
          <el-button
            type
            size="mini"
            @click="toDelete(scope.row)"
            v-has="'upgradePlanList-delete'"
            :id="$route.name+'-'+'delete'+scope.$index"
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
    <!-- <el-dialog title="删除确认" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <span>请确认是否要删除该信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="de">确 定</el-button>
      </span>
    </el-dialog>-->
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
          name: "新建升级计划",
          type: "primary",
          icon: "plus",
          permission: "upgradePlanList-add"
        } // type为按钮的五种颜色， icon为具体的图标
      ],
      tableData: [],
      multipleSelection: [],
      searchOptions: [
        { title: "计划名称", type: "input", prop: "name", value: "" },
        {
          title: "发布人",
          type: "select",
          prop: "createByName",
          options: [],
          value: ""
        },
        {
          title: "创建时间",
          type: "datepicker-range",
          prop: "changePlanTime",
          value: "",
          options: ["start", "end"]
        }
      ],
      requestOptions: {},
      total: 0,
      searchParams: {},
      params: {
        page: 1,
        pageSize: 20
      }
    };
  },
  created() {
    this.queryUpgradeList();
    this.queryUpgradeUser();
  },

  methods: {
    //查询发布人
    async queryUpgradeUser() {
      let res = await this.$api.queryUpgradeUser();
      if (res && res.code === 0) {
        this.searchOptions[1].options = res.data.map(item => {
          return { value: item.createByName };
        });
      }
    },

    translateTime(val) {
      return moment(val).format("YYYY-MM-DD HH:mm:ss");
    },
    translateTargetType(val) {
      let options = { 0: "机构", 1: "渠道", 2: "设备" };
      return options[val];
    },
    translateSoftType(val) {
      let options = { 1: "投注终端", 2: "柜员机软件", 3: "维护APP" };
      return options[val];
    },
    translateStatus(val) {
      let options = {
        0: "未开始",
        1: "升级中",
        2: "升级成功",
        3: "升级失败",
        4: "已推送"
      };
      return options[val];
    },
    async queryUpgradeList() {
      //分页列表
      const res = await this.$api.queryUpgradeList({
        data: {
          ...this.params,
          param: this.searchParams
        }
      });
      console.log("分页列表数据", res.data);
      if (res && res.code === 0) {
        let options = {
          0: "未开始",
          1: "升级中",
          2: "升级成功",
          3: "升级失败",
          4: "已推送"
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
        path: "./upgradePlanListAdd",
        query: {
          type: 0
        }
      });
    },
    edit(val, obj) {
      //修改
      this.$router.push({
        path: "./upgradePlanListEdit",
        query: { ifo: obj }
      });
    },
    search(val) {
      //搜索
      console.log(val);
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
      this.queryUpgradeList();
    },
    handleSizeChange(size) {
      // console.log(`每页 ${val} 条`);
      this.params.pageSize = size;
      this.queryUpgradeList();
    },
    handleCurrentChange(val) {
      this.params.page = val;
      this.queryUpgradeList();
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
          let reslt = await this.$api.upgradeDelete({ data: id });
          console.log("删除", reslt);
          if (reslt.code === 0) {
            // let data1 = this.data;
            // this.dictDataPage(data1);
            this.queryUpgradeList();
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "warning",
            message: "已取消删除"
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
