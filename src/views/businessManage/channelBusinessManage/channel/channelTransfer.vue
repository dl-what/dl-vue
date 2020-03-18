<template>
  <div class="vlt-card">
    <el-tabs v-model="active">
      <el-tab-pane id="channelTransfer-tab-1" label="渠道过户" name="1">
        <el-form
          :model="channelData"
          :rules="rules"
          ref="ruleForm"
          label-position="right"
          label-width="100px"
          :disabled="editType"
          @change="changeForm"
        >
          <div class="vlt-edit-single">
            <panel title="基本信息" :show="true" style="margin-bottom:15px">
              <div class="vlt-edit-wrap">
                <el-form-item label="申请标题" prop="title" v-if="isValid">
                  <el-input v-model.trim="channelData.title" placeholder="请输入标题" maxlength="20" show-word-limit></el-input> 
                </el-form-item>
                <!-- <el-form-item label="渠道编号" prop="channelNo">
                  <el-select v-model="channelData.channelNo" filterable placeholder="请选择渠道编号">
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
                <el-form-item label="原合作伙伴" prop="opartnerId">
                  <!-- :disabled="true" -->
                  <el-select v-model.number="channelData.opartnerId" placeholder="请选择原合作伙伴" :disabled="true">
                    <el-option
                      v-for="(items,index) in oldPartner"
                      :key="index"
                      :label="items.label"
                      :value="items.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="新合作伙伴" prop="npartnerId">
                  <el-select v-model.number="channelData.npartnerId" placeholder="请选择新合作伙伴">
                    <el-option
                      v-for="(items,index) in newPartner"
                      :key="index"
                      :label="items.label"
                      @click.native="changeSelectPartner(items)"
                      :value="items.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </panel>
            <panel title="原负责人信息" :show="true" style="margin-bottom:15px">
              <div class="vlt-edit-wrap">
                <el-form-item label="姓名" prop="oaccountName">
                  <el-input v-model.trim="channelData.oaccountName" placeholder="请输入姓名" maxlength="16" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="身份证号" prop="ochannelIdentity">
                  <el-input v-model="channelData.ochannelIdentity" placeholder="请输入身份证号码" maxlength="18" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="osex">
                  <el-radio-group @change="changeRadio()" v-model="channelData.osex" :disabled="true">
                    <el-radio
                      v-for="(list,index) in sexData"
                      :key="index"
                      :label="list.value"
                    >{{list.label}}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="手机号码" prop="ophone">
                  <el-input v-model.number="channelData.ophone" placeholder="请输入手机号码" maxlength="11" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="年龄" prop="oldAge">
                  <el-input v-model.number="channelData.oldAge" disabled placeholder="自动获取" maxlength="3" show-word-limit></el-input> 
                </el-form-item>
                <el-form-item label="联系地址" prop="oldAddress">
                  <el-input v-model="channelData.oldAddress" disabled placeholder="请输入联系地址" maxlength="50" show-word-limit></el-input> 
                </el-form-item>
                <el-form-item label="证件照片" class="photo">
                  <div>
                    <div v-for="(item,index) in ophoto" :key="index" class="el-upload-list">
                      <img class="el-upload-list__item-thumbnail" :src="item" alt style="height: 150px;width: 150px; padding: 3px" />
                      <span class="el-upload-list__item-actions">
                        <span class="el-upload-list__item-preview" > <i class="el-icon-zoom-in"></i> </span>
                        <span class="el-upload-delete" > <i class="el-icon-delete"></i> </span>
                      </span>
                    </div>
                  </div>
                  <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt />
                  </el-dialog>
                </el-form-item>
              </div>
            </panel>
            <panel title="新负责人信息" :show="true" style="margin-bottom:15px">
              <div class="vlt-edit-wrap">
                <el-form-item label="姓名" prop="naccountName">
                  <el-input v-model.trim="channelData.naccountName" placeholder="请输入姓名" maxlength="10" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="身份证号" prop="nchannelIdentity">
                  <el-input v-model="channelData.nchannelIdentity" placeholder="请输入身份证号码" maxlength="18" show-word-limit @change="changeIndentity('nchannelIdentity', 'newAge')"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="nsex">
                  <el-radio-group @change="changeRadio()" v-model="channelData.nsex">
                    <el-radio
                      v-for="(list,index) in sexData"
                      :key="index"
                      :label="list.value"
                    >{{list.label}}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="手机号码" prop="nphone">
                  <el-input v-model="channelData.nphone" placeholder="请输入手机号码" maxlength="11" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="年龄" prop="newAge">
                  <el-input v-model.number="channelData.newAge" disabled placeholder="自动获取" maxlength="3" show-word-limit></el-input> 
                </el-form-item>
                <el-form-item label="联系地址" prop="newAddress">
                  <el-input v-model="channelData.newAddress" placeholder="请输入联系地址" maxlength="50" show-word-limit></el-input> 
                </el-form-item>
                <el-form-item label="证件照片" class="photo">
                  <div>
                    <div v-for="(item,index) in cardImg" :key="index" class="el-upload-list">
                      <img class="el-upload-list__item-thumbnail" :src="item" alt style="height: 150px;width: 150px; padding: 3px" />
                      <span class="el-upload-list__item-actions">
                        <span class="el-upload-list__item-preview" @click="preview(item)"> <i class="el-icon-zoom-in"></i> </span>
                        <span class="el-upload-delete" @click="imgRemove(cardImg,index)">
                          <i class="el-icon-delete"></i>
                        </span>
                      </span>
                    </div>
                    <el-upload
                      action
                      class="upload-wrap"
                      list-type="picture-card"
                      :auto-upload="true"
                      accept=".png, .jpg, .jpeg"
                      :show-file-list="false"
                      :http-request="uploadCardImg"
                    >
                      <i slot="default" class="el-icon-plus"></i>
                    </el-upload>
                  </div>
                  <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt />
                  </el-dialog>
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
            <div class="submit-wrap" v-if="type == '0'">
              <el-row class="vlt-edit-btn">
                <el-button id="channelTransfer-submit" type="primary" size="medium" @click="submit">提交</el-button>
                <el-button id="channelTransfer-save" type="danger" plain size="medium" @click="save" v-if="isValid">暂存</el-button>
                <el-button id="channelTransfer-cancel" size="medium" @click="cancel">取消</el-button>
              </el-row>
            </div>
          </div>
        </el-form>
      </el-tab-pane>
      <el-tab-pane id="channelTransfer-tab-2" label="渠道过户流程图" name="2" v-if="isValid">
        <img :src="diagramImg" alt=""></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ajax from "@/utils/ajax.js"
