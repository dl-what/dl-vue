<template>
  <div class="vlt-card">
    <el-tabs v-model="active">
      <el-tab-pane label="渠道关停" name="1">
        <el-form
          :model="channelData"
          :rules="rules"
          ref="channelData"
          label-position="right"
          label-width="90px"
          @change="changeForm"
          :disabled="editType"
        >
          <div class="vlt-edit-single">
            <panel title="基本信息" :show="true" style="margin-bottom:15px">
              <div class="vlt-edit-wrap">
                <el-form-item label="申请标题" prop="title" v-if="isValid">
                  <el-input v-model.trim="channelData.title" placeholder="请输入标题" maxlength="20" show-word-limit></el-input> 
                </el-form-item>
                <!-- <el-form-item label="渠道编号" prop="channelNo">
                  <el-select v-model="channelData.channelNo" filterable placeholder="请选择渠道编号" >
                    <el-option
                      v-for="(items,index) in channelList"
                      :key="index"
                      :label="items.label"
                      @click.native="changeSelect(items)"
                      :value="items.value"
                    ></el-option>
                  </el-select>
                </el-form-item> -->
                <el-form-item label="渠道编号" prop="channelNo">
                  <el-input @blur="selectChannelNo" v-model="channelData.channelNo" maxlength="10" show-word-limit placeholder="请输入渠道编号"></el-input>
                </el-form-item>
                <!-- <el-form-item label="业务类型" prop="channelBusinessType">
                  <el-select v-model.number="channelData.channelBusinessType" placeholder="请选择业务类型" :disabled="true">
                    <el-option
                      v-for="(items,index) in addressTypeData"
                      :key="index"
                      :label="items.label"
                      @click.native="changeSelect(items)"
                      :value="items.value"
                    ></el-option>
                  </el-select>
                </el-form-item> -->
                <el-form-item label="关停原因" prop="causeClose">
                  <el-input type="textarea" placeholder="请输入关停原因" v-model.trim="channelData.causeClose" maxlength="150"></el-input>
                </el-form-item>
              </div>
            </panel>
            <panel title="资源回收" :show="true" style="margin-bottom:15px">
              <el-table :data="tableDatas.records" border>
                <!-- <el-table-column label="序号" fixed type="index" width="60px"></el-table-column> -->
                <el-table-column label="序号" width="55">
                  <template slot-scope="scope">
                  {{tableDatas.size*(tableDatas.current-1)+(scope.$index+1)}}
                  </template>
                </el-table-column>
                <el-table-column label="物品类型" prop="goodsType" min-width="120px"></el-table-column>
                <el-table-column label="物品名称" prop="goodsName" min-width="120px"></el-table-column>
                <el-table-column label="物品型号" prop="deviceModel" min-width="120px"></el-table-column>
                <el-table-column label="物品序列号" prop="goodsSerialNumber" min-width="120px"></el-table-column>
              </el-table>
              <table-paging
                position="right"
                :total="tableDatas.total"
                :currentPage="requestData.page"
                :pageSize="requestData.pageSize"
                @handleSizeChange="handleSizeChange"
                @handleCurrentChange="handleCurrentChange"
              ></table-paging>
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
            <div class="submit-wrap" v-if="type=='0'">
              <el-row class="vlt-edit-btn">
                <el-button id="channelStop-submit" type="primary" size="medium" @click="submit">提交</el-button>
                <el-button id="channelStop-save" type="danger" plain size="medium" @click="save" v-if="isValid">暂存</el-button>
                <el-button id="channelStop-cancel" size="medium" @click="cancel">取消</el-button>
              </el-row>
            </div>
          </div>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="渠道关停流程图" name="2" v-if="isValid">
        <img :src="diagramImg" alt=""></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

