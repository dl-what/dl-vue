<template>
  <div class="vlt-card">
    <h3 class="headling">数量风险指标新增</h3>
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
            <p class="tipsPosition" v-show="!showtips">数值达到对应风险指标值即为触发</p>
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
                <div class="editfrom inputsWidth" v-show="showHighestReturnCardNum">
                  <el-form-item label="Ⅲ级" prop="highestReturnCardNumOrdinary">
                    <el-input
                      show-word-limit
                      maxlength="4"
                      :disabled="disabled"
                      v-model="form.highestReturnCardNumOrdinary"
                    ></el-input>
                    <span>张</span>
                  </el-form-item>
                  <el-form-item label="Ⅱ级" prop="highestReturnCardNumSerious">
                    <el-input
                      show-word-limit
                      maxlength="4"
                      :disabled="disabled"
                      v-model="form.highestReturnCardNumSerious"
                    ></el-input>
                    <span>张</span>
                  </el-form-item>
                  <el-form-item label="Ⅰ级" prop="highestReturnCardNumMajor">
                    <el-input
                      show-word-limit
                      maxlength="4"
                      :disabled="disabled"
                      v-model="form.highestReturnCardNumMajor"
                    ></el-input>
                    <span>张</span>
                  </el-form-item>
                </div>
                <div class="editfrom inputsWidth" v-show="showMinimumOpenCardNum">
                  <el-form-item label="Ⅲ级" prop="minimumOpenCardNumOrdinary">
                    <el-input
                      show-word-limit
                      maxlength="4"
                      v-model="form.minimumOpenCardNumOrdinary"
                    ></el-input>
                    <span>张</span>
                  </el-form-item>
                  <el-form-item label="Ⅱ级" prop="minimumOpenCardNumSerious">
                    <el-input
                      show-word-limit
                      maxlength="4"
                      v-model="form.minimumOpenCardNumSerious"
                    ></el-input>
                    <span>张</span>
                  </el-form-item>
                  <el-form-item label="Ⅰ级" prop="minimumOpenCardNumMajor">
                    <el-input show-word-limit maxlength="4" v-model="form.minimumOpenCardNumMajor"></el-input>
                    <span>张</span>
                  </el-form-item>
                </div>

                <div class="editfrom inputsWidth" v-show="showMinimumOnlineNum">
                  <el-form-item label="Ⅲ级" prop="minimumOnlineNumOrdinary">
                    <el-input show-word-limit maxlength="4" v-model="form.minimumOnlineNumOrdinary"></el-input>
                    <span>台</span>
                  </el-form-item>
                  <el-form-item label="Ⅱ级" prop="minimumOnlineNumSerious">
                    <el-input show-word-limit maxlength="4" v-model="form.minimumOnlineNumSerious"></el-input>
                    <span>台</span>
                  </el-form-item>
                  <el-form-item label="Ⅰ级" prop="minimumOnlineNumMajor">
                    <el-input show-word-limit maxlength="4" v-model="form.minimumOnlineNumMajor"></el-input>
                    <span>台</span>
                  </el-form-item>
                </div>
                <div class="editfrom inputsWidth" v-show="showMinimumOperatingRate">
                  <el-form-item label="Ⅲ级" prop="minimumOperatingRateOrdinary">
                    <el-input
                      show-word-limit
                      maxlength="2"
                      v-model="form.minimumOperatingRateOrdinary"
                    ></el-input>
                    <span>%</span>
                  </el-form-item>
                  <el-form-item label="Ⅱ级" prop="minimumOperatingRateSerious">
                    <el-input
                      show-word-limit
                      maxlength="2"
                      v-model="form.minimumOperatingRateSerious"
                    ></el-input>
                    <span>%</span>
                  </el-form-item>
                  <el-form-item label="Ⅰ级" prop="minimumOperatingRateMajor">
                    <el-input
                      show-word-limit
                      maxlength="2"
                      v-model="form.minimumOperatingRateMajor"
                    ></el-input>
                    <span>%</span>
                  </el-form-item>
                </div>
              </div>
              <div class="editfrom watchingTime" v-show="showWatchingTime">
                <el-form-item prop label="第一次监控时间">
                  <el-time-select
                    placeholder="选择时间"
                    v-model="timingFirst"
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
                    v-model="timingSecond"
                    :disabled="disabledTime2"
                    :picker-options="{
                      start: timingFirst,
                      step: '00:15',
                      end: '23:30',
                      minTime: timingFirst,
                      
                    }"
                    @change="changeTime2"
                  ></el-time-select>
                </el-form-item>
                <el-form-item prop label="第三次监控时间">
                  <el-time-select
                    placeholder="选择时间"
                    v-model="timingThird"
                    :disabled="disabledTime3"
                    :picker-options="{
                start: timingSecond,
                step: '00:15',
                end: '23:30',
                minTime: timingSecond,
              }"
                    @change="changeTime3"
                  ></el-time-select>
                </el-form-item>
                <el-form-item prop label="第四次监控时间">
                  <el-time-select
                    placeholder="选择时间"
                    v-model="timingFourth"
                    :disabled="disabledTime4"
                    :picker-options="{
                start: timingThird,
                step: '00:15',
                end: '23:30',
                minTime: timingThird,
                
              }"
                    @change="changeTime4"
                  ></el-time-select>
                </el-form-item>

                <el-form-item prop label="第五次监控时间">
                  <el-time-select
                    placeholder="选择时间"
                    v-model="timingFifth"
                    :disabled="disabledTime5"
                    :picker-options="{
                start: timingFourth,
                step: '00:15',
                end: '23:30',
                minTime: timingFourth,              
              }"
                    @change="changeTime5"
                  ></el-time-select>
                </el-form-item>
                <el-form-item prop label="第六次监控时间">
                  <el-time-select
                    placeholder="选择时间"
                    v-model="timingSixth"
                    :disabled="disabledTime6"
                    :picker-options="{
                start: timingFifth,
                step: '00:15',
                end: '23:30',
                minTime: timingFifth
              }"
                  ></el-time-select>
                </el-form-item>
                <p class="tips">
                  <span class="xing">*</span>为必填项
                </p>
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
                  <p class="tip" v-show="!showtips">
                    <span class="xing">*</span>为必填项
                  </p>
                  <p class="tip" v-show="showtips">
                    <span class="xing">指标已全部设置完毕</span>
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
  name: "cityRiskAdd",
  components: { informTable },
  data() {
    return {
      indexValue: null, //指标配置
      props: {
        value: "id",
        label: "text"
      },
      indexList: [
        {
          value: 1,
          label: "最高退卡数量",
          disabled: false
        },
        {
          value: 2,
          label: "最低开卡数量",
          disabled: false
        },
        {
          value: 3,
          label: "最低在线数量",
          disabled: false
        },
        {
          value: 4,
          label: "最低开机率",
          disabled: false
        }
      ],
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
      informObj: [],
      insId: [],
      insIdList: null,
      showHighestReturnCardNum: false,
      showMinimumOperatingRate: false,
      showMinimumOnlineNum: false,
      showMinimumOpenCardNum: false,
      insTreeList: [],
      showWatchingTime: false,
      showWatchingPc: false,
      timingSecond: "",
      timingFirst: "",
      timingThird: "",
      timingFourth: "",
      timingFifth: "",
      timingSixth: "",
      showtips: false,
      disabled: false,
      num: 10,
      type: null,
      disabledTime2: true,
      disabledTime3: true,
      disabledTime4: true,
      disabledTime5: true,
      disabledTime6: true,
      optionsArea: [],
      area: [],
      form: {
        type: 1,
        collectFrequency: 0, //采集间隔(单位：分钟) 传入15，表示15分钟匹配一次
        collectStatus: 0, //0生效 1停止
        highestReturnCardNumMajor: "", //
        highestReturnCardNumSerious: "", //最高退卡-普通级别
        highestReturnCardNumOrdinary: "", //最低返奖率-Ⅱ级级别
        minimumOnlineNumOrdinary: "", //最低在线-Ⅰ级级别
        minimumOnlineNumSerious: "", //最低在线-普通级别
        minimumOnlineNumMajor: "", //最低在线-Ⅱ级级别
        minimumOperatingRateMajor: "", //最低开机-Ⅰ级级别
        minimumOperatingRateSerious: "", //最低开机-普通级别
        minimumOperatingRateOrdinary: "", //最低开机-Ⅱ级级别
        minimumOpenCardNumMajor: "", //最低退卡-Ⅱ级级别
        minimumOpenCardNumOrdinary: "", //最低退卡-Ⅱ级级别
        minimumOpenCardNumSerious: "" //最低退卡-Ⅱ级级别
      },
      minimumOperatingRateList: [
        "minimumOperatingRateMajor",
        "minimumOperatingRateSerious",
        "minimumOperatingRateOrdinary"
      ],
      minimumOpenCardNumList: [
        "minimumOpenCardNumMajor",
        "minimumOpenCardNumOrdinary",
        "minimumOpenCardNumSerious"
      ],
      minimumOnlineNumList: [
        "minimumOnlineNumOrdinary",
        "minimumOnlineNumSerious",
        "minimumOnlineNumMajor"
      ],
      //比较大小
      highestReturnCardList: [
        "highestReturnCardNumMajor",
        "highestReturnCardNumSerious",
        "highestReturnCardNumOrdinary"
      ],
      rules: {
        highestReturnCardNumOrdinary: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          }
        ],
        highestReturnCardNumSerious: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          }
        ],
        highestReturnCardNumMajor: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          }
        ],
        minimumOperatingRateMajor: [
          {
            validator: rules.unDAmounts,
            trigger: ["blur", "change"],
            required: "false"
          }
        ],
        minimumOperatingRateOrdinary: [
          {
            validator: rules.unDAmounts,
            trigger: ["blur", "change"],
            required: "false"
          }
        ],
        minimumOperatingRateSerious: [
          {
            validator: rules.unDAmounts,
            trigger: ["blur", "change"],
            required: "false"
          }
        ],

        minimumOnlineNumOrdinary: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          }
        ],
        minimumOnlineNumSerious: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          }
        ],
        minimumOnlineNumMajor: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          }
        ],
        minimumOpenCardNumOrdinary: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          }
        ],
        minimumOpenCardNumSerious: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          }
        ],
        minimumOpenCardNumMajor: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          }
        ]
      }
    };
  },
  methods: {
    //返回数量风险列表
    gotoList() {
      this.$router.push({ name: "cityNumberRisk" });
    },
    //获取机构id
    insIdChange(val) {
      this.insId = val;
    },
    //提交
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.cityNumberRiskInsert(this.$refs.table.dataInform);
        }
      });
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
    //表格选择指标配置显示对应要设置的内容
    selectChange(val) {
      this.type = val;
      if (this.type) {
        if (this.type == 1) {
          this.$refs.form.resetFields();
          this.showHighestReturnCardNum = true;
          this.showMinimumOperatingRate = false;
          this.showMinimumOnlineNum = false;
          this.showMinimumOpenCardNum = false;
          this.showWatchingTime = false;
          this.showWatchingPc = true;
          this.form.highestReturnCardNumOrdinary = 4000;
          this.form.highestReturnCardNumSerious = 5000;
          this.form.highestReturnCardNumMajor = 6000;
          this.highestReturnCardList.forEach(v => {
            this.requiredList(v, 1);
          });
          this.minimumOperatingRateList.forEach(v => {
            this.requiredList(v, 0);
          });
          this.minimumOnlineNumList.forEach(v => {
            this.requiredList(v, 0);
          });
          this.minimumOpenCardNumList.forEach(v => {
            this.requiredList(v, 0);
          });
        } else if (this.type == 2) {
          this.$refs.form.resetFields();
          this.showHighestReturnCardNum = false;
          this.showMinimumOperatingRate = false;
          this.showMinimumOnlineNum = false;
          this.showMinimumOpenCardNum = true;
          this.showWatchingTime = true;
          this.showWatchingPc = false;
          this.form.minimumOpenCardNumOrdinary = 300;
          this.form.minimumOpenCardNumSerious = 200;
          this.form.minimumOpenCardNumMajor = 100;
          this.highestReturnCardList.forEach(v => {
            this.requiredList(v, 0);
          });
          this.minimumOperatingRateList.forEach(v => {
            this.requiredList(v, 0);
          });
          this.minimumOnlineNumList.forEach(v => {
            this.requiredList(v, 0);
          });
          this.minimumOpenCardNumList.forEach(v => {
            this.requiredList(v, 1);
          });
        } else if (this.type == 3) {
          this.$refs.form.resetFields();
          this.showHighestReturnCardNum = false;
          this.showMinimumOperatingRate = false;
          this.showMinimumOnlineNum = true;
          this.showMinimumOpenCardNum = false;
          this.showWatchingTime = true;
          this.showWatchingPc = false;
          this.form.minimumOnlineNumOrdinary = 300;
          this.form.minimumOnlineNumSerious = 200;
          this.form.minimumOnlineNumMajor = 100;
          this.highestReturnCardList.forEach(v => {
            this.requiredList(v, 0);
          });
          this.minimumOperatingRateList.forEach(v => {
            this.requiredList(v, 0);
          });
          this.minimumOnlineNumList.forEach(v => {
            this.requiredList(v, 1);
          });
          this.minimumOpenCardNumList.forEach(v => {
            this.requiredList(v, 0);
          });
        } else {
          this.$refs.form.resetFields();
          this.showHighestReturnCardNum = false;
          this.showMinimumOperatingRate = true;
          this.showMinimumOnlineNum = false;
          this.showMinimumOpenCardNum = false;
          this.showWatchingTime = true;
          this.showWatchingPc = false;
          this.form.minimumOperatingRateOrdinary = 30;
          this.form.minimumOperatingRateSerious = 20;
          this.form.minimumOperatingRateMajor = 10;
          this.highestReturnCardList.forEach(v => {
            this.requiredList(v, 0);
          });
          this.minimumOperatingRateList.forEach(v => {
            this.requiredList(v, 1);
          });
          this.minimumOnlineNumList.forEach(v => {
            this.requiredList(v, 0);
          });
          this.minimumOpenCardNumList.forEach(v => {
            this.requiredList(v, 0);
          });
        }
      }
    },
    //金额风险指标新增
    async cityNumberRiskInsert(propsData) {
      const self = this;
      if (this.insId.length == 0 && this.addType !== 1) {
        this.$message.warning(`请选择所属机构`);
        return;
      }
      if (!this.areaValue && this.addType === 1) {
        this.$message.warning(`请选择维度`);
        return;
      }
      if (!this.timingFirst && this.showWatchingTime == true) {
        this.$message.warning(`请至少选择一次监控时间`);
        return;
      }
      if (this.addType !== 1) {
        var flag = informs.checkInformPeople(propsData);
        if (flag === true) {
        } else {
          this.$message.warning(flag);
          return;
        }
        const res = await self.$api.cityNumberRiskInsert({
          data: {
            insId: this.insId ? this.insId[this.insId.length - 1] : "",
            indexType: this.indexValue,
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
            informWayMajor: propsData.informWayMajor,
            informWayOrdinary: propsData.informWayOrdinary,
            informWaySerious: propsData.informWaySerious,
            highestReturnCardNumMajor: this.form.highestReturnCardNumMajor,
            highestReturnCardNumOrdinary: this.form
              .highestReturnCardNumOrdinary,
            highestReturnCardNumSerious: this.form.highestReturnCardNumSerious,
            minimumOperatingRateMajor: informs.conventToPoint(
              this.form.minimumOperatingRateMajor
            ),
            minimumOperatingRateOrdinary: informs.conventToPoint(
              this.form.minimumOperatingRateOrdinary
            ),
            minimumOperatingRateSerious: informs.conventToPoint(
              this.form.minimumOperatingRateSerious
            ),

            minimumOnlineNumMajor: this.form.minimumOnlineNumMajor,
            minimumOnlineNumOrdinary: this.form.minimumOnlineNumOrdinary,
            minimumOnlineNumSerious: this.form.minimumOnlineNumSerious,
            minimumOpenCardNumMajor: this.form.minimumOpenCardNumMajor,
            minimumOpenCardNumOrdinary: this.form.minimumOpenCardNumOrdinary,
            minimumOpenCardNumSerious: this.form.minimumOpenCardNumSerious,

            timingFirst: this.timingFirst,
            timingSecond: this.timingSecond,
            timingThird: this.timingThird,
            timingFourth: this.timingFourth,
            timingFifth: this.timingFifth,
            timingSixth: this.timingSixth
          },
          message: "新增成功"
        });
        if (res && res.code == 0) {
          this.$router.push({
            name: "cityNumberRiskDetail",
            query: {
              id: res.data.businessKey
            }
          });
        }
      } else {
        const res = await self.$api.numberBatchInsert({
          data: {
            batchIdentify: this.areaValue,
            indexType: this.indexValue,
            collectFrequency:
              this.showWatchingTime == true ? null : this.form.collectFrequency,
            collectStatus: this.form.collectStatus,
            highestReturnCardNumMajor: this.form.highestReturnCardNumMajor,
            highestReturnCardNumOrdinary: this.form
              .highestReturnCardNumOrdinary,
            highestReturnCardNumSerious: this.form.highestReturnCardNumSerious,
            minimumOperatingRateMajor: informs.conventToPoint(
              this.form.minimumOperatingRateMajor
            ),
            minimumOperatingRateOrdinary: informs.conventToPoint(
              this.form.minimumOperatingRateOrdinary
            ),
            minimumOperatingRateSerious: informs.conventToPoint(
              this.form.minimumOperatingRateSerious
            ),

            minimumOnlineNumMajor: this.form.minimumOnlineNumMajor,
            minimumOnlineNumOrdinary: this.form.minimumOnlineNumOrdinary,
            minimumOnlineNumSerious: this.form.minimumOnlineNumSerious,
            minimumOpenCardNumMajor: this.form.minimumOpenCardNumMajor,
            minimumOpenCardNumOrdinary: this.form.minimumOpenCardNumOrdinary,
            minimumOpenCardNumSerious: this.form.minimumOpenCardNumSerious,

            timingFirst: this.timingFirst,
            timingSecond: this.timingSecond,
            timingThird: this.timingThird,
            timingFourth: this.timingFourth,
            timingFifth: this.timingFifth,
            timingSixth: this.timingSixth
          },
          message: "批量新增成功"
        });
        if (res && res.code == 0) {
          this.$router.push({
            name: "cityNumberRisk"
          });
        }
      }
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
    //设置默认指标存储浏览器
    predecessorTask() {
      const type = this.$route.query.type;
      if (type === 1) {
        this.addType = 1;
      }
      this.showHighestReturnCardNum = true;
      this.showWatchingPc = true;
      this.indexValue = 1;
      this.form.highestReturnCardNumOrdinary = 4000;
      this.form.highestReturnCardNumSerious = 5000;
      this.form.highestReturnCardNumMajor = 6000;
      this.highestReturnCardList.forEach(v => {
        this.requiredList(v, 1);
      });
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
    },
    //设置当前存储的指标类型
    setCurrent(item, showName) {
      this[showName] = true;
      this.$refs.form.resetFields();
      this[storage.session.get("currentList").show] = false;
      console.log(this[item]);
      item.forEach(v => {
        this.requiredList(v, 1);
      });
      storage.session.get("currentList").obj.forEach(v => {
        this.requiredList(v, 0);
      });
      this.currentList.show = showName;
      this.currentList.obj = item;
      storage.session.set("currentList", this.currentList);
    }
  },
  mounted() {
    this.predecessorTask();
    this.queryInsTree();
  }
};
</script>

<style lang='less' scoped>
@import "./less/index.less";
</style>
