<template>
  <!-- 明细 -->
  <div class="vlt-card">
    <panel :show="true" title="基本信息">
      <base-info :infoList="infoList"></base-info>
    </panel>


    <panel :show="true"  title="信息列表" style="margin-top:20px">
      <div class="panel-content">
        <control-bar :options="controlOptions" @select="selectBtn" position="right"></control-bar>
        <el-row class="card-table">
          <el-table
            :data="tableData.records"
            border
            style="width: 100%"
            @selection-change="handleSelectionChange"
            class="table-box">
             <el-table-column label="序号" min-width="100px">
              <template slot-scope="scope">
              {{tableData.size*(tableData.current-1)+(scope.$index+1)}}
              </template>
            </el-table-column>
            <el-table-column
              v-for="(item,key) in tableKey"
              :key="key"
              :prop="item.value"
              :label="item.label"
              :width="item.width"
              min-width="200px"
            ></el-table-column>
          </el-table>
        </el-row>

        <table-paging
          :position="'right'"
          :total="tableData.total"
          :currentPage="requestOptions.page"
          :pageSize="requestOptions.pageSize"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
        ></table-paging>
      </div>
    </panel>
    <dialog-form :showForm="showdialog" :formDatas="data2" :rule="rules2" @closeDia="hideDia"></dialog-form>
  </div>
</template>

<script type="text/javascript">
import rules from "@/utils/rules.js";
import dialogForm from "@/views/businessManage/bettingCardManage/components/dialogForm";
export default {
  name: "cardDetail",
  data() {
    return {
      showdialog: false,
      infoList: [
        { title: "批次", value: "", prop: "batch" },
        { title: "投注卡类型", value: "", prop: "bettingCardType" },
        { title: "所属机构", value: "", prop: "insName" },
        { title: "发卡数量", value: "", prop: "cardMakingQuantity" }
      ],
      controlOptions: [
        { name: "导出当前", type: "", icon: "s-promotion", permission:'cardDetail-exportCurrent' },
        { name: "导出全部", type: "primary", icon: "s-promotion", permission:'cardDetai-exportAll' }
      ],
      tableData: [],
      tableKey: [
        // {
        //   label: "序号",
        //   value: "rownum",
        //   width: "80"
        // },
        {
          label: "投注卡编号",
          value: "cardCode",
          width: ""
        }
      ],
      data2: [
        {
          title: "所属机构：",
          type: "address",
          prop: "address",
          value: ["130000", "130200", "130203"],
          address: ""
        },
        {
          type: "select",
          title: "投注卡类型：",
          prop: "status",
          options: [
            { label: "投注卡", value: 0 },
            { label: "会员卡", value: 1 },
            { label: "试玩卡", value: 2 }
          ]
        },
        {
          type: "select",
          title: "发卡数量：",
          prop: "status2",
          options: [{ label: "1", value: "0" }, { label: "2", value: "1" }]
        },
        {
          type: "datepicker-range",
          prop: "date2",
          value: "",
          title: "有效日期：",
          options: ["start", "end"]
        },
        { type: "textarea", title: "备注", prop: "all" }
      ],
      rules2: {
        address: [{ required: true, trigger: ['change','blur'] }],
        status: [
          { required: true, validator: rules.checkEmpty, trigger: ['change','blur'] }
        ]
      },
      id: "",
      dataList: {},
      requestOptions: {
        page: 1,
        pageSize: 20,
        param: {
          all: false,
          batch: "",
          bettingCardId: 0
        }
      },
      outData: {}
    };
  },
  components: {
    "dialog-form": dialogForm
  },
  created() {
    let id = this.$route.query.id;
    if (id) {
      this.id = id;
      this.getInfo(this.id);
      this.requestOptions.param.bettingCardId = this.id;
      this.getBettingCardList(this.requestOptions);
    }
  },
  methods: {
    async getInfo(id) {
      const _this = this;
      let result = await _this.$api.cardGenerationDetail({ data: id });
      if (result.code === 0) {
        _this.infoList.forEach(item => {
          item.value = result.data[item.prop];
          if (item.prop == "bettingCardType") {
            item.value = _this.forMatType(result.data[item.prop]);
          }
        });
      }
    },
    getBettingCardList(data) {
      const self = this;
      (async data => {
        let res = await self.$api.bettingCardList({ data });
        if (res && res.code == 0) {
          this.tableData = res.data;
        } else {
          self.$message.warning(res.msg);
        }
      })(data);
    },
    selectBtn(val) {
      if (val.name == "导出当前") {
        this.exportExcel("now");
      } else if (val.name == "导出全部") {
        this.exportExcel("all");
      }
    },
    async exportExcel(val) {
      if (val == "now") {
        this.outData = {
          page: this.requestOptions.page,
          pageSize: this.requestOptions.pageSize,
          param: {
            all: false,
            batch: "",
            bettingCardId: this.id
          }
        };
      } else if (val == "all") {
        this.outData = {
          page: 0,
          pageSize: 0,
          param: {
            all: true,
            batch: "",
            bettingCardId: this.id
          }
        };
      }

      const data = JSON.parse(JSON.stringify(this.outData));
      let result = await this.$api.bettingCardExportExcel({
        data,
        responseType: "blob"
      });
      var blob = new Blob([result.blob], {
        type: "application/vnd.ms-excel;charset=utf-8"
      });
      var url = window.URL.createObjectURL(blob);
      var aLink = document.createElement("a");
      aLink.style.display = "none";
      aLink.href = url;
      aLink.setAttribute("download", "投注卡生成信息.xls");
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
      //console.log("res", result);
    },
    hideDia() {
      this.showdialog = false;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(pageSize) {
      console.log(pageSize);
      this.requestOptions.pageSize = pageSize;
      this.getBettingCardList(this.requestOptions);
    },
    handleCurrentChange(currentPage) {
      this.requestOptions.page = currentPage;
      this.getBettingCardList(this.requestOptions);
      console.log(currentPage);
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
.panel-content {
  padding: 10px;
}
.card-table {
  padding: 10px 0;
}
</style>
