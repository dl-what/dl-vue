<template>
  <div class="vlt-card active-plan">
    <div class="create-plan">
      <span>新建活动计划</span>
    </div>
    <el-tabs v-model="activeName" @tab-click="tabClick">
      <el-tab-pane label="活动内容" name="activeContent">
        <panel title="基础信息" :show="true">
          <div class="vlt-edit-single">
            <el-form :model="form" label-width="10em" style="margin-top:20px" :rules="rules" ref="baseForm">
              <el-form-item label="活动名称" prop="activityName">
                <el-input v-model="form.activityName" placeholder="请输入活动计划名称，最长15字符"></el-input>
              </el-form-item>
              <el-form-item label="活动类型" prop="activityType">
                <el-select v-model="form.activityType" placeholder="请选择活动类型">
                  <el-option
                    v-for="item in activeTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="活动时间" prop="time">
                <el-date-picker
                  v-model="form.time"
                  :clearable="true"
                  :editable="false"
                  :picker-options="planTime"
                  type="datetimerange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="活动目标" prop="activityTarget">
                <el-input v-model="form.activityTarget" placeholder="请输入新增会员数量"></el-input>
              </el-form-item>
              <el-form-item label="计划模板" prop="planTemplate">
                <el-select filterable v-model="form.planTemplate" placeholder="请选择活动计划模板" @change="handelChange">
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
                class="base-info"
                :formData="baseForm"
                labelWidth="9.3em"
                ref="baseForm1"
                :rules="rules"
                @change="changeBaseForm"
              ></base-form>
            </div>
          </div>
          <!-- 计划表格 -->
          <el-form :model="planTableForm" ref="planTableForm" :rules="rules">
            <el-table :data="planTableForm.tableData" border  class="table--content plan-table">
              <el-table-column label="序号" type="index" width="60"></el-table-column>
              <el-table-column label="计划标题" min-width="200">
                <template slot-scope="scope">
                  <el-form-item :prop="`tableData.${scope.$index}.planTitle`" :rules="rules.planTitle">
                    <el-input v-model="scope.row.planTitle" maxlength="20" placeholder="计划标题" show-word-limit></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="计划内容" min-width="300">
                <template slot-scope="scope">
                  <el-form-item :prop="`tableData.${scope.$index}.planContent`" :rules="rules.planContent">
                    <el-input v-model="scope.row.planContent" type="textarea" placeholder="计划内容" maxlength="250"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="操作" width='100'>
                <template slot-scope="scope">
                  <el-form-item>
                    <el-button size="mini" @click="deletePlan(scope.row,scope.$index)">删除</el-button>
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
          <el-button size="medium" class="add-content vlt-add-more" @click="addPlan" :id="'reuse-addPlan'">
            <i class="el-icon-plus"></i> 新增计划内容
          </el-button>
        </panel>
        <panel title="活动规则" :show="true" class="vlt-edit-single">
          <el-form
            ref="activeRule"
            style="margin-top:20px;"
            :model="activeRule"
            :rules="rules"
            label-width="10em">
            <el-form-item label="活动规则模板" prop="activeRuleTemplate">
              <el-select filterable v-model="activeRule.activeRuleTemplate" placeholder="请选择活动规则模板" @change="activitySelect">
                <el-option
                  v-for="(item,index) in ruleTemplateOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="规则对象">
              <el-select v-model="activeRule.ruleObject" disabled>
                <el-option label="会员" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-table :data="conversionData" border class="table-content plan-table">
              <el-table-column label="序号" type="index"></el-table-column>
              <el-table-column prop="integralNum" label="积分数量">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.integralNum" placeholder="请输入积分数量"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="rightsId" label="兑换权益">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.rightsId" placeholder="请选择兑换权益">
                    <el-option v-for="(item,index) in interestsOptions" :key="index" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="num" label="数量">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.num" placeholder="请输入数量"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注" width="300px">
                <template slot-scope="scope">
                  <el-input type="textarea" v-model="scope.row.remark" placeholder="备注" maxlength="150"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width='120'>
                <template slot-scope="scope">
                  <el-button size="mini" @click="deleteRule(scope.row,scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button size="medium" class="add-rule vlt-add-more" @click="addRule" :id="'reuse-addRule'">
            <i class="el-icon-plus"></i> 新增兑换规则
            </el-button>
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
        </panel>
        <panel title="活动资金" :show="true" class="vlt-edit-single">
          <el-form :model="moneyRule" :rules="rules" ref="moneyRule" style="margin-top:20px;" label-width="10em">
            <el-form-item label="活动资金规则模板" prop="MoneyRuleTemplate">
              <el-select filterable v-model="moneyRule.MoneyRuleTemplate" placeholder="请选择活动规则模板" @change="MoneySelect">
                <el-option
                  v-for="(item,index) in ruleTemplateOptions1"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-table :data="moneyTableData" border  class="table-content plan-table">
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
                <el-select v-model="scope.row.gameCode" placeholder="游戏名称">
                  <el-option v-for="(item,index) in gameNameOptions" :key="index" :label="item.label" :value="String(item.value)"></el-option>
                </el-select>
              </template>
            </el-table-column> -->
            <el-table-column prop="injectionAmount" label="注入金额">
              <template slot-scope="scope">
                <el-input v-model="scope.row.injectionAmount" placeholder="注入金额"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注">
              <template slot-scope="scope">
                <el-input v-model="scope.row.remark" placeholder="备注"></el-input>
              </template>
            </el-table-column>
            <!-- <el-table-column label="操作" width='120'>
              <template slot-scope="scope">
                <el-button class="vlt-delete-more" size="mini" @click="deleteData(scope.row,scope.$index)">删除</el-button>
              </template>
            </el-table-column> -->
          </el-table>
        <!-- <el-button size="medium" class="add-content vlt-add-more" @click="addContent">
        <i class="el-icon-plus"></i> 新增资金规则
        </el-button> -->
        </panel>
        <panel title="活动资源" :show="true" class="vlt-edit-single">
          <el-form :model="resourceRuleData" :rules="rules" ref="resourceRule" style="margin-top:20px;" label-width="10em">
            <el-form-item label="活动资源规则模板" prop="resourceRuleTemplate">
              <el-select filterable v-model="resourceRuleData.resourceRuleTemplate" placeholder="请选择活动规则模板" @change="resourceSel">
                <el-option
                  v-for="(item,index) in ruleTemplateOptions2"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div class="table-wrap">
            <el-table :data="resourceRule" border class="table">
              <el-table-column type="index" label="序号" fixed width="60px"></el-table-column>
              <el-table-column label="物品名称" min-width="160px">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.goodId" filterable placeholder="请选择">
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
                  <el-select v-model="scope.row.modelId" filterable placeholder="请选择" :disabled="scope.row.goodsType==3 || scope.row.goodsType == 4">
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
                    type="textarea"
                    :rows="2"
                    v-model="scope.row.goodsSerialNumber"
                    placeholder="请输入序列号"
                  ></el-input>
                </template>
              </el-table-column> -->
              <el-table-column label="物品数量" min-width="160px">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.num" placeholder="请输入数量"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="unitPrice" label="单价（元）" min-width="100px"></el-table-column>
              <el-table-column prop="amount" label="金额（元）" min-width="100px"></el-table-column>
              <el-table-column label="备注" min-width="200px">
                <template slot-scope="scope">
                  <el-input placeholder="请输入备注" v-model="scope.row.remark"></el-input>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="80px">
                <template slot-scope="scope">
                  <!-- <i class="el-icon-delete delete" @click="deleteGoods(scope.$index)"></i> -->
                  <el-button size="mini" @click="deleteGoods(scope.row,scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          <el-button size="medium" class="add vlt-add-more" @click="add" icon="el-icon-plus" :id="'reuse-add'">新增物品</el-button>
        </div>
        </panel>
        <panel title="监控指标" :show="true" class="vlt-edit-single">
          <el-form
            style="margin-top:20px;"
            :model="monitorRule"
            labelWidth="10em"
            ref="monitorRule"
            :rules="rules"
            direction="right">
            <el-form-item label="活动监控规则模板" prop="monitorRuleTemplate">
              <el-select filterable v-model="monitorRule.monitorRuleTemplate" placeholder="请选择活动规则模板" @change="monitorRuleSel">
                <el-option
                  v-for="(item,index) in ruleTemplateOptions3"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="维度选择">
              <el-checkbox-group v-model="monitorRule.dimensionalityVal" class="checkbox-content" @change="checkboxChange">
                <el-checkbox v-for="(item,index) in dimOptions" :label="item.value" :key="index">{{item.label}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="指标选择">
              <el-checkbox-group v-model="monitorRule.index">
                <el-checkbox v-for="(item,index) in indexOptions" :disabled="monitorRule.dimensionalityVal.length == 1 && monitorRule.dimensionalityVal.join(',') == 5 && (item.value == 2 || item.value == 6)" :label="item.value" :key="index">{{item.label}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </panel>
        <div class="footer-btn">
          <el-button :id="'reuse-save'" type="primary" size="small" @click="save">提 交</el-button>
          <el-button :id="'reuse-cancel'" size="small" @click="cancel">取 消</el-button>
        </div>
      </el-tab-pane>
      <!-- <el-tab-pane label="审核流程" name="processInfo">
        <img src="../../../../assets/img/avatar.jpg" />
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script type="text/javascript">
import {mapGetters} from "vuex"
export default {
  name: "reuse",
  data() {
    return {
      planTime: {
        disabledDate: time =>{
          return time.getTime() < Date.now() - 8.64e7;
        },
        selectableRange: `${this.$moment(Date.now()).format('HH:mm:ss')}-23:59:59`
      },
      rules: {
        activityName: [
          { required: true, validator: this.$rules.checkName, title: '活动计划名称', trigger: ['change','blur'] },
          { min: 5, max: 15, message: '活动名称长度5-15字符', trigger: ['change','blur'] }
        ],
        activityTarget: [{ required: true, validator: this.$rules.checkPositiveInteger, trigger: ['change','blur'] }],
        activityType: [{required: true, message:'请选择活动类型', trigger: ['change','blur']}],
        time: [{required: true, message: '请选择活动时间', trigger: ['change','blur']}],
        planTemplate: [{required: true, message: '请选择计划模板', trigger: ['change','blur']}],
        activeRuleTemplate: [{required: true, message: '请选择活动规则模板', trigger: ['change','blur']}],
        MoneyRuleTemplate: [{required: true, message: '请选择活动资金规则模板', trigger: ['change','blur']}],
        resourceRuleTemplate: [{required: true, message: "请选择活动资源规则模板", trigger: ['change','blur']}],
        monitorRuleTemplate: [{required: true, message: '请选择活动监控规则模板', trigger: ['change','blur']}],
        planTitle: [{required: true, validator: this.$rules.checkName, title: '计划标题', trigger: ['change','blur']}],
        planContent: [{required: true, message: '计划内容不能为空', trigger: ['change','blur']}]
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
      planTableForm: {
        tableData:[]  //计划内容
      },
      // 规则模板选项
      ruleTemplateOptions:[],  //活动规则模板
      ruleTemplateOptions1:[],  //资金规则模板
      ruleTemplateOptions2:[],  //资源规则模板
      ruleTemplateOptions3:[],   //监控规则模板
      
      form:{ //基础信息
        activityName:'',
        activityType:'',
        time:'',
        activityTarget:"",
        planTemplate:'',   //计划模板
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
      memberLevelOptions: [],    //会员等级
      conversionData:[],
      planTemplateName:"",    //存储用户选择的计划模板名称
      active:{},  //存储用户选择活动规则模板名称和type
      money:{},  //存储用户选择资金规则模板名称和type
      resource:{},  //存储用户选择资源规则模板名称和type
      monitoring:{},  //存储用户选择监控规则模板名称和type
      activeRule: {
        activeRuleTemplate:'',  //活动规则模板
        ruleObject:"1",
        isMemberBenefits:'',
        memberLevelName:[],
        isMessage:"",
        messageInfo:''
      },
      // 名称  型号
      options: [],
      // 资金规则
      
      moneyRule:{
        MoneyRuleTemplate:'',
      },
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
      
      resourceRuleData:{
        resourceRuleTemplate:'',
      },//资源规则模板
      allResourceData:[],//物品名称全部数据
      // nameOptions:[],
      // modelOptions:[],
      // 监控规则
      
      monitorRule:{
        dimensionalityVal:[],
        index:[],
        monitorRuleTemplate:''
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
    this.getPlanTemplate()     //获取活动计划模板
    this.getActiveityRule()    //获取活动规则模板
    this.getModelTree()   //获取物品名称
    this.getRightsTree()
    this.getLevelTree()    //获取会员等级
    this.getDetail()   //获取详情
    let gameParams = {"gameStatus":"1,2,3"}
    this.getGameName(gameParams) //获取游戏名称
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
    checkboxChange(val) {
      if (this.monitorRule.dimensionalityVal.length == 1 && this.monitorRule.dimensionalityVal.join(",") == 5) {
        this.monitorRule.index.forEach((item,index) =>{
          if (item == 2 || item == 6) {
            this.monitorRule.index.splice(index,1)
          }
        })
      }
    },
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
        self.form.planTemplate = res.data.activityPlanTemplate.planTemplateName
        self.baseForm.forEach(item =>{  //  计划模板
          for (let i in res.data.activityPlanTemplate) {
            item.value = res.data.activityPlanTemplate[item.prop]
          }
        })
        let tableData = res.data.activityPlanTemplate.activityPlanContentList
        let arr = tableData.map(item=>{return {"planTitle": item.planTitle,"planContent": item.planContent}})
        self.planTableForm.tableData = arr
        let ruleList = res.data.activityRuleTemplateList
        console.log(ruleList)
        ruleList.forEach(item =>{
          if(item.ruleType === 1) {
            console.log("活动规则",item)
            self.activeRule.activeRuleTemplate = item.ruleTemplateName;
            // for (let i in self.activeRule) {  // 活动规则
            //   for (let j in item.activityRule) {
            //     self.activeRule[i] = item.activityRule[i]
            //   }
            // }
            self.activeRule.ruleObject = item.activityRule.ruleObject;
            self.activeRule.isMemberBenefits = item.activityRule.isMemberBenefits;
            self.activeRule.memberLevelName = item.activityRule.memberLevelName;
            self.activeRule.isMessage = item.activityRule.isMessage;
            self.activeRule.messageInfo = item.activityRule.messageInfo;
            let list = item.activityRule.exchangeRuleList  
            let arr1 = list.map(li =>{return {"integralNum":li.integralNum,"rightsId":li.rightsId,"num":li.num,"remark":li.remark}})
            self.conversionData = arr1
          }
          if(item.ruleType === 2) {
            console.log('资金规则',item)
            self.moneyRule.MoneyRuleTemplate = item.ruleTemplateName
            let list1 = item.capitalRuleList
            let arr2 = list1.map(val =>{return {"dealType":val.dealType,"gameCode":val.gameCode,"injectionAmount":val.injectionAmount,"remark":val.remark}})
            self.moneyTableData = arr2
          }
          if(item.ruleType ===3) {
            self.resourceRuleData.resourceRuleTemplate = item.ruleTemplateName
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
            self.monitorRule.monitorRuleTemplate = item.ruleTemplateName
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
    // 获取计划模板
    async getPlanTemplate(){
      const self = this;
      let data = {insId: this.$storage.get("userInfo").insId}
      let res = await self.$api.getTemplateList( {data} )
      console.log(res)
      if (res && res.code == 0) {
        let list = res.data
        let arr = []
        list.forEach(item => {
          let obj = {}
          obj.label = item.planTemplateName
          obj.value = item.id
          arr.push(obj)
        });
        self.templateOptions = arr
      }
    },
    // 通过id去获取计划模板详情
    async handelChange(val) {
      const self = this
      let data = val;
      let res = await self.$api.activityPlanTemplateDetail({ data })
      console.log(res)
      if (res && res.code == 0) {
        self.planTemplateName = res.data.planTemplateName
        let list = res.data.activityPlanContentList
        let arr = list.map(item=>{return {"planTitle": item.planTitle,"planContent": item.planContent}})
        self.planTableForm.tableData = arr
        self.baseForm[0].value = res.data.manageBy
        self.baseForm[1].value = res.data.organizer
        self.baseForm[2].value = res.data.regionCode
      }
    },
    // 获取活动规则模板详情
    async getActiveityRule() {
      const self = this
      let data = {insId: this.$storage.get("userInfo").insId}
      let res = await self.$api.getRuleAll({data})
      console.log(res)
      if (res && res.code == 0) {
        let list = res.data
        let data1 = list.filter(val =>{return val.ruleType === 1})
        let arr1 = data1.map(item=>{return {"label":item.ruleTemplateName,"value":item.id}})
        self.ruleTemplateOptions = arr1
        let data2 = list.filter(val =>{return val.ruleType === 2})
        let arr2 = data2.map(item =>{return {"label":item.ruleTemplateName,"value":item.id}})
        self.ruleTemplateOptions1 = arr2
        let data3 = list.filter(val=>{return val.ruleType === 3})
        let arr3 = data3.map(item=>{return {"label":item.ruleTemplateName,"value":item.id}})
        self.ruleTemplateOptions2 = arr3
        let data4 = list.filter(val =>{return val.ruleType === 4})
        let arr4 = data4.map(item =>{return {"label":item.ruleTemplateName,"value":item.id}})
        self.ruleTemplateOptions3 = arr4
      }
    },
    async activitySelect(val){
      const self = this
      let data = val
      let res = await self.$api.getRuleTemplateDetail({data})
      if (res && res.code == 0) { //活动规则模板选择
        self.active.ruleTemplateName = res.data.ruleTemplateName || self.activeRule.activeRuleTemplate
        self.active.ruleType = res.data.ruleType
        let list = res.data.activityRule
        let arr = JSON.parse(JSON.stringify(self.activeRule))
        let list1 = res.data.activityRule.exchangeRuleList;
        self.activeRule.ruleObject = list.ruleObject;
        self.activeRule.isMemberBenefits = list.isMemberBenefits;
        self.activeRule.memberLevelName = list.memberLevelName;
        self.activeRule.isMessage = list.isMessage;
        self.activeRule.messageInfo = list.messageInfo;
        let arr1 = list1.map(li =>{return {"integralNum":li.integralNum,"rightsId":li.rightsId,"num":li.num,"remark":li.remark}})
        self.conversionData = arr1
      }
    },
    async MoneySelect(val) {//资金规则模板选择
      const self = this
      let data = val
      let res = await self.$api.getRuleTemplateDetail({data})
      if (res && res.code == 0){
        self.money.ruleTemplateName = res.data.ruleTemplateName
        self.money.ruleType = res.data.ruleType
        let list = res.data.capitalRuleList
        let arr = list.map(val =>{return {"dealType":val.dealType,"gameCode":val.gameCode,"injectionAmount":val.injectionAmount,"remark":val.remark}})
        self.moneyTableData = arr
      }
    },
    async resourceSel(val) {//资源规则模板选择
      const self = this;
      let data = val;
      let res = await self.$api.getRuleTemplateDetail({data})
      if (res && res.code == 0) {
        self.resource.ruleTemplateName = res.data.ruleTemplateName
        self.resource.ruleType = res.data.ruleType
        let list = res.data.resourceRuleList
        self.resourceRule = []
        list.forEach((item,index)=>{
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
    },
    async monitorRuleSel(val) { //监控规则模板
      const self = this
      let data = val
      let res = await self.$api.getRuleTemplateDetail({data})
      console.log(res)
      if (res && res.code == 0) {
        self.monitoring.ruleTemplateName = res.data.ruleTemplateName
        self.monitoring.ruleType = res.data.ruleType
        self.monitorRule.dimensionalityVal = res.data.monitorRule.dimensionalityName
        self.monitorRule.index = res.data.monitorRule.rationName
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
    //获取所有物品信息//资源规则表格数据
    async getModelTree() {
      const self = this;
      let res = await self.$api.getModelTree();
      if (res && res.code == 0) {
        this.nameOptions = res.data
        self.allResourceData = res.data;
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
      //选择物品名称
    selectName(index, row) {
      row.num = 1;
      row.modelId = "";
      // row.goodsSerialNumber = "";
      row.remark = ""
      row.goodName = this.nameOptions[index].goodsName;
      row.goodsType = this.nameOptions[index].goodsType;
      for (let item of this.nameOptions) {
        if (item.goodsType === 1 || item.goodsType === 2) {
          row.modelOptions = this.nameOptions[index].modelInfoVoList;
        } else if (item.goodsType === 3 || item.goodsType === 4) {
          row.unitPrice = this.nameOptions[index].unitPrice;
        } else {
          alert("error");
        }
      }
    },
    //选择物品型号
    selectModel(index, row) {
      // row.goodsSerialNumber = "";
      row.unitPrice = row.modelOptions[index].unitPrice;
    },
    // 资源规则删除物品
    deleteGoods(row,index){
      this.$confirm("是否确认删除", '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() =>{
        this.resourceRule.splice(index,1);
        this.$message({
          type: 'success',
          message: "删除成功"
        })
      }).catch(() =>{
        this.$message({
          type: "warning",
          message: "已取消删除"
        })
      })
    },
    //资源规则添加物品
    add() {
      let obj = {
        id: "",
        goodName: "",
        goodId:'',
        modelId: "",
        goodCode: "",
        // goodsSerialNumber: "",
        goodsType: "",
        num: "",
        unitPrice: "",
        amount: "",
        remark: "",
        nameOptions:[],
        modelOptions: []
      };
      this.allResourceData.forEach((list)=>{
        let listObj = {};
        listObj.label = list.goodsName
        listObj.value = list.id
        obj.nameOptions.push(listObj)
      })
      this.$set(this.resourceRule, this.resourceRule.length, obj);
    },
    // 新增活动计划
    addPlan() {
      let list = {
        planTitle: '',
        planContent: ''
      }
      this.planTableForm.tableData.push(list)
    },
    // 删除活动计划
    deletePlan(row,index) {
      this.$confirm('是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.planTableForm.tableData.splice(index, 1);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'warning',
            message: '已取消删除'
          });          
        });
    },
    // 删除兑换规则操作
    deleteRule(row,index){
      this.$confirm('是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.conversionData.splice(index, 1);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'warning',
            message: '已取消删除'
          });          
        });
    },
    // 新增兑换规则
    addRule(){
      let list = {integralNum: '',rightsId: '',num:'', remark:''};
      this.conversionData.push(list)
    },
    // 新增资金规则
    addContent() {
      let list = {
        dealType:'',
        gameCode:'',
        injectionAmount:'',
        remark:''
      }
      this.moneyTableData.push(list)
    },
    // 删除资金规则
    deleteData(row,index){
      this.$confirm('是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.moneyTableData.splice(index, 1);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'warning',
            message: '已取消删除'
          });          
        });
    },
    cancel() {
      this.$router.push({ path: "activityPlanManage" });
    },
    validateForm(form) {
      let flag = false
      this.$refs[form].validate((valid) => {
        flag = valid
      })
      return flag
    },
    save() {
      const self = this;
      let tablePlanForm = self.validateForm("planTableForm")
      let activeRule = self.validateForm("activeRule");
      let moneyRule = self.validateForm("moneyRule");
      let resourceRule = self.validateForm("resourceRule");
      let monitorRule = self.validateForm("monitorRule");
      self.$refs["baseForm"].validate( async (valid) =>{
        if (valid&&tablePlanForm&&activeRule&&moneyRule&&resourceRule&&monitorRule) {   
          let data = JSON.parse(JSON.stringify(self.form))
          let date = data.time;
          console.log(date)
          if (date&&date.length>0){
            data.startTime = self.$moment(date[0]).format("YYYY-MM-DD HH:mm:ss");
            data.endTime = self.$moment(date[1]).format("YYYY-MM-DD HH:mm:ss");         
          }
          let list = self.resourceRule
            let arr = list.map(val =>{
              return {
                "amount": val.amount,
                "goodId": val.goodId,
                // "goodsSerialNumber": val.goodsSerialNumber,
                "goodsType": val.goodsType,
                "modelId": val.modelId,
                "num": val.num,
                "remark": val.remark,
                "unitPrice": val.unitPrice
              }
            })
          data.activityPlanTemplate = JSON.parse(JSON.stringify(self.param))
          data.activityPlanTemplate.activityPlanContentList = self.planTableForm.tableData
          delete data.time
          data.activityRuleTemplateList = []
          let startName1 = {ruleTemplateName: self.activeRule.activeRuleTemplate,ruleType: 1}
          let rule1 = {...self.active};
          if (!rule1.ruleTemplateName) {
            rule1 = {...startName1}
          }
          // let memberLevelName = Object.assign({},self.activeRule.memberLevelName)
          // console.log('aa',self.activeRule.memberLevelName)
          rule1.activityRule = JSON.parse(JSON.stringify(self.activeRule))
          rule1.activityRule.memberLevel = self.activeRule.memberLevelName&&self.activeRule.memberLevelName.join(',')
          console.log(rule1.activityRule.memberLevel)
          rule1.activityRule.exchangeRuleList = self.conversionData
          delete rule1.activityRule.memberLevelName
          let startName2 = {ruleTemplateName: self.moneyRule.MoneyRuleTemplate,ruleType: 2}
          let rule2 = {...self.money}
          if (!rule2.ruleTemplateName) {
            rule2 = {...startName2}
          }
          rule2.capitalRuleList = self.moneyTableData
          let startName3 = {ruleTemplateName: self.resourceRuleData.resourceRuleTemplate,ruleType: 3}
          let rule3 = {...self.resource}
          if (!rule3.ruleTemplateName) {
            rule3 = {...startName3}
          }
          rule3.resourceRuleList = arr
          let startName4 = {ruleTemplateName: self.monitorRule.monitorRuleTemplate,ruleType: 4}
          let rule4 = {...self.monitoring}
          if (!rule4.ruleTemplateName) {
            rule4 = {...startName4}
          }
          rule4.monitorRule = JSON.parse(JSON.stringify(self.monitorRule))
          rule4.monitorRule.dimensionality = self.monitorRule.dimensionalityVal&&self.monitorRule.dimensionalityVal.join(',')
          rule4.monitorRule.ration = self.monitorRule.index&&self.monitorRule.index.join(',')
          delete rule4.monitorRule.dimensionalityVal
          delete rule4.monitorRule.index
          data.activityRuleTemplateList.push(rule1)
          data.activityRuleTemplateList.push(rule2)
          data.activityRuleTemplateList.push(rule3)
          data.activityRuleTemplateList.push(rule4)
          data.insId = self.$storage.get("userInfo").insId
          console.log(data)
          let res = await self.$api.createActivityPlan({message:'新建成功', data })
          if(res && res.code == 0) {
            self.$router.push("activityPlanManage")
          }
        }else {
          self.$message.warning("校验不通过")
        }
      })
    },
    changeBaseForm(val){
      this.param = val
      this.param.planTemplateName = this.planTemplateName || this.form.planTemplate
    },
    tabClick() {}
    }
};
</script>
<style lang="less" scoped >
@import "./less/index.less";
</style>