<template>
  <!-- 知识库审核 -->
  <div class="vlt-card">
    <search-bar
        ref="searchForm"
      class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      :total="total"
      labelWidth="6em"
      @change="changeSearch"
      @searchReset="reset"
    ></search-bar>

    <el-row class="card-table">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
        class="table-box"
      >
      <el-table-column label="序号" width="80" fixed>
          <template slot-scope="scope">
          {{requestData.pageSize*(requestData.page-1)+(scope.$index+1)}}
          </template>
        </el-table-column>
        <!-- <el-table-column
          v-for="(item,key) in tableKey"
          :key="key"
          :prop="item.value"
          :label="item.label"
          :width="item.width"
          :type="item.type"
        ></el-table-column> -->
        <el-table-column prop="goodsType" label="物品类别" min-width="140px"></el-table-column>
        <el-table-column prop="goodsName" label="物品名称" min-width="140px"></el-table-column>
        <el-table-column prop="approvalStatus" label="审核状态" min-width="120px">
          <template slot-scope="scope">
            <span
              class="icon-circle"
              :class="{
              blue:scope.row.approvalStatus=='0',
              green:scope.row.approvalStatus=='1',
              grey:scope.row.approvalStatus=='3',
              yellow:scope.row.approvalStatus=='4',
              red:scope.row.approvalStatus=='2',
              }"
            >{{scope.row.strApprovalStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="faultType" label="故障类型" min-width="120px"></el-table-column>
        <el-table-column prop="approvalResult" label="审核结果" min-width="120px">
          <template slot-scope="scope">
            <p v-if="scope.row.strApprovalResult">
              <span
              class="icon-tag"
              :class="{
              blue:scope.row.approvalResult=='4',
              green:scope.row.approvalResult=='0',
              grey:scope.row.approvalResult=='2',
              yellow:scope.row.approvalResult=='3',
              red:scope.row.approvalResult=='1',
              }"
            >{{scope.row.strApprovalResult}}</span>
            </p>
            
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="200">
          <template slot-scope="scope">
            <el-button :id="'baseReview-detail'+scope.$index" type="primary" v-has="'baseReview-detail'"  size="mini" @click="handleClick(scope.row)">查看</el-button>
            <el-button :id="'baseReview-audit'+scope.$index" type="" v-has="'baseReview-audit'"  size="mini" @click="toAudit(scope.row)" :disabled="scope.row.approvalStatus=='1' && scope.row.approvalResult !='1'? true:false" v-text="scope.row.approvalResult=='1'? '重新审核':'审核'"></el-button>
            <el-button :id="'baseReview-delete'+scope.$index" type="danger"  v-has="'baseReview-delete'" size="mini" @click="toDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <table-paging
      position="right"
      :total="total"
      :currentPage="requestData.page"
      :pageSize="requestData.pageSize"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></table-paging>
    <kenwLedge-base-review
    :dataInfo="reviewInfo"
    :showForm="showdialog"
    :diaTitle="diaTitle"
     @closeDia="hideDia"></kenwLedge-base-review>
  </div>
</template>

<script type="text/javascript">
import rules from "@/utils/rules.js";
import kenwLedgeBaseReview from '@/views/businessManage/channelTerminalManagement/knowledgeBase/kenwLedgeBaseReview'
export default {
  name: "accessoriesList",
  data() {
    return {
      showdialog: false,
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
      diaTitle: '审核知识库',
      tableData: [],
      total: 0,
      tableKey: [
        // { label: "序号", value: "", width: "80", type: 'index' },
        { label: "物品类别", value: "goodsType", width: "200" },
        { label: "物品名称", value: "goodsName", width: "" },
        { label: "审核状态", value: "approvalStatus", width: "200" },
        { label: "故障类型", value: "faultType", width: "" },
        { label: "审核结果", value: "approvalResult", width: "120" }
      ],
      searchParams: {},
      requestData: {
        page: 1,
        pageSize: 20,
        param: {}
      },
      reviewInfo: {},
      goodsTypeArr: ['设备', '配件', '耗材', '设施'],
      approvalResultArr: ['通过', '未通过'],
      approvalStatusArr: ['待审核', '已审核'],
      insId: '',
      selectGoodsType: 0
    };
  },
  components: {
    'kenwLedge-base-review': kenwLedgeBaseReview
  },
  created() {
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
        let res = await _this.$api.baseApprovalList({data});
        // console.log(res);
        if (res&&res.code == 0) {
           if (res.data != null ){
             console.log(res);
             
             res.data.records&&res.data.records.forEach( item => {
               item.goodsType = _this.goodsTypeArr[item.goodsType - 1];
               item.strApprovalResult = _this.approvalResultArr[item.approvalResult];
               item.strApprovalStatus = _this.approvalStatusArr[item.approvalStatus];
             })
             this.tableData = res.data.records;
             this.total = res.data.total;
           }
          //  const params = Object.keys(_this.requestData.param);
          //  if (params.length != 0) {
          //    _this.requestData.param = {}
          //  }
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
          // this.$set(this.$refs.searchForm.options[1], 'options', []);
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
              res.data&res.data.forEach(item => {
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
              this.$set(this.searchOptions[1], 'disabled', true);
            }
          } 
        }
      })(data)
    }, 
    reset () {
      this.$set(this.searchOptions[1], 'options', []);
      this.$set(this.searchOptions[1], 'disabled', true);
      this.$set(this.$refs.searchForm.form, 'goodsType', '');
      this.$set(this.$refs.searchForm.form, 'faultType', '');
      this.selectGoodsType = null;
    },
    search(form) {
      console.log("search", form);
      this.requestData.param = {
        insId: this.insId,
        ...form
      }

      this.requestData.page = 1;
      this.getList(this.requestData)
    },
    handleClick(row) {
      this.$router.push({
        name: "baseAuditDetails",
        query: {
          id: row.id
        }
      });
    },
    toAudit(row) {
      this.showdialog = true;
      console.log(row);
      this.reviewInfo = row
    },
    hideDia (val) {
      if (val == 'true') {
        this.getList(this.requestData);
      }
      this.showdialog = false;
    },
    toDelete(row) {
      console.log(row);
      const _this = this;

      _this.$confirm("将删除此数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          (async id => {
            const data = {
              id
            }
            let res = await _this.$api.deleteBaseApproval({message: '删除成功', data});
            if (res &&res.code == 0) {
              _this.getList(this.requestData)
            }
          })(row.id)
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消删除"
          });
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
