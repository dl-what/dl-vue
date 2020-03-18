<template>
  <div class="vlt-card">
    <div class="tabs-content">
      <!-- <h3>基本信息管理</h3>
      <el-tabs tab-position="left" style="height: auto">
        <el-tab-pane label="类型管理"> -->
          <search-bar
            class="search-bar-demo"
            @search="search"
            :options="typeInfoOptions"
            :total="typeTotalCount"
            labelWidth="6em"
          >
          <control-bar slot="extend-bar" :options="controlOptions" @select="addEquipment" position="left"></control-bar>
          </search-bar>
          <el-table :data="typeData" border style="width: 100%">
            <el-table-column prop="id" label="序号" type="index" width="60px" fixed="left">
              <template slot-scope="scope">
                {{requestData1.pageSize*(requestData1.page-1)+(scope.$index+1)}}
              </template>
            </el-table-column>
            <el-table-column prop="goodsTypeName" label="物品类别" min-width="160px"></el-table-column>
            <el-table-column prop="goodsName" label="物品名称" min-width="250px"></el-table-column>
            <el-table-column prop="remark" label="备注" show-overflow-tooltip min-width="250px"></el-table-column>
            <el-table-column prop="status" label="状态" min-width="120px">
              <template slot-scope="scope">
                <el-switch
                  :id="'typeManage-switch' + scope.$index"
                  
                  @change="changeState(scope.row.id,scope.row.status)"
                  v-model="scope.row.status"
                  v-has="'typeManage-switch'"
                  :active-text="scope.row.status==1?'开启':'关闭'"
                  :active-value="1"
                  :inactive-value="2"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="160" fixed="right">
              <template slot-scope="scope">
                <el-button
                  :id="'typeManage-detail' + scope.$index"
                  @click="typeCheck(scope.row.id,scope.row.goodsType)"
                  type="primary"
                  v-has="'typeManage-detail'"
                  size="mini"
                >查看</el-button>
                <el-button
                  :id="'typeManage-edit' + scope.$index"
                  :disabled="scope.row.status == 1"
                  @click="typeAmend(scope.row.id,scope.row.goodsType)"
                  type=""
                  v-has="'typeManage-edit'"
                  size="mini"
                >编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          <table-paging
            position="right"
            :total="typeTotalCount"
            :currentPage="requestData1.page"
            :pageSize="requestData1.pageSize"
            @handleSizeChange="handleSizeChangeType"
            @handleCurrentChange="handleCurrentChangeType"
          ></table-paging> 
        <!-- </el-tab-pane>
        <el-tab-pane label="型号管理">
          <modelManage></modelManage>
        </el-tab-pane>
      </el-tabs> -->
    </div>
  </div>
</template>

