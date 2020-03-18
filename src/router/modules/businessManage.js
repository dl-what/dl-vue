// 业务管理系统路由配置

// 首页概况
const overview = () => import('@/views/businessManage/home/overview')
// 我的待办
const myToDo = () => import('@/views/businessManage/home/myToDo')
// 我的待办-审批详情
const myToDoDetail = () => import('@/views/businessManage/home/myApplyDetail')
// 我的申请
const myApplication = () => import('@/views/businessManage/home/myApplication')
// 我的申请-审批详情
const myApplyDetail = () => import('@/views/businessManage/home/myApplyDetail')
// 我的已办
const myDone = () => import('@/views/businessManage/home/myDone')
// 我的已办-审批详情
const myDoneDetail = () => import('@/views/businessManage/home/myApplyDetail')
// 我的知会
const myKnowledge = () => import('@/views/businessManage/home/myKnowledge')
// 我的知会-审批详情
const myKnowledgeDetail = () => import('@/views/businessManage/home/myApplyDetail')
// 消息列表
const messageList = () => import('@/views/businessManage/home/messageList')
// 查看消息
const messageDetail = () => import('@/views/businessManage/home/messageDetail');
//  档案管理
const dossierManage = () => import('@/views/businessManage/home/dossierManage')
// 档案管理-审批详情
const dossierDetail = () => import('@/views/businessManage/home/myApplyDetail')
//  app流程页面-投注卡申请
const appCardDetail = () => import('@/views/businessManage/home/appCardDetail')
//  app流程页面-设备维护申请
const appDeviceDetail = () => import('@/views/businessManage/home/appDeviceDetail')
//  app流程页面-损耗申请
const appLossDetail = () => import('@/views/businessManage/home/appLossDetail')

// 游戏储备列表
const gameList = () => import('@/views/businessManage/game/gameStore/gameList')
const gameDetail = () => import('@/views/businessManage/game/gameStore/gameDetail')
const gameEdit = () => import('@/views/businessManage/game/gameStore/gameEdit')
const gameCreate = () => import('@/views/businessManage/game/gameStore/gameCreate')
const gameTypeList = () => import('@/views/businessManage/game/gameStore/gameTypeList')
// 试玩计划列表
const trialPlanList = () => import('@/views/businessManage/game/planTry/planList')
const trialPlanDetail = () => import('@/views/businessManage/game/planTry/planDetail')
const trialPlanEdit = () => import('@/views/businessManage/game/planTry/editPlan')
const trialPlanCreate = () => import('@/views/businessManage/game/planTry/createPlan')
// 上市计划列表
const gameMarketPlanList = () => import('@/views/businessManage/game/planMarket/planList')
const gameMarketPlanDetail = () => import('@/views/businessManage/game/planMarket/planDetail')
const gameMarketPlanEdit = () => import('@/views/businessManage/game/planMarket/editPlan')
const gameMarketPlanCreate = () => import('@/views/businessManage/game/planMarket/createPlan')
// 变更计划列表
const gameChangePlanList = () => import('@/views/businessManage/game/planChange/planList')
const gameChangePlanDetail = () => import('@/views/businessManage/game/planChange/planDetail')
const gameChangePlanEdit = () => import('@/views/businessManage/game/planChange/editPlan')
const gameChangePlanCreate = () => import('@/views/businessManage/game/planChange/createPlan')
// 退市计划列表
const gameDelistingPlanList = () => import('@/views/businessManage/game/planDelisting/planList')
const gameDelistingPlanCreate = () => import('@/views/businessManage/game/planDelisting/createPlan')
const gameDelistingPlanEdit = () => import('@/views/businessManage/game/planDelisting/editPlan')
const gameDelistingPlanDetail = () => import('@/views/businessManage/game/planDelisting/planDetail')
// 风险控制
const riskReportList = () => import('@/views/businessManage/game/riskReport/riskReportList')
// 上市游戏
const gameMarketList = () => import('@/views/businessManage/game/gameMarket/gameMarketList')
const gameMarketDetail = () => import('@/views/businessManage/game/gameMarket/gameMarketDetail')


/*
  渠道业务管理
*/

// 渠道列表
const channelList = () => import('@/views/businessManage/channelBusinessManage/channel/channelList')
// 渠道详情
const channelDetail = () => import('@/views/businessManage/channelBusinessManage/channel/channelDetail')
// 业务办理
const channelDeal = () => import('@/views/businessManage/channelBusinessManage/channel/channelDeal')
// 新建渠道
const channelCreate = () => import('@/views/businessManage/channelBusinessManage/channel/channelCreate')
// 渠道变更
const channelChange = () => import('@/views/businessManage/channelBusinessManage/channel/channelChange')
// 渠道迁址
const channelRelocation = () => import('@/views/businessManage/channelBusinessManage/channel/channelRelocation')
// 渠道关停
const channelStop = () => import('@/views/businessManage/channelBusinessManage/channel/channelStop')
// 渠道过户
const channelTransfer = () => import('@/views/businessManage/channelBusinessManage/channel/channelTransfer')
// 渠道增机
const channelAddMachine = () => import('@/views/businessManage/channelBusinessManage/channel/channelAddMachine')
// 渠道退机
const channelBackMachine = () => import('@/views/businessManage/channelBusinessManage/channel/channelBackMachine')
// 渠道移机
const channelMoveMachine = () => import('@/views/businessManage/channelBusinessManage/channel/channelMoveMachine')
// 销售权限
const permissionChannelSales = () => import('@/views/businessManage/channelBusinessManage/permission/permissionChannelSales')
// 资金权限
const permissionChannelFunds = () => import('@/views/businessManage/channelBusinessManage/permission/permissionChannelFunds')
// 费率调整
const permissionChannelRate = () => import('@/views/businessManage/channelBusinessManage/permission/permissionChannelRate')
// 资源申请
const resourceApply = () => import('@/views/businessManage/channelBusinessManage/resource/resourceApply')
// 资源发放
const resourceProvide = () => import('@/views/businessManage/channelBusinessManage/resource/resourceProvide')
// 资源采购
const resourcePurchase = () => import('@/views/businessManage/channelBusinessManage/resource/resourcePurchase')
// 资源调拨
const resourceAllot = () => import('@/views/businessManage/channelBusinessManage/resource/resourceAllot')
// 资源报废
const resourceScrap = () => import('@/views/businessManage/channelBusinessManage/resource/resourceScrap')
/*
  年度发展计划
*/
const developmentPlan = () => import('@/views/businessManage/channelBusinessManage/development/developmentPlan')
const developmentPlanSummary = () => import('@/views/businessManage/channelBusinessManage/development/developmentPlanSummary')
const developmentPlanCreate = () => import('@/views/businessManage/channelBusinessManage/development/developmentPlanCreate')
const developmentPlanDetail = () => import('@/views/businessManage/channelBusinessManage/development/developmentPlanDetail')
const developmentPlanEdit = () => import('@/views/businessManage/channelBusinessManage/development/developmentPlanEdit')
const developmentPlanList = () => import('@/views/businessManage/channelBusinessManage/development/developmentPlanList')
const developmentPlanProvince = () => import('@/views/businessManage/channelBusinessManage/development/developmentPlanProvince')
const developmentPlanCity = () => import('@/views/businessManage/channelBusinessManage/development/developmentPlanCity')
const developmentPlanProvinceDetail = () => import('@/views/businessManage/channelBusinessManage/development/developmentPlanProvinceDetail')
const developmentPlanCityDetail = () => import('@/views/businessManage/channelBusinessManage/development/developmentPlanCityDetail');



//渠道资源管理
const putStoreManage = () => import('@/views/businessManage/channelResourceManage/outPutManage/putStoreManage')
const outStoreManage = () => import('@/views/businessManage/channelResourceManage/outPutManage/outStoreManage')
const ledgerManage = () => import('@/views/businessManage/channelResourceManage/ledgerManage/ledgerManage')
const storeManage = () => import('@/views/businessManage/channelResourceManage/storeManage/storeManage')
const typeManage = () => import('@/views/businessManage/channelResourceManage/basicInfoManage/typeManage')
const modelManage = () => import('@/views/businessManage/channelResourceManage/basicInfoManage/modelManage')
//库存管理库存查询equipmentList
const equipmentList = () => import('@/views/businessManage/channelResourceManage/inventoryManage/equipmentList')
const facilityList = () => import('@/views/businessManage/channelResourceManage/inventoryManage/facilityList')
const consumableList = () => import('@/views/businessManage/channelResourceManage/inventoryManage/consumableList')
const mountingsList = () => import('@/views/businessManage/channelResourceManage/inventoryManage/mountingsList')
//设备查看
const equipmentDetail = () => import('@/views/businessManage/channelResourceManage/inventoryManage/equipmentDetail')
//设备履历
// const equRecordCheck = () => import('@/views/businessManage/channelResourceManage/inventoryManage/equRecordCheck')
//设施查看
const facilityDetail = () => import('@/views/businessManage/channelResourceManage/inventoryManage/facilityDetail')
//耗材查看
const consumableDetail = () => import('@/views/businessManage/channelResourceManage/inventoryManage/consumableDetail')
// 配件查看
const mountingsDetail = () => import('@/views/businessManage/channelResourceManage/inventoryManage/mountingsDetail')
//配件履历
// const mountRecordCheck = () => import('@/views/businessManage/channelResourceManage/inventoryManage/mountRecordCheck')
//盘点统计
const inventoryStatistics = () => import('@/views/businessManage/channelResourceManage/inventoryManage/inventoryStatistics')
//台账明细
const detailLedger = () => import('@/views/businessManage/channelResourceManage/ledgerManage/detailLedger')
//相关流程查看
const detailFlow = () => import('@/views/businessManage/channelResourceManage/ledgerManage/detailFlow')

