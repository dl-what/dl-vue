<template>
<!-- 型号管理设备修改 -->
  <div class="vlt-card facility-page">
    <panel :show="true" title="基本信息">
      <div class="vlt-edit-single">
        <div class="vlt-edit-wrap">
          <test-form
            :options="formData"
            ref="baseForm"
            labelWidth="140px"
            :rules="rules"
            direction="right"
            @change="changeForm"
          >
            <el-upload
              slot="upload"
              class="imgIcon-uploader"
              action
              :limit="3"
              accept=".png, .jpg, .jpeg"
              list-type="picture-card"
              :file-list="imgList"
              :on-exceed="handleExceed"
              :before-upload="beforeUploadFile"
              :on-remove="handleRemove"
              :http-request="uploadFileImg"
            >
              <img v-if="imageUrl" :src="imageUrl" class="gameIcon" />
              <i v-else class="el-icon-plus"></i>
              <div slot="tip" class="el-upload__tip">只能上传以jpg/png/jpeg结尾的图片，只能上传3张，且不超过2M</div>
            </el-upload>
          </test-form>
          <el-row class="submit-btn">
            <el-button :id="'facility-submit'" type="primary" v-prevent="1000" size="medium" @click="submit">提 交</el-button>
            <el-button :id="'facility-cancel'" size="medium" @click="cancel">取 消</el-button>
          </el-row>
        </div>
      </div>
  </panel>
  </div>
</template>

<script type="text/javascript">
import rules from '@/utils/rules'
export default {
  name: "",
  data() {
    return {
      options: [
        {
          title: "物品类别",
          type: "select",
          prop: "goodsType",
          value: 2,
          disabled: true,
          options: [{ label: "设备", value: 1 }, { label: "配件", value: 2 }]
        },
        {
          title: "设备名称",
          type: "select",
          prop: "goodsId",
          value: "",
          options: []
        },
        {
          title: "设备型号",
          type: "input",
          prop: "deviceModel",
          value: ""
        },
        { title: "设备单价(元)", type: "input", prop: "unitPrice", value: "" },
        { title: "供应商", type: "input", prop: "provider",value:""},
        // { title: "预警上限", type: "input", prop: "upperLimit", value: "" },
        // { title: "预警下限", type: "input", prop: "lowerLimit", value: "" },
        { title: "厂家信息", type: "input", prop: "manufactorInfo", value: "" },
        { title: "上传图片", type: "slot", prop: "slot", slotName: "upload" },
        { title: "备注", type: "textarea", prop: "remark", value: "" }
      ],
      rules: {
        deviceModel: [
          { required: true, trigger: ['change','blur'], message:'设备型号不能为空'}
        ],
        unitPrice: [
          { required: true, validator: rules.numberVal, trigger: ['change','blur'] ,title:"单价" }
        ],
      },
      formData: [],
      useDeviceData: [],
      modelId: "",
      files: "",
      imageUrl: "",
      imgUrl: [],
      imgList: []
    };
  },
  created() {
    this.formData = this.options;
    this.modelDetail();
    this.getModelTrees(1);
  },
  methods: {
    //获取配件的详情
    async modelDetail() {
      const self = this;
      let id = this.$route.query.id;
      let result = await this.$api.modelDetail({ data: id });
      if (result && result.code == 0) {
        console.log(result)
        this.goodsId = result.data.goodsModelVo.goodsId;
        this.modelId = result.data.goodsModelVo.id;
        this.options.forEach(item => {
          item.value = result.data.goodsModelVo[item.prop];
          if (item.prop == "goodsType") {
            item.value = 1;
          }
          if (item.prop == 'unitPrice') {
            item.value = result.data.goodsModelVo.unitPrice /100;
          }
        });
        this.status = result.data.goodsModelVo.status;
        if (result.data.goodsModelVo.files) {
          this.imgUrl = result.data.goodsModelVo.files.split(',')
        }
        let pictureList = result.data.goodsModelVo.files && result.data.goodsModelVo.files.split(',')
        if (pictureList && pictureList.length > 0) {
          pictureList.map(item =>{this.imgList.push({url: item})})
        }
      }
    },
    // 获取物品名称列表
    async getModelTrees(goodsType) {
      let data = { goodsType };
      let res = await this.$api.getModelTrees({ data });
      this.useDeviceData = res.data;
      let arr = res.data.map(item => {
        return { label: item.goodsName, value: item.id };
      });
      // 用于可用机型的下拉框
      // this.nameOptions = arr;
      this.$formMethods.set(this.options, "goodsId", "options", arr);
      // this.modelDetail(); // 初始化
    },
    changeForm(val) {
      this.param = this.$formMethods.get(val);
      console.log(this.param);
    },
    //提交保存
    async submit() {
      this.$refs.baseForm.validate(res => {
        let data = this.param;
        data.id = Number(this.$route.query.id);
        data.files = this.imgUrl&&this.imgUrl.join(',');
        data.status = this.status;
        data.unitPrice = parseInt(((this.param.unitPrice) * 100).toFixed(2));
        delete data.slot;
        data.modelAvailablesList = this.deviceParam;
        console.log(data);
        this.modelWrite(data);
        console.log('图片路径',this.files)
      });
    },
    //修改设备
    async modelWrite(data) {
      const self = this;
      let result = await self.$api.modelWrite({ message: "修改成功", data });
        if (result && result.code == 0){
        self.$router.push("modelManage");
      }
    },
    // 图片上传
    async uploadFileImg(files) {
      let formData = new FormData();
      formData.append("file", files.file);
      const res = await this.$api.modelImgUpload({
        timeout: 99999999999999,
        data: formData,
        onUploadProgress(evt) {
          console.log("上传进度事件:", evt);
        }
      });
      if(res && res.code == 0){
        console.log("uploadFile", res);
        this.files = res.data.filePath;
        console.log(this.imgUrl)
        this.imgUrl.push(res.data.filePath);
        this.$message.success('图片上传成功')
      }
    },
    handleExceed(files,fileList) {
      this.$message.warning(`当前限制只能上传三张图片`);
    },
    beforeUploadFile(file) {
      const isLt20M = file.size / 1024 / 1024 < 2;
      if (!isLt20M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      return isLt20M
    },
    //  移除文件
    handleRemove(res) {
      this.imgUrl.forEach((item,index)=>{
        if(item.indexOf(res.url)>-1) {
          this.imgUrl.splice(index, 1);
        }
      })
    },
    //取消
    cancel() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="less">
.facility-page{
  .imgIcon-uploader{
    width: 430px
  }
  .el-upload--picture-card {
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .el-upload-list--picture-card .el-upload-list__item {
    width: 100px;
    height: 100px;
  }
  .submit-btn{
    margin-left: 138px;
  }
}
</style>
