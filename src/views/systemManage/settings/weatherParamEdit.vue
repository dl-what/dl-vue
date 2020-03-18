<template>
  <!-- 复用创建模板 -->
  <weather-create></weather-create>
</template>

<script type="text/javascript">
import weatherCreate from './weatherSetCreate'
export default {
  name: "weatherParamEdit",
  components: {
    weatherCreate
  }
}
</script>

<style lang="less" scoped>
</style>
