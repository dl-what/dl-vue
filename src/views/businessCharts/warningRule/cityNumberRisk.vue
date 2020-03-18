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
        <el-table-column align="center" label="序号" min-width="65">
          <template slot-scope="scope">
            <div style="text-align:center;">{{scope.$index+1}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="insName"  min-width="180" label="区域名称" ></el-table-column>
        <el-table-column align="center"  min-width="120" prop="indexType" label="风险指标" >
          <template slot-scope="scope">
            <div v-if="scope.row.indexType===1">
               最高退卡数量
            </div>
            <div v-if="scope.row.indexType===2">
               最低开卡数量
            </div>
            <div v-if="scope.row.indexType===3">
               最低在线数量
            </div>
            <div v-if="scope.row.indexType===4">
               最低开机率
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="ordinary"   label="Ⅲ级">
          <template slot-scope="scope">
            <span>{{scope.row.ordinary||'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="serious"  label="Ⅱ级">
          <template slot-scope="scope">
            <span>{{scope.row.serious||'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="major"  label="Ⅰ级">
          <template slot-scope="scope">
            <span>{{scope.row.major||'-'}}</span>
          </template>
        </el-table-column>      
        <el-table-column align="center" prop="updateTime" min-width='160' label="更新时间"></el-table-column>
        <el-table-column align="center" prop="collectStatus" min-width="60" label="状态" >
          <template slot-scope="scope">
            <span v-if="scope.row.collectStatus===0">生效</span>
            <span v-if="scope.row.collectStatus===1">停止</span>
          </template>
        </el-table-column>
        <el-table-column label="操作"  fixed="right" width='240'  align="center">
          <template slot-scope="scope">
            <el-button type="primary" v-has="'numberRisk-detail'" @click.native="detail(scope.row)" size="mini">查看</el-button>
            <el-button type="" v-has="'numberRisk-update'" @click.native="update(scope.row)" size="mini">编辑</el-button>
            <el-button type="danger" v-has="'numberRisk-delete'" @click.native="deleteInfo(scope.row)" size="mini">删除</el-button>
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
import informs from "@/utils/inform.js"
import city from "@/libs/map/city.json";
export default {
  name: "areaDeal",
  data() {
    return {
      treeName: [],
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
        { name: "新增", type: "primary", icon: "plus",permission: 'numberRisk-add' }, // type为按钮的五种颜色， icon为具体的图标
        {
          name: "批量新增",
          type: "primary",
          icon: "plus",
          permission: "numberRiskBatch-add"
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
    //获取数量风险列表数据
    async getNumberRiskList() {
      let res = await this.$api.getNumberRiskList({
        data: this.listQuery
      });
      if (res && res.code == 0) {
          res.data.records.forEach(v=>{
            //循环遍历 最低开机律
           if (v.indexType == 4 ) {
            v.ordinary = informs.conventToPercent(v.ordinary);
            v.serious = informs.conventToPercent(v.serious);
            v.major = informs.conventToPercent(v.major);
          }
        })
        this.tableData = res.data.records;
        this.totalCount = res.data.total;
      }
    },
    //页数改变事件
    pageSizeChange(pageSize) {
      this.listQuery.limit = pageSize;
      this.listQuery.pageNum=1
      this.getNumberRiskList();
    },
    //页码改变事件
    pageCurrentChange(currentPage) {
      this.listQuery.pageNum = currentPage;
      this.getNumberRiskList();
    },
    //查询
    search(form) {
      this.listQuery.pageNum=1
      this.listQuery.param={
        insId:form.insId?form.insId[form.insId.length-1]:''
      }
      this.getNumberRiskList()
    },
    //删除
    deleteInfo(row) {
      this.$confirm(`确定要删除这条数据吗? `, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.cityNumberRiskDelete(row.businessKey);
        })
        .catch(() => {});
    },
    //删除金额风险
    async cityNumberRiskDelete(id) {
      const res = await this.$api.cityNumberRiskDelete({
        data: {
          businessKey: id,
          message: "删除成功"
        }
      });
      if (res && res.code == 0) {
        this.getNumberRiskList();
      }
    },
    //跳转详情页
    detail(row) {
      this.$router.push({
        name: "cityNumberRiskDetail",
        query: {
          id: row.businessKey
        }
      });
    },
    //跳转新增页
    selectBtn(val) {
      if (val.name == "新增") {
        this.$router.push({
          name: "cityNumberRiskAdd"
        });
      }
      if (val.name === "批量新增") {
        this.$router.push({
          name: "cityNumberRiskAdd",
          query: {
          type: 1
        }
        });
      }
    },
    //跳转数量风险页面
    update(row) {
      this.$router.push({
        name: "cityNumberRiskEdit",
        query: {
          id: row.businessKey
        }
      });
    },
    //获取区域列表数据
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
    this.getNumberRiskList();
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
