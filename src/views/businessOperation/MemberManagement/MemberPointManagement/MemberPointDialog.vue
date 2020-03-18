<template>
  <div class="vlt-card">
    <div class="active" v-if=" param.currentBtn === '新建规则'">
      <div class="active-title">
        <strong>
          新增规则类型：
          <el-select v-model="param.value" placeholder="请选择" size="small">
            <el-option
              v-for="item in param.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </strong>
        <span class="text-strong">注：新增编缉修改后，默认状态为冻结，需在列表处执行启用操作。</span>
      </div>
    </div>
    <!-- 注册 -->
    <div class="active" v-if="param.ruleType == 3">
      <!-- <div class="active-title">
        <h3>注册送积分</h3>
      </div> -->
      <div class="active-content">
        <div class="active-form-tow">
          <el-row type="flex" align="middle">
            <span>基本规则*注册会员成功，增加&nbsp;&nbsp;</span>
            <el-col :span="8">
              <el-input
                v-model="param.register.baseRule.growth"
                oninput="this.value=this.value.replace(/[^\d]/g,'')"
                onafterpaste="this.value=this.value.replace(/[^\d]/g,'')"
                value="1"
                type="text"
                show-word-limit
                maxlength="8"
                placeholder="请输入内容"
                size="small"
                :disabled="param.type === '查看'?true:false"
              ></el-input>
            </el-col>&nbsp;&nbsp;积分
          </el-row>
        </div>
      </div>
    </div>
    <!-- 登录 -->
    <div class="active" v-if="param.ruleType == 4">
      <!-- <div class="active-title">
        <h3>登录送积分</h3>
      </div> -->
      <div class="active-content">
        <div class="active-form-tow">
          <el-row type="flex" align="middle">
            <span>基本规则*每日登录增加&nbsp;&nbsp;</span>
            <el-col :span="8">
              <el-input
                v-model="param.login.baseRule.growth"
                oninput="this.value=this.value.replace(/[^\d]/g,'')"
                onafterpaste="this.value=this.value.replace(/[^\d]/g,'')"
                placeholder="请输入内容"
                type="text"
                size="small"
                maxlength="8"
                show-word-limit
                :disabled="param.type === '查看'?true:false"
              ></el-input>
            </el-col>&nbsp;&nbsp;积分
          </el-row>
        </div>
        <div class="actives">
          <el-row type="flex" align="middle" v-if="false">
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
        <div class="active-form-tow" v-for="(item,index) in param.login.rules" :key="index">
          <span>连续登录满&nbsp;&nbsp;</span>
          <el-col :span="4">
            <el-input
              v-model="item.count"
              placeholder="请输入内容"
              onkeyup="this.value=this.value.replace(/[^\d]/g,'')"
              onafterpaste="this.value=this.value.replace(/[^\d]/g,'')"
              size="small"
              :disabled="param.type === '查看'?true:false"
            ></el-input>
          </el-col>
          <span>&nbsp;&nbsp; 次，额外增加&nbsp;&nbsp;</span>
          <el-col :span="4">
            <el-input
              v-model="item.growth"
              placeholder="请输入内容"
              oninput="this.value=this.value.replace(/[^\d]/g,'')"
              onafterpaste="this.value=this.value.replace(/[^\d]/g,'')"
              size="small"
              :disabled="param.type === '查看'?true:false"
            ></el-input>
          </el-col>&nbsp;&nbsp; 积分
          <el-button
            type="text"
            style="margin-left:15px;"
            @click="loginHandlerDelect(index)"
            v-if="param.type != '查看'"
          >删除</el-button>
        </div>
      </div>
    </div>
    <!-- 充值 -->
    <div class="active" v-if="param.ruleType == 2">
      <!-- <div class="active-title">
        <h3>充值送积分</h3>
      </div> -->
      <div class="active-content">
        <div class="active-form-tow">
          <span>基本规则*每充值&nbsp;&nbsp;</span>
          <el-col :span="6">
            <el-input
              :disabled="param.type === '查看'?true:false"
              v-model="param.recharge.baseRule.recharge"
              oninput="this.value=this.value.replace(/[^\d]/g,'')"
              onafterpaste="this.value=this.value.replace(/[^\d]/g,'')"
              placeholder="请输入内容"
              type="text"
              maxlength="8"
              show-word-limit
              size="small"
            ></el-input>
          </el-col>
          <span>&nbsp;&nbsp; 元 ，加&nbsp;&nbsp;</span>
          <el-col :span="6">
            <el-input
              v-model="param.recharge.baseRule.growth"
              :disabled="param.type === '查看'?true:false"
              onkeyup="this.value=this.value.replace(/[^\d]/g,'')"
              onafterpaste="this.value=this.value.replace(/[^\d]/g,'')"
              placeholder="请输入内容"
              size="small"
              type="text"
              maxlength="8"
              show-word-limit
            ></el-input>
          </el-col>&nbsp;&nbsp;积分
        </div>
        <div class="actives">
          <el-row type="flex" align="middle" v-if="false">
            <el-col :span="10">
              <div class="active-btn">
                <el-button type="text" style="height:30px;padding:0" @click="topUpHadlerAdd">+ 奖励规则</el-button>
              </div>
            </el-col>
            <el-col>
              <div class="active-text">
                <span>注：额外奖励规则，最多设置5个额外奖励规则，多个奖励不叠加。</span>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="active-form-tow" v-for="(item,index) in param.recharge.rules" :key="index">
          <span>一次性充值&nbsp;&nbsp;</span>
          <el-col :span="4">
            <el-input
              v-model="item.recharge"
              placeholder="请输入内容"
              onkeyup="this.value=this.value.replace(/[^\d]/g,'')"
              onafterpaste="this.value=this.value.replace(/[^\d]/g,'')"
              size="small"
              :disabled="param.type === '查看'?true:false"
            ></el-input>
          </el-col>
          <span>&nbsp;&nbsp; 元，额外增加&nbsp;&nbsp;</span>
          <el-col :span="4">
            <el-input
              v-model="item.growth"
              placeholder="请输入内容"
              onkeyup="this.value=this.value.replace(/[^\d]/g,'')"
              onafterpaste="this.value=this.value.replace(/[^\d]/g,'')"
              size="small"
              :disabled="param.type === '查看'?true:false"
            ></el-input>
          </el-col>&nbsp;&nbsp; 积分
          <el-button
            type="text"
            style="margin-left:15px;"
            @click="topUpHandlerDelect(index)"
            v-if="param.type != '查看'"
          >删除</el-button>
        </div>
      </div>
    </div>
    <!-- 消费 -->
    <div class="active" v-if="param.ruleType === 1">
      <!-- <div class="active-title">
        <h3>消费送积分</h3>
      </div> -->
      <div class="active-content">
        <div class="active-form-tow">
          <span>基本规则*每消费&nbsp;&nbsp;</span>
          <el-col :span="6">
            <el-input
              :disabled="param.type === '查看'?true:false"
              v-model="param.consume.baseRule.consume"
              oninput="this.value=this.value.replace(/[^\d]/g,'')"
              onafterpaste="this.value=this.value.replace(/[^\d]/g,'')"
              placeholder="请输入内容"
              size="small"
              type="text"
              maxlength="8"
              show-word-limit
            ></el-input>
          </el-col>
          <span>&nbsp;&nbsp; 元，加&nbsp;&nbsp;</span>
          <el-col :span="6">
            <el-input
              v-model="param.consume.baseRule.growth"
              :disabled="param.type === '查看'?true:false"
              oninput="this.value=this.value.replace(/[^\d]/g,'')"
              onafterpaste="this.value=this.value.replace(/[^\d]/g,'')"
              placeholder="请输入内容"
              size="small"
              type="text"
              maxlength="8"
              show-word-limit
            ></el-input>
          </el-col>&nbsp;&nbsp;积分
        </div>
        <div class="actives">
          <el-row type="flex" align="middle" v-if="false">
            <el-col :span="10">
              <div class="active-btn">
                <el-button
                  type="text"
                  style="height:30px;padding:0"
                  @click="consumeHadlerAdd"
                >+ 奖励规则</el-button>
              </div>
            </el-col>
            <el-col>
              <div class="active-text">
                <span>注：额外奖励规则，最多设置5个额外奖励规则，多个奖励不叠加。</span>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="active-form-tow" v-for="(item,index) in param.consume.rules" :key="index">
          <span>一次性消费&nbsp;&nbsp;</span>
          <el-col :span="4">
            <el-input
              v-model="item.consume"
              placeholder="请输入内容"
              :disabled="param.type === '查看'?true:false"
              oninput="this.value=this.value.replace(/[^\d]/g,'')"
              onafterpaste="this.value=this.value.replace(/[^\d]/g,'')"
              size="small"
            ></el-input>
          </el-col>
          <span>&nbsp;&nbsp; 元，额外增加&nbsp;&nbsp;</span>
          <el-col :span="4">
            <el-input
              v-model="item.growth"
              placeholder="请输入内容"
              oninput="this.value=this.value.replace(/[^\d]/g,'')"
              onafterpaste="this.value=this.value.replace(/[^\d]/g,'')"
              size="small"
              :disabled="param.type === '查看'?true:false"
            ></el-input>
          </el-col>&nbsp;&nbsp; 积分
          <el-button
            type="text"
            style="margin-left:15px;"
            @click="consumeHandlerDelect(index)"
            v-if="param.type != '查看'"
          >删除</el-button>
        </div>
      </div>
    </div>
    <!-- 游戏时长 -->
    <div class="active" v-if="param.ruleType === 5">
      <!-- <div class="active-title">
        <h3>登录时长送积分</h3>
      </div> -->
      <div class="active-content">
        <div class="active-form-tow">
          <span>基本规则*每日登录时长&nbsp;&nbsp;</span>
          <el-col :span="6">
            <el-input
              maxlength="8"
              show-word-limit
              :disabled="param.type === '查看'?true:false"
              v-model="param.loginTime.baseRule.duration"
              oninput="this.value=this.value.replace(/[^\d]/g,'')"
              onafterpaste="this.value=this.value.replace(/[^\d]/g,'')"
              placeholder="请输入内容"
              size="small"
              type="text"
            ></el-input>
          </el-col>
          <span>&nbsp;&nbsp; 分钟，加&nbsp;&nbsp;</span>
          <el-col :span="6">
            <el-input
              v-model="param.loginTime.baseRule.growth"
              :disabled="param.type === '查看'?true:false"
              oninput="this.value=this.value.replace(/[^\d]/g,'')"
              onafterpaste="this.value=this.value.replace(/[^\d]/g,'')"
              placeholder="请输入内容"
              size="small"
              type="text"
              maxlength="8"
              show-word-limit
            ></el-input>
          </el-col>&nbsp;&nbsp;积分
        </div>
        <div class="actives">
          <el-row type="flex" align="middle" v-if="false">
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
        <div class="active-form-tow" v-for="(item,index) in param.loginTime.rules" :key="index">
          <span>连续登录时长满&nbsp;&nbsp;</span>
          <el-col :span="4">
            <el-input
              v-model="item.duration"
              placeholder="请输入内容"
              oninput="this.value=this.value.replace(/[^\d]/g,'')"
              onafterpaste="this.value=this.value.replace(/[^\d]/g,'')"
              size="small"
              :disabled="param.type === '查看'?true:false"
            ></el-input>
          </el-col>
          <span>&nbsp;&nbsp; 分钟，额外增加&nbsp;&nbsp;</span>
          <el-col :span="4">
            <el-input
              v-model="item.growth"
              placeholder="请输入内容"
              oninput="this.value=this.value.replace(/[^\d]/g,'')"
              onafterpaste="this.value=this.value.replace(/[^\d]/g,'')"
              size="small"
              :disabled="param.type === '查看'?true:false"
            ></el-input>
          </el-col>&nbsp;&nbsp; 积分
          <el-button
            type="text"
            style="margin-left:15px;"
            @click="gameHandlerDelect(index)"
            v-if="param.type != '查看'"
          >删除</el-button>
        </div>
      </div>
    </div>
    <!-- 建议反馈 -->
    <div class="active" v-if="param.ruleType == 6">
      <!-- <div class="active-title">
        <h3>建议反馈送积分</h3>
      </div> -->
      <div class="active-content">
        <div class="active-form-tow">
          <span>基本规则*每次成功提交建议反馈增加&nbsp;&nbsp;</span>
          <el-col :span="6">
            <el-input
              :disabled="param.type === '查看'?true:false"
              v-model="param.suggestedFeedback.baseRule.growth"
              oninput="this.value=this.value.replace(/[^\d]/g,'')"
              onafterpaste="this.value=this.value.replace(/[^\d]/g,'')"
              placeholder="请输入内容"
              type="text"
              maxlength="8"
              show-word-limit
              size="small"
            ></el-input>
          </el-col>&nbsp;&nbsp;积分
        </div>
        <div class="active-form-tow">
          <span>限制规则*每人每天最多可获得&nbsp;&nbsp;</span>
          <el-col :span="6">
            <el-input
              type="text"
              :disabled="param.type === '查看'?true:false"
              v-model="param.suggestedFeedback.limitRules.count"
              oninput="this.value=this.value.replace(/[^\d]/g,'')"
              onafterpaste="this.value=this.value.replace(/[^\d]/g,'')"
              placeholder="请输入内容"
              maxlength="8"
              show-word-limit
              size="small"
            ></el-input>
          </el-col>&nbsp;&nbsp;次反馈建议积分
        </div>
      </div>
    </div>
    <el-row type="flex" class="el-row-flex-poin" :gutter="10" v-if=" param.type ==='查看'">
      <el-col :span="12" v-for="(item,index) in param.detailsList" :key="index" class="type-left">
        <div style="display:flex">
          <span style="min-width:90px;">{{item.title}}</span>
          <span style="display:inline-block;min-width:150px;">{{item.value}}</span>
        </div>
      </el-col>
    </el-row>
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
    }
  },
  data() {
    return {};
  },
  components: {},
  methods: {
    loginHadlerAdd() {
      let list = { count: "", growth: "" };
      if (this.param.login.rules.length >= 5) {
        this.open("对不起，最多设置5个额外奖励规则！");
      } else {
        this.param.login.rules.push(list);
      }
    },
    loginHandlerDelect(index) {
      let arr;
      arr = this.param.login.rules.filter((item, i) => index != i && true);
      this.param.login.rules = arr;
    },
    gameHadlerAdd() {
      let list = { duration: "", growth: "" };
      if (this.param.loginTime.rules.length >= 5) {
        this.open("对不起，最多设置5个额外奖励规则！");
      } else {
        this.param.loginTime.rules.push(list);
      }
    },
    gameHandlerDelect(index) {
      let arr;
      arr = this.param.loginTime.rules.filter((item, i) => index != i && true);
      this.param.loginTime.rules = arr;
    },
    topUpHadlerAdd() {
      let list = { recharge: "", growth: "" };
      if (this.param.recharge.rules.length >= 5) {
        this.open("对不起，最多设置5个额外奖励规则！");
      } else {
        this.param.recharge.rules.push(list);
      }
    },
    topUpHandlerDelect(index) {
      let arr;
      arr = this.param.recharge.rules.filter((item, i) => index != i && true);
      this.param.recharge.rules = arr;
    },
    consumeHadlerAdd() {
      let list = { consume: "", growth: "" };
      if (this.param.consume.rules.length >= 5) {
        this.open("对不起，最多设置5个额外奖励规则！");
      } else {
        this.param.consume.rules.push(list);
      }
    },
    consumeHandlerDelect(index) {
      let arr;
      arr = this.param.consume.rules.filter((item, i) => index != i && true);
      this.param.consume.rules = arr;
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
  }
};
</script>

<style lang="less" scoped>
.naem {
  display: block;
  width: 80px;
}
.active {
  margin-bottom: 30px;
}
.type-left {
  padding: 10px 14px !important;
  // margin:
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
.active-form-tow {
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
.el-row-flex-poin {
  flex-wrap: wrap;
}
.text-strong {
  color: #ccc;
}
.vlt-card{
  padding: 0 16px;
}
</style>
<style lang="less">

// .member-point .el-input__inner {
//   width: 80px;
//   padding-right: 20px;
// }
</style>
