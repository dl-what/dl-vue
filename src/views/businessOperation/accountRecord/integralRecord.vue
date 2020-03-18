<template>
  <div class="vlt-card">
    <search-bar
      class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      :total="total"
      labelWidth="6em"
    ></search-bar>

    <el-table :data="tableData" border style="width: 100%; margin-top: 10px;">
      <el-table-column type="index" fixed label="序号" width="55">
        <template slot-scope="scope">{{pageSize*(current-1)+(scope.$index+1)}}</template>
      </el-table-column>
      <el-table-column prop="recordId" label="积分编号" min-width="120px"></el-table-column>
      <el-table-column prop="memberName" label="账户名称" min-width="120px"></el-table-column>
      <el-table-column prop="mobile" label="手机号码" min-width="120px"></el-table-column>
      <el-table-column prop="integralTypeName" label="积分类型" min-width="130px"></el-table-column>
      <el-table-column prop="insName" label="所属机构" min-width="120px">
        <!-- <template slot-scope="scope">{{ getArea(scope.row.insId)}}</template> -->
      </el-table-column>
      <el-table-column prop="money" label="原积分"></el-table-column>
      <el-table-column label="现积分" prop="integralBalance" min-width="120px"></el-table-column>
      <el-table-column prop="exchangeIntegral" label="变动积分" min-width="120px">
        <!-- <template slot-scope="scope">{{'+'+scope.row.exchangeIntegral}}</template> -->
      </el-table-column>
      <el-table-column prop="createdTime" label="变更时间" min-width="160px"></el-table-column>
      <el-table-column label="操作" fixed="right" align="center" min-width="90px">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            :id="$route.name+'-details-'+scope.$index"
            @click="integralDetail(scope.row)"
            v-has="'integralRecord-details'"
          >查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <table-paging
      :current-page="current"
      :page-size="pageSize"
      :total="total"
      @handleSizeChange="pageSizeChange"
      @handleCurrentChange="pageCurrentChange"
    ></table-paging>
  </div>
</template>

<script type="text/javascript">
import { mapGetters } from "vuex";
export default {
  name: "integralRecord",
  data() {
    return {
      searchOptions: [
        { title: "手机号码", type: "input", prop: "mobile", value: "" },
        {
          title: "变更时间",
          type: "datepicker-range",
          prop: "orderTime",
          value: ''
        },
        {
          title: "所属机构",
          type: "cascader",
          prop: "insId",
          value: "",
          setProps: {
            value: "id",
            label: "text",
            checkStrictly: true,
            children: "children"
          },
          options: []
        }
      ],
      tableData: [],
      pageSize: 20,
      total: 0,
      current: 1,
      searchForm: {}
    };
  },
  computed: {
    ...mapGetters(["insData"])
  },
  created() {
    this.init();
  },
  methods: {
    init(val) {
      const self = this;
      (async val => {
        let data = {
          page: val || 1,
          pageSize: self.pageSize,
          param: {
            ...self.searchForm
          }
        };
        let reslt = await self.$api.queryIntegralRecordPage({ data });
        console.log(reslt, "积分记录");
        if (reslt && reslt.code === 0) {
          self.total = reslt.data.total;
          self.current = data.page;
           let option = {
              1: "充值",
              2: "消费",
              3: "注册",
              4: "登录",
              5: "在线时长",
              6: "建议反馈",
              7: "权益兑换",
              8: "试玩游戏点数兑换"
            };
          reslt.data.records.forEach(item => {
            item.createdTime = item.createdTime?this.$moment(item.createdTime).format("YYYY-MM-DD HH:mm:ss"):'';
            item.integralTypeName = option[item.integralType]
            if (item.integralType == 7 || item.integralType == 8) {
              item.money =
                Number(item.integralBalance) + Number(item.exchangeIntegral);
              if (item.exchangeIntegral) {
                item.exchangeIntegral = "-" + item.exchangeIntegral;
              } else {
                item.exchangeIntegral = 0;
              }
            } else {
              item.money =
                Number(item.integralBalance) - Number(item.exchangeIntegral);
              if (item.exchangeIntegral) {
                item.exchangeIntegral = "+" + item.exchangeIntegral;
              } else {
                item.exchangeIntegral = 0;
              }
            }
          });
          self.tableData = reslt.data.records;
        }
      })(val);
    },
    integraType(key) {
      let option = {
        1: "充值",
        2: "消费",
        3: "注册",
        4: "登录",
        5: "在线时长",
        6: "建议反馈",
        7: "权益兑换",
        8: "试玩游戏点数兑换"
      };
      return option[key];
    },
    integralDetail(account) {
      this.$router.push({
        path: "integralDetail",
        query: { id: account.recordId,integralType: account.integralType }
      });
    },
    // getArea(val) {
    //   let data = null;
    //   (async () => {
    //     let res = await this.$api.queryChannelById({ data: val });
    //     console.log(res, "区域信息");
    //     let name;
    //     if (res && res.code === 0) {
    //       if (res.data) {
    //         name = res.data.insName;
    //         data = name;
    //       }
    //     }
    //   })();
    //   return data;
    // },
    search(params) {
      if (params.orderTime&&params.orderTime.length>0) {
        console.log(params.orderTime);
        let beginTime = this.$moment(params.orderTime[0]).format("YYYY-MM-DD");
        let endTime = this.$moment(params.orderTime[1]).format("YYYY-MM-DD");
        params.startTime = beginTime;
        params.endTime = endTime;
        delete params.orderTime;
      }
      if (params.insId) {
        let id = params.insId[params.insId.length - 1];
        params.insId = id;
      }
      console.log(params);
      this.searchForm = { ...params };
      this.init();
    },
    pageSizeChange(size) {
      this.pageSize = size;
      this.init();
    },
    pageCurrentChange(page) {
      this.current = page;
      this.init(page);
    }
  },
  watch: {
    insData: {
      handler(n, o) {
        this.searchOptions[2].options = this.insData;
      },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style lang="less" scoped>
</style>
