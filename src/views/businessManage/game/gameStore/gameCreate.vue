<template>
  <div class="vlt-card" ref="main">
    <el-steps :active="active" align-center class="step-wrap">
      <el-step title="基础信息" icon="el-icon-edit"></el-step>
      <el-step title="上传游戏包" icon="el-icon-monitor"></el-step>
      <el-step title="游戏配置" icon="el-icon-setting"></el-step>
      <el-step title="上传附件" icon="el-icon-paperclip"></el-step>
    </el-steps>
    <!-- 基础信息 -->
    <div v-show="active==0" class="wrap">
      <panel title="游戏基本信息" :show="true" style="margin-bottom:15px">
        <div class="vlt-edit-single">
          <div class="vlt-edit-wrap">
            <game-info v-model="form.gameInfoVo" ref="gameInfo"></game-info>
          </div>
        </div>
      </panel>
      <panel title="开发商信息" :show="true" style="margin-bottom:15px">
        <div class="vlt-edit-single">
          <div class="vlt-edit-wrap">
            <developer-info v-model="form.developerInfoVo" ref="developerInfoVo"></developer-info>
          </div>
        </div>
      </panel>
      <el-row class="vlt-edit-btn">
        <el-button
          size="medium"
          @click="back"
          class="cancel"
          :id="$route.name+'-create-goBack-'"
        >返 回</el-button>
        <el-button
          type="primary"
          v-prevent="1000"
          size="medium"
          @click="next('0')"
          :id="$route.name+'-create-next-'"
        >下一步</el-button>
      </el-row>
    </div>
    <!-- 上传游戏包 -->
    <div v-show="active==1" class="wrap">
      <panel title="游戏客户端（全量包）" :show="true" style="margin-bottom:15px">
        <div class="vlt-edit-single">
          <div class="vlt-edit-wrap">
            <terminal-upload-all v-model="form.softwareInfoVoList[0]" ref="terminalAll"></terminal-upload-all>
          </div>
        </div>
      </panel>
      <panel title="游戏客户端（增量包）" :show="true" style="margin-bottom:15px">
        <div class="vlt-edit-single">
          <div class="vlt-edit-wrap">
            <terminal-upload v-model="form.softwareInfoVoList[1]" ref="terminal"></terminal-upload>
          </div>
        </div>
      </panel>
      <panel title="游戏逻辑包" :show="true" style="margin-bottom:15px">
        <div class="vlt-edit-single">
          <div class="vlt-edit-wrap">
            <server-upload v-model="form.softwareInfoVoList[2]" ref="server"></server-upload>
          </div>
        </div>
      </panel>
      <panel title="游戏包信息" :show="true" style="margin-bottom:15px">
        <div class="vlt-edit-single">
          <div class="vlt-edit-wrap">
            <el-form label-position="right" 
              label-width="90px" 
              ref="form"
              :model="soft"
              :rules="rules"
              class="soft-form">
              <el-form-item label="软件描述" prop="softwareDesc">
                <el-input v-model="soft.softwareDesc" type="textarea" :autosize="{ minRows: 3, maxRows: 8}" placeholder="请输入软件描述" maxlength="150"></el-input> 
              </el-form-item>
              <el-form-item label="新版特性" prop="newFeatures">
                <el-input v-model="soft.newFeatures" type="textarea" :autosize="{ minRows: 3, maxRows: 8}" placeholder="请输入新版特性" maxlength="150"></el-input> 
              </el-form-item>
            </el-form>
          </div>
        </div>
      </panel>
      <el-row class="vlt-edit-btn">
        <el-button
          size="medium"
          @click="prev"
          class="cancel"
          :id="$route.name+'-server-upload-prev'"
        >上一步</el-button>
        <el-button
          type="primary"
          v-prevent="1000"
          size="medium"
          @click="next('1')"
          :id="$route.name+'-server-upload-next'"
        >下一步</el-button>
      </el-row>
    </div>
    <!-- 游戏配置 -->
    <div v-show="active==2" class="wrap">
      <el-form
        label-position="right"
        label-width="7em"
        :model="form.gameRuleVo"
        :rules="rules"
        ref="form"
        class="baseInfo">
      <panel title="游戏配置" :show="true" style="margin-bottom:15px">
        <div class="vlt-edit-single">
          <div class="vlt-edit-wrap">
            
              <el-form-item label="配置编码" prop="deployCode">
                <el-input
                  v-model="form.gameRuleVo.deployCode"
                  placeholder="请输入配置编码"
                  maxlength="8"
                  show-word-limit
                ></el-input>
              </el-form-item>
          </div>
        </div>
      </panel>
      <panel title="游戏基础规则" :show="true" style="margin-bottom:15px">
        <div class="vlt-edit-double">
          <div class="vlt-edit-wrap">
            <game-rules v-model="form.gameRuleVo" ref="gameRules"></game-rules>
          </div>
        </div>
      </panel>
      <panel
        title="资金规则"
        tips="固定奖返奖率+奖池返奖率+调节基金比率+总发行经费比率+总公益金比率=100%"
        :show="true"
        style="margin-bottom:15px"
      >
        <div class="vlt-edit-double">
          <div class="vlt-edit-wrap">
            <funds-rules v-model="form.gameFundRuleVo" ref="fundsRules"></funds-rules>
          </div>
        </div>
      </panel>
      <panel
        title="奖池规则"
        tips="固定奖返奖率+奖池返奖率+调节基金比率+总发行经费比率+总公益金比率=100%"
        :show="true"
        style="margin-bottom:15px"
      >
        <div class="vlt-edit-single">
          <div class="vlt-edit-wrap">
            <jackpot-rules v-model="form" ref="jackpotRules"></jackpot-rules>
          </div>
        </div>
      </panel>
      <panel title="投注规则" :show="true" style="margin-bottom:15px">
        <div class="vlt-edit-single">
          <div class="vlt-edit-wrap">
            <betting-rules v-model="form.gameBettingRuleVo" ref="bettingRules"></betting-rules>
          </div>
        </div>
      </panel>
      <panel title="风控规则" :show="true" style="margin-bottom:15px">
        <div class="vlt-edit-single">
          <div class="vlt-edit-wrap">
            <risk-rules v-model="form.gameRiskRuleVo" ref="riskRules"></risk-rules>
          </div>
        </div>
      </panel>
      <panel title="大小奖设置" tips="局游戏小奖自动返奖 不受下面参数控制" :show="true" style="margin-bottom:15px">
        <div class="vlt-edit-single">
          <div class="vlt-edit-wrap">
            <maxmin-rules v-model="form" ref="maxminRules"></maxmin-rules>
          </div>
        </div>
      </panel>
      <panel title="服务器分配设置" :show="true" style="margin-bottom:15px">
        <div class="vlt-edit-single">
          <div class="vlt-edit-wrap">
            <server-rules v-model="form.gameRuleVo" ref="serverRules"></server-rules>
          </div>
        </div>
      </panel>
      <panel title="自定义设置" :show="true" style="margin-bottom:15px">
        <div class="vlt-edit-single">
          <div class="vlt-edit-wrap">
            <!-- <custom-rules v-model="form.gameRuleVo"></custom-rules> -->
            <!-- prop="deployCode" -->
            <el-form-item label="自定义设置" prop="customSettings">
              <el-input
                v-model="form.gameRuleVo.customSettings"
                placeholder="请输入自定义设置"
                type="textarea" 
                :autosize="{ minRows: 3, maxRows: 10}"
                maxlength="1500"
              ></el-input>
            </el-form-item>
          </div>
        </div>
      </panel>
       </el-form>
      <el-row class="vlt-edit-btn">
        <el-button
          size="medium"
          @click="prev"
          class="cancel"
          :id="$route.name+'-custom-rules-prev'"
        >上一步</el-button>
        <el-button
          type="primary"
          v-prevent="1000"
          size="medium"
          @click="next('2')"
          :id="$route.name+'-custom-rules-next'"
        >下一步</el-button>
      </el-row>
    </div>
    <!-- 上传附件 -->
    <div class="wrap" v-show="active==3">
      <panel title="上传附件" :show="true" style="margin-bottom:15px">
        <div class="vlt-edit-single">
          <div class="vlt-edit-wrap">
            <upload-files v-model="form.gameInfoVo"></upload-files>
          </div>
        </div>
      </panel>
      <el-row class="vlt-edit-btn">
        <el-button
          size="medium"
          @click="prev"
          class="cancel"
          :id="$route.name+'-upload-files-prev'"
        >上一步</el-button>
        <el-button
          type="primary"
          v-prevent="1000"
          size="medium"
          @click="submit"
          :id="$route.name+'-upload-files-prev'"
        >提 交</el-button>
      </el-row>
    </div>
  </div>
