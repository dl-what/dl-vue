<template>
  <div class="vlt-card">
    <panel title="退市计划" :show="true">
      <base-info :infoList="gameLeavePlanVo"></base-info>
    </panel>
    <panel title="游戏信息" :show="true">
      <base-info :infoList="gameInfoVo">
        <li class="info-item">
          <span class="title">游戏图标：</span>
          <p class="content"><el-link type="primary" :underline="false" tag="p" style="font-size: 12px;" @click="previewImg">查看</el-link></p>
        </li>
      </base-info>
    </panel>
    <panel title="游戏开发商" :show="true">
      <base-info :infoList="developerInfo"></base-info>
    </panel>
    <panel title="版本配置" :show="true" style="margin-bottom: 15px;">
      <div class="table-wrap">
        <version-table :tableData="versionTableData"></version-table>
      </div>
    </panel>
    <panel title="退市附件" :show="true" style="margin-bottom: 15px;">
      <div class="table-wrap">
        <appendix-table :tableData="leaveFileData"></appendix-table>
      </div>
    </panel>
    <el-dialog :visible.sync="showImg" title="游戏图标">
      <img width="100%" :src="showImgUrl" alt="">
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
import { mapGetters } from 'vuex';
import VersionTable from '../components/versionTable'
import AppendixTable from '../components/appendixTable'

