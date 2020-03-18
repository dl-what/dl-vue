
<template>
<!-- 类型管理修改页面 -->
  <div class="vlt-card">
    <panel :show="true" title="基本信息">
      <div class="vlt-edit-single modification-page">
        <div class="vlt-edit-wrap">
          <span class="goods-cate">物品类别</span>
          <el-form class="goods">
            <el-form-item >
              <el-select :class="$route.query ? 'isEdited': '' " v-model="goodsType" :disabled="true"  placeholder="请选择" @change="changeOption">
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
            labelWidth="140px"
            ref="baseForm"
            :rules="rules2"
            direction="right"
            @change="changeForm"
          ></base-form>
          <base-form
            v-else-if="this.goodsType === 2"
            :formData="mountingsData"
            labelWidth="140px"
            ref="baseForm"
            :rules="rules2"
            direction="right"
            @change="changeForm"
          ></base-form>
          <el-form v-else-if="this.goodsType === 3" label-width="140px">
            <base-form
              :formData="consumableData"
              labelWidth="140px"
              ref="baseForm"
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
                list-type="picture-card"
                :on-remove="handleRemove"
                :file-list="imgList"
                :on-exceed="handleExceed"
                :before-upload="beforeUploadFile"
                :http-request="uploadFileImg">
                <img v-if="imageUrl" :src="imageUrl" class="gameIcon">
                <i v-else class="el-icon-plus"></i>
                <div slot="tip" class="el-upload__tip">只能上传以jpg/png/jpeg结尾的图片，只能上传3张，且不超过2M</div>
              </el-upload>
            </el-form-item>
          </el-form>
          <el-form v-else-if="this.goodsType === 4" label-width="140px">
            <base-form
              :formData="facilitiesData"
              labelWidth="140px"
              ref="baseForm"
              :rules="rules2"
              direction="right"
              @change="changeForm"
            ></base-form>
            <el-form-item label="上传图片">
              <el-upload
                class="imgIcon-uploader"
                action=""
                :limit="3"
                accept=".png,.jpg,.jpeg"
                list-type="picture-card"
                :file-list="imgList"
                :on-remove="handleRemove"
                :on-exceed="handleExceed"
                :before-upload="beforeUploadFile"
                :http-request="uploadFileImg">
                <img v-if="imageUrl" :src="imageUrl" class="gameIcon">
                <i v-else class="el-icon-plus"></i>
                <div slot="tip" class="el-upload__tip">只能上传以jpg/png/jpeg结尾的图片，只能上传3张，且不超过2M</div>
              </el-upload>
            </el-form-item>
          </el-form>
          <el-row class="submit-btn"> 
            <el-button :id="'modification-submit'" type="primary" v-prevent="1000" size="medium" @click="submit">提 交</el-button>
            <el-button :id="'modification-cancel'" size="medium" @click="cancel">取 消</el-button>
          </el-row>
        </div>
      </div>
    </panel>
  </div>
</template>

