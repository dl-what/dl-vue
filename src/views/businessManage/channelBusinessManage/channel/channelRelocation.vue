<template>
  <div class="vlt-card">
    <el-tabs v-model="active">
      <el-tab-pane label="渠道迁址" name="1">
        <div class="vlt-edit-single">
          <el-form :model="channelData" :rules="rules" ref="forms" label-position="right" label-width="100px" @change="changeForm"  :disabled="editType">
            <panel title="基本信息" :show="true" style="margin-bottom:15px">
              <div class="vlt-edit-wrap">
                <el-form-item label="申请标题" prop="title" v-if="isValid">
                  <el-input v-model.trim="channelData.title" placeholder="请输入标题" maxlength="20" show-word-limit></el-input> 
                </el-form-item>
                <!-- <el-form-item label="渠道编号" prop="channelNo">
                  <el-select v-model="channelData.channelNo" filterable placeholder="请选择渠道编号">
                    <el-option
                      v-for="(item,index) in channelList"
                      :key="index"
                      :label="item.label"
                      @click.native="changeSelect(item)"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item> -->
                <el-form-item label="渠道编号" prop="channelNo">
                  <el-input @blur="selectChannelNo" v-model="channelData.channelNo" maxlength="10" show-word-limit placeholder="请输入渠道编号"></el-input>
                </el-form-item>
                <!-- <el-form-item label="业务类型" prop="channelOperType">
                  <el-select  v-model.number="channelData.channelOperType" placeholder="请选择业务类型" :disabled="true">
                    <el-option
                      v-for="(items,index) in addressTypeData"
                      :key="index"
                      :label="items.label"
                      :value="items.value"
                    ></el-option>
                  </el-select>
                </el-form-item> -->
              </div>
            </panel>
            <panel title="迁址信息" :show="true" style="margin-bottom:15px">
              <div class="vlt-edit-wrap">
                <!-- <el-form-item label="新所属区域" prop="insId">
                  <el-cascader
                    v-model="channelData.insId"
                    :props="setProps"
                    @change="changeIns"
                    :options="insData"
                    clearable
                    placeholder="请选择省 / 市 / 区"
                  ></el-cascader>
                </el-form-item> -->
                <el-form-item label="新渠道地址" prop="regionCode">
                  <el-cascader
                    v-model="channelData.regionCode"
                    :props="cascaderProps"
                    @change="changeCity"
                    :options="cityData"
                    placeholder="请选择省 / 市 / 区"
                  ></el-cascader>
                </el-form-item>
                <!-- <el-form-item label="新渠道地址" prop="ragAdd">
                  <el-input v-model="ragAdd"  placeholder="请选择省 / 市 / 区"></el-input>
                </el-form-item> -->
                <el-form-item prop="channelAddress">
                  <el-input
                    v-model.trim="channelData.channelAddress"
                    placeholder="填写详细地址"
                    maxlength="50" show-word-limit
                  ></el-input>
                </el-form-item>
                <el-form-item label="原渠道地址" prop="oregionCode">
                  <!-- <el-input  v-model="oldChannel.ochannelAddress" :disabled="true" placeholder="原渠道地址"></el-input> -->
                  <el-cascader
                    v-model="oldRegionCode"
                    :props="cascaderProps"
                    @change="changeIns"
                    :options="cityData"
                    clearable
                    placeholder="请选择省 / 市 / 区"
                    :disabled="true"
                  ></el-cascader>
                </el-form-item>
                <el-form-item label="" prop="ochannelAddress">
                  <el-input  v-model.trim="oldChannel.ochannelAddress" :disabled="true" placeholder="原渠道地址"></el-input>
                  <!-- <el-cascader
                    :props="setProps"
                    @change="changeIns"
                    :options="insData"
                    clearable
                    placeholder="请选择省 / 市 / 区"
                    :disabled="putAdds"
                  ></el-cascader> -->
                </el-form-item>
                <el-form-item label="迁址原因" prop="causeRemoval">
                  <el-input type="textarea" placeholder="请输入迁址原因" v-model.trim="channelData.causeRemoval" maxlength="150"></el-input>
                </el-form-item>
              </div>
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
                <el-button id="channelRelocation-submit" type="primary" size="medium" @click="submit">提交</el-button>
                <el-button id="channelRelocation-save" type="danger" plain size="medium"  @click="save" v-if="isValid">暂存</el-button>
                <el-button id="channelRelocation-cancel" size="medium" @click="cancel">取消</el-button>
              </el-row>
            </div>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="渠道迁址流程图" name="2" v-if="isValid">
        <img :src="diagramImg" alt=""></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ajax from "@/utils/ajax.js";
