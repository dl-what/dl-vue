<template>
<!-- 活动效果评估 -->
  <div class="vlt-card active-result">
    <search-bar :options="options" @search="search" :total="total" labelWidth="6em"></search-bar>
    <!-- <el-button type="primary" size="small" @click="assess">评估</el-button> -->
    <!-- <el-button type="primary" size="small">下载</el-button> -->
    <el-table :data="assessList" border>
      <el-table-column type="index" label="序号" width="60px" fixed="left">
        <template slot-scope="scope">
          {{params.pageSize*(params.page-1)+(scope.$index+1)}}
        </template>
      </el-table-column>
      <el-table-column prop="activityCode" label="活动编号" min-width="160"></el-table-column>
      <el-table-column prop="activityName" label="活动名称" min-width="200"></el-table-column>
      <el-table-column prop="startTime" label="活动开始时间" min-width="200"></el-table-column>
      <el-table-column prop="endTime" label="活动结束时间" min-width="200"></el-table-column>
      <el-table-column prop="retionReport" label="定量报告" min-width="140">
        <!-- <template slot-scope="scope"> -->
          <el-tag type="success">前往业务监控查看</el-tag>
          <!-- <el-button type="primary" size="mini" @click="detail(scope.row.id)" v-has="'activityResult-detail'">预览</el-button> -->
        <!-- </template> -->
      </el-table-column>
      <el-table-column prop="efficiecyEvaluation" label="效率评估" min-width="140">
          <el-tag type="success">前往业务监控查看</el-tag>
          <!-- <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="detail(scope.row.id)" v-has="'activityResult-detail'">预览</el-button>
        </template> -->
      </el-table-column>
      <el-table-column prop="report" label="定性报告" width="160" fixed="right">
        <template slot-scope="scope">
          <el-upload
            class="upload-demo files-btn"
            action
            :show-file-list="false"
            :before--upload="beforeUploadFile"
            :http-request="function(files){return uploadFileOther(files,scope.row.id)}"
            >
            <el-button :id="'activityResult-upload' + scope.$index" size="mini" type="primary" v-has="'activityResult-upload'">上传</el-button>
            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
          </el-upload>
          <el-button class="files-btn" :id="'activityResult-download' + scope.$index" type="primary" size="mini" @click="downLoad(scope.row.quality)" :disabled="scope.row.quality == null || scope.row.quality == ''" v-has="'activityResult-download'" 
                            download="w3logo">下载</el-button>
        </template>
      </el-table-column>
    </el-table>
    <table-paging
      position="right"
      :total="total"
      :currentPage="params.page"
      :pageSize="params.pageSize"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></table-paging>
  </div>
</template>

<script>
export default {
  name: "activityResult",
  data() {
    return {
      options: [
        {
          type: "input",
          prop: "activityCode",
          value: "",
          title: "活动编号"
        },
        {
          type: "input",
          prop: "activityName",
          value: "",
          title: "活动名称"
        }
      ],
      assessList: [],
      params: {
        page: 1,
        pageSize: 20,
        param:{
          insId: this.$storage.get("userInfo").insId
        }
      },
      total: 0
    };
  },
  created() {
    this.getTableList()
  },
  methods: {
    getTableList(){
      const self = this;
      let data = self.params;
      (async data =>{
        let res = await self.$api.getActivityEvaluation({ data })
        if (res && res.code == 0){
          console.log(res)
          self.total = res.data.total
          self.assessList = res.data.records
        }
      })(data)
    },
    beforeUploadFile(file) {
      const isLt20M = file.size / 1024 / 1024 < 50;
      if (!isLt20M) {
        this.$message.error('上传附件大小不能超过 50MB!');
      }
      return isLt20M;
    },
    // 上传
    async uploadFileOther(files,id) {
      let formData = new FormData();
      console.log("files", files.file.size / 1024);
      // this.softData[3].value = `${(files.file.size/1024).toFixed()}`
      formData.append("file", files.file);
      formData.append("id",id)
      // formData.append("refId", 1);
      // formData.append("flag", true);
      // formData.append("busType", 1);
      const res = await this.$api.activityUploading({
        timeout: 99999999999999,
        data: formData,
        // id: id,
        onUploadProgress(evt) {
          console.log("上传进度事件:", evt);
        }
      });
      console.log("uploadFile", res);
      if(res&&res.code==0) {
        this.$message.success('上传成功')
        this.getTableList()
        // console.log(this.gameBagPath)
        // this.attachId.push(res.data.filePath);
      }
    },
    async downLoad(url) {
      // console.log(url);
      this.$download(1, url)
    },
    // 下载
    // async downLoad2(val) {
    //   console.log(val)
    //   let formData = new FormData();
    //   formData.append('filePath', val);
    //   const res = await this.$api.activityDownloading({
    //     data: formData,
    //     responseType: "blob"
    //   });
    //   var blob = new Blob([res.blob], {
    //     type: "application/msword;application/vnd.openxmlformats-officedocument.wordprocessingml.document;image/jpeg;image/png;application/x-rar-compressed;application/vnd.ms-excel;application/zip;charset=utf-8"
    //   });
    //   var url = window.URL.createObjectURL(blob);
    //   var aLink = document.createElement("a");
    //   aLink.style.display = "none";
    //   aLink.href = url;
    //   aLink.setAttribute("download", val.split('/')[val.split('/').length-1]);
    //   document.body.appendChild(aLink);
    //   aLink.click();
    //   document.body.removeChild(aLink); //下载完成移除元素
    //   window.URL.revokeObjectURL(url); //释放掉blob对象
    //   console.log(res);
    // },
    detail() {

    },
    assess() {
      this.$router.push({ path: "resultAssess" });
    },
    search(val) {
      this.params.page = 1;
      this.params.param = {...val};
      this.params.param.insId = this.$storage.get("userInfo").insId;
      console.log(this.params)
      this.getTableList(this.params);
    },
    handleSizeChange(size) {
      this.params.page = 1;
      this.params.pageSize = size
      this.getTableList(this.params)
    },
    handleCurrentChange(page) {
      this.params.page = page;
      this.getTableList(this.params)
    }
  },
};
</script>
<style lang="less">
.active-result{
  .el-table td div{
    display: inline-block;
  }
}
.files-btn {
  margin: auto 10px;
}
</style>