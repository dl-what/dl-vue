<template>
  <div>
    <el-form ref="form" label-width="80px" label-position="top" class="form-view-container">
      <div class="form-box" v-for="(item, index) in boxList" :key="index" :data-index="index" :style="styles">
        <el-button type="text" size="small" v-if="item.type" @click="getCurrentConfig(item)">配置</el-button>
        <form-component :config="item"></form-component>
      </div>
    </el-form>
    <form-config 
      :config="currentConfig"
      :showDialog.sync="showDialog" 
      @confirm="confirmConfig"
    >
    </form-config>
  </div>
</template>

<script>
import formComponent from './formComponent'
import formConfig from './formConfig'
export default {
  name: 'formView',
  props: {
    boxList: { // 容器列表
      default() {
        return []
      }
    },
    styles: {
      default() {
        return {}
      }
    } 
  },
  data() {
    return {
      showDialog: false,
      currentConfig: {}
    }
  },
  mounted() {

  },
  methods: {
    confirmConfig(config) {
      this.$emit('update', JSON.parse(JSON.stringify(config)));
    },
    getCurrentConfig(config) {
      this.currentConfig = config;
      this.showDialog = true;
    }
  },
  components: {
    formComponent,
    formConfig
  }
}
</script>

<style lang="less">
  .form-view-container{
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .form-box{
      width: 48%;
      box-sizing: border-box;
      height: 100px;
      border: 1px solid #dfdfdf;
      margin: 1% 1% 0;
      position: relative;
      &.active{
        background-color: #f2f2f2;
      }
      .el-form-item{
        height: 100%;
        padding: 0 10px;
        box-sizing: border-box;
        &.moving{
          background-color: #fff;
          opacity: 0.5;
        }
      }
      .el-button{
        position: absolute;
        right: 10px;
        top: 0;
      }
    }
  }
</style>
