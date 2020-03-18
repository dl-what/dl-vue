<template>
  <div class="vlt-card" style="padding-top:10px;">
    <el-row :gutter="40">
      <el-col :span="8">
        <el-card class="box-card card-btnss" :body-style="{'text-algin':'center',height:'150px',}">
          <el-button
            type="text"
            size="medium"
            @click="handlerAdd"
            class="card-btns"
            :id="$route.name+'-create'+'-gation'"
          >+ 自定义权益</el-button>
        </el-card>
      </el-col>
      <el-col
        :span="8"
        v-for="(item,index) in equitiesList"
        :key="index"
        class="card-col"
        :id="$route.name+'-crete'+index"
      >
        <div @click="handlerChange(item,index)">
          <el-card class="box-card" :body-style="{height:'150px',padding:'0'}" shadow="hover">
            <el-container>
              <el-header class="el-header-card" style="height: 100px;">
                <!-- <el-checkbox v-model="item.check" class="chack-box" disabled></el-checkbox> -->
                <div class="check_img">
                  <!-- <img :src="item.icon" alt srcset /> -->
                  <div class="iconfont" :class="[item.icon]"></div>
                  <h3>{{item.rightsName}}</h3>
                </div>
                <div class="serviceMode">
                  <span>{{ typeChange(item.serviceMode)}}</span>
                </div>
              </el-header>
              <div class="footer">
                <span>{{item.briefIntr}}</span>
              </div>
            </el-container>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="850px"
      custom-class="intersest-dialog"
      :close-on-click-modal="false"
      :before-close="closedDialog"
    >
      <addInterest v-model="intersData" ref="intersest"></addInterest>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="addInterestCencle" :id="$route.name+'-form'+'-cencel'">取 消</el-button>
        <el-button type="primary" size="medium" @click="dialogVisibleSubmit" :id="$route.name+'-form'+'enter'">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import { mapState, mapActions, mapMutations } from "vuex";
