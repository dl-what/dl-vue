<template>
  <div class="vlt-card">
    <h3 class="headling">金额风险指标修改</h3>
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
            <el-select
              size="small"
              v-model="indexValue"
              placeholder="请选择"
              disabled
            >
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
                <div class="editfrom inputsWidth" v-show="showHighestSaleMoney">
                  <el-form-item label="Ⅲ级" prop="highestSaleMoneyOrdinary">
                    <el-input  show-word-limit maxlength=9  v-model="form.highestSaleMoneyOrdinary"></el-input>
                    <span>元</span>
                  </el-form-item>
                  <el-form-item label="Ⅱ级" prop="highestSaleMoneySerious">
                    <el-input  show-word-limit maxlength=9  v-model="form.highestSaleMoneySerious"></el-input>
                    <span>元</span>
                  </el-form-item>
                  <el-form-item label="Ⅰ级" prop="highestSaleMoneyMajor">
                    <el-input  show-word-limit maxlength=9  v-model="form.highestSaleMoneyMajor"></el-input>
                    <span>元</span>
                  </el-form-item>
                </div>
                <div class="editfrom inputsWidth" v-show="showMinimumSaleMoney">
                  <el-form-item label="Ⅲ级" prop="minimumSaleMoneyOrdinary">
                    <el-input  show-word-limit maxlength=9  v-model="form.minimumSaleMoneyOrdinary"></el-input>
                    <span>元</span>
                  </el-form-item>
                  <el-form-item label="Ⅱ级" prop="minimumSaleMoneySerious">
                    <el-input  show-word-limit maxlength=9  v-model="form.minimumSaleMoneySerious"></el-input>
                    <span>元</span>
                  </el-form-item>
                  <el-form-item label="Ⅰ级" prop="minimumSaleMoneyMajor">
                    <el-input  show-word-limit maxlength=9  v-model="form.minimumSaleMoneyMajor"></el-input>
                    <span>元</span>
                  </el-form-item>
                </div>

                <div class="editfrom inputsWidth" v-show="showMinimumHallSaleMoney">
                  <el-form-item label="Ⅲ级" prop="minimumHallSaleMoneyOrdinary">
                    <el-input  show-word-limit maxlength=9  v-model="form.minimumHallSaleMoneyOrdinary"></el-input>
                    <span>元</span>
                  </el-form-item>
                  <el-form-item label="Ⅱ级" prop="minimumHallSaleMoneySerious">
                    <el-input  show-word-limit maxlength=9  v-model="form.minimumHallSaleMoneySerious"></el-input>
                    <span>元</span>
                  </el-form-item>
                  <el-form-item label="Ⅰ级" prop="minimumHallSaleMoneyMajor">
                    <el-input  show-word-limit maxlength=9  v-model="form.minimumHallSaleMoneyMajor"></el-input>
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
                    :disabled='disabledTime2' 
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
                    :disabled='disabledTime3'
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
                    :disabled='disabledTime4' 
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
                    :disabled='disabledTime5' 
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
                    :disabled='disabledTime6' 
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
  name: "cityAccountRiskEdit",
  components: { informTable },
  data() {
    return {
      insTreeList:null,
      insId:null,
      indexValue: null,
      props: {
        value: "id",
        label: "text"
      },
      informObj: [],
      showHighestSaleMoney: false,
      showMinimumSaleMoney: false,
      showMinimumHallSaleMoney: false,
      showWatchingTime: false,
      showWatchingPc: false,
      treeName: [],
      treeNames: "",
      selectName: "",
      num: 10,
      optionsArea: [],
      area: [],
      highestSaleMoneyList: [
        "highestSaleMoneyMajor",
        "highestSaleMoneySerious",
        "highestSaleMoneyOrdinary"
      ],
      minimumHallSaleMoneyList: [
        "minimumHallSaleMoneyMajor",
        "minimumHallSaleMoneySerious",
        "minimumHallSaleMoneyOrdinary"
      ],
      minimumSaleMoneyList: [
        "minimumSaleMoneyMajor",
        "minimumSaleMoneyOrdinary",
        "minimumSaleMoneySerious"
      ],
      form: {
        type: 2,
        timingSecond: "",
        timingFirst: "",
        timingThird: "",
        timingFourth: "",
        timingFifth: "",
        timingSixth: "",
        collectFrequency: "", //采集间隔(单位：分钟) 传入15，表示15分钟匹配一次
        collectStatus: 0, //0生效 1停止
        highestSaleMoneyMajor: "", //最低返奖率-Ⅰ级级别
        highestSaleMoneySerious: "", //最低返奖率-普通级别
        highestSaleMoneyOrdinary: "", //最低返奖率-Ⅱ级级别
        minimumHallSaleMoneyMajor: "", //最高返奖率-Ⅰ级级别
        minimumHallSaleMoneySerious: "", //最高返奖率-普通级别
        minimumHallSaleMoneyOrdinary: "", //最高返奖率-Ⅱ级级别
        minimumSaleMoneyMajor: "", //最高返奖率-Ⅰ级级别
        minimumSaleMoneyOrdinary: "", //最高返奖率-普通级别
        minimumSaleMoneySerious: "" //最高返奖率-Ⅱ级级别
      },
      disabledTime2: true,
      disabledTime3: true,
      disabledTime4: true,
      disabledTime5: true,
      disabledTime6: true,
      indexList: [
        {
          value: 1,
          label: "最高销量"
        },
        {
          value: 2,
          label: "最低销量"
        },
        {
          value: 3,
          label: "最低单厅销量"
        }
      ],
      rules: {
        highestSaleMoneyOrdinary: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
        ],
        highestSaleMoneySerious: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
        ],
        highestSaleMoneyMajor: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
        ],
        minimumSaleMoneyOrdinary: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
        ],
        minimumSaleMoneySerious: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
        ],
        minimumSaleMoneyMajor: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
        ],

        minimumHallSaleMoneyOrdinary: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
        ],
        minimumHallSaleMoneySerious: [
          {
            validator: rules.unNumberCheck,
            trigger: ["blur", "change"],
            required: "false"
          },
        ],
        minimumHallSaleMoneyMajor: [
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
    //提交
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.cityMoneyRiskUpdate(this.$refs.table.dataInform);
        }
      });
    },
    //返回金额风险列表页
    gotoList() {
      this.$router.push({ name: "cityMoneyRisk" });
    },
    //游戏风险指标修改
    async cityMoneyRiskUpdate(propsData) {
      const self = this;
      console.log(propsData);
      if((!this.form.timingFirst) && this.showWatchingTime==true){
        this.$message.warning(`请至少选择一次监控时间`);
        return
      }
      var flag=informs.checkInformPeople(propsData)
      if(flag===true){      
      }else{
        this.$message.warning(flag);
        return
      }
      const res = await self.$api.cityMoneyRiskUpdate({
        data: {
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
          highestSaleMoneyMajor: this.form.highestSaleMoneyMajor*100||null,
          highestSaleMoneyOrdinary: this.form.highestSaleMoneyOrdinary*100||null,
          highestSaleMoneySerious: this.form.highestSaleMoneySerious*100||null,
          minimumSaleMoneyMajor: this.form.minimumSaleMoneyMajor*100||null,
          minimumSaleMoneyOrdinary: this.form.minimumSaleMoneyOrdinary*100||null,
          minimumSaleMoneySerious: this.form.minimumSaleMoneySerious*100||null,
          minimumHallSaleMoneyMajor: this.form.minimumHallSaleMoneyMajor*100||null,
          minimumHallSaleMoneyOrdinary: this.form.minimumHallSaleMoneyOrdinary*100||null,
          minimumHallSaleMoneySerious: this.form.minimumHallSaleMoneySerious*100||null,
          timingFirst: this.form.timingFirst,
          timingSecond: this.form.timingSecond,
          timingThird: this.form.timingThird,
          timingFourth: this.form.timingFourth,
          timingFifth:this.form.timingFifth,
          timingSixth: this.form.timingSixth,
          businessKey: this.$route.query.id
        },
        message: "修改成功"
      });
      if (res && res.code == 0) {
        this.$router.push({
          name: "cityMoneyRiskDetail",
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
      const res = await self.$api.cityMoneyRiskDetail({
        data: {
          businessKey: id
        }
      });
      if (res && res.code == 0) {
        this.insId=res.data.insIdArray
         let data = res;
          // 需要把百分制金额 除于 100 的字段
           let moneyArray = ['highestSaleMoneyOrdinary', 'highestSaleMoneySerious','highestSaleMoneyMajor','minimumSaleMoneyOrdinary','minimumSaleMoneySerious','minimumSaleMoneyMajor','minimumHallSaleMoneyOrdinary','minimumHallSaleMoneySerious','minimumHallSaleMoneyMajor']
          moneyArray.forEach((item)=>{
            data = this.toMoneyReal(data, item)
          })
        this.form = res.data;
         if (res.data.timingFifth) {
          this.disabledTime6 = false;
        }
        if (res.data.timingFirst) {
          this.disabledTime2= false;
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
        if (res.data.highestSaleMoneyOrdinary) {
          this.showHighestSaleMoney = true;
          this.indexValue = 1;
          this.showWatchingPc = true;
          this.highestSaleMoneyList.forEach(v => {
            this.requiredList(v, 1);
          });
        }
        if (res.data.minimumSaleMoneyOrdinary) {
          this.showMinimumSaleMoney = true;
          this.indexValue = 2;
          this.showWatchingTime = true;
          this.minimumSaleMoneyList.forEach(v => {
            this.requiredList(v, 1);
          });
        }
        if (res.data.minimumHallSaleMoneyOrdinary) {
          this.showMinimumHallSaleMoney = true;
          this.indexValue = 3;;
          this.showWatchingTime = true;
          this.minimumHallSaleMoneyList.forEach(v => {
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
