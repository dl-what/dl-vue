<template>
  <div>
    <el-form label-position="top" 
      label-width="90px" 
      :disabled="disabled"
      ref="form"
      class="soft-form">
      <el-form-item label="软件名称" prop="softwareName">
        <el-input v-model="form.softwareName" disabled placeholder="请输入软件名称"></el-input> 
      </el-form-item>
      <el-form-item label="版本号" prop="versionNumber">
        <el-input v-model="form.versionNumber" disabled placeholder="请输入版本号"></el-input> 
      </el-form-item>
      <el-form-item label="软件大小" prop="softwareSize">
        <el-input v-model="form.softwareSize" disabled placeholder="自动获取"></el-input> 
      </el-form-item>
      <!-- <el-form-item label="软件描述" prop="softwareDesc">
        <el-input v-model="form.softwareDesc" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入软件描述" maxlength="300"></el-input> 
      </el-form-item>
      <el-form-item label="新版特性" prop="newFeatures">
        <el-input v-model="form.newFeatures" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入新版特性" maxlength="300"></el-input> 
      </el-form-item> -->
    </el-form>
  </div>
</template>

<script type="text/javascript">

export default {
  name: "",
  model: {
    prop: 'form',
    event: 'returnBack'
  },
  props: {
    form: {
      type: Object,
      default: {}
    },
  },
  data() {
    return {
      imageUrl: '',
      disabled: false,
    }
  },
  created() {
    // 控制表单是否禁用
    let createPlan = this.$route.path.indexOf('createPlan') > -1;
    let planDetail = this.$route.path.indexOf('planDetail') > -1;
    let editPlan = this.$route.path.indexOf('editPlan') > -1;
    let gameDetail = this.$route.path.indexOf('gameDetail') > -1;
    let gameMarketDetail = this.$route.path.indexOf('gameMarketDetail') > -1;
    if(createPlan||planDetail||editPlan||gameDetail||gameMarketDetail) {
      this.disabled = true;
    }else{
      this.disabled = false;
    }
  },
  methods: {

  },
}
</script>

<style lang="less" scoped>

</style>
