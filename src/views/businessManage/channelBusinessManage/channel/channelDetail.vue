<template>
  <div class="vlt-card">
    <el-tabs v-model="active" @tab-click="tabActive" class="tabs">
      <el-tab-pane label="渠道详情" name="detail">
        <div>
          <panel title="基本信息" :show="true" style="margin-bottom:15px">
            <base-Info :infoList="channelData"></base-Info>
          </panel>
          <panel title="人员信息" :show="true" style="margin-bottom:15px">
            <base-info :infoList="memberData">
              <!-- 这是 具名插槽  需要填写链接信息 -->
              <ul slot="msg-content" class="info-list">
                
                <li class="info-item" v-for="(item,index) in photoData" :key="'photo-'+index">
                  <span class="title">{{`证件照片${index+1}：`}}</span>
                  <p  class="content"><el-link type="primary" :underline="false" tag="p" style="font-size: 12px;" @click="previewImg(item, '证件照片')">查看</el-link></p>
                </li>
              </ul>
            </base-info>
          </panel>
          <panel title="财务信息" :show="true" v-if="isFinance" style="margin-bottom:15px">
            <base-Info :infoList="financeData">
              <!-- 这是 具名插槽  需要填写链接信息 -->
              <!-- <ul slot="msg-content" class="info-list"> -->
                <li class="info-item" v-for="(item,index) in evidenceData" :key="'info-'+index">
                  <span class="title">{{`收款凭证${index+1}：`}}</span>
                  <p  class="content"><el-link type="primary" :underline="false" tag="p" style="font-size: 12px;" @click="previewImg(item, '收款凭证')">查看</el-link></p>
                </li>
              <!-- </ul> -->
            </base-Info>
          </panel>
          <panel title="投注卡规则" :show="true" style="margin-bottom:15px">
            <div class="vlt-edit-single betCard">
                <div class="vlt-edit-wrap">
                  <el-form :model="betCard" ref="betCard" label-position="right" label-width="80px" disabled>
                    <el-form-item label="卡费规则">
                      <div class="flex-wrap">
                        <el-form-item label="累计大于" prop="costMoreThan">
                          <el-input v-model="betCard.costMoreThan" placeholder="请输入数量">
                            <template slot="append">张</template>
                          </el-input>
                        </el-form-item>
                        <el-form-item label="收费" prop="charge">
                          <el-input v-model="betCard.charge" placeholder="请输入金额">
                            <template slot="append">元/张</template>
                          </el-input>
                        </el-form-item>
                      </div>
                    </el-form-item>
                    <el-form-item label="押金设置">
                      <div class="radio-wrap">
                        <el-radio v-model="betCard.depositSet" label="0">不收费</el-radio>
                        <el-radio v-model="betCard.depositSet" label="1">全部收费</el-radio>
                        <!-- <el-radio v-model="betCard.depositSet" label="2">按投注卡申请量收取</el-radio> -->
                      </div>
                    </el-form-item>
                    <el-form-item label="押金金额" v-if="betCard.depositSet==1" prop="amount">
                      <el-input v-model="betCard.amount" placeholder="请输入金额">
                        <template slot="append">元 / 张</template>
                      </el-input>
                    </el-form-item>
                    <!-- <el-form-item label="押金金额" v-if="betCard.depositSet==2">
                      <div class="flex-wrap">
                        <el-form-item label="累计大于" prop="depositMoreThan">
                          <el-input v-model="betCard.depositMoreThan" placeholder="请输入数量">
                            <template slot="append">张</template>
                          </el-input>
                        </el-form-item>
                        <el-form-item label="金额" prop="depositMoney">
                          <el-input v-model="betCard.depositMoney" placeholder="请输入金额">
                            <template slot="append">张/元</template>
                          </el-input>
                        </el-form-item>
                      </div>
                    </el-form-item> -->
                  </el-form>
                </div>
              </div>
          </panel>
          <panel title="销售游戏" :show="true" style="margin-bottom:15px">
            <div class="table-wrap">
              <el-table :data="gameData" border>
                <el-table-column type="index" label="序号" min-width="100px"></el-table-column>
                <el-table-column prop="gameName" label="游戏名称"></el-table-column>
                <el-table-column label="投注权限">
                  <template slot-scope="scope">
                    <span class="icon-circle" 
                      :class="{
                        green:scope.row.throwRight=='1',
                        red:scope.row.throwRight=='0',}">
                      {{scope.row.throwRight==1?'启用':'禁止'}}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="兑奖权限">
                  <template slot-scope="scope">
                    <span class="icon-circle" 
                      :class="{
                        green:scope.row.cashRight=='1',
                        red:scope.row.cashRight=='0',}">
                      {{scope.row.cashRight==1?'启用':'禁止'}}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="sellBeginTime" label="开始销售时间"></el-table-column>
                <el-table-column prop="sellEndTime" label="结束销售时间"></el-table-column>
              </el-table>
            </div>
          </panel>
          <panel title="渠道附件" :show="true" style="margin-bottom: 15px;">
            <div class="table-wrap">
              <appendix-table :tableData="channelFileData" downUrl="downloadChannelFiles"></appendix-table>
            </div>
          </panel>
        </div>
      </el-tab-pane>
      <el-tab-pane label="渠道资源" name="resource">
        <el-tabs v-model="selected" type="card" @tab-click="tabSelect" class="tabs">
          <el-tab-pane label="设备" name="1">
            <device-table v-if="selected == 1"></device-table>
          </el-tab-pane>
          <el-tab-pane label="配件" name="2">
            <parts-table v-if="selected == 2"></parts-table>
          </el-tab-pane>
          <el-tab-pane label="设施" name="4">
            <facilities-table v-if="selected == 4"></facilities-table>
          </el-tab-pane>
          <el-tab-pane label="耗材" name="3">
            <consume-table v-if="selected == 3"></consume-table>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :visible.sync="showImg" :title="title">
      <img width="100%" :src="showImgUrl" alt="">
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import deviceTable from '../components/deviceTable';
import facilitiesTable from '../components/facilitiesTable';
import consumeTable from '../components/consumeTable';
import partsTable from '../components/partsTable';
import AppendixTable from '../../game/components/appendixTable'

