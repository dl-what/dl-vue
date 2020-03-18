// 业务监控-左侧导航数据
//no message
export default {
  iconCls: "el-icon-menu",
  text: "业务监控",
  code: '', // 前端路由名称
  children: [{
      iconCls: "icon-dapingjiankong",
      text: "大屏监控",
      code: 'centerWatch',
      children: [
       
      ],

    },
    {
      iconCls: "icon-shujujiankong1",
      text: "交易数据监控",
      code: 'areaDeal',
      children: [
        // {
        //   children: [],
        //   iconCls: "el-icon-menu",
        //   text: "中央交易数据",
        //   code: 'centerDeal'
        // },
        // {
        //   children: [],
        //   iconCls: "el-icon-menu",
        //   text: "省级交易数据",
        //   code: 'provinceDeal'
        // },
        // {
        //   children: [],
        //   iconCls: "el-icon-menu",
        //   text: "市级交易数据",
        //   code: 'cityDeal'
        // },
        // {
        //   children: [],
        //   iconCls: "el-icon-menu",
        //   text: "区域交易数据",
        //   code: 'areaDeal'
        // },
      ],

    }, {
      iconCls: "icon-zhanghu2",
      text: "销售厅账户监控",
      code: 'accountWatch',
      children: [

      ],

    }, {
      iconCls: "icon-shebeijiankong",
      text: "销售厅设备监控",
      code: 'equipmentWatch',
      children: [
        {
          children: [],
          iconCls: "el-icon-menu",
          text: "设备数据监控",
          code: 'equipmentDataWatch'
        },
        {
          children: [],
          iconCls: "el-icon-menu",
          text: "设备硬件监控",
          code: 'equipmentHardwareWatch'
        },
        {
          children: [],
          iconCls: "el-icon-menu",
          text: "设备安全监控",
          code: 'equipmentSafeWatch'
        }
      ],

    }, 
    {
      iconCls: "icon-gaojingshijian",
      text: "告警管理",
      code: 'warningManager',
      children: [
        {
          children: [],
          iconCls: "el-icon-menu",
          text: "告警监控",
          code: 'warningWatch'
        },
        {
          children: [
            {
              children: [],
              iconCls: "el-icon-menu",
              text: "奖池风险指标",
              code: 'pondRisk'
            },
            // {
            //   children: [],
            //   iconCls: "el-icon-menu",
            //   text: "城市风险指标",
            //   code: 'cityRisk'
            // },
            {
              children: [],
              iconCls: "el-icon-menu",
              text: "数量风险指标",
              code: 'cityNumberRisk'
            },
            {
              children: [],
              iconCls: "el-icon-menu",
              text: "金额风险指标",
              code: 'cityMoneyRisk'
            },
            {
              children: [],
              iconCls: "el-icon-menu",
              text: "账户风险指标",
              code: 'cityAccountRisk'
            },
            {
              children: [],
              iconCls: "el-icon-menu",
              text: "游戏风险指标",
              code: 'cityGameRisk'
            },
            {
              children: [],
              iconCls: "el-icon-menu",
              text: "用户风险指标",
              code: 'userRisk'
            }
          ],
          iconCls: "el-icon-menu",
          text: "告警规则",
          code: 'provinceWatch'
        
        }
      ],

    },
    {
      iconCls: "icon-caidanguanli1",
      text: "报表管理",
      code: 'reportManage',
      children: [
        {
          children: [],
          iconCls: "el-icon-menu",
          text: "告警报表",
          code: 'warningReport'
        },
        // {
        //   children: [],
        //   iconCls: "el-icon-menu",
        //   text: "组件",
        //   code: 'componentDemo'
        // },
        // {
        //   children: [],
        //   iconCls: "el-icon-menu",
        //   text: "demo1",
        //   code: 'demo1'
        // },
        // {
        //   children: [],
        //   iconCls: "el-icon-menu",
        //   text: "echarts",
        //   code: 'echarts'
        // },
        // {
        //   children: [],
        //   icon: "el-icon-menu",
        //   name: "组件",
        //   url: 'componentDemo'
        // },  
      ],
    },
    {
      iconCls: "icon-xitongshezhi",
      text: "系统管理",
      code: 'systemManage',
      children: [
        {
          children: [],
          iconCls: "el-icon-menu",
          text: "参数设置",
          code: 'parameterSetting'
        },
        {
          children: [],
          iconCls: "el-icon-menu",
          text: "应用日志",
          code: 'applyingLog'
        },
        {
          children: [],
          iconCls: "el-icon-menu",
          text: "游戏日志",
          code: 'gameLog'
        },
      ],
    },
  ]
}