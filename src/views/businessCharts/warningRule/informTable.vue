<template>
  <div>
    <el-table
      :data="dataInform.informData"
      border
      :header-cell-style="{background:'rgba(240,240,240,.5)'}"
      :cell-style="{align:'center'}"
      style="width:820px;margin-left:80px"
      fit
    >
      <el-table-column align="center" prop="warningLevel" label="告警等级" min-width="40px"></el-table-column>
      <el-table-column align="center" prop="type" label="通知方式" min-width="140px">
        <template slot-scope="scope">
          <div v-if="scope.row.warningLevel==='Ⅲ级'">
            <el-checkbox-group
              v-model="dataInform.checkListOrdinary"
              @change="changesOrdinary"
              class="checkInfors"
            >
              <el-checkbox label="邮件" border size="mini"></el-checkbox>
              <el-checkbox label="短信" border size="mini"></el-checkbox>
              <el-checkbox label="工作流" border size="mini"></el-checkbox>
            </el-checkbox-group>
          </div>
          <div v-if="scope.row.warningLevel==='Ⅱ级'">
            <el-checkbox-group
              v-model="dataInform.checkListSeriours"
              @change="changesSerious"
              class="checkInfors"
            >
              <el-checkbox label="邮件" border size="mini"></el-checkbox>
              <el-checkbox label="短信" border size="mini"></el-checkbox>
              <el-checkbox label="工作流" border size="mini"></el-checkbox>
            </el-checkbox-group>
          </div>
          <div v-if="scope.row.warningLevel==='Ⅰ级'">
            <el-checkbox-group
              v-model="dataInform.checkListMajor"
              @change="changesMajor"
              class="checkInfors"
            >
              <el-checkbox label="邮件" border size="mini"></el-checkbox>
              <el-checkbox label="短信" border size="mini"></el-checkbox>
              <el-checkbox label="工作流" border size="mini"></el-checkbox>
            </el-checkbox-group>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="type" label="通知对象(部门/通知人员)" min-width="200px">
        <template slot-scope="scope">
          <div v-if="scope.row.warningLevel==='Ⅲ级'" class="checkInfor">
            <el-cascader
              size="small"
              v-model="dataInform.people1"
              :options="optionsInformPeople"
              @change="selectChange1"
              :props="props"
              :disabled="disable1"
              :show-all-levels="false"
              clearable
            ></el-cascader>
            <el-cascader
              size="small"
              v-model="dataInform.people4"
              :options="optionsInformPeople"
              @change="selectChange4"
              :props="props"
              :disabled="disable1"
              :show-all-levels="false"
              clearable
            ></el-cascader>
            <el-cascader
              size="mini"
              v-model="dataInform.people7"
              :options="optionsInformPeople"
              @change="selectChange7"
              :props="props"
              :disabled="disable1"
              :show-all-levels="false"
              clearable
            ></el-cascader>
          </div>
          <div v-if="scope.row.warningLevel==='Ⅱ级'" class="checkInfor">
            <el-cascader
              size="small"
              v-model="dataInform.people2"
              :options="optionsInformPeople"
              @change="selectChange2"
              :props="props"
              :disabled="disable2"
              :show-all-levels="false"
              clearable
            ></el-cascader>
            <el-cascader
              size="small"
              v-model="dataInform.people5"
              :options="optionsInformPeople"
              :props="props"
              @change="selectChange5"
              :disabled="disable2"
              :show-all-levels="false"
              clearable
            ></el-cascader>
            <el-cascader
              size="small"
              v-model="dataInform.people8"
              :options="optionsInformPeople"
              :props="props"
              :disabled="disable2"
              :show-all-levels="false"
              clearable
              @change="selectChange8"
            ></el-cascader>
          </div>
          <div v-if="scope.row.warningLevel==='Ⅰ级'" class="checkInfor">
            <el-cascader
              size="small"
              v-model="dataInform.people3"
              :options="optionsInformPeople"
              @change="selectChange3"
              :props="props"
              :disabled="disable3"
              :show-all-levels="false"
              clearable
            ></el-cascader>
            <el-cascader
              size="small"
              v-model="dataInform.people6"
              :options="optionsInformPeople"
              :props="props"
              :disabled="disable3"
              :show-all-levels="false"
              clearable
              @change="selectChange6"
            ></el-cascader>
            <el-cascader
              size="small"
              v-model="dataInform.people9"
              :options="optionsInformPeople"
              :props="props"
              :disabled="disable3"
              :show-all-levels="false"
              @change="selectChange9"
              clearable
              popper-class="informTable"
            ></el-cascader>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <p class="informtip">
      <span class="xing">默认一天通知一次</span>
    </p>
  </div>
