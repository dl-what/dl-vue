<template>
  <div>
    <el-form label-position="top" 
      label-width="90px" 
      ref="form"
      :disabled="disabled"
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
      default: ()=>{}
    },
  },
  data() {
    return {
      gameServerPath: [], // 服务端游戏包地址
      isChange: true,
      disabled: false,
    }
  },
  created() {
    // 控制表单是否禁用
    this.disabled = this.$route.query.type == '1' ? true : false;
  },
  methods: {
 
  },
}
</script>

<style lang="less" scoped>

</style>
