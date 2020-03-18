<template>
<!-- 课程管理 -->
  <div class="vlt-card">
    <search-bar class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      :total="tableData.total"
      labelWidth="6em">
      <control-bar slot="extend-bar" @select="select" :options="options"></control-bar>
    </search-bar>
    <el-table :data="tableData.records" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" fixed></el-table-column>
      <el-table-column label="序号" width="80">
        <template slot-scope="scope">
        {{tableData.size*(tableData.current-1)+(scope.$index+1)}}
        </template>
      </el-table-column>
      <!-- <el-table-column label="序号" type="index" width="60px"></el-table-column> -->
      <el-table-column label="课程名称" prop="name" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="课程类型" prop="courseTypeName" min-width="140"></el-table-column>
      <el-table-column label="课件类型" prop="courseMode" min-width="140"></el-table-column>
      <el-table-column label="单选题数" prop="questionScoreVo.singleChoice" min-width="100"></el-table-column>
      <el-table-column label="多选题数" prop="questionScoreVo.multiChoice" min-width="100"></el-table-column>
      <!-- <el-table-column label="状态" prop="cycleType" min-width="140px"></el-table-column> -->
      <el-table-column label="上传人员" prop="uploadPersonName" min-width="140"></el-table-column>
      <el-table-column label="上传时间" prop="uploadTime" min-width="160"></el-table-column>
      <el-table-column label="操作" fixed="right" min-width="180">
        <template slot-scope="scope">
          <el-button :id="'courseManage-detail'+scope.$index" type="primary"  v-has="'courseManageContent-detail'" size="mini" @click="detail(scope.row, 'courseManageDetail')">查看</el-button>
          <el-button :id="'courseManage-edit'+scope.$index" type="" v-has="'courseManageContent-edit'" size="mini" @click="edit(scope.row, 'editCourseManage')">编辑</el-button>
          <el-button :id="'courseManage-delete'+scope.$index" type="danger" size="mini" v-has="'courseManageContent-delete'" @click="toDelete(scope.row)">删除</el-button>
          <!-- <el-button size="mini" @click="detail(scope.row, 'game-permission')">停用</el-button> -->
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
  </div>
</template>

<script type="text/javascript">

