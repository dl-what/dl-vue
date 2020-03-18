<template>
  <div class="vlt-card">
    <div class="questionStatistical">
      <search-bar @search="search" :options="options" :total="num" labelWidth="6em"></search-bar>
      <el-table :data="accountList" border style="width: 100%;">
        <el-table-column type="index" label="序号" width="60" fixed>
          <template slot-scope="scope">{{pageSize*(page-1)+(scope.$index+1)}}</template>
        </el-table-column>
        <el-table-column prop="questionnaireCode" label="问卷编号" min-width="120"></el-table-column>
        <el-table-column prop="questionnaireName" label="问卷名称" min-width="180"></el-table-column>
        <el-table-column prop="gameName" label="调查对象" width="140"></el-table-column>
        <el-table-column prop="surveyStatus" label="调查状态" min-width="140">
          <template slot-scope="scope">
            <span
              class="icon-circle"
              :class="{
              blue:scope.row.surveyStatus=='1',
              green:scope.row.surveyStatus=='2',
              grey:scope.row.surveyStatus=='4',
              yellow:scope.row.surveyStatus=='5',
              red:scope.row.surveyStatus=='3',
              }"
            >{{scope.row.strSurveyStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="recoveryCount" label="回收数量(张)" align="center" min-width="120"></el-table-column>
        <el-table-column prop="sendCount" label="发送数量(张)" align="center" min-width="120"></el-table-column>
        <el-table-column prop="recoveryRate" label="回收率" align="center" min-width="120"></el-table-column>
        <el-table-column prop="userScope" label="生效时间" min-width="300"></el-table-column>
        <el-table-column label="操作" align="center" fixed="right" min-width="120">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="Detail(scope.row)"
              v-has="'questionnairStatistical-detail'"
              :id="$route.name + '-' + 'detail' + scope.$index"
            >查看</el-button>
            <el-button
              type="primary"
              size="mini"
              @click="splice(scope.row)"
              v-if="scope.row.surveyStatus =='未开始'"
              v-has="'questionnairStatistical-delete'"
              :id="$route.name + '-' + 'delete' + scope.$index"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <table-paging
        :current-page="page"
        :page-size="pageSize"
        :total="num"
        @handleSizeChange="pageSizeChange"
        @handleCurrentChange="pageCurrentChange"
      ></table-paging>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "questionStatistical",
  data() {
    return {
      num: 0,
      page: 0,
      pageSize: 20,
      current: 0,
      searchForm: {},
      accountList: [],
      options: [
        {
          title: "问卷名称",
          type: "input",
          prop: "questionnaireName",
          value: ""
        },
        {
          title: "调查对象",
          type: "select",
          prop: "gameId",
          value: "",
          placeholder: "请输入",
          options: []
        },
        {
          type: "datepicker-range",
          prop: "takeEffectTime",
          value: "",
          title: "生效时间",
          placeholder: ["开始时间", "结束时间"]
        },
        {
          title: "调查状态",
          type: "select",
          prop: "surveyStatus",
          value: "",
          options: [
            { label: "未开始", value: 1 },
            { label: "进行中", value: 2 },
            { label: "已过期", value: 3 }
          ]
        }
      ]
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init(val) {
      let data = {
        page: val || 1,
        pageSize: this.pageSize,
        param: {
          ...this.searchForm
        }
      };
      console.log(data);
      let result = await this.$api.questionnairAnalysis({ data });
      if (result && result.code === 0) {
        result.data.records &&
          result.data.records.forEach(item => {
            if (item.surveyStatus === 1) {
              item.strSurveyStatus = "未开始";
            } else if (item.surveyStatus === 2) {
              item.strSurveyStatus = "进行中";
            } else {
              item.strSurveyStatus = "已过期";
            }
            item.recoveryRate =
              this.$common.thousandMark(item.recoveryRate) + "%";
            // item.recoveryRate = item.recoveryRate
            //   ? this.$common.thousandMark(item.recoveryRate)
            //   : "0.00";
          });

        this.accountList = result.data.records;
        this.accountList.forEach(i => {
          i.userScope = i.startTime + "~" + i.endTime;
        });
        this.num = result.data.total;
        this.page = result.data.current;
        console.log(result);
        //搜索对象调查下拉数据
        let res = await this.$api.queryRespondent();
        console.log(res);
        let resul = res.data.map(item => {
          return {
            value: item.id,
            label: item.gameName
          };
        });
        this.options[1].options = resul;
      }
    },
    Detail(row) {
      this.$router.push({
        name: "questionnairStatisticalDetail",
        query: { id: row.questionnaireId }
      });
    },
    //搜索框
    search(val) {
      if (val.takeEffectTime && val.takeEffectTime.length > 0) {
        val.startTime = this.$moment(val.takeEffectTime[0]).format(
          "YYYY-MM-DD"
        );
        val.endTime = this.$moment(val.takeEffectTime[1]).format("YYYY-MM-DD");
        delete val.takeEffectTime;
      }

      this.searchForm = {
        ...val
      };

      this.init();
      console.log(this.searchForm);
    },
    splice(row) {
      this.$confirm("确定删除吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let id = row.questionnaireId;
          // console.log(row);
          let result = await this.$api.spliceQuestionnairAnalysis({
            message: "删除成功",
            data: id
          });
          this.init();
        })
        .catch(() => {});
    },
    pageSizeChange(size) {
      console.log(size);
      this.pageSize = size;
      this.init();
    },
    pageCurrentChange(val) {
      console.log(val);
      this.page = val;
      this.init(val);
    }
  }
};
</script>

<style lang="less" scoped>
</style>