</template>

<script type="text/javascript">
import rules from "@/utils/rules.js";
import { mapGetters } from "vuex";
import GameInfo from "../components/gameInfo";
import DeveloperInfo from "../components/developerInfo";
import TerminalUpload from "../components/terminalUpload";
import TerminalUploadAll from "../components/terminalUploadAll";
import ServerUpload from "../components/serverUpload";
import GameRules from "../components/rulesGame";
import BettingRules from "../components/rulesBetting";
import RiskRules from "../components/rulesRisk";
import JackpotRules from "../components/rulesJackpot";
import FundsRules from "../components/rulesFunds";
import MaxminRules from "../components/rulesMaxMin";
import ServerRules from "../components/rulesServer";
import CustomRules from "../components/rulesCustom";
import UploadFiles from "../components/uploadFiles";

export default {
  name: "gameCreate",
  components: {
    GameInfo,
    DeveloperInfo,
    TerminalUpload,
    TerminalUploadAll,
    ServerUpload,
    GameRules,
    BettingRules,
    RiskRules,
    JackpotRules,
    FundsRules,
    MaxminRules,
    ServerRules,
    CustomRules,
    UploadFiles
  },
  data() {
    return {
      active: 0,
      addUpload: true,
      soft: {
        softwareDesc: null,
        newFeatures: null,
      },
      form: {
        isPlayGame: 0, // 是否试玩(0-否 1-是)
        gameInfoVo: {
          // 游戏信息 （参数）
          gameName: null, // 游戏名称
          gameCode: null, // 游戏编码
          gameType: null, // 游戏类型
          gameIcon: null, // 游戏图标
          gameDesc: null, // 游戏简介
          gameGenlot: null, // 版权归属
          filePath: null,
          createBy: this.$storage.get("userInfo").userId
        },
        developerInfoVo: {
          // 开发商  （参数）
          developerName: null, // 开发商名称
          person: null, // 联系人
          cellPhone: null, // 手机号码
          email: null, // 电子邮箱
          faxPhone: null, // 传真电话
          address: null, // 联系地址
          createUser: this.$storage.get("userInfo").userId
        },
        softwareInfoVoList: [
          // 游戏包  （参数）
          {
            // 客户端（全量包）的参数 1
            fileMd5: null, // 客户端加密
            filePath: null, // 路径
            softwareType: 1, //
            softwareName: null, // 软件名称
            versionNumber: null, // 版本号
            softwareSize: null, // 软件大小
            softwareDesc: null, // 软件描述
            newFeatures: null, // 新版特性
            createUser: this.$storage.get("userInfo").userId
          },
          {
            // 客户端（增量包）的参数 2
            fileMd5: null, // 客户端加密
            filePath: null, // 路径
            softwareType: 2, //
            softwareName: null, // 软件名称
            versionNumber: null, // 版本号
            softwareSize: null, // 软件大小
            softwareDesc: null, // 软件描述
            newFeatures: null, // 新版特性
            createUser: this.$storage.get("userInfo").userId
          },
          {
            // 服务端的参数 3
            filePath: null, // 路径
            softwareType: 3, //
            softwareName: null, // 软件名称
            versionNumber: null, // 版本号
            softwareSize: null, // 软件大小
            softwareDesc: null, // 软件描述
            newFeatures: null, // 新版特性
            createUser: this.$storage.get("userInfo").userId
          }
        ],
        gameRuleVo: {
          // 游戏规则（参数）
          deployCode: null, // 配置编码,
          gameSubType: null, //游戏子状态(0-标准 1-新上市 2-推荐 3-促销)
          startSaleDate: null, // 开售日期
          endSaleDate: null, //停售日期
          saleAuthority: null, // 销售权限
          prizeAuthority: null, // 兑奖权限
          prizeRate: null, // 游戏兑换比例
          exchangeRate: null, // 保存用户输入1：100
          rewardRemindDays: null, // 兑奖提醒设置 （参数）
          endRedeemDays: null, // 弃奖天数（参数）
          endGamePointDays: null, // 游戏结束时点数的保存天数
          serverIpSet: null, // 服务器IP设置 （参数）
          customSettings: null, // 自定义设置 （参数）
          createBy: this.$storage.get("userInfo").userId
        },
        gameRiskRuleVo: {
          // 风控规则上传 （参数）
          startGearReturnRate: null, // 开始挡位返奖率
          minGearReturnRate: null, // 最小挡位返奖率
          maxGearReturnRate: null, // 最大挡位返奖率
          returnRateInterval: null, // 返奖率间隔
          gearAmount: null, // 挡位数量
          filePath: null, // 附件上传路径
          deployCode: null, // 配置编码
          createBy: null, // 创建人
          createBy: this.$storage.get("userInfo").userId
        },
        rewardLevelSetVoList: [], // 固定奖等级 （参数）
        rewardLevelSetVo: {
          // 固定奖（上传附件）
          filePath: null,
          rewardReturnRate: null, // 用于判断没有累计奖的情况下 奖池返奖率是否为0
          returnRate: null, // 固定奖返奖率
          createBy: this.$storage.get("userInfo").userId
        },
        gameRewardPoolVoList: [], // 累计奖等级  （参数）
        gameFundRuleVo: {
          // 资金规则 （参数）
          totalPublishRate: "", // 总发行经费占比
          totalWelfareRate: "", // 总公益金占比
          zhcPublishRate: "", // 中福彩发行费占比
          zhcWelfareRate: "", // 中福彩公益金占比
          proPublishRate: "", // 省福彩发行费占比
          proWelfareRate: "", // 省福彩公益金占比
          cityPublishRate: "", // 市福彩发行费占比
          cityWelfareRate: "", // 市福彩公益金占比
          marketPublishRate: "", // 销售厅发行费占比
          marketWelfareRate: "", // 销售厅公益金占比
          reFundStatus: 1, // 调节基金 1 关闭， 2开启
          reFundRate: "", // 调节基金
          createBy: this.$storage.get("userInfo").userId
        },
        gameBettingRuleVo: {
          // 投注规则 （参数）
          minAmount: "", // 单注最小金额
          minBets: "", // 最小投注数
          maxAmount: "", // 单注最大金额
          maxBets: "", // 最大投注数
          minAddBets: "", // 单次加注金额
          createBy: this.$storage.get("userInfo").userId
        },
        gameExchangeSetVoList: [] // 大小奖设置 （参数）
      },
      rules: {
        deployCode: [
          {
            required: true,
            validator: rules.checkPositive,
            title: "配置编码",
            triggle: ["change", "blur"]
          }
        ],
        // customSettings: [
        //   {
        //     required: true,
        //     message: "自定义设置不能为空",
        //     triggle: ["change", "blur"]
        //   }
        // ],
      },
      isGameRewardPoolVoList: false,
    };
  },
  created() {
    // this.getAllGameType()
  },
  watch: {
    active(val) {
      if (val == 0) {
        this.$refs.gameInfo.isManual = true;
      } else {
        this.$refs.gameInfo.isManual = false;
      }
    }
  },
  computed: {
    ...mapGetters(["gameTypeData"])
  },
  methods: {
    // 附件上传
    async uploadFileOther(files) {
      let formData = new FormData();
      console.log("files", files.file.size / 1024);
      // this.softData[3].value = `${(files.file.size/1024).toFixed()}`
      formData.append("file", files.file);
      formData.append("type", 1);
      const res = await this.$api.testUpload({
        timeout: 99999999999999,
        data: formData,
        onUploadProgress(evt) {
          let percent = ((evt.loaded / evt.total) * 100) | 0; //调用onProgress方法来显示进度条，需要传递个对象 percent为进度值
          files.onProgress({ percent: percent });
          console.log("上传进度事件:", evt);
        }
      });
      if (res && res.code == 0) {
        this.$message.success("上传成功");
        this.gameOtherPath.push(res.data.filePath);
      }
      console.log("uploadFile", res);
    },
    createGameStore(data) {
      const self = this;
      (async data => {
        let res = await self.$api.createGameStore({ data });
        if (res && res.code == 0) {
          self.$message.success("提交成功");
          self.$router.push({ path: "./gameList" });
        }
      })(data);
    },
    back() {
      this.$router.back();
    },
    validate(name) {
      let res = false;
      this.$refs[name].$refs.form.validate(valid => {
        res = valid;
      });
      return res;
    },
    prev() {
      this.$refs.main.scrollTop = 0;
      if (this.active-- < 1) this.active = 0;
    },
    next(flag) {
      console.log("参数", this.form);
      const self = this;
      if (flag == "0") {
        let checkGameInfo = self.validate("gameInfo");
        let checkDevelopInfo = self.validate("developerInfoVo");
        if (checkGameInfo && checkDevelopInfo) {
          // let param = {
          //   gameCode: self.form.gameInfoVo.gameCode,
          //   gameName: self.form.gameInfoVo.gameName,
          // };
          // self.checkGameIsExist(param)
          if (this.active++ > 3) this.active = 0;
        } else {
          self.$message.warning("校验不通过");
        }
      }
      if (flag == "1") {
        let obj = {};
        let codeArray = []; // 获取编码
        let sameName = false;
        this.form.softwareInfoVoList.forEach(item => {
          console.log(item.softwareName);
          if (item.softwareName != null) {
            if (item.softwareType == 1) {
              codeArray[0] = item.softwareName.split("-")[0];
            }
            if (item.softwareType == 2) {
              codeArray[1] = item.softwareName.split("-")[0];
            }
            if (item.softwareType == 3) {
              codeArray[2] = item.softwareName.split("-")[1];
            }
            if (!obj[item.softwareName]) {
              obj[item.softwareName] = item.softwareName;
            } else {
              sameName = true;
            }
          }
         
        });
        if (sameName) {
          self.$message.warning("包名不能重复");
          return;
        }
        let checkCode =
          codeArray[0] == codeArray[1] && codeArray[1] == codeArray[2];
        let reg = /^[_A-Za-z0-9]+$/.test(codeArray[0]);
        if (!checkCode || !reg) {
          this.$confirm(
            '游戏包和逻辑包的命名不符合规范，示例：夺宝奇兵游戏，游戏包全量命名：duobaoqibing-XXXX.gz；游戏包增量命名：duobaoqibing-XXXX.gz；逻辑包命名：XXXX-duobaoqibing-XXXX.jar；（试玩游戏包在"duobaoqibing"前面加_，示例：游戏包命名 _duobaoqibing-XXXX.gz）',
            "上传提示",
            {
              confirmButtonText: "我明白了",
              type: "warning"
            }
          )
            .then(() => {})
            .catch(() => {});
          return;
        } else {
          self.form.gameInfoVo.gameCode = codeArray[0];
        }
        let terminalAll = self.validate("terminalAll");
        let terminal = self.validate("terminal");
        let server = self.validate("server");
        if (terminalAll && terminal && server && checkCode && reg) {
          let param = {
            gameCode: self.form.gameInfoVo.gameCode,
            gameName: self.form.gameInfoVo.gameName
          };
          self.checkGameIsExist(param);
          // if (self.active++ > 3) self.active = 0;
        } else {
          self.$message.warning("校验不通过");
        }
      }
      if (flag == "2") {
        // if(self.form.gameRewardPoolVoList.length==0) {
        //   self.$confirm('因该游戏不设置累计奖池, 请将奖池返奖率设置为0，是否继续?', '提示', {
        //     confirmButtonText: '确定',
        //     cancelButtonText: '取消',
        //     type: 'warning'
        //   }).then(() => {
        //     this.isGameRewardPoolVoList = true;
            
        //   }).catch(() => {
        //     self.$message({
        //       type: 'warning',
        //       message: '已取消'
        //     });
        //     this.isGameRewardPoolVoList = false; 
        //   });
        // }else{
        //   this.isGameRewardPoolVoList = false;
        // }
        // self.form.gameRewardPoolVoList = [{ rewardReturnRate: 0, rewardPoolName: null, rewardPoolId: null, rewardPoolAmount: null}]

        // 用于判断没有累计奖的情况，奖池返奖率设置为0；
        if(self.form.gameRewardPoolVoList.length==0&&self.form.rewardLevelSetVo.rewardReturnRate!=0) {
          this.$message.warning('当前游戏未设置累计奖池, 请将奖池返奖率设置为0')
          return;
        }
        // 固定奖返奖率+奖池返奖率+调节基金比率+总发行经费比率+总公益金比率=100%
        let returnRates = self.form.rewardLevelSetVo.returnRate; // 固定奖返奖率
        let rewardReturnRate = self.form.gameRewardPoolVoList.length==0?0:self.form.gameRewardPoolVoList[0].rewardReturnRate; // 奖池返奖率
        let reFundRates = self.form.gameFundRuleVo.reFundRate; // 调节基金比率
        let totalPublishRate = self.form.gameFundRuleVo.totalPublishRate; // 总发行经费比率
        let totalWelfareRate = self.form.gameFundRuleVo.totalWelfareRate; // 总发行经费比率
        let totalRates =
          (returnRates * 100 +
          rewardReturnRate * 100 +
          reFundRates * 100 +
          totalPublishRate * 100 +
          totalWelfareRate * 100)/100;
        if (totalRates - 100 != 0) {
          this.$message.warning(
            "固定奖返奖率+奖池返奖率+调节基金比率+总发行经费比率+总公益金比率之和必须为100%"
          );
          return;
        }
        // 最大挡位返奖率 > 最小挡位返奖率
        if(self.form.gameRiskRuleVo.maxGearReturnRate-self.form.gameRiskRuleVo.minGearReturnRate<0){
          this.$message.warning('最大挡位返奖率必须大于最小挡位返奖率')
          return;
        } 
        // 累计奖池id校验
        let poolId = false;
        let obj = {};
        self.form.gameRewardPoolVoList.forEach(item => {
          if (!obj[item.rewardPoolId]) {
            obj[item.rewardPoolId] = item.rewardPoolId;
          } else {
            poolId = true;
          }
        });
        if (poolId) {
          self.$message.warning("累计奖池ID不能重复");
          return;
        }
        let gameRules = self.validate("gameRules");
        let fundsRules = self.validate("fundsRules");
        let jackpotRules = self.validate("jackpotRules");
        let bettingRules = self.validate("bettingRules");
        let maxminRules = self.validate("maxminRules");
        let riskRules = self.validate("riskRules");

        let deployCode;
        self.$refs.form.validate(valid => {
          deployCode = valid;
        });
        let prizeRate = false;
        if (self.form.gameRuleVo.prizeRate) {
          prizeRate = true;
        } else {
          self.$message.warning(
            "兑奖比例不能为空，游戏点数必须为10的倍数且游戏点数除于金额必须等于正整数"
          );
          return;
        }
        let reFundRate = false;
        if (self.form.gameFundRuleVo.reFundRate) {
          reFundRate = true;
        } else {
          self.$message.warning("调节基金比率不能为空");
          return;
        }
        if(self.form.gameRuleVo.endRedeemDays-self.form.gameRuleVo.rewardRemindDays>0) {
          self.$message.warning("兑奖提醒天数必须大于弃奖天数");
          return;
        }
        // 游戏大奖金额 ，游戏小奖金额校验
        let minMax = false;
        if (self.form.gameExchangeSetVoList.length > 0) {
          let max;
          let medium;
          let min;
          self.form.gameExchangeSetVoList.forEach(item => {
            if (item.exchangeCode == 3) {
              max = item.exchangeMoney;
            }
            if (item.exchangeCode == 2) {
              medium = item.exchangeMoney;
            }
            if (item.exchangeCode == 1) {
              min = item.exchangeMoney;
            }
          });
          if (max - min > 0 || max - min == 0) {
            minMax = true;
          } else {
            self.$message.warning("游戏大小奖的梯度设置错误，请重新修改");
            return;
          }
        }
        if (
          gameRules &&
          fundsRules &&
          jackpotRules &&
          bettingRules &&
          maxminRules &&
          deployCode &&
          prizeRate &&
          reFundRate
        ) {
          let data = {
            deployCode: self.form.gameRuleVo.deployCode
          };
          self.checkDeployCode(data);
        } else {
          self.$message.warning("校验不通过");
        }
      }
      // if (this.active++ > 3) this.active = 0;
    },
    // 校验游戏是否存在
    checkGameIsExist(data) {
      const self = this;
      (async data => {
        let res = await self.$api.checkGameIsExist({ data });
        if (res && res.code == 0) {
          if (this.active++ > 3) this.active = 0;
        }
      })(data);
    },
    // 校验累计奖池ID是否存在
    checkRewardPoolIdIsExist(data) {
      const self = this;
      (async data => {
        let res = await self.$api.checkRewardPoolIdIsExist({ data });
        if (res && res.code == 0) {
          if (this.active++ > 3) this.active = 0;
        }
      })(data);
    },
    // 校验配置编号是否存在
    checkDeployCode(data) {
      const self = this;
      (async data => {
        let res = await self.$api.checkDeployCode({ data });
        if (res && res.code == 0) {
          let param = {
            gameRewardPoolVoList: self.form.gameRewardPoolVoList
          };
          self.checkRewardPoolIdIsExist(param);
        }
      })(data);
    },
    // 转换金额 百分
    toMoney(data, val) {
      const self = this;
      for (let key in data) {
        if (typeof data[key] == "object") {
          if (data[key][val]) {
            data[key][val] = self.$common.accMul(data[key][val], 100);
          }
        }
        if (Array.isArray(data[key])) {
          data[key].forEach(item => {
            if (item[val]) {
              item[val] = self.$common.accMul(item[val], 100);
            }
          });
        }
      }
      return data;
    },
    // 转换数字
    toNumber(data, val) {
      for (let key in data) {
        if (typeof data[key] == "object") {
          if (data[key][val]) {
            data[key][val] = data[key][val] * 1;
          }
        }
        if (Array.isArray(data[key])) {
          data[key].forEach(item => {
            if (item[val]) {
              item[val] = item[val] * 1;
            }
          });
        }
      }
      return data;
    },
    submit() {
      const self = this;
      let data = JSON.parse(JSON.stringify(this.form));
      let deployCode = data.gameRuleVo.deployCode;
      // data.gameRewardPoolVoList = [{ rewardReturnRate: 0, rewardPoolName: null, rewardPoolId: null, rewardPoolAmount: null}]
      // 给所有对象添加deployCode
      data.gameInfoVo.deployCode = deployCode;
      data.gameRuleVo.deployCode = deployCode;
      data.developerInfoVo.deployCode = deployCode;
      data.gameFundRuleVo.deployCode = deployCode;
      data.gameBettingRuleVo.deployCode = deployCode;
      data.rewardLevelSetVo.deployCode = deployCode;
      data.gameRiskRuleVo.deployCode = deployCode;

      data.gameExchangeSetVoList.forEach(item => {
        item.deployCode = deployCode;
        item.createBy = this.$storage.get("userInfo").userId;
      });
      data.gameRewardPoolVoList.forEach(item => {
        item.deployCode = deployCode;
        item.createBy = this.$storage.get("userInfo").userId;
      });
      data.rewardLevelSetVoList.forEach(item => {
        item.deployCode = deployCode;
        item.createBy = this.$storage.get("userInfo").userId;
      });
      data.softwareInfoVoList.forEach(item => {
        item.deployCode = deployCode;
        item.softwareDesc = self.soft.softwareDesc;
        item.newFeatures = self.soft.newFeatures;
        item.createUser = this.$storage.get("userInfo").userId;
      });
      // 游戏试玩
      data.isPlayGame = data.gameInfoVo.isPlayGame;

      // 删除兑换比例
      delete data.gameRuleVo.money;
      delete data.gameRuleVo.number;

      // 时间转换
      data.gameRuleVo.startSaleDate = new Date(
        data.gameRuleVo.startSaleDate
      ).getTime();
      data.gameRuleVo.endSaleDate = new Date(
        data.gameRuleVo.endSaleDate
      ).getTime();

      // 需要转换金额百分制的字段
      let moneyArray = [
        "maxAmount",
        "minAmount",
        "exchangeMoney",
        "rewardPoolAmount",
        "rewardLeveAmount",
        "totalPublishRate",
        "totalWelfareRate",
        "zhcPublishRate",
        "zhcWelfareRate",
        "proWelfareRate",
        "proPublishRate",
        "marketWelfareRate",
        "marketPublishRate",
        "cityWelfareRate",
        "cityPublishRate",
        "reFundRate",
        "rewardReturnRate",
        "returnRate",
        "startGearReturnRate",
        "minGearReturnRate",
        "maxGearReturnRate",
        "returnRateInterval"
      ];
      moneyArray.forEach(item => {
        data = self.toMoney(data, item);
      });

      // 需要转换数字的字段
      let numberArray = [
        "maxBets",
        "minBets",
        "rewardRemindDays",
        "endRedeemDays",
        "endGamePointDays",
        "gearAmount"
      ];
      numberArray.forEach(item => {
        data = self.toNumber(data, item);
      });

      console.log("提交的参数", data);
      self.createGameStore(data);
    }
  }
};
</script>

<style lang="less" scoped>
.wrap {
  width: 85%;
  margin: 60px auto 30px;
}
.vlt-edit-btn {
  text-align: right;
  margin: 60px 0 30px;
  .el-button {
    width: 120px;
  }
  .cancel {
    margin: 0 50px 0 0px;
  }
}
.el-upload__tip {
  margin-top: 0;
  line-height: 1;
}
.table-wrap {
  padding: 16px;
  text-align: center;
}
.add-btn {
  width: 70%;
  max-width: 600px;
  margin: 30px auto;
}
</style>
