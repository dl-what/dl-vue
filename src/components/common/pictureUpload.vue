<template>
  <div class="picture-upload-comp">
    <div class="upload-bd">
      <div v-for="(file, index) in fileList" :key="index" class="el-upload-list">
        <img
          class="el-upload-list__item-thumbnail"
          :src="file.filePath" alt=""
        >
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <span
            class="el-upload-delete"
            @click="handleRemove(file)"
          >
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
      <el-upload
        ref="upload"
        list-type="picture-card"
        :show-file-list="false"
        action
        :accept="accept"
        :on-remove="handleRemove"
        :http-request="uploadFile"
        :multiple="multiple || false"
        :limit="limit"
        :on-error="uploadError"
      >
        <i slot="default" class="el-icon-plus"></i>
      </el-upload>
    </div>
    <p class="tips">{{tip}}</p>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'pictureUpload',
    props: {
      accept: {
        default: 'image/gif,image/jpeg,image/png,image/jpg'
      },
      apiName: {
        default: 'uploadFile'
      },
      limit: {
        default: 1
      },
      size: {
        default: 2
      },
      multiple: {
        default: false
      },
      fileList: {
        default: () => []
      },
      formData: {
        default() {
          return {
            fileKey: 'uploadFile' 
          }
        }
      },
      tip: {
        default: () => '仅支持PNG JPG GIF格式,单张不超过2M'
      }
    },
    data() {
      return {
        dialogImageUrl: '',
        dialogVisible: false,
      };
    },
    methods: {
      showMessage(msg) {
        this.$message.closeAll();
        this.$message.error(msg);
      },
      // 文件上传
      handleRemove(file) {
        const list = this.fileList;
        list.splice(list.findIndex(item => file.filePath == item.filePath), 1);
      },
      uploadError() {
        this.$message.error('上传失败')
      },
      async uploadFile(files) {
        const size = files.file.size / 1024 / 1024;
        if (this.accept && this.accept.indexOf(files.file.type.split('/').reverse()[0]) < 0) {
          this.showMessage(`上传文件格式有误，请重新选择`);
          this.$refs.upload.clearFiles();
          return;
        }
        if (this.fileList.length >= this.limit) {
          this.showMessage(`上传文件不能超过${this.limit}个`)
          this.$refs.upload.clearFiles();
          return;
        }
        if (size > this.size) {
          this.showMessage(`上传文件最大不能超过${this.size}M`);
          this.$refs.upload.clearFiles();
          return;
        }
        const formData = new FormData();
        formData.append(this.formData['fileKey'], files.file);
        Object.keys(this.formData).forEach(key => {
          if (key != 'fileKey') {
            formData.append(key, this.formData[key]);
          }
        })
        const res = await this.$api[this.apiName]({
          loadingText: '正在上传',
          timeout: 99999999999999,
          data: formData,
          onUploadProgress(evt) {
            console.log("上传进度事件:", evt);
          }
        });
        if (res && res.code == 0) {
          this.fileList.push({
            filePath: res.data.filePath
          });
          this.$refs.upload.clearFiles();
          this.$emit('onSuccess', {
            filePath: res.data.filePath
          });
        }
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.filePath;
        this.dialogVisible = true;
      },

    }
  }
</script>

<style lang="less" scoped>
.picture-upload-comp{
  .upload-bd{
    display: flex;
    justify-content: flex-start;
  }
  .tips{
    margin-top: 10px;
    line-height: 1.2;
  }
  /deep/.el-dialog__body{
    border-top: none;
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
    img{
      display: block;
      width: 100%;
      height: 100%;
    }
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
    margin: 0 10px;
    cursor: pointer;
  }
}
</style>