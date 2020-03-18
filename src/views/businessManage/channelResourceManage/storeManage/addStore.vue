<template>
<div class="vlt-card">
  <panel :show="true" title="基本信息">
    <div class="vlt-edit-single">
      <div class="vlt-edit-wrap">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="8em" class="demo-ruleForm">
          <el-form-item  label="仓库名称" prop="warName">
            <el-input v-model.trim="ruleForm.warName" placeholder="请输入仓库名称"></el-input>
          </el-form-item>
          <!-- <el-form-item label="所属机构" prop="insId">
            <el-cascader
              v-model="ruleForm.insId"
              :options="insOptions"
              placeholder="请选择所属机构"
              :props="insData"
              
              clearable>
            </el-cascader>
          </el-form-item> -->
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
          <!-- <el-form-item label="所属部门" prop="departmentId">
            <el-cascader
              v-model="ruleForm.departmentId"
              :options="departmentOptions"
              placeholder="请选择所属部门"
              :props="departmentData"
              @change="changeForm1"
              clearable>
            </el-cascader>  
          </el-form-item> -->
          <el-form-item  label="仓库类型" prop="warType">
            <el-select v-model="ruleForm.warType" :disabled="true">
              <el-option label="中彩仓库" :value=1></el-option>
              <el-option label="省中心仓库" :value=2></el-option>
              <el-option label="地市仓库" :value=3></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item  label="仓库管理员" prop="adminId">
            <el-select v-model="ruleForm.adminId">
              <el-option v-for="(item,index) in adminList" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="ruleForm.remark" maxlength="150" :autosize="{ minRows: 3, maxRows: 5}"></el-input>
          </el-form-item>
          <el-form-item>
            <el-row>
              <el-button :id="'addStore-submit'" type="primary" v-prevent="1000" size="medium" @click="submit()">提 交</el-button>
              <el-button :id="'addStore-cancel'" size="medium" @click="cancel">取消</el-button>
            </el-row>
          </el-form-item>
        </el-form>
        <!-- <el-row class="vlt-edit-btn" style="text-align: left">
          <el-button :id="'addStore-submit'" type="primary" v-prevent="1000" size="medium" @click="submit()">提 交</el-button>
          <el-button :id="'addStore-cancel'" size="medium" @click="cancel">取消</el-button>
        </el-row> -->
      </div>
      <el-dialog
        width="600px"
        title="选择仓库管理员"
        :visible.sync="isCheckUser"
        append-to-body>
        <choose-user @change="changeUserData" @close="isCheckUser=false"></choose-user>
      </el-dialog>
    </div>
  </panel>
</div>
</template>