<script type="text/javascript">
import rules from "@/utils/rules.js";
export default {
  name: "modification",
  data() {
    const self = this;
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      id: self.$route.query.id,          //跳转页面id
      imgUrl:[],
      imageUrl: '',
      imgList: [],
      params: {},
      options: [
        { value: 1, label: "设备" },
        { value: 2, label: "配件" },
        { value: 3, label: "耗材" },
        { value: 4, label: "设施" }
      ],
      goodsType: Number(self.$route.query.goodsType),
      equipmentData: [
        {title: '设备类型',type: 'select',prop:'deviceType', disabled: false, value: '', 
        options: 
        [
          {label: '终端机', value: 1},
          {label: '柜员机', value: 2},
          {label: '其它', value: 3}
        ]},
        { title: "设备名称", type: "input",disabled: true, prop: "goodsName", value: '' },
        { title: "设备单位", type: "input", prop: "deviceUnit", value: ''},
        {
          title: "是否标配",
          type: "radio",
          prop: "isStandard",
          value: 0,
          options: [{ label: "是", value: 1 }, { label: "否", value: 2 }]
        },
        {
          title: "是否回收",
          type: "radio",
          prop: "isRecovery",
          value: 0,
          options: [{ label: "是", value: 1 }, { label: "否", value: 2 }]
        },
        { title: "备注", type: "textarea", prop: "remark", value: 0  }
      ],
      facilitiesData: [
        { title: "设施名称", type: "input", prop: "goodsName", value: ''},
        { title: "设施编号", type: "input", prop: "code", value: ''},
        { title: "设施单价(元)", type: "input", prop: "unitPrice", value: ''},
        { title: "设施单位", type: "input", prop: "deviceUnit", value: ''},
        { title: "供应商", type: "input", prop: "provider",value:""},
        // { title: "预警上限", type: "input", prop: "upperLimit", value: ''},
        // { title: "预警下限", type: "input", prop: "lowerLimit", value: '' },
        { title: "厂家信息", type: "input", prop: "manufactorInfo", value: ''},
        { title: "备注", type: "textarea", prop: "remark", value: '' }
      ],
      consumableData:[
        {title: '耗材类型', type: 'select',disabled: false, prop: 'consumablesType', value: 1,
        options:[{label: '投注卡', value:1},{label:'其它',value:2}]},
        { title: "耗材名称", type: "input",disabled: true, prop: "goodsName", value: '' },
        { title: "耗材编号", type: "input", prop: "code", value: '' },
        { title: "耗材单价(元)", type: "input", prop: "unitPrice", value: ''},
        { title: "耗材单位", type: "input", prop: "deviceUnit", value: ''},
        { title: "供应商", type: "input", prop: "provider",value:""},
        // { title: "预警上限", type: "input", prop: "upperLimit", value: '' },
        // { title: "预警下限", type: "input", prop: "lowerLimit", value: '' },
        { title: "厂家信息", type: "input", prop: "manufactorInfo", value: '' },
        { title: "备注", type: "textarea", prop: "remark", value: '' }
      ],
      mountingsData:[
        { title: "配件名称", type: "input", prop: "goodsName", value: '' },
        { title: "配件单位", type: "input", prop: "deviceUnit", value: ''},
        {
          title: "是否回收",
          type: "radio",
          prop: "isRecovery",
          value: 0,
          options: [{ label: "是", value: 1 }, { label: "否", value: 2 }]
        },
        { title: "备注", type: "textarea", prop: "remark", value: '' }
      ],
      rules2: {
        goodsName: [
          { required: true, validator: rules.checkEmpty, trigger: ['change','blur'] }
        ],
        unitPrice: [
          { required: true, validator: rules.donationAmount, title:"单价", trigger: ['change','blur'] }
        ],
        deviceUnit: [
          { required: true, message: "单位不能为空", trigger: ['change','blur'] }
        ],
        upperLimit: [
          { required: true, validator: rules.checkEmptyNumber, trigger: ['change','blur'] }
        ],
        lowerLimit: [
          { required: true, validator: rules.checkEmptyNumber, trigger: ['change','blur'] }
        ],
        isStandard: [
          { required: true, validator: rules.checkEmpty, trigger: ['change','blur'] }
        ],
        isRecovery: [
          { required: true, validator: rules.checkEmpty, trigger: ['change','blur'] }
        ]
      },
      reslt:'',
      selectDeviceType: ''
    };
  },
  components: {},
