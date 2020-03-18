<!-- 渠道终端管理 - 报表统计 -->
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

import reportEquipmentFailure from "@/views/businessManage/channelTerminalManagement/reportStatistics/equipmentFailure";
import deviceLoss from "@/views/businessManage/channelTerminalManagement/reportStatistics/deviceLoss";
import accessoryLoss from "@/views/businessManage/channelTerminalManagement/reportStatistics/accessoryLoss";
export default {
  name: "reportStatistics",
  data() {
    return {
      menuData: {
        id: 0,
        title: '报表统计',
        icon: '',
        list: [{
          id: 0,
          name: '设备故障报表',
          active: true,
          url: reportEquipmentFailure,
        },{
          id: 1,
          name: '设备管理损耗报表',
          active: false,
          url: deviceLoss,
        },{
          id: 2,
          name: '配件损耗报表',
          active: false,
          url: accessoryLoss,
        }]
      }
    };
    
  },
  components: {
    "terminal-sideMenu": terminalSideMenu
  },
  watch: {},
  created () {
    // this.$router.push({
    //   name: 'maintenanceEfficiency'
    // })
  },
  methods: {}
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
