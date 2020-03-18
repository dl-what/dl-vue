<template>
  <div class="vlt-card" ref="main">
    <el-steps :active="active" align-center class="step-wrap">
      <el-step title="计划信息" icon="el-icon-edit"></el-step>
      <el-step title="版本选择" icon="el-icon-monitor"></el-step>
      <el-step title="版本配置" icon="el-icon-setting"></el-step>
      <el-step title="上传附件" icon="el-icon-paperclip"></el-step>
    </el-steps>
    <!-- 计划信息 -->
    <div v-show="active==0" class="wrap">
      <panel title="计划信息" :show="true" :isBack="false" style="margin-bottom:15px">
        <div class="vlt-edit-single">
          <div class="vlt-edit-wrap plan-wrap">
            <plan-info v-model="form" ref="planInfo" v-if="isPlanInfo"></plan-info>
          </div>
        </div>
      </panel>
      <el-row class="vlt-edit-btn">
        <el-button size="medium" @click="back" class="cancel">返 回</el-button>
        <el-button type="primary" size="medium" @click="next('0')">下一步</el-button>
      </el-row>
    </div>
    <!-- 上传游戏包 -->
    <div v-if="active==1" class="wrap">
      <panel title="游戏版本配置"  :show="true" :isBack="false" style="margin-bottom:15px">
        <div class="table-wrap">
          <el-table
            border
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%">
            <el-table-column label="序号" type="index" fixed width="55"></el-table-column>
            <el-table-column prop="softwareName" label="软件名称" min-width="300px"></el-table-column>
            <el-table-column prop="deployCode" label="配置编码" min-width="100px"></el-table-column>
            <el-table-column prop="versionNumber" label="版本号" min-width="120px"></el-table-column>
            <el-table-column prop="versionStatusName" label="版本状态" min-width="120px"></el-table-column>
            <el-table-column prop="softwareSize" label="软件大小" min-width="120px"></el-table-column>
            <!-- <el-table-column prop="newFeatures" label="新版特性" min-width="120px"></el-table-column>
            <el-table-column prop="softwareDesc" label="软件描述" min-width="120px"></el-table-column> -->
            <el-table-column label="创建时间" min-width="160px">
              <template slot-scope="scope">
                {{$moment(scope.row.createTime).format("YYYY-MM-DD HH:mm:ss")}}
              </template>
            </el-table-column>
            <el-table-column label="更新时间" min-width="160px">
              <template slot-scope="scope">
                {{$moment(scope.row.updateTime).format("YYYY-MM-DD HH:mm:ss")}}
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" min-width="100px">
              <template slot-scope="scope">
                <el-button
                  v-if="!scope.row.checked"
                  size="mini"
                  v-prevent="2000"
                  @click="edit(scope.row)"
                >选择</el-button>
                 <el-button
                  v-else
                  size="mini"
                  v-prevent="2000"
                  disabled
                  icon="el-icon-check"
                  @click="edit(scope.row)"
                >已选</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </panel>
      <el-row class="vlt-edit-btn">
        <el-button size="medium" @click="prev" class="cancel">上一步</el-button>
        <el-button type="primary" size="medium" @click="next('1')">下一步</el-button>
      </el-row>
    </div>
    <!-- 游戏配置 -->
    <div v-if="active==2" class="wrap">
      <panel title="游戏客户端（全量包）" :show="true" :isBack="false" style="margin-bottom:15px">
        <div class="vlt-edit-double">
          <div class="vlt-edit-wrap">
            <terminal-upload v-model="data.softwareInfoVoList[0]" ref="terminal"></terminal-upload>
          </div>
        </div>
      </panel>
      <panel title="游戏客户端（增量包）" :show="true" :isBack="false" style="margin-bottom:15px">
        <div class="vlt-edit-double">
          <div class="vlt-edit-wrap">
            <terminal-upload v-model="data.softwareInfoVoList[1]" ref="terminal"></terminal-upload>
          </div>
        </div>
      </panel>
      <panel title="游戏逻辑包" :show="true" :isBack="false" style="margin-bottom:15px">
        <div class="vlt-edit-double">
          <div class="vlt-edit-wrap">
            <server-upload v-model="data.softwareInfoVoList[2]" ref="server"></server-upload>
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
              disabled
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
      <panel title="游戏配置" :show="true" :isBack="false" style="margin-bottom:15px">
        <div class="vlt-edit-single">
          <div class="vlt-edit-wrap">
            <el-form label-position="right" 
              label-width="90px" 
              :model="data.gameRuleVo"
              :rules="rules"
              ref="form"
              class="baseInfo">
              <el-form-item label="配置编码" prop="deployCode">
                <el-input v-model="data.gameRuleVo.deployCode" disabled placeholder="请输入配置编码"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </panel>
      <panel title="游戏基础规则" :show="true" :isBack="false" style="margin-bottom:15px">
        <div class="vlt-edit-double">
          <div class="vlt-edit-wrap">
            <game-rules v-model="data.gameRuleVo" ref="gameRules"></game-rules>
          </div>
        </div>
      </panel>
      <panel title="资金规则" tips="固定奖返奖率+奖池返奖率+调节基金比率+总发行经费比率+总公益金比率=100%" :show="true" :isBack="false" style="margin-bottom:15px">
        <div class="vlt-edit-double">
          <div class="vlt-edit-wrap">
            <funds-rules v-model="data.gameFundRuleVo" ref="fundsRules"></funds-rules>
          </div>
        </div>
      </panel>
      <panel title="奖池规则" tips="固定奖返奖率+奖池返奖率+调节基金比率+总发行经费比率+总公益金比率=100%" :show="true" :isBack="false" style="margin-bottom:15px">
        <div class="vlt-edit-single">
          <div class="vlt-edit-wrap">
            <jackpot-rules v-model="data" ref="jackpotRules"></jackpot-rules>
          </div>
        </div>
      </panel>
      <panel title="投注规则" :show="true" :isBack="false" style="margin-bottom:15px">
        <div class="vlt-edit-single">
          <div class="vlt-edit-wrap">
            <betting-rules v-model="data.gameBettingRuleVo" ref="bettingRules"></betting-rules>
          </div>
        </div>
      </panel>
      <panel title="风控规则" :show="true" :isBack="false" style="margin-bottom:15px">
        <div class="vlt-edit-single">
          <div class="vlt-edit-wrap">
            <risk-rules v-model="data.gameRiskRuleVo"></risk-rules>
          </div>
        </div>
      </panel>
      <panel title="大小奖设置" tips="局游戏小奖自动返奖 不受下面参数控制" :show="true" :isBack="false" style="margin-bottom:15px">
        <div class="vlt-edit-single">
          <div class="vlt-edit-wrap">
            <maxmin-rules v-model="data" ref="maxminRules"></maxmin-rules>
          </div>
        </div>
      </panel>
      <panel title="服务器分配设置" :show="true" :isBack="false" style="margin-bottom:15px">
        <div class="vlt-edit-single">
          <div class="vlt-edit-wrap">
            <server-rules v-model="data.gameRuleVo" ref="serverRules"></server-rules>
          </div>
        </div>
      </panel>
      <panel title="自定义设置(可选)" :show="true" :isBack="false" style="margin-bottom:15px">
        <div class="vlt-edit-single">
          <div class="vlt-edit-wrap">
            <!-- <custom-rules v-model="data.gameRuleVo"></custom-rules> -->
            <el-form label-position="right" 
              label-width="90px"
              ref="form"
              class="baseInfo">
              <el-form-item label="自定义设置">
                <el-input
                  v-model="data.gameRuleVo.customSettings"
                  placeholder="请输入自定义设置"
                  disabled
                  type="textarea" 
                  :autosize="{ minRows: 3, maxRows: 10}"
                  maxlength="1000"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </panel>
      <el-row class="vlt-edit-btn">
        <el-button size="medium" @click="prev" class="cancel">上一步</el-button>
        <el-button type="primary" size="medium" @click="next('2')">下一步</el-button>
      </el-row>
    </div>
    <!-- 上传附件 -->
    <div class="wrap" v-if="active==3">
      <panel title="上传附件" :show="true" :isBack="false" style="margin-bottom:15px">
        <div class="vlt-edit-single">
          <div class="vlt-edit-wrap">
            <upload-files v-model="form"></upload-files>
          </div>
        </div>
      </panel>
      <el-row class="vlt-edit-btn">
        <el-button size="medium" @click="prev" class="cancel">上一步</el-button>
        <el-button type="primary" size="medium" @click="submit">提 交</el-button>
      </el-row>
    </div>
  </div>
