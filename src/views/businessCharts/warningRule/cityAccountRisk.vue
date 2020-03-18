<template>
  <div class="vlt-card">
    <section class="comp-item">
       <search-bar  :showHandler='true' 
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
    <div class="tab-container">
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
        <el-table-column align="center" prop="indexType" min-width="140" label="风险指标">
          <template slot-scope="scope">
            <div v-if="scope.row.indexType===1">最高充值</div>
            <div v-if="scope.row.indexType===2">最低充值</div>
            <div v-if="scope.row.indexType===3">最高提现</div>
            <div v-if="scope.row.indexType===4">最低缴款金额</div>
            <div v-if="scope.row.indexType===5">最高缴款金额</div>
            <div v-if="scope.row.indexType===6">最低单厅余额</div>
            <div v-if="scope.row.indexType===7">投注卡平均最低消费</div>
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
        <el-table-column align="center" min-width="120" prop="major" label="Ⅰ级">
          <template slot-scope="scope">
            <span>{{scope.row.major||'-'}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="updateTime" width="160" label="更新时间"></el-table-column>
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
              v-has="'accountRisk-detail'"
              @click.native="detail(scope.row)"
              size="mini"
            >查看</el-button>
            <el-button
              type
              @click.native="update(scope.row)"
              size="mini"
              v-has="'accountRisk-update'"
            >编辑</el-button>
            <el-button
              type="danger"
              @click.native="deleteInfo(scope.row)"
              v-has="'accountRisk-delete'"
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
import mixin from "@/utils/mixin";
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
        }
      ],
      controlOptions: [
        {
          name: "新增",
          type: "primary",
          icon: "plus",
          permission: "accountRisk-add"
        }, // type为按钮的五种颜色， icon为具体的图标
         {
          name: "批量新增",
          type: "primary",
          icon: "plus",
          permission: "accountRiskBatch-add"
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
    //金额相关的/100
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
    },
    //获取游戏下拉框列表
    async getGameLists(options) {
      const self = this;
      const res = await self.$api.getGameLists();
      if (res && res.code == 0) {
        this.searchOptions.forEach(item => {
          if (item.prop === "game") {
            res.data.forEach(v => {
              item.value = item.gameId;
              item.label = item.gameName;
            });
            item.options = res.data;
          }
        });
      }
    },
    //获取游戏风险指标列表
    async getAccountRiskList() {
      const self = this;
      const res = await self.$api.getAccountRiskList({
        data: this.listQuery
      });
      if (res && res.code == 0) {
        let data = res.data;
        // 需要把百分制金额 除于 100 的字段
        let moneyArray = ['ordinary', 'serious','major']
        moneyArray.forEach(item => {
          data = self.toMoneyReal(data, item);
        });
        self.tableData = res.data.records;
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
          this.cityAccountRiskDelete(row.businessKey);
        })
        .catch(() => {});
    },
    //删除api
    async cityAccountRiskDelete(id) {
      const res = await this.$api.cityAccountRiskDelete({
        data: {
          businessKey: id
        }
      });
      if (res && res.code == 0) {
        this.$message({
          type: "success",
          message: "删除成功!"
        });
        this.getAccountRiskList();
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
      this.getAccountRiskList();
    },
    //页码改变事件
    pageCurrentChange(currentPage) {
      this.listQuery.pageNum = currentPage;
      this.getAccountRiskList();
    },
    //查询
    search(form) {
      this.listQuery.pageNum = 1;
      this.listQuery.param = {
        insId: form.insId ? form.insId[form.insId.length - 1] : ""
      };
      this.getAccountRiskList();
    },
    //跳转
    selectBtn(val) {
      if (val.name === "新增") {
        this.$router.push({
          name: "cityAccountRiskAdd"
        });
      }
      if (val.name === "批量新增") {
        this.$router.push({
          name: "cityAccountRiskAdd",
          query: {
          type: 1
        }
        });
      }
    },
    //跳转详情页
    detail(row) {
      this.$router.push({
        name: "cityAccountRiskDetail",
        query: {
          id: row.businessKey
        }
      });
    },
    //跳转编辑页
    update(row) {
      this.$router.push({
        name: "cityAccountRiskEdit",
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
      area.forEach(item => {
        if (item.children) {
          this.setLabelAndValue(item.children);
        }
      });
      this.searchOptions.forEach(item => {
        if (item.type === "cascader") {
          item.options = area;
        }
      });
    },
  },
  mounted() {
    this.queryInsTree();
    this.getAccountRiskList();
  },
  created() {
    
  }
};
</script>

<style  lang="less" scoped>
/deep/.el-table td,
.el-table th {
  padding: 8px 0;
}
</style>
