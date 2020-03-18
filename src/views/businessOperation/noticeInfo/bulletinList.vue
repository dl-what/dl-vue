<template>
  <div class="vlt-card">
    <search-bar
      class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      :total="total"
      labelWidth="6em"
    >
      <el-button
        slot="extend-bar"
        v-has="'bulletinList-add'"
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="addBulletin">
        发布公告
      </el-button>
    </search-bar>

    <el-table :data="tableData" border style="width: 100%; margin-top: 10px;">
      <el-table-column type="index" width="60px" label="序号">
        <template slot-scope="scope">{{pageSize*(page-1)+(scope.$index+1)}}</template>
      </el-table-column>
      <el-table-column prop="noticeName" label="公告名称" min-width="110"></el-table-column>
      <el-table-column prop="templateName" label="公告模板" show-overflow-tooltip min-width="120"></el-table-column>
      <el-table-column prop="noticeType" label="公告类型" min-width="100">
        <template slot-scope="scope">{{scope.row.noticeType===1?"缺省":"插播"}}</template>
      </el-table-column>
      <el-table-column prop="publishStatus" label="发布状态" min-width="100">
        <template slot-scope="scope">
          <span
            class="icon-circle"
            :class="{
              blue:scope.row.publishStatus=='1',
              green:scope.row.publishStatus=='2',
              grey:scope.row.publishStatus=='5',
              yellow:scope.row.publishStatus=='4',
              red:scope.row.publishStatus=='3',
              }"
          >{{scope.row.strPublishStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="managerialType" label="管理层级" min-width="100">
        <template slot-scope="scope">{{changeType(scope.row.managerialType,'managerialType')}}</template>
      </el-table-column>
      <el-table-column label="公告周期" min-width="200">
        <template slot-scope="scope">
          <span>{{scope.row.periodStartTime+" ~ "+ scope.row.periodEndTime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="noticeInsName" label="所属机构" show-overflow-tooltip min-width="120"></el-table-column>
      <el-table-column prop="noticeChannel" label="公告对象" show-overflow-tooltip min-width="120"></el-table-column>

      <el-table-column fixed="right" label="操作" align="center" min-width="240">
        <template slot-scope="scope">
          <el-button
            :id="$route.name + '-' + 'detail' + scope.$index"
            v-has="'bulletinList-detail'"
            type="primary"
            size="mini"
            @click="bulletinDetail(scope.row.id)"
          >查看</el-button>
          <el-button
            :id="$route.name + '-' + 'edit' + scope.$index"
            v-has="'bulletinList-edit'"
            type="warning"
            size="mini"
            @click="bulletinEdit(scope.row.id)"
            :disabled="scope.row.publishStatus==2||scope.row.publishStatus==4||!scope.row.isAuth"
          >编辑</el-button>
          <el-button
            :id="$route.name + '-' + 'disable' + scope.$index"
            v-has="'bulletinList-disable'"
            type="danger"
            size="mini"
            :disabled="scope.row.publishStatus!==2||!scope.row.isAuth"
            @click="editFlag(scope.row, 1)"
          >停用</el-button>
          <el-button
            :id="$route.name + '-' + 'enable' + scope.$index"
            v-has="'bulletinList-enable'"
            type="success"
            size="mini"
            :disabled="scope.row.publishStatus!==3||!scope.row.isAuth"
            @click="editFlag(scope.row,0)"
          >启用</el-button>
        </template>
      </el-table-column>
    </el-table>

    <table-paging
      :current-page="page"
      :page-size="pageSize"
      :total="total"
      @handleSizeChange="pageSizeChange"
      @handleCurrentChange="pageCurrentChange"
    ></table-paging>
  </div>
</template>

<script type="text/javascript">
import { mapGetters } from "vuex";
import { async } from "q";
export default {
  name: "bulletinList",
  data() {
    return {
      total: 0,
      page: 1,
      pageSize: 20,
      param: {},
      searchOptions: [
        { title: "公告名称", type: "input", prop: "noticeName", value: "" },
        {
          title: "公告模板",
          type: "select",
          prop: "templateId",
          value: "",
          options: []
        },
        {
          title: "公告对象",
          type: "select",
          prop: "noticeChannel",
          value: "",
          options: []
        },
        {
          title: "发布状态",
          type: "select",
          prop: "publishStatus",
          value: "",
          options: [
            {
              label: "待公告",
              value: 1
            },
            {
              label: "已公告",
              value: 2
            },
            {
              label: "已停用",
              value: 3
            },
            {
              label: "已过期",
              value: 4
            }
          ]
        },
        {
          type: "cascader",
          prop: "noticeIns",
          value: "",
          title: "所属机构",
          options: this.insData,
          setProps: {
            label: "text",
            value: "id",
            children: "children",
            checkStrictly: true //父子节点选中关联
          }
        },
        {
          title: "公告周期",
          type: "datepicker-range",
          prop: "periodTime",
          value: ""
        },
        {
          title: "公告类型",
          type: "select",
          prop: "noticeType",
          value: "",
          options: [
            {
              label: "缺省",
              value: 1
            },
            {
              label: "插播",
              value: 2
            }
          ]
        }
      ],
      insData: [],
      tableData: [],
      editData: {}
    };
  },

  watch: {
    insData: {
      handler(val, oldVal) {
        this.$set(this.searchOptions[4], "options", val);
      },
      deep: true
    }
  },
  // computed: {
  //   ...mapGetters(["insData"])
  // },
  created() {
    this.init();
    this.queryNoticeInsInfo();
    //机构数据
    this.$set(this.searchOptions[4], "options", this.insData);
    //大厅数据
    this.queryNoticeMmanagerial();
  },

  methods: {
    // 获取公告所属机构
    async queryNoticeInsInfo() {
      const res = await this.$api.queryNoticeInsInfo();
      if (res && res.code === 0) {
        this.insData = res.data || [];
      }
    },
    //获取全部公告模板数据
    async queryAllTemplate() {
      let res = await this.$api.queryAllTemplate();
      if (res && res.code === 0) {
        this.searchOptions[1].options = res.data.map(item => {
          return { label: item.templateName, value: item.templateId };
        });
      }
    },
    async queryNoticeMmanagerial() {
      let res = await this.$api.queryNoticeMmanagerial({ data: 4 });
      if (res && res.code === 0) {
        this.searchOptions[2].options = res.data.map(item => {
          return { label: item.name, value: item.code };
        });
      }
    },
    //列表数据
    async init(val) {
      let res = await this.$api.queryNoticePublishList({
        data: {
          page: val || 1,
          pageSize: this.pageSize,
          param: {
            ...this.param
          }
        }
      });

      if (res && res.code === 0) {
        this.total = res.data.total;
        this.page = res.data.current;
        let options = {
          1: "待公告",
          2: "已公告",
          3: "已停用",
          4: "已过期"
        };

        res.data.records.forEach(val => {
          val.templateName = val.templateList
            .map(item => {
              return item.templateName;
            })
            .join(" , ");
          val.periodStartTime = this.$moment(val.periodStartTime).format(
            "YYYY-MM-DD"
          );
          val.periodEndTime = this.$moment(val.periodEndTime).format(
            "YYYY-MM-DD"
          );
          if (val.noticeInsName) {
            val.noticeInsName = val.noticeInsName.slice(1);
          }
          if (val.noticeChannel) {
            val.noticeChannel = val.noticeChannel.slice(
              1,
              val.noticeChannel.length - 1
            );
          }
          val.strPublishStatus = options[val.publishStatus];
        });
        console.log(res.data);
        this.tableData = res.data.records;

        if (this.tableData.length) {
          this.queryAllTemplate();
        }
      }
    },

    //停用启用
    editFlag(row, flag) {
      // console.log(row);
      let msg = flag == 1 ? "请确认是否停用该公告" : "请确认是否启用该公告";
      let msgSucess = flag == 1 ? "已停用" : "已启用";
      this.$confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let editData = {
            noticeType: row.noticeType,
            status: flag,
            id: row.id
          };
          let res = await this.$api.NoticeEditFlag({
            message: msgSucess,
            data: { ...editData }
          });
          if (res && res.code === 0) {
            row.publishStatus = flag == 1 ? 3 : 2;
            this.init();
          } else {
            row.publishStatus = flag == 1 ? 2 : 3;
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },

    addBulletin() {
      this.$router.push({ path: "addBullentin" });
    },

    bulletinDetail(id) {
      this.$router.push({ path: "bulletinDetail", query: { id: id } });
    },
    bulletinEdit(id) {
      this.$router.push({ path: "bulletinEdit", query: { id: id } });
    },
    changeType(val, type) {
      if (type == "publishStatus") {
        let options = {
          1: "待公告",
          2: "已公告",
          3: "已停用",
          4: "已过期"
        };

        return options[val];
      }
      if (type == "managerialType") {
        let options = {
          1: "全国",
          2: "省级",
          3: "地市",
          4: "大厅"
        };

        return options[val];
      }
    },

    search(val) {
      this.param = val;
      if (val.periodTime) {
        this.param.startTime = this.$moment(val.periodTime[0]).format(
          "YYYY-MM-DD HH:mm:ss"
        );

        this.param.endTime = this.$moment(val.periodTime[1]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      }
      if (val.noticeIns) {
        this.param.noticeIns = val.noticeIns
          .slice(val.noticeIns.length - 1)
          .join("");
      }
      delete this.param.periodTime;
      this.init();
    },
    pageSizeChange(size) {
      this.pageSize = size;
      this.init();
    },
    pageCurrentChange(page) {
      this.init(page);
    }
  }
};
</script>

<style lang="less" scoped>
</style>
