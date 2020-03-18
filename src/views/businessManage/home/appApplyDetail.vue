<template>
  <div>
    <app-device-detail v-if="type==1"></app-device-detail>
    <app-loss-detail v-if="type==2"></app-loss-detail>
    <app-card-detail v-if="type==3"></app-card-detail>
  </div>
</template>

<script type="text/javascript">
import appCardDetail from './appCardDetail';
import appDeviceDetail from './appDeviceDetail';
import appLossDetail from './appLossDetail';

export default {
  name: "",
  components: {
    appCardDetail,
    appDeviceDetail,
    appLossDetail
  },
  data() {
    return {

    }
  },
  created() {
    if(this.$route.query.id) { // 获取表单数据详情
      let data = this.$route.query.id;
      this.getTaskData(data);
    }
  },
  methods: {
    init(data) {

    },
    // 表单数据详情
    getTaskData(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getTaskData({ data });
        if (res && res.code == 0) {
          console.log("res", res.data);
          let data = JSON.parse(res.data.data);
          self.init(data)
        }
      })(data);
    },
  },
}
</script>

<style lang="less" scoped>

</style>
