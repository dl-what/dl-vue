<template>
<div class="vlt-card">
  <div class="tabs-content">
    <search-bar class="search-bar-demo" @search = "search" :options="options" :total="10" labelWidth="70px"></search-bar>
    <control-bar :options ="controlOptions" position="left" @select="selectBtn"></control-bar>
    <el-tabs v-model="activeName" @tab-click="handleClick" class="tables-content">
      <el-tab-pane v-for="(item,index) in tabConfigs" :key="index" :label="item.label" :name="item.name">
        
        <el-table :data="item.tableData" border style="width: 100%">
          <el-table-column prop="id" label="序号" type="index"></el-table-column>
          <el-table-column prop="equipmentName" label="设备名称" v-if="item.label == '设备'" ></el-table-column>
          <el-table-column prop="facilityName" label="设施名称" v-if="item.label == '设施'" ></el-table-column>
          <el-table-column prop="consumableName" label="耗材名称" v-if="item.label == '耗材'" ></el-table-column>
          <el-table-column prop="mountingsName" label="配件名称" v-if="item.label == '配件'" ></el-table-column>
          <el-table-column prop="equipmentType" label="设备型号" v-if="item.label == '设备' || item.label == '配件'"></el-table-column>
          <el-table-column prop="unit" label="设备单位" v-if="item.label == '设备'"></el-table-column>
          <el-table-column prop="unit" label="设施单位" v-if="item.label == '设施'"></el-table-column>
          <el-table-column prop="unit" label="耗材单位" v-if="item.label == '耗材'"></el-table-column>
          <el-table-column prop="unit" label="配件单位" v-if="item.label == '配件'"></el-table-column>
          <el-table-column prop="num" label="数量" v-if="item.label == '设备' || item.label == '配件'"></el-table-column>
          <el-table-column prop="num2" label="库存数量" v-if="item.label == '设施' || item.label == '耗材'"></el-table-column>
          <el-table-column label="操作" min-width="100px">
            <template slot-scope="scope">
              <el-button @click="detail(scope.row.id,scope.row)" type="primary" v-prevent="2000" size="mini">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <table-paging position="right" :total="item.total" :currentPage="item.page" :pageSize="item.pageSize" @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"></table-paging>
      </el-tab-pane>
    </el-tabs>
    </div>
</div>
</template>

<script type="text/javascript">
export default {
  name: "inventoryManage",
  data() {
  return {
    total: 0,
    activeName: "1",
    controlOptions: [
      { name: "打印", type: "primary", icon: "printer" },
      { name: "导出", type: "", icon: "s-promotion" },
    ],
    options:[
        {title: "物品名称", type: "input", prop: "goodsName", value: "" },
        { title: "存放位置", type: "select", prop: "depositLocation", value: "", options: []},
      ],
    tabConfigs: [
      {label: "设备",name:"1",tableData:[],total: 0,page: 1,pageSize: 10,},
      {label: "设施",name:"4",tableData:[],total: 0,page: 1,pageSize: 10,},
      {label: "耗材",name:"3",tableData:[],total: 0,page: 1,pageSize: 10,},
      {label: "配件",name:"2",tableData:[],total: 0,page: 1,pageSize: 10,}
    ],
    params: {
      page: 1,
      pageSize: 10,
      param: {}
    },
    inventoryOptions: [
        { title: "物品名称", type: "input", prop: "goodsName", value: "" },
        {
          title: "存放位置",
          type: "select",
          prop: "depositLocation",
          value: "",
          options: [
            {
              label: "广东省",
              value: 1
            },
            {
              label: "北京市",
              value: 2
            }
          ]
        },
    ],
    equipmentData: [
      {
        id: '01',
        equipmentName: '投注机',
        equipmentType:'F01',
        unit:'台',
        num:'10000'
      }
    ],
    facilityData:[
      {
        id:'01',
        facilityName:'投注机',
        facilityUnit:'个',
        inventoryNum:10000,
      }
    ],
    consumableData:[
      {
        id:'01',
        consumableName:'投注机',
        consumableUnit:'台',
        consumableNum:21000,
      }
    ],
    mountingsData:[
      {
        id:'01',
        mountingsName:'电视机',
        mountingsType:'F01',
        unit:'台',
        num:'1000'
      }
    ],
}
},
created() {
  this.handleClick()
},
methods: {
  async getTableList() {
    const self = this;
    let requerstData = {}
    requerstData.goodsType = Number(self.activeName)
    self.params.param = {...requerstData}
    let data = self.params
    console.log(data)
    let res = await self.$api.getTerraceDetail( {data} )
    console.log("DATA",res)
    if (res && res.code == 0) {
      this.currentTab.total = res.data.total;

    }
  },
  handleClick(tab) {
    console.log(tab)
    const currentTab = this.tabConfigs[tab.index]
    this.currentTab = currentTab
    this.getTableList()
  },
  search(form) {
      console.log("search", form);
  },
  selectBtn(val) {
      console.log(val);
  },
  handleCurrentChange(currentPage) {
        // this.confirmSearch.page = val
        // this.query()
        console.log(currentPage)
      },
  handleSizeChange(pageSize) {
    // this.pageSize = val
    // this.confirmSearch.limit = val
    // this.confirmSearch.page = 1
    // this.currentPage = 1
    // this.query()
    console.log(pageSize)
  },
  detail() {},
  //设备查看页面跳转
  equipmentDetail (id,row) {
    console.log(row)
    this.$router.push({
      name: 'equipmentDetail',
      query: {id}
    })
  },
  //设备履历页面跳转
  // equRecordCheck(id){
  //   this.$router.push({
  //     name:'equRecordCheck',
  //     query:{id}
  //   })
  // },
  //设施查看
  facilityDetail(id){
    this.$router.push({
      name:'facilityDetail',
      query:{id}
    })
  },
  //耗材查看
  consumableDetail(id){
    this.$router.push({
      name:'consumableDetail',
      query:{id}
    })
  },
  //配件查看
  mountingsDetail(id){
    this.$router.push({
      name:'mountingsDetail',
      query:{id}
    })
  },
 }
}

</script>

<style lang="less">
.tabs-content{
  padding: 16px 30px;
}

</style>
