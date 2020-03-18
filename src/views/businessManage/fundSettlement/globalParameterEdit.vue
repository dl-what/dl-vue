<template>
  <div class="vlt-card fund-edit">
    <el-form class="comp-item" :model="form" ref="ruleForm" label-width="140px">
      <div class="vlt-edit-over">
        <h2 class="title">基础信息</h2>
        <div class="vlt-edit-wrap fund-edit-double">
          <el-row>
            <el-col :span="8">
              <el-form-item label="代销费率">
                <el-input v-model="form.generationRate" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="弃奖设置">
                <el-input v-model="form.abandonmentSetting" placeholder="请输入"></el-input>
                <p class="wraning">T(+1)天未兑奖视为弃奖，弃奖资金归入“公益金”</p>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="游戏兑换比例">
                <el-input v-model="form.gameConPro" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="生效时间">
                <el-date-picker v-model="form.effectiveTime" type="datetime" placeholder="选择日期"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="vlt-edit-over">
        <h2 class="title">返奖率-调节基金</h2>
        <div class="vlt-edit-wrap fund-edit-normal">
          <el-form-item label="返奖率：">
            <el-input v-model="form.returnRate" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="调节基金：">
            <el-input v-model="form.regulationFund" placeholder="请输入"></el-input>
          </el-form-item>
        </div>
      </div>
      <div class="vlt-edit-over">
        <h2 class="title">发行经费</h2>
        <div class="vlt-edit-wrap fund-edit-normal">
          <el-form-item label="发行经费占比">
            <el-input v-model="lssueFundPro" placeholder="请输入" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="中福彩中心：">
            <el-input v-model="form.lssueLotteryCenter" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="省级福彩中心：">
            <el-input v-model="form.lssueProCenter" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="市级福彩中心：">
            <el-input v-model="form.lssueMunCenter" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="销售厅：">
            <el-input v-model="form.lssueSalesHall" placeholder="请输入"></el-input>
          </el-form-item>
        </div>
      </div>
      <div class="vlt-edit-over">
        <h2 class="title">公益金</h2>
        <div class="vlt-edit-wrap fund-edit-normal">
          <el-form-item label="公益金占比：">
            <el-input v-model="publicFundPro" placeholder="请输入" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="中福彩中心：">
            <el-input v-model="form.publicLotteryCenter" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="省级福彩中心：">
            <el-input v-model="form.publicProCenter" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="市级福彩中心：">
            <el-input v-model="form.publicMunCenter" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="销售厅：">
            <el-input v-model="form.publicSalesHall" placeholder="请输入"></el-input>
          </el-form-item>
        </div>
      </div>
      <div class="vlt-edit-over">
        <h2 class="title">纳税</h2>
        <div class="vlt-edit-wrap add-wrap">
          <el-form-item
            class="computed"
            v-for="(item, index) in form.taxRate"
            :key="item.id"
            :name="index"
          >
            <el-input v-model="item.balance1" placeholder="请输入"></el-input>至
            <el-input v-model="item.balance2" placeholder="请输入"></el-input>税率：
            <el-input v-model="item.toTax" placeholder="请输入"></el-input>
            <span class="btn-clear" @click="deleteResource(index)">
              <i class="el-icon-remove-outline"></i>
            </span>
          </el-form-item>
          <el-button size="medium" class="add-item vlt-add-more" @click="addResource">
            <i class="el-icon-plus"></i> 新增规则（左开右闭区间）
          </el-button>
        </div>
      </div>

      <el-form-item size="large" class="submit-item">
        <el-button type="primary" size="small" @click="onSubmit" :loading="showLoad">提交</el-button>
        <el-button size="small">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/javascript">
