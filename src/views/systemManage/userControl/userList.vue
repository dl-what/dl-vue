<template>
  <div class="vlt-card">
    <div class="search">
      <!--搜索栏 !-->
      <search-bar
        class="search-bar-demo"
        @search="search"
        :options="option"
        :total="total"
        labelWidth="6em"
      >
        <control-bar slot="extend-bar" @select="selectBtn" :options="controlOptions"></control-bar>
      </search-bar>
    </div>
    <div class="role-table">
      <el-table :data="userList" border style="width: 100%;" @selection-change="handleSelectionChange">
        <el-table-column type="index" fixed prop="id" label="序号" width="60">
          <template slot-scope="scope">{{pageSize*(page-1)+(scope.$index+1)}}</template>
        </el-table-column>
        <el-table-column prop="account" label="账号" min-width="140px"></el-table-column>
        <el-table-column prop="userName" label="姓名" min-width="120px"></el-table-column>
        <el-table-column label="用户状态" align="center" min-width="200">
          <template slot-scope="scope">
            <table-row-status
              statusField="userStatus"
              idField="userId"
              :scope="scope"
              :tableData="userList"
              :rowName="scope.row.name"
              :disabled="scope.row.isSuperman?true:false"
              @change="statusChangeSuccess"
              :option="{
                'enable': { apiName: 'userStatus',  label: '启用', value: 0, permission:'userList-enable'},
                'disable': { apiName: 'userStatus', label: '冻结', value: 1, permission:'userList-disable'},
                'logout': { apiName: 'userStatus',label: '注销', value: 2, permission:'userList-logout'}
              }"
            ></table-row-status>
          </template>
        </el-table-column>
        <el-table-column prop="insName" label="所属机构" min-width="100px"></el-table-column>
        <el-table-column prop="strDepartmentName" label="部门" min-width="100px"></el-table-column>
        <el-table-column prop="strRoleName" label="用户角色" show-overflow-tooltip min-width="120px"></el-table-column>
        
        <el-table-column prop="mobile" label="手机号码" min-width="130"></el-table-column>
        <el-table-column prop="loginCount" label="最近登录次数" min-width="110"></el-table-column>
        <el-table-column prop="loginTime" label="最近登录时间" min-width="160">
          <template slot-scope="scope">{{scope.row.loginTime ? timeCycle(scope.row.loginTime):''}}</template>
        </el-table-column>
        
        <el-table-column prop="id" fixed="right" label="操作" min-width="260px">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" :id="$route.name+'-reset-'+scope.$index" @click="resetPassWord(scope.row)" v-has="'userList-resetPasword'">重置密码</el-button>
            <el-button type="primary" size="mini" @click="handelides(scope.row)" v-has="'userList-detail'" :id="$route.name+'-details-'+scope.$index">查看</el-button>
            <el-button type="" size="mini" @click="handelifo(scope.$index,scope.row)" :id="$route.name+'-edit-'+scope.$index" v-has="'userList-edit'" >编辑</el-button>
            <el-button type="success" size="mini" @click="unlock(scope.row)" :id="$route.name+'-edit-'+scope.$index" v-has="'userList-edit'" >解锁</el-button>
            
          </template>
        </el-table-column>
      </el-table>
      <div class="pagintion">
        <table-paging
          :currentPage="page"
          :pageSize="pageSize"
          :total="total"
          @handleSizeChange="pageSizeChange"
          @handleCurrentChange="pageCurrentChange"
        ></table-paging>
      </div>
    </div>
    <!-- <div class="dialog">
      <el-dialog
        title="重置密码"
        :visible.sync="dialogFormVisible"
        width="500px"
        custom-class="userDialog"
        :close-on-click-modal="false">
        <el-form :model="restpaswordfrom">
          <el-form-item label="请选择你的操作" label-width="130px">
            <el-radio-group v-model="restpaswordfrom.pwdStatus">
              <el-radio :label="0">登录密码</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false" :id="$route.name+'-pasword-cencel'">取 消</el-button>
          <el-button type="primary"  @click="dialogFormVisibleEnter" :id="$route.name+'-pasword-enter'" >确 定</el-button>
        </div>
      </el-dialog>
    </div> -->
  </div>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";
import storage from "@/utils/storage"
const Base64 = require('js-base64').Base64

