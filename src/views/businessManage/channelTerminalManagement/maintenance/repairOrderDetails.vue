<template>
  <!-- 维修工单详情 -->
  <div class="vlt-card repair-order-details">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="待处理"></el-step>
      <el-step title="进行中" v-if="ownStatus != '已取消'"></el-step>
      <el-step :title="ownStatus"></el-step>
    </el-steps>

    <el-row class="mt20">
      <panel :show="true"  title="报修信息">
        <base-info :infoList="infoList"></base-info>
      </panel>
    </el-row>
    <el-row class="mt20">
      <panel :show="true" title="设备更换信息">
        <base-info :infoList="infoList2"></base-info>
      </panel>
    </el-row>
    <!-- <el-button style="margin-top: 12px;" @click="next">下一步</el-button> -->
    <!-- <el-row class="vlt-edit-btn mt20" style="text-align: right">
      <el-button type="primary" v-prevent="1000" size="medium" @click="submit">确定</el-button>
      <el-button size="medium" @click="cancel">取消</el-button>
    </el-row> -->
  </div>
</template>

<script type="text/javascript">
export default {
  name: "repairOrderDetails",
  data() {
    var name = this.routerName = this.$route.name == 'repairOrderDetails' ? '设备' : '物品'
    return {
      active: 0,
      infoList: [
        { title: "工单编号", value: "", prop: "orderId" },
        { title: `物品名称`, value: "", prop: "goodsName" },
        { title: "所属机构", value: "", prop: "insName" },
        { title: "故障级别", value: "", prop: "faultLevel" },
        { title: "渠道编号", value: "", prop: "hallId" },
        { title: "报修人", value: "", prop: "repairStaffName" },
        { title: "故障类型", value: "", prop: "faultType" },
        { title: "故障描述", value: "", prop: "faultDesc" }
      ],
      infoList2: [
        { title: `新${name}名称`,value: "",prop: "newGoodsName"},
        { title: `新${name}型号`,value: "",prop: "newDeviceModel"},
        { title: `新${name}序列号`,value: "",prop: "newDeviceCode"},
        { title: `旧${name}名称`,value: "", prop: "oldGoodsName"},
        { title: `旧${name}型号`,value: "", prop: "oldDeviceModel"},
        { title: `旧${name}序列号`,value: "", prop: "oldDeviceCode"},
        { title: "维修时长", value: "", prop: "serviceDate" },
        { title: "维修人", value: "", prop: "serviceStaffName" }
      ],
      orderId: '',
      ownStatusArr: ['待处理','已完成','已取消'],
      ownStatus: '已完成',
      faultLevelArr: ['一般', '影响销售', '紧急报障'],
      routerName: ''
    };
  },
  created() {
    console.log(this.$route.name);
    
    this.orderId = ""+ this.$route.query.orderId;
    if (this.orderId) {
      this.getInfo(Number(this.orderId));
    }
  },
  methods: {
    getInfo (id) {
      const _this = this;
      const data = {
        orderId: id
      };
      (async (datasdata) => {
        let res =  await _this.$api.getQueryServiceWorkOrderInfo({ data });
        if (res && res.code == 0) {
          console.log(res);
          if (res.data) {
            let datas = res.data;
            console.log(datas);
            _this.infoList.forEach(item => {
              item.value = datas[item.prop];
              if (item.prop == 'faultLevel') item.value = _this.faultLevelArr[datas[item.prop] - 1]
            })
            if (datas.oldReplaceWorkOrderVO && datas.newReplaceWorkOrderVO) {
              _this.infoList2.forEach(item => {
                if (item.prop.indexOf('old') > -1) {
                  item.value = datas.oldReplaceWorkOrderVO[item.prop];
                }
                 if (item.prop.indexOf('new') > -1) {
                  item.value = datas.newReplaceWorkOrderVO[item.prop];
                }
                if (item.prop == 'serviceStaffName' ) {
                  item.value = datas[item.prop];
                }
                if (item.prop == 'serviceDate') {
                  if  (datas[item.prop] &&  datas['repairDate']) {
                    let data2 = new Date(datas[item.prop]).getTime() - new Date(datas['repairDate']).getTime();
                    console.log(data2);
                      let minutes = parseInt((data2 % (1000 * 60 * 60)) / (1000 * 60));; 
                      let sencods =  parseInt(data2 % (1000 * 60)) / 1000;
                      item.value = `${minutes}分钟${sencods}秒`;
                    // item.value = this.$moment(data2).format('mm:ss');
                  } else {
                    item.value = '';
                  }
                }
              })
            }
            // console.log(Number(datas.orderStatus));
            switch(Number(datas.orderStatus)) {
              case 0:
                _this.active = 1;
                _this.ownStatus = _this.ownStatusArr[1];
                return;
              case 1:
                _this.active = 3
                _this.ownStatus = _this.ownStatusArr[1];
                return;
              case 2:
                _this.active = 3
                _this.ownStatus = _this.ownStatusArr[2];
                return;
            }
          }
        }
      })(data)
      
    },
    next() {
      if (this.active++ > 2) this.active = 0;
    },
    submit() {
      console.log(22);
    },
    cancel() {
      console.log(22);
    }
  },
  components: {}
};
</script>

<style lang="less" scoped>
.mt20 {
  margin-top: 20px;
}
.vlt-card {
  padding: 20px;
}
</style>
<style lang="less">
  .repair-order-details {
    .base-info .info-list .title {
      min-width: 5em;
    }
    .el-step__head.is-success  {
      color: #409eff;
      border-color: #409eff;
    }
    .el-step__title.is-success {
      color: #409eff;
    }
  }
</style>