import addInterest from "./interestsForm";
export default {
  name: "navigationShow",
  data() {
    return {
      dialogVisible: false,
      intersData: {
        intersDataForm: {
          rightsName: null,
          briefIntr: null,
          giveGrowth: 0,
          giveIntegral: 0,
          icon: null,
          serviceMode: 0,
          trialIntegral: null,
          type: 0
        },
        trialThresholds: 0,
        trialGameValuesList: [],
        dialogVisible: false,
        disabled: false,
        typeId: -1,
        url: null
      },
      equitiesList: [
        {
          rightsName: "游戏试玩权益",
          icon: "icon-shiwan",
          briefIntr: "获得游戏试玩特权",
          serviceMode: 0,
          rightsStatus: 0,
          check: false,
          type: 1
        },
        {
          rightsName: "积分奖励权益",
          icon: "icon-jiangli",
          briefIntr: "获得积分奖励特权",
          serviceMode: 0,
          rightsStatus: 0,
          check: false,
          type: 2
        },

        {
          rightsName: "积分兑换权益",
          icon: "icon-duihuan",
          briefIntr: "获得积分兑换特权",
          serviceMode: 0,
          rightsStatus: 0,
          check: false,
          type: 3
        }
      ],
      title: '新增自定义权益',
    };
  },
  created() {
    this.levelGreadList();
  },
  components: {
    addInterest
  },
  computed: {},
  methods: {
    closedDialog(done) {
      done();
      this.$refs.intersest.fileList = [];
    },
    handlerAdd() {
      for (let key in this.intersData.intersDataForm) {
        if (key === "rightsName" || key === "briefIntr" || key === "icon") {
          this.intersData.intersDataForm[key] = null;
        }
      }
      this.title = '新增自定义权益';
      this.intersData.typeId = 0;
      this.intersData.intersDataForm.serviceMode = 1;
      this.dialogVisible = true;
    },
    validate(name) {
      let res = false;
      this.$refs[name].$refs.form.validate(valid => {
        res = valid;
      });
      return res;
    },
    typeChange(val) {
      let option = {
        0: "系统核销",
        1: "线下核销"
      };
      return option[val];
    },
    levelGreadList() {
      (async () => {
        let res = await this.$api.memberLevelProgramLevelTree();
        if (res && res.code === 0) {
          res.data.forEach((item, index) => {
            item.trialValue = null;
            this.$set(this.intersData.trialGameValuesList, index, item);
          });
        }
      })();
    },
    addInterestCencle() {
      this.$refs.intersest.fileList = [];
      this.dialogVisible = false;
    },
    handlerChange(item, val) {
      let obj = this.intersData.intersDataForm;
      for (let key in obj) {
        obj[key] = item[key];
      }
      this.title = `编辑${item.rightsName}`;
      this.intersData.typeId = Number(val) + 1;
      this.dialogVisible = true;
    },
    cancel() {
      this.intersData.trialGameValuesList;
    },
    dialogVisibleSubmit() {
      let flag = this.validate("intersest");
      if (flag) {
        let trialGameValuesList = [];
        if (this.intersData.trialGameValuesList.length > 0) {
          trialGameValuesList = this.intersData.trialGameValuesList.map(
            item => {
              return {
                levelId: item.levelId,
                trialValue: item.trialValue * 100
              };
            }
          );
        }
        let data;
        if (this.intersData.typeId == 1) {
          data = {
            ...this.intersData.intersDataForm,
            trialGameValuesList,
            trialThresholds: this.intersData.trialThresholds,
            rightsType: 1
          };

          let check2 = false;
          if (this.intersData.trialThresholds == 1) {
            if (!this.intersData.intersDataForm.trialIntegral) {
              this.$message.warning("试玩积分不能为空");
              return;
            }
          }
          let check = false;
          trialGameValuesList.forEach(item => {
            if (!item.trialValue) {
              check = true;
            } else {
              data.trialIntegral = Number(data.trialIntegral);
            }
          });
          if (check) {
            this.$message.warning("试玩游戏点数不能为空");
            return;
          }
        } else {
          data = {
            ...this.intersData.intersDataForm,
            trialThresholds: this.intersData.trialThresholds,
            rightsType: this.intersData.typeId
          };
        }

        (async data => {
          let res = await this.$api.memberRightsCreate({
            message: "权益添加成功",
            data
          });
          if (res && res.code === 0) {
            this.dialogVisible = false;
            this.intersData.typeId = 0;
            this.$refs.intersest.fileList = [];
            this.$router.push({ path: "MemberEquityManagement" });
          }
        })(data);
      } else {
        this.$message.error("表单验证有误，请重新输入！");
        return false;
      }
    }
  },
  watch: {}
};
</script>

<style lang="less" scoped>
.el-dialog {
  border-radius: 10px;
}
.card-btns {
  width: 100%;
  height: 100%;
  font-size: 20px !important;
}
.card-col {
  margin-bottom: 20px;
}
.card-btnss {
  text-align: center;
  line-height: 110px;
  font-size: 16px;
  border: 1px dashed #ccc;
}
.check_img {
  display: flex;
  flex-basis: 200px;
  align-items: center;
  img {
    margin-right: 20px;
    height: 40px;
    width: 40px;
    border-radius: 50%;
  }
}
.serviceMode {
  color: #ccc;
}
.footer {
  background: #eee;
  height: 50px;
  text-align: center;
  line-height: 50px;
}
.el-header-card {
  padding: 0 10px;
  display:flex;
  justify-content: space-around;
  align-items: center;
  cursor: pointer;
}

.vlt-edit-btn {
  text-align: center;
  padding: 20px;
}
.iconfont{
  display: inline-block;
  width: 48px;
  height: 48px;
  margin-right: 15px;
  line-height: 48px;
  text-align: center;
  border-radius: 50%;
  color: #fff;
  font-size: 30px;
}
.icon-jiangli{
  background-color: #FEA63D;
}
.icon-shiwan{
  background-color: #44C2AE;
}
.icon-duihuan{
  background-color: #F3635A;
}
</style>
