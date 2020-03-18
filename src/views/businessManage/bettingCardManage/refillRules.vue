<template>
  <!-- 投注卡充值规则 -->
  <div class="vlt-card">
    <search-bar
      class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      :total="999"
      labelWidth="100px"
    >
      <control-bar slot="extend-bar" position="left" @select="selectBtn" :options="controlOptions" ></control-bar></search-bar>
    <el-row class="card-table">
      <el-table
        :data="tableDatas.tableData"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
        class="table-box"
      >
        <el-table-column
          v-for="(item,key) in tableDatas.tableKey"
          :key="key"
          :prop="item.value"
          :label="item.label"
          :width="item.width"
        ></el-table-column>
        <el-table-column fixed="right" label="操作" min-width="120px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="toDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <table-paging
      position="right"
      :total="999"
      :currentPage="1"
      :pageSize="10"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></table-paging>
    <dialog-form 
    :showForm="showdialog"
    :formDatas="data2"
    :diaTitle="diaTitle"
    :rule="rules2"
     @closeDia="hideDia"></dialog-form>
  </div>
</template>

<script type="text/javascript">
import rules from "@/utils/rules.js";
import dialogForm from "@/views/businessManage/bettingCardManage/components/dialogForm";
export default {
  name: "refillRules",
  data() {
    return {
      controlOptions: [{ name: "新建", type: "primary", icon: "plus" }],
      // 搜索组件配置
      searchOptions: [
        {
          title: "是否启用",
          type: "select",
          prop: "selectName",
          value: "",
          options: [
            {
              label: "是",
              value: 1
            },
            {
              label: "否",
              value: 2
            }
          ]
        },
        {
          type: "datetime-range",
          prop: "date4",
          value: "",
          title: "提现时间",
          placeholder: ["开始时间", "结束时间"]
        }
      ],
      tableDatas: {
        tableData: [
          {
            id: 0,
            cycle: "1天",
            number: 1,
            limit: "100",
            limitTimes: 5,
            whetherToEnable: "启用",
            date: '2019-02-25 01:50:06'
          },
          {
            id: 1,
            cycle: "1天",
            number: 1,
            limit: "100",
            limitTimes: 5,
            whetherToEnable: "启用",
            date: '2019-02-25 01:50:06'
          },
          {
            id: 2,
            cycle: "1天",
            number: 1,
            limit: "100",
            limitTimes: 5,
            whetherToEnable: "启用",
            date: '2019-02-25 01:50:06'
          },
          {
            id: 3,
            cycle: "1天",
            number: 1,
            limit: "100",
            limitTimes: 5,
            whetherToEnable: "启用",
            date: '2019-02-25 01:50:06'
          },
          {
            id: 4,
            cycle: "1天",
            number: 1,
            limit: "100",
            limitTimes: 5,
            whetherToEnable: "启用",
            date: '2019-02-25 01:50:06'
          },
          {
            id: 5,
            cycle: "1天",
            number: 1,
            limit: "100",
            limitTimes: 5,
            whetherToEnable: "启用",
            date: '2019-02-25 01:50:06'
          },
          {
            id: 6,
            cycle: "1天",
            number: 1,
            limit: "100",
            limitTimes: 5,
            whetherToEnable: "启用",
            date: '2019-02-25 01:50:06'
          },
          {
            id: 7,
            cycle: "1天",
            number: 1,
            limit: "100",
            limitTimes: 5,
            whetherToEnable: "启用",
            date: '2019-02-25 01:50:06'
          },
          {
            id: 8,
            cycle: "1天",
            number: 1,
            limit: "100",
            limitTimes: 5,
            whetherToEnable: "启用",
            date: '2019-02-25 01:50:06'
          },
          {
            id: 9,
            cycle: "1天",
            number: 1,
            limit: "100",
            limitTimes: 5,
            whetherToEnable: "启用",
            date: '2019-02-25 01:50:06'
          }
        ],
        tableKey: [
          {
            label: "序号",
            value: "id",
            width: "50"
          },
          {
            label: "周期",
            value: "cycle",
            width: ""
          },
          {
            label: "笔数",
            value: "number",
            width: ""
          },
          {
            label: "限额",
            value: "limit",
            width: "150"
          },
          {
            label: "限制次数",
            value: "limitTimes",
            width: ""
          },
          {
            label: "是否启用",
            value: "whetherToEnable",
            width: ""
          },
          {
            label: "生效时间",
            value: 'date',
            width:''
          }
        ]
      },
      showdialog: false,
      diaTitle: '',
      data2: [
        {
          type: "cascader",
          prop: "cascader",
          value: "",
          title: "所属机构",
          placeholder: "请选择",
          options: [
            {
              value: "zhinan",
              label: "指南",
              children: [
                {
                  value: "shejiyuanze",
                  label: "设计原则",
                  children: [
                    {
                      value: "yizhi",
                      label: "一致"
                    },
                    {
                      value: "fankui",
                      label: "反馈"
                    }
                  ]
                },
                {
                  value: "daohang",
                  label: "导航",
                  children: [
                    {
                      value: "cexiangdaohang",
                      label: "侧向导航"
                    },
                    {
                      value: "dingbudaohang",
                      label: "顶部导航"
                    }
                  ]
                }
              ]
            },
            {
              value: "zujian",
              label: "组件",
              children: [
                {
                  value: "basic",
                  label: "Basic",
                  children: [
                    {
                      value: "layout",
                      label: "Layout 布局"
                    },
                    {
                      value: "color",
                      label: "Color 色彩"
                    },
                    {
                      value: "typography",
                      label: "Typography 字体"
                    },
                    {
                      value: "icon",
                      label: "Icon 图标"
                    },
                    {
                      value: "button",
                      label: "Button 按钮"
                    }
                  ]
                },
                {
                  value: "form",
                  label: "Form",
                  children: [
                    {
                      value: "radio",
                      label: "Radio 单选框"
                    },
                    {
                      value: "checkbox",
                      label: "Checkbox 多选框"
                    },
                    {
                      value: "input",
                      label: "Input 输入框"
                    },
                    {
                      value: "input-number",
                      label: "InputNumber 计数器"
                    },
                    {
                      value: "select",
                      label: "Select 选择器"
                    },
                    {
                      value: "cascader",
                      label: "Cascader 级联选择器"
                    },
                    {
                      value: "switch",
                      label: "Switch 开关"
                    },
                    {
                      value: "slider",
                      label: "Slider 滑块"
                    },
                    {
                      value: "time-picker",
                      label: "TimePicker 时间选择器"
                    },
                    {
                      value: "date-picker",
                      label: "DatePicker 日期选择器"
                    },
                    {
                      value: "datetime-picker",
                      label: "DateTimePicker 日期时间选择器"
                    },
                    {
                      value: "upload",
                      label: "Upload 上传"
                    },
                    {
                      value: "rate",
                      label: "Rate 评分"
                    },
                    {
                      value: "form",
                      label: "Form 表单"
                    }
                  ]
                },
                {
                  value: "data",
                  label: "Data",
                  children: [
                    {
                      value: "table",
                      label: "Table 表格"
                    },
                    {
                      value: "tag",
                      label: "Tag 标签"
                    },
                    {
                      value: "progress",
                      label: "Progress 进度条"
                    },
                    {
                      value: "tree",
                      label: "Tree 树形控件"
                    },
                    {
                      value: "pagination",
                      label: "Pagination 分页"
                    },
                    {
                      value: "badge",
                      label: "Badge 标记"
                    }
                  ]
                },
                {
                  value: "notice",
                  label: "Notice",
                  children: [
                    {
                      value: "alert",
                      label: "Alert 警告"
                    },
                    {
                      value: "loading",
                      label: "Loading 加载"
                    },
                    {
                      value: "message",
                      label: "Message 消息提示"
                    },
                    {
                      value: "message-box",
                      label: "MessageBox 弹框"
                    },
                    {
                      value: "notification",
                      label: "Notification 通知"
                    }
                  ]
                },
                {
                  value: "navigation",
                  label: "Navigation",
                  children: [
                    {
                      value: "menu",
                      label: "NavMenu 导航菜单"
                    },
                    {
                      value: "tabs",
                      label: "Tabs 标签页"
                    },
                    {
                      value: "breadcrumb",
                      label: "Breadcrumb 面包屑"
                    },
                    {
                      value: "dropdown",
                      label: "Dropdown 下拉菜单"
                    },
                    {
                      value: "steps",
                      label: "Steps 步骤条"
                    }
                  ]
                },
                {
                  value: "others",
                  label: "Others",
                  children: [
                    {
                      value: "dialog",
                      label: "Dialog 对话框"
                    },
                    {
                      value: "tooltip",
                      label: "Tooltip 文字提示"
                    }
                  ]
                }
              ]
            },
            {
              value: "ziyuan",
              label: "资源",
              children: [
                {
                  value: "axure",
                  label: "Axure Components"
                },
                {
                  value: "sketch",
                  label: "Sketch Templates"
                },
                {
                  value: "jiaohu",
                  label: "组件交互文档"
                }
              ]
            }
          ]
        },
        {
          type: "select",
          title: "投注卡类型",
          prop: "cardType",
          options: [
            { label: "类型1", value: "0" },
            { label: "类型2", value: "1" }
          ]
        },
        { type: "input", title: "周期", prop: "text" },
        {
          type: "select",
          title: "",
          prop: "status",
          options: [
            { label: "天", value: "0" },
            { label: "周", value: "1" },
            { label: "月", value: "2" },
            { label: "年", value: "3" }
          ]
        },
        { type: "input", title: "笔数", prop: "text1" },
        { type: "input", title: "限额", prop: "text2" },
        { type: "input", title: "限制次数", prop: "text3" },
        { type: "switch", title: "是否启用", prop: "isShow" },
        {
          type: "datetime-range",
          prop: "date4",
          value: "",
          title: "生效时间",
          options: ["start", "end"]
        }
      ],
      rules2: {
        test: [
          { required: true, validator: rules.checkEmail, trigger: ['change','blur'] }
        ],
        status: [
          { required: true, validator: rules.checkEmpty, trigger: ['change','blur'] }
        ]
      },

    };
  },
  components: {
    "dialog-form": dialogForm
  },
  methods: {
    search(form) {
      console.log("search", form);
    },
    selectBtn () {
      this.$router.push({
        name: 'newRule'
      })
    },
    edit (row) {
      console.log(row);
      this.showdialog = true;
    },
    toDelete (row) {
      console.log(row);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(pageSize) {
      console.log(pageSize);
    },
    handleCurrentChange(currentPage) {
      console.log(currentPage);
    },
    hideDia () {
      this.showdialog = false;
    },
  }
};
</script>

<style lang="less" scoped>
</style>
