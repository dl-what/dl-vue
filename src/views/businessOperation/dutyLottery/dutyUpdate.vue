<template>
  <div class="vlt-card duty-set">
    <panel :show="true" title="基础信息" style="margin-bottom: 15px;">
      <div class="vlt-edit-wrap">
        <div class="vlt-edit-single">
          <el-form ref="baseForm" :model="baseForm" label-width="140px" class="vlt-edit-wrap">
            <el-form-item label="责任类型" prop="responsibilityType">
              <el-input v-model="baseForm.responsibilityType" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="责任编号" prop="responsibilityCode">
              <el-input v-model="baseForm.responsibilityCode" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="计算账户余额" v-if="baseForm.responsibilityCode == 200001">
              <el-switch
                v-model="baseForm.balanceSwitch"
                @change="change($event)"
                active-value="1"
                inactive-value="0"
              ></el-switch>
              <span
                style=" display: inline-block;margin-left: 10px;color: #ccc;font-size: 13px;"
              >开启后充值限额会将中奖奖金金额以及账户余额计算在内</span>
            </el-form-item>
            <el-form-item label="计算奖金金额" v-if="baseForm.responsibilityCode == 200002">
              <el-switch
                v-model="baseForm.prizeSwitch"
                @change="changeMoney($event)"
                active-value="1"
                inactive-value="0"
              ></el-switch>
              <span
                style=" display: inline-block;margin-left: 10px;color: #ccc;font-size: 13px;"
              >开启后投注限额会将中奖奖金金额计算在内</span>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </panel>

    <panel :show="true" title="非会员责任设置" style="margin-bottom: 15px;">
      <div class="vlt-edit-wrap">
        <div class="vlt-edit-single">
          <base-form
            v-if="baseForm.responsibilityCode!==200003"
            :formData="formData"
            labelWidth="140px"
            ref="formData"
            :rules="rules"
            @change="changeForm"
            class="vlt-edit-wrap form-data"
          ></base-form>
          <el-form
            v-if="baseForm.responsibilityCode == 200003"
            label-position="right"
            label-width="140px"
            ref="gameDurationForm"
            :model="gameDurationForm"
            class="game-duration"
          >
            <el-form-item v-for="(item,index) in gameDuration" :key="index" :label="item.title">
              <!-- <el-input v-model="item.day" placeholder="请输入">
                <template slot="append">天</template>
              </el-input>-->
              <el-input v-model="item.hour" placeholder="请输入">
                <template slot="append">小时</template>
              </el-input>
              <el-input v-model="item.min" placeholder="请输入">
                <template slot="append">分钟</template>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </panel>

    <panel :show="true" title="会员风险等级责任设置">
      <div class="wrapper">
        <el-table
          :data="tableData"
          border
          class="duty-table"
          v-if="baseForm.responsibilityCode == 200001"
        >
          <el-table-column prop="riskLevel" label="风险级别"></el-table-column>
          <el-table-column prop="levelName" label="风险等级名称"></el-table-column>
          <el-table-column prop="perDay" label="每日充值上限(元)">
            <template slot-scope="scope">
              <el-input
                v-model.number="scope.row.perDay"
                placeholder="请输入"
                :maxlength="10"
                oninput="this.value=this.value.replace(/[^\d]/g,'')"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="perWeek" label="每周充值上限(元)">
            <template slot-scope="scope">
              <el-input
                v-model.number="scope.row.perWeek"
                placeholder="请输入"
                :maxlength="10"
                oninput="this.value=this.value.replace(/[^\d]/g,'')"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="perMonth" label="每月充值上限(元)">
            <template slot-scope="scope">
              <el-input
                v-model.number="scope.row.perMonth"
                placeholder="请输入"
                :maxlength="10"
                oninput="this.value=this.value.replace(/[^\d]/g,'')"
              ></el-input>
            </template>
          </el-table-column>
        </el-table>
        <el-table
          :data="tableData"
          border
          class="duty-table"
          v-if="baseForm.responsibilityCode == 200002"
        >
          <el-table-column prop="riskLevel" label="风险级别"></el-table-column>
          <el-table-column prop="levelName" label="风险等级名称"></el-table-column>
          <el-table-column prop="perTimes" label="单次投注上限(元)">
            <template slot-scope="scope">
              <el-input
                v-model.number="scope.row.perTimes"
                placeholder="请输入"
                :maxlength="10"
                oninput="this.value=this.value.replace(/[^\d]/g,'')"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="perDay" label="每日投注上限(元)">
            <template slot-scope="scope">
              <el-input
                v-model.number="scope.row.perDay"
                placeholder="请输入"
                :maxlength="10"
                oninput="this.value=this.value.replace(/[^\d]/g,'')"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="perWeek" label="每周投注上限(元)">
            <template slot-scope="scope">
              <el-input
                v-model.number="scope.row.perWeek"
                placeholder="请输入"
                :maxlength="10"
                oninput="this.value=this.value.replace(/[^\d]/g,'')"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="perMonth" label="每月投注上限(元)">
            <template slot-scope="scope">
              <el-input
                v-model.number="scope.row.perMonth"
                placeholder="请输入"
                :maxlength="10"
                oninput="this.value=this.value.replace(/[^\d]/g,'')"
              ></el-input>
            </template>
          </el-table-column>
        </el-table>
        <el-table
          :data="tableData"
          border
          class="duty-table"
          v-if="baseForm.responsibilityCode == 200003"
        >
          <el-table-column prop="riskLevel" label="风险级别" width="80px"></el-table-column>
          <el-table-column prop="levelName" label="风险等级名称" width="120px"></el-table-column>
          <el-table-column prop="perTimes" label="单次登录时长上限（时：分）">
            <template slot-scope="scope">
              <div class="flex-wrap">
                <el-input
                  v-model.number="scope.row.hourPerTimes"
                  placeholder="小时"
                  oninput="this.value=this.value.replace(/[^\d]/g,'')"
                  maxlength="6"
                ></el-input>
                <span class="flex-wrap-tag">:</span>
                <el-input
                  v-model.number="scope.row.perTimes"
                  placeholder="分钟"
                  maxlength="6"
                  oninput="this.value=this.value.replace(/[^\d]/g,'')"
                ></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="perDay" label="每日登录时长上限（时：分）">
            <template slot-scope="scope">
              <div class="flex-wrap">
                <el-input
                  v-model.number="scope.row.hourPerDay"
                  placeholder="小时"
                  maxlength="6"
                  oninput="this.value=this.value.replace(/[^\d]/g,'')"
                ></el-input>
                <span class="flex-wrap-tag">:</span>
                <el-input
                  v-model.number="scope.row.perDay"
                  placeholder="分钟"
                  maxlength="6"
                  oninput="this.value=this.value.replace(/[^\d]/g,'')"
                ></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="perWeek" label="每周登录时长上限（时：分）">
            <template slot-scope="scope">
              <div class="flex-wrap">
                <el-input
                  v-model.number="scope.row.hourPerWeek"
                  placeholder="小时"
                  maxlength="6"
                  oninput="this.value=this.value.replace(/[^\d]/g,'')"
                ></el-input>
                <span class="flex-wrap-tag">:</span>
                <el-input
                  v-model.number="scope.row.perWeek"
                  placeholder="分钟"
                  maxlength="6"
                  oninput="this.value=this.value.replace(/[^\d]/g,'')"
                ></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="perMonth" label="每月登录时长上限（时：分）">
            <template slot-scope="scope">
              <div class="flex-wrap">
                <el-input
                  v-model.number="scope.row.hourPerMonth"
                  placeholder="小时"
                  maxlength="6"
                  oninput="this.value=this.value.replace(/[^\d]/g,'')"
                ></el-input>
                <span class="flex-wrap-tag">:</span>
                <el-input
                  v-model.number="scope.row.perMonth"
                  placeholder="分钟"
                  maxlength="6"
                  oninput="this.value=this.value.replace(/[^\d]/g,'')"
                ></el-input>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </panel>

    <el-row class="control-btn">
      <el-button type="primary" size="medium" @click="submit" :id="$route.name + '-' + 'submit'">保存</el-button>
      <el-button size="medium" @click="cancel" :id="$route.name + '-' + 'cancel'">取消</el-button>
    </el-row>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "dutyUpdate",
  data() {
    return {
      baseForm: {
        responsibilityCode: 200001,
        responsibilityType: "",
        balanceSwitch: null,
        prizeSwitch: null
      },
      //责任设置表单
      form: {},
      formData: [],
      rechargeForm: [
        {
          type: "input-unit",
          title: "每日充值上限",
          prop: "perDay",
          unit: "元",
          value: "",
          maxlength: 10
        },
        {
          type: "input-unit",
          title: "每周充值上限",
          prop: "perWeek",
          unit: "元",
          maxlength: 10,
          value: ""
        },
        {
          type: "input-unit",
          title: "每月充值上限",
          prop: "perMonth",
          unit: "元",
          maxlength: 10,
          value: ""
        }
      ],
      betForm: [
        {
          type: "input-unit",
          title: "单次投注上限",
          prop: "perTimes",
          unit: "元",
          maxlength: 10,
          value: ""
        },
        {
          type: "input-unit",
          title: "每日投注上限",
          prop: "perDay",
          unit: "元",
          maxlength: 10,
          value: ""
        },
        {
          type: "input-unit",
          title: "每周投注上限",
          prop: "perWeek",
          unit: "元",
          maxlength: 10,
          value: ""
        },
        {
          type: "input-unit",
          title: "每月投注上限",
          prop: "perMonth",
          unit: "元",
          maxlength: 10,
          value: ""
        }
      ],
      gameDurationForm: {},
      gameDuration: [
        {
          title: "单次登录时长上限",
          day: "",
          hour: "",
          min: "",
          prop: "perTimes"
        },
        {
          title: "每日登录时长上限",
          day: "",
          hour: "",
          min: "",
          prop: "perDay"
        },
        {
          title: "每周登录时长上限",
          day: "",
          hour: "",
          min: "",
          prop: "perWeek"
        },
        {
          title: "每月登录时长上限",
          day: "",
          hour: "",
          min: "",
          prop: "perMonth"
        }
      ],
      //责任设置表格
      tableData: [],
      rechargeList: [],
      betList: [],
      timeList: [],
      gameDurationList: [],
      //校验规则
      rules: {
        perDay: [
          {
            required: true,
            message: "",
            trigger: ["change", "blur"]
          }
        ],
        perWeek: [
          {
            required: true,
            message: "",
            trigger: ["change", "blur"]
          }
        ],
        perMonth: [
          {
            required: true,
            message: "",
            trigger: ["change", "blur"]
          }
        ],

        perTimes: [
          {
            required: true,
            message: "",
            trigger: ["change", "blur"]
          }
        ]
      },

      arr: [],
      obj: {},
      value: true,
      resData: [],
      resultData: [],
      allIds: "",
      nowIds: [],
      timeData: [],
      ticketList: [],
      dutyArr: [],
      numId: {},
      allTime: [],
      perDayMsg: "",
      dutyList: {},
      info: {}
    };
  },
  created() {
    this.nowIds = this.$route.query.responsibleCode;
    this.init(this.nowIds);

    this.$nextTick(() => {
      this.$refs.formData.resetForm();
    });
  },

  methods: {
    //计算账户余额开关change事件
    async change($event) {
      console.log($event);
      let balance_switch = this.baseForm.balanceSwitch;
      let data = {
        key: "balance_switch",
        value: Number($event)
      };
      let resul = await this.$api.changeSwich({ data, message:'保存成功' });
    },
    //计算奖金金额
    async changeMoney($event) {
      let prize_switch = this.baseForm.prizeSwitch;
      let data = {
        key: "prize_switch",
        value: Number($event)
      };

      let result = await this.$api.changeMoneySwich({ data, message:'保存成功' });
    },

    //初始化
    async init(nowIds) {
      //回显
      const self = this;
      let result = await this.$api.getdutyEditDetail({
        data: nowIds
      });
      this.resultData = JSON.parse(JSON.stringify(result));
      if (result && result.code == 0) {
        //基础信息
        // this.changeList(this.baseForm.responsibilityCode);
        let memberRiskLevelVoList = this.resultData.data.memberRiskLevelVoList;
        this.changeList();
        if (this.$route.query.responsibleCode != 200003) {
          this.resultData.data.memberRiskLevelVoList.forEach(item => {
            item.perTimes = Number(item.perTimes / 100);
            item.perDay = Number(item.perDay / 100);
            item.perWeek = Number(item.perWeek / 100);
            item.perMonth = Number(item.perMonth / 100);
          });
          this.tableData = this.resultData.data.memberRiskLevelVoList;
        }
        if (this.$route.query.responsibleCode == 200003) {
          this.resultData.data.memberRiskLevelVoList.forEach((item, index) => {
            self.$set(item, "hourPerTimes", "");
            self.$set(item, "hourPerDay", "");
            self.$set(item, "hourPerWeek", "");
            self.$set(item, "hourPerMonth", "");
            item.hourPerTimes = parseInt(Number(item.perTimes) / 60);
            item.perTimes = Number(item.perTimes) % 60;
            item.hourPerDay = parseInt(Number(item.perDay) / 60);
            item.perDay = Number(item.perDay) % 60;
            item.hourPerWeek = parseInt(Number(item.perWeek) / 60);
            item.perWeek = Number(item.perWeek) % 60;
            item.hourPerMonth = parseInt(Number(item.perMonth) / 60);
            item.perMonth = Number(item.perMonth) % 60;
            // self.$set(self.tableData, index, item);
          });
          this.tableData = this.resultData.data.memberRiskLevelVoList;
        }
        this.baseForm = this.resultData.data.responsibleTicket;
        if (this.$route.query.responsibleCode == 200001) {
          this.$set(
            this.baseForm,
            "balanceSwitch",
            String(result.data.balance_switch)
          );
          // this.baseForm.prizeSwitch = String(result.data.prize_switch);
        }
        if (this.$route.query.responsibleCode == 200002) {
          this.$set(
            this.baseForm,
            "prizeSwitch",
            String(result.data.prize_switch)
          );

          // this.baseForm.balanceSwitch = String(result.data.balance_switch);
        }
      }
    },

    //替换表单
    changeList() {
      if (this.resultData.data.responsibleTicket.responsibilityCode == 200001) {
        this.rechargeForm.forEach(item => {
          item.value = this.resultData.data.responsibleTicket[item.prop] / 100;
          this.tableData = this.resData;
        });
        this.formData = this.rechargeForm;
        this.rules.perDay[0].message = "请输入每日充值上限";
        this.rules.perWeek[0].message = "请输入每周充值上限";
        this.rules.perMonth[0].message = "请输入每月充值上限";
      }
      if (this.resultData.data.responsibleTicket.responsibilityCode == 200002) {
        this.betForm.forEach(item => {
          item.value = this.resultData.data.responsibleTicket[item.prop] / 100;
          this.tableData = this.resData;
        });
        this.formData = this.betForm;

        this.rules.perDay[0].message = "请输入每日投注上限";
        this.rules.perWeek[0].message = "请输入每周投注上限";
        this.rules.perMonth[0].message = "请输入每月投注上限";
        this.rules.perTimes[0].message = "请输入单次投注上限";
      }
      if (this.resultData.data.responsibleTicket.responsibilityCode == 200003) {
        let perTimes = this.resultData.data.responsibleTicket.perTimes;
        let perDay = this.resultData.data.responsibleTicket.perDay;
        let perWeek = this.resultData.data.responsibleTicket.perWeek;
        let perMonth = this.resultData.data.responsibleTicket.perMonth;
        this.timeData = this.timeStamp([perTimes, perDay, perWeek, perMonth]);

        let array = this.timeData.map(item => {
          return {
            day: item[0],
            hour: item[1],
            min: item[2]
          };
        });
        //console.log(array);
        let arr = [];
        this.gameDuration.forEach((item, index) => {
          array.forEach((i, j) => {
            if (index == j) {
              let obj = { ...item, ...i };
              arr.push(obj);
            }
          });
        });

        this.gameDuration = arr;
        // this.tableData = this.resData;
      }
    },
    //表单提交
    async submit() {
      let member = this.resultData.data.responsibleTicket;
      let array = [];
      this.gameDuration.forEach(item => {
        console.log(item);
        array.push(Number(this.timeMinchange(item.day, item.hour, item.min)));
      });
      console.log(array);
      let ob = Object.assign({}, array);
      console.log(ob);
      let perTimes = {
        perTimes: ob[0]
      };

      let perDay = {
        perDay: ob[1]
      };

      let perWeek = {
        perWeek: ob[2]
      };

      let perMonth = {
        perMonth: ob[3]
      };

      let obj = {
        ...perTimes,
        ...perDay,
        ...perWeek,
        ...perMonth
      };
      console.log(obj);
      if (obj.perTimes > obj.perDay) {
        this.$message.warning("每天时长必须大于单次时长");
        return;
      }
      if (obj.perDay > obj.perWeek) {
        this.$message.warning("每周时长必须大于每天时长");
        return;
      }
      if (obj.perWeek > obj.perMonth) {
        this.$message.warning("每月时长必须大于每周时长");
        return;
      }

      if (member.responsibilityCode !== 200003) {
        this.form.perTimes = this.form.perTimes * 100;
        this.form.perDay = this.form.perDay * 100;
        this.form.perWeek = this.form.perWeek * 100;
        this.form.perMonth = this.form.perMonth * 100;
        if (this.form.perTimes > this.form.perDay) {
          this.$message.warning(
            member.responsibilityCode == 200003
              ? "每日充值上限必须大于充值投注上限"
              : "每日投注上限必须大于单次投注上限"
          );
          return;
        }
        if (this.form.perDay > this.form.perWeek) {
          this.$message.warning(
            member.responsibilityCode !== 200002
              ? "每周充值上限必须大于每日充值上限"
              : "每周投注上限必须大于每日投注上限"
          );
          return;
        }
        if (this.form.perWeek > this.form.perMonth) {
          this.$message.warning(
            member.responsibilityCode !== 200002
              ? "每月充值上限必须大于每周充值上限"
              : "每月投注上限必须大于每周投注上限"
          );
          return;
        }
        this.info = {
          responsibilityCode: this.baseForm.responsibilityCode,
          ...this.form,
          userType: 0
        };
      } else {
        this.info = {
          responsibilityCode: this.baseForm.responsibilityCode,
          ...obj,
          userType: 0
        };
      }
      console.log(this.dutyList);
      if (this.baseForm.responsibilityCode !== 200003) {
        let res = this.tableData.map(item => {
          return {
            perDay: item.perDay * 100,
            perMonth: item.perMonth * 100,
            perTimes: item.perTimes * 100,
            perWeek: item.perWeek * 100,
            userType: 1,
            responsibilityCode: this.baseForm.responsibilityCode,
            riskLevelId: item.riskLevelId
          };
        });
        res.push(this.info);
        let data = [...res];
        console.log(data);
        for (let item of data) {
          if (item.perDay > item.perWeek) {
            this.$message.warning(
              member.responsibilityCode !== 200002
                ? "每周充值金额上限必须大于每日充值金额上限"
                : "每周投注金额上限必须大于每日投注金额上限"
            );
            return;
          }
          if (item.perWeek > item.perMonth) {
            this.$message.warning(
              member.responsibilityCode !== 200002
                ? "每月充值金额上限必须大于每周充值金额上限"
                : "每月投注金额上限必须大于每周投注金额上限"
            );
            return;
          }
        }
        this.$refs.formData.validate(async valid => {
          if (valid == "true") {
            let result = await this.$api.getDutyUpdata({
              message: "修改成功",
              data
            });
            if (result && result.code == 0) {
              this.$router.push("dutyLotteryList");
            }
          }
        });
        console.log("data", data);
      }
      if (this.baseForm.responsibilityCode == 200003) {
        let response = this.tableData.map(item => {
          return {
            perTimes: item.perTimes + item.hourPerTimes * 60,
            perDay: item.perDay + item.hourPerDay * 60,
            perWeek: item.perWeek + item.hourPerWeek * 60,
            perMonth: item.perMonth + item.hourPerMonth * 60,
            userType: 1,
            responsibilityCode: this.baseForm.responsibilityCode,
            riskLevelId: item.riskLevelId
          };
        });
        response.push(this.info);
        console.log(response);
        let data = [...response];
        for (let item of data) {
          console.log(item);
          if (item.perTimes > item.perDay) {
            this.$message.warning("每日登录时长上限必须大于单次登录时长上限");
            return;
          }
          if (item.perDay > item.perWeek) {
            this.$message.warning("每周登录时长上限必须大于每日登录时长上限");
            return;
          }
          if (item.perWeek > item.perMonth) {
            this.$message.warning("每月登录时长上限必须大于每周登录时长上限");
            return;
          }
        }
        let result = await this.$api.getDutyUpdata({
          message: "修改成功",
          data
        });
        if (result && result.code == 0) {
          this.$router.push("dutyLotteryList");
        }
      }
    },
    //拼接字符串
    newStr(str, n) {
      let newStr = str.slice(0, str.length - n) + "-" + str.slice(-n);
      return newStr;
    },
    timeMinchange(data, hour, min) {
      let m;
      let a = 0;
      let b = parseInt(hour * 60);
      let c = parseInt(min * 1);
      m = a + b + c;
      return m;
    },
    // 分钟转为小时-分钟
    timeStamp(arr) {
      const results = [];
      arr.forEach(minutes => {
        results.push([
          parseInt(minutes / 60 / 24), // 天
          parseInt(minutes / 60), // 小时
          parseInt(minutes % 60), // 分钟
        ]);
      })
      return results;
    },
    // 取消按钮
    cancel() {
      this.$router.push({
        name: "dutyLotteryList"
      });
    },
    // 基础信息责任类型change事件
    changeType() {},
    //非会员责任设置change事件
    changeForm(val) {
      console.log(val);
      this.form = val;
      //this.form = JSON.parse(JSON.stringify(val));
      // let array = Object.keys(val);
      // console.log(array);
    }
  }
};
</script>

<style lang="less" scoped>
@import "./less/index";
.wrapper {
  padding: 10px;
}
.flex-wrap {
  display: flex;
  align-items: center;
}
.flex-wrap-tag {
  margin: 0 10px;
}
</style>