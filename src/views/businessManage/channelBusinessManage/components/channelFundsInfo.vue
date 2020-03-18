<template>
  <div>
    <el-form label-position="right" 
      label-width="140px" 
      :model="form"
      :rules="rules"
      ref="form"
      :disabled="type!='0'"
      class="baseInfo">
      <el-form-item label="合作预交款" prop="coPrepareMoney">
        <el-input v-model="form.coPrepareMoney" placeholder="请输入合作预交款">
          <template slot="append">元</template>
        </el-input> 
      </el-form-item>
      <!-- <el-form-item label="授信额度" prop="creditQuota">
        <el-input v-model.number="form.creditQuota" placeholder="请输入授信额度">
          <template slot="append">元</template>
        </el-input> 
      </el-form-item> -->
      <el-form-item label="代销费率" prop="agentSellRate">
        <el-input v-model="form.agentSellRate" placeholder="请输入代销费率">
          <template slot="append">%</template>
        </el-input> 
      </el-form-item>
      <el-form-item label="收款凭证" class="photo">
        <div>
          <div v-for="(item,index) in financeImg" :key="index" class="el-upload-list">
            <img class="el-upload-list__item-thumbnail" :src="item" alt="" style="height: 150px;width: 150px; padding: 3px">
            <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-preview" @click="preview(item)">
                <i class="el-icon-zoom-in"></i>
              </span>
              <span class="el-upload-delete" @click="imgRemove(financeImg,index)">
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
          <el-upload
            action=""
            class="upload-wrap"
            list-type="picture-card"
            :auto-upload="true"
            accept=".png,.jpg,.jpeg"
            :show-file-list="false"
            :on-remove="handleRemove"
            :http-request="uploadFinanceImg">
              <i slot="default" class="el-icon-plus"></i>
          </el-upload>
        </div>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
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
    channelType: ''
  },
  data() {
    return {
      rules: {
        coPrepareMoney: [
          { required: true, validator: rules.donationAmount, title: '合作预交款', trigger: ['change','blur'] }
        ],
        agentSellRate: [
          { required: true, validator: rules.agentSellRate, title: '代销费率', trigger: ['change','blur'] }
        ],
      },
      financeImg: [],
      dialogImageUrl: '',
      dialogVisible: false,
      type: this.$route.query.type,
    }
  },
  created() {

  },
  watch: {
    financeImg: {
      handler(value) {
        if(value.length>0) {
          this.form.evidence = value.join(',')
        }else{
          this.form.evidence = ''
        }
      },
      deep: true,
    }
  },
  methods: {
    changeSelect() {

    },
    // 收据上传
    async uploadFinanceImg(files) {
      let formData = new FormData();
      formData.append('file', files.file);
      const res = await this.$api.uploadChannelFiles({
        timeout: 99999999999999,
        data: formData,
        onUploadProgress(evt) {
          console.log('上传进度事件:', evt)
        }
      })
      if(res&&res.code==0) {
        // this.cardImg.push(res.data.filePath)
        if (this.financeImg.length > 4) {
          // this.cardImg.splice(-1, 1);
          this.$message.warning("收款凭证数量不能超过5个");
          return;
        }
        console.log('uploadFile', res);
        this.financeImg.push(res.data.filePath)
      }else{
        console.log('uploadFile', res);
        // this.financeImg.push(res.data.filePath)
      }
      
    },
    imgRemove(data,index) {
      data.splice(index,1)
    },
    preview(imgUrl) {
      this.dialogImageUrl = imgUrl;
      this.dialogVisible = true;
    },
    handleRemove() {

    },
    // 校验
    validate(callback) {
      // this.$emit('change', this.form)
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log('校验通过')
          // this.$emit('asset')
          callback('true')
        }else{
          console.log('校验不通过')
          callback('false');
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.title-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-upload-list{
  overflow: hidden;
  background-color: #fff;
  border: 1px solid #c0ccda;
  border-radius: 6px;
  box-sizing: border-box;
  width: 148px;
  height: 148px;
  margin: 0 8px 8px 0;
  display: inline-block;
}
.el-upload-list__item-actions{
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  cursor: default;
  text-align: center;
  color: #fff;
  opacity: 0;
  font-size: 20px;
  background-color: rgba(0,0,0,.5);
  transition: opacity .3s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.el-upload-list__item-actions:hover {
    opacity: 1;
}
.el-upload-list{
  transition: all .5s cubic-bezier(.55,0,.1,1);
  font-size: 14px;
  color: #606266;
  line-height: 1.8;
  position: relative;
}
.upload-wrap{
  width: 148px;
  height: 148px;
  display: inline-block;
  overflow: hidden;
  margin: 0 8px 8px 0;
}
.el-upload-list__item-preview,
.el-upload-delete{
  margin: 0 15px;
  cursor: pointer;
}
</style>
