import * as types from './mutation-types'
import storage from '@/utils/storage'

// 页面入口缓存更新，处理多窗口打开页面异常问题
if (storage.get('entry') && !storage.session.get('entry')) {
  storage.session.set('entry', storage.get('entry'));
}

export default  {
  [types.SET_LOGININFO] (state, data) {
    state.loginInfo = data;
    storage.set('userInfo', data);
  },
  [types.SET_ENTRY] (state, data) {
    state.entry = data;
    storage.set('entry', data);
    storage.session.set('entry', data);
  },
  [types.SET_ROUTERTAGS] (state, data) {
    let isRepeat = false;
    state.routerTags.forEach(item => {
      if (item.routerName === data.routerName) {
        isRepeat = true;
        // 路由参数更新
        if (JSON.stringify(item.query) !== JSON.stringify(data.query)) {
          item.query = data.query;
        }
      }
    })
    if (!isRepeat) {
      state.routerTags.push(data);
    }
    storage.session.set('routerTags', state.routerTags);
  },
  [types.REMOVE_ROUTERTAGS] (state, data) {
    state.routerTags.forEach((item, i) => {
      if (state.routerTags[i].routerName === data.routerName) {
        state.routerTags.splice(i, 1);
      }
    })
    storage.session.set('routerTags', state.routerTags);
  },
  [types.CLEAR_ROUTERTAGS] (state) {
    state.routerTags = [];
    storage.session.remove('routerTags');
  },
  [types.SET_FULL] (state, boolean) {
    state.isFull = boolean;
  },
  [types.SET_INSDATA] (state, data) {
    state.insData = data;
  },
  [types.SET_GAMETYPEDATA] (state, data) {
    let array = []
    state.gameTypeOptions = {};
    data.forEach((item)=>{
      let obj = {};
      obj.label = item.gameTypeName;
      obj.value = item.gameTypeCode;
      array.push(obj)
      state.gameTypeOptions[item.gameTypeCode] = item.gameTypeName;
    })
    state.gameTypeData = array;
  },
  [types.SET_FONTSIZE] (state, data) {
    state.fsMode = data;
    storage.set('fsMode', data);
  },
  [types.SET_MENUDATA] (state, data) {
    state.menuData = data;
    let menuBtnList = [];
     // 筛选按钮
    function filterBtn(data, type) {
      data&&data.forEach((item)=>{
        let obj = {};
        if(item.type == type) {
          obj.permission = item.code;
          menuBtnList.push(obj)
        }else{
          filterBtn(item.children, type)
        }
      })
    };
    filterBtn(data, 4)
    storage.set('menuBtnList', menuBtnList)
  },
}