<template>
  <div class="vlt-card">
    <h3 class="headling">游戏风险指标新增</h3>
    <div class="select-box">
      <p class="treename">
        <span v-show="addType!==1">
          <span>所属机构:</span>
          <el-cascader
            :options="insTreeList"
            class="insCascader"
            :props="{ checkStrictly: true }"
            size="small"
            v-model="insId"
            @change="insIdChange"
          ></el-cascader>
        </span>
        <span v-show="addType===1">
          <span class="game">维度:</span>
          <el-select v-model="areaValue" size="small" placeholder="请选择">
            <el-option
              v-for="item in areaOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </span>
        <span class="game">游戏:</span>
        <el-select v-model="gameValue" size="small" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.gameId"
            :label="item.gameName"
            :value="item.gameId"
            :disabled="item.disabled"
          ></el-option>
        </el-select>
      </p>

      <div class="fits">
        <div class="showbox">
          <h2>指标配置</h2>
          <p>
            <span>指标选择</span>
            <el-select size="small" @change="selectChange" v-model="indexValue" placeholder="请选择">
              <el-option
                v-for="item in indexList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
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
                <div class="editfrom inputsWidth" v-show="showMinimumReturnRate">
                  <el-form-item label="Ⅲ级" prop="minimumReturnRateOrdinary">
                    <el-input
                      show-word-limit
                      maxlength="2"
                      v-model="form.minimumReturnRateOrdinary"
                    ></el-input>
                    <span>%</span>
                  </el-form-item>
                  <el-form-item label="Ⅱ级" prop="minimumReturnRateSerious">
                    <el-input show-word-limit maxlength="2" v-model="form.minimumReturnRateSerious"></el-input>
                    <span>%</span>
                  </el-form-item>
                  <el-form-item label="Ⅰ级" prop="minimumReturnRateMajor">
                    <el-input show-word-limit maxlength="2" v-model="form.minimumReturnRateMajor"></el-input>
                    <span>%</span>
                  </el-form-item>
                </div>
                <div class="editfrom inputsWidth" v-show="showHighestReturnRate">
                  <el-form-item label="Ⅲ级" prop="highestReturnRateOrdinary">
                    <el-input
                      show-word-limit
                      maxlength="2"
                      v-model="form.highestReturnRateOrdinary"
                    ></el-input>
                    <span>%</span>
                  </el-form-item>
                  <el-form-item label="Ⅱ级" prop="highestReturnRateSerious">
                    <el-input show-word-limit maxlength="2" v-model="form.highestReturnRateSerious"></el-input>
                    <span>%</span>
                  </el-form-item>
                  <el-form-item label="Ⅰ级" prop="highestReturnRateMajor">
                    <el-input show-word-limit maxlength="2" v-model="form.highestReturnRateMajor"></el-input>
                    <span>%</span>
                  </el-form-item>
                </div>
                <div class="editfrom inputsWidth" v-show="showHighestBigPrizeNum">
                  <el-form-item label="Ⅲ级" prop="highestBigPrizeNumOrdinary">
                    <el-input
                      show-word-limit
                      maxlength="4"
                      :disabled="disabled"
                      v-model="form.highestBigPrizeNumOrdinary"
                    ></el-input>
                    <span>个</span>
                  </el-form-item>
                  <el-form-item label="Ⅱ级" prop="highestBigPrizeNumSerious">
                    <el-input
                      show-word-limit
                      maxlength="4"
                      :disabled="disabled"
                      v-model="form.highestBigPrizeNumSerious"
                    ></el-input>
                    <span>个</span>
                  </el-form-item>
                  <el-form-item label="Ⅰ级" prop="highestBigPrizeNumMajor">
                    <el-input
                      show-word-limit
                      maxlength="4"
                      :disabled="disabled"
                      v-model="form.highestBigPrizeNumMajor"
                    ></el-input>
                    <span>个</span>
                  </el-form-item>
                </div>
                <div class="editfrom inputsWidth" v-show="showHighestBigPrizeAmount">
                  <el-form-item label="Ⅲ级" prop="highestBigPrizeAmountOrdinary">
                    <el-input
                      show-word-limit
                      maxlength="9"
                      v-model="form.highestBigPrizeAmountOrdinary"
                    ></el-input>
                    <span>元</span>
                  </el-form-item>
                  <el-form-item label="Ⅱ级" prop="highestBigPrizeAmountSerious">
                    <el-input
                      show-word-limit
                      maxlength="9"
                      v-model="form.highestBigPrizeAmountSerious"
                    ></el-input>
                    <span>元</span>
                  </el-form-item>
                  <el-form-item label="Ⅰ级" prop="highestBigPrizeAmountMajor">
                    <el-input
                      show-word-limit
                      maxlength="9"
                      v-model="form.highestBigPrizeAmountMajor"
                    ></el-input>
                    <span>元</span>
                  </el-form-item>
                </div>
                <div class="editfrom inputsWidth" v-show="showHighestCashPrizeAmount">
                  <el-form-item label="Ⅲ级" prop="highestCashPrizeAmountOrdinary">
                    <el-input
                      show-word-limit
                      maxlength="9"
                      v-model="form.highestCashPrizeAmountOrdinary"
                    ></el-input>
                    <span>元</span>
                  </el-form-item>
                  <el-form-item label="Ⅱ级" prop="highestCashPrizeAmountSerious">
                    <el-input
                      show-word-limit
                      maxlength="9"
                      v-model="form.highestCashPrizeAmountSerious"
                    ></el-input>
                    <span>元</span>
                  </el-form-item>
                  <el-form-item label="Ⅰ级" prop="highestCashPrizeAmountMajor">
                    <el-input
                      show-word-limit
                      maxlength="9"
                      v-model="form.highestCashPrizeAmountMajor"
                    ></el-input>
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
                  <p class="tip" v-show="!disabled">
                    <span class="xing">*</span>为必填项
                  </p>
                  <p class="tip" v-show="disabled">
                    <span class="xing">该游戏下的指标已全部设置完毕</span>
                  </p>
                </el-form-item>
              </div>
            </el-form>
          </div>
        </div>
      </div>
    </div>
    <div v-show="addType!==1">
      <h2>通知配置</h2>
      <informTable :informInfo="form" :insId="insId" ref="table"></informTable>
    </div>
    <div class="btn">
      <el-button type="primary" v-prevent="1000" :disabled="disabled" @click="onSubmit">立即创建</el-button>
      <el-button @click="gotoList">取消</el-button>
    </div>
  </div>
