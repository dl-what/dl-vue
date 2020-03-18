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
import faultType from "@/views/businessManage/channelTerminalManagement/configurationManagement/faultType";

export default {
  name: "configurationManagement",
  data() {
    return {
      menuData: {
        id: 0,
        title: "配置管理",
        icon: "",
        list: [
          {
            id: 0,
            name: "故障类型",
            active: true,
            url: faultType
          }
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
