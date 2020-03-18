<!-- 维修工单 -->
<template>
  <div class="vlt-card repair-work">
    <search-bar
      class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      :total="total"
      labelWidth="6em"
      @searchReset="reset"
    >
    <control-bar slot="extend-bar" @select="selectBtn" :options="controlOptions" position="left"></control-bar>
  </search-bar>
      <el-row class="card-table">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
        class="table-box"
      >
      <el-table-column label="序号" width="80" fixed>
          <template slot-scope="scope">
          {{requestData.pageSize*(requestData.page-1)+(scope.$index+1)}}
          </template>
        </el-table-column>
        <!-- <el-table-column
          v-for="(item,key) in tableKey"
          :key="key"
          :prop="item.value"
          :label="item.label"
          :width="item.width"
          :type="item.type"
        ></el-table-column> -->
        <el-table-column prop="orderId" label="工单编号" min-width="120px"></el-table-column>
        <el-table-column prop="goodsName" label="设备名称" min-width="160px"></el-table-column>
        <el-table-column prop="faultLevel" label="故障级别" min-width="120px">
          <template slot-scope="scope">
            <span
              class="icon-circle"
              :class="{
              blue:scope.row.faultLevel=='1',
              green:scope.row.faultLevel=='2',
              grey:scope.row.faultLevel=='0',
              yellow:scope.row.faultLevel=='4',
              red:scope.row.faultLevel=='3',
              }"
            >{{scope.row.strFaultLevel}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="hallId" label="渠道编号" min-width="100px"></el-table-column>
        <el-table-column prop="insName" label="所属机构" min-width="160px"></el-table-column>
        <el-table-column prop="orderStatus" label="工单状态" min-width="120px">
          <template slot-scope="scope">
            <span
              class="icon-tag"
              :class="{
              blue:scope.row.orderStatus=='0',
              green:scope.row.orderStatus=='1',
              grey:scope.row.orderStatus=='2',
              yellow:scope.row.orderStatus=='3',
              red:scope.row.orderStatus=='4',
              }"
            >{{scope.row.strOrderStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="repairDate" label="报修时间" min-width="160px"></el-table-column>
        <el-table-column prop="serviceStaffName" label="维修员" min-width="140px" show-overflow-tooltip></el-table-column>
        <el-table-column prop="serviceDate" label="维修时间" min-width="160px"></el-table-column>
        <el-table-column fixed="right" label="操作" min-width="140" align="center">
          <template slot-scope="scope" >
            <div class="cell-item" >
              <el-button :id="'repairWork-detail'+scope.$index" type="primary" v-has="'repairWork-detail'" size="mini" @click="handleClick(scope.row)">查看  </el-button>
              <el-button :id="'repairWork-reminder'+scope.$index" type="primary" v-has="'repairWork-reminder'"  :disabled="scope.row.serviceStaff == null || scope.row.orderStatus != 0"  size="mini" @click="remind(scope.row)">提醒</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <table-paging
      position="right"
      :total="total"
      :currentPage="requestData.page"
      :pageSize="requestData.pageSize"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></table-paging>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "repairWork",
  data() {
   return {
      // 搜索组件配置
      searchOptions: [
        {type: "input",prop: "serviceStaffName",value: "",title: "维修人员",placeholder: "请输入"},
        {
          type: "select",
          prop: "goodsId",
          value: "",
          title: "设备名称",
          placeholder: "请选择",
          options: []
        },
        {title: '维修日期', type: 'datepicker-range', prop: 'repairDate', value: '', options:['start', 'end']},
        {
          type: "select",
          prop: "orderStatus",
          value: "",
          title: "工单状态",
          placeholder: "请选择",
          options: [
            {label: "待处理",value: '0'},
            {label: "已完成",value: '1'},
            {label: "已取消",value: '2'}
          ]
        }
      ],
      controlOptions: [
        { name: "一键提醒", type: "primary", icon: "message-solid", disabled:true, permission: 'repairWork-oneClickReminder'}, // type为按钮的五种颜色， icon为具体的图标
      ],
      tableDatas: {
        records: []
      },
      total: 0,
      tableKey: [
        // {label: "序号",value: "id", width: "80", type: 'index'},
        {label: "工单编号",value: "orderId",width: "100"},
        {label: "大厅编号", value: "hallId",width: "100"},
        {label: "所属机构",value: "insName",width: ""},
        {label: "设备名称",value: "goodsName",width: "150"},
        {label: "故障级别",value: "faultLevel",width: ""},
        {label: "报修时间",value: "repairDate",width: "160" },
        {label: "维修时间",value: "serviceDate",width: "160"},
        {label: "维修员",value: "serviceStaffName",width: ""},
        {label: "工单状态", value: "orderStatus",width: ""}
      ],
      tableData: [],
      requestData: { page: 1, pageSize: 20, param: {} },
      insId: '',
      modelTreesList: [],
      orderStatusArr: ['待处理', '已完成', '已取消'],
      goodsTypeArr: ['设备', '配件', '耗材', '设施'],
      faultLevelArr: ['一般', '影响销售', '紧急报障']
   }
  },
 components: {},
  created () {
    this.insId = this.$storage.get('userInfo').insId;
   
    this.getModelTrees (1);

  },
 methods: {
    getList(data) {
      const _this = this;
      (async data => {
        let res = await _this.$api.getQueryServiceWorkOrderList({ data });
        console.log(res);
        if (res.code == 0) {
          if (res.data != null) {
            res.data.records&&res.data.records.forEach(item => {
            //  if(item.repairDate )  item.repairDate = _this.$moment(item.repairDate ).format("YYYY-MM-DD HH:mm:DD");
            //   if(item.serviceDate ) item.serviceDate = _this.$moment(item.serviceDate ).format("YYYY-MM-DD HH:mm:DD");

              if(String(item.orderStatus)) item.strOrderStatus = _this.orderStatusArr[item.orderStatus];
              if(String(item.goodsType)) item.goodsType = _this.goodsTypeArr[Number(item.goodsType) - 1];
              if(String(item.faultLevel)) item.strFaultLevel = _this.faultLevelArr[Number(item.faultLevel - 1)];
              item.repairDate = item.repairDate && item.repairDate !=null ? this.$moment(item.repairDate).format('YYYY-MM-DD HH:mm:ss') : '';
               item.serviceDate = item.serviceDate && item.serviceDate != null ?  this.$moment(item.serviceDate).format('YYYY-MM-DD HH:mm:ss') : '';
            })
            _this.tableData = res.data.records;
            _this.total = res.data.total;
            res.data.records.length ? _this.controlOptions[0].disabled = false : _this.controlOptions[0].disabled = true;
          }
        }
      })(data);
    },
     // 1 获取设备列表
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
        }
        if (this.insId) {
          this.requestData.param.insId = this.insId;
          this.getList(this.requestData);
        }
      })(goodsType)
    },
    search(form) {
      console.log("search", form);
      if (form.repairDate) {
        form.startDate = this.$moment(form.repairDate[0]).format('YYYY-MM-DD');
        form.endDate = this.$moment(form.repairDate[1]).format('YYYY-MM-DD');
        delete form.repairDate;
      }
      if (form.serviceStaff) {
        form.serviceStaff  = Number(form.serviceStaff);
      }
      this.requestData.param = {
        insId: this.insId,
        ...form
      }
      this.requestData.page = 1;

      this.getList(this.requestData);
    },
    reset () {
      // this.$set(this.searchOptions[1], 'options', [])
    },
    sendRemindWorkOrder (batchOrder, id) {
      const _this = this;
      const data = {
        batchOrder: batchOrder,
	      orderId: id,
      };
      (async (data) => {
        let res = await _this.$api.sendRemindWorkOrder({message: '提醒成功！', data });
        if (res&&res.code == 0) {}
      })(data)
    },
    selectBtn(val) {
      console.log(val);
      this.sendRemindWorkOrder(true)
    },
    handleClick(row) {
      console.log(row);
      this.$router.push({
        name: "repairOrderDetails",
        query: {
          orderId: row.orderId
        }
      });
    },
    remind(row) {
      console.log(row);
      this.sendRemindWorkOrder (false, row.orderId)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(pageSize) {
      console.log(pageSize);
      this.requestData.pageSize = pageSize;
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

<style lang="less">
.main-body .repair-work  .el-table td:last-child {
  text-align: center;
  .cell {
    text-align: left;
    .cell-item {
      text-align: center;
      &>span {
        width: 40px;
        display: inline-block;
        margin-left: 10px;
      }
    }
  }
}
.repair-work .el-icon-message-solid {
    display: inline-block;
    vertical-align: middle;
}
</style>