</template>

<script>
import informs from "@/utils/inform.js";
import storage from "@/utils/storage.js";
export default {
  name: "informTable",
  props: ["informInfo", "area", "informObjs",'insId'],
  data() {
    return {
      props: {
        value: "id",
        label: "text"
      },
      disable1: true,
      disable2: true,
      disable3: true,
      index1: 1,
      index2: 1,
      index3: 1,
      showOdPeople1: false,
      showOdPeople2: false,
      showOdPeople3: false,
      showOdPeople4: false,
      showOdPeople5: false,
      showOdPeople6: false,
      informObj: [],
      dataInform: {
        checkListOrdinary: [],
        checkListSeriours: [],
        checkListMajor: [],
        informData: [
          {
            warningLevel: "Ⅲ级"
          },
          {
            warningLevel: "Ⅱ级"
          },
          {
            warningLevel: "Ⅰ级"
          }
        ],
        people1: [],
        people2: [],
        people3: [],
        people4: [],
        people5: [],
        people6: [],
        people7: [],
        people8: [],
        people9: [],
        informWayMajor: "", //Ⅰ级通知方式 1工作流 2邮件 3短信 4站|邮 5站|端 6邮|短 7全部
        informWaySerious: "", //Ⅱ级通知方式 同上
        informWayOrdinary: "" //Ⅲ级通知方式
      },
      optionsInformPeople: [],
      form: {
        informTotalCountMajor: "", //Ⅰ级告警频次
        informTotalCountOrdinary: "", //Ⅲ级告警频次
        informTotalCountSerious: "", //Ⅱ级告警频次
        informCentralManIdMajor: "", //Ⅰ级通知中央管理员id
        informCentralManIdOrdinary: "", //Ⅲ级通知中央管理员id
        informCentralManIdSerious: "" //Ⅱ级通知中央管理员id
      }
    };
  },
  methods: {
    showpeople3() {
      if (this.index1 < 3) {
        this.index1++;
        console.log(this.index1);
      }
    },
    selectChange4(value) {
      if (value.length == 0) return;
      if (value.length == 1) {
        this.$message.error("请选择有用户的部门");
        this.dataInform.people4 = [];
      } else {
        if (
          this.array(value, this.dataInform.people1) ||
          this.array(value, this.dataInform.people7)
        ) {
          this.$message.error("请选择其他用户");
          this.dataInform.people4 = [];
        }
      }
    },
    selectChange1(value) {
      if (value.length == 0) return;
      if (value.length == 1) {
        this.$message.error("请选择有用户的部门");
        this.dataInform.people1 = [];
      } else {
        if (
          this.array(value, this.dataInform.people4) ||
          this.array(value, this.dataInform.people7)
        ) {
          this.$message.error("请选择其他用户");
          this.dataInform.people1 = [];
        }
      }
    },
    selectChange7(value) {
      if (value.length == 0) return;
      if (value.length == 1) {
        this.$message.error("请选择有用户的部门");
        this.dataInform.people7 = [];
      } else {
        if (
          this.array(value, this.dataInform.people4) ||
          this.array(value, this.dataInform.people1)
        ) {
          this.$message.error("请选择其他用户");
          this.dataInform.people7 = [];
        }
      }
    },
    selectChange2(value) {
      if (value.length == 0) return;
      if (value.length == 1) {
        this.$message.error("请选择有用户的部门");
        this.dataInform.people2 = [];
      } else {
        if (
          this.array(value, this.dataInform.people5) ||
          this.array(value, this.dataInform.people8)
        ) {
          this.$message.error("请选择其他用户");
          this.dataInform.people2 = [];
        }
      }
    },
    selectChange5(value) {
      if (value.length == 0) return;
      if (value.length == 1) {
        this.$message.error("请选择有用户的部门");
        this.dataInform.people5 = [];
      } else {
        if (
          this.array(value, this.dataInform.people2) ||
          this.array(value, this.dataInform.people8)
        ) {
          this.$message.error("请选择其他用户");
          this.dataInform.people5 = [];
        }
      }
    },
    selectChange8(value) {
      if (value.length == 0) return;
      if (value.length == 1) {
        this.$message.error("请选择有用户的部门");
        this.dataInform.people8 = [];
      } else {
        if (
          this.array(value, this.dataInform.people5) ||
          this.array(value, this.dataInform.people2)
        ) {
          this.$message.error("请选择其他用户");
          this.dataInform.people8 = [];
        }
      }
    },
    selectChange3(value) {
      if (value.length == 0) return;
      if (value.length == 1) {
        this.$message.error("请选择有用户的部门");
        this.dataInform.people3 = [];
      } else {
        if (
          this.array(value, this.dataInform.people6) ||
          this.array(value, this.dataInform.people9)
        ) {
          this.$message.error("请选择其他用户");
          this.dataInform.people3 = [];
        }
      }
    },
    selectChange6(value) {
      if (value.length == 0) return;
      if (value.length == 1) {
        this.$message.error("请选择有用户的部门");
        this.dataInform.people6 = [];
      } else {
        if (
          this.array(value, this.dataInform.people3) ||
          this.array(value, this.dataInform.people9)
        ) {
          this.$message.error("请选择其他用户");
          this.dataInform.people6 = [];
        }
      }
    },
    selectChange9(value) {
      if (value.length == 0) return;
      if (value.length == 1) {
        this.$message.error("请选择有用户的部门");
        this.dataInform.people9 = [];
      } else {
        if (
          this.array(value, this.dataInform.people3) ||
          this.array(value, this.dataInform.people6)
        ) {
          this.$message.error("请选择其他用户");
          this.dataInform.people9 = [];
        }
      }
    },
    //判断两个数组是否含有相同的元素
    array(listA, listB) {
      const result =
        listA.length === listB.length &&
        listA.every(a => listB.some(b => a === b)) &&
        listB.every(_b => listA.some(_a => _a === _b));
      return result;
    },
    //获取部门用户
    async findDeptUserTree(insId) {
      this.optionsInformPeople=[]
      // let InsId = this.$storage.get("userInfo").insId;
      let res = await this.$api.findDeptUserTree({
        data: {
          insId: insId?insId:1,
          isShowChild: 0
        }
      });
      let list = [];
      if (res && res.code == 0) {
        if(res.data && res.data.length>0){
            res.data.forEach((v, index) => {
          if (v.children && v.children.length > 0) {
            list.push(v);
          }
        });

        list.forEach(v => {
          v.children.forEach(v => {
            v.id = v.userId;
            v.text = v.userName;
          });
        });
        this.optionsInformPeople = list;
        }
      
      }
    },
    //初始化加载通知配置数据
    init(data) {
      console.log(data);
      this.findDeptUserTree(data.insId)
      this.dataInform.checkProOrdinary = true;
      this.dataInform.checkCenterOrdinary = true;
      this.dataInform.checkCenterSerious = true;
      this.dataInform.optionsNotifyProObjOfOrdinary = false; //Ⅲ级省级通知对象
      this.dataInform.optionsNotifyCenterObjOfOrdinary = false; //Ⅲ级中央通知对象
      this.dataInform.optionsNotifyCenterObjOfSerious = false; //Ⅱ级中央通知对象
      Object.assign(this.dataInform, data);
      console.log(this.dataInform, data);
      //判断是通知人员否为空
      if (data.informManIdOrdinary) {
        this.dataInform.people1 = [
          data.informManDepIdOrdinary,
          data.informManIdOrdinary
        ];
      }
      if (data.informManSeDepIdOrdinary && data.informManSeIdOrdinary) {
        this.dataInform.people4 = [
          data.informManSeDepIdOrdinary,
          data.informManSeIdOrdinary
        ];
      }
      if (data.informManThDepIdOrdinary && data.informManThIdOrdinary) {
        this.dataInform.people7 = [
          data.informManThDepIdOrdinary,
          data.informManThIdOrdinary
        ];
      }
      if (data.informManSeDepIdSerious && data.informManSeIdSerious) {
        this.dataInform.people5 = [
          data.informManSeDepIdSerious,
          data.informManSeIdSerious
        ];
      }

      if (data.informManThDepIdSerious && data.informManThIdSerious) {
        this.dataInform.people8 = [
          data.informManThDepIdSerious,
          data.informManThIdSerious
        ];
      }

      if (data.informManSeDepIdMajor && data.informManSeIdMajor) {
        this.dataInform.people6 = [
          data.informManSeDepIdMajor,
          data.informManSeIdMajor
        ];
      }
      if (data.informManThDepIdMajor && data.informManThIdMajor) {
        this.dataInform.people9 = [
          data.informManThDepIdMajor,
          data.informManThIdMajor
        ];
      }

      if (data.informManIdSerious) {
        this.dataInform.people2 = [
          data.informManDepIdSerious,
          data.informManIdSerious
        ];
      }
      if (data.informManIdMajor) {
        this.dataInform.people3 = [
          data.informManDepIdMajor,
          data.informManIdMajor
        ];
      }
      this.dataInform.checkListMajor = informs.showInformType(
        data.informWayMajor
      );
      this.dataInform.checkListSeriours = informs.showInformType(
        data.informWaySerious
      );
      this.dataInform.checkListOrdinary = informs.showInformType(
        data.informWayOrdinary
      );
      if(this.dataInform.checkListOrdinary.length > 0){
        if(this.dataInform.checkListOrdinary.length===1&&this.dataInform.checkListOrdinary[0]=='工作流'){
          this.disable1=true
        }else{
          this.disable1=false
        }
      }
      if(this.dataInform.checkListSeriours.length > 0){
        if(this.dataInform.checkListSeriours.length===1&&this.dataInform.checkListSeriours[0]=='工作流'){
          this.disable2=true
        }else{
          this.disable2=false
        }
      }
      if(this.dataInform.checkListMajor.length > 0){
        if(this.dataInform.checkListMajor.length===1&&this.dataInform.checkListMajor[0]=='工作流'){
          this.disable3=true
        }else{
          this.disable3=false
        }
      }
    },
    //Ⅲ级通知方式
    changesOrdinary(val) {
      console.log(val);
      if (val.length > 0) {
         this.getInformIdByCheckValue(
            this.dataInform.checkListOrdinary,
            "informWayOrdinary"
          );
        if (val.length === 1 && val[0] === "工作流") {
          this.disable1 = true;
        } else {
          this.disable1 = false;         
        }
      } else {
        this.dataInform.informWayOrdinary = "";
        this.dataInform.people1 = [];
        this.dataInform.people4 = [];
        this.dataInform.people7 = [];
        this.disable1 = true;
      }
    },
    //Ⅱ级通知方式
    changesSerious(val) {
      if (val.length > 0) {
        this.getInformIdByCheckValue(
            this.dataInform.checkListSeriours,
            "informWaySerious"
          );
        if (val.length === 1 && val[0] === "工作流") {
          this.disable2 = true;
        } else {
          this.disable2 = false;
          
        }
      } else {
        this.disable2 = true;
        this.dataInform.people2 = [];
        this.dataInform.people5 = [];
        this.dataInform.people8 = [];
        this.dataInform.informWaySerious = "";
      }
    },
    //Ⅰ级通知方式
    changesMajor(val) {
      if (val.length > 0) {
         this.getInformIdByCheckValue(
            this.dataInform.checkListMajor,
            "informWayMajor"
          );
        if (val.length === 1 && val[0] === "工作流") {
          this.disable3 = true;
        } else {
          this.disable3 = false;
         
        }
      } else {
        this.disable3 = true;
        this.dataInform.people3 = [];
        this.dataInform.people6 = [];
        this.dataInform.people9 = [];
        this.dataInform.informWayMajor = "";
      }
    },
    //根据选中的值获取通知对象
    getInformIdByCheckValue(arrList, name) {
      this.dataInform[name] = informs.getInformIdByCheckValue(arrList);
    }
  },

  created() {
    this.findDeptUserTree();
  },
  watch: {
    informInfo: {
      handler(newValue, oldValue) {
        this.init(newValue);
      }
      // 深度监听 监听对象，数组的变化
      // deep: true
    },
    insId:{
      handler(newValue, oldValue){
        this.findDeptUserTree(newValue?newValue[newValue.length-1]:1)
      }
    }
  }
};
</script>

<style lang='less' scoped>
@import "./less/index.less";
.informtip {
  margin-left: 80px;
  margin-top: 10px;
}

/deep/.informTable {
  .el-cascader-menu {
    min-width: 120px !important;
  }
}
</style>
