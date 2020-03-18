import * as types from './mutation-types'
import api from '../api'

// 入口导航跳转
export function setEntry({commit}, data){
  commit(types.SET_ENTRY, data);
}

// 用户登录
export function setLogin({commit}, data) {
  commit(types.SET_LOGININFO, data);
}

// 添加路由标签
export function setRouterTags({commit}, data) {
  commit(types.SET_ROUTERTAGS, data);
}
// 移除路由标签
export function removeRouterTags({commit}, data) {
  commit(types.REMOVE_ROUTERTAGS, data);
}
// 清空路由标签
export function clearRouterTags({commit}, data) {
  commit(types.CLEAR_ROUTERTAGS, data);
}

// 全屏切换
export function setFull({commit}, data) {
  commit(types.SET_FULL, data);
}
// 机构数据
export async function getInsData({commit}, data) {
  let res = await api.QueryUserAndInsTree(data)
  if(res && res.code === 0) {
    commit(types.SET_INSDATA, res.data)
  }
  return res;
}
// 菜单数据
export async function getMenuData({commit}, data) {
  let res = await api.getUserAndModule({data})
  if(res && res.code === 0) {
    commit(types.SET_MENUDATA, res.data)
  }
  return res;
}
// 游戏类型 - 下拉框
export async function getAllGameType({commit}, data) {
  let res = await api.getAllGameType(data)
  if(res && res.code === 0) {
    commit(types.SET_GAMETYPEDATA, res.data)
  }
  return res;
}

// 设置字体大小
export function setFontSize({commit}, data) {
  commit(types.SET_FONTSIZE, data);
}