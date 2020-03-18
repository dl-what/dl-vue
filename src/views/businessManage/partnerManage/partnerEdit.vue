<template>
  <!-- 复用创建模板 -->
  <partner-create></partner-create>
</template>


<script>
  import partnerCreate from './partnerCreate'
  
  export default {
    name: 'partnerEdit',
    components: {
      partnerCreate
    }
  };
</script>

<style lang="less">
@import "./less/index.less";
</style>
