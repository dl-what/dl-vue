<template>
  <el-form-item :label="config.label || '日期时间选择'" :draggable="draggable" :data-form-type="config.type" :prop="isRule ? config.field : ''">
    <el-date-picker type="datetime" placeholder="选择日期时间" v-model="form[config.field]" style="width: 100%;" :disabled="config.disabled"></el-date-picker>
  </el-form-item>
</template>

<script>
export default {
  name: 'formItem',
  props: {
    draggable: {
      default() {
        return true;
      }
    },
    config: {
      default() {
        return {}
      }
    },
    form: {
      default() {
        return {}
      }
    },
    isRule: {
      default() {
        return false;
      }
    },
  }
}
</script>