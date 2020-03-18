<template>
  <div>
    <!-- 奖池规则 -->
    <el-form label-position="right" 
      label-width="8em" 
      :model="params"
      :rules="rules"
      :disabled="disabled"
      ref="form"
      class="baseInfo">
      <!-- <h2 class="title noborder">返奖率设置</h2> -->
      <el-form-item label="固定返奖率" prop="returnRate">
        <el-input v-model.trim="params.returnRate" placeholder="请输入固定返奖率" maxlength="5">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
      <el-form-item label="奖池返奖率" prop="rewardReturnRate">
        <el-input v-model.trim="params.rewardReturnRate" placeholder="请输入奖池返奖率" maxlength="5">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
      <el-form-item label="调节基金比率" prop="reFundRate">
        <el-input v-model.trim="params.reFundRate" placeholder="请输入调节基金比率" maxlength="5">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
      <h2 class="title">固定奖奖级设置</h2>
      <!-- <el-form-item :label="`等级${index+1}`" v-for="(item,index) in params.leverData" :key="`1${index}`"
        :prop="'leverData.' + index + '.rewardLeveAmount'"
        :rules="{
          required: true, message: '等级不能为空', trigger: ['change','blur']
        }">
        <div class="flex-wrap">
          <el-input v-model="item.rewardLeveAmount" placeholder="请输入金额">
            <template slot="append">元</template>
          </el-input>
          <el-button class="remove" @click.prevent="removeLever(index)">删除</el-button>
        </div>
      </el-form-item>
      <el-form-item label="" prop="">
        <el-button plain @click="addLever" icon="el-icon-plus" class="add-btn"></el-button>
      </el-form-item> -->
      <el-form-item label="上传附件" v-if="!disabled">
        <el-upload
          class="game-upload"
          drag
          multiple
          action=""
          :show-file-list="true"
          :file-list="filePathLever"
          :on-remove="removeLeverFile"
          :before-upload="beforeLever"
          :http-request="uploadFileLever">
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
            <li v-for="(item, index) in filePathLever" :key="index" class="files-item">
              <i class="files-item-icon el-icon-document"></i>
              <span class="files-item-content">{{item.name}}</span>
              <el-link class="files-item-btn" type="primary" v-prevent="2000" :underline="false" @click="toLink(item)">下载</el-link>
            </li>
          </ul>
        </div>
      </el-form-item>
      <h2 class="title">累计奖池设置</h2>
      <el-form-item :label="`奖池ID${index+1}`" v-for="(item,index) in params.totalData" :key="index" class="rules-jackpot">
        <div class="flex-wrap">
          <el-form-item   
            class="rewardPool"
            :prop="'totalData.' + index + '.rewardPoolId'"
            :rules="{
              required: false, validator: $rules.checkPositive, title: '奖池ID', trigger: ['change','blur']
            }">
            <el-input v-model.trim="item.rewardPoolId" :disabled="item.poolDisabled" placeholder="请输入奖池ID" maxlength="9">
            </el-input>
          </el-form-item>
          <span class="flag">奖池名称</span>
          <el-form-item   
            class="rewardPool"
            :prop="'totalData.' + index + '.rewardPoolName'"
            :rules="{
              required: false, validator: $rules.checkName, title: '奖池名称', trigger: ['change','blur']
            }">
            <el-input v-model.trim="item.rewardPoolName" :disabled="item.poolDisabled" placeholder="请输入奖池名称" maxlength="15">
            </el-input>
          </el-form-item>
          <span class="flag">初始化金额</span>
          <el-form-item 
            class="rewardPool"
            :prop="'totalData.' + index + '.rewardPoolAmount'"
            :rules="{
              required: false, validator: $rules.donationAmount, title: '初始化金额', trigger: ['change','blur']
            }">
            <el-input v-model.trim="item.rewardPoolAmount" :disabled="item.amountDisabled" placeholder="请输入初始化金额" maxlength="10">
              <template slot="append">元</template>
            </el-input> 
          </el-form-item>
          <el-button class="remove vlt-delete-more" v-if="!item.poolDisabled" @click.prevent="removeTotal(index)">删除</el-button>
        </div>
      </el-form-item>
      <el-form-item label="" prop="">
        <el-tooltip content="注：最多添加5个奖池，且奖池比率总和等于总累计奖池返奖率" placement="right" effect="light">
          <el-button size="medium" @click="addTotal" v-if="!editType" icon="el-icon-plus" class="add-btn vlt-add-more"></el-button>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="上传附件" v-if="!disabled">
        <el-upload
          class="game-upload"
          drag
          multiple
          action=""
          :disabled="hasRewardPool"
          :show-file-list="true"
          :file-list="filePathTotal"
          :on-remove="removeTotalFile"
          :before-upload="beforeTotal"
          :http-request="uploadFileTotal">
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
            <li v-for="(item, index) in filePathTotal" :key="index" class="files-item">
              <i class="files-item-icon el-icon-document"></i>
              <span class="files-item-content">{{item.name}}</span>
              <el-link class="files-item-btn" type="primary" v-prevent="2000" :underline="false" @click="toLink(item)">下载</el-link>
            </li>
          </ul>
        </div>
      </el-form-item>
      <h2 class="title">调节基金设置</h2>
      <el-form-item label="调节基金控制" prop="">
        <div class="flex-wrap">
          <el-tooltip v-model="isManual" manual :content="switchTips" placement="right" effect="light">
            <el-switch
              class="flex-switch"
              v-model="form.gameFundRuleVo.reFundStatus"
              @change="changeSwitch"
              :active-text="form.gameFundRuleVo.reFundStatus==1?'关闭':'启用'"
              :inactive-value="1"
              :active-value="2">
            </el-switch>
          </el-tooltip>
        </div>
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
    type: {
      type: Number,
    }
  },
  data() {
    return {
      params: {
        returnRate: null, // 固定返奖率
        rewardReturnRate: null, // 奖池返奖率
        reFundRate: null, // 调节基金
        leverData: [ // 固定奖池
        ],
        totalData: [ // 累计奖池
        ],
      },
      rules: {
        reFundRate: [
          { required: true, validator: rules.donationLimitRate, title: '调节基金比率', trigger: ['change','blur'] }
        ],
        returnRate: [
          { required: true, validator: rules.donationLimitRate, title: '固定返奖率', trigger: ['change','blur'] }
        ],
        rewardReturnRate: [
          { required: true, validator: rules.donationLimitRate, title: '奖池返奖率', trigger: ['change','blur'] }
        ],
      },
      filePathLever: [],
      filePathTotal: [],
      switchTips: '开启调节基金为累计奖池补充的功能',
      disabled: false,
      isManual: false,
      editType: false,
      isRepeat: false,
      hasRewardPool: false,
    }
  },
  watch: {
    params: {
      handler(val) {
        this.form.gameFundRuleVo.reFundRate = val.reFundRate;
        this.form.rewardLevelSetVo.returnRate = val.returnRate;
        this.form.rewardLevelSetVo.rewardReturnRate = val.rewardReturnRate;
        this.setLever() // 固定奖池
        this.setTotal() // 累计奖池
        if(val.totalData.length==0) {
          this.hasRewardPool = true;
        }else{
          this.hasRewardPool = this.editType?true:false;
        }
      },
      deep: true,
    },
  },
  created() {
    // 控制表单是否禁用
    this.disabled = this.$route.query.type == '1' ? true : false;
    if(this.$route.query.gameId) {
      this.editType = true;
      if(this.form.gameRewardPoolVoList.length==0) {
        this.params.rewardReturnRate = 0;
      }
    }
    // 固定奖
    let leverData = this.form.rewardLevelSetVoList;
    if(leverData.length>0) {
      leverData.forEach((item, index)=>{
        this.$set(this.params.leverData, index, item)
      })
    }
    let lever = this.params.leverData;
    if(lever.length>0) {
      let leverArray = lever[0].filePath&&lever[0].filePath.split(',')
      leverArray&&leverArray.forEach((item)=>{
        let obj = {};
        obj.name = item.split('/')[item.split('/').length-1];
        obj.url = item;
        this.filePathLever.push(obj)
      })
    }
        
    // 固定返奖率
    this.$set(this.params, 'returnRate', this.form.rewardLevelSetVo.returnRate)
    // 调节基金比率
    this.$set(this.params, 'reFundRate', this.form.gameFundRuleVo.reFundRate)

    // 固定奖（上传附件）
    let leverArrays = this.form.rewardLevelSetVo.filePath&&this.form.rewardLevelSetVo.filePath.split(',')
    leverArrays&&leverArrays.forEach((item)=>{
      let obj = {};
      obj.name = item.split('/')[item.split('/').length-1];
      obj.url = item;
      this.filePathLever.push(obj)
    })
    // debugger;
    // 累计奖
    let totalData = this.form.gameRewardPoolVoList;
    if(totalData.length>0) {
      totalData.forEach((item, index)=>{
        // 奖池返奖率
        this.$set(this.params, 'rewardReturnRate', item.rewardReturnRate)
        this.$set(this.params.totalData, index, item)
      })
    }
    let total = this.params.totalData;
    if(total.length>0) {
      let totalArray = total[0].filePath&&total[0].filePath.split(',')
      totalArray&&totalArray.forEach((item)=>{
        let obj = {};
        obj.name = item.split('/')[item.split('/').length-1];
        obj.url = item;
        this.filePathTotal.push(obj)
      })
    }
  },
  computed: {

  },
  methods: {
    toLink(val) {
      // location.href = val.url;
      this.$download(1, val.url)
    },
    setTotal() {
      const self = this;
      // debugger;
      let data = JSON.parse(JSON.stringify(self.params.totalData))
      let array = [];
      let totalArray = [];
      self.filePathTotal.forEach((item)=>{
        totalArray.push(item.url)
      })
      // debugger;
      data.forEach((item, index)=>{
        item.rewardPoolId = item.rewardPoolId*1;
        item.rewardPoolAmount = item.rewardPoolAmount*1;
        item.rewardReturnRate = self.params.rewardReturnRate*1;
        item.filePath = totalArray.join(',');
        item.deployCode = self.form.gameRuleVo.deployCode||'';
        array.push(item)
      })
      self.form.gameRewardPoolVoList = array;
    },
    setLever() {
      let data = JSON.parse(JSON.stringify(this.params.leverData))
      let array = [];
      let leverArray = [];
      this.filePathLever.forEach((item)=>{
        leverArray.push(item.url)
      })
      data.forEach((item, index)=>{
        item.rewardLeveName = `等级${index+1}`;
        item.rewardLeveCode = index+1;
        item.rewardLeveAmount = item.rewardLeveAmount*1;
        item.filePath = leverArray.join(',');
        item.deployCode = this.form.gameRuleVo.deployCode||'';
        array.push(item)
      })
      // 固定奖
      this.form.rewardLevelSetVoList = array;
      // 固定奖（上传附件）
      this.form.rewardLevelSetVo.filePath = leverArray.join(',');
    },
    changeSelect(val) {
      let obj = {
        1: '全部：调节基金即可补充固定奖也可补充累计奖',
        2: '固定奖：调节基金只可补充固定奖',
        3: '累计奖：调节基金只可补充累计奖'
      };
      this.selectTips = obj[val];
    },
    changeSwitch(val) {
      console.log(val)
      if(val == 1) {
        this.isManual = false;
      }else{
        this.isManual = true;
      }
    },
    addTotal() {
      let obj = { rewardPoolName: null, rewardPoolId: null, rewardPoolAmount: null};
      if(this.params.totalData.length<5) {
        this.params.totalData.push(obj)
      }
    },
    removeTotal(index) {
      this.params.totalData.splice(index, 1)
    },
    // 固定奖池
    addLever() {
      let obj = { 
        rewardLeveAmount: null, // 金额
      };
      this.params.leverData.push(obj)
    },
    removeLever(index) {
      this.params.leverData.splice(index, 1)
    },
    beforeLever(file) {
      const isLt20M = file.size / 1024 / 1024 < 50;
      if (!isLt20M) {
        this.$message.error('上传附件大小不能超过 50MB!');
      }
      return isLt20M;
    },
    beforeTotal(file) {
      const isLt20M = file.size / 1024 / 1024 < 50;
      if (!isLt20M) {
        this.$message.error('上传附件大小不能超过 50MB!');
      }
      return isLt20M;
    },
    removeLeverFile(file) {
      this.filePathLever.forEach((item,index)=>{
        if(item.name == file.name) {
          this.filePathLever.splice(index, 1);
        }
      })
      this.setLever()
    },
    removeTotalFile(file) {
      this.filePathTotal.forEach((item,index)=>{
        if(item.name == file.name) {
          this.filePathTotal.splice(index, 1);
        }
      })
      this.setTotal()
    },
    // 固定奖 附件上传
    async uploadFileLever(files) {
      let formData = new FormData();
      formData.append('file', files.file);
      formData.append("type", 1);
      const res = await this.$api.testUpload({
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
        this.filePathLever.forEach((item, index) => {
          if(files.file.name == item.name) {
            this.isRepeat = true;
          }
        })
        // push进fileList
        let obj = {};
        obj.name = res.data.fileName;
        obj.url = res.data.filePath;
        this.filePathLever.push(obj);

        if (this.filePathLever.length > 5) {
          this.filePathLever.splice(-1, 1);
          this.$message.error("上传附件数量不能超过5个");
          return;
        }
        if(this.isRepeat) {
          this.filePathLever.splice(-1, 1)
          this.$message.error('附件已存在，不能重复上传')
        }else{
          this.setLever()
          this.$message.success('上传成功')
        }
      }else{
        self.removeLeverFile(files)
      }
    },
    // 累计奖 附件上传
    async uploadFileTotal(files) {
      let formData = new FormData();
      formData.append('file', files.file);
      formData.append("type", 1);
      const res = await this.$api.testUpload({
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
        this.filePathTotal.forEach((item, index) => {
          if(files.file.name == item.name) {
            this.isRepeat = true;
          }
        })
        // push进filePathTotal
        let obj = {};
        obj.name = res.data.fileName;
        obj.url = res.data.filePath;
        this.filePathTotal.push(obj);

        if (this.filePathTotal.length > 5) {
          this.filePathTotal.splice(-1, 1);
          this.$message.error("上传附件数量不能超过5个");
          return;
        }
        if(this.isRepeat) {
          this.filePathTotal.splice(-1, 1)
          this.$message.error('附件已存在，不能重复上传')
        }else{
          this.$message.success('上传成功')
          this.setTotal()
        }
      }else{
        self.removeTotalFile(files)
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
    height: 40px;
    .flag{
      margin: 0 10px;
      flex: none;
    }
    .remove{
      position: absolute;
      top: 0;
      right: -100px;
      z-index: 1;
      // padding: 10px 15px;
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
<style lang="less">
  .rewardPool .el-form-item__content{
    width: 100%;
  }
  .rules-jackpot>.el-form-item__content{
    width: 650px;
  }
</style>
