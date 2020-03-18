<template>
  <!-- 维护知识库 -->
  <div class="vlt-card vc-plr0">
    <el-container>
       <terminal-sideMenu :menuList="menuData">
          <template v-slot:tabContent="tabContent">
            <div :is="tabContent.item.url"></div>
          </template>
        </terminal-sideMenu>
    </el-container>
  </div>
</template>

<script type="text/javascript">
import terminalSideMenu from "@/views/businessManage/channelTerminalManagement/components/terminalSideMenu";
import knowledgeBase from "@/views/businessManage/channelTerminalManagement/knowledgeBase/knowledgeBase";
import baseReview from "@/views/businessManage/channelTerminalManagement/knowledgeBase/baseReview";

export default {
  name: "knowledgeBase",
  data() {
    return {
      menuData: {
        id: 0,
        title: "维护知识库",
        icon: "",
        list: [
          {
            id: 0,
            name: "维护知识库",
            active: true,
            url: knowledgeBase
          },
          {
            id: 1,
            name: "知识库审核",
            active: false,
            url: baseReview
          },
        ]
      }
    };
  },
  components: {
    "terminal-sideMenu": terminalSideMenu
  },
  watch: {},
  created() {
    // this.$router.push({
    //   name: 'maintenanceEfficiency'
    // })
  },
  methods: {
  }
};
</script>

<style lang="less" scoped>
.vlt-card {
  padding: 20px;
  .el-main {
    padding: 0;
    border-left: 1px solid #e6e6e6;
  }
}
</style>
