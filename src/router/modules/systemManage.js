// 系统管理系统路由配置
// 基本设置
const baseSetting = () => import('@/views/systemManage/settings/baseSetting')
// 邮件设置
const emailSetting = () => import('@/views/systemManage/settings/emailSetting')
//参数设置
const paramSetting = () => import('@/views/systemManage/settings/paramSetting')
//短信设置
const noteSetting = () => import('@/views/systemManage/settings/noteSetting')
// 周参数设置
const weekParamSetting = () => import('@/views/systemManage/settings/weekParamSetting')
// 新增周参数
const weekParamCreate = () => import('@/views/systemManage/settings/weekParamCreate')
// 编辑周参数设置
const weekParamEdit = () => import('@/views/systemManage/settings/weekParamEdit')
// 天气设置
const weatherSetting = () => import('@/views/systemManage/settings/weatherSetting')
// 新增天气信息设置
const weatherSetCreate = () => import('@/views/systemManage/settings/weatherSetCreate')
// 天气信息参数详情
const weatherParamDetail = () => import('@/views/systemManage/settings/weatherParamDetail')
// 编辑天气参数设置
const weatherParamEdit = () => import('@/views/systemManage/settings/weatherParamEdit')

//数据字典
const dataDictionary = () => import('@/views/systemManage/dataDictionary/dataDictionary')
//数据字典编辑
const dataDictionaryEdit = () => import('@/views/systemManage/dataDictionary/dataDictionaryEdit')

//业务流程
// 表单管理
const formManage = () => import('@/views/systemManage/businessProcess/formManage')
// 新建表单、编辑表单
const formCompile = () => import('@/views/systemManage/businessProcess/formCompile')
// 表单预览/详情
const formPreview = () => import('@/views/systemManage/businessProcess/formPreview')
//流程设置
const processSet = () => import('@/views/systemManage/businessProcess/processSet')
// 流程分类
const processClassify = () => import('@/views/systemManage/businessProcess/processClassify')
// 新建流程
const addProcess = () => import('@/views/bpmn/addProcess')
// 编辑流程
const editProcess = () => import('@/views/bpmn/editProcess')
// 业务配置
const businessConf = () => import('@/views/systemManage/businessProcess/businessConf')

//用户列表
const userList = () => import('@/views/systemManage/userControl/userList')
// 用户设置
const userSetting = () => import('@/views/systemManage/userControl/userSetting')
//用户详情
const userDestails = () => import('@/views/systemManage/userControl/userDetails')
//用户编缉
const userInformed = () => import('@/views/systemManage/userControl/userInformed')
//角色管理
const roleList = () => import('@/views/systemManage/roleManagement/roleList')
//角色编缉
const roleOfEditorial = () => import('@/views/systemManage/roleManagement/roleOfEditorial')
//角色详情
const roleDetail = () => import('@/views/systemManage/roleManagement/roleDetail')
//组织架构
const organizationChild = () => import('@/views/systemManage/organization/organization')
//菜单管理

// const menuManageMent = () => import('@/views/systemManage/menuManageMent/menuManageMent')
//测试用
const menuManageMent = () => import('@/views/systemManage/menuManageMent/menuManageMent')

