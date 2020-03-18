<template>
  <div class="vlt-card">
    <el-container>
      <el-aside width="250px">
        <terminal-sideMenu></terminal-sideMenu>
      </el-aside>
      <el-main>
        <div class="main-body">
          <router-view></router-view>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script type="text/javascript">
import terminalSideMenu from "@/views/businessManage/channelTerminalManagement/components/terminalSideMenu";
export default {
  name: "channelTerminalManagement",
  data() {
    return {};
  },
  components: {
    "terminal-sideMenu": terminalSideMenu
  },
  methods: {}
};
</script>

<style lang="less" scoped>
</style>
