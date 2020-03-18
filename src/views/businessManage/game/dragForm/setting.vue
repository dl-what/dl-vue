<template>
  <div>
    <el-dialog title="主屏设置" append-to-body :visible.sync="show" width="600px" @closed="$emit('update:showDialog', false)">
      <el-form :model="form">
        <el-form-item label="主屏行数：" label-width="110px" class="mb10">
          <el-input-number v-model="form.row" :min="1" :max="20"></el-input-number>
        </el-form-item>
        <el-form-item label="主屏列数：" label-width="110px" class="mb10">
          <el-input-number v-model="form.col" :min="1" :max="3"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="show = false">取 消</el-button>
        <el-button type="primary" size="small" @click="screenConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'settings',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: this.showDialog,
      form: {
        row: 4,
        col: 2
      },
    }
  },
  watch: {
    'showDialog'(value) {
      this.show = value;
    }
  },
  created () {
    
  },
  mounted() {

  },
  methods: {
    // 主屏设置确认
    screenConfirm() {
      this.show = false;
      this.$emit('confirm', {
        row: this.form.row,
        col: this.form.col
      });
    }
  }
}

</script>

<style lang="less" scoped>
  .mb10{
    margin-bottom: 10px !important;
  }
</style>
