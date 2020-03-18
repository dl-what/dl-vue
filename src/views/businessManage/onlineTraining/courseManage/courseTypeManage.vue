<template>
  <!-- 课程类型管理 -->
  <div class="vlt-card">
    <search-bar
      class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      :total="tableData.total"
      labelWidth="6em"
    >
      <control-bar slot="extend-bar" @select="select" :options="options"></control-bar>
    </search-bar>
    <el-table :data="tableData.records" border 
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" fixed></el-table-column>
       <el-table-column label="序号" width="80">
        <template slot-scope="scope">
        {{tableData.size*(tableData.current-1)+(scope.$index+1)}}
        </template>
      </el-table-column>
      <!-- <el-table-column label="序号" type="index" width="60px"></el-table-column> -->
      <el-table-column label="课程类型" prop="courseType" min-width="160px"></el-table-column>
      <el-table-column label="类型说明" prop="courseDesc" min-width="140px" show-overflow-tooltip></el-table-column>
      <el-table-column label="创建人" prop="createByName" min-width="140px"></el-table-column>
      <el-table-column label="创建时间" prop="createTime" min-width="150px"></el-table-column>
      <el-table-column label="操作" min-width="140px" fixed="right">
        <template slot-scope="scope">
          <el-button :id="'courseTypeManage-edit'+scope.$index" type="primary"  v-has="'courseTypeManage-edit'" size="mini" @click="edit(scope.row)">编辑</el-button>
          <el-button :id="'courseTypeManage-delete'+scope.$index" type="danger" size="mini" v-has="'courseTypeManage-delete'"  @click="toDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
      <table-paging
        position="right"
        :total="tableData.total"
        :currentPage="requestDatas.page"
        :pageSize="requestDatas.pageSize"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      ></table-paging>

      <edit-course-type :editData="editData" :dialogVisible.sync="dialogVisible"></edit-course-type>
  </div>
</template>
<script type="text/javascript">
import  editCourseType from './editCourseType'
export default {
  name: "courseTypeManage",
  data() {
    return {
      searchOptions: [
        { title: "课程类型", type: "input", prop: "courseType", value: "" },
        { title: "说明", type: "input", prop: "courseDesc", value: "" }
      ],
      options: [
        { name: "新增类型", type: "primary", icon: "plus", permission: 'courseTypeManage-add' }, // type为按钮的五种颜色， icon为具体的图标
        { name: "批量删除", type: "", icon: "delete", permission: 'courseTypeManage-batchDelete' },
        { name: "导出当前", type: "", icon: "s-promotion", permission: 'courseTypeManage-batchDelete' },
        { name: "导出全部", type: "", icon: "s-promotion", permission: 'courseTypeManage-batchDelete' }
      ],
      tableData: [
        { gameId: "2019-09-12 09：00：00", gameName: "a", cycleType: 0, gameTypeName: "奖组型", status: "计划中" }
      ],
      requestDatas: {
        page: 1,
        pageSize: 20,
        param: {
          all: false,
          insId: null,
          courseDesc: "",
          courseType: ""
        }
      },
      multipleSelection: [],
      editData: {},
      dialogVisible: false
    };
  },
  components: {
    'edit-course-type': editCourseType
  },
  created() {
    this.requestDatas.param.insId = this.$storage.get('userInfo').insId;
    console.log(this.requestDatas.param.insId);
    if (this.requestDatas.param.insId) {
      this.getList(this.requestDatas);
    }
  },
  methods: {
    getList(data) {
      const _this = this;
      (async data => {
        let res = await _this.$api.getQueryTrainTypeInfoList({ data });
        console.log(res);
        if (res && res.code == 0) {
          if (res.data != null) {
              _this.tableData = res.data;
              _this.tableData.records&&_this.tableData.records.forEach(item => {
                if (item.createTime) {
                  item.createTime = _this.$moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
                }
              })
          }
        }
      })(data);
    },
    search(val) {
      console.log(val);
      this.requestDatas.param.courseType = val.courseType ? val.courseType : '';
      this.requestDatas.param.courseDesc = val.courseDesc ? val.courseDesc : '';
      this.requestDatas.page = 1;
      this.getList(this.requestDatas);
    },
    select(val) {
      if (val.name === "新增类型") {
        this.$router.push({ name: "newCourseType" });
      } else if (val.name === "批量删除") {
        console.log("批量删除");
        if (!this.multipleSelection.length) {
          this.$message({
            type: "warning",
            message: "请选择需要删除的课程类型!"
          });
        } else {
          console.log(this.multipleSelection);
          let deleteArr = [];
          this.multipleSelection.forEach(item => {
             deleteArr.push(item.id)
          })
          this.toDelete(deleteArr);
        }
      } else if (val.name === "导出当前") {
        this.requestDatas.param.all = false;
        this.exportExcel(this.requestDatas);
      } else if (val.name === '导出全部') {
        let data = {};
        Object.assign(data,this.requestDatas);
        data.pageSize = 0
        data.page = 0;
        data.param.all = true;
        this.exportExcel(data);
      }
    },
    edit(row) {
      this.dialogVisible = true;
      console.log(row);
      this.editData = row;
    },
    deleteRequest(data) {
      (async data => {
        let res = await  this.$api.deleteTrainTypeInfo({message: '删除成功！', data});
        if (res&&res.code === 0) {
          console.log('删除 成功');
          this.getList(this.requestDatas)
        }
      })(data)
    },
    toDelete(row) {
      const _this = this;
      _this
        .$confirm("将删除此数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          let ids = [];
          if(Array.isArray(row)){
            ids = row
          } else {
            ids.push(row.id)
          }
          const data = {
            ids
          }
          console.log(data);
          this.deleteRequest(data);
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消删除！"
          });
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // let isClick = this.multipleSelection.length ?  false : true;
      // this.$set(this.options[1], 'disabled', isClick);
    },
    // 导出
    async exportExcel(datas) {
      const data = JSON.parse(JSON.stringify(datas));
      let result = await this.$api.exportTrainTypeInfoList({
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
      aLink.setAttribute("download", "课程类型列表.xls");
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
      //console.log("res", result);
    },
    handleSizeChange(val) {
      this.requestDatas.pageSize = val;
      this.requestDatas.page = 1;
      this.getList(this.requestDatas)
    },
    handleCurrentChange(val) {
      this.requestDatas.page = val;
      this.getList(this.requestDatas)
    },
  }
};
</script>

<style lang="less" scoped>
</style>
