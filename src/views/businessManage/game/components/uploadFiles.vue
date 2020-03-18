<template>
  <div>
    <el-form label-position="right" 
      label-width="90px" 
      ref="form"
      class="soft-form">
      <el-form-item label="上传附件">
        <el-upload
          class="upload-demo"
          drag
          multiple
          action=""
          accept=""
          :file-list="fileList"
          :show-file-list="true"
          :on-remove="fileRemove"
          :before-upload="beforeUploadFile"
          :http-request="uploadFile">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <div class="el-upload__tip" slot="tip">最多只能上传5个文件，且每个不超过50M</div>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/javascript">

export default {
  name: "",
    model: {
    prop: 'form',
    event: 'returnBack'
  },
  props: {
    form: {
      type: Object,
      default: {},
    },
    uploadUrl: {
      type: String,
      default: 'testUpload'
    }
  },
  data() {
    return {
      fileList: [],
    }
  },
  created() {
    let array = this.form.filePath&&this.form.filePath.split(',')
    array&&array.forEach((item)=>{
      let obj = {};
      obj.name = item.split('/')[item.split('/').length-1];
      obj.url = item;
      this.fileList.push(obj)
    })
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
      this.fileList.forEach((item,index)=>{
        if(item.name == file.name) {
          this.fileList.splice(index, 1);
        }
      })
      let array = [];
      this.fileList.forEach((item)=>{
        array.push(item.url)
      })
      this.form.filePath = array.join(',')
    },
    // 附件上传
    async uploadFile(files) {
      let formData = new FormData();
      formData.append('file', files.file);
      formData.append('type', 1);
      const res = await this.$api[this.uploadUrl]({
        timeout: 99999999999999,
        data: formData,
        onUploadProgress(evt) {
          //调用onProgress方法来显示进度条，需要传递个对象 percent为进度值
          let percent = (evt.loaded / evt.total * 100) | 0
          files.onProgress({percent:percent})
        }
      })
      if(res&&res.code==0) {
        // 判断是否存在
        this.isRepeat = false;
        this.fileList.forEach((item, index) => {
          if(files.file.name == item.name) {
            this.isRepeat = true;
          }
        })
        // push进fileList
        let obj = {};
        obj.name = res.data.fileName;
        obj.url = res.data.filePath;
        this.fileList.push(obj);

        if (this.fileList.length > 5) {
          this.fileList.splice(-1, 1);
          this.$message.error("上传附件数量不能超过5个");
          return;
        }
        if(this.isRepeat) {
          this.fileList.splice(-1, 1)
          this.$message.error('附件已存在，不能重复上传')
        }else{
          let array = [];
          this.fileList.forEach((item)=>{
            array.push(item.url)
          })
          this.form.filePath = array.join(',')
          this.$message.success('上传成功')
        }
      }else{
        self.fileRemove(files.file)
      }
    },
  },
}
</script>

<style lang="less" scoped>
.soft-form{
  padding: 20px 0 16px;
}
</style>
