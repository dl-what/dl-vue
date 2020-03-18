<template>
  <div class="vlt-card">
    <div class="roleManageExamine">
      <panel title="角色信息" :show="true">
        <base-Info :infoList="roleManageExamineData"></base-Info>
      </panel>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "",
  data() {
    return {
      // 详情数据
      roleManageExamineData: [
        { title: "用户角色", value: "", prop: "roleName" },
        { title: "柜员机权限", value: "", prop: "roleTypes" },
        { title: "维护APP权限", value: "", prop: "appRoleTypes" },
        { title: "是否为负责人", value: "", prop: "isManager" },
        { title: "角色状态", value: "", prop: "status" },
        { title: "创建人", value: "", prop: "createName" },
        { title: "创建时间", value: "", prop: "createTime" },
        { title: "描述", value: "", prop: "remark" }
      ]
    };
  },
  async created() {
    let res = await this.$api.roleDetail({ data: this.$route.query.id });
    if (res && res.code === 0) {
      this.roleManageExamineData.forEach(item => {
        item.value = res.data[item.prop];
        if (item.prop == "status") {
          switch (item.value) {
            case "1":
              item.value = "启用中";
              break;
            case "2":
              item.value = "已冻结";
              break;
            case "3":
              item.value = "已注销";
              break;
          }
        }
        if (item.prop === "isManager") {
          item.value = item.value === 1 ? "是" : "否";
        }
        if (item.prop === "appRoleTypes") {
          item.value = res.data.appRoleTypes
            .map(val => {
              return val.menuName;
            })
            .join(",");
        }
      });
    }
  },
  methods: {}
};
</script>

<style lang="less" scoped>
</style>
