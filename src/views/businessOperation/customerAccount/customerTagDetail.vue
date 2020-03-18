<template>
  <div class="vlt-card info-panel">
    <section class="comp-item">
      <panel title="客户标签详情" :show="true">
        <base-info  :infoList="infoList"></base-info>
      </panel>
    </section>
  </div>
</template>

<script type="text/javascript">
import moment from 'moment';
export default {
  name: "infoDetail",
  data() {
    return {
      infoList: [
        { title: "标签编号", value: "", prop: "id" },
        { title: "标签名称", value: "", prop: "name" },
        { title: "标签类型", value: "", prop: "type" },
        { title: "内容描述", value: "", prop: "remark" },
        { title: "创建人", value: "", prop: "userName" },
        { title: "创建时间", value: "", prop: "createTime" },
        { title: "更新人", value: "", prop: "userName" },
        { title: "更新时间", value: "", prop: "updateTime" }
      ]
    };
  },
  components: {},
  created() {
    let id = this.$route.query.id;
    if (id) {
      this.id = id;
      this.initDetail(this.id)
    }
  },
  methods: {
    async initDetail(id) {
      const _this = this;
      let result = await this.$api.cusPageDetail({
        data: id
      });
      console.log(result);
      if (result.code === 0) {
        _this.infoList.forEach(item => {
          item.value = result.data[item.prop]
          if (item.prop == 'type') {
            item.value = _this.forMatType(result.data[item.prop]);
          }
          if (item.prop == 'createTime' && result.data[item.prop] != null) {
            item.value = moment(item.value).format('YYYY-MM-DD HH:mm:SS');
          }
          if (item.prop == 'updateTime' && result.data[item.prop] != null) {
            item.value =  moment(item.value).format('YYYY-MM-DD HH:mm:SS');
          }
        })
      }
    },
    forMatType(type) {
      switch (type) {
        case 0:
          return (type = "标签");
        case 1:
          return (type = "偏好");
      }
    }
  }
};
</script>

<style lang="less" scoped>
.tips-name {
  display: block;
  margin: 20px auto;
  font-size: 14px;
  color: #666;
  font-weight: 600;
}

</style>
<style lang="less">
  .info-panel .base-info .info-list .title {
  float: left;
  min-width: 5em;
}
</style>
