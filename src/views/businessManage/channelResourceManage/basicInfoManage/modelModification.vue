<template>
  <!-- 型号管理配件修改页面 -->
  <div class="vlt-card modelModification-page">
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
            <div slot="device">
              <div class="typeSelect" v-for="(ele, index) in modelAvailablesList" :key="index" :name="index">
                <el-select
                  v-model="ele.goodsId"
                  placeholder="请选择设备名称"
                  @change="changeDeviceId(ele.goodsId, index)"
                >
                  <el-option
                    v-for="(item,index) in nameOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-select v-model="ele.modelId" placeholder="请选择设备型号">
                  <el-option
                    v-for="(item,index) in ele.modelOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <!-- <i class="el-icon-close" @click="clearDevice(index)" v-if="index > 0"></i> -->

                <el-button size="medium" class="vlt-delete-more" @click="clearDevice(index)" v-if="index > 0">删除</el-button>
              </div>
              <el-button class="add-btn vlt-add-more" @click="addMochine" size="medium">
                <i class="el-icon-plus"></i>
                <span>新增设备</span>
              </el-button>
            </div>
            <el-upload
              slot="upload"
              class="imgIcon-uploader"
              action
              :limit="3"
              accept=".png, .jpg, .jpeg"
              list-type="picture-card"
              :file-list="imgList"
              :on-exceed="handleExceed"
              :on-remove="handleRemove"
              :before-upload="beforeUploadFile"
              :http-request="uploadFileImg"
            >
              <img v-if="imageUrl" :src="imageUrl" class="gameIcon" />
              <i v-else class="el-icon-plus"></i>
              <div slot="tip" class="el-upload__tip">只能上传以jpg/png/jpeg结尾的图片，只能上传3张，且不超过2M</div>
            </el-upload>
          </test-form>
          <el-row class="submit-btn">
            <el-button :id="'modelModification-submit'" type="primary" v-prevent="1000" size="medium" @click="submit">提 交</el-button>
            <el-button :id="'modelModification-cancel'" size="medium" @click="cancel">取 消</el-button>
          </el-row>
        </div>
      </div>
  </panel>
  </div>
</template>

