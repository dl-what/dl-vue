<!-- 首页 - 日期选项 -->
<template>
  <div class="module-calemdar">
    <div class="nav-wrap">
      <div class="nav-item" v-for="(item, index) in totalData" :key="index">
        <div class="nav-item-wrap vlt-box" @click="toPage(item.icon)">
          <div :class="`icon-wrap ${item.icon}`">
            <i :class="`iconfont icon-${item.icon}`"></i>
          </div>
          <div :class="`nav-content nav-content-${item.icon}`">
            <h2 class="title">
              <countTo :startVal="startVal" :endVal="item.count" :duration="1500"></countTo>
            </h2>
            <p class="text">{{item.name}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="overview-content">
      <div class="calemdar-select vlt-box">
        <div class="change-select">
          <el-date-picker
            size="medium"
            v-model="yearsValue"
            type="month"
            placeholder="选择年"
            @change="changeYearMonth"
            :clearable="false"
            :editable="false"
          ></el-date-picker>
          <el-button-group>
            <el-button @click="preMonth" size="medium" :id="$route.name + '-' + 'last'">上一月</el-button>
            <el-button @click="today" size="medium" :id="$route.name + '-' + 'today'">今天</el-button>
            <el-button @click="nextMonth" size="medium" :id="$route.name + '-' + 'next'">下一月</el-button>
          </el-button-group>
        </div>
        <el-calendar v-model="yearsValue" @change="changeCalendar" ref="selectItem">
          <template slot="dateCell" slot-scope="{date, data}">
            <p
              :class="{'is-selected': data.isSelected,'message':data.day==isMessage[data.day]}"
              @click="myTodo(data.day)"
            >{{ data.day.split('-').slice(2)[0]}}</p>
          </template>
        </el-calendar>
      </div>
      <div class="select-table vlt-box">
        <div class="container-message">
          <p class="title">
            <i class="el-icon-message-solid"></i>
            <span>站内消息</span>
            <el-link type="primary" :underline="false" @click="toLink">更多消息<i class="el-icon-d-arrow-right"></i></el-link>
          </p>
          <ul class="msg-list">
            <li v-for="item in messageData" :key="item.id" @click="toDetail(item)">
              <p>{{item.title}}</p>
              <p class="content">{{item.content}}</p>
              <span>{{item.createTime}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import countTo from "vue-count-to";

export default {
  name: "calendarSelect",
  components: {
    countTo
  },
  data() {
    return {
      startVal: 0,
      date: "2019-09-30 星期一",
      yearsValue: new Date().getTime(),
      messageData: [],
      icon: require("@/assets/img/u86.png"),
      params: {
        page: 1,
        pageSize: 5,
        param: {
          type: 1
        }
      },
      isMessage: {},
      totalData: [
        {
          name: "待审核",
          count: 0,
          icon: "todo"
        },
        {
          name: "已审核",
          count: 0,
          icon: "done"
        },
        {
          name: "已申请",
          count: 0,
          icon: "apply"
        },
        {
          name: "已知会",
          count: 0,
          icon: "know"
        }
      ],
      num: 0,
      beginDate: '',
      endDate: '',
    };
  },
  created() {
    let now = new Date(); //当前日期
    let nowMonth = now.getMonth(); //当前月
    let nowYear = now.getFullYear(); //当前年
    //本月的开始时间
    let beginDate = new Date(nowYear, nowMonth, 1);
    this.beginDate = this.$moment(beginDate).format("YYYY-MM-DD");
    //本月的结束时间
    let endDate = new Date(nowYear, nowMonth + 1, 0);
    this.endDate = this.$moment(endDate).format("YYYY-MM-DD");
    let param = {
      beginDate: this.beginDate,
      endDate: this.endDate
    };
    this.getBusinessTotal(param);
    this.getMessageList(this.params);
  },
  methods: {
    toPage(val) {
      let params = {
        date: this.beginDate,
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      if (val == "todo") {
        if(this.$route.name=='overview') {
          this.$router.push({ name: "myToDo", params });
        }else{
          this.$router.push({ name: "myToDos", params });
        }
      }
      if (val == "done") {
        if(this.$route.name=='overview') {
          this.$router.push({ name: "myDone", params });
        }else{
          this.$router.push({ name: "myDones", params });
        }
      }
      if (val == "apply") {
        if(this.$route.name=='overview') {
          this.$router.push({ name: "myApplication", params });
        }else{
          this.$router.push({ name: "myApplications", params });
        }
      }
      if (val == "know") {
        if(this.$route.name=='overview') {
          this.$router.push({ name: "myKnowledge", params });
        }else{
          this.$router.push({ name: "myKnowledges", params });
        }
      }
    },
    myTodo(val) {
      if(this.$route.name=='overview') {
        this.$router.push({ name: "myToDo", params: { date: val } });
      }else{
        this.$router.push({ name: "myToDos", params: { date: val } });
      }
    },
    // 首页概况数据
    getBusinessTotal(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getBusinessTotal({ data });
        if (res && res.code == 0) {
          console.log(self.totalData);
          self.$set(self.totalData[0], "count", res.data.todoCount);
          self.$set(self.totalData[1], "count", res.data.doneCount);
          self.$set(self.totalData[2], "count", res.data.applyCount);
          self.$set(self.totalData[3], "count", res.data.notifyCount);

          // self.numberGrow(self.$refs.todo);
          // self.numberGrow(self.$refs.done);
          // self.numberGrow(self.$refs.apply);
          // self.numberGrow(self.$refs.know);

          res.data.todoDateData.forEach(item => {
            self.$set(self.isMessage, item, item);
          });

          // this.$set(this.isMessage, '2019-11-11', '2019-11-11')
          console.log(res.data.todoDateData);
        }
      })(data);
    },
    today() {
      this.yearsValue = new Date();
    },
    preMonth() {
      this.yearsValue = new Date(
        new Date(this.yearsValue).getFullYear(),
        new Date(this.yearsValue).getMonth() - 1,
        1
      );
    },
    nextMonth() {
      this.yearsValue = new Date(
        new Date(this.yearsValue).getFullYear(),
        new Date(this.yearsValue).getMonth() + 1,
        1
      );
    },
    // 选择年份月
    changeYearMonth(val) {
      console.log(val);
    },
    // 站内信列表
    getMessageList(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getMessageList({ data });
        if (res && res.code == 0) {
          res.data.records.forEach(item => {
            item.createTime = this.$moment(item.createTime).format("YY-MM-DD");
          });
          self.messageData = res.data.records;
        }
      })(data);
    },
    changeDay(value) {},
    changeCalendar(value) {
      console.log(value);
    },
    toLink() {
      if(this.$route.name=='overview') {
        this.$router.push({ name: "messageList" });
      }else{
        this.$router.push({ name: "messageLists" });
      }
    },
    toDetail(val) {
      if(this.$route.name=='overview') {
        this.$router.push({ name: "messageDetail", query: { id: val.id } });
      }else{
        this.$router.push({ name: "messageDetails", query: { id: val.id } });
      }
    }
  }
};
</script>

