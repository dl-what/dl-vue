<template>
  <div class="vlt-card">
    <h3 class="headling">奖池风险指标修改</h3>
    <div class="select-box">
      <p class="treename">
        <span>所属机构:</span>    
        <span class="gameAndPond">游戏/奖池:</span>
        <el-cascader
          size="small"
          v-model="pondAndGame"
          :options="optionslist"
          disabled
          :props="props"
        ></el-cascader>
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
                <div class="editfrom inputsWidth" v-show="showMaxJackpotMoney">
                  <el-form-item label="Ⅲ级" prop="maxJackpotMoneyOrdinary">
                    <el-input  show-word-limit maxlength=9 v-model="form.maxJackpotMoneyOrdinary"></el-input>
                    <span>元</span>
                  </el-form-item>
                  <el-form-item label="Ⅱ级" prop="maxJackpotMoneySerious">
                    <el-input  show-word-limit maxlength=9 v-model="form.maxJackpotMoneySerious"></el-input>
                    <span>元</span>
                  </el-form-item>
                  <el-form-item label="Ⅰ级" prop="maxJackpotMoneyMajor">
                    <el-input  show-word-limit maxlength=9 v-model="form.maxJackpotMoneyMajor"></el-input>
                    <span>元</span>
                  </el-form-item>
                </div>
                <div class="editfrom inputsWidth" v-show="showMinJackpotMoney">
                  <el-form-item label="Ⅲ级" prop="minJackpotMoneyOrdinary">
                    <el-input  show-word-limit maxlength=9 v-model="form.minJackpotMoneyOrdinary"></el-input>
                    <span>元</span>
                  </el-form-item>
                  <el-form-item label="Ⅱ级" prop="minJackpotMoneySerious">
                    <el-input  show-word-limit maxlength=9 v-model="form.minJackpotMoneySerious"></el-input>
                    <span>元</span>
                  </el-form-item>
                  <el-form-item label="Ⅰ级" prop="minJackpotMoneyMajor">
                    <el-input  show-word-limit maxlength=9 v-model="form.minJackpotMoneyMajor"></el-input>
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
  name: "pondRiskEdit",
  components: { informTable },
  data() {
    var zdjcCompareA = (rule, value, callback) => {
      if (value) {
        if (this.form.minJackpotMoneySerious) {
          if (Number(value) <= Number(this.form.minJackpotMoneySerious)) {
            callback(new Error("Ⅲ级数值应大于Ⅱ级数值"));
          }
        }
      }
      callback();
    };
    var zdjcCompareB = (rule, value, callback) => {
      if (value) {
        if (this.form.minJackpotMoneyOrdinary) {
          if (Number(value) >= Number(this.form.minJackpotMoneyOrdinary)) {
            callback(new Error("Ⅱ级数值应小于Ⅲ级数值"));
          }
          if (Number(value) <= Number(this.form.minJackpotMoneyMajor)) {
            callback(new Error("Ⅱ级数值应大于Ⅰ级数值"));
          }
        }
      }
      callback();
    };
    var zdjcCompareC = (rule, value, callback) => {
      if (value) {
        if (this.form.minJackpotMoneySerious) {
          if (Number(value) >= Number(this.form.minJackpotMoneySerious)) {
            callback(new Error("Ⅰ级数值应小于Ⅱ级数值"));
          }
        }
      }
      callback();
    };

    var zgjcCompareA = (rule, value, callback) => {
      if (value) {
        if (this.form.maxJackpotMoneySerious) {
          if (Number(value) >= Number(this.form.maxJackpotMoneySerious)) {
            callback(new Error("Ⅲ级数值应小于Ⅱ级数值"));
          }
        }
      }
      callback();
    };

    var zgjcCompareB = (rule, value, callback) => {
      if (value) {
        if (this.form.maxJackpotMoneyOrdinary) {
          if (Number(value) <= Number(this.form.maxJackpotMoneyOrdinary)) {
            callback(new Error("Ⅱ级数值应大于Ⅲ级数值"));
          }
          if (Number(value) >= Number(this.form.maxJackpotMoneyMajor)) {
            callback(new Error("Ⅱ级数值应小于Ⅰ级数值"));
          }
        }
      }
      callback();
    };
    var zgjcCompareC = (rule, value, callback) => {
      if (value) {
        if (this.form.maxJackpotMoneySerious) {
          if (Number(value) <= Number(this.form.maxJackpotMoneySerious)) {
            callback(new Error("Ⅰ级数值应大于Ⅱ级数值"));
          }
        }
      }
      callback();
    };

    return {
      indexValue: "",
      informObjs: [],
      jacketList: [
        {
          value: 1,
          label: "奖池1"
        },
        {
          value: 2,
          label: "奖池2"
        },
        {
          value: 3,
          label: "奖池3"
        },
        {
          value: 4,
          label: "奖池4"
        },
        {
          value: 5,
          label: "奖池5"
        }
      ],
      props: {
        value: "id",
        label: "name"
      },
      pondAndGame: "",
      optionslist: [],
      showWatchingPc:true,
      options1: [
        {
          value: 1,
          label: "最高奖池金额"
        },
        {
          value: 2,
          label: "最低奖池金额"
        }
      ],
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
      showMaxJackpotMoney: false,
      showMinJackpotMoney: false,
      options: [],
      controlOptions: [
        { name: "确认", type: "primary", icon: "" } // type为按钮的五种颜色， icon为具体的图标
      ],
      form: {
        collectFrequency: "", //采集间隔(单位：分钟) 传入15，表示15分钟匹配一次
        collectStatus: 0, //0生效 1停止
        maxJackpotMoneyMajor: "", //最高奖池金额-Ⅰ级级别
        maxJackpotMoneyOrdinary: "", //最高奖池金额-普通级别
        maxJackpotMoneySerious: "", //最高奖池金额-Ⅱ级级别
        minJackpotMoneyMajor: "", //最低奖池金额-Ⅰ级级别
        minJackpotMoneyOrdinary: "", //最低奖池金额-普通级别
        minJackpotMoneySerious: "" //最低奖池金额-Ⅱ级级别
      },
      rules: {
        maxJackpotMoneyOrdinary: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
          // { validator: zgjcCompareA, trigger: ["blur", "change"] }
        ],
        maxJackpotMoneySerious: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
          // { validator: zgjcCompareB, trigger: ["blur", "change"] }
        ],
        maxJackpotMoneyMajor: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
          // { validator: zgjcCompareC, trigger: ["blur", "change"] }
        ],
        minJackpotMoneySerious: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
          // { validator: zdjcCompareB, trigger: ["blur", "change"] }
        ],
        minJackpotMoneyOrdinary: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
          // { validator: zdjcCompareA, trigger: ["blur", "change"] }
        ],
        minJackpotMoneyMajor: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
          // { validator: zdjcCompareC, trigger: ["blur", "change"] }
        ]
      }
    };
  },
  methods: {
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
    async getGameLists(options) {
      const self = this;
      const res = await self.$api.getGameLists();
      if (res && res.code == 0) {
        this.options = res.data;
      }
    },
    handleChange(value) {},

    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.pondRiskUpdate(this.$refs.table.dataInform);
        }
      });
    },
    async pondRiskUpdate(propsData) {
      var flag=informs.checkInformPeople(propsData)
      if(flag===true){      
      }else{
        this.$message.warning(flag);
        return
      }
      const res = await this.$api.pondRiskUpdate({
        data: {
          businessKey: this.$route.query.id,
          minJackpotMoneyMajor: this.form.minJackpotMoneyMajor*100|| null,
          minJackpotMoneyOrdinary: this.form.minJackpotMoneyOrdinary*100|| null,
          minJackpotMoneySerious: this.form.minJackpotMoneySerious*100|| null,
          maxJackpotMoneyMajor: this.form.maxJackpotMoneyMajor*100|| null,
          maxJackpotMoneyOrdinary: this.form.maxJackpotMoneyOrdinary*100|| null,
          maxJackpotMoneySerious: this.form.maxJackpotMoneySerious*100|| null,
          gameId: this.pondAndGame[0],
          collectFrequency: this.form.collectFrequency,
          collectStatus: this.form.collectStatus,         
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
          timingFirst: this.form.timingFirst,
          timingSecond: this.form.timingSecond,
          timingThird: this.form.timingThird,
          timingFourth: this.form.timingFourth,
          timingFifth: this.form.timingFifth,
          timingSixth: this.form.timingSixth,
          jackpotPoolId: this.pondAndGame[1],
          indexType:this.indexValue
        },
        message: "修改成功"
      });
      if (res && res.code == 0) {
        this.$router.push({
          name: "pondRiskDetail",
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
     // 转换金额 除以100
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
    //获取详细信息
    async getDetailInfo() {
      const id = this.$route.query.id;
      const self = this;
      const res = await self.$api.getPondRiskDetail({
        data: {
          businessKey: id
        }
      });
      if (res && res.code == 0) {
        let data = res;
          // 需要把百分制金额 除于 100 的字段
          let moneyArray = ['maxJackpotMoneyOrdinary', 'minJackpotMoneyOrdinary', 'maxJackpotMoneySerious','minJackpotMoneySerious','maxJackpotMoneyMajor','minJackpotMoneyMajor']
          moneyArray.forEach((item)=>{
            data = this.toMoneyReal(data, item)
          })
          console.log(data)
        this.form = data.data;
        this.pondAndGame=[res.data.gameId,res.data.jackpotPoolId]
        if (res.data.maxJackpotMoneyOrdinary) {
          this.showMaxJackpotMoney = true;
          this.indexValue = 1;
          this.maxList.forEach(v => {
            this.requiredList(v, 1);
          });
        } else {
          this.showMinJackpotMoney = true;
          this.indexValue = 2;
          this.minList.forEach(v => {
            this.requiredList(v, 1);
          });
        }
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
      }
    },
    //获取奖池游戏联动列表
    async getRewardpoolList() {
      const self = this;
      const res = await self.$api.getRewardpoolList();
      if (res && res.code == 0) {
        
        res.data.forEach(v=>{
          if(v.jackpotIds){
            v.children=v.jackpotIds
          }
        })
        this.optionslist=res.data
      }
    },
    //取消返回列表页面
    gotoList() {
      this.$router.push({
        name: "pondRisk"
      });
    },
 
  },
  created() {
    
  },mounted() {
    this.getDetailInfo();
    this.getGameLists();
    this.getRewardpoolList()
  },
};
</script>

<style lang='less' scoped>
@import "./less/index.less";
</style>
