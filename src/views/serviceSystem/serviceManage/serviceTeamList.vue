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
      <el-table-column prop="name" label="小组名称" min-width="170px"></el-table-column>
      <el-table-column prop="insName" label="所属机构" min-width="100px"></el-table-column>
      <el-table-column prop="persons" label="小组成员数" min-width="100px"></el-table-column>
      <el-table-column prop="jobName" label="负责内容" min-width="170px"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="160px"></el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" v-has="'serviceTeamList-detail'" @click.native="detail(scope.row.id)">查看</el-button>
          <el-button  size="mini" v-has="'serviceTeamList-edit'" @click.native="edit(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" v-has="'serviceTeamList-delete'" @click.native="toDelete(scope.row.id)">删除</el-button>
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
      :title="type==0?'新增客服小组':'编辑客服小组'"
      :visible.sync="isShow"
      width="50%"
      :close-on-click-modal="false"
      class="dialog-team">
      <el-form label-position="right" 
        label-width="90px" 
        :model="form"
        :rules="rules"
        ref="form"
        class="baseInfo">
        <el-form-item label="小组名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入小组名称" maxlength="10" show-word-limit></el-input> 
        </el-form-item>
        <!-- <el-form-item label="组员姓名" prop="userList">
          <el-select v-model="form.userList" multiple placeholder="请选择组员" @focus="isCheckUsers=true" class="job">
            <el-option
              v-for="(item,index) in userDatas"
              :key="index"
              :label="item.userName"
              :value="item.userId">
            </el-option>
          </el-select>
          <div @click.stop="isCheckUsers=true" class="mark">
          </div>
        </el-form-item> -->
        <el-form-item label="组员姓名" prop="userList">
          <el-cascader
            v-model="form.userList"
            :options="departmentData"
            :props="setProps"
            placeholder="请选择组员姓名"
            class="job"
            clearable>
          </el-cascader>
        </el-form-item>
        <el-form-item label="负责内容" prop="jobList">
          <el-select v-model="form.jobList" multiple placeholder="请选择负责内容" class="job">
            <el-option v-for="(item,index) in jobData" :key="index" :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <div class="dialog-footer">
          <el-button size="medium" @click="isShow=false">取 消</el-button>
          <el-button type="primary" class="sure" size="medium" @click="sure">确 定</el-button>
        </div>
      </el-form>
      <el-dialog
        width="600px"
        title="选择组员"
        :visible.sync="isCheckUsers"
        append-to-body>
        <choose-users @change="changeUserDatas" @close="isCheckUsers=false"></choose-users>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import {mapGetters} from 'vuex'
import ChooseUsers from '@/views/businessManage/home/components/users'

