<template>
  <div class="notice-bar">
    <div
      class="bar-bd"
      ref="bar"
      @mousemove="mousemove($event)"
    >
      <ul class="notice-list">
        <li
          class="notice-item"
          v-for="(group, i) in noticeList"
          :style="{width: itemWidth}"
          :key="i"
          @click="addNotice($event, group)"
          @mouseenter="mouseenter(group)"
          @mouseleave="mouseleave"
        >
          <div class="notice-box"
            :style="item.style"
            v-for="(item, index) in group.list"
            :key="index"
            :class="{insert: !item.id || item.noticeId === noticeId}"
            @click.stop="noticeClick(item, index)"
          >
          </div>
        </li>
      </ul>
      <div class="time-list">
        <span
          class="time-item"
          v-for="(time, i) in timeRangeList"
          :key="i"
          :style="{left: 100 / range * i + '%'}"
        >{{time}}</span>
      </div>
      <div class="toolTip" :style="{left: toolTipLeft + 'px'}" v-show="showToolTip">
        该时段剩余时间
        <em>{{overageMunites}}</em>分钟
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "noticeBar",
  props: {
    // 时间段
    timeRange: {
      type: Array,
      default() {
        return ["10:00", "22:00"];
      }
    },
    // 编排列表
    list: {
      type: Array,
      default() {
        return [];
      }
    },
    // 编辑公告详情id
    noticeId: {
      default: ""
    },
    // 公告插入时长
    duration: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      _list: [],
      showToolTip: false,
      toolTipLeft: 0,
      overageMunites: 60, // 时段剩余时间
      // 时间段公告列表
      noticeList: [],
    };
  },
  watch: {
    list(list) {
      this._list = JSON.parse(JSON.stringify(list));
      this.init();
      
    }
  },
  computed: {
    itemWidth() {
      return 100 / this.range + "%";
    },
    range() {
      return parseInt(this.timeRange[1]) - parseInt(this.timeRange[0]);
    },
    timeRangeList() {
      const hms = this.timeRange[0].split(":");
      const startTime = parseInt(this.timeRange[0]);
      const endTime = parseInt(this.timeRange[1]);
      const range = endTime - startTime;
      const result = [];
      for (let i = 0; i <= range; i++) {
        result.push(startTime + i + ":" + hms[1]);
      }
      return result;
    },
    // 新插入的公告列表
    insertNoticeList() {
      const noticeList = this.noticeList.map(item => item.list);
      const concatList = [].concat(...noticeList);
      return concatList.filter(item => !item.id || (item.noticeId && item.noticeId === this.noticeId));
    },
  },
  created() {
    this._list = JSON.parse(JSON.stringify(this.list));
    this.init();
  },
  mounted() {
    
  },
  methods: {
    // 初始化
    init() {
      // 按时段初始化timeRangeList
      this.timeRangeList.forEach((item, i) => {
        const endTime = this.timeRangeList[i + 1];
        if (endTime) {
          this.$set(this.noticeList, i, {
            list: [],
            noticeStartTime: item,
            noticeEndTime: endTime
          })
        }
      })
      // 合并noticeProgramList
      let noticeProgramLists = [];
      this._list.forEach(item => {
        const childs = item.noticeProgramList;
        if (childs && childs.length) {
          noticeProgramLists = noticeProgramLists.concat(childs);
        }
      });
      this.noticeList.forEach((item, i) => {
        noticeProgramLists.forEach(_item => {
          if (_item.noticeStartTime && _item.noticeEndTime) {
            if (
              this.HMRransH(_item.noticeStartTime) >= this.HMRransH(item.noticeStartTime)
              && this.HMRransH(_item.noticeEndTime) <= this.HMRransH(item.noticeEndTime)
            ) {
              item.list.push(_item);
            }
          }
        })
      })
      this.$nextTick(() => {
        this.composing(this.noticeList);
      });
    },
    // 设置公告属性
    setNoticeProp(item) {
      const { noticeStartTime, noticeEndTime } = item;
      // 时长(分钟)
      const duration = moment(noticeEndTime, "hh:mm").diff(
        moment(noticeStartTime, "hh:mm"),
        "minute"
      );
      this.$set(item, "duration", duration);
      this.$set(item, "style", {
        width: (duration / 60) * 100 + "%",
        left: (this.getMM(item.noticeStartTime) / 60) * 100 + "%",
      });
    },
    // 提取分钟
    getMM(HHMM) {
      const HHMMs = HHMM.split(':');
      return HHMMs[HHMMs.length - 1];
    },
    // 时分转小时
    HMRransH(HHMM) {
      const HMs = HHMM.split(":");
      return parseInt(HHMM) + HMs[1] / 60;
    },
    // 分钟转换时分
    muniteTransHM(munites) {
      const startMunites = this.HMRransH(this.timeRange[0]) * 60;
      const sumMunites = startMunites + munites;
      let MM = sumMunites % 60 < 10 ? "0" + (sumMunites % 60) : sumMunites % 60;
      return Math.floor(sumMunites / 60) + ":" + MM;
    },
    // 排版
    composing(noticeList) {
      // 设置样式
      noticeList.forEach(item => {
        const child = item.list;
        if (child && child.length) {
          child.forEach(childItem => {
            this.setNoticeProp(childItem);
          })
        }
      });
    },
    noticeClick(item, index) {
      if (item.noticeId != this.noticeId && item.noticeId) {
        // 返回该时间段公告data
        this.$emit("noticeClick", this.noticeGroup);
        return;
      }
      if ( !item.id || (item.noticeId && item.noticeId === this.noticeId)) {
        this.noticeGroup.list.splice(index, 1);
        this.overageMunites += item.duration;
      }
    },
    addNotice(e, group) {
      if (
        e.target.className.indexOf("notice-box") < 0 
        && e.target.className.indexOf('insert') < 0
      ) {
        const offsetX = e.clientX - this.$refs.bar.getBoundingClientRect().left;
        let offsetMunite = offsetX / this.$refs.bar.offsetWidth * this.range * 60;
        // 边界取值
        offsetMunite = Math.max(offsetMunite, moment(group.noticeStartTime, "hh:mm").diff(
            moment(this.timeRange[0], "hh:mm"),
            "minute"
        ));

        const startMunites = [];
        const endMunites = [];
        let allTimes = [
          group.noticeStartTime, 
          group.noticeEndTime,
          ...group.list.map(item => item.noticeStartTime),
          ...group.list.map(item => item.noticeEndTime)
        ];
        
        allTimes.forEach((item, index) => {
          const transMunite = moment(item, "hh:mm").diff(
            moment(this.timeRange[0], "hh:mm"),
            "minute"
          );
          if (offsetMunite >= transMunite) {
            startMunites.push(transMunite);
          } else {
            endMunites.push(transMunite);
          }
        });
        this.insertStartMunite = Math.max.apply(null, startMunites);
        const gapMunites = Math.min.apply(null, endMunites) - this.insertStartMunite; // 计算空白区域时间间隙
        const diff = Math.min(this.overageMunites, this.duration, gapMunites);
        if (diff == 0) {
          return;
        }
        const noticeStartTime = this.muniteTransHM(this.insertStartMunite);
        // 禁止重复创建
        if (group.list.some((item => {
          return item && noticeStartTime === item.noticeStartTime;
        }))) {
          return;
        }
        const item = {
          noticeStartTime,
          noticeEndTime: this.muniteTransHM(this.insertStartMunite + diff)
        };
        this.setNoticeProp(item);
        group.list.push(item);
        this.overageMunites -= diff;
      }
    },
    // 鼠标移入容器
    mousemove(e) {
      const offsetX = e.clientX - this.$refs.bar.getBoundingClientRect().left;
      this.toolTipLeft = offsetX;
    },
    // 当前时段移入
    mouseenter(group) {
      if (this.showToolTip) {
        return;
      }
      this.showToolTip = true;
      this.noticeGroup = group;
      let timePool = [];
      for (let i = 0; i < 60; i++) {
        timePool.push(0);
      }
      // 当前时间段剩余时间
      group.list.forEach(item => {
        const duration = item.duration;
        if (duration) {
          const times = item.noticeStartTime.split(':');
          const mm = parseInt(times[times.length - 1]);
          for (let i = mm; i < (mm + duration); i++) {
            timePool[i] = 1;
          }
        }
      })
      this.overageMunites = timePool.filter(item => item === 0).length;
    },
    // 当前时段移出
    mouseleave() {
      this.showToolTip = false;
    }
  }
};
</script>

