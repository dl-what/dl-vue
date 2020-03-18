<template>
  <div class="service-wrap">
    <ul class="service-wrapper">
      <li class="customer">
        <div>
          <span><i class="iconfont icon-kehu"></i></span>
        </div>
        <div>
          <div class="content">
            <p class="content-bd">内容：APP上充值可以在销售厅用吗?</p>
          </div>
          <p class="time">2019-09-12 12:23:45</p>
        </div>
      </li>
      <li class="customer-service">
        <div>
          <div class="content">
            <p class="content-bd">内容：APP上充值可以在销售厅用吗?</p>
          </div>
          <p class="time">2019-09-12 12:23:45</p>
        </div>
        <div>
          <span><i class="iconfont icon-kefu"></i></span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/javascript">

export default {
  name: "",
  components: {
  },
  data() {
    return {

    }
  },
  methods: {
  },
}
</script>

<style lang="less" scoped>
  .service-wrap{
    min-height: 480px;
    padding: 16px 0;
  }
  .service-wrapper{
    display: flex;
    flex-direction: column;
  }
  .customer{
    display: flex;
    max-width: 70%;
    padding-bottom: 16px;
    .icon-kehu{
      font-size: 40px;
    }
    .time{
      padding-left: 10px;
      line-height: 1.8;
      font-size: 13px;
    }
    .content{
      margin-left: 10px;
      border-radius: 4px;
      background-color: #e8eaec;
      padding: 8px;
      &-hd{
        line-height: 1.5;
      }
      &-bd{
        line-height: 1.5;
      }
    }
  }
  .customer-service{
    display: flex;
    justify-content: flex-end;
    align-self: flex-end;
    max-width: 70%;
    padding-bottom: 16px;
    .icon-kefu{
      font-size: 40px;
    }
    .time{
      padding-right: 10px;
      line-height: 1.8;
      text-align: right;
      font-size: 13px;
    }
    .content{
      margin-right: 10px;
      border-radius: 4px;
      background-color: #e8eaec;
      padding: 8px;
      &-hd{
        line-height: 1.5;
      }
      &-bd{
        line-height: 1.5;
      }
    }
  }
</style>
