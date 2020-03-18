<template>
  <!-- 无收缩面板 -->
  <div class="static">
    <div class="static-hd">
      <i class="el-icon-caret-bottom static-caret"></i>
      <h6 class="title">{{title}}</h6>
    </div>
    <div class="static-bd">
      <slot>
        <!-- 插入内容 -->
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'panelStatic',
  props: {
    // 面板标题
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      
    }
  },
  created () {
    const self = this;
    
  },
  methods: {
    
  }
}
</script>

<style lang="less" scoped>
  .static{
      border-radius: 4px;
      background-color: #fff;
      border: 1px solid #dcdee2;
      border-color: #e8eaec;
    &-caret{
      font-size: 20px;
      margin-right: 3px;
      color: #000a12;
    }
    &-hd{
      display: flex;
      align-items: center;
      padding: 0 15px 0 10px;
      height: 50px;
      line-height: 50px;
      background-color: #fff;
      border-bottom: 1px solid #e8eaec;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      .title{
        font-weight: normal;
        font-size: 14px;
        color: #000A12;
        flex: auto;
      }
    }
    &-bd{
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      background-color: #fff;
    }
  }
</style>
