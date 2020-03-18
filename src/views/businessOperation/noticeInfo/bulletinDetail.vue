<template>
  <div class="vlt-card bulletin-detail">
    <panel :show="true" title="基本信息">
      <base-info :infoList="infoList"></base-info>
    </panel>
  </div>
</template>

<script type="text/javascript">
import { type } from "os";
export default {
  name: "bullentinDetail",
  props: {
    id: { type: Number }
  },
  data() {
    return {
      infoList: [
        { title: "公告名称", value: "", prop: "noticeName" },
        { title: "公告模板", value: "", prop: "templateName" },
        { title: "公告类型", value: "", prop: "noticeType" },
        { title: '公告状态', value: "", prop: "publishStatus"},
        { title: "公告展示", value: "", prop: "noticeShow" },
        { title: "公告周期", value: "", prop: "periodTime" },
        { title: "管理层级", value: "", prop: "managerialType" },
        { title: "所属机构", value: "", prop: "noticeInsName" },
        { title: "公告对象", value: "", prop: "noticeChannel" },
        { title: "公告编排", value: "", prop: "noticeProgramList" }
      ]
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      let data = this.id || this.$route.query.id;
      let res = await this.$api.NoticeDetail({ data });
      if (res && res.code === 0) {
        console.log(res);
        this.infoList.forEach(item => {
          item.value = res.data[item.prop];
          if (res.data.noticeInsName && item.prop === "noticeInsName") {
            item.value = res.data.noticeInsName.slice(1);
          }
          if (res.data.noticeChannel && item.prop === "noticeChannel") {
            item.value = res.data.noticeChannel.slice(
              1,
              res.data.noticeChannel.length - 1
            );
          }
          if (item.prop === "managerialType") {
            item.value = this.changeType(res.data.managerialType, 1);
          }
          if (item.prop === "periodTime") {
            let periodStartTime = this.$moment(res.data.periodStartTime).format(
              "YYYY-MM-DD "
            );
            let periodEndTime = this.$moment(res.data.periodEndTime).format(
              "YYYY-MM-DD "
            );
            item.value = periodStartTime + "~" + periodEndTime;
          }
          if (item.prop === "noticeProgramList") {
            let arr = [];
            res.data.noticeProgramList.forEach(element => {
              if (element.noticeEndTime == null) {
                arr.push(element.noticeStartTime);
              } else {
                arr.push(element.noticeStartTime + "~" + element.noticeEndTime);
              }
              item.value = arr.join(" , ");
            });
          }
          if (item.prop === "templateName") {
            let arr = res.data.templateList.map(element => {
              return element.templateName;
            });
            item.value = arr.join(" , ");
          }
          if (item.prop === "noticeType") {
            item.value = res.data.noticeType === 1 ? "缺省" : "插播";
          }
          if (item.prop === "noticeShow") {
            item.value = this.changeType(res.data.noticeShow, 2);
          }
          let options = {
            1: "待公告",
            2: "已公告",
            3: "已停用",
            4: "已过期"
          };
          if(item.prop=='publishStatus'){
            item.value = options[res.data.publishStatus];
          }
        });
      }
    },
    changeType(val, type) {
      if (type === 1) {
        let options = {
          1: "全国",
          2: "省级",
          3: "地市",
          4: "大厅"
        };
        return options[val];
      } else {
        let options = {
          1: "主屏",
          2: "副屏",
          3: "柜员机"
        };
        return options[val];
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "./less/index";
</style>