//系统日志
const systemOperationLog = () => import('@/views/systemManage/systemLog/systemLog')
//系统开关
const systemSwitch = () => import('@/views/systemManage/systemSwitch/systemSwitch')
//假日参数管理
const holidayParameters = () => import('@/views/systemManage/holidayParameters/holidayParameters')
//假日增加
const holidayParametersAdd = () => import('@/views/systemManage/holidayParameters/holidayParametersAdd')
//终端事件管理
const TerminalEventControl = () => import('@/views/systemManage/TerminalEventManagement/TerminalEventManagement')
//终端事件日志
const TerminalEventLog = () => import('@/views/systemManage/TerminalEventManagement/TerminalEventLog')

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
    path: 'systemManage/baseSetting',
    name: 'baseSetting',
    meta: {
      title: '基本设置',
    },
    component: baseSetting

  },
  {
    path: 'systemManage/emailSetting',
    name: 'emailSetting',
    meta: {
      title: '邮件设置',
    },
    component: emailSetting
  },
  {
    path: 'systemManage/paramSetting',
    name: 'paramSetting',
    meta: {
      parentName: "paramSetting",
      title: '参数设置',
    },
    component: paramSetting
  },
  {
    path: 'systemManage/noteSetting',
    name: 'noteSetting',
    meta: {
      title: '短信设置',
    },
    component: noteSetting
  },
  {
    path: 'systemManage/weekParamSetting',
    name: 'weekParamSetting',
    meta: {
      title: '周参数设置',
    },
    component: weekParamSetting
  },
  {
    path: 'systemManage/weekParamCreate',
    name: 'weekParamCreate',
    meta: {
      parentName: "weekParamSetting",
      title: '新增周参数',
    },
    component: weekParamCreate
  },
  {
    path: 'systemManage/weekParamEdit',
    name: 'weekParamEdit',
    meta: {
      parentName: "weekParamSetting",
      title: '新增周参数',
    },
    component: weekParamEdit
  },
  {
    path: 'systemManage/weatherSetting',
    name: 'weatherSetting',
    meta: {
      title: '天气设置',
    },
    component: weatherSetting
  },
  {
    path: 'systemManage/weatherSetCreate',
    name: 'weatherSetCreate',
    meta: {
      parentName: "weatherSetting",
      title: '天气参数新增',
    },
    component: weatherSetCreate
  },
  {
    path: 'systemManage/weatherParamDetail',
    name: 'weatherParamDetail',
    meta: {
      parentName: "weatherSetting",
      title: '天气参数详情',
    },
    component: weatherParamDetail
  },
  {
    path: 'systemManage/weatherParamEdit',
    name: 'weatherParamEdit',
    meta: {
      parentName: "weatherSetting",
      title: '天气参数编辑',
    },
    component: weatherParamEdit
  },
  {
    path: 'systemManage/formManage',
    name: 'formManage',
    meta: {
      title: '表单管理',
    },
    component: formManage
  },
  {
    path: 'systemManage/formManage/addForm',
    name: 'addForm',
    meta: {
      parentName: "formManage",
      title: '新建表单',
    },
    component: formCompile
  },
  {
    path: 'systemManage/formManage/editForm',
    name: 'editForm',
    meta: {
      parentName: "formManage",
      title: '编辑表单',
    },
    component: formCompile
  },
  {
    path: 'systemManage/formManage/formPreview',
    name: 'formPreview',
    meta: {
      parentName: "formManage",
      title: '表单详情',
    },
    component: formPreview
  },
  {
    path: 'systemManage/processSet',
    name: 'processSet',
    meta: {
      title: '流程设置',
    },
    component: processSet
  },
  {
    path: 'systemManage/addProcess',
    name: 'addProcess',
    meta: {
      keepAlive: true,
      parentName: 'processSet',
      title: '新建流程',
    },
    component: addProcess
  },
  {
    path: 'systemManage/editProcess',
    name: 'editProcess',
    meta: {
      keepAlive: true,
      parentName: 'processSet',
      title: '编辑流程',
    },
    component: editProcess
  },
  {
    path: 'systemManage/businessConf',
    name: 'businessConf',
    meta: {
      title: '业务配置',
    },
    component: businessConf
  },
  {
    path: 'systemManage/processClassify',
    name: 'processClassify',
    meta: {
      title: '流程分类',
    },
    component: processClassify
  },
  {
    path: 'systemManage/dataDictionary',
    name: 'dataDictionary',
    meta: {
      title: '数据字典',
    },
    component: dataDictionary
  },
  {
    path: 'systemManage/dataDictionary/dataDictionaryEdit',
    name: 'dataDictionaryEdit',
    meta: {
      parentName: "dataDictionary",
      title: '数据字典编辑',
    },
    component: dataDictionaryEdit
  },
  {
    path: 'systemManage/userList',
    name: 'userList',
    meta: {
      title: '用户列表',
    },
    component: userList,
  },
  {
    path: 'systemManage/userSetting',
    name: 'userSetting',
    meta: {
      title: '用户设置',
    },
    component: userSetting,
  },
  {
    path: 'systemManage/userList/userDestails',
    name: 'userDestails',
    meta: {
      parentName: "userList",
      title: '用户信息',
    },
    component: userDestails,

  },
  {

    path: 'systemManage/userList/userInformed',
    name: 'userInformed',
    meta: {
      parentName: "userList",
      title: '用户新建',
    },
    component: userInformed,

  },
  {

    path: 'systemManage/userList/userInformedEdit',
    name: 'userInformedEdit',
    meta: {
      parentName: "userList",
      title: '用户编辑',
    },
    component: userInformed,

  },
  {
    path: 'systemManage/roleList/',
    name: 'roleList',
    meta: {
      title: '角色列表',
    },
    component: roleList,
    props: true
  },
  {
    path: 'systemManage/roleList/roleOfEditorial',
    name: 'roleOfEditorial',
    meta: {
      parentName: "roleList",
      title: '角色新建',
    },
    component: roleOfEditorial
  },
  {
    path: 'systemManage/roleList/roleOfEditorialEdit',
    name: 'roleOfEditorialEdit',
    meta: {
      parentName: "roleList",
      title: '角色编辑',
    },
    component: roleOfEditorial
  },
  {
    path: 'systemManage/roleList/roleDetail',
    name: 'roleDetail',
    meta: {
      title: '角色详情',
      parentName: "roleList",
    },
    component: roleDetail
  },
  {
    path: 'systemManage/organizationChild',
    name: 'organizationChild',
    meta: {
      title: '组织架构',
    },
    component: organizationChild
  },
  {
    path: 'systemManage/menuManageMent',
    name: 'menuManageMent',
    meta: {
      title: '菜单管理',
    },
    component: menuManageMent
  },
  {
    path: 'systemManage/systemOperationLog',
    name: 'systemOperationLog',
    meta: {
      title: '系统操作日志',
    },
    component: systemOperationLog
  },
  {
    path: 'systemManage/systemSwitch',
    name: 'systemSwitch',
    meta: {
      title: '系统开关',
    },
    component: systemSwitch
  },
  {
    path: 'systemManage/holidayParameters',
    name: 'holidayParameters',
    meta: {
      title: '假日参数管理',
    },
    component: holidayParameters
  },
  {
    path: 'systemManage/holidayParameters/holidayParametersAdd',
    name: 'holidayParametersAdd',
    meta: {
      parentName: "holidayParameters",
      title: '假日参数新增',
    },
    component: holidayParametersAdd
  },
  {
    path: 'systemManage/holidayParameters/holidayParametersEdit',
    name: 'holidayParametersEdit',
    meta: {
      parentName: "holidayParameters",
      title: '假日参数编辑',
    },

    component: holidayParametersAdd
  },
  {
    path: 'systemManage/TerminalEventControl',
    name: 'TerminalEventControl',
    meta: {
      title: '终端事件控制',
    },
    component: TerminalEventControl
  },
  {
    path: 'systemManage/TerminalEventLog',
    name: 'TerminalEventLog',
    meta: {
      title: '终端事件控制',
    },
    component: TerminalEventLog
  }
]