import rules from "@/utils/rules.js";


export default {
  name: "channelTransfer",
  data() {
    return {
      ruleForm: {
        channelNo: null,
        channelBusinessType: null,
        remarks: null
      },
      cascaderProps: {
        label: "text",
        value: "value",
        children: "children"
      },
      regionCode: "",
      limitTxt: "温馨提示：暂无自营厅/合作厅的终端额度数据",
      isAddMember: false,
      isValid: true,
      betCard: {
        // 投注卡的参数
        isEdit: 1,
        charge: "",
        amount: "",
        depositSet: "0", // 押金设置 0-不收费；1-收费，2-按投注卡申请量收费
        depositMoreThan: "",
        depositMoney: "" // 押金金额
      },
      active: "1",
      channelData: {
        title: null,
        channelNo: null,
        opartnerId: null,
        npartnerId: null,
        oaccountName: null,
        ochannelIdentity: null,
        oldAge: null,
        oldAddress: null,
        osex: null,
        ophone: null,
        ophoto: null,
        naccountName: null,
        nphone: null,
        nsex: null,
        nchannelIdentity: null,
        nphoto: null,
        newAge: null,
        newAddress: null,
        attachId: null
      },
      rules: {
        title: [{ required: true, validator: this.$rules.checkName, title: '申请标题', trigger: ['change','blur'] }],
        opartnerId:[{required: true,validator: this.$rules.checkCode,title: "原合作伙伴",trigger: ['change','blur']}],
        channelNo: [{required: true, validator: this.$rules.checkCode, title: "渠道编号",  trigger: ['change','blur']} ],
        oaccountName: [  { required: true, validator: this.$rules.checkName, title: "姓名", trigger: ['change','blur'] }],
        ochannelIdentity: [ {required: true,validator: this.$rules.checkIdCard,trigger: ['change','blur']}],
        // oldSex: [{ required: true, message: "性别不能为空", trigger: ['change','blur'] }],
        ophone: [ { required: true, validator: this.$rules.checkPhone, trigger: ['change','blur'] }],
        naccountName: [ { required: true, validator: this.$rules.checkName, title: "姓名", trigger: ['change','blur'] }],
        nphone: [{ required: true, validator: this.$rules.checkPhone, trigger: ['change','blur'] }],
        npartnerId: [{required: true,validator: this.$rules.checkCode,title: "新合作伙伴",trigger: ['change','blur']}],
        // newSex: [{ required: true, message: "性别不能为空", trigger: ['change','blur'] }],
        nchannelIdentity: [ {required: true, validator: this.$rules.checkIdCard,trigger: ['change','blur']} ],
        oldAge: [ { required: true, validator: this.$rules.checkPositive, title: '年龄', trigger: ['change','blur'] } ],
        oldAddress: [ { required: true, message: '联系地址不能为空', trigger: ['change','blur'] } ],
        newAge: [ { required: true, validator: this.$rules.checkPositive, title: '年龄', trigger: ['change','blur'] } ],
        newAddress: [ { required: true, message: '联系地址不能为空', trigger: ['change','blur'] } ],
      },
      channelNos: [
        {label: 'No.1', value: '1'},
        {label: 'No.2', value: '2'},
      ],
      oldPartner: [
        { label: "", value: 1 },
      ],
      newPartner: [],
      tableDatas: [
        {
          id: 1,
          goodsType: "",
          goodsName: "",
          goodsModel: "",
          goodsList: ""
        }
      ],
      roleData: [],
      sexData: [{ label: "男", value: "男" }, { label: "女", value: "女" }],
      ophoto: [],
      cardImg: [],
      dialogImageUrl: "",
      dialogVisible: false,
      type: 0,
      fileList: [],
      channelList: [],
      diagramImg: '',
      editType: null,
      isDisUpload: false,
      actBusinessInsId: null,
      channelId: null,
      isRepeatImg: false,
      isRepeat: false,
      transArr: ['opartnerId', 'npartnerId', 'oaccountName', 'ochannelIdentity', 'osex', 'ophone', 'ophoto', 'naccountName', 'nphone', 'nsex', 'nchannelIdentity', 'nphoto'],
      transArr: ['oPartnerId', 'nPartnerId', 'oAccountName', 'oChannelIdentity', 'oSex', 'oPhone', 'oPhoto', 'nAccountName', 'nPhone', 'nSex', 'nChannelIdentity', 'nPhoto']
    };
  },
  watch: {
    fileList: {
      handler (newVal, oldVal){
          console.log(newVal.length);
        // if (newVal.length > 4){
        //   this.isDisUpload = true;
        // }
      },
      deep: true
    },
    "form.channelData.channelType"(newValue, oldValue) {
      this.form.financeData.channelType = newValue;
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
    let param = {
      channelType: 1
    };

    this.getChannelInfoModifyList(param);
    // this.getPartnerListAll();
    
    // if (!this.$route.params.data) {
    //   this.getChannelGameList();
    // }
    
    this.validProcess();
    if(this.$route.query.id) { // 获取表单数据详情
      let data = this.$route.query.id;
      this.getTaskData(data);
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
            self.changeSelect(self.channelList.value);
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
        } else {}
      })(data);
    },
    init (data) {
      console.log('回填的数据',data);

      let newObj = this.transfFn(data, this.transArr, 'toLowerCase');
      Object.assign(this.channelData, newObj, data);
      console.log(this.channelData);
      this.putAdds = false;
      let array = this.channelData.attachId&&this.channelData.attachId.split(',')
      array&&array.forEach((item)=>{
        let obj = {};
        obj.name = item.split('/')[item.split('/').length-1];
        obj.url = item;
        this.fileList.push(obj)
      })

      // this.getAge('ochannelIdentity', 'oldAge');
      if (this.channelData.nphoto) {
        this.cardImg =  this.channelData.nphoto.indexOf('[')  > -1 ? JSON.parse(this.channelData.nphoto) : this.channelData.nphoto.split(',');
      } else {
        this.cardImg =  []
      }
      if (this.channelData.ophoto)  {
        this.ophoto =  this.channelData.ophoto.indexOf('[') > -1 ? JSON.parse(this.channelData.ophoto) : this.channelData.ophoto.split(',');
      } else {
        this.ophoto =  [];
      }
      console.log('this.cardImg', this.cardImg);
      // if (!this.$route.query.id) {
        if (this.channelData.channelNo) {
          this.changeSelect(this.channelData.channelNo);
        }
      // }
      console.log(this.fileList);
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
          console.log('是否流程',res.data.valid);
          self.isValid = res.data.valid;
          self.diagramImg = `${ajax.baseURL}/act/business/diagram/${self.$route.name}/${this.actBusinessInsId}`;
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
    getRemovalChannelNoDetail (channelNo) {
      const _this = this;
      (async (data) => {
        let res = await _this.$api.getChannelTransferChannelFund({data});
        console.log(res);
        if (res&&res.code == 0) {
          if (res.data) {
            if (this.$route.query.type == '0') {
              _this.channelData.opartnerId = res.data.opartnerId;
              // _this.channelData.npartnerId = res.data.opartnerId;
              _this.channelData.oaccountName = res.data.oaccountName;
              _this.channelData.ochannelIdentity = res.data.ochannelIdentity;
              _this.channelData.osex = res.data.osex;
              _this.channelData.ophone = res.data.ophone;
              _this.channelData.ophoto = res.data.ophoto;
              _this.channelData.oldAge = res.data.oldAge;
              _this.channelData.oldAddress = res.data.oldAddress;
              // _this.getAge('ochannelIdentity', 'oldAge');
              if (res.data.ophoto != null) {
                console.log(res.data.ophoto, res.data.ophoto.indexOf('{') || res.data.ophoto.indexOf('['), res.data.ophoto.split(','));
                 _this.ophoto  = res.data.ophoto.indexOf('[') > -1 ? JSON.parse(res.data.ophoto) :  res.data.ophoto.split(',');
                
              // debugger
               console.log(_this.ophoto );
              } else {
                _this.ophoto = []
              }
              _this.oldPartner = [{label: res.data.corporateName, value: res.data.opartnerId}];
            }
          }
        }
      })(channelNo)
    },

    // 获取新合作伙伴的列表 
    // newPartner
    getPartnerListAll (insId) {
      const _this = this;
      (async () => {
        const data = {
          insId
        };
        _this.newPartner = [];
        const res = await _this.$api.getPartnerListAll({data});
        if (res && res.code === 0) {
          console.log(res);
          res.data&&res.data.forEach(item => {
            _this.newPartner.push({
              value: item.id,
              label: item.corporateName
            });
            _this.oldPartner.push({
              value: item.id,
              label: item.corporateName
            })
          })
        }
      })()
    },
    // 根据渠道编号下拉 获取其详情 
    changeSelect(val) {
      console.log('val',val);
      this.channelId = val.channelId;
      // let selectObj = {};
      // if (!val.value) {
      //   selectObj = this.channelList.filter(item => {
      //     // console.log(item);
      //     return item.value == val
      //   })[0]
      // }
      // console.log(selectObj);
      let vals = val.value ?  val.value : val;
      let valInsId = val.insId ?  val.insId : this.channelList.insId;
      this.actBusinessInsId = valInsId;
      this.channelId = val.channelId;
      // if (this.editType == 0) {
        this.getRemovalChannelNoDetail (vals);
      // }
      this.getPartnerListAll(this.actBusinessInsId);
    },
    changeSelectPartner (val) {
      console.log(val);
      this.channelData.npartnerId = val.value;
    },
    limit(val) {
      this.limitTxt = val;
    },
    // 修改表单 
    changeForm (val) {
      console.log('修改表单', val);
    },
    changeIndentity (indentity, age) {
      this.getAge(indentity, age);
    },
    changeDevice(val) {
      this.form.warehouseGoodsData = val;
    },
    imgRemove (arr, index) {
       arr.splice(index,1)
       console.log('ssss',arr);
    },
    beforeUploadFile(file) {
      const isLt20M = file.size / 1024 / 1024 < 50;
      if (!isLt20M) {
        this.$message.error("上传附件大小不能超过 50MB!");
      }
      return isLt20M;
    },
    changeRadio() {
      console.log(1);
    },
    preview (imgUrl) {
      console.log(imgUrl);
      this.dialogImageUrl = imgUrl;
      this.dialogVisible = true;
    },
    // 证照上传
    async uploadCardImg(files) {
      console.log(this.cardImg,this.cardImg.length);
      
      if (this.cardImg.length > 6) {
        this.$message.warning(`最多只能上传张7证件照`);
        return;
      } else {
        let formData = new FormData();
        formData.append("file", files.file);
        const res = await this.$api.uploadChannelFiles({
          timeout: 99999999999999,
          data: formData,
          onUploadProgress(evt) {
            console.log("上传进度事件:", evt);
          }
        });
        if (res && res.code == 0) {
          this.isRepeatImg = false;
          this.cardImg.forEach(item => {
            if (item == res.data.filePath) {
              this.isRepeatImg = true;
            }
          })
          if (this.isRepeatImg) {
            this.$message.error("已存在，不能重复上传");
            return;
          } else {
            console.log("uploadFile", res);
            this.cardImg.push(res.data.filePath);
          }
          console.log(this.cardImg);
        }

      }
    },
    toExceed () {
      console.log(this.fileList);
      this.$message.warning(`最多只能上传5张证件照`)
    },
    // 附件上传
    async uploadFileOther(files) {
      let formData = new FormData();
      console.log("files", files.file.size / 1024);
      formData.append("file", files.file);
      const res = await this.$api.uploadChannelFiles({
        timeout: 99999999999999,
        data: formData,
        onUploadProgress(evt) {
          console.log("上传进度事件:", evt);
        }
      });
      console.log("uploadFile", res);
      if (res && res.code == 0) {
        // 判断是否存在
        this.isRepeat = false;
        this.fileList.forEach((item, index) => {
          if (files.file.name == item.name) {
            this.isRepeat = true;
          }
        });
        
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
    // 提交渠道过户
    postFundTransfer(data) {
      const self = this;
      (async data => {
        let res = await self.$api.postFundTransfer({message: '提交成功', data });
        if (res && res.code == 0) {
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
      if(!self.channelData.title) {
        self.$message.warning('申请标题不能为空！');
        return;
      }
      checkChannel = true;

      self.channelData.nphoto = Array.isArray(self.cardImg) ? self.cardImg.join(',') : JSON.stringify(self.cardImg);
      // self.channelData.attachId = JSON.stringify(self.gameBagPath);
      let data = JSON.parse(JSON.stringify(self.channelData));
      // 不走流程不用这个参数
      let params = {
        router: "channelTransfer",
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
      self.saveDraft(params);
    },
    getAge(identity, age) {
       if(this.channelData[identity].length>10) {
        this.channelData[age] = new Date().getFullYear() - this.channelData[identity].slice(6, 10)
      }
    },
    transfFn(datas, arr, isTo) {
      let obj = {};
      for( let i in datas) {
        arr.forEach(item => {
          if (i == item) {
            let arr = item.split('');
            let a = '';
            if (isTo == 'toUpperCase') {
              a =  arr[1].toUpperCase();
            } else if (isTo == 'toLowerCase') {
              a =  arr[1].toLowerCase();
            }
            arr[1] = a;
            let key =  arr.join('');
            obj[key] =  datas[i];
            delete datas[i];
          }
        })
      }
      console.log(obj);
     return obj;
    },
    // 提交
    submit() {
      const self = this;
      self.channelData.nphoto = Array.isArray(self.cardImg) ? self.cardImg.join(',') : JSON.stringify(self.cardImg);
      // self.channelData.attachId = JSON.stringify(self.gameBagPath);
      let checkChannel = false;
      self.$refs.ruleForm.validate(valid => {
        console.log(valid);
        if (valid) {
          checkChannel = true;
          
          // 大小写转换
          let newObj = self.transfFn(self.channelData, self.transArr, 'toUpperCase');
          Object.assign(self.channelData, newObj);

          let data = JSON.parse(JSON.stringify(self.channelData));
          console.log(data, self.channelData);
          if(data.opartnerId == data.npartnerId) {
            self.$message.warning('渠道过户新合作伙伴不能为原合作伙伴');
            return;
          };

          if (data.nchannelIdentity == data.ochannelIdentity ) {
            self.$message.warning('渠道过户新负责人身份证号不能为原负责人');
            return;
          }
              
          if(self.isValid) { // 走流程de参数
            let str = JSON.stringify(data)
            data.actBusiness = {
              router:'channelTransfer',
              title: data.title,
              id: self.$route.query.id, // 从我的申请-编辑 需要带上id
              data: str,
              actBusinessInsId: this.actBusinessInsId,
              channelId: this.channelId
            };
            if(!self.$route.query.id) { // 直接提交 不需要带上
              delete data.actBusiness.id;
            }
          }else { // 不走流程 不用标题
            delete data.title;
          }
          console.log('最后的数据为', data);
          self.postFundTransfer(data);
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
      this.$router.back();
    },
    changeCity() {
      this.form.regionCode = this.regionCode[this.regionCode.length - 1];
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
