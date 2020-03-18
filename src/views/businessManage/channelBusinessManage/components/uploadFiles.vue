<template>
  <div>
    <el-form label-position="right" label-width="110px" ref="form" class="soft-form">
      <el-form-item label="上传附件" v-if="!disabled">
        <el-upload
          class="upload-demo"
          ref="upload"
          drag
          multiple
          action
          accept
          :file-list="fileList"
          :show-file-list="true"
          :on-remove="fileRemove"
          :before-upload="beforeUploadFile"
          :http-request="uploadFile"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <div class="el-upload__tip" slot="tip">最多只能上传5个文件，且每个不超过50M</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="附件信息：" v-else>
        <div class="files-wrap">
          <ul class="files-wrapper">
            <li v-for="(item, index) in fileList" :key="index" class="files-item">
              <i class="files-item-icon el-icon-document"></i>
              <span class="files-item-content">{{item.name}}</span>
              <el-link
                class="files-item-btn"
                type="primary"
                v-prevent="2000"
                :underline="false"
                @click="toLink(item.url)"
              >下载</el-link>
            </li>
          </ul>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "",
  model: {
    prop: "form",
    event: "returnBack"
  },
  props: {
    form: {
      type: Object,
      default: {}
    },
    uploadUrl: {
      type: String,
      default: "testUpload"
    }
  },
  data() {
    return {
      fileList: [],
      disabled: false,
      isRepeat: false,
      len: null
    };
  },
  watch: {},
  created() {
    // 控制表单是否禁用
    this.disabled = this.$route.query.type == "1" ? true : false;
    // 回填
    let array =
      this.form && this.form.attachId && this.form.attachId.split(",");
    // console.log(array);
    array &&
      array.forEach(item => {
        let obj = {};
        obj.name = item.split("/")[item.split("/").length - 1];
        obj.url = item;
        this.fileList.push(obj);
      });
  },
  methods: {
    toLink(val) {
      // location.href = val.url;
      this.$download(1, val);
    },
    beforeUploadFile(file) {
      const isLt20M = file.size / 1024 / 1024 < 50;
      if (!isLt20M) {
        this.$message.error("上传附件大小不能超过 50MB!");
      }
      return isLt20M;
    },
    fileRemove(file) {
      this.fileList.forEach((item, index) => {
        if (item.name == file.name) {
          this.fileList.splice(index, 1);
        }
      });
      let array = [];
      this.fileList.forEach(item => {
        array.push(item.url);
      });
      this.form.attachId = array.join(",");
    },
    // 附件上传
    async uploadFile(files) {
      let formData = new FormData();
      formData.append("file", files.file);
      // formData.append('type', 1);
      const res = await this.$api[this.uploadUrl]({
        timeout: 99999999999999,
        data: formData,
        onUploadProgress(evt) {
          //调用onProgress方法来显示进度条，需要传递个对象 percent为进度值
          let percent = ((evt.loaded / evt.total) * 100) | 0;
          files.onProgress({ percent: percent });
        }
      });
      // debugger;
      if (res && res.code == 0) {
        console.log("上传成功", res);
        // 判断是否存在
        this.isRepeat = false;
        this.fileList.forEach((item, index) => {
          if (files.file.name == item.name) {
            this.isRepeat = true;
          }
        });
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
        if (this.isRepeat) {
          this.fileList.splice(-1, 1);
          this.$message.error("附件已存在，不能重复上传");
        } else {
          let array = [];
          this.fileList.forEach(item => {
            array.push(item.url);
          });
          this.form.attachId = array.join(",");
          this.$message.success("上传成功");
        }
      } else {
        self.fileRemove(files.file);
      }
    },
    // 下载
    async downLoad(val) {
      let formData = new FormData();
      formData.append("filePath", val);
      const res = await this.$api.downGameLoad({
        data: formData,
        responseType: "blob"
      });
      var blob = new Blob([res], {
        type:
          "application/msword;application/vnd.openxmlformats-officedocument.wordprocessingml.document;image/jpeg;image/png;application/x-rar-compressed;application/vnd.ms-excel;application/zip;charset=utf-8"
      });
      var url = window.URL.createObjectURL(blob);
      var aLink = document.createElement("a");
      aLink.style.display = "none";
      aLink.href = url;
      aLink.setAttribute("download", val.split("/")[val.split("/").length - 1]);
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
      console.log(res);
    }
  }
};
</script>

<style lang="less" scoped>
.soft-form {
  padding: 20px 0 16px;
}
.files {
  &-wrap {
    width: 360px;
  }
  &-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-content {
      flex: 1;
      padding: 0 16px 0 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: default;
    }
    &-icon {
      margin-right: 7px;
      color: #909399;
    }
  }
  &-item:hover {
    background-color: #f5f7fa;
    // color:#409EFF;
  }
}
</style>
<style lang="less">
.upload-demo {
  width: 400px;
  .el-upload-dragger {
    width: 400px;
    height: 190px;
  }
}
</style>
