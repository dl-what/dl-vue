<template>
  <div>
    <!-- 游戏基础信息 -->
    <el-form label-position="right" 
      label-width="110px" 
      :model="form"
      :rules="rules"
      ref="form"
      class="baseInfo">
      <el-form-item v-if="disabled" label="游戏编码" prop="gameCode">
        <el-input v-model.trim="form.gameCode" disabled placeholder="请输入游戏编码" maxlength="50" show-word-limit></el-input> 
      </el-form-item>
      <el-form-item label="游戏名称" prop="gameName">
        <el-input v-model.trim="form.gameName" placeholder="请输入游戏名称" maxlength="15" show-word-limit></el-input> 
      </el-form-item>
      <el-form-item label="是否试玩" prop="isPlayGame">
        <el-tooltip v-model="isManual" class="item" manual effect="light" :content="limitTxt" placement="right">
          <el-switch
            :disabled="disabled"
            v-model="form.isPlayGame"
            :active-text="form.isPlayGame==0?'关闭':'开启'"
            :inactive-value="0"
            :active-value="1">
          </el-switch>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="游戏类型" prop="gameType">
        <el-select v-model.number="form.gameType" placeholder="请选择游戏类型">
          <el-option v-for="(item,index) in gameTypeData" 
            :key="index" 
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="游戏图标">
        <el-upload
          class="gameIcon-uploader upload-demo"
          action=""
          accept=".png,.jpg,.jpeg"
          :show-file-list="false"
          :before-upload="beforeUpload"
          :on-remove="imgRemove"
          :http-request="uploadFileImg">
          <img v-if="imageUrl" :src="imageUrl" class="gameIcon">
          <i v-else class="el-icon-plus gameIcon-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="游戏简介" prop="gameDesc">
        <el-input 
          v-model="form.gameDesc" 
          type="textarea" 
          :autosize="{ minRows: 2, maxRows: 4}" 
          placeholder="请填写游戏规则介绍" 
          maxlength="150"></el-input> 
      </el-form-item>
      <el-form-item label="版权归属" prop="gameGenlot">
        <el-input v-model="form.gameGenlot" placeholder="请输入版权归属"  maxlength="15" show-word-limit></el-input> 
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/javascript">
import rules from "@/utils/rules.js";
import { mapGetters } from 'vuex';

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
        gameName: [
          { required: true, validator: this.$rules.checkName, title: '游戏名称', trigger: ['change','blur'] }
        ],
        gameCode: [
          { required: true, validator: this.$rules.checkGameCode, title: '游戏编码', trigger: ['change','blur'] }
        ],
        gameType: [
          { required: true, message: '游戏类型不能为空', trigger: ['change','blur'] }
        ],
        gameGenlot: [
          { required: true, message: '版权归属不能为空', trigger: ['change','blur'] }
        ],
        // isTry: [
        //   { required: true, message: '是否试玩不能为空', trigger: ['change','blur'] }
        // ],
      },
      imgPath: [],
      imageUrl: '',
      isManual: false,
      limitTxt: '开启试玩，该游戏将作为试玩游戏',
      gameTypeData: [],
    }
  },
  created() {
    // 控制表单是否禁用
    this.disabled = this.$route.query.gameId ? true : false;
    this.getAllGameType()
  },
  watch: {
    form: {
      handler(val) {
        this.imageUrl = this.form.gameIcon;
        if(val.isPlayGame=='1') {
          this.isManual = true;
        }else{
          this.isManual = false;
        }
      },
      deep: true,
    },
  },
  methods: {
    // 获取游戏类型下拉框
    getAllGameType(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getAllGameType({ data });
        console.log(res);
        if (res && res.code == 0) {
          let array = []
          res.data.forEach((item)=>{
            let obj = {};
            obj.label = item.gameTypeName;
            obj.value = item.gameTypeCode;
            array.push(obj)
          })
          self.gameTypeData = array;
        }
      })(data);
    },
    // 图标上传
    async uploadFileImg(files) {
      let formData = new FormData();
      formData.append('file', files.file);
      formData.append("type", 1);
      const res = await this.$api.testUpload({
        timeout: 99999999999999,
        data: formData,
        onUploadProgress(evt) {
          let percent = ((evt.loaded / evt.total) * 100) | 0; //调用onProgress方法来显示进度条，需要传递个对象 percent为进度值
          files.onProgress({ percent: percent });
        }
      })
      if(res&&res.code==0) {
        console.log('上传成功', res);
        let obj = {};
        obj.name = res.data.fileName;
        obj.url = res.data.filePath;
        this.imgPath.push(obj);
        this.form.gameIcon = res.data.filePath;
        this.imageUrl = res.data.filePath;
        this.$message.success('上传成功')
      }
    },
    // 删除游戏图标的地址
    imgRemove(file) {
      this.imgPath.forEach((item,index)=>{
        if(item.indexOf(file.name)>-1) {
          this.imgPath.splice(index, 1);
        }
      })
    },
    // 限制游戏图标
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isLt1M) {
        this.$message.error('上传游戏图标大小不能超过 1MB!');
      }
      return isLt1M;
    },
  },
}
</script>

<style lang="less" scoped>
  .vlt-edit-wrap{
    width: 100%;
  }
  .gameIcon-uploader{
    width: 100px;
    height: 100px;
  }
</style>
