// 系统管理
import ajax from '@/utils/ajax.js'
export default {
  /*
   *@param {json} options: {} || {data: json}
   */
  /* 请务必注释每个接口所属名称 */
  // 例
  //菜单管理页面
  //菜单树查询
  QueryModuleTree: (options = {}) => ajax.post('/module/queryModuleTree', options),
  //菜单详情
  QueryModuleDetail: (options = {}) => ajax.post('/module/queryModuleDetail', options),
  //新增菜单
  SaveModule: (options = {}) => ajax.post('/module/saveModule', options),
  //批量删除
  DeleteModule: (options = {}) => ajax.post('/module/deleteModule', options),
  //更改信息
  UpdateModule: (options = {}) => ajax.post('/module/updateModule', options),

  //组织架构
  //机构树菜单
  QueryInsTree: (options = {}) => ajax.post('/ins/queryInsTree', options),
  //机构树菜单--用户新增
  QueryUserAndInsTree: (options = {}) => ajax.post('/ins/queryUserAndInsTree', options),
  //查询机构详情
  QueryInsInfo: (options = {}) => ajax.post('/ins/queryInsInfo', options),
  //添加机构
  AddInsInfo: (options = {}) => ajax.post('/ins/addInsInfo', options),
  //修改机构信息
  UpdateInsInfo: (options = {}) => ajax.post('/ins/updateInsInfo', options),
  //更新机构状态
  UpdateInsInfoStatus: (options = {}) => ajax.post('ins/updateInsInfoStatus', options),
  //添加部门
  AddDeptInfo: (options = {}) => ajax.post('/dept/addDeptInfo', options),
  //更新部门信息
  UpdateDeptInfo: (options = {}) => ajax.post('dept/updateDeptInfo', options),
  //部门分页查询
  QueryDeptInfoPage: (options = {}) => ajax.post('/dept/queryDeptInfoPage', options),
  //区域查询
  FindRegionList: (options = {}) => ajax.post('/region/findRegionList', options),
  //部门树查询
  FindDeptTreeRoots: (options = {}) => ajax.post('/dept/findDeptTreeRoots', options),
  //负责人电话
  QueryAllUserInfo: (options = {}) => ajax.post('vlt/user/queryAllUserInfo', options),
  //机构升极
  insUpgrade: (options = {}) => ajax.post('/ins/insUpgrade', options),


  //角色管理
  //角色信息分页查询接口
  QueryRoleInfoPage: (options = {}) => ajax.post('/role/queryRoleInfoPage', options),
  //查询全部有效角色接口
  QueryAllRole: (options = {}) => ajax.post('/role/queryAllRole', options),
  //查询角色创建人
  queryRoleUser: (options = {}) => ajax.post('/role/queryRoleUser', options),
  //查询角色详情
  QueryRoleInfoDetail: (options = {}) => ajax.post(`/role/queryRoleInfoDetail`, options),
  //保存角色信息
  SaveRoleInfo: (options = {}) => ajax.post('/role/saveRoleInfo', options),
  //修改角色信息
  UpdateRoleInfo: (options = {}) => ajax.post('/role/updateRoleInfo', options),
  //更改角色状态
  UpdateRoleStatusInfo: (options = {}) => ajax.post('/role/updateRoleStatusInfo', options),

  //用户管理
  //用户新增
  userRegist: (options = {}) => ajax.post('/vlt/user/regist', options),
  //用户解锁
  userUnLock: (options = {}) => ajax.post('/vlt/user/unlock/errLoginCount', options),
  //用户搜索
  userPage: (options = {}) => ajax.post('/vlt/user/query/page', options),
  //用户详情
  getUserDestils: (options = {}) => ajax.get("/vlt/user/query", options),
  //技术运营平台登录接口
  getMonitorLogin: (options = {}) => ajax.post("/monitorLogin", options),
  
  //上传接口
  uploadFile: (options = {}) => ajax.post("/user/uploading", options),
  //密码重置
  restPassWord: (options = {}) => ajax.post("/vlt/user/resetPass", options),
  //所有用户信息
  getUserAll: (options = {}) => ajax.post('/vlt/user/getAllUser', options),
  //用户状态
  userStatus: (options = {}) => ajax.post('/vlt/user/status', options),
  //用户删除
  delByIds: (options = {}) => ajax.post('/vlt/user/delByIds', options),
  //用户编缉
  userEdit: (options = {}) => ajax.post('/vlt/user/edit', options),




  //数据字典
  //字典数据保存接口
  add: (options = {}) => ajax.post('/dictData/add', options),
  //获取全部数据
  dictDataPage: (options = {}) => ajax.post('/dictData/page', options),
  //数据字典导出接口
  exportDictDataList: (options = {}) => ajax.post('/dictData/export', options),
  //状态接口
  status: (options = {}) => ajax.post('/dictData/status', options),
  //编辑接口
  edit: (options = {}) => ajax.post('/dictData/edit', options),
  //删除接口
  deleteShow: (options = {}) => ajax.post('/dictData/delete', options),
  //编辑通过id获取数据接口
  // findById: (options = {}) => ajax.get('/dictData/findById/{id}', options),
  // //数据字典启用接口
  // enable: (options = {}) => ajax.post('/dictData/enable/{id}', options),
  // //数据字典禁用接口
  // disable: (options = {}) => ajax.post('/dictData/disable/{id}', options),
  // //通过keyCode查询
  // find: (options = {}) => ajax.get('/dictData/find/{keyCode}', options),
  // //数据字典条件搜索
  // getByCondition: (options = {}) => ajax.post('/dictData/getByCondition', options),



  //系统设置
  //系统参数设置
  configSet: (options = {}) => ajax.post('/sysConfig/config/set', options),
  //参看参数设置接口
  configCat: (options = {}) => ajax.post('/sysConfig/config/cat', options),
  //系统主题参数设置
  configTheme: (options = {}) => ajax.post('/sysConfig/configTheme', options),
  // //系统邮件参数设置
  // email: (options = {}) => ajax.post('/sysConfig/email/set', options),
  // 周参数设置
  // 获取周参数设置分页列表
  weekQueryPage: (options = {}) => ajax.post('/week/queryPage', options),
  // 新增周参数
  addWeekParam: (options = {}) => ajax.post('/week/add', options),
  // 周参数详情查询
  weekParamDetail: (options = {}) => ajax.post('/week/detail', options),
  // 修改周参数
  updateWeekParam: (options = {}) => ajax.post('/week/update', options),
  // 获取天气信息设置分页列表
  queryWeatherList: (options = {}) => ajax.post('/weather/queryWeatherFestivalPage', options),
  // 新增天气信息设置
  addWeatherEvent: (options = {}) => ajax.post('/weather/addWeatherFestivalEvent', options),
  // 获取天气信息详情
  getWeatherDetail: (options = {}) => ajax.post('/weather/detail', options),
  // 删除天气信息设置
  deleteWeather: (options = {}) => ajax.post('/weather/delete', options),
  // 修改天气信息设置
  updateWeatherSet: (options = {}) => ajax.post('/weather/updateWeatherFestivalEvent', options),

  //假日参数
  //假日分页接口
  queryHolInfoPage: (options = {}) => ajax.post('/hol/queryHolInfoPage', options),
  //获取假日名称列表数据
  getHolidayList: (options = {}) => ajax.post('/hol/queryHolNameAll', options),
  //添加假日接口
  addHolInfo: (options = {}) => ajax.post('/hol/addHolInfo', options),
  //编辑
  holEdit: (options = {}) => ajax.post('/hol/holEdit', options),
  //修改假日状态接口
  updateHolStatus: (options = {}) => ajax.post('/hol/updateHolStatus', options),

  // 用户设置
  updateUserPassword: (options = {}) => ajax.post('/setUserInfo', options),

  // 流程管理
  // 新增流程类别
  addProcessClass: (options = {}) => ajax.post('/act/category/add', options),
  // 获取流程类别树
  getProcessTree: (options = {}) => ajax.post('/act/category/query', options),
  // 获取当前树节点详情
  getProcessTreeDetail: (options = {}) => ajax.post('/act/category/detail', options),
  // 编辑流程类别
  editProcessClass: (options = {}) => ajax.post('/act/category/edit', options),
  // 删除流程类别
  deleteProcessClass: (options = {}) => ajax.post('/act/category/delete', options),
  // 业务配置
  // 业务列表查询
  getBusinessList: (options = {}) => ajax.post('/act/business/config/page', options),
  // 新增业务配置
  addBusinessConf: (options = {}) => ajax.post('/act/business/config/add', options),
  // 编辑业务配置
  editBusinessConf: (options = {}) => ajax.post('/act/business/config/edit', options),
  // 删除业务配置
  deleteBusinessConf: (options = {}) => ajax.post('/act/business/config/delete', options),
  // 保存流程
  saveProcess: (options = {}) => ajax.post('/act/process/deploy', options),
  // 获取流程id
  getProcessKey: (options = {}) => ajax.post('/act/get/process_key', options),
  // 获取流程列表
  getProcessList: (options = {}) => ajax.post('/act/process/page', options),
  // 获取流程详情
  getProcessDetail: (options = {}) => ajax.post('/act/process/detail', options),
  // 流程处理选择人员
  getAssigneeUserList: (options = {}) => ajax.post('/dept/findDeptUserTree', options),
  // 更改流程状态
  setProcessStatus: (options = {}) => ajax.post('/act/process/updateStatus', options),


  // 终端事件控制
  // 终端事件控制发送
  sendTerminalExecute: (options = {}) => ajax.post('/terminalExecute/sendTerminalExecute', options),
  // 终端事件控制列表
  queryTerminalExecuteByPage: (options = {}) => ajax.post('/terminalExecute/queryTerminalExecuteByPage', options),
  // 终端事件控制导出Excel
  terminalExportExcel: (options = {}) => ajax.post('/terminalExecute/exportExcel', options),

  //系统日志
  //系统操作日志导出
  systemOperateLogExportExcel: (options = {}) => ajax.post('/systemOperateLog/systemOperateLogExportExcel', options),
  //日志分页查询
  systemOperateLogPage: (options = {}) => ajax.post('/systemOperateLog/systemOperateLogPage', options),

  //系统开关
  //分页
  sysSwitchPage: (options = {}) => ajax.post('/sysSwitch/page', options),
  //下拉
  sysSwitchNameList: (options = {}) => ajax.post('/sysSwitch/nameList', options),
  //更改状态
  sysSwitchStatusUpdate: (options = {}) => ajax.post('/sysSwitch/statusUpdate', options),
}