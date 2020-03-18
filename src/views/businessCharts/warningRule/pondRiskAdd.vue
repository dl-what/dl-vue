<template>
  <div class="vlt-card">
    <h3 class="headling">奖池风险指标新增</h3>
    <div class="select-box">
      <p class="treename pondcascader">
        <span class="gameAndPond">游戏/奖池</span>
        <el-cascader size="small" v-model="pondAndGame" :options="optionslist" :props="props"></el-cascader>
      </p>

      <div class="fits">
        <div class="showbox">
          <h2>指标配置</h2>
          <p>
            <span>指标选择</span>
            <el-select size="small" @change="selectChange" v-model="indexValue" placeholder="请选择">
              <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </p>
          <div class="formsTable">
            <p class="tipsPosition" v-show="!disabled">数值达到对应风险指标值即为触发</p>
            <div class="llll">
              <p>告警等级</p>

              <p v-show="showWatchingPc" class="watching">监控频率</p>
            </div>
            <el-form
              label-position="left"
              ref="form"
              :rules="rules"
              :model="form"
              style="width:100%"
            >
              <div class="riskForm">
                <div class="editfrom inputsWidth" v-show="showMaxJackpotMoney">
                  <el-form-item label="Ⅲ级" prop="maxJackpotMoneyOrdinary">
                    <el-input
                      :disabled="disabled"
                      show-word-limit
                      maxlength="9"
                      v-model="form.maxJackpotMoneyOrdinary"
                    ></el-input>
                    <span>元</span>
                  </el-form-item>
                  <el-form-item label="Ⅱ级" prop="maxJackpotMoneySerious">
                    <el-input
                      :disabled="disabled"
                      show-word-limit
                      maxlength="9"
                      v-model="form.maxJackpotMoneySerious"
                    ></el-input>
                    <span>元</span>
                  </el-form-item>
                  <el-form-item label="Ⅰ级" prop="maxJackpotMoneyMajor">
                    <el-input
                      :disabled="disabled"
                      show-word-limit
                      maxlength="9"
                      v-model="form.maxJackpotMoneyMajor"
                    ></el-input>
                    <span>元</span>
                  </el-form-item>
                </div>
                <div class="editfrom inputsWidth" v-show="showMinJackpotMoney">
                  <el-form-item label="Ⅲ级" prop="minJackpotMoneyOrdinary">
                    <el-input v-model="form.minJackpotMoneyOrdinary" show-word-limit maxlength="9"></el-input>
                    <span>元</span>
                  </el-form-item>
                  <el-form-item label="Ⅱ级" prop="minJackpotMoneySerious">
                    <el-input show-word-limit maxlength="9" v-model="form.minJackpotMoneySerious"></el-input>
                    <span>元</span>
                  </el-form-item>
                  <el-form-item label="Ⅰ级" prop="minJackpotMoneyMajor">
                    <el-input show-word-limit maxlength="9" v-model="form.minJackpotMoneyMajor"></el-input>
                    <span>元</span>
                  </el-form-item>
                </div>
              </div>

              <div class="editfrom" v-show="showWatchingPc">
                <el-form-item prop label>
                  <el-input-number
                    v-model="form.collectFrequency"
                    controls-position="right"
                    :min="10"
                    :max="100"
                    :step="1"
                    size="small"
                    :disabled="disabled"
                  ></el-input-number>
                  <span class="unit">(分钟/次)</span>
                  <p class="tip" v-show="!disabled">
                    <span class="xing">*</span>为必填项
                  </p>
                  <p class="tip" v-show="disabled">
                    <span class="xing">该游戏奖池下的指标已全部设置完毕</span>
                  </p>
                </el-form-item>
              </div>
            </el-form>
          </div>
        </div>
      </div>
    </div>
    <h2>通知配置</h2>
    <informTable :informInfo="form" ref="table"></informTable>
    <div class="btn">
      <el-button type="primary" v-prevent="1000" :disabled="disabled" @click="onSubmit">立即创建</el-button>
      <el-button @click="gotoList">取消</el-button>
    </div>
  </div>
</template>

