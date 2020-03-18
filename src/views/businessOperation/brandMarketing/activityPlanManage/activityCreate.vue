<template>
  <div class="vlt-card active-plan">
    <el-tabs v-model="activeName" @tab-click="tabClick">
      <el-tab-pane label="活动内容" name="1">
        <panel title="基础信息" :show="true">
          <div class="vlt-edit-single">
            <el-form :model="form" label-width="10em" style="margin-top:20px" :rules="rules" ref="baseForm" :disabled="disabled">
              <el-form-item label="申请标题" prop="title" v-if="isValid">
                    <el-input v-model.trim="form.title" placeholder="请输入标题" maxlength="20" show-word-limit></el-input>
                  </el-form-item>
              <el-form-item label="活动名称" prop="activityName">
                <el-input v-model.trim="form.activityName" placeholder="请输入活动计划名称" maxlength="20" show-word-limit></el-input>
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
                  :clearable="true"
                  :editable="false"
                  :picker-options="planTime"
                  v-model="form.time"
                  type="datetimerange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="活动目标" prop="activityTarget">
                <el-input v-model="form.activityTarget" placeholder="请输入新增会员数量"></el-input>
              </el-form-item>
              <!-- 选择活动计划模板 -->
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
            <div class="vlt--edit-wrap">
              <base-form
                class="base-info"
                :formData="baseForm"
                labelWidth="9.3em"
                ref="baseForm1"
                :rules="rules"
                @change="changeBaseForm"
                :disabled="disabled"
              ></base-form>
            </div>
          </div>
          <!-- 计划表格 -->
          <el-form :model="planTableForm" ref="planTableForm" :rules="rules">
            <el-table :data="planTableForm.tableData" border class="table-content plan-table">
              <el-table-column label="序号" type="index" width="60"></el-table-column>
              <el-table-column label="计划标题" min-width="180">
                <template slot-scope="scope">
                  <el-form-item :prop="`tableData.${scope.$index}.planTitle`" :rules="rules.planTitle">
                    <el-input v-model.trim="scope.row.planTitle" placeholder="计划标题" :disabled="scope.row.disabled" maxlength="20" show-word-limit></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="计划内容" min-width="300">
                <template slot-scope="scope">
                  <el-form-item :prop="`tableData.${scope.$index}.planContent`" :rules="rules.planContent">
                    <el-input v-model="scope.row.planContent" placeholder="计划内容" type="textarea" :disabled="scope.row.disabled" maxlength="250"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="操作" width='100' v-if="!disabled">
                <template slot-scope="scope">
                  <el-form-item>
                    <el-button size="mini" @click="deletePlan(scope.row,scope.$index)">删除</el-button>
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
          <el-button size="medium" class="add-content vlt-add-more" @click="addPlan" :id="'activityCreate-addPlan'" v-if="!disabled">
            <i class="el-icon-plus"></i> 新增计划内容
          </el-button>
        </panel>
        <panel title="活动规则" :show="true" class="vlt-edit-single">
          <el-form
            :disabled="disabled"
            ref="activeRule"
            style="margin-top:20px;"
            :model="activeRule"
            :rules="rules"
            label-width="10em">
            <!-- 选择活动规则模板 -->
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
            <el-table :data="conversionData" border  class="table-content plan-table">
              <el-table-column label="序号" type="index" width="60"></el-table-column>
              <el-table-column prop="integralNum" label="积分数量" min-width="160">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.integralNum" placeholder="请输入积分数量" :disabled="scope.row.disabled"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="rightsId" label="兑换权益" min-width="160">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.rightsId" placeholder="请选择兑换权益">
                    <el-option v-for="(item,index) in interestsOptions" :key="index" :label="item.label" :value="item.value" :disabled="scope.row.disabled"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="num" label="数量" min-width="140">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.num" placeholder="请输入数量" :disabled="scope.row.disabled"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注" min-width="180px">
                <template slot-scope="scope">
                  <el-input type="textarea" v-model="scope.row.remark" placeholder="备注" :disabled="scope.row.disabled" maxlength="150"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width='100' v-if="!disabled">
                <template slot-scope="scope">
                  <el-button size="mini" @click="deleteRule(scope.row,scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button size="medium" class="add-rule vlt-add-more" @click="addRule" :id="'activityCreate-addRule'" v-if="!disabled">
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
              <el-input type="textarea" v-model="activeRule.messageInfo" maxlength="500"></el-input>
            </el-form-item> -->
          </el-form>
        </panel>
        <panel title="活动资金" :show="true" class="vlt-edit-single">
          <el-form :model="moneyRule" style="margin-top:20px;" :rules="rules" ref="moneyRule" label-width="10em" :disabled="disabled">
            <!-- 选择资金规则规则模板 -->
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
            <el-table-column prop="dealType" label="注入方式" >
              <template slot-scope="scope">
                <el-select v-model="scope.row.dealType" placeholder="注入方式" disabled>
                  <el-option v-for="(item,index) in injectionOptions" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="gameCode" label="游戏名称">
              <template slot-scope="scope">
                <el-select v-model="scope.row.gameCode" placeholder="游戏名称" :disabled="scope.row.disabled">
                  <el-option v-for="(item,index) in gameNameOptions" :key="index" :label="item.label" :value="String(item.value)"></el-option>
                </el-select>
              </template>
            </el-table-column> -->
            <el-table-column prop="injectionAmount" label="注入金额">
              <template slot-scope="scope">
                <el-input v-model="scope.row.injectionAmount" placeholder="注入金额" :disabled="scope.row.disabled"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注">
              <template slot-scope="scope">
                <el-input v-model="scope.row.remark" placeholder="备注" :disabled="scope.row.disabled"></el-input>
              </template>
            </el-table-column>
            <!-- <el-table-column label="操作" width='120' v-if="!disabled">
              <template slot-scope="scope">
                <el-button size="mini" @click="deleteData(scope.row,scope.$index)">删除</el-button>
              </template>
            </el-table-column> -->
          </el-table>
        <!-- <el-button size="medium" class="add-content vlt-add-more" @click="addContent" :id="'activityCreate-addContent'" v-if="!disabled">
        <i class="el-icon-plus"></i> 新增资金规则
        </el-button> -->
        </panel>
        <panel title="活动资源" :show="true" class="vlt-edit-single" >
          <el-form :model="resourceRuleData" style="margin-top:20px;" :rules="rules" ref="resourceRule" label-width="10em" :disabled="disabled">
            <!-- 选择活动资源规则模板 -->
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
                  <el-select v-model="scope.row.goodId" filterable placeholder="请选择" :disabled="scope.row.disabled">
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
                  <el-select v-model="scope.row.modelId" filterable placeholder="请选择" :disabled="scope.row.disabled || (scope.row.goodsType==3 || scope.row.goodsType == 4)">
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
              <el-table-column label="数量" min-width="160px">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.num" placeholder="请输入数量" :disabled="scope.row.disabled"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="unitPrice" label="单价（元）" min-width="100px"></el-table-column>
              <el-table-column prop="amount" label="金额（元）" min-width="100px"></el-table-column>
              <el-table-column label="备注" min-width="200px">
                <template slot-scope="scope">
                  <el-input placeholder="请输入备注" v-model="scope.row.remark" :disabled="scope.row.disabled"></el-input>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="80px" v-if="!disabled">
                <template slot-scope="scope">
                  <el-button size="mini" @click="deleteGoods(scope.row,scope.$index)">删除</el-button>
                  <!-- <i class="el-icon-delete delete" @click="deleteGoods(scope.$index)"></i> -->
                </template>
              </el-table-column>
            </el-table>
          <el-button size="medium" :id="'activityCreate-add'" class="add vlt-add-more" @click="add" icon="el-icon-plus" v-if="!disabled">新增物品</el-button>
        </div>
        </panel>
        <panel title="监控指标" :show="true" class="vlt-edit-single">
          <el-form
            :disabled="disabled"
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
        <div class="footer-btn" v-if="!disabled">
          <el-button :id="'activityCreate-submit'" type="primary" size="medium" @click="submit">提交</el-button>
          <el-button :id="'activityCreate-save'" type="primary" size="medium" @click="save" v-if="isValid">保存</el-button>
          <el-button :id="'activityCreate-cancel'" size="medium" @click="cancel">取消</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="审核流程" name="2" v-if="isValid">
        <img :src="diagramImg" alt="">
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/javascript">
import {mapGetters} from "vuex"
import ajax from "@/utils/ajax.js"
export default {
  name: "activityCreate",
  data() {
    return {
      planTime: {
        disabledDate: time =>{
          return time.getTime() < Date.now() - 8.64e7;
        },
        selectableRange: `${this.$moment(Date.now()).format('HH:mm:ss')}-23:59:59`
        // selectableRange: ['09:30:00 - 12:00:00', '14:30:00 - 18:30:00',]

      },
      rules: {
        title: [
          { required: true, validator: this.$rules.checkName, title: "申请标题", trigger: ['change','blur'] }
        ],
        activityName: [
          { required: true,validator: this.$rules.checkName, title: '活动名称', trigger: ['change','blur'] },
          { min: 5, max: 15, message: '请输入活动名称，长度5-15字符', trigger: ['change','blur'] }
        ],
        activityType: [{required: true, message:'请选择活动类型', trigger: ['change','blur']}],
        activityTarget: [
          { required: true, validator: this.$rules.checkPositiveInteger, title:'会员数量', trigger: ['change','blur'] },
        ],
        time: [{required: true, message: '请选择活动时间', trigger: ['change','blur']}],
        planTemplate: [{required: true, message: '请选择计划模板', trigger: ['change','blur']}],
        activeRuleTemplate: [{required: true, message: '请选择活动规则模板', trigger: ['change','blur']}],
        MoneyRuleTemplate: [{required: true, message: '请选择活动资金规则模板', trigger: ['change','blur']}],
        resourceRuleTemplate: [{required: true, message: "请选择活动资源规则模板", trigger: ['change','blur']}],
        monitorRuleTemplate: [{required: true, message: '请选择活动监控规则模板', trigger: ['change','blur']}],
        planTitle: [{required: true, validator: this.$rules.checkName, title: '计划标题', trigger: ['change','blur']}],
        planContent: [{required: true, message: '计划内容不能为空', trigger: ['change','blur']}]
      },
      activeName: "1",
      isValid: false,
      disabled: true,
      // isShow: false,
      // 活动类型
      activeTypeOptions:[
        {label:'市场活动',value:1},
        {label:'产品活动',value:2},
        {label:'促销推广活动',value:3}
      ],
      // 计划模板选项
      templateOptions:[],
      planTableForm: {
        tableData:[{planTitle: "", planContent: ""}],  //计划内容
      },
      // 规则模板选项
      ruleTemplateOptions:[],  //活动规则模板
      ruleTemplateOptions1:[],  //资金规则模板
      ruleTemplateOptions2:[],  //资源规则模板
      ruleTemplateOptions3:[],   //监控规则模板
      planTemplate:'',   //计划模板
      planTemplateName:"",
      form:{ //基础信息
        title:'',
        activityName:'',
        activityType:'',
        time:'',
        activityTarget:"",
        //模板名称
        planTemplate: '',    //计划模板
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
      active:{},      //存储用户选择活动规则模板名称和type
      money:{},       //存储用户选择资金规则模板名称和type
      resource:{},    //存储用户选择资源规则模板名称和type
      monitoring:{},  //存储用户选择监控规则模板名称和type
      activeRule: {
        activeRuleTemplate:'',  //活动规则模板
        ruleObject:"1",
        isMemberBenefits:'',
        memberLevelName:[],
        isMessage: 1,
        messageInfo:'',
      },
      // 名称  型号
      options: [],
      // 资金规则
      moneyRule:{
        MoneyRuleTemplate: '',
      },
      injectionOptions:[ //资金规则注入方式
        {label:'发行经费注入',value: 1},
        {label:'调节基金注入',value: 2},
        {label:'公益金注入',value: 3},
        {label:'资金注入',value: 4}
      ],
      gameNameOptions:[],
      moneyTableData:[{dealType:1,gameCode:'',injectionAmount:'',remark:''}],  //资金规则表格数据
      // 资源规则
      resourceRule:[],
      resourceRuleData:{
        resourceRuleTemplate:'',   //资源规则模板
      },
      allResourceData:[],//物品名称全部数据
      // 监控规则
      monitorRule:{
        dimensionalityVal:[],
        index:[],
        monitorRuleTemplate:''
      },
      dimOptions:[{label: "中心", value: "1"}, {label: "省级", value: "2"}, {label: "市级", value: "3"},{label: "厅级", value: "4"},{label: "游戏终端", value: "5"}],
      indexOptions: [{label: "充值总额", value: "2"},{label: "投注总额", value: "3"},{label: "用户数", value: "4"},{label: "投注用户数", value: "5"},{label: "会员权益兑换次数",value: "6"}],
      diagramImg:'',
      actBusinessInsId: '',
      rule1: {},
      rule2: {},
      rule3: {},
      rule4: {},
      planName: ''
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
    this.getRightsTree() //获取会员权益
    this.getLevelTree()  //获取会员等级
    let gameParams = {"gameStatus":"1,2,3"}
    this.getGameName(gameParams)   // 获取游戏名称
    this.validProcess();
    if (this.$route.query.id) {
      let data = this.$route.query.id;
      this.getTaskData(data);
    } else {
      // this.isShow = true;
    };
    // 控制表单是否禁用
    this.disabled = this.$route.query.type == "1" ? true : false;
    // 控制操作按钮
    // this.isShow = this.$route.query.type == "1" ? true : false;
    // 初始化请求用户id
    this.actBusinessInsId = this.$storage.get('userInfo').insId;
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
    // 是否审批流程校验
    validProcess() {
      const self = this;
      let router = this.$route.name;
      let data = { router, actBusinessInsId: self.actBusinessInsId};
      (async data => {
        let res = await self.$api.validProcess({ data });
        if (res && res.code == 0) {
          self.isValid = res.data.valid;
          self.diagramImg =`${ajax.baseURL}/act/business/diagram/${self.$route.name}/${self.actBusinessInsId}`;
        }
      })(data);
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
      console.log()
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
      const self = this;
      let data = {insId: this.$storage.get("userInfo").insId};
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
        self.active.ruleTemplateName = res.data.ruleTemplateName
        self.active.ruleType = res.data.ruleType
        let list = res.data.activityRule
        let arr = JSON.parse(JSON.stringify(self.activeRule));
        let list1 = res.data.activityRule.exchangeRuleList;
        console.log('活动规则',list)
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
        console.log("会员权益",list)
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
        console.log('资源',res.data)
        self.allResourceData = res.data;
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
    deleteRule(index){
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
      this.$router.push("activityPlanManage")
    },
    validateForm(form) {
      let flag = false
      this.$refs[form].validate((valid) => {
        flag = valid
      })
      return flag
    },
    submit() {
      const self = this;
      let tablePlanForm = self.validateForm("planTableForm")
      let activeRule = self.validateForm("activeRule");
      let moneyRule = self.validateForm("moneyRule");
      let resourceRule = self.validateForm("resourceRule");
      let monitorRule = self.validateForm("monitorRule");
      self.$refs["baseForm"].validate( async (valid) =>{
        if (valid&&tablePlanForm&&activeRule&&moneyRule&&resourceRule&&monitorRule) {
          let data = JSON.parse(JSON.stringify(self.form))
          // delete data.title;
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
          if (self.param.planTemplateName == "") {
            self.param.planTemplateName = self.planName
          }
          data.activityPlanTemplate = JSON.parse(JSON.stringify(self.param))
          data.activityPlanTemplate.activityPlanContentList = self.planTableForm.tableData
          delete data.time
          if (JSON.stringify(self.active) == "{}") {
            self.active = self.rule1
          };
          data.activityRuleTemplateList = []
          let rule1 = {...self.active};
          rule1.activityRule = JSON.parse(JSON.stringify(self.activeRule))
          rule1.activityRule.memberLevel = self.activeRule.memberLevelName&&self.activeRule.memberLevelName.join(',')
          rule1.activityRule.exchangeRuleList = self.conversionData
          delete rule1.activityRule.memberLevelName
          if (JSON.stringify(self.money) == "{}") {
            self.money = self.rule2
          };
          let rule2 = {...self.money}
          rule2.capitalRuleList = self.moneyTableData
          if (JSON.stringify(self.resource) == "{}") {
            self.resource = self.rule3
          };
          let rule3 = {...self.resource}
          rule3.resourceRuleList = arr
          if (JSON.stringify(self.monitoring) == "{}") {
            self.monitoring = self.rule4
          };
          let rule4 = {...self.monitoring}
          rule4.monitorRule = JSON.parse(JSON.stringify(self.monitorRule));
          rule4.monitorRule.dimensionality = self.monitorRule.dimensionalityVal&&self.monitorRule.dimensionalityVal.join(',');
          rule4.monitorRule.ration = self.monitorRule.index&&self.monitorRule.index.join(',');
          delete rule4.monitorRule.dimensionalityVal
          delete rule4.monitorRule.index
          data.activityRuleTemplateList.push(rule1)
          data.activityRuleTemplateList.push(rule2)
          data.activityRuleTemplateList.push(rule3)
          data.activityRuleTemplateList.push(rule4)
          data.insId = self.$storage.get("userInfo").insId
          console.log('提交参数',data)
          let validData = data;
          if (self.isValid) {
            let str = JSON.stringify(validData);
            data.actBusiness = {
              router: 'activityCreate',
              title: self.form.title,
              id: self.$route.query.id,   //从我的申请-编辑 需要带上id
              data: str,
              actBusinessInsId: self.actBusinessInsId
            };
            if (!self.$route.query.id) {
              // 直接创建   不需要带上id
              delete data.actBusiness.id;
            }
          }
          let res = await self.$api.createActivityPlan({message:'新建成功', data })
          if(res && res.code == 0) {
            if (self.isValid) {
              self.$router.push({name: 'myApplications'})
            } else {
              self.$router.push("activityPlanManage")
            }
          }
        } else {
          self.$message.warning("校验不通过")
        }
      })
    },
    // 暂存
    async save() {
      const self = this;
      let data = JSON.parse(JSON.stringify(self.form));
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
      let rule1 = {...self.active};
      rule1.activityRule = JSON.parse(JSON.stringify(self.activeRule))
      rule1.activityRule.memberLevel = self.activeRule.memberLevelName&&self.activeRule.memberLevelName.join(',')
      rule1.activityRule.exchangeRuleList = self.conversionData
      delete rule1.activityRule.memberLevelName
      let rule2 = {...self.money}
      rule2.capitalRuleList = self.moneyTableData
      let rule3 = {...self.resource}
      rule3.resourceRuleList = arr
      let rule4 = {...self.monitoring}
      rule4.monitorRule = JSON.parse(JSON.stringify(self.monitorRule));
      rule4.monitorRule.dimensionality = self.monitorRule.dimensionalityVal&&self.monitorRule.dimensionalityVal.join(',');
      rule4.monitorRule.ration = self.monitorRule.index&&self.monitorRule.index.join(',');
      delete rule4.monitorRule.dimensionalityVal
      delete rule4.monitorRule.index
      data.activityRuleTemplateList.push(rule1)
      data.activityRuleTemplateList.push(rule2)
      data.activityRuleTemplateList.push(rule3)
      data.activityRuleTemplateList.push(rule4)
      data.insId = self.$storage.get("userInfo").insId
      console.log('保存',data)
      if (!self.form.title) {
        self.$message.warning("申请标题不能为空");
        return;
      }
      let params = {
        router: "activityCreate",
        title: data.title,
        id: self.$route.query.id,    //编辑需带上id
        data: JSON.stringify(data),
        actBusinessInsId: self.actBusinessInsId
      };
      if (!self.$route.query.id) {
        // 新建不需要id
        delete params.id
      };
      self.saveDraft(params);
    },
    saveDraft(data) {
      const self = this;
      (async data => {
        let res = await self.$api.saveDraft({ data });
        if (res && res.code == 0) {
          console.log("res", res.data);
          self.$message.success("保存成功");
          self.$router.push({ name: "myApplications" });
        }
      })(data);
    },
    // 回填表单数据详情
    getTaskData(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getTaskData({ data });
        if (res && res.code == 0) {
          console.log("res", res.data);
          let data = JSON.parse(res.data.data);
          self.init(data);
        }
      })(data);
    },
    //  回填表单数据
    init(data) {
      const self = this;
      console.log('活动',data)     
      for (let i in self.form) {
        for (let j in data) {
          self.form[i] = data[i]
        }
      }
      let time = [];
      time.push(data.startTime);
      time.push(data.endTime);
      self.form.time = time;
      self.baseForm.forEach(item =>{
        item.value = data.activityPlanTemplate[item.prop]
      })
      self.planName = data.activityPlanTemplate.planTemplateName;
      data.activityPlanTemplate.activityPlanContentList.forEach((item)=>{
        if(this.$route.query.type==0) {
          item.disabled = false;
        }else {
          item.disabled = true;
        }
      })
      self.planTableForm.tableData = data.activityPlanTemplate.activityPlanContentList;
      let ruleList = data.activityRuleTemplateList;
      ruleList.forEach(item =>{
        if (item.ruleType == 1) {
          self.rule1.ruleTemplateName = item.ruleTemplateName;
          self.rule1.ruleType = item.ruleType;
          item.activityRule.exchangeRuleList.forEach(item =>{
            if(this.$route.query.type==0) {
              item.disabled = false;
            }else {
              item.disabled = true;
            }
          })
          for(let i in self.activeRule) {
            for(let j in item.activityRule) {
              self.activeRule[i] = item.activityRule[i]
              if( i == 'memberLevelName'&& item.activityRule.memberLevel) {
                self.activeRule.memberLevelName = item.activityRule.memberLevel.split(',')
              }
            }
          }
          self.conversionData = item.activityRule.exchangeRuleList;
        }
        if (item.ruleType == 2) {
          self.rule2.ruleTemplateName = item.ruleTemplateName;
          self.rule2.ruleType = item.ruleType;
          item.capitalRuleList.forEach(item =>{
            if(this.$route.query.type==0) {
              item.disabled = false;
            }else {
              item.disabled = true;
            }
          })
          self.moneyRule.MoneyRuleTemplate = item.ruleTemplateName;
          self.moneyTableData = item.capitalRuleList;
        }
        if (item.ruleType == 3) {
          self.rule3.ruleTemplateName = item.ruleTemplateName;
          self.rule3.ruleType = item.ruleType;
          item.resourceRuleList.forEach(item =>{
            if(this.$route.query.type==0) {
              item.disabled = false;
            }else {
              item.disabled = true;
            }
          });
          self.resourceRuleData.resourceRuleTemplate = item.ruleTemplateName;
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
        if (item.ruleType == 4) {
          self.rule4.ruleTemplateName = item.ruleTemplateName;
          self.rule4.ruleType = item.ruleType;
          self.monitorRule.monitorRuleTemplate = item.ruleTemplateName;
          self.monitorRule.dimensionalityVal = item.monitorRule.dimensionality&&item.monitorRule.dimensionality.split(',');
          self.monitorRule.index = item.monitorRule.ration&&item.monitorRule.ration.split(',')
        }
      })
    },
    changeBaseForm(val){
      this.param = val
      this.param.planTemplateName = this.planTemplateName
      console.log(this.param)
    },
    tabClick() {}
  }
};
</script>
<style lang="less" scoped >
@import "./less/index.less";
</style>