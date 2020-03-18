<template>
  <div class="vlt-card" ref="main">
    <el-steps :active="active" align-center class="step-wrap">
      <el-step title="计划信息" icon="el-icon-edit"></el-step>
      <el-step title="上传附件" icon="el-icon-paperclip"></el-step>
    </el-steps>
    <!-- 计划信息 -->
    <div v-show="active==0" class="wrap">
      <panel title="计划信息" :show="true" :isBack="false" style="margin-bottom:15px"  :tips="'提示：配置游戏退市时，请提前关闭退市游戏投注等权限，同时发布退市公告哦'">
        <div class="vlt-edit-single">
          <div class="vlt-edit-wrap plan-wrap">
            <plan-info v-model="form" ref="planInfo" v-if="isPlanInfo"></plan-info>
          </div>
        </div>
      </panel>
      <el-row class="vlt-edit-btn">
        <el-button size="medium" @click="back" class="cancel"  :id="$route.name+'-'+'back'">返 回</el-button>
        <el-button type="primary" size="medium" @click="next('0')"  :id="$route.name+'-'+'next'">下一步</el-button>
      </el-row>
    </div>
    <!-- 上传附件 -->
    <div class="wrap" v-if="active==1">
      <panel title="上传附件" :show="true" :isBack="false" style="margin-bottom:15px"  :tips="'提示：配置游戏退市时，请提前关闭退市游戏投注等权限，同时发布退市公告哦'">
        <div class="vlt-edit-single">
          <div class="vlt-edit-wrap">
            <upload-files v-model="form"></upload-files>
          </div>
        </div>
      </panel>
      <el-row class="vlt-edit-btn">
        <el-button size="medium" @click="prev" class="cancel"  :id="$route.name+'-'+'prev'">上一步</el-button>
        <el-button type="primary" size="medium" @click="submit"  :id="$route.name+'-'+'submit'">提 交</el-button>
      </el-row>
    </div>
  </div>
</template>

<script type="text/javascript">
import rules from '@/utils/rules.js';
import { mapGetters } from 'vuex';
import PlanInfo from './planInfo'
import UploadFiles from '../components/uploadFiles'

