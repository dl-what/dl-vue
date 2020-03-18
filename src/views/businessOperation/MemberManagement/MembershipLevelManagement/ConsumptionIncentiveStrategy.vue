<template>
  <!-- 消费激励策略弹框 -->
  <div class="vlt-card">
    <div class="consump">
      <div class="consump-title">
        <h3>消费</h3>
        <div>
          <el-switch
            :active-value="1"
            :id="$route.name+'-consume-Swith'"
            :inactive-value="0"
            :disabled="idstatus == 1 ? true : false"
            v-model="date.consume.status"
            :active-text="date.consume.status ? '开启' : '关闭'"
          ></el-switch>
        </div>
      </div>
      <div class="consump-content">
        <div class="consump-form">
          <span>基本规则*消费满&nbsp;&nbsp;</span>
          <el-col :span="4">
            <el-input
              :disabled="idstatus == 1 || date.consume.status == 0 ? true : false"
              v-model.number="date.consume.baseRule.consume"
              oninput="value=value.replace(/[^\d]/g,'')"
              placeholder="请输入内容"
              maxlength="5"
              type="text"
              show-word-limit
              size="mini"
            ></el-input>
          </el-col>
          <span>&nbsp;&nbsp; 元，加&nbsp;&nbsp;</span>
          <el-col :span="4">
            <el-input
              :disabled="idstatus == 1 || date.consume.status == 0 ? true : false"
              v-model="date.consume.baseRule.growth"
              oninput="value=value.replace(/[^\d]/g,'')"
              placeholder="请输入内容"
              maxlength="5"
              type="text"
              show-word-limit
              size="mini"
            ></el-input>
          </el-col>&nbsp;&nbsp;成长值
        </div>
        <div class="consumps" v-if="false">
          <el-row type="flex" align="middle">
            <el-col :span="10">
              <div class="consump-btn">
                <el-button type="text" style="height:30px;padding:0" @click="hadlerAdd">+ 奖励规则</el-button>
              </div>
            </el-col>
            <el-col>
              <div class="consump-text">
                <span>注：额外奖励规则，最多设置5个额外奖励规则，多个奖励不叠加。</span>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="consump-form" v-for="(item, index) in consupList" :key="index">
          <span>一次性消费&nbsp;&nbsp;</span>
          <el-col :span="4">
            <el-input
              :disabled="idstatus == 1 ? true : false"
              v-model="item.prev"
              placeholder="请输入内容"
              type="number"
              size="mini"
            ></el-input>
          </el-col>
          <span>&nbsp;&nbsp; 元，加&nbsp;&nbsp;</span>
          <el-col :span="4">
            <el-input
              :disabled="idstatus === 1 ? true : false"
              v-model="item.next"
              placeholder="请输入内容"
              type="number"
              size="mini"
            ></el-input>
          </el-col>&nbsp;&nbsp; 成长值
          <el-button
            type="text"
            style="margin-left:15px;"
            @click="handlerDelect(index)"
            v-if="idstatus == 1 ? false : true"
          >删除</el-button>
        </div>
      </div>
    </div>
    <div class="consump-topup">
      <div class="consump-title">
        <h3>充值</h3>
        <div>
          <el-switch
            :active-value="1"
            :id="$route.name+'-consum-recharge-Swith'"
            :inactive-value="0"
            :disabled="idstatus == 1 ? true : false"
            v-model="date.recharge.status"
            :active-text="date.recharge.status ? '开启' : '关闭'"
          ></el-switch>
        </div>
      </div>
      <div class="consump-content">
        <div class="consump-form">
          <span>基本规则*每充值&nbsp;&nbsp;</span>
          <el-col :span="4">
            <el-input
              :disabled="idstatus == 1 || date.recharge.status == 0 ? true : false"
              v-model="date.recharge.baseRule.recharge"
              placeholder="请输入内容"
              size="mini"
              maxlength="5"
              type="text"
              show-word-limit
              oninput="value=value.replace(/[^\d]/g,'')"
            ></el-input>
          </el-col>
          <span>&nbsp;&nbsp; 元，加&nbsp;&nbsp;</span>
          <el-col :span="4">
            <el-input
              :disabled="idstatus == 1 || date.recharge.status == 0 ? true : false"
              v-model="date.recharge.baseRule.growth"
              placeholder="请输入内容"
              size="mini"
              maxlength="5"
              type="text"
              show-word-limit
              oninput="value=value.replace(/[^\d]/g,'')"
            ></el-input>
          </el-col>&nbsp;&nbsp;成长值
        </div>
        <div class="consumps" v-if="false">
          <el-row type="flex" align="middle">
            <el-col :span="10">
              <div class="consump-btn">
                <el-button type="text" style="height:30px;padding:0" @click="topUpHadlerAdd">+ 奖励规则</el-button>
              </div>
            </el-col>
            <el-col>
              <div class="consump-text">
                <span>注：额外奖励规则，最多设置5个额外奖励规则，多个奖励不叠加。</span>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="consump-form" v-for="(item, index) in topUpList" :key="index">
          <span>一次性消费&nbsp;&nbsp;</span>
          <el-col :span="4">
            <el-input
              :disabled="idstatus == 1 ? true : false"
              v-model="item.prev"
              type="number"
              placeholder="请输入内容"
              size="mini"
            ></el-input>
          </el-col>
          <span>&nbsp;&nbsp; 元，加&nbsp;&nbsp;</span>
          <el-col :span="4">
            <el-input
              :disabled="idstatus == 1 ? true : false"
              v-model="item.next"
              type="number"
              placeholder="请输入内容"
              size="mini"
            ></el-input>
          </el-col>&nbsp;&nbsp; 成长值
          <el-button
            type="text"
            style="margin-left:15px;"
            @click="topUpHandlerDelect(index)"
            v-if="idstatus === 1 ? false : true"
          >删除</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "",
  model: {
    prop: "date",
    event: "event"
  },
  props: {
    date: {
      type: Object,
      default: {}
    },
    idstatus: {
      type: [String, Number],
      default: "0"
    }
  },
  data() {
    return {
      topUpValue: false,
      consupList: this.date.consupList,
      topUpList: this.date.topUpList
    };
  },
  components: {},
  methods: {
    hadlerAdd() {
      let list = { prev: "", next: "" };
      if (this.consupList.length >= 5) {
        this.open("对不起，最多设置5个额外奖励规则！");
      } else {
        this.consupList.push(list);
      }
    },
    topUpHadlerAdd() {
      let list = { prev: "", next: "" };
      if (this.topUpList.length >= 5) {
        this.open("对不起，最多设置5个额外奖励规则！");
      } else {
        this.topUpList.push(list);
      }
    },
    open(val) {
      this.$alert(val, "提示", {
        confirmButtonText: "确定",
        callback: action => {
          this.$message({
            type: "info",
            message: `action: ${action}`
          });
        }
      });
    },
    topUpHandlerDelect(index) {
      let arr;
      arr = this.topUpList.filter((item, i) => index != i && true);
      this.topUpList = arr;
    },
    handlerDelect(index) {
      let arr;
      arr = this.consupList.filter((item, i) => index != i && true);
      this.consupList = arr;
    }
  },
  watch: {}
};
</script>

<style lang="less">
.consump-topup {
  margin-top: 30px;
}
.consump-title {
  padding: 0 10px;
  background: #eee;
  height: 30px;
  line-height: 30px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
}
.consump-form {
  padding: 10px;
  display: flex;
  align-items: center;
}
.consump-btn {
  margin: 0 10px;
  border: 1px dashed #ccc;
  height: 30px;
  line-height: 30px;
  text-align: center;
}
.consump-text {
  padding-left: 20px;
  color: #ccc;
}
</style>
