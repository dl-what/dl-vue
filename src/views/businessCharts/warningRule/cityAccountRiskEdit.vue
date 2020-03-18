<template>
  <div class="vlt-card">
    <h3 class="headling">账户风险指标修改</h3>
    <div class="select-box">
      <p class="treename">
        <span>所属机构:</span>
        <el-cascader
        :options="insTreeList"  class="insCascader"
        :props="{ checkStrictly: true }"
        size='small'
        v-model="insId"
        disabled
        clearable></el-cascader>
      </p>
      <div class="fits">
        <div class="showbox">
          <h2>指标配置</h2>
          <p>
            <span>指标选择</span>
            <el-select size="small" v-model="indexValue" placeholder="请选择" disabled>
              <el-option
                v-for="item in indexList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </p>
          <div class="formsTable">
            <p class="tipsPosition">数值达到对应风险指标值即为触发</p>
            <div class="llll">
              <p>告警等级</p>
              <p v-show="showWatchingPc" class="watching">监控频率</p>
              <p v-show="showWatchingTime" class="watching">监控时间</p>
            </div>
            <el-form
              label-position="left"
              ref="form"
              :rules="rules"
              :model="form"
              style="width:100%"
            >
              <div class="riskForm">
                <div class="editfrom inputsWidth" v-show="showHighestRechargeAmount">
                  <el-form-item label="Ⅲ级" prop="highestRechargeAmountOrdinary">
                    <el-input  show-word-limit maxlength=9  v-model="form.highestRechargeAmountOrdinary"></el-input>
                    <span>元</span>
                  </el-form-item>
                  <el-form-item label="Ⅱ级" prop="highestRechargeAmountSerious">
                    <el-input  show-word-limit maxlength=9  v-model="form.highestRechargeAmountSerious"></el-input>
                    <span>元</span>
                  </el-form-item>
                  <el-form-item label="Ⅰ级" prop="highestRechargeAmountMajor">
                    <el-input  show-word-limit maxlength=9  v-model="form.highestRechargeAmountMajor"></el-input>
                    <span>元</span>
                  </el-form-item>
                </div>
                <div class="editfrom inputsWidth" v-show="showMinimumRechargeAmount">
                  <el-form-item label="Ⅲ级" prop="minimumRechargeAmountOrdinary">
                    <el-input  show-word-limit maxlength=9  v-model="form.minimumRechargeAmountOrdinary"></el-input>
                    <span>元</span>
                  </el-form-item>
                  <el-form-item label="Ⅱ级" prop="minimumRechargeAmountSerious">
                    <el-input  show-word-limit maxlength=9  v-model="form.minimumRechargeAmountSerious"></el-input>
                    <span>元</span>
                  </el-form-item>
                  <el-form-item label="Ⅰ级" prop="minimumRechargeAmountMajor">
                    <el-input  show-word-limit maxlength=9  v-model="form.minimumRechargeAmountMajor"></el-input>
                    <span>元</span>
                  </el-form-item>
                </div>
                <div class="editfrom inputsWidth" v-show="showHighestWithdrawAmount">
                  <el-form-item label="Ⅲ级" prop="highestWithdrawAmountOrdinary">
                    <el-input  show-word-limit maxlength=9  v-model="form.highestWithdrawAmountOrdinary"></el-input>
                    <span>元</span>
                  </el-form-item>
                  <el-form-item label="Ⅱ级" prop="highestWithdrawAmountSerious">
                    <el-input  show-word-limit maxlength=9  v-model="form.highestWithdrawAmountSerious"></el-input>
                    <span>元</span>
                  </el-form-item>
                  <el-form-item label="Ⅰ级" prop="highestWithdrawAmountMajor">
                    <el-input  show-word-limit maxlength=9  v-model="form.highestWithdrawAmountMajor"></el-input>
                    <span>元</span>
                  </el-form-item>
                </div>
                <div class="editfrom inputsWidth" v-show="showHighestPaymentAmount">
                  <el-form-item label="Ⅲ级" prop="highestPaymentAmountOrdinary">
                    <el-input  show-word-limit maxlength=9  v-model="form.highestPaymentAmountOrdinary"></el-input>
                    <span>元</span>
                  </el-form-item>
                  <el-form-item label="Ⅱ级" prop="highestPaymentAmountSerious">
                    <el-input  show-word-limit maxlength=9  v-model="form.highestPaymentAmountSerious"></el-input>
                    <span>元</span>
                  </el-form-item>
                  <el-form-item label="Ⅰ级" prop="highestPaymentAmountMajor">
                    <el-input  show-word-limit maxlength=9  v-model="form.highestPaymentAmountMajor"></el-input>
                    <span>元</span>
                  </el-form-item>
                </div>
                <div class="editfrom inputsWidth" v-show="showMinimumPaymentAmount">
                  <el-form-item label="Ⅲ级" prop="minimumPaymentAmountOrdinary">
                    <el-input  show-word-limit maxlength=9  v-model="form.minimumPaymentAmountOrdinary"></el-input>
                    <span>元</span>
                  </el-form-item>
                  <el-form-item label="Ⅱ级" prop="minimumPaymentAmountSerious">
                    <el-input  show-word-limit maxlength=9  v-model="form.minimumPaymentAmountSerious"></el-input>
                    <span>元</span>
                  </el-form-item>
                  <el-form-item label="Ⅰ级" prop="minimumPaymentAmountMajor">
                    <el-input  show-word-limit maxlength=9  v-model="form.minimumPaymentAmountMajor"></el-input>
                    <span>元</span>
                  </el-form-item>
                </div>
                <div class="editfrom inputsWidth" v-show="showMinimumHallAccountBalance">
                  <el-form-item label="Ⅲ级" prop="minimumHallAccountBalanceOrdinary">
                    <el-input  show-word-limit maxlength=9  v-model="form.minimumHallAccountBalanceOrdinary"></el-input>
                    <span>元</span>
                  </el-form-item>
                  <el-form-item label="Ⅱ级" prop="minimumHallAccountBalanceSerious">
                    <el-input  show-word-limit maxlength=9  v-model="form.minimumHallAccountBalanceSerious"></el-input>
                    <span>元</span>
                  </el-form-item>
                  <el-form-item label="Ⅰ级" prop="minimumHallAccountBalanceMajor">
                    <el-input  show-word-limit maxlength=9  v-model="form.minimumHallAccountBalanceMajor"></el-input>
                    <span>元</span>
                  </el-form-item>
                </div>
                <div class="editfrom inputsWidth" v-show="showAvgConsumptionAmountMin">
                  <el-form-item label="Ⅲ级" prop="avgConsumptionAmountMinOrdinary">
                    <el-input  show-word-limit maxlength=9  v-model="form.avgConsumptionAmountMinOrdinary"></el-input>
                    <span>元</span>
                  </el-form-item>
                  <el-form-item label="Ⅱ级" prop="avgConsumptionAmountMinSerious">
                    <el-input  show-word-limit maxlength=9  v-model="form.avgConsumptionAmountMinSerious"></el-input>
                    <span>元</span>
                  </el-form-item>
                  <el-form-item label="Ⅰ级" prop="avgConsumptionAmountMinMajor">
                    <el-input  show-word-limit maxlength=9  v-model="form.avgConsumptionAmountMinMajor"></el-input>
                    <span>元</span>
                  </el-form-item>
                </div>
              </div>
              <div class="editfrom" v-show="showWatchingPc">
                <el-form-item prop label>
                  <el-input-number
                    v-model="form.collectFrequency"
                    controls-position="right"
                    @change="handleChange"
                    :min="10"
                    :max="100"
                    :step="1"
                    size="small"
                  ></el-input-number>
                  <span class="unit">(分钟/次)</span>
                  <p class="tip">
                    <span class="xing">*</span>为必填项
                  </p>
                </el-form-item>
              </div>
              <div class="editfrom watchingTime" v-show="showWatchingTime">
                <el-form-item prop label="第一次监控时间">
                  <el-time-select
                    placeholder="选择时间"
                    v-model="form.timingFirst"
                    :picker-options="{
                      start: '00:00',
                      step: '00:15',
                      end: '23:30'
                    }"
                    @change="changeTime1"
                  ></el-time-select>
                </el-form-item>
                <el-form-item prop label="第二次监控时间">
                  <el-time-select
                    placeholder="选择时间"
                    v-model="form.timingSecond"
                    :disabled="disabledTime2"
                    :picker-options="{
                      start: form.timingFirst,
                      step: '00:15',
                      end: '23:30',
                      minTime: form.timingFirst,
                      
                    }"
                    @change="changeTime2"
                  ></el-time-select>
                </el-form-item>
                <el-form-item prop label="第三次监控时间">
                  <el-time-select
                    placeholder="选择时间"
                    v-model="form.timingThird"
                    :disabled="disabledTime3"
                    :picker-options="{
                start: form.timingSecond,
                step: '00:15',
                end: '23:30',
                minTime: form.timingSecond,
              }"
                    @change="changeTime3"
                  ></el-time-select>
                </el-form-item>
                <el-form-item prop label="第四次监控时间">
                  <el-time-select
                    placeholder="选择时间"
                    v-model="form.timingFourth"
                    :disabled="disabledTime4"
                    :picker-options="{
                start: form.timingThird,
                step: '00:15',
                end: '23:30',
                minTime: form.timingThird,
                
              }"
                    @change="changeTime4"
                  ></el-time-select>
                </el-form-item>

                <el-form-item prop label="第五次监控时间">
                  <el-time-select
                    placeholder="选择时间"
                    v-model="form.timingFifth"
                    :disabled="disabledTime5"
                    :picker-options="{
                start: form.timingFourth,
                step: '00:15',
                end: '23:30',
                minTime: form.timingFourth,              
              }"
                    @change="changeTime5"
                  ></el-time-select>
                </el-form-item>
                <el-form-item prop label="第六次监控时间">
                  <el-time-select
                    placeholder="选择时间"
                    v-model="form.timingSixth"
                    :disabled="disabledTime6"
                    :picker-options="{
                start: form.timingFifth,
                step: '00:15',
                end: '23:30',
                minTime: form.timingFifth
              }"
                  ></el-time-select>
                </el-form-item>
                <p class="tips">
                  <span class="xing">*</span>为必填项
                </p>
              </div>
            </el-form>
          </div>
        </div>
      </div>
    </div>
    <h2>通知配置</h2>
    <informTable :informInfo="form" :form="form" ref="table"></informTable>
    <div class="btn">
      <el-button type="primary" v-prevent="1000" @click="onSubmit">保存</el-button>
      <el-button @click="gotoList">取消</el-button>
    </div>
  </div>
