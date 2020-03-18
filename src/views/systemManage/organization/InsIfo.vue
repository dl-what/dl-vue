<template>
  <div class="vlt-card" style="padding:0">
    <div class="Lotteryinfo">
      <section class="comp-item">
        <panel title="机构信息" :show="true">
          <base-info :infoList="AgencyInformation"></base-info>
        </panel>
      </section>
    </div>
  </div>
</template>

<script type="text/javascript">
import { mapGetters } from "vuex";
import moment from "moment";
import rules from "@/utils/rules";
export default {
  name: "insFromtion",
  data() {
    return {
      AgencyInformation: [
        {
          title: "父机构",
          value: "",
          type: "input",
          prop: "parentInsName",
          disabled: true
        },
        { title: "区域名称", value: "", type: "input", prop: "regionName" },
        {
          title: "父机构编码",
          value: "",
          type: "input",
          prop: "parentInsCode"
        },
        { title: "区域编码", value: "", type: "input", prop: "regionCode" },
        { title: "机构名称", value: "", type: "input", prop: "insName" },
        { title: "机构状态", value: "", type: "switch", prop: "status" },
        { title: "机构编码", value: "", type: "input", prop: "insCode" },
        { title: "备注", value: "", type: "textarea", prop: "remark" },
        {
          title: "创建人",
          value: "",
          type: "input",
          prop: "createByName",
          disabled: true
        },
        {
          title: "创建时间",
          value: "",
          type: "input",
          prop: "createTime",
          disabled: true
        },
        {
          title: "修改人",
          value: "",
          type: "input",
          prop: "updateByName",
          disabled: true
        },
        {
          title: "修改时间",
          value: "",
          type: "input",
          prop: "updateTime",
          disabled: true
        }
      ],
      OrganizationChange: [
        {
          title: "机构名称",
          type: "input",
          prop: "insName",
          value: "",
          disabled: true
        },
        { title: "机构编码", type: "input", prop: "insCode", value: "" },
        { title: "备注", type: "textarea", prop: "remark", value: "" }
      ],
      InsTree: [],
      dialogFormVisible: false,
      parentId: -1,
      changeOrganizationParams: {},
      insIfo: {},
      insId: 0
    };
  },
  components: {},
  computed: {
    ...mapGetters(["insData"])
  },
  created() {
    (async () => {
      let reslt = await this.$api.QueryInsTree();
      if (reslt && reslt.code === 0) {
        this.InsTree = reslt.data;
      }
    })();
  },
  methods: {
    async changeInfo(val) {
      const self = this;
      this.insId = val;
      let reslt = await self.$api.QueryInsInfo({ data: val });
      if (reslt && reslt.code === 0) {
        self.AgencyInformation.forEach(item => {
          if (
            item.prop != "createTime" &&
            item.prop != "updateTime" &&
            item.prop != "status" &&
            item.prop != "regionName"
          ) {
            item.value = reslt.data[item.prop] || "";
          }
          if (
            (item.prop === "createTime" && reslt.data[item.prop] != null) ||
            (item.prop === "updateTime" && reslt.data[item.prop] != null)
          ) {
            item.value = moment(reslt.data[item.prop]).format(
              "YYYY-MM-DD HH:mm:ss"
            );
          } else if (item.prop === "status") {
            item.value = self.statusChange(reslt.data[item.prop]);
          } else if (item.prop === "regionName") {
            item.value = reslt.data.parentInsName;
          }
        });
        self.parentId = reslt.data.parentId;
        self.insIfo = reslt.data;
        self.$parent.$children[1].subsidiaryOrgan();
      }
    },

    open(val) {
      this.$alert(val, "温馨提示！", {
        confirmButtonText: "确定",
        callback: action => {
          close();
        }
      });
    },
    statusChange(val) {
      let options = {
        1: "启用",
        0: "冻结"
      };
      return options[val];
    }
  }
};
</script>

<style lang="less" scoped>
</style>
