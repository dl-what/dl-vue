<template> 
<!-- :close-on-click-modal="false" -->
  <el-dialog title="选择题目" :visible.sync="showDialog" >
    <div class="vlt-card select-question-dia">
      <div class="select-question-list">
        <el-table :data="tableData" border :row-key="getRowKeys"  @selection-change="handleSelectionChange" @select="onTableSelect" ref="multipleTable">
          <el-table-column type="selection" width="55" :reserve-selection="true" > </el-table-column>
          <el-table-column label="序号" fixed="left" type="index" width="60px">
            <template slot-scope="scope">
              {{params.pageSize*(params.page-1)+(scope.$index+1)}}
            </template>
          </el-table-column>
          <el-table-column label="题目类型" prop="questionType" min-width="80px">
            <template slot-scope="scope">{{getQuestionType(scope.row.questionType)}} </template>
          </el-table-column>
          <el-table-column label="题号" prop="questionNumber" min-width="60px"></el-table-column>
          <el-table-column label="题目" prop="questionTitle" min-width="160px" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
    <table-paging position="right" :total="total" :currentPage="params.page" :pageSize="params.pageSize" 
    @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" :pagerCount="5"></table-paging>
      <div class="" style="text-align: right">
        <el-button :id="'newCourseManage-submit'" type="primary" size="small" @click="submit">提 交</el-button>
        <el-button :id="'newCourseManage-cancel'" size="small" @click="showDialog=false">取 消</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script type="text/javascript">
export default {
  name: "",
  props: {
    showSelect: {
      type: Boolean
    },
    subjectData: {
      type: Array
    },
    dataArr: {
      type: Array
    }
  },
  data() {
   return {
     showDialog: false,
     params: {
      page: 1,
      pageSize: 10,
      param: {}
    },
    total: null,
    tableData: [],
    selectIdArr: [],
    datas: [],
    arrs: [],
    selectArr: []
   }
  },
  watch: {
    showSelect: {
      handler(newVal, oldVal) {
        console.log(newVal);
        this.showDialog = newVal;
        if (this.showDialog) {
          this.getTableData(this.params);
        }
      }
    },
    showDialog: {
      handler(newVal, oldVal) {
        this.$emit('update:showSelect', newVal);
      },
      deep: true
    },
    dataArr: {
      handler(newVal, oldVal) {
        console.log('改变的data', newVal);
        this.arrs = newVal;
        this.selectArr = newVal.concat();
      },
      deep: true
    }
  },
 components: {
 },
 created () {
  // this.$nextTick ( () => {
  //   this.getTableData(this.params);
  // })
 },
 methods: {
   getTableData(data) {
      const self = this;
      (async data =>{
        let res = await self.$api.getQuestionList({ data })
        console.log(res)
        if (res && res.code == 0) {
          self.total = res.data.total;
          self.tableData = res.data.records;

          let arr = [];
          console.log('这是 selectArr', self.selectArr);
          self.tableData.forEach(item => {
            item.ischecked = false;
            // this.$refs.multipleTable.toggleRowSelection(item, false);
            if (self.arrs.indexOf(item.id) > -1) {
              item.ischecked = true;
              arr.push(item);
            }
          })
          console.log(arr);
          self.$nextTick(() => {
            self.toggleSelection(arr);
          })
        }
      })(data)
    }, 
    checkSelectable (row) {
      return row.ischecked == true;
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row, true);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    getQuestionType(val) {
      let obj = {
        0: "单选",
        1: "多选"
      }
      return obj[val]
    },  
    handleSelectionChange (val) {
      // console.log(val);
      this.selectArr = val;
    },
    onTableSelect(val, a){
      console.log(val,a);
    },
    getRowKeys(row) {
   		return row.id;
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
    submit () {
      this.showDialog = false;
      let arr =  [...new Set(this.selectArr)];
      let arr2 = [];
      arr.forEach(item => {
        if (item.id) {
          arr2.push(item)
        } else {
          this.tableData.forEach(ele => {
            if (ele.id == item) {
              arr2.push(ele);
            } 
          })
        }
      })
      // console.log(arr);
      this.$emit('sendQuestionId', arr2);
    },
   isClose () {
     this.showDialog = false;
   }
 },
}
</script>

<style lang="less" scoped>
.select-question-dia {
  margin-top: -20px;
  .select-question-list {
    max-height: 60vh;
    margin-bottom: 20px;
    overflow-y: scroll;
  }
}
</style>
