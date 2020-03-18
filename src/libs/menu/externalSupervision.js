export default {
    iconCls: "el-icon-menu",
    text: "外部监管",
    code: 'externalSupervision', // 前端路由名称
    children: [{
      iconCls: "icon-shouye",
      text: "模板定制",
      code: 'customized',
      children: []
    },{
        iconCls: "icon-shouye",
        text: "模板规则",
        code: 'templateRule',
        children: []
    },
    {
        iconCls: "icon-shouye",
        text: "报表上交",
        code: 'statementHandin',
        children: []
    },
    {
        iconCls: "icon-shouye",
        text: "数据源配置",
        code: 'dataSource',
        children: []
    }]
}