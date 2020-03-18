// 客服系统-左侧导航数据
//no message
export default {
  iconCls: "el-icon-menu",
  text: "客服系统",
  code: '', // 前端路由名称
  children: [{
      iconCls: "icon-gongdanguanli",
      text: "工单管理",
      code: 'workOrderManage',
      children: [
        {
          children: [],
          iconCls: "el-icon-menu",
          text: "客服工单",
          code: 'workOrderList'
        },
      ],

    },
    // {
    //   iconCls: "icon-kehuguanli",
    //   text: "客户管理",
    //   code: 'customerManage',
    //   children: [{
    //       children: [],
    //       iconCls: "el-icon-menu",
    //       text: "客户列表",
    //       code: 'customerList'
    //     },
    //     {
    //       children: [],
    //       iconCls: "el-icon-menu",
    //       text: "客户记录",
    //       code: 'customerRecord'
    //     },
    //   ],
    // },
    {
      iconCls: "icon-kefuguanli",
      text: "客服管理",
      code: 'serviceManage',
      children: [
        // {
        //   children: [],
        //   iconCls: "el-icon-menu",
        //   text: "客服列表",
        //   code: 'serviceList'
        // },
        {
          children: [],
          iconCls: "el-icon-menu",
          text: "客服小组",
          code: 'serviceTeamList'
        },
        {
          children: [],
          iconCls: "el-icon-menu",
          text: "快捷回复",
          code: 'quickReplyList'
        },
      ],
    }, 
    {
      iconCls: "icon-zhishiku",
      text: "知识库管理",
      code: 'knowledgeBase',
      children: [
        {
          children: [],
          iconCls: "el-icon-menu",
          text: "知识库列表",
          code: 'knowledgeBaseList'
        },
        {
          children: [],
          iconCls: "el-icon-menu",
          text: "分类管理",
          code: 'knowledgeTypeList'
        },
      ],

    }, 
    {
      iconCls: "icon-kehuguanhuai",
      text: "客户关怀",
      code: 'customCareManage',
      children: [{
          children: [],
          iconCls: "el-icon-menu",
          text: "客户关怀记录",
          code: 'customCareList'
        },
      ],

    },
  ]
}