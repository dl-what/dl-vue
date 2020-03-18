<template>
  <div class="vlt-card">
    <section class="comp-item">
      <search-bar
        :showHandler="true"
        class="search-bar-demo"
        @search="search"
        :options="searchOptions"
        :total="totalCount"
        labelWidth="40px"
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
        <el-table-column align="center" label="序号" min-width="65">
          <template slot-scope="scope">
            <div style="text-align:center;">{{scope.$index+1}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="gameName" min-width="120" label="游戏"></el-table-column>
        <el-table-column align="center" prop="jackpotPoolId" label="奖池"></el-table-column>
        <el-table-column align="center" prop="indexType" min-width="120" label="风险指标">
          <template slot-scope="scope">
            <div v-if="scope.row.indexType===1">最高奖池金额</div>
            <div v-if="scope.row.indexType===2">最低奖池金额</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="ordinary" min-width="120" label="Ⅲ级">
          <template slot-scope="scope">
            <span>{{scope.row.ordinary||'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="serious" min-width="120" label="Ⅱ级">
          <template slot-scope="scope">
            <span>{{scope.row.serious||'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="major" min-width="120" label="Ⅰ级">
          <template slot-scope="scope">
            <span>{{scope.row.major||'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="updatedTime" width="160" label="更新时间"></el-table-column>
        <el-table-column align="center" prop="collectStatus" min-width="60" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.collectStatus===0">生效</span>
            <span v-if="scope.row.collectStatus===1">停止</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="240" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              v-has="'pondRisk-detail'"
              @click.native="detail(scope.row)"
              size="mini"
            >查看</el-button>
            <el-button
              type
              v-has="'pondRisk-update'"
              @click.native="update(scope.row)"
              size="mini"
            >编辑</el-button>
            <el-button
              type="danger"
              v-has="'pondRisk-delete'"
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
export default {
  name: "areaDeal",
  data() {
    return {
      totalCount: 0,
      searchOptions: [
        {
          type: "select",
          prop: "gameId",
          value: "",
          title: "游戏",
          placeholder: "请选择游戏",
          options: [
            {
              label: "选项1",
              value: 1
            },
            {
              label: "选项2",
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
          permission: "pondRisk-add"
        } // type为按钮的五种颜色， icon为具体的图标
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
    //获取游戏下拉数据
    async getGameLists(options) {
      const self = this;
      const res = await self.$api.getGameLists();
      if (res && res.code == 0) {
        this.searchOptions.forEach(v => {
          if (v.prop === "gameId") {
            res.data.forEach(v => {
              v.value = v.gameId;
              v.label = v.gameName;
            });
            v.options = res.data;
          }
        });
      }
    },
    //获取奖池列表数据
    async getPondRiskList(options) {
      const self = this;
      const res = await self.$api.getPondRiskList({
        data: this.listQuery
      });
      if (res && res.code == 0) {
        let data = res.data;
        // 需要把百分制金额 除于 100 的字段
        let moneyArray = ["ordinary", "serious", "major"];
        moneyArray.forEach(item => {
          data = self.toMoneyReal(data, item);
        });
        self.tableData = res.data.records;
        self.totalCount = res.data.total;
      }
    },
    //页数改变事件
    pageSizeChange(pageSize) {
      this.listQuery.pageSize = pageSize;
      this.listQuery.pageNum = 1;
      this.getPondRiskList();
    },
    //页码改变事件
    pageCurrentChange(currentPage) {
      this.listQuery.pageNum = currentPage;
      this.getPondRiskList();
    },
    //查询
    search(form) {
      this.listQuery.pageNum = 1;
      console.log("search", form);
      (this.listQuery.param = {
        gameId: form.gameId
      }),
        this.getPondRiskList();
    },
    //跳转新增页
    selectBtn(val) {
      if (val.name === "新增") {
        this.$router.push({
          name: "pondRiskAdd"
        });
      }
    },
    //跳转详情页
    detail(row) {
      this.$router.push({
        name: "pondRiskDetail",
        query: {
          id: row.businessKey
        }
      });
    },
    //点击删除
    deleteInfo(row) {
      this.$confirm(`确定要删除这条数据吗? `, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.pondRiskDelete(row.businessKey);
        })
        .catch(() => {});
    },
    //删除api
    async pondRiskDelete(id) {
      const res = await this.$api.pondRiskDelete({
        data: {
          businessKey: id
        }
      });
      if (res && res.code == 0) {
        this.$message({
          type: "success",
          message: "删除成功!"
        });
        this.getPondRiskList();
      } else {
        this.$message({
          type: "info",
          message: "删除失败"
        });
      }
    },
    //跳转编辑页
    update(row) {
      this.$router.push({
        name: "pondRiskEdit",
        query: {
          id: row.businessKey
        }
      });
    },
    // 转换金额 百分
    toMoneyReal(data, val) {
      for (let key in data) {
        if (typeof data[key] == "object") {
          if (data[key][val]) {
            data[key][val] = data[key][val] / 100;
          }
        }
        if (Array.isArray(data[key])) {
          data[key].forEach(item => {
            if (item[val]) {
              item[val] = item[val] / 100;
            }
          });
        }
      }
      return data;
    }
  },
  mounted() {
    this.getPondRiskList();
    this.getGameLists();
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