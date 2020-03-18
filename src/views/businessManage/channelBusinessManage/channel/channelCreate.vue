<template>
  <div class="vlt-card">
    <el-tabs v-model="active" @tab-click="tabClick">
      <el-tab-pane label="渠道新建" name="1">
        <panel title="基本信息" :show="true" style="margin-bottom:15px">
          <div class="vlt-edit-single">
            <div class="vlt-edit-wrap">
              <base-info ref="baseInfo" v-model="form.channelData" :insData="insDataChildren" :isValid="isValid" @limit="limit"></base-info>
            </div>
          </div>
        </panel>
        <!-- <panel title="人员信息" :show="true" style="margin-bottom:15px">
          <div class="vlt-edit-single" v-for="(item, index) in workerData" :key="index">
            <div v-if="index!==0" class="title-wrap">
              <h2 class="title">{{`人员信息(${index+1})`}}</h2>
              <el-button type="text" class="delete" @click="deleteMember(index)">删除</el-button>
            </div>
            <div class="vlt-edit-wrap">
              <people-info ref="peoples" v-model="form.channelFundData" v-if="isShow"></people-info>
            </div>
          </div>
          <el-button class="addMember" @click="addMember" v-show="isAddMember" icon="el-icon-plus">添加成员</el-button>
        </panel> -->
        <panel title="人员信息" :show="true" style="margin-bottom:15px">
          <div class="vlt-edit-single">
            <div class="vlt-edit-wrap">
              <people-info ref="peoples" v-model="form.channelFundData" v-if="isShow"></people-info>
            </div>
          </div>
        </panel>
        <panel title="财务信息" :show="true" v-if="form.channelData.channelType=='1'" style="margin-bottom:15px">
          <div class="vlt-edit-single">
            <div class="vlt-edit-wrap">
              <funds-info ref="funds" v-model="form.financeData" v-if="isShow"></funds-info>
            </div>
          </div>
        </panel>
        <panel title="投注卡规则" :show="true" style="margin-bottom:15px">
          <div class="vlt-edit-single betCard">
            <div class="vlt-edit-wrap">
              <el-form 
                :model="betCard" 
                ref="betCard" 
                label-position="right" 
                :rules="rules" 
                label-width="90px" 
                :disabled="type!='0'">
                <el-form-item label="卡费规则">
                  <div class="flex-wrap">
                    <el-form-item label="累计大于" prop="costMoreThan">
                      <el-input v-model="betCard.costMoreThan" placeholder="请输入数量" maxlength="8">
                        <template slot="append">张</template>
                      </el-input>
                    </el-form-item>
                    <el-form-item label="收费" prop="charge">
                      <el-input v-model="betCard.charge" placeholder="请输入金额" maxlength="8">
                        <template slot="append">元/张</template>
                      </el-input>
                    </el-form-item>
                  </div>
                </el-form-item>
                <el-form-item label="押金设置">
                  <div class="radio-wrap">
                    <el-radio v-model="betCard.depositSet" label="0">不收费</el-radio>
                    <el-radio v-model="betCard.depositSet" label="1">全部收费</el-radio>
                    <!-- <el-radio v-model="betCard.depositSet" label="2">按投注卡申请量收取</el-radio> -->
                  </div>
                </el-form-item>
                <el-form-item label="押金金额" v-if="betCard.depositSet==1" prop="amount">
                  <el-input v-model="betCard.amount" placeholder="请输入金额" maxlength="8">
                    <template slot="append">元/张</template>
                  </el-input>
                </el-form-item>
                <!-- <el-form-item label="押金金额" v-if="betCard.depositSet==2">
                  <div class="flex-wrap">
                    <el-form-item label="累计大于" prop="depositMoreThan">
                      <el-input v-model="betCard.depositMoreThan" placeholder="请输入数量">
                        <template slot="append">张</template>
                      </el-input>
                    </el-form-item>
                    <el-form-item label="金额" prop="depositMoney">
                      <el-input v-model="betCard.depositMoney" placeholder="请输入金额">
                        <template slot="append">张/元</template>
                      </el-input>
                    </el-form-item>
                  </div>
                </el-form-item> -->
              </el-form>
            </div>
          </div>
        </panel>
        <panel title="销售游戏" :show="true" style="margin-bottom:15px">
          <div class="table">
            <el-table :data="tableData" border>
              <el-table-column label="序号" type="index" width="55px"></el-table-column>
              <el-table-column label="游戏名称" prop="gameName" min-width="150px"></el-table-column>
              <el-table-column label="投注权限" min-width="130px">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.throwRight"
                    @change="changeSwitchBet"
                    :active-text="scope.row.throwRight?'允许':'禁止'"
                    :inactive-value="0"
                    :active-value="1"
                    :disabled="type!='0'"
                  ></el-switch>
                </template>
              </el-table-column>
              <el-table-column label="兑奖权限" min-width="130px">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.cashRight"
                    @change="changeSwitchCash"
                    :active-text="scope.row.cashRight?'允许':'禁止'"
                    :inactive-value="0"
                    :active-value="1"
                    :disabled="type!='0'"
                  ></el-switch>
                </template>
              </el-table-column>
              <el-table-column label="销售时间" min-width="240px">
                <template slot-scope="scope">
                  <el-time-picker
                    is-range
                    :disabled="type!='0'||scope.row.throwRight=='0'"
                    v-model="scope.row.time"
                    range-separator="——"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    placeholder="选择时间范围"
                    class="time">
                    </el-time-picker>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </panel>
        <panel title="发放资源" :tips="limitTxt" :show="true" style="margin-bottom:15px">
          <device-info ref="device" @change="changeDevice" :warehouseGoodsData="warehouseGoodsData" :limitTxt="limitTxt"></device-info>
        </panel>
        <panel title="自定义设置（选填）" :show="true" style="margin-bottom:15px">
          <div class="vlt-edit-single">
            <div class="vlt-edit-wrap">
              <custom-rules v-model="form.customSettings" v-if="isShow" style="margin-left: -30px"></custom-rules>
            </div>
          </div>
        </panel>
        <panel title="上传附件" :show="true" style="margin-bottom:15px">
          <upload-file v-model="form.channelData" v-if="isShow" uploadUrl="uploadChannelFiles"></upload-file>
        </panel>
        <div class="submit-wrap" v-if="type=='0'">
          <el-row class="vlt-edit-btn">
            <el-button id="channelCreate-submit" type="primary" size="medium" @click="submit">提交</el-button>
            <el-button id="channelCreate-save" type="danger" plain size="medium" @click="save" v-if="isValid">暂存</el-button>
            <el-button id="channelCreate-cancel" size="medium" @click="cancel">取消</el-button>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="渠道新建流程图" name="2"  v-if="isValid">
        <img :src="diagramImg" alt="">
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import moment from 'moment'
import rules from "@/utils/rules.js";
import ajax from "@/utils/ajax.js"
import baseInfo from '../components/channelBaseInfo'
import peopleInfo from '../components/channelPeopleInfo'
import fundsInfo from '../components/channelFundsInfo'
import deviceInfo from '../components/channelDeviceInfo'
import customRules from '../../game/components/rulesCustom'
import uploadFile from "../components/uploadFiles";
import { mapGetters } from 'vuex';

