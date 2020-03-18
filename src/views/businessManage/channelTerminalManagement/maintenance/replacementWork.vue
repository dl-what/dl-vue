<!-- 置换工单 -->

<template>
  <div class="vlt-card">
    <search-bar
      class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      :total="tableDatas.total"
      labelWidth="6em"
    >
    <!-- <control-bar slot="extend-bar" @select="selectBtn" :options="controlOptions" position="left"></control-bar> -->
  </search-bar>
      <el-row class="card-table">
      <el-table
        :data="tableDatas.records"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
        class="table-box"
      >
        <el-table-column label="序号" width="80" fixed>
          <template slot-scope="scope">
          {{tableDatas.size*(tableDatas.current-1)+(scope.$index+1) || ''}}
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item,key) in tableKey"
          :key="key"
          :prop="item.value"
          :label="item.label"
          :width="item.width"
          :min-width="item.minWidth"
          :type="item.type"
        ></el-table-column>
        <el-table-column  label="关联维修单" width="120" >
          <template slot-scope="scope">
            <!-- <p style="color:#409EFF"> {{scope.row.orderId}}</p> -->
            <el-link type="primary" :id="'replacementWork-detail'+ scope.row.orderId" v-has="'replacementWork-detail'" :underline="false" size="mini" @click="handleClick(scope.row)">{{scope.row.orderId}}</el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <table-paging
      position="right"
      :total="tableDatas.total"
      :currentPage="requestData.page"
      :pageSize="requestData.pageSize"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></table-paging>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "replacementWork",
  data() {
   return {
      // 搜索组件配置
      searchOptions: [
        { type: "input", prop: "serviceStaffName", value: "", title: "维修人员", placeholder: "请输入" },
        { type: "select", prop: "goodsId", value: "", title: "物品名称", placeholder: "请选择", options: [] },
        { title: '维修时间', type: 'datepicker-range', prop: 'repairDate', value: '', options:['start', 'end'] },
        // 维修日期：
        {
          type: "select",
          prop: "orderStatus",
          value: "",
          title: "工单状态",
          placeholder: "请选择",
          options: [ { label: "待处理", value: 0 }, { label: "已完成", value: 1 }, { label: "已取消", value: 2 } ]
        }
      ],
      // controlOptions: [
      //   { name: "一键提醒", type: "primary", icon: "message-solid" }, // type为按钮的五种颜色， icon为具体的图标
      // ],
      tableDatas: {
        records: [
          {
            id: 0,
            itemCategory: "设备",
            itemName: "投注机",
            itemModel: "xxx",
            originalItemCode: "xxx",
            replacementItemCode: "xxx",
            repairTime: "2018-12-19 16:10:40",
            repairOrder: 'R20181212'
          },
        ],  
      },
        tableKey: [
          // {label: "序号",value: "id",width: "80",type: 'index'},
          {label: "物品类别",value: "goodsType",minWidth: "100"},
          {label: "物品名称",value: "goodsName",minWidth: ""},
          {label: "旧物品型号",value: "oldDeviceModel",minWidth: "100"},
          {label: "旧物品序列号",value: "oldDeviceCode",minWidth: "120"},
          {label: "新物品序列号",value: "newDeviceCode",minWidth: "120"},
          // {label: "工单状态",value: "orderStatus",width: "120"},
          // {label: "维修人员",value: "serviceStaffName",width: "120"},
          {label: "维修时间",value: "serviceDate",minWidth: "180"}
        ],
      goodsTypeArr: ['设备', '配件', '耗材', '设施'],
      orderStatusArr: ['待处理', '已完成', '已取消'],
      requestData: { page: 1, pageSize: 20, param: {insId:''} },
      insId: '',
      modelTreesList: [],
   }
  },
 components: {
 },
  created () {
    this.insId = this.$storage.get('userInfo').insId;
   
    this.getModelTrees (1);
  },
 methods: {
    getList(data) {
      const _this = this;
      (async data => {
        let res = await _this.$api.getQueryReplaceWorkOrderList({ data });
        console.log(res);
        if (res.code == 0) {
          if (res.data != null) {
              _this.tableDatas = res.data;
              _this.tableDatas.records&&_this.tableDatas.records.forEach(item => {
                // console.log(item);
               if(item.serviceDate ) item.serviceDate = _this.$moment(item.serviceDate ).format("YYYY-MM-DD HH:mm:ss");
                // item.type = _this.tagType[item.type];
                item.goodsType = _this.goodsTypeArr[Number(item.goodsType) - 1];
                item.orderStatus = _this.orderStatusArr[item.orderStatus];
                item.newDeviceCode = item.newReplaceWorkOrderVO ? item.newReplaceWorkOrderVO.newDeviceCode : '';
                item.oldDeviceCode = item.oldReplaceWorkOrderVO ? item.oldReplaceWorkOrderVO.oldDeviceCode : '';
                item.oldDeviceModel = item.oldReplaceWorkOrderVO ? item.oldReplaceWorkOrderVO.oldDeviceModel : '';
              })
          }
        }
      })(data);
    },  // 1 获取设备列表
    getModelTrees (goodsType) {
      const _this= this;
      (async (id) => {
        const data = {
          goodsType: id
        }
        let res = await _this.$api.getModelTrees({data});
        if (res&&res.code == 0) {
          if (res.data != null && res.data.length) {
            _this.modelTreesList = res.data;
            let options = [];
            _this.modelTreesList.forEach(item => {
              options.push({
                label: item.goodsName,
                value: item.id
              })
            })
            _this.$set(_this.searchOptions[1], 'options', options)
          }
           if (this.insId) {
            this.requestData.param.insId = this.insId;
            this.getList(this.requestData);
          }
        }
      })(goodsType)
    },
    search(form) {
      if (form.repairDate) {
        form.startDate = this.$moment(form.repairDate[0]).format('YYYY-MM-DD');
        form.endDate = this.$moment(form.repairDate[1]).format('YYYY-MM-DD');
        delete form.repairDate;
      }
      // if (form.orderStatus) {form.orderStatus = Number }
      this.requestData.param = {
        insId: this.insId,
        ...form
      }

      this.requestData.page = 1;
      this.getList(this.requestData);
      console.log("search", form);
    },

    // selectBtn(val) {
    //   console.log(val);
    // },
    handleClick(row) {
      console.log(row);
      this.$router.push({
        name: "replacementWorkDetails",
        query: {
          orderId: row.orderId
        }
      });
    },
    remind(row) {
      console.log(row);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(pageSize) {
      console.log(pageSize);
      this.requestData.pageSize = pageSize;
      this.requestData.page = 1;
      this.getList(this.requestData)
    },
    handleCurrentChange(currentPage) {
      console.log(currentPage);
      this.requestData.page = currentPage;
      this.getList(this.requestData)
    }
 },
}
</script>

<style lang="less" scoped>
</style>