</template>
<script>
import rules from "@/utils/rules.js";
import informs from "@/utils/inform.js";
import informTable from "@/views/businessCharts/warningRule/informTable.vue";
export default {
  name: "cityRiskEdit",
  components: { informTable },
  data() {
    return {
      props: {
        value: "id",
        label: "text"
      },
      optionsArea: [],
      selectName: "",
      indexValue: null,
      area: [],
      treeName: [],
      treeNames: "",
      insId:null,
      insTreeList:null,
      showtips1: false,
      showtips2: true,
      showtips3: false,
      showWatchingTime: false,
      showWatchingPc: false,
      showHighestRechargeAmount: false,
      showMinimumRechargeAmount: false,
      showHighestWithdrawAmount: false,
      showHighestPaymentAmount: false,
      showMinimumPaymentAmount: false,
      showMinimumHallAccountBalance: false,
      showAvgConsumptionAmountMin: false,
      highestRechargeAmountList: [
        "highestRechargeAmountMajor",
        "highestRechargeAmountSerious",
        "highestRechargeAmountOrdinary"
      ],
      minimumPaymentAmountList: [
        "minimumPaymentAmountMajor",
        "minimumPaymentAmountSerious",
        "minimumPaymentAmountOrdinary"
      ],
      highestWithdrawAmountList: [
        "highestWithdrawAmountMajor",
        "highestWithdrawAmountSerious",
        "highestWithdrawAmountOrdinary"
      ],
      highestPaymentAmountList: [
        "highestPaymentAmountMajor",
        "highestPaymentAmountSerious",
        "highestPaymentAmountOrdinary"
      ],
      minimumRechargeAmountList: [
        "minimumRechargeAmountMajor",
        "minimumRechargeAmountSerious",
        "minimumRechargeAmountOrdinary"
      ],
      minimumHallAccountBalanceList: [
        "minimumHallAccountBalanceMajor",
        "minimumHallAccountBalanceSerious",
        "minimumHallAccountBalanceOrdinary"
      ],
      avgConsumptionAmountMinList: [
        "avgConsumptionAmountMinMajor",
        "avgConsumptionAmountMinSerious",
        "avgConsumptionAmountMinOrdinary"
      ],
      type: null,
      showeditBox: true,
      disabledTime2: true,
      disabledTime3: true,
      disabledTime4: true,
      disabledTime5: true,
      disabledTime6: true,
      indexList: [
        {
          value: 1,
          label: "最高充值"
        },
        {
          value: 2,
          label: "最低充值"
        },
        {
          value: 3,
          label: "最高提现"
        },
        {
          value: 4,
          label: "最低缴款金额"
        },
        {
          value: 5,
          label: "最高缴款金额"
        },
        {
          value: 6,
          label: "最低单厅余额"
        },
        {
          value: 7,
          label: "投注卡平均最低消费"
        }
      ],
      form: {
        timingSecond: "",
        timingFirst: "",
        timingThird: "",
        timingFourth: "",
        timingFifth: "",
        timingSixth: "",
        collectFrequency: "", //采集间隔(单位：分钟) 传入15，表示15分钟匹配一次
        collectStatus: 0, //0生效 1停止
        highestRechargeAmountMajor: "", //最低返奖率-Ⅰ级级别
        highestRechargeAmountSerious: "", //最低返奖率-普通级别
        highestRechargeAmountOrdinary: "", //最低返奖率-Ⅱ级级别
        minimumPaymentAmountMajor: "", //最高返奖率-Ⅰ级级别
        minimumPaymentAmountSerious: "", //最高返奖率-普通级别
        minimumPaymentAmountOrdinary: "", //最高返奖率-Ⅱ级级别
        highestWithdrawAmountMajor: "", //最高返奖率-Ⅰ级级别
        highestWithdrawAmountSerious: "", //最高返奖率-普通级别
        highestWithdrawAmountOrdinary: "", //最高返奖率-Ⅱ级级别
        highestPaymentAmountMajor: "", //最高返奖率-Ⅰ级级别
        highestPaymentAmountSerious: "", //最高返奖率-普通级别
        highestPaymentAmountOrdinary: "", //最高返奖率-Ⅱ级级别
        minimumRechargeAmountMajor: "", //最高返奖率-Ⅰ级级别
        minimumRechargeAmountOrdinary: "", //最高返奖率-普通级别
        minimumRechargeAmountSerious: "", //最高返奖率-Ⅱ级级别
        avgConsumptionAmountMinMajor: "",
        avgConsumptionAmountMinOrdinary: "",
        avgConsumptionAmountMinSerious: "",
        minimumHallAccountBalanceMajor: "",
        minimumHallAccountBalanceOrdinary: "",
        minimumHallAccountBalanceSerious: ""
      },
      rules: {
        highestRechargeAmountOrdinary: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
        ],
        highestRechargeAmountSerious: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
        ],
        highestRechargeAmountMajor: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
        ],
        minimumRechargeAmountOrdinary: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
        ],
        minimumRechargeAmountSerious: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
        ],
        minimumRechargeAmountMajor: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
        ],
        highestWithdrawAmountOrdinary: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
        ],
        highestWithdrawAmountSerious: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
        ],
        highestWithdrawAmountMajor: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
        ],
        highestPaymentAmountOrdinary: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
        ],
        highestPaymentAmountSerious: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
        ],
        highestPaymentAmountMajor: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
        ],
        minimumPaymentAmountOrdinary: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
        ],
        minimumPaymentAmountSerious: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
        ],
        minimumPaymentAmountMajor: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
        ],

        minimumHallAccountBalanceOrdinary: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },     
        ],
        minimumHallAccountBalanceSerious: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
        ],
        minimumHallAccountBalanceMajor: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },         
        ],
        avgConsumptionAmountMinOrdinary: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
        ],
        avgConsumptionAmountMinSerious: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
        ],
        avgConsumptionAmountMinMajor: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
        ]
      }
    };
  },
  methods: {
    handleChange(value) {},
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.cityAccountRiskUpdate(this.$refs.table.dataInform);
        }
      });
    },
    //跳转账户风险列表页面
    gotoList() {
      this.$router.push({ name: "cityAccountRisk" });
    },
    //表格选择指标配置显示对应要设置的
    selectChange(val) {
      this.type = val;
    },
    //游戏风险指标修改
    async cityAccountRiskUpdate(propsData) {
      if (!this.form.timingFirst && this.showWatchingTime == true) {
        this.$message.warning(`请至少选择一次监控时间`);
        return;
      }
      var flag=informs.checkInformPeople(propsData)
      if(flag===true){      
      }else{
        this.$message.warning(flag);
        return
      }
      const self = this;
      const res = await self.$api.cityAccountRiskUpdate({
        data: {
          timingFirst: this.form.timingFirst,
          timingSecond: this.form.timingSecond,
          timingThird: this.form.timingThird,
          timingFourth: this.form.timingFourth,
          timingFifth: this.form.timingFifth,
          timingSixth: this.form.timingSixth,
          businessKey: this.$route.query.id,
          collectFrequency:
            this.showWatchingTime == true ? null : this.form.collectFrequency,
          collectStatus: this.form.collectStatus,
          informManDepIdMajor: propsData.people3[0],
          informManDepIdOrdinary: propsData.people1[0],
          informManDepIdSerious: propsData.people2[0],
          informManIdMajor: propsData.people3[1],
          informManIdOrdinary: propsData.people1[1],
          informManIdSerious: propsData.people2[1],
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
          informCentralManIdOrdinary: propsData.informCentralManIdOrdinary,
          informProvinceManIdOrdinary: propsData.informProvinceManIdOrdinary,
          informCityManIdOrdinary: propsData.informCityManIdOrdinary,
          informWayMajor: propsData.informWayMajor,
          informWayOrdinary: propsData.informWayOrdinary,
          informWaySerious: propsData.informWaySerious,

          highestRechargeAmountMajor:
            this.form.highestRechargeAmountMajor * 100 || null,
          highestRechargeAmountOrdinary:
            this.form.highestRechargeAmountOrdinary * 100 || null,
          highestRechargeAmountSerious:
            this.form.highestRechargeAmountSerious * 100 || null,
          highestWithdrawAmountMajor:
            this.form.highestWithdrawAmountMajor * 100 || null,
          highestWithdrawAmountOrdinary:
            this.form.highestWithdrawAmountOrdinary * 100 || null,
          highestWithdrawAmountSerious: this.form.highestWithdrawAmountSerious*100||null,

          highestPaymentAmountMajor: this.form.highestPaymentAmountMajor*100||null,

          highestPaymentAmountOrdinary: this.form.highestPaymentAmountOrdinary*100||null,
          highestPaymentAmountSerious: this.form.highestPaymentAmountSerious*100||null,

          minimumRechargeAmountMajor: this.form.minimumRechargeAmountMajor*100||null,
          minimumRechargeAmountOrdinary: this.form
            .minimumRechargeAmountOrdinary*100||null,
          minimumRechargeAmountSerious: this.form.minimumRechargeAmountSerious*100||null,

          minimumPaymentAmountMajor: this.form.minimumPaymentAmountMajor*100||null,
          minimumPaymentAmountOrdinary: this.form.minimumPaymentAmountOrdinary*100||null,
          minimumPaymentAmountSerious: this.form.minimumPaymentAmountSerious*100||null,

          avgConsumptionAmountMinMajor: this.form.avgConsumptionAmountMinMajor*100||null,
          avgConsumptionAmountMinOrdinary: this.form
            .avgConsumptionAmountMinOrdinary*100||null,
          avgConsumptionAmountMinSerious: this.form
            .avgConsumptionAmountMinSerious*100||null,

          minimumHallAccountBalanceMajor: this.form
            .minimumHallAccountBalanceMajor*100||null,
          minimumHallAccountBalanceOrdinary: this.form
            .minimumHallAccountBalanceOrdinary*100||null,
          minimumHallAccountBalanceSerious: this.form
            .minimumHallAccountBalanceSerious*100||null
        },
        message: "修改成功"
      });
      if (res && res.code == 0) {
        this.$router.push({
          name: "cityAccountRiskDetail",
          query: {
            id: this.$route.query.id
          }
        });
      }
    },
    //第一次监控时间改变事件
    changeTime1(val) {
      this.form.timingSecond = "";
      this.form.timingThird = "";
      this.form.timingFourth = "";
      this.form.timingFifth = "";
      this.form.timingSixth = "";
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
      this.form.timingThird = "";
      this.form.timingFourth = "";
      this.form.timingFifth = "";
      this.form.timingSixth = "";
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
      this.form.timingFourth = "";
      this.form.timingFifth = "";
      this.form.timingSixth = "";
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
      this.form.timingFifth = "";
      this.form.timingSixth = "";
      this.disabledTime6 = true;
      if (val) {
        this.disabledTime5 = false;
      } else {
        this.disabledTime5 = true;
      }
    },
    //第五次监控时间改变事件
    changeTime5(val) {
      this.form.timingSixth = "";
      if (val) {
        this.disabledTime6 = false;
      } else {
        this.disabledTime6 = true;
      }
    },
    //设置是否为为必填
    requiredList(name, type) {
      if (type == 1) {
        this.rules[name].forEach(item => {
          if (item.required) {
            item.required = "true";
          }
        });
      } else {
        this.rules[name].forEach(item => {
          if (item.required) {
            item.required = "false";
          }
        });
      }
    },
    //获取详细信息
    async getDetailInfo() {
      const id = this.$route.query.id;
      const self = this;
      const res = await self.$api.cityAccountRiskDetail({
        data: {
          businessKey: id
        }
      });
      if (res && res.code == 0) {
        this.insId=res.data.insIdArray
        if (res.data.timingFifth) {
          this.disabledTime6 = false;
        }
        if (res.data.timingFirst) {
          this.disabledTime2 = false;
        }
        if (res.data.timingSecond) {
          this.disabledTime3 = false;
        }
        if (res.data.timingThird) {
          this.disabledTime4 = false;
        }
        if (res.data.timingFourth) {
          this.disabledTime5 = false;
        }
        let data = res;
        // 需要把百分制金额 除于 100 的字段
        let moneyArray = [
          "highestRechargeAmountOrdinary",
          "highestRechargeAmountSerious",
          "highestRechargeAmountMajor",
          "minimumRechargeAmountOrdinary",
          "minimumRechargeAmountSerious",
          "minimumRechargeAmountMajor",
          "highestWithdrawAmountOrdinary",
          "highestWithdrawAmountSerious",
          "highestWithdrawAmountMajor",
          "highestPaymentAmountOrdinary",
          "highestPaymentAmountSerious",
          "highestPaymentAmountMajor",
          "minimumPaymentAmountOrdinary",
          "minimumPaymentAmountSerious",
          "minimumPaymentAmountMajor",
          "minimumHallAccountBalanceOrdinary",
          "minimumHallAccountBalanceSerious",
          "minimumHallAccountBalanceMajor",
          "avgConsumptionAmountMinOrdinary",
          "avgConsumptionAmountMinSerious",
          "avgConsumptionAmountMinMajor"
        ];
        moneyArray.forEach(item => {
          data = this.toMoneyReal(data, item);
        });
        this.form = data.data;
        console.log(this.form)
        if (data.data.avgConsumptionAmountMinOrdinary) {
          this.showAvgConsumptionAmountMin = true;
          this.showWatchingTime = true;
          this.indexValue = 7;
          this.avgConsumptionAmountMinList.forEach(item => {
            this.requiredList(item, 1);
          });
        } else if (data.data.highestRechargeAmountOrdinary) {
          this.showHighestRechargeAmount = true;
          this.showWatchingPc = true;
          this.indexValue = 1;
          this.highestRechargeAmountList.forEach(item => {
            this.requiredList(item, 1);
          });
        } else if (data.data.highestPaymentAmountOrdinary) {
          this.showHighestPaymentAmount = true;
          this.showWatchingPc = true;
          this.indexValue = 5;
          this.highestPaymentAmountList.forEach(item => {
            this.requiredList(item, 1);
          });
        } else if (data.data.highestWithdrawAmountOrdinary) {
          this.showHighestWithdrawAmount = true;
          this.showWatchingPc = true;
          this.indexValue = 3;
          this.highestWithdrawAmountList.forEach(item => {
            this.requiredList(item, 1);
          });
        } else if (data.data.minimumHallAccountBalanceOrdinary) {
          this.showMinimumHallAccountBalance = true;
          this.showWatchingTime = true;
          this.indexValue = 6;
          this.minimumHallAccountBalanceList.forEach(item => {
            this.requiredList(item, 1);
          });
        } else if (data.data.minimumPaymentAmountOrdinary) {
          this.showMinimumPaymentAmount = true;
          this.showWatchingTime = true;
          this.indexValue = 4;
          this.minimumPaymentAmountList.forEach(item => {
            this.requiredList(item, 1);
          });
        } else if (data.data.minimumRechargeAmountOrdinary) {
          this.showMinimumRechargeAmount = true;
          this.showWatchingTime = true;
          this.indexValue = 2;
          this.minimumRechargeAmountList.forEach(item => {
            this.requiredList(item, 1);
          });
        }
      }
    },
    //金额相关字段/100
    toMoneyReal(data, val) {
      for (let key in data) {
        if (typeof data[key] == "object") {
          if (data[key][val]) {
            data[key][val] = data[key][val] / 100;
          }
        }
        if (Array.isArray(data[key])) {
          data[key].forEach(item => {
            if (item[val]) {
              item[val] = item[val] / 100;
            }
          });
        }
      }
      return data;
    },
     //递归绑定机构树
    async queryInsTree() {
      let res = await this.$api.queryInsTree();
      if (res && res.code == 0) {
        this.setLabelAndValue(res.data);
      }
    },
    setLabelAndValue(area) {
      area.forEach(item => {
        item.value=item.id
        item.label=item.text
        if (item.children) {
          this.setLabelAndValue(item.children);
        }
      });
      this.insTreeList=area    
    },

  },
  created() {
    
  },mounted() {
    this.getDetailInfo();
    this.queryInsTree()
  },
};
</script>

<style lang='less' scoped>
@import "./less/index.less";
</style>
