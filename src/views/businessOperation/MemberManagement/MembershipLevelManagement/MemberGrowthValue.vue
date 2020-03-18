<template>
  <div class="vlt-card member-growth-value">
    <panel :show="true" title="成长值计算规则" style="margin-bottom:15px;" class="member">
      <div class="text">
        <i class="el-icon-warning" style="color:red;margin-right:5px;"></i>成长值是根据不同成长值策略计算的分值和其对应的分值比例计算出的综合分值，成长值等于各策略分值乘以分值比例的总和。
      </div>
      <el-divider style="margin:0"></el-divider>
      <div style="padding: 20px 0;"> 
        <div style="margin-left:15px;">当前成长值为：</div>
        <div style="margin-top: 5px" class="growth">
          <span style="color:red;margin-left:15px;">成长值</span> =
          <span>{{ title }}</span>
        </div>
      </div>
      <el-divider></el-divider>
    </panel>
    <panel :show="true" title="成长值策略设置" style="padding:20px;margin-bottom:15px;" class="member">
      <div class="strategy">
        <div v-for="(item, index) in dataList" :key="index">
          <div class="list">
            <div class="left">
              <i :class="item.icon"></i>
            </div>
            <div class="center">
              <div class="title">
                <span>简单介绍：</span>
              </div>
              <div class="content" style="width:350px;">
                <p>{{ item.p }}</p>
                <p>{{ item.p1 }}</p>
              </div>
            </div>
            <div class="right">
              <div class="right_left">
                <el-switch
                  v-model="item.switch"
                  :active-value="1"
                  :inactive-value="0"
                  :active-text="item.switch ? '开启' : '关闭'"
                  :disabled="idstatus == 1 ? true : false"
                ></el-switch>
              </div>
              <div class="right_center">
                <el-input
                  oninput="this.value=this.value.replace(/[^\d]/g,'')"
                  onafterpaste="this.value=this.value.replace(/[^\d]/g,'') "
                  value="1"
                  maxlength="3"
                  type="text"
                  show-word-limit
                  :disabled="item.switch && idstatus != 1 ? false : true"
                  placeholder="请输入"
                  v-model="item.value"
                  clearable
                ></el-input>
              </div>
              <div class="right_right">
                <el-button type="text" @click="handlerchange(index)">
                  {{
                  idstatus == 1 ? "去查看" : "去设置"
                  }}
                </el-button>
              </div>
            </div>
          </div>
          <el-divider></el-divider>
        </div>
        <el-row class="vlt-edit-btn">
          <el-button size="medium" @click="prev" class="cancel" :id="$route.name+'-Growth-prev'">上一步</el-button>
          <el-button
            type="primary"
            v-prevent="1000"
            size="medium"
            @click="next"
            :id="$route.name+'-Growth-next'"
          >下一步</el-button>
        </el-row>
      </div>
    </panel>
    <el-dialog
      title="消费激励策略"
      :visible.sync="consumerDialogVisible"
      width="55%"
      :close-on-click-modal="false"
    >
      <Consum ref="consum" v-model="consumForm" :idstatus="idstatus"></Consum>
      <el-row class="vlt-edit-btn btns">
        <el-button
          size="medium"
          @click="consumerDialogVisibleCencle"
          :id="$route.name+'-Consumer-enter'"
        >取消</el-button>
        <el-button
          type="primary"
          v-prevent="1000"
          size="medium"
          :id="$route.name+'-Consumer-enter'"
          @click="consumerDialogVisibleSubmit"
          v-if="idstatus === 1 ? false : true"
        >保存</el-button>
      </el-row>
    </el-dialog>
    <el-dialog
      title="会员活跃策略"
      :visible.sync="memberDialogVisible"
      width="55%"
      :close-on-click-modal="false"
    >
      <Active v-model="active" :idstatus="idstatus"></Active>
      <el-row class="vlt-edit-btn btns">
        <el-button
          size="medium"
          @click="memberDialogVisibleCencle"
          :id="$route.name+'-Active-cencel'"
        >取消</el-button>
        <el-button
          type="primary"
          v-prevent="1000"
          size="medium"
          @click="activeMemberDialogVisibleSubmit"
          :id="$route.name+'-Active-enter'"
          v-if="idstatus === 1 ? false : true"
        >保存</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import Consum from "./ConsumptionIncentiveStrategy";
