<template>
  <div class="vlt-card">
    <el-tabs v-model="active" @tab-click="tabClick">
      <el-tab-pane label="工作流" name="1">
        <panel title="基本信息" :show="true" style="margin-bottom:15px">
          <div class="vlt-edit-single">
            <div class="vlt-edit-wrap">
              <el-form
                label-position="right"
                label-width="140px"
                :model="form"
                :disabled="type!='0'"
                class="baseInfo"
              >
                <!-- <base-form :formData="baseData" ref="baseForm" :rules="rules" direction="right" @change="changeForm"></base-form> -->
                <el-form-item label="所属机构" prop="insId">
                  <el-cascader
                    v-model="form.insId"
                    :options="insData"
                    :props="setProps"
                    placeholder="请选择所属机构"
                    clearable
                  ></el-cascader>
                </el-form-item>
                <el-form-item label="告警源" prop="source">
                  <el-input
                    v-model="form.source"
                    placeholder="请输入告警源"
                    maxlength="4"
                    show-word-limit
                  ></el-input>
                </el-form-item>
                <el-form-item label="告警描述" prop="describe">
                  <el-input v-model="form.describe" maxlength="4" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="告警等级" prop="alarmLevel">
                  <el-input v-model="form.alarmLevel" maxlength="4" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="告警次数" prop="alarmCount">
                  <el-input v-model="form.alarmCount" maxlength="4" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="最新告警时间" prop="lastAlarmTime">
                  <el-input v-model="form.lastAlarmTime" maxlength="4" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="告警历时" prop="alarmDuration">
                  <el-input v-model="form.alarmDuration" maxlength="4" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="创建时间" prop="createTime">
                  <el-input v-model="form.createTime" maxlength="4" show-word-limit></el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </panel>
      </el-tab-pane>
      <el-tab-pane label="工作流流程图" name="2" v-if="isValid">
        <img :src="diagramImg" alt>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ajax from "@/utils/ajax.js";
export default {
  data() {
    return {
      active: "1",
      diagramImg: "",
      insTreeList: null,
      isValid: null,
      isValid: false,
      setProps: {
        label: "text",
        value: "id",
        children: "children",
        // multiple: true, // 多选
        checkStrictly: true //设置父子节点取消选中关联，从而达到选择任意一级选项的目的}
      },
      type: this.$route.query.type,
      actBusinessInsId: null,
      form: {
        source: null
      }
    };
  },
  created() {
    if (this.$route.query.id) {
      // 获取表单数据详情
      let data = this.$route.query.id;
      this.getTaskData(data);
    } else {
      let data = {};
    }
    // 初始化请求用户id
    this.actBusinessInsId = this.$storage.get("userInfo").insId;
    this.validProcess();
  },
  methods: {
    tabClick() {},
    // 表单数据详情
    getTaskData(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getTaskData({ data });
        if (res && res.code == 0) {
          console.log("res", res.data);
          let data = JSON.parse(res.data.data);
          self.init(data);
        }
      })(data);
    },
    // 回填初始化
    init(data) {
      console.log("回填的参数", data);
      if(data.alarmLevel==3){
          data.alarmLevel='Ⅲ级'
      }else if(data.alarmLevel==2){
          data.alarmLevel='Ⅱ级'
      }else{
          data.alarmLevel='Ⅰ级'
      }
      const self = this;
      self.form = Object.assign(self.form, data);
      if (self.insData) {
        if (self.form.insId) {
          let ins = this.$formMethods.getInsArray(
            self.form.insId,
            "id",
            self.insData,
            "id"
          );
          console.log(ins);
          // self.form.channelData.insId = ins.reverse();
          self.form.insId = ins[0];
        }
      }
    },
    // 是否审批流程校验
    validProcess() {
      const self = this;
      let router = this.$route.name;
      let data = {
        router,
        actBusinessInsId: this.actBusinessInsId
      };
      (async data => {
        let res = await self.$api.validProcess({ data });
        if (res && res.code == 0) {
          self.isValid = res.data.valid;
          self.diagramImg = `${ajax.baseURL}/act/business/diagram/${
            self.$route.name
          }/${this.actBusinessInsId}`;
        }
      })(data);
    }
  },
  computed: {
    ...mapGetters(["insData"]),
    insDataChildren() {
      if (this.insData && this.insData[0] && this.insData[0].parentId == 0) {
        return this.insData[0].children;
      }
      console.log(this.insData);
      return this.insData;
    }
  },
  watch: {
    form: {
      handler(newValue, oldValue) {
        console.log(newValue, oldValue);
      }
    }
  }
};
</script>

<style>
</style>
