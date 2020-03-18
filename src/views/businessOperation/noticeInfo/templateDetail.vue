<template>
  <div class="vlt-card bulletinTemplate-detail">
    <panel :show="true" title="基本信息">
      <div class>
        <base-info :infoList="infoList"></base-info>
        <div class="template-content">
          <p>模板内容：</p>
          <span v-if="!richText" v-html="templateContent"></span>
          <div v-if="richText" v-html="richText"></div>
        </div>
      </div>
    </panel>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "",
  data() {
    return {
      infoList: [
        { title: "模板名称", value: "", prop: "templateName" },
        { title: "公告类型", value: "", prop: "noticeType" },
        { title: "内容形式", value: "", prop: "contentForm" },
        { title: "模板备注", value: "", prop: "remark" }
      ],
      templateContent: null,
      richText: null
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      const self = this;
      let data = this.$route.query.id;
      let res = await this.$api.noticeTemplateDetail({ data });
      // console.log(res.data);
      if (res && res.code === 0) {
        (function replaceMark(str) {
          let index = str.indexOf("\n");
          if (index > -1) {
            let f = str.substring(0, index);
            let s = str.substring(index + 1, str.length);
            str = f + "</br>" + s;
            return replaceMark(str);
          } else {
            self.templateContent = str;
          }
        })(res.data.noticeContent);
        // console.log(self.templateContent);
        if (res.data.channelType === 1) {
          res.data.contentForm = 5;
          this.richText = res.data.noticeContent;
        }
        if (res.data.runningTime) {
          this.infoList.splice(3, 0, {
            title: "播放时长",
            value: "",
            prop: "runningTime"
          });
        }
        this.infoList.forEach(item => {
          item.value = res.data[item.prop];
          if (item.prop === "noticeType") {
            item.value = this.noticeType(res.data[item.prop]);
          }
          if (item.prop === "contentForm") {
            item.value = this.contentType(res.data[item.prop]);
          }
          if (item.prop === "runningTime") {
            item.value = item.value + "分钟";
          }
        });
      }
    },
    noticeType(val) {
      let options = {
        1: "新游戏发行",
        2: "拉新提醒",
        3: "活动新建"
      };
      return options[val];
    },
    contentType(val) {
      let options = {
        1: "文字",
        2: "图片",
        3: "视频",
        4: "走马灯",
        5: "富文本"
      };
      return options[val];
    }
  }
};
</script>

<style lang="less" scoped>
@import "./less/index";
</style>
