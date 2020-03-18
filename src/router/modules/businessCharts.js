// 业务监控系统路由配置
// 中心监控
const centerWatch = () => import('@/views/businessCharts/screenWatch/centerWatch')
//区域交易数据
const areaDeal = () => import('@/views/businessCharts/dealData/areaDeal')
//销售厅账户监控
const accountWatch = () => import('@/views/businessCharts/saleshallAccountWatch')
//销售厅设备数据监控
const equipmentDataWatch = () => import('@/views/businessCharts/saleshallEquipmentWatch/equipmentDataWatch')
//销售厅设备硬件监控
const equipmentHardwareWatch = () => import('@/views/businessCharts/saleshallEquipmentWatch/equipmentHardwareWatch')
//销售厅设备安全监控
const equipmentSafeWatch = () => import('@/views/businessCharts/saleshallEquipmentWatch/equipmentSafeWatch')

//告警监控
const warningWatch = () => import('@/views/businessCharts/warningWatch')
//报表管理
const warningReport = () => import('@/views/businessCharts/warningReport')

//奖池风险
const pondRisk = () => import('@/views/businessCharts/warningRule/pondRisk')
//城市游戏风险
const cityGameRisk = () => import('@/views/businessCharts/warningRule/cityGameRisk')
//用户风险
const userRisk = () => import('@/views/businessCharts/warningRule/userRisk')
//告警监控详情
const warningWatchDetail = () => import('@/views/businessCharts/warningWatch/modules/warningWatchDetail')
//告警监控编辑
const warningWatchEdit = () => import('@/views/businessCharts/warningWatch/modules/warningWatchEdit')

//奖池风险指标新增
const pondRiskAdd = () => import('@/views/businessCharts/warningRule/pondRiskAdd')

//城市游戏风险指标新增
const gameRiskAdd = () => import('@/views/businessCharts/warningRule/gameRiskAdd')
//城市游戏风险指标详情
const gameRiskDetail = () => import('@/views/businessCharts/warningRule/gameRiskDetail')
//奖池风险指标详情
const pondRiskDetail = () => import('@/views/businessCharts/warningRule/pondRiskDetail')
//城市游戏风险指标编辑
const gameRiskEdit = () => import('@/views/businessCharts/warningRule/gameRiskEdit')
//奖池风险指标编辑
const pondRiskEdit = () => import('@/views/businessCharts/warningRule/pondRiskEdit')
//用户风险指标新增
const userRiskAdd = () => import('@/views/businessCharts/warningRule/userRiskAdd')
//用户风险指标编辑
const userRiskEdit = () => import('@/views/businessCharts/warningRule/userRiskEdit')
//用户风险指标详情
const userRiskDetail = () => import('@/views/businessCharts/warningRule/userRiskDetail')
//城市数量风险指标
const cityNumberRisk=() => import('@/views/businessCharts/warningRule/cityNumberRisk')
//城市金额类风险指标
const cityMoneyRisk=() => import('@/views/businessCharts/warningRule/cityMoneyRisk')
//城市账户类风险指标
const cityAccountRisk=() => import('@/views/businessCharts/warningRule/cityAccountRisk')
//城市账户类风险指标
const cityAccountRiskAdd=() => import('@/views/businessCharts/warningRule/cityAccountRiskAdd')
//城市账户类风险指标
const cityAccountRiskEdit=() => import('@/views/businessCharts/warningRule/cityAccountRiskEdit')
//城市账户类风险指标
const cityAccountRiskDetail=() => import('@/views/businessCharts/warningRule/cityAccountRiskDetail')
//城市金额类风险指标新增
const cityMoneyRiskAdd=() => import('@/views/businessCharts/warningRule/cityMoneyRiskAdd')
//城市金额类风险指标修改
const cityMoneyRiskEdit=() => import('@/views/businessCharts/warningRule/cityMoneyRiskEdit')
//城市金额类风险指标修改
const cityMoneyRiskDetail=() => import('@/views/businessCharts/warningRule/cityMoneyRiskDetail')
//数量风险指标新增
const cityNumberRiskAdd=() => import('@/views/businessCharts/warningRule/cityNumberRiskAdd')
//数量风险指标编辑
const cityNumberRiskEdit=() => import('@/views/businessCharts/warningRule/cityNumberRiskEdit')
//数量风险指标详情
const cityNumberRiskDetail=() => import('@/views/businessCharts/warningRule/cityNumberRiskDetail')
//参数设置parameterSetting
const parameterSetting=() => import('@/views/businessCharts/systemManage/parameterSetting')
//应用日志
const applyingLog=() => import('@/views/businessCharts/systemManage/applyingLog')
//业务日志
// const businessLog=() => import('@/views/businessCharts/systemManage/businessLog')
//游戏日志
const gameLog=() => import('@/views/businessCharts/systemManage/gameLog')
//游戏日志
const workflow=() => import('@/views/businessCharts/warningWatch/workflow')

