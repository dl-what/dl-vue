<template>
  <div>
    <!-- 风控规则 -->
    <el-form label-position="right" 
      label-width="10em" 
      :model="form"
      :rules="rules"
      :disabled="disabled"
      ref="form"
      class="baseInfo">
      <!-- <h2 class="title noborder">档位返奖率设置</h2> -->
      <el-form-item label="档位数量" prop="gearAmount">
        <el-input v-model.trim="form.gearAmount" placeholder="请输入档位数量" maxlength="5">
          <template slot="append">个</template>
        </el-input>
      </el-form-item>
      <el-form-item label="返奖率间隔" prop="returnRateInterval">
        <el-input v-model.trim="form.returnRateInterval" placeholder="请输入返奖率间隔" maxlength="5">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
      <el-form-item label="初始档位返奖率" prop="startGearReturnRate">
        <el-input v-model.trim="form.startGearReturnRate" placeholder="请输入初始档位返奖率" maxlength="5">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
      <el-form-item label="最小档位返奖率" prop="minGearReturnRate">
        <el-input v-model.trim="form.minGearReturnRate" placeholder="请输入最小档位返奖率" maxlength="5">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
      <el-form-item label="最大档位返奖率" prop="maxGearReturnRate">
        <el-input v-model.trim="form.maxGearReturnRate" placeholder="请输入最大档位返奖率" maxlength="5">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
      <el-form-item label="上传附件" v-if="!disabled">
        <el-upload
          class="game-upload"
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
      <el-form-item label="附件信息：" v-else>
        <div class="files-wrap">
          <ul class="files-wrapper">
            <li v-for="(item, index) in fileList" :key="index" class="files-item">
              <i class="files-item-icon el-icon-document"></i>
              <span class="files-item-content">{{item.name}}</span>
              <el-link class="files-item-btn" type="primary" v-prevent="2000" :underline="false" @click="toLink(item)">下载</el-link>
            </li>
          </ul>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/javascript">
import rules from "@/utils/rules.js";
import { fstat } from 'fs';

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
        startGearReturnRate: [
          { required: true, validator: rules.donationLimitRate, title: '初始档位返奖率', trigger: ["change","blur"] }
        ],
        minGearReturnRate: [
          { required: true, validator: rules.donationLimitRate, title: '最小档位返奖率', trigger: ["change","blur"] }
        ],
        maxGearReturnRate: [
          { required: true, validator: rules.donationLimitRate, title: '最大档位返奖率', trigger: ["change","blur"] }
        ],
        returnRateInterval: [
          { required: true, validator: rules.donationLimitRate, title: '返奖率间隔', trigger: ["change","blur"] }
        ],
        gearAmount: [
          { required: true, validator: rules.checkPositive, title: '档位数量', trigger: ["change","blur"] }
        ],
      },
      fileList: [],
      disabled: false,
      isRepeat: false,
    }
  },
  created() {
    // 控制表单是否禁用
    this.disabled = this.$route.query.type == '1' ? true : false;
    
    let array = this.form.filePath&&this.form.filePath.split(',')
    array&&array.forEach((item)=>{
      let obj = {};
      obj.name = item.split('/')[item.split('/').length-1];
      obj.url = item;
      this.fileList.push(obj)
    })
  },
  methods: {
    toLink(val) {
      // location.href = val.url;
      this.$download(1, val.url)
    },
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
      const res = await this.$api.testUpload({
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
  .noborder{
    border: none;
  }
  .files{
    &-wrap{
      width: 360px;
    }
    &-item{
      display: flex;
      justify-content: space-between;
      align-items: center;
      &-content{
        flex: 1;
        padding: 0 16px 0 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: default;
      }
      &-icon{
        margin-right: 7px;
        color: #909399;
      }
    }
    &-item:hover{
      background-color: #F5F7FA;
      // color:#409EFF;
    }
  }
</style>
