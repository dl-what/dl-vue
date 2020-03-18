<template>
  <div class="vlt-card" style="padding-top:10px;">
    <div class="MemberIntegral">
      <search-bar :options="MemberIntegralOptions" @search="search" :total="total" labelWidth="6em">
        <controlBar
          slot="extend-bar"
          @select="MemberIntegralBtn"
          :options="MemberIntegralBtnOption"
          position="left"
        ></controlBar>
      </search-bar>
      <el-table ref="memberEquityTable" :data="integralTabelData" tooltip-effect="dark" border>
        <el-table-column type="index" label="序号" width="60" fixed></el-table-column>
        <el-table-column prop="ruleCode" label="规则编号" min-width="120px"></el-table-column>
        <el-table-column prop="ruleType" label="规则类型" show-overflow-tooltip min-width="160px">
          <template slot-scope="scope">{{integralType(scope.row.ruleType)}}</template>
        </el-table-column>
        <el-table-column prop="ruleContent" label="规则内容" min-width="260" show-overflow-tooltip>
          <template slot-scope="scope">
            <p
              v-for="(item,index) in dataProcessing(scope.row.ruleType,scope.row)"
              :key="index"
            >{{item.text}}</p>
          </template>
        </el-table-column>
        

        <!-- <el-table-column prop="ruleStatus" label="状态" fixed="right" min-width="110">
          <template slot-scope="scope">
            <tableRowStatus
              :scope="scope"
              :tableData="integralTabelData"
              idField="ruleId"
              statusField="ruleStatus"
              :rowName="scope.row.name"
              :disabled="source?true:false"
              :option="{
                enable:{
                  apiName:'memberIntegralRuleStatusUpdate',
                  label:'启用',
                  value:1,
                  permission:'MemberIntegralManagement-enabl'
                },
               disable:{
                  apiName:'memberIntegralRuleStatusUpdate',
                  label:'冻结',
                  value:0,
                  permission:'MemberIntegralManagement-disab'
               },
              }"
            ></tableRowStatus>
          </template>
        </el-table-column> -->
        <el-table-column label="状态" min-width="120px">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.ruleStatus"
              v-has="'MemberIntegralManagementSwitch'"
              @change="changeStatus(scope.row)"
              :active-text="scope.row.ruleStatus==1?'启用':'冻结'"
              :inactive-value="0"
              :active-value="1"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="160">
          <template
            slot-scope="scope"
          >{{scope.row.createTime ? $moment(scope.row.createTime).format("YYYY-MM-DD HH:mm:ss"):''}}</template>
        </el-table-column>
        <el-table-column prop="handles" label="操作" fixed="right" min-width="120">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              :id="$route.name+'-'+'details'+scope.$index"
              @click="MemberIntegralDetail(scope.row)"
              v-has="'MemberIntegralManagement-detai'"
            >查看</el-button>
            <el-button
              type
              size="mini"
              :id="$route.name+'-'+'edit'+scope.$index"
              :disabled="source || scope.row.ruleStatus?true:false"
              v-has="'MemberIntegralManagement-detai'"
              @click="MemberIntegralWrite(scope.row)"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--弹框-->
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="45%"
      custom-class="intersest-dialog"
      :closed="close"
      :close-on-click-modal="false"
    >
      <memberPoin v-model="menberPoinData"></memberPoin>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="medium"
          @click="closeCancel"
          :id="$route.name+'-'+'cencel'+'-crtete'"
        >{{menberPoinData.type=== '查看'?'关闭':'取 消'}}</el-button>
        <el-button
          type="primary"
          size="medium"
          @click="dialogVisibleSubmit"
          :id="$route.name+'-'+'enter'+'-crtete'"
          v-if="menberPoinData.type != '查看'"
        >确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="有效期设置"
      :visible.sync="dataSettingDialog"
      width="45%"
      class="intersest-dialog"
      :closed="close"
      :close-on-click-modal="false">
      <div class="vlt-edit-single">
        <div class="vlt-edit-wrap">
        <el-form ref="form" :model="form" :rules="rules" label-width="7em">
          <el-form-item label="当前有效期">
            <el-input type="text" disabled v-model="nowDate"></el-input>
          </el-form-item>
          <!-- <el-form-item label="设置有效期">
            <el-radio-group v-model="form.effective" style="margin-top:15px;">
              <el-radio :label="0">永久有效</el-radio>
              <div>
                <el-radio :label="1">
                  每自然年
                  <el-date-picker
                    size="small"
                    v-model="form.effectiveTime"
                    type="datetime"
                    placeholder="选择日期时间"
                    default-time="12:00:00"
                    :picker-options="completeTime"
                  ></el-date-picker>
                </el-radio>
              </div>
            </el-radio-group>
          </el-form-item> -->
          <el-form-item label="有效期类型" prop="effective">
            <el-radio-group v-model="form.effective">
              <el-radio label="0">永久有效</el-radio>
              <el-radio label="1">每自然年</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="有效期时间" v-if="form.effective==1" prop="">
            <el-date-picker
              v-model="form.effectiveTime"
              type="datetime"
              placeholder="选择有效期时间"
              default-time="12:00:00"
              :picker-options="completeTime"
            ></el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="medium" @click="effectiveTimeCencle " :id="$route.name+'-'+'cencel'+'-date'">取 消</el-button>
          <el-button
            size="medium"
            type="primary"
            @click="dataSettingSubmit"
            :id="$route.name+'-'+'enter'+'-date'"
          >确 定</el-button>
        </div>
       </div>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import rules from "@/utils/rules.js";
