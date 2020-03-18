
<template>
  <!-- 投注卡信息 -->
  <div class="vlt-card" ref="vlt-card">
    <search-bar
      class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      :total="total"
      labelWidth="7em"
    ></search-bar>
    <el-row class="card-table">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
        class="table-box"
      >
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->

        <el-table-column label="序号" width="80"  fixed="left">
          <template slot-scope="scope">
          {{options.pageSize*(options.page-1)+(scope.$index+1)}}
          </template>
        </el-table-column>
        <!-- <el-table-column
          v-for="(item,key) in tableKey"
          :key="key"
          :prop="item.value"
          :label="item.label"
          :width="item.width"
          :type="item.type"
          :show-overflow-tooltip="item.showOverflowTooltip"
        ></el-table-column> -->
        <el-table-column prop="cardCode" label="编号" min-width="140px"></el-table-column>
        <el-table-column prop="insName" label="所属机构" min-width="120px"></el-table-column>
        <el-table-column prop="bettingCardTypeDesc" label="投注卡类型" min-width="140px"></el-table-column>
        <el-table-column prop="cardStatus" label="状态" min-width="120px">
          <template slot-scope="scope">
            <span
              class="icon-circle"
              :class="{
              blue:scope.row.cardStatus!='1'&&scope.row.cardStatus!='2',
              green:scope.row.cardStatus=='2',
              red:scope.row.cardStatus=='1',
              }"
            >{{scope.row.strCardStatus}}</span>
          </template>
        </el-table-column>
        
        <el-table-column fixed="right" label="操作" min-width="140">
          <template slot-scope="scope">
            <el-button :id="'cardInformation-detail'+ scope.$index" type="primary" v-has="'cardInformation-detail'" size="mini" @click="handleClick(scope.row)">查看</el-button>
            <!-- <el-button v-if="scope.row.status === '待激活'" type="primary" size="mini" @click="activation(scope.row)">激活</el-button> -->
            <el-button :id="'cardInformation-delete'+ scope.$index" type="danger" v-has="'cardInformation-delete'" :disabled="scope.row.cardStatus == 2" size="mini" @click="logout(scope.row)">注销</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <table-paging
      position="right"
      :total="total"
      :currentPage="options.page"
      :pageSize="options.pageSize"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></table-paging>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "cardInformation",
  data() {
    return {
      // 搜索组件配置
      searchOptions: [
        { title: "投注卡编号", type: "input", prop: "cardCode", value: "" },
        {
          title: "所属机构",
          type: "cascader",
          prop: "insId",
          value: "",
          setProps: {
            label: "text",
            value: "id",
            children: "children",
            // multiple: true, // 多选
            checkStrictly: true //设置父子节点取消选中关联，从而达到选择任意一级选项的目的
          },
          options: []
        },
        {
          title: "投注卡类型",
          type: "select",
          prop: "cardType",
          value: "",
          options: [
            { label: "投注卡", value: 0 },
            { label: "会员卡", value: 1 },
            { label: "试玩卡", value: 2 }
          ]
        },
        {
          title: "投注卡状态",
          type: "select",
          prop: "cardStatus",
          value: "",
          options: [
            { label: "待激活", value: 1 },
            { label: "已激活", value: 2 }
          ]
        }
      ],
      tableKey: [
        // { label: "序号", value: "id", type:'index', width: "80" },
        { label: "编号", value: "cardCode", width: "300" },
        { label: "投注卡类型", value: "bettingCardTypeDesc", width: "" },
        { label: "所属机构", value: "insName", width: "" },
        { label: "状态", value: "cardStatus", width: "" },
        // { label: "备注", value: "remark", width: "", showOverflowTooltip:'show-overflow-tooltip' }
      ],
      tableData: [],
      total: 0,
      options: {
        page: 1,
        pageSize: 20,
        param: {}
      },
      cardStatusArr: ['待激活','已激活','退卡','挂失','补卡','换卡','报废','逾期','注销','禁用']
    };
  },
  components: {},
  created() {
    this.getInsData();
  },
  methods: {
    async initList(options) {
      let data = JSON.parse(JSON.stringify(options));
      let res = await this.$api.bettingCardInfoList({ data });
      if (res.code == 0) {
        res.data.records = res.data.records.map(item => {
          item.bettingCardType = this.forMatType(item.bettingCardType);
          item.strCardStatus = this.cardStatusArr[Number(item.cardStatus) - 1];
          return item;
        });
        this.tableData = res.data.records;
        this.total = res.data.total;
        this.$parent.$refs.main.scrollTo(0, 0);
      }
    },
    getInsData() {
      const self = this;
      const data = {};
      (async data => {
        let res = await self.$api.QueryUserAndInsTree({ data });
        if (res && res.code == 0) {
          // console.log("res", res.data);
          let insList = res.data;
          insList&&insList.forEach(element => {
            element.children&&element.children.forEach(item => {
              item.children && item.children.forEach(i => {
                delete i.children
              }) 
            })
          });
          self.$set(self.searchOptions[1], "options", insList);
          this.insDatas = res.data
          console.log('insDatas', this.insDatas);

          self.initList(this.options);
        } else {
          // self.$message.warning(res.msg)
        }
      })(data);
    },
    search(form) {
      console.log(form);
      this.options.param = {
        bettingCardType: form.cardType,
        cardNumber: form.cardCode,
        insId: (form.insId && Array.isArray(form.insId) ?  Number(form.insId[form.insId.length - 1]) : ''),
        cardStatus: form.cardStatus
      };
      this.options.page = 1;
      this.initList(this.options);
    },
    handleClick(row) {
      this.$router.push({
        name: "infoDetail",
        query: {
          cardId: row.cardId
        }
      });
    },
    activation(row) {
      console.log(row);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(pageSize) {
      this.tableData.size = pageSize;
      this.options.pageSize = pageSize;
      this.options.page = 1;
      console.log(this.options);
      this.initList(this.options);
    },
    handleCurrentChange(currentPage) {
      this.options.page = currentPage;
      this.initList(this.options);
    },
    logout(row) {
      console.log("注销", row);
      this.$confirm("将注销此数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let cardId = row.cardId ==  0 ? '0' : row.cardId;
          let result = this.deleteBetting({data: cardId});
          result.then(resp => {
            console.log(resp);
            if (resp.code == 0) {
              this.$message({
                type: "success",
                message: "注销成功!"
              });
            }
            // 删除之后再次刷新一下数据
            this.initList(this.options);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消注销"
          });
        });
    },
    async deleteBetting(id) {
      const _this = this;
      let result = await _this.$api.deleteBettingCardInfo(id);
      return result;
    },
    forMatType(type) {
      switch (type) {
        case 0:
          return (type = "投注卡");
        case 1:
          return (type = "会员卡");
        case 2:
          return (type = "试玩卡");
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>
