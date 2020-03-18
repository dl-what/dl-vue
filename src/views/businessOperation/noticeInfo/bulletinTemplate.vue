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
        :id="$route.name + '-' + 'add'"
        slot="extend-bar"
        v-has="'bulletinTemplate-add'"
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="createTemplate"
      >新建模板
        <!-- <i class="el-icon-plus">新建模板</i> -->
      </el-button>
    </search-bar>

    <el-table :data="tableData" border style="margin-top: 10px;">
      <el-table-column type="index" width="60px" label="序号">
        <template slot-scope="scope">{{pageSize*(page-1)+(scope.$index+1)}}</template>
      </el-table-column>
      <el-table-column prop="templateName" label="模板名称"></el-table-column>
      <el-table-column prop="noticeType" label="公告类型"></el-table-column>
      <el-table-column prop="channelType" label="渠道类型"></el-table-column>
      <el-table-column prop="contentForm" label="内容形式">
        <template slot-scope="scope">
          <span
            class="icon-tag"
            :class="{
            blue:scope.row.contentForm=='1',
            green:scope.row.contentForm=='2',
            grey:scope.row.contentForm=='5',
            yellow:scope.row.contentForm=='4',
            red:scope.row.contentForm=='3',
            }"
          >{{scope.row.strContentForm}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="模板备注"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            :id="$route.name + '-' + 'detail' + scope.$index"
            v-has="'bulletinTemplate-detail'"
            type="primary"
            size="mini"
            @click="templateDetail(scope.row.templateId)"
          >查看</el-button>
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
export default {
  name: "bulletinTemplate",
  data() {
    return {
      total: 0,
      page: 1,
      pageSize: 20,
      current: 0,
      param: {},
      searchOptions: [
        { title: "模板名称", type: "input", prop: "templateName", value: "" },
        {
          title: "公告类型",
          type: "select",
          prop: "noticeType",
          value: "",
          options: []
        },

        {
          title: "内容形式",
          type: "select",
          prop: "contentForm",
          value: "",
          options: [
            {
              label: "文字",
              value: 1
            },
            {
              label: "图片",
              value: 2
            },
            {
              label: "视频",
              value: 3
            },
            {
              label: "走马灯",
              value: 4
            }
          ]
        }
      ],
      tableData: []
    };
  },
  created() {
    this.init();
    this.querytemplateType();
  },
  methods: {
    //查询公告类型
    async querytemplateType() {
      let res = await this.$api.querytemplateType();
      if (res && res.code === 0) {
        this.searchOptions[1].options = res.data;
      }
    },
    //获取列表数据
    async init(val) {
      let res = await this.$api.queryTemplateList({
        data: {
          page: val || 1,
          pageSize: this.pageSize,
          param: {
            ...this.param
          }
        }
      });
      // console.log(res);
      if (res && res.code === 0) {
        this.tableData = res.data.records;
        this.total = res.data.total;
        let options = {
          1: "文字",
          2: "图片",
          3: "视频",
          4: "走马灯"
        };
        this.tableData.forEach(item => {
          item.noticeType = this.changeType(item.noticeType, 1);
          item.channelType = this.changeType(item.channelType, 2);
          item.strContentForm = options[item.contentForm];
          if (!item.contentForm) {
            item.strContentForm = "富文本";
          }
        });
      }
    },

    search(val) {
      this.param = val;
      this.init();
    },
    changeType(val, num) {
      if (num === 1) {
        var options = {
          1: "新游戏发行",
          2: "拉新提醒",
          3: "活动新建"
        };
      }
      if (num === 2) {
        options = {
          1: "线上渠道",
          2: "线下渠道"
        };
      }
      if (num === 3) {
        options = {
          1: "文字",
          2: "图片",
          3: "视频",
          4: "走马灯"
        };
      }

      return options[val];
    },
    templateDetail(id) {
      this.$router.push({ path: "templateDetail", query: { id } });
    },
    createTemplate() {
      this.$router.push({ path: "createTemplate" });
    },
    pageSizeChange(size) {
      this.pageSize = size;
      this.init();
    },
    pageCurrentChange(page) {
      this.current = page;
      this.init(page);
    }
  }
};
</script>

<style lang="less" scoped>
</style>
