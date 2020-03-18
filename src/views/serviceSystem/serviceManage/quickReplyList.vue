<template>
  <div class="vlt-card game-launch-list">
    <search-bar class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      :total="total"
      labelWidth="5em">
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
      <el-table-column prop="keyWord" label="快捷词" min-width="120px"></el-table-column>
      <el-table-column prop="content" label="回复内容" min-width="160px" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="状态" min-width="140px">
        <template slot-scope="scope">
          <el-switch
            v-has="'quickReplyList-switch'"
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
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" v-has="'quickReplyList-edit'" @click.native="edit(scope.row)">编辑</el-button>
          <el-button size="mini" v-has="'quickReplyList-delete'" @click.native="toDelete(scope.row.id)">删除</el-button>
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
      :title="type==0?'新增快捷词':'编辑快捷词'"
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
        <el-form-item label="快捷词" prop="keyWord">
          <el-input v-model="form.keyWord" placeholder="请输入快捷词" maxlength="10" show-word-limit></el-input> 
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            
            v-model="form.status"
            :active-text="form.status==0?'启用':'关闭'"
            :inactive-value="1"
            :active-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="form.content" type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入内容" maxlength="200"></el-input> 
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
        { name: "新增快捷回复", type: "primary", icon: "plus", permission: 'quickReplyList-add' }, // type为按钮的五种颜色， icon为具体的图标
      ],
      tableData: [],
      searchOptions:[
        {type: 'input', prop: 'keyWord', value: '', title: '快捷词'},
        {type: 'input', prop: 'createByName', value: '', title: '创建人'},
      ],
      params: {
        page: 1,
        pageSize: 20,
        param: {}
      },
      type: 0,
      form: {
        keyWord: null,
        status: 0,
        content: null,
      },
      rules: {
        keyWord: [
          {required: true, validator: this.$rules.checkName, title: '快捷词', triggle: 'blur'}
        ],
        content: [
          {required: true, message: '答案不能为空', triggle: 'blur'}
        ],
      },
      total: 0,
      isShow: false,
    }
  },
  created() {
    this.queryQuickReplyList(this.params)
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
          let res = await self.$api.changeQuickReplyStatus({data})
          if(res && res.code == 0) {
            self.$message.success('修改成功')
            self.queryQuickReplyList(self.params)
          }
        })(data)
      }).catch(() => {
        val.status = Math.abs(val.status - 1);
        this.$message('已取消');
      })
    },
    // 确认
    sure() {
      const self = this;
      self.$refs.form.validate(valid=>{
        if(valid) {
          if(self.type==0) {
            self.createQuickReply(self.form)
          }else{
            self.editQuickReply(self.form)
          }
        }
      })
    },
    // 删除
    deleteQuickReply(data) {
      const self = this;
      (async (data)=>{
				let res = await self.$api.deleteQuickReply({data})
				if(res && res.code == 0) {
          self.$message.success('删除成功')
          self.isShow = false;
          self.queryQuickReplyList(self.params)
				}
      })(data)
    },
    // 编辑
    editQuickReply(data) {
      const self = this;
      (async (data)=>{
				let res = await self.$api.editQuickReply({data})
				if(res && res.code == 0) {
          self.$message.success('修改成功')
          self.isShow = false;
          self.queryQuickReplyList(self.params)
				}
      })(data)
    },
    // 新增
    createQuickReply(data) {
      const self = this;
      (async (data)=>{
				let res = await self.$api.createQuickReply({data})
				if(res && res.code == 0) {
          self.$message.success('新增成功')
          self.isShow = false;
          self.queryQuickReplyList(self.params)
				}
      })(data)
    },
    // 查询列表
    queryQuickReplyList(data) {
      const self = this;
      (async (data)=>{
        let res = await self.$api.queryQuickReplyList({data})
        console.log(res);
				if(res && res.code == 0) {
          self.total = res.data.total;
          self.tableData = res.data.records;
          let options = {
            1: '未开始',
            2: '已上市',
            3: '已结束',
          };
          if (self.tableData.length > 0) {
            self.tableData.forEach(item => {
              item.strStatus = options[item.gameListStatus]
              item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
              item.gameListTime = item.gameListTime&&moment(item.gameListTime).format('YYYY-MM-DD HH:mm:ss')
            })
          }
				}
      })(data)
    },
    // 删除
    toDelete(id) {
      const self = this;
      self.$confirm('此操作将删除该快捷回复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.deleteQuickReply(id)
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
      this.form.keyWord = null;
      this.form.content = null;
      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.clearValidate()
      });
      this.form.status = 0;
      delete this.form.id
    },
    // 编辑
    edit(val) {
      this.type = 1;
      this.isShow = true;
      this.form.id = val.id;
      this.form.keyWord = val.keyWord;
      this.form.status = val.status;
      this.form.content = val.content;
    },
    search(val) {
      this.params.page = 1;
      this.params.param = val;
      if(val.date&&val.date.length>0) {
        this.params.param.startTime = this.$moment(val.date[0]).format('YYYY-MM-DD')
        this.params.param.endTime = this.$moment(val.date[1]).format('YYYY-MM-DD')
        delete this.params.param.date;
      }
      this.queryQuickReplyList(this.params)
    },
    changeSize(val) {
      this.params.page = 1;
      this.params.pageSize = val
      this.queryQuickReplyList(this.params)
    },
    changeCurrent(val) {
      this.params.page = val
      this.queryQuickReplyList(this.params)
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
