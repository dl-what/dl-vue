<template>
  <el-form-item :label="config.label || '输入框'" :draggable="draggable" :data-form-type="config.type" :prop="isRule ? config.field : ''">
    <el-input v-model="form[config.field]" :disabled="config.disabled" :placeholder="`请输入${config.title || ''}`"></el-input>
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