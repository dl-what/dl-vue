<template>
  <div>
    <!-- 资金规则 -->
    <el-form label-position="top" 
      label-width="10em" 
      :model="form"
      :rules="rules"
      :disabled="disabled"
      ref="form"
      class="baseInfo">
      <el-form-item label="总发行经费比率" prop="totalPublishRate">
        <el-tooltip content="注：各发行费比率总和等于总发行经费比率" placement="top-end" effect="light">
          <el-input v-model.trim="form.totalPublishRate" disabled placeholder="自动获取总发行经费比率">
            <template slot="append">%</template>
          </el-input> 
        </el-tooltip>
      </el-form-item>
      <el-form-item label="总公益金比率" prop="totalWelfareRate">
        <el-tooltip content="注：各公益金比率总和等于总公益金比率" placement="top-end" effect="light">
          <el-input v-model.trim="form.totalWelfareRate" disabled placeholder="自动获取总公益金比率">
            <template slot="append">%</template>
          </el-input>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="中福彩发行费比率" prop="zhcPublishRate">
        <el-input v-model.trim="form.zhcPublishRate" placeholder="请输入中福彩发行费比率" maxlength="5">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
      <el-form-item label="中福彩公益金比率" prop="zhcWelfareRate">
        <el-input v-model.trim="form.zhcWelfareRate" placeholder="请输入中福彩公益金比率" maxlength="5">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
      <el-form-item label="省福彩发行费比率" prop="proPublishRate">
        <el-input v-model.trim="form.proPublishRate" placeholder="请输入省福彩发行费比率" maxlength="5">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
      <el-form-item label="省福彩公益金比率" prop="proWelfareRate">
        <el-input v-model.trim="form.proWelfareRate" placeholder="请输入省福彩公益金比率" maxlength="5">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
      <el-form-item label="市福彩发行费比率" prop="cityPublishRate">
        <el-input v-model.trim="form.cityPublishRate" placeholder="请输入市福彩发行费比率" maxlength="5">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
       <el-form-item label="市福彩公益金比率" prop="cityWelfareRate">
        <el-input v-model.trim="form.cityWelfareRate" placeholder="请输入市福彩公益金比率" maxlength="5">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
      <el-form-item label="销售厅发行费比率" prop="marketPublishRate">
        <el-input v-model.trim="form.marketPublishRate" placeholder="请输入销售厅发行费比率" maxlength="5">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
      <el-form-item label="销售厅公益金比率" prop="marketWelfareRate">
        <el-input v-model.trim="form.marketWelfareRate" placeholder="请输入销售厅公益金比率" maxlength="5">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/javascript">
import rules from "@/utils/rules.js";

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
      rules: {
        zhcPublishRate: [
          { required: true, validator: rules.donationLimitRate, title: '中福彩发行费比率', trigger: ['change','blur'] }
        ],
        zhcWelfareRate: [
          { required: true, validator: rules.donationLimitRate, title: '中福彩公益金比率', trigger: ['change','blur'] }
        ],
        proPublishRate: [
          { required: true, validator: rules.donationLimitRate, title: '省福彩发行费比率', trigger: ['change','blur'] }
        ],
        proWelfareRate: [
          { required: true, validator: rules.donationLimitRate, title: '省福彩公益金比率', trigger: ['change','blur'] }
        ],
        cityPublishRate: [
          { required: true, validator: rules.donationLimitRate, title: '市福彩发行费比率', trigger: ['change','blur'] }
        ],
        cityWelfareRate: [
          { required: true, validator: rules.donationLimitRate, title: '市福彩公益金比率', trigger: ['change','blur'] }
        ],
        marketPublishRate: [
          { required: true, validator: rules.donationLimitRate, title: '销售厅发行费比率', trigger: ['change','blur'] }
        ],
        marketWelfareRate: [
          { required: true, validator: rules.donationLimitRate, title: '销售厅公益金比率', trigger: ['change','blur'] }
        ],
      },
      disabled: false,
    }
  },
  created() {
    // 控制表单是否禁用
    this.disabled = this.$route.query.type == '1' ? true : false;
    
  },
  watch: {
    totalPublishRate(val) {
      this.form.totalPublishRate = val
    },
    totalWelfareRate(val) {
      this.form.totalWelfareRate = val
    },
  },
  computed: {
    totalPublishRate() {
      return (this.form.zhcPublishRate*1+this.form.proPublishRate*1+this.form.cityPublishRate*1+this.form.marketPublishRate*1).toFixed(2)
    },
    totalWelfareRate() {
      return (this.form.zhcWelfareRate*1+this.form.proWelfareRate*1+this.form.cityWelfareRate*1+this.form.marketWelfareRate*1).toFixed(2)
    },
  },
  methods: {
    beforeUploadFile(file) {
      const isLt20M = file.size / 1024 / 1024 < 50;
      if (!isLt20M) {
        this.$message.error('上传附件大小不能超过 50MB!');
      }
      return isLt20M;
    },
    fileRemove(file) {
      this.filePath.forEach((item,index)=>{
        if(item.indexOf(file.name)>-1) {
          this.filePath.splice(index, 1);
        }
      })
    },
    // 附件上传
    async uploadFile(files) {
      let formData = new FormData();
      formData.append('file', files.file);
      const res = await this.$api[this.uploadUrl]({
        timeout: 99999999999999,
        data: formData,
        onUploadProgress(evt) {
          //调用onProgress方法来显示进度条，需要传递个对象 percent为进度值
          let percent = (evt.loaded / evt.total * 100) | 0
          files.onProgress({percent:percent})
          console.log('上传进度事件:', evt)
        }
      })
      if(res&&res.code==0) {
        this.$message.success('上传成功')
        this.filePath.push(res.data.filePath);
      }
    },
  },
}
</script>

<style lang="less" scoped>
  .vlt-edit-wrap{
    width: 100%;
  }
  .flex-wrap{
    display: flex;
    align-items: center;
    position: relative;
    .flag{
      margin: 0 10px;
    }
    .remove{
      position: absolute;
      top: 0;
      right: -70px;
      z-index: 1;
      padding: 10px 15px;
    }
  }
  .title{
    font-size: 14px;
    padding: 15px 0;
    border-top: 1px solid #e8eaec;
    border-bottom: none;
  }
  .add-btn{
    width: 100%;
  }
  .flex-switch{
    width: 150px;
  }
</style>
