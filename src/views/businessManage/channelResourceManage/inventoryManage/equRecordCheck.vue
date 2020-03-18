<template>
  <div class="vlt-card equRecordInfo">
    <div class="package-status">
      <div class="status-box">
        <ul class="status-list">
          <li v-for="(item,index) in statusList" :key="index">
            <div class="wrap">
              <div class="status-content-before">{{item.desc}}</div>
              <span class="status-time-before">{{item.date}}</span>
              <span class="status-time-specific">{{item.time}}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "equRecordCheck",
  data() {
    return {
      statusList:[
        {desc:'您的订单开始处理',date:'2017-08-17',time:'23:31:45'},
        {desc:'您的订单开始处理',date:'2017-08-17',time:'23:31:45'},
        {desc:'您的订单开始处理',date:'2017-08-17',time:'23:31:45'}
      ]
    };
  },
  components: {},
  methods: {}
};
</script>

<style lang="less" scoped>
.equRecordInfo{
  ul li {
  list-style: none;
  position: relative;
}
.package-status {
  border:1px solid rgb(216, 221, 230);
  padding: 50px 168px;
}
.package-status .status-list {
  margin: 0;
  padding: 0;
  margin-top: -5px;
  padding-left: 60px;
  list-style: none;
}
.package-status .status-list > li {
  border-left: 1px solid #0278d8;
  text-align: left;
  padding:10px;
  padding-bottom:10px;

}
.package-status .status-list > li>.wrap{
  position: relative;
  border: 1px solid rgb(217, 230, 243);
  border-radius: 8px;
  width: 100%;
  height: 56px;
  padding: 10px;
  background: rgb(217, 230, 243);

}
.package-status .status-list > li:before {
  /* 流程点的样式 */
  content: "";
  border: 1px solid #0278d8;
  background-color: white;
  display: inline-block;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  margin-left: -21px;
  margin-right: 10px;
}

.package-status .status-list > li {
  position: relative;
  height: auto;
  width: 95%;
}
.package-status .status-list {
  margin-top: -8px;
}
.package-status .status-box {
  position: relative;
}
.package-status .status-box:before {
  content: " ";
  background-color: #f3f3f3;
  display: block;
  position: absolute;
  top: -8px;
  left: 20px;
  width: 10px;
  height: 4px;
}

.status-list > li:not(:first-child) {
  padding-top: 10px;
}
.status-content-before {
  text-align: left;
  margin-left: 8px;
  margin-top: -42px;
  position: absolute;
  top: 50px;
  // word-wrap:break-word;
}
// 小三角
.status-content-before::before {
  content: '';
  position: absolute;
  top: 2px;
  left: -33px;
  height: 0;
  width: 0;
  border: 7px solid transparent;
  border-right: 7px solid rgb(217, 230, 243);
}

.status-time-before {
  padding: 10px;
  display: inline-block;
  text-align: left;
  margin-left: -154px;
  font-size: 16px;
  color: rgb(59, 151, 205);
  margin-top: 34px;
  position: absolute;
  top: -78px;
}
.status-time-specific {
    font-size: 14px;
    padding: 10px;
    display: inline-block;
    text-align: left;
    margin-left: -118px;
    font-size: 13px;
    margin-top: 34px;
    position: absolute;
    top: -58px;
  }

}

</style>
