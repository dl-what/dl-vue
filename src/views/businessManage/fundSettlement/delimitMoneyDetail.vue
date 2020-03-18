<template>
  <div class="vlt-card">
    <panel title="基金划拨详情" :show="true" style="margin-bottom: 15px;">
      <base-info :infoList="infoList"></base-info>
    </panel>
  </div>
</template>

<script type="text/javascript">

export default {
  name: "",
  data() {
    return {
      infoList: [
        { title: "游戏名称", value: "", prop: "gameName" },
        { title: "基金类型", value: "", prop: "fundTypeName" },
        { title: "划拨方式", value: "", prop: "type" },
        { title: "金额", value: "", prop: "transferAmount" },
        { title: "备注", value: "", prop: "transferReason" },
        { title: "创建人", value: "", prop: "createName" },
        { title: "创建时间", value: "", prop: "createTime" }
      ],
    }
  },
  created() {
    this.$route.params
  },
  methods: {
  },
}
</script>

<style lang="less" scoped>

</style>
