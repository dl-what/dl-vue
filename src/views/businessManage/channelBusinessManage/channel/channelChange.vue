<template>
  <div class="vlt-card">
    <el-tabs v-model="active">
      <el-tab-pane label="渠道变更" name="1">
          <div class="vlt-edit-single">    
            <el-form :model="channelForm" :rules="rules" label-position="right" label-width="11em" ref="channelForm"  :disabled="editType">
              <panel title="基本信息" :show="true" style="margin-bottom:15px">
                <div class="vlt-edit-wrap">
                  <el-form-item label="申请标题" prop="title" v-if="isValid">
                    <el-input v-model.trim="channelForm.title" placeholder="请输入标题" maxlength="20" show-word-limit></el-input> 
                  </el-form-item>
                  <!-- <el-form-item label="渠道编号" prop="channelNo">
                      <el-select v-model="channelForm.channelNo" filterable placeholder="请选择渠道编号">
                      <el-option
                        v-for="item in channelList"
                        :key="item.value"
                        :label="item.label"
                        :value="item"
                        @click.native="changeChannelSelect(item)"
                        >
                      </el-option>
                    </el-select>
                  </el-form-item> -->
                  <el-form-item label="渠道编号" prop="channelNo">
                    <el-input @blur="selectChannelNo" v-model="channelForm.channelNo" maxlength="10" show-word-limit placeholder="请输入渠道编号"></el-input>
                  </el-form-item>
                  <el-form-item label="编辑模式" prop="">
                    <el-switch
                      v-model="channelForm.isModifyChannelFinanceOne"
                      :active-text="channelForm.isModifyChannelFinanceOne==1?'启用':'关闭'"
                      :inactive-value="0"
                      :active-value="1"
                      @change="changedSwitch('isModifyChannelFinanceOne','基本信息')">
                    </el-switch> 
                  </el-form-item>
                  <el-form-item label="经营场所属性" prop="runField">
                    <el-select v-model.number="channelForm.runField" placeholder="请选择经营场所属性" :disabled="channelForm.isModifyChannelFinanceOne==0">
                      <el-option v-for="(items,index) in addressTypeData" :key="index" :label="items.label"
                        @click.native="changeSelect(items)"
                        :value="items.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="销售厅名称" prop="channelName">
                    <el-input v-model="channelForm.channelName" placeholder="请输入销售厅名称" :disabled="channelForm.isModifyChannelFinanceOne==0" maxlength="30">
                    </el-input> 
                  </el-form-item>
                  <el-form-item label="销售厅面积" prop="pointArea">
                    <el-input v-model.number="channelForm.pointArea" placeholder="请输入销售厅面积" :disabled="channelForm.isModifyChannelFinanceOne==0" maxlength="5">
                      <template slot="append">m²</template>
                    </el-input> 
                  </el-form-item>
                  <el-form-item v-if="channelForm.channelType == 1" label="合作伙伴" prop="partnerId">
                    <el-select v-model.number="channelForm.partnerId" placeholder="请选择合作伙伴"  :disabled="channelForm.isModifyChannelFinanceOne==0">
                      <el-option v-for="(item,index) in partnerData" :key="index" :label="item.corporateName" 
                        @click.native="selectPartner(item)"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="投注卡开卡次数限制" prop="buyCardLimit">
                    <el-input v-model="channelForm.buyCardLimit" placeholder="请输入投注卡开卡次数" maxlength="8" show-word-limit  :disabled="channelForm.isModifyChannelFinanceOne==0">
                      <template slot="append">次</template></el-input> 
                  </el-form-item>
                  <el-form-item label="试玩卡开卡次数限制" prop="tryCardLimit">
                    <el-input v-model="channelForm.tryCardLimit" placeholder="请输入试玩卡开卡次数" maxlength="8" show-word-limit  :disabled="channelForm.isModifyChannelFinanceOne==0">
                      <template slot="append">次</template></el-input> 
                  </el-form-item>
                  <el-form-item label="充值次数限制" prop="rechargeCount">
                    <el-input v-model="channelForm.rechargeCount" placeholder="请输入充值次数" maxlength="8" show-word-limit  :disabled="channelForm.isModifyChannelFinanceOne==0">
                      <template slot="append">次</template></el-input> 
                  </el-form-item>
                  <el-form-item label="渠道人员上限" prop="channelLimit">
                    <el-input v-model.number="channelForm.channelLimit" placeholder="请输入渠道人员上限" maxlength="3" show-word-limit  :disabled="channelForm.isModifyChannelFinanceOne==0"></el-input> 
                  </el-form-item>
                  <el-form-item label="账户记录查询台数"  prop="showMachineCount">
                    <el-input v-model="channelForm.showMachineCount" placeholder="请输入账户记录查询台数" :disabled="channelForm.isModifyChannelFinanceOne==0" maxlength="3">
                      <template slot="append">台</template>
                    </el-input>
                  </el-form-item>
                  <!-- <el-form-item label="渠道纬度" prop="latitude">
                    <el-input v-model="channelForm.latitude" placeholder="请输入渠道纬度" maxlength="10" show-word-limit  :disabled="channelForm.isModifyChannelFinanceOne==0"></el-input> 
                  </el-form-item>
                  <el-form-item label="渠道经度" prop="longitude">
                    <el-input v-model="channelForm.longitude" placeholder="请输入渠道经度" maxlength="10" show-word-limit  :disabled="channelForm.isModifyChannelFinanceOne==0"></el-input> 
                  </el-form-item> -->
                </div>
              </panel>
              <panel title="人员信息" :show="true" style="margin-bottom:15px">
                  <div class="vlt-edit-wrap">
                    <el-form-item label="编辑模式" prop="">
                      <el-switch
                        v-model="channelForm.isModifyChannelFund"
                        :active-text="channelForm.isModifyChannelFund==1?'启用':'关闭'"
                        :inactive-value="0"
                        :active-value="1"
                        @change="changedSwitch('isModifyChannelFund','人员信息')">
                      </el-switch> 
                    </el-form-item>
                    <el-form-item label="姓名" prop="accountName">
                      <el-input v-model.trim="channelForm.accountName" placeholder="请输入姓名" maxlength="10" show-word-limit  :disabled="channelForm.isModifyChannelFund == 0"></el-input> 
                    </el-form-item>
                    <el-form-item label="性别" prop="sex">
                      <el-radio-group @change="changeRadio()" v-model="channelForm.sex"  :disabled="channelForm.isModifyChannelFund == 0">
                        <el-radio 
                          v-for="(list,index) in sexData"
                          :key="index"
                          :label="list.value">{{list.label}}</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item label="手机号码" prop="phone">
                      <el-input v-model.number="channelForm.phone" placeholder="请输入手机号码" maxlength="11" show-word-limit  :disabled="channelForm.isModifyChannelFund == 0"></el-input> 
                    </el-form-item>
                    <el-form-item label="身份证号" prop="channelIdentity">
                      <el-input v-model="channelForm.channelIdentity" placeholder="请输入身份证号码" maxlength="18"  show-word-limit  :disabled="channelForm.isModifyChannelFund == 0"></el-input> 
                    </el-form-item>
                    <el-form-item label="证件照片" class="photo" prop="photo">
                      <div>
                        <div v-for="(item,index) in cardImg" :key="index" class="el-upload-list">
                          <img class="el-upload-list__item-thumbnail" :src="item" alt="" style="height: 150px;width: 150px; padding: 3px">
                          <span class="el-upload-list__item-actions">
                            <span class="el-upload-list__item-preview" @click="preview(item)">
                              <i class="el-icon-zoom-in"></i>
                            </span>
                            <span class="el-upload-delete" @click="imgRemove(cardImg,index, 'cardImg')">
                              <i class="el-icon-delete"></i>
                            </span>
                          </span>
                        </div>
                        <el-upload
                          action=""
                          class="upload-wrap"
                          list-type="picture-card"
                          :auto-upload="true"
                          accept=".png,.jpg,.jpeg"
                          :show-file-list="false"
                          :on-remove="handleRemove"
                          :http-request="uploadCardImg" :disabled="channelForm.isModifyChannelFund == 0">
                            <i slot="default" class="el-icon-plus"></i>
                        </el-upload>
                      </div>
                      <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="">
                      </el-dialog>
                    </el-form-item>
                  </div>
              </panel>
            <!-- 财务信息是根据返回的渠道选择数据的参数  CHANNEL_TYPE ? 0 ：1 -->
            <panel title="财务信息" :show="true" style="margin-bottom:15px" v-if="channelForm.channelType == 1" >
              <div class="vlt-edit-wrap">
                <el-form-item label="编辑模式" prop="">
                  <el-switch
                    v-model="channelForm.isModifyChannelFinanceTwo"
                    :active-text="channelForm.isModifyChannelFinanceTwo==1?'启用':'关闭'"
                    :inactive-value="0"
                    :active-value="1"
                    @change="changedSwitch('isModifyChannelFinanceTwo','财务信息')">
                  </el-switch> 
                </el-form-item>
                <el-form-item  label="合作预交款" prop="coPrepareMoney">
                  <el-input v-model="channelForm.coPrepareMoney" placeholder="请输入合作预交款" :disabled="channelForm.isModifyChannelFinanceTwo==0">
                    <template slot="append">元</template>
                  </el-input> 
                </el-form-item>
                  <!-- <el-form-item label="授信额度" prop="sellDeposit">
                  <el-input v-model="channelForm.sellDeposit" placeholder="请输入授信额度" :disabled="channelForm.isModifyChannelFinanceTwo==0">
                    <template slot="append">元</template>
                  </el-input> 
                </el-form-item> -->
                  <el-form-item  label="代销费费率" prop="agentSellRate">
                  <el-input v-model="channelForm.agentSellRate" placeholder="请输入代销费费率" :disabled="channelForm.isModifyChannelFinanceTwo==0">
                    <template slot="append">%</template>
                  </el-input> 
                  </el-form-item>
                  <el-form-item label="收款凭证" class="photo" prop="evidence">
                    <div>
                      <div v-for="(item,index) in financeImg" :key="index" class="el-upload-list">
                        <img class="el-upload-list__item-thumbnail" :src="item" alt="" style="height: 150px;width: 150px; padding: 3px">
                        <span class="el-upload-list__item-actions">
                          <span class="el-upload-list__item-preview" @click="preview(item)">
                            <i class="el-icon-zoom-in"></i>
                          </span>
                          <span class="el-upload-delete" @click="imgRemove(financeImg,index, 'agentSellRate')">
                            <i class="el-icon-delete"></i>
                          </span>
                        </span>
                      </div>
                      <el-upload
                        action=""
                        class="upload-wrap"
                        list-type="picture-card"
                        :auto-upload="true"
                        accept=".png,.jpg,.jpeg"
                        :show-file-list="false"
                        :on-remove="handleRemove"
                        :http-request="uploadFinanceImg" :disabled="channelForm.isModifyChannelFinanceTwo==0">
                          <i slot="default" class="el-icon-plus"></i>
                      </el-upload>
                    </div>
                    <el-dialog :visible.sync="dialogVisible">
                      <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                </el-form-item>
              </div>
            </panel>
            <panel title="投注卡规则" :show="true" style="margin-bottom:15px" class="bet-rules-content">
              <div class="vlt-edit-wrap">
                <el-form-item label="编辑模式" prop="">
                  <el-switch
                    v-model="channelForm.isModifyChannelCardRule"
                    :active-text="channelForm.isModifyChannelCardRule==1?'启用':'关闭'"
                    :inactive-value="0"
                    :active-value="1"
                    @change="changedSwitch('isModifyChannelCardRule','投注卡规则')">
                  </el-switch> 
                </el-form-item>
                <el-form-item label="卡费规则">
                  <div class="flex-wrap bet-rules-item">
                    <div class="flex-wrap">
                      <el-form-item label="累计大于" prop="costMoreThan">
                        <el-input v-model.number="channelForm.costMoreThan"  maxlength="8" placeholder="请输入数量" :disabled="channelForm.isModifyChannelCardRule==0">
                          <template slot="append">张</template>
                        </el-input>
                      </el-form-item>
                    </div>
                    <div class="flex-wrap">
                      <el-form-item label="收费" prop="charge">
                      <el-input v-model.number="channelForm.charge"  maxlength="8" placeholder="请输入金额" :disabled="channelForm.isModifyChannelCardRule==0">
                        <template slot="append">元/张</template>
                      </el-input>
                      </el-form-item>
                    </div>
                  </div>
                </el-form-item>
                <el-form-item label="押金设置">
                  <el-radio v-model="channelForm.depositSet" label="0" :disabled="channelForm.isModifyChannelCardRule==0">不收费</el-radio>
                  <el-radio v-model="channelForm.depositSet" label="1" :disabled="channelForm.isModifyChannelCardRule==0">全部收费</el-radio>
                  <!-- <el-radio v-model="channelForm.depositSet" label="2" :disabled="channelForm.isModifyChannelCardRule==0">按投注卡申请量收取</el-radio> -->
                </el-form-item>
                <el-form-item label="押金金额" v-if="channelForm.depositSet==1" prop="amount" class="auto-input-content">
                  <div class="bet-rules-item">
                    <el-input v-model.number="channelForm.amount" placeholder="请输入押金金额" :disabled="channelForm.isModifyChannelCardRule==0">
                      <template slot="append">元/张</template>
                    </el-input>
                  </div>
                </el-form-item>
                <!-- <el-form-item label="押金金额" v-if="channelForm.depositSet==2">
                  <div class="flex-wrap bet-rules-item">
                    <div class="flex-wrap">
                      <el-form-item label="累计大于" prop="depositMoreThan">
                        <el-input v-model.number="channelForm.depositMoreThan" placeholder="请输入数量" :disabled="channelForm.isModifyChannelCardRule==0">
                          <template slot="append">张</template>
                        </el-input>
                      </el-form-item>
                    </div>
                    <div class="flex-wrap">
                      <el-form-item label="金额" prop="depositMoney">
                        <el-input v-model.number="channelForm.depositMoney" placeholder="请输入金额" :disabled="channelForm.isModifyChannelCardRule==0">
                          <template slot="append">元</template>
                        </el-input>
                      </el-form-item>
                    </div>
                  </div>
                </el-form-item> -->
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
                    :file-list="fileList"
                    :show-file-list="true"
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
                            download="w3logo"
                          >下载</el-link>
                        </li>   
                      </ul>
                    </div>
                  </el-form-item>
              </div>
            </panel>
              <div class="submit-wrap" v-if="type == '0'">
                <el-row class="vlt-edit-btn">
                  <el-button id="channelChange-submit" type="primary" size="medium" @click="submit">提交</el-button>
                  <el-button id="channelChange-save" type="danger" plain size="medium" @click="save" v-if="isValid">暂存</el-button>
                  <el-button id="channelChange-canvel" size="medium" @click="cancel">取消</el-button>
                </el-row>
              </div>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="渠道变更流程图" name="2"  v-if="isValid">
        <img :src="diagramImg" alt="">
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ajax from "@/utils/ajax.js"
export default {
  name: "channelChange",
  data() {
    return {
      diagramImg: '',
      type: 0,
      channelForm: {
        title: null,
        channelId: null,
        channelNo: null,
        status: null,
        channelType: null,
        channelName: null,
        isModifyChannelFund: 0,
        chFundId: null,
        accountStatus: null,
        accountName: null,
        channelIdentity: null,
        showMachineCount: null,
        sex: null,
        phone: null,
        photo: null,
        channelLimit: null,
        isModifyChannelFinanceOne: 0,
        chFinanceId: null,
        runField: null,
        pointArea: null,
        isModifyChannelFinanceTwo: 0,
        coPrepareMoney: null,
        // sellDeposit: null,
        agentSellRate: null,
        evidence: null,
        isModifyChannelCardRule: 0,
        cardRuleId: null,
        costMoreThan: null,
        charge: null,
        depositSet: '0',
        amount: null,
        // depositMoney: null,
        // depositMoreThan: null,
        // depositMoney: null,
        channelRoleId: null,
        roleName: null,
        attachId: null,
        buyCardLimit: null,
        tryCardLimit: null,
        rechargeCount: null,
       
        channelIndex: null
      },
      partnerData: [],
      isAddMember: false, latitude: null,
        longitude: null,
      isValid: false,
      channelList: [],
      dialogVisible: false,
      isDisUpload: false,
      active: "1",
      channelData: { // 基本信息参数
        isEdit: 1,
        channelNo: '', // 渠道编号
        runField: '', // 经营场所属性
        pointArea: '', // 站点面积
      },
      sexData: [{label:'男', value:'男'},{label:'女',value:'女'}],
      rules: {
        channelNo: [ { required: true, validator: this.$rules.checkChannelTenCode, title: "渠道编号", trigger: ["change", "blur"] } ],
        title: [{ required: true, validator: this.$rules.checkName, title: '申请标题', trigger: ['change','blur'] }],
        // channelNo: [{ required: true, message: '渠道编号不能为空', trigger: ['change','blur'] }],
        runField: [{ required: true, message: '经营场所属性不能为空', trigger: ['change','blur'] }],
        showMachineCount: [{ required: true,  message: '账户记录查询台数不能为空', trigger: ['change','blur'] },
          { validator: this.$rules.checkUnPositive, title: '账户记录查询台数', trigger: ['change','blur'] }],
        channelName: [ { required: true, validator: this.$rules.checkName, title:  '销售厅名称', trigger: ["change","blur"] }],
        pointArea: [{ required: true, validator: this.$rules.numberCheck, title: '销售厅面积', trigger: ['change','blur'] }],
        roleId: [{ required: true, message: '角色类型不能为空', trigger: ['change','blur'] }],
        accountName: [ { required: true, validator: this.$rules.checkName, title: '姓名', trigger: ['change','blur'] }],
        address: [{ required: true, message: '联系地址不能为空', trigger: ['change','blur'] }],
        phone: [{ required: true, validator: this.$rules.checkPhone, trigger: ['change','blur'] }],
        channelIdentity: [{ required: true, validator: this.$rules.checkIdCard, trigger: ['change','blur'] }],
        coPrepareMoney: [{ required: true, title: '合作预交款', validator: this.$rules.donationAmount,trigger: ['change','blur'] }],
        sellDeposit: [{ required: true, title: '授信额度',validator: this.$rules.donationAmount, trigger: ['change','blur'] }],
        agentSellRate: [{ required: true, title: '代销费费率',validator: this.$rules.agentSellRate, trigger: ['change','blur'] }],
        costMoreThan: [ { required: false, validator: this.$rules.checkUnPositive, title: '数量', trigger: ['change','blur'] }],
        charge: [ { required: false, validator: this.$rules.unAmount, title: '收费金额', trigger: ['change','blur'] } ],
        amount: [ { required: false, validator: this.$rules.unAmount, title: '押金金额', trigger: ['change','blur'] } ],
        // depositMoreThan: [ { required: false, validator: this.$rules.checkUnPositive, title: '数量', trigger: ['change','blur'] } ],
        // depositMoney: [ { required: false, validator: this.$rules.unAmount, title: '金额', trigger: ['change','blur'] } ],
        channelLimit: [{ required: true, validator: this.$rules.checkPositive, title: '渠道人员上限', trigger: ['change','blur'] }],
        longitude: [{ required: true, validator: this.$rules.checkLng, title: '渠道经度', trigger: ['change','blur'] }],
        latitude: [{ required: true, validator: this.$rules.checkLat, title: '渠道纬度', trigger: ['change','blur'] }],
        buyCardLimit: [{ required: true, validator: this.$rules.checkPositive, title: '投注卡开卡次数', trigger: ['change','blur'] }],
        tryCardLimit: [{ required: true, validator: this.$rules.checkPositive, title: '试玩卡开卡次数', trigger: ['change','blur'] }],
        rechargeCount: [{ required: true, validator: this.$rules.checkPositive, title: '充值次数', trigger: ['change','blur'] }],
        partnerId: [{ required: true, validator: this.$rules.checkName, title:'合作伙伴', trigger: ['change','blur'] }],
      },
      // workerData: [],
      addressTypeData: [{label:'自有', value:0},{label:'租赁',value:1}],
      insData: [],
      gameBagPath: [],
      roleData:[],
      cardImg: [],
      dialogImageUrl: '',
      financeImg: [],
      fileList:[],
      editType: null,
      isRepeat: false,
      actBusinessInsId: null,
      channelId: null,
      isRepeatImg: false,
      isRepeatImg2: false,
      oldChannelDatas: {},
      channelFinanceOneData: [ 'runField', 'channelName', 'pointArea', 'partnerId', 'buyCardLimit', 'tryCardLimit', 'rechargeCount', 'channelLimit', 'showMachineCount' ],
      isModifyChannelFundData: ['accountName', 'sex', 'phone', 'channelIdentity'],
      isModifyChannelFinanceTwoData: ['coPrepareMoney', 'agentSellRate'],
      isModifyChannelCardRuleData: ['costMoreThan', 'charge', 'depositSet', 'amount']
    };
  },
  watch: {
    financeImg: {
      handler(value) {
        // console.log(value);
        if(value&&value.length>0) {
          this.channelForm.evidence = value.join(',')
        }else{
          this.channelForm.evidence = ''
        }
      },
      deep: true,
    },
    cardImg: {
      handler(value) {
        console.log('图片更改',value);
        if(value&&value.length>0) {
          this.channelForm.photo = value.join(',')
        }else{
          this.channelForm.photo = ''
        }
      },
      deep: true,
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
    'actBusinessInsId': {
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

    let param = {}
    // this.getchannelInfoModifyList(param);
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
      if(this.channelForm.channelNo&&this.channelForm.channelNo.length==10&&/^[0-9]*$/.test(this.channelForm.channelNo)) {
        let data = {
          insId: this.actBusinessInsId,
          channelNo: this.channelForm.channelNo,
        }
        console.log('510 data', data );
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
            // self.form.channelNo = res.data.channelNo;
            // self.actBusinessInsId = res.insId;
            self.channelId = res.data.channelId;
            // self.queryGameRight();
            console.log(res.data);
            self.channelList = {
              label: res.data.channelNo,
              value: res.data.channelNo,
              insId: res.data.insId,
              channelId: res.data.channelId
            }
            self.changeChannelSelect(self.channelList);
          } else {
            self.$message.warning('请输入正确的渠道编号');
          }
        }
      })(data);
    },
    // 获取渠道编号 （此功能已无用 ）
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
          // 判断是否 需要根据url的id回填数据 
        }
      })(data)
    },
    // 获取新合作伙伴的列表 
    // newPartner
    getPartnerListAll (insId) {
      const _this = this;
      (async () => {
        const data = {
          insId
        };
        const res = await _this.$api.getPartnerListAll({data});
        if (res && res.code === 0) {
          console.log(res);
          res.data&&res.data.forEach(item => {
            _this.partnerData.push({
              id: item.id,
              corporateName: item.corporateName
            })
          })
        }
      })()
    },
    // 通过下拉选择的渠道获取详情的数据
    changeChannelSelect (val) {
      console.log(val);
      const _this = this;
      this.actBusinessInsId = val.insId;
      this.channelId = val.channelId;
      // if (!this.$route.query.id) {
        if(val.value) {
          (async (data) => {
            let res = await _this.$api.getChannelNoDetail({data});
            console.log(res);
            if (res&&res.code == 0) {
              if (res.data) {
                let responseData = res.data;
                _this.backFill(responseData);
                console.log(responseData);
                // _this.getPartnerListAll(_this.actBusinessInsId);
              }
            }
          })(val.value)
        } 
      // }
      this.getPartnerListAll(this.actBusinessInsId);
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

      let array = this.channelForm.attachId&&this.channelForm.attachId.split(',')
      array&&array.forEach((item)=>{
        let obj = {};
        obj.name = item.split('/')[item.split('/').length-1];
        obj.url = item;
        this.fileList.push(obj)
      });
      this.financeImg = this.toTransPic(this.channelForm,'evidence');
      this.cardImg = this.toTransPic(this.channelForm,'photo');
      console.log (this.financeImg);
      if (this.$route.query.type == 1) {
        let moneyArray = ['charge', 'depositMoney', 'coPrepareMoney', 'amount', 'agentSellRate', 'sellDeposit']
        moneyArray.forEach((item)=>{
          this.channelForm = this.toMoneyReal(this.channelForm, item)
        })
      }
      this.oldChannelDatas  = JSON.parse(JSON.stringify(this.channelForm));

      console.log(this.channelForm.channelNo);
      if (this.channelForm.channelNo) {
        this.selectChannelNo ()
      }
      // 通过下拉 获取insId
      // this.channelList.forEach (item => {
      //   console.log(item.value,this.channelForm.channelNo);
      //   if (item.value == this.channelForm.channelNo) {
      //     console.log('-----',item);
      //     this.changeChannelSelect (item);
      //   }
      // })
    },

    // 回填数据
    backFill(responseData) {
      Object.assign(this.channelForm, responseData);
      this.channelForm.depositSet = this.channelForm.depositSet == null ?  '0' : '' + this.channelForm.depositSet;
      console.log('当前回填的数据', this.channelForm, this.channelForm.depositSet, this.channelForm.photo);

      this.financeImg = this.toTransPic(this.channelForm,'evidence');
      this.cardImg = this.toTransPic(this.channelForm,'photo');
   
      console.log (this.financeImg);
      let moneyArray = ['charge', 'depositMoney', 'coPrepareMoney', 'amount', 'agentSellRate', 'sellDeposit']
      moneyArray.forEach((item)=>{
        this.channelForm = this.toMoneyReal(this.channelForm, item)
      })
      this.oldChannelDatas  = JSON.parse(JSON.stringify(this.channelForm));
      // console.log('this.oldChannelDatas', this.oldChannelDatas);
    },

    // 个人信息 改变性别
    changeRadio () {
      console.log();
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
        console.log('----',res);
        if(res && res.code == 0) {
          console.log('校验流程',res.data.valid);
          self.isValid = res.data.valid;
          self.diagramImg = `${ajax.baseURL}/act/business/diagram/${self.$route.name}/${self.actBusinessInsId}`
        }
      })(data);
    },
    // 修改如果打开编辑模式，可以修改其关联的值， 如果关闭，则把之前的值 恢复
    changedSwitch (key, text) {
      console.log(key, this.channelForm[key]);
      if (!this.channelForm[key]) {
        this.changeStatus(key, text);
      } 
    },
    // 处理编辑模式关闭的情况下，恢复之前的数据
    changeStatus(key, text) {
      const self = this;
      self.$confirm(`此操作将恢复此前${text}的修改, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
       self.callbackDate(key);
      }).catch(() => {
        console.log('00');
        self.$message('已取消');
        this.channelForm[key] = 1;   
      });
      console.log(key, self.channelForm[key]);
    },

    beforeUploadFile(file) {
      const isLt20M = file.size / 1024 / 1024 < 50;
      if (!isLt20M) {
        this.$message.error('上传附件大小不能超过 50MB!');
      }
      return isLt20M;
    },
    callbackDate(key){
      // debugger
      // console.log( key, key == 'isModifyChannelFinanceOne');
      switch(key) {
        case 'isModifyChannelFinanceOne': 
        console.log('1-isModifyChannelFinanceOne');
        this.channelFinanceOneData.forEach( item => {
          console.log(item);
          this.channelForm[item] = this.oldChannelDatas[item];
        })
        break;
        case 'isModifyChannelFund': 
        console.log('2-isModifyChannelFund');
        this.isModifyChannelFundData.forEach( item => {
          this.channelForm[item] = this.oldChannelDatas[item];
        })
        this.cardImg = this.toTransPic(this.oldChannelDatas,'photo');
        break;
        case 'isModifyChannelFinanceTwo': 
        console.log('3-isModifyChannelFinanceTwo');
        this.isModifyChannelFinanceTwoData.forEach( item => {
          this.channelForm[item] = this.oldChannelDatas[item];
        })
        this.financeImg = this.toTransPic(this.oldChannelDatas,'evidence');
        break;
        case 'isModifyChannelCardRule': 
        console.log('4-isModifyChannelCardRule');
        this.isModifyChannelCardRuleData.forEach( item => {
          this.channelForm[item] = this.oldChannelDatas[item];
        })
        break;
      }
    },
    selectPartner (val) {},
    // 证照上传
    async uploadCardImg(files) {
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
            this.$message.error("证件照已存在，不能重复上传");
            return;
          } else {
            console.log("uploadFile", res);
            this.cardImg.push(res.data.filePath);
          }
          console.log(this.cardImg);
        }
      }
    },
    imgRemove(data,index, imgSelect) {
      if (this.$route.query.type == 1) {
        return;
      }
      if (imgSelect == 'cardImg') {
        if (this.channelForm.isModifyChannelFund != 0) {
           data.splice(index,1)
        } else {
          return false;
        }
      } else if (imgSelect == 'agentSellRate') {
        if (this.channelForm.isModifyChannelFinanceTwo != 0) {
           data.splice(index,1)
        } else {
          return false;
        }
      }
    },
    preview(imgUrl) {
      if (this.$route.query.type == 1) {
        return;
      }
      this.dialogImageUrl = imgUrl;
      this.dialogVisible = true;
    },

    // 收款凭证上传
    async uploadFinanceImg(files) {
      if (this.financeImg.length > 6) {
        this.$message.warning(`最多只能上传张7收款凭证`);
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
          this.isRepeatImg2 = false;
          this.financeImg.forEach(item => {
            if (item == res.data.filePath) {
              this.isRepeatImg2 = true;
            }
          })
          if (this.isRepeatImg2) {
            this.$message.error("收款凭证已存在，不能重复上传");
            return;
          } else {
            console.log("uploadFile", res);
            this.financeImg.push(res.data.filePath);
          }
          console.log(this.financeImg);
        }
      }
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
      }else {
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
    changeSelect (val) {
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
    save() {
      const self = this;
      let data = JSON.parse(JSON.stringify(this.channelForm));
      let checkChannel = false;
      if(!data.title) {
        self.$message.warning('申请标题不能为空！');
        return;
      }
      checkChannel = true;
      
      data.depositSet = Number(data.depositSet);
      data.evidence = JSON.stringify(this.financeImg);
      data.photo = JSON.stringify(this.cardImg);
      // data.attachId = JSON.stringify(this.gameBagPath);
      console.log("提交的参数", data);
      let params = {};
      params = {
        router:'channelChange',
        title: self.channelForm.title,
        id: self.$route.query.id, // 从我的申请-编辑 需要带上id
        data: JSON.stringify(data),
        actBusinessInsId: self.actBusinessInsId,
        channelId : self.channelId
      };
      
      if(!self.$route.query.id) { // 直接提交 不需要带上
        delete params.id;
      }  
      self.saveDraft(params);
    },

    // 渠道变更请求接口
    changeChannel(data) {
      const self = this;
      (async data => {
        let res = await self.$api.updateChannelInfoByChannelNo({message: '提交成功', data });
        if (res && res.code == 0) {
            // if(self.isValid) {
            //   self.$router.push({ name: "myApplication" });
            // } else {
              self.$router.back();
            // }
        } else {
          // self.$message.warning(res.msg)
        }
      })(data);
    },

    // 提交
    submit() {
      const self = this;
      if (self.channelForm.channelType == 1) {
        delete self.channelForm.corporateName;
      } else {
        delete self.channelForm.partnerId;
        delete self.channelForm.corporateName;
      }
      let data = JSON.parse(JSON.stringify(this.channelForm));
      let checkChannel = false;
      self.$refs.channelForm.validate((valid)=>{ 
        console.log(valid);
        if(valid)  {
          checkChannel = true;
          data.depositSet = Number(data.depositSet);

          // 提交数据  乘以100 
          let moneyArray = ['charge', 'depositMoney', 'coPrepareMoney', 'amount', 'agentSellRate', 'sellDeposit']
          moneyArray.forEach((item)=>{
            data = this.toMoney(data, item)
          });

          data.evidence = JSON.stringify(this.financeImg);
          data.photo = JSON.stringify(this.cardImg);

          console.log("提交的参数", data);

          if(self.isValid) { // 走流程de参数
            let str = JSON.stringify(data)
            data.actBusiness = {
              router:'channelChange',
              title: self.channelForm.title,
              id: self.$route.query.id, // 从我的申请-编辑 需要带上id
              data: str,
              actBusinessInsId: self.actBusinessInsId,
              channelId : self.channelId
            };
            if(!self.$route.query.id) { // 直接创建 不需要带上
              delete data.actBusiness.id;
            }
          } else { // 不需要走流程 不用申请标题
            delete data.title;
          }
          
          self.changeChannel(data);
        } else {
          self.$message.warning('请填写正确表单'); 
          setTimeout(()=>{
            var isError= document.getElementsByClassName("is-error");
            isError[0].querySelector('input').focus();
          },100);
          return false;
        }
      })
    },
    cancel() {
      this.$router.back();
    },
    handleRemove() {},
    // 如果是type 为1 的情况下 则显示 文件附件信息 然后可以提供下载
    downLoad(url) {
      this.$download(1, url)
    },
    // 转换金额 除以100
    toMoneyReal(data, val) {
      if(data[val]) {
        data[val] = data[val]/100;
      }
      return data;
    },
    // 转换金额 乘以100
    toMoney(data, val) {
      const self = this;
      if(data[val]) {
        data[val] = self.$common.accMul(data[val], 100);
      }
      return data;
    },
    //根据返回的信息 图片回填 
    toTransPic(obj,str) {
      let arr = [];
      if (obj[str]) {
        arr = obj[str].indexOf('{')  > -1 || obj[str].indexOf('[')  > -1 ? JSON.parse(obj[str]) : obj[str].split(',');
      } else {
        arr = [];
      }
      return arr;
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
</style>
<style lang="less">
.bet-rules-content {
.vlt-edit-wrap { 
    .el-form-item__content{
      width: auto;
      .bet-rules-item {
        width: 600px;
        .el-form-item__label {
          width: 80px !important;
        }
        .el-form-item__content{
          width: auto;
          margin-left: 80px !important;
          .el-input {
            width: 200px;
          }
        }
      }
    }
    .auto-input-content {
      .el-input {
        width: 400px;
      }
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