<style lang="less">
.module-calemdar {
  padding: 0 16px 20px;
  .calemdar-select {
    border: 1px solid #ededed;
    padding: 0 10px 16px;
    flex: 3;
    .el-calendar__body {
      padding: 0;
    }
    .change-select {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
      .el-date-editor.el-input,
      .el-select {
        width: 120px;
        margin-right: 20px;
      }
      .select-month {
        position: relative;
        i.el-icon-date {
          position: absolute;
          left: 5px;
          z-index: 1;
          height: 100%;
          width: 25px;
          text-align: center;
          -webkit-transition: all 0.3s;
          transition: all 0.3s;
          line-height: 40px;
          color: #c0c4cc;
        }
        .el-input__inner {
          padding-left: 25px;
          text-align: center;
        }
      }
    }
    .el-calendar {
      .el-calendar__header {
        padding-bottom: 0;
        padding-top: 0;
      }
      .el-calendar__body table th {
        padding-left: 8px;
      }
      .el-calendar__title {
        display: none;
      }
      .el-calendar__button-group {
        .el-button-group {
          .el-button--plain {
            // &:nth-of-type(1),
            // &:nth-of-type(3) {
            //   display: none;
            // }
            display: none;
          }
        }
      }
      .el-calendar__body {
        .el-calendar-day {
          max-height: 60px;
          p {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
.select-table {
  flex: 4;
  margin-left: 2%;
}
.tips-item {
  height: 32px;
  line-height: 32px;
  background-color: rgba(230, 243, 252, 1);
  // border: 1px solid rgba(212, 240, 252, 1);
  font-size: 12px;
  color: #515a6e;
  // border-radius: 4px;
  padding: 0 10px;
  margin: 10px 0;
  em {
    color: #2d8cf0;
    font-style: normal;
    padding: 0 3px;
  }
  i {
    vertical-align: middle;
    line-height: 32px;
    color: #2d8cf0;
    padding-right: 5px;
    margin-right: 5px;
  }
  span {
    line-height: 32px;
  }
}
.container-message {
  padding: 0 16px 16px;
  border-radius: 4px;
  box-sizing: border-box;
  .title {
    position: relative;
    height: 50px;
    line-height: 50px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e8eaec;
    font-size: 1.2em;
    .title-icon {
      display: inline-block;
      vertical-align: middle;
      width: 24px;
      height: 24px;
    }
    span {
      display: inline-block;
      vertical-align: middle;
      margin-left: 5px;
    }
    .el-link {
      position: absolute;
      right: 0;
      line-height: 24px;
      font-size: 12px;
    }
  }
  .msg-list {
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      cursor: pointer;
      border-bottom: 1px dashed #ffa847;
      p {
        position: relative;
        color: #606266;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: keep-all;
        white-space: nowrap;
        width: 100px;
        &:nth-child(2) {
          width: 200px;
        }
      }
      span {
        color: #999;
      }
    }
  }
  .content {
    flex: 1;
    padding: 0 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.message {
  position: relative;
  &:before {
    position: absolute;
    top: 0;
    right: 0;
    display: block;
    content: "";
    width: 7px;
    height: 7px;
    background: #f56c6c;
    border-radius: 50%;
  }
}
.is-selected {
  color: #1989fa;
}
.nav-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
}
.nav-item {
  flex: 0 0 24%;
  margin-right: 1%;
  cursor: pointer;
  &-wrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 100px;
  }
  .icon-wrap {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 3px 0 0 3px;
    .iconfont {
      font-size: 42px;
    }
  }
  .nav-content {
    flex: 2;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    &-todo {
      .title {
        font-size: 30px;
        font-weight: 700;
        color: rgb(45, 140, 240);
      }
    }
    &-done {
      .title {
        font-size: 30px;
        font-weight: 700;
        color: rgb(100, 213, 114);
      }
    }
    &-apply {
      .title {
        font-size: 30px;
        font-weight: 700;
        color: rgb(255, 213, 114);
      }
    }
    &-know {
      .title {
        font-size: 30px;
        font-weight: 700;
        color: rgb(242, 94, 67);
      }
    }
    .text {
      font-size: 12px;
      font-weight: 500;
      color: #c8c8c8;
    }
  }
  .todo {
    background-color: rgb(45, 140, 240);
    color: white;
  }
  .done {
    background-color: rgb(100, 213, 114);
    color: white;
  }
  .apply {
    background-color: rgb(255, 213, 114);
    color: white;
  }
  .know {
    background-color: rgb(242, 94, 67);
    color: white;
  }
}
.nav-item:last-child {
  margin-right: 0;
}
.overview-content {
  display: flex;
  justify-content: space-between;
}
.el-icon-message-solid {
  font-size: 16px;
}
.number-grow-warp {
  transform: translateZ(0);
}
.number-grow {
  font-weight: bold;
  font-size: 36px;
  padding-bottom: 10px;
  @media (max-width: 1400px) {
    font-size: 32px;
  }
}
</style>