import rules from "@/utils/rules.js";
import { isArray } from 'util';
// import cityData from "@/libs/map/area.json";

export default {
  name: "channelRelocation",
  data() {
    return {
      channelList: [],
      cascaderProps: {
        label: "text",
        value: "code",
        children: "children"
      },
      setProps: {
        label: "text",
        value: "id",
        children: "children",
        checkStrictly: true 
      },
      cityData: [],
      regionCode: [],
      isValid: true,
      active: "1",
      putAdds: true,
      channelData: {
        title: null,
        insId: null,
        channelOperType: 1,
        channelNo: null, // 渠道编号
        regionCode: null,
        channelAddress: null,
        causeRemoval: null,
        attachId: null
      },
      form: {},
      // addressTypeData: [{ label: "渠道迁址", value: 1 }],
      rules: {
        title:[{required: true, trigger: ['change','blur'], validator: this.$rules.checkName, title:'申请标题'}],
        channelOperType: [ {required: true, validator: this.$rules.checkCode,title: "业务类型",trigger: ['change','blur']}],
        channelNo: [ {required: true,validator: this.$rules.checkCode,title: "渠道编号",trigger: ['change','blur'] }],
        pointArea: [{required: true,validator: this.$rules.numberCheck,title: "销售厅面积",trigger: ['change','blur'] }],
        regionCode: [{required: true, trigger: ['change','blur'], message:'新渠道地址不能为空'}],
        channelAddress: [{required: true, trigger: ['change','blur'], message:'新渠道详细地址不能为空'}],
        insId: [{required: true, trigger: ['change','blur'], message:'所属机构不能为空'}],
        causeRemoval: [{required: true, trigger: ['change','blur'], message:'新渠道地址不能为空'}]
      },
      insData: [],
      type: 0,
      gameBagPath: [],
      oldChannel:{},
      diagramImg: '',
      initDatas: {},
      fillAdds: false,
      fileList: [],
      ragAdd: '',
      isVa: 0,
      editType: null,
      isDisUpload: false,
      oldRegionCode: '',
      actBusinessInsId: null,
      channelId: null,
      isRepeat: false,
      backData: {}
    };
  },
  created() {
    this.actBusinessInsId = this.$storage.get('userInfo').insId;
    if (this.$route.query.type) {
      this.editType = this.$route.query.type == 1 ? true : false;
      this.type = "" + this.$route.query.type;
    }
    this.getInsData();
    this.validProcess();
  },
  watch: {
    'channelData.regionCode': {
      handler(newVal, oldVal){
        console.log('changed',newVal);
      },
      deep: true
    },
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
  methods: {
    // 渠道编号失去焦点 请求数据
    selectChannelNo () {
      this.actBusinessInsId =  this.$storage.get("userInfo").insId;
      if(this.channelData.channelNo&&this.channelData.channelNo.length==10&&/^[0-9]*$/.test(this.channelData.channelNo)) {
        let data = {
          insId: this.actBusinessInsId,
          channelNo: this.channelData.channelNo,
        }
        // debugger
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
            // debugger
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
          console.log('------', this.initDatas);
          self.init(this.initDatas )
        } else {
            console.log('数据获取失败!');
        }
      })(data);
    },
    init (data) {
      this.backData = data;
      Object.assign(this.channelData, data);
      console.log('回填的数据',this.channelData);
      if (this.channelData.insId) {
        this.putAdds = false;
        console.log(this.channelData.insId);
        let array = this.channelData.attachId&&this.channelData.attachId.split(',')
        array&&array.forEach((item)=>{
          let obj = {};
          obj.name = item.split('/')[item.split('/').length-1];
          obj.url = item;
          this.fileList.push(obj)
        })
        console.log('====', this.channelData.channelNo);
        if (this.channelData.channelNo) {
          this.selectChannelNo ()
        }
        // let obj = {};
        // this.channelList.forEach(item => {
        //   // console.log(item, this.channelData.channelNo);
        //   if (item.value == this.channelData.channelNo) {
        //     Object.assign(obj, item);
        //     // console.log('-----', obj);
        //     this.changeSelect(obj);
        //   }
        // })
        // this.changeIns (this.channelData.insId);
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
      (async data => {
        let res = await self.$api.validProcess({ data });
        if(res && res.code == 0) {
          console.log('校验流程',res.data.valid);
          self.isValid = res.data.valid;
          self.diagramImg = `${ajax.baseURL}/act/business/diagram/${self.$route.name}/${self.actBusinessInsId}`;
        }
      })(data);
    },
    // 获取渠道编号
    getchannelInfoModifyList (data) {
      const _this = this;
      (async (data) => {
        let  res = await _this.$api.getChannelInfoModifyList({data})
        console.log(res);
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
          if(this.$route.query.id) { // 获取表单数据详情
            let data = this.$route.query.id;
            this.getTaskData(data);
          }
        }
      })(data)
    },
    // 根据渠道编号下拉 获取其详情  
    getRemovalChannelNoDetail (channelNo) {
      // console.log(channelNo);
      const _this = this;
      (async (data) => {
        let res = await _this.$api.getRemovalChannelNoDetail({data});
        console.log('下拉的数据 ', res);
        if (res&&res.code == 0) {
          if (res.data) {
            console.log(this.backData.channelNo);
            if(_this.$route.query.id){
              if (this.backData.channelNo) {
                _this.oldChannel = {
                  oInsId: _this.channelData.oInsId,
                  oregionCode: _this.channelData.oregionCode,
                  ochannelAddress: _this.channelData.ochannelAddress
                }
              } else {
                _this.oldChannel = {
                  oInsId: res.data.insId,
                  oregionCode: res.data.regionCode,
                  ochannelAddress: res.data.channelAddress
                }
              }
            } else {
              _this.oldChannel = {
                oInsId: res.data.insId,
                oregionCode: res.data.regionCode,
                ochannelAddress: res.data.channelAddress
              }
            }
            // debugger
          }
          console.log('vvvvv',res.data.insId);
          // 获取机构
          _this.changeIns(res.data.insId);

        }
      })(channelNo)
    },
    // 根据渠道编号下拉 获取其详情 
    changeSelect(val) {
      console.log('val',val, val.value);
      let vals = val.value ? val.value : val;
      this.actBusinessInsId = val.insId;
      this.channelId = val.channelId;
      console.log(this.actBusinessInsId,this.channelId );
      // debugger
      this.getRemovalChannelNoDetail (vals);
    },
    // 获取机构
    getInsData() {
      const _this = this;
      const data = {};
      (async data => {
        _this.insData = [];
        let res = await _this.$api.QueryUserAndInsTree({ data });
        if (res && res.code == 0) {
          console.log("res", res.data);
          _this.insData = res.data;
          // 回填 调用渠道编号
          this.getchannelInfoModifyList({});
        } else {
          // self.$message.warning(res.msg)
        }
      })(data);
    },
    // 改变机构获取地址变化 
    changeIns (val) {
      console.log('vals',val);
      if (val) {
        let ins = Array.isArray(val) ? val[0] : val;
        let type = this.$formMethods.getInsArray(ins, 'id', this.insData, 'type');
        console.log(val, type, this.insData);
        if (type) {
          let param = {
            insId: ins,
            type: type[0]
          };
          console.log('param', param);
          this.getChannelAddress(param);
          this.putAdds = false;
        }
      }
    },
    changeForm(form){
      console.log('form',form);
    },
    //  渠道地址
    getChannelAddress(data) {
      const self = this;
      this.cityData = [];
      (async data => {
        let res = await self.$api.getChannelAddress({ data });
        console.log('渠道地址', res);
        if (res && res.code == 0) {
          if (res.data != null) {
            self.delChild(res.data);
            self.cityData = res.data;
          }
        } else {}
        
        if(self.$route.query.id) {
          // 此方式是不走流程下通过老地址来填写新地址
          if (self.channelData.regionCode) {
            let regCode = self.getParents(self.cityData, self.channelData.regionCode, 'code').reverse() ? 
            self.getParents(self.cityData, self.channelData.regionCode, 'code').reverse() : [];
            // console.log(regCode);
            self.$set(self.channelData, 'regionCode', regCode);
          }
        } 
        
        let regCode2 = self.getParents(self.cityData, self.oldChannel.oregionCode, 'code') ?
         self.getParents(self.cityData, self.oldChannel.oregionCode, 'code').reverse(): [];
        // self.$set(self.channelData, 'oldRegionCode', regCode2);
        self.oldRegionCode = regCode2;

        // 校验数据  
        if (self.isVa) {  
          self.$refs.forms.validate(valid => {})
        }
      })(data);
    },
    // 删除联级中的children 中的null
    delChild(data) {
      // console.log('原机构数据',data);
      data&&data.forEach(item => {
        if (item.children == null) {
          delete item.children
        } else {
          this.delChild(item.children);
        }
      })
    },

    // 回填地址
    getParents(data, id, text) {
      // console.log('回填地址',data, id);
      for (var i in data) {
        if (data[i].code == id) {
          return [data[i][text]];
        }
        if (data[i].children) {
          var ro = this.getParents(data[i].children, id,text);
          if (ro !== undefined) {
            return ro.concat(data[i][text]);
          } 
        }
      }
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
   
    // 收款凭证上传
    async uploadFinanceImg(files) {
      let formData = new FormData();
      formData.append('file', files.file);
      formData.append('type', 1);
      const res = await this.$api.uploadChannelFiles({
        timeout: 99999999999999,
        data: formData,
        onUploadProgress(evt) {
          console.log('上传进度事件:', evt)
        }
      })
      console.log('uploadFile', res);
      this.financeImg.push(res.data.filePath);
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
   
    // 新建渠道
    createChannel(data) {
      const self = this;
      (async data => {
        let res = await self.$api.createChannel({ data });
        if (res && res.code == 0) {
          self.$message.success("提交成功");
          setTimeout(() => {
            self.$router.push({ path: "./channelList" });
          }, 700);
        } else {
          // self.$message.warning(res.msg)
        }
      })(data);
    },
    save() {
      const self = this;
      let checkChannel = false;
      if(!self.channelData.title) {
        self.$message.warning('申请标题不能为空！');
        return;
      }
      checkChannel = true;

      this.channelData.insId = this.oldChannel.oInsId;
      this.channelData.insId =  Array.isArray(this.channelData.insId) ? this.channelData.insId[0] : this.channelData.insId;
      // this.channelData.regionCode = Number(this.channelData.regionCode[this.channelData.regionCode.length - 1]);
      // this.channelData.attachId = JSON.stringify(this.fileList);
      this.channelData  = Object.assign(this.channelData, this.oldChannel);
      let data = JSON.parse(JSON.stringify(this.channelData));
      if (this.channelData.regionCode) {
        data.regionCode = Number(this.channelData.regionCode[this.channelData.regionCode.length - 1]);
      }

        
       let params = {
          router: "channelRelocation",
          title: self.channelData.title,
          id: self.$route.query.id, // 从我的申请-编辑 需要带上id
          data: JSON.stringify(data),
          actBusinessInsId: this.actBusinessInsId,
          channelId: this.channelId,
        };

      if (!self.$route.query.id) { // 直接暂存 不需要带上
        delete params.id;
      }
      console.log(params);
      self.saveDraft(params);
    },

    // 提交迁址信息
    updateChannelRemovalInfo (data) {
      const _this = this;
      (async (data) => {
        let res = await _this.$api.updateChannelRemovalInfo({message: '提交成功', data });
        if (res&&res.code == 0) {
          // if(_this.isValid) {
          //   _this.$router.push({ name: "myApplication" });
          // } else {
            _this.$router.back();
          // }
        }
      })(data)
    },
    // 提交
    submit() {
      const self = this;
      let checkChannel = false;
      self.$refs.forms.validate(valid => {
        console.log(valid);
        if (valid) {
          checkChannel = true;

          self.channelData.insId = self.oldChannel.oInsId;
          // self.channelData.regionCode = Number(self.channelData.regionCode[self.channelData.regionCode.length - 1]);
          self.channelData  = Object.assign(self.channelData, self.oldChannel);
          let data = JSON.parse(JSON.stringify(self.channelData));
          data.regionCode = Number(self.channelData.regionCode[self.channelData.regionCode.length - 1]);
          console.log(data);
          if(self.isValid) { // 走流程de参数
            let str = JSON.stringify(data)
            data.actBusiness = {
              router:'channelRelocation',
              title: self.channelData.title,
              id: self.$route.query.id, // 从我的申请-编辑 需要带上id
              data: str,
              actBusinessInsId: this.actBusinessInsId,
              channelId: this.channelId,
            };
            if(!self.$route.query.id) { // 直接提交 不需要带上
              delete data.actBusiness.id;
            }
          } else { // 不走流程 不用标题
            delete data.title;
          }
          this.updateChannelRemovalInfo (data);
        } else {
          this.isVa = 1;
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
      //   if ( arrs[i] != 'channelOperType') {
      //     this.channelData[arrs[i]] = '';
      //   }
      // }
      // this.$refs.uploadFiles.clearFiles();
      this.$router.back();
    },
    changeCity(val) {
      console.log(val);
      // if (!this.$route.query.id) {
      //   if (!this.fillAdds) {
      //     this.channelData.regionCode = Number(val[val.length - 1]);
      //     console.log(val, this.channelData.regionCode);
      //     this.fillAdds = false;
      //   } else {
      //     this.fillAdds = true;
      //   }
      // } 
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
</style>
