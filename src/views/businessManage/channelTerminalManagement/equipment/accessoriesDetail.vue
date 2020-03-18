<template>
  <div class="vlt-card equipment-info">
    <panel :show="true"  title="配件信息">
      <base-info :infoList="infoList"></base-info>
    </panel>
  </div>
</template>

<script type="text/javascript">
import rules from "@/utils/rules.js";
export default {
  name: "equipmentDetail",
  data() {
    return {
      params: {},
      infoList: [
        { title: "配件名称", value: "", prop: "deviceName" },
        { title: "配件型号", value: "", prop: "deviceModel" },
        { title: "配件序列号", value: "", prop: "serial" },
        { title: "所属仓库", value: "", prop: "nameX" },
        { title: "使用状态", value: "", prop: "useStatusName" },
        { title: "配件状态", value: "", prop: "statusName" },
        { title: "入库时间", value: "", prop: "warehouseEntryTime" }
      ]

    };
  },
  created() {
    let id = this.$route.query.id;
    if (id) {
      this.id = id;
      this.initDetail(this.id);
    }
  },
  components: {},
  methods: {
    async initDetail(id) {
      let data = {
        id: id
      };
      let result = await this.$api.equipmentInfoDetail({ data });
      console.log(result);
      if (result.code === 0) {
        this.infoList.forEach(item => {
          item.value = result.data[item.prop];
          if (item.prop == "usageStatus") {
            item.value = this.formatUseStatus(result.data[item.prop]);
          }
          if (item.prop == "spraresStatus") {
            item.value = this.forMatStatus(result.data[item.prop]);
          }
        });
      }
    },
    formatUseStatus(status) {
      switch (status) {
        case "0":
          return (status = "闲置中");
        case "1":
          return (status = "运行中");
      }
    },
    forMatStatus(status) {
      switch (status) {
        case "0":
          return (status = "正常");
        case "1":
          return (status = "已损坏");
        case "2":
          return (status = "故障");
      }
    }
  }
};
</script>

<style lang="less">
@import "./less/equiment.less";
</style>
