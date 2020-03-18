<template>
  <div class="vlt-card">
    <div class="MonthAllocation">
      <search-bar :options="MonthAllocationOptions" :total="999" labelWidth="8em">
        <control-bar
          slot="extend-bar"
          @select="MonthAllocationSelectBtn"
          :options="MonthAllocationOptionsBtn"
          position="left"
        ></control-bar>
      </search-bar>
      <el-table :data="MonthAllocationTableData" border show-summary>
        <el-table-column prop="MonthAllocationCity" label="城市名称"></el-table-column>
        <el-table-column prop="MonthAllocationSale" label="销售额"></el-table-column>
        <el-table-column label="奖金">
          <el-table-column prop="MonthAllocationReturnMoney" label="反奖奖金"></el-table-column>
          <el-table-column prop="MonthAllocationAdjust" label="调节基金"></el-table-column>
          <el-table-column prop="MonthAllocationBonusTotal" label="合计"></el-table-column>
        </el-table-column>
        <el-table-column label="业务费">
          <el-table-column prop="MonthAllocationLottery" label="中彩中心"></el-table-column>
          <el-table-column prop="MonthAllocationProvincial" label="省级"></el-table-column>
          <el-table-column prop="MonthAllocationPrefecture" label="地市"></el-table-column>
          <el-table-column prop="MonthAllocationBusiness" label="合计"></el-table-column>
        </el-table-column>
        <el-table-column prop="MonthAllocationPublicBenefit" label="公益金"></el-table-column>
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
      MonthAllocationTableData: [
        {
          MonthAllocationCity: "13213",
          MonthAllocationSale: "13213",
          MonthAllocationReturnMoney: "13213",
          MonthAllocationAdjust: "13213",
          MonthAllocationBonusTotal: "13213",
          MonthAllocationLottery: "13213",
          MonthAllocationProvincial: "13213",
          MonthAllocationPrefecture: "13213",
          MonthAllocationBusiness: "13213",
          MonthAllocationPublicBenefit: "13213"
        }
      ],
      //搜索框类型
      MonthAllocationOptions: [
        {
          title: "选择月份",
          type: "month",
          prop: "MonthSettleMonth",
          value: ""
        },
        {
          type: "cascader",
          prop: "MonthSettleArea",
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
      //打印按钮类型
      MonthAllocationOptionsBtn: [
        { name: "打印", type: "primary", icon: "printer" },
        { name: "导出", type: "", icon: "s-promotion" }
      ]
    };
  },
  components: {},
  methods: {
    //打印按钮类型选择
    MonthAllocationSelectBtn(val) {
      if (val.name == "打印") {
        this.$router.push("PrintMonthAllocation");
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>
