<template>
  <!-- 型号管理配件修改页面 -->
  <div class="vlt-card modelModification-page">
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
            <div class="typeSelect" v-for="(ele, index) in modelAvailablesList" :key="index">
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
              <el-button size="medium" class="vlt-delete-more" @click="clearDevice(index)" v-if="index > 0">删除</el-button>
              <!-- <i class="el-icon-close" @click="clearDevice(index)" v-if="index > 0"></i> -->
            </div>
            <el-button class="add-btn vlt-add-more" @click="addMochine">
              <i class="el-icon-plus"></i>
              <span>新增设备</span>
            </el-button>
          </div>
          <el-upload
            slot="upload"
            class="gameIcon-uploader"
            action
            :limit="3"
            accept=".png, .jpg, .jpeg"
            :show-file-list="false"
            :on-remove="handleRemove"
            :http-request="uploadFileImg"
          >
            <img v-if="imageUrl" :src="imageUrl" class="gameIcon" />
            <i v-else class="el-icon-plus gameIcon-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png/jpeg文件，且不超过500kb</div>
          </el-upload>
        </test-form>
        <el-row class="vlt-edit-btn">
          <el-button type="primary" v-prevent="1000" size="medium" @click="submit">提 交</el-button>
          <el-button size="medium" @click="cancel">取 消</el-button>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import rules from "@/utils/rules.js";

export default {
  name: "modelModification",
  data() {
    return {
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
        { title: "配件型号", type: "input", prop: "deviceModel", value: "" },
        { title: "配件单价(元)", type: "input", prop: "unitPrice", value: "" },
        {
          title: "供应商",
          type: "select",
          prop: "providerId",
          value: "",
          options: [
            { label: "供应商1", value: 1 },
            { label: "供应商2", value: 2 }
          ]
        },
        { title: "可用机型", type: "slot", prop: "slot", slotName: "device" },
        // { title: "预警上限", type: "input", prop: "upperLimit", value: "" },
        // { title: "预警下限", type: "input", prop: "lowerLimit", value: "" },
        { title: "厂家信息", type: "input", prop: "manufactorInfo", value: "" },
        { title: "上传图片", type: "slot", prop: "slot", slotName: "upload" },
        { title: "备注", type: "textarea", prop: "remark", value: "" }
      ],
      rules: {
        // equipmentName: [
        //   { required: true, validator: rules.checkEmpty, trigger: ['change','blur'] }
        // ],
        // equipmentPrice: [
        //   { required: true, validator: rules.checkEmpty, trigger: ['change','blur'] }
        // ],
        // upperLimit: [
        //   { required: true, validator: rules.checkEmpty, trigger: ['change','blur'] }
        // ],
        // lowerLimit: [
        //   { required: true, validator: rules.checkEmpty, trigger: ['change','blur'] }
        // ]
      },
      fileList: [
        {
          name: "food.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
        }
      ],
      imageUrl: "",
      imgUrl: "",
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
      deviceParam: {},
      modelBo:false
    };
  },
  watch: {
    modelAvailablesList: {
      handler(newValue, oldValue) {
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
  },
  methods: {
    init() {},
    //获取配件的详情
    async modelDetail() {
      const self = this;
      let id = this.$route.query.id;
      let result = await this.$api.modelDetail({ data: id });
      console.log('详情',result)
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
      });
      this.status = result.data.status;
    },

    // changeOption() {
    //   console.log("this.selectValue", this.selectValue);
    //   this.getModelTrees();
    //   // if (this.selectValue == 1) {
    //   //   this.getModelTrees(1);
    //   // } else if (this.selectValue == 2) {
    //   //   this.getModelTrees(2);
    //   // } else {
    //   //   this.getModelTrees();
    //   // }
    // },

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
            
            // this.modelOptions = option;
            self.$set(self.modelAvailablesList[index], "modelOptions", option);
            // this.modelAvailablesList[index].modelId =
            //   item.modelInfoVoList[0].modelId;
            // this.modelAvailablesList[index].modelOptions.options[0].label =
            //   item.modelInfoVoList[0].deviceModel;

            // console.log(
            //   "modelOptions",
            //   this.modelAvailablesList[index].modelOptions.options[0].value,
            //   item.modelInfoVoList[0].deviceModel,
            //   item.modelInfoVoList
            // );
            // this.modelAvailablesList[index].modelOptions.options[0].value = "";
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
      this.param = this.$formMethods.get(val);
      // if (val.goodsTypes === 0) {
      //   this.$set(this.equipmentData[1], "disabled", true);
      // } else if (val.goodsTypes === 1) {
      //   this.$set(this.equipmentData[1], "disabled", true);
      // } else {
      //   this.equipmentData[1].disabled = false;
      // }
    },
    changeOption() {
      // console.log(this.selectValue);
    },
    handlePictureCardPreview(file) {},
    //  移除文件
    handleRemove(res, file, fileList) {},
    beforeRemove(file, fileList) {},
    // 图标上传
    async uploadFileImg(files) {
      let formData = new FormData();
      formData.append("file", files.file);
      // formData.append('refId', '');
      // formData.append('flag', true);
      // formData.append('busType', 6);
      const res = await this.$api.uploadGoodsType({
        timeout: 99999999999999,
        data: formData,
        onUploadProgress(evt) {
          console.log("上传进度事件:", evt);
        }
      });
      if(res && res.code == 0){
        console.log("uploadFile", res);
        this.files = res.data.filePath;
        this.imgUrl = res.data.filePath;
        this.$message.success('图片上传成功')
      }
      
    },
    // 上传文件超出个数
    handleExceed(files, fileList) {},
    //提交保存
    async submit() {
      this.$refs.baseForm.validate(res => {
        let data = this.param;
        data.id = this.$route.query.id;
        data.files = this.files;
        data.status = this.status;
        // data.modelBo = this.modelBo
        delete data.slot;
        data.modelAvailablesList = this.deviceParam;
        console.log(data);
        this.modelWrite(data);
      }); 
    },

    // 修改配件
    async modelWrite(data) {
      const self = this;
      let result = await self.$api.modelWrite({ message: "修改成功", data });
      if (result.code === 0 && result) {
        setTimeout(function(){
          self.$router.push({name:"basicInfoManage"});
        },1000)
        console.log("result", result);
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
        // console.log('add', this.modelAvailablesList, this.modelAvailablesList[this.modelAvailablesList.length - 1].id);
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
  span {
    font-size: 12px;
  }
  .goods-cate {
    margin-left: 78px;
    margin-top: 20px;
  }
  .typeSelect {
    display: flex;
    align-items: center;
    margin-left: 0px;
    margin-top: 0px;
  }
  .el-icon-close {
    position: absolute;
    top: 15px;
    right: -20px;
    color: #333;
  }
  .add-btn {
    border: 1px dashed #ccc;
    text-align: center;
    height: 36px;
    line-height: 36px;
    margin-top: 20px;
    margin-left: 0;
    width: 400px;
    cursor: pointer;
  }
}
</style>
