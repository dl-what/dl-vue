<template>
  <div class="vlt-card">
    <panel :show="true" title="培训计划详情" style="margin-top: 10px;">
      <base-info :infoList="infoList"></base-info>
    </panel>
    <panel :show="true" title="培训项目" style="margin-bottom: 15px;">
      <div class="wrapper">
        <el-table :data="trainItemList" border>
          <el-table-column label="序号" fixed type="index" width="60px"></el-table-column>
          <el-table-column label="项目标题" prop="title" min-width="100px"></el-table-column>
          <el-table-column label="项目级别" prop="rangeName" min-width="70px"></el-table-column>
          <el-table-column label="项目类型" prop="typeName" min-width="70px">
            <template slot-scope="scope">
              <span
                class="icon-tag"
                :class="{
              blue:scope.row.type=='2',
              green:scope.row.type=='1',
              grey:scope.row.type=='0',
              yellow:scope.row.type=='3',
              red:scope.row.type=='4',
              }"
              >{{scope.row.typeName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="培训课程" prop="courseName" min-width="100px"></el-table-column>
          <el-table-column label="是否关联考试" prop="isExamName" min-width="70px">
            <template slot-scope="scope">
              <span
                class="icon-circle"
                :class="{
                blue:scope.row.isExam=='4',
                green:scope.row.isExam=='0',
                grey:scope.row.isExam=='2',
                yellow:scope.row.isExam=='3',
                red:scope.row.isExam=='1',
                }"
              >{{scope.row.isExamName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="培训说明" prop="introduce" min-width="160px"></el-table-column>
        </el-table>
      </div>
    </panel>
  </div>
</template>

<script type="text/javascript">
import tabelList from "./tableList";
export default {
  name: "trainingPlanDetail",
  data() {
    return {
      trainItemList: [],
      infoList: [
        { title: "计划标题", value: "", prop: "title" },
        { title: "计划范围", value: "", prop: "rangeName" },
        { title: "培训对象", value: "", prop: "objects" },
        { title: "渠道等级", value: "", prop: "channelLevelName" },
        { title: "培训时间", value: "", prop: "time" },
        { title: "计划描述", value: "", prop: "description" }
      ]
    };
  },
  created() {
    this.trainingDetail();
  },

  methods: {
    async trainingDetail() {
      let res = await this.$api.trainOnlineDetails({
        data: this.$route.query.id
      });
      if (res && res.code === 0) {
        this.trainItemList = res.data.trainItemList;
        this.infoList.forEach(item => {
          item.value = res.data[item.prop];
          if (item.prop === "time") {
            item.value = res.data.startDate + "~" + res.data.expireDate;
          }
        });
        // console.log(res);
      }
    }
  },
  components: { tabelList }
};
</script>

<style lang="less" scoped>
</style>
