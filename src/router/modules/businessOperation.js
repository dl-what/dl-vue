// 业务运营系统路由配置
// 首页概况
const overviews = () => import('@/views/businessManage/home/overview')
// 我的待办
const myToDos = () => import('@/views/businessManage/home/myToDo')
// 我的待办-审批详情
const myToDoDetails = () => import('@/views/businessManage/home/myApplyDetail')
// 我的申请
const myApplications = () => import('@/views/businessManage/home/myApplication')
// 我的申请-审批详情
const myApplyDetails = () => import('@/views/businessManage/home/myApplyDetail')
// 我的已办
const myDones = () => import('@/views/businessManage/home/myDone')
// 我的已办-审批详情
const myDoneDetails = () => import('@/views/businessManage/home/myApplyDetail')
// 我的知会
const myKnowledges = () => import('@/views/businessManage/home/myKnowledge')
// 我的知会-审批详情
const myKnowledgeDetails = () => import('@/views/businessManage/home/myApplyDetail')
// 消息列表
const messageLists = () => import('@/views/businessManage/home/messageList')
// 查看消息
const messageDetails = () => import('@/views/businessManage/home/messageDetail');
//  档案管理
const dossierManages = () => import('@/views/businessManage/home/dossierManage')
// 档案管理-审批详情
const dossierDetails = () => import('@/views/businessManage/home/myApplyDetail')
//  app流程页面-投注卡申请
const appCardDetails = () => import('@/views/businessManage/home/appCardDetail')
//  app流程页面-设备维护申请
const appDeviceDetails = () => import('@/views/businessManage/home/appDeviceDetail')
//  app流程页面-损耗申请
const appLossDetails = () => import('@/views/businessManage/home/appLossDetail')

// 渠道账户列表
const accountList = () => import('@/views/businessOperation/channelAccount/accountList')
//渠道账户列表详情
const accountListDetail = () => import('@/views/businessOperation/channelAccount/accountListDetail')
//渠道详情
const channelDetails = () => import('@/views/businessManage/channelBusinessManage/channel/channelDetail')


//角色管理
const roleManage = () => import('@/views/businessOperation/PermissionMaintain/roleManage')
//角色管理新增
const roleManageAdd = () => import('@/views/businessOperation/PermissionMaintain/roleManageAdd')
//角色管理查看
const roleManageExamine = () => import('@/views/businessOperation/PermissionMaintain/roleManageExamine')
//角色管理编辑
const roleManageEdit = () => import('@/views/businessOperation/PermissionMaintain/roleManageEdit')
//账户管理
const operationAccountManage = () => import('@/views/businessOperation/PermissionMaintain/operationAccountManage')
//表单测试
// const test = () => import('@/views/businessOperation/PermissionMaintain/test')
//账户管理新增
const operationAccountAdd = () => import('@/views/businessOperation/PermissionMaintain/operationAccountAdd')
//账户管理查看
const operationAccountExamine = () => import('@/views/businessOperation/PermissionMaintain/operationAccountExamine')

//彩票兑奖
const lotteryTicket = () => import('@/views/businessOperation/LotteryManagement/lotteryTicket')
//兑奖编辑
const lotteryTicketExpiry = () => import('@/views/businessOperation/LotteryManagement/lotteryTicketExpiry')
//彩票兑奖详情
const lotteryTicketDetail = () => import('@/views/businessOperation/LotteryManagement/lotteryTicketDetail')
//彩票兑奖打印
const lotteryTicketPrint = () => import('@/views/businessOperation/LotteryManagement/lotteryTicketPrint')
//彩票兑奖补打
const lotteryTicketReprint = () => import('@/views/businessOperation/LotteryManagement/lotteryTicketReprint')
//兑奖设置
const expirySetting = () => import('@/views/businessOperation/LotteryManagement/expirySetting')
//兑奖处管理
const ticketOfficeManage = () => import('@/views/businessOperation/LotteryManagement/ticketOfficeManage')
//中奖查询
const winningCheck = () => import('@/views/businessOperation/LotteryManagement/winningCheck')
//中奖详情
const winningCheckDetail = () => import('@/views/businessOperation/LotteryManagement/winningCheckDetail')

//会员等级管理
const MemberGradeManagement = () => import('@/views/businessOperation/MemberManagement/MemberGradeManagement')

//会员方案新建
const theNewPlan = () => import('@/views/businessOperation/MemberManagement/MembershipLevelManagement/theNewPlan')
//会员权益管理
const MemberEquityManagement = () => import('@/views/businessOperation/MemberManagement/MemberEquityManagement')
//会员权益管理新增
const MemberEquityManagementAdd = () => import('@/views/businessOperation/MemberManagement/MemberEquityManagementAdd')
//会员权益添加
const navigationShow = () => import('@/views/businessOperation/MemberManagement/rightAndInterestOfMember/navigationShow')
//会员积分管理
const MemberIntegralManagement = () => import('@/views/businessOperation/MemberManagement/MemberIntegralManagement')
//会员风险等级设置
const RiskLevelSetting = () => import('@/views/businessOperation/MemberManagement/MemberRiskLevel/RiskLevelSetting/RiskLevelSetting')
//会员风险评估方案
const RiskAssessmentProgram = () => import('@/views/businessOperation/MemberManagement/MemberRiskLevel/RiskAssessmentProgram/RiskAssessmentProgram')
//会员风险评估题库
const RiskAssessmentQuestionBank = () => import('@/views/businessOperation/MemberManagement/MemberRiskLevel/RiskAssessmentQuestionBank/RiskAssessmentQuestionBank')
//新增风险评估方案
const evaluationProgramAdded = () => import('@/views/businessOperation/MemberManagement/MemberRiskLevel/RiskAssessmentProgram/evaluationProgramAdded')