async created(data) {
    // 编辑回填
    let id = this.$route.query.id
    let reslt =await this.$api.getDetail({data:id})
    if (reslt && reslt.code == 0) {
      this.reslt = reslt.data
      console.log(reslt)
      let obj = [
        ...this.mountingsData,
        ...this.consumableData,
        ...this.facilitiesData,
        ...this.equipmentData
      ]
      let arr = reslt.data;
      console.log(arr)
      for (let i in arr) {
        obj.forEach(item =>{
          if (i == item.prop) {
            item.value = arr[item.prop]
            if (item.prop == 'unitPrice') {
              item.value = arr[item.prop] / 100;
            }
          }
        })
      }
      if (reslt.data.files) {
        this.imgUrl = reslt.data.files.split(',');
      }
      let pictureList = reslt.data.files && reslt.data.files.split(',')
      if (pictureList && pictureList.length > 0) {
        pictureList.map(item =>{this.imgList.push({url: item})})
      }
    }
    
  },
  methods: {
    submit() {
      const self = this;
      this.$refs['baseForm'].validate(async valid=>{
        if(valid === 'true') {
          let data = self.params;
          if(data.goodsType==3||data.goodsType==4) {
            data.files = self.imgUrl&&self.imgUrl.join(',');
            data.unitPrice = parseInt(((self.params.unitPrice) * 100).toFixed(2));
          }      
          let res = await self.$api.modification({data})
          console.log(self.params)
          if(res && res.code == 0){
            self.$message.success('修改成功')
            self.$router.push({path: 'typeManage'})
          }
        }
      })
    },
    cancel() {
      this.$router.back();
    },
    changeForm(val) {
      this.equipmentData.forEach((item)=>{
        item.value = val[item.prop]
        this.$set(item, 'value', item.value)
      })
      if(val.deviceType != ''){
        if (val.deviceType != this.selectDeviceType) {
        if(val.deviceType === 1){
          this.$set(this.equipmentData[1], 'disabled', true)
          this.$set(this.equipmentData[1], 'value','终端机')
        }else if(val.deviceType === 2){
          this.$set(this.equipmentData[1], 'disabled', true)
          this.$set(this.equipmentData[1], 'value','柜员机')
        }else{
          // this.$set(this.equipmentData[1], 'value','')
          this.equipmentData[1].disabled = false;
        }
        // console.log("派发出来的参数", val);
          this.selectDeviceType = val.deviceType; 
        } else {}
        this.params = Object.assign({goodsType:this.goodsType},this.reslt, val);
        console.log('param', this.params)
      }
      if(this.goodsType === 3){
        this.consumableData.forEach(el =>{
          el.value = val[el.prop];
          this.$set(el, 'value', el.value)
        });
        if (val.consumablesType != '') {
          if (val.consumablesType === 1) {
            this.$set(this.consumableData[1], "disabled", true)
            this.$set(this.consumableData[1], "value" , '投注卡')
          }else {
            this.consumableData[1].disabled = false;
            // this.consumableData[1].value = ' '
          }
        }
      }
    },
    changeOption() {
      console.log(this.goodsType);
    },
    // 图片上传
    async uploadFileImg(files) {
      const self = this;
      let formData = new FormData();
      formData.append('file', files.file);
      const res = await this.$api.uploadGoodsType({
        timeout: 99999999999999,
        data: formData,
        onUploadProgress(evt) {
          console.log('上传进度事件:', evt)
        }
      })
      console.log('uploadFile', res);
      this.imgUrl.push(res.data.filePath);
      console.log(this.imgUrl)
    },

    handleRemove(file) {
      console.log(file);
      this.imgUrl.forEach((item,index)=>{
        console.log(item)
        if(item.indexOf(file.url)>-1) {
          console.log(index)
          this.imgUrl.splice(index, 1);
        }
      })
      console.log(this.imgUrl)
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

<style lang="less" sco-ped>
.modification-page {
  .goods {
    margin-left: 10px;
    display: inline-block;
  }
  // span {
  //   font-size: 12px;
  // }
  .goods-cate {
    margin-left: 74px;
    margin-top: 20px;
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
  .isEdited {
    .el-input__suffix {
      display: none;
    }
  }
  .submit-btn{
    margin-left: 138px;
  }
}
</style>
