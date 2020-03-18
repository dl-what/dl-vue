/* 
  客服系统路由配置
*/
// 工单管理
//客服工单
const workOrderList = () => import('@/views/serviceSystem/workOrderManage/workOrderList')
//客服工单-详情
const workOrderDetail = () => import('@/views/serviceSystem/workOrderManage/workOrderDetail')



// 客户管理
//客户列表
const customerList = () => import('@/views/serviceSystem/customerManage/customerList')
//客户记录
const customerRecord= () => import('@/views/serviceSystem/customerManage/customerRecord')


// 客服管理
//快捷回复
const quickReplyList= () => import('@/views/serviceSystem/serviceManage/quickReplyList')
//客服列表
const serviceList= () => import('@/views/serviceSystem/serviceManage/serviceList')
//客服列表-详情
const serviceDetail= () => import('@/views/serviceSystem/serviceManage/serviceDetail')
//客服小组
const serviceTeamList= () => import('@/views/serviceSystem/serviceManage/serviceTeamList')
//客服小组-详情
const serviceTeamDetail= () => import('@/views/serviceSystem/serviceManage/serviceTeamDetail')


// 知识库管理
//知识库列表
const knowledgeBaseList= () => import('@/views/serviceSystem/knowledgeBase/knowledgeBaseList')
//发布知识
const createKnowledgeBase= () => import('@/views/serviceSystem/knowledgeBase/createKnowledgeBase')
//编辑知识
const editKnowledgeBase= () => import('@/views/serviceSystem/knowledgeBase/editKnowledgeBase')
//分类管理
const knowledgeTypeList= () => import('@/views/serviceSystem/knowledgeBase/knowledgeTypeList')


// 客户关怀记录
//客户关怀记录
const customCareList= () => import('@/views/serviceSystem/customCareManage/customCareList')
//客户关怀记录-详情
const customCareDetail= () => import('@/views/serviceSystem/customCareManage/customCareDetail')




export default [
  {
    path: 'serviceSystem/workOrderManage/workOrderList',
    name: 'workOrderList',
    meta: {
      title: '客服工单',
    },
    component: workOrderList
  },
  {
    path: 'serviceSystem/workOrderManage/workOrderDetail',
    name: 'workOrderDetail',
    meta: {
      title: '客服工单详情',
      parentName: 'workOrderList',
    },
    component: workOrderDetail
  },
  {
    path: 'serviceSystem/customerManage/customerList',
    name: 'customerList',
    meta: {
      title: '客户列表',
    },
    component: customerList
  },
  {
    path: 'serviceSystem/customerManage/customerRecord',
    name: 'customerRecord',
    meta: {
      title: '客户记录',
    },
    component: customerRecord
  },
  {
    path: 'serviceSystem/serviceManage/quickReplyList',
    name: 'quickReplyList',
    meta: {
      title: '快捷回复',
    },
    component: quickReplyList
  },
  {
    path: 'serviceSystem/serviceManage/serviceList',
    name: 'serviceList',
    meta: {
      title: '客服列表',
    },
    component: serviceList
  },
  {
    path: 'serviceSystem/serviceManage/serviceDetail',
    name: 'serviceDetail',
    meta: {
      title: '客服详情',
    },
    component: serviceDetail
  },
  {
    path: 'serviceSystem/serviceManage/serviceTeamList',
    name: 'serviceTeamList',
    meta: {
      title: '客服小组',
    },
    component: serviceTeamList
  },
  {
    path: 'serviceSystem/serviceManage/serviceTeamDetail',
    name: 'serviceTeamDetail',
    meta: {
      title: '客服小组详情',
      parentName: 'serviceTeamList'
    },
    component: serviceTeamDetail
  },
  {
    path: 'serviceSystem/knowledgeBase/knowledgeBaseList',
    name: 'knowledgeBaseList',
    meta: {
      title: '知识库列表',
    },
    component: knowledgeBaseList
  },
  {
    path: 'serviceSystem/knowledgeBase/createKnowledgeBase',
    name: 'createKnowledgeBase',
    meta: {
      title: '发布知识库',
      parentName: 'knowledgeBaseList'
    },
    component: createKnowledgeBase
  },
  {
    path: 'serviceSystem/knowledgeBase/editKnowledgeBase',
    name: 'editKnowledgeBase',
    meta: {
      title: '编辑知识库',
      parentName: 'knowledgeBaseList'
    },
    component: editKnowledgeBase
  },
  {
    path: 'serviceSystem/knowledgeBase/knowledgeTypeList',
    name: 'knowledgeTypeList',
    meta: {
      title: '分类管理',
    },
    component: knowledgeTypeList
  },
  {
    path: 'serviceSystem/customCareManage/customCareList',
    name: 'customCareList',
    meta: {
      title: '客户关怀记录',
    },
    component: customCareList
  },
  {
    path: 'serviceSystem/customCareManage/customCareDetail',
    name: 'customCareDetail',
    meta: {
      title: '客户关怀详情',
      parentName: 'customCareList',
    },
    component: customCareDetail
  },
]