export default {
  name: "",
  components: {
    deviceTable,
    facilitiesTable,
    consumeTable,
    partsTable,
    AppendixTable
  },
  data() {
    return {
      active: 'detail',
      selected: '1',
      channelData: [
        { title: "所属机构", value: "", prop: "insName" },
        { title: "渠道类型", value: "", prop: "channelType" },
        { title: "渠道等级", value: "", prop: "channelLevelName" },
        { title: '销售厅名称', value: "", prop: "channelName"},
        { title: "渠道编号", value: "", prop: "channelNo" },
        { title: "经营场所属性", value: "", prop: "runField" },
        { title: "销售厅面积", value: "", prop: "pointArea" },
        // { title: "渠道纬度", value: "", prop: "latitude" },
        // { title: "渠道经度", value: "", prop: "longitude" },
        { title: "投注卡开卡次数限制", value: "", prop: "buyCardLimit" },
        { title: "试玩卡开卡次数限制", value: "", prop: "tryCardLimit" },
        { title: "充值次数限制", value: "", prop: "rechargeCount" },
        { title: "渠道人数上限", value: "", prop: "channelLimit" },
        { title: "账户记录查询台数", value: "", prop: "showMachineCount" },
        { title: "渠道地址", value: "", prop: "channelAddress" },
      ],
      memberData: [
        { title: "姓名", value: "", prop: "accountName" },
        { title: "性别", value: "", prop: "sex" },
        { title: "年龄", value: "", prop: "age" },
        { title: "手机号码", value: "", prop: "phone" },
        { title: "身份证号码", value: "", prop: "channelIdentity" },
        { title: "联系地址", value: "", prop: "address" },
      ],
      financeData: [
        {title: '合作预交款', prop: 'coPrepareMoney', value: ''},
        // {title: '授信额度', prop: 'creditQuota', value: ''},
        {title: '代销费率', prop: 'agentSellRate', value: ''},
        // {title: '收款凭证', prop: 'evidence', value: ''}
      ],
      betCard: {
        // 投注卡的数据
        charge: "",
        amount: "",
        depositSet: "0", // 押金设置 0-不收费；1-收费，2-按投注卡申请量收费
        depositMoreThan: "",
        depositMoney: "" // 押金金额
      },
      gameData: [],
      resourceData: [],
      evidenceData: [], // 收款凭证
      photoData: [], // 证件照片
      showImg: false,
      isFinance: false, // 是否显示财务信息
      showImgUrl: '',
      channelFileData: [],
      insData: [],
      cityData: [],
      regionCode: '',
      address: '',
      title: '',
    };
  },
  created() {
    this.getInsData()
  },
  methods: {
    // 获取机构列表
    getInsData() {
      const self = this;
      const data = {};
      (async data => {
        let res = await self.$api.QueryUserAndInsTree({ data });
        if (res && res.code == 0) {
          console.log("res", res.data);
          self.insData = res.data;
          let param = {
            channelId: self.$route.query.channelId
          };
          self.getChannelDetail(param)
        }
      })(data);
    },
    // 渠道地址
    getChannelAddress(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getChannelAddress({ data });
        if (res && res.code == 0) {
          console.log("res", res.data);
          self.cityData = res.data;
          let text = self.$formMethods.getInsArray(self.regionCode, 'code', self.cityData, 'text')
          let txt = text.reverse().join('')
          console.log('text', text)
          self.channelData.forEach((item)=>{
            if(item.prop=='channelAddress') {
              item.value = `${txt}${self.address}`;
            }
          })
        }
      })(data);
    },
    tabSelect() {

    },
    tabActive() {

    },
    previewImg(url, text) {
      this.title = text;
      this.showImg = true;
      this.showImgUrl = url;
    },
    // 转换金额 非百分
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
    getChannelDetail(data) {
      const self = this;
      (async (data)=>{
				let res = await self.$api.getChannelDetail({data})
				if(res && res.code == 0) {
          console.log('res', res.data) //0关闭 1开启
          let data = res.data;
           // 需要转换金额 非百分制的字段
          let moneyArray = ['charge', 'depositMoney', 'amount', 'agentSellRate']
          moneyArray.forEach((item)=>{
            data = self.toMoneyReal(data, item)
          })
          // 基础信息
          data.channelVO&&self.channelData.forEach(item=>{
            item.value = data.channelVO[item.prop] || data.financeInfoVO[item.prop];
            if(item.prop=='channelType') {
              item.value = data.channelVO.channelType==0?'自营厅':'合作厅'
            }
            if(item.prop == 'runField') {
              item.value=data.financeInfoVO.runField==0?'自有':'租赁'
            }
            if(item.prop == 'pointArea') {
              item.value = `${item.value} m²`
            }
            if(item.prop == 'channelLevel') {
              let options = {
                1: '一级',
                2: '二级',
                3: '三级',
                4: '四级',
              };
              item.value = options[item.value];
            }
            if(item.prop=='buyCardLimit'||item.prop=='tryCardLimit'||item.prop=='rechargeCount') {
              item.value = `${item.value} 次`
            }
          })
          if(data.channelVO.corporateName) {
              let obj = { title: "合作伙伴", value: "", prop: "corporateName" };
              obj.value = data.channelVO.corporateName;
              self.channelData.push(obj)
            }
          // 是否显示财务信息
          self.isFinance = data.channelVO.channelType == 1 ? true : false;
          // 财务信息
          data.financeInfoVO&&self.financeData.forEach(item=>{
            if(item.prop == 'coPrepareMoney') {
              item.value = `${this.$common.thousandMark(data.financeInfoVO.coPrepareMoney)} 元`
            }
            if(item.prop == 'agentSellRate') {
              item.value = `${data.financeInfoVO.agentSellRate} %`
            }
          })
          // 收款凭证
          self.evidenceData = data.financeInfoVO.evidence&&data.financeInfoVO.evidence.split(',')
          // 证件照片
          self.photoData = data.channelFundVO.photo&&data.channelFundVO.photo.split(',')
          // 销售游戏列表
          self.gameData = data.gameRightList;
          // 发放资源
          self.resourceData = data.deviceList;
          // 人员信息
          data.channelFundVO&&self.memberData.forEach(item => {
            item.value = data.channelFundVO[item.prop]
            if(item.prop == 'age') {
              item.value = item.value?`${item.value} 岁`: '';
            }
          })
          // 投注卡信息
          if(data.cardRuleVO) {
            self.betCard = data.cardRuleVO;
            self.betCard.depositSet = String(self.betCard.depositSet)
          }
          // 渠道附件
          let channelList = data.channelVO;
          if(channelList.attachId) {
            let array = channelList.attachId.split(',');
            array.forEach((item)=>{
              let obj = {};
              obj.name = item.split('/')[item.split('/').length-1];
              obj.url = item;
              obj.createTime = this.$moment(channelList.createTime).format('YYYY-MM-DD HH:mm:ss');
              obj.createByName = channelList.createByName||'';
              self.channelFileData.push(obj);
            })
          }
          // 渠道地址的回填
          self.regionCode = data.channelVO.regionCode;
          self.address = data.channelVO.channelAddress;
          let type = self.$formMethods.getInsArray(data.channelVO.insId, 'id', self.insData, 'type')
          let param = {
            insId: data.channelVO.insId,
            type: type[0]
          };
          self.getChannelAddress(param);
				}
      })(data)
    },
    //转化千分符
    changeNumber(val) {
      let reg = /\d{1,3}(?=(\d{3})+$)/g;
      var arr = (val / 100)
        .toFixed(2)
        .toString()
        .split(".");
      var x = arr[0];
      var y = arr[1];
      return `${x.replace(reg, "$&,")}.${y}`;
    },
  }
};
</script>

<style lang="less" scoped>
.flex-wrap {
  display: flex;
  align-items: center;
  .label {
    color: #444;
    font-size: 12px;
    flex: none;
    margin: 0 8px;
  }
}
.radio-wrap{
  width: 490px;
}
.table-wrap{
  padding: 10px;
}
</style>