import Active from "./ActiveMembers";
export default {
  name: "",
  props: ["idstatus", "growthValueData"],
  data() {
    return {
      dataList: [
        {
          img:
            "https://gss0.bdstatic.com/94o3dSag_xI4khGkpoWK1HF6hhy/baike/w%3D268%3Bg%3D0/sign=bc90ccdbedcd7b89e96c3d85371f259a/0dd7912397dda144c5a3a0a3b9b7d0a20cf4867d.jpg",
          p1:
            "消费激励策略是通过记录用户消费，充值金额来累计客户成长值，进而评估会员等级。",
          p: "",
          switch: 0,
          icon: "iconfont icon-xiaofeijili",
          value: "",
          disabled: false,
          strategyId: "",
          strategyType: ""
        },
        {
          img:
            "https://gss0.bdstatic.com/94o3dSag_xI4khGkpoWK1HF6hhy/baike/w%3D268%3Bg%3D0/sign=bc90ccdbedcd7b89e96c3d85371f259a/0dd7912397dda144c5a3a0a3b9b7d0a20cf4867d.jpg",
          p: "",
          p1:
            "会员活跃策略是通过记录会员注册，会员登录，建议反馈行为来累计客户成长值，进而评估会员等级。",
          switch: 0,
          icon: "iconfont icon-huoyuedu",
          value: "",
          disabled: false,
          strategyId: "",
          strategyType: ""
        }
      ],
      consumForm: {
        consume: {
          baseRule: {
            consume: "",
            growth: ""
          },
          status: 1,
          rules: []
        },
        recharge: {
          baseRule: {
            growth: 0,
            recharge: 0
          },
          rules: [],
          status: 1
        }
      },
      active: {
        login: {
          baseRule: {
            growth: ""
          },
          status: 0
        },
        loginTime: {
          baseRule: {
            duration: 0,
            growth: 0
          },
          rules: [],
          status: 1
        },
        register: {
          baseRule: {
            growth: ""
          },
          status: 0
        },
        suggestedFeedback: {
          baseRule: {
            growth: ""
          },
          limitRules: {
            count: ""
          },
          status: 0
        }
      },
      memberDialogVisible: false,
      consumerDialogVisible: false,
      arr: []
    };
  },
  computed: {
    title() {
      let array = [];
      if (this.dataList[0].switch) {
        array.push(`${this.dataList[0].value} % X 消费激励值 `);
      }
      if (this.dataList[1].switch) {
        array.push(`${this.dataList[1].value} % X 会员活跃值 `);
      }
      return array.join(" + ");
    }
  },
  watch: {
    growthValueData: {
      handler: function(n, o) {
        if (Object.keys(n).length > 0) {
          let obj = n.growthValueStrategyVoList;
          this.$set(this.dataList[0], "switch", obj[0].strategyStatus);
          this.$set(this.dataList[0], "value", obj[0].percentage);
          this.$set(this.dataList[1], "switch", obj[1].strategyStatus);
          this.$set(this.dataList[1], "value", obj[1].percentage);
          this.$set(this.dataList[0], "strategyId", obj[0].strategyId);
          this.$set(this.dataList[1], "strategyId", obj[1].strategyId);
          this.$set(this.dataList[0], "strategyType", obj[0].strategyType);
          this.$set(this.dataList[1], "strategyType", obj[1].strategyType);
          if (obj[0].strategyStatus) {
            let status = obj[0].consumeStrategy.consume.status;
            this.$set(this.consumForm.consume, "status", status);
            let consume = obj[0].consumeStrategy.consume.baseRule;
            this.$set(
              this.consumForm.consume.baseRule,
              "consume",
              consume.consume
            );
            this.$set(
              this.consumForm.consume.baseRule,
              "growth",
              consume.growth
            );
            let recharge = obj[0].consumeStrategy.recharge;
            this.$set(this.consumForm.recharge, "status", recharge.status);
            this.$set(
              this.consumForm.recharge.baseRule,
              "recharge",
              recharge.baseRule.recharge
            );
            this.$set(
              this.consumForm.recharge.baseRule,
              "growth",
              recharge.baseRule.growth
            );
          }
          if (obj[1].strategyStatus) {
            let login = obj[1].activeStrategy.login;
            this.$set(this.active.login, "status", login.status);
            this.$set(
              this.active.login.baseRule,
              "growth",
              login.baseRule.growth
            );
            let loginTime = obj[1].activeStrategy.loginTime;
            this.$set(this.active.loginTime, "status", loginTime.status);
            this.$set(
              this.active.loginTime.baseRule,
              "duration",
              loginTime.baseRule.duration
            );
            this.$set(
              this.active.loginTime.baseRule,
              "growth",
              loginTime.baseRule.growth
            );
            let register = obj[1].activeStrategy.register;
            this.$set(this.active.register, "status", register.status);
            this.$set(
              this.active.register.baseRule,
              "growth",
              register.baseRule.growth
            );
            let suggestedFeedback = obj[1].activeStrategy.suggestedFeedback;
            this.$set(
              this.active.suggestedFeedback,
              "status",
              suggestedFeedback.status
            );
            this.$set(
              this.active.suggestedFeedback.baseRule,
              "growth",
              suggestedFeedback.baseRule.growth
            );
            this.$set(
              this.active.suggestedFeedback.limitRules,
              "count",
              suggestedFeedback.limitRules.count
            );
          }
        }
      },
      deep: true
    }
  },
  components: {
    Consum,
    Active
  },
  methods: {
    consumerDialogVisibleCencle() {
      let obj = this.growthValueData.growthValueStrategyVoList;
      if (obj[0].consumeStrategy) {
        let status = obj[0].consumeStrategy.consume.status;
        this.$set(this.consumForm.consume, "status", status);
        let consume = obj[0].consumeStrategy.consume.baseRule;
        this.$set(this.consumForm.consume.baseRule, "consume", consume.consume);
        this.$set(this.consumForm.consume.baseRule, "growth", consume.growth);
        let recharge = obj[0].consumeStrategy.recharge;
        this.$set(this.consumForm.recharge, "status", recharge.status);
        this.$set(
          this.consumForm.recharge.baseRule,
          "recharge",
          recharge.baseRule.recharge
        );
        this.$set(
          this.consumForm.recharge.baseRule,
          "growth",
          recharge.baseRule.growth
        );
      }

      this.consumerDialogVisible = false;
    },
    memberDialogVisibleCencle() {
      let obj = this.growthValueData.growthValueStrategyVoList;
      if (obj[1].activeStrategy) {
        let login = obj[1].activeStrategy.login;
        this.$set(this.active.login, "status", login.status);
        this.$set(this.active.login.baseRule, "growth", login.baseRule.growth);
        let loginTime = obj[1].activeStrategy.loginTime;
        this.$set(this.active.loginTime, "status", loginTime.status);
        this.$set(
          this.active.loginTime.baseRule,
          "duration",
          loginTime.baseRule.duration
        );
        this.$set(
          this.active.loginTime.baseRule,
          "growth",
          loginTime.baseRule.growth
        );
        let register = obj[1].activeStrategy.register;
        this.$set(this.active.register, "status", register.status);
        this.$set(
          this.active.register.baseRule,
          "growth",
          register.baseRule.growth
        );
        let suggestedFeedback = obj[1].activeStrategy.suggestedFeedback;
        this.$set(
          this.active.suggestedFeedback,
          "status",
          suggestedFeedback.status
        );
        this.$set(
          this.active.suggestedFeedback.baseRule,
          "growth",
          suggestedFeedback.baseRule.growth
        );
        this.$set(
          this.active.suggestedFeedback.limitRules,
          "count",
          suggestedFeedback.limitRules.count
        );
      }

      this.memberDialogVisible = false;
    },
    handlerchange(val) {
      switch (val) {
        case 0:
          if (this.dataList[val].switch) {
            this.consumerDialogVisible = true;
          }
          break;
        default:
          if (this.dataList[val].switch) {
            this.memberDialogVisible = true;
          }
          break;
      }
    },
    clearInput(val) {
      this.dataList[val].value = "";
    },
    next() {
      let falg = [];
      let number = 0;
      this.dataList.forEach(item => {
        falg.push({ falg: item.switch, value: item.value });
        if (item.switch) {
          number += Number(item.value);
        }
      });
      let buer = falg.every(item => item.falg === 0);
      let s = falg.some(item => item.value === "");
      let status = falg.every(item => item.falg == 1);
      if (status) {
        if (s) {
          this.open("已打开策略值不能为空！");
          return;
        }
      }
      if (buer) {
        this.$emit("next");
        return;
      }
      if (number > 100 || number < 100) {
        this.open("打开策略输入值总和不能大于或小于100,请重新输入！");
      }
      if (number == 100) {
        let data = {
          growthValueStrategyVoList: [
            { consumeStrategy: this.initgrowth(this.consumForm) },
            { activeStrategy: this.initgrowth(this.active) }
          ]
        };
        data.growthValueStrategyVoList[0].strategyStatus = this.dataList[0].switch;
        data.growthValueStrategyVoList[0].percentage = Number(
          this.dataList[0].value
        );
        data.growthValueStrategyVoList[1].strategyStatus = this.dataList[1].switch;
        data.growthValueStrategyVoList[1].percentage = Number(
          this.dataList[1].value
        );
        data.growthValueStrategyVoList[0].strategyType = this.dataList[0].strategyType;
        data.growthValueStrategyVoList[1].strategyType = this.dataList[1].strategyType;
        data.growthValueStrategyVoList[0].strategyId = this.dataList[0].strategyId;
        data.growthValueStrategyVoList[1].strategyId = this.dataList[1].strategyId;
        this.$emit("next", data);
      }
    },
    initgrowth(val) {
      for (let key in val) {
        for (let k in val[key]) {
          if (k !== "status" && k !== "rules") {
            for (let i in val[key][k]) {
              if (!val[key][k][i]) {
                val[key][k][i] = 0;
              }
            }
          }
        }
      }
      return val;
    },
    prev() {
      this.$emit("prev", this.params);
    },

    open(val, fn) {
      this.$alert(val, "提示", {
        confirmButtonText: "确定",
        callback: action => {
          fn;
        }
      });
    },
    consumerDialogVisibleSubmit() {
      this.consumerDialogVisible = false;
    },
    activeMemberDialogVisibleSubmit() {
      this.memberDialogVisible = false;
    }
  }
};
</script>