export default {
  name: "gameMarketPlanDetail",
  components: {
    VersionTable,
    AppendixTable
  },
  data() {
    return {
      gameLeavePlanVo: [
        { title: "计划名称", value: "", prop: "leaveName" },
        { title: "计划编号", value: "", prop: "leaveCode" },
        // { title: "退市版本", value: "", prop: "versionNumber" },
        { title: "退市时间", value: "", prop: "leaveTime" },
        { title: "截止兑奖时间", value: "", prop: "endRewardTime" },
        { title: "计划状态", value: "", prop: "leaveStatus" },
        { title: "计划简介", value: "", prop: "leaveDesc" },
        { title: "退市区域", value: "", prop: "leaveIns" },
        { title: "退市渠道", value: "", prop: "leaveChannel" },
        
        { title: "创建人", value: "", prop: "createByName" },
        { title: "创建时间", value: "", prop: "createTime" }
      ],
      gameInfoVo: [
        { title: "游戏编码", value: "", prop: "gameCode" },
        { title: "游戏名称", value: "", prop: "gameName" },
        { title: "游戏类型", value: "", prop: "gameTypeName" },
        { title: "游戏状态", value: "", prop: "gameStatusName" },
        { title: "版权归属", value: "", prop: "gameGenlot" },
        { title: "游戏简介", value: "", prop: "gameDesc" },
        { title: "创建人", value: "", prop: "userName" },
        { title: "创建时间", value: "", prop: "createTime" },
      ],
      developerInfo: [
        { title: "开发商名称", value: "", prop: "developerName" },
        { title: "联系人", value: "", prop: "person" },
        { title: "手机号码", value: "", prop: "cellPhone" },
        { title: "电子邮箱", value: "", prop: "email" },
        { title: "传真电话", value: "", prop: "faxPhone" },
        { title: "联系地址", value: "", prop: "address" },
      ],
      formatGameStatus:['存储', '试玩', '上市', '变更', '退市'],
      formatPlanStatus: ['审批中', '审批拒绝', '待上市', '已上市'],
      leaveFileData: [],
      versionTableData: [],
      params: {
        page: 1,
        pageSize: 10,
        param: {
          gameId: ''
        }
      },
      showImg: false,
      showImgUrl: '',
    };
  },
  created() {
    // 计划详情
    const data = {
      gameId: this.$route.query.gameId,
      id: this.$route.query.id
    };
    this.getDelistingPlanDetail(data);
    // 版本配置
    this.params.param.gameId = this.$route.query.gameId*1;
    this.getGameConList(this.params)
  },
  computed: {
    ...mapGetters(['insData'])
  },
  methods: {
    previewImg(url) {
      this.showImg = true;
    },
    // 计划详情
    getDelistingPlanDetail(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getDelistingPlanDetail({ data });
        // console.log(res);
        if (res && res.code == 0) {
          // 游戏信息
          let options = {
            1: '储备',
            2: '试玩',
            3: '上市',
            4: '退市'
          };
          if(res.data.gameInfoVo) {
            self.showImgUrl = res.data.gameInfoVo.gameIcon;
            self.gameInfoVo.forEach((item)=>{
              item.value = res.data.gameInfoVo[item.prop]
              if(item.prop == 'gameStatusName') {
                item.value = options[res.data.gameInfoVo.gameStatus]
              }
              if(item.prop == 'createTime') {
                item.value = this.$moment(res.data.gameInfoVo.createTime).format('YYYY-MM-DD HH:mm:ss')
              }
            })
          }
          // 开发商信息
          if(res.data.developerInfo) {
            self.developerInfo.forEach((item)=>{
              item.value = res.data.developerInfo[item.prop]
            })
          }
          // 计划信息
          if(res.data.gameLeavePlanVo) {
            let options = {
              1: '未开始',
              2: '已退市',
              3: '退市兑奖',
            };
            self.gameLeavePlanVo.forEach((item)=>{
              item.value = res.data.gameLeavePlanVo[item.prop]
              if(item.prop == 'leaveIns') {
                item.value = self.getLeaveIns(item.value)
              }
              if(item.prop == 'leaveStatus') {
                item.value = options[res.data.gameLeavePlanVo.leaveStatus]
              }
              if(item.prop == 'createTime') {
                item.value = this.$moment(res.data.gameLeavePlanVo.createTime).format('YYYY-MM-DD HH:mm:ss')
              }
              if(item.prop == 'leaveTime') {
                item.value = this.$moment(res.data.gameLeavePlanVo.leaveTime).format('YYYY-MM-DD HH:mm:ss')
              }
              if(item.prop == 'endRewardTime') {
                item.value = this.$moment(res.data.gameLeavePlanVo.endRewardTime).format('YYYY-MM-DD HH:mm:ss')
              }
              if(item.prop == 'leaveChannel') {
                if(res.data.gameLeavePlanVo.leaveChannel=='all') {
                  item.value = '区域内全部大厅';
                }else{
                  let array=[];
                  res.data.gameLeavePlanVo.leaveChannel.split(';').forEach((item)=>{
                    if(item) {
                      array.push(item)  
                    }
                  })
                  item.value = array.join('；')
                }
              }
            })
          }
          // 退市附件
          let leavePlanVo = res.data.gameLeavePlanVo
          if(leavePlanVo.filePath) {
            let array = leavePlanVo.filePath.split(',');
            array.forEach((item)=>{
              let obj = {};
              obj.name = item.split('/')[item.split('/').length-1];
              obj.url = item;
              obj.createTime = this.$moment(leavePlanVo.createTime).format('YYYY-MM-DD HH:mm:ss');
              obj.createByName = leavePlanVo.createByName||'';
              self.leaveFileData.push(obj);
            })
          }
        }
      })(data);
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
          })
          self.versionTableData = res.data.records;
				}
      })(data)
    },
    // 获取退市区域
    getLeaveIns(val) {
      let arr = val&&val.split(';');
      let textArray = [];
      arr&&arr.forEach((item)=>{
        if(item) {
          let array = this.$formMethods.getInsArray(item, 'id', this.insData, 'text')
          let str;
          if(array&&array.length>2) {
            str = `${array[1]}${array[0]}`
          }else{
            str = array&&array[0];
          }
          textArray.push(str)
        }
      })
      return textArray.join('；')
    },
    toVersion () {
      console.log('跳转到版本记录');
    },
    insetData (list, str, dataObj, getData) {
      let key = Object.keys(dataObj)
      list.forEach(item => {
        if (item.title == str) {
          item.value = dataObj[getData]
        }
        if (item.prop == "gameStatus" && dataObj[getData]!= null) {
          item.value = this.formatGameStatus[parseInt(dataObj[getData]) - 1]
        }
      }) 
    }
  }
};
</script>

<style lang="less" scoped>
.plan-check {
  background: white;
  margin: 20px 20px;
  border-radius: 8px;
  padding: 25px;
}
.panel {
  margin-bottom: 20px;
}
.table-wrap{
  padding: 10px 15px;
}
</style>
