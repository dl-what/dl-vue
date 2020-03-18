const Customized = () => import('@/views/supervision/customized/Customized.vue')
const addCustomized = () => import('@/views/supervision/customized/addCustomized.vue')
const customizedDetail = () => import('@/views/supervision/customized/customizedDetail.vue')
const editCustomized = () => import('@/views/supervision/customized/editCustomized.vue')


const templateRule = () => import('@/views/supervision/templateRule/templateRule.vue')
const addTemplateRule = () => import('@/views/supervision/templateRule/addTemplateRule.vue')
const editTemplateRule = () => import('@/views/supervision/templateRule/editTemplateRule.vue')
const templateRuleDetail = () => import('@/views/supervision/templateRule/templateRuleDetail.vue')

const statementHandin = () => import('@/views/supervision/statementHand/statementHandin.vue')
const statementHandinDetail = () => import('@/views/supervision/statementHand/statementHandinDetail.vue')

const dataSource = () => import('@/views/supervision/dataSource/dataSource.vue')
// const errorIndex =() => import('@/views/supervision/errorPage/404')
// const errorpage =() => import('@/views/supervision/errorPage/401')


export default [
  {
    path: 'externalSupervision/Customized',
    meta:{
      title:"模板定制",
    },   
    name: 'Customized',
    component: Customized
  },
  {
    path: 'externalSupervision/addCustomized',
    name: 'addCustomized',
    component: addCustomized,
    meta:{
      parentName:'Customized',
      title: '模板定制新增',
    }
  },
  {
    path: 'externalSupervision/customizedDetail',
    name: 'customizedDetail',
    component: customizedDetail,
    meta:{
      parentName:'Customized',
      title: '模板定制详情',
    }
  },
  {
    path: 'externalSupervision/editCustomized',
    name: 'editCustomized',
    component: editCustomized,
    meta:{
      parentName:'Customized',
      title: '模板定制编辑',
    }
  },
  {
    path: 'externalSupervision/templateRule',
    meta:{
      title:"模板规则",
    },
    name: 'templateRule',
    component: templateRule
  },
  {
    path: 'externalSupervision/addTemplateRule',
    name: 'addTemplateRule',
    component: addTemplateRule,
    meta:{
      parentName:'templateRule',
      title: '规则模板新增',
    }
  },
  {
    path: 'externalSupervision/editTemplateRule',
    name: 'editTemplateRule',
    component: editTemplateRule,
    meta:{
      parentName:'templateRule',
      title: '规则模板编辑',
    }
  },
  {
    path: 'externalSupervision/templateRuleDetail',
    name: 'templateRuleDetail',
    component: templateRuleDetail,
    meta:{
      parentName:'templateRule',
      title: '规则模板详情',
    }
  },
  {
    path: 'externalSupervision/statementHandin',
    name: 'statementHandin',
    meta:{
      title:"报表上交",
    },
    component: statementHandin
  },
  {
    path: 'externalSupervision/statementHandinDetail',
    name: 'statementHandinDetail',
    component: statementHandinDetail,
    meta:{
      parentName:'statementHandin',
      title: '报表上交详情',
    }
  },
  {
    path: 'externalSupervision/dataSource',
    name: 'dataSource',
    component: dataSource,
    meta:{
      title: '数据源配置',
    }
  },
]