import rules from "@/utils/rules";
import moment from "moment";
export default {
  name: "",
  data() {
    return {
      showLoad: false,
      params: {},
      form: {
        gameConPro: "",
        effectiveTime: "",
        generationRate: "",
        lssueFundPro: "",
        lssueLotteryCenter: "",
        lssueMunCenter: "",
        lssueProCenter: "",
        lssueSalesHall: "",
        publicFundPro: "",
        publicLotteryCenter: "",
        publicMunCenter: "",
        publicProCenter: "",
        publicSalesHall: "",
        regulationFund: "",
        returnRate: "",
        status: "",
        abandonmentSetting: "",

        taxRate: [
          {
            id: 0,
            balance1: "",
            balance2: "",
            toTax: ""
          },
          {
            id: 1,
            balance1: "",
            balance2: "",
            toTax: ""
          }
        ]
      }
    };
  },
  created() {
    this.init();
  },
  computed: {
    lssueFundPro() {
      return (this.form.lssueFundPro =
        parseInt(this.form.lssueLotteryCenter) +
        parseInt(this.form.lssueProCenter) +
        parseInt(this.form.lssueMunCenter) +
        parseInt(this.form.lssueSalesHall) +
        "%");
    },
    publicFundPro() {
      return (this.form.publicFundPro =
        parseInt(this.form.publicLotteryCenter) +
        parseInt(this.form.publicProCenter) +
        parseInt(this.form.publicMunCenter) +
        parseInt(this.form.publicSalesHall) +
        "%");
    }
  },
  watch: {
    form: {
      handler(newValue, oldValue) {
        Object.assign(this.params, newValue);
        let res = JSON.parse(JSON.stringify(newValue.taxRate));
        let params = [];
        res.forEach(item => {
          let param = (({ id, balance1, balance2, toTax }) => ({
            id,
            balance1,
            balance2,
            toTax
          }))(item);
          params.push(param);
        });
      },
      deep: true
    }
  },
  methods: {
    async init() {
      let res = await this.$api.getParameterDetail({ data: "0" });
      if (res.code === 0) {
        let formKey = Object.keys(this.form);
        let resKey = Object.keys(res.data);
        for (let index of formKey) {
          resKey.forEach(key => {
            if (index === key) {
              this.form[index] = res.data[key];
            }
          });
        }
      }
    },
    async onSubmit() {
      this.showLoad = true;
      let data = this.form;
      data.id = "0";
      data.effectiveTime = moment(data.effectiveTime).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      let res = await this.$api.editFundsParameter({ data });
      if (res.code === 0) {
        alert(res.msg);
        this.$router.push({ name: "fundParameter" });
      } else {
      }
      this.showLoad = false;
    },

    deleteResource(index) {
      if (this.form.taxRate.length < 2) {
        return;
      }
      this.form.taxRate.splice(index, 1);
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    addResource() {
      let aTaxRate = this.form.taxRate;
      let newTaxRate = {
        id: aTaxRate[aTaxRate.length - 1].id + 1,
        balance1: "",
        balance2: "",
        toTax: ""
      };

      this.form.taxRate.push(newTaxRate);
    }
  }
};
</script>

<style lang="less">
.fund-edit {
  .el-form {
    .vlt-edit-over {
      width: 100%;
    }
    .vlt-edit-wrap {
      width: 100%;
      padding-left: 100px;
      .el-form-item {
        max-width: 460px;
        margin: 0 50px 20px 0;
        .el-form-item__label {
          line-height: 40px;
        }
      }
      &.fund-edit-double {
        .el-row {
          width: 100%;
        }
        .el-form-item {
          max-width: 320px;
          margin: 0 70px 20px 0;
          .el-form-item__label {
            text-align: left;
          }
          .el-form-item__content {
            margin-left: 0 !important;
          }
          .wraning {
            position: absolute;
            left: 340px;
            bottom: 0;
            width: 400px;
            font-size: 12px;
            color: #000000a5;
          }
        }
      }
      &.add-wrap {
        width: 500px;
        margin-left: 120px;
        padding-left: 0;
        margin-right: 0;
        .computed {
          width: 400px;
        }
        .el-form-item__content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          margin-left: 0 !important;
          color: #000000a5;
          font-size: 12px;
          .btn-clear {
            font-size: 20px;
            color: #dcdfe6;
            cursor: pointer;
          }
        }
        .el-input {
          width: 80px;
        }
        .add-item {
          padding: 8px 10px;
          width: 400px;
          text-align: center;
          border: 1px dashed #ccc;
          cursor: pointer;
          font-size: 12px;
          color: #000000a5;
        }
      }
    }
  }
  .submit-item {
    margin-top: 50px;
  }
}
</style>