export default [
  {
    path: 'businessCharts/centerWatch',
    name: 'centerWatch',
    meta: {
      title: '大屏监控',
    },
    component: centerWatch
  },
  {
    path: 'businessCharts/areaDeal',
    name: 'areaDeal',
    meta: {
      title: '交易数据监控',
    },
    component: areaDeal
  },
  {
    path: 'businessCharts/accountWatch',
    name: 'accountWatch',
    meta: {
      title: '销售厅账户监控',
    },
    component: accountWatch
  },
  {
    path: 'businessCharts/equipmentDataWatch',
    name: 'equipmentDataWatch',
    meta: {
      title: '销售厅设备数据监控',
    },
    component: equipmentDataWatch
  }, {
    path: 'businessCharts/equipmentHardwareWatch',
    name: 'equipmentHardwareWatch',
    meta: {
      title: '销售厅设备硬件监控',
    },
    component: equipmentHardwareWatch
  }, {
    path: 'businessCharts/equipmentSafeWatch',
    name: 'equipmentSafeWatch',
    meta: {
      title: '销售厅设备安全监控',
    },
    component: equipmentSafeWatch
  },
  {
    path: 'businessCharts/warningReport',
    name: 'warningReport',
    meta: {
      title: '告警报表',
    },
    component: warningReport
  },
  {
    path: 'businessCharts/warningWatch',
    name: 'warningWatch',
    meta: {
      title: '告警监控',
    },
    component: warningWatch
  },
  //workflow
  {
    path: 'businessCharts/workflow',
    name: 'workflow',
    meta: {
      title: '告警监控',
    },
    component: workflow
  },
  {
    path: 'businessCharts/pondRisk',
    name: 'pondRisk',
    meta: {
      title: '奖池风险指标',
    },
    component: pondRisk
  },

  {
    path: 'businessCharts/cityGameRisk',
    name: 'cityGameRisk',
    meta: {
      title: '游戏风险指标',
    },
    component: cityGameRisk
  },
  {
    path: 'businessCharts/userRisk',
    name: 'userRisk',
    meta: {
      title: '用户风险指标',
    },
    component: userRisk
  },
  {
    path: 'businessCharts/warningWatchDetail',
    name: 'warningWatchDetail',
    meta: {
      title: '告警监控详情',
      parentName:'warningWatch'
    },
    component: warningWatchDetail
  },
  {
    path: 'businessCharts/warningWatchEdit',
    name: 'warningWatchEdit',
    meta: {
      title: '告警监控编辑',
      parentName:'warningWatch'
    },
    component: warningWatchEdit
  },
  {
    path: 'businessCharts/pondRiskAdd',
    name: 'pondRiskAdd',
    meta: {
      title: '奖池风险指标新增',
      parentName:'pondRisk'
    },
    component: pondRiskAdd
  },
  {
    path: 'businessCharts/gameRiskAdd',
    name: 'gameRiskAdd',
    meta: {
      title: '游戏风险指标新增',
      parentName:'cityGameRisk'
    },
    component: gameRiskAdd
  }, {
    path: 'businessCharts/gameRiskDetail',
    name: 'gameRiskDetail',
    meta: {
      title: '游戏风险指标详情',
      parentName:'cityGameRisk'
    },
    component: gameRiskDetail
  },{
    path: 'businessCharts/pondRiskDetail',
    name: 'pondRiskDetail',
    meta: {
      title: '奖池风险指标详情',
      parentName:'pondRisk'
    },
    component: pondRiskDetail
  },
  {
    path: 'businessCharts/gameRiskEdit',
    name: 'gameRiskEdit',
    meta: {
      title: '奖池风险指标编辑',
      parentName:'cityGameRisk'
    },
    component: gameRiskEdit
  },
  {
    path: 'businessCharts/pondRiskEdit',
    name: 'pondRiskEdit',
    meta: {
      title: '奖池风险指标编辑',
      parentName:'pondRisk'
    },
    component: pondRiskEdit
  },
  {
    path: 'businessCharts/userRiskAdd',
    name: 'userRiskAdd',
    meta: {
      title: '用户风险指标新增',
      parentName:'userRisk'
    },
    component: userRiskAdd
  },
  {
    path: 'businessCharts/userRiskDetail',
    name: 'userRiskDetail',
    meta: {
      title: '用户风险指标详情',
      parentName:'userRisk'
    },
    component: userRiskDetail
  },
  {
    path: 'businessCharts/userRiskEdit',
    name: 'userRiskEdit',
    meta: {
      title: '用户风险指标编辑',
      parentName:'userRisk'
    },
    component: userRiskEdit
  },
  {
    path: 'businessCharts/cityNumberRisk',
    name: 'cityNumberRisk',
    meta: {
      title: '数量风险指标',
    },
    component: cityNumberRisk
  },
  {
    path: 'businessCharts/cityMoneyRisk',
    name: 'cityMoneyRisk',
    meta: {
      title: '金额风险指标',
    },
    component: cityMoneyRisk
  },
  {
    path: 'businessCharts/cityAccountRisk',
    name: 'cityAccountRisk',
    meta: {
      title: '账户类风险指标',
    },
    component: cityAccountRisk
  },
  {
    path: 'businessCharts/cityAccountRiskAdd',
    name: 'cityAccountRiskAdd',
    meta: {
      parentName:'cityAccountRisk',
      title: '账户风险指标新增',
    },
    component: cityAccountRiskAdd
  },
  {
    path: 'businessCharts/cityAccountRiskEdit',
    name: 'cityAccountRiskEdit',
    meta: {
      parentName:'cityAccountRisk',
      title: '账户风险指标修改',
    },
    component: cityAccountRiskEdit
  },
  {
    path: 'businessCharts/cityAccountRiskDetail',
    name: 'cityAccountRiskDetail',
    meta: {
      parentName:'cityAccountRisk',
      title: '账户风险指标详情',
    },
    component: cityAccountRiskDetail
  },
  {
    path: 'businessCharts/cityMoneyRiskAdd',
    name: 'cityMoneyRiskAdd',
    meta: {
      parentName:'cityMoneyRisk',
      title: '金额风险指标新增',
    },
    component: cityMoneyRiskAdd
  },
  {
    path: 'businessCharts/cityMoneyRiskEdit',
    name: 'cityMoneyRiskEdit',
    meta: {
      parentName:'cityMoneyRisk',
      title: '金额风险指标修改',
    },
    component: cityMoneyRiskEdit
  },
  {
    path: 'businessCharts/cityMoneyRiskDetail',
    name: 'cityMoneyRiskDetail',
    meta: {
      parentName:'cityMoneyRisk',
      title: '金额风险指标详情',
    },
    component: cityMoneyRiskDetail
  },
  {
    path: 'businessCharts/cityNumberRiskAdd',
    name: 'cityNumberRiskAdd',
    meta: {
      parentName:'cityNumberRisk',
      title: '数量风险指标新增',
    },
    component: cityNumberRiskAdd
  },
  {
    path: 'businessCharts/cityNumberRiskEdit',
    name: 'cityNumberRiskEdit',
    meta: {
      parentName:'cityNumberRisk',
      title: '数量风险指标修改',
    },
    component: cityNumberRiskEdit
  },
  {
    path: 'businessCharts/cityNumberRiskDetail',
    name: 'cityNumberRiskDetail',
    meta: {
      parentName:'cityNumberRisk',
      title: '数量风险指标详情',
    },
    component: cityNumberRiskDetail
  },
  {
    path: 'businessCharts/parameterSetting',
    name: 'parameterSetting',
    meta: {
      title: '参数设置',
    },
    component: parameterSetting
  },
  {
    path: 'businessCharts/applyingLog',
    name: 'applyingLog',
    meta: {
      title: '应用日志',
    },
    component: applyingLog
  },
  {
    path: 'businessCharts/gameLog',
    name: 'gameLog',
    meta: {
      title: '游戏日志',
    },
    component: gameLog
  },
  

]