const typeData = [
  { label: "设备", value: 1 },
  { label: "配件", value: 2 },
  { label: "耗材", value: 3 },
  { label: "设施", value: 4 }
];

export default {
  name: "channelCreate",
  components: {
    baseInfo,
    peopleInfo,
    fundsInfo,
    deviceInfo,
    customRules,
    uploadFile
  },
  // mixins: [mixin],
  data() {
    return {
      isShow: false,
      limitTxt: '温馨提示：该机构自营厅的终端机额度为0',
      isAddMember: false,
      isValid: false,
      betCard: {
        // 投注卡的数据
        charge: null, // 卡费金额
        costMoreThan: null,
        depositSet: "0", // 押金设置 0-不收费；1-收费，2-按投注卡申请量收费
        amount: null, 
        depositMoreThan: null,
        depositMoney: null // 押金金额
      },
      active: "1",
      form:{
        channelData: {
          title: null, 
          insId: null, // 所属机构
          insName: null, // 机构名称
          channelType: 0, // 渠道类型
          channelLevelId: null, // 渠道等级
          channelNo: null, // 渠道编号
          channelName: null, // 渠道名称
          runField: 0, // 经营场所属性
          pointArea: null, // 站点面积
          regionCode: null, // 省市区编码
          channelAddress: null, // 渠道地址
          insCode: null, // 渠道编号前四位
          attachId: null, // 上传附件
          latitude: null, // 渠道纬度
          longitude: null, // 渠道经度
          buyCardLimit: null, // 投注卡开卡次数
          tryCardLimit: null, // 试玩卡开卡次数
          rechargeCount: null, // 充值次数
          channelLimit: null, // 渠道人员总数限制
          partnerId: null, // 合作伙伴
          showMachineCount: null, // 账户记录查询台数
        },
        channelFundData: {
          roleId: 1,
          accountName: null, // 姓名
          age: null, // 年龄
          sex: '男', // 性别
          phone: null, // 手机号
          address: null, // 联系地址
          channelIdentity: null, // 身份证号码
          photo: null, // 证件照片
        },
        financeData: {
          coPrepareMoney: null, // 合作预交款
          // creditQuota: '', // 授信额度
          agentSellRate: null, // 代销费率
          channelType: null,
          evidence: null, // 收款凭证
        },
        warehouseGoodsData: [],
        customSettings: {
          customSettings: null,
        },
      },
      warehouseGoodsData: [], // 回填数据使用
      workerData: [
        [
          {
            title: "角色名称",
            type: "select",
            prop: "roleId",
            value: "",
            options: []
          },
          { title: "姓名", type: "input", prop: "accountName", value: "" },
          {
            title: "性别",
            type: "radio",
            prop: "sex",
            value: "男",
            options: [
              { label: "男", value: "男" },
              { label: "女", value: "女" }
            ]
          },
          { title: "手机号码", type: "input", prop: "phone", value: "" },
          {
            title: "身份证号码",
            type: "input",
            prop: "channelIdentity",
            value: ""
          }
          // {title: '身份证照正面', type: 'upload', prop: 'photo', value: ''},
          // {title: '身份证照背面', type: 'upload', prop: 'photo', value: ''}
        ]
      ],
      rules: {
        costMoreThan: [
          { required: false, validator: rules.checkUnPositive, title: '数量', trigger: ['change','blur'] }
        ],
        charge: [
          { required: false, validator: rules.unAmount, title: '收费金额', trigger: ['change','blur'] }
        ],
        amount: [
          { required: true, validator: rules.donationAmount, title: '押金金额', trigger: ['change','blur'] }
        ],
        depositMoreThan: [
          { required: false, validator: rules.checkUnPositive, title: '数量', trigger: ['change','blur'] }
        ],
        depositMoney: [
          { required: false, validator: rules.unAmount, title: '金额', trigger: ['change','blur'] }
        ],
      },
      // insData: [],
      tableData: [], // 销售权限参数
      type: this.$route.query.type,
      gameBagPath: [],
      diagramImg: '',
      limitData: null,
      actBusinessInsId: null,
    };
  },
  created() {
    if(this.$route.query.id) { // 获取表单数据详情
      let data = this.$route.query.id;
      this.getTaskData(data);
    }else{
      let data = {};
      this.getChannelGameList(data);
      this.isShow = true;
    }
    // 初始化请求用户id
    this.actBusinessInsId = this.$storage.get('userInfo').insId;
    this.validProcess()
    
  },
  watch: {
    "form.channelData.insId"(newValue, oldValue) {
      let data = {
        insId: Array.isArray(newValue)?newValue[newValue.length - 1]:newValue
      };
      if(this.$route.query.type!='1'&&!this.$route.query.id){
        this.getChannelGameList(data);
      }
      this.actBusinessInsId = Array.isArray(newValue)?newValue[newValue.length - 1]:newValue;
      this.validProcess();
    },
    "form.channelData.channelType"(newValue, oldValue) {
      this.form.financeData.channelType = newValue;
      this.limit();
    }
  },
  computed: {
    ...mapGetters(['insData']),
    insDataChildren() {
      if(this.insData&&this.insData[0]&&this.insData[0].parentId==0) {
        return this.insData[0].children;
      }
      return this.insData;
    }
  },
  methods: {
    tabClick() {
      if(this.active==1) {
        this.$refs.baseInfo.isManual = true;
      }else{
        this.$refs.baseInfo.isManual = false;
      }
    },
    // 表单数据详情
    getTaskData(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getTaskData({ data });
        if (res && res.code == 0) {
          let data = JSON.parse(res.data.data);
          self.init(data)
        }
      })(data);
    },
    // 流程图片
    getDiagramImg(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getDiagramImg({ data });
        if (res && res.code == 0) {
          console.log("res", res.data);

        }
      })(data);
    },
    // 暂存
    saveDraft(data) {
      const self = this;
      (async data => {
        let res = await self.$api.saveDraft({ data });
        if (res && res.code == 0) {
          self.$message.success("保存成功");
          self.$router.back()
        }
      })(data);
    },
    // 获取机构列表
    getInsData() {
      const self = this;
      const data = {};
      (async data => {
        let res = await self.$api.QueryUserAndInsTree({ data });
        if (res && res.code == 0) {
          self.insData = res.data[0].children;
          if(self.$route.params.data) {
            let data = JSON.parse(self.$route.params.data);
            self.init(data)
          }
        }
      })(data);
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
          self.isValid = res.data.valid;
          self.diagramImg = `${ajax.baseURL}/act/business/diagram/${self.$route.name}/${this.actBusinessInsId}`;
        }
      })(data);
    },
    // 回填初始化
    init(data) {
      const self = this;
      self.form = Object.assign(self.form, data)
      self.$set(self.form.channelData, 'pointArea', data.financeData.pointArea)
      self.$set(self.form.channelData, 'runField', data.financeData.runField)

      // 需要转换金额 非百分制的字段
      let moneyArray = ['charge', 'depositMoney', 'coPrepareMoney', 'amount', 'agentSellRate']
      moneyArray.forEach((item)=>{
        data = self.toMoneyReal(data, item)
      })

      // 机构的回填
      if(self.insData)  {
        if(self.form.channelData.insId) {
          let ins = this.$formMethods.getInsArray(self.form.channelData.insId, 'id', self.insData, 'id')
          // self.form.channelData.insId = ins.reverse();
          self.form.channelData.insId = ins[0];
        }
      }

      // 销售游戏回填
      console.log('回填的参数', data.gameRightList)
      self.tableData = data.gameRightList;

      // 标题的回填
      if(!data.channelData.title) {
        self.form.channelData.title = data.actBusiness.title;
      }
      
      // 处理投注卡回填
      self.betCard = data.cardRuleData
      self.betCard.depositSet = String(self.betCard.depositSet)

      // 回填资源
      self.warehouseGoodsData = data.warehouseGoodsData;

      // 处理时间回填
      self.form.gameRightList&&self.form.gameRightList.forEach((item)=>{
        item.time = [];
        item.time.push(`2019-11-11 ${item.sellBeginTime}`)
        item.time.push(`2019-11-11 ${item.sellEndTime}`)
      })
      // 
      self.isShow = true;
    },
    limit(val) {
      if(val) {
        this.limitData = val;
      }
      if(this.form.channelData.channelType == 0) {
        let sell = this.limitData&&this.limitData.sellingMachine||0;
        this.limitTxt = `温馨提示：该机构自营厅的终端机额度为${sell}`;
      }else{
        let coop = this.limitData&&this.limitData.cooperationMachine||0;
        this.limitTxt = `温馨提示：该机构合作厅的终端机额度为${coop}`;
      }
    },
    changeDevice(val) {
      this.form.warehouseGoodsData = val;
    },
    beforeUploadFile(file) {
      const isLt20M = file.size / 1024 / 1024 < 50;
      if (!isLt20M) {
        this.$message.error('上传附件大小不能超过 50MB!');
      }
      return isLt20M;
    },
    // 附件上传
    async uploadFileOther(files) {
      let formData = new FormData();
      formData.append("file", files.file);
      const res = await this.$api.uploadChannelFiles({
        timeout: 99999999999999,
        data: formData,
        onUploadProgress(evt) {
          console.log("上传进度事件:", evt);
        }
      });
       if(res&&res.code==0) {
        this.$message.success('上传成功')
        this.gameBagPath.push(res.data.filePath);
      }
    },

    // 获取渠道 销售游戏列表
    getChannelGameList(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getChannelGameList({ data });
        if (res && res.code == 0) {
          self.tableData = res.data;
          self.tableData.forEach(item => {
            self.$set(item, 'time', '')
            item.sellBeginTime&&item.time.push(`2019-11-11 ${item.sellBeginTime}`)
            item.sellEndTime&&item.time.push(`2019-11-11 ${item.sellEndTime}`)
            // item.throwRight = item.throwRight == 1 ? true : false; //0关闭 1开启
            // item.cashRight = item.cashRight == 1 ? true : false; //0关闭 1开启
          });
          // self.$set(self.formData[1], 'options', res.data)
          // self.formData[1].options = res.data;
          // self.cascaderOptions = res.data;
        } else {
          // self.$message.warning(res.msg)
        }
      })(data);
    },
    // 新建渠道
    createChannel(data) {
      const self = this;
      (async data => {
        let res = await self.$api.createChannel({ data });
        if (res && res.code == 0) {
          self.$message.success("提交成功");
          self.$router.back()
        }
      })(data);
    },
    changeSwitchBet(val) {
      // this.switchBetText = val ? '允许' : '禁止'
    },
    changeSwitchCash(val) {
      // this.switchBetText = val ? '允许' : '禁止'
    },
    deleteMember(index) {
      this.workerData.splice(index, 1);
      this.memberArray.splice(index, 1);
    },
    addMember() {
      // 添加成员
      let cloneData = JSON.parse(JSON.stringify(this.workerData[0]));
      cloneData.forEach(item => {
        item.prop = `${item.prop}${this.workerData.length}`;
        item.value = ""; // 数据要情空
        if (item.type == "radio") {
          item.value = "1"; // 默认为男
        }
      });
      this.$set(this.workerData, this.workerData.length, cloneData);
    },
    save() {
      const self = this;
      let data = JSON.parse(JSON.stringify(this.form));
      // 渠道编号
      let channelNo = data.channelData.channelNo
      let insCode = data.channelData.insCode
      data.channelData.channelNo = `${insCode?insCode:''}${channelNo?channelNo:''}`
      delete data.channelData.insCode;

      if(!self.form.channelData.title) {
        this.$message.warning('申请标题不能为空');
        return
      }
      // 场所属性和面积 属于财务信息 需要切换
      if(data.channelData.insId) {
        data.channelData.insId = data.channelData.insId[data.channelData.insId.length-1]
      }
      data.financeData.pointArea = data.channelData.pointArea;
      data.financeData.runField = data.channelData.runField;
      delete data.channelData.pointArea;
      delete data.channelData.runField;

      // 投注卡规则
      let betCard = JSON.parse(JSON.stringify(this.betCard))
      betCard.depositSet = Number(betCard.depositSet)
      data.cardRuleData = betCard;

      // 销售权限
      data.gameRightList = JSON.parse(JSON.stringify(this.tableData));
      data.gameRightList.forEach(item => {
        // item.cashRight = item.cashRight ? 1 : 0;
        // item.throwRight = item.throwRight ? 1 : 0;
        if (item.time) {
          item.sellBeginTime = item.time[0];
          item.sellEndTime = item.time[1];
          item.sellBeginTime = moment(item.sellBeginTime).format("HH:mm:ss");
          item.sellEndTime = moment(item.sellEndTime).format("HH:mm:ss");
          delete item.time;
        }
      })
      // 自营厅和合作厅的参数切换
      if(data.financeData.channelType=='1') { // 合作厅
        delete data.financeData.channelType
      } else { // 自营厅
        delete data.financeData.channelType;
        delete data.financeData.coPrepareMoney;
        delete data.financeData.agentSellRate;
      }

      // 发放资源

      // 需要转换金额乘百分制的字段
      let moneyArray = ['charge', 'depositMoney', 'coPrepareMoney', 'amount', 'agentSellRate']
      moneyArray.forEach((item)=>{
        data = self.toMoney(data, item)
      })

      // 仓库名称
      // data.channelData.warHouseName = `${data.channelData.warHouseName}${data.channelData.channelNo}`
      
      let params = {
        router: self.$route.name,
        title: self.form.channelData.title,
        id: self.$route.query.id, // 从我的申请-编辑 需要带上id
        data: JSON.stringify(data),
        actBusinessInsId: this.actBusinessInsId,
      };

      if(!self.$route.query.id) { // 新建 不需要带上
        delete params.id;
      }
      self.saveDraft(params)
    },
    // 提交
    submit() {
      const self = this;
      let data = JSON.parse(JSON.stringify(this.form));
      // 投注费用同时校验
      let checkBetCard;
      if(this.betCard.charge&&this.betCard.costMoreThan||!this.betCard.charge&&!this.betCard.costMoreThan){
        checkBetCard = true;
      }else{
        checkBetCard = false;
      }
      if(!checkBetCard) {
        this.$message.warning('卡费规则二者必须同时填或不填')
        return;
      }
      let checkBet = false;
      self.$refs.betCard.validate((valid)=>{ // 对渠道基本信息校验
        if(valid) checkBet = true;
      })
      let checkChannel = false;
      self.$refs.baseInfo.$refs.form.validate((valid)=>{ // 对渠道基本信息校验
        if(valid) checkChannel = true;
      })
      let checkPeople = false;
      self.$refs.peoples.$refs.form.validate((valid)=>{ // 对渠道人员信息校验
        if(valid) checkPeople = true;
      })
      let checkFinance = false;
      if(data.channelData.channelType=='1') {
        self.$refs.funds.$refs.form.validate((valid)=>{ // 对财务信息校验
          if(valid) checkFinance = true;
        })
      } else {
        checkFinance = true;
      }
      let checkEmpty = false;
      // 处理销售游戏
      data.gameRightList = JSON.parse(JSON.stringify(this.tableData));
      data.gameRightList.forEach(item => {
        // item.cashRight = item.cashRight ? 1 : 0;
        // item.throwRight = item.throwRight ? 1 : 0;
        if (item.throwRight) {
          if(item.time) {
            item.sellBeginTime = item.time[0];
            item.sellEndTime = item.time[1];
            item.sellBeginTime = moment(item.sellBeginTime).format("HH:mm:ss");
            item.sellEndTime = moment(item.sellEndTime).format("HH:mm:ss");
            delete item.time;
          }else{
            checkEmpty = true;
          }
        }
      });
      if (checkEmpty) {
        this.$message.warning("开始销售/结束销售时间不能为空");
        return;
      }
      // 校验资源数量
      let checkNum = false;
      data.warehouseGoodsData.forEach((item)=>{
        item.unitPrice = item.unitPrice*100;
        if(!item.num) {
          checkNum = true;
        }
      })
      if (checkNum) {
        this.$message.warning("发放资源数量不能为空");
        return;
      }
      if(!data.channelData.regionCode) {
        this.$message.warning("请选择省/市/区");
        return;
      }
      if(checkChannel&&checkPeople&&checkFinance&&checkBet) {
        // 渠道编号
        data.channelData.channelNo = `${data.channelData.insCode}${data.channelData.channelNo}`
        delete data.channelData.insCode;
        // 场所属性和面积 属于财务信息 需要切换
        data.channelData.insId =  Array.isArray(data.channelData.insId)?data.channelData.insId[data.channelData.insId.length - 1]:data.channelData.insId;
        data.financeData.pointArea = data.channelData.pointArea;
        data.financeData.runField = data.channelData.runField;
        delete data.channelData.pointArea;
        delete data.channelData.runField;

        // 投注卡规则
        let betCard = JSON.parse(JSON.stringify(this.betCard))
        betCard.depositSet = Number(betCard.depositSet)
        if(betCard.depositSet==0) {
          betCard.amount = null;
        }
        data.cardRuleData = betCard;
        // 自营厅和合作厅的参数切换
        if(data.financeData.channelType == '1') { // 合作厅
          delete data.financeData.channelType
        } else { // 自营厅
          delete data.financeData.channelType;
          delete data.financeData.coPrepareMoney;
          delete data.financeData.agentSellRate;
        }

        // 渠道地址 编码
        data.channelData.regionCode = data.channelData.regionCode[data.channelData.regionCode.length-1]

        // 需要转换金额百分制的字段
        let moneyArray = ['charge', 'depositMoney', 'coPrepareMoney', 'amount', 'agentSellRate']
        moneyArray.forEach((item)=>{
          data = self.toMoney(data, item)
        })
        
        // 需要转换数字的字段
        let numberArray = ['latitude', 'longitude', 'costMoreThan', 'depositMoreThan', 'depositSet','buyCardLimit','tryCardLimit','rechargeCount','channelLimit','showMachineCount']
        numberArray.forEach((item)=>{
          data = self.toNumber(data, item)
        })
        // 仓库名称
        // data.channelData.warHouseName = `${data.channelData.warHouseName}${data.channelData.channelNo}`
       
        if(self.isValid) { // 走流程de参数
          let str = JSON.stringify(data)
          data.actBusiness = {
            router: self.$route.name,
            title: self.form.channelData.title,
            id: self.$route.query.id, // 从我的申请-编辑 需要带上id
            data: str,
            actBusinessInsId: this.actBusinessInsId,
          };
          if(!self.$route.query.id) { // 直接提交 不需要带上
            delete data.actBusiness.id;
          }
        } else { // 不需要走流程 不用申请标题
          delete data.channelData.title;
        }
        data.warehouseGoodsData.forEach((item)=>{
          delete item.optionsType;
          delete item.optionsName;
          delete item.optionsModel;
          delete item.title;
        })
        delete data.customSettings;
        console.log("提交的参数", data);
        self.createChannel(data);
      }else{
        self.$message.warning('校验不通过')
      }
    },
    // 转换金额 除以100
    toMoneyReal(data, val) {
      for(let key in data) {
        if(typeof(data[key])=='object') {
          if(data[key]&&data[key][val]) {
            data[key][val] = data[key][val]/100;
          }
        }
        if(Array.isArray(data[key])) {
          data[key]&&data[key].forEach((item)=>{
            if(item[val]) {
              item[val] = item[val]/100;
            }
          })
        }
      }
      return data;
    },
    // 转换金额 乘以100
    toMoney(data, val) {
      const self = this;
      for(let key in data) {
        if(typeof(data[key])=='object') {
          if(data[key][val]) {
            data[key][val] = self.$common.accMul(data[key][val], 100);
          }
        }
        if(Array.isArray(data[key])) {
          data[key].forEach((item)=>{
            if(item[val]) {
              item[val] = self.$common.accMul(item[val], 100);
            }
          })
        }
      }
      return data;
    },
    // 转换数字
    toNumber(data, val) {
      for(let key in data) {
        if(typeof(data[key])=='object') {
          if(data[key][val]) {
            data[key][val] = data[key][val]*1;
          }
        }
        if(Array.isArray(data[key])) {
          data[key].forEach((item)=>{
            if(item[val]) {
              item[val] = item[val]*1;
            }
          })
        }
      }
      return data;
    },
    cancel() {
      this.$router.back();
    },
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
  padding: 16px 16px;
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
.vlt-edit-wrap{
  padding: 20px 16px;
}
.time{
  width: 80%;
  min-width: 270px;
}
.radio-wrap{
  width: 490px;
}
</style>