<style lang="less">
.vlt-card {
  padding: 0;
  margin: 10px;
  .member-growth-value {
    padding-bottom: 20px;
    .btns {
      text-align: center;
      padding-bottom: 40px;
    }
    .text {
      margin-top: 20px;
      margin-bottom: 20px;
      line-height: 30px;
      margin-left: 15px;
    }
    .el-divider--horizontal {
      margin: 0;
    }
    .growth {
      line-height: 30px;
      i {
        color: #409eff;
      }
    }
    .strategy {
      .list {
        padding: 10px;
        display: flex;
        .left {
          width: 268px;
          display: flex;
          align-items: center;
          justify-content: center;
          .iconfont {
            font-size: 100px;
            color: #409eff;
          }
        }
        .center {
          padding-left: 30px;
          .title {
            line-height: 40px;
          }
          .content {
            // padding-top: 40px;
            p {
              line-height: 25px;
            }
          }
        }
        .right {
          display: flex;
          align-items: center;
          .right_left {
            margin-left: 80px;
          }
          .right_center {
            margin: 0 40px;
          }
          .right_right {
            margin-left: 20px;
            color: #409eff;
          }
        }
      }
      .vlt-edit-btn {
        margin-top: 20px;
        text-align: center;
      }
    }

    .el-dialog {
      .el-dialog__body {
        padding: 0;
      }
    }
  }
}

</style>
