  <template>
  <div class="vlt-card plan" >
    <el-alert
      title="您暂无权限访问"
      type="warning"
      show-icon
      v-if="showWarning">
    </el-alert>
    <el-tabs tab-position="left" v-model="active" v-else>
      <el-tab-pane label="计划列表" name="1" v-if="showAll">
        <plan-list v-if="active=='1'" :insData="insData"></plan-list>
      </el-tab-pane>
      <el-tab-pane label="计划汇总（省）" name="2" v-if="showPro">
        <plan-province v-if="active=='2'" ></plan-province>
      </el-tab-pane>
      <el-tab-pane label="计划汇总（地市）" name="3" v-if="showCity">
        <plan-city v-if="active=='3'" :insData="insData"></plan-city>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/javascript">
import PlanList from "./developmentPlanList";
import PlanCity from "./developmentPlanCity";
import PlanProvince from "./developmentPlanProvince";
import { isArray } from "util";

export default {
  name: "",
  components: {
    PlanList,
    PlanCity,
    PlanProvince
  },
  data() {
    return {
      showWarning: false,
      active: "1",
      showAll: false,
      showPro: false,
      showCity: false,
      insData: {
        insId: '',
        type: 0
      }
    };
  },
  created() {
    this.getUserInsInfoList();
  },
  methods: {
    getUserInsInfoList() {
      const _this = this;
      (async data => {
        let res = await _this.$api.getUserInsInfoList({});
        // 返回的data 有0 时 表示有计划列表的权限 那么计划列表的tab显示，反之隐藏，
        // 同理 有一级的时候 则显示省级的数据，市级亦是如此
        if (res.data) {
          this.insData = res.data;
          console.log('insData ... ',this.insData.type,  this.insData);
          if (this.insData.type == 0) { // 如果是 0的话 中福彩 显示省级
            _this.active = "2";
            _this.showPro = true;
            _this.insData.type = 0;
          } else if (this.insData.type == 1) { // 如果是1  省级 显示 总 市
            _this.active = "1";
            _this.showPro = false;
            _this.showAll = true;
            _this.showCity = true;
            // console.log('arr----', res.data[arr[0]]);
            // res.data[arr[0]].forEach(item => {
            //   let key = Object.keys(item)
            //   _this.insData.insId = key
            // });
            _this.insData.type = 1;
          } else if (this.insData.type == 2) { // 如果是2 市级 显示总
            _this.active = "1";
            _this.showPro = false;
            _this.showAll = true;
            _this.showCity = false;
            _this.insData.type = 2;
          } else {
            _this.showWarning = true;
            console.log('暂无权限');
          }
        }
      })();
    },
    getStoreList(row) {
      const self = this;
      const data = {
        orderId: row.orderId
      };
      (async data => {
        let res = await self.$api.getStoreList({ data });
        console.log("return data", data);
        if (res && res.code == 0) {
          self.$message.success("注销成功");
          row.orderStatus = 6;
          self.getLotteryList(self.param);
        } else {
          // self.$message.warning(res.msg)
        }
      })(data);
    }
  }
};
</script>

<style lang="less">
.plan .el-tabs__nav-scroll    {
  min-height: 700px;
}
</style>