<style lang="less" scoped>
.notice-bar {
  .bar-bd {
    position: relative;
    border: 1px solid #dcdfe6;
    border-left: none;
    height: 42px;
    cursor: pointer;
  }
  .notice-list{
    display: flex;
    justify-content: flex-start;
  }
  .notice-item {
    position: relative;
    border-left: 1px solid #dcdfe6;
    height: 40px;
    overflow: hidden;
    box-sizing: border-box;
    .notice-box{
      width: 0;
      height: 40px;
      background-color: #67c23a;
      position: absolute;
      left: 0;
      top: 0;
      cursor: pointer;
      &.insert {
        background-color: #f56c6c;
      }
    }
  }
  .time-item {
    position: absolute;
    bottom: -20px;
    left: 0;
    transform: translateX(-50%) scale(0.85);
  }
  .toolTip {
    position: absolute;
    top: 50px;
    left: 0;
    text-align: center;
    padding: 7px 10px;
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    font-size: 12px;
    border-radius: 4px;
    transform: translateX(-50%);
    word-break: keep-all;
    &:before {
      content: "";
      border: 5px solid transparent;
      border-bottom: 5px solid rgba(0, 0, 0, 0.7);
      position: absolute;
      left: 50%;
      top: -10px;
      transform: translateX(-50%);
    }
    em {
      font-style: normal;
      color: #ff4444;
    }
  }
}
</style>
