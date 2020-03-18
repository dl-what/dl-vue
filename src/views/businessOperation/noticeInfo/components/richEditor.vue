<template>
  <div class="edit_container">
    <quill-editor
      v-model="contentForm"
      ref="myQuillEditor"
      :options="editorOption"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @change="onEditorChange($event)"
    ></quill-editor>
    <el-upload
      action
      :on-success="upScuccess"
      :http-request="uploadFile"
      ref="upload"
      style="display:none"
    >
      <el-button
        size="small"
        type="primary"
        id="uploadBtn"
        v-loading.fullscreen.lock="fullscreenLoading"
        element-loading-text="插入中,请稍候"
      >点击上传</el-button>
    </el-upload>
  </div>
</template>

<script type="text/javascript">
import { quillEditor } from "vue-quill-editor";
import * as Quill from "quill"; // 引入编辑器
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

export default {
  name: "richEditor",
  components: {
    quillEditor
  },
  props: {
    content: {
      type: String
    },
    routerType: ""
  },

  data() {
    return {
      contentForm: this.content,
      editorOption: {},
      fullscreenLoading: false,
      uploadType: "", // 上传的文件类型（图片、视频）
      fileUrl: ""
    };
  },
  methods: {
    // 上传文件
    async uploadFile(files) {
      let formData = new FormData();
      formData.append("file", files.file);
      formData.append("refId", 1);
      formData.append("flag", true);
      formData.append("busType", 1);
      const res = await this.$api.noticeUploading({
        timeout: 99999999999999,
        data: formData,
        onUploadProgress(evt) {
          console.log("上传进度事件:", evt);
        }
      });
      if (res && res.code == 0) {
        this.fileUrl = res.data.filePath;
      }
      console.log("uploadFile", res);
    },

    // 上传成功
    upScuccess() {
      const addRange = this.addRange;
      if (addRange) {
        console.log("addRange.index", addRange.index);
        this.$refs.myQuillEditor.quill.insertEmbed(
          addRange.index || 0,
          this.uploadType,
          this.fileUrl,
          Quill.sources.USER
        );
        this.$refs.upload.clearFiles();
      }
      console.log("upload success");
    },

    // 点击图片ICON触发事件
    imgHandler(state) {
      this.addRange = this.$refs.myQuillEditor.quill.getSelection();
      if (state) {
        let uploadBtn = document.getElementById("uploadBtn");
        uploadBtn.click();
      }
      this.uploadType = "image";
    },

    // 点击视频ICON触发事件
    videoHandler(state) {
      this.addRange = this.$refs.myQuillEditor.quill.getSelection();
      if (state) {
        let uploadBtn = document.getElementById("uploadBtn");
        uploadBtn.click();
      }
      this.uploadType = "video";
    },

    onEditorReady(editor) {
      // 准备编辑器
    },
    // 失去焦点事件
    onEditorBlur() {},
    // 获得焦点事件
    onEditorFocus(event) {
      if (this.routerType == 1) {
        event.enable(false);
      }
    },
    // 内容改变事件
    onEditorChange(e) {
      // console.log(e);
    }
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    }
  },

  mounted() {
    // 为QuillEditor绑定事件
    this.$refs.myQuillEditor.quill
      .getModule("toolbar")
      .addHandler("image", this.imgHandler);
    this.$refs.myQuillEditor.quill
      .getModule("toolbar")
      .addHandler("video", this.videoHandler);
  }
};
</script>

<style lang="less" scoped>
/deep/.ql-toolbar.ql-snow + .ql-container.ql-snow {
  height: 500px;
}
</style>