<script type="text/javascript">
import rules from '@/utils/rules'
export default {
  name: "modelModification",
  data() {
    return {
      imgList:[],
      formData: [],
      type: 0,
      fitting: "",
      modelAvailablesList: [],
      nameOptions: [],
      falg: false,
      typeList: "",
      selectValue: this.$route.query.modelType,
      value: "",
      options: [{ value: 1, label: "设备" }, { value: 2, label: "配件" }],
      params: "",
      formParms: {
        nameOption: "",
        typeOption: 1
      },
      typeOption: [
        { label: "终端机", value: 1 },
        { label: "柜员机", value: 2 },
        { label: "其他", value: 3 }
      ],
      nameOption: [],
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
          title: "配件名称",
          type: "select",
          prop: "goodsId",
          value: "",
          options: []
        },
        { title: "配件型号", type: "input", prop: "deviceModel", value: ""
        },
        { title: "配件单价(元)", type: "input", prop: "unitPrice", value: ""},
        { title: "供应商", type: "input", prop: "provider",value:""},
        { title: "可用机型", type: "slot", prop: "slot", slotName: "device" },
        // { title: "预警上限", type: "input", prop: "upperLimit", value: "" },
        // { title: "预警下限", type: "input", prop: "lowerLimit", value: "" },
        { title: "厂家信息", type: "input", prop: "manufactorInfo", value: "" },
        { title: "上传图片", type: "slot", prop: "slot", slotName: "upload" },
        { title: "备注", type: "textarea", prop: "remark", value: "" }
      ],
      rules: {
        deviceModel: [
          { required: true, trigger: ['change','blur'], message:'配件型号不能为空'}
        ],
        unitPrice: [
          { required: true, validator: rules.numberVal, trigger: ['change','blur'] ,title:"单价" }
        ],
        device: [
          { required: true, trigger: ['change','blur'], message:'可用机型不能为空'}
        ],
        upperLimit:[
          { required: true, validator: rules.checkEmptyNumber, trigger: ['change','blur'] ,title:"预警上限" }
        ],
        lowerLimit:[
          { required: true, validator: rules.checkEmptyNumber, trigger: ['change','blur'] ,title:"预警下限" }
        ]
      },
      fileList: [
        {
          name: "food.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
        }
      ],
      imageUrl: "",
      imgUrl: [],
      goodsType: "",
      deviceDatas: {
        options: []
      },
      //表单数据
      list: "",
      //可用机型
      useDevice: "",
      goodsId: "",
      files: "",
      status: "",
      initArr: [],
      useDeviceData: [],
      param: {},
      deviceParam: [],
      modelBo:false
    };
  },
  watch: {
    modelAvailablesList: {
      handler(newValue, oldValue) {
        console.log('newVal', newValue);
        let res = JSON.parse(JSON.stringify(newValue));
        let params = [];
        res.forEach(item => {
          // 保留你需要的参数
          if (item.id) {
            let param = (({ modelId, id}) => ({
              modelId,
              id,
            }))(item);
            params.push(param);
          } else {
            let param = (({ modelId }) => ({
              modelId
            }))(item);
            params.push(param);
          }
        });
        this.deviceParam = params;
        console.log("params", params);
      },
      // 深度监听 监听对象，数组的变化
      deep: true
    }
  },
  async created() {
    //获取详情数据 回显
    this.formData = this.options;
    // this.goodsNameList();
    this.getModelTrees(2);
    this.getModelTrees(1);
    // this.addMochine();
  },
  methods: {
    init() {},
    //获取配件的详情
    async modelDetail() {
      const self = this;
      let id = this.$route.query.id;
      let result = await this.$api.modelDetail({ data: id });
      console.log('详情',result)
      if (result && result.code == 0) {
        this.goodsId = result.data.goodsModelVo.goodsId;
        result.data.goodsModelVo.modelAvailablesList.forEach((item, index) => {
          this.modelAvailablesList.push({
            id: item.id,
            goodsId: item.goodsId,
            modelId: item.modelId,
            nameOptions: this.nameOptions,
            modelOptions: []
          });
          self.changeDeviceId(item.goodsId, index);
        });
        console.log(result.data.goodsModelVo.modelAvailablesList);
        console.log("this.initArr", this.initArr);
        this.options.forEach(item => {
          item.value = result.data.goodsModelVo[item.prop];
          if (item.prop == "goodsType") {
            item.value = result.data.goodsType;
          }
          if (item.prop == 'unitPrice') {
            item.value = result.data.goodsModelVo[item.prop] / 100;
          }
        });
        this.status = result.data.goodsModelVo.status;
        if (result.data.goodsModelVo.files) {
          this.imgUrl = result.data.goodsModelVo.files.split(',');
        }
        console.log("create",this.imgUrl)
        let pictureList = result.data.goodsModelVo.files && result.data.goodsModelVo.files.split(',')
        if (pictureList && pictureList.length > 0) {
          pictureList.map(item =>{this.imgList.push({url: item})})
        }
      }
    },

    //可选机型change事件
    changeDeviceId(id, index) {
      const self = this;
      this.useDeviceData.forEach(item => {
        // console.log(this.useDeviceData)
        if (item.id == id) {
          let option = [];
          if (item.modelInfoVoList.length > 0) {
            for (let i = 0; i < item.modelInfoVoList.length; i++) {
              option.push({
                label: item.modelInfoVoList[i].deviceModel,
                value: item.modelInfoVoList[i].modelId
              });
            }
            self.$set(self.modelAvailablesList[index], "modelOptions", option);
          } else {
            this.modelAvailablesList[index].modelId = "";
            this.$set(
              this.modelAvailablesList[index].modelOptions,
              "options",
              []
            );
          }
        }
      });
    },
    // 获取物品名称列表
    async getModelTrees(goodsType) {
      let data = { goodsType };
      let res = await this.$api.getModelTrees({ data });
      if (goodsType == 1) {
        this.useDeviceData = res.data;
        let arr = res.data.map(item => {
          return { label: item.goodsName, value: item.id };
        });
        // 用于可用机型的下拉框
        this.nameOptions = arr;
        // this.$set(this.modelAvailablesList[0], "nameOptions", arr);
        this.modelDetail(); // 初始化
      } else {
        // 用于配件名称的下拉框
        let deviceData = res.data;
        // console.log(hi);
        let arr = deviceData.map(item => {
          return { label: item.goodsName, value: item.id };
        });
        this.$formMethods.set(this.options, "goodsId", "options", arr);
      }
    },
    changeTypeOption(val) {
      this.change(val);
      this.type = val;
    },
    change(val) {
      // console.log(val);
      if (val === 3) {
        this.falg = true;
        this.formParms.nameOption = "";
      } else if (val === 1 || val === 2) {
        this.typeOption.forEach(item => {
          this.nameOption.forEach(i => {
            if (item.value === val && item.label === i.label) {
              this.formParms.nameOption = i.value;
              this.falg = false;
            }
          });
        });
      }
    },
    changeForm(val) {
      console.log(val);
      this.param = this.$formMethods.get(val);
    },
    changeOption() {
      // console.log(this.selectValue);
    },
    handlePictureCardPreview(file) {},
    //  移除文件
    handleRemove(res) {
      console.log(res)
      this.imgUrl.forEach((item,index)=>{
        if(item.indexOf(res.url)>-1) {
          this.imgUrl.splice(index, 1);
          console.log("成功")
        }
      })
      console.log(this.imgUrl)
    },
    // 图标上传
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
        this.imgUrl.push(res.data.filePath);
        this.$message.success('图片上传成功')
      }
      
    },
    // 上传文件超出个数
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制只能上传三张图片`);
    },
    beforeUploadFile(file) {
      const isLt20M = file.size / 1024 / 1024 < 2;
      if (!isLt20M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      return isLt20M
    },
    //提交保存
    async submit() {
      this.$refs["baseForm"].validate( valid => {
        // console.log('valid ',valid, this.deviceParam);
        if (valid.isPass == true) {
          let data = this.param;
          data.id = this.$route.query.id;
          data.files = this.imgUrl&&this.imgUrl.join(',');
          data.status = this.status;
          data.unitPrice = parseInt(((this.param.unitPrice) * 100).toFixed(2));
          delete data.slot;
          data.modelAvailablesList = this.deviceParam;
          console.log(data);
          this.modelWrite(data);
        }
      }); 
    },

    // 修改配件
    async modelWrite(data) {
      const self = this;
      let result = await self.$api.modelWrite({ message: "修改成功", data });
      if (result.code === 0 && result) {
        self.$router.push({name:"modelManage"});
      }
    },
    //新增机型点击事件
    addMochine() {
      if (this.modelAvailablesList.length >= 0) {
        let option = [];
        for (let i = 0; i < this.deviceDatas.length; i++) {
          option.push({
            label: this.deviceDatas[i].goodsName,
            value: this.deviceDatas[i].id
          });
        }
        const param = {
          id: "",
          modelId: "",
          nameOptions: this.nameOptions,
          modelOptions: []
        };
        this.modelAvailablesList.push(param);
      }
    },
    //删除新增机型数据
    clearDevice(index) {
      if (this.modelAvailablesList.length < 2) {
        return;
      }
      let arr = this.modelAvailablesList.splice(index, 1);
      console.log('删除的数据',arr)
    },
    //取消
    cancel() {
      this.$router.back();
    }
  }
};
</script>

<style lang="less">
.modelModification-page {
  .upLoadImg {
    .el-form-item__label {
      margin-left: 52px;
    }
  }
  .goods {
    margin-left: 14px;
    display: inline-block;
  }
  // span {
  //   font-size: 12px;
  // }
  .goods-cate {
    margin-left: 78px;
    margin-top: 20px;
  }
  .typeSelect {
    display: flex;
    align-items: center;
    margin-left: 0px;
    margin-top: 0px;
    position: relative;
    &:not(:first-child) {
      margin-top: 10px;
    }
    .el-select {
      &:nth-of-type(1) {
        width: 50% !important
      }
      &:nth-of-type(2) {
        width: ~"calc(50% - 10px )"!important;
        margin-left: 10px;
      }
    }
  }
  .el-icon-close {
    position: absolute;
    top: 15px;
    right: -20px;
    color: #333;
    cursor: pointer;
  }
  .add-btn {
    border: 1px dashed #ccc;
    text-align: center;
    // height: 36px;
    // line-height: 36px;
    margin-top: 20px;
    margin-left: 0;
    width: 400px;
    cursor: pointer;
  }
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
