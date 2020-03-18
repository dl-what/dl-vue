// 业务运营-左侧导航数据

export default {
  iconCls: "el-icon-menu",
  text: "业务运营",
  code: 'businessOperation', // 前端路由名称
  children: [{
    iconCls: "icon-shouye",
    text: "首页",
    code: 'homes',
    children: [{
      children: [],
      iconCls: "el-icon-menu",
      text: "概况",
      code: 'overviews'
    },
    {
      iconCls: "el-icon-menu",
      text: "站内信",
      code: 'messageLists',
      children: []
    },
    {
      children: [],
      iconCls: "el-icon-menu",
      text: "我的待办",
      code: 'myToDos'
    },
    {
      children: [],
      iconCls: "el-icon-menu",
      text: "我的申请",
      code: 'myApplications'
    },
    {
      children: [],
      iconCls: "el-icon-menu",
      text: "我的已办",
      code: 'myDones'
    },
    {
      children: [],
      iconCls: "el-icon-menu",
      text: "我的知会",
      code: 'myKnowledges'
    },
    {
      children: [{
        children: [],
        iconCls: "el-icon-menu",
        text: "渠道账户列表",
        code: 'accountList'
      },
        // {
        //   children: [],
        //   iconCls: "el-icon-menu",
        //   text: "资金账户管理",
        //   code: 'accountMoneyManage'
        // }
      ],
      iconCls: "icon-chanpinfahang1",
      text: "渠道账户",
      code: 'screenWatch'
    },

    {
      children: [{
        iconCls: "el-icon-menu",
        text: "角色管理",
        code: 'roleManage'
      },
      {
        iconCls: "el-icon-menu",
        text: "角色账户",
        code: 'operationAccountManage'
      }
      ],
      iconCls: "icon-houtaiweihu",
      text: "渠道角色权限维护",
      code: 'PermissionMaintain'
    },

    {
      children: [{
        iconCls: "el-icon-menu",
        text: "大奖兑奖",
        code: 'lotteryTicket'
      },
      {
        iconCls: "el-icon-menu",
        text: "兑奖设置",
        code: 'expirySetting'
      },
      {
        iconCls: "el-icon-menu",
        text: "兑奖处管理",
        code: 'ticketOfficeManage'
      },
      {
        iconCls: "el-icon-menu",
        text: "兑奖查询",
        code: 'winningCheck'
      }
      ],
      iconCls: "icon-daiduijiang",
      text: "彩票兑奖管理",
      code: 'LotteryManagement'
    },

    {
      children: [{
        iconCls: "el-icon-menu",
        text: "会员等级管理",
        code: 'MemberGradeManagement'
      },
      {
        iconCls: "el-icon-menu",
        text: "会员权益管理",
        code: 'MemberEquityManagement'
      },
      {
        iconCls: "el-icon-menu",
        text: "会员积分管理",
        code: 'MemberIntegralManagement'
      },
      {
        iconCls: "el-icon-menu",
        text: "风险评估管理",
        code: 'MemberRiskLevel',
        children: [{
          iconCls: 'el-icon-menu',
          text: '风险评估方案',
          code: 'RiskAssessmentProgram'
        },
        {
          iconCls: 'el-icon-menu',
          text: '风险等级设置',
          code: 'RiskLevelSetting'
        },
        {
          iconCls: '',
          text: '风险评估题库',
          code: 'RiskAssessmentQuestionBank'
        }
        ]
      },
      ],
      iconCls: "icon-huiyuanguanli",
      text: "会员管理",
      code: 'MemberManagement'
    },
    {
      children: [{
        iconCls: "icon-caiwubaobiao",
        text: "问卷制作",
        code: 'makeToQuestion'
      },
      {
        iconCls: "icon-caiwubaobiao",
        text: "问卷统计分析",
        code: 'questionnairStatistical'
      },
      {
        iconCls: "icon-caiwubaobiao",
        text: "问卷题库",
        code: 'questionnaireBank'
      },
      {
        iconCls: "icon-caiwubaobiao",
        text: "题目分类",
        code: 'SubjectClassification'
      },
      ],
      iconCls: "icon-caiwubaobiao",
      text: "问卷调查",
      code: 'questionnaireSurvey'
    },
    // {
    //   children: [{
    //       iconCls: "el-icon-menu",
    //       text: "资金日结算报表",
    //       code: 'financialStatementDaySettle'
    //     },
    //     {
    //       iconCls: "el-icon-menu",
    //       text: "资金日分配报表",
    //       code: 'financialStatementDayAllocation'
    //     },
    //     {
    //       iconCls: "el-icon-menu",
    //       text: "资金日流向报表",
    //       code: 'financialStatementDayFlow'
    //     },
    //     {
    //       iconCls: "el-icon-menu",
    //       text: "资金月结算报表",
    //       code: 'financialStatementMonthSettle'
    //     },
    //     {
    //       iconCls: "el-icon-menu",
    //       text: "资金月分配报表",
    //       code: 'financialStatementMonthAllocation'
    //     },
    //     {
    //       iconCls: "el-icon-menu",
    //       text: "资金月流向报表",
    //       code: 'financialStatementMonthFlow'
    //     },
    //     {
    //       iconCls: "el-icon-menu",
    //       text: "资金年结算报表",
    //       code: 'financialStatementYearSettle'
    //     },
    //     {
    //       iconCls: "el-icon-menu",
    //       text: "资金年分配报表",
    //       code: 'financialStatementYearAllocation'
    //     },
    //     {
    //       iconCls: "el-icon-menu",
    //       text: "资金年流向报表",
    //       code: 'financialStatementYearFlow'
    //     },
    //   ],
    //   iconCls: "icon-caiwubaobiao",
    //   text: "财务报表",
    //   code: 'financialStatement'
    // },


    {
      children: [{
        children: [],
        iconCls: "el-icon-menu",
        text: "活动计划模板设置",
        code: 'planTemplateSet'
      },
      {
        children: [],
        iconCls: "el-icon-menu",
        text: "活动规则模板设置",
        code: 'ruleTemplateSet'
      },
      {
        children: [],
        iconCls: "el-icon-menu",
        text: "活动计划管理",
        code: 'activityPlanManage'
      },
      {
        children: [],
        iconCls: "el-icon-menu",
        text: "活动执行管理",
        code: 'executionManage'
      },
      {
        children: [],
        iconCls: "el-icon-menu",
        text: "活动效果评估",
        code: 'activityResult'
      }
      ],
      iconCls: "icon-yingxiaotuiguang",
      text: "品牌与营销推广",
      code: 'brandMarketing'
    },
    {
      children: [{
        children: [],
        iconCls: "el-icon-menu",
        text: "客户账户列表",
        code: 'customerAccountList'
      }, {
        children: [],
        iconCls: "el-icon-menu",
        text: "客户标签管理",
        code: 'customerTags'
      }],
      iconCls: "icon-zhanghu1",
      text: "客户账户",
      code: 'customerAccount'
    },
    {
      children: [{
        children: [],
        iconCls: "el-icon-menu",
        text: "充值记录",
        code: 'rechargeRecord'
      },
      {
        children: [],
        iconCls: "el-icon-menu",
        text: "投注记录",
        code: 'bettingRecord'
      },
      {
        children: [],
        iconCls: "el-icon-menu",
        text: "兑奖记录",
        code: 'cashRecord'
      },
      {
        children: [],
        iconCls: "el-icon-menu",
        text: "提现记录",
        code: 'withdrawalRecords'
      },
      {
        children: [],
        iconCls: "el-icon-menu",
        text: "积分记录",
        code: 'integralRecord'
      },
      {
        children: [],
        iconCls: "el-icon-menu",
        text: "成长值记录",
        code: 'growthRecord'
      },
      {
        children: [],
        iconCls: "el-icon-menu",
        text: "资金流水",
        code: 'fundsStatement'
      },
      {
        children: [],
        iconCls: "el-icon-menu",
        text: "风险评估记录",
        code: 'recordOfRiskAssessment'
      }
      ],
      iconCls: "icon-gongsizhanghujilu",
      text: "账户记录",
      code: 'accountRecord'
    },

    //责任彩票
    {
      children: [{
        children: [],
        iconCls: "el-icon-menu",
        text: "责任彩票列表",
        code: 'dutyLotteryList'
      }],
      iconCls: "icon-zeren",
      text: "责任彩票",
      code: 'dutyLottery'
    },

    //公告信息发布
    {
      children: [{
        children: [],
        iconCls: "el-icon-menu",
        text: "公告信息发布",
        code: 'bulletinList'
      },
      {
        children: [],
        iconCls: "el-icon-menu",
        text: "公告模板",
        code: 'bulletinTemplate'
      },

      ],
      iconCls: "icon-xinxifabu-OA",
      text: "公告信息发布",
      code: 'bulletinInfoPublish'
    },
    ]
  }]
}