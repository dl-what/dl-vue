<template>
  <!-- 维护知识库-->
  <div class="vlt-card">
    <search-bar
      ref="searchForm"
      class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      :total="tableDatas.total"
      labelWidth="6em"
      @change="changeSearch"
      @searchReset="reset"
    ></search-bar>

    <el-row class="card-table">
      <el-table
        :data="tableDatas.records"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
        class="table-box"
      >
      
      <el-table-column label="序号" width="80" fixed>
          <template slot-scope="scope">
          {{tableDatas.size*(tableDatas.current-1)+(scope.$index+1)}}
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item,key) in tableKey"
          :key="key"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :type="item.type"
        ></el-table-column>
        <el-table-column label="故障描述" prop= "faultDesc" min-width= "220" show-overflow-tooltip></el-table-column>
        <el-table-column fixed="right" label="操作" min-width="140">
          <template slot-scope="scope">
            <el-button :id="'knowledgeBase-detail'+scope.$index" type="primary" v-has="'knowledgeBase-detail'" size="mini" @click="handleClick(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <table-paging
      position="right"
      :total="tableDatas.total"
      :currentPage="requestData.page"
      :pageSize="requestData.pageSize"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></table-paging>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "knowledgeBase",
  data() {
    return {
      // 搜索组件配置
      searchOptions: [
        {
          type: "select",
          prop: "goodsType",
          value: "",
          title: "物品类别",
          placeholder: "请选择",
          options: [ { label: "设备", value: 1 }, { label: "配件", value: 2 }, { label: "耗材", value: 3 }, { label: "设施", value: 4 } ]
        },
        { type: "select", prop: "faultType", value: "", title: "故障类型", placeholder: "请选择", options: [], disabled: true }
      ],
      tableDatas: {},
      tableKey: [
        // {label: "序号",prop: "",width: "80",type: 'index'},
        {label: "物品类别",prop: "goodsType",width: ""},
        {label: "物品名称",prop: "goodsName",width: "100"},
        {label: "故障类型",prop: "faultType",width: ""}
      ],
      searchParams: {},
      requestData: {
        page: 1,
        pageSize: 20,
        param: {}
      },
      goodsTypeArr: ['设备', '配件', '耗材', '设施'],
      insId: '',
      selectGoodsType: 0
    };
  },
  components: {},
  created () {
    this.insId = this.$storage.get('userInfo').insId;
    if (this.insId) {
        this.requestData.param.insId = this.insId
        this.getList(this.requestData);
    }
  },
  methods: {
    getList(data) {
      // knowledgeBaseList
      // requestData
      const _this = this;
      (async (data) => {
        let res = await _this.$api.knowledgeBaseList({data});
        // console.log(res);
        if (res&&res.code == 0) {
           if (res.data != null ){
             this.tableDatas = res.data;
             _this.tableDatas.records&&_this.tableDatas.records.forEach( item => {
               if (item.goodsType)  item.goodsType = _this.goodsTypeArr[item.goodsType - 1]
             })
           }
          
        }
      })(data)
    },
    changeSearch (searchOptions) {
      console.log(searchOptions);
      let type = 0;
      if (searchOptions.goodsType != '') {
        if (searchOptions.goodsType == 2) {
          type = 1;
        } else {
          type = searchOptions.goodsType
        }
        if (this.selectGoodsType != searchOptions.goodsType) {
          this.$set(this.$refs.searchForm.form, 'faultType', '');
          console.log(this.$refs.searchForm);
          this.getFaultTypeList(type);
          this.selectGoodsType = searchOptions.goodsType;
        }
      }
    },
    getFaultTypeList (goodsType) {
      const _this = this;
      const data = { goodsType };
      (async (data) => {
        console.log(data);
        let res = await _this.$api.getFaultTypeList({data});
        console.log(res)
        if (res&&res.code == 0) {
          if (res.data != null ) {
            let options = [];
            if (res.data.length) {
              res.data.forEach(item => {
                if (item&&item.faultType) {
                  options.push({
                    label: item.faultType,
                    value: item.faultType
                  })
                }
              })
              _this.$set(_this.searchOptions[1], 'options', options);
              _this.$set(_this.searchOptions[1], 'disabled', false);
            } else {
              _this.$set(_this.searchOptions[1], 'disabled', true);
            }
          }
        }
      })(data)
    }, 
    reset() {
      this.$set(this.searchOptions[1], 'options', []);
      this.$set(this.searchOptions[1], 'disabled', true);
      this.$set(this.$refs.searchForm.form, 'goodsType', '');
      this.$set(this.$refs.searchForm.form, 'faultType', '');
      this.selectGoodsType = null;
    },
    search(form) {
      // console.log("search", form);
      // if (form.goodsType == 2) {
      //   form.goodsType = 1;
      // }
      this.requestData.param = {
        insId: this.insId,
        ...form
      }

      this.requestData.page = 1;
      this.getList(this.requestData);
    },
    handleClick(row) {
      this.$router.push({
        name: "knowledgeBaseInfo",
        query: {
          id: row.id
        }
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(pageSize) {
      // console.log(pageSize);
      this.requestData.pageSize = pageSize;
      this.requestData.page = 1;
      this.getList(this.requestData);
    },
    handleCurrentChange(currentPage) {
      // console.log(currentPage);
      this.requestData.page = currentPage;
      this.getList(this.requestData);
    }
  }
};
</script>

<style lang="less" scoped>
</style>