<script type="text/javascript">
import rules from "@/utils/rules.js";
export default {
  name: "typeManage",
  data() {
    return {
      typeTotalCount: 0,
      typeInfoOptions: [
        {
          title: "物品类别",
          type: "select",
          prop: "goodsType",
          value: "",
          options: [
            { label: "设备", value: 1 },
            { label: "配件", value: 2 },
            { label: "耗材", value: 3 },
            { label: "设施", value: 4 }
          ]
        },
        {
          title: "物品名称",
          type: "select",
          prop: "goodsId",
          value: "",
          options: []
        },
        {
          title: "物品状态",
          type: "select",
          prop: "status",
          value: "",
          options: [{ label: "开", value: 1 }, { label: "关", value: 2 }]
        }
      ],
      controlOptions: [{ name: "新增", type: "primary", icon: "plus", permission: 'typeManage-add'}],
      //类型管理列表
      typeData: [],
      //物品名称列表
      goodsNameData: [],
      rules2: {
        goodsCategory: [
          { required: true, validator: rules.checkEmpty, trigger: ['change','blur'] }
        ],
        equipmentName: [
          { required: true, validator: rules.checkEmpty, trigger: ['change','blur'] }
        ],
        equipmentUnit: [
          { required: true, validator: rules.checkEmpty, trigger: ['change','blur'] }
        ],
        isStandard: [
          { required: true, validator: rules.checkEmpty, trigger: ['change','blur'] }
        ],
        isRecycle: [
          { required: true, validator: rules.checkEmpty, trigger: ['change','blur'] }
        ],
        remark: [
          { required: true, validator: rules.checkEmpty, trigger: ['change','blur'] }
        ],
        equipmentPrice: [
          { required: true, validator: rules.checkEmpty, trigger: ['change','blur'] }
        ],
        upperLimit: [
          { required: true, validator: rules.checkEmpty, trigger: ['change','blur'] }
        ],
        lowerLimit: [
          { required: true, validator: rules.checkEmpty, trigger: ['change','blur'] }
        ]
      },
      // 类型管理参数
      requestData1: {
        page: 1,
        pageSize: 20,
        param: {
          goodsId: 0,
          goodsType: 0,
          status: 0
        }
      }
    };
  },
  created() {
    this.getTypeList(this.requestData1);
    this.getSelectOption();
  },
  methods: {
    //类型管理
    //状态修改
    async changeState(id, state) {
      console.log(id, state);
      let data = {
        id: id,
        status: state,
        updateBy: "",
        updateTime: ""
      };
      let res = await this.$api.statusUpdate({ data });
      if (res && res.code == 0) {
        this.$message({
          message: "状态修改成功",
          type: "success"
        });
      }
    },
    //获取类型管理物品名称
    async getSelectOption(data) {
      const self = this;
      let res = await this.$api.getModelTrees({ data });
      console.log("物品名称", res);
      if (res && res.code == 0) {
        let array = [];
        res.data.forEach(item => {
          let obj = {};
          obj.label = item.goodsName;
          obj.value = item.id;
          array.push(obj);
          self.$set(self.typeInfoOptions[1], "options", array);
        });
      }
    },
    //搜索
    search(data) {
      console.log(data);
      this.requestData1.page = 1;
      this.requestData1.param = data;
      this.getTypeList(this.requestData1);
    },
    //新增事件
    addEquipment() {
      this.$router.push({ name: "addEquipment" });
    },
    //修改
    typeAmend(id, goodsType) {
      this.$router.push({
        path: "modification",
        query: {
          id,
          goodsType
        }
      });
    },
    //类型查看
    typeCheck(id, goodsType) {
      console.log(goodsType);
      switch (goodsType) {
        case 1:
          this.$router.push({
            path: "equipmentCheck",
            query: { id }
          });
          break;
        case 4:
          this.$router.push({
            path: "facilityCheck",
            query: { id }
          });
          break;
        case 3:
          this.$router.push({
            path: "consumableCheck",
            query: { id }
          });
          break;
        case 2:
          this.$router.push({
            path: "mountingsCheck",
            query: { id }
          });
          break;
      }
    },

    //获取类型管理列表
    async getTypeList(data) {
      let obj = {
        1: "设备",
        2: "配件",
        3: "耗材",
        4: "设施"
      };
      let res = await this.$api.getGoosType({ data });
      console.log(res);
      if (res && res.code == 0) {
        this.typeData = res.data.records;
        this.typeData.forEach(item => {
          item.goodsTypeName = obj[item.goodsType];
        });
        this.typeTotalCount = res.data.total;
      }
    },
    //获取类型管理物品名称
    async getSelectOption(data) {
      const self = this;
      let res = await this.$api.getModelTrees({ data });
      console.log("物品名称", res);
      if (res && res.code == 0) {
        let array = [];
        res.data.forEach(item => {
          let obj = {};
          obj.label = item.goodsName;
          obj.value = item.id;
          array.push(obj);
          self.$set(self.typeInfoOptions[1], "options", array);
        });
      }
    },
    handleCurrentChangeType(currentPage) {
      this.requestData1.page = currentPage;
      this.getTypeList(this.requestData1);
    },
    handleSizeChangeType(pageSize) {
      this.requestData1.page = 1;
      this.requestData1.pageSize = pageSize;
      this.getTypeList(this.requestData1);
    }
  }
};
</script>

<style lang="less">
h3 {
  margin-bottom: 20px;
}
</style>
