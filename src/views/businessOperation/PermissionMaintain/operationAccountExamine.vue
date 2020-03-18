<template>
  <div class="vlt-card">
    <div class="operationAccountExamine">
      <panel title="账号信息" :show="true">
        <base-Info :infoList="operationAccountExamineData">
          <li class="info-item roleTypes">
            <span class="title">账户权限：</span>
            <p class="content">{{roleTypes}}</p>
          </li>
          <li class="info-item roleTypes">
            <span class="title">创建时间：</span>
            <p class="content">{{createTime}}</p>
          </li>
        </base-Info>
      </panel>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "",
  data() {
    return {
      // 详情类型
      operationAccountExamineData: [
        { title: "账户编号", value: "", prop: "accountCode" },
        { title: "年龄", value: "", prop: "age" },
        { title: "角色名称", value: "", prop: "roleName" },
        { title: "姓名", value: "", prop: "accountName" },
        { title: "账户状态", value: "", prop: "accountStatus" },
        { title: "手机号", value: "", prop: "phone" },
        { title: "身份证号", value: "", prop: "channelIdentity" },
        { title: "渠道编号", value: "", prop: "channelNo" },
        { title: "联系地址", value: "", prop: "address" },
        // { title: "账户权限", value: "", prop: "roleTypes" },
        // { title: "创建时间", value: "", prop: "createTime" },
      ],
      createTime: '',
      roleTypes: '',
    };
  },
  created() {
    this.getDetail();
  },
  mounted() {},
  components: {},
  methods: {
    async getDetail() {
      const self = this;
      let id = this.$route.query.id;
      let res = await this.$api.accountDetail({ data: id });
      if (res&&res.code === 0) {
        self.createTime = res.data.createTime;
        self.roleTypes = res.data.roleTypes.join(',');
        this.operationAccountExamineData.forEach((item)=>{
          item.value = res.data[item.prop];
          if(item.prop=='accountStatus') {
            if (res.data.accountStatus === 1) {
              item.value = "启用中";
            } else if (res.data.accountStatus === 2) {
              item.value = "禁用";
            } else {
              item.value = "注销";
            }
          }
        });
        console.log(res);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.operationAccountExamine{
  .roleTypes{
    display: flex;
    align-items: flex-start
}
}

</style>
