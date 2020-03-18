<!-- 首页 - 概况 - 查看消息 -->
<template>
  <div class="vlt-card">
    <panel title="消息详情" :show="true">
      <base-info :infoList="messageData"></base-info>
    </panel>
  </div>
</template>

<script>
import rules from "@/utils/rules.js";
export default {
  name: "sendMessage",
  data() {
    return {
      messageData: [
        { title: "标题", value: "", prop: "title" },
        { title: "收件人", value: "", prop: "receive" },
        { title: "发件人", value: "", prop: "sendUserName" },
        { title: "消息内容", value: "", prop: "content" },
        { title: "发送时间", value: "", prop: "createTime" },
      ],
    };
  },
  watch: {
    '$route.query.id'(id) {
      this.getMessageDetail(id);
    }
  },
  created() {
    let id = this.$route.query.id*1;
    this.getMessageDetail(id);
  },
  methods: {
    // 查看站内信详情
    getMessageDetail(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getMessageDetail({ data });
        if (res && res.code == 0) {
          self.messageData.forEach((item)=>{
            item.value = res.data[item.prop]
            if(item.prop=='createTime') {
              item.value = this.$moment(item.value).format('YYYY-MM-DD HH:mm:ss')
            }
          })
        }
      })(data);
    },
  }
};
</script>

<style lang="less" scoped>
</style>