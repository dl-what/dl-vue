<template>
  <div class="vlt-card allot-task">
    <panel :show="true" title="新建任务分配">
      <div class="vlt-edit-single">
        <div class="vlt-edit-wrap">
          <el-form ref="form" :rules="rules" :model="form" label-width="10em" style="margin-top: 10px;">
            <el-form-item label="活动名称" prop="planId">
              <el-select v-model="form.planId" placeholder="请选择活动名称" @change="getPlanTitle">
                <el-option v-for="(item,index) in planList" :key="index" :label="item.activityName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="计划标题" prop="planTitleId">
              <el-select v-model="form.planTitleId" placeholder="请选择计划标题" @change="getPlanContent">
                <el-option v-for="(item,index) in titleList" :key="index" :label="item.planTitle" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="计划内容">
              <el-input v-model="form.planContent" disabled></el-input>
            </el-form-item>
            <el-form-item label="任务名称" prop="taskName">
              <el-input v-model="form.taskName" placeholder="请输入任务名称" maxlength="50" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="分配维度" prop="distributionDimension">
              <el-select v-model="form.distributionDimension" placeholder="请选择分配维度" @change="getChannelRole">
                <el-option label="按机构分配" value= 1></el-option>
                <el-option label="按渠道角色分配" value= 2></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="执行人" v-if="form.distributionDimension == 1" prop="">         
              <el-select v-model="form.executeUser" multiple placeholder="请选择" @focus="isCheckUsers=true" class="pass-select">
                <el-option
                  v-for="(item,index) in userDatas"
                  :key="index"
                  :label="item.userName"
                  :value="item.userId">
                </el-option>
              </el-select>
              <div @click.stop="isCheckUsers=true" class="mark">
              </div>
          </el-form-item>
            <el-form-item label="渠道角色" v-if="form.distributionDimension == 2" prop="">
              <el-select v-model="form.executeUser" multiple placeholder="请选择渠道角色">
                <el-option v-for="(item,index) in channelRoleList" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="完成时间" prop="completeTime">
              <el-date-picker @change="changeSelect" v-model="form.completeTime" :default-time="defaultTime" :clearable="true" :editable="false" type="datetime" :picker-options="completeTime" placeholder="请选择完成时间"></el-date-picker> 
            </el-form-item>
            <el-form-item label="任务描述">
              <el-input type="textarea" v-model="form.taskRemark" placeholder="请输入任务描述" maxlength="150" :autosize="{minRows:3}"></el-input>
            </el-form-item>
            <el-form-item>
              <div class="btn-box">
                <el-button :id="'allotTask-submit'" type="primary" size="medium" @click="submit">提 交</el-button>
                <el-button :id="'allotTask-cancel'" size="medium" @click="cancel">取 消</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <el-dialog
        :close-on-click-modal="false"
        width="600px"
        title="选择执行人"
        :visible.sync="isCheckUsers"
        append-to-body>
        <choose-users @change="changeUsersData" @close="isCheckUsers=false"></choose-users>
      </el-dialog>
    </panel>
  </div>
</template>

