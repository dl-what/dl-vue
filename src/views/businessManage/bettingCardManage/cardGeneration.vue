<template>
  <!-- 投注卡生成 -->
  <div class="vlt-card">
    <search-bar
      @search="search"
      :options="searchOptions"
      :total="tableData.total"
      labelWidth="6em"
    >
      <control-bar slot="extend-bar" position="left" @select="selectBtn" :options="controlOptions"></control-bar>
    </search-bar>
    <el-row class="card-table">
      <el-table
        :data="tableData.records"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
        class="table-box"
      >
          <el-table-column label="序号" width="55" fixed="left">
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
          :show-overflow-tooltip="item.showOverflowTooltip"
        ></el-table-column>
        <el-table-column fixed="right" label="操作" min-width="200">
          <template slot-scope="scope">
            <!-- <el-button type="primary" size="mini" @click="edit(scope.row)">编辑</el-button> -->
            <el-button :id="'cardGeneration-detail'+ scope.$index" type="primary" v-has="'cardGeneration-detail'" size="mini" @click="handleClick(scope.row)">查看</el-button>
            <el-button :id="'cardGeneration-export'+ scope.$index" type="" v-has="'cardGeneration-export'" size="mini" @click="exportExcel(scope.row)">导出</el-button>
            <el-button :id="'cardGeneration-delete'+ scope.$index" type="danger" v-has="'cardGeneration-delete'" size="mini" @click="logoutData (scope.row) ">注销</el-button>
          </template>
        </el-table-column>
      </el-table>
      <table-paging
        position="right"
        :total="tableData.total"
        :currentPage="options.page"
        :pageSize="options.pageSize"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      ></table-paging>
    </el-row>
  </div>
</template>

<script type="text/javascript">
import dialogForm from "@/views/businessManage/bettingCardManage/components/dialogForm";
import { isArray } from "util";
export default {
  name: "cardGeneration",
  data() {
    return {
      // 搜索组件配置
      searchOptions: [
        {
          title: "所属机构",
          type: "cascader",
          prop: "insId",
          value: "",
          options: [],
          setProps: {
            label: 'text',
            value: 'id',
            children: 'children',
            checkStrictly: true //设置父子节点取消选中关联，从而达到选择任意一级选项的目的
          }
        },
        {
          title: "投注卡类型",
          type: "select",
          prop: "bettingCardType",
          value: "",
          options: [
            { label: "投注卡", value: 0 },
            { label: "会员卡", value: 1 },
            { label: "试玩卡", value: 2 }
          ]
        },
        { title: "批次", type: "input", prop: "batch", value: "" },
      ],
      controlOptions: [{ name: "新建卡片", type: "primary", icon: "plus", permission:'cardGeneration-add'}],
      tableKey: [
        // {{pageSize*(current-1)+(scope.$index+1)}}
        // { label: "序号", value: "bettingCardId", type: "index", width: "80" },
        { label: "批次", value: "batch", width: "300" },
        { label: "投注卡类型", value: "bettingCardType", width: "130" },
        { label: "所属机构", value: "insName", minWidth: "120" },
        { label: "发卡数量", value: "cardMakingQuantity", width: "150" },
        { label: "备注", value: "remark", width: "" , showOverflowTooltip:'show-overflow-tooltip'}
      ],
      tableData: {
        records: [],
        total: 0,
        size: 20,
        current: 1,
        orders: [],
        searchCount: true,
        pages: 1
      },
      options: {
        page: 1,
        pageSize: 20,
        param: {
          insId: 0
        }
      },
      outData: {}
    };
  },
  created() {
    this.initList(this.options);
    this.getInsData();
  },
  methods: {
    async initList(options) {
      const _this = this;
      let data = JSON.parse(JSON.stringify(options));
      console.log(data);
      let result = await this.$api.cardGenerationList({ data });
      console.log(result);
      if (result.code == 0) {
        _this.tableData = result.data;
        _this.tableData.records = result.data.records.map(item => {
          item.bettingCardType = _this.forMatType(item.bettingCardType);
          // item.cardStatus = _this.forMatStatus(item.cardStatus);
          return item;
        });
        _this.$parent.$refs.main.scrollTo(0, 0);
      } else {
        _this.$message({
          type: "error",
          message: result.msg
        });
      }
    },
    changeSelect(val) {
      console.log(this.form, val);
    },
    selectBtn(val) {
      this.$router.push({
        name: "newCard"
      });
    },
    // 获取机构数据
    getInsData() {
      const self = this;
      const data = {};
      (async data => {
        let res = await self.$api.QueryUserAndInsTree({ data });
        console.log(res);
        if (res && res.code == 0) {
          let newData = res.data;
          newData&&newData.forEach(element => {
            element.children&&element.children.forEach(item => {
              item.children && item.children.forEach(i => {
                delete i.children
              }) 
            })
          });
          
          self.$set(self.searchOptions[0], "options", newData);
        } else {
          // self.$message.warning(res.msg)
        }
      })(data);
    },
    search(form) {
      if (isArray(form.insId)) {
        form.insId = form.insId[form.insId.length - 1];
      }
      // console.log(form);
      this.options.param = {
        ...form
      };
      this.options.page = 1;
      this.initList(this.options);
      // console.log("search", form);
    },
    handleClick(row) {
      this.$router.push({
        name: "cardDetail",
        query: {
          id: row.bettingCardId
        }
      });
    },
    edit(val) {
      this.$router.push({
        name: "exportCard",
        query: {
          id: val.id
        }
      });
    },
    // toExport(val) {
    //   this.$router.push({
    //     name: "exportCard",
    //     query: {
    //       id: val.id
    //     }
    //   });
    // },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(pageSize) {
      this.tableData.size = pageSize;
      this.options.pageSize = pageSize;
      this.options.page = 1;
      this.initList(this.options);
    },
    handleCurrentChange(currentPage) {
      console.log(currentPage);
      this.options.page = currentPage;
      this.initList(this.options);
    },
    changeForm(val) {
      Object.assign(this.params, val);
      // console.log("派发出来的参数", this.params);
    },
    async deleteBetting(id) {
      const _this = this;
      let result = await _this.$api.deleteCardGeneration(id);
      return result;
    },

    async exportExcel(row) {
      this.outData = {
        page: 0,
        pageSize: 0,
        param: {
          all: true,
          batch: "",
          bettingCardId: row.bettingCardId
        }
      };
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
    logoutData(row) {
      const _this = this;
      _this
        .$confirm("将注销此数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          let id  = row.bettingCardId ==  0 ? '0' : row.bettingCardId;
          let result = _this.deleteBetting({ data: id});
          result.then(resp => {
            console.log(resp);
            if (resp.code == 0) {
              _this.$message({
                type: "success",
                message: "注销成功！"
              });
              // 删除之后再次刷新一下数据
              _this.initList(_this.options);
            }
          });
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消注销！"
          });
        });
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
  },
  components: {
    "dialog-form": dialogForm
  }
};
</script>

<style lang="less" scoped>
</style>
