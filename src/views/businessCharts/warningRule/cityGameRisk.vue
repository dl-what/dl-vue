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
        style="min-width: 100%"
        :header-cell-style="{background:'rgba(240,240,240,.5)'}"
        :cell-style="{align:'center'}"
        fit
      >
        <el-table-column align="center" label="序号" min-width="60">
          <template slot-scope="scope">
            <div style="text-align:center;">{{scope.$index+1}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="insName" min-width="180" label="区域名称"></el-table-column>
        <el-table-column align="center" prop="gameName" min-width="80" label="游戏"></el-table-column>
        <el-table-column align="center" prop="indexType" min-width="100" label="风险指标">
          <template slot-scope="scope">
            <div v-if="scope.row.indexType===1">最高大奖数量</div>
            <div v-if="scope.row.indexType===2">最高大奖金额</div>
            <div v-if="scope.row.indexType===3">最高兑奖金额</div>
            <div v-if="scope.row.indexType===4">最高返奖率</div>
            <div v-if="scope.row.indexType===5">最低返奖率</div>
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
        <el-table-column align="center" prop="updatedTime" min-width="160" label="更新时间"></el-table-column>
        <el-table-column align="center" property="collectStatus" min-width="60" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.collectStatus===0">生效</span>
            <span v-if="scope.row.collectStatus===1">停止</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="240" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              v-has="'gameRisk-detail'"
              @click.native="detail(scope.row)"
              size="mini"
            >查看</el-button>
            <el-button
              type
              v-has="'gameRisk-update'"
              @click.native="update(scope.row)"
              size="mini"
            >编辑</el-button>
            <el-button
              type="danger"
              v-has="'gameRisk-delete'"
              @click.native="deleteInfo(scope.row)"
              size="mini"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <table-paging
        :current-page="listQuery.pageNum"
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
import informs from "@/utils/inform.js";
export default {
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
          prop: "game",
          value: "",
          title: "游戏",
          placeholder: "请选择游戏",
          options: []
        }
      ],
      controlOptions: [
        {
          name: "新增",
          type: "primary",
          icon: "plus",
          permission: "gameRisk-add"
        }, // type为按钮的五种颜色， icon为具体的图标
        {
          name: "批量新增",
          type: "primary",
          icon: "plus",
          permission: "gameRiskBatch-add"
        }
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
    //金额相关字段展示/100
    toMoneyReal(data, val) {
      if (Array.isArray(data)) {
        data.forEach(v => {
          if (v.indexType == 2 || v.indexType == 3) {
            v[val] = v[val] = v[val] / 100;
          }
        });
      }
      return data;
    },
    //获取游戏下拉框列表
    async getGameLists(options) {
      const self = this;
      const res = await self.$api.getGameLists();
      if (res && res.code == 0) {
        this.searchOptions.forEach(v => {
          if (v.prop === "game") {
            res.data.forEach(v => {
              v.value = v.gameId;
              v.label = v.gameName;
            });
            v.options = res.data;
          }
        });
      }
    },
    //获取游戏风险指标列表
    async getGameRiskList() {
      const self = this;
      const res = await self.$api.getGameRiskList({
        data: this.listQuery
      });
      if (res && res.code == 0) {
        res.data.records.forEach(v => {
          if (v.indexType == 4 || v.indexType == 5) {
            v.ordinary = informs.conventToPercent(v.ordinary);
            v.serious = informs.conventToPercent(v.serious);
            v.major = informs.conventToPercent(v.major);
          }
        });
        let data = res.data.records;
        // 需要把百分制金额 除于 100 的字段
        let moneyArray = ["ordinary", "serious", "major"];
        moneyArray.forEach(item => {
          data = self.toMoneyReal(data, item);
        });
        self.tableData = data;
        self.totalCount = res.data.total;
      }
    },
    //点击删除
    deleteInfo(row) {
      this.$confirm(`确定要删除这条数据吗? `, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.gameRiskDelete(row.businessKey);
        })
        .catch(() => {});
    },
    //删除
    async gameRiskDelete(id) {
      const res = await this.$api.gameRiskDelete({
        data: {
          businessKey: id
        }
      });
      if (res && res.code == 0) {
        this.$message({
          type: "success",
          message: "删除成功!"
        });
        this.getGameRiskList();
      } else {
        // this.$message({
        //   type: "info",
        //   message: "删除失败"
        // });
      }
    },
    //页数改变事件
    pageSizeChange(pageSize) {
      this.listQuery.pageSize = pageSize;
      this.listQuery.pageNum = 1;
      this.getGameRiskList();
    },
    //页码改变事件
    pageCurrentChange(currentPage) {
      this.listQuery.pageNum = currentPage;
      this.getGameRiskList();
    },
    //查询
    search(form) {
      this.listQuery.pageNum = 1;
      this.listQuery.param = {
        gameId: form.game,
        insId: form.insId ? form.insId[form.insId.length - 1] : ""
      };
      this.getGameRiskList();
    },
    //跳转
    selectBtn(val) {
      if (val.name === "新增") {
        this.$router.push({
          name: "gameRiskAdd"
        });
      }
      if (val.name === "批量新增") {
        this.$router.push({
          name: "gameRiskAdd",
          query: {
            type: 1
          }
        });
      }
    },
    //跳转详情页
    detail(row) {
      this.$router.push({
        name: "gameRiskDetail",
        query: {
          id: row.businessKey
        }
      });
    },
    //跳转编辑页
    update(row) {
      this.$router.push({
        name: "gameRiskEdit",
        query: {
          id: row.businessKey
        }
      });
    },
    //递归绑定机构名称
    async queryInsTree() {
      let res = await this.$api.queryInsTree();
      if (res && res.code == 0) {
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
    }
  },
  mounted() {
    this.getGameRiskList();
    this.getGameLists();
    this.queryInsTree();
  },
  created() {}
};
</script>

<style  lang="less" scoped>
/deep/.el-table td,
.el-table th {
  padding: 8px 0;
}
</style>
