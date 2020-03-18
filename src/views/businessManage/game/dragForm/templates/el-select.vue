<template>
  <el-form-item :label="config.label || '下拉框'" :draggable="draggable" :data-form-type="config.type" :prop="isRule ? config.field : ''">
    <el-select v-model="form[config.field]" :placeholder="`请选择${config.title || ''}`" :disabled="config.disabled">
      <el-option :label="item.label" :value="item.value" :key="i" v-for="(item, i) in config.options"></el-option>
    </el-select>
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