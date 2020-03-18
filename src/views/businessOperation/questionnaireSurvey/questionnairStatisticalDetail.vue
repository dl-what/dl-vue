<template>
  <div class="vlt-card">
    <div class="lotteryDetail">
      <panel title="基础信息" style="margin-bottom:20px" :show="true">
        <base-info :infoList="basicInformation"></base-info>
      </panel>
      <panel title="统计分析" style="margin-bottom:20px" :show="true">
        <el-tabs v-model="activeName" @tab-click="handleClick" style="margin-left:20px">
          <el-tab-pane label="柱状图" name="first">
            <div v-if="'first'===activeName" style="display:flex; flex-wrap:wrap">
              <div class="box" v-for="(item,index) in list" :key="index">
                <div class="title">
                  <div>{{index+1}}.{{item.subject}}</div>
                  <div>(答题人数:{{item.answerNumber}})</div>
                </div>
                <div class="quest-ask-list">
                  <div class="quest-ask-list-title">问题选项:</div>
                  <div class="quest-ask-list-content">
                    <p v-for="(i,index) in item.optionsList" :key="index">{{i.optionsContent}}、{{i.description}}</p>
                  </div>
                </div>

                <chart
                  v-if="'first'===activeName"
                  style="width:100%;height:200px;"
                  :options="item.num"
                ></chart>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="饼状图" name="second">
            <div v-if="'second'===activeName" style="display:flex; flex-wrap:wrap">
              <div class="box" v-for="(item,index ) in list" :key="index">
                <div class="title">
                  <div>{{index+1}}.{{item.subject}}</div>
                  <div>(答题人数:{{item.answerNumber}})</div>
                </div>
                <div  class="quest-ask-list">
                  <div class="quest-ask-list-title">问题选项:</div>
                  <div class="quest-ask-list-content" >
                    <p v-for="(i,index) in item.optionsList" :key="index">{{i.optionsContent}}、{{i.description}}</p>
                  </div>
                </div>
                <charts
                  v-if="'second'===activeName"
                  style="width:100%;height:300px;"
                  :options="item.num"
                ></charts>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </panel>
    </div>
  </div>
</template>

<script type="text/javascript">
import charts from "./charts";
import chart from "./chart";
export default {
  name: "",
  components: {
    charts,
    chart
  },
  data() {
    return {
      activeName: "first",
      list: [],
      lists: [],
      answerTotal: [],
      SubjectOptions: [],
      total: [],
      basicInformation: [
        { title: "问卷编号", value: "", prop: "questionnaireCode" },
        { title: "问卷名称", value: "", prop: "questionnaireName" },
        { title: "调查对象", value: "", prop: "gameName" },
        { title: "生效时间", value: "", prop: "userScope" },
        { title: "调查状态", value: "", prop: "surveyStatus" },
        { title: "发出问卷", value: "", prop: "sendCount" },
        { title: "回收问卷", value: "", prop: "recoveryCount" },
        { title: "问卷说明", value: "", prop: "questionnaireDesc" }
      ]
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      let id = this.$route.query.id;
      let result = await this.$api.questionnairAnalysisDetail({ data: id });
      let object = result.data.questionnaireSurvey;
      //基础信息
      this.basicInformation.forEach(item => {
        item.value = object[item.prop];
        if (item.prop === "userScope") {
          item.value = object.startTime + "~" + object.endTime;
        }
        if (item.prop === "surveyStatus") {
          if (item.value === 1) {
            item.value = "未开始";
          } else if (item.value === 2) {
            item.value = "进行中";
          } else {
            item.value = "已过期";
          }
        }
      });
      this.list = JSON.parse(
        JSON.stringify(result.data.questionnaireDepotList)
      );

      //问卷题目

      let arr = result.data.questionnaireDepotList.map(item => {
        //console.log(item);
        return item.optionsList;
      });
      console.log(arr);
      let arr2 = [];
      let arr4 = [];
      arr.forEach(item => {
        arr2 = item.map(i => {
          return { a: i.optionCount, b: i.optionsContent };
        });
        arr4.push(arr2);
      });
      let a,
        b,
        c = [];
      arr4.forEach(item => {
        a = item.map(i => i.a);
        b = item.map(i => i.b);
        c.push([a, b]);
      });
      this.list.forEach((item, index) => {
        c.forEach((i, ix) => {
          console.log(i);
          if (index === ix) {
            item.num = i;
          }
        });
      });
      console.log(result);
      console.log(this.list);
    },
    handleClick(tab, event) {
      console.log(tab, event);
    }
  }
};
</script>

<style lang="less" scoped>
.box {
  border: 1px solid #e1e1e1;
  width: 40%;
  margin: 20px 8% 40px 20px;
  padding: 20px;
  &>div {
    width: 100%;
  }
  & > .title {
    width: 100%;
    display: flex;
    justify-content: space-between;
    &>div {
      line-height: 1.4;
    }
    &>div:first-child {
      flex: 1;
    }
    &>div:last-child {
      width: 20%;
      text-align: right;
    }
  }
}
.quest-ask-list {
  width: 100%;
  margin: 10px 0 20px;
  .quest-ask-list-title {
    display: block;
  }
  .quest-ask-list-content {
    margin-top: 10px;
     p {
       display: block;
       vertical-align: top;
       margin-right: 10px;
       line-height: 1.4;
     }
  }
}
</style>