export default {
  name: '',
  components: {
    ChooseUsers
  },
  data() {
    return {
      controlOptions: [
        { name: "新增客服小组", type: "primary", icon: "plus", permission: 'serviceTeamList-add' }, // type为按钮的五种颜色， icon为具体的图标
      ],
      tableData: [],
      searchOptions:[
        {type: 'input', prop: 'name', value: '', title: '小组名称', placeholder: '请输入'},
        // {type: 'input', prop: 'gameListName', value: '', title: '组长', placeholder: '请输入'},
      ],
      params: {
        page: 1,
        pageSize: 20,
        param: {}
      },
      total: 0,
      type: 0,
      form: {
        name: null,
        userList: [],
        jobList: [],
      },
      rules: {
        name: [
          {required: true, validator: this.$rules.checkName, title: '客服小组', triggle: 'blur'}
        ],
        userList: [
          {required: true, validator: this.$rules.checkSelect, title: '组员', triggle: 'blur', type: Array,}
        ],
        jobList: [
          {required: true, validator: this.$rules.checkSelect, title: '负责内容', triggle: 'blur', type: Array,}
        ],
      },
      isShow: false,
      jobData: [],
      isCheckUsers: false,
      userDatas: [], // 组员的数据
      departmentData: [],
      setProps: {
        label: "text",
        value: "id",
        children: "children",
        multiple: true, // 多选
        checkStrictly: false //设置父子节点取消选中关联，从而达到选择任意一级选项的目的
      },
    }
  },
  watch: {
    userDatas: { // 监听组员
      handler(value) {
        // this.form.userList = [];
        // value.forEach(item => {
        //   this.form.userList.push(item.userId)
        // });
      },
      deep: true,
    }
  },
  created() {
    this.queryTeamList(this.params)
    this.getTeamJobs({})
    let insId = this.$storage.get('userInfo').insId
    let data = {
      insId,
      isShowChild: 0, // 0 为同级， 1为包含子级
    }
    this.getAssigneeUserList(data)
  },
  methods: {
    // 通过部门获取用户
    getAssigneeUserList(data) {
      const self = this;
      (async data => {
        let res = await this.$api.getAssigneeUserList({data});
        if(res&&res.code==0){
          console.log(res)
          res.data.forEach((item)=>{
            item.children&&item.children.forEach((list)=>{
              list.text = list.userName;
              list.id = list.userId;
            }) 
          })
          self.departmentData = res.data;
        }
      })(data)
    },
    // 选择组长
    changeUserDatas(val) {
      this.userDatas = val;
    },
    // 负责内容-下拉框
    getTeamJobs(data) {
      const self = this;
      (async (data)=>{
				let res = await self.$api.getTeamJobs({data})
				if(res && res.code == 0) {
          self.jobData = res.data;
				}
      })(data)
    },
    // 确认
    sure() {
      const self = this;
      self.$refs.form.validate(valid=>{
        if(valid) {
          let data = JSON.parse(JSON.stringify(self.form))
          let array = [];
          data.userList.forEach((item)=>{
            array.push(item[item.length - 1])
          })
          data.userList = array;
          if(self.type==0) {
            self.createTeam(data)
          }else{
            self.editTeam(data)
          }
        }
      })
    },
    // 删除
    deleteTeam(data) {
      const self = this;
      (async (data)=>{
				let res = await self.$api.deleteTeam({data})
				if(res && res.code == 0) {
          self.$message.success('删除成功')
          self.queryTeamList(self.params)
				}
      })(data)
    },
    // 编辑
    editTeam(data) {
      const self = this;
      (async (data)=>{
				let res = await self.$api.editTeam({data})
				if(res && res.code == 0) {
          self.$message.success('修改成功')
          self.isShow = false;
          self.queryTeamList(self.params)
				}
      })(data)
    },
    // 新增
    createTeam(data) {
      const self = this;
      (async (data)=>{
				let res = await self.$api.createTeam({data})
				if(res && res.code == 0) {
          self.$message.success('新增成功')
          self.isShow = false;
          self.queryTeamList(self.params)
				}
      })(data)
    },
    // 查询列表
    queryTeamList(data) {
      const self = this;
      (async (data)=>{
        let res = await self.$api.queryTeamList({data})
        console.log(res);
				if(res && res.code == 0) {
          self.total = res.data.total;
          if (res.data.records.length > 0) {
            res.data.records.forEach(item => {
              item.jobName = item.jobNameList.join('；')
              item.createTime = this.$moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
            })
          }
          self.tableData = res.data.records;
				}
      })(data)
    },
    // 查看详情
    detail(id) {
      this.$router.push({name: 'serviceTeamDetail', query: {id}})
    },
    // 删除
    toDelete(id) {
      const self = this;
      self.$confirm('此操作将删除该客服小组, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          self.deleteTeam(id)
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
      this.form.userList = [];
      this.form.jobList = [];
      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.clearValidate();
      })
      delete this.form.id
    },
    // 编辑
    edit(val) {
      this.type = 1;
      this.isShow = true;
      this.form.id = val.id;
      this.form.name = val.name;
      let userIds = val.userIds.split(',');
      let insArray = []
      userIds&&userIds.forEach((item)=>{
        if(item) {
          let arr = this.$formMethods.getInsArray(item,'id', this.departmentData, 'id') // 传入id 和对象
          arr&&arr.reverse();
          insArray.push(arr)
        }
      })
      this.form.userList = insArray;
      this.form.jobList = val.jobList;
      console.log(this.form, insArray)
      // 获取客服详情
      // this.getTeamDetail(val.id)
    },
    // 客服详情
    getTeamDetail(data) {
      const self = this;
      self.userDatas = [];
      (async (data)=>{
				let res = await self.$api.getTeamDetail({data})
				if(res && res.code == 0) {
          let nameArray = res.data.userName.split(',');
          let idArray = res.data.userIds.split(',');
          nameArray.forEach((item, index)=>{
            let obj = {
              userName: item,
              userId: idArray[index]
            }
            self.userDatas.push(obj)
          })
				}
      })(data)
    },
    search(val) {
      this.params.page = 1;
      this.params.param = val;
      if(val.date&&val.date.length>0) {
        this.params.param.startTime = this.$moment(val.date[0]).format('YYYY-MM-DD')
        this.params.param.endTime = this.$moment(val.date[1]).format('YYYY-MM-DD')
        delete this.params.param.date;
      }
      this.queryTeamList(this.params)
    },
    changeSize(val) {
      this.params.page = 1;
      this.params.pageSize = val
      this.queryTeamList(this.params)
    },
    changeCurrent(val) {
      this.params.page = val
      this.queryTeamList(this.params)
    },
  },
}
</script>


<style lang="less" scoped>
.job{
  width: 100%;
}
.mark{
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: 100%;
  height: 100%;
  z-index: 1;
  cursor: pointer;
}
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
.dialog-team{
  .el-dialog{
    min-width: 500px;
    max-width: 800px;
  }
}
</style>