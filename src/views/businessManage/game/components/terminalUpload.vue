<template>
  <div>
    <el-form label-position="right" 
      label-width="90px" 
      ref="form"
      :model="form"
      :rules="rules"
      :disabled="disabled"
      class="soft-form">
      <el-form-item label="上传游戏包">
        <el-upload
          class="upload-demo"
          action=""
          accept=".gz"
          :file-list="fileList"
          :show-file-list="true"
          :disabled="disabled"
          :on-remove="gameBagRemove"
          :http-request="uploadFile">
          <el-button :disabled="disabled" size="small" type="primary">上传客户端游戏包</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="软件名称" prop="softwareName">
        <el-input v-model="form.softwareName" disabled placeholder="自动获取"></el-input> 
      </el-form-item>
      <el-form-item label="版本号" prop="versionNumber">
        <el-input v-model="form.versionNumber" disabled placeholder="自动获取"></el-input> 
      </el-form-item>
      <el-form-item label="软件大小" prop="softwareSize">
        <el-input v-model.number="form.softwareSize" disabled placeholder="自动获取"></el-input> 
      </el-form-item>
      <!-- <el-form-item label="软件描述" prop="softwareDesc">
        <el-input v-model="form.softwareDesc" :disabled="disabled" type="textarea" :autosize="{ minRows: 3, maxRows: 8}" placeholder="请输入软件描述" maxlength="200"></el-input> 
      </el-form-item>
      <el-form-item label="新版特性" prop="newFeatures">
        <el-input v-model="form.newFeatures" :disabled="disabled" type="textarea" :autosize="{ minRows: 3, maxRows: 8}" placeholder="请输入新版特性" maxlength="200"></el-input> 
      </el-form-item> -->
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
      default: {}
    },
    type: {
      type: Number,
    }
  },
  data() {
    return {
      disabled: false,
      fileList: [],  // 客户端游戏包地址
      rules: {
        softwareName: [
          { required: true, message: '软件名称不能空', trigger: ['blur'] }
        ],
        versionNumber: [
          { required: true, message: '版本号不能为空', trigger: ['blur'] }
        ],
        softwareSize: [
          { required: true, message: '软件大小不能为空', trigger: ['blur'] }
        ],
      },
    }
  },
  created() {
    // 控制是否禁用
    if(this.$route.query.gameId&&this.type==1) {
      this.disabled = true;
    }else{
      this.disabled = false;
    }

    let array = this.form.filePath&&this.form.filePath.split(',')
    array&&array.forEach((item)=>{
      let obj = {};
      obj.name = item.split('/')[item.split('/').length-1];
      obj.url = item;
      this.fileList.push(obj)
    })
  },
  methods: {
    // 客户端游戏包上传
    async uploadFile(files) {
      const self = this;
      let formData = new FormData();
      formData.append('file', files.file);
      formData.append("type", 2);
      const res = await self.$api.testUpload({
        timeout: 99999999999999,
        data: formData,
        onUploadProgress(evt) {
          let percent = ((evt.loaded / evt.total) * 100) | 0; //调用onProgress方法来显示进度条，需要传递个对象 percent为进度值
          files.onProgress({ percent: percent });
        }
      })
      if(res&&res.code==0) {
        console.log('上传成功', res)
        self.$message.success('上传成功')
        self.form.fileMd5 = res.data.fileMd5;
        self.form.softwareName = res.data.softName||res.data.fileName
        self.form.softwareSize = res.data.versionSize;
        self.form.versionNumber = res.data.versionCode;
        let obj = {};
        obj.name = res.data.fileName;
        obj.url = res.data.filePath;
        self.fileList=[obj];
        let array = [];
        self.fileList.forEach((item)=>{
          array.push(item.url)
        })
        self.form.filePath = array.join(',');
      }else{
        self.gameBagRemove(files.file)
      }
    },
    // 删除客户端游戏包的地址
    gameBagRemove(file) {
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
  },
}
</script>

<style lang="less" scoped>

</style>
