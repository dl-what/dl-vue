<template>
  <div class="vlt-card rule-template">
    <search-bar :options="options" :total="total" @search="search" labelWidth="6em">
      <control-bar slot="extend-bar" @select="select" :options="controlOptions" position="left"></control-bar>
    </search-bar>
    <!-- <el-button type="primary" size="small" @click="createTemplate" v-has="'ruleTemplateSet-add'" :id="'ruleTemplateSet-add'">
      <i class="el-icon-plus">规则模板新建</i>
    </el-button> -->
    <el-table :data="templateList" border >
      <el-table-column label="序号" type="index" width="60px" fixed="left">
        <template slot-scope="scope">
          {{params.pageSize*(params.page-1)+(scope.$index+1)}}
        </template>
      </el-table-column>
      <el-table-column prop="ruleTemplateName" label="模板名称" show-overflow-tooltip min-width="200px"></el-table-column>
      <el-table-column prop="remark" label="规则简介" show-overflow-tooltip min-width="250px"></el-table-column>
      <el-table-column prop="ruleType" label="规则类型" min-width="120px">
        <template slot-scope="scope">
          {{getRuleType(scope.row.ruleType)}}
        </template>
      </el-table-column>
      <el-table-column prop="createName" label="创建人" min-width="120px"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="180px"></el-table-column>
      <el-table-column label="操作" fixed="right" width="160px">
        <template slot-scope="scope">
          <el-button :id="'ruleTemplateSet-detail' + scope.$index" type="primary" size="mini" v-prevent="2000" @click="detail(scope.row.id,scope.row.ruleType)" v-has="'ruleTemplateSet-detail'">查看</el-button>
          <el-button :id="'ruleTemplateSet-edit' + scope.$index" type="" v-prevent="2000" size="mini" @click="modification(scope.row.id,scope.row.ruleType)" v-has="'ruleTemplateSet-edit'">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <table-paging
      position="right"
      :total="total"
      :currentPage="params.page"
      :pageSize="params.pageSize"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></table-paging>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "ruleTemplateSet",
  data() {
    return {
      controlOptions:[{name: '新建规则模板', type: 'primary', icon: 'plus', permission: 'ruleTemplateSet-add'}],
      options: [
        {
          type: "select",
          prop: "id",
          value: "",
          title: "模板名称",
          options:[]
        },
        {
          type: "select",
          prop: "ruleType",
          value: "",
          title: "规则类型",
          options:[
            {label:'活动规则',value: 1 },
            {label:'资金规则',value: 2 },
            {label:'资源规则',value: 3 },
            {label:'监控规则',value: 4 },
          ]
        }
      ],
      templateList: [],
      params: {
        page: 1,
        pageSize: 20,
        param:{insId: this.$storage.get("userInfo").insId} 
      },
      total:0
    };
  },
  components: {},
  created(){
    this.getRuleTemplateList();
    this.getRuleAll()
  },
  methods: {
    getRuleType(val){
      let options = {
        1: '活动规则',
        2: '资金规则',
        3: '资源规则',
        4: '监控规则'
      }
      return options[val]
    },
    // 获取表格数据
    getRuleTemplateList(){
      const self = this;
      let data = self.params;
      (async data =>{
        let res = await self.$api.getRuleTemplateList({ data })
        console.log(res)
        if (res && res.code == 0) {
          self.total = res.data.total
          self.templateList = res.data.records
        }
      })(data)
    },
    search(val) {
      this.params.param = {...val,insId: this.$storage.get("userInfo").insId}
      console.log(this.params)
      this.getRuleTemplateList(this.params)
    },
    select(val) {
      this.$router.push({ path: "ruleTemplateCreate" })
    },
    // createTemplate() {
    //   this.$router.push({ path: "ruleTemplateCreate" });
    // },
    // 查看详情
    detail(id,ruleType){
      console.log(ruleType)
      switch (ruleType) {
        case 1:
          this.$router.push({
            path: "activityRuleDetail",
            query: { id, type: 0 }
          })
          break;
        case 2:
          this.$router.push({
            path: "moneyRuleDetail",
            query: { id, type: 0 }
          })
          break;
        case 3:
          this.$router.push({
            path: "resourcesRuleDetail",
            query: { id, type: 0 }
          })
          break;
        case 4:
          this.$router.push({
            path: "monitorRuleDetail",
            query: { id, type: 0 }
          })
          break;
      }
    },
    // 修改
    modification(id, ruleType){
      console.log(id,ruleType)
      this.$router.push({
        path:'ruleModification',
        query: {
          id,ruleType,isShow: 0
        }
      })
    },
    handleSizeChange(val) {
      this.params.page = 1;
      this.params.pageSize = val;
      this.getRuleTemplateList(this.params)
    },
    handleCurrentChange(val) {
      this.params.page = val;
      this.getRuleTemplateList(this.params)
    },
    async getRuleAll() {
      const self = this;
      let data = {insId: this.$storage.get("userInfo").insId};
      let res = await self.$api.getRuleAll({data})
      console.log(res)
      if (res && res.code == 0) {
        let arr = res.data.map(item =>{ return {label: item.ruleTemplateName,value:item.id}})
        self.$set(self.options[0], "options", arr)
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>
