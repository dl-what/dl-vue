/*第三方对接接口*/ 
import ajax from '@/utils/ajax.js'
// 报表接口地址
const reportBaseURL = 'http://10.6.0.34:8080' //'http://183.62.200.202:8580'
// BI接口地址
const biBaseURL = 'http://10.6.0.33:28080' //'http://183.62.200.202:28080'

export default {
  // 报表接口
  // 用户登陆
  reportUserLogin: (options = {}) => ajax.jsonp('/webroot/decision/login/cross/domain', {
    ...options,
    baseURL: reportBaseURL
  }),
  // 添加用户
  reportUserCreate: (options = {}) => ajax.post('/webroot/decision/v10/user', {
    ...options,
    baseURL: '/report'
  }),
  // 获取用户
  reportGetUser: (options = {}) => ajax.get('/webroot/decision/v10/user', {
    ...options,
    baseURL: '/report'
  }),
  // 获取用户列表
  reportGetUsers: (options = {}) => ajax.get('/webroot/decision/v10/users', {
    ...options,
    baseURL: '/report'
  }),
  // 编辑用户
  reportUserEdit: (options = {}) => ajax.put('/webroot/decision/v10/user', {
    ...options,
    baseURL: '/report'
  }),
  // 删除用户
  reportUserDelete: (options = {}) => ajax.delete('/webroot/decision/v10/users', {
    ...options,
    baseURL: '/report'
  }),
  // 禁用启用用户
  reportUserStatusEdit: (options = {}) => ajax.put('/webroot/decision/v10/user/forbid', {
    ...options,
    baseURL: '/report'
  }),

  // BI接口
  // 用户登陆
  biUserLogin: (options = {}) => ajax.jsonp('/webroot/decision/login/cross/domain', {
    ...options,
    baseURL: biBaseURL
  }),
  // 添加用户
  biUserCreate: (options = {}) => ajax.post('/webroot/decision/v10/user', {
    ...options,
    baseURL: '/bi'
  }),
  // 获取用户
  biGetUser: (options = {}) => ajax.get('/webroot/decision/v10/user', {
    ...options,
    baseURL: '/bi'
  }),
  // 获取用户列表
  biGetUsers: (options = {}) => ajax.get('/webroot/decision/v10/users', {
    ...options,
    baseURL: '/bi'
  }),
  // 编辑用户
  biUserEdit: (options = {}) => ajax.put('/webroot/decision/v10/user', {
    ...options,
    baseURL: '/bi'
  }),
  // 删除用户
  biUserDelete: (options = {}) => ajax.delete('/webroot/decision/v10/users', {
    ...options,
    baseURL: '/bi'
  }),
  // 禁用启用用户
  biUserStatusEdit: (options = {}) => ajax.put('/webroot/decision/v10/user/forbid', {
    ...options,
    baseURL: '/bi'
  }),
}