<template>
  <div class="vlt-card">
    <el-steps :active="active" align-center class="step-wrap">
      <el-step title="基础信息" icon="el-icon-edit"></el-step>
      <el-step title="上传软件" icon="el-icon-paperclip"></el-step>
      <el-step title="创建计划" icon="el-icon-document"></el-step>
    </el-steps>
    <div class="vlt-edit-single" v-show="active==0">
      <base-info @next="next"></base-info>
    </div>
    <div v-show="active==1">
      <!-- <game-set @next="next" @prev="prev" :planData="planData"></game-set> -->
      <upload-software @next="next" @prev="prev"></upload-software>
    </div>
    <div v-show="active==2">
      <!-- <create-plan  @prev="prev"></create-plan> -->
      <div class="vlt-edit-single append">
        <div class="vlt-edit-wrap">
          <base-form
            :formData="formData"
            labelWidth="100px"
            style="margin-left:-40px"
            ref="baseForm"
            :rules="rules"
            direction="right"
            @change="changeForm"
          ></base-form>
          <el-table
            border
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column prop="id" label="软件名称"></el-table-column>
            <el-table-column prop="name" label="版本名称"></el-table-column>
            <el-table-column prop="type" label="版本号"></el-table-column>
            <el-table-column prop="pond" label="软件大小"></el-table-column>
            <el-table-column prop="time" label="软件描述"></el-table-column>
            <el-table-column prop="time" label="新版特性"></el-table-column>
            <el-table-column prop="time" label="更新字段"></el-table-column>
          </el-table>
          <el-row class="vlt-edit-btn">
            <el-button size="medium" @click="prev" class="cancel">上一步</el-button>
            <el-button type="primary" v-prevent="1000" size="medium" @click="submit">提 交</el-button>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import BaseInfo from "./upgradePlanListAddBase";
import UploadSoftware from "./upgradePlanListAddUpload";
// import CreatePlan from './upgradePlanListAddCreate'
export default {
  name: "",
  components: {
    BaseInfo,
    UploadSoftware
    // CreatePlan
  },
  data() {
    return {
      active: 0,
      rules: {},
      param: {
          beginTime: "",
          forcedType: 0,
          id: 0,
          name: "",
          remark: "",
          softType: 0,
          status: 0,
          target: "",
          targetType: 0,
          theWay: 0,
          upgradeType: 0
      },
      planData: {},
      formData: [
        {
          title: "转账时间",
          type: "datetime",
          prop: "transferTime",
          value: ""
        },
        {
          title: "升级方式",
          type: "select",
          prop: "norealBuckle",
          value: "",
          options: [
            { label: "全量升级", value: 1 },
            { label: "增量升级", value: 2 }
          ]
        }
      ]
    };
  },
  methods: {
    //  async handle(val) {            //选择升级目标
    //   if (val == 0) {
    //     this.target1 = 0;
    //     this.QueryUserAndInsTree();
    //     // let reslt = await this.$api.QueryUserAndInsTree(); // 机构
    //     // console.log("机构查询", reslt);
    //     // if (reslt && reslt.code === 0) {
    //     //   this.insData = reslt.data;
    //     // }
    //   } else if (val == 1) {
    //     this.target1 = 1;
    //     //获取渠道编号列表-下拉框
    //     this.upgradeChannel();
    //     // let resl = await this.$api.upgradeChannel(); //渠道
    //     // console.log("渠道查询", resl);
    //     // if (resl && resl.code === 0) {
    //     //   let gameData = resl.data;
    //     //   gameData.forEach(item => {
    //     //     let obj = {};
    //     //     obj.label = item.channelNo;
    //     //     obj.value = item.channelId;
    //     //     this.channelData.push(obj);
    //     //   });
    //   } else if (val == 2) {
    //     this.target1 = 2;
    //     this.upgradeEquipment();
    //     // let res = await this.$api.upgradeEquipment({ data }); //设备
    //     // console.log("设备查询", res);
    //     // if (res && res.code === 0) {
    //     //   let gameData = res.data;
    //     //   this.deviceData.length = 0;
    //     //   gameData.forEach(item => {
    //     //     let obj = {};
    //     //     obj.label = item.serial;
    //     //     obj.value = item.serial;
    //     //     this.deviceData.push(obj);
    //     //   });
    //     // }
    //   }
    // },
    addUpgrade(data) {
      const self = this;
      (async data => {
        let res = await self.$api.addUpgrade({ data });
        if (res && res.code == 0) {
          self.$message.success("提交成功");
          self.$router.push({ path: "./gameChangePlanList" });
        } else {
          // self.$message.warning(res.msg)
        }
      })(data);
    },
    
    prev() {
      // this.$refs.main.scrollTop = 0;
      if (this.active-- < 1) this.active = 0;
    },
    next() {
      if (this.active++ > 2) this.active = 0;
    },

    submit() {
     
    },
  }
};
</script>

<style lang="less" scoped>
.step-wrap {
  padding: 30px 0 40px;
}
.vlt-edit-btn {
  text-align: right;
  margin: 60px 0 30px;
  .el-button {
    width: 120px;
  }
}
.vlt-edit-wrap {
  width: 100%;
  margin: 30px auto;
}
.append {
  .vlt-edit-wrap {
    width: 900px;
    margin: 0 auto;
  }
}
.appendix {
  .vlt-edit-wrap {
    width: 850px;
    margin: 0 auto;
  }
  .vlt-edit-btn {
    .cancel {
      margin: 0 30px 0 130px;
    }
  }
}
</style>
