<template>
  <el-form-item :label="config.label || '单选框'" :draggable="draggable" :data-form-type="config.type" :prop="isRule ? config.field : ''">
    <el-radio-group v-model="form[config.field]" :disabled="config.disabled">
      <el-radio :label="item.value" :key="i" v-for="(item, i) in config.options">{{item.label}}</el-radio>
    </el-radio-group>
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