<!-- 渠道终端管理 - 设备管理 -->
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
import equipmentList from "@/views/businessManage/channelTerminalManagement/equipment/equipmentList";
import accessoriesList from "@/views/businessManage/channelTerminalManagement/equipment/accessoriesList";

export default {
  name: "equipment",
  data() {
    return {
      menuData: {
        id: 0,
        title: '设备管理',
        icon: '',
        list: [{
          id: 0,
          name: '设备列表',
          active: true,
          url: equipmentList,
        },{
          id: 1,
          name: '配件列表',
          active: false,
          url: accessoriesList,
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