//基础信息类型管理新增

const addEquipment = () => import('@/views/businessManage/channelResourceManage/basicInfoManage/addEquipment')
//类型管理修改
const modification = () => import('@/views/businessManage/channelResourceManage/basicInfoManage/modification')
// 类型管理设备查看
const equipmentCheck = () => import('@/views/businessManage/channelResourceManage/basicInfoManage/equipmentCheck')
//设施查看
const facilityCheck = () => import('@/views/businessManage/channelResourceManage/basicInfoManage/facilityCheck')
//耗材查看
const consumableCheck = () => import('@/views/businessManage/channelResourceManage/basicInfoManage/consumableCheck')
//配件查看
const mountingsCheck = () => import('@/views/businessManage/channelResourceManage/basicInfoManage/mountingsCheck')



//型号管理设备查看
const modelEquipmentCheck = () => import('@/views/businessManage/channelResourceManage/basicInfoManage/modelEquipmentCheck')
//型号管理配件查看
const modelPreCheck = () => import('@/views/businessManage/channelResourceManage/basicInfoManage/modelPreCheck')
//类型管理新增
const modelAdd = () => import('@/views/businessManage/channelResourceManage/basicInfoManage/modelAdd')
// 型号管理修改
const modelModification = () => import('@/views/businessManage/channelResourceManage/basicInfoManage/modelModification')
//型号设备修改
const facillityAlter = () => import('@/views/businessManage/channelResourceManage/basicInfoManage/facility')
//入库
const putStore = () => import('@/views/businessManage/channelResourceManage/outPutManage/putStore')
//入库详情
const alreadyPutDetail = () => import('@/views/businessManage/channelResourceManage/outPutManage/alreadyPutDetail')
//出库
const outStore = () => import('@/views/businessManage/channelResourceManage/outPutManage/outStore')
//已出库详情
const alreadyOutDetail = () => import('@/views/businessManage/channelResourceManage/outPutManage/alreadyOutDetail')
//仓库管理新增仓库
const addStore = () => import('@/views/businessManage/channelResourceManage/storeManage/addStore')
//仓库管理查看
const detail = () => import('@/views/businessManage/channelResourceManage/storeManage/detail')
// 仓库编辑
const editStore = () => import('@/views/businessManage/channelResourceManage/storeManage/editStore')



// 渠道终端管理
const channelTerminal = () => import('@/views/businessManage/channelTerminalManagement')

// 渠道终端管理 - 服务分析
const serviceAnalysis = () => import('@/views/businessManage/channelTerminalManagement/serviceAnalysis/serviceAnalysis')
// 维修率分析
const maintenanceEfficiency = () => import('@/views/businessManage/channelTerminalManagement/serviceAnalysis/maintenanceEfficiency')
// 设备故障
const equipmentFailure = () => import('@/views/businessManage/channelTerminalManagement/serviceAnalysis/equipmentFailure')
// 配件故障
const accessoryFault = () => import('@/views/businessManage/channelTerminalManagement/serviceAnalysis/accessoryFault')


// 渠道终端管理 - 维修管理
const maintenance = () => import('@/views/businessManage/channelTerminalManagement/maintenance/maintenance')
const repairOrderDetails = () => import('@/views/businessManage/channelTerminalManagement/maintenance/repairOrderDetails')
// 维修工单
const repairWork = () => import('@/views/businessManage/channelTerminalManagement/maintenance/repairWork')
// 置换工单
const replacementWork = () => import('@/views/businessManage/channelTerminalManagement/maintenance/replacementWork')

// 渠道终端管理 - 设备管理 
const equipment = () => import('@/views/businessManage/channelTerminalManagement/equipment/equipment')
// 设备列表
const deviceList = () => import('@/views/businessManage/channelTerminalManagement/equipment/equipmentList')
// 配件列表
const accessoriesList = () => import('@/views/businessManage/channelTerminalManagement/equipment/accessoriesList')
const equipmentDesc = () => import('@/views/businessManage/channelTerminalManagement/equipment/equipmentDetail')
const equipmentResume = () => import('@/views/businessManage/channelTerminalManagement/equipment/equipmentResume')
const accessoriesDesc = () => import('@/views/businessManage/channelTerminalManagement/equipment/accessoriesDetail')
const accessoriesResume = () => import('@/views/businessManage/channelTerminalManagement/equipment/accessoriesResume')

// 渠道终端管理 - 报表统计
const reportStatistics = () => import('@/views/businessManage/channelTerminalManagement/reportStatistics/reportStatistics')
// 设备故障报表
const reportEquipmentFailure = () => import('@/views/businessManage/channelTerminalManagement/reportStatistics/equipmentFailure')
// 设备管理损耗报表
const deviceLoss = () => import('@/views/businessManage/channelTerminalManagement/reportStatistics/deviceLoss')
// 配件损耗报表
const accessoryLoss = () => import('@/views/businessManage/channelTerminalManagement/reportStatistics/accessoryLoss')

// 渠道终端管理 - 维护知识库
// const knowledgeBaseIndex = () => import('@/views/businessManage/channelTerminalManagement/knowledgeBase/index')
// 维护知识库
const knowledgeBaseIndex = () => import('@/views/businessManage/channelTerminalManagement/knowledgeBase/knowledgeBase')
// 知识库审核
const baseReview = () => import('@/views/businessManage/channelTerminalManagement/knowledgeBase/baseReview')
const knowledgeBaseInfo = () => import('@/views/businessManage/channelTerminalManagement/knowledgeBase/knowledgeBaseInfo')
const baseAuditDetails = () => import('@/views/businessManage/channelTerminalManagement/knowledgeBase/baseAuditDetails')

// 配置管理
const configurationManagement = () => import('@/views/businessManage/channelTerminalManagement/configurationManagement/index')
// 故障类型
const faultType = () => import('@/views/businessManage/channelTerminalManagement/configurationManagement/faultType')
const addFaultType = () => import('@/views/businessManage/channelTerminalManagement/configurationManagement/addFaultType')
const editFaultType = () => import('@/views/businessManage/channelTerminalManagement/configurationManagement/editFaultType')

// 渠道绩效管理
// 指标设置
const indicatorSettings = () => import('@/views/businessManage/channelPerformanceManage/channelAssessment/indicatorSettings')
// 新建指标设置
const newIndicator = () => import('@/views/businessManage/channelPerformanceManage/channelAssessment/newIndicator')
// 指标详情
const indicatorDetail = () => import('@/views/businessManage/channelPerformanceManage/channelAssessment/indicatorDetail')
// 指标修改
const indicatorEdit = () => import('@/views/businessManage/channelPerformanceManage/channelAssessment/indicatorEdit')
// 考核项设置     ls
const assessItemSet = () => import('@/views/businessManage/channelPerformanceManage/channelAssessment/assessItemSet')
// 考核项设置新增   ls
const assessItemSetAdd = () => import('@/views/businessManage/channelPerformanceManage/channelAssessment/assessItemSetAdd')
// 考核项设置查看   ls
const assessItemSetDetail = () => import('@/views/businessManage/channelPerformanceManage/channelAssessment/assessItemSetDetail')
// 申诉列表
const appealList = () => import('@/views/businessManage/channelPerformanceManage/channelAssessment/appealList')
//申述列表详情  
const appealListDetail = () => import('@/views/businessManage/channelPerformanceManage/channelAssessment/appealListDetail')
//申述列表处理
const appealListDispose = () => import('@/views/businessManage/channelPerformanceManage/channelAssessment/appealListDispose')

//考核列表
const assessmentList = () => import('@/views/businessManage/channelPerformanceManage/channelAssessment/assessmentList')
//考核详情
const assessmentDetail = () => import('@/views/businessManage/channelPerformanceManage/channelAssessment/assessmentDetail')

//渠道等级评定
//等级配置列表
const channelLevelConfig = () => import('@/views/businessManage/channelPerformanceManage/channelRating/channelLevelConfig')
//等级配置新增
const addLevelConfig = () => import('@/views/businessManage/channelPerformanceManage/channelRating/addLevelConfig')
//等级配置详情
const levelConfigDetail = () => import('@/views/businessManage/channelPerformanceManage/channelRating/levelConfigDetail')
//等级配置修改
const levelConfigEdit = () => import('@/views/businessManage/channelPerformanceManage/channelRating/levelConfigEdit')


//等级考核 
const channelLevelAssess = () => import('@/views/businessManage/channelPerformanceManage/channelRating/channelLevelAssess')
//等级考核详情
const levelAssessDetail = () => import('@/views/businessManage/channelPerformanceManage/channelRating/levelAssessDetail')



// 资金结算管理
const fundParameter = () => import('@/views/businessManage/fundSettlement/fundParameter')
//电子支付对账
const electricPaymentReconciliation = () => import('@/views/businessManage/fundSettlement/electricPaymentReconciliation')
// 资金参数管理 详情
const parameterDetail = () => import('@/views/businessManage/fundSettlement/parameterDetail')
// 资金参数管理 编辑
const parameterEdit = () => import('@/views/businessManage/fundSettlement/parameterEdit')
// 全局参数编辑
const globalParameterEdit = () => import('@/views/businessManage/fundSettlement/globalParameterEdit')
// 创建
const newfundParameter = () => import('@/views/businessManage/fundSettlement/newfundParameter')
// 资金参数管理 全局参数
const globalParameter = () => import('@/views/businessManage/fundSettlement/globalParameter')
//基金划拔管理
const DelimitMoneySetting = () => import('@/views/businessManage/fundSettlement/DelimitMoneySetting')
//基金划拔管理新增
const delimitMoneySettingAdd = () => import('@/views/businessManage/fundSettlement/delimitMoneySettingAdd')
//基金划拔管理详情
const delimitMoneyDetail = () => import('@/views/businessManage/fundSettlement/delimitMoneyDetail')

