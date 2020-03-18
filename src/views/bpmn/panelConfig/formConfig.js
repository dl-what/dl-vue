// 表单配置
export const init = {
  // 根类型
  'bpmn:Process': {
    general: {
      heading: '基本属性',
      formOptions: [
        {
          type: 'input',
          dataType: 'string',
          title: '流程ID',
          prop: 'id',
          value: 'Process1',
          disabled: true
        },
        {
          type: 'cascader',
          dataType: 'array',
          title: '所属机构',
          prop: 'processInsIds',
          props: { 
            children: 'children',
            value: 'id',
            label: 'text',
            checkStrictly: true 
          },
          options: [],
          value: [],
          rule: [
            { required: true, message: '请选择流程所属机构', trigger: 'change' }
          ],
        },
        {
          type: 'input',
          dataType: 'string',
          title: '流程名称',
          prop: 'name',
          value: '',
          rule: [
            { required: true, message: '请输入流程名称', trigger: 'blur' },
            { pattern: '^[A-Za-z0-9\u4e00-\u9fa5]+$', message: '不允许输入空格等特殊符号', trigger: 'blur' }
          ],
        },
        {
          type: 'input',
          dataType: 'Number',
          title: '流程分类ID',
          prop: 'actCategoryId',
          value: '',
          hidden: true,
        },
        {
          type: 'cascader',
          dataType: 'array',
          title: '流程分类',
          prop: 'actCategoryIds',
          props: { 
            children: 'children',
            value: 'id',
            label: 'name',
            checkStrictly: true 
          },
          options: [],
          value: [],
          rule: [
            { required: true, message: '请选择流程分类名称', trigger: 'change' }
          ],
        },
        {
          type: 'select',
          dataType: 'number',
          title: '业务名称',
          prop: 'actBusinessConfigId',
          props: {
            label: 'name',
            key: 'id',
          },
          options: [],
          value: '',
          rule: [
            { required: true, message: '请选择流程业务名称', trigger: 'change' }
          ],
        },
      ],
    },
  },
  // 用户任务
  'bpmn:UserTask': {
    general: {
      heading: '基本属性',
      formOptions: [
        {
          type: 'input',
          dataType: 'string',
          title: '名称',
          prop: 'name',
          value: '',
          rule: [
            { required: true, message: '请输入任务名称', trigger: 'blur' },
            { pattern: '^[A-Za-z0-9\u4e00-\u9fa5]+$', message: '不允许输入空格等特殊符号', trigger: 'blur' }
          ],
        },
        {
          type: 'select',
          dataType: 'string',
          title: '处理人类型',
          prop: 'disposeType',
          value: '',
          options: [
            {label: '选择人员', value: '1'},
            {label: '选择部门', value: '2'},
            {label: '选择部门负责人', value: '3'},
            {label: '选择角色', value: '4'},
          ],
        }
      ],
    },
  },
  // 基本配置
  'base': {
    general: {
      heading: '基本属性',
      formOptions: [
        {
          type: 'input',
          dataType: 'string',
          title: '名称',
          prop: 'name',
          value: '',
          rule: [
            { required: true, message: '请输入节点名称', trigger: 'blur' },
            { pattern: '^[A-Za-z0-9\u4e00-\u9fa5]+$', message: '不允许输入空格等特殊符号', trigger: 'blur' }
          ],
        }
      ],
    }
  },
  // 节点文本注释
  'bpmn:TextAnnotation': {
    general: {
      heading: '基本属性',
      formOptions: [
        {
          type: 'input',
          dataType: 'string',
          title: '节点注释',
          prop: 'text',
          value: ''
        }
      ],
    }
  },
  // 关联线条
  'bpmn:SequenceFlow': {
    general: {
      heading: '基本属性',
      formOptions: [
        {
          type: 'input',
          dataType: 'string',
          title: '名称',
          prop: 'name',
          value: ''
        },
        {
          type: 'select',
          dataType: 'string',
          title: '条件属性',
          prop: 'conditionAttr',
          clearable: true,
          value: '',
          options: [],
        },
        {
          type: 'input',
          dataType: 'string',
          title: '流传条件',
          prop: 'conditionValue',
          value: '',
          hidden: true
        },
        {
          type: 'input',
          dataType: 'string',
          title: '流传条件',
          prop: 'conditionExpression',
          value: '',
          hidden: true
        }
      ],
    }
  },
  // 文本注解线条
  'bpmn:Association': {
    general: {
      heading: '基本属性',
      formOptions: [
        {
          type: 'input',
          dataType: 'string',
          title: '名称',
          prop: 'associationName',
          value: ''
        }
      ]
    }
  },
}
// 处理人类型
export const disposeTypes = {
  '1': {
    formOptions: [
      {
        type: 'input',
        dataType: 'string',
        title: '选择处理人',
        prop: 'candidateUserList',
        value: '',
        hidden: true,
      },
      {
        type: 'tag',
        dataType: 'array',
        title: '处理人',
        prop: 'candidateUsers',
        props: {
          label: 'userName',
          key: 'userId',
        },
        value: [],
        multiple: true,
        options: [],
        hiddenClose: true,
        // 弹窗选择器
        dialogSelector: {
          title: '选择处理人',
          show: false,
          configOptions: [
            {
              type: 'tree',
              dataType: 'array',
              title: '选择机构',
              prop: 'institutions',
              props: {
                label: 'text',
                key: 'id',
                children: 'children'
              },
              defaultExpandedKeys: [],
              value: [],
              options: [],
              accordion: false,
              expandOnclickNode: false,
            },
            {
              type: 'tree',
              dataType: 'array',
              title: '选择处理人',
              prop: 'assigneeUserList',
              showCheckbox: true,
              props: {
                label: 'userName',
                key: 'userId',
                children: 'children'
              },
              value: [],
              options: []
            },
          ]
        },
      },
    ]
  },
  '2': {
    formOptions: [
      {
        type: 'input',
        dataType: 'string',
        title: '选择部门',
        prop: 'departmentList',
        value: '',
        hidden: true,
      },
      {
        type: 'tag',
        dataType: 'array',
        title: '部门',
        prop: 'department',
        props: {
          label: 'text',
          key: 'id',
        },
        multiple: true,
        value: [],
        options: [],
        hiddenClose: true,
        // 弹窗选择器
        dialogSelector: {
          title: '选择部门',
          show: false,
          configOptions: [
            {
              type: 'tree',
              dataType: 'array',
              title: '选择机构',
              prop: 'institutions',
              props: {
                label: 'text',
                key: 'id',
                children: 'children'
              },
              defaultExpandedKeys: [],
              value: [],
              options: [],
              accordion: false,
              expandOnclickNode: false
            },
            {
              type: 'tree',
              dataType: 'array',
              title: '选择部门',
              prop: 'departmentList',
              showCheckbox: true,
              props: {
                label: 'text',
                key: 'id',
                children: 'children'
              },
              value: [],
              options: []
            },
          ]
        },
      },
    ]
  },
  '3': {
    formOptions: [
      {
        type: 'input',
        dataType: 'string',
        title: '选择部门',
        prop: 'departmentList',
        value: '',
        hidden: true,
      },
      {
        type: 'tag',
        dataType: 'array',
        title: '部门',
        prop: 'department',
        props: {
          label: 'text',
          key: 'id',
        },
        multiple: true,
        value: [],
        options: [],
        hiddenClose: true,
        // 弹窗选择器
        dialogSelector: {
          title: '选择部门',
          show: false,
          configOptions: [
            {
              type: 'tree',
              dataType: 'array',
              title: '选择机构',
              prop: 'institutions',
              props: {
                label: 'text',
                key: 'id',
                children: 'children'
              },
              defaultExpandedKeys: [],
              value: [],
              options: [],
              accordion: false,
              expandOnclickNode: false
            },
            {
              type: 'tree',
              dataType: 'number',
              title: '选择部门',
              prop: 'departmentList',
              showCheckbox: true,
              props: {
                label: 'text',
                key: 'id',
                children: 'children'
              },
              value: '',
              options: []
            },
          ]
        },
      },
    ]
  },
  '4': {
    formOptions: [
      {
        type: 'select',
        dataType: 'array',
        title: '角色',
        prop: 'role',
        props: {
          label: 'roleName',
          key: 'roleId'
        },
        filterable: true,
        multiple: true,
        value: [],
        options: []
      },
    ]
  },
}

// 会签
export const multiInstance = {
  heading: '多实例',
  formOptions: [
    {
      type: 'input',
      prop: 'loopCardinality',
      title: '循环基数',
      // rule: [
      //   { required: true, message: '请输入循环基数', trigger: 'blur' }
      // ],
      value: '${loop}',
      hidden: true
    },
    {
      type: 'input',
      prop: 'collection',
      title: '采集',
      rule: [
        { required: true, message: '请输入采集', trigger: 'blur' }
      ],
      value: '',
      hidden: true,
    },
    {
      type: 'input',
      prop: 'elementVariable',
      title: '节点变量',
      rule: [
        { required: true, message: '请输入节点变量', trigger: 'blur' }
      ],
      value: 'assignee',
      hidden: true,
    },
    {
      type: 'input',
      dataType: 'string',
      title: '完成条件',
      prop: 'completionValue',
      appendText: '%',
      rule: [
        { required: true, message: '请输入完成条件', trigger: 'blur' }
      ],
      value: ''
    },
    {
      type: 'input',
      prop: 'completionCondition',
      title: '完成条件',
      rule: [
        { required: true, message: '请输入完成条件', trigger: 'blur' }
      ],
      value: '',
      hidden: true
    },
  ]
}