//问卷制作
const makeToQuestion = () => import('@/views/businessOperation/questionnaireSurvey/makeToQuestion')
//问卷统计分析
const questionnairStatistical = () => import('@/views/businessOperation/questionnaireSurvey/questionnairStatistical')
//问卷统计分析查看
const questionnairStatisticalDetail = () => import('@/views/businessOperation/questionnaireSurvey/questionnairStatisticalDetail')
//问卷题库
const questionnaireBank = () => import('@/views/businessOperation/questionnaireSurvey/questionnaireBank')
//题目分类
const SubjectClassification = () => import('@/views/businessOperation/questionnaireSurvey/SubjectClassification')



//资金日结算报表
const financialStatementDaySettle = () => import('@/views/businessOperation/financialStatement/financialStatementDaySettle')
//资金日结算报表打印
const PrintDaySettle = () => import('@/views/businessOperation/financialStatement/PrintDaySettle')

//资金日分配报表
const financialStatementDayAllocation = () => import('@/views/businessOperation/financialStatement/financialStatementDayAllocation')
//资金日分配报表打印
const PrintDayAllocation = () => import('@/views/businessOperation/financialStatement/PrintDayAllocation')

//资金日流向报表
const financialStatementDayFlow = () => import('@/views/businessOperation/financialStatement/financialStatementDayFlow')
//资金日流向报表打印
const PrintDayFlow = () => import('@/views/businessOperation/financialStatement/PrintDayFlow')

//资金月结算报表
const financialStatementMonthSettle = () => import('@/views/businessOperation/financialStatement/financialStatementMonthSettle')
//资金月结算报表打印
const PrintMonthSettle = () => import('@/views/businessOperation/financialStatement/PrintMonthSettle')

//资金月分配报表
const financialStatementMonthAllocation = () => import('@/views/businessOperation/financialStatement/financialStatementMonthAllocation')
//资金月分配报表打印
const PrintMonthAllocation = () => import('@/views/businessOperation/financialStatement/PrintMonthAllocation')

//资金月流向报表
const financialStatementMonthFlow = () => import('@/views/businessOperation/financialStatement/financialStatementMonthFlow')
//资金月流向报表打印
const PrintMonthFlow = () => import('@/views/businessOperation/financialStatement/PrintMonthFlow')

//资金年结算报表
const financialStatementYearSettle = () => import('@/views/businessOperation/financialStatement/financialStatementYearSettle')
//资金年结算报表打印
const PrintYearSettle = () => import('@/views/businessOperation/financialStatement/PrintYearSettle')

//资金年结算报表
const financialStatementYearAllocation = () => import('@/views/businessOperation/financialStatement/financialStatementYearAllocation')
//资金年结算报表打印
const PrintYearAllocation = () => import('@/views/businessOperation/financialStatement/PrintYearAllocation')

//资金年流向报表
const financialStatementYearFlow = () => import('@/views/businessOperation/financialStatement/financialStatementYearFlow')
//资金年流向报表打印
const PrintYearFlow = () => import('@/views/businessOperation/financialStatement/PrintYearFlow')

//品牌营销推广  
//活动计划模板设置
const planTemplateSet = () => import('@/views/businessOperation/brandMarketing/planTemplateSet/planTemplateSet')
//活动计划模板预览
const previewTemplate = () => import('@/views/businessOperation/brandMarketing/planTemplateSet/previewTemplate')
//活动计划模板新建
const planTemplateCreate = () => import('@/views/businessOperation/brandMarketing/planTemplateSet/planTemplateCreate')

//活动规则模板设置 
const ruleTemplateSet = () => import('@/views/businessOperation/brandMarketing/ruleTemplateSet/ruleTemplateSet')
//活动规则模板新建  
const ruleTemplateCreate = () => import('@/views/businessOperation/brandMarketing/ruleTemplateSet/ruleTemplateCreate')
//活动规则详情
const activityRuleDetail = () => import('@/views/businessOperation/brandMarketing/ruleTemplateSet/activityRuleDetail')
//资金规则详情
const moneyRuleDetail = () => import('@/views/businessOperation/brandMarketing/ruleTemplateSet/moneyRuleDetail')
//资源规则详情
const resourcesRuleDetail = () => import('@/views/businessOperation/brandMarketing/ruleTemplateSet/resourcesRuleDetail')
//监控规则详情
const monitorRuleDetail = () => import('@/views/businessOperation/brandMarketing/ruleTemplateSet/monitorRuleDetail')
// 活动规则模板修改
const ruleModification = () => import('@/views/businessOperation/brandMarketing/ruleTemplateSet/ruleModification')





//活动计划管理
const activityPlanManage = () => import('@/views/businessOperation/brandMarketing/activityPlanManage/activityPlanManage')
//新建活动计划
const activityCreate = () => import('@/views/businessOperation/brandMarketing/activityPlanManage/activityCreate')
//活动计划详情
const planDetail = () => import('@/views/businessOperation/brandMarketing/activityPlanManage/planDetail')
// 活动计划复用
const reuse = () => import('@/views/businessOperation/brandMarketing/activityPlanManage/reuse')
//活动执行管理
const executionManage = () => import('@/views/businessOperation/brandMarketing/executionManage/executionManage')
//活动执行详情
const executionDetail = () => import('@/views/businessOperation/brandMarketing/executionManage/executionDetail')
//分配任务
const allotTask = () => import('@/views/businessOperation/brandMarketing/executionManage/allotTask')