</template>

<script>
import storage from "@/utils/storage";
import rules from "@/utils/rules.js";
import informs from "@/utils/inform.js";
import informTable from "@/views/businessCharts/warningRule/informTable.vue";
export default {
  name: "gameRiskAdd",
  components: { informTable },
  data() {
    return {
      disabled: false,
      props: {
        value: "id",
        label: "text"
      },
      currentList: {},
      indexList: [
        {
          value: 1,
          label: "最高大奖数量",
          disabled: false
        },
        {
          value: 2,
          label: "最高大奖金额",
          disabled: false
        },
        {
          value: 3,
          label: "最高兑奖金额",
          disabled: false
        },
        {
          value: 4,
          label: "最高返奖率",
          disabled: false
        },
        {
          value: 5,
          label: "最低返奖率",
          disabled: false
        }
      ],
      indexValue: null, //指标配置
      showWatchingPc: true,
      showMinimumReturnRate: false,
      showHighestReturnRate: false,
      showHighestBigPrizeNum: true,
      showHighestBigPrizeAmount: false,
      showHighestCashPrizeAmount: false,
      options: [],
      addType: null,
      areaOptions: [
        {
          label: "省级",
          value: 1
        },
        {
          label: "市级",
          value: 2
        }
      ],
      areaValue: null,
      gameValue: "",
      type: null,
      insTreeList: null,
      insId: [],
      form: {
        type: 1,
        gameId: "",
        collectFrequency: "", //采集间隔(单位：分钟) 传入15，表示15分钟匹配一次
        collectStatus: 0, //0生效 1停止
        highestReturnRateMajor: "", //最高返奖率-Ⅰ级级别
        highestReturnRateOrdinary: "", //最高返奖率-Ⅲ级级别
        highestReturnRateSerious: "", //最高返奖率-Ⅱ级级别
        minimumReturnRateMajor: "", //最低返奖率-Ⅰ级级别
        minimumReturnRateOrdinary: "", //最低返奖率-Ⅲ级级别
        minimumReturnRateSerious: "", //最低返奖率-Ⅱ级级别
        highestBigPrizeAmountMajor: "",
        highestBigPrizeAmountOrdinary: "",
        highestBigPrizeAmountSerious: "",
        highestBigPrizeNumMajor: "",
        highestBigPrizeNumOrdinary: "",
        highestBigPrizeNumSerious: "",
        highestCashPrizeAmountMajor: "",
        highestCashPrizeAmountOrdinary: "",
        highestCashPrizeAmountSerious: "",
        provinceId: "", //省级id
        provinceName: "" //省级名称
      },
      highestReturnRateList: [
        "highestReturnRateMajor",
        "highestReturnRateOrdinary",
        "highestReturnRateSerious"
      ],
      minimumReturnRateList: [
        "minimumReturnRateMajor",
        "minimumReturnRateOrdinary",
        "minimumReturnRateSerious"
      ],
      highestBigPrizeAmountList: [
        "highestBigPrizeAmountMajor",
        "highestBigPrizeAmountOrdinary",
        "highestBigPrizeAmountSerious"
      ],
      highestBigPrizeNumList: [
        "highestBigPrizeNumMajor",
        "highestBigPrizeNumOrdinary",
        "highestBigPrizeNumSerious"
      ],
      cashPrizeAmountList: [
        "highestCashPrizeAmountMajor",
        "highestCashPrizeAmountOrdinary",
        "highestCashPrizeAmountSerious"
      ],

      rules: {
        minimumReturnRateOrdinary: [
          {
            validator: rules.unDAmounts,
            trigger: ["blur", "change"],
            required: "false"
          }
          // { validator: zdfjCompareA, trigger: ["blur", "change"] }
        ],
        minimumReturnRateSerious: [
          {
            validator: rules.unDAmounts,
            trigger: ["blur", "change"],
            required: "false"
          }
          // { validator: zdfjCompareB, trigger: ["blur", "change"] }
        ],
        minimumReturnRateMajor: [
          {
            validator: rules.unDAmounts,
            trigger: ["blur", "change"],
            required: "false"
          }
          // { validator: zdfjCompareC, trigger: ["blur", "change"] }
        ],
        highestReturnRateOrdinary: [
          {
            validator: rules.unDAmounts,
            trigger: ["blur", "change"],
            required: "false"
          }
          // { validator: zgfjCompareA, trigger: ["blur", "change"] }
        ],
        highestReturnRateSerious: [
          {
            validator: rules.unDAmounts,
            trigger: ["blur", "change"],
            required: "false"
          }
          // { validator: zgfjCompareB, trigger: ["blur", "change"] }
        ],
        highestReturnRateMajor: [
          {
            validator: rules.unDAmounts,
            trigger: ["blur", "change"],
            required: "false"
          }
          // { validator: zgfjCompareC, trigger: ["blur", "change"] }
        ],

        highestBigPrizeAmountMajor: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          }
          // { validator: dajjeCompareC, trigger: ["blur", "change"] }
        ],
        highestBigPrizeAmountOrdinary: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          }
          // { validator: dajjeCompareA, trigger: ["blur", "change"] }
        ],
        highestBigPrizeAmountSerious: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          }
          // { validator: dajjeCompareB, trigger: ["blur", "change"] }
        ],

        highestBigPrizeNumMajor: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            title: "大奖数量",
            required: "false"
          }
          // { validator: djslCompareC, trigger: ["blur", "change"] }
        ],
        highestBigPrizeNumOrdinary: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            title: "大奖数量",
            required: "false"
          }
          // { validator: djslCompareA, trigger: ["blur", "change"] }
        ],
        highestBigPrizeNumSerious: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            title: "大奖数量",
            required: "false"
          }
          // { validator: djslCompareB, trigger: ["blur", "change"] }
        ],
        highestCashPrizeAmountMajor: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          }
          // { validator: duijjeCompareC, trigger: ["blur", "change"] }
        ],
        highestCashPrizeAmountOrdinary: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          }
          // { validator: duijjeCompareA, trigger: ["blur", "change"] }
        ],
        highestCashPrizeAmountSerious: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          }
          // { validator: duijjeCompareB, trigger: ["blur", "change"] }
        ]
      },
      area: []
    };
  },
  methods: {
    //提交
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.gameRiskInsert(this.$refs.table.dataInform);
        }
      });
    },
    //取消返回列表页面
    gotoList() {
      this.$router.push({
        name: "cityGameRisk"
      });
    },
    //游戏风险指标新增
    async gameRiskInsert(propsData) {
      const id = this.$route.query.id;
      const self = this;
      if (this.insId.length == 0 && this.addType !== 1) {
        this.$message.warning(`请选择所属机构`);
        return;
      }

      if (!this.areaValue && this.addType === 1) {
        this.$message.warning(`请选择维度`);
        return;
      }

      if (this.addType !== 1) {
        var flag = informs.checkInformPeople(propsData);
        if (flag === true) {
        } else {
          this.$message.warning(flag);
          return;
        }

        const res = await self.$api.gameRiskInsert({
          data: {
            insId: this.insId ? this.insId[this.insId.length - 1] : "",
            indexType: this.indexValue,
            gameId: this.gameValue,
            collectFrequency: this.form.collectFrequency,
            collectStatus: this.form.collectStatus,
            highestReturnRateMajor: informs.conventToPoint(
              this.form.highestReturnRateMajor
            ),
            highestReturnRateOrdinary: informs.conventToPoint(
              this.form.highestReturnRateOrdinary
            ),
            highestReturnRateSerious: informs.conventToPoint(
              this.form.highestReturnRateSerious
            ),
            minimumReturnRateMajor: informs.conventToPoint(
              this.form.minimumReturnRateMajor
            ),
            minimumReturnRateOrdinary: informs.conventToPoint(
              this.form.minimumReturnRateOrdinary
            ),
            minimumReturnRateSerious: informs.conventToPoint(
              this.form.minimumReturnRateSerious
            ),
            highestBigPrizeNumMajor: this.form.highestBigPrizeNumMajor,
            highestBigPrizeNumSerious: this.form.highestBigPrizeNumSerious,
            highestBigPrizeNumOrdinary: this.form.highestBigPrizeNumOrdinary,
            highestCashPrizeAmountMajor:
              this.form.highestCashPrizeAmountMajor * 100 || null,
            highestCashPrizeAmountOrdinary:
              this.form.highestCashPrizeAmountOrdinary * 100 || null,
            highestCashPrizeAmountSerious:
              this.form.highestCashPrizeAmountSerious * 100 || null,
            highestBigPrizeAmountMajor:
              this.form.highestBigPrizeAmountMajor * 100 || null,
            highestBigPrizeAmountOrdinary:
              this.form.highestBigPrizeAmountOrdinary * 100 || null,
            highestBigPrizeAmountSerious:
              this.form.highestBigPrizeAmountSerious * 100 || null,
            informManIdMajor: propsData.people3[1],
            informManIdSerious: propsData.people2[1],
            informManIdOrdinary: propsData.people1[1],
            informWayMajor: propsData.informWayMajor,
            informWayOrdinary: propsData.informWayOrdinary,
            informWaySerious: propsData.informWaySerious,
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
            informManThIdMajor: propsData.people9[1]
          },
          message: "新增成功"
        });
        if (res && res.code == 0) {
          this.$router.push({
            name: "gameRiskDetail",
            query: {
              id: res.data.businessKey
            }
          });
        }
      } else {
        const res = await self.$api.gameBatchInsert({
          data: {
            batchIdentify: this.areaValue,
            indexType: this.indexValue,
            gameId: this.gameValue,
            collectFrequency: this.form.collectFrequency,
            collectStatus: this.form.collectStatus,
            highestReturnRateMajor: informs.conventToPoint(
              this.form.highestReturnRateMajor
            ),
            highestReturnRateOrdinary: informs.conventToPoint(
              this.form.highestReturnRateOrdinary
            ),
            highestReturnRateSerious: informs.conventToPoint(
              this.form.highestReturnRateSerious
            ),
            minimumReturnRateMajor: informs.conventToPoint(
              this.form.minimumReturnRateMajor
            ),
            minimumReturnRateOrdinary: informs.conventToPoint(
              this.form.minimumReturnRateOrdinary
            ),
            minimumReturnRateSerious: informs.conventToPoint(
              this.form.minimumReturnRateSerious
            ),
            highestBigPrizeNumMajor: this.form.highestBigPrizeNumMajor,
            highestBigPrizeNumSerious: this.form.highestBigPrizeNumSerious,
            highestBigPrizeNumOrdinary: this.form.highestBigPrizeNumOrdinary,
            highestCashPrizeAmountMajor:
              this.form.highestCashPrizeAmountMajor * 100 || null,
            highestCashPrizeAmountOrdinary:
              this.form.highestCashPrizeAmountOrdinary * 100 || null,
            highestCashPrizeAmountSerious:
              this.form.highestCashPrizeAmountSerious * 100 || null,
            highestBigPrizeAmountMajor:
              this.form.highestBigPrizeAmountMajor * 100 || null,
            highestBigPrizeAmountOrdinary:
              this.form.highestBigPrizeAmountOrdinary * 100 || null,
            highestBigPrizeAmountSerious:
              this.form.highestBigPrizeAmountSerious * 100 || null
          },
          message: "批量新增成功"
        });
        if (res && res.code == 0) {
          this.$router.push({
            name: "cityGameRisk"
          });
        }
      }
    },
    //获取机构id
    insIdChange(val) {
      this.insId = val;
    },
    //选择指标配置显示对应要设置的内容
    selectChange(val) {
      this.type = val;
      if (this.type) {
        if (this.type == 1) {
          this.$refs.form.resetFields();
          this.showHighestBigPrizeNum = true;
          this.showMinimumReturnRate = false;
          this.showHighestReturnRate = false;
          this.showHighestBigPrizeAmount = false;
          this.showHighestCashPrizeAmount = false;
          this.form.highestBigPrizeNumOrdinary = 200;
          this.form.highestBigPrizeNumSerious = 300;
          this.form.highestBigPrizeNumMajor = 400;
          this.highestBigPrizeNumList.forEach(v => {
            this.requiredList(v, 1);
          });
          storage.session.get("list").forEach(v => {
            this.requiredList(v, 0);
          });
          storage.session.set("list", this.highestBigPrizeNumList);
        } else if (this.type == 2) {
          this.$refs.form.resetFields();
          this.showHighestBigPrizeNum = false;
          this.showMinimumReturnRate = false;
          this.showHighestReturnRate = false;
          this.showHighestBigPrizeAmount = true;
          this.showHighestCashPrizeAmount = false;
          this.form.highestBigPrizeAmountOrdinary = 2000000;
          this.form.highestBigPrizeAmountSerious = 3000000;
          this.form.highestBigPrizeAmountMajor = 4000000;
          this.highestBigPrizeAmountList.forEach(v => {
            this.requiredList(v, 1);
          });
          storage.session.get("list").forEach(v => {
            this.requiredList(v, 0);
          });
          storage.session.set("list", this.highestBigPrizeAmountList);
        } else if (this.type == 3) {
          this.$refs.form.resetFields();
          this.showHighestBigPrizeNum = false;
          this.showMinimumReturnRate = false;
          this.showHighestReturnRate = false;
          this.showHighestBigPrizeAmount = false;
          this.showHighestCashPrizeAmount = true;
          this.form.highestCashPrizeAmountOrdinary = 1000000;
          this.form.highestCashPrizeAmountSerious = 2000000;
          this.form.highestCashPrizeAmountMajor = 3000000;
          this.cashPrizeAmountList.forEach(v => {
            this.requiredList(v, 1);
          });
          storage.session.get("list").forEach(v => {
            this.requiredList(v, 0);
          });
          storage.session.set("list", this.cashPrizeAmountList);
        } else if (this.type == 4) {
          this.$refs.form.resetFields();
          this.showHighestBigPrizeNum = false;
          this.showMinimumReturnRate = false;
          this.showHighestReturnRate = true;
          this.showHighestBigPrizeAmount = false;
          this.showHighestCashPrizeAmount = false;
          this.form.highestReturnRateOrdinary = 20;
          this.form.highestReturnRateSerious = 30;
          this.form.highestReturnRateMajor = 40;
          this.highestReturnRateList.forEach(v => {
            this.requiredList(v, 1);
          });
          storage.session.get("list").forEach(v => {
            this.requiredList(v, 0);
          });
          storage.session.set("list", this.highestReturnRateList);
        } else if (this.type == 5) {
          this.$refs.form.resetFields();
          this.showHighestBigPrizeNum = false;
          this.showMinimumReturnRate = true;
          this.showHighestReturnRate = false;
          this.showHighestBigPrizeAmount = false;
          this.showHighestCashPrizeAmount = false;
          this.form.minimumReturnRateOrdinary = 15;
          this.form.minimumReturnRateSerious = 10;
          this.form.minimumReturnRateMajor = 5;
          this.minimumReturnRateList.forEach(v => {
            this.requiredList(v, 1);
          });
          storage.session.get("list").forEach(v => {
            this.requiredList(v, 0);
          });
          storage.session.set("list", this.minimumReturnRateList);
        }
      }
    },
    //设置当前的输入内容并置为必填项 
    setCurrent(item, showName) {
      this[storage.session.get("currentList").show] = false;
      this[showName] = true;
      this.$refs.form.resetFields();
      storage.session.get("currentList").obj.forEach(v => {
        this.requiredList(v, 0);
      });
      item.forEach(v => {
        this.requiredList(v, 1);
      });

      this.currentList.show = showName;
      this.currentList.obj = item;
      storage.session.set("currentList", this.currentList);
    },
    //游戏下拉框列表
    async getGameLists(options) {
      const self = this;
      const res = await self.$api.getGameLists();
      if (res && res.code == 0) {
        this.options = res.data;
      }
     
    },
    //设置是否为为必填
    requiredList(name, type) {
      if (type == 1) {
        this.rules[name].forEach(v => {
          console.log(v);
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
    //前置任务
    predecessorTask() {
      //获取新增类型 1为批量新增 其他为新增
      const type = this.$route.query.type;
      if (type === 1) {
        this.addType = 1;
      }
      //设置默认指标存储浏览器
       this.form.highestBigPrizeNumOrdinary = 200;
      this.form.highestBigPrizeNumSerious = 300;
      this.form.highestBigPrizeNumMajor = 400;
      this.highestBigPrizeNumList.forEach(v => {
        this.requiredList(v, 1);
      });
      this.indexValue = 1;
      this.currentList.show = "showHighestBigPrizeNum";
      this.currentList.obj = this.highestBigPrizeNumList;
      storage.session.set("currentList", this.currentList);
      storage.session.set("list", this.highestBigPrizeNumList);
    },
    //获取机构树列表
    async queryInsTree() {
      let res = await this.$api.queryInsTree();
      if (res && res.code == 0) {
        this.setLabelAndValue(res.data);
      }
    },
    //递归绑定
    setLabelAndValue(area) {
      area.forEach(v => {
        v.value = v.id;
        v.label = v.text;
        if (v.children) {
          this.setLabelAndValue(v.children);
        }
      });
      this.insTreeList = area;
    }
  },
  mounted() {
    this.getGameLists();
    this.queryInsTree();
    this.predecessorTask()
  }
};
</script>

<style lang='less' scoped>
@import "./less/index.less";
</style>