export default {
  name: "courseList",
  data() {
    return {
      // isClick: true,
      searchOptions: [
        {title: '课程名称', type:'input', prop: 'name', value:''},
        {title: '课程类型', type: 'select', prop: 'courseTypeId', value: '', options: []},
        {title: '课件类型', type: 'select', prop: 'courseMode', value: '', options: [
          {value: 1, label:'视频'},
          {value: 2, label:'音频'},
          {value: 3, label:'图片'},
          {value: 4, label:'pdf'}
        ]},
      ],
      options: [
        {name: '新建课程', type: 'primary', icon: 'plus', permission:'courseManageContent-add'},  // type为按钮的五种颜色， icon为具体的图标
        {name: '批量删除', type: '', icon: 'delete', permission:'courseManageConten-batchDelete'},
        {name: '导出当前', type: '', icon: 's-promotion', permission:'courseManageContent-exportCur'},
        {name: '导出全部', type: '', icon: 's-promotion', permission: 'courseManageContent-exportCur'},
      ],
      tableData: {
        records:[]
      },
      requestDatas: {
        page: 1,
        pageSize: 20,
        param: {
          insId: 0
        }
      },
      courseModeArr: ['视频', '音频', '图片', 'pdf'],
      multipleSelection: [],
    }
  },
  components: {
  },
  created(){
    this.requestDatas.param.insId = this.$storage.get('userInfo').insId;
    console.log(this.requestDatas.param.insId);
    if (this.requestDatas.param.insId) {
      this.getList(this.requestDatas);
      this.getQueryTrainTypeList(this.requestDatas.param.insId);
    }
  },
  methods: {
    getList(data) {
      const _this = this;
      (async data => {
        let res = await _this.$api.trainCourseList({ data });
        console.log(res);
        if (res && res.code == 0) {
          if (res.data != null) {
              _this.tableData = res.data;
              _this.tableData.records&&_this.tableData.records.forEach(item => {
                if (item.createTime) {
                  item.createTime = _this.$moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
                }
                if (item.courseMode) {
                  item.courseMode = _this.courseModeArr[item.courseMode - 1]
                }
              })
              // _this.tableData.records.length ? this.options[1].disabled = false : this.options[1].disabled = true;
              
          }
        }
      })(data);
    },

    // 查询课程类型下拉列表
    getQueryTrainTypeList (insId) {
      const _this = this;
      const data = {
        insId
      };
      (async data => {
        let res = await _this.$api.getQueryTrainTypeList({data});
        if (res && res.code === 0) {
          console.log(res);
          let courseTypeList = [];
          res.data&&res.data.forEach(item => {
            courseTypeList.push({
              value: item.id,
              label: item.courseType
            })
          });
          _this.$set(_this.searchOptions[1], 'options', courseTypeList);
          
        }
      })(data)
    },
    search(search) {
      console.log(search);
      this.requestDatas.param = {
        insId:this.$storage.get('userInfo').insId,
        ...search
      }
      this.requestDatas.page = 1;
      this.getList(this.requestDatas);
    },
    select(val) {
      if(val.name=='新建课程') {
        this.$router.push({name:'newCourseManage'})
      }else if (val.name === '批量删除') {
         if (!this.multipleSelection.length) {
          this.$message({
            type: "warning",
            message: "请选择需要删除的课程!"
          });
        } else {
          this.toDelete(this.multipleSelection);
        }
      } else if (val.name === '导出当前'){
        console.log('导出当前');
        this.exportExcel(this.requestDatas.page,this.requestDatas.pageSize, false);
      } else if (val.name === '导出全部') {
        console.log('导出全部');
        this.exportExcel();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // let isClick = this.multipleSelection.length ? false :  true;
      // this.$set(this.options[1], 'disabled', isClick)
    },
    // 导出
    async exportExcel(page=0,pageSize=0,all=true) {
      let datas = {
        page,
        pageSize,
        param: {
          all,
          insId: this.$storage.get('userInfo').insId,
        }
      }
      Object.assign(datas.param, this.requestDatas.param);
      console.log(this.requestDatas);
      // datas.param = {
      //   insId:this.$storage.get('userInfo').insId,
      //   ...search
      // }
      const data = JSON.parse(JSON.stringify(datas));
      let result = await this.$api.exportTrainCourseList({
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
      aLink.setAttribute("download", "课程管理列表.xls");
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
      //console.log("res", result);
    },
    
    // 课程表删除
    deleteRequest(data) {
      (async data => {
        console.log(data);
        let res = await  this.$api.trainCourseDelete({message: '删除成功！', data});
        if (res&&res.code === 0) {
          console.log('删除 成功');
          this.getList(this.requestDatas)
        }
      })(data)
    },
    trainCourseDeleteBatch(data) {
      (async data => {
        console.log(data);
        let res = await  this.$api.trainCourseDeleteBatch({message: '删除成功！', data});
        if (res&&res.code === 0) {
          console.log('删除 成功');
          this.getList(this.requestDatas)
        }
      })(data)
    },
    toDelete(row) {
      const _this = this;
      console.log(row);
      _this
        .$confirm("将删除此数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          let ids = [];
          let data = null;
          if(Array.isArray(row)){
            console.log(row);
            row.forEach(item => {
              ids.push(item.id);
            });
            data = {
              ids
            };
            this.trainCourseDeleteBatch(data);
          } else {
            data = row.id;
            this.deleteRequest(data);
          }
          console.log(data);
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消删除！"
          });
        });
    },
    detail (row, routerName) {
      this.$router.push({
        name: routerName,
        query: {
          id: row.id
        }
      })
      console.log(row, routerName);
    },
    edit (row, routerName) {
      this.$router.push({
        name: routerName,
        query: {
          id: row.id
        }
      })
      console.log(row, routerName);
    },
    handleSizeChange (val) {
      this.requestDatas.pageSize = val;
      this.requestDatas.page = 1;
      this.getList(this.requestDatas);
    },
    handleCurrentChange (val) {
      this.requestDatas.page = val;
      this.getList(this.requestDatas);
    },
  },
}
</script>

<style lang="less" scoped>
</style>
