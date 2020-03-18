<template>
  <el-form-item :label="config.label || '开关'" :draggable="draggable" :data-form-type="config.type" :prop="isRule ? config.field : ''">
    <el-switch v-model="form.delivery"
      :active-value="1"
      :inactive-value="0"
      :disabled="config.disabled"
    ></el-switch>
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
