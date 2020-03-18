<template>
<!-- 资金规则详情 -->
<div class="vlt-card moneyRuleDetail-page">
  <panel title="基本信息" class="vlt-edit-single" :show="true" style="margin-bottom:15px">
    <basic-info v-model="form"></basic-info>
  </panel>
  <panel title="规则设置" class="vlt-edit-single" :show="true" style="margin-bottom:15px">
    <div class="table-wrap">
      <el-table :data="form.capitalRuleList" border class="table-content">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column prop="dealType" label="注入方式">
          <template slot-scope="scope">
            <el-select v-model="scope.row.dealType" placeholder="注入方式" disabled>
              <el-option v-for="(item,index) in injectionOptions" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="gameCode" label="游戏名称">
          <template slot-scope="scope">
            <el-select v-model="scope.row.gameCode" placeholder="游戏名称" disabled>
              <el-option v-for="(item,index) in gameNameOptions" :key="index" :label="item.label" :value="String(item.value)"></el-option>
            </el-select>
          </template>
        </el-table-column> -->
        <el-table-column prop="injectionAmount" label="注入金额">
          <template slot-scope="scope">
            <el-input v-model="scope.row.injectionAmount" placeholder="注入金额" disabled></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remark" placeholder="备注" disabled></el-input>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" width='120'>
          <template slot-scope="scope">
            <el-button size="mini" @click="dialogFormVisible = true">修改</el-button>
            <el-button type="danger" size="mini" @click="deleteData(scope.row,scope.$index)">删除</el-button>
          </template>
        </el-table-column> -->
      </el-table>
    </div>
    <!-- <button class="add-content" @click="addContent">
    <i class="el-icon-plus"></i> 新增资金规则
    </button> -->
  </panel>
</div>
</template>

<script type="text/javascript">
import basicInfo from "./common/basicInfo"
export default {
name: "moneyRuleDetail",
data() {
return {
  injectionOptions:[
    {label:'发行经费注入',value: 1},
    {label:'调节基金注入',value: 2},
    {label:'公益金注入',value: 3},
    {label:'资金注入',value: 4}
  ],
  gameNameOptions:[],
  
  form:{
  //基础信息
    ruleTemplateName:'',
    remark:'',
    ruleType:'',
    totalSum:'',
    capitalRuleList:[{dealType:'',gameCode:'',injectionAmount:'',remark:''}],
  }
}
},
components: {basicInfo},
created(){
  this.getDetail()
  let gameParams = {"gameStatus":"1,2,3"}
  this.getGameName(gameParams)
},
methods: {
  async getDetail(){
    const self = this;
    const data = self.$route.query.id
    let res = await self.$api.getRuleTemplateDetail({ data })
    console.log(res)
    if (res && res.code == 0) {
      self.form = res.data
    }
  },
  // 获取游戏名称
  async getGameName(data) {
    let res = await this.$api.getRuleGameName({data});
    if (res && res.code == 0) {
      let list = res.data
      console.log("GG",list)
      let arr = list.map(item =>{return {label: item.gameName, value: item.id}})
      this.gameNameOptions = arr
      console.log(this.gameNameOptions)
    }
  },
}
}
</script>

<style lang="less">
.moneyRuleDetail-page{
//  去掉查看時的字体颜色
  // .el-textarea.is-disabled .el-textarea__inner{
	// 	color: #333;
	// }
	// .el-input.is-disabled .el-input__inner {
	// 	color: #333;
  // }
}
</style>
<style lang="less" scoped>
.table-wrap{
  padding: 10px;
}
</style>
