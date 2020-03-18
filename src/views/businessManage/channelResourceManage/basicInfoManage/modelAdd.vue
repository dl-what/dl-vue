<template>
  <!-- 型号管理新增页面 -->
  <div class="vlt-card modelAdd-page">
    <panel :show="true" title="新增型号">
    <div class="vlt-edit-single">
      <!-- <h2 class="title">新增型号管理</h2> -->
      <div class="vlt-edit-wrap">
        <!-- <span class="goods-cate">物品类别</span> -->
        <el-form class="goods" direction="right" label-width="10em" style="margin-top:20px;">
          <el-form-item label="物品类别">
            <el-select v-model="selectValue" placeholder="请选择" @change="changeOption">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-form
          v-if="selectValue === 1"
          label-position="right"
          label-width="10em"
          :model="form1"
          ref="form1">
          <base-form
            :formData="equipmentData"
            labelWidth="10em"
            ref="baseForm"
            :rules="rules2"
            direction="right"
            @change="changeForm"
          ></base-form>
          <el-form-item label="上传图片">
            <el-upload
              class="imgIcon-uploader"
              action="#"
              list-type="picture-card"
              :auto-upload="true"
              accept=".png, .jpg, .jpeg"
              :limit="3"
              :on-exceed="handleExceed"
              :http-request="uploadFileImg"
              :before-upload="beforeUploadFile"
              :on-remove="handleRemove">
              <i slot="default" class="el-icon-plus"></i>
              <div slot="tip" class="el-upload__tip">只能上传以jpg/png/jpeg格式的图片，只能上传3张，且不超过2M</div>
            </el-upload>
          </el-form-item>
        </el-form>

        <el-form v-else label-position="right" label-width="10em" :model="form2" ref="form2">
          <base-form
            :formData="mountingsData"
            labelWidth="10em"
            ref="baseForm"
            :rules="rules2"
            direction="right"
            @change="changeForm"
          ></base-form>
          <span class="goods-cate">可用机型</span>
          <el-form-item class="typeSelect" v-for="(ele, index) in modelAvailablesList" :key="index">
            <el-select
              v-model="ele.deviceId"
              placeholder="请选择设备名称"
              @change="changeDeviceId(ele.deviceId, index)"
            >
              <el-option
                v-for="(item,index) in ele.nameOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-select v-model="ele.modelId" placeholder="请选择设备型号">
              <el-option
                v-for="(item,index) in ele.modelOptions.options"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-button size="medium" class="vlt-delete-more" @click="clearDevice(index)" v-if="index > 0">删除</el-button>
          </el-form-item>
          <el-form-item>
            <el-button class="add-btn vlt-add-more" @click="addMochine">
              <i class="el-icon-plus"></i>
              <span>新增设备</span>
            </el-button>
          </el-form-item>
          <el-form-item label="上传图片"> 
          <el-upload
            class="imgIcon-uploader"
            action="#"
            list-type="picture-card"
            :auto-upload="true"
            accept=".png, .jpg, .jpeg"
            :limit="3"
            :on-exceed="handleExceed"
            :http-request="uploadFileImg"
            :on-remove="handleRemove"
            :before-upload="beforeUploadFile"
            >
            <i slot="default" class="el-icon-plus"></i>
            <div slot="tip" class="el-upload__tip">只能上传以jpg/png/jpeg格式的图片，只能上传3张，且不超过2M</div>
            <!-- <div slot="file" slot-scope="{file}">
              <img
                class="el-upload-list__item-thumbnail"
                :src="file.url" alt=""
              >
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-preview"
                  @click="handlePictureCardPreview(file)"
                >
                  <i class="el-icon-zoom-in"></i>
                </span>
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleDownload(file)"
                >
                  <i class="el-icon-download"></i>
                </span>
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </div> -->
            </el-upload>
          </el-form-item>

        </el-form>
        <el-row class="vlt-edit-btn">
          <el-button :id="'modelAdd-submit'" type="primary" v-prevent="1000" size="medium" @click="submit('form')">提 交</el-button>
          <el-button :id="'modelAdd-cancel'" size="medium" @click="cancel">取 消</el-button>
        </el-row>
      </div>
    </div>
    </panel>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import rules from "@/utils/rules.js";
