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
      <el-table-column label="序号" fixed width="55">
        <template slot-scope="scope">
          {{params.pageSize*(params.page - 1) + (scope.$index+1)}}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="分类名称" min-width="140px"></el-table-column>
      <el-table-column prop="remark" label="分类描述" min-width="180px"></el-table-column>
      <el-table-column prop="num" label="问题数量" min-width="120px"></el-table-column>
      <el-table-column prop="createByName" label="创建人" min-width="120px"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="160px"></el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" v-has="'knowledgeTypeList-edit'" @click.native="edit(scope.row)">编辑</el-button>
          <el-button size="mini" v-has="'knowledgeTypeList-delet'" @click.native="toDelete(scope.row.id)">删除</el-button>
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
    <el-dialog
      :title="type==0?'新增分类':'编辑分类'"
      :visible.sync="isShow"
      width="50%"
      :close-on-click-modal="false"
      class="dialog-knowledge">
      <el-form label-position="right" 
        label-width="90px" 
        :model="form"
        :rules="rules"
        ref="form"
        class="baseInfo">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" maxlength="10" show-word-limit></el-input> 
        </el-form-item>
        <el-form-item label="分类描述" prop="remark">
          <el-input v-model="form.remark" type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入分类描述" maxlength="100"></el-input> 
        </el-form-item>
        <div class="dialog-footer">
          <el-button size="medium" @click="isShow=false">取 消</el-button>
          <el-button type="primary" class="sure" size="medium" @click="sure">确 定</el-button>
        </div>
      </el-form>
    </el-dialog>
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
        { name: "新增分类", type: "primary", icon: "plus", permission: 'knowledgeTypeList-add' }, // type为按钮的五种颜色， icon为具体的图标
      ],
      tableData: [],
      searchOptions:[
        {type: 'input', prop: 'name', value: '', title: '分类名称',},
        {type: 'input', prop: 'createByName', value: '', title: '创建人',},
      ],
      params: {
        page: 1,
        pageSize: 20,
        param: {}
      },
      total: 0,
      isShow: false,
      form: {
        name: null,
        remark: null,
      },
      type: 0, // 0-新增 1-编辑
      rules: {
        name: [
          {required: true, validator: this.$rules.checkName, title: '分类名称', triggle: 'blur'}
        ]
      }
    }
  },
  created() {
    this.getKnowledgeTypeList(this.params)
  },
  computed: {
    ...mapGetters(['insData'])
  },
  methods: {
    sure() {
      const self = this;
      self.$refs.form.validate(valid=>{
        if(valid) {
          if(self.type==0) {
            self.createKnowledgeType(self.form)
          }else{
            delete self.form.createTime;
            delete self.form.updateTime;
            self.editKnowledgeType(self.form)
          }
        }
      })
    },
    // 删除
    deleteKnowledgeType(data) {
      const self = this;
      (async (data)=>{
				let res = await self.$api.deleteKnowledgeType({data})
				if(res && res.code == 0) {
          self.$message.success('删除成功')
          self.isShow = false;
          self.getKnowledgeTypeList(self.params)
				}
      })(data)
    },
    // 编辑
    editKnowledgeType(data) {
      const self = this;
      (async (data)=>{
				let res = await self.$api.editKnowledgeType({data})
				if(res && res.code == 0) {
          self.$message.success('修改成功')
          self.isShow = false;
          self.getKnowledgeTypeList(self.params)
				}
      })(data)
    },
    // 新增
    createKnowledgeType(data) {
      const self = this;
      (async (data)=>{
				let res = await self.$api.createKnowledgeType({data})
				if(res && res.code == 0) {
          self.$message.success('新增成功')
          self.isShow = false;
          self.getKnowledgeTypeList(self.params)
				}
      })(data)
    },
    getKnowledgeTypeList(data) {
      const self = this;
      (async (data)=>{
        let res = await self.$api.getKnowledgeTypeList({data})
        console.log(res);
				if(res && res.code == 0) {
          self.total = res.data.total;
          self.tableData = res.data.records;
          self.tableData.forEach((item)=>{
            item.createTime = this.$moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
          })
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
        self.deleteKnowledgeType(id)
      }).catch(() => {
        self.$message({
          type: 'warning',
          message: '已取消删除'
        });          
      });
    },
    // 新增
    selectBtn() {
      this.type = 0;
      this.isShow = true;
      this.form.name = null;
      this.form.remark = null;
      this.$refs.form&&this.$refs.form.resetFields()
      delete this.form.id;
    },
    // 编辑
    edit(val) {
      this.type = 1;
      this.isShow = true;
      this.form = Object.assign(this.form, val)
    },
    search(val) {
      this.params.page = 1;
      this.params.param = val;
      if(val.date&&val.date.length>0) {
        this.params.param.startTime = this.$moment(val.date[0]).format('YYYY-MM-DD')
        this.params.param.endTime = this.$moment(val.date[1]).format('YYYY-MM-DD')
        delete this.params.param.date;
      }
      this.getKnowledgeTypeList(this.params)
    },
    changeSize(val) {
      this.params.page = 1;
      this.params.pageSize = val
      this.getKnowledgeTypeList(this.params)
    },
    changeCurrent(val) {
      this.params.page = val
      this.getKnowledgeTypeList(this.params)
    },
  },
}
</script>

<style lang="less" scoped>
.baseInfo{
  padding: 0px 8%;
}
.dialog-footer{
  padding-top: 20px;
  text-align: right;
  .sure{
    margin-left: 20px;
  }
}
</style>
<style lang="less">
.dialog-knowledge{
  .el-dialog{
    min-width: 500px;
    max-width: 800px;
  }
}
</style>