</template>

<script type="text/javascript">
import rules from '@/utils/rules.js';
import { mapGetters } from 'vuex';
import PlanInfo from './planInfo'
import TerminalUpload from '../components/uploadTerminalInfo'
import ServerUpload from '../components/uploadServerInfo'
import GameRules from '../components/rulesGame'
import BettingRules from '../components/rulesBetting'
import RiskRules from '../components/rulesRisk'
import JackpotRules from '../components/rulesJackpot'
import FundsRules from '../components/rulesFunds'
import MaxminRules from '../components/rulesMaxMin'
import ServerRules from '../components/rulesServer'
import CustomRules from '../components/rulesCustom'
import UploadFiles from '../components/uploadFiles'
import { userInfo } from 'os';

export default {
  name: "gameCreate",
  components: {
    PlanInfo,
    TerminalUpload,
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
      soft: {
        softwareDesc: null,
        newFeatures: null,
      },
      isPlanInfo: false, // 用于控制显示隐藏 处理数据异步问题
      form: {
        id: null, 
        gameId: null, // 游戏ID
        deployCode: null, // 配置编码
        gamePlayName: null, // 试玩计划名称
        gamePlayCode: null, // 试玩计划编号
        playTime: null, // 试玩时间
        startPlayTime: null, // 试玩开始时间
        endPlayTime: null, // 试玩结束时间
        gamePlayIns: null, // 试玩区域
        gamePlayChannel: '1', // 试玩渠道
        gamePlayTool: 3, // 试玩工具
        gamePlayDesc: null, // 试玩简介
        filePath: null, // 
        gamePlayChannelCode: '', // 渠道编号
      },
      data: {
        gameInfoVo: { // 游戏信息 （参数）
          id: null,
          gameId: null, // 
          gameName: null, // 游戏名称
          gameCode: null, // 游戏编码
          gameType: null, // 游戏类型
          gameIcon: null, // 游戏图标
          gameDesc: null, // 游戏简介
          gameGenlot: null, // 版权归属
          filePath: null,
        },
        gameRuleVo: { // 游戏规则（参数）
          id: null,
          deployCode: null, // 配置编码,
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
        },
        gameRiskRuleVo: { // 风控规则上传 （参数）
          gameId: null, // 游戏ID
          startGearReturnRate: null, // 开始挡位返奖率
          minGearReturnRate : null, // 最小挡位返奖率
          maxGearReturnRate: null, // 最大挡位返奖率
          returnRateInterval: null, // 返奖率间隔
          gearAmount: null, // 挡位数量
          filePath: null, // 附件上传路径
          deployCode: null, // 配置编码
          createBy: null, // 创建人
        },
        gameFundRuleVo: { // 资金规则 （参数）
          id: null,
          totalPublishRate: '', // 总发行经费占比
          totalWelfareRate: '', // 总公益金占比
          zhcPublishRate: '', // 中福彩发行费占比
          zhcWelfareRate: '', // 中福彩公益金占比
          proPublishRate: '', // 省福彩发行费占比
          proWelfareRate: '', // 省福彩公益金占比
          cityPublishRate: '', // 市福彩发行费占比
          cityWelfareRate: '', // 市福彩公益金占比
          marketPublishRate: '', // 销售厅发行费占比
          marketWelfareRate: '', // 销售厅公益金占比
          reFundStatus: 1, // 调节基金 1 关闭， 2开启
          reFundRate: '', // 调节基金
        },
        gameBettingRuleVo: { // 投注规则 （参数）
          id: null,
          minAmount:'', // 单注最小金额
          minBets: '', // 最小投注数
          maxAmount: '', // 单注最大金额
          maxBets: '', // 最大投注数
          minAddBets: '',  // 单次加注金额
        },
        softwareInfoVoList: [  // 游戏包  （参数）
          { // 全量包的参数 1
            id: null,
            fileMd5: null, // 客户端加密
            filePath: null, // 路径
            softwareType: 1, // 
            softwareName: null, // 软件名称
            versionNumber: null, // 版本号
            softwareSize: null, // 软件大小
            softwareDesc: null, // 软件描述
            newFeatures: null, // 新版特性
          },
          { // 增量包的参数 2
            id: null,
            filePath: null, // 路径
            softwareType: 2, // 
            softwareName: null, // 软件名称
            versionNumber: null, // 版本号
            softwareSize: null, // 软件大小
            softwareDesc: null, // 软件描述
            newFeatures: null, // 新版特性
          },
          { // 服务端的参数 3
            id: null,
            filePath: null, // 路径
            softwareType: 3, // 
            softwareName: null, // 软件名称
            versionNumber: null, // 版本号
            softwareSize: null, // 软件大小
            softwareDesc: null, // 软件描述
            newFeatures: null, // 新版特性
          }
        ],
        gameExchangeSetVoList: [], // 大小奖设置 （参数）
        rewardLevelSetVoList: [], // 固定奖等级 （参数）
        gameRewardPoolVoList: [], // 累计奖等级  （参数）
        rewardLevelSetVo: { // 固定奖（上传附件）
          filePath: '',
        },
      },
      tableData: [], 
      params: {
        page: 1,
        pageSize: 10,
        param: {
          gameId: '',
        }
      },
      total: 0,
      rules: {
        deployCode: [
          {required: true, validator: this.$rules.checkCode, title: '配置编码', triggle: 'blur'}
        ]
      },
      type: 0, // 0为新增，1为编辑 这个用于区分用户是点击新增版本配置还是点击编辑
      deployCode: this.$route.query.deployCode,
    }
  },
  created() {
    // this.getAllGameType()
    let data = {
      id: this.$route.query.id,
      gameId: this.$route.query.gameId,
      deployCode: this.$route.query.deployCode
    };
    this.getTryPlanDetail(data)
  },
  watch: {

  },
  computed: {
    ...mapGetters(['gameTypeData', 'insData'])
  },
  methods: {
    // 获取计划详情
    getTryPlanDetail(data) {
      const self = this;
      (async (data)=>{
        let res = await self.$api.getTryPlanDetail({data})
				if(res && res.code == 0) {
          console.log(res.data);
          self.form = Object.assign(self.form, res.data.gamePlayPlanVo); // 计划详情参数
          // 时间处理
          self.form.playTime = [res.data.gamePlayPlanVo.startPlayTime, res.data.gamePlayPlanVo.endPlayTime]
          // 销售区域回填
          let area = res.data.gamePlayPlanVo.gamePlayIns.split(';');
          let insArray = []
          area&&area.forEach((item)=>{
            if(item) {
              let arr = self.$formMethods.getInsArray(item,'id', self.insData, 'id') // 传入id 和对象
              arr&&arr.reverse();
              insArray.push(arr)
            }
          })
          self.form.gamePlayIns = insArray;
          // 大厅和终端数据处理
          if(self.form.gamePlayChannel=='all') {
            self.form.gamePlayChannel = '1';
          }else{
            let code = []
            let array = self.form.gamePlayChannel.split(';')
            array.forEach((item)=>{
              if(item) {
                code.push(item)
              }
            })
            self.form.gamePlayChannelCode = code.join(';');
            self.form.gamePlayChannel = '2';
          }
          self.isPlanInfo = true;
				}
      })(data)
    },
    edit(val) {
      this.tableData.forEach((item)=>{
        item.checked = false;
      })
      val.checked = true;
      this.type = 1;
      // let data = {
      //   gameId: val.gameId,
      //   deployCode: val.deployCode
      // };
      // this.getGameConDetail(data)
    },
    // 游戏信息和开发商信息
    getGameStoreInfo(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getGameStoreInfo({data});
        if (res && res.code == 0) {
          if(res.data.gameInfoVo) {
            self.form.gameInfoVo = Object.assign(self.form.gameInfoVo, res.data.gameInfoVo)
          }
          if(res.data.developerInfoVo) {
            self.form.developerInfoVo = Object.assign(self.form.developerInfoVo, res.data.developerInfoVo)
          }
        }
      })(data);
    },
    addVersion() {
      this.type = 0;
    },
    validate(name) {
      let res = false;
      this.$refs[name].$refs.form.validate((valid)=>{
        res = valid;
      })
      return res;
    },
    // 附件上传
    async uploadFileOther(files) {
      let formData = new FormData();
      console.log('files', files.file.size/1024)
      // this.softData[3].value = `${(files.file.size/1024).toFixed()}`
      formData.append('file', files.file);
      formData.append("type", 1);
      const res = await this.$api.testUpload({
        timeout: 99999999999999,
        data: formData,
        onUploadProgress(evt) {
          let percent = (evt.loaded / evt.total * 100) | 0 //调用onProgress方法来显示进度条，需要传递个对象 percent为进度值
           files.onProgress({percent:percent})
          console.log('上传进度事件:', evt)
        }
      })
      if(res&&res.code==0) {
        this.$message.success('上传成功')
        this.gameOtherPath.push(res.data.filePath);
      }
      console.log('uploadFile', res);
      
    },
    // 游戏版本配置
    getGameConList(data) {
      const self = this;
      (async (data)=>{
				let res = await self.$api.getGameConList({data})
				if(res && res.code == 0) {
          self.total = res.data.total;
          let options = {
            1: '储备',
            2: '试玩',
            3: '上市',
            4: '退市'
          }
          res.data.records.forEach((item)=>{
            item.versionStatusName = options[item.versionStatus]
            if(item.deployCode == self.deployCode) {
              item.checked = true;
            }else{
              item.checked = false;
            }
          })
          self.tableData = res.data.records;
				}
      })(data)
    },
    // 游戏版本配置详情
    getGameConDetail(data) {
      const self = this;
      (async (data)=>{
				let res = await self.$api.getGameConDetail({data})
				if(res && res.code == 0) {
          let data = res.data;
          // 需要把百分制金额 除于 100 的字段
          let moneyArray = ['maxAmount', 'minAmount', 'exchangeMoney','rewardPoolAmount','rewardLeveAmount',"totalPublishRate",
            "totalWelfareRate",'zhcPublishRate','zhcWelfareRate','proWelfareRate',
      'proPublishRate','marketWelfareRate','marketPublishRate','cityWelfareRate','cityPublishRate',
      'reFundRate', 'rewardReturnRate', 'returnRate', 'startGearReturnRate', 'minGearReturnRate', 'maxGearReturnRate',
      'returnRateInterval']
          moneyArray.forEach((item)=>{
            data = self.toMoneyReal(data, item)
          })
          // 游戏基础规则
          if(data.gameRuleVo) {
            self.data.gameRuleVo = Object.assign(self.data.gameRuleVo, data.gameRuleVo)
          }
          // 资金规则
          if(data.gameFundRuleVo) {
            self.data.gameFundRuleVo = Object.assign(self.data.gameFundRuleVo, data.gameFundRuleVo)
          }
          // 风控规则
          if(data.gameRiskRuleVo) {
            self.data.gameRiskRuleVo = Object.assign(self.data.gameRiskRuleVo, data.gameRiskRuleVo)
          }
          // 奖池规则-固定奖
          // if(data.rewardLevelSetVoList.length>0) {
          //   // 暂时注释
          //   self.data.rewardLevelSetVoList = Object.assign(self.data.rewardLevelSetVoList, data.rewardLevelSetVoList)
          // }
          // 奖池规则-固定奖(上传附件)
          if(data.rewardLevelSetVo) {
            self.data.rewardLevelSetVo = Object.assign(self.data.rewardLevelSetVo, data.rewardLevelSetVo)
          }
          // 奖池规则-累计奖
          if(data.gameRewardPoolVoList.length>0) {
            data.gameRewardPoolVoList.forEach((item)=>{
              item.poolDisabled = true;
              item.amountDisabled = true;
            })
            self.data.gameRewardPoolVoList = Object.assign(self.data.gameRewardPoolVoList, data.gameRewardPoolVoList)
          }
          // 投注规则
          if(data.gameBettingRuleVo) {
            self.data.gameBettingRuleVo = Object.assign(self.data.gameBettingRuleVo, data.gameBettingRuleVo)
          }
          // 大小奖设置
          if(data.gameExchangeSetVoList.length>0) {
            self.data.gameExchangeSetVoList = Object.assign(self.data.gameExchangeSetVoList, data.gameExchangeSetVoList)
          }
          // 软件包
          if(data.softwareInfoVoList.length>0) {
            data.softwareInfoVoList.forEach((item)=>{
              if(item.softwareDesc) {
                self.soft.softwareDesc = item.softwareDesc;
              }
              if(item.newFeatures) {
                self.soft.newFeatures = item.newFeatures;
              }
              if(item.softwareType==1) {
                this.$set(self.data.softwareInfoVoList, 0, item)
              }else if(item.softwareType==2){
                this.$set(self.data.softwareInfoVoList, 1, item)
              }else{
                this.$set(self.data.softwareInfoVoList, 2, item)
              }
            })
          }
          // 调转下一步
          if (self.active++ > 3) self.active = 0;
				}
      })(data)
    },
    back() {
      this.$router.back()
    },
    prev() {
      this.$refs.main.scrollTop = 0;
      if (this.active-- < 1) this.active = 0;
    },
    next(flag) {
      console.log('参数', this.form)
      const self = this;
      if(flag == '0') {
        let planInfo = self.validate('planInfo');
        if(planInfo) {

          // if (self.active++ > 3) self.active = 0;
          // self.params.param.gameId = self.form.gameId;
          // self.getGameConList(self.params)

          // 校验计划编号是否存在
          let param = {
            id: self.form.id,
            gamePlayCode: self.form.gamePlayCode,
            gamePlayName: self.form.gamePlayName,
          };
          self.checkTryPlanIsExist(param)

        }else{
          self.$message.warning('校验不通过')
        }
      }
      if(flag == '1') {
        this.tableData.forEach((item)=>{
          if(item.checked) {
            let data = {
              gameId: item.gameId,
              deployCode: item.deployCode
            };
            this.getGameConDetail(data)
          }
        })
        
      }
      if(flag == '2') {
        if (self.active++ > 3) self.active = 0;
      }
      // if (self.active++ > 3) this.active = 0;
    },
    // 校验试玩计划是否存在
    checkTryPlanIsExist(data) {
      const self = this;
      (async (data)=>{
				let res = await self.$api.checkTryPlanIsExist({data})
				if(res && res.code == 0) {
          // if (self.active++ > 3) self.active = 0;
          // self.params.param.gameId = self.form.gameId;
          // self.getGameConList(self.params)
          if(self.form.gamePlayChannel==1) {
            if (self.active++ > 3) self.active = 0;
            self.params.param.gameId = self.form.gameId;
            self.getGameConList(self.params)
          } else {
            let array = [];
            self.form.gamePlayIns.forEach(item=>{
              array.push(item[item.length-1])
            })
            let insIdStr = `;${array.join(';')};`;
            let channelNoStr = `;${self.form.gamePlayChannelCode};`;
            let param = {
              insIdStr,
              channelNoStr,
            };
            self.checkListPlanChannelNo(param)
          }
				}
      })(data);
    },
    // 校验试玩计划 区域指定大厅编码是否正确
    checkListPlanChannelNo(data) {
       const self = this;
      (async data => {
        let res = await self.$api.checkListPlanChannelNo({data});
        if (res && res.code == 0) {
         if(res.data.isExist) {
            if (self.active++ > 3) self.active = 0;
            self.params.param.gameId = self.form.gameId;
            self.getGameConList(self.params)
          }else{
            let text = res.data.channelNoList.join('，')
            self.$message.error(`大厅编码为 ${text} 不在当前的区域，请重新输入`)
          }
        }
      })(data);
    },
    // 校验配置编号是否存在
    checkDeployCode(data) {
      const self = this;
      (async (data)=>{
				let res = await self.$api.checkDeployCode({data})
				if(res && res.code == 0) {
          if (self.active++ > 3) self.active = 0;
				}
      })(data);
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
    // 转换金额 百分
    toMoney(data, val) {
      const self = this;
      for(let key in data) {
        if(typeof(data[key])=='object') {
          if(data[key][val]) {
            data[key][val] = self.$common.accMul(data[key][val], 100);
          }
        }
        if(Array.isArray(data[key])) {
          data[key].forEach((item)=>{
            if(item[val]) {
              item[val] = self.$common.accMul(item[val], 100);
            }
          })
        }
      }
      return data;
    },
    // 转换数字
    toNumber(data, val) {
      for(let key in data) {
        if(typeof(data[key])=='object') {
          if(data[key][val]) {
            data[key][val] = data[key][val]*1;
          }
        }
        if(Array.isArray(data[key])) {
          data[key].forEach((item)=>{
            if(item[val]) {
              item[val] = item[val]*1;
            }
          })
        }
      }
      return data;
    },
    submit() {
      const self = this;
      let data = JSON.parse(JSON.stringify(this.form))
      data.updateBy = this.$storage.get('userInfo').userId;
      data.deployCode = self.data.gameRuleVo.deployCode;
      if(data.gamePlayChannel=='1') {
        data.gamePlayChannel = 'all'
      }else{
        let str = data.gamePlayChannelCode.replace(/；/g, ';')
        let strArray = str.split(';')
        let channelCode = []
        strArray.forEach((item)=>{
          if(item) {
            channelCode.push(item)
          }
        })
        data.gamePlayChannel = `;${channelCode.join(';')};`;
      }
      delete data.gamePlayChannelCode;
      data.playTime = new Date(data.playTime).getTime();
      let array = [];
      data.gamePlayIns.forEach(item=>{
        array.push(item[item.length-1])
      })
      data.gamePlayIns = `;${array.join(';')};`
      console.log('提交的参数', data)
      self.editTryPlan(data)
    },
    // 编辑试玩计划
    editTryPlan(data) {
      const self = this;
      (async (data)=>{
				let res = await self.$api.editTryPlan({data})
				if(res && res.code == 0) {
          self.$message.success('提交成功')
          self.$router.push({path:'./planList'})
				}
      })(data)
    },
  },
}
</script>

<style lang="less" scoped>
.wrap{
  width: 85%;
  margin: 60px auto 30px;
}
.vlt-edit-btn{
  text-align: right;
  margin: 60px 0 30px;
  .el-button{
    width: 120px;
  }
  .cancel{
    margin: 0 50px 0 0px;
  }
}
.el-upload__tip{
  margin-top: 0;
  line-height: 1;
}
.table-wrap{
  padding: 16px;
  text-align: center;
}
.add-btn{
  width: 70%;
  max-width: 600px;
  margin: 30px auto;
}
.plan-wrap{
  width: 700px;
  margin: 30px auto 20px;
}
</style>
