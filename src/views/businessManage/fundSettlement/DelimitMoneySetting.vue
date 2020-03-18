<template>
  <div class="vlt-card">
    <section class="comp-item">
      <search-bar
        class="search-bar-demo"
        @search="search"
        :options="searchOptions"
        :total="total"
        labelWidth="6em"
      >
        <control-bar
          slot="extend-bar"
          @select="selectBtn"
          :options="controlOptions"
          position="left"
        ></control-bar>
      </search-bar>
    </section>
    <section>
      <el-table :data="tableData" border style="width:100%;">
        <el-table-column fixed label="序号" min-width="60px">
          <template slot-scope="scope">{{params.pageSize*(params.page-1)+(scope.$index+1)}}</template>
        </el-table-column>
        <el-table-column prop="gameName" label="游戏名称" min-width="120px"></el-table-column>
        <el-table-column prop="fundTypeName" label="基金类型" min-width="120px"></el-table-column>
        <el-table-column prop="type" label="划拨方式" min-width="120px">
          <template slot-scope="scope">
            <span
              class="icon-tag"
              :class="{
              blue:scope.row.type=='4',
              green:scope.row.type=='0',
              grey:scope.row.type=='3',
              yellow:scope.row.type=='5',
              red:scope.row.type=='1',
              }"
            >{{scope.row.typeName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="transferAmount" label="金额（元）" min-width="120px"></el-table-column>
        <el-table-column prop="transferReason" label="备注" min-width="140px" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createName" label="创建人" min-width="100px"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="160px"></el-table-column>
        <!-- <el-table-column label="操作" fixed="right" align="center" min-width="90px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="lookDetails(scope.row.id)"
              v-has="'DelimitMoneySetting-details'"
              :id="$route.name+'-details-'+scope.$index"
            >查看</el-button>
            <el-button type="text" @click="editorialChange(scope.row.id)">编缉</el-button>
            <el-button type="text">删除</el-button>
          </template>
        </el-table-column> -->
      </el-table>
    </section>
    <table-paging
      position="right"
      :total="total"
      :currentPage="params.page"
      :pageSize="params.pageSize"
      @handleSizeChange="handleSizeChangeDetails"
      @handleCurrentChange="handleCurrentChangeDetails"
    ></table-paging>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "",
  data() {
    return {
      searchOptions: [
        {
          title: "游戏名称",
          type: "input",
          prop: "gameName",
          value: ""
        },
        {
          title: "创建时间",
          type: "datepicker-range",
          prop: "date",
          value: []
        }
      ],
      controlOptions: [
        {
          name: "新增基金划拔",
          type: "primary",
          icon: "plus",
          permission: "DelimitMoneySetting-create"
        }
      ],
      tableData: [],
      total: 0,
      params: {
        page: 1,
        pageSize: 20,
        param: {}
      }
    };
  },
  created() {
    this.init(this.params);
  },
  methods: {
    init(data) {
      const self = this;
      (async data => {
        let res = await this.$api.fundTransferList({ data });
        if (res && res.code === 0) {
          self.total = res.data.total;
          res.data.records.forEach((item)=>{
            item.typeName = item.type==0?'转入':'划出';
            item.transferAmount = self.$common.thousandMark(item.transferAmount)
          })
          self.tableData = res.data.records;
        }
      })(data);
    },
    search(val) {
      this.params.page = 1;
      this.params.param = val;
      if (val.date&&val.date.length>0) {
        this.params.param.startTime = this.$moment(val.date[0]).format("YYYY-MM-DD");
        this.params.param.endTime = this.$moment(val.date[1]).format("YYYY-MM-DD");
        delete val.date;
      }
      this.init(this.params);
    },
    selectBtn(vlt) {
      if (vlt.name === "新增基金划拔") {
        this.$router.push({ name: "delimitMoneySettingAdd" });
      }
    },
    transferMode(key) {
      let option = {
        1: "调节基金",
        2: "奖池基金",
        3: "累计奖奖池",
        4: "发行费",
        5: "公益金"
      };
      return option[key];
    },
    handleSizeChangeDetails(size) {
      this.params.pageSize = size;
      this.init(this.params);
    },
    handleCurrentChangeDetails(page) {
      this.params.page = page
      this.init(this.params);
    },
    lookDetails(val) {
      this.$router.push({
        name: "delimitMoneyDetail",
        query: { id: val, status: 0 }
      });
      console.log(val);
    },
    editorialChange(val) {
      this.$router.push({
        name: "delimitMoneySettingAdd",
        query: { id: val, status: 1 }
      });
    }
  }
};
</script>

<style lang="less" scoped>
</style>
