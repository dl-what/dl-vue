// 业务监控
import ajax from '@/utils/ajax.js';
let baseURL = 'http://10.6.0.203:8086/api'; //10.6.0.203:8086
export default {
  /*
   *@param {json} options: {} || {data: json}
   */
  /* 请务必注释每个接口所属名称 */
  // 例
  getTest: (options = {}) => ajax.post('/test', options),
  // 保存用户信息
  getChartUserInfo: (options = {}) => ajax.post('/auth/user/info', {
    ...options,
    baseURL,
  }),
  // 中央交易数据列表
  getCenterDeal: (options = {}) => ajax.post('/monitor/deal/central', {
    ...options,
    baseURL,
  }),
  // 省级交易数据列表
  getProvinceDeal: (options = {}) => ajax.post('/monitor/deal/province', {
    ...options,
    baseURL,
  }),
  // 市级交易数据列表
  getCityDeal: (options = {}) => ajax.post('/monitor/deal/city', {
    ...options,
    baseURL,
  }),
  //区域交易数据列表
  getAreaDeal: (options = {}) => ajax.post('/monitor/deal/area', {
    ...options,
    baseURL,
  }),
  // 游戏交易数据列表
  getGameDeal: (options = {}) => ajax.post('/monitor/deal/area', {
    ...options,
    baseURL,
  }),
  //导出交易数据
  dealExport: (options = {}) => ajax.post('/export/deal', {
    ...options,
    baseURL,
  }),
  //导出销售厅数据
  hallExport: (options = {}) => ajax.post('/export/hall', {
    ...options,
    baseURL,
  }),
  //导出告警报表
  alarmReportExport: (options = {}) => ajax.post('/export/alarm/report', {
    ...options,
    baseURL,
  }),


  //导出告警监控数据
  alarmExport: (options = {}) => ajax.post('/export/alarm/info', {
    ...options,
    baseURL,
  }),
  //导出游戏日志
  gameLogExport: (options = {}) => ajax.post('/export/game/log', {
    ...options,
    baseURL,
  }),
  //导出业务日志
  betLogExport: (options = {}) => ajax.post('/export/bet/log', {
    ...options,
    baseURL,
  }),
  //导出应用日志
  applyLogExport: (options = {}) => ajax.post('/export/apply/log', {
    ...options,
    baseURL,
  }),

  // 销售厅账户监控列表
  getHallAccount: (options = {}) => ajax.post('/monitor/hall/account', {
    ...options,
    baseURL,
  }),
  // 销售厅设备统计数据监控列表
  getHallEqData: (options = {}) => ajax.post('/monitor/hall/terminal/count', {
    ...options,
    baseURL,
  }),
  // 销售厅设备硬件监控列表
  getHallEqHardware: (options = {}) => ajax.post('/monitor/hall/terminal/hardware', {
    ...options,
    baseURL,
  }),
  // 城市游戏风险指标列表
  getGameRiskList: (options = {}) => ajax.post('/game/risk/list', {
    ...options,
    baseURL,
  }),
  // 城市游戏风险指标详情
  getGameRiskDetail: (options = {}) => ajax.post('/game/risk/detail', {
    ...options,
    baseURL,
  }),
  //城市游戏风险指标删除
  gameRiskDelete: (options = {}) => ajax.post('/game/risk/delete', {
    ...options,
    baseURL,
  }),
  //城市游戏风险指标新增   
  gameRiskInsert: (options = {}) => ajax.post('/game/risk/insert', {
    ...options,
    baseURL,
  }),
  //城市游戏风险指标新增   
  gameRiskUpdate: (options = {}) => ajax.post('/game/risk/update', {
    ...options,
    baseURL,
  }),

  // 奖池风险指标风险指标新增
  pondRiskInsert: (options = {}) => ajax.post('/jackpot/risk/insert', {
    ...options,
    baseURL,
  }),
  //奖池风险指标列表
  getPondRiskList: (options = {}) => ajax.post('/jackpot/risk/list', {
    ...options,
    baseURL,
  }),
  // 奖池风险指标详情
  getPondRiskDetail: (options = {}) => ajax.post('/jackpot/risk/detail', {
    ...options,
    baseURL,
  }),
  //删除奖池风险指标
  pondRiskDelete: (options = {}) => ajax.post('/jackpot/risk/delete', {
    ...options,
    baseURL,
  }),
  //删除奖池风险指标
  pondRiskUpdate: (options = {}) => ajax.post('/jackpot/risk/update', {
    ...options,
    baseURL,
  }),


  //城市风险指标新增
  cityRiskInsert: (options = {}) => ajax.post('/city/risk/insert', {
    ...options,
    baseURL,
  }),


  //金额风险列表
  getMoneyRiskList: (options = {}) => ajax.post('/amount/risk/list', {
    ...options,
    baseURL,
  }),
  //数量风险批量新增
  numberBatchInsert: (options = {}) => ajax.post('/number/risk/batchInsert', {
    ...options,
    baseURL,
  }),
   //游戏风险批量新增
   gameBatchInsert: (options = {}) => ajax.post('/game/risk/batchInsert', {
    ...options,
    baseURL,
  }),
  //金额风险批量新增
  moneyBatchInsert: (options = {}) => ajax.post('/amount/risk/batchInsert', {
    ...options,
    baseURL,
  }),
  //用户风险批量新增
  userBatchInsert: (options = {}) => ajax.post('/user/risk/batchInsert', {
    ...options,
    baseURL,
  }),
   //账户风险批量新增
   accountBatchInsert: (options = {}) => ajax.post('/account/risk/batchInsert', {
    ...options,
    baseURL,
  }),
  //金额风险新增
  cityMoneyRiskInsert: (options = {}) => ajax.post('/amount/risk/insert', {
    ...options,
    baseURL,
  }),
  //金额风险删除
  cityMoneyRiskDelete: (options = {}) => ajax.post('/amount/risk/delete', {
    ...options,
    baseURL,
  }),
  //金额风险详情
  cityMoneyRiskDetail: (options = {}) => ajax.post('/amount/risk/detail', {
    ...options,
    baseURL,
  }),
  //金额风险修改
  cityMoneyRiskUpdate: (options = {}) => ajax.post('/amount/risk/update', {
    ...options,
    baseURL,
  }),

  //数量风险列表
  getNumberRiskList: (options = {}) => ajax.post('/number/risk/list', {
    ...options,
    baseURL,
  }),
  //数量风险新增
  cityNumberRiskInsert: (options = {}) => ajax.post('/number/risk/insert', {
    ...options,
    baseURL,
  }),
  //数量风险删除
  cityNumberRiskDelete: (options = {}) => ajax.post('/number/risk/delete', {
    ...options,
    baseURL,
  }),
  //数量风险详情
  cityNumberRiskDetail: (options = {}) => ajax.post('/number/risk/detail', {
    ...options,
    baseURL,
  }),
  //数量风险修改
  cityNumberRiskUpdate: (options = {}) => ajax.post('/number/risk/update', {
    ...options,
    baseURL,
  }),



  //城市风险指标删除
  cityRiskDelete: (options = {}) => ajax.post('/city/risk/delete', {
    ...options,
    baseURL,
  }),
  //城市风险指标列表
  getCityRiskList: (options = {}) => ajax.post('/city/risk/list', {
    ...options,
    baseURL,
  }),
  //城市风险指标详情
  getCityRiskDetail: (options = {}) => ajax.post('/city/risk/detail', {
    ...options,
    baseURL,
  }),
  //城市风险指标修改
  cityRiskUpdate: (options = {}) => ajax.post('/city/risk/update', {
    ...options,
    baseURL,
  }),

  //告警监控列表
  getWarniingList: (options = {}) => ajax.post('/warn/info/list', {
    ...options,
    baseURL,
  }),

  //销售额Top5列表
  getTopFive: (options = {}) => ajax.post('/screen/monitor/sale/money/top', {
    ...options,
    baseURL,
  }),

  //大厅销量排名列表
  getSaleRank: (options = {}) => ajax.post('/screen/monitor/hall/sale/rank', {
    ...options,
    baseURL,
  }),
  //区域当月和年销量
  getSaleSummarize: (options = {}) => ajax.post('/screen/monitor/sale/summarize', {
    ...options,
    baseURL,
  }),
  //查询大厅数量
  getHallCount: (options = {}) => ajax.post('/screen/monitor/hall/count', {
    ...options,
    baseURL,
  }),
  //查询大厅游戏机情况
  getHallGameCase: (options = {}) => ajax.post('/screen/monitor/hall/game/case', {
    ...options,
    baseURL,
  }),
  //查询游戏市场份额  
  getGameMarket: (options = {}) => ajax.post('/screen/monitor/game/market/share', {
    ...options,
    baseURL,
  }),
  //查询日销量  
  getGameDaySale: (options = {}) => ajax.post('/screen/monitor/day/sale', {
    ...options,
    baseURL,
  }),
  //查询机构
  queryInsTree: (options = {}) => ajax.post('/ins/queryInsTree', {
    ...options,
    baseURL: 'http://10.6.0.203:8081/bms/api'
  }),

  //查询机构名
  queryInsTreeName: (options = {}) => ajax.post('/ins/queryInsInfo', {
    ...options,
    baseURL: 'http://10.6.0.203:8081/bms/api'
  }),
  //查询机构下的用户
  findDeptUserTree: (options = {}) => ajax.post('/dept/findDeptUserTree', {
    ...options,
    baseURL: 'http://10.6.0.203:8081/bms/api'
  }),
  //查询游戏
  getGameLists: (options = {}) => ajax.post('/base/game/list', {
    ...options,
    baseURL,
  }),


  //账户风险列表
  getAccountRiskList: (options = {}) => ajax.post('/account/risk/list', {
    ...options,
    baseURL,
  }),
  //账户风险新增
  cityAccountRiskInsert: (options = {}) => ajax.post('/account/risk/insert', {
    ...options,
    baseURL,
  }),
  //账户风险删除
  cityAccountRiskDelete: (options = {}) => ajax.post('/account/risk/delete', {
    ...options,
    baseURL,
  }),
  //账户风险详情
  cityAccountRiskDetail: (options = {}) => ajax.post('/account/risk/detail', {
    ...options,
    baseURL,
  }),
  //账户风险修改
  cityAccountRiskUpdate: (options = {}) => ajax.post('/account/risk/update', {
    ...options,
    baseURL,
  }),
  //获取销售厅基础信息
  getHallList: (options = {}) => ajax.post('/base/hall/list', {
    ...options,
    baseURL,
  }),
  //告警报表列表
  getReportList: (options = {}) => ajax.post('/warn/info/report/table/list', {
    ...options,
    baseURL,
  }),
  //导出告警报表
  reportExport: (options = {}) => ajax.post('/export/alarm/report/table', {
    ...options,
    baseURL,
  }),
  //导出告警报表
  getApplyLogList: (options = {}) => ajax.post('/apply/log/list', {
    ...options,
    baseURL,
  }),

  //新增大屏销售任务
  saleTaskAdd: (options = {}) => ajax.post('/sale/task/insert', {
    ...options,
    baseURL,
  }),
  //查询设置当年任务数量详情
  saleTaskDetail: (options = {}) => ajax.post('/sale/task/detail', {
    ...options,
    baseURL,
  }),
  //修改当年任务数量
  saleTaskUpdate: (options = {}) => ajax.post('/sale/task/update', {
    ...options,
    baseURL,
  }),
  //游戏日志
  getGameLogList: (options = {}) => ajax.post('/game/log/list', {
    ...options,
    baseURL,
  }),
  //应用日志
  getBetLogList: (options = {}) => ajax.post('/bet/log/list', {
    ...options,
    baseURL,
  }),
  //门禁记录
  getDoorLockList: (options = {}) => ajax.post('/monitor/safe/entrance/record', {
    ...options,
    baseURL,
  }),
  //异常进程
  getExceptionThreadList: (options = {}) => ajax.post('/monitor/safe/exception/thread', {
    ...options,
    baseURL,
  }),
  //安全监控位置记录
  getLocationList: (options = {}) => ajax.post('/monitor/safe/location/record', {
    ...options,
    baseURL,
  }),
  //安全监控位置记录
  getRewardpoolList: (options = {}) => ajax.post('/game/rewardpool/list', {
    ...options,
    baseURL,
  }),
  //奖池风险存在指标校验
  jackpotRiskCheck: (options = {}) => ajax.post('/base/jackpotIndexNameList', {
    ...options,
    baseURL,
  }),
  //数量风险存在指标校验
  numberRiskCheck: (options = {}) => ajax.post('/number/risk/check', {
    ...options,
    baseURL,
  }),
   //金额风险存在指标校验
   amountRiskCheck: (options = {}) => ajax.post('/amount/risk/check', {
    ...options,
    baseURL,
  }),
  //账户风险存在指标校验
  accountRiskCheck: (options = {}) => ajax.post('/account/risk/check', {
    ...options,
    baseURL,
  }),
  //游戏风险存在指标校验
  gameRiskCheck: (options = {}) => ajax.post('/base/gameIndexNameList', {
    ...options,
    baseURL,
  }),
  //用户风险指标
  getUserRisk: (options = {}) => ajax.post('/user/risk/list', {
    ...options,
    baseURL,
  }),
  //删除用户风险指标
  deleteUserRisk: (options = {}) => ajax.post('/user/risk/delete', {
    ...options,
    baseURL,
  }),
  //用户风险存在指标新增
  userRiskInsert: (options = {}) => ajax.post('/user/risk/insert', {
    ...options,
    baseURL,
  }),
   //用户风险存在指标详情
   userRiskDetail: (options = {}) => ajax.post('/user/risk/detail', {
    ...options,
    baseURL,
  }),
   //用户风险存在指标修改
   userRiskUpdate: (options = {}) => ajax.post('/user/risk/update', {
    ...options,
    baseURL,
  }),
  //用户风险存在指标修改
  getInsLevel: (options = {}) => ajax.post('/base/ins/detail', {
    ...options,
    baseURL,
  }),
   //关闭进程
   closeThread: (options = {}) => ajax.post('/monitor/safe/exception/closeThread', {
    ...options,
    baseURL,
  }),
  //告警监控指标处理1保存 2处理
  warnInfoDispose: (options = {}) => ajax.post('/warn/info/update', {
    ...options,
    baseURL,
  }),
  //告警监控指标处理1保存 2处理
  touchWorkflow: (options = {}) => ajax.post('/warn/info/touchWorkflow', {
    ...options,
    baseURL,
  }),
  //告警监控指标处理1保存 2处理
  queryHallInfo: (options = {}) => ajax.post('/screen/monitor/queryHallInfo', {
    ...options,
    baseURL,
  }),
  //交易数据总计
  dealSum: (options = {}) => ajax.post('/monitor/dealSum', {
    ...options,
    baseURL,
  }),
  //销售厅账户总计
  hallAccountSum: (options = {}) => ajax.post('/monitor/hallAccountSum', {
    ...options,
    baseURL,
  }),
  //销售厅设备统计数据总计
  hallTerminalCountSum: (options = {}) => ajax.post('/monitor/hallTerminalCountSum', {
    ...options,
    baseURL,
  }),
  //销售厅设备统计数据总计
  totalSaleDay: (options = {}) => ajax.post('/screen/monitor/day/totalSale', {
    ...options,
    baseURL,
  }),
}