export default {
  name: "userList",
  data() {
    return {
      innerVisible: false,
      restpaswordfrom: {
        pwdStatus: 0
      },
      total: 0,
      page: 1,
      pageSize: 20,
      dialogFormVisible: false,
      currentPage4: 1,
      userList: [],
      multipleSelection: [],
      controlOptions: [
        {
          name: "新增用户",
          type: "primary",
          icon: "plus",
          permission: "userList-create"
        }
      ],
      option: [
        {
          title: "姓名",
          prop: "userName",
          type: "input",
          value: "",
          placeholder: "请输入" || ["请输入1", "请输入2"]
        },
        {
          title: "账号",
          prop: "account",
          type: "input",
          value: "",
          placeholder: "请输入" || ["请输入1", "请输入2"]
        },
        {
          title: "所属机构",
          prop: "insId",
          type: "cascader",
          setProps: {
            value: "id",
            label: "text",
            checkStrictly: true,
            children: "children"
          },
          options: [],
          value: "",
          placeholder: "请输入" || ["请输入1", "请输入2"]
        },
        {
          title: "用户角色",
          prop: "roleName",
          type: "input",
          value: "",
          placeholder: "请输入" || ["请输入1", "请输入2"]
        },
        {
          title: "手机号码",
          prop: "mobile",
          type: "input",
          value: "",
          placeholder: "请输入" || ["请输入1", "请输入2"]
        },
        {
          title: "用户状态",
          prop: "userStatus",
          type: "select",
          options: [
            { value: 0,label: "启用" },
            { value: 1,label: "冻结" }
          ],
          value: "",
          placeholder: "请输入" || ["请输入1", "请输入2"]
        },
        {
          type: "datepicker-range",
          prop: "createTime",
          value: "",
          title: "创建时间",
          placeholder: ["开始时间", "结束时间"]
        }
      ],
      searchFrom: {},
      searchStatus: "",
      userId: [],
      restParam: {},

      // 报表与BI token
      reportUserLogin_token: storage.get('reportUserLogin_token'),
      biUserLogin_token: storage.get('biUserLogin_token')
    };
  },
  created() {
    const self = this;
    this.init();
  },
  mounted() {},
  computed: {
    ...mapGetters(["insData"])
  },
  methods: {
    unlock(val) {
      this.$confirm('此操作将解除错误登录次数的锁定，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {
          account: val.account
        };
        this.userUnLock(data);
      }).catch(() => {
        // 取消 
        this.$message.warning('已取消')
      });
    },
    // 用户解锁
    userUnLock(data) {
      const self = this;
      (async (data)=>{
				let res = await self.$api.userUnLock({data})
				if(res && res.code == 0) {
          self.$message.success('解锁成功')
				}
      })(data);
    },
    async init(val) {
      let data = {
        page: val || 1,
        pageSize: this.pageSize,
        param: {
          ...this.searchFrom
        }
      };

      let reslt = await this.$api.userPage({ data });
      if (reslt && reslt.code === 0) {
        if (!reslt.data) {
          this.userList = [];
          this.total = 0;
        } else {
          let arr = reslt.data.records.map(item => {
            let userLoginLogVo = item.userLoginLogVo;
            let insName;
            if (item.insInfoVo) {
              insName = item.insInfoVo.insName;
            }
            if (item.roleInfoList && item.roleInfoList.length > 0) {
              let array = [];
              item.roleInfoList.forEach(list => {
                array.push(list.roleName);
              });
              item.strRoleName = array.join("，");
            }
            if (item.deptInfoList && item.deptInfoList.length > 0) {
              let array = [];
              item.deptInfoList.forEach(list => {
                array.push(list.departmentName);
              });
              item.strDepartmentName = array.join("，");
            }
            return { ...userLoginLogVo,insName, ...item};
          });
          this.userList = arr;
          this.page = reslt.data.current;
          this.total = reslt.data.total;
        }
      }
    },
    selectable(val, index) {
      if (val.isSuperman) {
        return 0;
      } else {
        return 1;
      }
    },
    timeCycle(val) {
      return moment(val).format("YYYY-MM-DD HH:mm:ss");
    },
    pageSizeChange(val) {
      this.pageSize = val;
      this.init();
    },
    handleSelectionChange(val) {
      let arr = val.map(item =>item.userId);
      this.userId = [...arr];
    },
    pageCurrentChange(val) {
      this.currentPage4 = val;
      this.init(val);
    },
    handelifo(val, obj) {
      this.$router.push({
        name: "userInformedEdit",
        query: { type: 1, id: obj.userId }
      });
    },
    handelides(val) {
      this.$router.push({ name: "userDestails", query: { id: val.userId } });
    },
    selectBtn(val) {
      if (val.name === "新增用户") {
        this.$router.push({
          name: "userInformed",
          query: { type: 0 }
        });
      }
      if (val.name === "批量删除" && this.userId.length == 0) {
        this.$alert("请选择要删除的用户！", "提示！", {
          confirmButtonText: "确定",
          callback: action => {}
        });
      }
      if (val.name === "批量删除" && this.userId.length != 0) {
        this.$confirm("此操作将删除该用户, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            (async () => {
              let data = {};
              data.idList = [...this.userId];
              data = JSON.parse(JSON.stringify(data));
              let reslt = await this.$api.delByIds({ data });
              if (reslt.code === 0) {
                this.init();
                this.$message({
                  type: "success",
                  message: "删除成功"
                });
              }
            })();
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      }
    },
    // resetPassWord(val) {
    //   this.dialogFormVisible = true;
    //   this.restParam = val;
    // },
    resetPassWord() {
      this.$confirm( "此操作将登录密码重置为 123456，是否继续？",
        "提示！",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(async () => {
          let data = {
            ...this.restpaswordfrom
          };
          data.userId = this.restParam.userId;
          let reslt = await this.$api.restPassWord({ data });
          if (reslt.code === 0) {
            this.$message({ type: "success", message: "重置密码成功!"});
            // 报表用户重置密码
            let id = await this.getSyncUserId('reportGetUsers', this.reportUserLogin_token, this.restParam.account);
            this.syncUserEdit('reportUserEdit', this.reportUserLogin_token, {...this.restParam, id});
            // bi用户重置密码
            id = await this.getSyncUserId('biGetUsers', this.biUserLogin_token, this.restParam.account);
            this.syncUserEdit('biUserEdit', this.biUserLogin_token, {...this.restParam, id});
          }
        })
        .catch(() => {
          this.$message({type: "warning", message: "已取消"});
        });
    },
    search(val) {
      let list = {};
      if (Array.isArray(val.insId)) {
        val.insId = val.insId[val.insId.length - 1];
      }
      if (val.createTime && val.createTime.length > 0) {
        let startTime = moment(Date.parse(val.createTime[0])).format("YYYY-MM-DD " );
        let endTime = moment(Date.parse(val.createTime[1])).format("YYYY-MM-DD ");
        list = {...val,startTime, endTime};
      } else {
        list = {...val};
      }
      delete list.createTime;
      this.searchFrom = { ...list };
      this.init();
    },
    // resetPassWord(val) {
    //   this.dialogFormVisible = true;
    //   this.restParam = val;
    // },

    // 查询BI与报表用户列表
    async getSyncUserList(apiName, token, keyword) {
      let list = [];
      const res = await this.$api[apiName]({
        token,
        data: {
          page: 1,
          count: 100,
          keyword
        }
      })
      if (typeof res === 'object' && res.data && res.data.items && Array.isArray(res.data.items)) {
        list = res.data.items;
      }
      return list;
    },

    // 查询bi与报表用户id
    async getSyncUserId(apiName, token, keyword) {
      let id;
      let list = await this.getSyncUserList(apiName, token, keyword);
      list.forEach(userItem => {
        if (userItem.username === keyword) {
          id = userItem.id;
        }
      })
      return id;
    },

    // 报表与BI用户编辑
    async syncUserEdit(apiName, token, userInfo) {
      if (!token) {
        console.log('报表/BI token为空')
        return;
      }
      console.log(apiName + '-userInfo', userInfo)
      const data = {
        id: userInfo.id,
        username: userInfo.account,
        realName: userInfo.userName,
        email: userInfo.email,
        mobile: userInfo.mobile,
        roleIds: [], // userInfo.roleInfoList.map(item => String(item.roleId)),
        departmentPostId: '', // userInfo.deptInfoList.map(item => item.departmentId).join('@@@'),
        password: Base64.encode('123456'),
        resetPassword: true
      };
      const res = await this.$api[apiName]({
        token,
        data
      })
    },

    // 删除bi与报表用户
    async deleteSyncUser(apiName, token, id) {
      await this.$api[apiName]({
        token,
        data: {
          removeUserIds: [id]
        }
      });
    },

    // bi与报表用户状态修改
    async editSyncUserStatus(apiName, token, data) {
      await this.$api[apiName]({
        token,
        data
      });
    },

    // 状态变更成功
    async statusChangeSuccess(rowItem) {
      // 修改报表与bi用户状态

      // 查询报表用户id
      let id = await this.getSyncUserId('reportGetUsers', this.reportUserLogin_token, rowItem.account);
      // 报表用户状态修改
      this.editSyncUserStatus('reportUserStatusEdit', this.reportUserLogin_token, {
        enable: rowItem.userStatus == 0 ? true : false,
        id,
      });

      // 查询bi用户id
      id = await this.getSyncUserId('biGetUsers', this.biUserLogin_token, rowItem.account);
      // bi用户状态修改
      this.editSyncUserStatus('biUserStatusEdit', this.biUserLogin_token, {
        enable: rowItem.userStatus == 0 ? true : false,
        id,
      });
      
    },
  },
  watch: {
    insData: {
      handler(n, o) {
        this.option[2].options = this.insData;
      },
      deep: true,
      immediate: true
    }
  }
};
</script>


<style lang="less">
.userDialog {
  border-radius: 10px;
}
</style>