//销售厅资金上缴
const salesHallTurnin = () => import('@/views/businessManage/fundSettlement/salesHallFundSettlement/salesHallTurnin')
//销售厅资金对账
const salesHallFundCheck = () => import('@/views/businessManage/fundSettlement/salesHallFundSettlement/salesHallFundCheck')
//销售厅日结
const salesHallDaily = () => import('@/views/businessManage/fundSettlement/salesHallFundSettlement/salesHallDaily')

// 投注卡管理
const cardBalance = () => import('@/views/businessManage/bettingCardManage/cardBalance')
const cardGeneration = () => import('@/views/businessManage/bettingCardManage/cardGeneration')
const refillRules = () => import('@/views/businessManage/bettingCardManage/refillRules')
const winningRecord = () => import('@/views/businessManage/bettingCardManage/winningRecord')
const withdrawalRecord = () => import('@/views/businessManage/bettingCardManage/withdrawalRecord')
const cardInformation = () => import('@/views/businessManage/bettingCardManage/cardInformation')
const bettingCardRules = () => import('@/views/businessManage/bettingCardManage/bettingCardRules')

// 投注卡基本信息
const cardDetail = () => import('@/views/businessManage/bettingCardManage/cardDetail')
// 投注卡详细信息
const infoDetail = () => import('@/views/businessManage/bettingCardManage/infoDetail')
// 余额明细
const balanceDetail = () => import('@/views/businessManage/bettingCardManage/balanceDetail')
// 新建规则
const newRule = () => import('@/views/businessManage/bettingCardManage/newRule')
// 新建卡片
const newCard = () => import('@/views/businessManage/bettingCardManage/newCard')
// 导出卡片
const exportCard = () => import('@/views/businessManage/bettingCardManage/exportCard')
// 新建投注卡规则
const newbettingRule = () => import('@/views/businessManage/bettingCardManage/newbettingRule')
// 合作伙伴管理
// 合作伙伴列表
const partnerList = () => import('@/views/businessManage/partnerManage/partnerList')
// 合作伙伴创建
const partnerCreate = () => import('@/views/businessManage/partnerManage/partnerCreate')
// 合作伙伴编辑
const partnerEdit = () => import('@/views/businessManage/partnerManage/partnerEdit')
// 合作伙伴规则
const assessmentRules = () => import('@/views/businessManage/partnerManage/assessmentRules')
// 合作伙伴规则创建
const createRule = () => import('@/views/businessManage/partnerManage/createRule')
// 合作伙伴等级列表
const partnerLevel = () => import('@/views/businessManage/partnerManage/partnerLevel')
// 合作伙伴等级创建
const createLevel = () => import('@/views/businessManage/partnerManage/createLevel')
// 合作伙伴考核列表
const partnerAssessmentList = () => import('@/views/businessManage/partnerManage/partnerAssessmentList')
// 合作伙伴详情
const partnerDetail = () => import('@/views/businessManage/partnerManage/partnerDetail')
// 合作伙伴规则详情
const partnerRuleDetail = () => import('@/views/businessManage/partnerManage/partnerRuleDetail')
// 合作伙伴等级详情
const partnerLevelDetail = () => import('@/views/businessManage/partnerManage/partnerLevelDetail')
// 合作伙伴考核详情
const partnerAssessmentDetail = () => import('@/views/businessManage/partnerManage/partnerAssessmentDetail')

// 在线培训管理
// 考核管理
// 题目管理
const questionBankManage = () => import('@/views/businessManage/onlineTraining/assessManage/questionBankManage/questionBankManage')
// 考试档案
const examinationArchives = () => import('@/views/businessManage/onlineTraining/assessManage/examinationArchives/examinationArchives')
// 新建题目
const newQuestionBank = () => import('@/views/businessManage/onlineTraining/assessManage/questionBankManage/newQuestionBank')
// 题目管理编辑
const questionEdit = () => import('@/views/businessManage/onlineTraining/assessManage/questionBankManage/questionEdit')
// 题目管理查看
const questionCheck = () => import('@/views/businessManage/onlineTraining/assessManage/questionBankManage/questionCheck')
// 查看详情
const examinationDetail = () => import('@/views/businessManage/onlineTraining/assessManage/examinationArchives/examinationDetail')
// 考试题目
const examQuestion = () => import('@/views/businessManage/onlineTraining/assessManage/examinationArchives/examQuestion')
// 查看考试详情
const examDetail = () => import('@/views/businessManage/onlineTraining/assessManage/examinationArchives/examDetail')


//培训计划列表
const trainingPlanList = () => import('@/views/businessManage/onlineTraining/trainingManage/trainingPlanList/trainingPlanList')
//新建培训计划
const trainingAdd = () => import('@/views/businessManage/onlineTraining/trainingManage/trainingPlanList/trainingAdd')
//培训计划详情
const trainingPlanDetail = () => import('@/views/businessManage/onlineTraining/trainingManage/trainingPlanList/trainingPlanDetail')

//培训项目列表
const trainingProjectList = () => import('@/views/businessManage/onlineTraining/trainingManage/trainingProjectList/trainingProjectList')
//新建培训项目
const trainingProjectListAdd = () => import('@/views/businessManage/onlineTraining/trainingManage/trainingProjectList/trainingProjectListAdd')
// 培训项目详情
const trainingProjectListDetail = () => import('@/views/businessManage/onlineTraining/trainingManage/trainingProjectList/trainingProjectListDetail')
// 编辑培训项目
const trainingProjectListEdit = () => import('@/views/businessManage/onlineTraining/trainingManage/trainingProjectList/trainingProjectListEdit')

const courseTypeManage = () => import('@/views/businessManage/onlineTraining/courseManage/courseTypeManage')
// 新建课程
const newCourseManage = () => import('@/views/businessManage/onlineTraining/courseManage/newCourseManage')
// 课程管理详情
const courseManageDetail = () => import('@/views/businessManage/onlineTraining/courseManage/courseManageDetail')
const editCourseManage = () => import('@/views/businessManage/onlineTraining/courseManage/editCourseManage')
// 课程管理
const courseManageContent = () => import('@/views/businessManage/onlineTraining/courseManage/courseManage')
// 新建课程类型
const newCourseType = () => import('@/views/businessManage/onlineTraining/courseManage/newCourseType')
// 课程类型编辑
const editCourseType = () => import('@/views/businessManage/onlineTraining/courseManage/editCourseType')


//软件升级管理
//升级计划列表
const upgradePlanList = () => import('@/views/businessManage/softwareUpgradeManage/upgradePlanList')
//升级计划列表新增
const upgradePlanListAdd = () => import('@/views/businessManage/softwareUpgradeManage/upgradePlanListAdd')
//升级计划列表编辑
const upgradePlanListEdit = () => import('@/views/businessManage/softwareUpgradeManage/upgradePlanListEdit')
//升级计划列表查看
const upgradePlanListDetail = () => import('@/views/businessManage/softwareUpgradeManage/upgradePlanListDetail')
//回滚设置列表
const rollbackSet = () => import('@/views/businessManage/softwareUpgradeManage/rollbackSet')
//回滚设置列表新增
const rollbackSetAdd = () => import('@/views/businessManage/softwareUpgradeManage/rollbackSetAdd')
//回滚设置列表查看
const rollbackSetDetail = () => import('@/views/businessManage/softwareUpgradeManage/rollbackSetDetail')

