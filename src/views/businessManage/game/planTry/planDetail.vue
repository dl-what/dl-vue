<template>
  <div class="vlt-card">
    <panel title="试玩计划" :show="true">
      <base-info :infoList="gamePlayPlanVo"></base-info>
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
    <panel title="试玩附件" :show="true" style="margin-bottom: 15px;">
      <div class="table-wrap">
        <appendix-table :tableData="playFileData"></appendix-table>
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
      gamePlayPlanVo: [
        { title: "计划名称", value: "", prop: "gamePlayName" },
        { title: "计划编号", value: "", prop: "gamePlayCode" },
        // { title: "试玩版本", value: "", prop: "versionNumber" },
        { title: "试玩开始时间", value: "", prop: "startPlayTime" },
        { title: "试玩结束时间", value: "", prop: "endPlayTime" },
        { title: "计划简介", value: "", prop: "gamePlayDesc" },
        { title: "计划状态", value: "", prop: "gamePlayStatus" },
        { title: "试玩区域", value: "", prop: "gamePlayIns" },
        { title: "试玩工具", value: "", prop: "gamePlayTool" },
        { title: "试玩渠道", value: "", prop: "gamePlayChannel" },
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
      fileList:[
        { title: "文档一.doc", value: "下载", prop: "newCharacter" }
      ],
      formatGameStatus:['存储', '试玩', '上市', '变更', '退市'],
      formatPlanStatus: ['未开始', '试玩中', '已结束'],
      playFileData: [],
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
    this.deployCode = this.$route.query.deployCode
    // 计划详情
    const data = {
      deployCode: this.deployCode,
      gameId: this.$route.query.gameId,
      id: this.$route.query.id
    };
    this.getTryPlanDetail(data);
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
    getTryPlanDetail(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getTryPlanDetail({ data });
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
          if(res.data.developerInfoVo) {
            self.developerInfoVo.forEach((item)=>{
              item.value = res.data.developerInfoVo[item.prop]
            })
          }
          // 计划信息
          if(res.data.gamePlayPlanVo) {
            let options = {
              1: '未开始',
              2: '试玩中',
              3: '已结束',
            };
            let gamePlayTool = {
              1: '试玩投注卡',
              2: '会员试玩权益',
              3: '全部'
            };
            self.gamePlayPlanVo.forEach((item)=>{
              item.value = res.data.gamePlayPlanVo[item.prop]
              if(item.prop == 'gamePlayIns') {
                item.value = self.getGameSaleIns(item.value)
              }
              if(item.prop == 'gamePlayStatus') {
                item.value = options[res.data.gamePlayPlanVo.gamePlayStatus]
              }
              if(item.prop == 'startPlayTime') {
                item.value = this.$moment(res.data.gamePlayPlanVo.startPlayTime).format('YYYY-MM-DD HH:mm:ss')
              }
              if(item.prop == 'endPlayTime') {
                item.value = this.$moment(res.data.gamePlayPlanVo.endPlayTime).format('YYYY-MM-DD HH:mm:ss')
              }
              if(item.prop == 'createTime') {
                item.value = this.$moment(res.data.gamePlayPlanVo.createTime).format('YYYY-MM-DD HH:mm:ss')
              }
              if(item.prop == 'gamePlayChannel') {
                if(res.data.gamePlayPlanVo.gamePlayChannel=='all') {
                  item.value = '区域内全部大厅';
                }else{
                  let array=[];
                  res.data.gamePlayPlanVo.gamePlayChannel.split(';').forEach((item)=>{
                    if(item) {
                      array.push(item)  
                    }
                  })
                  item.value = array.join('；')
                }
              }
              if(item.prop=='gamePlayTool') {
                item.value = gamePlayTool[res.data.gamePlayPlanVo.gamePlayTool]
              }
            })
          }
          // 试玩附件
          let playList = res.data.gamePlayPlanVo
          if(playList.filePath) {
            let array = playList.filePath.split(',');
            array.forEach((item)=>{
              let obj = {};
              obj.name = item.split('/')[item.split('/').length-1];
              obj.url = item;
              obj.createTime = this.$moment(playList.createTime).format('YYYY-MM-DD HH:mm:ss');
              obj.createByName = playList.userName||'';
              self.playFileData.push(obj);
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
    getGameSaleIns(val) {
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
