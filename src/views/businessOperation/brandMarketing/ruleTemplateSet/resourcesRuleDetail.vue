<template>
<!-- 资源规则详情 -->
<div class="vlt-card resourcesRuleDetail-page">
  <panel title="基本信息" class="vlt-edit-single" :show="true" style="margin-bottom:15px">
    <basic-info v-model="form"></basic-info>
  </panel>
  <panel title="规则设置" class="vlt-edit-single" :show="true">
    <div class="table-wrap">
      <el-table :data="tableData" border class="table">
        <el-table-column type="index" label="序号" fixed width="60px"></el-table-column>
        <el-table-column label="物品名称" min-width="160px">
          <template slot-scope="scope">
            <el-select v-model="scope.row.goodId" filterable placeholder="请选择" disabled>
              <el-option
                v-for="(item, index) in scope.row.nameOptions"
                :key="index"
                @click.native="selectName(index,scope.row)"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="物品型号" min-width="160px">
          <template slot-scope="scope">
            <el-select v-model="scope.row.modelId" filterable placeholder="请选择" disabled>
              <el-option
                v-for="(item, index) in scope.row.modelOptions"
                :key="index"
                @click.native="selectModel(index,scope.row)"
                :label="item.deviceModel"
                :value="item.modelId"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <!-- <el-table-column label="物品序列号" min-width="200px">
          <template slot-scope="scope">
            <el-input
              disabled
              type="textarea"
              :rows="2"
              v-model="scope.row.goodsSerialNumber"
              placeholder="请输入序列号"
            ></el-input>
          </template>
        </el-table-column> -->
        <el-table-column label="数量" min-width="160px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.num" placeholder="请输入数量" disabled></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="unitPrice" label="单价（元）" min-width="80px" disabled></el-table-column>
        <el-table-column prop="amount" label="金额（元）" min-width="80px" disabled></el-table-column>
        <el-table-column label="备注" min-width="200px">
          <template slot-scope="scope">
            <el-input placeholder="请输入备注" v-model="scope.row.remark" disabled></el-input>
          </template>
        </el-table-column>
        <!-- <el-table-column fixed="right" label="操作" width="80px">
          <template slot-scope="scope">
            <i class="el-icon-delete delete" @click="deleteGoods(scope.$index)"></i>
          </template>
        </el-table-column> -->
      </el-table>
      <!-- <el-button class="addGoods" @click="add" icon="el-icon-plus">新增物品</el-button> -->
    </div>
  </panel>

</div>
</template>

<script type="text/javascript">
import basicInfo from "./common/basicInfo"
export default {
name: "resourcesRuleDetail",
data() {
return {
  
    form:{
      //基础信息
      ruleTemplateName:'',
      remark:'',
      ruleType:1,
      totalSum:0,
    },
    resourceRuleList:[],// 资源规则表格数据
    allResourceData:[], //所有物品名称数据
    tableData: []   //  资源表格数据
}
},
components: {basicInfo},
created(){
  this.getDetail()
},
methods: {
  async getDetail(){
    const self = this;
    const data = self.$route.query.id
    let res = await self.$api.getRuleTemplateDetail({ data })
    console.log(res)
    if (res && res.code == 0) {
      self.form = res.data
      self.resourceRuleList = res.data.resourceRuleList
      this.getModelTree()
    }
  },
  //获取所有物品信息
  async getModelTree() {
    const self = this;
    let res = await self.$api.getModelTree();
    if (res && res.code == 0) {
      self.allResourceData = res.data;
      self.init()
      // console.log(self.tableData)
    }
  },
  init() {
    const self = this;
    self.tableData = []
    this.resourceRuleList.forEach((item,index)=>{
      let obj ={
        id: "",
        goodName: "",
        modelId: "",
        goodCode: "",
        goodId: '',
        goodsType: "",
        // goodsSerialNumber: "",
        num: "",
        unitPrice: "",
        amount: "",
        remark: "",
        nameOptions: [],
        modelOptions:[]
      }
      obj = Object.assign(obj, item)
      obj.goodId = Number(obj.goodId)
      obj.modelId = Number(obj.modelId)
      console.log(obj)
      self.allResourceData.forEach((list)=>{
        let listObj = {};
        listObj.label = list.goodsName
        listObj.value = list.id
        obj.nameOptions.push(listObj)
        if (list.id == item.goodId) {
          obj.modelOptions = list.modelInfoVoList
        }
      })
      self.tableData.push(obj)
    })
  }
},
}
</script>

<style lang="less">
.resourcesRuleDetail-page{
  .table-wrap {
    padding: 50px;
    text-align: center;
  }
  //  去掉查看時的字体颜色
  // .el-textarea.is-disabled .el-textarea__inner{
	// 	color: #333;
	// }
	// .el-input.is-disabled .el-input__inner {
	// 	color: #333;
  // }
}
</style>
