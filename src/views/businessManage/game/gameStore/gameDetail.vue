<template>
  <div class="vlt-card store-check">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="游戏详情" name="1">
        <panel title="游戏信息" :show="true" style="margin-bottom: 15px;">
          <base-info :infoList="gameInfoVo">
            <li class="info-item">
              <span class="title">游戏图标：</span>
              <p class="content"><el-link type="primary" :underline="false" tag="p" style="font-size: 12px;" @click="previewImg">查看</el-link></p>
            </li>
          </base-info>
        </panel>
        <panel title="开发商信息" :show="true" style="margin-bottom: 15px;">
          <base-info :infoList="developerInfoVo"></base-info>
        </panel>
        <panel title="版本配置" :show="true" style="margin-bottom: 15px;">
          <div class="table-wrap">
            <version-table :tableData="versionTableData"></version-table>
          </div>
        </panel>
        <panel title="游戏附件" :show="true" style="margin-bottom: 15px;">
          <div class="table-wrap">
            <appendix-table :tableData="gameFileData"></appendix-table>
          </div>
        </panel>
        <panel title="试玩附件" :show="true" style="margin-bottom: 15px;">
          <div class="table-wrap">
            <appendix-table :tableData="playFileData"></appendix-table>
          </div>
        </panel>
        <panel title="上市附件" :show="true" style="margin-bottom: 15px;">
          <div class="table-wrap">
            <appendix-table :tableData="marketFileData"></appendix-table>
          </div>
        </panel>
        <panel title="变更附件" :show="true" style="margin-bottom: 15px;">
          <div class="table-wrap">
            <appendix-table :tableData="changeFileData"></appendix-table>
          </div>
        </panel>
        <panel title="退市附件" :show="true" style="margin-bottom: 15px;">
          <div class="table-wrap">
            <appendix-table :tableData="leaveFileData"></appendix-table>
          </div>
        </panel>
      </el-tab-pane>
      <el-tab-pane label="试玩记录" name="2">
        <el-table :data="tryList" border style="width: 100%">
          <el-table-column type="index" fixed label="序号" width="55"></el-table-column>
          <el-table-column prop="gamePlayCode" label="计划编号" width="100"></el-table-column>
          <el-table-column prop="gamePlayName" label="计划名称" width="180"></el-table-column>
          <el-table-column prop="versionNumber" label="游戏版本"></el-table-column>
          <el-table-column prop="gameName" label="试玩游戏" min-width="120px"></el-table-column>
          <el-table-column label="计划状态" min-width="120px">
            <template slot-scope="scope">
              <span
                class="icon-circle"
                :class="{
                  blue:scope.row.gamePlayStatus=='1',
                  green:scope.row.gamePlayStatus=='2',
                  red:scope.row.gamePlayStatus=='3',}"
              >{{scope.row.strStatus}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="startPlayTime" label="试玩开始时间" width="150"></el-table-column>
          <el-table-column prop="endPlayTime" label="试玩结束时间" width="150"></el-table-column>
          <el-table-column prop="userName" label="创建人" width="150"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="150"></el-table-column>
          <el-table-column fixed="right" label="操作" min-width="100">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                v-prevent="2000"
                @click.native="detail('trialPlanDetail', scope.row)"
                :id="scope.name+'-detailsOne-'+scope.$index"
              >查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <table-paging
          position="right"
          :total="total"
          :currentPage="params.page"
          :pageSize="params.pageSize"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
        ></table-paging>
      </el-tab-pane>
      <el-tab-pane label="上市记录" name="3">
        <el-table :data="marketList" border style="width: 100%">
          <el-table-column label="序号" fixed type="index" width="55"></el-table-column>
          <el-table-column prop="gameListCode" label="计划编号" min-width="120px"></el-table-column>
          <el-table-column prop="gameListName" label="计划名称" min-width="160px"></el-table-column>
          <el-table-column prop="versionNumber" label="上市版本" min-width="120px"></el-table-column>
          <el-table-column prop="gameName" label="上市游戏" min-width="120px"></el-table-column>
          <el-table-column label="计划状态" min-width="120px">
            <template slot-scope="scope">
              <span
                class="icon-circle"
                :class="{
                  blue:scope.row.gameListStatus=='1',
                  green:scope.row.gameListStatus=='2',
                  red:scope.row.gameListStatus=='3',}"
              >{{scope.row.strStatus}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="gameListTime" label="上市时间" min-width="160px"></el-table-column>
          <el-table-column prop="userName" label="创建人" min-width="120px"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="160px"></el-table-column>
          <el-table-column fixed="right" label="操作" min-width="100">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                v-prevent="2000"
                @click.native="detail('gameMarketPlanDetail', scope.row)"
                :id="scope.name+'-detailsTwo-'+scope.$index"
              >查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <table-paging
          position="right"
          :total="total"
          :currentPage="params.page"
          :pageSize="params.pageSize"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
        ></table-paging>
      </el-tab-pane>
      <el-tab-pane label="变更记录" name="4">
        <el-table :data="changeList" border style="width: 100%">
          <el-table-column label="序号" fixed type="index" width="55"></el-table-column>
          <el-table-column prop="changePlanCode" label="计划编号" min-width="120px"></el-table-column>
          <el-table-column prop="changePlanName" label="计划名称" min-width="160px"></el-table-column>
          <el-table-column prop="versionNumber" label="变更版本" min-width="120px"></el-table-column>
          <el-table-column prop="gameName" label="变更游戏" min-width="120px"></el-table-column>
          <el-table-column label="计划状态" min-width="120px">
            <template slot-scope="scope">
              <span
                class="icon-circle"
                :class="{
                  blue:scope.row.changePlanStatus=='1',
                  green:scope.row.changePlanStatus=='2',
                  red:scope.row.changePlanStatus=='3',}"
              >{{scope.row.strStatus}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="changePlanTime" label="生效时间" min-width="160px"></el-table-column>
          <el-table-column prop="userName" label="创建人" min-width="120px"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="160px"></el-table-column>
          <el-table-column fixed="right" label="操作" min-width="100">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                v-prevent="2000"
                @click.native="detail('gameChangePlanDetail', scope.row)"
                :id="scope.name+'-detailsThree-'+scope.$index"
              >查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <table-paging
          position="right"
          :total="total"
          :currentPage="params.page"
          :pageSize="params.pageSize"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
        ></table-paging>
      </el-tab-pane>
      <el-tab-pane label="退市记录" name="5">
        <el-table :data="leaveList" border style="width: 100%">
          <el-table-column label="序号" fixed type="index" width="55"></el-table-column>
          <el-table-column prop="leaveCode" label="计划编号" min-width="120px"></el-table-column>
          <el-table-column prop="leaveName" label="计划名称" min-width="160px"></el-table-column>
          <el-table-column prop="versionNumber" label="当前版本" width="160px"></el-table-column>
          <el-table-column prop="gameName" label="退市游戏" min-width="120px"></el-table-column>
          <el-table-column prop="leaveTime" label="退市时间" width="160px"></el-table-column>
          <el-table-column prop="leaveStatus" label="计划状态" min-width="100px">
            <template slot-scope="scope">
              <span
                class="icon-circle"
                :class="{
                  blue:scope.row.leaveStatus=='1',
                  green:scope.row.leaveStatus=='2',
                  red:scope.row.leaveStatus=='3',}"
              >{{scope.row.strStatus}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="userName" label="创建人" min-width="100px"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="160"></el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                v-prevent="2000"
                @click.native="detail('gameDelistingPlanDetail', scope.row)"
                :id="scope.name+'-detailsFour-'+scope.$index"
              >查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <table-paging
          position="right"
          :total="total"
          :currentPage="params.page"
          :pageSize="params.pageSize"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
        ></table-paging>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :visible.sync="showImg" title="游戏图标">
      <img width="100%" :src="showImgUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import VersionTable from "../components/versionTable";
import AppendixTable from "../components/appendixTable";

export default {
  name: "gameDetail",
  components: {
    VersionTable,
    AppendixTable
  },
  data() {
    return {
      activeName: "1",
      gameInfoVo: [
        { title: "游戏编码", value: "", prop: "gameCode" },
        { title: "游戏名称", value: "", prop: "gameName" },
        { title: "游戏类型", value: "", prop: "gameTypeName" },
        { title: "游戏状态", value: "", prop: "gameStatus" },
        { title: "游戏版权", value: "", prop: "gameGenlot" },
        { title: "游戏简介", value: "", prop: "gameDesc" },
        { title: "创建人", value: "", prop: "userName" },
        { title: "创建时间", value: "", prop: "createTime" },
        // { title: "更新人", value: "", prop: "updateByName" },
        // { title: "更新时间", value: "", prop: "updateTime" }
      ],
      developerInfoVo: [
        { title: "开发商名称", value: "", prop: "developerName" },
        { title: "联系人", value: "", prop: "person" },
        { title: "手机号码", value: "", prop: "cellPhone" },
        { title: "电子邮箱", value: "", prop: "email" },
        { title: "传真电话", value: "", prop: "faxPhone" },
        { title: "详细地址", value: "", prop: "address" }
      ],
      appendixInfo: [],
      insData: [], // 机构数据
      total: 0,
      params: {
        page: 1,
        pageSize: 10,
        param: {
          gameId: ""
        }
      },
      versionTableData: [],
      gameFileData: [],
      playFileData: [],
      marketFileData: [],
      changeFileData: [],
      leaveFileData: [],
      tryList: [], // 试玩记录
      marketList: [], // 上市记录列表
      changeList: [], // 变更记录列表
      leaveList: [], // 退市记录列表
      delistList: [], // 数据封存
      showImg: false,
      showImgUrl: '',
    };
  },
  created() {
    this.getInsData();
    this.getGameStoreInfo();
    this.params.param.gameId = this.$route.query.gameId * 1;
    this.getGameConList(this.params);
  },
  activated() {
    // this.getGameStoreInfo();
    // this.params.param.gameId = this.$route.query.gameId*1;
    // this.getGameConList(this.params)
  },
  computed: {
    ...mapGetters(["gameTypeOptions"])
  },
  methods: {
    previewImg(url) {
      this.showImg = true;
    },
    // 游戏版本配置
    getGameConList(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getGameConList({ data });
        if (res && res.code == 0) {
          self.total = res.data.total;
          let options = {
            1: "储备",
            2: "试玩",
            3: "上市",
            4: "退市"
          };
          res.data.records.forEach(item => {
            item.versionStatusName = options[item.versionStatus];
          });
          self.versionTableData = res.data.records;
        }
      })(data);
    },
    // 获取机构数据
    getInsData() {
      const self = this;
      const data = {};
      (async data => {
        let res = await self.$api.QueryUserAndInsTree({ data });
        if (res && res.code == 0) {
          this.insData = res.data;
        }
      })(data);
    },
    changeTime(val) {
      return this.$moment(val).format("YYYY-MM-DD HH:mm:ss");
    },
    getInsArray(val) {
      let arr = val.split(",");
      let textArray = [];
      arr.forEach(item => {
        let array = this.$formMethods.getInsArray(
          item,
          "id",
          this.insData,
          "text"
        );
        // let str = array&&array.reverse().join('/')
        let str = array && array[0];
        console.log(str);
        textArray.push(str);
      });
      return textArray.join("；");
    },
    translatePlanStatus(val) {
      let options = {
        1: "审批中",
        2: "审批通过",
        3: "审批拒绝"
      };
      return options[val];
    },
    detail(name, param) {
      this.$router.push({
        name,
        query: {
          id: param.id,
          gameId: param.gameId,
          deployCode: param.deployCode,
          type: 1
        }
      });
    },
    // 下载
    async downLoad(val) {
      let formData = new FormData();
      formData.append("filePath", val);
      const res = await this.$api.downGameLoad({
        data: formData,
        responseType: "blob"
      });
      var blob = new Blob([res], {
        type:
          "application/msword;application/vnd.openxmlformats-officedocument.wordprocessingml.document;image/jpeg;image/png;application/x-rar-compressed;application/vnd.ms-excel;application/zip;charset=utf-8"
      });
      var url = window.URL.createObjectURL(blob);
      var aLink = document.createElement("a");
      aLink.style.display = "none";
      aLink.href = url;
      aLink.setAttribute("download", val.split("/")[val.split("/").length - 1]);
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
      console.log(res);
    },
    getGameStoreInfo() {
      const self = this;
      let options = {
        id: self.$route.query.gameId
      };
      (async data => {
        let res = await self.$api.getGameStoreInfo({ data });
        if (res && res.code == 0) {
          // 游戏信息
          if (res.data.gameInfoVo) {
            let options = {
              1: "储备",
              2: "试玩",
              3: "上市",
              4: "退市"
            };
            self.showImgUrl = res.data.gameInfoVo.gameIcon;
            self.gameInfoVo.forEach(item => {
              item.value = res.data.gameInfoVo[item.prop];
              if (item.prop == "gameStatus") {
                item.value = options[res.data.gameInfoVo.gameStatus];
              }
              if (item.prop == "createTime") {
                item.value = this.$moment(
                  res.data.gameInfoVo.createTime
                ).format("YYYY-MM-DD HH:mm:ss");
              }
              if (item.prop == "updateTime") {
                item.value = this.$moment(
                  res.data.gameInfoVo.updateTime
                ).format("YYYY-MM-DD HH:mm:ss");
              }
            });
          }
          // 开发商信息
          if (res.data.developerInfoVo) {
            self.developerInfoVo.forEach(item => {
              item.value = res.data.developerInfoVo[item.prop];
            });
          }
          // 游戏附件
          let gameList = res.data.gameInfoVo;
          if (gameList.filePath) {
            let array = gameList.filePath.split(",");
            array.forEach(item => {
              let obj = {};
              obj.name = item.split("/")[item.split("/").length - 1];
              obj.url = item;
              obj.createTime = this.$moment(gameList.createTime).format(
                "YYYY-MM-DD HH:mm:ss"
              );
              obj.createByName = gameList.userName || "";
              self.gameFileData.push(obj);
            });
          }
          // 试玩附件
          let playList = res.data.gamePlayPlanVoList;
          if (playList.length > 0) {
            playList.forEach(item => {
              let array = item.filePath && item.filePath.split(",");
              array &&
                array.forEach(ele => {
                  let obj = {};
                  obj.name = ele.split("/")[ele.split("/").length - 1];
                  obj.url = ele;
                  obj.createTime = this.$moment(item.createTime).format(
                    "YYYY-MM-DD HH:mm:ss"
                  );
                  obj.createByName = item.userName || "";
                  self.playFileData.push(obj);
                });
            });
          }
          // 上市附件
          let marketList = res.data.gameListPlanVoList;
          if (marketList.length > 0) {
            marketList.forEach(item => {
              let array = item.filePath && item.filePath.split(",");
              array &&
                array.forEach(ele => {
                  let obj = {};
                  obj.name = ele.split("/")[ele.split("/").length - 1];
                  obj.url = ele;
                  obj.createTime = this.$moment(item.createTime).format(
                    "YYYY-MM-DD HH:mm:ss"
                  );
                  obj.createByName = item.userName || "";
                  self.marketFileData.push(obj);
                });
            });
          }
          // 变更附件
          let changeList = res.data.gameChangePlanVoList;
          if (changeList.length > 0) {
            changeList.forEach(item => {
              let array = item.filePath && item.filePath.split(",");
              array &&
                array.forEach(ele => {
                  let obj = {};
                  obj.name = ele.split("/")[ele.split("/").length - 1];
                  obj.url = ele;
                  obj.createTime = this.$moment(item.createTime).format(
                    "YYYY-MM-DD HH:mm:ss"
                  );
                  obj.createByName = item.userName || "";
                  self.changeFileData.push(obj);
                });
            });
          }
          // 退市附件
          let leaveList = res.data.gameLeavePlanVoList;
          if (leaveList.length > 0) {
            leaveList.forEach(item => {
              let array = item.filePath && item.filePath.split(",");
              array &&
                array.forEach(ele => {
                  let obj = {};
                  obj.name = ele.split("/")[ele.split("/").length - 1];
                  obj.url = ele;
                  obj.createTime = this.$moment(item.createTime).format(
                    "YYYY-MM-DD HH:mm:ss"
                  );
                  obj.createByName = item.userName || "";
                  self.leaveFileData.push(obj);
                });
            });
          }
        }
      })(options);
    },

    handleClick(tab, event) {
      this.params.page = 1;
      if (tab.index == "0") {
        // 游戏详情
        this.getGameStoreInfo(this.params);
      }
      if (tab.index == "1") {
        // 试玩记录
        this.tryList = [];
        this.getTryPlanList(this.params);
      }
      if (tab.index == "2") {
        // 上市记录
        this.marketList = [];
        this.getMarketPlanList(this.params);
      }
      if (tab.index == "3") {
        // 变更记录
        this.changeList = [];
        this.getChangePlanList(this.params);
      }
      if (tab.index == "4") {
        // 退市记录
        this.leaveList = [];
        this.getDelistingPlanList(this.params);
      }
    },
    // 上市记录
    getMarketPlanList(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getMarketPlanList({ data });
        console.log(res);
        if (res && res.code == 0) {
          self.total = res.data.total;
          let options = {
            1: "未开始",
            2: "已上市",
            3: "已结束"
          };
          res.data.records.forEach(item => {
            item.strStatus = options[item.gameListStatus];
            item.createTime = this.$moment(item.createTime).format(
              "YYYY-MM-DD HH:mm:ss"
            );
            item.gameListTime =
              item.gameListTime &&
              this.$moment(item.gameListTime).format("YYYY-MM-DD HH:mm:ss");
          });
          self.marketList = res.data.records;
        }
      })(data);
    },
    // 试玩记录
    getTryPlanList(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getTryPlanList({ data });
        console.log(res);
        if (res && res.code == 0) {
          self.total = res.data.total;
          let options = {
            1: "未开始",
            2: "已上市",
            3: "已结束"
          };
          res.data.records.forEach(item => {
            item.strStatus = options[item.gamePlayStatus];
            item.createTime = this.$moment(item.createTime).format(
              "YYYY-MM-DD HH:mm:ss"
            );
            item.startPlayTime =
              item.startPlayTime &&
              this.$moment(item.startPlayTime).format("YYYY-MM-DD HH:mm:ss");
            item.endPlayTime =
              item.endPlayTime &&
              this.$moment(item.endPlayTime).format("YYYY-MM-DD HH:mm:ss");
          });
          self.tryList = res.data.records;
        }
      })(data);
    },
    // 变更记录
    getChangePlanList(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getChangePlanList({ data });
        console.log(res);
        if (res && res.code == 0) {
          self.total = res.data.total;
          let options = {
            1: "未开始",
            2: "已生效"
          };
          res.data.records.forEach(item => {
            item.strStatus = options[item.changePlanStatus];
            item.createTime = this.$moment(item.createTime).format(
              "YYYY-MM-DD HH:mm:ss"
            );
            item.changePlanTime =
              item.changePlanTime &&
              this.$moment(item.changePlanTime).format("YYYY-MM-DD HH:mm:ss");
          });
          self.changeList = res.data.records;
        }
      })(data);
    },
    // 退市记录
    getDelistingPlanList(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getDelistingPlanList({ data });
        if (res && res.code == 0) {
          console.log(res.data);
          self.total = res.data.total;
          let options = {
            1: "未开始",
            2: "已完成",
            3: "退市兑奖"
          };
          res.data.records.forEach(item => {
            item.strStatus = options[item.leaveStatus];
            item.leaveTime = self
              .$moment(item.leaveTime)
              .format("YYYY-MM-DD HH:mm:ss");
            item.createTime = self
              .$moment(item.createTime)
              .format("YYYY-MM-DD HH:mm:ss");
          });
          self.leaveList = res.data.records;
        }
      })(data);
    },
       handleSizeChange(val) {
      this.params.page = 1;
      this.params.pageSize = val;
      if(this.activeName == '2') { // 上市记录
        this.marketList = [];
        this.getMarketPlanList(this.params)
      }
      if(this.activeName == '3') { // 变更记录
        this.changeList = [];
        this.getChangePlanList(this.params)
      }
      if(this.activeName == '4') { // 退市记录
        this.leaveList = [];
        this.getDelistingPlanList(this.params)
      }
    },

    handleCurrentChange(val) {
      this.params.page = val;
      if(this.activeName == '2') { // 上市记录
        this.marketList = [];
        this.getMarketPlanList(this.params)
      }
      if(this.activeName == '3') { // 变更记录
        this.changeList = [];
        this.getChangePlanList(this.params)
      }
      if(this.activeName == '4') { // 退市记录
        this.leaveList = [];
        this.getDelistingPlanList(this.params)
      }
    }
  }
};
</script>

<style lang="less" scoped>
.store-check {
  background: #fff;
  // border-radius: 8px;
}
.el-tabs__content {
  background: #000;
}
.panel {
  margin-bottom: 15px;
}
.base-info .info-list .text {
  font-size: 12px;
  overflow: hidden;
  word-break: break-all;
}
.table-wrap {
  padding: 16px;
}
</style>