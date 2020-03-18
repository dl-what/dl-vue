<template>
<div class="vlt-card">
  <panel :show="true" title="基本信息">
    <div class="vlt-edit-single">
      <div class="vlt-edit-wrap">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="8em" class="demo-ruleForm">
          <el-form-item  label="仓库名称" prop="warName">
            <el-input v-model.trim="ruleForm.warName" placeholder="请输入仓库名称" disabled></el-input>
          </el-form-item>
          <el-form-item label="仓库管理员" prop="adminId">
            <el-select v-model="ruleForm.adminId" placeholder="请选择" @focus="isCheckUser=true" class="pass-select">
                <el-option
                  v-for="(item,index) in userData"
                  :key="index"
                  :label="item.userName"
                  :value="item.userId">
                </el-option>
            </el-select>
            <div @click.stop="isCheckUser=true" class="mark">
            </div>
          </el-form-item>
          <el-form-item  label="仓库类型" prop="warType">
            <el-select v-model="ruleForm.warType" :disabled="true">
              <el-option label="中彩仓库" :value=1></el-option>
              <el-option label="省中心仓库" :value=2></el-option>
              <el-option label="地市仓库" :value=3></el-option>
              <el-option label="销售大厅" :value=4></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input disabled type="textarea" v-model="ruleForm.remark" maxlength="150" :autosize="{ minRows: 3, maxRows: 5}"></el-input>
          </el-form-item>
          <el-form-item>
            <el-row>
              <el-button :id="'addStore-submit'" type="primary" v-prevent="1000" size="medium" @click="submit()">提 交</el-button>
              <el-button :id="'addStore-cancel'" size="medium" @click="cancel">取 消</el-button>
            </el-row>
          </el-form-item>
        </el-form>
        <!-- <el-row class="vlt-edit-btn">
          <el-button :id="'addStore-submit'" type="primary" v-prevent="1000" size="medium" @click="submit()">提 交</el-button>
          <el-button :id="'addStore-cancel'" size="medium" @click="cancel">取 消</el-button>
        </el-row> -->
      </div>
      <el-dialog
        width="600px"
        title="选择仓库管理员"
        :visible.sync="isCheckUser"
        append-to-body>
        <choose-users :insId="ruleForm.insId" @change="changeUserData" @close="isCheckUser=false"></choose-users>
      </el-dialog>
    </div>
  </panel>
</div>
</template>

<script type="text/javascript">
import ChooseUsers from './components/users'
import { async } from 'q'
import { gzip } from 'zlib';
export default {
name: "editStore",
data() {
return {
  userData: [],     //仓库管理员数据
  isCheckUser: false,

  ruleForm: {
    // adminName: '',
    warName:'',    //仓库名称
    insId:'',       // 机构id
    warType: '',    // 仓库类型
    adminId: '',    // 管理员id
    remark:'' 
  },
  rules: {
    warName: [{required: true,validtor: this.$rules.checkName, title: '请输入仓库名称',trigger: ['change','blur']}],
    insId: [{required: true, message: '请选择所属机构',trigger: ['change','blur']}],
    warType: [{required: true, message: '请选择仓库类型',trigger: ['change','blur']}],
    adminId: [{required: true, message: '请选择仓库管理员',trigger: ['change','blur']}],
    // remark: [{required: true, message: '请输入备注',trigger: ['change','blur']}],
  },
}
},
components: {
  ChooseUsers,
},
created(){
  this.getDetail();
 
},
methods: {
  changeUserData(val) { // 选择管理员
    this.userData = val;
    this.ruleForm.adminId = val[0].userId;
    // this.ruleForm.insId = val[0].checkInsId;
    // this.ruleForm.adminName = val[0].adminName
    // this.ruleForm.warType = val[0].warType
  },
  submit(){
    const self = this
    self.$refs.ruleForm.validate(val=>{
      if(val) {
        let data = JSON.parse(JSON.stringify(self.ruleForm));
        console.log("提交参数",data)
        self.updateWare(data);
      }
    })
  },
  cancel(){this.$router.back()},
  //  创建仓库
  updateWare(data) {
    (async data => {
      let res = await this.$api.updateWare({ 
        message: '修改成功',
        data 
      });
      if (res && res.code == 0) {
        this.$router.push({ path: "storeManage" });
      }
    })(data);
  },
  async getDetail() {
    const data = this.$route.query.id
    console.log(data)
    let res = await this.$api.detailStore({data})
    if(res && res.code == 0){
      this.ruleForm = res.data;
      this.userData = [{userName:res.data.adminName,userId:res.data.adminId}]
    }
    console.log(res)
  }
},
}
</script>

<style lang="less" scoped>
</style>