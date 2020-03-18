<template>
  <div class="user-setting-container vlt-card">
    <panel :show="true" title="用户设置">
      <div class="vlt-edit-single">
        <div class="vlt-edit-wrap">
          <user-settings></user-settings>
        </div>
      </div>
    </panel>
  </div>
</template>

<script>
import userSettings from '@/components/main/userSettings'
export default {
  name: "userSetting",
  data() {
    return {}
  },
  components: {
    userSettings
  }
};
</script>

<style lang="less" scoped>
/deep/.avatar-upload{
  width: 600px;
}
/deep/.btn-item{
  text-align: left;
  margin-left: 12px;
} 
</style>