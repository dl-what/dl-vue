<template>
  <div class="vlt-card question-manage">
    <search-bar class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      :total="total"
      labelWidth="6em">
      <!-- <control-bar slot="extend-bar" @select="select" :options="options"></control-bar> -->
      <div class="control-btn" slot="extend-bar">
        <el-button class="question-btn " type="primary" size="small" @click="newCreate" v-has="'questionBankManage-add'"><i class="el-icon-plus create-btn"></i>新建题目</el-button>
        <el-upload
          class="btn-import"
          style="display:flex;align-items:flex-end;"
          action
          :show-file-list="false"
          :auto-upload="true"
          :on-success="handleAvatarSuccess"
          :http-request="uploadFile"
          accept=".xls,.xlsx"
        >
        <el-button type="" size="small"><i class="el-icon-upload2 create-btn" v-has="'questionBankManage-export'"></i>导入题目</el-button>
        </el-upload>
        <el-button class="downloa-btn" type="" size="mini" @click="downLoad" v-has="'questionBankManage-downLoad'"><i class="el-icon-download create-btn"></i>下载模板</el-button>
      </div>
    </search-bar>
    
    <el-table :data="tableData" border>
      <el-table-column label="序号" fixed="left" type="index" width="60px">
        <template slot-scope="scope">
          {{params.pageSize*(params.page-1)+(scope.$index+1)}}
        </template>
      </el-table-column>
      <el-table-column label="题目类型" prop="questionType" min-width="90px">
        <template slot-scope="scope">
          {{getQuestionType(scope.row.questionType)}}
        </template>
      </el-table-column>
      <el-table-column label="题号" prop="questionNumber" min-width="60px"></el-table-column>
      <el-table-column label="题目" prop="questionTitle" min-width="160px" show-overflow-tooltip></el-table-column>
      <el-table-column label="选项" prop="trainOptions" min-width="260px" show-overflow-tooltip>
        <template slot-scope="scope">
          <div class="topicOption">
            <p v-for="(item,i) in scope.row.trainOptions" :key="i">{{item.optionContent+'.'+item.description}}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="正确答案" prop="correctAnswer" min-width="140px"></el-table-column>
      <el-table-column label="所属课程" prop="courseName" min-width="160px"></el-table-column>
      <el-table-column label="操作" fixed="right" min-width="160px">
        <template slot-scope="scope">
          <el-button :id="'questionBankManage-detail' + scope.$index" type="primary" size="mini" @click="checked(scope.row.id)" v-has="'questionBankManage-detail'">查看</el-button>
          <el-button :id="'questionBankManage-edit' + scope.$index" size="mini" @click="detail(scope.row.id)" v-has="'questionBankManage-edit'">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <table-paging position="right" :total="total" :currentPage="params.page" :pageSize="params.pageSize" 
    @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></table-paging>
  </div>
</template>

<script type="text/javascript">

export default {
  name: "questionBankManage",
  data() {
    return {
      searchOptions: [
        {title: '题号', type:'input', prop: 'questionNumber', value:''},
        {title: '题目', type:'input', prop: 'questionTitle', value:''},
        {title: '题目类型', type: 'select', prop: 'questionType', value: '', options: [{label:'单选',value:'0'},{label:'多选',value:'1'}]},
        {title: '所属课程', type: 'select', prop: 'courseId', value: '', options: []}
      ],
      // options: [
      //   {name: '新建题目', type: 'primary', icon: 'plus', permission: 'questionBankManage-add'},
      //   {name: '导入题目', type: 'primary', icon: 'download', permission: 'questionBankManage-export'},
      // ],
      courseOptions: [],
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
    this.getTableData(this.params)
    this.getCourseName()
  },
  methods: {
    getTableData(data) {
      const self = this;
      (async data =>{
        let res = await self.$api.getQuestionList({ data })
        console.log(res)
        if (res && res.code == 0) {
          self.total = res.data.total
          self.tableData = res.data.records
        }
      })(data)
    },
    select(val) {
      console.log(val.name)
      if(val.name=='新建题目') {
        this.$router.push({name:'newQuestionBank'})
      }
      if (val.name == "导入题目") {
        
      }
    },
    // 新建题目
    newCreate() {this.$router.push({name:'newQuestionBank'})},
    // 搜索
    search(val) {
      console.log(val)
      this.params.page = 1;
      this.params.param = val;
      this.getTableData(this.params)
    },
    // 编辑
    detail(id) {
      this.$router.push({name:"questionEdit", query: {id}})
    },
    // 查看
    checked(id) {
      this.$router.push({name:"questionCheck", query: {id}})
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
    // 获取所属课程下拉列表数据
    getCourseName() {
      const self = this;
      let data = {insId : this.$storage.get("userInfo").insId};
      (async data =>{
        let res = await self.$api.queryTrainCourseDownList({ data })
        console.log(res)
        if (res && res.code == 0) {
          let arr = res.data.map(item =>{
            return {label: item.name, value: item.id}
          })
          // self.courseOptions = arr
          self.$set(self.searchOptions[3], "options", arr)
        }
      })(data)
    },
    getQuestionType(val) {
      let obj = {
        0: "单选",
        1: "多选"
      }
      return obj[val]
    },
    handleAvatarSuccess(res, file) {
      console.log(res, file, "上传成功的勾子");
    },
    async uploadFile (files) {
      console.log(files, "文件")
      let formData = new FormData();
      formData.append("file",files.file)
      console.log(files.file)
      let res = await this.$api.trainQuestionImportExcel({
        timeout: 99999999999999,
        data: formData,
        onUploadProgress(evt) {
          console.log("上传进度事件:", evt);
        }
      })
      if (res && res.code == 0) {
        console.log('上传',res.data)
        this.$message.success('题目导入成功')
        this.getTableData(this.params)
      }
    },
    //下载导入模板
    async downLoad() {
      let result = await this.$api.exportExamTemplate({
        // data,
        responseType: "blob"
      });
      var blob = new Blob([result.blob], {
        type: "application/vnd.ms-excel;charset=utf-8"
      });
      var url = window.URL.createObjectURL(blob);
      var aLink = document.createElement("a");
      aLink.style.display = "none";
      aLink.href = url;
      aLink.setAttribute("download", "导入题目模板.xls");
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
      console.log(result);
      //console.log("res", result);
    },
  },
}
</script>

<style lang="less" scoped>
.question-manage{
  .topicOption {
    display: flex;
    // flex-wrap: wrap;
    justify-content: space-around;
  }
  .control-btn{
    display: flex;
    margin: 10px 0;
    .create-btn{padding-right: 5px};
    .downloa-btn{margin-left: 8px}
    .question-btn{
      margin-right: 8px
    }
  }
}

</style>