export default {
  name: "modelAdd",
  data() {
    return {
      selectValue: 1,
      value: "",
      options: [{ value: 1, label: "设备" }, { value: 2, label: "配件" }],
      modelAvailablesList: [
        {
          //可用机型选择框
          id: 0,
          deviceId: "",
          modelId: "",
          nameOptions: [{ label: "", value: "" }, { label: "", value: "" }],
          modelOptions: {
            options: [{ label: "", value: "" }, { label: "", value: "" }]
          }
        }
      ],
      params: {},
      form1: {},
      form2: {},
      equipmentData: [
        // {title:'物品类别',type:'select',prop:'goodsCategory',options:[{label:'',value:''},{label:'',value:''}]},
        { title: "设备名称", type: "select", prop: "goodsId", options: [] },
        { title: "设备型号", type: "input", prop: "deviceModel", value: "" },
        { title: "设备单价(元)", type: "input", prop: "unitPrice", value: "" },
        { title: "供应商", type: "input", prop: "provider",value:""},
        // { title: "预警上限", type: "input", prop: "upperLimit", value: "" },
        // { title: "预警下限", type: "input", prop: "lowerLimit", value: "" },
        { title: "厂家信息", type: "input", prop: "manufactorInfo", value: "" },
        { title: "备注", type: "textarea", prop: "remark", value: "" }
      ],
      mountingsData: [
        {
          title: "配件名称",
          type: "select",
          prop: "goodsId",
          options: [{ label: "", value: "" }, { label: "", value: "" }]
        },
        { title: "配件型号", type: "input", prop: "deviceModel", value: "" },
        { title: "配件单价(元)", type: "input", prop: "unitPrice", value: "" },
        { title: "供应商", type: "input", prop: "provider",value:""},
        // { title: "预警上限", type: "input", prop: "upperLimit", value: "" },
        // { title: "预警下限", type: "input", prop: "lowerLimit", value: "" },
        { title: "厂家信息", type: "input", prop: "manufactorInfo", value: "" },
        { title: "备注", type: "textarea", prop: "remark", value: "" }
      ],
      rules2: {
        equipmentName: [
          { required: true, validator: rules.checkEmpty, trigger: ['change','blur']}
        ],
        goodsId: [{ required: true, trigger: ['change','blur'], message:"名称不能为空"  }],
        upperLimit: [
          { required: true, validator: rules.checkEmptyNumber, trigger: ['change','blur'] ,title:"预警上限" }
        ],
        lowerLimit: [
          { required: true, validator: rules.checkEmptyNumber, trigger: ['change','blur'],title: "预警下限" }
        ],
        unitPrice: [
          { required: true, validator: rules.numberVal, trigger: ['change','blur'], title: "单价" }
        ],
        deviceModel: [
          { required: true, validator: rules.checkEmpty, trigger: ['change','blur'] , message: "型号不能为空"}
        ],
        // equipmentPrice: [
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
      imgUrl: [],
      deviceDatas: {
        options: []
      },
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false
    };
  },
  components: {},
  computed: {},
  created() {
    this.$nextTick(()=>{
      this.changeOption();
    })
  },
  methods: {
    changeForm(val) {
      Object.assign(this.params, val);
      // console.log("派发出来的参数", this.params, val);
    },
    getModelTrees(type) {
      const _this = this;
      (async type => {
        let data = {};
        if (type == "") {
          data = "";
        } else {
          data = {
            goodsType: type
          };
        }
        let res = await _this.$api.getModelTrees({ data });
        if (res && res.code == 0) {
          let options = [];
          if (res.data) {
            res.data.forEach(item => {
              // if (item.modelInfoVoList.length > 0) {
              options.push({
                label: item.goodsName,
                value: item.id
              });
              // }
            });

            if (type == 1) {
              _this.$set(_this.equipmentData[0], "options", options);
              _this.setAddOptions(res.data);
            } else if (type == 2) {
              _this.$set(_this.mountingsData[0], "options", options);
            }
          } else {
            _this.$message.warning("没有获取到型号");
          }
        } else {
          // self.$message.warning(res.msg);
        }
        // console.log("返回的数据", res);
      })(type);
    },
    setAddOptions(data) { // 设置配件选项下 可用机型的下拉
    console.log(data)
      this.deviceDatas = data.filter(item => {
        return item.modelInfoVoList.length > 0;
      });
      let deviceDatasOptions = [];
      this.deviceDatas.forEach(item => {
        deviceDatasOptions.push({
          label: item.goodsName,
          value: item.id
        });
      });
      // console.log("00000", this.deviceDatas);
      this.modelAvailablesList[0].nameOptions = deviceDatasOptions;
    },
    changeOption() {
      // console.log(this.$refs,this.$refs.baseForm);
      this.$refs['baseForm'].resetForm();
      if (this.selectValue == 1) {
        this.getModelTrees(1);
      } else if (this.selectValue == 2) {
        this.getModelTrees(2);
      } else {
        this.getModelTrees();
      }
    },
    changeDeviceId(id, index) {
      this.deviceDatas.forEach(item => {
        if (item.id == id) {
          let option = [];
          if (item.modelInfoVoList.length > 0) {
            for (let i = 0; i < item.modelInfoVoList.length; i++) {
              option.push({
                label: item.modelInfoVoList[i].deviceModel,
                value: item.modelInfoVoList[i].modelId
              });
            }
            this.$set(
              this.modelAvailablesList[index].modelOptions,
              "options",
              option
            );
            this.modelAvailablesList[index].modelId = "";
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
      // console.log('this.modelOptions', this.modelAvailablesList.modelOptions[index]);
    },
    async uploadFileImg(files) {
      let formData = new FormData();
      formData.append("file", files.file);
      let res = await this.$api.modelImgUpload({
        timeout: 99999999999999,
        data: formData,
        onUploadProgress(evt) {
          console.log("上传进度事件:", evt);
        }
      });
      console.log("uploadFile", res);
      if (res && res.code == 0) {
        this.$message.success(res.data.msg);
        this.imgUrl.push(res.data.filePath);
        console.log("imgUrl", this.imgUrl, res.data.filePath);
      }
    },
    // 上传文件超出个数
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    //提交保存
    submit(form) {
      let modelAvailablesList = [];
      if (this.selectValue == 1) {
      } else if (this.selectValue == 2) {
        console.log('可用机型',this.modelAvailablesList);
        this.modelAvailablesList.forEach(item => {
          if (item.modelId != '') {
            modelAvailablesList.push({
              modelId: item.modelId
            });
          }
        });
        console.log(modelAvailablesList);
      }
      this.$refs["baseForm"].validate(async valid => {
        const self = this;
        if (valid === "true") {
          let data = self.params;
          if (self.selectValue == 2 && modelAvailablesList.length <= 0) {
            self.$message.warning('可用机型不能为空')
            return
          }
          console.log('表单数据',self.params);
          data.files = self.imgUrl.join(",");
          data.modelAvailablesList = modelAvailablesList;
          data.unitPrice = parseInt(((self.params.unitPrice) * 100).toFixed(2))
          console.log(data);
          let res = await self.$api.modelCreate({message: "新增成功", data });
          console.log(res);
          if (res && res.code == 0) {
            self.$router.push({ path: "modelManage" });
          }
        }
      });
    },
    clearDevice(index) {
      if (this.modelAvailablesList.length < 2) {
        return;
      }
      this.modelAvailablesList.splice(index, 1);
    },
    addMochine() {
      if (this.modelAvailablesList.length > 0) {
        let option = [];
        for (let i = 0; i < this.deviceDatas.length; i++) {
          option.push({
            label: this.deviceDatas[i].goodsName,
            value: this.deviceDatas[i].id
          });
        }
        const param = {
          id:
            this.modelAvailablesList[this.modelAvailablesList.length - 1].id +
            1,
          deviceId: "",
          modelId: "",
          nameOptions: option,
          modelOptions: {
            options: []
          }
        };
        this.modelAvailablesList.push(param);
        // console.log('add', this.modelAvailablesList, this.modelAvailablesList[this.modelAvailablesList.length - 1].id);
      }
    },
    cancel() {
      this.$router.back();
    },
    handleRemove(file) {
      console.log(file);
      this.imgUrl.forEach((item,index)=>{
        if(item.indexOf(file.name)>-1) {
          this.imgUrl.splice(index, 1);
        }
      })
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
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleDownload(file) {
      console.log(file);
    }
  }
};
</script>

<style lang="less">
.modelAdd-page {

  .goods {
    // margin-left: 16px;
    // display: inline-block;
  }
  .goods-cate {
    margin-left: 72px;
    margin-top: 20px;
    padding-top: 10px;
  }
  .typeSelect {
    position: relative;
    // margin-left: 52px;
    margin-top: -16px;
    // &:not(:first-child) {
    //   margin-top: 10px;
    // }
    .el-select {
      width: 190px !important;
      display: inline-block;
      &:first-child {
        margin-right: 20px;
      }
    }
  }
  .add-btn {
    border: 1px dashed #ccc;
    text-align: center;
    // height: 36px;
    // line-height: 36px;
    // margin-left: 50px;
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
}
</style>
<style lang="less" scoped>
.vlt-edit-btn{
  margin-left: 10em;
}
</style>