<script type="text/javascript">
import ChooseUsers from './components/users'
import moment from "moment"
export default {
  name: "allotTask",
  components:{ChooseUsers},
  data() {
    return {
      planList:[],
      titleList:[],
      channelRoleList:[],
      form: {
        planId:'',
        planTitleId:"",
        planContent:'',
        taskName:'',
        taskRemark:"",
        distributionDimension:'',
        executeUser:'',
        completeTime:''
      },
      rules:{
        planId: [{required: true, message: '活动名称不能为空', trigger: ['change','blur']}],
        planTitleId: [{required: true, message: '计划标题不能为空', trigger: ['change','blur']}],
        taskName: [{required: true,validator: this.$rules.checkName, title: '任务名称', trigger: ['change','blur']}],
        distributionDimension: [{required: true, message: '分配维度不能为空', trigger: ['change','blur']}],
        executeUser: [{required: true, message: '', trigger: ['change','blur']}],
        completeTime: [{required: true, message: '完成时间不能为空', trigger: ['change','blur']}],
      },
      isCheckUsers:false,
      userDatas: [], // 知会的用户数据
      completeTime: {
        disabledDate: time =>{
            return time.getTime() < Date.now() - 8.64e7;
        },
        selectableRange: `${this.$moment(Date.now()).format('HH:mm:ss')}-23:59:59`
      },
      defaultTime: moment(Date.now()).format('HH:mm:ss'),
    };
  },
  created(){
    let planTemplete = {insId: this.$storage.get("userInfo").insId}
    this.getActivityPlanList(planTemplete)
  },
  watch: {
    userDatas: { // 监听知会人
      handler(value) {
        this.form.executeUser = [];
        value.forEach(item => {
          this.form.executeUser.push(item.userId)
        });
      },
      deep: true,
    },
    "form.completeTime": {
      handler(newValue) { // 对于过去的时分秒置灰不能选择
        let time = new Date().setHours(0, 0, 0, 0) + 86400000;
        let now = new Date(newValue).getTime()
        if(now-time>0) { // 选择的是明天之后的时间
          this.completeTime.selectableRange = '00:00:00-23:59:59'
        }else{
          this.completeTime.selectableRange = `${this.$moment(Date.now()).format('HH:mm:ss')}-23:59:59`
        }
      },
      deep: true,
    }
  },
  methods: {
    changeSelect(val) {
      let time = new Date(val).getTime();
      let now = new Date().getTime()
      if(now-time>0) { // 选择的是过去时间
        this.form.gameListTime = now;
      }
    },
    async getActivityPlanList(data) {
      const self = this;
      let res = await self.$api.getActivityPlanAll({data})
      console.log(res)
      if (res && res.code == 0) {
        let list = res.data
        let arr = list.map(item =>{return {"activityName":item.activityName,id:item.id}})
        self.planList = arr
        
      }
    },
    async getPlanTitle(val) {
      const self = this;
      self.form.planTitleId = "";
      self.form.planContent = ""
      let data = val;
      let res = await self.$api.getActivityTitle({data})
      if (res && res.code == 0) {
        let list = res.data
        console.log(list)
        let arr = list.map(item =>{return {"planTitle":item.planTitle,id:item.id,"content":item.planContent}})
        self.titleList = arr
      }
    },
    getPlanContent(val) {
      this.titleList.forEach(item => {
        if(item.id == val) {
          this.form.planContent = item.content
        }
      });
    },
    async getChannelRole() {  //获取渠道角色
      const self = this;
      if(self.form.distributionDimension==1) {
        self.rules.executeUser[0].message = '执行人不能为空'
      }else{
        self.rules.executeUser[0].message = '渠道角色不能为空'
      }
      self.form.executeUser = ""
      let res = await self.$api.getChannelRole({})
      console.log(res)
      if (res && res.code == 0) {
        self.channelRoleList = res.data
      }
    },
    changeUsersData(val) { // 选择执行人
      this.userDatas = val;
    },
    submit() {
      const self = this;
      self.$refs.form.validate(async valid =>{
        if (valid) {
          let data = JSON.parse(JSON.stringify(self.form));
          data.executeUser = self.form.executeUser && self.form.executeUser.join(',');
          data.completeTime = self.$moment(self.form.completeTime).format("YYYY-MM-DD HH:mm:ss");
          data.distributionDimension = Number(self.form.distributionDimension);
          data.insId = self.$storage.get("userInfo").insId;
          console.log(data)
          let res = await self.$api.taskCreate({message:"分配成功", data });
            console.log(data)
          if (res && res.code == 0) {
            self.$router.push("executionManage")
          }
        }
      })  
      
    },
    cancel() {
      this.$router.go(-1);
    },
  }
};
</script>

<style lang="less" scoped >
.allot-task {
  .btn-box {
    margin-top: 10px;
  }
}
</style>
