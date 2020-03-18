<template>
  <div class="vlt-card">
    <!-- 注册 -->
    <div class="active">
      <div class="active-title">
        <h3>注册</h3>
        <div>
          <el-switch
            :active-value="1"
            :id="$route.name+'-register-Swith'"
            :inactive-value="0"
            v-model="param.register.status"
            :disabled="idstatus == 1 ? true : false"
            :active-text="param.register.status ? '开启' : '关闭'"
          ></el-switch>
        </div>
      </div>
      <div class="active-content">
        <div class="active-form">
          <span>基本规则*注册会员成功，增加&nbsp;&nbsp;</span>
          <el-col :span="4">
            <el-input
              :disabled="idstatus == 1 || param.register.status == 0 ? true : false"
              v-model="param.register.baseRule.growth"
              oninput="this.value=this.value.replace(/[^\d]/g,'')"
              placeholder="请输入内容"
              maxlength="5"
              type="text"
              show-word-limit
              size="mini"
            ></el-input>
          </el-col>&nbsp;&nbsp;成长值
        </div>
      </div>
    </div>
    <!-- 登录 -->
    <div class="active">
      <div class="active-title">
        <h3>登录</h3>
        <div>
          <el-switch
            :id="$route.name+'-login-Swith'"
            :active-value="1"
            :inactive-value="0"
            v-model="param.login.status"
            :disabled="idstatus == 1 ? true : false"
            :active-text="param.login.status ? '开启' : '关闭'"
          ></el-switch>
        </div>
      </div>
      <div class="active-content">
        <div class="active-form">
          <span>基本规则*每日登录增加&nbsp;&nbsp;</span>
          <el-col :span="4">
            <el-input
              :disabled="idstatus == 1 || param.login.status == 0 ? true : false"
              v-model="param.login.baseRule.growth"
              oninput="this.value=this.value.replace(/[^\d]/g,'')"
              maxlength="5"
              type="text"
              show-word-limit
              placeholder="请输入内容"
              size="mini"
            ></el-input>
          </el-col>&nbsp;&nbsp;成长值
        </div>
        <div class="actives" v-if="false">
          <el-row type="flex" align="middle">
            <el-col :span="10">
              <div class="active-btn">
                <el-button type="text" style="height:30px;padding:0" @click="loginHadlerAdd">+ 奖励规则</el-button>
              </div>
            </el-col>
            <el-col>
              <div class="active-text">
                <span>注：额外奖励规则，最多设置5个额外奖励规则，多个奖励不叠加。</span>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="active-form" v-for="(item, index) in loginList" :key="index">
          <span>连续登录满&nbsp;&nbsp;</span>
          <el-col :span="4">
            <el-input
              :disabled="id == 1 ? true : false"
              v-model="item.loginPrev"
              placeholder="请输入内容"
              type="number"
              size="mini"
            ></el-input>
          </el-col>
          <span>&nbsp;&nbsp; 次，额外增加&nbsp;&nbsp;</span>
          <el-col :span="4">
            <el-input
              maxlength="4"
              v-model="item.loginNext"
              placeholder="请输入内容"
              type="number"
              size="mini"
              :disabled="id == 1 ? true : false"
            ></el-input>
          </el-col>&nbsp;&nbsp; 成长值
          <el-button
            type="text"
            style="margin-left:15px;"
            @click="loginHandlerDelect(index)"
            v-if="id == 1 ? false : true"
          >删除</el-button>
        </div>
      </div>
    </div>
    <!-- 游戏时长 -->
    <div class="active">
      <div class="active-title">
        <h3>登录时长</h3>
        <div>
          <el-switch
            :id="$route.name+'-gameTime-Swith'"
            :active-value="1"
            :inactive-value="0"
            v-model="param.loginTime.status"
            :disabled="idstatus == 1 ? true : false"
            :active-text="param.loginTime.status ? '开启' : '关闭'"
          ></el-switch>
        </div>
      </div>
      <div class="active-content">
        <div class="active-form">
          <span>基本规则*每日登陆时长满&nbsp;&nbsp;</span>
          <el-col :span="4">
            <el-input
              maxlength="5"
              type="text"
              show-word-limit
              oninput="this.value=this.value.replace(/[^\d]/g,'')"
              onafterpaste="this.value=this.value.replace(/[^\d]/g,'')"
              :disabled="idstatus == 1 || param.loginTime.status == 0 ? true : false"
              v-model="param.loginTime.baseRule.duration"
              placeholder="请输入内容"
              size="mini"
            ></el-input>
          </el-col>
          <span>&nbsp;&nbsp; 分钟，加&nbsp;&nbsp;</span>
          <el-col :span="4">
            <el-input
              maxlength="5"
              type="text"
              show-word-limit
              oninput="this.value=this.value.replace(/[^\d]/g,'')"
              onafterpaste="this.value=this.value.replace(/[^\d]/g,'')"
              v-model="param.loginTime.baseRule.growth"
              placeholder="请输入内容"
              :disabled="idstatus == 1 || param.loginTime.status == 0 ? true : false"
              size="mini"
            ></el-input>
          </el-col>&nbsp;&nbsp;成长值
        </div>
        <div class="actives" v-if="false">
          <el-row type="flex" align="middle">
            <el-col :span="10">
              <div class="active-btn">
                <el-button type="text" style="height:30px;padding:0" @click="gameHadlerAdd">+ 奖励规则</el-button>
              </div>
            </el-col>
            <el-col>
              <div class="active-text">
                <span>注：额外奖励规则，最多设置5个额外奖励规则，多个奖励不叠加。</span>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="active-form" v-for="(item, index) in gameTimeList" :key="index">
          <span>连续游戏时长满&nbsp;&nbsp;</span>
          <el-col :span="4">
            <el-input
              oninput="this.value=this.value.replace(/[^\d]/g,'')"
              onafterpaste="this.value=this.value.replace(/[^\d]/g,'')"
              :disabled="id == 1 ? true : false"
              v-model="item.gamePrev"
              placeholder="请输入内容"
              type="number"
              size="mini"
            ></el-input>
          </el-col>
          <span>&nbsp;&nbsp; 分钟，额外增加&nbsp;&nbsp;</span>
          <el-col :span="4">
            <el-input
              maxlength="4"
              oninput="this.value=this.value.replace(/[^\d]/g,'')"
              onafterpaste="this.value=this.value.replace(/[^\d]/g,'')"
              v-model="item.gameNext"
              placeholder="请输入内容"
              size="mini"
              :disabled="id === 1 ? true : false"
            ></el-input>
          </el-col>&nbsp;&nbsp; 成长值
          <el-button
            type="text"
            style="margin-left:15px;"
            @click="gameHandlerDelect(index)"
            v-if="id == 1 ? false : true"
          >删除</el-button>
        </div>
      </div>
    </div>
    <!-- 建议反馈 -->
    <div class="active">
      <div class="active-title">
        <h3>建议反馈</h3>
        <div>
          <el-switch
            :id="$route.name+'-suggestedFeedback-Swith'"
            :active-value="1"
            :inactive-value="0"
            v-model="param.suggestedFeedback.status"
            :disabled="idstatus === 1 ? true : false"
            :active-text="param.suggestedFeedback.status ? '开启' : '关闭'"
          ></el-switch>
        </div>
      </div>
      <div class="active-content">
        <div class="active-form">
          <span>基本规则*每次成功提交建议反馈增加&nbsp;&nbsp;</span>
          <el-col :span="4">
            <el-input
              :disabled="
                idstatus == 1 || param.suggestedFeedback.status == 0 ? true : false
              "
              v-model="param.suggestedFeedback.baseRule.growth"
              placeholder="请输入内容"
              size="mini"
              maxlength="5"
              type="text"
              show-word-limit
              oninput="this.value=this.value.replace(/[^\d]/g,'')"
              onafterpaste="this.value=this.value.replace(/[^\d]/g,'')"
            ></el-input>
          </el-col>&nbsp;&nbsp;成长值
        </div>
        <div class="active-form">
          <span>限制规则*每人每天最多可获得&nbsp;&nbsp;</span>
          <el-col :span="4">
            <el-input
              :disabled="
                idstatus == 1 || param.suggestedFeedback.status == 0 ? true : false
              "
              oninput="this.value=this.value.replace(/[^\d]/g,'')"
              onafterpaste="this.value=this.value.replace(/[^\d]/g,'')"
              v-model="param.suggestedFeedback.limitRules.count"
              placeholder="请输入内容"
              size="mini"
              type="text"
              show-word-limit
              maxlength="5"
            ></el-input>
          </el-col>&nbsp;&nbsp;次，反馈建议成长值
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "",
  model: {
    prop: "param",
    event: "eventBus"
  },
  props: {
    param: {
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
      loginList: this.param.loginList,
      gameTimeList: this.param.gameTimeList
    };
  },
  components: {},
  methods: {
    loginHadlerAdd() {
      let list = { loginPrev: "", loginNext: "" };
      if (this.loginList.length >= 5) {
        this.open("对不起，最多设置5个额外奖励规则！");
      } else {
        this.loginList.push(list);
      }
    },
    loginHandlerDelect(index) {
      let arr;
      arr = this.loginList.filter((item, i) => index != i && true);
      this.loginList = arr;
    },
    gameHadlerAdd() {
      let list = { gamePrev: "", gameNext: "" };
      if (this.gameTimeList.length >= 5) {
        this.open("对不起，最多设置5个额外奖励规则！");
      } else {
        this.gameTimeList.push(list);
      }
    },
    gameHandlerDelect() {
      let arr;
      arr = this.gameTimeList.filter((item, i) => index != i && true);
      this.gameTimeList = arr;
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
    }
  },
  watch: {
    // "param.register": {
    //   handler(n, o) {
    //     if (!n.baseRule.growth) {
    //       this.$set(n.baseRule, "growth", 0);
    //     }
    //     console.log(n);
    //   },
    //   deep: true,
    //   immediate: true
    // },
    // "param.login": {
    //   handler(mn, o) {
    //     if (!mn.baseRule.growth) {
    //       this.$set(mn.baseRule, "growth", 0);
    //     }
    //     console.log(mn);
    //   },
    //   deep: true,
    //   immediate: true
    // },
    // "param.loginTime": {
    //   handler(newvlue, o) {
    //     if (!newvlue.baseRule.growth) {
    //       this.$set(newvlue.baseRule, "growth", 0);
    //     }
    //     if (!newvlue.baseRule.duration) {
    //       this.$set(newvlue.baseRule, "duration", 0);
    //     }
    //     console.log(newvlue);
    //   },
    //   deep: true,
    //   immediate: true
    // },
    // "param.suggestedFeedback": {
    //   handler(nvl, o) {
    //     if (!nvl.baseRule.growth) {
    //       this.$set(nvl.baseRule, "growth", 0);
    //     }
    //     if (!nvl.baseRule.limitRules) {
    //       this.$set(nvl.limitRules, "count", 0);
    //     }
    //     console.log(nvl);
    //   },
    //   deep: true,
    //   immediate: true
    // }
  }
};
</script>

<style lang="less" scoped>
.active {
  margin-bottom: 30px;
}
.active-title {
  padding: 0 10px;
  background: #eee;
  height: 30px;
  line-height: 30px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
}
.active-form {
  padding: 10px;
  display: flex;
  align-items: center;
}
.active-btn {
  margin: 0 10px;
  border: 1px dashed #ccc;
  height: 30px;
  line-height: 30px;
  text-align: center;
}
.active-text {
  padding-left: 20px;
  color: #ccc;
}
</style>
