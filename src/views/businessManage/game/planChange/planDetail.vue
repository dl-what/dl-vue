<template>
  <div class="vlt-card">
    <panel title="变更计划" :show="true">
      <base-info :infoList="gameChangePlanVo"></base-info>
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
      <base-info :infoList="developerInfoVo"></base-info>
    </panel>
    <panel title="版本配置" :show="true" style="margin-bottom: 15px;">
      <div class="table-wrap">
        <version-table :tableData="versionTableData"></version-table>
      </div>
    </panel>
    <panel title="变更附件" :show="true" style="margin-bottom: 15px;">
      <div class="table-wrap">
        <appendix-table :tableData="changeFileData"></appendix-table>
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
      gameChangePlanVo: [
        { title: "计划名称", value: "", prop: "changePlanName" },
        { title: "计划编号", value: "", prop: "changePlanCode" },
        // { title: "变更版本", value: "", prop: "versionNumber" },
        { title: "计划简介", value: "", prop: "changePlanDesc" },
        { title: "计划状态", value: "", prop: "changePlanStatus" },
        { title: "变更时间", value: "", prop: "changePlanTime" },
        { title: "销售区域", value: "", prop: "changePlanIns" },
        { title: "销售渠道", value: "", prop: "changePlanChannel" },
        { title: "创建人", value: "", prop: "userName" },
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
      developerInfoVo: [
        { title: "开发商名称", value: "", prop: "developerName" },
        { title: "电子邮箱", value: "", prop: "email" },
        { title: "传真电话", value: "", prop: "faxPhone" },
        { title: "联系人", value: "", prop: "person" },
        { title: "联系地址", value: "", prop: "address" },
        { title: "手机号码", value: "", prop: "cellPhone" }
      ],
      formatGameStatus:['存储', '试玩', '上市', '变更', '退市'],
      formatPlanStatus: ['审批中', '审批拒绝', '待上市', '已上市'],
      changeFileData: [],
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
      deployCode: null,
    };
  },
  created() {
    this.deployCode = this.$route.query.deployCode;
    // 计划详情
    const data = {
      deployCode: this.deployCode,
      gameId: this.$route.query.gameId,
      id: this.$route.query.id
    };
    this.getChangePlanDetail(data);
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
    getChangePlanDetail(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getChangePlanDetail({ data });
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
              item.value = res.data.gameInfoVo[item.prop];
              if(item.prop == 'gameStatusName') {
                item.value = options[res.data.gameInfoVo.gameStatus]
              }
              if(item.prop == 'createTime') {
                item.value = this.$moment(res.data.gameInfoVo.createTime).format('YYYY-MM-DD HH:mm:ss')
              }
            })
          }
          // 开发商信息
          if(res.data.developerInfoVo) {
            self.developerInfoVo.forEach((item)=>{
              item.value = res.data.developerInfoVo[item.prop]
            })
          }
          // 计划信息
          if(res.data.gameChangePlanVo) {
            let options = {
              1: '未开始',
              2: '已上市',
              3: '已结束',
            };
            let gameChangePlanVo = res.data.gameChangePlanVo
            self.gameChangePlanVo.forEach((item)=>{
              item.value = gameChangePlanVo[item.prop]
              if(item.prop == 'changePlanIns') {
                item.value = self.getChangePlanIns(item.value)
              }
              if(item.prop == 'changePlanStatus') {
                item.value = options[gameChangePlanVo.changePlanStatus]
              }
              if(item.prop == 'createTime') {
                item.value = this.$moment(gameChangePlanVo.createTime).format('YYYY-MM-DD HH:mm:ss')
              }
              if(item.prop=='changePlanTime') {
                item.value = this.$moment(gameChangePlanVo.changePlanTime).format('YYYY-MM-DD HH:mm:ss')
              }
              if(item.prop == 'changePlanChannel') {
                if(gameChangePlanVo.changePlanChannel=='all') {
                  item.value = '区域内全部大厅';
                }else{
                  let array=[];
                  gameChangePlanVo.changePlanChannel.split(';').forEach((item)=>{
                    if(item) {
                      array.push(item)  
                    }
                  })
                  item.value = array.join('；')
                }
              }
            })
          }
          // 变更附件
          let changeList = res.data.gameChangePlanVo
          if(changeList.filePath) {
            let array = changeList.filePath.split(',');
            array.forEach((item)=>{
              let obj = {};
              obj.name = item.split('/')[item.split('/').length-1];
              obj.url = item;
              obj.createTime = this.$moment(changeList.createTime).format('YYYY-MM-DD HH:mm:ss');
              obj.createByName = changeList.userName||'';
              self.changeFileData.push(obj);
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
            if(item.deployCode==self.deployCode) {
              self.versionTableData = [item];
            }
          })
				}
      })(data)
    },
    // 获取销售区域
    getChangePlanIns(val) {
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
