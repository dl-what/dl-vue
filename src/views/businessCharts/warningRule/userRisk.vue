<template>
  <div class="vlt-card">
    <section class="comp-item">
      <search-bar
        :showHandler="true"
        ref="searchForm"
        class="search-bar-demo"
        @search="search"
        :options="searchOptions"
        :total="totalCount"
        labelWidth="70px"
      >
        <control-bar
          @select="selectBtn"
          slot="extend-bar"
          :options="controlOptions"
          position="left"
        ></control-bar>
      </search-bar>
    </section>
    <div>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        :header-cell-style="{background:'rgba(240,240,240,.5)'}"
        :cell-style="{align:'center'}"
      >
        <el-table-column align="center" label="序号" min-width="60">
          <template slot-scope="scope">
            <div style="text-align:center;">{{scope.$index+1}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="insName" min-width="180" label="区域名称"></el-table-column>
        <el-table-column align="center" min-width="60" label="类型">
          <template slot-scope="scope">
            <div v-if="scope.row.type==1">投注卡</div>
            <div v-if="scope.row.type==2">会员</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="indexType" min-width="140" label="风险指标">
          <template slot-scope="scope">
            <div v-if="scope.row.indexType===1">投注警告用户数</div>
            <div v-if="scope.row.indexType===2">充值警告用户数</div>
            <div v-if="scope.row.indexType===3">投注时长警告用户数</div>
            <div v-if="scope.row.indexType===4">投注限制用户数</div>
            <div v-if="scope.row.indexType===5">充值限制用户数</div>
            <div v-if="scope.row.indexType===6">投注时长限制用户数</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="ordinary" label="Ⅲ级">
          <template slot-scope="scope">
            <span>{{scope.row.ordinary||'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="serious" label="Ⅱ级">
          <template slot-scope="scope">
            <span>{{scope.row.serious||'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="major" label="Ⅰ级">
          <template slot-scope="scope">
            <span>{{scope.row.major||'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="updateTime" min-width="160" label="更新时间"></el-table-column>
        <el-table-column align="center" prop="collectStatus" min-width="60" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.collectStatus===0">生效</span>
            <span v-if="scope.row.collectStatus===1">停止</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="240px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              v-has="'userRisk-detail'"
              @click.native="detail(scope.row)"
              size="mini"
            >查看</el-button>
            <el-button
              type
              v-has="'userRisk-update'"
              @click.native="update(scope.row)"
              size="mini"
            >编辑</el-button>
            <el-button
              type="danger"
              v-has="'userRisk-delete'"
              @click.native="deleteInfo(scope.row)"
              size="mini"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <table-paging
        :current-page="1"
        :page-size="20"
        :total="totalCount"
        @handleSizeChange="pageSizeChange"
        @handleCurrentChange="pageCurrentChange"
      ></table-paging>
    </div>
  </div>
</template>

<script>
import city from "@/libs/map/city.json";
export default {
  name: "userRisk",
  data() {
    return {
      treeName: [],
      totalCount: 0,
      searchOptions: [
        {
          type: "cascader",
          prop: "insId",
          value: "",
          title: "所在区域",
          options: [],
          setProps: { value: "id", label: "text", checkStrictly: true }
        },
        {
          type: "select",
          prop: "type",
          value: "",
          title: "类型",
          placeholder: "请选择",
          options: [
            {
              label: "投注卡",
              value: 1
            },
            {
              label: "会员",
              value: 2
            }
          ]
        }
      ],
      controlOptions: [
        {
          name: "新增",
          type: "primary",
          icon: "plus",
          permission: "userRisk-add"
        },
        {
          name: "批量新增",
          type: "primary",
          icon: "plus",
          permission: "userRiskBatch-add"
        } 
        // type为按钮的五种颜色， icon为具体的图标
      ],
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        param: {}
      },
      tableData: []
    };
  },
  methods: {
    //页数改变事件
    pageSizeChange(pageSize) {
      this.listQuery.limit = pageSize;
      this.getUserRisk(this.listQuery);
    },
    //页码改变事件
    pageCurrentChange(currentPage) {
      this.listQuery.pageNum = currentPage;
      this.getUserRisk(this.listQuery);
    },
    //查询事件
    search(form) {
      console.log("search", form);
      this.listQuery.param = {
        type: form.type,
        insId:form.insId?form.insId[form.insId.length-1]:''
      };
      this.getUserRisk();
    },
    //删除事件
    deleteInfo(row) {
      this.$confirm(`确定要删除这条数据吗? `, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteUserRisk(row.businessKey);
        })
        .catch(() => {});
    },
    //删除方法
    async deleteUserRisk(id) {
      const res = await this.$api.deleteUserRisk({
        data: {
          businessKey: id
        }
      });
      if (res && res.code == 0) {
        this.$message({
          type: "success",
          message: "删除成功!"
        });
        this.getUserRisk(this.listQuery);
      }
    },
    //新增和批量新增
    selectBtn(val) {
      if (val.name === "新增") {
        this.$router.push({
          name: "userRiskAdd"
        });
      }
      if (val.name === "批量新增") {
        this.$router.push({
          name: "userRiskAdd",
          query: {
          type: 1
        }
        });
      }
    },
    //跳转详情页
    detail(row) {
      this.$router.push({
        name: "userRiskDetail",
        query: {
          id: row.businessKey
        }
      });
    },
    //递归绑定树形机构
    async queryInsTree() {
      let res = await this.$api.queryInsTree();
      if (res.data && res.code == 0) {
        this.setLabelAndValue(res.data);
      }
    },
    setLabelAndValue(area) {
      area.forEach(v => {
        if (v.children) {
          this.setLabelAndValue(v.children);
        }
      });
      this.searchOptions.forEach(v => {
        if (v.type === "cascader") {
          v.options = area;
        }
      });
    },
    //跳转编辑页
    update(row) {
      this.$router.push({
        name: "userRiskEdit",
        query: {
          id: row.businessKey
        }
      });
    },
    //获取用户风险指标列表
    async getUserRisk() {
      const self = this;
      const res = await self.$api.getUserRisk({
        data: this.listQuery
      });
      if (res && res.code == 0) {
        console.log(res);
        this.totalCount = res.data.total;
        this.tableData = res.data.records;
      }
    }
  },
  created() {
    
  },
  mounted() {
   this.getUserRisk();
    this.queryInsTree();
  }
};
</script>

<style  lang="less" scoped>
/deep/.el-table td,
.el-table th {
  padding: 8px 0;
}
</style>
