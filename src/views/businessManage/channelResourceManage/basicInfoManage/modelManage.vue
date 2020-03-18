<template>
  <div class="vlt-card content-block">
    <!-- <search @search="modelSearch" :total="visiableTotal" labelWidth="80px">
      <control-bar slot="extend-bar" :options="controlOptions" @select="modelAdd" position="left"></control-bar>
    </search> -->
    <search-bar
        ref="searchForm"
        class="search-bar-demo"
        @search="search"
        :options="searchOptions"
        :total="totalCount"
        labelWidth="6em"
        @change="changeSearch"
        @searchReset="reset"
      >
      <control-bar slot="extend-bar" @select="selectBtn" :options="controlOptions"></control-bar>
    </search-bar>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column label="序号" type="index" width="60px" fixed="left">
        <template slot-scope="scope">
          {{requestData.pageSize*(requestData.page-1)+(scope.$index+1)}}
        </template>
      </el-table-column>
      <el-table-column prop="modelType" label="物品类别" min-width="160px"></el-table-column>
      <el-table-column prop="goodsName" label="物品名称" min-width="250px"></el-table-column>
      <el-table-column prop="deviceModel" label="物品型号" min-width="250px"></el-table-column>
      <el-table-column prop="status" label="状态" min-width="120px">
        <template slot-scope="scope">
          <el-switch
            @change="changeState(scope.row.id,scope.row.status)"
            v-model="scope.row.status"
            v-has="'modelManage-switch'"
            :active-text="scope.row.status==1?'开启':'关闭'"
            :active-value="1"
            :inactive-value="2"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="160" fixed="right">
        <template slot-scope="scope">
          <el-button
            :id="'modelManage-detail' + scope.$index"
            @click="modelCheck(scope.row.id,scope.row.modelType)"
            type="primary"
            v-has="'modelManage-detail'"
            size="mini"
          >查看</el-button>
          <el-button :id="'modelManage-edit' + scope.$index" :disabled="scope.row.status == 1" @click="modelAmend(scope.row)" v-has="'modelManage-edit'" size="mini">编辑</el-button>
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
    ></table-paging>
  </div>
</template>

