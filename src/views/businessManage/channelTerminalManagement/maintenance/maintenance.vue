<!-- 渠道终端管理 - 维修管理 -->
<template>
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

import repairWork from  "@/views/businessManage/channelTerminalManagement/maintenance/repairWork";
import replacementWork from  "@/views/businessManage/channelTerminalManagement/maintenance/replacementWork";

export default {
  name: "maintenance",
  data() {
    return {
      menuData: {
        id: 0,
        title: '维修管理',
        icon: '',
        list: [{
          id: 0,
          name: '维修工单',
          active: true,
          url: repairWork,
        },{
          id: 1,
          name: '置换工单',
          active: false,
          url: replacementWork,
        }]
      }
    };
    
  },
  components: {
    "terminal-sideMenu": terminalSideMenu
  },
  watch: {},
  beforeCreate () {},
  created () {},
  methods: {}
};
</script>

<style lang="less" scoped>
  .vlt-card {
    padding: 20px;
    .el-main {
          border-left: 1px solid #e6e6e6;
    }
  }
</style>