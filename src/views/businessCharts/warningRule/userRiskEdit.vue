<template>
  <div class="vlt-card">
    <h3 class="headling">用户风险指标修改</h3>
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
         <span class="game">类型:</span>
        <el-select   disabled
              v-model="form.type" size="small" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
           
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
            <p class="tipsPosition">用户风险告警于每日凌晨匹配一次 数值达到对应风险指标值即为触发 
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
                    <el-input  show-word-limit maxlength=9  v-model="form.betWarnCountOrdinary"></el-input>
                    <span>次</span>
                  </el-form-item>
                  <el-form-item label="Ⅱ级" prop="betWarnCountSerious">
                    <el-input  show-word-limit maxlength=9  v-model="form.betWarnCountSerious"></el-input>
                    <span>次</span>
                  </el-form-item>
                  <el-form-item label="Ⅰ级" prop="betWarnCountMajor">
                    <el-input  show-word-limit maxlength=9  v-model="form.betWarnCountMajor"></el-input>
                    <span>次</span>
                  </el-form-item>
                </div>
                <div class="editfrom inputsWidth" v-show="showRechargeWarnCount">
                  <el-form-item label="Ⅲ级" prop="rechargeWarnCountOrdinary">
                    <el-input  show-word-limit maxlength=9  v-model="form.rechargeWarnCountOrdinary"></el-input>
                    <span>次</span>
                  </el-form-item>
                  <el-form-item label="Ⅱ级" prop="rechargeWarnCountSerious">
                    <el-input  show-word-limit maxlength=9  v-model="form.rechargeWarnCountSerious"></el-input>
                    <span>次</span>
                  </el-form-item>
                  <el-form-item label="Ⅰ级" prop="rechargeWarnCountMajor">
                    <el-input  show-word-limit maxlength=9  v-model="form.rechargeWarnCountMajor"></el-input>
                    <span>次</span>
                  </el-form-item>
                </div>
                <div class="editfrom inputsWidth" v-show="showBetDurationWarnCount">
                  <el-form-item label="Ⅲ级" prop="betDurationWarnCountOrdinary">
                    <el-input  show-word-limit maxlength=9  v-model="form.betDurationWarnCountOrdinary"></el-input>
                    <span>次</span>
                  </el-form-item>
                  <el-form-item label="Ⅱ级" prop="betDurationWarnCountSerious">
                    <el-input  show-word-limit maxlength=9  v-model="form.betDurationWarnCountSerious"></el-input>
                    <span>次</span>
                  </el-form-item>
                  <el-form-item label="Ⅰ级" prop="betDurationWarnCountMajor">
                    <el-input  show-word-limit maxlength=9  v-model="form.betDurationWarnCountMajor"></el-input>
                    <span>次</span>
                  </el-form-item>
                </div>
                <div class="editfrom inputsWidth" v-show="showBetAstrictCount">
                  <el-form-item label="Ⅲ级" prop="betAstrictCountOrdinary">
                    <el-input  show-word-limit maxlength=9  v-model="form.betAstrictCountOrdinary"></el-input>
                    <span>次</span>
                  </el-form-item>
                  <el-form-item label="Ⅱ级" prop="betAstrictCountSerious">
                    <el-input  show-word-limit maxlength=9  v-model="form.betAstrictCountSerious"></el-input>
                    <span>次</span>
                  </el-form-item>
                  <el-form-item label="Ⅰ级" prop="betAstrictCountMajor">
                    <el-input  show-word-limit maxlength=9  v-model="form.betAstrictCountMajor"></el-input>
                    <span>次</span>
                  </el-form-item>
                </div>
                <div class="editfrom inputsWidth" v-show="showRechargeAstrictCount">
                  <el-form-item label="Ⅲ级" prop="rechargeAstrictCountOrdinary">
                    <el-input  show-word-limit maxlength=9  v-model="form.rechargeAstrictCountOrdinary"></el-input>
                    <span>次</span>
                  </el-form-item>
                  <el-form-item label="Ⅱ级" prop="rechargeAstrictCountSerious">
                    <el-input  show-word-limit maxlength=9  v-model="form.rechargeAstrictCountSerious"></el-input>
                    <span>次</span>
                  </el-form-item>
                  <el-form-item label="Ⅰ级" prop="rechargeAstrictCountMajor">
                    <el-input  show-word-limit maxlength=9  v-model="form.rechargeAstrictCountMajor"></el-input>
                    <span>次</span>
                  </el-form-item>
                </div>
                <div class="editfrom inputsWidth" v-show="showBetDurationAstrictCount">
                  <el-form-item label="Ⅲ级" prop="betDurationAstrictCountOrdinary">
                    <el-input  show-word-limit maxlength=9  v-model="form.betDurationAstrictCountOrdinary"></el-input>
                    <span>次</span>
                  </el-form-item>
                  <el-form-item label="Ⅱ级" prop="betDurationAstrictCountSerious">
                    <el-input  show-word-limit maxlength=9  v-model="form.betDurationAstrictCountSerious"></el-input>
                    <span>次</span>
                  </el-form-item>
                  <el-form-item label="Ⅰ级" prop="betDurationAstrictCountMajor">
                    <el-input  show-word-limit maxlength=9  v-model="form.betDurationAstrictCountMajor"></el-input>
                    <span>次</span>
                  </el-form-item>
                </div>
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
       showBetWarnCount: false,
      showRechargeWarnCount: false,
      showBetDurationWarnCount: false,
      showBetAstrictCount: false,
      showRechargeAstrictCount: false,
      showBetDurationAstrictCount: false,
      props: {
        value: "id",
        label: "text"
      },
      optionsArea: [],
      area: [],
      insTreeList:null,
      insId:null,
      indexValue: null,
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
      },
       rules: {
        betWarnCountOrdinary: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
        ],
        betWarnCountSerious: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
        ],
        betWarnCountMajor: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
        ],
        rechargeWarnCountOrdinary: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
        ],
        rechargeWarnCountSerious: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
        ],
        rechargeWarnCountMajor: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
        ],

        betAstrictCountMajor: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
        ],
        betAstrictCountOrdinary: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
        ],
        betAstrictCountSerious: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
        ],

        betDurationWarnCountMajor: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
        ],
        betDurationWarnCountOrdinary: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
        ],
        betDurationWarnCountSerious: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
        ],
        rechargeAstrictCountMajor: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
        ],
        rechargeAstrictCountOrdinary: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
        ],
        rechargeAstrictCountSerious: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
        ],
          betDurationAstrictCountMajor: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
        ],
        betDurationAstrictCountOrdinary: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
        ],
        betDurationAstrictCountSerious: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
        ]
      },
    };
  },
  methods: {
    handleChange(value) {
      console.log(value);
    },
    //修改
    onSubmit() {
       this.$refs.form.validate(valid => {
        if (valid) {
           this.userRiskUpdate(this.$refs.table.dataInform);
        }
      });
     
    },
    //取消返回列表页面
    gotoList() {
      this.$router.push({
        name: "userRisk"
      });
    },
    //游戏风险指标修改
    async userRiskUpdate(propsData) {
      var flag=informs.checkInformPeople(propsData)
      if(flag===true){      
      }else{
        this.$message.warning(flag);
        return
      }
      const self = this;
      const res = await self.$api.userRiskUpdate({
        data: {
          businessKey: this.$route.query.id,
          type: this.form.type,
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
          betDurationWarnCountOrdinary: this.form.betDurationWarnCountOrdinary,
          rechargeAstrictCountMajor: this.form.rechargeAstrictCountMajor,
          rechargeAstrictCountOrdinary: this.form.rechargeAstrictCountOrdinary,
          rechargeAstrictCountSerious: this.form.rechargeAstrictCountSerious,
          betAstrictCountMajor: this.form.betAstrictCountMajor,
          betAstrictCountOrdinary: this.form.betAstrictCountOrdinary,
          betAstrictCountSerious: this.form.betAstrictCountSerious,
          betDurationAstrictCountOrdinary:this.form.betDurationAstrictCountOrdinary,
          betDurationAstrictCountSerious:this.form.betDurationAstrictCountSerious,
          betDurationAstrictCountMajor:this.form.betDurationAstrictCountMajor,
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
        },
        message: "修改成功"
      });
      if (res && res.code == 0) {
        this.$router.push({
          name: "userRiskDetail",
          query: {
            id: this.$route.query.id
          }
        });
      }
    },
    
    //获取详细信息
    async getDetailInfo() {
      const id = this.$route.query.id;
      const self = this;
      const res = await self.$api.userRiskDetail({
        data: {
          businessKey: id
        }
      });
      if (res && res.code == 0) {
        this.insId=res.data.insIdArray
        this.form = res.data;
        this.form.type = res.data.type ;
        if (res.data.betWarnCountOrdinary) {
          this.indexValue=1
          this.showBetWarnCount = true;
          this.betWarnCountList.forEach(v => {
            this.requiredList(v, 1);
          });
        } 

        if (res.data.rechargeWarnCountOrdinary) { 
          this.indexValue=2
          this.showRechargeWarnCount = true;
          this.rechargeWarnCountList.forEach(v => {
            this.requiredList(v, 1);
          });
        }
        if (res.data.betDurationWarnCountOrdinary) {
          this.showBetDurationWarnCount = true;
          this.indexValue=3
            this.betDurationWarnCountList.forEach(v => {
            this.requiredList(v, 1);
          });
        }
        if (res.data.betAstrictCountOrdinary) {
          this.showBetAstrictCount = true;
          this.indexValue=4
          this.betAstrictCountList.forEach(v => {
            this.requiredList(v, 1);
          });
        }
        if (res.data.rechargeAstrictCountOrdinary) {
          this.showRechargeAstrictCount= true;
          this.indexValue=5
          this.rechargeAstrictCountList.forEach(v => {
            this.requiredList(v, 1);
          });
        }
        if (res.data.betDurationAstrictCountOrdinary) {
          this.showBetDurationAstrictCount= true;
          this.indexValue=6
          this.betDurationAstrictCountList.forEach(v => {
            this.requiredList(v, 1);
          });
        }
      }
    },
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
    async queryInsTree() {
      let res = await this.$api.queryInsTree();
      if (res && res.code == 0) {
        this.setLabelAndValue(res.data);
      }
    },
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
    this.queryInsTree()
    this.getDetailInfo();
  }
};
</script>

<style lang='less' scoped>
@import "./less/index.less";
 .tipsPosition .tips{
   margin-left: 310px !important;
}
</style>
