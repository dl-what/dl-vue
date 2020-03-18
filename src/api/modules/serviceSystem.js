import ajax from '@/utils/ajax.js'

/*
  系统管理
 */
export default {
  // 客户关怀列表
  getCustomerCareList: (options = {}) => ajax.post('/customerCare/page', options),
  // 客户关怀详情
  getCustomerCareDetail: (options = {}) => ajax.post('/customerCare/detail', options),

  // 新增知识分类
  createKnowledgeType: (options = {}) => ajax.post('/customer/knowledgeBase/category/add', options),
  // 知识类型-下拉框
  queryKnowledgeTypeList: (options = {}) => ajax.post('/customer/knowledgeBase/category/query', options),
  // 知识类型列表
  getKnowledgeTypeList: (options = {}) => ajax.post('/customer/knowledgeBase/category/page', options),
  // 编辑知识类型
  editKnowledgeType: (options = {}) => ajax.post('/customer/knowledgeBase/category/edit', options),
  // 删除知识类型
  deleteKnowledgeType: (options = {}) => ajax.post('/customer/knowledgeBase/category/delete', options),

  // 新增发布知识
  createKnowledge: (options = {}) => ajax.post('/customer/knowledgeBase/add', options),
  // 知识库列表
  queryKnowledgeList: (options = {}) => ajax.post('/customer/knowledgeBase/page', options),
  // 编辑知识类型
  editKnowledge: (options = {}) => ajax.post('/customer/knowledgeBase/edit', options),
  // 查看知识类型详情
  getKnowledgeDetail: (options = {}) => ajax.post('/customer/knowledgeBase/detail', options),
  // 删除知识类型
  deleteKnowledge: (options = {}) => ajax.post('/customer/knowledgeBase/delete', options),
  // 修改知识状态
  changeKnowledgeStatus: (options = {}) => ajax.post('/customer/knowledgeBase/changeStatus', options),

  // 新增快捷回复
  createQuickReply: (options = {}) => ajax.post('/customer/manager/quickReply/add', options),
  // 快捷回复列表
  queryQuickReplyList: (options = {}) => ajax.post('/customer/manager/quickReply/page', options),
  // 编辑快捷回复
  editQuickReply: (options = {}) => ajax.post('/customer/manager/quickReply/edit', options),
  // 删除快捷回复
  deleteQuickReply: (options = {}) => ajax.post('/customer/manager/quickReply/delete', options),
  // 修改快捷回复状态
  changeQuickReplyStatus: (options = {}) => ajax.post('/customer/manager/quickReply/changeStatus', options),
  // 知识库回复列表
  queryKnowledgeReplyList: (options = {}) => ajax.post('/customer/knowledgeBase/page', options),

  // 新增客服小组
  createTeam: (options = {}) => ajax.post('/customer/manager/team/add', options),
  // 客服小组列表
  queryTeamList: (options = {}) => ajax.post('/customer/manager/team/page', options),
  // 编辑客服小组
  editTeam: (options = {}) => ajax.post('/customer/manager/team/edit', options),
  // 删除客服小组
  deleteTeam: (options = {}) => ajax.post('/customer/manager/team/delete', options),
  // 查看客服小组详情
  getTeamDetail: (options = {}) => ajax.post('/customer/manager/team/detail', options),
  // 负责内容下拉框
  getTeamJobs: (options = {}) => ajax.post('/customer/manager/jobs', options),
  // 工单列表
  getServiceTicketList: (options = {}) => ajax.post('/customer/serviceTicket/page', options),
  // 工单处理
  toTicketProcessing: (options = {}) => ajax.post('/customer/serviceTicket/toProcess', options),
  // 工单详情
  getServiceTicketDetail: (options = {}) => ajax.post('/customer/serviceTicket/detail', options),
  // 工单回复
  answerServiceTicket: (options = {}) => ajax.post('/customer/serviceTicket/answer', options),
  // 工单转办保存
  turnServiceTicket: (options = {}) => ajax.post('/customer/serviceTicket/turnTodo', options),
  // 转办客服小组列表
  queryTurnTeamList: (options = {}) => ajax.post('/customer/serviceTicket/selectTeam', options),
  // 工单结束
  endServiceTicket: (options = {}) => ajax.post('/customer/serviceTicket/processed', options),
  // 消息记录
  getServiceMsgList: (options = {}) => ajax.post('/customer/serviceTicket/msgRecord', options),

  



}