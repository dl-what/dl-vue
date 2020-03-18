// 导入所有模块路由
import businessManage from './businessManage'
import businessOperation from './businessOperation'
import businessCharts from './businessCharts'
import systemManage from './systemManage'
import serviceSystem from './serviceSystem'
import externalSupervision from "./externalSupervision"

// import organization from './organization' //组织架构
// import userList from './userList' //用户管理列表
// import roleList from './roleList' //角色管理列表
// import menuManagement from './menuManagement'

export default [
  ...businessManage,
  ...businessOperation,
  ...businessCharts,
  ...systemManage,
  ...serviceSystem,
  ...externalSupervision,
];

