<template>
  <!-- 类型管理新增页面 -->
  <div class="vlt-card">
    <panel :show="true" title="新增类型">
      <div class="vlt-edit-single typeAdd-page">
        <!-- <h2 class="title">新增类型管理</h2> -->
        <div class="vlt-edit-wrap">
          <!-- <span class="goods-cate">物品类别</span> -->
          <el-form class="goods" direction="right" label-width="10em" style="margin-top:20px;">
            <el-form-item label="物品类别">
              <el-select v-model="goodsType" placeholder="请选择" @change="changeOption">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <base-form
            v-if="this.goodsType === 1"
            :formData="equipmentData"
            labelWidth="10em"
            ref="baseForm1"
            :rules="rules2"
            direction="right"
            @change="changeForm"
          ></base-form>
          <base-form
            v-else-if="this.goodsType === 2"
            :formData="mountingsData"
            labelWidth="10em"
            ref="baseForm1"
            :rules="rules2"
            direction="right"
            @change="changeForm"
          ></base-form>
          <!-- 耗材 -->
          <el-form v-else-if="this.goodsType === 3" label-width="10em">
            <base-form
              :formData="consumableData"
              labelWidth="10em"
              ref="baseForm1"
              :rules="rules2"
              direction="right"
              @change="changeForm"
            ></base-form>
            <el-form-item label="上传图片">
              <el-upload
                class="imgIcon-uploader"
                action
                :limit="3"
                accept=".png, .jpg, .jpeg"
                :on-exceed="handleExceed"
                list-type="picture-card"
                :on-remove="handleRemove"
                :before-upload="beforeUploadFile"
                :http-request="uploadFileImg"
              >
                <img v-if="imageUrl" :src="imageUrl" class="gameIcon" />
                <i v-else class="el-icon-plus"></i>
                <div slot="tip" class="el-upload__tip">只能上传以.jpg/.png/.jpeg格式的图片，只能上传3张，且不超过2M</div>
              </el-upload>
            </el-form-item>
          </el-form>
          <!-- 设施 -->
          <el-form v-else label-width="10em">
            <base-form
              :formData="facilitiesData"
              labelWidth="10em"
              ref="baseForm1"
              :rules="rules2"
              direction="right"
              @change="changeForm"
            ></base-form>
            <el-form-item label="上传图片">
              <el-upload
                class="imgIcon-uploader"
                action
                :limit="3"
                list-type="picture-card"
                accept=".png, .jpg, .jpeg"
                :on-exceed="handleExceed"
                :before-upload="beforeUploadFile"
                :on-remove="handleRemove"
                :http-request="uploadFileImg"
              >
                <img v-if="imageUrl" :src="imageUrl" class="gameIcon" />
                <i v-else class="el-icon-plus"></i>
                <div slot="tip" class="el-upload__tip">只能上传以.jpg/.png/.jpeg格式的图片，只能上传3张，且不超过2M</div>
              </el-upload>
            </el-form-item>
          </el-form>
          <el-row class="vlt-edit-btn">
            <el-button :id="'addEquipment-submit'" type="primary" v-prevent="1000" size="medium" @click="submit('form')">提 交</el-button>
            <el-button :id="'addEquipment-cancel'" size="medium" @click="cancel">取 消</el-button>
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
  name: "addEquipment",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      options: [
        { value: 1, label: "设备" },
        { value: 2, label: "配件" },
        { value: 3, label: "耗材" },
        { value: 4, label: "设施" }
      ],
      goodsType: 1,
      equipmentData: [
        {
          title: "设备类型",
          type: "select",
          prop: "deviceType",
          value: 1,
          options: [
            { label: "终端机", value: 1 },
            { label: "柜员机", value: 2 },
            { label: "其它", value: 3 }
          ]
        },
        { title: "设备名称", type: "input-limit", maxlength: 20, disabled: true, prop: "goodsName", value: "" },
        { title: "设备单位", type: "input-limit", prop: "deviceUnit", value: "",maxlength:10 },
        {
          title: "是否标配",
          type: "radio",
          prop: "isStandard",
          value: 1,
          options: [{ label: "是", value: 1 }, { label: "否", value: 2 }]
        },
        {
          title: "是否回收",
          type: "radio",
          prop: "isRecovery",
          value: 1,
          options: [{ label: "是", value: 1 }, { label: "否", value: 2 }]
        },
        { title: "备注", type: "textarea", prop: "remark", value: "" }
      ],
      facilitiesData: [
        { title: "设施名称", type: "input-limit", maxlength: 20, prop: "goodsName", value: "" },
        { title: "设施编号", type: "input", prop: "code", value: "" },
        { title: "设施单价(元)", type: "input", prop: "unitPrice", value: "" },
        { title: "设施单位", type: "input-limit", maxlength: 10, prop: "deviceUnit", value: "" },
        { title: "供应商", type: "input", prop: "provider",value:""},
        // { title: "预警上限", type: "input", prop: "upperLimit", value: "" },
        // { title: "预警下限", type: "input", prop: "lowerLimit", value: "" },
        { title: "厂家信息", type: "input", prop: "manufactorInfo", value: "" },
        { title: "备注", type: "textarea", prop: "remark", value: "" }
      ],
      consumableData: [
        {title: '耗材类型', type: 'select', prop: 'consumablesType', value: 1,
        options:[{label: '投注卡', value:1},{label:'其它',value:2}]},
        { title: "耗材名称", type: "input-limit", maxlength: 20, prop: "goodsName", value: "", disabled: true,},
        { title: "耗材编号", type: "input", prop: "code", value: "" },
        { title: "耗材单价(元)", type: "input", prop: "unitPrice", value: "" },
        { title: "耗材单位", type: "input-limit", maxlength:10, prop: "deviceUnit", value: "" },
        { title: "供应商", type: "input", prop: "provider",value:""},
        // { title: "预警上限", type: "input", prop: "upperLimit", value: "" },
        // { title: "预警下限", type: "input", prop: "lowerLimit", value: "" },
        { title: "厂家信息", type: "input", prop: "manufactorInfo", value: "" },
        { title: "备注", type: "textarea", prop: "remark", value: "" }
      ],
      mountingsData: [
        { title: "配件名称", type: "input-limit", maxlength: 20, prop: "goodsName", value: "" },
        { title: "配件单位", type: "input-limit", maxlength: 10, prop: "deviceUnit", value: "" },
        {
          title: "是否回收",
          type: "radio",
          prop: "isRecovery",
          value: 1,
          options: [{ label: "是", value: 1 }, { label: "否", value: 2 }]
        },
        { title: "备注", type: "textarea", prop: "remark", value: "" }
      ],
      rules2: {
        goodsCategory: [
          { required: true, validator: rules.checkEmpty, trigger: ['change','blur'] }
        ],
        goodsName: [
          { required: true,validator: this.$rules.checkName,  title:"物品名称", trigger: ['change','blur'] }
        ],
        consumablesType: [
          { required: true, validator: rules.checkEmpty, trigger: ['change','blur'] }
        ],
        unitPrice: [
          { required: true, validator: rules.donationAmount, title:"单价", trigger: ['change','blur'] }
        ],
        deviceUnit: [
          { required: true, validator: rules.checkIsChinese, title: '单位', trigger: ['change','blur'] }
        ],
        isStandard: [
          { required: true, validator: rules.checkEmpty, trigger: ['change','blur'] }
        ],
        isRecovery: [
          { required: true, validator: rules.checkEmpty, trigger: ['change','blur'] }
        ],
        // upperLimit: [
        //   { required: true, validator: rules.checkEmpty, trigger: ['change','blur'] }
        // ],
        // lowerLimit: [
        //   { required: true, validator: rules.checkEmpty, trigger: ['change','blur'] }
        // ]
      },
      imageUrl: '',
      imgUrl:[],
      params: {},
      ownName: '',
      selectDeviceType: '',
      selectConsumablesType: ''
    };
  },
  created() {},
  components: {},
  methods: {
    // 图片上传
    async uploadFileImg(files) {
      let formData = new FormData();
      formData.append("file", files.file);
      const res = await this.$api.uploadGoodsType({
        timeout: 99999999999999,
        data: formData,
        onUploadProgress(evt) {
          console.log("上传进度事件:", evt);
        }
      })
      console.log('uploadFile', res);
      if(res && res.code == 0){
        console.log("aa",res)
        this.$message.success(res.data.msg)
        this.imgUrl.push(res.data.filePath);
        console.log(this.imgUrl)
      }
    },
    changeOption() {
      console.log(this.goodsType);
      if (this.goodsType == 1) {
        this.params.goodsType = 1;
        console.log('params,,', this.params);
        this.$set(this.equipmentData[0], 'value', 1);
      }
    },
    submit(formName) {
      const self = this
      this.$refs['baseForm1'].validate(async valid=>{
        if(valid === 'true') {
          let data = self.params;
          if (data.goodsType == 2 ) {
            console.log('配件',data)
            data.deviceType = null;
            if (data.deviceUnit == '') {
              self.$message.warning('单位不能为空');
              return;
            }
          }
          if(data.goodsType==3||data.goodsType==4) {
            data.files = self.imgUrl.join(',');
            data.unitPrice = parseInt(((self.params.unitPrice) * 100).toFixed(2))
          };
          console.log(data)
          let res = await self.$api.typeCreate({message: '新增成功',data})
          console.log(res)
          if(res && res.code == 0){
            self.$router.push({path: 'typeManage'})
          }
        }
      });
    },
    cancel() {this.$router.back()},
    changeForm(val) {
      // console.log(val.goodsName);
      this.equipmentData.forEach(item => {
        item.value = val[item.prop];
        this.$set(item, "value", item.value);
      });
      if (val.deviceType != "") {
        if (val.deviceType != this.selectDeviceType) {
          if (val.deviceType === 1) {
            this.$set(this.equipmentData[1], "disabled", true);
            this.$set(this.equipmentData[1], "value", "终端机");
          } else if (val.deviceType === 2) {
            this.$set(this.equipmentData[1], "disabled", true);
            this.$set(this.equipmentData[1], "value", "柜员机");
          } else if (val.deviceType === 3){
            this.equipmentData[1].disabled = false;
            this.$set(this.equipmentData[1], 'value', '');
            // this.equipmentData[1].value = ''
          }
          this.selectDeviceType = val.deviceType; 
        } else {}
        this.params = Object.assign({ goodsType: this.goodsType }, val);
        console.log("param", this.params);
      }
      if(this.goodsType === 3){
        this.consumableData.forEach(el =>{
          el.value = val[el.prop];
          this.$set(el, 'value', el.value)
        });
        if (val.consumablesType != '') {
          if (val.consumablesType != this.selectConsumablesType){
            if (val.consumablesType === 1) {
              this.$set(this.consumableData[1], "disabled", true)
              this.$set(this.consumableData[1], "value" , '投注卡')
            }else {
              this.consumableData[1].disabled = false;
              this.$set(this.consumableData[1], 'value', '');
            }
            this.selectConsumablesType = val.consumablesType;
          }else {}
        }
      }
    },
    beforeUploadFile(file) {
      const isLt20M = file.size / 1024 / 1024 < 2;
      if (!isLt20M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      return isLt20M
    },
    handleExceed(files,fileList) {
      this.$message.warning(`当前限制只能上传三张图片`);
    },
    handleRemove(file) {
      // console.log(this.imgUrl)
      this.imgUrl.forEach((item,index)=>{
        if(item.indexOf(file.name)>-1) {
          this.imgUrl.splice(index, 1);
        }
      })
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
.typeAdd-page {
  .goods {
    // margin-left: 14px;
    // display: inline-block;
  }
  .goods-cate {
    margin-left: 70px;
    margin-top: 20px;
  }
  .imgIcon-uploader{
    width: 430px;
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