<script type="text/javascript">
import rules from "@/utils/rules.js";
import search from "./components/search";
export default {
  name: "modelManage",
  data() {
    return {
      searchOptions: [
        {title: "物品类别", type: "select", value: "", prop: 'modelType', options: [{label:'设备',value:1},{label:'配件',value:2}]},
        {title: "物品名称", type: "select", value: "", prop: 'goodsId', options: []},
        {title: "物品型号", type: "select", value: "", prop: 'modelId', options: []},
        {title: "物品状态", type: "select", value: "", prop: 'status', options: [{label:'开',value: 1},{label:'关',value: 2}]},
      ],

      controlOptions: [{ name: "新增", type: "primary", icon: "plus", permission: 'modelManage-add'}],
      totalCount: 0,
      tableData: [],
      requestData: {
        page: 1,
        pageSize: 20,
        param: {}
      },
      resourceDatas: [],
      optionsName: [],
      optionsModel: [],
      startGoodsId: null,
      startgoodsType: null,
    };
  },
  components: {search},
  created() {
    this.getModelList(this.requestData);
  },
  methods: {
    async getModelList(data) {
      let type = {
        1: "设备",
        2: "配件"
      };
      let res = await this.$api.getModelList({ data });
      console.log(res);
      if (res && res.code == 0) {
        this.tableData = res.data.records;
        this.totalCount = res.data.total;
        this.tableData.forEach(item => {
          item.modelType = type[item.modelType];
        });
      }
    },
    //状态修改
    async changeState(id, status) {
      console.log(status);
      let data = {
        id: id,
        status: status,
        updateBy: "",
        updateTime: ""
      };
      let res = await this.$api.ModelstatusUpdate({ data });
      if (res && res.code == 0) {
        this.$message({
          message: "状态修改成功",
          type: "success"
        });
      }
    },
    // 根据资源类型获取资源名称
    getModelTrees(data) {
      const self = this;
      // 重置后面下拉框的数据 清空 
      self.optionsModel =[];
      self.optionsName = [];
      (async (data)=>{
				let res = await self.$api.getSearchName({data})
				if(res && res.code == 0) {
          this.resourceDatas = res.data;
          res.data.forEach((item, index)=>{
            let obj = {};
            obj.label = item.goodsName;
            obj.value = item.id;
            self.optionsName.push(obj)
          })
          self.$set(self.searchOptions[1], "options", self.optionsName)
				}
      })(data)
    },
    search(val) {
      console.log(val)
      this.requestData.page = 1;
      this.requestData.param = val;
      this.getModelList(this.requestData);
    },
    changeSearch(val) {
      console.log(val)
      const self = this;
      if (val.modelType) {
        if (self.startgoodsType != val.modelType) {
          let data = {
            goodsType: val.modelType
          };
          self.getModelTrees(data);
          self.$set(self.$refs.searchForm.form, "goodsId", '');
          self.$set(self.$refs.searchForm.form, "modelId", '');
          self.$set(self.$refs.searchForm.options[1], "options", [])
          self.$set(self.$refs.searchForm.options[2], "options", [])
          self.startgoodsType = val.modelType;
        }        
        if (val.goodsId) {
          if (self.startGoodsId != val.goodsId) {
            console.log(self.resourceDatas)
            self.resourceDatas.forEach((item,index) =>{
              // debugger
              if (val.goodsId == item.id) {
                self.optionsModel = [];
                item.modelInfoVoList.forEach(el =>{
                  let obj = {};
                  obj.label = el.deviceModel
                  obj.value = el.modelId
                  self.optionsModel.push(obj)
                });
                self.$set(self.searchOptions[2], "options", self.optionsModel);
                self.$set(self.$refs.searchForm.form, "modelId", '');
                self.startGoodsId = val.goodsId;
              }
            })
          }
        }
      }
    },
    reset() {
      this.startGoodsId = null;
      this.startgoodsType = null;
      console.log(this.$refs.searchForm)
      this.$set(this.$refs.searchForm.options[1], "options", []);
      this.$set(this.$refs.searchForm.options[2], "options", [])
    },
    selectBtn(val) {
      console.log(val)
      if (val.name == "新增") {
        this.$router.push({ name: "modelAdd" });
      }
    },
    // 型号搜索
    // modelSearch(data) {
    //   console.log("searchdata", data);
    //   this.requestData.param = data;
    //   this.requestData.page = 1;
    //   this.visiableTotal.show = true;
    //   this.getModelList(this.requestData);
    // },
    // 型号新增
    // modelAdd() {
    //   this.$router.push({ name: "modelAdd" });
    // },
    // 型号查看
    modelCheck(id, modelType) {
      switch (modelType) {
        case "设备":
          this.$router.push({
            path: "modelEquipmentCheck",
            query: {
              id
            }
          });
          break;
        case "配件":
          this.$router.push({
            path: "modelPreCheck",
            query: {
              id
            }
          });
      }
    },
    //型号修改
    modelAmend(row) {
      console.log(row);
      if (row.modelType == "配件") {
        // 配件
        this.$router.push({
          path: "modelModification",
          query: { id: row.id }
        });
      } else {
        // 设备
        this.$router.push({
          name: "facillityAlter",
          query: { ...row }
        });
      }
    },
    handleCurrentChange(currentPage) {
      this.requestData.page = currentPage;
      this.getModelList(this.requestData);
    },
    handleSizeChange(pageSize) {
      this.requestData.page = 1;
      this.requestData.pageSize = pageSize;
      this.getModelList(this.requestData);
    }
  }
};
</script>

<style lang="less">
</style>
