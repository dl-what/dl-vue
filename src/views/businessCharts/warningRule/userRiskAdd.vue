<template>
  <div class="vlt-card">
    <h3 class="headling">用户风险指标新增</h3>
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

        <span class="game">类型:</span>
        <el-select v-model="typeValue" size="small" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          ></el-option>
        </el-select>
      </p>

      <div class="fits">
        <div class="showbox">
          <h2>指标配置</h2>
          <p>
            <span>指标选择</span>
            <el-select
              size="small"
              @change="selectChange"
              filterable
              v-model="indexValue"
              placeholder="请选择"
            >
              <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              ></el-option>
            </el-select>
          </p>
          <div class="formsTable">
            <p class="tipsPosition">
              用户风险告警于每日凌晨匹配一次
              数值达到对应风险指标值即为触发
              <span class="tips">*</span>
              <span class="black">为必填项</span>
            </p>

            <div class="llll">
              <p>告警等级</p>
            </div>
            <el-form
              label-position="left"
              ref="form"
              :rules="rules"
              :model="form"
              style="width:100%"
            >
              <div class="riskForm">
                <div class="editfrom inputsWidth" v-show="showBetWarnCount">
                  <el-form-item label="Ⅲ级" prop="betWarnCountOrdinary">
                    <el-input show-word-limit maxlength="9" v-model="form.betWarnCountOrdinary"></el-input>
                    <span>次</span>
                  </el-form-item>
                  <el-form-item label="Ⅱ级" prop="betWarnCountSerious">
                    <el-input show-word-limit maxlength="9" v-model="form.betWarnCountSerious"></el-input>
                    <span>次</span>
                  </el-form-item>
                  <el-form-item label="Ⅰ级" prop="betWarnCountMajor">
                    <el-input show-word-limit maxlength="9" v-model="form.betWarnCountMajor"></el-input>
                    <span>次</span>
                  </el-form-item>
                </div>
                <div class="editfrom inputsWidth" v-show="showRechargeWarnCount">
                  <el-form-item label="Ⅲ级" prop="rechargeWarnCountOrdinary">
                    <el-input
                      show-word-limit
                      maxlength="9"
                      v-model="form.rechargeWarnCountOrdinary"
                    ></el-input>
                    <span>次</span>
                  </el-form-item>
                  <el-form-item label="Ⅱ级" prop="rechargeWarnCountSerious">
                    <el-input show-word-limit maxlength="9" v-model="form.rechargeWarnCountSerious"></el-input>
                    <span>次</span>
                  </el-form-item>
                  <el-form-item label="Ⅰ级" prop="rechargeWarnCountMajor">
                    <el-input show-word-limit maxlength="9" v-model="form.rechargeWarnCountMajor"></el-input>
                    <span>次</span>
                  </el-form-item>
                </div>
                <div class="editfrom inputsWidth" v-show="showBetDurationWarnCount">
                  <el-form-item label="Ⅲ级" prop="betDurationWarnCountOrdinary">
                    <el-input
                      show-word-limit
                      maxlength="9"
                      v-model="form.betDurationWarnCountOrdinary"
                    ></el-input>
                    <span>次</span>
                  </el-form-item>
                  <el-form-item label="Ⅱ级" prop="betDurationWarnCountSerious">
                    <el-input
                      show-word-limit
                      maxlength="9"
                      v-model="form.betDurationWarnCountSerious"
                    ></el-input>
                    <span>次</span>
                  </el-form-item>
                  <el-form-item label="Ⅰ级" prop="betDurationWarnCountMajor">
                    <el-input
                      show-word-limit
                      maxlength="9"
                      v-model="form.betDurationWarnCountMajor"
                    ></el-input>
                    <span>次</span>
                  </el-form-item>
                </div>
                <div class="editfrom inputsWidth" v-show="showBetAstrictCount">
                  <el-form-item label="Ⅲ级" prop="betAstrictCountOrdinary">
                    <el-input show-word-limit maxlength="9" v-model="form.betAstrictCountOrdinary"></el-input>
                    <span>次</span>
                  </el-form-item>
                  <el-form-item label="Ⅱ级" prop="betAstrictCountSerious">
                    <el-input show-word-limit maxlength="9" v-model="form.betAstrictCountSerious"></el-input>
                    <span>次</span>
                  </el-form-item>
                  <el-form-item label="Ⅰ级" prop="betAstrictCountMajor">
                    <el-input show-word-limit maxlength="9" v-model="form.betAstrictCountMajor"></el-input>
                    <span>次</span>
                  </el-form-item>
                </div>
                <div class="editfrom inputsWidth" v-show="showRechargeAstrictCount">
                  <el-form-item label="Ⅲ级" prop="rechargeAstrictCountOrdinary">
                    <el-input
                      show-word-limit
                      maxlength="9"
                      v-model="form.rechargeAstrictCountOrdinary"
                    ></el-input>
                    <span>次</span>
                  </el-form-item>
                  <el-form-item label="Ⅱ级" prop="rechargeAstrictCountSerious">
                    <el-input
                      show-word-limit
                      maxlength="9"
                      v-model="form.rechargeAstrictCountSerious"
                    ></el-input>
                    <span>次</span>
                  </el-form-item>
                  <el-form-item label="Ⅰ级" prop="rechargeAstrictCountMajor">
                    <el-input
                      show-word-limit
                      maxlength="9"
                      v-model="form.rechargeAstrictCountMajor"
                    ></el-input>
                    <span>次</span>
                  </el-form-item>
                </div>
                <div class="editfrom inputsWidth" v-show="showBetDurationAstrictCount">
                  <el-form-item label="Ⅲ级" prop="betDurationAstrictCountOrdinary">
                    <el-input
                      show-word-limit
                      maxlength="9"
                      v-model="form.betDurationAstrictCountOrdinary"
                    ></el-input>
                    <span>次</span>
                  </el-form-item>
                  <el-form-item label="Ⅱ级" prop="betDurationAstrictCountSerious">
                    <el-input
                      show-word-limit
                      maxlength="9"
                      v-model="form.betDurationAstrictCountSerious"
                    ></el-input>
                    <span>次</span>
                  </el-form-item>
                  <el-form-item label="Ⅰ级" prop="betDurationAstrictCountMajor">
                    <el-input
                      show-word-limit
                      maxlength="9"
                      v-model="form.betDurationAstrictCountMajor"
                    ></el-input>
                    <span>次</span>
                  </el-form-item>
                </div>
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
      <el-button type="primary" v-prevent="1000" @click="onSubmit">立即创建</el-button>
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
      props: {
        value: "id",
        label: "text"
      },
      currentList: {},
      options1: [
        {
          value: 1,
          label: "投注警告用户数",
          disabled: false
        },
        {
          value: 2,
          label: "充值警告用户数",
          disabled: false
        },
        {
          value: 3,
          label: "投注时长警告用户数",
          disabled: false
        },
        {
          value: 4,
          label: "投注限制用户数",
          disabled: false
        },
        {
          value: 5,
          label: "充值限制用户数",
          disabled: false
        },
        {
          value: 6,
          label: "投注时长限制用户数",
          disabled: false
        }
      ],
      showInformTable: true,
      insTreeList: null,
      insId: [],
      indexValue: null, //指标配置
      showWatchingPc: true,
      showBetWarnCount: false,
      showRechargeWarnCount: false,
      showBetDurationWarnCount: false,
      showBetAstrictCount: false,
      showRechargeAstrictCount: false,
      showBetDurationAstrictCount: false,
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
      options: [
        {
          label: "投注卡",
          value: 1
        },
        {
          label: "会员",
          value: 2
        }
      ],
      showtips1: true,
      typeValue: null,
      areaValue: null,
      type: null,
      form: {
        type: 1,
        collectFrequency: "", //采集间隔(单位：分钟) 传入15，表示15分钟匹配一次
        collectStatus: 0, //0生效 1停止
        rechargeWarnCountMajor: "", //最高返奖率-Ⅰ级级别
        rechargeWarnCountOrdinary: "", //最高返奖率-Ⅲ级级别
        rechargeWarnCountSerious: "", //最高返奖率-Ⅱ级级别
        betWarnCountMajor: "", //最低返奖率-Ⅰ级级别
        betWarnCountOrdinary: "", //最低返奖率-Ⅲ级级别
        betWarnCountSerious: "", //最低返奖率-Ⅱ级级别
        betAstrictCountMajor: "",
        betAstrictCountOrdinary: "",
        betAstrictCountSerious: "",
        betDurationWarnCountMajor: "",
        betDurationWarnCountOrdinary: "",
        betDurationWarnCountSerious: "",
        rechargeAstrictCountMajor: "",
        rechargeAstrictCountOrdinary: "",
        rechargeAstrictCountSerious: "",
        betDurationAstrictCountMajor: "",
        betDurationAstrictCountOrdinary: "",
        betDurationAstrictCountSerious: ""
      },
      rechargeWarnCountList: [
        "rechargeWarnCountMajor",
        "rechargeWarnCountOrdinary",
        "rechargeWarnCountSerious"
      ],
      betWarnCountList: [
        "betWarnCountMajor",
        "betWarnCountOrdinary",
        "betWarnCountSerious"
      ],
      betAstrictCountList: [
        "betAstrictCountMajor",
        "betAstrictCountOrdinary",
        "betAstrictCountSerious"
      ],
      betDurationWarnCountList: [
        "betDurationWarnCountMajor",
        "betDurationWarnCountOrdinary",
        "betDurationWarnCountSerious"
      ],
      rechargeAstrictCountList: [
        "rechargeAstrictCountMajor",
        "rechargeAstrictCountOrdinary",
        "rechargeAstrictCountSerious"
      ],
      betDurationAstrictCountList: [
        "betDurationAstrictCountOrdinary",
        "betDurationAstrictCountSerious",
        "betDurationAstrictCountMajor"
      ],
      rules: {
        betWarnCountOrdinary: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          }
        ],
        betWarnCountSerious: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          }
        ],
        betWarnCountMajor: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          }
        ],
        rechargeWarnCountOrdinary: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          }
        ],
        rechargeWarnCountSerious: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          }
        ],
        rechargeWarnCountMajor: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          }
        ],

        betAstrictCountMajor: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          }
        ],
        betAstrictCountOrdinary: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          }
        ],
        betAstrictCountSerious: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          }
        ],

        betDurationWarnCountMajor: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          }
        ],
        betDurationWarnCountOrdinary: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          }
        ],
        betDurationWarnCountSerious: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          }
        ],
        rechargeAstrictCountMajor: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          }
        ],
        rechargeAstrictCountOrdinary: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          }
        ],
        rechargeAstrictCountSerious: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          }
        ],
        betDurationAstrictCountMajor: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          }
        ],
        betDurationAstrictCountOrdinary: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          }
        ],
        betDurationAstrictCountSerious: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          }
        ]
      },
      area: []
    };
  },
  methods: {
    handleChange(value) {},
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.userRiskInsert(this.$refs.table.dataInform);
        }
      });
    },
    //取消返回列表页面
    gotoList() {
      this.$router.push({
        name: "userRisk"
      });
    },
    //游戏风险指标新增
    async userRiskInsert(propsData) {
      const id = this.$route.query.id;
      const self = this;
      if (this.insId.length == 0 && this.addType !== 1) {
        this.$message.warning(`请选择所属机构`);
        return;
      }
      console.log(this.areaValue);
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
        const res = await self.$api.userRiskInsert({
          data: {
            insId: this.insId ? this.insId[this.insId.length - 1] : "",
            indexType: this.indexValue,
            collectFrequency: this.form.collectFrequency,
            collectStatus: this.form.collectStatus,
            rechargeWarnCountMajor: this.form.rechargeWarnCountMajor,
            rechargeWarnCountOrdinary: this.form.rechargeWarnCountOrdinary,
            rechargeWarnCountSerious: this.form.rechargeWarnCountSerious,
            betWarnCountMajor: this.form.betWarnCountMajor,
            betWarnCountOrdinary: this.form.betWarnCountOrdinary,
            betWarnCountSerious: this.form.betWarnCountSerious,
            betDurationWarnCountMajor: this.form.betDurationWarnCountMajor,
            betDurationWarnCountSerious: this.form.betDurationWarnCountSerious,
            betDurationWarnCountOrdinary: this.form
              .betDurationWarnCountOrdinary,
            rechargeAstrictCountMajor: this.form.rechargeAstrictCountMajor,
            rechargeAstrictCountOrdinary: this.form
              .rechargeAstrictCountOrdinary,
            rechargeAstrictCountSerious: this.form.rechargeAstrictCountSerious,
            betAstrictCountMajor: this.form.betAstrictCountMajor,
            betAstrictCountOrdinary: this.form.betAstrictCountOrdinary,
            betAstrictCountSerious: this.form.betAstrictCountSerious,

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
            informManThIdMajor: propsData.people9[1],
            betDurationAstrictCountMajor: this.form
              .betDurationAstrictCountMajor,
            betDurationAstrictCountOrdinary: this.form
              .betDurationAstrictCountOrdinary,
            betDurationAstrictCountSerious: this.form
              .betDurationAstrictCountSerious,
            type: this.typeValue
          },
          message: "新增成功"
        });
        if (res && res.code == 0) {
          this.$router.push({
            name: "userRiskDetail",
            query: {
              id: res.data.businessKey
            }
          });
        }
      } else {
        const res = await self.$api.userBatchInsert({
          data: {
            indexType: this.indexValue,
            batchIdentify: this.areaValue,
            collectFrequency: this.form.collectFrequency,
            collectStatus: this.form.collectStatus,
            rechargeWarnCountMajor: this.form.rechargeWarnCountMajor,
            rechargeWarnCountOrdinary: this.form.rechargeWarnCountOrdinary,
            rechargeWarnCountSerious: this.form.rechargeWarnCountSerious,
            betWarnCountMajor: this.form.betWarnCountMajor,
            betWarnCountOrdinary: this.form.betWarnCountOrdinary,
            betWarnCountSerious: this.form.betWarnCountSerious,
            betDurationWarnCountMajor: this.form.betDurationWarnCountMajor,
            betDurationWarnCountSerious: this.form.betDurationWarnCountSerious,
            betDurationWarnCountOrdinary: this.form
              .betDurationWarnCountOrdinary,
            rechargeAstrictCountMajor: this.form.rechargeAstrictCountMajor,
            rechargeAstrictCountOrdinary: this.form
              .rechargeAstrictCountOrdinary,
            rechargeAstrictCountSerious: this.form.rechargeAstrictCountSerious,
            betAstrictCountMajor: this.form.betAstrictCountMajor,
            betAstrictCountOrdinary: this.form.betAstrictCountOrdinary,
            betAstrictCountSerious: this.form.betAstrictCountSerious,
            betDurationAstrictCountMajor: this.form
              .betDurationAstrictCountMajor,
            betDurationAstrictCountOrdinary: this.form
              .betDurationAstrictCountOrdinary,
            betDurationAstrictCountSerious: this.form
              .betDurationAstrictCountSerious,
            type: this.typeValue
          },
          message: "批量新增成功"
        });
        if (res && res.code == 0) {
          this.$router.push({
            name: "userRisk"
          });
        }
      }
    },
    insIdChange(val) {
      this.insId = val;
    },
    //递归绑定机构树
    async queryInsTree() {
      let res = await this.$api.queryInsTree();
      if (res && res.code == 0) {
        this.setLabelAndValue(res.data);
      }
    },
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
    //选择指标配置显示对应要设置的内容
    selectChange(val) {
      this.type = val;
      if (this.type) {
        if (this.type == 3) {
          this.setCurrent(
            this.betDurationWarnCountList,
            "showBetDurationWarnCount"
          );
          this.form.betDurationWarnCountOrdinary = 200;
          this.form.betDurationWarnCountSerious = 300;
          this.form.betDurationWarnCountMajor = 400;
        } else if (this.type == 4) {
          this.setCurrent(this.betAstrictCountList, "showBetAstrictCount");
          this.form.betAstrictCountOrdinary = 400;
          this.form.betAstrictCountSerious = 500;
          this.form.betAstrictCountMajor = 600;
        } else if (this.type == 5) {
          this.setCurrent(
            this.rechargeAstrictCountList,
            "showRechargeAstrictCount"
          );
          this.form.rechargeAstrictCountOrdinary = 100;
          this.form.rechargeAstrictCountSerious = 200;
          this.form.rechargeAstrictCountMajor = 300;
        } else if (this.type == 2) {
          this.setCurrent(this.rechargeWarnCountList, "showRechargeWarnCount");
          this.form.rechargeWarnCountOrdinary = 20;
          this.form.rechargeWarnCountSerious = 30;
          this.form.rechargeWarnCountMajor = 40;
        } else if (this.type == 1) {
          this.setCurrent(this.betWarnCountList, "showBetWarnCount");
          this.form.betWarnCountOrdinary = 15;
          this.form.betWarnCountSerious = 20;
          this.form.betWarnCountMajor = 25;
        } else if (this.type == 6) {
          this.setCurrent(
            this.betDurationAstrictCountList,
            "showBetDurationAstrictCount"
          );
          this.form.betDurationAstrictCountOrdinary = 115;
          this.form.betDurationAstrictCountSerious = 120;
          this.form.betDurationAstrictCountMajor = 125;
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
    //前置任务
    async predecessorTask(options) {
      //获取新增类型 1为批量新增 其他为新增
      const type = this.$route.query.type;
      if (type === 1) {
        this.addType = 1;
      }
       //设置默认指标存储浏览器
      this.currentList.show = "showBetWarnCount";
      this.currentList.obj = this.betWarnCountList;
      storage.session.set("currentList", this.currentList);
      storage.session.set("list", this.betWarnCountList);
      this.form.betWarnCountOrdinary = 15;
      this.form.betWarnCountSerious = 20;
      this.form.betWarnCountMajor = 25;
      this.indexValue = 1;
      this.showBetWarnCount = true;
      this.betWarnCountList.forEach(v => {
        this.requiredList(v, 1);
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
.tipsPosition .tips {
  margin-left: 310px !important;
}
</style>
