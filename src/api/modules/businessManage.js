// 业务管理
import ajax from '@/utils/ajax.js'
export default {
  /*
   *@param {json} options: {} || {data: json}
   */
  /* 请务必注释每个接口所属名称 */
  // 例
  getTest: (options = {}) => ajax.post('/test', options),
  /*
   ** 首页
   */
  // 我的申请列表
  getMyApplyList: (options = {}) => ajax.post('/act/business/apply/page', options),
  // 删除我的申请
  deleteMyApply: (options = {}) => ajax.post('/act/business/draft/delete', options),
  // 是否审批流程校验
  validProcess: (options = {}) => ajax.post('/act/business/valid', options),
  // 审批流程暂存
  saveDraft: (options = {}) => ajax.post('/act/business/draft/edit', options),
  // 申请详情-历史
  getHistoricFlow: (options = {}) => ajax.post('/act/business/historicFlow', options),
  // 申请详情-流程图
  getHighlightImg: (options = {}) => ajax.get('/act/business/getHighlightImg', options),
  // 流程图
  getDiagramImg: (options = {}) => ajax.get('/act/business/diagram', options),
  // 我的待办
  getTaskTodo: (options = {}) => ajax.post('/act/business/task/todo', options),
  // 审核通过
  getTaskPass: (options = {}) => ajax.post('/act/business/task/pass', options),
  // 委派他人
  getTaskDelegate: (options = {}) => ajax.post('/act/business/task/delegate', options),
  // 我的已办
  getTaskDone: (options = {}) => ajax.post('/act/business/task/done', options),
  // 驳回
  getTaskBack: (options = {}) => ajax.post('/act/business/task/back', options),
  // 撤回
  getTaskRevoke: (options = {}) => ajax.post('/act/business/task/revoke', options),
  // 转办
  getTurnTodo: (options = {}) => ajax.post('/act/business/task/turnTodo', options),
  // 我的知会
  getMyNotify: (options = {}) => ajax.post('/act/business/notify/page', options),
  // 驳回发起人 下拉框
  getBackList: (options = {}) => ajax.post('/act/business/getBackList', options),
  // 表单数据
  getTaskData: (options = {}) => ajax.post('/act/business/detail', options),
  // 强制结束
  getTaskForcedEnd: (options = {}) => ajax.post('/act/business/task/forcedEnd', options),
  // 催办
  getTaskUrgent: (options = {}) => ajax.post('/act/business/task/urgent', options),
  // 档案管理
  getDossierList: (options = {}) => ajax.post('/act/business/finished/page', options),
  // 渠道地址
  getChannelAddress: (options = {}) => ajax.post('/ins/queryInsAndRegion', options),
  // 站内信列表
  getMessageList: (options = {}) => ajax.post('/stationMsg/page', options),
  // 站内信-发布消息
  addMessage: (options = {}) => ajax.post('/stationMsg/add', options),
  // 站内信-详情
  getMessageDetail: (options = {}) => ajax.post('/stationMsg/detail', options),
  // 我的待办 -导出
  exportTodoExcel: (options = {}) => ajax.post('/act/business/todo/exportExcel', options),
  // 我的已办 -导出
  exportDoneExcel: (options = {}) => ajax.post('/act/business/done/exportExcel', options),
  // 我的申请 -导出
  exportApplyExcel: (options = {}) => ajax.post('/act/business/apply/exportExcel', options),
  // 我的知会 -导出
  exportNotifyExcel: (options = {}) => ajax.post('/act/business/notify/exportExcel', options),
  // 概况
  getBusinessTotal: (options = {}) => ajax.post('/act/business/total', options),





  getChannelTerminalMenu: (options = {}) => ajax.post('/getChannelTerminalMenu', options),
  //渠道资源管理模块
  //仓库管理列表
  getStoreList: (options = {}) => ajax.post('/channelResManage/warehouse/page', options),
  //仓库详情查看
  detailStore: (options = {}) => ajax.get('/channelResManage/warehouse/detailWare', options),
  //获取所属机构列表
  getInsDataList: (options = {}) => ajax.post('/ins/queryUserAndInsTree', options),
  //获取仓库管理搜索功能所属机构列表
  getSearchInsList: (options = {}) => ajax.post('/ins/queryUserAndInsTree', options),
  // 获取管理员列表
  getAdminList: (options = {}) => ajax.post('/dept/findDeptUserByInsId', options),
  // 新增仓库
  createWare: (options = {}) => ajax.post('/channelResManage/warehouse/createWare', options),
  // 编辑仓库
  updateWare: (options = {}) => ajax.post('/channelResManage/warehouse/updateWare', options),
  // 
  getUserTree: (options = {}) => ajax.post('/ins/queryUserAndInsTreeByInsId', options),

  // 仓库管理详情查看
  detailStore: (options = {}) => ajax.get('/channelResManage/warehouse/detailWare', options),
  //获取基本信息类型管理列表
  getGoosType: (options = {}) => ajax.post('/goodsType/pageList', options),
  // 获取下拉选择框物品名称-型号树
  getModelTrees: (options = {}) => ajax.get('/goodsModel/goodsNameTree', options),
  // 获取型号管理搜索物品名称下拉框
  getSearchName: (options = {}) => ajax.get('/goodsModel/modelTree', options),
  // 获取类型管理查看详情
  getDetail: (options = {}) => ajax.get('/goodsType/details', options),
  // 型号图片上传
  modelImgUpload: (options = {}) => ajax.post('/goodsModel/imgFileUpload', options),

  // 根据渠道获取设备型号
  getQueryDeviceModel: (options = {}) => ajax.post('/goodsModel/queryDeviceModel', options),



  //类型管理状态修改
  statusUpdate: (options = {}) => ajax.post('/goodsType/statusUpdate', options),
  //类型管理类型新增
  typeCreate: (options = {}) => ajax.post('/goodsType/create', options),
  //类型管理-图片上传
  uploadGoodsType: (options = {}) => ajax.upload('/goodsType/imgFileUpload', options),
  // 类型管理修改
  modification: (options = {}) => ajax.post('/goodsType/update', options),
  // 获取型号管理列表
  getModelList: (options = {}) => ajax.post('/goodsModel/pageList', options),
  // 型号管理状态修改
  ModelstatusUpdate: (options = {}) => ajax.post('/goodsModel/statusUpdate', options),
  // 型号管理新增
  modelCreate: (options = {}) => ajax.post('/goodsModel/create', options),
  //获取型号管理详情
  modelDetail: (options = {}) => ajax.post('/goodsModel/details', options),
  //型号管理修改
  modelWrite: (options = {}) => ajax.post('/goodsModel/update', options),
  //出入库管理列表获取
  getOutPutList: (options = {}) => ajax.post('/warehouseRecording/page', options),

  //出入库详情
  getOutPutDetail: (options = {}) => ajax.post('/warehouseRecording/detail', options),
  //出入库
  entryAndOut: (options = {}) => ajax.post('/warehouseRecording/entryAndOut', options),
  //出入库导出
  outExport: (options = {}) => ajax.post('/warehouseRecording/exportExcel', options),
  // 台账分页查询列表
  terraceAccountPage: (options = {}) => ajax.post('/terraceAccount/terraceAccountPage', options),
  // 台账导出
  terraceGetOut: (options = {}) => ajax.post('/terraceAccount/terraceAccountExportExcel', options),
  // 台账详情查询
  getTerraceDetail: (options = {}) => ajax.post('/terraceAccount/terraceAccountItem', options),
  // 台账详情导出
  terraceDetailGetOut: (options = {}) => ajax.post('/terraceAccount/terraceAccountItemExportExcel', options),
  // 库存分页查询
  inventoryCheck: (options = {}) => ajax.post('/reserve/reservePage', options),
  // 库存导出
  inventoryGetOut: (options = {}) => ajax.post('/reserve/reserveExportExcel', options),
  // 库存详情查询
  inventoryDetail: (options = {}) => ajax.post('/reserve/reserveItem', options),

  // 设备管理
  // 设备分页查询列表
  equipmentListPage: (options = {}) => ajax.post('/equipment/equipmentPage', options),
  // 设备详情查询
  equipmentInfoDetail: (options = {}) => ajax.post('/equipment/equipmentInfo', options),
  // 设备履历
  equipmentRecord: (options = {}) => ajax.post('/equipment/equipmentRecord', options),
  // 配件详情查询
  accessoriesInfoDetail: (options = {}) => ajax.post('/accessories/accessoriesInfo', options),
  // 配件分页查询列表
  accessoriesListPage: (options = {}) => ajax.post('/accessories/accessoriesPage', options),
  // 配件履历
  accessoriesRecord: (options = {}) => ajax.post('/accessories/accessoriesRecord', options),

  // 投注卡生成
  createCardGeneration: (options = {}) => ajax.post('/bettingCardGeneration/create', options),
  //  投注卡生成注销
  deleteCardGeneration: (options = {}) => ajax.post('/bettingCardGeneration/delete', options),
  // 投注卡生成详情查询
  cardGenerationDetail: (options = {}) => ajax.post('/bettingCardGeneration/detail', options),
  // 投注卡生成列表分页查询
  cardGenerationList: (options = {}) => ajax.post('/bettingCardGeneration/list', options),
  // 根据投注卡生成ID查询投注卡信息列表
  bettingCardList: (options = {}) => ajax.post('/bettingCardGeneration/bettingCardList', options),

  // 投注卡信息列表分页查询
  bettingCardInfoList: (options = {}) => ajax.post('/bettingCardInfo/list', options),
  // 投注卡信息详情查询
  bettingCardInfoDetail: (options = {}) => ajax.post('/bettingCardInfo/detail', options),
  // 投注卡信息注销
  deleteBettingCardInfo: (options = {}) => ajax.post('/bettingCardInfo/delete', options),
  // 投注卡信息导出Excel 
  bettingCardExportExcel: (options = {}) => ajax.post('/bettingCardGeneration/exportExcel', options),

  // 投注卡管理
  getBettingRulesList: (options = {}) => ajax.post('/bettingCardRechargeRules/list', options),
  // 新增投注卡规则
  createBettingRulesList: (options = {}) => ajax.post('/bettingCardRechargeRules/create', options),
  // 删除投注卡规则
  deleteBettingCard: (options = {}) => ajax.post(`/bettingCardRechargeRules/delete`, options),
  // 修改投注卡规则
  updateBettingRules: (options = {}) => ajax.post('/bettingCardRechargeRules/update', options),
  // 根据机构id获取所属渠道列表
  getCurrentChannels: (options = {}) => ajax.post('/sales/channel', options),
  /* 
    请务必注释每个接口所属名称 
  */
  // 新增年度开展计划
  createDevelopPlan: (options = {}) => ajax.post('/developPlan/addDevelopPlanInfo', options),
  // 编辑年度开展计划
  editDevelopPlan: (options = {}) => ajax.post('/developPlan/updateDevelopPlanInfo', options),
  // 查询年度开展计划列表
  getDevelopPlanList: (options = {}) => ajax.post('/developPlan/queryDevelopPlanList', options),
  // 查询当前用户的机构信息
  getUserInsInfoList: (options = {}) => ajax.post('/developPlan/queryUserInsInfoList', options),
  // 查询年度开展计划详情
  getDevelopPlanInfo: (options = {}) => ajax.post('/developPlan/queryDevelopPlanInfo', options),
  // 查询年度开展计划汇总省级列表
  getProvincePlanList: (options = {}) => ajax.post('/developPlan/queryProvinceDevelopPlanList', options),
  // 查询年度开展计划汇总省级信息
  getProvincePlanInfo: (options = {}) => ajax.post('/developPlan/queryProvinceDevelopPlanInfo', options),
  //  修改年度发展计划审批信息
  updateDevelopPlanApproval: (options = {}) => ajax.post('/developPlan/updateDevelopPlanApproval', options),
  // 导出年度发展计划列表信息 
  exportDevelopPlanList: (options = {}) => ajax.post('/developPlan/exportDevelopPlanList', options),
  // 导出年度发展计划汇总省级列表信息
  exportProvinceDevelopPlanList: (options = {}) => ajax.post('/developPlan/exportProvinceDevelopPlanList', options),
  // 导出年度发展计划汇总市级列表信息
  exportCityDevelopPlanList: (options = {}) => ajax.post('/developPlan/exportCityDevelopPlanList', options),

  // 查询当前登录用户的机构信息

  // 查询年度开展计划汇总市级列表
  getCityPlanList: (options = {}) => ajax.post('/developPlan/queryCityDevelopPlanList', options),
  // 查询年度开展计划汇总市级信息
  getCityPlanInfo: (options = {}) => ajax.post('/developPlan/queryCityDevelopPlanInfo', options),
  // 省级查询市级计划汇总信息
  getProvinceCityPlan: (options = {}) => ajax.post('/developPlan/queryProvinceCityDevelopPlan', options),

  // 游戏储备列表
  getGameStoreList: (options = {}) => ajax.post('/game/queryGameListByPage', options),
  // 新增游戏储备
  createGameStore: (options = {}) => ajax.post('/game/insertGameInfo', options),
  // 编辑游戏储备
  editGameStore: (options = {}) => ajax.post('/game/updateGameInfo', options),
  // 游戏储备详情
  getGameStoreInfo: (options = {}) => ajax.post('/game/queryGameInfoById', options),
  // 导出游戏列表
  exportGameExcel: (options = {}) => ajax.post('/game/exportExcel', options),
  // 下载游戏附件
  downGameLoad: (options = {}) => ajax.post('/game/downloading', options),
  // 所有游戏列表
  getAllGameList: (options = {}) => ajax.post('/game/queryAllGameInfo', options),
  // 版本配置列表
  getGameConList: (options = {}) => ajax.post('/game/querySoftwareInfoVoPage', options),
  // 版本配置详情
  getGameConDetail: (options = {}) => ajax.post('/game/queryGameConList', options),
  // 校验配置编码是否存在
  checkDeployCode: (options = {}) => ajax.post('/game/checkDeployCode', options),
  // 校验游戏是否已存在
  checkGameIsExist: (options = {}) => ajax.post('/game/checkIsExist', options),
  // 校验上市计划是否已存在
  checkListPlanIsExist: (options = {}) => ajax.post('/gameListPlan/checkIsExist', options),
  // 校验上市计划 区域指定大厅编码是否正确
  checkListPlanChannelNo: (options = {}) => ajax.post('/gameListPlan/checkChannelNo', options),
  // 校验变更计划是否已存在
  checkChangePlanIsExist: (options = {}) => ajax.post('/gameChangePlan/checkIsExist', options),
  // 校验退市计划是否已存在
  checkLeavePlanIsExist: (options = {}) => ajax.post('/gameLeavePlan/checkCodeIsExist', options),
  // 校验试玩编码是否存在
  checkTryPlanIsExist: (options = {}) => ajax.post('/gamePlayPlan/checkIsExist', options),
  // 校验累计奖池ID是否存在
  checkRewardPoolIdIsExist: (options = {}) => ajax.post('/game/checkRewardPoolIdIsExist', options),
  // 校验游戏包版本号是否存在
  checkVersionNumberIsExist: (options = {}) => ajax.post('/game/checkVersionNumberIsMax', options),



  // 游戏类型列表
  getGameTypeList: (options = {}) => ajax.post('/gameType/queryGameTypeByPage', options),
  // 新建游戏类型
  createGameType: (options = {}) => ajax.post('/gameType/insertGameType', options),
  // 编辑游戏类型
  editGameType: (options = {}) => ajax.post('/gameType/updateGameType', options),
  // 下拉框游戏类型
  getAllGameType: (options = {}) => ajax.post('/gameType/queryAllGameType', options),
  // 修改游戏类型状态
  getGameTypeStatus: (options = {}) => ajax.post('/gameType/updateStatus', options),


  // 试玩计划列表
  getTryPlanList: (options = {}) => ajax.post('/gamePlayPlan/queryGamePlayPage', options),
  // 新增试玩计划
  createTryPlan: (options = {}) => ajax.post('/gamePlayPlan/insertGamePlayInfo', options),
  // 编辑试玩计划
  editTryPlan: (options = {}) => ajax.post('/gamePlayPlan/updateGamePlayInfo', options),
  // 试玩计划详情
  getTryPlanDetail: (options = {}) => ajax.post('/gamePlayPlan/queryGamePlayById', options),
  // 试玩游戏列表
  getTryGameList: (options = {}) => ajax.post('/gamePlayPlan/queryPlayGameList', options),
  // 获取游戏试玩区域
  getTryGameArea: (options = {}) => ajax.post('/gamePlayPlan/queryInsIdByGameId', options),
  // 终止试玩
  getTryGameStop: (options = {}) => ajax.post('/gamePlayPlan/stopGamePlay', options),



  // 上市游戏列表
  queryGameListPlanPage: (options = {}) => ajax.post('/gameListPlan/queryGameListPlanPage', options),
  // 上市记录查询列表
  getMarketPlanRecord: (options = {}) => ajax.post('/gameListPlan/queryPlanByGameId', options),
  // 查询服务器IP地址
  getProviderIpProt: (options = {}) => ajax.post('/game/queryProviderIpProt', options),
  // 修改上市游戏销售状态
  changeSaleStatus: (options = {}) => ajax.post('/gameListPlan/updateSaleStatus', options),



  // 查询上市计划列表
  getMarketPlanList: (options = {}) => ajax.post('/gameListPlan/queryListPlanByPage', options),
  // 新增上市计划
  createMarketPlan: (options = {}) => ajax.post('/gameListPlan/insertGameListPlan', options),
  // 上市计划详情
  getMarketPlanDetail: (options = {}) => ajax.post('/gameListPlan/queryListPlanById', options),
  // 编辑上市计划
  editMarketPlan: (options = {}) => ajax.post('/gameListPlan/updateGameListPlan', options),
  // 销售区域查询渠道
  getChannelByIns: (options = {}) => ajax.post('/channel/queryChannelByIns', options),
  // 查询该游戏已上市的区域
  getGameSalesArea: (options = {}) => ajax.post('/gameListPlan/queryInsByGameId', options),
  // 查询该游戏已上市的区域（变更计划和退市计划）
  getChangeSalesArea: (options = {}) => ajax.post('/gameListPlan/queryLeaveInsByGameId', options),


  // 查询变更计划列表
  getChangePlanList: (options = {}) => ajax.post('/gameChangePlan/queryChangePlanPage', options),
  // 查询上市计划列表-下拉框
  getAllPlanList: (options = {}) => ajax.post('/gameListPlan/queryAllGameListPlan', options),
  // 变更计划详情
  getChangePlanDetail: (options = {}) => ajax.post('/gameChangePlan/queryGameChangePlanById', options),
  // 编辑变更计划
  editChangePlan: (options = {}) => ajax.post('/gameChangePlan/updateGameChangePlan', options),
  // 新增变更计划
  createChangePlan: (options = {}) => ajax.post('/gameChangePlan/insertGameChangePlan', options),

  // 退市计划列表
  getDelistingPlanList: (options = {}) => ajax.post('/gameLeavePlan/gameLeavePlanByPage', options),
  // 新增退市计划
  createDelistingPlan: (options = {}) => ajax.post('/gameLeavePlan/insertGameLeavePlanInfo', options),
  // 编辑退市计划
  editDelistingPlan: (options = {}) => ajax.post('/gameLeavePlan/updateGameLeavePlanInfo', options),
  // 退市计划详情
  getDelistingPlanDetail: (options = {}) => ajax.post('/gameLeavePlan/queryGamePlayById', options),




  // 新建渠道
  createChannel: (options = {}) => ajax.post('/create/save', options),
  // 新建渠道--销售游戏列表
  getChannelGameList: (options = {}) => ajax.post('/create/selectGameList', options),
  // 渠道列表
  getChannelList: (options = {}) => ajax.post('/channel/queryListByPage', options),
  // 渠道详情
  getChannelDetail: (options = {}) => ajax.post('/channel/queryDetailById', options),
  // 渠道附件上传
  uploadChannelFiles: (options = {}) => ajax.upload('/fileUpload/upload', options),
  // 渠道附件下载
  downloadChannelFiles: (options = {}) => ajax.upload('/fileUpload/download', options),
  // 渠道列表导出
  exportChannelExcel: (options = {}) => ajax.post('/channel/exportExcel', options),
  // 查询经理角色
  getManagerRole: (options = {}) => ajax.post('/tChannelRoleInfo/findManager', options),
  // 获取渠道额度
  getChannelLimit: (options = {}) => ajax.post('/create/plan', options),
  // 获取渠道详情里面的发放资源
  getChannelResource: (options = {}) => ajax.post('/channel/resources/queryResByChannelId', options),
  // 获取新建渠道的合作伙伴列表
  getChannelPartner: (options = {}) => ajax.post('/partner/partner/listAll', options),
  // 获取新建渠道等级列表-下拉框
  getChannelGradeList: (options = {}) => ajax.post('/channelKPI/channelGradeInfo/listAll', options),



  // 渠道

  // 渠道变更
  // 业务办理-修改方式-渠道编号（公共）
  getChannelByQry: (options = {}) => ajax.post('/channel/queryByQry', options),
  //  查询渠道编号列表
  getChannelInfoModifyList: (options = {}) => ajax.post('/channel/channelNo/query', options),
  // 查询指定渠道编号的详情
  getChannelNoDetail: (options = {}) => ajax.post('/channelInfoModify/channelNoDetail', options),
  // 变更渠道
  updateChannelInfoByChannelNo: (options = {}) => ajax.post('/channelInfoModify/updateChannelInfoByChannelNo', options),
  // 渠道增机channelResAddInfo/add
  addMachine: (options = {}) => ajax.post('/channelResAddInfo/add', options),
  // 根据渠道增机查询指定物品-终端机
  addGoodsInfoList: (options = {}) => ajax.post('/channelResAddInfo/warehouseGoodsInfoList', options),
  // 获取年度计划渠道额度
  getAnnualQuota: (options = {}) => ajax.post('/channelResAddInfo/selectByChannelNo', options),


  // 渠道迁址
  // 查询指定渠道编号的详情
  getRemovalChannelNoDetail: (options = {}) => ajax.post('/channelRemovalInfo/channelNoDetail', options),
  //渠道迁址信息
  updateChannelRemovalInfo: (options = {}) => ajax.post('/channelRemovalInfo/updateChannelRemovalInfo', options),

  // 渠道关停
  // 查询渠道关停编号列表
  // getChannelCloseInfoPageList: (options = {}) => ajax.post('/channelCloseInfo/pageList', options),
  // 根据渠道编码查询仓库所有物品
  pageWarehouseGoodsInfoList: (options = {}) => ajax.post('/equipment/pageWarehouseGoodsInfoList', options),
  // 渠道关停提交数据
  updateChannelCloseInfo: (options = {}) => ajax.post('/channelCloseInfo/updateChannelCloseInfo', options),

  // 渠道过户
  // 查询渠道编号列表 
  getChannelTransferPageList: (options = {}) => ajax.post('/channelTransfer/pageList', options),
  // 根据渠道编码查询渠道及负责人信息
  getChannelTransferChannelFund: (options = {}) => ajax.post('/channelTransfer/channelFund', options),
  // 渠道过户信息
  postFundTransfer: (options = {}) => ajax.post('/channelTransfer/fundTransfer', options),
  // 合作伙伴列表查询 
  getPartnerListAll: (options = {}) => ajax.post('/partner/partner/listAll', options),

  // 渠道退机
  // 查询渠道编号列表 
  getChannelResSubTract: (options = {}) => ajax.post('/channelResSubTract/pageList', options),
  // 根据渠道退机所选渠道编码查询仓库所有物品
  getChannelResSubTractInfo: (options = {}) => ajax.post('/channelResSubTract/pageWarehouseGoodsInfoList', options),
  //  渠道退机信息 
  postChannelResSubTract: (options = {}) => ajax.post('/channelResSubTract/subtract', options),

  // 渠道移机
  // 获取渠道移机编号列表
  getChannelResTransfer: (options = {}) => ajax.post('/channelResTransfer/pageList', options),
  // 根据渠道移机所选渠道编码查询仓库所有物品
  getChannelResTransferInfo: (options = {}) => ajax.post('/channelResTransfer/pageWarehouseGoodsInfoList', options),
  // 渠道移机信息
  postChannelResTransfer: (options = {}) => ajax.post('/channelResTransfer/transfer', options),

  // 资金参数
  getChannelTerminalMenu: (options = {}) => ajax.post('/getChannelTerminalMenu', options),
  // 根据资源类型获取资源名称
  getModelTree: (options = {}) => ajax.get('/goodsModel/queryModelTree', options),

  getChannelTerminalMenu: (options = {}) => ajax.post('/getChannelTerminalMenu', options),
  //资金参数列表分页查询
  getFundsParameter: (options = {}) => ajax.post('/tFundParameter/list', options),
  //资金参数详情查询
  getParameterDetail: (options = {}) => ajax.post('/tFundParameter/detail', options),
  //资金参数修改
  editFundsParameter: (options = {}) => ajax.post('/tFundParameter/update', options),
  //基金划拔管理
  //分页
  fundTransferList: (options = {}) => ajax.post('/fundParameterManage/fundTransfer/list', options),
  //新增
  fundTransferCreate: (options = {}) => ajax.post('/fundParameterManage/fundTransfer/create', options),
  //删除
  fundTransferDelect: (options = {}) => ajax.post('/fundParameterManage/fundTransfer/delete', options),
  //详情
  fundTransferDetails: (options = {}) => ajax.post('/fundParameterManage/fundTransfer/detail', options),

  // 全局参数列表分页查询
  globalParameterList: (options = {}) => ajax.post('/fundParameterManage/globalParameterManagement/list', options),
  // 全局参数状态修改和编辑
  globalParameterUpdate: (options = {}) => ajax.post('/fundParameterManage/globalParameterManagement/update', options),
  // 全局参数查看
  globalParameterDetail: (options = {}) => ajax.post('/fundParameterManage/globalParameterManagement/detail', options),
  //渠道业务管理模块
  //业务办理 
  //保存资金权限信息  
  addFundRight: (options = {}) => ajax.put('/fund/addFundRight', options),
  //游戏销售权限
  queryGameRight: (options = {}) => ajax.post('/sales/queryGameRight', options),
  //游戏销售权限更改
  updateGameRight: (options = {}) => ajax.put('/sales/update', options),
  //费率调整
  getCraRateModify: (options = {}) => ajax.post('/channelGameAgsRate/craRateModify', options),
  //费率调整  根据机构id查渠道列表（合作厅）
  getChannelTransfer: (options = {}) => ajax.post('/channelTransfer/pageList', options),

  //费率调整列表
  getGameRateList: (options = {}) => ajax.post('/channelGameAgsRate/pageList', options),



  //资源发放
  channelResProvide: (options = {}) => ajax.post('/channelResProvide/channelResProvide/provide', options),
  //资源发放分页查询
  channelResProvidePageList: (options = {}) => ajax.post('/channelResProvide/channelResProvide/pageList', options),
  //查询库仓库ID列表
  provideWarehouseIdList: (options = {}) => ajax.post('/channelResProvide/warehouseIdList', options),
  //资源采购申请
  channelResPurcApply: (options = {}) => ajax.post('/channelResPurc/channelResPurc/apply', options),
  //资源采购分页查询
  channelResPurcPageList: (options = {}) => ajax.post('/channelResPurc/channelResPurc/pageList', options),
  //资源采购导入模板下载
  resPurcTemplateDown: (options = {}) => ajax.post('/channelResPurc/downloading', options),
  //资源采购导入
  importExcel: (options = {}) => ajax.post('/channelResPurc/channelResPurc/importExcel', options),
  //资源申请
  channelResApply: (options = {}) => ajax.post('/channelResApply/channelRes/apply', options),
  //资源申请分页查询
  channelResApplyPageList: (options = {}) => ajax.post('/channelResApply/channelResApply/pageList', options),
  // 资源调拨
  getChannelAllot: (options = {}) => ajax.post('/channelResAllot/allot', options),
  // 资源调拨分页查询
  getChannelAllotList: (options = {}) => ajax.post('/channelResAllot/pageList', options),
  // 资源挑拨出入库仓库查询
  getWarehouseIdList: (options = {}) => ajax.post('/channelResAllot/warehouseIdList', options),
  // 资源报废
  getChannelScrap: (options = {}) => ajax.post('/channelResScrap/scrap', options),
  // 资源报废分页查询
  getChannelScrapList: (options = {}) => ajax.post('/channelResScrap/scrap', options),
  // 资源报废出入库仓库查询
  getScrapWarehouseIdList: (options = {}) => ajax.post('/channelResScrap/warehouseIdList', options),
  // 资源报废仓库物品查询
  getScrapWarehouseGoodsList: (options = {}) => ajax.post('/channelResScrap/pageWarehouseGoodsInfoList', options),
  // 资源上传附件接口
  getChannelResUpload: (options = {}) => ajax.post('/channelResPurc/fileUpload', options),


  //软件升级管理
  //升级计划列表
  //分页查询接口
  queryUpgradeList: (options = {}) => ajax.post('/upgrade/queryUpgradeList', options),
  //查询发布人
  queryUpgradeUser: (options = {}) => ajax.post('/upgrade/queryUpgradeUser', options),
  //详情
  upgradeListDetail: (options = {}) => ajax.post('/upgrade/detail', options),
  //编辑软件升级信息
  upgradeEdit: (options = {}) => ajax.post('/upgrade/upgradeEdit', options),
  //新增
  addUpgrade: (options = {}) => ajax.post('/upgrade/addUpgrade', options),
  //升级软件信息删除
  upgradeDelete: (options = {}) => ajax.post('/upgrade/upgradeDelete', options),
  //升级软件信息-查询机构
  upgradeIns: (options = {}) => ajax.post('/upgrade/upgradeIns', options),
  //升级软件信息-查询设备
  upgradeEquipment: (options = {}) => ajax.post('/upgrade/upgradeEquipment', options),
  //升级软件信息-查询渠道
  upgradeChannel: (options = {}) => ajax.post('/upgrade/upgradeChannel', options),
  //升级软件信息-关联应用
  relevanceUpgradeList: (options = {}) => ajax.post('/upgrade/upgradeList', options),

  //回滚设置列表
  //分页查询接口
  queryRollbackList: (options = {}) => ajax.post('/rollback/queryRollbackList', options),
  //查询发布人
  queryRollbackUser: (options = {}) => ajax.post('/rollback/queryRollbackUser', options),
  //详情
  rollbackListDetail: (options = {}) => ajax.post('/rollback/detail', options),
  //新增软件升级信息
  addRollback: (options = {}) => ajax.post('/rollback/addRollback', options),
  //编辑
  rollbackEdit: (options = {}) => ajax.post('/rollback/rollbackEdit', options),
  //升级软件信息删除
  rollbackDelete: (options = {}) => ajax.post('/rollback/rollbackDelete', options),
  //软件回滚-升级计划
  queryUserUpgrade: (options = {}) => ajax.post('/rollback/queryUserUpgrade', options),
  //软件回滚信息-查询回滚机构
  rollbackIns: (options = {}) => ajax.post('/rollback/rollbackIns', options),

  //升级软件包管理
  //分页查询
  querySoftPackagePage: (options = {}) => ajax.post('/softwarePackage/querySoftPackagePage', options),
  //详情
  querySoftPackageDetail: (options = {}) => ajax.post('/softwarePackage/detail', options),
  //新增软件升级信息
  addSoftPackage: (options = {}) => ajax.post('/softwarePackage/addSoftPackage', options),
  //升级软件信息删除
  softPackageDelete: (options = {}) => ajax.post('/softwarePackage/softPackageDelete', options),
  //编辑
  softPackageEdit: (options = {}) => ajax.post('/softwarePackage/softPackageEdit', options),
  //查询全部有效的软件包信息
  querySoftPackageList: (options = {}) => ajax.post('/softwarePackage/querySoftPackageList', options),

  //软件包上传
  softPackageUploading: (options = {}) => ajax.upload('/upgradeUpload/uploading', options),


  //渠道终端管理
  // 服务分析
  // 查询下拉物品型号详情
  getQueryGoodsModelInfo: (options = {}) => ajax.post('/goodsModel/queryGoodsModelInfo', options),
  // 设备故障排行
  getQueryDeviceFaultRankingList: (options = {}) => ajax.post('/serviceAnalyze/queryDeviceFaultRankingList', options),
  // 配件故障排行
  getQueryFittingFaultRankingList: (options = {}) => ajax.post('/serviceAnalyze/queryFittingFaultRankingList', options),
  // 维修效率分析
  getQueryServiceEfficiencyAnalyzeList: (options = {}) => ajax.post('/serviceAnalyze/queryServiceEfficiencyAnalyzeList', options),

  // 维修管理
  // 查询维修工单列表
  getQueryServiceWorkOrderList: (options = {}) => ajax.post('/serviceManage/queryServiceWorkOrderList', options),
  // 查询维修工单详情
  getQueryServiceWorkOrderInfo: (options = {}) => ajax.post('/serviceManage/queryServiceWorkOrderInfo', options),
  // 查询置换工单列表
  getQueryReplaceWorkOrderList: (options = {}) => ajax.post('/serviceManage/queryReplaceWorkOrderList', options),
  // 设备管理损耗报表查询 
  getQueryDeviceLossReportList: (options = {}) => ajax.post('/reportStatistical/queryDeviceLossReportList', options),
  // 设备故障报表查询 
  getQueryDeviceFaultReportList: (options = {}) => ajax.post('/reportStatistical/queryDeviceFaultReportList', options),
  // 配件损耗报表查询
  getQueryAccessoriesLossReportList: (options = {}) => ajax.post('/reportStatistical/queryAccessoriesLossReportList', options),
  // 导出设备管理损耗报表
  exportDeviceLossReportList: (options = {}) => ajax.post('/reportStatistical/exportDeviceLossReportList', options),
  // 导出设备故障报表
  exportDeviceFaultReportList: (options = {}) => ajax.post('/reportStatistical/exportDeviceFaultReportList', options),
  // 导出配件损耗报表
  exportAccessoriesLossReportList: (options = {}) => ajax.post('/reportStatistical/exportAccessoriesLossReportList', options),

  // 一键提醒工单
  sendRemindWorkOrder: (options = {}) => ajax.post('/serviceManage/sendRemindWorkOrder', options),


  //配置管理
  //分页查询
  queryFaultTypeInfoList: (options = {}) => ajax.post('/configManage/queryFaultTypeInfoList', options),
  //详情
  queryFaultTypeInfo: (options = {}) => ajax.post('/configManage/queryFaultTypeInfo', options),
  //新增故障
  addFaultTypeInfo: (options = {}) => ajax.post('/configManage/addFaultTypeInfo', options),
  //更新故障类型
  updateFaultTypeInfo: (options = {}) => ajax.post('/configManage/updateFaultTypeInfo', options),
  //查询物品名称信息
  queryGoodsInfo: (options = {}) => ajax.get('/goodsType/queryGoodsInfo', options),
  //查询故障类型列表
  getFaultTypeList: (options = {}) => ajax.get('/configManage/queryFaultTypeList', options),

  //渠道绩效管理

  // 指标设置
  // 考核指标表列表分页查询
  channelExamineTargetList: (options = {}) => ajax.post('/channelKPI/channelExamineTarget/list', options),
  // 考核指标表情查询
  channelExamineTargetDetail: (options = {}) => ajax.post('/channelKPI/channelExamineTarget/detail', options),
  // 考核指标表修改
  channelExamineTargetUpdate: (options = {}) => ajax.post('/channelKPI/channelExamineTarget/update', options),
  // 考核指标表删除
  channelExamineTargetDelete: (options = {}) => ajax.post('/channelKPI/channelExamineTarget/delete', options),
  // 考核指标表批量删除
  channelExamineTargetDeleteBatch: (options = {}) => ajax.post('/channelKPI/channelExamineTarget/deleteBatch', options),
  // 考核指标名称校验已存在 
  channelExamineTargetCheckName: (options = {}) => ajax.post('/channelKPI/channelExamineTarget/checkName', options),

  // 条件因素配置表列表查询
  conditionConfigListAll: (options = {}) => ajax.post('/channelKPI/conditionConfig/listAll', options),
  // 条件因素类型对应配置表条件查询
  conditionTypeConfigListAll: (options = {}) => ajax.post('/channelKPI/conditionTypeConfig/listAll', options),
  // 根据类型查询对应数据字典
  conditionConfigQueryType: (options = {}) => ajax.post('/channelKPI/conditionConfig/queryType', options),
  // 考核指标表新增 
  channelExamineTargetCreate: (options = {}) => ajax.post('/channelKPI/channelExamineTarget/create', options),

  //渠道考核-绩效、等级列表分页查询
  channelExamineList: (options = {}) => ajax.post('/channelKPI/channelExamine/list', options),
  //渠道考核-绩效、等级详情
  channelExamineDetail: (options = {}) => ajax.post('/channelKPI/channelExamine/detail', options),
  //渠道考核-绩效、等级查看指标列表
  channelExamineDetailList: (options = {}) => ajax.post('/channelKPI/channelExamine/detailList', options),
  //渠道考核 - 绩效、等级处理打分
  channelExamineUpdate: (options = {}) => ajax.post('/channelKPI/channelExamine/update', options),
  //渠道考核 - 绩效、等级 导出Excel
  channelExamineExport: (options = {}) => ajax.post('/channelKPI/channelExamine/exportExcel', options),

  //渠道等级配置列表分页查询
  channelGradeInfoList: (options = {}) => ajax.post('/channelKPI/channelGradeInfo/list', options),
  //渠道等级配置详情
  ChannelGradeInfoDetail: (options = {}) => ajax.post('/channelKPI/channelGradeInfo/detail', options),
  //渠道等级配置新增
  addChannelGradeInfo: (options = {}) => ajax.post('/channelKPI/channelGradeInfo/create', options),
  //渠道等级配置删除
  deleteChannelGradeInfo: (options = {}) => ajax.post('/channelKPI/channelGradeInfo/delete', options),
  //渠道等级配置修改
  updateChannelGradeInfo: (options = {}) => ajax.post('/channelKPI/channelGradeInfo/update', options),
  //渠道等级配置名称校验
  levelConfigCheckName: (options = {}) => ajax.post('/channelKPI/channelGradeInfo/checkName', options),

  // 知识库
  // 查询维护知识库列表
  knowledgeBaseList: (options = {}) => ajax.post('/knowledgeBase/queryMaintainKnowledgeBaseList', options),
  // 查询维护知识库详情
  knowledgeBaseInfo: (options = {}) => ajax.post('/knowledgeBase/queryMaintainKnowledgeBaseInfo', options),
  // 更新知识库审核信息
  baseApproval: (options = {}) => ajax.post('/knowledgeBase/updateKnowledgeBaseApproval', options),
  // 查询知识库审核列表
  baseApprovalList: (options = {}) => ajax.post('/knowledgeBase/queryKnowledgeBaseApprovalList', options),
  // 查询知识库审核详情
  baseApprovalInfo: (options = {}) => ajax.post('/knowledgeBase/queryMaintainKnowledgeBaseInfo', options),
  // 删除知识库数据
  deleteBaseApproval: (options = {}) => ajax.post('/knowledgeBase/deleteKnowledgeBaseInfo', options),

  // 在线培训课程管理
  // 培训课程表新增
  trainCourseCreate: (options = {}) => ajax.post('/train/trainCourse/addTrainCourse', options),
  // 查询课程类型列表
  getQueryTrainTypeList: (options = {}) => ajax.post('/train/courseType/queryCourseTypeList', options),
  // 题目下拉列表
  getQueryTrainQuestionList: (options = {}) => ajax.post('/train/trainQuestion/queryTrainQuestionList', options),
  // 培训课程表删除  /train/trainCourse/delete/{id}
  trainCourseDelete: (options = {}) => ajax.post('/train/trainCourse/delete', options),
  // 培训课程表批量删除  /bms/api/train/trainCourse/deleteBatch/{ids}
  trainCourseDeleteBatch: (options = {}) => ajax.post('/train/trainCourse/deleteBatch', options),
  // 培训课程详情查询 /train/trainCourse/detail/{id}
  trainCourseDetail: (options = {}) => ajax.post('/train/trainCourse/detail', options),
  // 培训课程修改详情查询
  queryTrainCourseInfo: (options = {}) => ajax.post('/train/trainCourse/queryTrainCourseInfo', options),
  //课程列表
  queryTrainCourseDownList: (options = {}) => ajax.post('/train/trainCourse/queryTrainCourseDownList', options),
  // 培训课程表列表分页查询
  trainCourseList: (options = {}) => ajax.post('/train/trainCourse/queryTrainCourseList', options),
  // 培训课程表修改 
  trainCourseUpdate: (options = {}) => ajax.post('/train/trainCourse/updateTrainCourse', options),
  // 培训课程上传附件
  uploadTrainCourseFile: (options = {}) => ajax.upload('/train/trainCourse/uploadTrainCourseFile', options),
  // 导出培训课程
  exportTrainCourseList: (options = {}) => ajax.post('/train/trainCourse/exportTrainCourseList', options),
  // 课程 下载

  activityEvaluationDownloading: (options = {}) => ajax.post('/activityEvaluation/downloading', options),

  // 查询课程类型列表
  getQueryTrainTypeInfoList: (options = {}) => ajax.post('/train/courseType/queryCourseTypeInfoList', options),
  // 更新课程类型
  updateTrainTypeInfo: (options = {}) => ajax.post('/train/courseType/updateCourseTypeInfo', options),
  // 导出设备管理损耗报表
  exportTrainTypeInfoList: (options = {}) => ajax.post('/train/courseType/exportCourseTypeInfoList', options),
  // 删除课程类型详情
  deleteTrainTypeInfo: (options = {}) => ajax.post('/train/courseType/deleteCourseTypeInfo', options),
  // 新增课程类型
  addTrainTypeInfo: (options = {}) => ajax.post('/train/trainType/addTrainTypeInfo', options),

  //在线培训
  //培训计划
  //分页查询
  trainOnlineList: (options = {}) => ajax.post('/train/trainOnline/list', options),
  //获取等级列表

  //培训表新增
  trainOnlineCreate: (options = {}) => ajax.post('/train/trainOnline/create', options),
  //培训表删除
  trainOnlineDelect: (options = {}) => ajax.post('/train/trainOnline/delete', options),
  //在线培训表详情查询
  trainOnlineDetails: (options = {}) => ajax.post('/train/trainOnline/detail', options),
  //在线培训表导出
  trainOnlineExportExcel: (options = {}) => ajax.post('/train/trainOnline/exportExcel', options),
  //查询所有角色
  tChannelRoleInfoFindAll: (options = {}) => ajax.post('/tChannelRoleInfo/findAll', options),

  //培训项目分页

  trainItemListAll: (options = {}) => ajax.post('/train/trainItem/list', options),
  //培训项目详情
  trainItemDetails: (options = {}) => ajax.post('/train/trainItem/detail', options),
  //培训项目导出
  trainItemExportExcel: (options = {}) => ajax.post('/train/trainItem/exportExcel', options),
  //培训项目新增
  trainItemCerate: (options = {}) => ajax.post('/train/trainItem/create', options),
  //培训项目列表修改
  trainItemUpdate: (options = {}) => ajax.post('/train/trainItem/update', options),


  // 考核管理
  // 题库管理
  // 查询题库列表
  getQuestionList: (options = {}) => ajax.post('/train/trainQuestion/list', options),
  // 所属课程下拉框数据
  queryTrainCourseDownList: (options = {}) => ajax.post('/train/trainCourse/queryTrainCourseDownList', options),
  // 新建题库
  trainQuestionCreate: (options = {}) => ajax.post('/train/trainQuestion/create', options),
  // 查看题目详情
  trainQuestionDetail: (options = {}) => ajax.get('/train/trainQuestion/detail', options),
  // 修改题目
  trainQuestionUpdate: (options = {}) => ajax.post('train/trainQuestion/update', options),
  // 考试档案
  // 获取考试档案列表
  getTrainExamList: (options = {}) => ajax.post('/train/trainExam/list', options),
  // 获取考试详情表格数据
  gettrainExamDetailList: (options = {}) => ajax.post('/train/trainExamDetail/list', options),
  // 考试详情表（人员考试信息）删除
  trainExamDelete: (options = {}) => ajax.post('/train/trainExam/delete', options),
  // 试卷详情带用户答案
  examUserDetail: (options = {}) => ajax.post('/train/trainExamDetail/examUserDetail', options),
  // 考试档案详情
  examinationArchivesDetail: (options = {}) => ajax.post('/train/trainExamDetail/detail/exam', options),
  // 考试题目详情
  getExamDetail: (options = {}) => ajax.post('/train/trainExamDetail/examDetail', options),
  // 考试档案导出
  trainExamExportExcel: (options = {}) => ajax.post('/train/trainExam/exportExcel', options),

  addTrainTypeInfo: (options = {}) => ajax.post('/train/courseType/addCourseTypeInfo', options),
  // 下载导入题目模板
  exportExamTemplate: (options = {}) => ajax.post('/train/trainQuestion/exportTemplate', options),
  // 导入 excel 题目
  trainQuestionImportExcel: (options = {}) => ajax.post('/train/trainQuestion/importExcel', options),

  //渠道考核项设置
  //考核项分页
  channelAppraisalPage: (options = {}) => ajax.post('/channelKPI/channelAppraisal/page', options),
  //新增
  channelAppraisalAdd: (options = {}) => ajax.post('/channelKPI/channelAppraisal/add', options),
  //查看
  channelAppraisalDetail: (options = {}) => ajax.post('/channelKPI/channelAppraisal/detail', options),
  //修改状态
  channelAppraisalUpdateStatus: (options = {}) => ajax.post('/channelKPI/channelAppraisal/updateStatus', options),
  //删除
  channelAppraisalDelete: (options = {}) => ajax.post('/channelKPI/channelAppraisal/delete', options),
  //修改
  channelAppraisalUpdate: (options = {}) => ajax.post('/channelKPI/channelAppraisal/update', options),

  //渠道考核申诉列表
  //申述列表分页
  channelAppeallist: (options = {}) => ajax.post('/channelKPI/channelAppeal/list', options),
  //详情
  channelAppealDetailList: (options = {}) => ajax.post('/channelKPI/channelAppeal/detailList', options),
  //处理
  channelAppealUpdate: (options = {}) => ajax.post('/channelKPI/channelAppeal/update', options),
  //查看
  channelAppeallistDetail: (options = {}) => ajax.post('/channelKPI/channelAppeal/detail', options),





  // 合作伙伴管理
  // 新增合作伙伴
  createPartner: (options = {}) => ajax.post('/partner/partner/create', options),
  // 编辑合作伙伴
  editPartner: (options = {}) => ajax.post('/partner/partner/update', options),
  // 合作伙伴列表
  getPartnerList: (options = {}) => ajax.post('/partner/partner/list', options),
  // 合作伙伴详情
  getPartnerDetail: (options = {}) => ajax.post('/partner/partner/detail', options),
  // 合作伙伴附件、证件上传
  partnerUpload: (options = {}) => ajax.upload('/train/trainCourse/uploadTrainCourseFile', options),
  // 考核规则列表
  getPartnerRuleList: (options = {}) => ajax.upload('/partner/examineRule/queryExamineRuleInfoList', options),
  // 考核规则详情
  getPartnerRuleDetail: (options = {}) => ajax.upload('/partner/examineRule/queryExamineRuleInfo', options),
  // 新增考核规则
  createPartnerRule: (options = {}) => ajax.upload('/partner/examineRule/addExamineRuleInfo', options),
  // 删除考核规则
  delPartnerRule: (options = {}) => ajax.upload('/partner/examineRule/deleteExamineRule', options),
  // 编辑考核规则
  editPartnerRule: (options = {}) => ajax.upload('/partner/examineRule/updateExamineRuleInfo', options),
  // 新增合作伙伴等级
  createPartnerLevel: (options = {}) => ajax.upload('/partner/partnerGrade/addPartnerGradeInfo', options),
  // 删除合作伙伴等级列表
  delPartnerLevel: (options = {}) => ajax.upload('/partner/partnerGrade/deletePartnerGrade', options),
  // 查询合作伙伴等级详情
  getPartnerLevelDetail: (options = {}) => ajax.upload('/partner/partnerGrade/queryPartnerGradeInfo', options),
  // 查询合作伙伴等级列表
  getPartnerLevelList: (options = {}) => ajax.upload('/partner/partnerGrade/queryPartnerGradeInfoList', options),
  // 编辑合作伙伴等级列表
  editPartnerLevel: (options = {}) => ajax.upload('/partner/partnerGrade/updatePartnerGradeInfo', options),
  // 合作伙伴考核记录
  getAssessmentList: (options = {}) => ajax.post('/partner/examineRule/queryExamineRecordList', options),


}