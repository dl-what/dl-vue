<template>
  <div class="vlt-card">
    <div class="search">
      <searchBar :options="searchOptions" @search="search" :total="total" labelWidth="6em">
        <controlBar slot="extend-bar" @select="Addclick" :options="Addbtn" position="left"></controlBar>
      </searchBar>
    </div>
    <div class="el_table">
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column  label="序号" type="index" fixed width="55">
          <template slot-scope="scope">{{params.pageSize*(params.page-1)+(scope.$index+1)}}</template>
        </el-table-column>
        <el-table-column prop="holidayName" label="假日名称" min-width="160"></el-table-column>
        <el-table-column prop="beginTime" label="开始日期" min-width="160"></el-table-column>
        <el-table-column prop="endTime" label="结束日期" min-width="160"></el-table-column>
        <el-table-column label="销售状态" prop="marketStatus" min-width="160px">
          <template slot-scope="scope">
            <el-switch
            v-has="'holidayParameters-switch'"
              class="switchStyle"
              v-model="scope.row.marketStatus"
              :active-text="scope.row.marketStatus?'销售':'停销'"
              :active-value="1"
              :inactive-value="0"
              @change="switchChange(scope.row, '销售')"
               :id="$route.name+'-'+'switch'+scope.$index"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="启用状态" prop="holidayStatus" min-width="160px">
          <template slot-scope="scope">
            <el-switch
             v-has="'holidayParameters-switch'"
              v-model="scope.row.holidayStatus"
              :active-text="scope.row.holidayStatus?'启用':'停用'"
              :active-value="1"
              :inactive-value="0"
              @change="switchChange(scope.row, '启用')"
              :id="$route.name+'-'+'switch'+scope.$index"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="150" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="edit(scope.$index,scope.row)" v-has="'holidayParameters-edit'" :id="$route.name+'-'+'edit'+scope.$index">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <tablePaging
        :total="total"
        :currentPage="params.page"
        :pageSize="params.pageSize"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      ></tablePaging>
    </div>
  </div>
</template>

<script type="text/javascript">

export default {
  data() {
    return {
      total: 0,
      form: {
        name: ""
      },
      Addbtn: [{ name: "新增", type: "primary", icon: "plus",permission:"holidayParameters-add" }],
      searchOptions: [
        {
          type: "input",
          prop: "holidayName",
          value: "",
          title: "假日名称",
        }
      ],
      params: {
        page: 1,
        pageSize: 20,
        param: {}
      },
      controlOptions: [
        { name: "新增", type: "primary", icon: "plus" },
        { name: "保存", type: "success" }
      ],
      tableData: [],
      row: "",
     
    };
  },
  created() {
    this.getHolidayList(this.params);
  },
  methods: {
    async getHolidayList(data) {
      let res = await this.$api.queryHolInfoPage({ data });
      if (res.code === 0) {
        res.data.records.forEach(item => {
          item.beginTime = this.$moment(item.beginTime).format('YYYY-MM-DD')
          item.endTime = this.$moment(item.endTime).format('YYYY-MM-DD')
        });;
        this.total = res.data.total;
        this.tableData = res.data.records;
      }
    },

    search(val){   //搜索
      this.params.page = 1;
      this.params.param = val;
      this.getHolidayList(this.params)
    },
    
    //新增按钮
    Addclick() {
      this.$router.push({
        path: "holidayParameters/holidayParametersAdd",query: { type: 0 }
      });
    },
    edit(val, obj) {  
        console.log(111,obj)
      this.$router.push({ name: "holidayParametersEdit", query: { type: 1, ifo:obj}});
    },
    // switchMarketChange(val) {
    //   //this.MarketChange = !val.marketStatus;
    //   console.log(val.marketStatus);
    //   if (this.data) {
    //     this.data.marketStatus = val.marketStatus;
    //     this.data.holidayStatus = val.holidayStatus;
    //     this.data.id = val.id;
    //     this.getUpdata();
    //   }

    //   //console.log(this.data);
    // },
    async switchChange(val, type) {
      //更改状态
      let ifo = `此操作会更改该${type}状态，请确认是否继续？`;
      // if (val.holidayStatus) {
      //   ifo = "此操作会更改该启用状态，请确认是否继续？";
      // } else {
      //   ifo = "此操作会更改该启用状态，请确认是否继续？";
      // }
      // if (val.marketStatus) {
      //   ifo = "此操作会更改该销售状态，请确认是否继续？";
      // } else {
      //   ifo = "此操作会更改该销售状态，请确认是否继续？";
      // }
      this.$confirm(ifo, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let data = {
            marketStatus: val.marketStatus,
            holidayStatus: val.holidayStatus,
            id: val.id
          };
          console.log(222, data);
          let reslt = await this.$api.updateHolStatus({ data });
          console.log("更改角色状态", reslt);
          if (reslt && reslt.code === 0) {
            // this.getHolidayList(data)
            this.$message({
              type: "success", 
              message: "保存成功!"
            });
          }
        })
        .catch(() => {
          this.getHolidayList(this.params);
          this.$message({
            type: "warning",
            message: "已取消"
          });
        });
    },
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getHolidayList(this.params);
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.getHolidayList(this.params);
    }
  }
  // selectBtn(val) {
  //   this.$emit("select", val);
  // },
  // 提交
  // onSubmit() {
  //   let formData = {};
  //   for (let key in this.form) {
  //     if (this.form[key] !== "") formData[key] = this.form[key];
  //   }
  //   this.$emit("search", formData);
  // }
};
</script>
<style lang="less" scoped>
  
</style>

