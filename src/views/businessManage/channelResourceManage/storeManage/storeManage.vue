<template>
<div class="vlt-card">
  <div class="content-block">
    <search-bar class="search-bar-demo" @search="search" :options="searchOptions" :total="totalCount" labelWidth="6em">
      <control-bar slot="extend-bar" @select="addBtn" :options="controlOptions" position="left"></control-bar>
    </search-bar>
    <el-table :data="tableData" border>
        <el-table-column fixed label="序号" type="index" width="60px">
          <template slot-scope="scope">
            {{requestData.pageSize*(requestData.page-1)+(scope.$index+1)}} 
          </template>
        </el-table-column>
        <el-table-column label="仓库名称" prop="warName" min-width="120px"></el-table-column>
        <el-table-column label="所属机构" prop="insName"></el-table-column>
        <el-table-column label="仓库类型" prop="warType"></el-table-column>
        <el-table-column label="仓库管理员" prop="adminName"></el-table-column>
        <el-table-column fixed="right" label="操作" min-width="120px">
          <template slot-scope="scope">
            <el-button :id="'storeManage-detail' + scope.$index" type="primary" size="mini" v-has="'storeManage-detail'" @click="storeDetail(scope.row.id)">查看</el-button>
            <el-button :disabled="scope.row.warType == '销售大厅'" :id="'storeManage-edit' + scope.$index" type="" size="mini" v-has="'storeManage-edit'" @click="storeEdit(scope.row.id)">编辑</el-button>
          </template>
        </el-table-column>
    </el-table>
    <table-paging
        position="right"
        :total="totalCount"
        :currentPage="requestData.page"
        :pageSize="requestData.pageSize"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      >
      </table-paging>
  </div>
</div>
</template>

<script type="text/javascript">
import rules from "@/utils/rules.js";
import { async } from 'q';
export default {
name: "storeManage",
data() {
return {
  totalCount:0,
  params:{},
  dialogAddFormVisible:false,
  dialogFormVisible: false,
  searchOptions:[
    {title:'仓库名称',type:'input',prop:'warName',value:''},
    {title:'仓库类型',type:'select',prop:'warType',value:'',options:[]},
    {title:'仓库管理员',type:'input',prop:'adminName',value:''},
    {
      title: "所属机构",
      type: "cascader",
      prop: "insId",
      value: "",
      options: [],
      setProps: {
        label: "text",
        value: "id",
        children: "children",
        // multiple: true, // 多选
        checkStrictly: true //设置父子节点取消选中关联，从而达到选择任意一级选项的目的
      }
    }
  ],
  controlOptions:[{ name: "新建仓库", type: "primary", icon: "plus", permission: 'storeManage-add'}],
  tableData:[],
  requestData:{
    page: 1,
    pageSize: 20,//每页显示数据调试
    param: {
      "warName": "",
      "warType": "",
      "adminName": '',
      "insId":  ''
    }
  },
  insData: null
}
},
components: {
},
created(){
  this.getStoreList(this.requestData);
  this.getInsData();
  
},
methods: {
   // 获取所属机构列表
    getInsData() {
      const data = {};
      const self = this;
      (async data => {
        let res = await self.$api.getSearchInsList({ data });
        if (res && res.code == 0) {
          self.insData = res.data;
          console.log('机构数据',res)
          self.$set(self.searchOptions[3], "options", res.data);
          this.getTypeOption()
        }
      })(data);
    },
  search(data) {
    data.insId = data.insId ? data.insId[data.insId.length - 1] : "";
    this.requestData.param = data;
    this.getStoreList(this.requestData)
  },
  //新建仓库跳转
  addBtn(val) {
    this.$router.push({name:'addStore'});
  },
  // 修改
  storeEdit(id) {
    this.$router.push({name: 'editStore', query:{id}})
  },
    //查看
  storeDetail (id) {
    this.$router.push({path:'detail', query:{id}})
  },
  //切换分页条数
  handleSizeChange(pageSize) {
    this.requestData.page = 1;
    this.requestData.pageSize = pageSize
    this.getStoreList(this.requestData)
  },
  //点击分页
  handleCurrentChange(currentPage) {
    this.requestData.page = currentPage
    this.getStoreList(this.requestData)
  },
  getStoreList(data){
    let obj = {
      1 : '中彩仓库',
      2 : '省中心仓库',
      3 : '地市仓库',
      4 : '销售大厅'
    };
    (async (data)=>{
      let res = await this.$api.getStoreList({data})
      console.log(res)
      if (res && res.code == 0){
        this.tableData = res.data.records
        this.tableData.forEach((item)=>{
          item.warType = obj[item.warType]
        })
        this.totalCount = res.data.total
      }
    })(data)
  },
  getTypeOption() {
    let arr = [{label:'中彩仓库',value:1},{label:'省中心仓库',value:2},{label:'地市仓库',value:3},{label:'销售大厅',value:4}];
    let userId = this.$storage.get('userInfo').insId;
    let obj = this.getType(this.insData, userId)
    if (obj.type == 0) {
      this.$set(this.searchOptions[1], 'options', arr)
    }else if (obj.type == 1) {
      this.$set(this.searchOptions[1], 'options', arr.slice(-3))
    }else{
      this.$set(this.searchOptions[1], 'options', arr.slice(-2))
    }
  },
  getType(insData, insId) {
    let res = null;
    if (!insData) {
      return;
    }
    for (let i in insData) {
      let item = insData[i]
      if (item.id == insId) {
        res = item;
        break;
      }else if(item.children && item.children.length > 0) {
        res = this.getType(item.children, insId)
      }
    }
    return res;
  }
},
}
</script>

<style lang="less" scoped>
</style>
