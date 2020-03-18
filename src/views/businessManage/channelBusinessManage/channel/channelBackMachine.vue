<template>
  <!-- 渠道退机 -->
  <div class="vlt-card">
    <el-tabs v-model="active">
      <el-tab-pane label="渠道退机" name="1">
        <el-form
          :model="channelForm"
          ref="ruleForm"
          label-width="100px"
          label-position="right"
          :rules="rules"
          :disabled="editType"
        >
          <div class="vlt-edit-single">
            <panel title="基本信息" :show="true" style="margin-bottom:15px">
              <div style="margin-top:20px">
                <el-form-item label="申请标题" prop="title" v-if="isValid">
                  <el-input v-model.trim="channelForm.title" placeholder="请输入标题" maxlength="20" show-word-limit></el-input> 
                </el-form-item>
                <!-- <el-form-item label="渠道编号" prop="channelNo" style="margin-top:20px">
                  <el-select v-model="channelForm.channelNo" filterable placeholder="请选择渠道编号">
                    <el-option v-for="(item,index) in channelData" :key="index" :label="item.label" :value="item.label" 
                          @click.native="changeSelect(item)"></el-option>
                  </el-select>
              </el-form-item> -->
              <el-form-item label="渠道编号" prop="channelNo" style="margin-top:20px">
                <el-input @blur="selectChannelNo" v-model="channelForm.channelNo" maxlength="10" show-word-limit placeholder="请输入渠道编号"></el-input>
              </el-form-item>
              </div>
            </panel>
            <panel title="退机信息" :show="true" style="margin-bottom:15px">

              <el-row class="add-mochine" style="margin-top:20px">
                <el-form-item v-for="(item,index) in deviceData" :key="index" :label="`${item.title}${index+1}`">
                  <div class="add-select">
                    <el-select v-model="item.deviceName" placeholder="请选择设备" class="device-item"  :disabled="true">
                      <el-option v-for="(list,index) in item.optionName" :key="index" :label="list.label" :value="list.value"></el-option>
                    </el-select>
                    <el-select v-model="item.deviceId" placeholder="请选择投注终端" class="device-item"  :disabled="true">
                      <el-option v-for="(list,index) in item.optionTerminal" :key="index" :label="list.label" :value="list.value"></el-option>
                    </el-select>
                    <el-select v-model="item.modelId" placeholder="请选择设备型号" class="device-item" @change="changeModels(item.modelId, index)">
                      <el-option v-for="(list,index) in item.optinoModel" :key="index" :label="list.label" :value="list.value"></el-option>
                    </el-select>
                    <el-select v-model="item.serialNumber" placeholder="设备序列号" class="device-item"  @change="changeSerialNumber(item.serialNumber, item.modelId,index)">
                      <el-option v-for="(list,index) in item.optinoNumber" :key="index" :label="list.label" :value="list.value"></el-option>
                    </el-select>
                    <el-button v-if="index!==0"  class="delete" @click="deleteDevice(index)">删除</el-button>
                  </div>
                </el-form-item>
                <el-button class="addDevice vlt-add-more" @click="addDevice" icon="el-icon-plus" :disabled="addDisabel">添加设备</el-button>
              </el-row>
              <el-form-item label="退机原因" prop="causeResSubtract">
                <el-input type="textarea" v-model.trim="channelForm.causeResSubtract" style="width:400px"  maxlength="100"></el-input>
              </el-form-item>
            </panel>
            <panel title="其他事项" :show="true" style="margin-bottom:15px">
              <div class="vlt-edit-wrap">
                <el-form-item label="上传附件" v-if="!editType">
                  <el-upload
                    class="upload-demo"
                    drag
                    multiple
                    action
                    :show-file-list="true"
                    :file-list="fileList"
                    :on-remove="handlerRmoveFile"
                    :before-upload="beforeUploadFile"
                    :http-request="uploadFileOther"
                  >
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
                          <el-link
                            class="files-item-btn"
                            type="primary"
                            v-if="editType"
                            :underline="false"
                            @click="downLoad(item.url)"
                          >下载</el-link>
                        </li>
                      </ul>
                    </div>
                  </el-form-item>
              </div>
            </panel>
            <div class="submit-wrap" v-if="type == '0'">
              <el-row class="vlt-edit-btn">
                <el-button id="channelBackMachine-submit" type="primary" size="medium" @click="submit">提交</el-button>
                <el-button id="channelBackMachine-save" type="danger" plain size="medium" @click="save" v-if="isValid">暂存</el-button>
                <el-button id="channelBackMachine-cancel" size="medium" @click="cancel">取消</el-button>
              </el-row>
            </div>
          </div>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="渠道退机流程图" name="2" v-if="isValid">
        <img :src="diagramImg" alt=""></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/javascript">