import memberPoin from "./MemberPointManagement/MemberPointDialog";
export default {
  name: "MemberIntegralManagement",
  data() {
    return {
      dialogVisible: false,
      dataSettingDialog: false,
      nowDate: null,
      completeTime: {
        disabledDate: time => {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      form: {
        effective: '0',
        effectiveTime: ''
      },
      rules: {
        effective: [
          {required: true, message: '有效期类型不能为空', triggle: ['change']}
        ],
        effectiveTime: [
          {required: true, message: '有效期时间不能为空', triggle: ['change']}
        ],
      },
      menberPoinData: {
        register: {
          baseRule: {
            growth: null
          }
        },
        login: {
          rules: [],
          baseRule: {
            growth: null
          }
        },
        recharge: {
          baseRule: {
            recharge: null,
            growth: null
          },
          rules: []
        },
        consume: {
          baseRule: {
            consume: null,
            growth: null
          },
          rules: []
        },
        loginTime: {
          baseRule: {
            duration: null,
            growth: null
          },
          rules: []
        },
        suggestedFeedback: {
          baseRule: {
            growth: null
          },
          limitRules: {
            count: null
          }
        },
        integral: null,
        ruleType: null,
        type: null,
        value: null,
        options: [
          { label: "消费送积分", value: 1 },
          { label: "注册送积分", value: 3 },
          { label: "充值送积分", value: 2 },
          { label: "登录送积分", value: 4 },
          { label: "登录时长送积分", value: 5 },
          { label: "建议反馈送积分", value: 6 }
        ],
        detailsList: [
          { title: "规则编号 :", value: "", prop: "ruleCode" },
          { title: "规则类型 :", value: "", prop: "ruleType" },
          { title: "更新人 :", value: "", prop: "updateName" },
          { title: "更新时间 :", value: "", prop: "updateTime" }
        ]
      },
      MemberIntegralOptions: [
        {
          type: "input",
          prop: "ruleType",
          value: "",
          title: "规则类型",
          placeholder: "请输入"
        },
        {
          type: "select",
          prop: "ruleStatus",
          value: "",
          title: "状态",
          options: [{ label: "启用", value: 1 }, { label: "冻结", value: 0 }],
          placeholder: "请输入"
        }
      ],
      MemberIntegralBtnOption: [
        {
          name: "有效期设置",
          type: "primary",
          icon: "plus",
          permission: "MemberIntegralManagement-valid"
        }
      ],
      integralTabelData: [],
      page: 1,
      pageSize: 10,
      searchForm: {},
      total: 0,
      rulesId: 0,
      dataId: null,
      source: null,
      title: '编辑会员积分管理',
    };
  },
  created() {
    this.source = this.$route.query.source;
    this.init();
    this.dateSetting();
  },
  components: {
    memberPoin
  },
  methods: {
    // 修改状态
    memberIntegralRuleStatusUpdate(data) {
      const self = this;
      (async data => {
        let res = await self.$api.memberIntegralRuleStatusUpdate({ data });
        if (res && res.code == 0) {
          // self.tableData = res.data.records;
          self.$message.success("修改成功");
          // self.getGameTypeList(self.params)
        }
      })(data);
    },
    changeStatus(val) {
      const self = this;
      let text = val.ruleStatus==1?'启用': '冻结';
      self.$confirm(`此操作将状态变更为${text}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.item = val;
        let data = {
          ruleId: val.ruleId,
          ruleStatus: val.ruleStatus,
        };
        self.memberIntegralRuleStatusUpdate(data);
      }).catch(() => {
        self.$message({
          type: 'warning',
          message: '已取消'
        }); 
        val.ruleStatus = val.ruleStatus==1?0:1;         
      });
    },
    init(val) {
      const self = this;
      (async val => {
        let data = {
          page: val || 1,
          pageSize: 10,
          param: {
            ...self.searchForm
          }
        };
        let res = await self.$api.findPage({ data });
        if (res && res.code === 0) {
          self.page = res.data.current;
          self.pageSize = res.data.size;
          self.total = res.data.total;
          self.integralTabelData = res.data.records;
        }
      })(val);
    },

    dateSetting() {
      (async () => {
        let res = await this.$api.integralEffectiveSetQuery();
        if (res && res.code === 0) {
          if (!res.data) {
            this.$alert(
              "检测到您未设置会员积分有效期，请您前往设置！",
              "提示",
              {
                confirmButtonText: "确定",
                callback: action => {
                  this.$message({
                    type: "info",
                    message: `关闭提示！`
                  });
                }
              }
            );
            this.nowDate = "当前未设置有效期";
          } else {
            this.dataId = res.data.id;
            if (res.data.effectiveTime) {
              this.nowDate = "每自然年：" + res.data.effectiveTime;
            } else {
              this.nowDate = "永久有效";
            }
          }
        }
      })();
    },
    search(val) {
      this.searchForm = { ...val };
      this.init();
    },
    effectiveTimeCencle() {
      this.dataSettingDialog = false;
    },
    close() {
      this.menberPoinData.type = null;
      this.menberPoinData.ruleType = null;
      this.menberPoinData.currentBtn = null;
    },
    closeCancel() {
      this.dialogVisible = false;
      this.clearForm(
        this.menberPoinData[this.getNowStatus(this.menberPoinData.ruleType)]
      );
      this.menberPoinData.currentBtn = null;
    },
    //按钮类型选择
    MemberIntegralBtn(val) {
      if (val.name == "有效期设置") {
        this.dateSetting();
        this.dataSettingDialog = true;
      }
    },
    dataSettingSubmit() {
      let form = JSON.parse(JSON.stringify(this.form));
      let effectiveTime = this.$moment(form.effectiveTime).format(
        "MM-DD HH:mm:ss"
      );
      let data = {
        ...form,
        effectiveTime,
        id: this.dataId
      };
      if (data.effective == 1) {
        if (!this.form.effectiveTime) {
          this.$message.warning("请设置有效期！");
          return;
        }
      }
      if (data.effective == 0) {
        delete data.effectiveTime;
      }

      (async () => {
        let res = await this.$api.effectiveSet({
          message: "有效期设置成功！",
          data
        });
        if (res && res.code === 0) {
          this.dataSettingDialog = false;
          this.form.effective = 0;
          this.form.effectiveTime = null;
        }
      })();
    },
    integralType(val) {
      let option = {
        1: "消费送积分",
        2: "充值送积分",
        3: "注册送积分",
        4: "登录送积分",
        5: "登录时长送积分",
        6: "建议反馈送积分"
      };
      return option[val];
    },
    dataProcessing(type, option) {
      switch (type) {
        case 6:
          var options = [];
          options = [
            {
              text:
                "基本规则*每次成功提交建议反馈，赠送" +
                (option.suggestedFeedback.baseRule.growth
                  ? option.suggestedFeedback.baseRule.growth
                  : 0) +
                "积分"
            },
            {
              text:
                "限制规则*每人每天最多可获得" +
                (option.suggestedFeedback.limitRules.count
                  ? option.suggestedFeedback.limitRules.count
                  : 0) +
                "次"
            }
          ];
          return options;
        case 1:
          var options = [];
          options = [
            {
              text:
                "基本规则*每天消费满" +
                (option.consume.baseRule.consume
                  ? option.consume.baseRule.consume
                  : 0) +
                "元，赠送" +
                (option.consume.baseRule.growth
                  ? option.consume.baseRule.growth
                  : 0) +
                "积分"
            }
          ];
          return options;
        case 2:
          var options = [];
          options = [
            {
              text:
                "基本规则*每充值" +
                (option.recharge.baseRule.recharge
                  ? option.recharge.baseRule.recharge
                  : 0) +
                "元，加" +
                (option.recharge.baseRule.growth
                  ? option.recharge.baseRule.growth
                  : 0) +
                "积分"
            }
          ];
          return options;
        case 3:
          var options = [];
          options = [
            {
              text:
                "基本规则*注册会员成功，增加" +
                (option.register.baseRule.growth
                  ? option.register.baseRule.growth
                  : 0) +
                "积分"
            }
          ];
          return options;
        case 4:
          var options = [];
          options = [
            {
              text:
                "基本规则*每日登录增加" +
                (option.login.baseRule.growth
                  ? option.login.baseRule.growth
                  : 0) +
                "积分"
            }
          ];
          return options;
        case 5:
          var options = [];
          options = [
            {
              text:
                "基本规则*每次登录时长满" +
                (option.loginTime.baseRule.duration
                  ? option.loginTime.baseRule.duration
                  : 0) +
                "分钟，加" +
                (option.loginTime.baseRule.growth
                  ? option.loginTime.baseRule.growth
                  : 0) +
                "积分"
            }
          ];
          return options;
        default:
          break;
      }
    },
    clearForm(val) {
      for (let key in val) {
        if (key === "rules") {
          val[key] = [];
        } else {
          for (let k in val[key]) {
            val[key][k] = null;
          }
        }
      }
    },
    MemberIntegralDetail(row) {
      const self = this;
      this.title = self.integralType(row.ruleType);
      (async row => {
        let type = self.getNowStatus(row.ruleType);
        let res = await self.$api.memberIntegralRuleDetails({
          data: row.ruleId
        });
        if (res && res.code === 0) {
          self.menberPoinData.detailsList.forEach(item => {
            if (item.prop != "createTime") {
              item.value = res.data[item.prop];
            }
            self.menberPoinData[type] = res.data[type];
            if (item.prop === "createTime") {
              item.value = self
                .$moment(res.data[item.prop])
                .format("YYYY-MM-DD HH:mm:ss");
            }
            if (item.prop === "ruleType") {
              item.value = this.integralType(res.data[item.prop]);
            }
          });
        }
      })(row);
      this.menberPoinData.currentBtn = null;
      this.menberPoinData.type = "查看";
      this.menberPoinData.ruleType = row.ruleType;
      setTimeout(() => {
        this.dialogVisible = true;
      }, 0);
    },
    MemberIntegralWrite(val) {
      let data = JSON.parse(JSON.stringify(val));
      let type = this.getNowStatus(data.ruleType);
      this.menberPoinData[type] = data[type];
      this.rulesId = data.ruleId;
      this.menberPoinData.type = null;
      this.menberPoinData.ruleType = data.ruleType;
      this.dialogVisible = true;
    },
    getNowStatus(key) {
      let option = {
        1: "consume",
        2: "recharge",
        3: "register",
        4: "login",
        5: "loginTime",
        6: "suggestedFeedback"
      };
      return option[key];
    },
    dialogVisibleSubmit() {
      const self = this;
      let type = self.getNowStatus(this.menberPoinData.ruleType);
      let data = {
        ruleType: this.menberPoinData.ruleType,
        ruleStatus: 1
      };
      data[type] = { ...this.menberPoinData[type] };
      for (let key in data[type]) {
        for (let k in data[type][key]) {
          if (data[type][key][k] == null || data[type][key][k] == "") {
            data[type][key][k] = 0;
          }
        }
      }
      if (this.menberPoinData.type != "查看") {
        (async data => {
          data.ruleId = this.rulesId;
          let res = await self.$api.update({ message: "积分编辑成功！", data });
          if (res && res.code === 0) {
            this.dialogVisible = false;
            this.menberPoinData.currentBtn = null;
            this.clearForm(
              this.menberPoinData[
                this.getNowStatus(this.menberPoinData.ruleType)
              ]
            );
            this.init();
          }
        })(data);
      } else {
        this.menberPoinData.type = null;
        this.dialogVisible = false;
      }
    }
  },
  computed: {
    value() {
      return this.menberPoinData.value;
    },
    ruleType: {
      set(val) {
        this.menberPoinData.ruleType = val;
      },
      get(val) {
        return this.menberPoinData.ruleType;
      }
    }
  },
  watch: {
    value(newvalu, oldval) {
      this.ruleType = newvalu;
    }
  }
};
</script>

<style lang="less" scoped>
.el-dialog {
  border-radius: 10px;
  .el-dialog__body {
    padding: 10px;
  }
  .el-input__inner {
    padding-left: 40px;
  }
}
.vlt-edit-wrap{
  width: 520px;
  margin: auto;
  padding-top: 0;
  padding-bottom: 0;
}
.dialog-footer{
  padding: 20px 0 10px;
  text-align: right;
}
</style>
<style lang="less">
.intersest-dialog{
  .el-dialog{
    min-width: 600px;
  }
}
</style>