import ajax from "@/utils/ajax.js"
export default {
  name: "channelStop",
  data() {
    return {
      cascaderProps: {
        label: "text",
        value: "value",
        children: "children"
      },
      regionCode: "",
      limitTxt: "温馨提示：暂无自营厅/合作厅的终端额度数据",
      isAddMember: false,
      isValid: true,
      active: "1",
      channelData: {
        title: null,
        channelBusinessType: 2,
        channelNo: null,
        causeClose: null,
        attachId: null
      },
      rules: {
        title: [{ required: true, validator: this.$rules.checkName, title: '申请标题', trigger: ['change','blur'] }],
        // channelBusinessType: [ { required: true, validator: this.$rules.checkCode, title: "业务类型", trigger: ['change','blur'] } ],
        channelNo: [ { required: true, validator: this.$rules.checkCode, title: "渠道编号", trigger: ['change','blur'] } ],
        causeClose: [ { required: true, message: "关停原因不能为空", trigger: ['change','blur'] } ]
      },
      addressTypeData: [{ label: "渠道关停", value: 2 }],
      tableDatas: [],
      insData: [],
      type: 0,
      fileList: [],
      channelList: [],
      goodsTypeArr: ['设备','配件','耗材','设施'],
      requestData: {
          page: 1,
          pageSize: 20,
          param: {
            channelNo: ''
          }
      },
      diagramImg: '',
      editType: null,
      isDisUpload: false,
      actBusinessInsId: null,
      channelId: null,
      isRepeat: false
    };
  },
  created() {
    this.actBusinessInsId = this.$storage.get('userInfo').insId;
    if (this.$route.query.type) {
      this.editType = this.$route.query.type == 1 ? true : false;
      this.type = "" + this.$route.query.type;
    }

    this.getchannelInfoModifyList({});
    
    // if (!this.$route.params.data) {
    //   this.getChannelGameList();
    // }
    if(this.$route.query.id) { // 获取表单数据详情
      let data = this.$route.query.id;
      this.getTaskData(data);
    }
    this.validProcess();
    // this.getInsData();
  },
  watch: {
    "form.channelData.channelType"(newValue, oldValue) {
      this.form.financeData.channelType = newValue;
    },
    fileList: {
      handler (newVal, oldVal){
          console.log(newVal.length);
        // if (newVal.length > 4){
        //   this.isDisUpload = true;
        // }
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
  methods: {
    // 渠道编号失去焦点 请求数据
    selectChannelNo () {
      this.actBusinessInsId =  this.$storage.get("userInfo").insId;
      if(this.channelData.channelNo&&this.channelData.channelNo.length==10&&/^[0-9]*$/.test(this.channelData.channelNo)) {
        let data = {
          insId: this.actBusinessInsId,
          channelNo: this.channelData.channelNo,
        }
        this.getChannelByQry(data)
      }else{
        this.$message.warning('渠道编号不正确')
      }
    },
    getChannelByQry (data) {
      const self = this;
      (async data => {
        let res = await self.$api.getChannelByQry({ data });
        if (res && res.code == 0) {
          if (res.data) {
            self.isInit = false;
            self.channelId = res.data.channelId;
            console.log(res.data);
            self.channelList = {
              label: res.data.channelNo,
              value: res.data.channelNo,
              insId: res.data.insId,
              channelId: res.data.channelId
            }
            self.changeSelect(self.channelList);
          } else {
            self.$message.warning('请输入正确的渠道编号');
          }
        }
      })(data);
    },
    // 表单数据详情
    getTaskData(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getTaskData({ data });
        if (res && res.code == 0) {
          console.log("res", res.data);
          // let data = JSON.parse(res.data.data);
          this.initDatas  = JSON.parse(res.data.data);
          self.init(this.initDatas )
        } else {

        }
      })(data);
    },
    init (data) {
      console.log('回填的数据',data);
      Object.assign(this.channelData, data);
      this.putAdds = false;
      console.log(this.channelData.channelNo);
      let array = this.channelData.attachId&&this.channelData.attachId.split(',')
      array&&array.forEach((item)=>{
        let obj = {};
        obj.name = item.split('/')[item.split('/').length-1];
        obj.url = item;
        this.fileList.push(obj)
      })
      let obj = {};
      // console.log(this.channelList, this.channelData.channelNo);
      if (this.channelData.channelNo) {
        this.selectChannelNo ();
      }

      this.channelList.forEach(item => {
        if (item.value == this.channelData.channelNo) {
          Object.assign(obj, item);
          console.log('-----', obj);
          this.changeSelect(obj);
        }
      })
      
    },
     // 是否审批流程校验
    validProcess() {
      const self = this;
      let router = this.$route.name;
      let data = {
        router,
        actBusinessInsId: this.actBusinessInsId
      };
      (async data => {
        let res = await self.$api.validProcess({ data });
        if(res && res.code == 0) {
          console.log('校验流程',res.data.valid);
          self.isValid = res.data.valid;
          self.diagramImg = `${ajax.baseURL}/act/business/diagram/${self.$route.name}/${self.actBusinessInsId}`
        }
      })(data);
    },
    // 获取渠道编号
    getchannelInfoModifyList (data) {
      const _this = this;
      (async (data) => {
        let  res = await _this.$api.getChannelInfoModifyList({data})
        // console.log(res);
        if (res&&res.code == 0) {
          if (res.data && res.data.length) {
            res.data.forEach(item => {
              _this.channelList.push({
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
    getRemovalChannelNoDetail (request) {
      const _this = this;
      (async (request) => {
        const data =  JSON.parse(JSON.stringify(request));
        let res = await _this.$api.pageWarehouseGoodsInfoList({data});
        if (res&&res.code == 0) {
          if (res.data) {
            console.log(res.data);
            _this.tableDatas = res.data;
            _this.tableDatas.records&&_this.tableDatas.records.forEach(item => {
              item.goodsType = _this.goodsTypeArr[item.goodsType -1];
            })
          }
        }
      })(request)
    },
    // 根据渠道编号下拉获取 获取其详情 
    changeSelect(val) {
      console.log('val',val);
      this.requestData.param.channelNo = val.value  ? val.value : val;

      this.actBusinessInsId =  val.insId;
      this.channelId =  val.channelId;
      console.log(this.requestData.param.channelNo);
      this.getRemovalChannelNoDetail (this.requestData);
    },

    // 改变表单
    changeForm(val) {
      console.log(val);
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
    limit(val) {
      this.limitTxt = val;
    },
    changeDevice(val) {
      this.form.warehouseGoodsData = val;
    },
    beforeUploadFile(file) {
      const isLt20M = file.size / 1024 / 1024 < 50;
      if (!isLt20M) {
        this.$message.error("上传附件大小不能超过 50MB!");
      }
      return isLt20M;
    },
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
          this.channelData.attachId = array.join(",");
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
    

    save() {
      const self = this;
    
      let checkChannel = false;
      if(!self.channelData.title) {
        self.$message.warning('申请标题不能为空！');
        return;
      }
      checkChannel = true;

      // self.channelData.attachId = JSON.stringify(self.gameBagPath);
      let data = JSON.parse(JSON.stringify(self.channelData));

      // 不走流程不用这个参数
      let params = {
        router: "channelStop",
        title: self.channelData.title,
        id: self.$route.query.id, // 从我的申请-编辑 需要带上id
        data: JSON.stringify(data),
        actBusinessInsId: this.actBusinessInsId,
        channelId: this.channelId
      };
      
      if (!self.$route.query.id) {
        // 直接暂存 不需要带上
        delete params.id;
      }
      console.log('params', params);
      self.saveDraft(params);
    },
    // 渠道关停提交
    updateChannelCloseInfo(data) {
      const self = this;
      (async data => {
        let res = await self.$api.updateChannelCloseInfo({ message:'提交成功', data });
        if (res && res.code == 0) {
          // self.$message.success("提交成功");
          setTimeout(() => {
            // if(self.isValid) {
            //   self.$router.push({ name: "myApplication" });
            // } else {
              self.$router.back();
            // }
          }, 700);
        } else {
          // self.$message.warning(res.msg)
        }
      })(data);
    },
    // 提交
    submit() {
      const self = this;
      // self.channelData.attachId = JSON.stringify(self.gameBagPath);
      let data = JSON.parse(JSON.stringify(self.channelData));
      let checkChannel = false;
      self.$refs.channelData.validate(valid => {
        console.log(valid);
        if (valid) {
          checkChannel = true;
          if(self.isValid) { // 走流程de参数
            let str = JSON.stringify(data)
            data.actBusiness = {
              router:'channelStop',
              title: data.title,
              id: self.$route.query.id, // 从我的申请-编辑 需要带上id
              data: str,
              actBusinessInsId: this.actBusinessInsId,
              channelId: this.channelId
            };

            if(!self.$route.query.id) { // 直接提交 不需要带上
              delete data.actBusiness.id;
            }
          }else{ // 不走流程不用标题
            delete data.title;
          }
         
          self.updateChannelCloseInfo(data);
        } else {
          this.$message.warning('请填写正确表单'); 
          setTimeout(()=>{
            var isError= document.getElementsByClassName("is-error");
            isError[0].querySelector('input').focus();
          },100);
          return false;
        }
      });
    },
    cancel() {
      // 重置
      // let arrs = Object.keys(this.channelData);
      // for(let i = 0; i < arrs.length; i++){
      //   if ( arrs[i] != 'channelBusinessType') {
      //     this.channelData[arrs[i]] = '';
      //   }
      // }
      // this.$refs.uploadFiles.clearFiles();
      // this.uploadFiles()
      this.$router.back();
    },
    changeCity() {
      this.form.regionCode = this.regionCode[this.regionCode.length - 1];
    },
    handleSizeChange(val) {
      this.requestData.pageSize = val;
      this.getRemovalChannelNoDetail (this.requestData);
    },
    handleCurrentChange(val) {
      this.requestData.page = val;
      this.getRemovalChannelNoDetail (this.requestData);
    },
    downLoad (url) {
      // window.location.href= file;
      this.$download(1, url)
    }
  }
};
</script>


<style lang="less" scoped>
@import "../less/index.less";
.addMember,
.addDevice {
  width: 100%;
  max-width: 490px;
  margin: 0 0 30px 20px;
}
.addDevice {
  max-width: 468px;
  margin-left: 108px;
}
.vlt-card {
  margin-bottom: 10px;
}

.title-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.delete {
  padding-right: 30px;
}
.table,
.device-form {
  padding: 16px 8px;
}
.device-item {
  margin-right: 15px;
  width: 160px;
}
.submit-wrap {
  text-align: right;
  padding: 10px 0;
}
.flex-wrap {
  display: flex;
  align-items: center;
  .label {
    color: #444;
    font-size: 12px;
    flex: none;
    margin: 0 8px;
  }
}
// .addMember:focus{
//   background: #FFF;
//   border: 1px solid #DCDFE6;
//   color: #606266;
// }
.el-upload-list {
  overflow: hidden;
  background-color: #fff;
  border: 1px solid #c0ccda;
  border-radius: 6px;
  box-sizing: border-box;
  width: 148px;
  height: 148px;
  margin: 0 8px 8px 0;
  display: inline-block;
}
.el-upload-list__item-actions {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  cursor: default;
  text-align: center;
  color: #fff;
  opacity: 0;
  font-size: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.el-upload-list__item-actions:hover {
  opacity: 1;
}
.el-upload-list {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  font-size: 14px;
  color: #606266;
  line-height: 1.8;
  position: relative;
}
.upload-wrap {
  width: 148px;
  height: 148px;
  display: inline-block;
  overflow: hidden;
  margin: 0 8px 8px 0;
}
.el-upload-list__item-preview,
.el-upload-delete {
  margin: 0 15px;
  cursor: pointer;
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
