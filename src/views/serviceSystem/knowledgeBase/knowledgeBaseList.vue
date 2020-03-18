<template>
  <div class="vlt-card game-launch-list">
    <search-bar class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      :total="total"
      labelWidth="6em">
      <control-bar slot="extend-bar" @select="selectBtn" :options="controlOptions"></control-bar>
    </search-bar>
    <el-table
      border
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%">
      <!-- <el-table-column type="selection" fixed width="55"></el-table-column> -->
      <el-table-column label="序号" fixed width="55">
        <template slot-scope="scope">
          {{params.pageSize*(params.page - 1) + (scope.$index+1)}}
        </template>
      </el-table-column>
      <el-table-column prop="categoryName" label="问题分类" min-width="120px"></el-table-column>
      <el-table-column label="问题标题" min-width="160px">
        <template slot-scope="scope">
          {{scope.row.question.question}}
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="140px">
        <template slot-scope="scope">
          <el-switch
            v-has="'knowledgeBaseList-switch'"
            v-model="scope.row.status"
            @change="changeSwitch(scope.row)"
            :active-text="scope.row.status==0?'启用':'关闭'"
            :inactive-value="1"
            :active-value="0">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="createByName" label="创建人" min-width="120px"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="160px"></el-table-column>
      <el-table-column fixed="right" label="操作" min-width="140">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" v-has="'knowledgeBaseList-edit'" @click.native="edit(scope.row.id)">编辑</el-button>
          <el-button  size="mini" v-has="'knowledgeBaseList-delete'" @click.native="toDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <table-paging
      position="right"
      :total="total"
      :currentPage="params.page"
      :pageSize="params.pageSize"
      @handleSizeChange="changeSize"
      @handleCurrentChange="changeCurrent">
    </table-paging>
  </div>
  
</template>

<script>
import moment from 'moment'
import {mapGetters} from 'vuex'

export default {
  name: 'gameMarketPlanList',
  data() {
    return {
      controlOptions: [
        { name: "新增知识库", type: "primary", icon: "plus", permission: 'knowledgeBaseList-add' }, // type为按钮的五种颜色， icon为具体的图标
        // { name: "批量冻结", type: "", icon: "lock" },
        // { name: "批量删除", type: "", icon: "delete" },
      ],
      tableData: [],
      searchOptions:[
        {type: 'input', prop: 'categoryName', value: '', title: '问题分类',},
        {type: 'input', prop: 'question', value: '', title: '问题标题'},
        {
          type: 'select', prop: 'status', value: '', title: '状态', placeholder: '请选择',
          options: [
            {
              label: '启用',
              value: 0
            },
            {
              label: '关闭',
              value: 1
            },
          ]
        },
      ],
      params: {
        page: 1,
        pageSize: 20,
        param: {}
      },
      total: 0,
    }
  },
  created() {
    this.queryKnowledgeList(this.params)
  },
  methods: {
    // 修改状态
    changeSwitch(val) {
      this.$confirm(`修改启用状态, 是否继续?`, '提示',  {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const self = this;
        const data = {
          id: val.id,
          status: val.status
        };
        (async (data)=>{
          let res = await self.$api.changeKnowledgeStatus({data})
          if(res && res.code == 0) {
            self.$message.success('修改成功')
            self.queryKnowledgeList(self.params)
          }
        })(data)
      }).catch(() => {
        val.status = Math.abs(val.status - 1);
        this.$message('已取消');
      })
    },
    queryKnowledgeList(data) {
      const self = this;
      (async (data)=>{
        let res = await self.$api.queryKnowledgeList({data})
        console.log(res);
				if(res && res.code == 0) {
          self.total = res.data.total;
          self.tableData = res.data.records;
          if (self.tableData.length > 0) {
            self.tableData.forEach(item => {
              item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
            })
          }
				}
      })(data)
    },
    deleteKnowledge(data) {
      const self = this;
      (async (data)=>{
        let res = await self.$api.deleteKnowledge({data})
        console.log(res);
				if(res && res.code == 0) {
          self.$message.success('提交成功');
          self.queryKnowledgeList(self.params)
				}
      })(data)
    },
    // 删除
    toDelete(id) {
      const self = this;
      self.$confirm('此操作将删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.deleteKnowledge(id)
      }).catch(() => {
        self.$message({
          type: 'warning',
          message: '已取消删除'
        });          
      });
    },
    selectBtn() {
      this.$router.push({path: './createKnowledgeBase'})
    },
    // 编辑
    edit(id) {
      this.$router.push({ name: 'editKnowledgeBase', query: {id}})
    },
    search(val) {
      this.params.page = 1;
      this.params.param = val;
      if(val.date&&val.date.length>0) {
        this.params.param.startTime = this.$moment(val.date[0]).format('YYYY-MM-DD')
        this.params.param.endTime = this.$moment(val.date[1]).format('YYYY-MM-DD')
        delete this.params.param.date;
      }
      this.queryKnowledgeList(this.params)
    },
    changeSize(val) {
      this.params.page = 1;
      this.params.pageSize = val
      this.queryKnowledgeList(this.params)
    },
    changeCurrent(val) {
      this.params.page = val
      this.queryKnowledgeList(this.params)
    },
  },
}
</script>


<style lang="less" scoped>
</style>
