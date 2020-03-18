// 业务监控
import ajax from '@/utils/ajax.js'
//const api="http://10.6.0.34:9999/";
//const api="http://10.5.0.164:9999/"
//const api='http://47.115.4.18:9999/'
export default {
  /*
   *@param {json} options: {} || {data: json}
   */
  /* 请务必注释每个接口所属名称 */
  // 例
  // 中央交易数据列表

  getAllDataSource: (options = {}) => ajax.get('/template/getAllDataSource', {
    ...options,
    baseURL: 'http://183.62.200.203:9999/'
  }),

  getTableContent: (options = {}) => ajax.get('/template/getTableContent', {
    ...options,
    baseURL: 'http://183.62.200.203:9999/'
  },),

  getSaveTemplate: (options = {}) => ajax.post('/template/saveTemplate',{
    ...options,
    baseURL: 'http://183.62.200.203:9999/'
  }),

  getList: (options = {}) => ajax.get('/template/getList',{
    ...options,
    baseURL: 'http://183.62.200.203:9999/'
  }),

  deleteTemplate: (options = {}) => ajax.delete('/template/deleteTemplate',{
    ...options,
    baseURL: 'http://183.62.200.203:9999/'
  }),

  getById: (options = {}) => ajax.get('/template/getById',{
    ...options,
    baseURL: 'http://183.62.200.203:9999/'
  }),

  updateTemplate: (options = {}) => ajax.put('/template/updateTemplate',{
    ...options,
    baseURL: 'http://183.62.200.203:9999/'
  }),

  getAllTemplate: (options = {}) => ajax.get('/template/getAllTemplate',{
    ...options,
    baseURL: 'http://183.62.200.203:9999/'
  }),

  reportLog: (options = {}) => ajax.get('/reportLog',{
    ...options,
    baseURL: 'http://183.62.200.203:9999/'
  }),

  getRepExport: (options = {}) => ajax.get('/reportLog/export',{
    ...options,
    baseURL: 'http://183.62.200.203:9999/'
  }),

  getReportInfo: (options = {}) => ajax.get('/reportLog/getReportInfo',{
    ...options,
    baseURL: 'http://183.62.200.203:9999/'
  }),

  getSaveRule: (options = {}) => ajax.post('/rule/saveRule',{
    ...options,
    baseURL: 'http://183.62.200.203:9999/'
  }),

  getRuleId: (options = {}) => ajax.get('/rule/getById',{
    ...options,
    baseURL: 'http://183.62.200.203:9999/'
  }),

  updateRule: (options = {}) => ajax.put('/rule/updateRule',{
    ...options,
    baseURL: 'http://183.62.200.203:9999/'
  }),    
  deleteRule: (options = {}) => ajax.delete('/rule/deleteRule',{
    ...options,
    baseURL: 'http://183.62.200.203:9999/'
  }),
  getRuleList: (options = {}) => ajax.get('/rule/getList',{
    ...options,
    baseURL: 'http://183.62.200.203:9999/'
  }),
  getTableInfo: (options = {}) => ajax.get('/datasource/getTableInfo',{
    ...options,
    baseURL: 'http://183.62.200.203:9999/'
  }),   
  saveSource: (options = {}) => ajax.post('/datasource/save',{
    ...options,
    baseURL: 'http://183.62.200.203:9999/'
  }),

  
}