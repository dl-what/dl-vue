// 业务运营
import ajax from "@/utils/ajax.js";
export default {
  /*
   *@param {json} options: {} || {data: json}
   */
  /* 请务必注释每个接口所属名称 */
  // 例
  //渠道账户
  //渠道账户列表
  getChannelAccoutList: (options = {}) =>
    ajax.post("/account/page", options),

  //渠道账户详情
  getChannelAccoutDetail: (options = {}) =>
    ajax.post("/account/detail", options),
  //拥有渠道账户详情
  getHaveChannelDetail: (options = {}) =>
    ajax.post("/account/channel/detail", options),
  //渠道账户状态更改
  getChannelAccountStatus: (options = {}) =>
    ajax.post("/account/status", options),

  //角色管理
  //角色查询分页接口
  getRole: (options = {}) => ajax.post("/tChannelRoleInfo/list", options),
  //角色新增接口
  roleAdd: (options = {}) => ajax.post("/tChannelRoleInfo/create", options),
  //状态修改接口
  roleAmend: (options = {}) => ajax.post("/tChannelRoleInfo/update", options),
  //柜员机权限接口
  channelLimit: (options = {}) => ajax.post("/tChannelModuleInfo", options),
  //维护app权限接口
  findAppMenu: (options = {}) => ajax.post("/tChannelRoleInfo/findAppMenu", options),
  //角色修改接口
  channelRoleEdit: (options = {}) => ajax.post("/tChannelRoleInfo/update", options),
  //角色详情接口
  roleDetail: (options = {}) => ajax.post("/tChannelRoleInfo/detail", options),
  //用户角色数据接口
  accountRole: (options = {}) => ajax.post("/tChannelRoleInfo/findAll", options),
  // 查询渠道编号列表
  queryChannelNo: (options = {}) => ajax.post("/tChannelFund/queryChannelNo", options),
  // 查询账户编号列表
  queryAccountNo: (options = {}) => ajax.post("/tChannelFund/queryAccountNo", options),
  // 查询账户姓名列表
  queryAccountName: (options = {}) => ajax.post("/tChannelFund/queryAccountName", options),


  //账户管理页面
  //查询账户
  getAccount: (options = {}) => ajax.post("/tChannelFund/list", options),
  //新增账户
  // addAccount: (options = {}) => ajax.post('tChannelFund/create', options),
  //账户详情
  // accountDetail: (options = {}) => ajax.post('tChannelFund/detail', options),
  accountDetail: (options = {}) => ajax.post("/tChannelFund/detail", options),

  //兑奖管理
  //大奖兑奖分页数据
  getBigLottery: (options = {}) => ajax.post("/prize/cashPrizePage", options),
  //大奖兑奖打印
  getBigLotteryPrint: (options = {}) => ajax.post("/prize/awardList", options),
  //查询兑奖人信息
  InquireDetail: (options = {}) => ajax.post("/prize/prizeDetail", options),
  //获取兑奖税率
  BigLotteryTaxrate: (options = {}) => ajax.post("/prize/getTax", options),

  //保存兑奖人信息
  saveLotteryMessage: (options = {}) => ajax.put("/prize/save", options),
  //校验密码
  checkPassword: (options = {}) => ajax.post("/prize/checkPwd", options),
  //信息上传
  // messageUpload: (options = {}) => ajax.put("prize/upload", options),
  //兑奖查询分页数据
  getLotteryData: (options = {}) => ajax.post("/prize/noCashPrize", options),
  //兑奖设置
  getExpirySetting: (options = {}) => ajax.post("/setting/settingList", options),
  //兑奖设置查询游戏名称数据
  getGameList: (options = {}) => ajax.post("/game/queryAllGameInfo", options),
  //兑奖处管理机构树
  getInsTree: (options = {}) => ajax.post("/ins/queryInsTree", options),
  //兑奖处管理机构数据
  getInsList: (options = {}) => ajax.post("/office/queryOfficeListPage", options),
  //兑奖处新增
  InsAdd: (options = {}) => ajax.put("/office/save", options),
  //修改兑奖处
  InsUpdate: (options = {}) => ajax.put("/office/update", options),
  //兑奖处状态修改
  StatuUpdate: (options = {}) => ajax.post("/office/updateStatus", options),


  //客户账户页面
  //客户账户列表分页
  getcusList: (options = {}) => ajax.post("/customerAccount/page", options),
  //客户账户列表详情
  getcusDetai: (options = {}) => ajax.post("/customerAccount/detail", options),
  //钱包列表详情
  getMoneyDetai: (options = {}) => ajax.post("/customerAccount/purse/detail", options),

  // 客户标签页面
  // 编辑标签
  cusEditTag: (options = {}) => ajax.post('/label/edit', options),
  // 添加标签
  cusAddTag: (options = {}) => ajax.post('/label/add', options),
  // 客户标签分页
  cusPageList: (options = {}) => ajax.post('/label/page', options),
  // 客户标签详情
  cusPageDetail: (options = {}) => ajax.post('/label/detail', options),
  // 客户标签删除
  cusPageDelete: (options = {}) => ajax.post('/label/delete', options),
  // 客户标签批量删除
  cusPageDeleteIds: (options = {}) => ajax.post('/label/deleteByIds', options),

  //责任彩票页面
  //责任彩票列表
  getdutyList: (options = {}) => ajax.post('/ticket/queryList', options),
  // 责任彩票详情
  getInquireDetail: (options = {}) => ajax.post('/ticket/detail', options),

  //责任彩票编辑回显详情
  getdutyEditDetail: (options = {}) => ajax.post('/ticket/toUpdate', options),
  //责任彩票修改状态
  dutyUpdateStatus: (options = {}) => ajax.post('/ticket/updateStatus', options),
  //编辑责任彩票
  getDutyUpdata: (options = {}) => ajax.put('/ticket/update', options),
  //查询会员风险等级
  // getRiskList: (options = {}) => ajax.post('/ticket/riskList', options),
  //计算奖金开关
  changeMoneySwich: (options = {}) => ajax.put('/ticket/prizeSwitch', options),
  //计算账户开关
  changeSwich: (options = {}) => ajax.put('/ticket/balanceSwitch', options),

  //问卷调查页面
  //问卷统计分析列表
  questionnairAnalysis: (options = {}) => ajax.post('/statisticalAnalysis/page', options),
  //查询调查对象下拉数据
  queryRespondent: (options = {}) => ajax.post('/gamePlayPlan/queryPlayGameList', options),
  //详情接口
  questionnairAnalysisDetail: (options = {}) => ajax.post('/statisticalAnalysis/questionnaireSurvey/details', options),
  // 删除接口
  spliceQuestionnairAnalysis: (options = {}) => ajax.post('/statisticalAnalysis/questionnaireSurvey/delete', options),
  //问卷题库列表
  questionnaireQuestionBankList: (options = {}) => ajax.post('/depot/depotList', options),
  //问卷题库查询分类
  questionnaireQuestionBankClassify: (options = {}) => ajax.post('/category/queryName', options),
  //问卷题库详情
  questionnaireQuestionBankDetail: (options = {}) => ajax.post('/depot/detail', options),
  //修改问卷题库
  questionnaireQuestionBankUpdate: (options = {}) => ajax.put('/depot/update', options),
  //新增问卷题库
  questionnaireQuestionBankAdd: (options = {}) => ajax.put('/depot/save', options),
  //问卷题库导入
  importQuestionnaireQuestionBank: (options = {}) => ajax.post('/depot/importExcel', options),
  //问卷题库下载
  questiondownload: (options = {}) => ajax.post('/depot/exportTemplate', options),


  // 问卷制作
  makeQuestionnaire: (options = {}) => ajax.post('/questionnaireProduction/create', options),
  // 题目分类列表
  SubjectClassifiyList: (options = {}) => ajax.post('/category/cateList', options),
  // 题目分类详情
  SubjectClassifiyDetail: (options = {}) => ajax.post('/category/detail', options),
  //修改题目分类
  SubjectClassifiyUpdate: (options = {}) => ajax.put('/category/update', options),
  // 新增题目分类
  SubjectClassifiyAdd: (options = {}) => ajax.put('/category/save', options),





  //公告信息发布
  //公告信息分页查询
  queryNoticePublishList: (options = {}) => ajax.post("/publish/queryNoticePublishList", options),
  //新增公告发布信息
  addNoticePublish: (options = {}) => ajax.post("/publish/addNoticePublish", options),
  //公告发布详情
  NoticeDetail: (options = {}) => ajax.post("/publish/detail", options),
  //公告发布编辑
  NoticeEdit: (options = {}) => ajax.post("/publish/noticeEdit", options),
  //公告停用、启用
  NoticeEditFlag: (options = {}) => ajax.post("/publish/noticeEditFlag", options),
  //根据层级获取公告编排数据
  queryNoticeArrange: (options = {}) => ajax.post("/publish/queryNoticeArrange", options),
  //公告层级不同数据
  queryNoticeMmanagerial: (options = {}) => ajax.post("/publish/queryNoticeMmanagerial", options),
  //根据公告展示查询公告模板
  queryTemplate: (options = {}) => ajax.post("/template/queryTemplate", options),
  // 公告列表所属机构
  queryNoticeInsInfo: (options = {}) => ajax.post("/publish/queryNoticeInsInfo", options),

  //公告模板
  //查询全部公告模板
  queryAllTemplate: (options = {}) => ajax.post("/template/queryAllTemplate", options),
  //公告模板分页查询
  queryTemplateList: (options = {}) => ajax.post("/template/queryTemplateList", options),
  //公告模板详情
  noticeTemplateDetail: (options = {}) => ajax.post("/template/detail", options),
  //公告模板新建
  noticeTemplateCreate: (options = {}) => ajax.post("/template/addTemplate", options),
  //公告模板编辑
  // noticeTemplateEdit: (options = {}) => ajax.post("/template/templateEdit", options),
  //公告模板类型查询
  querytemplateType: (options = {}) => ajax.post("/template/querytemplateType", options),
  //公告模板内容上传(线下渠道) 
  noticeUploading: (options = {}) => ajax.post("/notice/uploading", options),


  //基金调拨
  fundTransfer: (options = {}) => ajax.post("/fundParameterManage/fundTransfer/jackpot", options),


  //账户记录
  // 成长值记录列表
  getGrowthPage: (options = {}) => ajax.post('/growthRecord/queryGrowthRecordPage', options),
  // 成长值记录详情/growthRecord/queryGrowthRecordDetail
  getGrowthDetail: (options = {}) => ajax.post('/growthRecord/queryGrowthRecordDetail', options),
  //投注、中奖记录
  queryGameRecord: (options = {}) => ajax.post('/accountRecord/queryBettingRecordByPage', options),
  //充值提现记录
  queryRechargeRecord: (options = {}) => ajax.post('/accountRecord/queryRechargeRecordByPage', options),
  //查询当前用户有权限的渠道
  queryUserChannelList: (options = {}) => ajax.post('/accountRecord/queryUserChannelList', options),
  //根据电话查询渠道
  queryChannelIdByPhone: (options = {}) => ajax.post('/channel/queryChannelIdByPhone', options),
  //根据渠道id查询渠道信息
  queryChannelById: (options = {}) => ajax.post('/channel/queryChannelById', options),
  //资金流水
  queryFundRecord: (options = {}) => ajax.post('/accountRecord/queryFundRecordByPage', options),
  //兑奖记录
  queryCashWin: (options = {}) => ajax.post('/accountRecord/queryCashPrizeRecordByPage', options),
  // 兑奖记录详情
  queryCashWinDetail: (options = {}) => ajax.post('/accountRecord/queryCashPrizeRecordDetail', options),
  //游戏名称，设备编号查询
  queryCashWinInfo: (options = {}) => ajax.post('/accountRecord/queryCashWinInfo', options),
  //查询订单状态变更记录
  queryWinRecordList: (options = {}) => ajax.post('/accountRecord/queryWinRecordList', options),
  //积分记录分页
  queryIntegralRecordPage: (options = {}) => ajax.post('/accountRecord/queryIntegralRecordPage', options),
  //积分记录详情
  queryIntegralRecordById: (options = {}) => ajax.post('/accountRecord/queryIntegralRecordById', options),
  //风险评估记录
  //分页
  queryRiskAssessmentPage: (options = {}) => ajax.post('/riskAssessmentRecord/queryRiskAssessmentPage', options),
  //详情
  queryRiskAssessmentDetail: (options = {}) => ajax.post('/riskAssessmentRecord/queryRiskAssessmentDetail', options),
  //权益等级下拉
  memberRiskLevelRiskLevelTree: (options = {}) => ajax.post('/memberRiskLevel/riskLevelTree', options),

  //会员积分管理
  //会员积分详情
  memberIntegralRuleDetails: (options = {}) => ajax.post('/memberIntegralRule/details', options),
  //会员积分管理规则新增
  create: (options = {}) => ajax.post('/memberIntegralRule/create', options),
  //会员积分管理分页查询
  findPage: (options = {}) => ajax.post('/memberIntegralRule/page', options),
  //会员积分管理状态更改
  memberIntegralRuleStatusUpdate: (options = {}) => ajax.post('/memberIntegralRule/statusUpdate', options),
  //会员积分管理修改
  update: (options = {}) => ajax.post('/memberIntegralRule/update', options),
  //有效期设置
  effectiveSet: (options = {}) => ajax.post('/integralEffectiveSet/effectiveSet', options),
  //会员积分有效期设置查询
  integralEffectiveSetQuery: (options = {}) => ajax.post('/integralEffectiveSet/query', options),
  //会员权益管理
  //新增
  memberRightsCreate: (options = {}) => ajax.post('/memberRights/create', options),
  //类型详情
  memberRightsDetails: (options = {}) => ajax.get('/memberRights/details', options),
  //图标上传
  imgFileUpload: (options = {}) => ajax.post('/memberRights/imgFileUpload', options),
  //分页查询
  memberRightsPage: (options = {}) => ajax.post('/memberRights/page', options),
  //会员权益选择树
  rightsTree: (options = {}) => ajax.post('/memberRights/rightsTree', options),
  //状态修改
  memberRightsStatusUpdate: (options = {}) => ajax.post('/memberRights/statusUpdate', options),
  //权益修改
  memberRightsUpdate: (options = {}) => ajax.post('/memberRights/update', options),

  // 品牌与营销推广
  // 活动计划模板设置创建
  activityPlanTemplateCreate: (options = {}) => ajax.post("/activityPlanTemplate/create", options),
  // 获取活动兑换权益
  getRightsTreeOffLine: (options = {}) => ajax.post("/memberRights/rightsTreeOffLine", options),
  // 活动计划模板详情查询
  activityPlanTemplateDetail: (options = {}) => ajax.post("activityPlanTemplate/detail", options),
  // 活动计划模板列表分页查询
  getTemplateList: (options = {}) => ajax.post("/activityPlanTemplate/list", options),
  // 活动规则模板新建
  templateCreate: (options = {}) => ajax.post("/activityRuleTemplate/create", options),
  // 获取下拉选择框物品名称-型号树
  getModelTrees: (options = {}) => ajax.get('/goodsModel/goodsNameTree', options),
  // 获取规则模板表格数据
  getRuleTemplateList: (options = {}) => ajax.post('/activityRuleTemplate/list', options),
  //活动规则模板详情查询
  getRuleTemplateDetail: (options = {}) => ajax.post('activityRuleTemplate/detail', options),
  // 活动规则模板修改
  ruleModification: (options = {}) => ajax.post('activityRuleTemplate/update', options),
  // 获取规则模板全部数据
  getRuleAll: (options = {}) => ajax.post('activityRuleTemplate/listAll', options),
  // 新建活动计划
  createActivityPlan: (options = {}) => ajax.post('activityPlan/create', options),
  // 获取活动计划管理列表
  getActivityPlan: (options = {}) => ajax.post('activityPlan/list', options),
  // 活动计划管理注销
  activityBackOut: (options = {}) => ajax.post('activityPlan/delete', options),
  // 活动计划管理批量注销
  batchBackout: (options = {}) => ajax.post('activityPlan/deleteByIds', options),
  //  活动计划管理详情
  getActivityDetail: (options = {}) => ajax.post('activityPlan/detail', options),
  // 获取活动计划全部数据
  getActivityPlanAll: (options = {}) => ajax.post('activityPlan/listAll', options),
  // 获取活动计划标题
  getActivityTitle: (options = {}) => ajax.post('activityPlan/content', options),
  // 查询所有的渠道角色
  getChannelRole: (options = {}) => ajax.post('tChannelRoleInfo/findAll', options),
  // 活动执行管理分配任务新建
  taskCreate: (options = {}) => ajax.post('executionPlan/create', options),
  // 活动执行管理列表查询
  executionPlanList: (options = {}) => ajax.post('executionPlan/list', options),
  // 活动执行管理列表详情executionPlan/detail
  executionDetail: (options = {}) => ajax.post('executionPlan/detail', options),
  // 活动效果评估列表查询activityEvaluation/list
  getActivityEvaluation: (options = {}) => ajax.post('activityEvaluation/list', options),
  // 活动效果评估上传
  activityUploading: (options = {}) => ajax.upload('activityEvaluation/uploading', options),
  // 活动效果评估下载activityEvaluation/downloading
  activityDownloading: (options = {}) => ajax.post('activityEvaluation/downloading', options),
  // 获取游戏名称
  getRuleGameName: (options = {}) => ajax.post('/game/queryAllGameInfo', options),

  //会员等级管理
  //方案新增
  // memberLevelProgramCreate: (options = {}) => ajax.post('/memberLevelProgram/create', options),
  //方案详情
  memberLevelProgramDetails: (options = {}) => ajax.post('/memberLevelProgram/details', options),
  //会员等级选择树
  memberLevelProgramLevelTree: (options = {}) => ajax.post('/memberLevelProgram/levelTree', options),
  //会员等级管理方案分页查询
  memberLevelProgramPage: (options = {}) => ajax.post('/memberLevelProgram/page', options),
  //状态修改
  memberLevelProgramStatusUpdate: (options = {}) => ajax.post('/memberLevelProgram/statusUpdate', options),
  //方案修改
  memberLevelProgramUpdate: (options = {}) => ajax.post('/memberLevelProgram/update', options),
  //

  //会员风险等级
  //会员风险评估题库-新建题目
  memberRiskLevelQuestionCreate: (options = {}) => ajax.post('/memberRiskLevelQuestion/create', options),
  //详情查看
  memberRiskLevelQuestionDetails: (options = {}) => ajax.get('/memberRiskLevelQuestion/details', options),
  //分页查询
  memberRiskLevelQuestionPage: (options = {}) => ajax.post('/memberRiskLevelQuestion/page', options),
  //题目修改
  memberRiskLevelQuestionUpdate: (options = {}) => ajax.post('/memberRiskLevelQuestion/update', options),
  //题库导入
  memberRiskLevelQuestionImportExcel: (options = {}) => ajax.post('/memberRiskLevelQuestion/importExcel', options),
  //导出
  downloadingExcelTemplate: (options = {}) => ajax.post('/memberRiskLevelQuestion/downloading/excelTemplate', options),
  //风险等极设置
  //返回目前最高等级
  returnMaxLevel: (options = {}) => ajax.post('/memberRiskLevel/returnMaxLevel', options),
  //新建
  memberRiskLevelCreate: (options = {}) => ajax.post('/memberRiskLevel/create', options),
  //分页查询
  memberRiskLevelPage: (options = {}) => ajax.post('/memberRiskLevel/page', options),
  //返回新建等级接口
  returnLevel: (options = {}) => ajax.post('/memberRiskLevel/returnLevel', options),
  //搜索等级下拉接口
  riskLevelTree: (options = {}) => ajax.post('/memberRiskLevel/riskLevelTree', options),
  //风险等级修改
  memberRiskLevelUpdate: (options = {}) => ajax.post('/memberRiskLevel/update', options),
  //等级删除
  memberRiskLevelDeleteLevel: (options = {}) => ajax.post('/memberRiskLevel/deleteLevel', options),
  //风险评估方案
  //新建
  memberRiskLevelProgramCreate: (options = {}) => ajax.post('/memberRiskLevelProgram/create', options),
  //风险评估方案详情
  memberRiskLevelProgramDetails: (options = {}) => ajax.post('/memberRiskLevelProgram/details', options),
  //评估方案分页
  memberRiskLevelProgramPage: (options = {}) => ajax.post('/memberRiskLevelProgram/page', options),
  //状态修改
  memberRiskLevelProgramStatusUpdate: (options = {}) => ajax.post('/memberRiskLevelProgram/statusUpdate', options),
  //方案修改
  memberRiskLevelProgramUpdate: (options = {}) => ajax.post('/memberRiskLevelProgram/update', options)
};