export default {
  name: "gameCreate",
  components: {
    PlanInfo,
    UploadFiles
  },
  data() {
    return {
      active: 0,
      isPlanInfo: false, // 用于控制显示隐藏 处理数据异步问题
      form: {
        id: null,
        gameId: null, // 游戏ID
        leaveName: null, // 退市计划名称
        leaveCode: null, // 退市计划编号
        leaveTime: null, // 退市时间
        endRewardTime: null, // 截止兑奖时间
        leaveIns: null, // 退市区域
        leaveChannel: '1', // 退市渠道
        leaveDesc: null, // 退市简介
        filePath: null,
        leaveChannelCode: '', // 渠道编号
      },
    }
  },
  created() {
    // this.getAllGameType()
    let data = {
      id: this.$route.query.id,
      gameId: this.$route.query.gameId,
    };
    this.getDelistingPlanDetail(data)
  },
  watch: {

  },
  computed: {
    ...mapGetters(['gameTypeData', 'insData'])
  },
  methods: {
    // 获取计划详情
    getDelistingPlanDetail(data) {
      const self = this;
      (async (data)=>{
        let res = await self.$api.getDelistingPlanDetail({data})
				if(res && res.code == 0) {
          console.log(res.data);
          self.form = Object.assign(self.form, res.data.gameLeavePlanVo); // 计划详情参数

          // 销售区域回填
          // let area = res.data.gameLeavePlanVo.leaveIns.split(';');
          // let insArray = []
          // area&&area.forEach((item)=>{
          //   if(item) {
          //     let arr = self.$formMethods.getInsArray(item,'id', self.insData, 'id') // 传入id 和对象
          //     arr&&arr.reverse();
          //     insArray.push(arr)
          //   }
          // })
          // self.form.leaveIns = insArray;
          // 大厅和终端数据处理
          if(self.form.leaveChannel=='all') {
            self.form.leaveChannel = '1';
          }else{
            let code = []
            let array = self.form.leaveChannel.split(';')
            array.forEach((item)=>{
              if(item) {
                code.push(item)
              }
            })
            self.form.leaveChannelCode = code.join(';');
            self.form.leaveChannel = '2';
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
      let data = {
        gameId: val.gameId,
        deployCode: val.deployCode
      };
      this.getGameConDetail(data)
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
      this.addUpload = false;
    },
    validate(name) {
      let res = false;
      this.$refs[name].$refs.form.validate((valid)=>{
        res = valid;
      })
      return res;
    },
    // 游戏版本配置
    getGameConList(data) {
      const self = this;
      (async (data)=>{
				let res = await self.$api.getGameConList({data})
				if(res && res.code == 0) {
          self.total = res.data.total;
          res.data.records.forEach((item)=>{
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
          let moneyArray = ['maxAmount', 'minAmount', 'exchangeMoney','rewardPoolAmount','rewardLeveAmount']
          moneyArray.forEach((item)=>{
            data = self.toMoneyReal(data, item)
          })
          
         
				}
      })(data)
    },
    back() {
      this.$router.back()
      // this.addUpload = true;
    },
    prev() {
      this.$refs.main.scrollTop = 0;
      if (this.active-- < 1) this.active = 0;
    },
    next(flag) {
      console.log('参数', this.form)
      const self = this;
      if(flag == '0') {
        if(self.form.leaveChannel=='2'&&self.form.leaveChannelCode.trim()=='') {
          self.$message.warning('区域指定大厅不能为空')
          return;
        }
        let planInfo = self.validate('planInfo');
        if(planInfo) {
          // 校验退市计划是否存在
          let param = {
            id: self.form.id,
            leaveCode: self.form.leaveCode,
            leaveName: self.form.leaveName,
          };
          self.checkLeavePlanIsExist(param)
          // if (self.active++ > 3) self.active = 0;
          // self.params.param.gameId = self.form.gameId;
          // self.getGameConList(self.params)
        }else{
          self.$message.warning('校验不通过')
        }
      }
      if(flag == '1') {
        if (self.active++ > 3) self.active = 0;
      }

      // if (self.active++ > 3) this.active = 0;
    },
    // 校验退市计划是否存在
    checkLeavePlanIsExist(data) {
      const self = this;
      (async (data)=>{
				let res = await self.$api.checkLeavePlanIsExist({data})
				if(res && res.code == 0) {
          if (self.active++ > 3) self.active = 0;
          self.params.param.gameId = self.form.gameId;
          // self.getGameConList(self.params)
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
      
      if(data.leaveChannel=='1') {
        data.leaveChannel = 'all'
      }else{
        let str = data.leaveChannelCode.replace(/；/g, ';')
        let strArray = str.split(';')
        let channelCode = []
        strArray.forEach((item)=>{
          if(item) {
            channelCode.push(item)
          }
        })
        data.leaveChannel = `;${channelCode.join(';')};`;
      }
      delete data.leaveChannelCode;
     // 退市时间
      data.leaveTime = new Date(data.leaveTime).getTime();
      // 截止兑奖时间
      data.endRewardTime = new Date(data.endRewardTime).getTime();
      // 退市区域
      let array = [];
      data.leaveIns.forEach(item=>{
        if(item) {
          array.push(item[item.length-1])
        }
      })
      data.leaveIns = `;${array.join(';')};`
      console.log('提交的参数', data)
      self.editDelistingPlan(data)
    },
    // 编辑退市计划
    editDelistingPlan(data) {
      const self = this;
      (async (data)=>{
				let res = await self.$api.editDelistingPlan({data})
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
  width: 60%;
  min-width: 630px;
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
  width: 550px;
  margin: 30px auto 20px;
}
</style>
