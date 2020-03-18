<template>
  <!-- 考核项设置 -->
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
      <el-table-column label="序号" fixed type="index" width="55"></el-table-column>
      <el-table-column prop="name" label="考核名称"></el-table-column>
      <el-table-column prop="appraisalType" label="考核类型">
        <template slot-scope="scope">{{translateAppraisalType(scope.row.appraisalType)}}</template>
      </el-table-column>
      <el-table-column prop="channelType" label="渠道类型">
        <template slot-scope="scope">{{translateChannelType(scope.row.channelType)}}</template>
      </el-table-column>
      <el-table-column prop="effectiveTime" label="生效年月" width="160">
        <template slot-scope="scope">{{translateTime(scope.row.effectiveTime)}}</template>
      </el-table-column>
      <el-table-column prop="failureTime" label="失效年月" width="160">
        <template slot-scope="scope">{{translateTime(scope.row.failureTime)}}</template>
      </el-table-column>
      <el-table-column label="状态" prop="status">
        <template slot-scope="scope">
          <el-switch 
            v-has="'assessItemSet-switch'"
            class="switchStyle"
            v-model="scope.row.status"
            :active-text="scope.row.status?'关':'开'"
            :active-value="0"
            :inactive-value="1"
            @change="switchChange(scope.row)"
            :id="$route.name+'-'+'switch'+scope.$index"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="190">
        <template slot-scope="scope">
          <el-button
            v-has="'assessItemSet-detail'"
            size="mini"
            type="primary"
            :id="$route.name+'-'+'detail'+scope.$index"
            @click="detail(scope.row, 'assessItemSetDetail')"
          >查看</el-button>
          <el-button
            v-has="'assessItemSet-edit'"
            type
            size="mini"
            :id="$route.name+'-'+'edit'+scope.$index"
            @click.native="edit(scope.row)"
            :disabled="scope.row.status?false:true"
          >编辑</el-button>
          <!-- v-if="scope.row.status==1" -->
          <el-button
            type="danger"
            size="mini"
            v-has="'assessItemSet-delete'"
            @click="toDelete(scope.row)"
            :disabled="scope.row.status?false:true"
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
          name: "新增考核",
          type: "primary",
          icon: "plus",
          permission: "assessItemSet-add"
        } // type为按钮的五种颜色， icon为具体的图标
      ],
      tableData: [],
      multipleSelection: [],
      searchOptions: [
        { title: "考核名称", type: "input", prop: "name", value: "" },
        // {
        //   type: "cascader",
        //   prop: "insId",
        //   value: "",
        //   title: "所属机构",
        //   options: [],
        //   setProps: {
        //     label: "text",
        //     value: "id",
        //     children: "children",
        //     checkStrictly: true
        //   }
        // },
        {
          title: "状态",
          prop: "status",
          type: "select",
          value: "",
          options: [
            {
              value: 0,
              label: "开启"
            },
            {
              value: 1,
              label: "关闭"
            }
          ]
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
    this.channelAppraisalPage();
  },
  mounted() {
    // this.getChangePlanList({});
  },
  methods: {
    translateTime(val) {
      return moment(val).format("YYYY-MM");
    },
    translateAppraisalType(val) {
      let options = { 0: "绩效考核", 1: "等级考核" };
      return options[val];
    },
    translateChannelType(val) {
      let options = { 0: "自营厅", 1: "合作厅" };
      return options[val];
    },
    async channelAppraisalPage() {
      //分页列表
      const res = await this.$api.channelAppraisalPage({
        data: {
          ...this.params,
          param: this.searchParams
        }
      });
      console.log("分页列表数据", res.data);
      if (res && res.code === 0) {
        this.tableData = res.data.records || [];

        res.data.records.forEach(item => {
          // console.log("item是",item.upgradeSoftList)
        });
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
      this.$router.push({ path: "./assessItemSetAdd", query: { status: 0 } });
    },
    edit(val) {
      //修改
      this.$router.push({
        path: "./assessItemSetEdit",
        query: { id: val.id, status: 1 }
      });
    },
    search(val) {
      //搜索

      this.searchParams = { ...val };
      this.params.page = 1;
      this.channelAppraisalPage();
    },
    async switchChange(val) {
      //更改状态
      let ifo;

      if (val.status) {
        ifo = "此操作会关闭该状态，请确认是否继续？";
      } else {
        ifo = "此操作会开启该状态，请确认是否继续？";
      }
      this.$confirm(ifo, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let data = {
            status: val.status,
            id: val.id
          };
          console.log(222, data);
          let reslt = await this.$api.channelAppraisalUpdateStatus({ data });
          console.log("更改角色状态", reslt);
          if (reslt && reslt.code === 0) {
            // this.channelAppraisalPage();
            val.status = data.status;
            this.$message({
              type: "success",
              message: "状态更改成功!"
            });
          } else {
            val.status = Number(!val.status);
          }
        })
        .catch(() => {
          // this.channelAppraisalPage();
          val.status = Number(!val.status);
          this.$message({
            type: "info",
            message: "更改状态失败"
          });
        });
    },
    handleSizeChange(size) {
      // console.log(`每页 ${val} 条`);
      this.params.pageSize = size;
      this.channelAppraisalPage();
    },
    handleCurrentChange(val) {
      this.params.page = val;
      this.channelAppraisalPage();
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
          let reslt = await this.$api.channelAppraisalDelete({ data: id });
          console.log("删除", reslt);
          if (reslt.code === 0) {
            // let data1 = this.data;
            // this.dictDataPage(data1);
            this.channelAppraisalPage();
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          }
        })
        .catch(() => {
          // this.channelAppraisalPage();
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