import ajax from "@/utils/ajax.js"
import deviceInfo from "../components/channelDeviceInfo2";
import { Duplex } from 'stream';

export default {
  name: "channelBackMachine",
  data() {
    return {
      limitTxt: "温馨提示：暂无自营厅/合作厅的终端额度数据",
      addDisabel: true,
      diagramImg: '',
      active: "1",
      type: 0,
      rules: {
        title: [{ required: true, validator: this.$rules.checkName, title: '申请标题', trigger: ['change','blur'] }],
        channelNo: [ { required: true,  validator: this.$rules.checkChannelTenCode, title: '渠道编号', trigger: ['change','blur'] } ],
        causeResSubtract: [ { required: true, message: '请输入渠道退机原因', trigger: ['change','blur'] } ]
      },
      channelForm: {
        title: null,
        channelNo: null,
        causeResSubtract: null
      },
      isValid: false,
      deviceData:[
        {
          title: '资源类型',
          deviceId: '',
          modelId: '',
          serialNumber: '',
          deviceName: 1,
          optionName: [{label: '设备', value: 1}],
          optionTerminal: [],
          optinoModel: [],
          optinoNumber: []
        }
      ],
      isRepeatd: true,
      gameBagPath: [],
      channelData: [],
      modelDatas: [],
      warehouseGoodsData: [],
      normalData: [],
      warehouseGoodsInfoList: [],
      fileList: [],
      initfills: false,
      isDisUpload: false,
      editType: null,
      actBusinessInsId: null,
      channelId: null,
      isRepeat: false
    };
  },
  components: {
    deviceInfo
  },
watch: {
  fileList: {
    handler (newVal, oldVal){
        console.log(newVal.length);
      if (newVal.length > 4){
        this.isDisUpload = true;
      }
    },
    deep: true
  },
  actBusinessInsId: {
    handler (newVal, oldVal) {
      this.validProcess()
    },
    deep: true,
    immediate: true
  }
},
  created() {
    this.actBusinessInsId = this.$storage.get('userInfo').insId;
    if (this.$route.query.type) {
      this.editType = this.$route.query.type == 1 ? true : false;
      this.type = "" + this.$route.query.type;
    }
     if(this.$route.query.id) { // 获取表单数据详情
      let data = this.$route.query.id;
      this.getTaskData(data);
    } else {
      this.initfills = true;
    }

    this.getChannelInfoModifyList({});
    this.validProcess();
  },
  methods: {
    // 渠道编号失去焦点 请求数据
    selectChannelNo () {
      this.actBusinessInsId =  this.$storage.get("userInfo").insId;
      if(this.channelForm.channelNo&&this.channelForm.channelNo.length==10&&/^[0-9]*$/.test(this.channelForm.channelNo)) {
        let data = {
          insId: this.actBusinessInsId,
          channelNo: this.channelForm.channelNo,
        }
        this.getChannelByQry(data);
      }else{
        this.$message.warning('渠道编号不正确')
      }
    },
    getChannelByQry (data) {
      const self = this;
      (async data => {
        let res = await self.$api.getChannelByQry({ data });
        if (res && res.code == 0) {
          console.log(res.data);
          if (res.data) {
            self.isInit = false;
            self.channelId = res.data.channelId;
            self.channelList = {
              label: res.data.channelNo,
              value: res.data.channelNo,
              insId: res.data.insId,
              channelId: res.data.channelId
            }
            self.changeSelect(self.channelList.value);
          } else {
            this.$message.warning('请输入正确的渠道编号');
          }
        }
      })(data);
    },
    // 草稿回填数据
    getTaskData (data) {
      console.log(data);
      const _this = this;
      (async data => {
        let res = await _this.$api.getTaskData({ data });
        if (res && res.code == 0) {
          console.log("res", res.data);
          let data = JSON.parse(res.data.data);
          _this.init(data)
        } else {}
      })(data);
    },

    // 草稿回填初始化
    init(data){
      console.log('回填需要的数据',data);
      Object.assign(this.channelForm, data);
      this.channelForm.depositSet = '' + this.channelForm.depositSet;

      if (this.channelForm.channelNo) {
        this.changeSelect(this.channelForm.channelNo);
        let array = this.channelForm.attachId&&this.channelForm.attachId.split(',')
        array&&array.forEach((item)=>{
          let obj = {};
          obj.name = item.split('/')[item.split('/').length-1];
          obj.url = item;
          this.fileList.push(obj)
        });
      }
  
    },
    //  资源类型的回填
    fillDeviceTypes () {
      this.inFillData(this.deviceData[0], this.modelDatas);
      this.infillDevice(this.modelDatas, this.deviceData[0].optinoModel);
      if (this.$route.query.id) {
        if (!this.initfills) {
          // 显示列数 
          if (this.channelForm.warehouseGoodsInfoList.length) {
            let arrs = this.channelForm.warehouseGoodsInfoList;
            for (let i = 0; i < arrs.length; i++){
              if (i > 0) {
                this.addDevice();
              }
              // 填充数据
              this.changeModels(arrs[i].modelId, i);
              this.$set(this.deviceData[i], 'modelId', arrs[i].modelId);
              this.changeSerialNumber(arrs[i].goodsSerialNumber,  arrs[i].modelId, i);
              this.$set(this.deviceData[i], 'serialNumber',  arrs[i].goodsSerialNumber);
            }
          }
         this.initfills = true;
        }
      } 
    },

    // 是否审批流程校验
    validProcess() {
      const self = this;
      let router = this.$route.name;
      let data = {
        router,
        actBusinessInsId: this.actBusinessInsId
      };
      console.log(data);
      (async data => {
        let res = await self.$api.validProcess({ data });
        if(res && res.code == 0) {
          console.log('是否流程', res.data.valid);
          self.isValid = res.data.valid;
          self.diagramImg = `${ajax.baseURL}/act/business/diagram/${self.$route.name}/${self.actBusinessInsId}`
        }
      })(data);
    },
    // 获取渠道编号
    getChannelInfoModifyList (data) {
      const _this = this;
      (async (data) => {
        let  res = await _this.$api.getChannelInfoModifyList({data})
        console.log(res);
        if (res&&res.code == 0) {
          if (res.data && res.data.length) {
            _this.normalData = res.data;
            res.data.forEach(item => {
              _this.channelData.push({
                label: item.channelNo,
                value: item.channelNo,
                insId: item.insId,
                channelId: item.channelId
              })
            })
          }
        }
      })(data)
    },
    // 根据渠道编号下拉 获取其详情  
    getChannelResSubTractInfo (channelNo) {
      const _this = this;
      (async (data) => {
        let res = await _this.$api.getChannelResSubTractInfo({data});
        console.log(res);
        if (res&&res.code == 0) {
          if (res.data && res.data.length) {
            _this.modelDatas = res.data;
            _this.fillDeviceTypes ();
            _this.addDisabel = false;
          }
        }
      })(channelNo)
    },
    // 根据渠道编号下拉 获取其详情 
    changeSelect(val) {
      console.log('val',val);
      this.actBusinessInsId = val.insId;
      this.channelId = val.channelId;
      
      if (this.initfills) {
        this.deviceData.splice(1, (this.deviceData.length - 1));
        this.$set(this.deviceData[0], 'modelId', '');
        this.$set(this.deviceData[0], 'serialNumber',  '');
        this.warehouseGoodsInfoList = [];
        this.deviceData[0].optinoModel = [];
        this.deviceData[0].optinoNumber= [];
      }
      let vals = val.value ? val.value : val;
      this.getChannelResSubTractInfo (vals);
    },

    inFillData(obj,data) {
      console.log(obj,data,obj.optionTerminal);
      obj.deviceId = data[0].goodId;
      obj.optionTerminal.push({
        label: data[0].goodsName,
        value: data[0].goodId
      })
    },
    infillDevice (data, selectOptinoModel) {
      data.forEach(item => {
        let isDevice  = selectOptinoModel.every(element => element.value !== item.modelId);
        if (isDevice) {
          selectOptinoModel.push({
            label: item.deviceModel,
            value: item.modelId
          })
        }
      })
    },

    changeModels (val, index) {
      console.log(val);
      this.$set(this.deviceData[index], 'optinoNumber', []);
      this.modelDatas.forEach(item => {
        if (item.modelId == val) {
          this.deviceData[index].optinoNumber.push({
            label: item.goodsSerialNumber,
            value: item.goodsSerialNumber
          })
        }
      })
      this.$set(this.deviceData[index], 'serialNumber', '');
    },
    changeSerialNumber(val, model, index) {
      console.log(val, model, index);
      const _this = this;
      _this.modelDatas.forEach(item => {
        if (item.goodsSerialNumber == val && item.modelId == model) {
        let objs =  { 
            index: index,
            amount: item.amount,
            goodId: item.goodId,
            goodsSerialNumber:item.goodsSerialNumber,
            goodsType: item.goodsType,
            modelId: item.modelId,
            num: item.num,
            remark: item.remark,
            unitPrice: item.unitPrice
          }
          if (_this.warehouseGoodsInfoList.length) {
            _this.warehouseGoodsInfoList[index] = objs;
          } else {
            _this.warehouseGoodsInfoList.push(objs)
          }
        }
      })
      console.log(this.warehouseGoodsInfoList);
    },
    // 新增设备
    addDevice() {
      let obj = {
          title: '资源类型',
          deviceId: '',
          modelId: '',
          serialNumber: '',
          deviceName: 1,
          optionName: [{label: '设备', value: 1}],
          optionTerminal: [],
          optinoModel: [],
          optinoNumber: []
        }
      this.$set(this.deviceData, this.deviceData.length, obj);
      this.inFillData(this.deviceData[this.deviceData.length - 1], this.modelDatas);
      this.infillDevice(this.modelDatas, this.deviceData[this.deviceData.length - 1].optinoModel)
    },
    // 删除设备
    deleteDevice(index) {
      this.deviceData.splice(index, 1);
      this.warehouseGoodsInfoList.splice(index, 1);
    },
    beforeUploadFile(file) {
      const isLt20M = file.size / 1024 / 1024 < 50;
      if (!isLt20M) {
        this.$message.error("上传附件大小不能超过 50MB!");
      }
      return isLt20M;
    },

     // 附件上传
    async uploadFileOther(files) {
      let formData = new FormData();
      console.log("files", files.file.size / 1024);
      // this.softData[3].value = `${(files.file.size/1024).toFixed()}`
      formData.append("file", files.file);
      formData.append("type", 1);
      const res = await this.$api.uploadChannelFiles({
        timeout: 99999999999999,
        data: formData,
        onUploadProgress(evt) {
          //调用onProgress方法来显示进度条，需要传递个对象 percent为进度值
          let percent = ((evt.loaded / evt.total) * 100) | 0;
          files.onProgress({ percent: percent });
        }
      });
      console.log("uploadFile", res);
       if(res&&res.code==0) {

        // 判断是否存在
        this.isRepeat = false;
        this.fileList.forEach((item, index) => {
          if (files.file.name == item.name) {
            this.isRepeat = true;
          }
        });
        console.log(this.isRepeat);
        // push进fileList
        let obj = {};
        obj.name = res.data.fileName;
        obj.url = res.data.filePath;
        this.fileList.push(obj);
        console.log('----', this.fileList,this.fileList.length);
        if (this.fileList.length > 5) {
          this.fileList.splice(-1, 1);
          this.$message.error("上传附件数量不能超过5个");
          return;
        }
        if (this.isRepeat) {
          this.fileList.splice(-1, 1);
          this.$message.error("附件已存在，不能重复上传");
        } else {
          let array = [];
          this.fileList.forEach(item => {
            array.push(item.url);
          });
          this.channelForm.attachId = array.join(",");
          this.$message.success("上传成功");
        }
      } else {
        this.fileRemove(files.file);
      }
    },
    handlerRmoveFile(file) {
      console.log(file);
      this.fileList.forEach((item, index) => {
        if (item.name == file.name) {
          this.fileList.splice(index, 1);
        }
      });
      let array = [];
      this.fileList.forEach(item => {
        array.push(item.url);
      });
      this.channelData.attachId = array.join(",");
    },
     removeDuplicates(arrs) {
      let obj = {};
      let warehouseGoodsInfoList;
      arrs.forEach( item => { 
        delete item.index;
      });
      this.isRepeatd = true;
      console.log (arrs);
      this.channelForm.warehouseGoodsInfoList = arrs.filter(item => item != '' );
       this.channelForm.warehouseGoodsInfoList.forEach(item => {
         if (obj[item.goodsSerialNumber]) {
           this.isRepeatd = false;
           return;
         } else {
           obj[item.goodsSerialNumber] = true;
          //  this.isRepeatd = true;
         }
       })
       console.log(this.isRepeatd);

      // warehouseGoodsInfoList =  arrs.filter(item => item != '' ).reduce((cur,next) => {
      //        console.log(obj[next.goodsSerialNumber])
      //       obj[next.goodsSerialNumber] ? "" : obj[next.goodsSerialNumber] = true && cur.push(next);
      //       return cur;
      //   },[]) 
      // return warehouseGoodsInfoList;
    },
   
    postChannelResSubTract ( data ) {
      const _this = this;
      (async (data) => {
        let res = await _this.$api.postChannelResSubTract({message: '提交成功！', data});
        if (res && res.code == 0) {
          // if(_this.isValid) {
          //     _this.$router.push({ name: "myApplication" });
          //   } else {
              _this.$router.back();
            // }
        }
      })(data)
    },
    submit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {

          if (!this.warehouseGoodsInfoList.length) {
            this.$message.warning('请填写正确的资源类型');
            return;
          };

          this.removeDuplicates(this.warehouseGoodsInfoList);
          
          if (!this.isRepeatd ) {
           this.$message({
              showClose: true,
              message: '资源类型的设备序列号不能重复',
              type: 'warning'
            });
            return;
          };

          console.log(this.channelForm);
          let data = JSON.parse(JSON.stringify(this.channelForm));
          if(this.isValid) { // 走流程de参数
            let str = JSON.stringify(data)
            data.actBusiness = {
              router:'channelBackMachine',
              title: this.channelForm.title,
              id: this.$route.query.id, // 从我的申请-编辑 需要带上id
              data: str,
              actBusinessInsId: this.actBusinessInsId,
              channelId: this.channelId
            };
            if(!this.$route.query.id) { // 直接创建 不需要带上
              delete data.actBusiness.id;
            }
          }else { // 不需要走流程 不用申请标题
            delete data.title;
          }
          
          this.postChannelResSubTract ( data );
        } else {
          this.$message.warning('请填写正确表单'); 
          setTimeout(()=>{
            var isError= document.getElementsByClassName("is-error");
            isError[0].querySelector('input').focus();
          },100);
          return false;
        }
      })
    },
  // 暂存
    saveDraft(data) {
      const self = this;
      (async data => {
        let res = await self.$api.saveDraft({message: '保存成功！', data });
        if (res && res.code == 0) {
          console.log("res", res.data);
          self.$router.push({ name: "myApplication" });
        } else {}
      })(data);
    },
    save() {
      const self = this;

      let checkChannel = false;
      if(!self.channelForm.title) {
        self.$message.warning('申请标题不能为空！');
        return;
      }
      checkChannel = true;

      // this.channelForm.warehouseGoodsInfoList =  this.removeDuplicates(this.warehouseGoodsInfoList);
      this.removeDuplicates(this.warehouseGoodsInfoList);
          
      if (!this.isRepeatd ) {
        this.$message({
          showClose: true,
          message: '资源类型的设备序列号不能重复',
          type: 'warning'
        });
        return;
      };
      console.log(this.channelForm);
      let data = JSON.parse(JSON.stringify(this.channelForm));

      // 不走流程不用这个参数
      let params = {
        router: "channelBackMachine",
        title: self.channelForm.title,
        id: self.$route.query.id, // 从我的申请-编辑 需要带上id
        data: JSON.stringify(data),
        actBusinessInsId: this.actBusinessInsId,
        channelId: this.channelId
      };

      if (!self.$route.query.id) {
        // 直接暂存 不需要带上
        delete params.id;
      }
      self.saveDraft(params);
    },
    cancel() {
      this.$router.back();
    },
    downLoad (url) {
      // window.location.href= file;
      this.$download(1, url)
    }
  }
};
</script>
<style lang="less" scoped>
.addDevice {
  width: 100%;
  max-width: 400px;
  margin: 0 0 30px 98px;
  border-style: dashed;
}
.device-item {
  margin-right: 15px;
  width: 180px !important;
}
.device-form {
  padding: 16px 8px;
}
.delete {
  // padding-right: 0;
}
.submit-wrap {
  text-align: right;
  padding: 10px 0;
}
</style>
<style lang="less">
  .vlt-edit-single {
  .add-mochine {
    width: 150%;
    .el-form-item__content {
    }
    .addDevice {
      width: 510px;
      margin: 0 0 30px 100px;
    }
    .add-select {
      min-width: 880px;
    }
  }
}
.files {
  &-wrap {
    width: 360px;
  }
  &-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-content {
      flex: 1;
      padding: 0 16px 0 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: default;
    }
    &-icon {
      margin-right: 7px;
      color: #909399;
    }
  }
  &-item:hover {
    background-color: #f5f7fa;
    // color:#409EFF;
  }
}
</style>
