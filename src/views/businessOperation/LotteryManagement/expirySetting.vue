<template>
  <!-- 兑奖设置 -->
  <div class="vlt-card">
    <div class="expirySetting">
      <search-bar :options="expirySettingOptions" :total="num" @search="search" labelWidth="6em"></search-bar>
      <el-table ref="multipleTable" :data="TableData" tooltip-effect="dark" border>
        <el-table-column prop="id" label="序号" type="index" width="60">
          <template slot-scope="scope">{{pageSize*(page-1)+(scope.$index+1)}}</template>
        </el-table-column>
        <el-table-column prop="exchangeName" label="兑奖名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="gameName" label="游戏名称"></el-table-column>
        <el-table-column prop="exchangeMoney" label="兑奖金额(元)">
           <template slot-scope="scope">{{scope.row.exchangeCode == 1 ? '≤': scope.row.exchangeCode == 2? '≤':'>' }} {{scope.row.exchangeMoney}}</template>
        </el-table-column>
      </el-table>
      <div class="table_paging">
        <tablePaging
          class="table_paging_right"
          :total="num"
          :currentPage="page"
          :pageSize="pageSize"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
        ></tablePaging>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "",
  data() {
    return {
      //搜索总数
      num: 0,

      //搜索框类型
      expirySettingOptions: [
        {
          type: "input",
          prop: "exchangeName",
          value: "",
          title: "兑奖名称",
          placeholder: "请输入"
        },
        {
          type: "select",
          prop: "gameId",
          value: "",
          title: "游戏名称",
          placeholder: "请输入",
          options: []
        }
      ],
      options: { label: "", gameId: "" },

      //表格数据
      TableData: [],
      //页数
      page: 0,

      // 条数
      pageSize: 20,
      current: 0,
      searchFrom: {}
    };
  },
  created() {
    this.gameList();
    this.init();
  },
  methods: {
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
    async init(val) {
      let data = {
        page: val || 1,
        pageSize: this.pageSize,
        param: {
          ...this.searchFrom
        }
      };
      //初始获取列表数据
      let result = await this.$api.getExpirySetting({ data });

      if (result && result.code === 0) {
        result.data.records.forEach(item => {
          if (item.exchangeMoney) {
            item.exchangeMoney = this.changeNumber(item.exchangeMoney);
          }
        });
        this.num = result.data.total;
        this.page = result.data.current;
        this.TableData = result.data.records;
      }
    },
    // 初始化获取游戏名称数据
    async gameList() {
      let data = {
        gameStatus: "1,3"
      };
      let res = await this.$api.getGameList({ data });
      console.log(res);
      let arr = res.data.map(item => {
        return { label: item.gameName, value: item.id };
      });
      //console.log(arr);
      if (res && res.code === 0) {
        this.expirySettingOptions[1].options = arr;
      }
    },
    //搜索
    search(param) {
      //console.log(param);

      this.searchFrom = {
        ...param
      };
      // console.log(this.searchFrom);
      this.init();
    },
    // 条数change事件
    handleSizeChange(size) {
      this.pageSize = size;
      this.init();
    },
    // 页码change事件
    handleCurrentChange(val) {
      this.current = val;
      // console.log(this.current);
      this.init(val);
    }
  }
};
</script>

<style lang="less" scoped>
</style>
