import '@babel/polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import api from './api/'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '../src/assets/iconfont/iconfont.css'
import "bpmn-js/dist/assets/diagram-js.css"
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css"
import commonComponents from './components/common/' // 通用组件引入
import echarts from 'echarts'
import Print from "@/utils/print";
import rules from "@/utils/rules";
import storage from '@/utils/storage'
import formMethods from '@/utils/formMethods'
import common from '@/utils/common'
import download from '@/utils/down'
import moment from "moment";
import xss from 'xss'

Object.defineProperty(Vue.prototype, '$xss', {
  value: xss
})


Vue.use(commonComponents)
Vue.use(ElementUI)
Vue.use(Print); // 注册

Vue.config.productionTip = false
Vue.prototype.$echarts = echarts;
Vue.prototype.$api = api;
Vue.prototype.$formMethods = formMethods;
Vue.prototype.$common = common;
Vue.prototype.$download = download;
Vue.prototype.$storage = storage;
Vue.prototype.$rules = rules;
Vue.prototype.$moment = moment;
Vue.prototype.eventBus = new Vue();

// 防重复点击-自定义指令
Vue.directive('prevent', {
  inserted(el, binding) {
    el.addEventListener('click', () => {
      if (!el.disabled) {
        el.disabled = true
        setTimeout(() => {
          el.disabled = false
        }, binding.value || 1000)
      }
    })
  }
})
// 按钮权限-自定义指令
Vue.directive('has', {
  inserted: function (el, binding) {
    if (!permissionJudge(binding.value)) {
      el.parentNode.removeChild(el);
    }

    function permissionJudge(value) {
      // 此处this.$storage.get('menuBtnList')代表storage中储存的按钮菜单数据
      let list = storage.get('menuBtnList');
      for (let item of list) {
        if (item.permission === value) {
          return true;
        }
      }
      return false;
    }
  }
});

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')