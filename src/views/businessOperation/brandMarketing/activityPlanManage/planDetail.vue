<template>
  <div class="vlt-card active-plan">
    <el-tabs v-model="activeName" @tab-click="tabClick">
      <el-tab-pane label="活动内容" name="activeContent">
        <panel title="基础信息" :show="true" style="margin-bottom: 15px;">
          <div class="vlt-edit-single">
          <el-form :model="form" label-width="10em" style="margin-top:20px" :rules="rules" ref="baseForm" :disabled="true">
            <el-form-item label="活动名称" prop="activityName">
              <el-input v-model="form.activityName" placeholder="请输入活动计划名称，最长15字符"></el-input>
            </el-form-item>
            <el-form-item label="活动类型">
              <el-select v-model="form.activityType" placeholder="请选择活动类型">
                <el-option
                  v-for="item in activeTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="活动时间">
              <el-date-picker
                v-model="form.time"
                type="datetimerange"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="活动目标">
              <el-input v-model="form.activityTarget" placeholder="请输入新增会员数量"></el-input>
            </el-form-item>
            <el-form-item label="计划模板">
              <el-select v-model="planTemplate" placeholder="请选择活动计划模板" @change="handelChange">
                <el-option
                  v-for="item in templateOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <!-- 选择活动计划模板 -->
          <div class="vlt--edit-wrap">
            <base-form
              :disabled="true"
              class="base-info"
              :formData="baseForm"
              labelWidth="9.3em"
              ref="baseForm1"
              :rules="rules"
              @change="changeBaseForm"
            ></base-form>
          </div>
          <!-- 计划表格 -->
          <div style="padding: 10px;">
            <el-table :data="tableData" border style="width:100%" class="table-content">
              <el-table-column label="序号" type="index" min-width="100px"></el-table-column>
              <el-table-column prop="planTitle" label="计划标题" min-width="200px">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.planTitle" placeholder="计划标题" disabled></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="planContent" label="计划内容" min-width="200px">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.planContent" placeholder="计划内容" disabled></el-input>
                </template>
              </el-table-column>
            </el-table>
          </div>
          </div>
        </panel>
        <panel title="活动规则" :show="true" style="margin-bottom: 15px;">
          <div class="vlt-edit-single">
            <el-form
              :disabled="true"
              style="margin-top:20px;"
              v-model="activeRule"
              label-width="10em">
              <el-form-item label="活动规则模板">
                <el-select v-model="activeRuleTemplate" placeholder="请选择活动规则模板" @change="activitySelect">
                  <el-option
                    v-for="(item,index) in ruleTemplateOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="规则对象">
                <el-select v-model="activeRule.ruleObject">
                  <el-option label="会员" value="1"></el-option>
                </el-select>
              </el-form-item>
              <div style="padding: 10px;">
              <el-table :data="conversionData" border style="width:100%" class="table-content">
                <el-table-column label="序号" type="index"></el-table-column>
                <el-table-column prop="integralNum" label="积分数量">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.integralNum" placeholder="请输入积分数量" disabled></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="rightsId" label="兑换权益">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.rightsId" placeholder="请选择兑换权益" disabled>
                      <el-option v-for="(item,index) in interestsOptions" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="num" label="数量">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.num" placeholder="请输入数量" disabled></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" width="300px">
                  <template slot-scope="scope">
                    <el-input type="textarea" v-model="scope.row.remark" placeholder="备注" disabled maxlength="150"></el-input>
                  </template>
                </el-table-column>
              </el-table>
              </div>
              <el-form-item label="是否成为会员权益">
                <el-radio-group v-model="activeRule.isMemberBenefits">
                  <el-radio :label="1">否</el-radio>
                  <el-radio :label="2">是</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="会员等级" v-if="this.activeRule.isMemberBenefits != 1">
                <el-select v-model="activeRule.memberLevelName" multiple placeholder="请选择会员等级">
                  <el-option v-for="(item,index) in memberLevelOptions" :key="index" :label=item.label :value=item.value></el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="是否发布消息">
                <el-radio-group v-model="activeRule.isMessage" class="radio-content">
                  <el-radio :label="1">不发送</el-radio>
                  <el-radio :label="2">发送短信</el-radio>
                  <el-radio :label="3">终端/APP推送</el-radio>
                  <el-radio :label="4" style="position: absolute;">发送短信与终端/APP推送</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="消息内容" v-if="this.activeRule.isMessage != 1">
                <el-input type="textarea" v-model="activeRule.messageInfo"></el-input>
              </el-form-item> -->
            </el-form>
          </div>
        </panel>
        <panel title="活动资金" :show="true" style="margin-bottom: 15px;">
          <div class="vlt-edit-single">
            <el-form :model="moneyRule" style="margin-top:20px;" label-width="10em" :disabled="true">
              <el-form-item label="活动资金规则模板">
                <el-select v-model="MoneyRuleTemplate" placeholder="请选择活动规则模板" @change="MoneySelect">
                  <el-option
                    v-for="(item,index) in ruleTemplateOptions1"
                    :key="index"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div style="padding: 10px;">
              <el-table :data="moneyTableData" border style="width:100%" class="table-content">
                <el-table-column label="序号" type="index"></el-table-column>
                <el-table-column prop="dealType" label="注入方式">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.dealType" placeholder="注入方式" disabled>
                      <el-option v-for="(item,index) in injectionOptions" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="gameCode" label="游戏名称">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.gameCode" placeholder="游戏名称" disabled>
                      <el-option v-for="(item,index) in gameNameOptions" :key="index" :label="item.label" :value="String(item.value)"></el-option>
                    </el-select>
                  </template>
                </el-table-column> -->
                <el-table-column prop="injectionAmount" label="注入金额">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.injectionAmount" placeholder="注入金额" disabled></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.remark" placeholder="备注" disabled></el-input>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </panel>
        <panel title="活动资源" :show="true" style="margin-bottom: 15px;">
          <div class="vlt-edit-single">
          <el-form :model="resourceRuleData" style="margin-top:20px;" label-width="10em" :disabled="true">
            <el-form-item label="活动资源规则模板">
              <el-select v-model="resourceRuleTemplate" placeholder="请选择活动规则模板" @change="resourceSel">
                <el-option
                  v-for="(item,index) in ruleTemplateOptions2"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div style="padding: 10px;">
            <el-table :data="resourceRule" border class="table" style="width: 100%">
              <el-table-column type="index" label="序号" fixed width="60px"></el-table-column>
              <el-table-column label="物品名称" min-width="160px">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.goodId" filterable placeholder="请选择" disabled>
                    <el-option
                      v-for="(item, index) in scope.row.nameOptions"
                      :key="index"
                      @click.native="selectName(index,scope.row)"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="物品型号" min-width="160px">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.modelId" filterable placeholder="请选择" disabled>
                    <el-option
                      v-for="(item, index) in scope.row.modelOptions"
                      :key="index"
                      @click.native="selectModel(index,scope.row)"
                      :label="item.deviceModel"
                      :value="item.modelId"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <!-- <el-table-column label="物品序列号" min-width="200px">
                <template slot-scope="scope">
                  <el-input
                    disabled
                    type="textarea"
                    :rows="2"
                    v-model="scope.row.goodsSerialNumber"
                    placeholder="请输入序列号"
                  ></el-input>
                </template>
              </el-table-column> -->
              <el-table-column label="数量" min-width="160px">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.num" placeholder="请输入数量" disabled></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="unitPrice" label="单价（元）" min-width="140px"></el-table-column>
              <el-table-column prop="amount" label="金额（元）" min-width="140px"></el-table-column>
              <el-table-column label="备注" min-width="200px">
                <template slot-scope="scope">
                  <el-input placeholder="请输入备注" v-model="scope.row.remark" disabled></el-input>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        </panel>
        <panel title="监控指标" :show="true" style="margin-bottom: 15px;">
          <div class="vlt-edit-single">
            <el-form
              :disabled="true"
              style="margin-top:20px;"
              v-model="monitorRule"
              labelWidth="10em"
              ref="baseForm2"
              direction="right">
              <el-form-item label="活动监控规则模板">
                <el-select v-model="monitorRuleTemplate" placeholder="请选择活动规则模板" @change="monitorRuleSel">
                  <el-option
                    v-for="(item,index) in ruleTemplateOptions3"
                    :key="index"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="维度选择">
                <el-checkbox-group v-model="monitorRule.dimensionalityVal" class="checkbox-content" disabled>
                  <el-checkbox v-for="(item,index) in dimOptions" :label="item.value" :key="index">{{item.label}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="指标选择">
                <el-checkbox-group v-model="monitorRule.index" disabled>
                  <el-checkbox v-for="(item,index) in indexOptions" :label="item.value" :key="index">{{item.label}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form>
          </div>
        </panel>
        <!-- <div class="footer-btn">
          <el-button size="small" @click="cancel">取消</el-button>
          <el-button type="primary" size="small" @click="save">提 交</el-button>
        </div> -->
      </el-tab-pane>
      <el-tab-pane label="审核流程" name="processInfo" v-if="false">
        <!-- <img src="../../../../assets/img/avatar.jpg" /> -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/javascript">
import {mapGetters} from "vuex"
const typeData = ["充值", "消费", "完成任务"];
export default {
  name: "activityCreate",
  data() {
    return {
      rules: {
        activityName: [
          { required: true, message: '请输入活动计划名称', trigger: ['change','blur'] },
          { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: ['change','blur'] }
        ],
      },
      activeName: "activeContent",
      // 活动类型
      activeTypeOptions:[
        {label:'市场活动',value:1},
        {label:'产品活动',value:2},
        {label:'促销推广活动',value:3}
      ],
      // 计划模板选项
      templateOptions:[],
      tableData:[],  //计划内容
      // 规则模板选项
      ruleTemplateOptions:[],  //活动规则模板
      ruleTemplateOptions1:[],  //资金规则模板
      ruleTemplateOptions2:[],  //资源规则模板
      ruleTemplateOptions3:[],   //监控规则模板
      planTemplate:'',   //计划模板
      form:{ //基础信息
        activityName:'',
        activityType:'',
        time:'',
        activityTarget:"",
      },
      param:{},
      baseForm: [
        {
          title: "活动管理方",
          type: "cascader",
          prop: "manageBy",
          value: "",
          options: this.insData,
          setProps: {
            label: "text",
            value: "id",
            children: "children",
            // multiple: true, // 多选
            checkStrictly: true //设置父子节点取消选中关联，从而达到选择任意一级选项的目的
          }
        },
        {
          title: "活动组织方",
          type: "cascader",
          prop: "organizer",
          value: "",
          options: this.insData,
          setProps: {
            label: "text",
            value: "id",
            children: "children",
            // multiple: true, // 多选
            checkStrictly: true //设置父子节点取消选中关联，从而达到选择任意一级选项的目的
          }
        },
        {
          title: "活动区域",
          type: "cascader",
          prop: "regionCode",
          value: "",
          options: this.insData,
          setProps: {
            label: "text",
            value: "id",
            children: "children",
            // multiple: true, // 多选
            checkStrictly: true //设置父子节点取消选中关联，从而达到选择任意一级选项的目的
          }
        },
      ],
      // 活动规则
      // 兑换规则表格数据
      interestsOptions:[],      //兑换权益选项
      memberLevelOptions: [],   //会员等级
      conversionData:[],
      activeRuleTemplate:'',  //活动规则模板
      activeRule: {
        ruleObject:"",
        isMemberBenefits:'',
        memberLevelName:[],
        isMessage:"",
        messageInfo:''
      },
      // 名称  型号
      options: [],
      // 资金规则
      MoneyRuleTemplate:'',
      moneyRule:{},
      injectionOptions:[ //资金规则注入方式
        {label:'发行经费注入',value: 1},
        {label:'调节基金注入',value: 2},
        {label:'公益金注入',value: 3},
        {label:'资金注入',value: 4}
      ],
      gameNameOptions:[],
      moneyTableData:[],  //资金规则表格数据
      // 资源规则
      resourceRule:[],
      resourceRuleTemplate:'',
      resourceRuleData:{},//资源规则模板
      allResourceData:[],//物品名称全部数据
      // nameOptions:[],
      // modelOptions:[],
      // 监控规则
      monitorRuleTemplate:'',
      monitorRule:{
        dimensionalityVal:[],
        index:[]
      },
      dimOptions:[{label: "中心", value: "1"}, {label: "省级", value: "2"}, {label: "市级", value: "3"},{label: "厅级", value: "4"},{label: "游戏终端", value: "5"}],
      indexOptions: [{label: "充值总额", value: "2"},{label: "投注总额", value: "3"},{label: "用户数", value: "4"},{label: "投注用户数", value: "5"},{label: "会员权益兑换次数",value: "6"}],

    };
  },
  created() {
    console.log('机构数据',this.insData)
    this.baseForm[0].options = this.insData;
    this.baseForm[1].options = this.insData;
    this.baseForm[2].options = this.insData
    // this.getPlanTemplate()     //获取活动计划模板
    // this.getActiveityRule()    //获取活动规则模板
    this.getModelTree()   //获取物品名称
    this.getRightsTree()
    this.getLevelTree();   // 获取会员等级
    this.getDetail()   //获取详情
    let gameParams = {"gameStatus":"1,2,3"}
    this.getGameName(gameParams)  // 获取游戏名称
  },
  watch: {
    insData: {
      handler(value) {
        if(value.length>0) {
          this.baseForm[0].options = value;
          this.baseForm[1].options = value;
          this.baseForm[2].options = value
        }
      },
      deep: true,
    },
    resourceRule: {
      // 深度监听 监听对象，数组的变化
      handler(newValue, oldValue) {
        newValue.forEach((item, index) => {
          item.amount = item.unitPrice * item.num;
        });
        let params = JSON.parse(JSON.stringify(newValue));
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters(['insData'])
  },
  methods: {
    // 查看详情
    async getDetail() {
      const self = this;
      const data = self.$route.query.id
      let res = await self.$api.getActivityDetail({ data })
      console.log("DATA",res)
      if (res && res.code == 0) {  //基础信息
        for (let i in self.form) {
          for (let j in res.data) {
            self.form[i] = res.data[i]
          }
        }
        let time = []
        time.push(res.data.startTime)
        time.push(res.data.endTime)
        self.form.time = time
        self.planTemplate = res.data.activityPlanTemplate.planTemplateName
        self.baseForm.forEach(item =>{  //  计划模板
          for (let i in res.data.activityPlanTemplate) {
            item.value = res.data.activityPlanTemplate[item.prop]
          }
        })
        let tableData = res.data.activityPlanTemplate.activityPlanContentList
        let arr = tableData.map(item=>{return {"planTitle": item.planTitle,"planContent": item.planContent}})
        self.tableData = arr
        let ruleList = res.data.activityRuleTemplateList
        console.log(ruleList)
        ruleList.forEach(item =>{
          if(item.ruleType === 1) {
            self.activeRuleTemplate = item.ruleTemplateName
            for (let i in self.activeRule) {  // 活动规则
              for (let j in item.activityRule) {
                self.activeRule[i] = item.activityRule[i]
              }
            }
            let list = item.activityRule.exchangeRuleList  
            let arr1 = list.map(li =>{return {"integralNum":li.integralNum,"rightsId":li.rightsId,"num":li.num,"remark":li.remark}})
            self.conversionData = arr1
          }
          if(item.ruleType === 2) {
            self.MoneyRuleTemplate = item.ruleTemplateName    
            let list1 = item.capitalRuleList
            let arr2 = list1.map(val =>{return {"dealType":val.dealType,"gameCode":val.gameCode,"injectionAmount":val.injectionAmount,"remark":val.remark}})
            self.moneyTableData = arr2
          }
          if(item.ruleType ===3) {
            console.log(item)
            self.resourceRuleTemplate = item.ruleTemplateName
            let list2 = item.resourceRuleList
            list2.forEach((item,index)=>{
              let obj ={
                id: "",
                goodName: "",
                modelId: "",
                goodCode: "",
                goodId: '',
                goodsType: "",
                // goodsSerialNumber: "",
                num: "",
                unitPrice: "",
                amount: "",
                remark: "",
                nameOptions: [],
                modelOptions:[]
              }
              obj = Object.assign(obj, item)
              obj.goodId = Number(obj.goodId)
              obj.modelId = Number(obj.modelId)
              self.allResourceData.forEach((list)=>{
                let listObj = {};
                listObj.label = list.goodsName
                listObj.value = list.id
                obj.nameOptions.push(listObj)
                if (list.id == item.goodId) {
                  obj.modelOptions = list.modelInfoVoList
                }
              })
              self.resourceRule.push(obj)
            })
          }
          if(item.ruleType ===4) {
            self.monitorRuleTemplate = item.ruleTemplateName
            let list3 = item.monitorRule
            self.monitorRule.dimensionalityVal = list3.dimensionality&&list3.dimensionality.split(',')
            self.monitorRule.index = list3.ration&&list3.ration.split(',')
          }
        })
      }
    },
     // 获取会员等级
    async getLevelTree() {
      let res = await this.$api.memberLevelProgramLevelTree();
      if (res && res.code == 0) {
        console.log("等级",res)
        let options = res.data.map(item =>{return {label: item.memberLevelStr, value: String(item.levelId)}});
        this.memberLevelOptions = options;
      }
    },
    // 获取游戏名称
    async getGameName(data) {
      let res = await this.$api.getRuleGameName({data});
      if (res && res.code == 0) {
        let list = res.data
        console.log("GG",list)
        let arr = list.map(item =>{return {label: item.gameName, value: item.id}})
        this.gameNameOptions = arr
      }
    },
    // 获取计划模板
    async getPlanTemplate(){
      // const self = this;
      // let res = await self.$api.getTemplateList( {} )
      // console.log(res)
      // if (res && res.code == 0) {
      //   let list = res.data
      //   let arr = []
      //   list.forEach(item => {
      //     let obj = {}
      //     obj.label = item.planTemplateName
      //     obj.value = item.id
      //     arr.push(obj)
      //   });
      //   self.templateOptions = arr
      // }
    },
    // 通过id去获取计划模板详情
    async handelChange(val) {
      // const self = this
      // let data = val;
      // let res = await self.$api.activityPlanTemplateDetail({ data })
      // console.log(res)
      // if (res && res.code == 0) {
      //   let list = res.data.activityPlanContentList
      //   let arr = list.map(item=>{return {"planTitle": item.planTitle,"planContent": item.planContent}})
      //   self.tableData = arr
      //   self.baseForm[0].value = res.data.manageBy
      //   self.baseForm[1].value = res.data.organizer
      //   self.baseForm[2].value = res.data.regionCode
      // }
    },
    // 获取活动规则模板详情
    async getActiveityRule() {
      // const self = this
      // let res = await self.$api.getRuleAll({})
      // console.log(res)
      // if (res && res.code == 0) {
      //   let list = res.data
      //   let data1 = list.filter(val =>{return val.ruleType === 1})
      //   let arr1 = data1.map(item=>{return {"label":item.ruleTemplateName,"value":item.id}})
      //   self.ruleTemplateOptions = arr1
      //   let data2 = list.filter(val =>{return val.ruleType === 2})
      //   let arr2 = data2.map(item =>{return {"label":item.ruleTemplateName,"value":item.id}})
      //   self.ruleTemplateOptions1 = arr2
      //   let data3 = list.filter(val=>{return val.ruleType === 3})
      //   let arr3 = data3.map(item=>{return {"label":item.ruleTemplateName,"value":item.id}})
      //   self.ruleTemplateOptions2 = arr3
      //   let data4 = list.filter(val =>{return val.ruleType === 4})
      //   let arr4 = data4.map(item =>{return {"label":item.ruleTemplateName,"value":item.id}})
      //   self.ruleTemplateOptions3 = arr4
      // }
    },
    async activitySelect(val){
      // const self = this
      // let data = val
      // let res = await self.$api.getRuleTemplateDetail({data})
      // if (res && res.code == 0) { //活动规则模板选择
      //   let list = res.data.activityRule
      //   let arr = self.activeRule
      //   let list1 = res.data.activityRule.exchangeRuleList
      //   Object.keys(arr).forEach(item =>{
      //     Object.keys(list).forEach(el =>{
      //       arr[item] = list[item]
      //     })
      //   })
      //   let arr1 = list1.map(li =>{return {"integralNum":li.integralNum,"exchangeRights":li.exchangeRights,"num":li.num,"remark":li.remark}})
      //   self.conversionData = arr1
      // }
    },
    async MoneySelect(val) {//资金规则模板选择
      // const self = this
      // let data = val
      // let res = await self.$api.getRuleTemplateDetail({data})
      // if (res && res.code == 0){
      //   let list = res.data.capitalRuleList
      //   let arr = list.map(val =>{return {"dealType":val.dealType,"gameCode":val.gameCode,"injectionAmount":val.injectionAmount,"remark":val.remark}})
      //   self.moneyTableData = arr
      // }
    },
    async resourceSel(val) {//资源规则模板选择
      // const self = this;
      // let data = val;
      // let res = await self.$api.getRuleTemplateDetail({data})
      // if (res && res.code == 0) {
      //   let list = res.data.resourceRuleList
      //   self.resourceRule = []
      //   list.forEach((item,index)=>{
      //     let obj ={
      //       id: "",
      //       goodName: "",
      //       modelId: "",
      //       goodCode: "",
      //       goodId: '',
      //       goodsType: "",
      //       goodsSerialNumber: "",
      //       num: "",
      //       unitPrice: "",
      //       amount: "",
      //       remark: "",
      //       nameOptions: [],
      //       modelOptions:[]
      //     }
      //     obj = Object.assign(obj, item)
      //     obj.goodId = Number(obj.goodId)
      //     obj.modelId = Number(obj.modelId)
      //     self.allResourceData.forEach((list)=>{
      //       let listObj = {};
      //       listObj.label = list.goodsName
      //       listObj.value = list.id
      //       obj.nameOptions.push(listObj)
      //       if (list.id == item.goodId) {
      //         obj.modelOptions = list.modelInfoVoList
      //       }
      //     })
      //     self.resourceRule.push(obj)
      //   })
      // }
    },
    async monitorRuleSel(val) { //监控规则模板
      // const self = this
      // let data = val
      // let res = await self.$api.getRuleTemplateDetail({data})
      // console.log(res)
      // if (res && res.code == 0) {
      //   self.monitorRule.dimensionalityVal = res.data.monitorRule.dimensionalityName
      //   self.monitorRule.index = res.data.monitorRule.rationName
      // }
    },
     //获取所有物品信息//资源规则表格数据
    async getModelTree() {
      const self = this;
      let res = await self.$api.getModelTree();
      if (res && res.code == 0) {
        this.nameOptions = res.data
        self.allResourceData = res.data;
      }
    },
    // 获取会员权益
    async getRightsTree() {
      let res = await this.$api.getRightsTreeOffLine();
      if (res && res.code == 0) {
        let list = res.data
        console.log(list)
        let arr = list.map(item =>{return {"label": item.rightsName,"value": item.rightsId}})
        this.interestsOptions = arr
      }
    },
     //选择物品名称
    selectName(index, row) {
      // row.num = 1;
      // row.modelId = "";
      // row.goodsSerialNumber = "";
      // row.remark = ""
      // row.goodName = this.nameOptions[index].goodsName;
      // row.goodsType = this.nameOptions[index].goodsType;
      // for (let item of this.nameOptions) {
      //   if (item.goodsType === 1 || item.goodsType === 2) {
      //     row.modelOptions = this.nameOptions[index].modelInfoVoList;
      //   } else if (item.goodsType === 3 || item.goodsType === 4) {
      //     row.unitPrice = this.nameOptions[index].unitPrice;
      //   } else {
      //     alert("error");
      //   }
      // }
    },
    //选择物品型号
    selectModel(index, row) {
      // row.goodsSerialNumber = "";
      // row.unitPrice = row.modelOptions[index].unitPrice;
    },
    changeBaseForm(val){
      this.param = val
    },
    tabClick() {}
  }
};
</script>
<style lang="less" scoped >
@import "./less/index.less";
</style>
<style lang="less">
  .active-plan{
      //  去掉查看時的字体颜色
    // .el-textarea.is-disabled .el-textarea__inner{
    //   color: #333;
    // }
    // .el-input.is-disabled .el-input__inner {
    //   color: #333;
    // }
    .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner{
      border-color: #409EFF;
      background-color: #409EFF
    }
    .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after{
      border-color: white
    }
    // .el-range-editor.is-disabled input{
    //   color: #333;
    // }
  }
</style>