//升级软件包管理
const softwarePackage = () => import('@/views/businessManage/softwareUpgradeManage/softwarePackage')
//上传软件包
const softwarePackageUpload = () => import('@/views/businessManage/softwareUpgradeManage/softwarePackageUpload')
//升级软件包查看
const softwarePackageDetail = () => import('@/views/businessManage/softwareUpgradeManage/softwarePackageDetail')

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
  {
    path: 'businessManage/overview/index',
    name: 'overview',
    meta: {
      title: '首页',
    },
    component: overview
  },
  {
    path: 'businessManage/overview/myToDo',
    name: 'myToDo',
    meta: {
      title: '我的待办',
    },
    component: myToDo
  },
  {
    path: 'businessManage/overview/myToDoDetail',
    name: 'myToDoDetail',
    meta: {
      title: '审批详情',
      parentName: 'myToDo'
    },
    component: myToDoDetail
  },
  {
    path: 'businessManage/overview/myApplication',
    name: 'myApplication',
    meta: {
      title: '我的申请',
    },
    component: myApplication
  },
  {
    path: 'businessManage/overview/myApplyDetail',
    name: 'myApplyDetail',
    meta: {
      title: '审批详情',
      parentName: 'myApplication'
    },
    component: myApplyDetail
  },
  {
    path: 'businessManage/overview/myDone',
    name: 'myDone',
    meta: {
      title: '我的已办',
    },
    component: myDone
  },
  {
    path: 'businessManage/overview/myDoneDetail',
    name: 'myDoneDetail',
    meta: {
      title: '审批详情',
      parentName: 'myDone'
    },
    component: myDoneDetail
  },
  {
    path: 'businessManage/overview/myKnowledge',
    name: 'myKnowledge',
    meta: {
      title: '我的知会',
    },
    component: myKnowledge
  },
  {
    path: 'businessManage/overview/myKnowledgeDetail',
    name: 'myKnowledgeDetail',
    meta: {
      title: '审批详情',
      parentName: 'myKnowledge'
    },
    component: myKnowledgeDetail
  },
  {
    path: 'businessManage/overview/dossierManage',
    name: 'dossierManage',
    meta: {
      title: '档案管理',
    },
    component: dossierManage
  },
  {
    path: 'businessManage/overview/dossierDetail',
    name: 'dossierDetail',
    meta: {
      title: '审批详情',
      parentName: 'dossierManage'
    },
    component: dossierDetail
  },
  {
    path: 'businessManage/overview/appCardDetail',
    name: 'appCardDetail',
    meta: {
      title: 'APP投注卡申请',
      parentName: 'myApplication'
    },
    component: appCardDetail
  },
  {
    path: 'businessManage/overview/appDeviceDetail',
    name: 'appDeviceDetail',
    meta: {
      title: 'APP设备维护申请',
      parentName: 'myApplication'
    },
    component: appDeviceDetail
  },
  {
    path: 'businessManage/overview/appLossDetail',
    name: 'appLossDetail',
    meta: {
      title: 'APP损耗申请',
      parentName: 'myApplication'
    },
    component: appLossDetail
  },
  {
    path: 'businessManage/overview/messageList',
    name: 'messageList',
    meta: {
      title: '站内信',
    },
    component: messageList
  },
  {
    path: 'businessManage/overview/messageDetail',
    name: 'messageDetail',
    meta: {
      parentName: 'messageList',
      title: '查看消息',
    },
    component: messageDetail
  },
  {
    path: 'businessManage/gameManage/gameStore/gameList',
    name: 'gameList',
    meta: {
      title: '游戏储备列表',
    },
    component: gameList
  },
  {
    path: 'businessManage/gameManage/gameStore/gameCreate',
    name: 'gameCreate',
    meta: {
      title: '新建游戏',
      parentName: 'gameList',
    },
    component: gameCreate
  },
  {
    path: 'businessManage/gameManage/gameStore/gameDetail',
    name: 'gameDetail',
    meta: {
      title: '游戏详情',
      parentName: 'gameList',
    },
    component: gameDetail
  },
  {
    path: 'businessManage/gameManage/gameStore/gameEdit',
    name: 'gameEdit',
    meta: {
      title: '编辑游戏',
      parentName: 'gameList',
    },
    component: gameEdit
  },
  {
    path: 'businessManage/gameManage/gameStore/gameTypeList',
    name: 'gameTypeList',
    meta: {
      title: '游戏类型管理',
    },
    component: gameTypeList
  },
  {
    path: 'businessManage/gameManage/planTry/planList',
    name: 'trialPlanList',
    meta: {
      title: '试玩计划列表',
    },
    component: trialPlanList
  },
  {
    path: 'businessManage/gameManage/planTry/createPlan',
    name: 'trialPlanCreate',
    meta: {
      title: '新建试玩计划',
      parentName: 'trialPlanList',
    },
    component: trialPlanCreate
  },
  {
    path: 'businessManage/gameManage/planTry/planDetail',
    name: 'trialPlanDetail',
    meta: {
      title: '试玩计划详情',
      parentName: 'trialPlanList',
    },
    component: trialPlanDetail
  },
  {
    path: 'businessManage/gameManage/planTry/editPlan',
    name: 'trialPlanEdit',
    meta: {
      title: '编辑试玩计划',
      parentName: 'trialPlanList',
    },
    component: trialPlanEdit
  },
  {
    path: 'businessManage/gameManage/planMarket/planList',
    name: 'gameMarketPlanList',
    meta: {
      title: '游戏上市计划',
    },
    component: gameMarketPlanList
  },
  {
    path: 'businessManage/gameManage/planMarket/createPlan',
    name: 'gameMarketPlanCreate',
    meta: {
      title: '新建上市计划',
      parentName: 'gameMarketPlanList',
    },
    component: gameMarketPlanCreate
  },
  {
    path: 'businessManage/gameManage/planMarket/planDetail',
    name: 'gameMarketPlanDetail',
    meta: {
      title: '上市计划详情',
      parentName: 'gameMarketPlanList',
    },
    component: gameMarketPlanDetail
  },
  {
    path: 'businessManage/gameManage/planMarket/editPlan',
    name: 'gameMarketPlanEdit',
    meta: {
      title: '编辑上市计划',
      parentName: 'gameMarketPlanList',
    },
    component: gameMarketPlanEdit
  },
  {
    path: 'businessManage/gameManage/gameMarket/gameMarketList',
    name: 'gameMarketList',
    meta: {
      title: '上市游戏列表',
    },
    component: gameMarketList
  },
  {
    path: 'businessManage/gameManage/gameMarket/gameMarketDetail',
    name: 'gameMarketDetail',
    meta: {
      title: '上市游戏详情',
      parentName: 'gameMarketList',
    },
    component: gameMarketDetail
  },
  {
    path: 'businessManage/gameManage/planChange/planList',
    name: 'gameChangePlanList',
    meta: {
      title: '游戏变更计划',
    },
    component: gameChangePlanList
  },
  {
    path: 'businessManage/gameManage/planChange/createPlan',
    name: 'gameChangePlanCreate',
    meta: {
      title: '新建变更计划',
      parentName: 'gameChangePlanList',
    },
    component: gameChangePlanCreate
  },
  {
    path: 'businessManage/gameManage/planChange/planDetail',
    name: 'gameChangePlanDetail',
    meta: {
      title: '变更计划详情',
      parentName: 'gameChangePlanList',
    },
    component: gameChangePlanDetail
  },
  {
    path: 'businessManage/gameManage/planChange/editPlan',
    name: 'gameChangePlanEdit',
    meta: {
      title: '编辑变更计划',
      parentName: 'gameChangePlanList',
    },
    component: gameChangePlanEdit
  },
  {
    path: 'businessManage/gameManage/planDelisting/planList',
    name: 'gameDelistingPlanList',
    meta: {
      title: '退市计划列表',
    },
    component: gameDelistingPlanList
  },
  {
    path: 'businessManage/gameManage/planDelisting/createPlan',
    name: 'gameDelistingPlanCreate',
    meta: {
      title: '新建退市计划',
      parentName: 'gameDelistingPlanList',
    },
    component: gameDelistingPlanCreate
  },
  {
    path: 'businessManage/gameManage/planDelisting/planDetail',
    name: 'gameDelistingPlanDetail',
    meta: {
      title: '退市计划详情',
      parentName: 'gameDelistingPlanList',
    },
    component: gameDelistingPlanDetail
  },
  {
    path: 'businessManage/gameManage/planDelisting/editPlan',
    name: 'gameDelistingPlanEdit',
    meta: {
      title: '退市计划编辑',
      parentName: 'gameDelistingPlanList',
    },
    component: gameDelistingPlanEdit
  },
  {
    path: 'businessManage/gameManage/riskReport/riskReportList',
    name: 'riskReportList',
    meta: {
      title: '风险处理报告',
    },
    component: riskReportList
  }, //riskReportListDetails

  {
    path: 'businessManage/channelList',
    name: 'channelList',
    meta: {
      title: '渠道列表',
    },
    component: channelList
  },
  {
    path: 'businessManage/channelDetail',
    name: 'channelDetail',
    meta: {
      title: '渠道详情',
      parentName: 'channelList',
    },
    component: channelDetail
  },
  {
    path: 'businessManage/channelDeal',
    name: 'channelDeal',
    meta: {
      title: '业务办理',
    },
    component: channelDeal
  },
  {
    path: 'businessManage/channelCreate',
    name: 'channelCreate',
    meta: {
      title: '新建渠道',
      parentName: 'channelDeal',
    },
    component: channelCreate
  },
  {
    path: 'businessManage/channelChange',
    name: 'channelChange',
    meta: {
      title: '渠道变更',
      parentName: 'channelDeal',
    },
    component: channelChange
  },
  {
    path: 'businessManage/channelRelocation',
    name: 'channelRelocation',
    meta: {
      title: '渠道迁址',
      parentName: 'channelDeal',
    },
    component: channelRelocation
  },
  {
    path: 'businessManage/channelStop',
    name: 'channelStop',
    meta: {
      title: '渠道关停',
      parentName: 'channelDeal',
    },
    component: channelStop
  },
  {
    path: 'businessManage/channelTransfer',
    name: 'channelTransfer',
    meta: {
      title: '渠道过户',
      parentName: 'channelDeal',
    },
    component: channelTransfer
  },
  {
    path: 'businessManage/channelAddMachine',
    name: 'channelAddMachine',
    meta: {
      title: '渠道增机',
      parentName: 'channelDeal',
    },
    component: channelAddMachine
  },
  {
    path: 'businessManage/channelBackMachine',
    name: 'channelBackMachine',
    meta: {
      title: '渠道退机',
      parentName: 'channelDeal',
    },
    component: channelBackMachine
  },
  {
    path: 'businessManage/channelMoveMachine',
    name: 'channelMoveMachine',
    meta: {
      title: '渠道移机',
      parentName: 'channelDeal',
    },
    component: channelMoveMachine
  },
  {
    path: 'businessManage/permissionChannelSales',
    name: 'permissionChannelSales',
    meta: {
      parentName: 'channelDeal',
      title: '销售权限',
    },
    component: permissionChannelSales
  },
  {
    path: 'businessManage/permissionChannelFunds',
    name: 'permissionChannelFunds',
    meta: {
      parentName: 'channelDeal',
      title: '资金权限',
    },
    component: permissionChannelFunds
  },
  {
    path: 'businessManage/permissionChannelRate',
    name: 'permissionChannelRate',
    meta: {
      parentName: 'channelDeal',
      title: '费率调整',
    },
    component: permissionChannelRate
  },
  {
    path: 'businessManage/resourcePurchase',
    name: 'resourcePurchase',
    meta: {
      parentName: 'channelDeal',
      title: '资源采购',
    },
    component: resourcePurchase
  },
  {
    path: 'businessManage/resourceApply',
    name: 'resourceApply',
    meta: {
      parentName: 'channelDeal',
      title: '资源申请',
    },
    component: resourceApply
  },
  {
    path: 'businessManage/resourceProvide',
    name: 'resourceProvide',
    meta: {
      parentName: 'channelDeal',
      title: '资源发放',
    },
    component: resourceProvide
  },
  {
    path: 'businessManage/resourceAllot',
    name: 'resourceAllot',
    meta: {
      parentName: 'channelDeal',
      title: '资源调拨',
    },
    component: resourceAllot
  },
  {
    path: 'businessManage/resourceScrap',
    name: 'resourceScrap',
    meta: {
      parentName: 'channelDeal',
      title: '资源报废',
    },
    component: resourceScrap
  },
  {
    path: 'businessManage/developmentPlan',
    name: 'developmentPlan',
    meta: {
      title: '年度发展计划',
    },
    component: developmentPlan,
    children: []
  },
  {
    path: 'businessManage/developmentPlan/developmentPlanList',
    name: 'developmentPlanList',
    meta: {
      title: '计划列表',
    },
    component: developmentPlanList,
    children: []
  }, {
    path: 'businessManage/developmentPlan/developmentPlanSummary',
    name: 'developmentPlanSummary',
    meta: {
      title: '计划汇总',
    },
    component: developmentPlanSummary,
    children: []
  },
  {
    path: 'businessManage/developmentPlan/developmentPlanProvince',
    name: 'developmentPlanProvince',
    meta: {
      title: '计划汇总（省）',
    },
    component: developmentPlanProvince,
    children: []
  },
  {
    path: 'businessManage/developmentPlan/developmentPlanCity',
    name: 'developmentPlanCity',
    meta: {
      title: '计划汇总（地市）',
    },
    component: developmentPlanCity,
    children: []
  },
  {
    path: 'businessManage/developmentPlanDetail',
    name: 'developmentPlanDetail',
    meta: {
      parentName: 'developmentPlanList',
      title: '年度发展计划详情',
    },
    component: developmentPlanDetail,
    children: []

  }, {

    path: 'businessManage/developmentPlanEdit',
    name: 'developmentPlanEdit',
    meta: {
      parentName: 'developmentPlanList',
      title: '编辑年度发展计划',
    },
    component: developmentPlanEdit,
    children: []
  },
  {
    path: 'businessManage/developmentPlanCreate',
    name: 'developmentPlanCreate',
    meta: {
      parentName: 'developmentPlanList',
      title: '新建年度发展计划',
    },
    component: developmentPlanCreate
  }, {
    path: 'businessManage/developmentPlanProvinceDetail',
    name: 'developmentPlanProvinceDetail',
    meta: {
      parentName: 'developmentPlanSummary',
      title: '年度发展计划汇总省级详情',
    },
    component: developmentPlanProvinceDetail,
    children: []
  }, {
    path: 'businessManage/developmentPlanCityDetail',
    name: 'developmentPlanCityDetail',
    meta: {
      parentName: 'developmentPlanSummary',
      title: '年度发展计划汇总市级详情',
    },
    component: developmentPlanCityDetail,
    children: []
  },
  {
    path: 'businessManage/channelResourceManage/inventoryManage/equipmentList',
    name: 'equipmentList',
    meta: {
      title: '设备列表',
    },
    component: equipmentList
  },
  {
    path: 'businessManage/channelResourceManage/equipmentDetail',
    name: 'equipmentDetail',
    meta: {
      parentName: 'equipmentList',
      title: '设备查看',
    },
    component: equipmentDetail
  },
  {
    path: 'businessManage/channelResourceManage/inventoryManage/facilityList',
    name: 'facilityList',
    meta: {
      title: '设施列表',
    },
    component: facilityList
  },
  {
    path: 'businessManage/channelResourceManage/inventoryManage/facilityDetail',
    name: 'facilityDetail',
    meta: {
      parentName: 'facilityList',
      title: '设施查看',
    },
    component: facilityDetail
  },
  {
    path: 'businessManage/channelResourceManage/inventoryManage/consumableList',
    name: 'consumableList',
    meta: {
      title: '耗材列表',
    },
    component: consumableList
  },
  {
    path: 'businessManage/channelResourceManage/inventoryManage/consumableDetail',
    name: 'consumableDetail',
    meta: {
      parentName: 'consumableList',
      title: '耗材查看',
    },
    component: consumableDetail
  },
  {
    path: 'businessManage/channelResourceManage/inventoryManage/mountingsList',
    name: 'mountingsList',
    meta: {
      title: '配件列表',
    },
    component: mountingsList
  },
  {
    path: 'businessManage/channelResourceManage/inventoryManage/mountingsDetail',
    name: 'mountingsDetail',
    meta: {
      parentName: 'mountingsList',
      title: '配件查看',
    },
    component: mountingsDetail
  },
  // {
  //   path: 'businessManage/channelResourceManage/mountRecordCheck',
  //   name: 'mountRecordCheck',
  //   meta: {
  //     parentName: 'inventoryManage',
  //     title: '配件履历',
  //   },
  //   component: mountRecordCheck
  // },
  // {
  //   path: 'businessManage/channelResourceManage/equRecordCheck',
  //   name: 'equRecordCheck',
  //   meta: {
  //     parentName: 'inventoryManage',
  //     title: '设备履历',
  //   },
  //   component: equRecordCheck
  // },
  {
    path: 'businessManage/channelResourceManage/inventoryStatistics',
    name: 'inventoryStatistics',
    meta: {
      parentName: 'inventoryManage',
      title: '盘点统计',
    },
    component: inventoryStatistics
  },

  {
    path: 'businessManage/channelResourceManage/outPutManage/putStoreManage',
    name: 'putStoreManage',
    meta: {
      title: '入库管理',
    },
    component: putStoreManage
  },
  {
    path: 'businessManage/channelResourceManage/outPutManage/outStoreManage',
    name: 'outStoreManage',
    meta: {
      title: '出库管理',
    },
    component: outStoreManage
  },
  {
    path: 'businessManage/channelResourceManage/outPutManage/putStore',
    name: 'putStore',
    meta: {
      parentName: 'putStoreManage',
      title: '入库',
    },
    component: putStore
  },
  {
    path: 'businessManage/channelResourceManage/outPutManage/alreadyPutDetail',
    name: 'alreadyPutDetail',
    meta: {
      parentName: 'putStoreManage',
      title: '已入库详情',
    },
    component: alreadyPutDetail
  },
  {
    path: 'businessManage/channelResourceManage/outPutManage/outStore',
    name: 'outStore',
    meta: {
      parentName: 'outStoreManage',
      title: '出库',
    },
    component: outStore
  },
  {
    path: 'businessManage/channelResourceManage/outPutManage/alreadyOutDetail',
    name: 'alreadyOutDetail',
    meta: {
      parentName: 'outStoreManage',
      title: '已出库详情',
    },
    component: alreadyOutDetail
  },

  {
    path: 'businessManage/channelResourceManage/ledgerManage',
    name: 'ledgerManage',
    meta: {
      title: '台账管理',
    },
    component: ledgerManage
  },
  {
    path: 'businessManage/channelResourceManage/detailLedger',
    name: 'detailLedger',
    meta: {
      parentName: 'ledgerManage',
      title: '台账明细',
    },
    component: detailLedger
  },
  {
    path: 'businessManage/channelResourceManage/detailFlow',
    name: 'detailFlow',
    meta: {
      parentName: 'ledgerManage',
      title: '相关流程',
    },
    component: detailFlow
  },
  {
    path: 'businessManage/channelResourceManage/storeManage',
    name: 'storeManage',
    meta: {
      title: '仓库管理',
    },
    component: storeManage
  },
  {
    path: 'businessManage/channelResourceManage/detail',
    name: 'detail',
    meta: {
      parentName: 'storeManage',
      title: '仓库查看',
    },
    component: detail
  },
  {
    path: 'businessManage/channelResourceManage/addStore',
    name: 'addStore',
    meta: {
      parentName: 'storeManage',
      title: '新建仓库',
    },
    component: addStore
  },
  {
    path: 'businessManage/channelResourceManage/editStore',
    name: 'editStore',
    meta: {
      parentName: 'storeManage',
      title: '编辑仓库',
    },
    component: editStore
  },
  {
    path: 'businessManage/channelResourceManage/basicInfoManage/typeManage',
    name: 'typeManage',
    meta: {
      title: '类型管理',
    },
    component: typeManage
  },
  {
    path: 'businessManage/channelResourceManage/basicInfoManage/modelManage',
    name: 'modelManage',
    meta: {
      title: '型号管理',
    },
    component: modelManage
  },
  {
    path: 'businessManage/channelResourceManage/basicInfoManage/addEquipment',
    name: 'addEquipment',
    meta: {
      parentName: 'typeManage',
      title: '类型管理新增',
    },
    component: addEquipment
  },
  {
    path: 'businessManage/channelResourceManage/basicInfoManage/modification',
    name: 'modification',
    meta: {
      parentName: 'typeManage',
      title: '类型管理修改',
    },
    component: modification
  },
  {
    path: 'businessManage/channelResourceManage/basicInfoManage/equipmentCheck',
    name: 'equipmentCheck',
    meta: {
      parentName: 'typeManage',
      title: '类型管理设备查看',
    },
    component: equipmentCheck
  },
  {
    path: 'businessManage/channelResourceManage/basicInfoManage/facilityCheck',
    name: 'facilityCheck',
    meta: {
      parentName: 'typeManage',
      title: '类型管理设施查看',
    },
    component: facilityCheck
  },
  {
    path: 'businessManage/channelResourceManage/basicInfoManage/consumableCheck',
    name: 'consumableCheck',
    meta: {
      parentName: 'typeManage',
      title: '类型管理耗材查看',
    },
    component: consumableCheck
  },
  {
    path: 'businessManage/channelResourceManage/basicInfoManage/mountingsCheck',
    name: 'mountingsCheck',
    meta: {
      parentName: 'typeManage',
      title: '类型管理配件查看',
    },
    component: mountingsCheck
  },
  {
    path: 'businessManage/channelResourceManage/basicInfoManage/modelEquipmentCheck',
    name: 'modelEquipmentCheck',
    meta: {
      parentName: 'modelManage',
      title: '型号管理设备查看',
    },
    component: modelEquipmentCheck
  },
  {
    path: 'businessManage/channelResourceManage/basicInfoManage/modelPreCheck',
    name: 'modelPreCheck',
    meta: {
      parentName: 'modelManage',
      title: '型号管理配件查看',
    },
    component: modelPreCheck
  },
  {
    path: 'businessManage/channelResourceManage/basicInfoManage/modelAdd',
    name: 'modelAdd',
    meta: {
      parentName: 'modelManage',
      title: '型号管理新增',
    },
    component: modelAdd
  },
  {
    path: 'businessManage/channelResourceManage/basicInfoManage/modelModification',
    name: 'modelModification',
    meta: {
      parentName: 'modelManage',
      title: '型号管理修改',
    },
    component: modelModification
  },
  {
    path: 'businessManage/channelResourceManage/basicInfoManage/facillityAlter',
    name: 'facillityAlter',
    meta: {
      parentName: 'modelManage',
      title: '型号管理修改',
    },
    component: facillityAlter
  },


  {
    path: 'businessManage/channelTerminal/serviceAnalysis',
    name: 'serviceAnalysis',
    meta: {
      title: '服务分析',
    },
    component: serviceAnalysis
  },
  {
    path: 'businessManage/channelTerminal/serviceAnalysis/maintenanceEfficiency',
    name: 'maintenanceEfficiency',
    meta: {
      title: '维修率分析',
    },
    component: maintenanceEfficiency
  }, {
    path: 'businessManage/channelTerminal/serviceAnalysis/equipmentFailure',
    name: 'equipmentFailure',
    meta: {
      title: '设备故障',
    },
    component: equipmentFailure
  },
  {
    path: 'businessManage/channelTerminal/serviceAnalysis/accessoryFault',
    name: 'accessoryFault',
    meta: {
      title: '配件故障',
    },
    component: accessoryFault
  },
  {
    path: 'businessManage/channelTerminal/maintenance',
    name: 'maintenance',
    meta: {
      title: '维修管理',
    },
    component: maintenance
  },
  {
    path: 'businessManage/channelTerminal/maintenance/repairWork',
    name: 'repairWork',
    meta: {
      title: '维修工单',
    },
    component: repairWork
  },
  {
    path: 'businessManage/channelTerminal/maintenance/replacementWork',
    name: 'replacementWork',
    meta: {
      title: '置换工单',
    },
    component: replacementWork
  },
  {
    path: 'businessManage/channelTerminal/maintenance/repairOrderDetails',
    name: 'repairOrderDetails',
    meta: {
      parentName: 'repairWork',
      title: '维修工单详情',
    },
    component: repairOrderDetails
  },
  {
    path: 'businessManage/channelTerminal/maintenance/replacementWorkDetails',
    name: 'replacementWorkDetails',
    meta: {
      parentName: 'replacementWork',
      title: '置换工单详情',
    },
    component: repairOrderDetails
  },
  {
    path: 'businessManage/channelTerminal/reportStatistics',
    name: 'reportStatistics',
    meta: {
      parentName: 'reportStatistics',
      title: '报表统计',
    },
    component: reportStatistics
  },
  {
    path: 'businessManage/channelTerminal/reportStatistics/reportEquipmentFailure',
    name: 'reportEquipmentFailure',
    meta: {
      title: '设备故障报表',
    },
    component: reportEquipmentFailure
  },
  {
    path: 'businessManage/channelTerminal/reportStatistics/deviceLoss',
    name: 'deviceLoss',
    meta: {
      title: '设备管理损耗报表',
    },
    component: deviceLoss
  },
  {
    path: 'businessManage/channelTerminal/reportStatistics/accessoryLoss',
    name: 'accessoryLoss',
    meta: {
      title: '配件损耗报表',
    },
    component: accessoryLoss
  },


  {
    path: 'businessManage/channelTerminal/equipment/equipmentList',
    name: 'deviceList',
    meta: {
      title: '设备列表',
    },
    component: deviceList
  },
  {
    path: 'businessManage/channelTerminal/equipment/equipmentDesc',
    name: 'equipmentDesc',
    meta: {
      parentName: 'deviceList',
      title: '查看设备详情',
    },
    component: equipmentDesc
  },
  {
    path: 'businessManage/channelTerminal/equipment/equipmentResume',
    name: 'equipmentResume',
    meta: {
      parentName: 'deviceList',
      title: '设备履历',
    },
    component: equipmentResume
  },
  {
    path: 'businessManage/channelTerminal/equipment/accessoriesList',
    name: 'accessoriesList',
    meta: {
      title: '配件列表',
    },
    component: accessoriesList
  },
  {
    path: 'businessManage/channelTerminal/equipment/accessoriesDesc',
    name: 'accessoriesDesc',
    meta: {
      parentName: 'accessoriesList',
      title: '查看配件详情',
    },
    component: accessoriesDesc
  },
  {
    path: 'businessManage/channelTerminal/equipment/accessoriesResume',
    name: 'accessoriesResume',
    meta: {
      parentName: 'accessoriesList',
      title: '配件履历',
    },
    component: accessoriesResume
  },
  {
    path: 'businessManage/channelTerminal/knowledgeBase/knowledgeBase',
    name: 'knowledgeBase',
    meta: {
      title: '维护知识库',
    },
    component: knowledgeBaseIndex,
  },
  {
    path: 'businessManage/channelTerminal/knowledgeBase/baseReview',
    name: 'baseReview',
    meta: {
      title: '知识库审核',
    },
    component: baseReview,
  },
  {
    path: 'businessManage/channelTerminal/knowledgeBaseInfo',
    name: 'knowledgeBaseInfo',
    meta: {
      parentName: 'knowledgeBase',
      title: '知识库审核',
    },
    component: knowledgeBaseInfo,
  }, {
    path: 'businessManage/channelTerminal/baseAuditDetails',
    name: 'baseAuditDetails',
    meta: {
      parentName: 'baseReview',
      title: '知识库审核详情',
    },
    component: baseAuditDetails
  }, {
    path: 'businessManage/channelTerminal/configurationManagement/faultType',
    name: 'faultType',
    meta: {
      title: '故障类型',
    },
    component: faultType
  },
  {
    path: 'businessManage/channelTerminal/addFaultType',
    name: 'addFaultType',
    meta: {
      parentName: 'faultType',
      title: '新增故障类型 ',
    },
    component: addFaultType,
  },
  {
    path: 'businessManage/channelTerminal/editFaultType',
    name: 'editFaultType',
    meta: {
      parentName: 'faultType',
      title: '修改故障类型',
    },
    component: editFaultType,
  },
  {
    path: 'channelPerformanceManage/channelAssessment/indicatorSettings',
    name: 'indicatorSettings',
    meta: {
      title: '指标设置',
    },
    component: indicatorSettings
  },
  {
    path: 'channelPerformanceManage/channelAssessment/newIndicator',
    name: 'newIndicator',
    meta: {
      parentName: 'indicatorSettings',
      title: '新建指标设置',
    },
    component: newIndicator
  },
  {
    path: 'channelPerformanceManage/channelAssessment/indicatorEdit',
    name: 'indicatorEdit',
    meta: {
      parentName: 'indicatorSettings',
      title: '修改指标设置',
    },
    component: indicatorEdit
  },
  {
    path: 'channelPerformanceManage/channelAssessment/indicatorDetail',
    name: 'indicatorDetail',
    meta: {
      parentName: 'indicatorSettings',
      title: '指标设置详情',
    },
    component: indicatorDetail
  },
  {
    path: 'channelPerformanceManage/channelAssessment/assessItemSet',
    name: 'assessItemSet',
    meta: {
      title: '考核项设置列表',
    },
    component: assessItemSet
  },
  {
    path: 'channelPerformanceManage/channelAssessment/assessItemSetAdd',
    name: 'assessItemSetAdd',
    meta: {
      parentName: "assessItemSet",
      title: '考核项设置新增',
    },
    component: assessItemSetAdd
  },
  {
    path: 'channelPerformanceManage/channelAssessment/assessItemSetEdit',
    name: 'assessItemSetEdit',
    meta: {
      parentName: "assessItemSet",
      title: '考核项设置修改',
    },
    component: assessItemSetAdd
  },
  {
    path: 'channelPerformanceManage/channelAssessment/assessItemSetDetail',
    name: 'assessItemSetDetail',
    meta: {
      parentName: "assessItemSet",
      title: '考核项设置查看',
    },
    component: assessItemSetDetail
  },
  {
    path: 'businessManage/channelPerformanceManage/assessmentList',
    name: 'assessmentList',
    meta: {
      title: '考核列表',
    },
    component: assessmentList
  },
  {
    path: 'businessManage/channelPerformanceManage/assessmentDetail',
    name: 'assessmentDetail',
    meta: {
      parentName: 'assessmentList',
      title: '考核列表详情',
    },
    component: assessmentDetail
  },
  {
    path: 'channelPerformanceManage/channelAssessment/appealList',
    name: 'appealList',
    meta: {
      title: '申诉列表',
    },
    component: appealList
  },
  {
    path: 'channelPerformanceManage/channelAssessment/appealListDetail',
    name: 'appealListDetail',
    meta: {
      parentName: 'appealList',
      title: '申诉列表详情',
    },
    component: appealListDetail
  },
  {
    path: 'channelPerformanceManage/channelAssessment/appealListDispose',
    name: 'appealListDispose',
    meta: {
      parentName: 'appealList',
      title: '申诉列表处理',
    },
    component: appealListDispose
  },
  {
    path: 'channelPerformanceManage/channelAssessment/appealListDisposeDetail',
    name: 'appealListDisposeDetail',
    meta: {
      parentName: 'appealList',
      title: '申诉列表详情',
    },
    component: appealListDispose
  },
  {
    path: 'businessManage/channelPerformanceManage/channelLevelConfig',
    name: 'channelLevelConfig',
    meta: {
      title: '渠道等级配置',
    },
    component: channelLevelConfig,
  },
  {
    path: 'businessManage/channelPerformanceManage/addLevelConfig',
    name: 'addLevelConfig',
    meta: {
      parentName: 'channelLevelConfig',
      title: '新增渠道等级配置',
    },
    component: addLevelConfig,
  },
  {
    path: 'businessManage/channelPerformanceManage/levelConfigDetail',
    name: 'levelConfigDetail',
    meta: {
      parentName: 'channelLevelConfig',
      title: '等级配置详情',
    },
    component: levelConfigDetail,
  },
  {
    path: 'businessManage/channelPerformanceManage/levelConfigEdit',
    name: 'levelConfigEdit',
    meta: {
      parentName: 'channelLevelConfig',
      title: '等级配置修改',
    },
    component: levelConfigEdit,
  },
  {
    path: 'businessManage/channelPerformanceManage/channelLevelAssess',
    name: 'channelLevelAssess',
    meta: {
      title: '渠道等级考核',
    },
    component: channelLevelAssess,
  },
  {
    path: 'businessManage/channelPerformanceManage/levelAssessDetail',
    name: 'levelAssessDetail',
    meta: {
      parentName: 'channelLevelAssess',
      title: '渠道等级考核详情',
    },
    component: levelAssessDetail,

  },
  {
    path: 'businessManage/fundSettlement/fundParameter',
    name: 'fundParameter',
    meta: {
      title: '资金参数管理',
    },
    component: fundParameter
  },
  {
    path: 'businessManage/fundSettlement/electricPaymentReconciliation',
    name: 'electricPaymentReconciliation',
    meta: {
      title: '电子支付对账',
    },
    component: electricPaymentReconciliation
  },
  {
    path: 'businessManage/fundSettlement/parameterDetail',
    name: 'parameterDetail',
    meta: {
      parentName: 'fundParameter',
      title: '资金参数管理详情',
    },
    component: parameterDetail
  },
  {
    path: 'businessManage/fundSettlement/DelimitMoneySetting',
    name: 'DelimitMoneySetting',
    meta: {
      title: '基金划拔管理',
    },
    component: DelimitMoneySetting
  },
  {
    path: 'businessManage/fundSettlement/delimitMoneySettingAdd',
    name: 'delimitMoneySettingAdd',
    meta: {
      parentName: 'DelimitMoneySetting',
      title: '新增基金划拔',
    },
    component: delimitMoneySettingAdd
  },
  {
    path: 'businessManage/fundSettlement/delimitMoneyDetail',
    name: 'delimitMoneyDetail',
    meta: {
      parentName: 'DelimitMoneySetting',
      title: '基金划拔详情',
    },
    component: delimitMoneyDetail
  },
  {
    path: 'businessManage/fundSettlement/parameterEdit',
    name: 'parameterEdit',
    meta: {
      parentName: 'fundParameter',
      title: '资金参数管理编辑',
    },
    component: parameterEdit
  },
  {
    path: 'businessManage/fundSettlement/globalParameterEdit',
    name: 'globalParameterEdit',
    meta: {
      parentName: 'fundParameter',
      title: '全局参数管理编辑',
    },
    component: globalParameterEdit
  },
  {
    path: 'businessManage/fundSettlement/newfundParameter',
    name: 'newfundParameter',
    meta: {
      parentName: 'fundParameter',
      title: '新增全局参数管理',
    },
    component: newfundParameter
  },

  {
    path: 'businessManage/fundSettlement/globalParameter',
    name: 'globalParameter',
    meta: {
      parentName: 'fundParameter',
      title: '资金参数全局参数',
    },
    component: globalParameter
  },
  {
    path: 'businessManage/fundSettlement/salesHallTurnin',
    name: 'salesHallTurnin',
    meta: {
      title: '销售厅资金上缴',
    },
    component: salesHallTurnin
  },
  {
    path: 'businessManage/fundSettlement/salesHallFundCheck',
    name: 'salesHallFundCheck',
    meta: {
      title: '销售厅资金对账',
    },
    component: salesHallFundCheck
  },
  {
    path: 'businessManage/fundSettlement/salesHallDaily',
    name: 'salesHallDaily',
    meta: {
      title: '销售厅日结',
    },
    component: salesHallDaily
  },

  {
    path: 'businessManage/cardBalance/cardBalance',
    name: 'cardBalance',
    meta: {
      title: '投注卡余额',
    },
    component: cardBalance
  }, {
    path: 'businessManage/cardBalance/cardGeneration',
    name: 'cardGeneration',
    meta: {
      title: '投注卡生成',
    },
    component: cardGeneration
  }, {

    path: 'businessManage/cardBalance/bettingCardRules',
    name: 'bettingCardRules',
    meta: {
      title: '投注卡规则',
    },
    component: bettingCardRules
  }, {
    path: 'businessManage/cardBalance/refillRules',
    name: 'refillRules',
    meta: {
      title: '投注卡充值规则',
    },
    component: refillRules
  }, {
    path: 'businessManage/cardBalance/winningRecord',
    name: 'winningRecord',
    meta: {
      title: '投注卡中奖记录',
    },
    component: winningRecord
  }, {
    path: 'businessManage/cardBalance/withdrawalRecord',
    name: 'withdrawalRecord',
    meta: {
      title: '投注卡提现记录',
    },
    component: withdrawalRecord
  }, {
    path: 'businessManage/cardBalance/cardInformation',
    name: 'cardInformation',
    meta: {
      title: '投注卡信息',
    },
    component: cardInformation
  },
  {
    path: 'businessManage/cardBalance/cardDetail',
    name: 'cardDetail',
    meta: {
      parentName: 'cardGeneration',
      title: '投注卡明细',
    },
    component: cardDetail
  },
  {
    path: 'businessManage/cardBalance/balanceDetail',
    name: 'balanceDetail',
    meta: {
      parentName: 'cardBalance',
      title: '投注卡明细',
    },
    component: balanceDetail
  },
  {
    path: 'businessManage/cardBalance/infoDetail',
    name: 'infoDetail',
    meta: {
      parentName: 'cardInformation',
      title: '详情信息',
    },
    component: infoDetail
  },
  {
    path: 'businessManage/cardBalance/newCard',
    name: 'newCard',
    meta: {
      parentName: 'cardGeneration',
      title: '新建卡片'
    },
    component: newCard
  }, {
    path: 'businessManage/cardBalance/newbettingRule',
    name: 'newbettingRule',
    meta: {
      parentName: 'bettingCardRules',
      title: '新增规则'
    },
    component: newbettingRule

  },

  {
    path: 'businessManage/cardBalance/newRule',
    name: 'newRule',
    meta: {
      parentName: 'refillRules',
      title: '新建规则'
    },
    component: newRule
  },
  {
    path: 'businessManage/cardBalance/exportCard',
    name: 'exportCard',
    meta: {
      parentName: 'cardGeneration',
      title: '导出卡片',
    },
    component: exportCard
  },
  {
    path: 'businessManage/partnerManage/partnerList',
    name: 'partnerList',
    meta: {
      title: '合作伙伴列表',
    },
    component: partnerList
  },
  {
    path: 'businessManage/partnerManage/partnerCreate',
    name: 'partnerCreate',
    meta: {
      parentName: 'partnerList',
      title: '新建合作伙伴',
    },
    component: partnerCreate
  },
  {
    path: 'businessManage/partnerManage/partnerEdit',
    name: 'partnerEdit',
    meta: {
      parentName: 'partnerList',
      title: '编辑合作伙伴',
    },
    component: partnerEdit
  },
  {
    path: 'businessManage/partnerManage/assessmentRules',
    name: 'assessmentRules',
    meta: {
      title: '考核规则',
    },
    component: assessmentRules
  },
  {
    path: 'businessManage/partnerManage/createRule',
    name: 'createRule',
    meta: {
      parentName: 'assessmentRules',
      title: '新增考核规则',
    },
    component: createRule
  },
  {
    path: 'businessManage/partnerManage/editRule',
    name: 'editRule',
    meta: {
      parentName: 'assessmentRules',
      title: '编辑考核规则',
    },
    component: createRule
  },
  {
    path: 'businessManage/partnerManage/partnerLevel',
    name: 'partnerLevel',
    meta: {
      title: '合作伙伴等级',
    },
    component: partnerLevel
  },
  {
    path: 'businessManage/partnerManage/createLevel',
    name: 'createLevel',
    meta: {
      parentName: 'partnerLevel',
      title: '新增合作伙伴等级',
    },
    component: createLevel
  },
  {
    path: 'businessManage/partnerManage/editLevel',
    name: 'editLevel',
    meta: {
      parentName: 'partnerLevel',
      title: '编辑合作伙伴等级',
    },
    component: createLevel
  },
  {
    path: 'businessManage/partnerManage/partnerAssessmentList',
    name: 'partnerAssessmentList',
    meta: {
      title: '伙伴考核记录',
    },
    component: partnerAssessmentList
  },
  {
    path: 'businessManage/partnerManage/partnerAssessmentDetail',
    name: 'partnerAssessmentDetail',
    meta: {
      parentName: 'partnerAssessmentList',
      title: '伙伴考核详情',
    },
    component: partnerAssessmentDetail
  },
  {
    path: 'businessManage/partnerManage/partnerDetail',
    name: 'partnerDetail',
    meta: {
      parentName: 'partnerList',
      title: '合作伙伴详情',
    },
    component: partnerDetail
  },
  {
    path: 'businessManage/partnerManage/partnerRuleDetail',
    name: 'partnerRuleDetail',
    meta: {
      parentName: 'assessmentRules',
      title: '合作伙伴详情',
    },
    component: partnerRuleDetail
  },
  {
    path: 'businessManage/partnerManage/partnerLevelDetail',
    name: 'partnerLevelDetail',
    meta: {
      parentName: 'partnerLevel',
      title: '伙伴等级详情',
    },
    component: partnerLevelDetail
  },
  {
    path: 'businessManage/onlineTraining/trainingManage/trainingPlanList',
    name: 'trainingPlanList',
    meta: {
      title: '培训计划列表',
    },
    component: trainingPlanList
  },
  {
    path: "businessManage/onlineTraining/trainingManage/trainingAdd",
    name: 'trainingAdd',
    meta: {
      parentName: 'trainingPlanList',
      title: '新建培训计划',
    },
    component: trainingAdd
  },
  {
    path: "businessManage/onlineTraining/trainingManage/trainingPlanDetail",
    name: 'trainingPlanDetail',
    meta: {
      parentName: 'trainingPlanList',
      title: '培训计划详情',
    },
    component: trainingPlanDetail
  },
  {
    path: 'businessManage/onlineTraining/trainingManage/trainingProjectList',
    name: 'trainingProjectList',
    meta: {
      title: '培训项目',
    },
    component: trainingProjectList
  },

  {
    path: "businessManage/onlineTraining/trainingManage/trainingProjectListAdd",
    name: 'trainingProjectListAdd',
    meta: {
      parentName: 'trainingProjectList',
      title: '新建培训项目',
    },
    component: trainingProjectListAdd
  },
  {
    path: "businessManage/onlineTraining/trainingManage/trainingProjectListAddDetails",
    name: 'trainingProjectListAddDetails',
    meta: {
      parentName: 'trainingProjectList',
      title: '培训项目详情',
    },
    component: trainingProjectListDetail
  },
  {
    path: "businessManage/onlineTraining/trainingManage/trainingProjectListEdit",
    name: 'trainingProjectListEdit',
    meta: {
      parentName: 'trainingProjectList',
      title: '编辑培训项目',
    },
    component: trainingProjectListEdit
  },
  {
    path: 'businessManage/onlineTraining/assessManage/questionBankManage/questionBankManage',
    name: 'questionBankManage',
    meta: {
      title: '题目管理',
    },
    component: questionBankManage
  },
  {
    path: 'businessManage/onlineTraining/assessManage/examinationArchives/examinationArchives',
    name: 'examinationArchives',
    meta: {

      title: '考试档案',
    },
    component: examinationArchives
  },
  {
    path: 'businessManage/onlineTraining/assessManage/questionBankManage/newQuestionBank',
    name: 'newQuestionBank',
    meta: {
      parentName: "questionBankManage",
      title: '新建题目',
    },
    component: newQuestionBank
  },
  {
    path: 'businessManage/onlineTraining/assessManage/questionBankManage/questionEdit',
    name: 'questionEdit',
    meta: {
      parentName: "questionBankManage",
      title: '编辑题目',
    },
    component: questionEdit
  },
  {
    path: 'businessManage/onlineTraining/assessManage/questionBankManage/questionCheck',
    name: 'questionCheck',
    meta: {
      parentName: "questionBankManage",
      title: '查看题目',
    },
    component: questionCheck
  },
  {
    path: 'businessManage/onlineTraining/assessManage/examinationArchives/examinationDetail',
    name: 'examinationDetail',
    meta: {
      parentName: "examinationArchives",
      title: '查看详情',
    },
    component: examinationDetail
  },
  {
    path: 'businessManage/onlineTraining/assessManage/examinationArchives/examQuestion',
    name: 'examQuestion',
    meta: {
      parentName: "examinationArchives",
      title: '考试题目',
    },
    component: examQuestion
  },
  {
    path: 'bussinessManage/onlineTraining/courseManage/courseTypeManage',
    name: 'courseTypeManage',
    meta: {
      title: '课程类型管理',
    },
    component: courseTypeManage
  },
  {
    path: 'bussinessManage/onlineTraining/courseManage/newCourseType',
    name: 'newCourseType',
    meta: {
      parentName: 'courseTypeManage',
      title: '新建课程类型',
    },
    component: newCourseType
  },
  {
    path: 'bussinessManage/onlineTraining/courseManage/editCourseType',
    name: 'editCourseType',
    meta: {
      parentName: 'courseTypeManage',
      title: '编辑课程类型',
    },
    component: editCourseType
  },

  {
    path: 'bussinessManage/onlineTraining/courseManage/courseManage',
    name: 'courseManageContent',
    meta: {
      title: '课程管理',
    },
    component: courseManageContent

  },
  {
    path: 'businessManage/onlineTraining/courseManage/newCourseManage',
    name: 'newCourseManage',
    meta: {
      parentName: 'courseManageContent',
      title: '新建课程',
    },
    component: newCourseManage
  },
  {
    path: 'businessManage/onlineTraining/courseManage/editCourseManage',
    name: 'editCourseManage',
    meta: {
      parentName: 'courseManageContent',
      title: '编辑课程',
    },
    component: editCourseManage
  },
  {
    path: 'businessManage/onlineTraining/courseManage/courseManageDetail',
    name: 'courseManageDetail',
    meta: {
      parentName: 'courseManageContent',
      title: '课程管理详情',
    },
    component: courseManageDetail
  },
  {
    path: 'businessManage/onlineTraining/assessManage/examinationArchives/examDetail',
    name: 'examDetail',
    meta: {
      parentName: "examinationArchives",
      title: '考试题目',
    },
    component: examDetail
  },
  {
    path: 'businessManage/upgradePlanList/',
    name: 'upgradePlanList',
    meta: {
      title: '升级计划列表',
    },
    component: upgradePlanList
  },
  {
    path: 'businessManage/upgradePlanListAdd',
    name: 'upgradePlanListAdd',
    meta: {
      parentName: "upgradePlanList",
      title: '新建升级计划',
    },
    component: upgradePlanListAdd
  },
  {
    path: 'businessManage/upgradePlanListEdit',
    name: 'upgradePlanListEdit',
    meta: {
      parentName: "upgradePlanList",
      title: '编辑升级计划',
    },
    component: upgradePlanListEdit
  },
  {
    path: 'businessManage/upgradePlanListDetail',
    name: 'upgradePlanListDetail',
    meta: {
      parentName: "upgradePlanList",
      title: '查看升级计划',
    },
    component: upgradePlanListDetail
  },
  {
    path: 'businessManage/rollbackSet',
    name: 'rollbackSet',
    meta: {
      title: '回滚设置列表',
    },
    component: rollbackSet
  },
  {
    path: 'businessManage/rollbackSetAdd',
    name: 'rollbackSetAdd',
    meta: {
      parentName: "rollbackSet",
      title: '新建回滚',
    },
    component: rollbackSetAdd
  },
  {
    path: 'businessManage/rollbackSetDetail',
    name: 'rollbackSetDetail',
    meta: {
      parentName: "rollbackSet",
      title: '查看回滚',
    },
    component: rollbackSetDetail
  },
  {
    path: 'businessManage/softwarePackage',
    name: 'softwarePackage',
    meta: {
      title: '升级软件包管理',
    },
    component: softwarePackage
  },
  {
    path: 'businessManage/softwarePackageUpload',
    name: 'softwarePackageUpload',
    meta: {
      parentName: "softwarePackage",
      title: '上传升级软件包',
    },
    component: softwarePackageUpload
  },
  {
    path: 'businessManage/softwarePackageDetail',
    name: 'softwarePackageDetail',
    meta: {
      parentName: "softwarePackage",
      title: '升级软件包查看',
    },
    component: softwarePackageDetail
  },
]