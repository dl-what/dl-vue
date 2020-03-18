<template>
  <div class="vlt-card">
    <section class="comp-item">
       <search-bar  :showHandler='true' 
        class="search-bar-demo"
        @search="search"
        :options="searchOptions"
        :total="totalCount"
        labelWidth="70px"
        ref="searchForm"
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
        <el-table-column align="center" prop="insName" min-width="180" label="区域名称" ></el-table-column>
       <el-table-column align="center" prop="indexType" min-width="120" label="风险指标" >
          <template slot-scope="scope">
            <div v-if="scope.row.indexType===1">
               最高销量
            </div>
            <div v-if="scope.row.indexType===2">
               最低销量
            </div>
            <div v-if="scope.row.indexType===3">
               最低单厅销量
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="ordinary" min-width="120"  label="Ⅲ级">
          <template slot-scope="scope">
            <span>{{scope.row.ordinary||'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="serious" min-width="120"  label="Ⅱ级">
          <template slot-scope="scope">
            <span>{{scope.row.serious||'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="major" min-width="120"  label="Ⅰ级">
          <template slot-scope="scope">
            <span>{{scope.row.major||'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="updateTime" min-width='160'  label="更新时间"></el-table-column>
        <el-table-column align="center" prop="collectStatus" min-width="60" label="状态" >
          <template slot-scope="scope">
            <span v-if="scope.row.collectStatus===0">生效</span>
            <span v-if="scope.row.collectStatus===1">停止</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width='240' align="center">
          <template slot-scope="scope">
            <el-button type="primary" v-has="'moneyRisk-detail'" @click.native="detail(scope.row)" size="mini">查看</el-button>
            <el-button type="" v-has="'moneyRisk-update'" @click.native="update(scope.row)" size="mini">编辑</el-button>
            <el-button type="danger" v-has="'moneyRisk-delete'" @click.native="deleteInfo(scope.row)" size="mini">删除</el-button>
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
      treeName:[],
      totalCount: 0,
      searchOptions: [
         {
          type: "cascader",
          prop: "insId",
          value: '',
          title: "所在区域",
          options: [],
          setProps: { value: "id", label: "text",checkStrictly: true  },          
        },
      ],
      controlOptions: [
        { name: "新增", type: "primary", icon: "plus",permission: 'moneyRisk-add' }, // type为按钮的五种颜色， icon为具体的图标
        {
          name: "批量新增",
          type: "primary",
          icon: "plus",
          permission: "moneyRiskBatch-add"
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
    //获取金额风险指标列表
    async getMoneyRiskList() {
      let res = await this.$api.getMoneyRiskList({
        data: this.listQuery
      });
      if (res && res.code == 0) {
        let data = res.data;
          // 需要把百分制金额 除于 100 的字段
          let moneyArray = ['ordinary', 'serious','major']
          moneyArray.forEach((item)=>{
            data = this.toMoneyReal(data, item)
          })
        this.tableData = res.data.records;
        this.totalCount = res.data.total;
      }
    },
    //页数改变事件
    pageSizeChange(pageSize) {
      this.listQuery.limit = pageSize;
      this.listQuery.pageNum=1
      this.getMoneyRiskList();
    },
    //页码改变事件
    pageCurrentChange(currentPage) {
      this.listQuery.pageNum = currentPage;
      this.getMoneyRiskList();
    },
    //查询
    search(form) {
      this.listQuery.pageNum=1
      this.listQuery.param={
        insId:form.insId?form.insId[form.insId.length-1]:''
      }
      this.getMoneyRiskList()
    },
    //点击删除
    deleteInfo(row) {
      this.$confirm(`确定要删除这条数据吗? `, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.cityMoneyRiskDelete(row.businessKey);
        })
        .catch(() => {});
    },
    //删除api
    async cityMoneyRiskDelete(id) {
      const res = await this.$api.cityMoneyRiskDelete({
        data: {
          businessKey: id,
          message: "删除成功"
        }
      });
      if (res && res.code == 0) {
        this.getMoneyRiskList();
      }
    },
    //跳转详情页
    detail(row) {
      this.$router.push({
        name: "cityMoneyRiskDetail",
        query: {
          id: row.businessKey
        }
      });
    },
    //跳转
    selectBtn(val) {
      if (val.name == "新增") {
        this.$router.push({
          name: "cityMoneyRiskAdd"
        });
      }
      if (val.name === "批量新增") {
        this.$router.push({
          name: "cityMoneyRiskAdd",
          query: {
          type: 1
        }
        });
      }
    },
    // 转换金额 百分
    toMoneyReal(data, val) {
      for(let key in data) {
        if(typeof(data[key])=='object') {
          if(data[key][val]) {
            data[key][val] = data[key][val]/100;
          }
        }
        if(Array.isArray(data[key])) {
          data[key].forEach((item)=>{
            if(item[val]) {
              item[val] = item[val]/100;
            }
          })
        }
      }
      return data;
    },
    //跳转编辑页
    update(row) {
      this.$router.push({
        name: "cityMoneyRiskEdit",
        query: {
          id: row.businessKey
        }
      });
    },
    //获取区域机构
    async queryInsTree() {
      let res = await this.$api.queryInsTree();
      if (res.data && res.code == 0) {
        this.setLabelAndValue(res.data);
      }
    },
    //递归绑定
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
  },
  created() {
    
  },
  mounted() {
    this.getMoneyRiskList();
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

