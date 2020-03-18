<template>
  <div class="vlt-card game-store-list">
    <search-bar
      class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      :total="total"
      labelWidth="6em"
    >
      <control-bar slot="extend-bar" @select="selectBtn" :options="controlOptions"></control-bar>
    </search-bar>
    <el-table
      border
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="序号" fixed width="55">
        <template slot-scope="scope">{{params.pageSize*(params.page - 1) + (scope.$index+1)}}</template>
      </el-table-column>
      <el-table-column prop="gameCode" label="游戏编码" min-width="140px"></el-table-column>
      <el-table-column prop="gameName" label="游戏名称" min-width="160px"></el-table-column>
      <el-table-column prop="gameTypeName" label="游戏类型" min-width="100px"></el-table-column>
      <el-table-column prop="isPlayGame" label="是否试玩" min-width="100px"></el-table-column>
      <el-table-column prop="gameVersion" label="游戏版本" min-width="120px"></el-table-column>
      <el-table-column prop="developerName" label="游戏开发商" min-width="180px"></el-table-column>
      <el-table-column prop="userName" label="创建人" min-width="100px"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="160px"></el-table-column>
      <el-table-column fixed="right" label="操作" min-width="150px">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            v-has="'gameList-detail'"
            @click.native="detail(scope.row)"
            :id="$route.name+'-detail-'+scope.$index"
          >查看</el-button>
          <el-button
            size="mini"
            v-has="'gameList-edit'"
            @click.native="edit(scope.row)"
            :id="$route.name+'-edit-'+scope.$index"
          >编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <table-paging
      position="right"
      :total="total"
      :currentPage="params.page "
      :pageSize="params.pageSize"
      @handleSizeChange="changeSize"
      @handleCurrentChange="changeCurrent"
    ></table-paging>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "gameStoreManage",
  data() {
    return {
      controlOptions: [
        {
          name: "新建游戏",
          type: "primary",
          icon: "plus",
          permission: "gameList-add"
        }, // type为按钮的五种颜色， icon为具体的图标
        {
          name: "导出",
          type: "",
          icon: "s-promotion",
          permission: "gameList-export"
        }
      ],
      tableData: [],
      multipleSelection: [],
      searchOptions: [
        {
          title: "游戏编码",
          type: "input",
          prop: "gameCode",
          value: "",
          maxlength: 50
        },
        {
          title: "游戏名称",
          type: "input",
          prop: "gameName",
          value: "",
          maxlength: 20
        },
        {
          title: "游戏类型",
          type: "select",
          prop: "gameType",
          value: "",
          options: []
        },
        {type: 'datepicker-range', prop: 'date', value: '', title: '创建时间', placeholder: ['开始日期', '结束日期']},
        // {
        //   title: "是否试玩",
        //   type: "select",
        //   prop: "gameStatus",
        //   value: "",
        //   options: [
        //     { label: "是", value: 2 },
        //     { label: "否", value: 2 },
        //   ]
        // },
      ],
      total: 0,
      params: {
        page: 1,
        pageSize: 20,
        param: {}
      },
      typeOptions: {}
    };
  },
  created() {
    // let data = {};
    this.getGameStoreList(this.params);
    this.getAllGameType();
  },
  methods: {
    // 获取游戏类型下拉框
    getAllGameType(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getAllGameType({ data });
        console.log(res);
        if (res && res.code == 0) {
          let array = [];
          res.data.forEach(item => {
            let obj = {};
            obj.label = item.gameTypeName;
            obj.value = item.gameTypeCode;
            array.push(obj);
            self.typeOptions[item.gameTypeCode] = item.gameTypeName;
          });
          self.searchOptions[2].options = array;
        }
      })(data);
    },
    // 导出列表
    async exportExcel() {
      const res = await this.$api.exportGameExcel({
        data: this.params,
        responseType: "blob"
      });
      var blob = new Blob([res.blob], {
        type: "application/vnd.ms-excel;charset=utf-8"
      });
      var url = window.URL.createObjectURL(blob);
      var aLink = document.createElement("a");
      aLink.style.display = "none";
      aLink.href = url;
      aLink.setAttribute("download", "游戏储备列表.xls");
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
      console.log(res);
    },
    // 转换类型
    translateGameType(val) {
      return this.gameTypeOptions[val];
    },
    // 转换类型
    translateJackpotType(val) {
      let options = { 1: "无奖池", 2: "单奖池", 3: "多奖池" };
      return options[val];
    },
    // 转换类型
    translateStatus(val) {
      let options = { 1: "储备", 2: "试玩", 3: "上市", 4: "退市" };
      return options[val];
    },
    // 转换类型
    translateTime(val) {
      if (val != null) {
        return moment(val).format("YYYY-MM-DD HH:mm:ss");
      } else {
        return "";
      }
    },
    // 获取游戏储备列表
    getGameStoreList(data) {
      const self = this;
      (async data => {
        console.log(data);
        let res = await self.$api.getGameStoreList({ data });
        console.log(res);
        if (res && res.code == 0) {
          self.total = res.data.total;
          let options = { 1: "储备", 2: "试玩", 3: "上市", 4: "退市" };
          res.data.records.forEach(item => {
            // item.gameTypeName = this.gameTypeOptions[item.gameType];
            item.isPlayGame = item.gameStatus == 2 ? "是" : "否";
            item.gameStatusName = options[item.gameStatus];
            item.createTime =
              item.createTime &&
              this.$moment(item.createTime).format("YYYY-MM-DD HH:mm:ss");
          });
          self.tableData = res.data.records;
        }
      })(data);
    },
    selectBtn(val) {
      console.log(val);
      if (val.name == "新建游戏") {
        this.$router.push({ name: "gameCreate", query: { type: 0 } });
      } else {
        // 导出列表
        this.exportExcel();
      }
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //查看页面跳转
    detail(val) {
      this.$router.push({
        path: "./gameDetail",
        query: { gameId: val.gameId, type: 1, gameStatus: val.gameStatus }
      });
    },
    edit(val) {
      this.$router.push({
        path: "./gameEdit",
        query: { gameCode: val.gameCode, gameId: val.gameId, type: 0, gameStatus: val.gameStatus }
      });
    },
    search(val) {
      this.params.page = 1;
      this.params.param = val;
      if(val.date&&val.date.length>0) {
        this.params.param.startTime = this.$moment(val.date[0]).format('YYYY-MM-DD')
        this.params.param.endTime = this.$moment(val.date[1]).format('YYYY-MM-DD')
        delete this.params.param.date;
      }
      this.getGameStoreList(this.params);
    },
    changeSize(val) {
      this.params.page = 1;
      this.params.pageSize = val;
      this.getGameStoreList(this.params);
    },
    changeCurrent(val) {
      this.params.page = val;
      this.getGameStoreList(this.params);
    }
  }
};
</script>


<style lang="less" scoped>
.game-icon {
  width: 50px;
  height: 50px;
  display: inline-block;
}
</style>
