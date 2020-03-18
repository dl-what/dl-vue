<template>
  <!-- 考核列表 -->
  <div class="vlt-card">
    <search-bar
      class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      :total="total"
      labelWidth="6em"
    ></search-bar>
    <el-table :data="tableData" border style="margin-top: 10px;">
      <el-table-column type="index" width="60px" label="序号">
        <template slot-scope="scope">{{pageSize*(page-1)+(scope.$index+1)}}</template>
      </el-table-column>
      <el-table-column prop="channelNo" label="渠道编号"></el-table-column>
      <el-table-column label="渠道类型">
        <template slot-scope="scope">
          <span>{{scope.row.channelType===0?"自营厅":"合作厅"}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="insName" label="所属机构" min-width="150"></el-table-column>
      <el-table-column prop="quality" label="定性得分"></el-table-column>
      <el-table-column prop="quantity" label="定量得分"></el-table-column>
      <el-table-column prop="totalScore" label="综合得分"></el-table-column>
      <el-table-column prop="dateTime" label="考核年月"></el-table-column>
      <el-table-column label="操作" align="center" min-width="140">
        <template slot-scope="scope">
          <el-button
            :id="$route.name + '-' + 'detail' + scope.$index"
            v-has="'assessmentList-detail'"
            type="primary"
            size="mini"
            @click="detail(scope.row.id)"
          >查看</el-button>
          <el-button
            :id="$route.name + '-' + 'edit' + scope.$index"
            v-has="'assessmentList-edit'"
            type
            size="mini"
            @click="interpose(scope.row)"
          >人工干预</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="定性考核-人工干预" :visible.sync="dialogTableVisible">
      <div v-if="interposeData.length" style="margin-bottom:10px">
        <el-button :id="$route.name + '-' + 'grade'" type="primary" size="medium" @click="grade">打分</el-button>
        <el-button
          :id="$route.name + '-' + 'saveScore'"
          v-if="isSave"
          type="primary"
          size="medium"
          @click="save"
        >保存</el-button>
      </div>

      <el-table :data="interposeData">
        <el-table-column label="序号" type="index" width="60px"></el-table-column>
        <el-table-column prop="targetName" label="指标名称"></el-table-column>
        <el-table-column prop="targetCategoryName" label="考核类别"></el-table-column>
        <el-table-column prop="examineCondition" label="考核条件"></el-table-column>
        <el-table-column prop="examineScore" label="考核得分">
          <template slot-scope="scope">
            <el-input
              maxlength="4"
              oninput="value=value.replace(/[^0-9]/g,'')"
              v-model.number="scope.row.examineScore"
              :disabled="scope.row.disabled"
            ></el-input>
          </template>
        </el-table-column>
      </el-table>
      <table-paging
        :current-page="dialogPage"
        :page-size="dialogPageSize"
        :total="dialogTotal"
        @handleSizeChange="dialogPageChange"
        @handleCurrentChange="dialogCurrentChange"
      ></table-paging>
    </el-dialog>

    <table-paging
      :current-page="page"
      :page-size="pageSize"
      :total="total"
      @handleSizeChange="pageSizeChange"
      @handleCurrentChange="pageCurrentChange"
    ></table-paging>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "assessmentList",
  data() {
    return {
      total: 0,
      page: 1,
      pageSize: 20,
      dialogTableVisible: false,
      dialogTotal: 0,
      dialogPage: 1,
      dialogPageSize: 20,
      param: {},
      searchOptions: [
        {
          title: "渠道编号",
          type: "select",
          prop: "channelNo",
          value: "",
          options: []
        },
        {
          title: "所属机构",
          type: "cascader",
          prop: "insId",
          value: "",
          options: [],
          setProps: {
            label: "text",
            value: "id",
            children: "children",
            checkStrictly: true
          }
        },
        {
          title: "考核年月",
          type: "month",
          prop: "examineTime",
          value: ""
        },
        {
          title: "渠道类型",
          type: "select",
          prop: "channelType",
          value: "",
          options: [
            { label: "合作厅", value: 1 },
            { label: "自营厅", value: 0 }
          ]
        }
      ],
      tableData: [],
      interposeData: [],
      isSave: false,
      examine: {}
    };
  },
  created() {
    this.init();
    this.getChannelInfoModifyList();
    this.getInsData();
  },
  methods: {
    async init(val) {
      let res = await this.$api.channelExamineList({
        data: {
          page: val || 1,
          pageSize: this.pageSize,
          param: {
            examineType: 0,
            ...this.param
          }
        }
      });
      if (res && res.code === 0) {
        res.data.records.forEach(item => {
          item.dateTime = item.examineYear + "-" + item.examineMonth;
        });
        this.page = res.data.current;
        this.total = res.data.total;
        this.tableData = res.data.records;
      }
      console.log("考核列表", res.data);
    },
    search(val) {
      // console.log(val);
      if (val.examineTime) {
        val.examineYear = this.$moment(val.examineTime).format("YYYY");
        val.examineMonth = this.$moment(val.examineTime).format("MM");
      }
      if (val.insId) {
        val.insId = val.insId.pop();
      }
      this.param = val;
      this.init();
    },
    //用户渠道数据
    async getChannelInfoModifyList() {
      let res = await this.$api.getChannelInfoModifyList({
        data: {
          insId: this.$storage.get("userInfo").insId
        }
      });
      if (res && res.code === 0) {
        this.searchOptions[0].options = res.data.map(item => {
          return { value: item.channelNo };
        });
      }
      // console.log(res);
    },
    //机构数据
    async getInsData() {
      const self = this;
      const data = {};
      let res = await self.$api.QueryUserAndInsTree({ data });
      if (res && res.code == 0) {
        let newData = res.data;
        self.$set(self.searchOptions[1], "options", newData);
      } else {
        // self.$message.warning(res.msg)
      }
    },

    //人工干预
    interpose(row) {
      this.isSave = false;
      this.dialogTableVisible = true;
      this.examine = {
        examineId: row.id,
        examineYear: row.examineYear,
        examineMonth: row.examineMonth
      };
      this.getExamineDetailList();
    },
    //考核指标列表
    async getExamineDetailList(val) {
      let res = await this.$api.channelExamineDetailList({
        data: {
          page: val || 1,
          pageSize: this.dialogPageSize,
          param: {
            examineType: 0,
            examineId: this.examine.examineId,
            targetType: 0
          }
        }
      });
      if (res && res.code === 0) {
        res.data.records.forEach(item => {
          item.disabled = true;
        });
        // this.dialogPage;
        this.dialogTotal = res.data.total;
        this.interposeData = res.data.records;
      }
      console.log("打分指标列表", this.interposeData);
    },

    //打分
    grade() {
      let isStatus = this.interposeData.every(item => {
        return item.status === 1;
      });
      console.log(isStatus);
      if (this.interposeData.length == 0 || isStatus) {
        this.$message.warning("当前无可打分指标");
      } else {
        this.isSave = true;
        this.interposeData.forEach(item => {
          if (item.status === 0) {
            item.disabled = false;
          } else {
            item.disabled = true;
          }
        });
      }
    },
    //保存
    save() {
      let arr = [];
      let flag;
      this.interposeData.forEach(item => {
        delete item.disabled;
        if (item.status === 0) {
          if (item.examineScore !== "") {
            flag = 1;
            arr.push(item);
          } else {
            this.$message.error("分值不能为空");
            return;
          }
        }
      });
      if (flag === 1) {
        let data = {
          ...this.examine,
          examineType: 0,
          examineDescList: arr
        };
        // console.log(data);
        (async data => {
          let res = await this.$api.channelExamineUpdate({
            message: "保存成功",
            data
          });
          if (res && res.code === 0) {
            this.dialogTableVisible = false;
            this.isSave = false;
            this.init();
          }
        })(data);
      }
    },

    detail(id) {
      this.$router.push({ path: "assessmentDetail", query: { id: id } });
    },
    pageSizeChange(size) {
      this.pageSize = size;
      this.init();
    },
    pageCurrentChange(current) {
      this.page = current;
      this.init(current);
    },

    dialogPageChange(size) {
      this.dialogPageSize = size;
      this.getExamineDetailList();
    },
    dialogCurrentChange(current) {
      this.dialogPage = current;
      this.getExamineDetailList(current);
    }
  }
};
</script>

<style lang="less" scoped>
</style>
