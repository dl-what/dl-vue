/*
说明：
1.该配置为所有表单模板初始配置
2.templates目录下的模板文件命名规则：el-${typeName}.vue
*/
const options = [
  {
    value: '1',
    label: '选项1'
  },
  {
    value: '2',
    label: '选项2'
  }
];
export default [
  {
    type: 'input',
    label: '输入框',
  },
  {
    type: 'select',
    label: '选择框',
    options
  },
  {
    type: 'date',
    label: '日期选择',
  },
  {
    type: 'datetime',
    label: '日期时间选择',
  },
  {
    type: 'switch',
    label: '开关',
  },
  {
    type: 'checkbox',
    label: '复选框',
    options
  },
  {
    type: 'radio',
    label: '单选框',
    options
  },
  {
    type: 'textarea',
    label: '文本框',
  }
]