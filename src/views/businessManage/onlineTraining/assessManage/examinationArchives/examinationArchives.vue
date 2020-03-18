<template>
  <div class="vlt-card">
    <search-bar class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      :total="total"
      labelWidth="6em">
      <control-bar slot="extend-bar" @select="select" :options="options"></control-bar>
    </search-bar>
    <el-table :data="tableData" border>
      <el-table-column label="序号" type="index" width="60px" fixed="left">
        <template slot-scope="scope">
          {{params.pageSize*(params.page-1)+(scope.$index+1)}}
        </template>
      </el-table-column>
      <el-table-column label="培训项目" prop="itemName" min-width="160px"></el-table-column>
      <el-table-column label="培训对象" prop="trainObjectsName" min-width="100px" show-overflow-tooltip></el-table-column>
      <el-table-column label="项目类别" prop="itemType" min-width="100px">
        <template slot-scope="scope">
          <span
            class="icon-tag"
            :class="{
            blue:scope.row.itemType=='2',
            green:scope.row.itemType=='1',
            grey:scope.row.itemType=='0',
            yellow:scope.row.itemType=='3',
            red:scope.row.itemType=='4',
            }"
          >{{scope.row.itemTypeName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="培训时间" prop="startDate,expireDate" min-width="340px">
        <template slot-scope="scope">
          {{scope.row.startDate}} ~ {{scope.row.expireDate}}
        </template>
      </el-table-column>
      <el-table-column label="单选题数" prop="singleNum" min-width="100px"></el-table-column>
      <el-table-column label="多选题数" prop="multiNum" min-width="100px"></el-table-column>
      <el-table-column label="总分" prop="totalScore" min-width="80px"></el-table-column>
      <el-table-column label="合格分" prop="passScore" min-width="80px"></el-table-column>
      <el-table-column label="考试/合格人数" prop="examCount,passCount" min-width="130px">
        <template slot-scope="scope">
          {{scope.row.examCount}} / {{scope.row.passCount}}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" min-width="160px">
        <template slot-scope="scope">
          <el-button :id="'examinationArchives-detail' + scope.$index" type="primary" size="mini" @click="detail(scope.row.id,scope.row.trainId,scope.row.examCount)" v-has="'examinationArchives-detail'">查看</el-button>
          <el-button :id="'examinationArchives-delete' + scope.$index" type="danger" size="mini" @click="deleteItem(scope.row.id)" v-has="'examinationArchives-delete'">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <table-paging position="right" :total="total" :currentPage="params.page" :pageSize="params.pageSize" 
    @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></table-paging>
  </div>
</template>

<script type="text/javascript">
export default { 
  name: "examinationArchives",
  data() {
    return {
      searchOptions: [
        {title:'培训课程', type:'input', prop: 'courseName', value:''},
        {title:'培训项目', type:'input', prop: 'itemName', value:''},
        {title:'总分', type:'input', prop: 'totalScore', value:''},
        {title: '培训对象', type: 'select', prop: 'trainObjects', value: '', options: []},
        {title: '培训时间', type: 'datepicker-range', prop: 'date', value: ''},
      ],
      options: [
        {name: '导出当前', type: 'primary', icon: 's-promotion', permission: 'examinationArchives-exportCurr'},
        {name: '导出全部', type: '', icon: 's-promotion', permission: 'examinationArchives-exportAll'},
      ],
      tableData: [],
      params: {
        page: 1,
        pageSize: 20,
        param: {}
      },
      total: 0,
    }
  },
  created() {
    this.getAccountRole()
    this.getTableData()
  },
  methods: {
    getTableData() {
      const self = this;
      let data = self.params;
      (async data =>{
        let res = await self.$api.getTrainExamList({ data })
        console.log("Data",res)
        if (res && res.code == 0) {
          self.total = res.data.total;
          let options = {
            1: "必做",
            2: "选做"
          }
          res.data.records.forEach((item)=>{
            item.itemTypeName = options[item.itemType]
          })
          self.tableData = res.data.records
        }
      })(data)
    },
    select(val) {
      if(val.name == '导出当前') {
        this.getOut(false)
      };
      if(val.name == '导出全部') {
        this.getOut(true)
      };
    },
    search(val) {
      this.params.page = 1;
      let data = {...val};
      if (data.totalScore) {
        data.totalScore = Number(val.totalScore)
      }
      delete data.date
      let time = val.date
      if (time && time.length > 0) {
        data.startDate = this.$moment(time[0]).format("YYYY-MM-DD");
        data.expireDate = this.$moment(time[1]).format("YYYY-MM-DD")
      }
      this.params.param = data
      console.log(data)
      this.getTableData(this.params)
    },
    // 删除
    deleteItem(val) {
      const self = this;
      this.$confirm("是否确认删除", '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let data = val;
        console.log(data)
        let res = await self.$api.trainExamDelete({data })
        if (res && res.code == 0) {
          this.$message({
          type: "success",
          message: "删除成功"
        });
          this.getTableData()
        }
      }).catch(() => {
        this.$message({
          type: "warning",
          message: "已取消删除"
        });
      });
    },
    detail(id,trainId,examCount) {
      this.$router.push({name:"examinationDetail",query:{id: id, trainId: trainId, examCount: examCount}})
    },
    handleSizeChange(val) {
      this.params.page = 1;
      this.params.pageSize = val;
      this.getTableData(this.params)
    },
    handleCurrentChange(val) {
      this.params.page = val;
      this.getTableData(this.params)
    },
    // 查询所有角色
    async getAccountRole () {
      let res = await this.$api.accountRole()
      if (res && res.code == 0) {
        console.log(res)
        this.$set(this.searchOptions[3], "options", res.data)
      }
    },
    // 导出
    async getOut(isAll) {
      this.requestData = {
        page: this.params.page,
        pageSize: this.params.pageSize,
        param: {
          all: isAll,
          ...this.params.param
        }
      }
      const data = JSON.parse(JSON.stringify(this.requestData))
      let result = await this.$api.trainExamExportExcel({
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
      aLink.setAttribute("download", "考试档案.xls");
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
      console.log(result);
      //console.log("res", result);
    },
    getItemType(val) {
      let obj = {
        1: "必做",
        2: "选做"
      }
      return obj[val]
    }
  },
}
</script>

<style lang="less" scoped>
</style>
