<template>
  <div class="vlt-card">
    <h3 class="headling">游戏风险指标修改</h3>
    <div class="select-box">
      <p class="treename">
        <span>所属机构:</span>
         <el-cascader
        :options="insTreeList"  class="insCascader"
        :props="{ checkStrictly: true }"
        size='small'
        v-model="insId"
        disabled
        ></el-cascader>
         <span class="game">游戏:</span>
        <el-select   disabled v-model="form.gameId" size="small" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.gameId"
            :label="item.gameName"
            :value="item.gameId"         
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
              v-model="indexValue"
              placeholder="请选择"
              disabled
            >
              <el-option
                v-for="item in options1"
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
                    <el-input  show-word-limit maxlength=2  v-model="form.minimumReturnRateOrdinary"></el-input>
                    <span>%</span>
                  </el-form-item>
                  <el-form-item label="Ⅱ级" prop="minimumReturnRateSerious">
                    <el-input  show-word-limit maxlength=2  v-model="form.minimumReturnRateSerious"></el-input>
                    <span>%</span>
                  </el-form-item>
                  <el-form-item label="Ⅰ级" prop="minimumReturnRateMajor">
                    <el-input  show-word-limit maxlength=2  v-model="form.minimumReturnRateMajor"></el-input>
                    <span>%</span>
                  </el-form-item>
                </div>
                <div class="editfrom inputsWidth" v-show="showHighestReturnRate">
                  <el-form-item label="Ⅲ级" prop="highestReturnRateOrdinary">
                    <el-input  show-word-limit maxlength=2  v-model="form.highestReturnRateOrdinary"></el-input>
                    <span>%</span>
                  </el-form-item>
                  <el-form-item label="Ⅱ级" prop="highestReturnRateSerious">
                    <el-input  show-word-limit maxlength=2  v-model="form.highestReturnRateSerious"></el-input>
                    <span>%</span>
                  </el-form-item>
                  <el-form-item label="Ⅰ级" prop="highestReturnRateMajor">
                    <el-input  show-word-limit maxlength=2  v-model="form.highestReturnRateMajor"></el-input>
                    <span>%</span>
                  </el-form-item>
                </div>
                <div class="editfrom inputsWidth" v-show="showHighestBigPrizeNum">
                  <el-form-item label="Ⅲ级" prop="highestBigPrizeNumOrdinary">
                    <el-input  show-word-limit maxlength=4  v-model="form.highestBigPrizeNumOrdinary"></el-input>
                    <span>个</span>
                  </el-form-item>
                  <el-form-item label="Ⅱ级" prop="highestBigPrizeNumSerious">
                    <el-input  show-word-limit maxlength=4  v-model="form.highestBigPrizeNumSerious"></el-input>
                    <span>个</span>
                  </el-form-item>
                  <el-form-item label="Ⅰ级" prop="highestBigPrizeNumMajor">
                    <el-input  show-word-limit maxlength=4  v-model="form.highestBigPrizeNumMajor"></el-input>
                    <span>个</span>
                  </el-form-item>
                </div>
                <div class="editfrom inputsWidth" v-show="showHighestBigPrizeAmount">
                  <el-form-item label="Ⅲ级" prop="highestBigPrizeAmountOrdinary">
                    <el-input  show-word-limit maxlength=9  v-model="form.highestBigPrizeAmountOrdinary"></el-input>
                    <span>元</span>
                  </el-form-item>
                  <el-form-item label="Ⅱ级" prop="highestBigPrizeAmountSerious">
                    <el-input  show-word-limit maxlength=9  v-model="form.highestBigPrizeAmountSerious"></el-input>
                    <span>元</span>
                  </el-form-item>
                  <el-form-item label="Ⅰ级" prop="highestBigPrizeAmountMajor">
                    <el-input  show-word-limit maxlength=9  v-model="form.highestBigPrizeAmountMajor"></el-input>
                    <span>元</span>
                  </el-form-item>
                </div>
                <div class="editfrom inputsWidth" v-show="showHighestCashPrizeAmount">
                  <el-form-item label="Ⅲ级" prop="highestCashPrizeAmountOrdinary">
                    <el-input  show-word-limit maxlength=9  v-model="form.highestCashPrizeAmountOrdinary"></el-input>
                    <span>元</span>
                  </el-form-item>
                  <el-form-item label="Ⅱ级" prop="highestCashPrizeAmountSerious">
                    <el-input  show-word-limit maxlength=9  v-model="form.highestCashPrizeAmountSerious"></el-input>
                    <span>元</span>
                  </el-form-item>
                  <el-form-item label="Ⅰ级" prop="highestCashPrizeAmountMajor">
                    <el-input  show-word-limit maxlength=9  v-model="form.highestCashPrizeAmountMajor"></el-input>
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
                  ></el-input-number>
                  <span class="unit">(分钟/次)</span>
                  <p class="tip">
                   <span class="xing">*</span>为必填项
                  </p>
                </el-form-item>
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
  name: "gameRiskEdit",
  components: { informTable },
  data() {  
    return {
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
      showHighestBigPrizeNum: false,
      showHighestBigPrizeAmount: false,
      showHighestCashPrizeAmount: false,
      showMinimumReturnRate: false,
      showHighestReturnRate: false,
      showWatchingPc: true,
      props: {
        value: "id",
        label: "text"
      },
      treeName: [],
      treeNames: "",
      optionsArea: [],
      area: [],
      indexValue: null,
      options: [],
      options1: [
        {
          value: 1,
          label: "最高大奖数量"
        },
        {
          value: 2,
          label: "最高大奖金额"
        },
        {
          value: 3,
          label: "最高兑奖金额"
        },
        {
          value: 4,
          label: "最高返奖率"
        },
        {
          value: 5,
          label: "最低返奖率"
        }
      ],
      type: null,
      insTreeList:null,
      insId:null,
      form: {
        type: 2,
        collectFrequency: "", //采集间隔(单位：分钟) 传入15，表示15分钟匹配一次
        collectStatus: 0, //0生效 1停止
        gameId: "",
        gameName: "",
        minimumReturnRateMajor: "", //最低返奖率-Ⅰ级级别
        minimumReturnRateOrdinary: "", //最低返奖率-Ⅲ级级别
        minimumReturnRateSerious: "", //最低返奖率-Ⅱ级级别
        highestReturnRateSerious: "", //最高返奖率-Ⅱ级级别
        highestReturnRateMajor: "", //最高返奖率-Ⅰ级级别
        highestReturnRateOrdinary: "", //最高返奖率-Ⅰ级级别
        highestBigPrizeAmountMajor: "",
        highestBigPrizeAmountOrdinary: "",
        highestBigPrizeAmountSerious: "",
        highestBigPrizeNumMajor: "",
        highestBigPrizeNumOrdinary: "",
        highestBigPrizeNumSerious: "",
        highestCashPrizeAmountMajor: "",
        highestCashPrizeAmountOrdinary: "",
        highestCashPrizeAmountSerious: "",
      },
      rules: {
        minimumReturnRateOrdinary: [
          {
            validator: rules.unDAmounts,
            trigger: ["blur", "change"],
            required: "false"
          },
          // { validator: zdfjCompareA, trigger: ["blur", "change"] }
        ],
       minimumReturnRateSerious: [
          {
            validator: rules.unDAmounts,
            trigger: ["blur", "change"],
            required: "false"
          },
          // { validator: zdfjCompareB, trigger: ["blur", "change"] }
        ],
        minimumReturnRateMajor: [
          {
            validator: rules.unDAmounts,
            trigger: ["blur", "change"],
            required: "false"
          },
          // { validator: zdfjCompareC, trigger: ["blur", "change"] }
        ],
        highestReturnRateOrdinary: [
          {
            validator: rules.unDAmounts,
            trigger: ["blur", "change"],
            required: "false"
          },
          // { validator: zgfjCompareA, trigger: ["blur", "change"] }
        ],
        highestReturnRateSerious: [
          {
            validator: rules.unDAmounts,
            trigger: ["blur", "change"],
            required: "false"
          },
          // { validator: zgfjCompareB, trigger: ["blur", "change"] }
        ],
        highestReturnRateMajor: [
          {
            validator: rules.unDAmounts,
            trigger: ["blur", "change"],
            required: "false"
          },
          // { validator: zgfjCompareC, trigger: ["blur", "change"] }
        ],

        highestBigPrizeAmountMajor: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
          // { validator: dajjeCompareC, trigger: ["blur", "change"] }
        ],
        highestBigPrizeAmountOrdinary: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
          // { validator: dajjeCompareA, trigger: ["blur", "change"] }
        ],
        highestBigPrizeAmountSerious: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
          // { validator: dajjeCompareB, trigger: ["blur", "change"] }
        ],

        highestBigPrizeNumMajor: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            title: "大奖数量",
            required: "false"
          },
          // { validator: djslCompareC, trigger: ["blur", "change"] }
        ],
        highestBigPrizeNumOrdinary: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            title: "大奖数量",
            required: "false"
          },
          // { validator: djslCompareA, trigger: ["blur", "change"] }
        ],
        highestBigPrizeNumSerious: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            title: "大奖数量",
            required: "false"
          },
          // { validator: djslCompareB, trigger: ["blur", "change"] }
        ],
        highestCashPrizeAmountMajor: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
          // { validator: duijjeCompareC, trigger: ["blur", "change"] }
        ],
        highestCashPrizeAmountOrdinary: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
          // { validator: duijjeCompareA, trigger: ["blur", "change"] }
        ],
        highestCashPrizeAmountSerious: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
          // { validator: duijjeCompareB, trigger: ["blur", "change"] }
        ]
      }
    };
  },
  methods: {
    //修改
    onSubmit() {
       this.$refs.form.validate(valid => {
        if (valid) {
           this.gameRiskUpdate(this.$refs.table.dataInform);
        }
      });     
    },
    //取消返回列表页面
    gotoList() {
      this.$router.push({
        name: "cityGameRisk"
      });
    },
    //游戏风险指标修改
    async gameRiskUpdate(propsData) {
      var flag=informs.checkInformPeople(propsData)
      if(flag===true){      
      }else{
        this.$message.warning(flag);
        return
      }
      const self = this;
      const res = await self.$api.gameRiskUpdate({
        data: {
          businessKey: this.$route.query.id,
          gameId: this.form.gameId,
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
          highestCashPrizeAmountMajor: this.form.highestCashPrizeAmountMajor*100||null,
          highestCashPrizeAmountOrdinary: this.form
            .highestCashPrizeAmountOrdinary*100||null,
          highestCashPrizeAmountSerious: this.form
            .highestCashPrizeAmountSerious*100||null,
          highestBigPrizeAmountMajor: this.form.highestBigPrizeAmountMajor*100||null,
          highestBigPrizeAmountOrdinary: this.form
            .highestBigPrizeAmountOrdinary*100||null,
          highestBigPrizeAmountSerious: this.form.highestBigPrizeAmountSerious*100||null,
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
          timingFirst: this.form.timingFirst,
          timingSecond: this.form.timingSecond,
          timingThird: this.form.timingThird,
          timingFourth: this.form.timingFourth,
          timingFifth: this.form.timingFifth,
          timingSixth: this.form.timingSixth,
        },
        message: "修改成功"
      });
      if (res && res.code == 0) {
        this.$router.push({
          name: "gameRiskDetail",
          query: {
            id: this.$route.query.id
          }
        });
      }
    },
    
    async getGameLists(options) {
      const self = this;
      const res = await self.$api.getGameLists();
      if (res && res.code == 0) {
        this.options = res.data;
      }
    },
    //获取详细信息
    async getDetailInfo() {
      const id = this.$route.query.id;
      const self = this;
      const res = await self.$api.getGameRiskDetail({
        data: {
          businessKey: id
        }
      });
      if (res && res.code == 0) {
        this.insId=res.data.insIdArray
        let data = res;
          // 需要把百分制金额 除于 100 的字段
          let moneyArray = [
          'highestBigPrizeAmountOrdinary','highestBigPrizeAmountSerious','highestBigPrizeAmountMajor','highestCashPrizeAmountOrdinary','highestCashPrizeAmountSerious','highestCashPrizeAmountMajor',]
          moneyArray.forEach((item)=>{
            data = self.toMoneyReal(data, item)
          })
        this.form = data.data;
        this.form.gameId = data.data.gameId + "";
        if (data.data.minimumReturnRateOrdinary) {
          this.form.minimumReturnRateMajor = Math.round(
            this.form.minimumReturnRateMajor * 100
          );
          this.form.minimumReturnRateOrdinary = Math.round(
            this.form.minimumReturnRateOrdinary * 100
          );
          this.form.minimumReturnRateSerious = Math.round(
            this.form.minimumReturnRateSerious * 100
          );
          this.indexValue=5
          this.showMinimumReturnRate = true;
          this.minimumReturnRateList.forEach(v => {
            this.requiredList(v, 1);
          });
        } 

        if (data.data.highestReturnRateOrdinary) {
          this.form.highestReturnRateOrdinary = Math.round(
            this.form.highestReturnRateOrdinary * 100
          );
          this.form.highestReturnRateMajor = Math.round(
            this.form.highestReturnRateMajor * 100
          );
          this.form.highestReturnRateSerious = Math.round(
            this.form.highestReturnRateSerious * 100
          );
          this.indexValue=4
          this.showHighestReturnRate = true;
          this.highestReturnRateList.forEach(v => {
            this.requiredList(v, 1);
          });
        }
        if (data.data.highestBigPrizeNumOrdinary) {
          this.showHighestBigPrizeNum = true;
          this.indexValue=1
            this.highestBigPrizeNumList.forEach(v => {
            this.requiredList(v, 1);
          });
        }
        if (data.data.highestBigPrizeAmountOrdinary) {
          this.showHighestBigPrizeAmount = true;
          this.indexValue=2
          this.highestBigPrizeAmountList.forEach(v => {
            this.requiredList(v, 1);
          });
        }
        if (data.data.highestCashPrizeAmountOrdinary) {
          this.showHighestCashPrizeAmount = true;
          this.indexValue=3
          this.cashPrizeAmountList.forEach(v => {
            this.requiredList(v, 1);
          });
        }
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
    // 转换金额 百分
    toMoneyReal(data, val) {
      for(let key in data) {
        if(typeof(data[key])=='object') {
          if(data[key]&&data[key][val]) {
            data[key][val] = data[key][val]/100;
          }
        }
        if(Array.isArray(data[key])) {
          data[key]&&data[key].forEach((item)=>{
            if(item[val]) {
              item[val] = item[val]/100;
            }
          })
        }
      }
      return data;
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
        v.value=v.id
        v.label=v.text
        if (v.children) {
          this.setLabelAndValue(v.children);
        }
      });
      this.insTreeList = area;
    }
  },
  created() {    
   
  },mounted() {
    this.getDetailInfo();
    this.getGameLists();
    this.queryInsTree()
  },
};
</script>

<style lang='less' scoped>
@import "./less/index.less";
</style>