<script>
import informs from "@/utils/inform.js";
import rules from "@/utils/rules.js";
import informTable from "@/views/businessCharts/warningRule/informTable.vue";
export default {
  name: "pondRiskAdd",
  components: { informTable },
  data() {
    return {
      props: {
        value: "id",
        label: "name"
      },
      pondAndGame: "",
      optionslist: [],

      showMaxJackpotMoney: true,
      showMinJackpotMoney: false,
      options: [],
      treeName: [],
      treeNames: "",
      options1: [
        {
          value: 1,
          label: "最高奖池金额",
          disabled: false
        },
        {
          value: 2,
          label: "最低奖池金额",
          disabled: false
        }
      ],
      informObjs: [],
      gameValue: "", //游戏
      indexValue: 1, //指标配置
      jacket: "",
      jacketList: [
        {
          value: 1,
          label: "1"
        },
        {
          value: 2,
          label: "2"
        },
        {
          value: 3,
          label: "3"
        },
        {
          value: 4,
          label: "4"
        },
        {
          value: 5,
          label: "5"
        }
      ],
      value: "",
      type: null,
      showWatchingPc: true,
      maxList: [
        "maxJackpotMoneyOrdinary",
        "maxJackpotMoneySerious",
        "maxJackpotMoneyMajor"
      ],
      minList: [
        "minJackpotMoneyOrdinary",
        "minJackpotMoneySerious",
        "minJackpotMoneyMajor"
      ],
      disabled: false,
      form: {
        collectFrequency: "", //采集间隔(单位：分钟) 传入15，表示15分钟匹配一次
        collectStatus: 0, //0生效 1停止
        gameId: "",
        gameName: "",
        maxJackpotMoneyMajor: "", //最高奖池金额-Ⅰ级级别
        maxJackpotMoneyOrdinary: "", //最高奖池金额-普通级别
        maxJackpotMoneySerious: "", //最高奖池金额-Ⅱ级级别
        minJackpotMoneyMajor: "", //Ⅰ级级别
        minJackpotMoneyOrdinary: "", //普通级别
        minJackpotMoneySerious: "" //Ⅱ级级别
      },
      rules: {
        maxJackpotMoneyOrdinary: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          }
          // { validator: zgjcCompareA, trigger: ["blur", "change"] }
        ],
        maxJackpotMoneySerious: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          }
          // { validator: zgjcCompareB, trigger: ["blur", "change"] }
        ],
        maxJackpotMoneyMajor: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          }
          // { validator: zgjcCompareC, trigger: ["blur", "change"] }
        ],
        minJackpotMoneySerious: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          }
          // { validator: zdjcCompareB, trigger: ["blur", "change"] }
        ],
        minJackpotMoneyOrdinary: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          }
          // { validator: zdjcCompareA, trigger: ["blur", "change"] }
        ],
        minJackpotMoneyMajor: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          }
          // { validator: zdjcCompareC, trigger: ["blur", "change"] }
        ]
      }
    };
  },
  methods: {
    async getGameLists(options) {
      const self = this;
      const res = await self.$api.getGameLists();
      if (res && res.code == 0) {
        this.options = res.data;
      }
      this.maxList.forEach(v => {
        this.requiredList(v, 1);
      });
    },
    //获取游戏奖池联动列表
    async getRewardpoolList() {
      const self = this;
      const res = await self.$api.getRewardpoolList();
      if (res && res.code == 0) {
        res.data.forEach(v => {
          if (v.jackpotIds) {
            v.children = v.jackpotIds;
          }
        });
        this.optionslist = res.data;
      }
    },
    //取消返回列表页面
    gotoList() {
      this.$router.push({
        name: "pondRisk"
      });
    },
    //第一次监控时间改变事件
    changeTime1(val) {
      this.timingSecond = "";
      this.timingThird = "";
      this.timingFourth = "";
      this.timingFifth = "";
      this.timingSixth = "";
      this.disabledTime3 = true;
      this.disabledTime4 = true;
      this.disabledTime5 = true;
      this.disabledTime6 = true;
      if (val) {
        this.disabledTime2 = false;
      } else {
        this.disabledTime2 = true;
      }
    },
    //第二次监控时间改变事件
    changeTime2(val) {
      this.timingThird = "";
      this.timingFourth = "";
      this.timingFifth = "";
      this.timingSixth = "";
      this.disabledTime4 = true;
      this.disabledTime5 = true;
      this.disabledTime6 = true;
      if (val) {
        this.disabledTime3 = false;
      } else {
        this.disabledTime3 = true;
      }
    },
    //第三次监控时间改变事件
    changeTime3(val) {
      this.timingFourth = "";
      this.timingFifth = "";
      this.timingSixth = "";
      this.disabledTime5 = true;
      this.disabledTime6 = true;
      if (val) {
        this.disabledTime4 = false;
      } else {
        this.disabledTime4 = true;
      }
    },
    //第四次监控时间改变事件
    changeTime4(val) {
      this.timingFifth = "";
      this.timingSixth = "";
      this.disabledTime6 = true;
      if (val) {
        this.disabledTime5 = false;
      } else {
        this.disabledTime5 = true;
      }
    },
    //第五次监控时间改变事件
    changeTime5(val) {
      this.timingSixth = "";
      if (val) {
        this.disabledTime6 = false;
      } else {
        this.disabledTime6 = true;
      }
    },
    //提交
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.save(this.$refs.table.dataInform);
        }
      });
    },
    // 转换金额 乘以100
    toMoney(data, val) {
      setTimeout(v => {
        for (let key in data) {
          if (key == val) {
            if (data[key]) {
              data[key] = data[key] * 100;
            }
          }
        }
      }, 10);
      console.log(data);
      return data;
    },
    //奖池新增
    save(propsData) {
      var flag = informs.checkInformPeople(propsData);
      if (flag === true) {
      } else {
        this.$message.warning(flag);
        return;
      }
      console.log(propsData.people4, propsData.people7);
      var data = {
        collectFrequency: this.form.collectFrequency,
        gameId: this.pondAndGame[0],
        collectStatus: this.form.collectStatus,
        maxJackpotMoneyMajor: this.form.maxJackpotMoneyMajor * 100 || null,
        maxJackpotMoneyOrdinary:
          this.form.maxJackpotMoneyOrdinary * 100 || null,
        maxJackpotMoneySerious: this.form.maxJackpotMoneySerious * 100 || null,
        minJackpotMoneyMajor: this.form.minJackpotMoneyMajor * 100 || null,
        minJackpotMoneyOrdinary:
          this.form.minJackpotMoneyOrdinary * 100 || null,
        minJackpotMoneySerious: this.form.minJackpotMoneySerious * 100 || null,
        informManIdMajor: propsData.people3[1],
        informManIdOrdinary: propsData.people1[1],
        informManIdSerious: propsData.people2[1],
        informManDepIdMajor: propsData.people3[0],
        informManDepIdOrdinary: propsData.people1[0],
        informManDepIdSerious: propsData.people2[0],

        informManSeDepIdOrdinary: propsData.people4[0],
        informManSeIdOrdinary: propsData.people4[1],
        informManThDepIdOrdinary: propsData.people7[0],
        informManThIdOrdinary: propsData.people7[1],

        informManSeDepIdSerious: propsData.people5[0],
        informManSeIdSerious: propsData.people5[1],
        informManThDepIdSerious: propsData.people8[0],
        informManThIdSerious: propsData.people8[1],

        informManSeDepIdMajor: propsData.people6[0],
        informManSeIdMajor: propsData.people6[1],
        informManThDepIdMajor: propsData.people9[0],
        informManThIdMajor: propsData.people9[1],
        informWayMajor: propsData.informWayMajor,
        informWayOrdinary: propsData.informWayOrdinary,
        informWaySerious: propsData.informWaySerious,
        jackpotPoolId: this.pondAndGame[1],
        indexType: this.indexValue
      };
      this.pondRiskInsert(data);
    },
    //奖池风险指标新增api
    pondRiskInsert(data) {
      console.log(data);
      const self = this;
      (async v => {
        let res = await self.$api.pondRiskInsert({ data });
        if (res && res.code == 0) {
          self.$message.success("新增成功");
          self.$router.push({
            name: "pondRiskDetail",
            query: {
              id: res.data.businessKey
            }
          });
        }
      })(data);
    },

    //下拉框勾选显示对应要设置的数值
    selectChange(val) {
      this.type = val;
      if (this.type) {
        if (this.type == 1) {
          this.showMaxJackpotMoney = true;
          this.showMinJackpotMoney = false;
          this.$refs.form.resetFields();

          this.form.maxJackpotMoneyMajor = 60000000;
          this.form.maxJackpotMoneySerious = 50000000;
          this.form.maxJackpotMoneyOrdinary = 40000000;
          this.maxList.forEach(v => {
            this.requiredList(v, 1);
          });
          this.minList.forEach(v => {
            this.requiredList(v, 0);
          });
        } else if (this.type == 2) {
          this.maxList.forEach(v => {
            this.requiredList(v, 0);
          });
          this.minList.forEach(v => {
            this.requiredList(v, 1);
          });
          this.$refs.form.resetFields();
          this.showMinJackpotMoney = true;
          this.showMaxJackpotMoney = false;
          this.form.minJackpotMoneyMajor = 10000000;
          this.form.minJackpotMoneySerious = 20000000;
          this.form.minJackpotMoneyOrdinary = 30000000;
        }
      }
    },
    //设置是否为为必填
    requiredList(name, type) {
      if (type == 1) {
        this.rules[name].forEach(v => {
          if (v.required) {
            v.required = "true";
          }
        });
      } else {
        this.rules[name].forEach(v => {
          if (v.required) {
            v.required = "false";
          }
        });
      }
    },
    //设置默认指标存储浏览器
    predecessorTask() {
      this.form.maxJackpotMoneyMajor = 60000000;
      this.form.maxJackpotMoneySerious = 50000000;
      this.form.maxJackpotMoneyOrdinary = 40000000;
      this.maxList.forEach(v => {
        this.requiredList(v, 1);
      });
      this.minList.forEach(v => {
        this.requiredList(v, 0);
      });
    }
  },
  created() {},
  mounted() {
    this.getGameLists();
    this.getRewardpoolList();
  }
};
</script>

<style lang='less' scoped>
@import "./less/index.less";
/deep/.el-cascader-menu {
  min-width: 200px;
}
</style>
