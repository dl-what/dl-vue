<template>
  <div>
    <div class="vlt-card">
      <h2 class="title">业务办理</h2>
      <div class="vlt-card-wrap">
        <div class="vlt-card-item" v-has="item.router" v-for="(item,index) in channelData" :key="index">
          <div class="vlt-card-box vlt-box channel" @click="select(item)">
            <span class="icon-wrap">
              <i :class="`iconfont icon-${item.icon}`"></i>
            </span>
            <span class="text">{{item.title}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="vlt-card">
      <h2 class="title">权限控制</h2>
      <div class="vlt-card-wrap">
        <div class="vlt-card-item" v-has="item.router" v-for="(item,index) in permissionData" :key="index">
          <div class="vlt-card-box vlt-box permission" @click="select(item)">
            <span class="icon-wrap">
              <i :class="`iconfont icon-${item.icon}`"></i>
            </span>
            <span class="text">{{item.title}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="vlt-card">
      <h2 class="title">渠道资源</h2>
      <div class="vlt-card-wrap">
        <div class="vlt-card-item" v-has="item.router" v-for="(item,index) in  resourceData" :key="index">
          <div class="vlt-card-box vlt-box resource" @click="select(item)">
            <span class="icon-wrap">
              <i :class="`iconfont icon-${item.icon}`"></i>
            </span>
            <span class="text">{{item.title}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "",
  data() {
    return {
      channelData: [
        {title: '渠道新建', icon:'xinjian', router: 'channelCreate'},
        {title: '渠道变更', icon:'biangeng', router: 'channelChange'},
        {title: '渠道迁址', icon:'qianzhi', router: 'channelRelocation'},
        {title: '渠道关停', icon:'guanting', router: 'channelStop'},
        {title: '渠道过户', icon:'guohu', router: 'channelTransfer'},
        {title: '渠道增机', icon:'zenji', router: 'channelAddMachine'},
        {title: '渠道退机', icon:'tuiji', router: 'channelBackMachine'},
        {title: '渠道移机', icon:'yiji', router: 'channelMoveMachine'},
      ],
      permissionData: [
        {title: '销售权限', icon:'xiaoshou', router: 'permissionChannelSales'},
        {title: '费率调整', icon:'feilv', router: 'permissionChannelRate'},
        // {title: '资金权限', icon:'zijin', router: 'permissionChannelFunds'},
      ],
      resourceData: [
        {title: '资源采购', icon:'caigou', router: 'resourcePurchase'},
        {title: '资源申请', icon:'shenqing', router: 'resourceApply'},
        {title: '资源发放', icon:'fafang', router: 'resourceProvide'},
        {title: '资源调拨', icon:'diaobo', router: 'resourceAllot'},
        {title: '资源报废', icon:'baofei', router: 'resourceScrap'},
      ]
    };
  },
  components: {},
  methods: {
    select(val) {
      this.$router.push({name: val.router, query: {type: 0}})
    }
  }
};
</script>

<style lang="less" scoped>
@import "../less/index.less";
.title {
  border-bottom: 1px solid #e8eaec;
  padding: 14px 16px;
  line-height: 20px;
  font-size: 14px;
  color: #606266;
  font-weight: 700;
}
.vlt-card {
  margin-bottom: 20px;
}
.vlt-card-wrap {
  display: flex;
  flex-wrap: wrap;
}
.vlt-card-item {
  flex: 15%;
  max-width: 170px;
  height: 200px;
  padding: 25px 10px;
}
.vlt-card-box {
  width: 100%;
  height: 100%;
  border: 1px solid #e8eaec;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
}
.icon-wrap {
  display: block;
  width: 90px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}
.iconfont {
  font-size: 64px;
}
.text {
  margin-top: 10px;
}
.channel {
  .icon-wrap {
    border: 1px solid #42c3af;
  }
  .iconfont {
    color: #42c3af;
  }
}
.permission {
  .icon-wrap {
    border: 1px solid #f6625a;
  }
  .iconfont {
    color: #f6625a;
  }
}
.resource {
  .icon-wrap {
    border: 1px solid #ffa63e;
  }
  .iconfont {
    color: #ffa63e;
  }
}
</style>
