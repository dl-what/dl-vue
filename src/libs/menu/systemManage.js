// 系统管理-左侧导航数据

export default {
  iconCls: "el-icon-menu",
  text: "系统管理",
  code: '' ,// 前端路由名称
  children: [{
      iconCls: "icon-xitongshezhi",
      text: "系统设置",
      code: 'settings',
      children: [
        // {
        //   children: [],
        //   iconCls: "el-icon-menu",
        //   text: "基本设置",
        //   code: 'baseSetting'
        // },
        // {
        //   children: [],
        //   iconCls: "el-icon-menu",
        //   text: "邮件设置",
        //   code: 'emailSetting'
        // },
        {
          children: [],
          iconCls: "el-icon-menu",
          text: "参数设置",
          code: 'paramSetting'
        },
        // {
        //   children: [],
        //   iconCls: "el-icon-menu",
        //   text: "短信设置",
        //   code: 'noteSetting'
        // },
        {
          children: [],
          iconCls: "el-icon-menu",
          text: "周参数设置",
          code: 'weekParamSetting'
        },
        {
          children: [],
          iconCls: "el-icon-menu",
          text: "天气设置",
          code: 'weatherSetting'
        }
      ],
    },
    {
      iconCls: "icon-shujuzidian",
      text: "数据字典",
      code: 'dataDictionary',
      children: [{
        children: [],
        iconCls: "el-icon-menu",
        text: "数据字典",
        code: 'dataDictionary'
      }]
    },
    {
      iconCls: "icon-chanpindaohang_yewuliucheng",
      text: "业务流程",
      code: 'businessProcess',
      children: [
        // {
        //   children: [],
        //   iconCls: "el-icon-menu",
        //   text: "表单管理",
        //   code: 'formManage'
        // },
        {
          children: [],
          iconCls: "el-icon-menu",
          text: "业务配置",
          code: 'businessConf'
        },
        {
          children: [],
          iconCls: "el-icon-menu",
          text: "流程设置",
          code: 'processSet'
        },
        {
          children: [],
          iconCls: "el-icon-menu",
          text: "流程分类",
          code: 'processClassify'
        },
      ],
    },
    {
      iconCls: "icon-zuzhijiagou",
      text: "组织架构",
      code: 'organization',
      children: [{
        iconCls: "",
        text: "组织架构",
        code: 'organizationChild',
      }]
    },
    {
      iconCls: 'icon-yonghuguanli',
      text: '用户管理',
      code: 'userContorl',
      children: [{
        iconCls: '',
        text: '用户列表',
        code: 'userList',
      }, {
        iconCls: '',
        text: '用户设置',
        code: 'userSetting',
      }]
    },
    {
      iconCls: 'icon-hezuohuoban1',
      text: '角色管理',
      code: 'roleManagement',
      children: [{
        iconCls: '',
        text: '角色列表',
        code: 'roleList'
      }]
    },
    {
      iconCls: 'icon-caidanguanli',
      text: '菜单管理',
      code: 'menuManagement',
      children: [{
        iconCls: '',
        text: '菜单管理',
        code: 'menuManageMent'
      }]
    },
    {
      iconCls: 'icon-xitongrizhi',
      text: '系统日志',
      code: 'systemLog',
      children: [{
        iconCls: '',
        text: '系统操作日志',
        code: 'systemOperationLog'
      }]
    },
    {
      iconCls: 'icon-xitongkaiguan',
      text: '系统开关',
      code: 'systemSwitch',
      children: [{
        iconCls: '',
        text: '系统开关',
        code: 'systemSwitch'
      }]
    },
    {
      iconCls: 'icon-rili',
      text: '假日参数管理',
      code: 'holidayParameters',
      children: [{
        iconCls: '',
        text: '假日参数管理',
        code: 'holidayParameters'
      }]
    },
    {
      iconCls: 'icon-zhongduanguanli',
      text: '终端事件管理',
      code: 'TerminalEventManagement',
      children: [{
        iconCls: '',
        text: '终端事件控制',
        code: 'TerminalEventControl'
      },
      // {
      //   iconCls: '',
      //   text: '终端事件日志',
      //   code: 'TerminalEventLog'
      // }
    ]
    }
  ]
}