<script type="text/javascript">
import ChooseUser from './components/user'
import { async } from 'q'
import { gzip } from 'zlib';
export default {
name: "",
data() {
return {
  userData: [],     //仓库管理员数据
  isCheckUser: false,
  // insOptions:[],  //所属机构数据
  // insData: {   //机构级联选择
  //   label:'text',
  //   value:'id',
  //   children:'children',
  //   checkStrictly: true
  // },
  // departmentOptions: [],    // 部门数据
  // departmentData: {  // 部门级联选择
  //   label:'text',
  //   value:'id',
  //   children:'children',
  //   checkStrictly: true
  // },
  // adminList: [],    //仓库管理员数据
  ruleForm: {
    warName:'',    //仓库名称
    insId:'',       // 机构id
    // departmentId:'',      //部门id
    warType: '',          // 仓库类型
    adminId: '',          // 管理员id
    remark:'' 
  },
  rules: {
    warName: [{required: true,validator: this.$rules.checkName, title: '仓库名称',trigger: ['change','blur']}],
    insId: [{required: true, message: '请选择所属机构',trigger: ['change','blur']}],
    // departmentId: [{required: true, message: '请选择所属部门',trigger: ['change','blur']}],
    warType: [{required: true, message: '请选择仓库类型',trigger: ['change','blur']}],
    adminId: [{required: true, message: '请选择仓库管理员',trigger: ['change','blur']}],
    // remark: [{required: true, message: '请输入备注',trigger: ['change','blur']}],
  },
  // departmentArray: [],  // 所选部门下的管理员
}
},
components: {
  ChooseUser,
},
created(){
  // this.getInsData()
},
watch: {
  "ruleForm.insId": {
    handler(val) {
      this.changeForm(val)
    },
    deep: true,
  }
},
methods: {
  changeUserData(val) { // 选择管理员
    this.userData = val;
    this.ruleForm.adminId = val[0].userId;
    this.ruleForm.insId = val[0].checkInsId;
    this.ruleForm.warType = val[0].warType;
    console.log(this.userData)
  },
  //  机构
  changeForm(val){
    // const self = this;
    // let insId = val[val.length - 1]
    // // self.ruleForm.insId = insId
    // if (insId){
    //   self.getAdminList(insId)
    //   let insArray = self.$formMethods.getInsArray(insId, "id", self.insOptions, "type");
    //   self.$set(self.ruleForm, "warType", insArray[0] + 1);
    // }
  },
  //  部门
  changeForm1(val){
    // console.log(val)
    // const self = this;
    // let departmentId = val[val.length - 1]
    // console.log(departmentId)
    // self.ruleForm.departmentId = departmentId
    // if (departmentId){
    //   const data = JSON.parse(JSON.stringify(self.departmentOptions))
    //   console.log(data)
    //   self.getInsArray(departmentId, 'id', data, "list");
    //   let array = []
    //   self.departmentArray.forEach(item => {
    //     let obj = {}
    //     obj.label = item.userName;
    //     obj.value = item.userId;
    //     array.push(obj)
    //   });
    //   console.log(self.departmentArray)
    //   self.adminList = array 
    // }
  },
  // // 获取所属机构列表数据
  // getInsData(){
  //   const self = this
  //   const data = {};
  //   (async data =>{
  //     let res = await self.$api.getInsDataList({ data });
  //     console.log("机构数据",res)
  //     if (res && res.code == 0){
  //       let newData = res.data
  //       let insList = []
  //       self.filter(newData, 2)
  //       self.insOptions = this.filterData
  //     }
  //   })(data)
  // },
  // filter(data, type) {
  //   const self = this;
  //   data&&data.forEach((item)=>{
  //     if(item.type == type) {
  //       item.children = null;
  //     }else{
  //       self.filter(item.children, type)
  //     }
  //   })
  //   this.filterData = data;
  //   console.log(data)
  // },
  submit(){
    const self = this
    self.$refs.ruleForm.validate(val=>{
      if(val) {
        let data = JSON.parse(JSON.stringify(self.ruleForm));
        // delete data.departmentId;
        // data.insId = self.ruleForm.insId.pop()
        console.log(data)
        self.createWare(data);
      }
    })
  },
  cancel(){this.$router.push({name: "storeManage"})},
  //  创建仓库
  createWare(data) {
      (async data => {
        let res = await this.$api.createWare({ 
          message: '新增成功',
          data 
        });
        if (res && res.code == 0) {
          this.$router.push({ path: "storeManage" });
        }
      })(data);
    },
  // 获取仓库管理员数据
    getAdminList(data) {
      // const self = this;
      // (async data => {
      //   let res = await self.$api.getAdminList({ data });
      //   console.log('部门与管理员',res)
      //   self.departmentOptions = res.data;
      // })(data);
    },
  //数据级联
    getInsArray(id, key, data, keyBack) {
      // 传入id和key是一样胡  keyBack返回key
      // const self = this;
      // for (var i in data) {
      //   if (data[i][key] == id) {
      //     // return [data[i][key]]; //用于传id 返回id数组
      //     self.departmentArray = data[i][keyBack]
      //     return false; //用于传id 返回code数组
      //   }
      //   if (data[i].children) {
      //     self.getInsArray(id, key, data[i].children, keyBack);
      //   }
      // }
    }
},
}
</script>

<style lang="less" scoped>
</style>