//活动效果评估
const activityResult = () => import('@/views/businessOperation/brandMarketing/activityResult/activityResult')
//开始评估
const resultAssess = () => import('@/views/businessOperation/brandMarketing/activityResult/resultAssess')

//客户账户
//客户账户列表
const customerAccountList = () => import('@/views/businessOperation/customerAccount/customerAccountList')
//客户账户详情
const accountDetail = () => import('@/views/businessOperation/customerAccount/accountDetail')
//投注卡详情
const betcardDetail = () => import('@/views/businessOperation/customerAccount/betcardDetail')
//会员权益详情
const equityDetail = () => import('@/views/businessOperation/customerAccount/equityDetail')
// 客户标签管理
const customerTags = () => import('@/views/businessOperation/customerAccount/customerTags')
// 新增客户标签
const createCustomerTag = () => import('@/views/businessOperation/customerAccount/createCustomerTag')
// 客户标签详情
const customerTagDetail = () => import('@/views/businessOperation/customerAccount/customerTagDetail')
// 编辑标签
const editCustomerTag = () => import('@/views/businessOperation/customerAccount/editCustomerTag');

//账户记录
//充值记录列表
const rechargeRecord = () => import('@/views/businessOperation/accountRecord/rechargeRecord')
//充值记录详情
const rechargeDetail = () => import('@/views/businessOperation/accountRecord/rechargeDetail')
//投注记录列表
const bettingRecord = () => import('@/views/businessOperation/accountRecord/bettingRecord')
//投注记录详情
const betDetail = () => import('@/views/businessOperation/accountRecord/betDetail')
//兑奖记录列表
const cashRecord = () => import('@/views/businessOperation/accountRecord/cashRecord')
//兑奖记录详情
const cashDetail = () => import('@/views/businessOperation/accountRecord/cashDetail')
//提现记录列表
const withdrawalRecords = () => import('@/views/businessOperation/accountRecord/withdrawalRecords')
//提现记录详情
const withdrawalDetail = () => import('@/views/businessOperation/accountRecord/withdrawalDetail')
//积分账户列表
const integralRecord = () => import('@/views/businessOperation/accountRecord/integralRecord')
//积分账户详情
const integralDetail = () => import('@/views/businessOperation/accountRecord/integralDetail')
//成长值记录列表
const growthRecord = () => import('@/views/businessOperation/accountRecord/growthRecord')
//成长值记录详情
const growthRecordDetails = () => import('@/views/businessOperation/accountRecord/growthRecordDetails')

//资金流水列表
const fundsStatement = () => import('@/views/businessOperation/accountRecord/fundsStatement')
//资金流水详情
const fundsDetail = () => import('@/views/businessOperation/accountRecord/fundsDetail')
//风险评估记录
const recordOfRiskAssessment = () => import('@/views/businessOperation/accountRecord/recordOfRiskAssessment')
//风险评估记录详情
const recordOfRiskAssessmentDetails = () => import('@/views/businessOperation/accountRecord/recordOfRiskAssessmentDetails')
//责任彩票
//责任彩票列表
const dutyLotteryList = () => import('@/views/businessOperation/dutyLottery/dutyLotteryList')
//编辑责任类型
const dutyUpdate = () => import('@/views/businessOperation/dutyLottery/dutyUpdate')
//责任详情
const dutyDetail = () => import('@/views/businessOperation/dutyLottery/dutyDetail')

//公告信息发布
//公告信息发布列表
const bulletinList = () => import('@/views/businessOperation/noticeInfo/bulletinList')
//公告信息详情
const bulletinDetail = () => import('@/views/businessOperation/noticeInfo/bulletinDetail')
//新增公告信息发布
const addBullentin = () => import('@/views/businessOperation/noticeInfo/addBullentin')
//编辑公告信息
const bulletinEdit = () => import('@/views/businessOperation/noticeInfo/bulletinEdit')
//公告模板 
const bulletinTemplate = () => import('@/views/businessOperation/noticeInfo/bulletinTemplate')
//模板详情 
const templateDetail = () => import('@/views/businessOperation/noticeInfo/templateDetail')
//新建模板
const createTemplate = () => import('@/views/businessOperation/noticeInfo/createTemplate')



