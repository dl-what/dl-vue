// 业务管理-左侧导航数据

export default {
  iconCls: "el-icon-menu",
  text: "业务管理",
  code: '', // 前端路由名称
  children: [{
    iconCls: "icon-shouye",
    text: "首页",
    code: 'home',
    children: [{
      children: [],
      iconCls: "el-icon-menu",
      text: "概况",
      code: 'overview'
    },
    {
      iconCls: "el-icon-menu",
      text: "站内信",
      code: 'messageList',
      children: []
    },
    {
      children: [],
      iconCls: "el-icon-menu",
      text: "我的待办",
      code: 'myToDo'
    },
    {
      children: [],
      iconCls: "el-icon-menu",
      text: "我的申请",
      code: 'myApplication'
    },
    {
      children: [],
      iconCls: "el-icon-menu",
      text: "我的已办",
      code: 'myDone'
    },
    {
      children: [],
      iconCls: "el-icon-menu",
      text: "我的知会",
      code: 'myKnowledge'
    },
    {
      iconCls: "el-icon-menu",
      text: "档案管理",
      code: 'dossierManage',
      children: []
    }
    ]
  },
  {
    iconCls: "icon-chubeiku",
    text: "游戏储备管理",
    code: 'gameStoreManage',
    children: [{
      children: [],
      iconCls: "el-icon-menu",
      text: "游戏储备列表",
      code: 'gameList'
    },
    {
      children: [],
      iconCls: "el-icon-menu",
      text: "游戏试玩计划",
      code: 'trialPlanList'
    },
    {
      children: [],
      iconCls: "el-icon-menu",
      text: "游戏类型管理",
      code: 'gameTypeList'
    }
    ]
  },
  {
    iconCls: "icon-chanpinfahang1",
    text: "游戏发行管理",
    code: 'gameMarketManage',
    children: [{
      iconCls: "el-icon-menu",
      text: "上市游戏列表",
      code: 'gameMarketList',
      children: [],
    },
    {
      iconCls: "el-icon-menu",
      text: "游戏上市计划",
      code: 'gameMarketPlanList',
      children: [],
    },
    {
      iconCls: "el-icon-menu",
      text: "游戏变更计划",
      code: 'gameChangePlanList',
      children: [],
    },
    {
      children: [],
      iconCls: "el-icon-menu",
      text: "游戏退市计划",
      code: 'gameDelistingPlanList'
    },
    // {
    //   children: [],
    //   iconCls: "el-icon-menu",
    //   text: "风险处理报告",
    //   code: 'riskReportList'
    // }
    ]
  },
  {
    iconCls: "icon-yewu",
    text: "渠道业务管理",
    code: 'channelBusinessManage',
    children: [{
      iconCls: "el-icon-menu",
      text: "渠道列表",
      code: 'channelList',
      children: []
    },
    {
      iconCls: "el-icon-menu",
      text: "业务办理",
      code: 'channelDeal',
      children: []
    },
    {
      iconCls: "el-icon-menu",
      text: "年度发展计划",
      code: 'developmentPlan',
      children: [
        {
          iconCls: "el-icon-menu",
          text: "计划列表",
          code: 'developmentPlanList',
          children: []
        },
        {
          iconCls: "el-icon-menu",
          text: "计划汇总（省）",
          code: 'developmentPlanProvince',
          children: []
        },
        {
          iconCls: "el-icon-menu",
          text: "计划汇总（地市）",
          code: 'developmentPlanCity',
          children: []
        }]
    }
    ]
  },
  {
    iconCls: "icon-ziyuanguanli",
    text: "渠道资源管理",
    code: 'channelResourceManage',
    children: [{
      children: [{
        children: [],
        iconCls: "el-icon-menu",
        text: "设备列表",
        code: 'equipmentList'
      },
      {
        children: [],
        iconCls: "el-icon-menu",
        text: "设施列表",
        code: 'facilityList'
      },
      {
        children: [],
        iconCls: "el-icon-menu",
        text: "耗材列表",
        code: 'consumableList'
      },
      {
        children: [],
        iconCls: "el-icon-menu",
        text: "配件列表",
        code: 'mountingsList'
      },
      ],
      iconCls: "el-icon-menu",
      text: "库存管理",
      code: 'inventoryManage'
    },
    {
      children: [
        {
          children: [],
          iconCls: "el-icon-menu",
          text: "入库管理",
          code: 'putStoreManage'
        },
        {
          children: [],
          iconCls: "el-icon-menu",
          text: "出库管理",
          code: 'outStoreManage'
        },
      ],
      iconCls: "el-icon-menu",
      text: "出入库管理",
      code: 'outPutManage'
    },
    {
      children: [],
      iconCls: "el-icon-menu",
      text: "台账管理",
      code: 'ledgerManage'
    },
    {
      children: [],
      iconCls: "el-icon-menu",
      text: "仓库管理",
      code: 'storeManage'
    },
    {
      children: [
        {
          children: [],
          iconCls: "el-icon-menu",
          text: "类型管理",
          code: 'typeManage'
        },
        {
          children: [],
          iconCls: "el-icon-menu",
          text: "型号管理",
          code: 'modelManage'
        },
      ],
      iconCls: "el-icon-menu",
      text: "基本信息管理",
      code: 'basicInfoManage'
    }
    ],
  },
  {
    iconCls: "icon-zhongduan",
    text: "渠道终端管理",
    code: 'channelTerminalManagement',
    children: [{
      iconCls: "el-icon-menu",
      text: "服务分析",
      code: 'serviceAnalysis',
      children: [{
        children: [],
        iconCls: "el-icon-menu",
        text: "维修率分析",
        code: 'maintenanceEfficiency'
      },
      {
        children: [],
        iconCls: "el-icon-menu",
        text: "设备故障",
        code: 'equipmentFailure'
      },
      {
        children: [],
        iconCls: "el-icon-menu",
        text: "配件故障",
        code: 'accessoryFault'
      }
      ]
    },
    {
      iconCls: "el-icon-menu",
      text: "维修管理",
      code: 'maintenance',
      children: [{
        children: [],
        iconCls: "el-icon-menu",
        text: "维修工单",
        code: 'repairWork'
      },
      {
        children: [],
        iconCls: "el-icon-menu",
        text: "置换工单",
        code: 'replacementWork'
      }
      ]
    },
    {
      iconCls: "el-icon-menu",
      text: "设备管理",
      code: 'equipment',
      children: [{
        children: [],
        iconCls: "el-icon-menu",
        text: "设备列表",
        code: 'deviceList'
      },
      {
        children: [],
        iconCls: "el-icon-menu",
        text: "配件列表",
        code: 'accessoriesList'
      }
      ]
    },
    {
      children: [
        {
          children: [],
          iconCls: "el-icon-menu",
          text: "设备故障报表",
          code: 'reportEquipmentFailure'
        },
        {
          children: [],
          iconCls: "el-icon-menu",
          text: "设备管理损耗报表",
          code: 'deviceLoss'
        },
        {
          children: [],
          iconCls: "el-icon-menu",
          text: "配件损耗报表",
          code: 'accessoryLoss'
        }],
      iconCls: "el-icon-menu",
      text: "报表统计",
      code: 'reportStatistics'
    },
    {
      iconCls: "el-icon-menu",
      text: "维护知识库",
      code: 'knowledgeBaseManage',
      children: [{
        children: [],
        iconCls: "el-icon-menu",
        text: "维护知识库",
        code: 'knowledgeBase'
      },
      {
        children: [],
        iconCls: "el-icon-menu",
        text: "知识库审核",
        code: 'baseReview'
      }
      ],
    },
    {
      iconCls: "el-icon-menu",
      text: "配置管理",
      code: 'configurationManagement',
      children: [{
        children: [],
        iconCls: "el-icon-menu",
        text: "故障类型",
        code: 'faultType'
      }]
    }
    ]
  },
  {
    iconCls: "icon-jixiao",
    text: "渠道绩效管理",
    code: 'channelPerformance',
    children: [{
      iconCls: "el-icon-menu",
      text: "渠道考核指标设置",
      code: 'channelAssessment',
      children: [{
        children: [],
        iconCls: "el-icon-menu",
        text: "指标设置",
        code: 'indicatorSettings'
      },
      {
        children: [],
        iconCls: "el-icon-menu",
        text: "考核项设置",
        code: 'assessItemSet'
      },
      {
        children: [],
        iconCls: "el-icon-menu",
        text: "考核列表",
        code: 'assessmentList'
      },
      {
        children: [],
        iconCls: "el-icon-menu",
        text: "申诉列表",
        code: 'appealList'
      },
      ]
    },
    {
      iconCls: "el-icon-menu",
      text: "渠道等级评定",
      code: 'channelRating',
      children: [{
        children: [],
        iconCls: "el-icon-menu",
        text: "等级配置",
        code: 'channelLevelConfig'
      },
      {
        children: [],
        iconCls: "el-icon-menu",
        text: "等级考核",
        code: 'channelLevelAssess'
      }
      ]
    }
    ]
  },
  {
    iconCls: "icon--jiesuan",
    text: "资金结算管理",
    code: 'fundSettlement',
    children: [{
      children: [],
      iconCls: "el-icon-menu",
      text: "全局参数管理",
      code: 'fundParameter'
    },
    {
      children: [],
      iconCls: "el-icon-menu",
      text: "基金划拔管理",
      code: 'DelimitMoneySetting'
    },
    // {
    //   iconCls: "el-icon-menu",
    //   text: "销售厅资金结算",
    //   code: 'salesHallFundSettlement',
    //   children: [{
    //     children: [],
    //     iconCls: "el-icon-menu",
    //     text: "销售厅资金上缴",
    //     code: 'salesHallTurnin'
    //   },
    //   {
    //     children: [],
    //     iconCls: "el-icon-menu",
    //     text: "销售厅资金对账",
    //     code: 'salesHallFundCheck'
    //   }, {
    //     children: [],
    //     iconCls: "el-icon-menu",
    //     text: "销售厅日结",
    //     code: 'salesHallDaily'
    //   }
    //   ],
      
    // },
    // {
    //   children: [],
    //   iconCls: 'el-icon-menu',
    //   text: '电子支付对账',
    //   code: "electricPaymentReconciliation"
    // }
    ],
  },
  {
    iconCls: "icon-kaguanli",
    text: "投注卡管理",
    code: 'bettingCardManage',
    children: [{
      children: [],
      iconCls: "el-icon-menu",
      text: "投注卡生成",
      code: 'cardGeneration'
    },
    {
      children: [],
      iconCls: "el-icon-menu",
      text: "投注卡信息",
      code: 'cardInformation'
    }]
  },
  {
    iconCls: "icon-hezuohuoban",
    text: "合作伙伴管理",
    code: 'partnerManage',
    children: [
      {
        children: [],
        iconCls: "",
        text: "合作伙伴列表",
        code: 'partnerList'
      },
      {
        iconCls: "",
        text: "绩效管理",
        code: 'perfManage',
        children: [
          {
            children: [],
            iconCls: "",
            text: "考核规则",
            code: 'assessmentRules'
          },
          {
            children: [],
            iconCls: "",
            text: "合作伙伴等级",
            code: 'partnerLevel'
          },
          {
            children: [],
            iconCls: "",
            text: "考核记录",
            code: 'partnerAssessmentList'
          },
        ],
      },
    ]
  },
  {
    iconCls: "icon-zaixianpeixun-",
    text: "在线培训",
    code: 'trainingManage',
    children: [{
      iconCls: "el-icon-menu",
      text: "培训管理",
      code: 'trainingAdministration',
      children: [
        {
          iconCls: "el-icon-menu",
          text: "培训计划",
          code: 'trainingPlanList'
        },
        {
          iconCls: "el-icon-menu",
          text: "培训项目",
          code: 'trainingProjectList'
        }
      ],

    },
    {
      iconCls: "el-icon-menu",
      text: "课程管理",
      code: 'courseManage',
      children: [{
        iconCls: "el-icon-menu",
        text: "课程管理",
        code: 'courseManageContent',
        children: [],
      },
      {
        iconCls: "el-icon-menu",
        text: "课程类型管理",
        code: 'courseTypeManage',
        children: [],
      },
      ],
    },
    {
      children: [{
        iconCls: "el-icon-menu",
        text: "题目管理",
        code: 'questionBankManage',
        children: [],
      },
      {
        iconCls: "el-icon-menu",
        text: "考试档案",
        code: 'examinationArchives',
        children: [],
      },
      ],
      iconCls: "el-icon-menu",
      text: "考核管理",
      code: 'assessManage'
    }
    ]
  },

  {
    iconCls: "icon-ruanjianshengji1",
    text: "软件升级管理",
    code: 'softwareUpgradeManage',
    children: [{
      children: [],
      iconCls: "el-icon-menu",
      text: "升级计划列表",
      code: 'upgradePlanList'
    },
    {
      children: [],
      iconCls: "el-icon-menu",
      text: "回滚设置列表",
      code: 'rollbackSet'
    },
    {
      children: [],
      iconCls: "el-icon-menu",
      text: "升级软件包管理",
      code: 'softwarePackage'
    }
    ]
  }
  ]
}