<template>
  <div class="vlt-card">
    <div class="time-line">
      <div v-for="item  in timeLiness" :key="item.id" class="list">
        <div class="date">
          <h5>{{item.lineTime}}</h5>
          <!-- <span>{{item.outWarehouseTime}}</span> -->
          <i class="point"></i>
        </div>
        <div class="events-box" :class="item.type ? 'isIn': 'isOut'">
          <div class="events-item">
            <p
              class="title"
            >由【{{item.warehouseByName}}】发起 【{{item.documentToppic}}】 -- 【{{item.oplTypeName}}】操作</p>
            <p class="content"> <span>【{{item.warehouseName}}】</span>  <span> --【{{typeArr[item.type]}} 】</span></p>
          </div>
        </div>
      </div>
    </div>
      <p class="no-mess" v-if="noMess">暂无数据</p>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "",
  data() {
    return {
      noMess: false,
      timeLiness: [],
      formatoplType:['资源采购','资源申请','资源发放','资源调拨','建厅发送','撤厅回收','资源报废', '渠道退机', '渠道增机', '渠道移机','渠道变更', '渠道迁址', '渠道过户', '渠道换机'],
      typeArr: ['出库','入库' ]
    };
  },
  mounted() {},
  created() {
    const routerQuery = this.$route.query;
    if (routerQuery && routerQuery.serial) {
      const data = {
        serial: routerQuery.serial
      };
      this.initList(data);
    }
  },
  methods: {
    async initList(data) {
      const _this = this;
      let result = await _this.$api.equipmentRecord({ data });
      if (result.code == 0 ) {
        if ( result.data.length > 0) {
          this.timeLiness = result.data.filter(item => {
            return item !=null;
          }).map(item => {
            // item.oplType = _this.formatoplType[parseInt(item.oplType)];
            item.lineTime = !parseInt(item.type) ? item.outWarehouseTime : item.entryWarehouseTime;
            item.warehouseName = !parseInt(item.type) ? item.outWarehouseName : item.entryWarehouseName;
            item.warehouseByName = !parseInt(item.type) ? item.outWarehouseByName : item.entryWarehouseByName;
            item.lineTimes =  !parseInt(item.type) ? new Date(item.outWarehouseTime).getTime() : new Date(item.entryWarehouseTime).getTime();
            return item;
          })
          
          if (this.timeLiness.length < 1) {
            this.noMess = true;
          } else {
            this.timeLiness.sort(this.sortBy('lineTimes'));
            console.log(this.timeLiness);
          }
        } else {
          console.log('无数据');
        }
      } else {
        _this.$message.warning(result.msg);
      }
      // equipmentRecord
    },
    sortBy(props) {
      return function(a,b) {
          return b[props] - a[props];
      }
    }
  },
  components: {}
};
</script>

<style lang="less" scoped>
.vlt-card {
  padding: 20px;
  .no-mess {
    font-size: 16px;
    display: block;
    margin: 50px auto;
    width: 200px;
    text-align: center;
    color: #909399;
  }
}
.time-line {
  position: relative;
  &:before {
    display: block;
    content: "";
    position: absolute;
    top: 0;
    left: 200px;
    width: 1px;
    height: 100%;
    background: #f1f1f1;
  }
  .date {
    // float: left;
    position: absolute;
    width: 170px;
    margin-left: 30px;
    padding-right: 30px;
    color: #4c9fd0;
    text-align: right;
    h5 {
      font-size: 16px;
      line-height: 2;
    }
    p {
      font-size: 12px;
    }
    &:after {
      display: block;
      content: "";
      position: absolute;
      right: -9px;
      top: 20px;
      width: 16px;
      height: 16px;
      border-radius: 10px;
      border: 1px solid #4c9fd0;
      background: #fff;
    }
  }
  .events-box {
    .events-item {
      // float: left;
      position: relative;
      max-width: 800px;
      margin-left: 240px;
      padding: 20px;
      background: #eaf4fe;
      border: 1px solid #e0eefd;
      border-radius: 4px;
      &:before {
        position: absolute;
        left: -20px;
        display: block;
        content: "";
        border-top: 10px transparent dashed;
        border-left: 10px transparent dashed;
        border-bottom: 10px transparent dashed;
        border-right: 10px #eaf4fe solid;
      }
      &:not(first-child) {
        margin-top: 30px;
      }
      .title {
        font-size: 14px;
      }
      .content {
        margin-top: 10px;
        font-size: 12px;
        color: #333;
      }
    }
    &.isIn {
      .events-item {
        background: #d8eafc;
        border: 1px solid #d8eafc;
        &:before {
          border-right: 10px #d8eafc solid;
        }
      }
    }
    &.isOut {
      .events-item {
        background: #e7f3ff;
        border: 1px solid #d8eafc;
        &:before {
          border-right: 10px #e7f3ff solid;
        }
      }
    }
  }
}
</style>