export default [
  // {
  //   path: 'demo',
  //   name: 'demo',
  //   component: demo,
  //   meta: {
  //     parentName: '', // 当左侧菜单匹配不到当前路由时(菜单无对应激活状态),请设置该属性值(菜单可激活的父级路由名称)
  //     title: '路由说明'
  //   }
  // },
  //首页
  {
    path: 'businessOperation/overviews/index',
    name: 'overviews',
    meta: {
      title: '首页',
    },
    component: overviews
  },
  {
    path: 'businessOperation/overview/myToDos',
    name: 'myToDos',
    meta: {
      title: '我的待办',
    },
    component: myToDos
  },
  {
    path: 'businessOperation/overview/myToDoDetails',
    name: 'myToDoDetails',
    meta: {
      title: '审批详情',
      parentName: 'myToDos'
    },
    component: myToDoDetails
  },
  {
    path: 'businessOperation/overview/myApplications',
    name: 'myApplications',
    meta: {
      title: '我的申请',
    },
    component: myApplications
  },
  {
    path: 'businessOperation/overview/myApplyDetails',
    name: 'myApplyDetails',
    meta: {
      title: '审批详情',
      parentName: 'myApplications'
    },
    component: myApplyDetails
  },
  {
    path: 'businessOperation/overview/myDones',
    name: 'myDones',
    meta: {
      title: '我的已办',
    },
    component: myDones
  },
  {
    path: 'businessOperation/overview/myDoneDetails',
    name: 'myDoneDetails',
    meta: {
      title: '审批详情',
      parentName: 'myDones'
    },
    component: myDoneDetails
  },
  {
    path: 'businessOperation/overview/myKnowledges',
    name: 'myKnowledges',
    meta: {
      title: '我的知会',
    },
    component: myKnowledges
  },
  {
    path: 'businessOperation/overview/myKnowledgeDetails',
    name: 'myKnowledgeDetails',
    meta: {
      title: '审批详情',
      parentName: 'myKnowledges'
    },
    component: myKnowledgeDetails
  },
  {
    path: 'businessOperation/overview/dossierManages',
    name: 'dossierManages',
    meta: {
      title: '档案管理',
    },
    component: dossierManages
  },
  {
    path: 'businessOperation/overview/dossierDetails',
    name: 'dossierDetails',
    meta: {
      title: '审批详情',
      parentName: 'dossierManages'
    },
    component: dossierDetails
  },
  {
    path: 'businessOperation/overview/appCardDetails',
    name: 'appCardDetails',
    meta: {
      title: 'APP投注卡申请',
      parentName: 'myApplications'
    },
    component: appCardDetails
  },
  {
    path: 'businessOperation/overview/appDeviceDetails',
    name: 'appDeviceDetails',
    meta: {
      title: 'APP设备维护申请',
      parentName: 'myApplications'
    },
    component: appDeviceDetails
  },
  {
    path: 'businessOperation/overview/appLossDetails',
    name: 'appLossDetails',
    meta: {
      title: 'APP损耗申请',
      parentName: 'myApplications'
    },
    component: appLossDetails
  },
  {
    path: 'businessOperation/overview/messageLists',
    name: 'messageLists',
    meta: {
      title: '站内信',
    },
    component: messageLists
  },
  {
    path: 'businessOperation/overview/messageDetails',
    name: 'messageDetails',
    meta: {
      parentName: 'messageLists',
      title: '查看消息',
    },
    component: messageDetails
  },

  //渠道账户
  {
    path: 'businessOperation/channelAccount/accountList',
    name: 'accountList',
    meta: {
      title: '渠道账户列表',
    },
    component: accountList
  },
  {
    path: 'businessOperation/channelAccount/accountListDetail',
    name: 'accountListDetail',
    meta: {
      parentName: "accountList",
      title: '渠道账户列表详情',
    },
    component: accountListDetail
  },
  {
    path: 'businessOperation/channelAccount/channelDetails',
    name: 'channelDetails',
    meta: {
      parentName: "accountList",
      title: '渠道详情',
    },
    component: channelDetails
  },
  {
    path: 'businessOperation/PermissionMaintain/roleManage',
    name: 'roleManage',
    meta: {
      title: '角色管理',
    },
    component: roleManage
  },
  {
    path: 'businessOperation/PermissionMaintain/roleManageAdd',
    name: 'roleManageAdd',
    meta: {
      parentName: "roleManage",
      title: '角色管理新增',
    },
    component: roleManageAdd
  },

  {
    path: 'businessOperation/PermissionMaintain/roleManageExamine',
    name: 'roleManageExamine',
    meta: {
      parentName: "roleManage",
      title: '角色管理查看',
    },
    component: roleManageExamine
  },
  {
    path: 'businessOperation/PermissionMaintain/roleManageEdit',
    name: 'roleManageEdit',
    meta: {
      parentName: "roleManage",
      title: '角色管理编辑',
    },
    component: roleManageEdit
  },

  {
    path: 'businessOperation/PermissionMaintain/operationAccountManage',
    name: 'operationAccountManage',
    meta: {
      title: '角色账户',
    },
    component: operationAccountManage
  },
  {
    path: 'businessOperation/PermissionMaintain/operationAccountAdd',
    name: 'operationAccountAdd',
    meta: {
      parentName: "operationAccountManage",
      title: '账户管理新增',
    },
    component: operationAccountAdd
  },
  {
    path: 'businessOperation/PermissionMaintain/operationAccountExamine',
    name: 'operationAccountExamine',
    meta: {
      parentName: "operationAccountManage",
      title: '账户管理查看',
    },
    component: operationAccountExamine
  },
  // {
  //   path: 'businessOperation/PermissionMaintain/test',
  //   name: 'test',
  //   meta: {
  //     parentName: "operationAccountManage",
  //     title: '表单测试',
  //   },
  //   component: test
  // },

  {
    path: 'businessOperation/LotteryManagement/lotteryTicket',
    name: 'lotteryTicket',
    meta: {
      parentName: "lotteryTicket",
      title: '大奖记录',
    },
    component: lotteryTicket
  },
  {
    path: 'businessOperation/LotteryManagement/lotteryTicketExpiry',
    name: 'lotteryTicketExpiry',
    meta: {
      parentName: "lotteryTicket",
      title: '兑奖编辑',
    },
    component: lotteryTicketExpiry
  },
  {
    path: 'businessOperation/LotteryManagement/lotteryTicketDetail',
    name: 'lotteryTicketDetail',
    meta: {
      parentName: "lotteryTicket",
      title: '彩票兑奖详情',
    },
    component: lotteryTicketDetail
  },
  {
    path: 'businessOperation/LotteryManagement/lotteryTicketPrint',
    name: 'lotteryTicketPrint',
    meta: {
      parentName: "lotteryTicket",
      title: '彩票兑奖打印',
    },
    component: lotteryTicketPrint
  },
  {
    path: 'businessOperation/LotteryManagement/lotteryTicketReprint',
    name: 'lotteryTicketReprint',
    meta: {
      parentName: "lotteryTicket",
      title: '彩票兑奖补打',
    },
    component: lotteryTicketReprint
  },

  {
    path: 'businessOperation/LotteryManagement/expirySetting',
    name: 'expirySetting',
    meta: {
      title: '兑奖设置',
    },
    component: expirySetting
  },
  {
    path: 'businessOperation/LotteryManagement/ticketOfficeManage',
    name: 'ticketOfficeManage',
    meta: {
      parentName: "ticketOfficeManage",
      title: '兑奖处管理',
    },
    component: ticketOfficeManage
  },
  {
    path: 'businessOperation/LotteryManagement/winningCheck',
    name: 'winningCheck',
    meta: {
      parentName: "winningCheck",
      title: '大奖兑奖',
    },
    component: winningCheck
  },
  {
    path: 'businessOperation/LotteryManagement/winningCheckDetail',
    name: 'winningCheckDetail',
    meta: {
      parentName: "winningCheck",
      title: '中奖详情',
    },
    component: winningCheckDetail
  },

  {
    path: 'businessOperation/MemberManagement/MemberGradeManagement',
    name: 'MemberGradeManagement',
    meta: {
      title: '会员等级管理',
    },
    component: MemberGradeManagement
  },
  {
    path: 'businessOperation/MemberManagement/theNewPlan',
    name: 'theNewPlan',
    meta: {
      parentName: "MemberManagement",
      title: '会员方案编辑',
    },
    component: theNewPlan
  },
  {
    path: 'businessOperation/MemberManagement/theNewPlanDetails',
    name: 'theNewPlanDetails',
    meta: {
      parentName: "MemberGradeManagement",
      title: '会员方案详情',
    },
    component: theNewPlan
  },
  {
    path: 'businessOperation/MemberManagement/MemberEquityManagement',
    name: 'MemberEquityManagement',
    meta: {
      title: '会员权益管理',
    },
    component: MemberEquityManagement
  },
  {
    path: 'businessOperation/MemberManagement/navigationShow',
    name: 'navigationShow',
    meta: {
      parentName: "MemberEquityManagement",
      title: '会员权益管理新增',
    },
    component: navigationShow
  },

  {
    path: 'businessOperation/MemberManagement/MemberIntegralManagement',
    name: 'MemberIntegralManagement',
    meta: {
      title: '会员积分管理',
    },
    component: MemberIntegralManagement
  },
  {
    path: 'businessOperation/MemberManagement/RiskLevelSetting',
    name: 'RiskLevelSetting',
    meta: {
      title: '风险等级管理'
    },
    component: RiskLevelSetting
  },
  {
    path: 'businessOperation/MemberManagement/RiskAssessmentProgram',
    name: 'RiskAssessmentProgram',
    meta: {
      title: '风险评估方案'
    },
    component: RiskAssessmentProgram
  },
  {
    path: 'businessOperation/MemberManagement/RiskAssessmentQuestionBank',
    name: 'RiskAssessmentQuestionBank',
    meta: {
      title: '风险评估题库'
    },
    component: RiskAssessmentQuestionBank
  },
  {
    path: 'businessOperation/MemberManagement/evaluationProgramAdded',
    name: 'evaluationProgramAdded',
    meta: {
      parentName: 'RiskAssessmentProgram',
      title: '新增风险评估方案'
    },
    component: evaluationProgramAdded
  },
  {
    path: 'businessOperation/MemberManagement/evaluationProgramEdit',
    name: 'evaluationProgramEdit',
    meta: {
      parentName: 'RiskAssessmentProgram',
      title: '编辑风险评估方案'
    },
    component: evaluationProgramAdded
  },
  {
    path: 'businessOperation/MemberManagement/evaluationProgramDetails',
    name: 'evaluationProgramDetails',
    meta: {
      parentName: 'RiskAssessmentProgram',
      title: '风险评估方案详情'
    },
    component: evaluationProgramAdded
  },
  {
    path: 'businessOperation/questionnaireSurvey/makeToQuestion',
    name: 'makeToQuestion',
    meta: {
      parentName: 'makeToQuestion',
      title: '问卷制作'
    },
    component: makeToQuestion
  },
  {
    path: 'businessOperation/questionnaireSurvey/questionnairStatistical',
    name: 'questionnairStatistical',
    meta: {
      parentName: 'questionnairStatistical',
      title: '问卷统计分析'
    },
    component: questionnairStatistical
  },
  {
    path: 'businessOperation/questionnaireSurvey/questionnairStatisticalDetail',
    name: 'questionnairStatisticalDetail',
    meta: {
      parentName: 'questionnairStatistical',
      title: '问卷统计分析'
    },
    component: questionnairStatisticalDetail
  },

  {
    path: 'businessOperation/questionnaireSurvey/questionnaireBank',
    name: 'questionnaireBank',
    meta: {
      parentName: 'questionnaireBank',
      title: '问卷题库'
    },
    component: questionnaireBank
  },
  {
    path: 'businessOperation/questionnaireSurvey/SubjectClassification',
    name: 'SubjectClassification',
    meta: {
      parentName: 'SubjectClassification',
      title: '题目分类'
    },
    component: SubjectClassification
  },





  {
    path: 'businessOperation/financialStatementDaySettle',
    name: 'financialStatementDaySettle',
    meta: {
      title: '资金日结算报表',
    },
    component: financialStatementDaySettle
  },
  {
    path: 'businessOperation/PrintDaySettle',
    name: 'PrintDaySettle',
    meta: {
      title: '资金日结算报表打印',
    },
    component: PrintDaySettle
  },


  {
    path: 'businessOperation/financialStatementDayAllocation',
    name: 'financialStatementDayAllocation',
    meta: {
      title: '资金日分配报表',
    },
    component: financialStatementDayAllocation
  },
  {
    path: 'businessOperation/PrintDayAllocation',
    name: 'PrintDayAllocation',
    meta: {
      title: '资金日分配报表打印',
    },
    component: PrintDayAllocation
  },

  {
    path: 'businessOperation/financialStatementDayFlow',
    name: 'financialStatementDayFlow',
    meta: {
      title: '资金日流向报表',
    },
    component: financialStatementDayFlow
  },
  {
    path: 'businessOperation/PrintDayFlow',
    name: 'PrintDayFlow',
    meta: {
      title: '资金日流向报表打印',
    },
    component: PrintDayFlow
  },

  {
    path: 'businessOperation/financialStatementMonthSettle',
    name: 'financialStatementMonthSettle',
    meta: {
      title: '资金月结算报表',
    },
    component: financialStatementMonthSettle
  },
  {
    path: 'businessOperation/PrintMonthSettle',
    name: 'PrintMonthSettle',
    meta: {
      title: '资金月结算报表打印',
    },
    component: PrintMonthSettle
  },

  {
    path: 'businessOperation/financialStatementMonthAllocation',
    name: 'financialStatementMonthAllocation',
    meta: {
      title: '资金月分配报表',
    },
    component: financialStatementMonthAllocation
  },
  {
    path: 'businessOperation/PrintMonthAllocation',
    name: 'PrintMonthAllocation',
    meta: {
      title: '资金月分配报表打印',
    },
    component: PrintMonthAllocation
  },

  {
    path: 'businessOperation/financialStatementMonthFlow',
    name: 'financialStatementMonthFlow',
    meta: {
      title: '资金月流向报表',
    },
    component: financialStatementMonthFlow
  },
  {
    path: 'businessOperation/PrintMonthFlow',
    name: 'PrintMonthFlow',
    meta: {
      title: '资金月流向报表打印',
    },
    component: PrintMonthFlow
  },

  {
    path: 'businessOperation/financialStatementYearSettle',
    name: 'financialStatementYearSettle',
    meta: {
      title: '资金年结算报表',
    },
    component: financialStatementYearSettle
  },
  {
    path: 'businessOperation/PrintYearSettle',
    name: 'PrintYearSettle',
    meta: {
      title: '资金年结算报表打印',
    },
    component: PrintYearSettle
  },

  {
    path: 'businessOperation/financialStatementYearAllocation',
    name: 'financialStatementYearAllocation',
    meta: {
      title: '资金年分配报表',
    },
    component: financialStatementYearAllocation
  },
  {
    path: 'businessOperation/PrintYearAllocation',
    name: 'PrintYearAllocation',
    meta: {
      title: '资金年分配报表打印',
    },
    component: PrintYearAllocation
  },

  {
    path: 'businessOperation/financialStatementYearFlow',
    name: 'financialStatementYearFlow',
    meta: {
      title: '资金年流向报表',
    },
    component: financialStatementYearFlow
  },
  {
    path: 'businessOperation/PrintYearFlow',
    name: 'PrintYearFlow',
    meta: {
      title: '资金年流向报表打印',
    },
    component: PrintYearFlow
  },



  //品牌与营销推广
  {
    path: 'businessOperation/planTemplateSet/planTemplateSet',
    name: 'planTemplateSet',
    meta: {
      title: '活动计划模板设置',
    },
    component: planTemplateSet,
  },
  {
    path: 'businessOperation/planTemplateSet/previewTemplate',
    name: 'previewTemplate',
    meta: {
      parentName: 'planTemplateSet',
      title: '预览模板',
    },
    component: previewTemplate,
  },
  {
    path: 'businessOperation/planTemplateSet/planTemplateCreate',
    name: 'planTemplateCreate',
    meta: {
      parentName: 'planTemplateSet',
      title: '活动计划模板新建',
    },
    component: planTemplateCreate,
  },
  {
    path: 'businessOperation/ruleTemplateSet/ruleTemplateSet',
    name: 'ruleTemplateSet',
    meta: {
      title: '活动规则模板设置',
    },
    component: ruleTemplateSet,
  },
  {
    path: 'businessOperation/ruleTemplateSet/ruleTemplateCreate',
    name: 'ruleTemplateCreate',
    meta: {
      parentName: 'ruleTemplateSet',
      title: '活动规则模板新建',
    },
    component: ruleTemplateCreate,
  },
  {
    path: 'businessOperation/ruleTemplateSet/activityRuleDetail',
    name: 'activityRuleDetail',
    meta: {
      parentName: 'ruleTemplateSet',
      title: '活动规则详情',
    },
    component: activityRuleDetail,
  },
  {
    path: 'businessOperation/ruleTemplateSet/moneyRuleDetail',
    name: 'moneyRuleDetail',
    meta: {
      parentName: 'ruleTemplateSet',
      title: '资金规则详情',
    },
    component: moneyRuleDetail,
  },
  {
    path: 'businessOperation/ruleTemplateSet/resourcesRuleDetail',
    name: 'resourcesRuleDetail',
    meta: {
      parentName: 'ruleTemplateSet',
      title: '资源规则详情',
    },
    component: resourcesRuleDetail,
  },
  {
    path: 'businessOperation/ruleTemplateSet/monitorRuleDetail',
    name: 'monitorRuleDetail',
    meta: {
      parentName: 'ruleTemplateSet',
      title: '监控规则详情',
    },
    component: monitorRuleDetail,
  },
  {
    path: 'businessOperation/ruleTemplateSet/ruleModification',
    name: 'ruleModification',
    meta: {
      parentName: 'ruleTemplateSet',
      title: '规则模板修改',
    },
    component: ruleModification,
  },
  {
    path: 'businessOperation/brandMarketing/activityPlanManage',
    name: 'activityPlanManage',
    meta: {
      title: '活动计划管理',
    },
    component: activityPlanManage
  },
  {
    path: 'businessOperation/brandMarketing/planDetail',
    name: 'planDetail',
    meta: {
      parentName: 'activityPlanManage',
      title: '活动计划详情',
    },
    component: planDetail,
  },
  {
    path: 'businessOperation/brandMarketing/reuse',
    name: 'reuse',
    meta: {
      parentName: 'activityPlanManage',
      title: '活动计划复用',
    },
    component: reuse,
  },
  {
    path: 'businessOperation/brandMarketing/activityCreate',
    name: 'activityCreate',
    meta: {
      parentName: 'activityPlanManage',
      title: '新建活动计划',
    },
    component: activityCreate,
  },
  {
    path: 'businessOperation/brandMarketing/executionManage',
    name: 'executionManage',
    meta: {
      title: '活动执行管理',
    },
    component: executionManage
  },

  {
    path: 'businessOperation/brandMarketing/executionDetail',
    name: 'executionDetail',
    meta: {
      parentName: 'executionManage',
      title: '活动执行详情',
    },
    component: executionDetail,
  },
  {
    path: 'businessOperation/brandMarketing/allotTask',
    name: 'allotTask',
    meta: {
      parentName: 'executionManage',
      title: '分配任务',
    },
    component: allotTask,
  },
  {
    path: 'businessOperation/brandMarketing/activityResult',
    name: 'activityResult',
    meta: {
      title: '活动效果评估',
    },
    component: activityResult
  },
  {
    path: 'businessOperation/brandMarketing/resultAssess',
    name: 'resultAssess',
    meta: {
      parentName: 'activityResult',
      title: '效果评估',
    },
    component: resultAssess,
  },

  //账户记录
  {
    path: 'businessOperation/accountRecord/rechargeRecord',
    name: 'rechargeRecord',
    meta: {
      title: '充值记录',
    },
    component: rechargeRecord,
  },
  {
    path: 'businessOperation/accountRecord/recordOfRiskAssessmentDetails',
    name: 'recordOfRiskAssessmentDetails',
    meta: {
      parentName: 'recordOfRiskAssessment',
      title: '风险记录详情',
    },
    component: recordOfRiskAssessmentDetails
  },
  {
    path: 'businessOperation/accountRecord/recordOfRiskAssessment',
    name: 'recordOfRiskAssessment',
    meta: {
      title: '风险评估记录'
    },
    component: recordOfRiskAssessment
  },
  {
    path: 'businessOperation/accountRecord/rechargeDetail',
    name: 'rechargeDetail',
    meta: {
      parentName: 'rechargeRecord',
      title: '充值记录详情',
    },
    component: rechargeDetail,
  },
  {
    path: 'businessOperation/accountRecord/bettingRecord',
    name: 'bettingRecord',
    meta: {
      title: '投注记录',
    },
    component: bettingRecord,
  },
  {
    path: 'businessOperation/accountRecord/betDetail',
    name: 'betDetail',
    meta: {
      parentName: 'bettingRecord',
      title: '投注记录详情',
    },
    component: betDetail,
  },
  {
    path: 'businessOperation/accountRecord/cashRecord',
    name: 'cashRecord',
    meta: {
      title: '兑奖记录',
    },
    component: cashRecord,
  },
  {
    path: 'businessOperation/accountRecord/cashDetail',
    name: 'cashDetail',
    meta: {
      parentName: 'cashRecord',
      title: '兑奖记录详情',
    },
    component: cashDetail,
  },
  {
    path: 'businessOperation/accountRecord/withdrawalRecords',
    name: 'withdrawalRecords',
    meta: {
      title: '提现记录',
    },
    component: withdrawalRecords,
  },
  {
    path: 'businessOperation/accountRecord/withdrawalDetail',
    name: 'withdrawalDetail',
    meta: {
      parentName: 'withdrawalRecords',
      title: '提现记录详情',
    },
    component: withdrawalDetail,
  },
  {
    path: 'businessOperation/accountRecord/integralRecord',
    name: 'integralRecord',
    meta: {
      title: '积分账户',
    },
    component: integralRecord,
  },
  {
    path: 'businessOperation/accountRecord/integralDetail',
    name: 'integralDetail',
    meta: {
      parentName: 'integralRecord',
      title: '积分账户详情',
    },
    component: integralDetail,
  },
  {
    path: 'businessOperation/accountRecord/growthRecord',
    name: 'growthRecord',
    meta: {
      title: '成长值记录',
    },
    component: growthRecord,
  },
  {
    path: 'businessOperation/accountRecord/growthRecordDetails',
    name: 'growthRecordDetails',
    meta: {
      title: '成长值记录详情',
      parentName: 'growthRecord'
    },
    component: growthRecordDetails,
  },
  {
    path: 'businessOperation/accountRecord/fundsStatement',
    name: 'fundsStatement',
    meta: {
      title: '资金流水',
    },
    component: fundsStatement,
  },
  {
    path: 'businessOperation/accountRecord/fundsDetail',
    name: 'fundsDetail',
    meta: {
      parentName: 'fundsStatement',
      title: '资金流水详情',
    },
    component: fundsDetail,
  },

  //客户账户
  {
    path: 'businessOperation/customerAccount/customerAccountList',
    name: 'customerAccountList',
    meta: {
      title: '客户账户列表',
    },
    component: customerAccountList,
  },
  {
    path: 'businessOperation/customerAccount/accountDetail',
    name: 'accountDetail',
    meta: {
      parentName: 'customerAccountList',
      title: '客户账户详情',
    },
    component: accountDetail,
  },
  {
    path: 'businessOperation/customerAccount/customerTags',
    name: 'customerTags',
    meta: {
      title: '客户标签管理',
    },
    component: customerTags,
  },
  {
    path: 'businessOperation/customerAccount/createCustomerTag',
    name: 'createCustomerTag',
    meta: {
      parentName: 'customerTags',
      title: '新增客户标签',
    },
    component: createCustomerTag
  },
  {
    path: 'businessOperation/customerAccount/customerTagDetail',
    name: 'customerTagDetail',
    meta: {
      parentName: 'customerTags',
      title: '客户标签详情',
    },
    component: customerTagDetail
  }, {
    path: 'businessOperation/customerAccount/editCustomerTag',
    name: 'editCustomerTag',
    meta: {
      parentName: 'customerTags',
      title: '编辑客户标签',
    },
    component: editCustomerTag

  },
  {
    path: 'businessOperation/customerAccount/betcardDetail',
    name: 'betcardDetail',
    meta: {
      parentName: 'customerAccount',
      title: '投注卡详情',
    },
    component: betcardDetail,
  },
  {
    path: 'businessOperation/customerAccount/equityDetail',
    name: 'equityDetail',
    meta: {
      parentName: 'customerAccount',
      title: '会员权益详情',
    },
    component: equityDetail,
  },

  //责任彩票
  {
    path: 'businessOperation/dutyLottery/dutyLotteryList',
    name: 'dutyLotteryList',
    meta: {
      title: '责任彩票列表',
    },
    component: dutyLotteryList,
  },
  {
    path: 'businessOperation/dutyLottery/dutyUpdate',
    name: 'dutyUpdate',
    meta: {
      parentName: 'dutyLotteryList',
      title: '编辑责任类型',
    },
    component: dutyUpdate,
  },

  {
    path: 'businessOperation/dutyLottery/dutyDetail',
    name: 'dutyDetail',
    meta: {
      parentName: 'dutyLotteryList',
      title: '责任详情',
    },
    component: dutyDetail,
  },

  //公告信息发布

  {
    path: 'businessOperation/noticeInfo/bulletinList',
    name: 'bulletinList',
    meta: {
      title: '公告信息发布列表',
    },
    component: bulletinList,
  },
  {
    path: 'businessOperation/noticeInfo/bulletinDetail',
    name: 'bulletinDetail',
    meta: {
      parentName: 'bulletinList',
      title: '公告信息详情',
    },
    component: bulletinDetail,
  },
  {
    path: 'businessOperation/noticeInfo/addBullentin',
    name: 'addBullentin',
    meta: {
      parentName: 'bulletinList',
      title: '新增公告信息发布',
    },
    component: addBullentin,
  },
  {
    path: 'businessOperation/noticeInfo/bulletinEdit',
    name: 'bulletinEdit',
    meta: {
      parentName: 'bulletinList',
      title: '公告信息编辑',
    },
    component: bulletinEdit,
  },
  {
    path: 'businessOperation/noticeInfo/bulletinTemplate',
    name: 'bulletinTemplate',
    meta: {
      title: '公告模板',
    },
    component: bulletinTemplate,
  },
  {
    path: 'businessOperation/noticeInfo/createTemplate',
    name: 'createTemplate',
    meta: {
      parentName: 'bulletinTemplate',
      title: '新建公告模板',
    },
    component: createTemplate,
  },
  {
    path: 'businessOperation/noticeInfo/templateDetail',
    name: 'templateDetail',
    meta: {
      parentName: 'bulletinTemplate',
      title: '公告模板详情',
    },
    component: templateDetail,
  },

]