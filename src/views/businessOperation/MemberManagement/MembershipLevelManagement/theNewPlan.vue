<template>
  <div class="vlt-card">
    <el-steps :active="active" align-center class="step-wrap">
      <el-step title="基础信息"></el-step>
      <el-step title="成长值设置"></el-step>
      <el-step title="会员等级"></el-step>
    </el-steps>
    <div class="vlt-edit-single" v-show="active==0">
      <baseFrom @next="next" :baseFromData="baseFromData" :idstatus="id" ref="frombase"></baseFrom>
    </div>
    <div v-show="active==1">
      <growthValue @next="next" @prev="prev" :growthValueData="growthValueData" :idstatus="id"></growthValue>
    </div>
    <div v-show="active == 2">
      <newLevel @submit="submit" @prev="prev" :newLevelData="newLevelData" :idstatus="id"></newLevel>
    </div>
  </div>
</template>

<script type="text/javascript">
import baseFrom from "./MembershipSchemeForm";
import growthValue from "./MemberGrowthValue";
import newLevel from "./aNewLevel";
export default {
  name: "theNewPlan",
  data() {
    return {
      active: 0,
      param: {},
      baseFromData: {},
      growthValueData: {},
      newLevelData: {},
      id: null,
      prId: ""
    };
  },
  created() {
    this.id = this.$route.query.idstatus;
    let programId = this.$route.query.programId;
    this.prId = programId;
    (async programId => {
      let res = await this.$api.memberLevelProgramDetails({ data: programId });
      if (res && res.code === 0) {
        this.baseFromData = res.data;
        this.growthValueData = res.data;
        this.newLevelData = res.data;
      }
    })(programId);
  },
  components: {
    baseFrom,
    growthValue,
    newLevel
  },
  methods: {
    prev() {
      if (this.active-- < 1) this.active = 0;
    },
    next(val) {
      this.param = Object.assign(this.param, val);
      if (this.active++ > 3) this.active = 0;
    },
    submit(val) {
      if (this.id != 1) {
        let data = { ...this.param, ...val };
        data.memberLevelProgramVo.programId = this.prId;
        (async () => {
          let res = await this.$api.memberLevelProgramUpdate({ data });
          if (res && res.code == 0) {
            this.$message({
              showClose: true,
              duration: 10000,
              message:
                "会员等级若有改动，请前往会员权益页面查看，若已有游戏试玩权益，请注销后重新设置游戏试玩权益！",
              type: "warning"
            });

            this.$router.push({ name: "MemberGradeManagement" });
          }
        })();
      } else {
        this.$router.push({ name: "MemberGradeManagement" });
      }
    }
  },
  watch: {}
};
</script>

<style lang="less" scoped>
.step-wrap {
  padding: 30px 0 40px;
}
.vlt-edit-single {
  display: flex;
  justify-content: center;
}
</style>
