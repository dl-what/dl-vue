<template>
  <div class="vlt-card">
    <section class="comp-item">
      <panel :show="true"  title="基本信息">
        <base-info :infoList="infoList"></base-info>
      </panel>
      <!-- <el-row class="btn-controll">
        <el-button class="btn-back" size="small" @click="$router.back()">返回</el-button>
      </el-row> -->
      <panel :show="true"  title="绑定记录" v-if="isShow">
        <div class="table-wrap">
          <el-table :data="infoTable" border style="width: 100%" class="table-box" >
            <el-table-column label="序号" type="index" width="80"></el-table-column>
            <el-table-column label="姓名" prop="memberName" min-width="120px"></el-table-column>
            <el-table-column label="手机号码" prop="mobile" min-width="120px"></el-table-column>
            <el-table-column label="性别" prop="sex" min-width="120px">
            </el-table-column>
            <el-table-column label="证件号" prop="documentNumber" min-width="200"></el-table-column>
            <el-table-column label="年龄" prop="age" min-width="80"></el-table-column>
            <el-table-column label="绑定时间" prop="bindTime" min-width="200"></el-table-column>
            <el-table-column label="解绑时间" prop="unbindTime" min-width="200"></el-table-column>
          </el-table>
        </div>
      </panel>
    </section>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "infoDetail",
  data() {
    return {
      infoList: [
        { title: "批次", value: "", prop: "batch" },
        { title: "投注卡类型", value: "", prop: "bettingCardTypeDesc" },
        { title: "所属机构", value: "广东省", prop: "insName" },
        { title: "投注卡编号", value: "", prop: "cardCode" },
        { title: "投注卡状态", value: "", prop: "cardStatus" },
        { title: "押金", value: "", prop: "cardDeposit"},
        { title: "开卡渠道", value: "", prop: "channelNo" }
      ],
      infoTable: [],
      cardStatusArr: ['待激活','已激活','退卡','挂失','补卡','换卡','报废','逾期','注销'],
      isShow: true
    };
  },
  components: {},
  created() {
    let id = this.$route.query.cardId;
    if (id) {
      this.id = id;
      this.initDetail(this.id)
    }
  },
  methods: {
    async initDetail(id) {
      const _this = this;
      let result = await this.$api.bettingCardInfoDetail({
        data: id
      });
      console.log(result);
      if (result.code === 0) {
        _this.infoList.forEach(item => {
          item.value = result.data[item.prop]
          if (item.prop == 'bettingCardType') {
            item.value = _this.forMatType(result.data[item.prop]);
          } else if ( item.prop == 'cardStatus') {
            item.value = _this.cardStatusArr[Number(result.data[item.prop]) - 1];
            let isStatus = item.value;
             if (isStatus == '待激活'){
              // _this.isShow = false;
            } else if (isStatus != '已激活') {
              _this.infoList.splice(_this.infoList.length - 1);
            } else {
              // _this.isShow = true;
            }
          }
          if (item.prop == 'cardDeposit') {
            item.value = result.data[item.prop] ? Number(result.data[item.prop]) / 100 + '元' : 0 + '元'
          }
        })
        if (result.data.bindingRecordList.length) {
          _this.infoTable = result.data.bindingRecordList.filter(item => item != null);
          _this.infoTable&&_this.infoTable .forEach(item => {
            if (item) {
              item.sex = item.sex ?  item.sex == 1 ? '男' : '女' : '';
            }
          })
        }
      }
    },
    forMatType(type) {
      switch (type) {
        case 0:
          return (type = "投注卡");
        case 1:
          return (type = "会员卡");
        case 2:
          return (type = "试玩卡");
      }
    },
    forMatStatus(status) {
      switch (status) {
        case 1:
          return (status = "待激活");
        case 2:
          return (status = "已激活");
        case 3:
          return (status = "失效");
      }
    }
  }
};
</script>

<style lang="less" scoped>

.tips-name {
  display: block;
  margin: 20px auto;
  font-size: 14px;
  color: #666;
  font-weight: 600;
}
.btn-controll {
  width: 100%;
  text-align: right;
  .btn-back {
    margin-top: 20px;
    margin-right: 100px;
  }
}
.table-wrap{
  padding: 10px;
}
</style>
<style lang="less">
  .comp-item {
    .info-list .title {
      min-width: 6em;
    }
  }
</style>
