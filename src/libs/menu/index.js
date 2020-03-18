// 左侧导航mock数据
import businessManage from './businessManage'
import businessOperation from './businessOperation'
import businessCharts from './businessCharts'
import systemManage from './systemManage'
import serviceSystem from './serviceSystem'
import externalSupervision from "./externalSupervision"

export default {
  
 "code": "0",
  /*
      @id: 1=>业务管理，2=>业务运营，3=>业务监控 4=>系统管理
    */
  // 业务管理系统
  '1': businessManage,
  // 业务运营系统
  '2': businessOperation,
  // 业务监控系统
  '3': businessCharts,
  // 系统管理系统
  '4': systemManage,
  // 客服管理系统
  '5': serviceSystem,
  //外部监管
  '7':externalSupervision
  
  // 大数据分析系统

  // 外部监控系统

  // 技术运行监控系统

  // 业务报表系统

  

}