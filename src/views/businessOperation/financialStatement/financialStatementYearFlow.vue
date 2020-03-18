<template>
  <div class="vlt-card">
    <div class="FinancialYearFlow">
      <search-bar :options="FinancialYearOptions" :total="999">
        <control-bar
          slot="extend-bar"
          @select="FinancialYearSelectBtn"
          :options="FinancialYearOptionsBtn"
          position="left"
        ></control-bar>
      </search-bar>
      <el-table :data="YearFlowTableData" border show-summary>
        <el-table-column prop="YearFlowCity" label="城市名称"></el-table-column>
        <el-table-column label="收入项">
          <el-table-column prop="YearFlowSell" label="售卡金额"></el-table-column>
          <el-table-column prop="YearFlowTop" label="奖金充值"></el-table-column>
          <el-table-column prop="YearFlowIncome" label="收入小计"></el-table-column>
        </el-table-column>
        <el-table-column label="支出项">
          <el-table-column prop="YearFlowReturn" label="退卡金额"></el-table-column>
          <el-table-column prop="YearFlowSale" label="销售额"></el-table-column>
          <el-table-column prop="YearFlowExpend" label="支出小计"></el-table-column>
        </el-table-column>
        <el-table-column prop="YearFlowIncomeExpend" label="收支余额"></el-table-column>
      </el-table>
      <div class="table_paging">
        <tablePaging class="table_paging_right" :total="99" :currentPage="1" :pageSize="10"></tablePaging>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "",
  data() {
    return {
      //表格数据
      YearFlowTableData: [
        {
          YearFlowCity: "13213",
          YearFlowSell: "13213",
          YearFlowTop: "13213",
          YearFlowIncome: "13213",
          YearFlowReturn: "13213",
          YearFlowSale: "13213",
          YearFlowExpend: "13213",
          YearFlowIncomeExpend: "13213"
        }
      ],
      //搜索框类型
      FinancialYearOptions: [
        {
          title: "选择年份",
          type: "year",
          prop: "YearSettleYear",
          value: ""
        },
        {
          type: "cascader",
          prop: "YearSettleArea",
          value: "",
          title: "区域",
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
                    },
                    {
                      value: "xiaolv",
                      label: "效率"
                    },
                    {
                      value: "kekong",
                      label: "可控"
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
                    },
                    {
                      value: "popover",
                      label: "Popover 弹出框"
                    },
                    {
                      value: "card",
                      label: "Card 卡片"
                    },
                    {
                      value: "carousel",
                      label: "Carousel 走马灯"
                    },
                    {
                      value: "collapse",
                      label: "Collapse 折叠面板"
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
        }
      ],
      //按钮类型
      FinancialYearOptionsBtn: [
        { name: "打印", type: "primary", icon: "printer" },
        { name: "导出", type: "", icon: "s-promotion" }
      ]
    };
  },
  components: {},
  methods: {
    //按钮类型选择
    FinancialYearSelectBtn(val) {
      if (val.name == "打印") {
        this.$router.push("PrintYearFlow");
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>
