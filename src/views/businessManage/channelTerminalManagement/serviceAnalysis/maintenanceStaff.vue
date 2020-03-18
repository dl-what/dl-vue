<!-- 维修员 -->
<template>
  <div class="vlt-card-child">
    <search-bar
      class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      :total="999"
      labelWidth="6em"
    ></search-bar>
    <analysisCard :list="serviceList" :tableDatas="datas"></analysisCard>
  </div>
</template>

<script type="text/javascript">
import analysisCard from "@/views/businessManage/channelTerminalManagement/components/analysisCard";
export default {
  name: "maintenanceStaff",
  data() {
    return {
      // 搜索组件配置
      searchOptions: [
        {
          type: "input",
          prop: "inputName",
          value: "",
          title: "姓名",
          placeholder: "请输入"
        },
        {
          type: "select",
          prop: "selectName",
          value: "",
          title: "所属机构",
          placeholder: "请选择",
          options: [
            {
              label: "类型1",
              value: 1
            },
            {
              label: "类型2",
              value: 2
            }
          ]
        },
        {
          type: "select",
          prop: "selectName2",
          value: "",
          title: "排行",
          placeholder: "按工单完成总量排行",
          options: [
            {
              label: "完成总量排行",
              value: 1
            },
            {
              label: "完成率排行",
              value: 2
            },
            {
              label: "工单完成时效排行",
              value: 3
            }
          ]
        }
      ],
      serviceList: {
        type: "1",
        dataList: [
          {
            id: 0,
            avatar: require("@/assets/img/avatar.jpg"),
            name: "张三",
            tel: "13500001111",
            address: "乌鲁木齐市",
            descList: [
              {
                id: 0,
                name: "工单完成量",
                number: "76"
              },
              {
                id: 1,
                name: "贡献知识库",
                number: "39"
              },
              {
                id: 2,
                name: "平均响应时间",
                number: "4h"
              }
            ]
          },
          {
            id: 1,
            avatar: require("@/assets/img/avatar.jpg"),
            name: "张三",
            tel: "13500001111",
            address: "乌鲁木齐市",
            descList: [
              {
                id: 0,
                name: "工单完成量",
                number: "76"
              },
              {
                id: 1,
                name: "贡献知识库",
                number: "39"
              },
              {
                id: 2,
                name: "平均响应时间",
                number: "4h"
              }
            ]
          },
          {
            id: 2,
            avatar: require("@/assets/img/avatar.jpg"),
            name: "张三",
            tel: "13500001111",
            address: "乌鲁木齐市",
            descList: [
              {
                id: 0,
                name: "工单完成量",
                number: "76"
              },
              {
                id: 1,
                name: "贡献知识库",
                number: "39"
              },
              {
                id: 2,
                name: "平均响应时间",
                number: "4h"
              }
            ]
          },
          {
            id: 3,
            avatar: require("@/assets/img/avatar.jpg"),
            name: "张三",
            tel: "13500001111",
            address: "乌鲁木齐市",
            descList: [
              {
                id: 0,
                name: "工单完成量",
                number: "76"
              },
              {
                id: 1,
                name: "贡献知识库",
                number: "39"
              },
              {
                id: 2,
                name: "平均响应时间",
                number: "4h"
              }
            ]
          },
          {
            id: 4,
            avatar: require("@/assets/img/avatar.jpg"),
            name: "张三",
            tel: "13500001111",
            address: "乌鲁木齐市",
            descList: [
              {
                id: 0,
                name: "工单完成量",
                number: "76"
              },
              {
                id: 1,
                name: "贡献知识库",
                number: "39"
              },
              {
                id: 2,
                name: "平均响应时间",
                number: "4h"
              }
            ]
          },
          {
            id: 5,
            avatar: require("@/assets/img/avatar.jpg"),
            name: "张三",
            tel: "13500001111",
            address: "乌鲁木齐市",
            descList: [
              {
                id: 0,
                name: "工单完成量",
                number: "76"
              },
              {
                id: 1,
                name: "贡献知识库",
                number: "39"
              },
              {
                id: 2,
                name: "平均响应时间",
                number: "4h"
              }
            ]
          }
        ]
      },
      datas: {
        tableData: [
          {
            id: 0,
            area: "广东省",
            name: "王小虎",
            time: "4",
            completion: "50%",
            contribution: 200,
            totalOders: 200,
            pendingWork: 100,
            processedWork: 100
          },
          {
            id: 1,
            area: "广东省",
            name: "王小虎",
            time: "4",
            completion: "50%",
            contribution: 200,
            totalOders: 200,
            pendingWork: 100,
            processedWork: 100
          },
          {
            id: 2,
            area: "广东省",
            name: "王小虎",
            time: "4",
            completion: "50%",
            contribution: 200,
            totalOders: 200,
            pendingWork: 100,
            processedWork: 100
          },
          {
            id: 3,
            area: "广东省",
            name: "王小虎",
            time: "4",
            completion: "50%",
            contribution: 200,
            totalOders: 200,
            pendingWork: 100,
            processedWork: 100
          },
          {
            id: 4,
            area: "广东省",
            name: "王小虎",
            time: "4",
            completion: "50%",
            contribution: 200,
            totalOders: 200,
            pendingWork: 100,
            processedWork: 100
          },
          {
            id: 5,
            area: "广东省",
            name: "王小虎",
            time: "4",
            completion: "50%",
            contribution: 200,
            totalOders: 200,
            pendingWork: 100,
            processedWork: 100
          },
          {
            id: 6,
            area: "广东省",
            name: "王小虎",
            time: "4",
            completion: "50%",
            contribution: 200,
            totalOders: 200,
            pendingWork: 100,
            processedWork: 100
          },
          {
            id: 7,
            area: "广东省",
            name: "王小虎",
            time: "4",
            completion: "50%",
            contribution: 200,
            totalOders: 200,
            pendingWork: 100,
            processedWork: 100
          },
          {
            id: 8,
            area: "广东省",
            name: "王小虎",
            time: "4",
            completion: "50%",
            contribution: 200,
            totalOders: 200,
            pendingWork: 100,
            processedWork: 100
          },
          {
            id: 9,
            area: "广东省",
            name: "王小虎",
            time: "4",
            completion: "50%",
            contribution: 200,
            totalOders: 200,
            pendingWork: 100,
            processedWork: 100
          }
        ],
        tableKey: [
          {
            label: "序号",
            value: "id",
            width: '80'
          },
          {
            label: "姓名",
            value: "name",
            width: '120'
          },
          {
            label: "所属区域",
            value: "area",
            width: ''
          },
          {
            label: "已处理工单",
            value: "processedWork",
            width: '100'
          },
          {
            label: "待处理工单",
            value: "pendingWork",
            width: '100'
          },
          {
            label: "工单总数",
            value: "totalOders",
            width: '100'
          },
          {
            label: "贡献知识库",
            value: "contribution",
            width: '100'
          },
          {
            label: "完成率",
            value: "completion",
            width: '100'
          },
          {
            label: "平均响应时间（小时）",
            value: "time",
            width: ''
          }
        ]
      }
    };
  },
  components: {
    analysisCard
  },
  methods: {
    search(form) {
      console.log("search", form);
    },
    getList() {
      console.log("GetList");
    }
  }
};
</script>

<style lang="less" scoped>
</style>
